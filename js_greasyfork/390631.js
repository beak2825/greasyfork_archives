// Enhance titles - Netflix
//
// Loads lists of movies from a local list and an IMDb account and uses
// them to highlight or hide titles on Netflix.
//
// https://greasyfork.org/scripts/390631-enhance-titles-netflix
// Copyright (C) 2019, Guido Villa
// IMDb list management is taken from IMDb 'My Movies' enhancer:
// Copyright (C) 2008-2018, Ricardo Mendonça Ferreira
// Released under the GPL license - http://www.gnu.org/copyleft/gpl.html
//
// For information/instructions on user scripts, see:
// https://greasyfork.org/help/installing-user-scripts
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name            Enhance titles - Netflix
// @description     Emphasize or hide titles on Netflix according to IMDb and local lists
// @version         1.7
// @author          guidovilla
// @date            01.11.2019
// @copyright       2019, Guido Villa (https://greasyfork.org/users/373199-guido-villa)
// @license         GPL-3.0-or-later
// @homepageURL     https://greasyfork.org/scripts/390631-enhance-titles-netflix
// @supportURL      https://gitlab.com/gv-browser/userscripts/issues
// @contributionURL https://tinyurl.com/gv-donate-7e
// @attribution     Ricardo Mendonça Ferreira (https://openuserjs.org/users/AltoRetrato)
//
// @namespace       https://greasyfork.org/users/373199-guido-villa
//
// @match           https://www.netflix.com/*
// @match           https://www.imdb.com/user/*/lists*
// @exclude         https://www.netflix.com/watch*
//
// @require         https://greasyfork.org/scripts/391648/code/userscript-utils.js
// @require         https://greasyfork.org/scripts/390248/code/entry-list.js
// @require         https://greasyfork.org/scripts/391236/code/progress-bar.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_notification
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @connect         www.imdb.com
// @downloadURL https://update.greasyfork.org/scripts/390631/Enhance%20titles%20-%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/390631/Enhance%20titles%20-%20Netflix.meta.js
// ==/UserScript==
//
// --------------------------------------------------------------------
//
// To-do (priority: [H]igh, [M]edium, [L]ow):
//   - [H] List/color configuration is hard-coded -> make configurable
//         Also, configuration should allow to skip downloading of unused lists
//   - [H] Not all IMDb movies are recognized because matching is done by title
//         (maybe use https://greasyfork.org/en/scripts/390115-imdb-utility-library-api)
//   - [M] Move IMDb list functions to an IMDb utility library
//   - [M] Download lists from GM_Config or similar, not from IMDb/Netflix list page
//   - [M] Show name in tooltip? Maybe not needed if above is solved
//   - [M] Make triangles more visible
//   - [M] Show in tooltip all lists where title is present?
//   - [M] Lots of clean-up
//   - [M] Add comments
//   - [M] Delay autopreview for hidden movies?
//   - [L] No link between IMDb user and Netflix user, implement getSourceUserFromTargetUser
//   - [L] hide selective titles?
//
// Changelog:
// ----------
// 2019.11.01 [1.7] Adopt Userscript Utils and move some functions there
//                  Modifications due to changes in Entry List library
//                  Some additional refactoring, cleanup and optimizations
// 2019.10.21 [1.6] Add download of rating and check-in list
//                  Filter out non-title IMDb lists
//                  Normalize apostrophes to increase NF<->IMDb name matching
// 2019.10.20 [1.5] Refactor using EntryList library (first version)
// 2019.09.30 [1.4] First public version, correct @namespace and other headers
// 2019.08.28 [1.3] Make the list more visible (top right triangle instead of border, with tooltip)
//                  Fix unhide method (bug added in 1.2)
//                  Add priority in todo list
// 2019.07.06 [1.2] Fix working in pages without rows (i.e. search page)
//                  Fix opacity not applied in some cases/pages
// 2019.06.20 [1.1] Load My List from My List page
// 2019.06.01 [1.0] Hide "My List" titles outside "My List" (row and page) and "Continue watching"
//                  Fix user name detection
//                  Gets data both from locally hidden movies and from IMDb lists
// 2019.03.30 [0.1] First test version, private use only
//
// --------------------------------------------------------------------

/* jshint -W008 */
/* global UU: readonly, EL: readonly, ProgressBar: readonly */

(function() {
    'use strict';

    /* BEGIN CONTEXT DEFINITION */

    var netflix = EL.newContext('Netflix');
    var imdb    = EL.newContext('IMDb');

    // other variables
    // TODO ci deve essere un modo migliore di questo
    var LIST_HIDE    = 'localHide';
    var LIST_NF_MY   = 'nfMyList';
    var LIST_NO      = 'no';
    var LIST_SEEN    = 'Visti';
    var LIST_TBD     = 'tbd';
    var LIST_WATCH   = 'Your Watchlist';
    var LIST_RATING  = 'Your ratings';
    var LIST_CHECKIN = 'Your check-ins';

    var IMDB_LIST_PAGE = 1; // any context-wide unique, non-falsy value is good
    var NF_LIST_PAGE   = 2; // any context-wide unique, non-falsy value is good


    var HIDE_BUTTON_STYLE_NAME = 'entrylist-nf-hide-button';
    var HIDE_BUTTON_STYLE = '.' + HIDE_BUTTON_STYLE_NAME + '{bottom:0;position:absolute; z-index: 10}';
    var TRIANGLE_STYLE_NAME = 'entrylist-netflix-triangle';
    var TRIANGLE_STYLE = '.' + TRIANGLE_STYLE_NAME + '{'
            + 'border-right: 20px solid;'
            + 'border-bottom: 20px solid transparent;'
            + 'height: 0;'
            + 'width: 0;'
            + 'position: absolute;'
            + 'top: 0;'
            + 'right: 0;'
            + 'z-index: 2;'
            + '}';

    // Netflix

    netflix.getUser = function() {
        var user = document.querySelector('div.account-menu-item div.account-dropdown-button > a');

        if (user) user = user.getAttribute("aria-label");
        if (user) user = user.match(/^(.+) - Account & Settings$/);
        if (user && user.length >= 2) user = user[1];

        return user;
    };


    netflix.isEntryPage = function() {
        return !document.location.href.match(/www\.imdb\.com\//);
    };


    netflix.getPageEntries = function() {
        return document.getElementsByClassName("title-card");
    };


    netflix.modifyEntry = function(entry) {
        var b           = document.createElement('a');
        b.className     = "nf-svg-button simpleround";
        b.textContent   = 'H';
        b.title         = 'Hide/show this title';
        var d           = document.createElement('div');
        d.className     = "nf-svg-button-wrapper " + HIDE_BUTTON_STYLE_NAME;
        d.appendChild(b);
        EL.addToggleEventOnClick(b, 2, LIST_HIDE, 'H');
        entry.appendChild(d);
    };


    netflix.getEntryData = function(entry) {
        var a = entry.getElementsByTagName('a');
        var idx, i;
        for (i = 0; i < a.length; i++) {
            if (a[i] && a[i].href && (idx = a[i].href.indexOf('/watch/')) != -1) break;
        }
        var id = '';
        var tmp = a[i].href;
        for (var j = idx + '/watch/'.length; j < tmp.length; j++) {
            if ('/?&'.indexOf(tmp[j]) != -1) break;
            else id += tmp[j];
        }
        if (!id) return null;

        var title = entry.getElementsByClassName("fallback-text")[0];
        if (title) title = title.innerText;
        if (!title) UU.le('Cannot find title for entry with id ' + id + ' on URL ' + document.URL, entry);
        else title = title.replace(/’/g, "'");

        return { 'id': id, 'name': (title || id) };
    };


    netflix.determineType = function(lists, _I_entryData, entry) {
        var type = null;

        if (entry.classList.contains('is-disliked')) type = 'D';
        else if (lists[EL.ln(LIST_WATCH, imdb)])     type = 'W';
        else if (lists[EL.ln(LIST_TBD,   imdb)])     type = 'T';
        else if (lists[EL.ln(LIST_SEEN,  imdb)])     type = 'S';
        else if (lists[EL.ln(LIST_NO,    imdb)])     type = 'N';

        else if (lists[EL.ln(LIST_HIDE)])            type = 'H';

        if (lists[EL.ln(LIST_NF_MY)] && (!type || type === 'W' || type === 'T') && this.pageType != NF_LIST_PAGE) {
            var row = entry.closest('div.lolomoRow');
            if (!row || ['queue', 'continueWatching'].indexOf(row.dataset.listContext) == -1) type = 'M';
        }
        return type;
    };


    var hideTypes = {
        "H": { "name": 'Hidden',    "colour": 'white' },
        "D": { "name": 'Disliked',  "colour": 'black' },
        "W": { "name": 'Watchlist', "colour": 'darkgoldenrod', "visible": true },
        "T": { "name": 'TBD',       "colour": 'Maroon',        "visible": true },
        "S": { "name": 'Watched',   "colour": 'seagreen' },
        "N": { "name": 'NO',        "colour": 'darkgrey' },
        "M": { "name": 'My list',   "colour": 'yellow' },
        "MISSING": { "name": 'Hide type not known', "colour": 'red' },
    };

    netflix.processItem = function(entry, _I_entryData, processingType) {
        if (!processingType || !hideTypes[processingType]) processingType = 'MISSING';
        var triangle = document.createElement('div');
        triangle.className = 'NHT-triangle ' + TRIANGLE_STYLE_NAME;
        triangle.style.borderRightColor = hideTypes[processingType].colour;
        triangle.title = hideTypes[processingType].name;
        entry.parentNode.appendChild(triangle);

        if (!hideTypes[processingType].visible) entry.parentNode.style.opacity = .1;
/*
        var parent = entry.parentNode;
        parent.parentNode.style.width = '5%';

        var field = parent.querySelector('fieldset#hideTitle' + entryData.id);
        if (!field) {
            field = document.createElement('fieldset');
            field.id = 'hideTitle' + entryData.id;
            field.style.border = 0;
            field.appendChild(document.createTextNode(entryData.name));
            parent.appendChild(field);
        } else {
            field.style.display = 'block';
        }
*/
    };


    netflix.unProcessItem = function(entry, _I_entryData, _I_processingType) {
        entry.parentNode.style.opacity = 1;
        var triangle = entry.parentNode.getElementsByClassName('NHT-triangle')[0];
        if (triangle) triangle.parentNode.removeChild(triangle);
/*
        entry.parentNode.parentNode.style.width = null;
        entry.parentNode.querySelector('fieldset#hideTitle' + entryData.id).style.display = 'none';
*/
    };


    netflix.getPageType = function() {
        return ( document.location.href == 'https://www.netflix.com/browse/my-list' && NF_LIST_PAGE );
    };


    // add buttons on the Netflix "My List" page
    netflix.processPage = function(_I_pageType, _I_isEntryPage) {
        // no need to check pageType: as of now there is only one
        var main = document.getElementsByClassName('mainView')[0];
        if (!main) {
            UU.le('Could not find "main <div>" to insert buttons');
            return;
        }
        var div  = document.createElement('div');
        var btnStyle = 'margin-left: 20px; margin-bottom: 20px; font-size: 13px; padding: .5em; background: 0 0; color: grey; border: soli 1px grey;';
        addBtn(div, btnNFMyListRefresh, "Load My List data",  "Reload information from 'My List'", btnStyle);
        addBtn(div, btnNFMyListClear,   "Clear My List data", "Empty the data from 'My List'",     btnStyle);
        main.appendChild(div);
    };



    // IMDb

    imdb.getUser = function() {
        var account = document.getElementById('nbusername');
        if (!account) return;
        var user = account.textContent.trim();

        var ur = account.href;
        if (ur) ur = ur.match(/\.imdb\..{2,3}\/.*\/(ur[0-9]+)/);
        if (ur && ur[1]) ur = ur[1];
        else UU.le('Cannot retrieve the ur id for user:', user);

        return { 'name': user, 'payload': ur };
    };


    imdb.getPageType = function() {
        return ( document.location.href.match(/\.imdb\..{2,3}\/user\/[^/]+\/lists/) && IMDB_LIST_PAGE );
    };


    // add buttons on the IMDb lists page
    imdb.processPage = function(_I_pageType, _I_isEntryPage) {
        // no need to check pageType: as of now there is only one
        var main = document.getElementById("main");
        var h1 = ( main && main.getElementsByTagName("h1")[0] );
        if (!h1) {
            UU.le('Could not find element to insert buttons.');
            return;
        }
        var div = document.createElement('div');
        div.className     = "aux-content-widget-2";
        div.style.cssText = "margin-top: 10px;";
        addBtn(div, btnIMDbListRefresh, "NF - Refresh highlight data", "Reload information from lists - might take a few seconds");
        addBtn(div, btnIMDbListClear,   "NF - Clear highlight data",   "Remove list data");
        h1.appendChild(div);
    };


    // lookup IMDb movies by name
    imdb.inList = function(entryData, list) {
        return !!(list[entryData.name]);
    };


    /* END CONTEXT DEFINITION */



    /* BEGIN COMMON FUNCTIONS */


    function addBtn(div, func, txt, help, style) {
        var b = document.createElement('button');
        b.className     = "btn";
        if (!style) style = "margin-right: 10px; font-size: 11px;";
        b.style.cssText = style;
        b.textContent   = txt;
        b.title         = help;
        b.addEventListener('click', func, false);
        div.appendChild(b);
        return b;
    }


    /* END COMMON FUNCTIONS */



    /* BEGIN NETFLIX FUNCTIONS */


    function btnNFMyListClear() {
        NFMyListClear();
        GM_notification({'text': "Information from 'My List' cleared.", 'title': UU.me + ' - Clear Netflix My List', 'timeout': 0});
    }

    function btnNFMyListRefresh() {
        var txt;
        if (NFMyListRefresh()) txt = "'My List' loaded.";
        else txt = "An error occurred. It was not possible to load 'My List' data.";
        GM_notification({'text': txt, 'title': UU.me + ' - Load Netflix My List', 'timeout': 0});
    }


    function NFMyListClear() {
        EL.deleteList(LIST_NF_MY);
        delete netflix.allLists[LIST_NF_MY];
    }

    function NFMyListRefresh() {
        NFMyListClear();

        var gallery = document.querySelector('div.mainView div.gallery');
        var cards   = ( gallery && gallery.getElementsByClassName('title-card') );
        if (!cards) return false;

        var list = {};
        var entry, entryData;
        for (var i = 0; i < cards.length; i++) {
            entry = cards[i];
            entryData          = netflix.getEntryData(entry);
            list[entryData.id] = entryData.name;
        }

        EL.saveList(list, LIST_NF_MY);
        return true;
    }


    /* END NETFLIX FUNCTIONS */



    /* BEGIN IMDB FUNCTIONS */


    function btnIMDbListClear() {
        IMDbListClear();
        GM_notification({'text': "Information from IMDb cleared.", 'title': UU.me + ' - Clear IMDb lists', 'timeout': 0});
    }

    function btnIMDbListRefresh() {
        GM_notification({
            'text':    'Click to start loading the IMDb lists. This may take several seconds',
            'title':   UU.me + ' - Load IMDb lists',
            'timeout': 0,
            'onclick': IMDbListRefresh,
        });
    }


    function IMDbListClear() {
        EL.deleteAllLists(imdb);
        delete imdb.allLists;
    }


    function IMDbListRefresh() {
        var pb = new ProgressBar(-1, 'Loading {#}/{$}...');
        var closeMsg = 'An error occurred. It was not possible to download the IMDb lists.';

        getIMDbLists()
            .then(function(lists) { pb.update(0, null, lists.length); return lists; })
            .then(function(lists) { return IMDbListDownload(lists, pb); } )
            .then(function(outcomes) {
                var msg = outcomes.reduce(function(msg, outcome) {
                    if (outcome.status === 'rejected') {
                        msg.txt += "\n * " + outcome.reason;
                        msg.numKO++;
                    }
                    return msg;
                }, { 'txt': '', 'numKO': 0 });

                if (msg.numKO === 0) {
                    closeMsg = 'Loading complete!';
                } else if (msg.numKO < outcomes.length) {
                    closeMsg = 'Done, but with errors:' + msg.txt;
                    UU.le('Errors in list download:', msg.txt);
                } else {
                    throw msg.txt;
                }
            })
            .catch(function(err) { UU.le(err); closeMsg = 'Error - It was not possible to download the IMDb lists: ' + err; })
            .finally(function() {
                GM_notification({
                    'text':      closeMsg,
                    'title':     UU.me + ' - Load IMDb lists',
                    'highlight': true,
                    'timeout':   5,
                    'ondone':    pb.close,
                });
            });
    }

    // Return a Promise to download and save all lists
    function IMDbListDownload(lists, pb) {
        IMDbListClear();

        var allDnd = lists.map(function(list) {
            return downloadList(list.id, list.type)
                       .then(function(listData) { EL.saveList(listData, list.name, imdb); })
                       .then(pb.advance)
                       .catch(function(error) { pb.advance(); throw "list '" + list.name + "' - " + error; });
        });
        return Promise.allSettled(allDnd);
    }


    var WATCHLIST  = "watchlist";
    var RATINGLIST = "ratings";
    var CHECKINS   = "checkins";
    var TITLES = "Titles";
    var PEOPLE = "People";
    var IMAGES = "Images";
    // Return a Promise to get all lists (name, id, type) for current user
    // filter out all non-title lists
    function getIMDbLists() {
        return findIMDbLists().then(getIMDbListFromPage)
                   .then(function(lists) {
                       return lists.filter(function(list) { return (list.type === TITLES); });
                   });
    }
    function findIMDbLists() {
        if (document.location.href.match(/\.imdb\..{2,3}\/user\/[^/]+\/lists/)) {
            return Promise.resolve(document);

        } else {
            UU.li('Not in the IMdb list page, downloading it.');
            var url = 'https://www.imdb.com/user/' + imdb.userPayload + '/lists';
            return UU.GM_xhR('GET', url, 'Get IMDb list page', { 'responseType': 'document' })
                       .then(function(response) { return response.responseXML2; });
        }
    }
    function getIMDbListFromPage(document) {
        var listElements = document.getElementsByClassName('user-list');

        var lists = Array.prototype.map.call(listElements, function(listElem) {
            var name = listElem.getElementsByClassName("list-name")[0];
            if (name) {
                name = name.text;
            } else {
                UU.le("Error reading name of list", listElem);
                name = listElem.id;
            }
            return {"name": name, "id": listElem.id, 'type': listElem.dataset.listType };
        });
        lists.push({"name": LIST_WATCH,   "id": WATCHLIST,  'type': TITLES });
        lists.push({"name": LIST_RATING,  "id": RATINGLIST, "type": TITLES });
        lists.push({"name": LIST_CHECKIN, "id": CHECKINS,   "type": TITLES });
        return lists;
    }


    // Return a promise to download a list
    function downloadList(id, type) {
        var getUrl;
        if (id == WATCHLIST || id == CHECKINS) {
            // Watchlist & check-ins are not easily available (requires another fetch to find export link)
            // http://www.imdb.com/user/ur???????/watchlist | HTML page w/ "export link" at the bottom
            var url = 'https://www.imdb.com/user/' + imdb.userPayload + '/' + id;
            getUrl = UU.GM_xhR('GET', url, "Get list page", { 'responseType': 'document' })
                .then(function(response) {
                    var lsId = response.responseXML2.querySelector('meta[property="pageId"]');
                    if (lsId) lsId = lsId.content;
                    if (!lsId) throw 'Cannot get list id';
                    return "https://www.imdb.com/list/" + lsId + "/export";
                });
        } else if (id == RATINGLIST) {
            getUrl = Promise.resolve("https://www.imdb.com/user/" + imdb.userPayload + "/" + id + "/export");
        } else {
            getUrl = Promise.resolve("https://www.imdb.com/list/" + id + "/export");
        }
        return getUrl
                   .then(function(url)      { return UU.GM_xhR('GET', url, "download"); })
                   .then(function(response) { return parseList(response, type); });
    }


    // Process a downloaded list
    function parseList(response, type) {
        if (response.responseText.startsWith("<!DOCTYPE html")) {
            throw 'received HTML instead of CSV file';
        }

        var data = UU.parseCSV(response.responseText);
        var f    = UU.getCSVheader(data);
        var list = {};

        var id_fld, name_fld;
        switch (type) {
            case TITLES:
                id_fld   = "Title";  // "Const";
                name_fld = "Title";
                break;
            default:
                throw 'downloaded list of unmanaged type ' + type + ', discarded';
        }

        var id_idx   = f[id_fld];
        var name_idx = f[name_fld];

        var id, name;
        for (var i=1; i < data.length; i++) {
            id   = data[i][id_idx];
            name = data[i][name_idx];

            if (id === "") {
                UU.le('parse ' + response.finalUrl + ": no id found at row " + i);
                continue;
            }
            if (list[id]) {
                UU.le('parse ' + response.finalUrl + ": duplicate id " + id + " found at row " + i);
                continue;
            }
            list[id] = name;
        }
        return list;
    }



    /* END IMDB FUNCTIONS */



    //-------- "main" --------
    GM_addStyle(TRIANGLE_STYLE + HIDE_BUTTON_STYLE);
    EL.init(netflix, true);
    EL.addSource(imdb);
    EL.startup();



}());
