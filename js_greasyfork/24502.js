// ==UserScript==
// @name                [TS] Pixiv Whitecube (Alpha)
// @namespace           TimidScript
// @version             0.9.9  Alpha
// @version2            0.9.9  Alpha
// @date                2016-11-11
// @description         This is Pixiv++ for Whitecube layout. It's in alpha stage. Filtering works.
// @author              TimidScript
// @homepageURL         https://github.com/TimidScript
// @copyright           © 2012+ TimidScript, Some Rights Reserved.
// @license             https://github.com/TimidScript/UserScripts/blob/master/license.txt
// @match               *://*.pixiv.net/whitecube*
// @match               *://*.pixiv.net/whitecube*
// @ma-tch               *://accounts.pixiv.net/*
// @require             https://greasyfork.org/scripts/19968/code/TSLibrary - Generic.js
// @re-quire            http://localhost/userscripts/timidscript/libraries/TSUpdater.js

// @resource FontAS     https://github.com/TimidScript/UserScripts/raw/master/resources/fonts/FontAwesome.css

// @userid              1455
// @scriptid            24502
// @githubraw

// @homeURL             https://greasyfork.org/en/scripts/4685
// @grant               GM_info
// @grant               GM_getMetadata
// @grant               GM_registerMenuCommand
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_listValues
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceURL
// @grant               GM_getResourceText
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAB/ElEQVRYR+2XMUpEMRCGvY0n8AKewAt4Ai/gARYruy2txM7CwlLcQsFiG0ELRQsREREbRYstLNaPTHwMs75NJrx9rJCfv1jzJsn3MpPkubI6GC2hK5bHFcvjiuVxxfK4YnncDdbG3njz4FJ7bffMxLhcjgXK8Pxh/Pg+bdHzx2R//ESY6ZjjEqzt45vb1684eRAE8J3evWF+fE6+44MgWrxwPiyAIIizTafA0bI+vDBhmDyCGOOCdk7uTcwc52Ixt84XcExsYma9dXitV+7o6sUEtDkLiyUxeaGqTEybSZ/um7lmaSxeUUbUo+djYdYsdgv6M+nGCSzNxHvLb+TCwroAclI5D4sFl4GEiRb5E3mxzIIlT7V5WHSWxFFb0iKDIi8W1jXQDNjmRBJlwZpNJ4OiAiydx2T3dMlzUjdFGkctwmrKFIFonhqnsbTjqEVYvF7svFRYOokgmqfG/WHpWyt5qPaExaaJPYOSJ2pPWDqDycLCfWBxSsVuQTl3/MKxzFWdLHZxIVbmJ0pzfYkye+FCLCTfxGRk9oKjogHSWw+58l6OZcSXKrWMdcpENC72oznOE16dmVgtvcWMZDm9QOJuSp6skU3tXv8hi1DOQinw/8fSpyIlRaZMQIfOxQIiEv2KHWdiOrQvib25YnlcsTyuWB5XLI8rVr4Hox+cjUxd3KUvOgAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/24502/%5BTS%5D%20Pixiv%20Whitecube%20%28Alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24502/%5BTS%5D%20Pixiv%20Whitecube%20%28Alpha%29.meta.js
// ==/UserScript==
//http://www.w3schools.com/icons/fontawesome_icons_intro.asp
//https://cdnjs.com/libraries/font-awesome

/* License + Copyright Notice
********************************************************************************************
License can be found at: https://github.com/TimidScript/UserScripts/blob/master/license.txt
Below is a copy of the license the may not be up-to-date.

Copyright © TimidScript, Some Rights Reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
following conditions are met:

1) GPL-3 License is met that does not conflict with the rest of the license (http://www.gnu.org/licenses/gpl-3.0.en.html)
2) This notice must be included
3) Due credits and link to original author's homepage (included in this notice).
4) Notify the original author of redistribution
5) Clear clarification of the License and Notice to the end user
6) Do not upload on OpenUserJS.org or any other site that infringes on this license

TimidScript's Homepages:  GitHub:      https://github.com/TimidScript
                          GreasyFork:  https://greasyfork.org/users/1455
*/
/* Information
********************************************************************************************
Known Bugs:
 - Minor Issue: Duplicate thumbnail do not have a hotbox.

TODO: Enable the sorting of bookmark recommendations
TODO: Consider using mixed fetch methods as the api is a lot faster...
      Maybe different levels of meta fetching. Level 1 - API, Level 2 HTML, Level 3 Response & Bookmark Count.
      Also stages of thumbnail update. Get all links using API, then use slower methods to get extra information.
      Also extract all information you can from thumbnails, such as response, bookmark and fullsize URL.
TODO: Add auto filter to remove private/blocked and deleted illustrations from bookmark

current version extrapolate almost everything

 Version History
------------------------------------
Pixiv Whitecube which has been enabled to selective users, has changed much of the layout and the URL structure.
It breaks everything in version 3. The interface is a hit and miss and still seems to be in development stage
and one hopes that they would include the missing features before full public release.

0.9.4 Alpha (2016-11-06)
 - Initial public release
*************************************************************************************************/

//TODO: Remove all major HTML/CSS code and place it in a resource file

(function ()
{
    if (window.self !== window.top) return;
    if (/^accounts/i.test(location.hostname)) return;
    //GM_getValue("Update Disabled", true);


    console.info("Pixiv Whitecube Alpha");
    console.warn("Pixiv Whitecube will eventually be incoporated in Pixiv++");

    var MAX_CALLS = GM_getValue("Linker MAX CALLS", 6), DELAY = GM_getValue("Linker DELAY", 300);
    var _processList = new Array(),
        _processListFails = new Array(),
        _data = {},
        _storedCount = {},
        _wholeThumbnail = GM_getValue("Whole Thumbnail", false),
        _addLinkSuffix = GM_getValue("Add Link Suffix", false),
        _addLinkSuffixRelated = true,
        _isIllustrationPage = false;

    var THUMB_TYPE = {
        main: 0,
        illustration: 1,
        related: 2,
        stripFollowing: 7,
        unlinked: 10, //Anything above 10 has no links
        stripRanking: 11,
    }

    function createMeta()
    {
        var meta = {
            id: 0,
            type: 0,

            user: {
                id: 0,
                name: "",
                account: "",
                icon: ""
            },

            data: {
                md5: "",
                title: "",
                dateCreated: "",
                dateUpdated: "",    //0 = illustration 1=paged illustrations 2=ugoira
                pageCount: 1,
                description: "",  // 0=general 1=R-18 2=R-18G
                rating: 0,
                tags: "",
                width: 0,
                height: 0,
                ugoiraScript: "",
                characters: 0
            },

            url: {
                base: "",
                extension: "",
                original: ""
            },

            ratings: { //Ratings = Number of votes     Score = Aggregation of all votes        Average rating = score / votes
                views: 0,
                bookmarks: 0,
                score: 0
            },

            extra: {
                bookmarked: false,
                commented: false,
                multiple: false,
                rated: false
            },

            dateAccessed: 0,
            dateUpdated: 0,
            expired: false,
            reaquire: false
        };

        return meta;
    }

    function getIllustrationData(id, base)
    {
        //Odd way to get intellisense to work
        var meta = _data[id] || createMeta();
        if (meta.id > 0) return meta;


        meta = createMeta();
        var tmp = GM_getValue(":Pixiv-I: " + id, false);
        if (tmp)
        {
            tmp = JSON.parse(tmp);
            copyObjectValues(meta, tmp);
        }

        meta.id = parseInt(id);

        /*
        The URL base is made of the upload update date.
        http://i1.pixiv.net/img-zip-ugoira/img/2016/11/01/17/25/20/59749268_ugoira1920x1080.zip
        /2016/11/01/17/25/20/ => Last Upload Date  2016-11-01 17:25:20  */

        //INFO: If the preview window is shown and the data stored is older than 3 days it re-downloads it.
        meta.reaquire = (Date.now() - meta.dateUpdated) / (1000 * 60 * 60 * 24) > 3;

        if (meta.url.base != base) meta.expired = true;

        _data[id] = meta;
        return meta;
    }


    //createMissingStructure & copyObjectValues are to get intellisense to work
    function createMissingStructure(obj, base)
    {
        for (var key in base)
        {
            if (!obj.hasOwnProperty(key)) obj[key] = base[key];
            else
            {
                obj[key] = obj[key] || base[key];
                if (typeof base[key] === "object") createMissingStructure(obj[key], base[key]);
            }
        }
    }

    function copyObjectValues(obj, base, tree)
    {
        var path, retVal = true;
        if (tree) tree = tree + ".";
        else tree = "";

        for (var key in obj)
        {
            if (obj.hasOwnProperty(key))
            {
                path = tree + key;

                if (!base.hasOwnProperty(key)) continue;


                //if (typeof obj[key] == "string" && /^\d+$/.test(obj[key])) obj[key] = parseInt(obj[key]);
                //if (typeof base[key] == "string" && /^\d+$/.test(base[key])) base[key] = parseInt(base[key]);

                if (typeof obj[key] !== typeof base[key] && key != "ugoiraScript")
                {
                    console.error("Major object property mismatch. This should never happen unless data is corrupt");
                    console.log(" KEY: " + path + "\n" + typeof obj[key] + "\n" + typeof base[key]);
                    console.log(obj[key], base[key]);
                    retVal = false;
                    alert("copyObjectValues() mismatch has occurred! Run for the hills! :(");
                }

                if (obj[key] != null && typeof obj[key] == "object") retVal = retVal && copyObjectValues(obj[key], base[key], path);
                else obj[key] = base[key];
            }
        }

        return retVal;
    }

    function storeIllustrationData(id)
    {
        var meta = getIllustrationData(id),
            store = createMeta();

        copyObjectValues(store, meta);

        if (meta.user.account) GM_setValue(":Pixiv-U: " + meta.user.id, meta.user.account);

        delete store.expired;
        delete store.user;
        delete store.id;
        delete store.data.dateCreated;
        delete store.data.dateUpdated;
        delete store.data.description;
        delete store.data.title;
        delete store.data.md5;
        delete store.extra;
        delete store.ratings;
        delete store.data.ugoiraScript; //We currently do not use it. If I implement the player, then implement it
        delete store.reaquire;
        delete store.data.characters;

        if (store.type != 2) delete store.data.ugoiraScript;

        store.dateAccessed = Date.now();

        store.user = {
            id: meta.user.id
        };

        GM_setValue(":Pixiv-I: " + id, JSON.stringify(store));
    }

    function createCookie(cookietext, days, domain)
    {
        if (days)
        {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        if (domain) domain = "; domain=" + domain;
        else domain = "";
        document.cookie = cookietext + expires + domain + "; path=/";
    }

    //Code is based on Pixiv Lazy Plus


    var Linker =
    {
        iid: null,
        calls: 0,
        enabled: true,

        processID: function (id)
        {
            _processList.push(id);
            if (Linker.enabled) Linker.processParser();
        },

        processParser: function ()
        {
            if (Linker.iid !== null || !Linker.enabled) return;

            Linker.iid = setInterval(getData, DELAY);

            function getData()
            {
                if (!Linker.enabled)
                {
                    clearInterval(Linker.iid);
                    Linker.iid = null;
                    return;
                }

                if (Linker.calls == MAX_CALLS) return;

                if (_processList.length == 0)
                {
                    clearInterval(Linker.iid);
                    Linker.iid = null;
                }

                Linker.calls++;
                Linker.remoteProcedureCall(_processList.shift());
            }
        },


        //whitecube rpc is too slow
        remoteProcedureCall: function (id, callback, useWhitecube)
        {
            TSL.addStyle("Marker4" + id, '[data-id="' + id + '"] .pppMarker {background-color: lime;border-color: #408040;;}');


            var meta = getIllustrationData(id);
            var url = (useWhitecube) ? "https://www.pixiv.net/rpc/whitecube/index.php?mode=work_details_modal_whitecube&id=" + id :
                                       "http://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=" + id;


            if (typeof callback === "function")
            {
                var idx = _processList.indexOf(id)
                if (idx >= 0) _processList.splice(idx, 1);
            }


            GM_xmlhttpRequest({
                url: url,
                method: "GET",
                timeout: 6000,
                headers: { "User-agent": navigator.userAgent, "Accept": "text/html", Referer: "http://www.pixiv.net" },
                onload: function (xhr)
                {
                    if (xhr.status == 200)
                    {
                        var doc = new DOMParser().parseFromString(xhr.responseText, "text/html");

                        if (useWhitecube && false) //Not in use at the moment
                        {
                            doc.body.innerHTML = JSON.parse(doc.body.textContent).body.html;
                            meta.url.original = doc.querySelector("[data-original-src]").getAttribute("data-original-src");

                            if (noDecrement !== true) Linker.calls--;
                        }
                        else
                        {
                            var obj = JSON.parse(doc.body.textContent).body[id];
                            //console.info(meta);
                            //console.log(obj);
                            if (obj.error === false)
                            {
                                meta.type = parseInt(obj.illust_type);

                                meta.data.height = parseInt(obj.illust_height);
                                meta.data.width = parseInt(obj.illust_width);
                                meta.data.pageCount = parseInt(obj.illust_page_count);
                                meta.data.title = obj.illust_title;
                                meta.data.rating = parseInt(obj.illust_x_restrict); //0=General 1=R18 2=R18G
                                meta.data.ugoiraScript = obj.ugoira_meta_fullscreen;
                                meta.data.ugoiraScript = obj.ugoira_meta;

                                meta.user.icon = obj.profile_img;
                                meta.user.id = parseInt(obj.user_id);
                                meta.user.name = obj.user_name;

                                meta.url.base = Linker.getBaseURL(obj.url["240mw"]); //Ugoira has different format so we do not use it for base
                                meta.url.extension = obj.illust_ext; //For ugoira it is either jpg or png.
                                meta.url.original = obj.url.big;
                                if (meta.type == 2) meta.url.original = obj.url.ugoira600x600.replace("ugoira600x600", "ugoira1920x1080");

                                meta.extra.bookmarked = obj.is_bookmarked;
                                meta.extra.commented = obj.is_commented;
                                meta.extra.multiple = obj.is_multiple;
                                meta.extra.rated = obj.is_rated;

                                meta.dateUpdated = Date.now();
                                meta.expired = false;
                                meta.reaquire = false;

                                /* Unused fields
                                contentType     (illust novel)
                                error
                                obj.illust_type; Not type
                                obj.illust_sanity_level
                                */
                                storeIllustrationData(id);
                                var els = document.querySelectorAll('.item-container[data-id="' + id + '"]');
                                for (var i = 0; i < els.length; i++)
                                {
                                    els[i].setAttribute("data-type", meta.type);
                                    els[i].setAttribute("data-extension", meta.url.extension);

                                    if (Main.filterM && els[i].getAttribute("thumb-type") == THUMB_TYPE.main) Main.filterThumbnail(els[i], true);
                                    else if (Main.filterR && els[i].getAttribute("thumb-type") == THUMB_TYPE.related) Main.filterThumbnail(els[i], true);
                                }

                                els = document.querySelectorAll('[data-id="' + id + '"] .pppMarker');
                                for (var i = 0; i < els.length; i++) TSL.removeNode(els[i]);

                                els = document.querySelectorAll('[LinkUs="' + id + '"]');
                                for (var i = 0, links; i < els.length; i++)
                                {
                                    links = els[i].getElementsByTagName("a");
                                    if (links.length != meta.data.pageCount) console.error("[" + id + "] Page count does not match (" + links.length + " != " + meta.data.pageCount + ")");
                                    for (var j = 0; j < links.length; j++) links[j].href = meta.url.original.replace(/_p\d+/, "_p" + j)
                                    els[i].removeAttribute("LinkUs");
                                    Linker.adjustLinksSuffix(els[i]);
                                }
                            }


                            if (!callback) Linker.calls--;
                        }
                    }
                    else
                    {
                        console.error("ONLOAD Fail");
                        downloadFailed(xhr);
                    }

                    Linker.statsCounter();
                    if (typeof callback === "function") callback(id);
                },
                ontimeout: function (xhr)
                {
                    console.error("TIMEOUT Fail");
                    downloadFailed(xhr);
                },
                onerror: function (xhr)
                {
                    console.error("ERROR Fail");
                    downloadFailed(xhr);
                }
            });

            function downloadFailed(xhr)
            {
                if (!callback) Linker.calls--;
                console.warn(xhr);
                TSL.addStyle("Marker4" + id, '[data-id="' + id + '"] .pppMarker {background-color: red;border: 1px solid white; box-shadow: 0 0 1px 1px #880B0B;}');
                _processListFails.push(id);
                console.warn("FAILED LIST: ", _processListFails);
            }
        },

        getBaseURL: function (sample)
        {
            //Get the foundation of the URL: /2016/10/23/01/10/14/59594414
            sample = sample.replace(/.+img-(master|original|zip-ugoira)\/img(\/.+\/)\d+(_p\d+)?_.+/, "$2");
            //sample = sample.replace(/.+img-(master|original|zip-ugoira)\/img(\/.+\/)\d+(-\w+)?(_p\d+)?_.+/, "$2"); //For personal work page
            return (/^\/\d+/i.test(sample) ? sample : "");
        },

        getPreviewURLS: function (id, type, base)
        {
            /* Current Sizes (Excluding the squares, it has 6 preview size)
            http://i3.pixiv.net/c/128x128/img-master/img/2016/10/23/01/10/14/59594414_p0_square1200.jpg
            http://i4.pixiv.net/c/128x128/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            http://i4.pixiv.net/c/150x150/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            http://i4.pixiv.net/c/240x480/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            http://i4.pixiv.net/c/480x960/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            http://i4.pixiv.net/c/600x600/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            http://i4.pixiv.net/c/1200x1200/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            http://i4.pixiv.net/img-original/img/2016/10/22/16/26/24/59575723_p0.jpg  //full size

            http://i1.pixiv.net/c/128x128/img-master/img/2016/10/30/10/07/28/59701500_master1200.jpg //ugoira

            Whitecube Sizes (Excluding the squares, it has 6 preview size)
            https://i.pximg.net/c/250x250_80_a2/img-master/img/2016/10/22/16/26/24/59575723_p0_square1200.jpg
            https://i.pximg.net/c/400x250_80/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            https://i.pximg.net/c/960x400_80/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            https://i.pximg.net/img-master/img/2016/10/22/16/26/24/59575723_p0_master1200.jpg
            http://i4.pixiv.net/img-original/img/2016/10/22/16/26/24/59575723_p0.jpg

            https://i.pximg.net/c/400x250_80/img-master/img/2016/10/30/10/07/28/59701500_master1200.jpg   //ugoira

            http://i1.pixiv.net/img-zip-ugoira/img/2016/11/01/17/25/20/59749268_ugoira600x600.zip
            http://i1.pixiv.net/img-zip-ugoira/img/2016/11/01/17/25/20/59749268_ugoira1920x1080.zip

            2016/10/22/16/26/24 => Latest Upload Date => 2016:10:22 16:26:24
            */

            var cu = [], wc = []; //current, whitecube

            var urls = {
                cu: [],
                wc: []
            };

            base = "/img-master/img" + base;
            var arr = ["128x128", "150x150", "240x480", "480x960", "600x600", "1200x1200"];
            for (var i = 0; i < arr.length; i++) urls.cu.push("http://i4.pixiv.net/c/" + arr[i] + base + id + (type == 2 ? "" : "_p0") + "_master1200.jpg");

            arr = ["/c/400x250_80", "/c/960x400_80", ""];
            for (var i = 0; i < arr.length; i++) urls.wc.push("https://i.pximg.net" + arr[i] + base + id + (type == 2 ? "" : "_p0") + "_master1200.jpg");

            return urls;
        },

        statsCounter: function ()
        {
            update(document.querySelector(".pppRemaining"), _processList);
            update(document.querySelector(".pppErrors"), _processListFails);

            function update(el, arr)
            {
                if (arr.length != el.textContent) el.textContent = arr.length;

                if (arr.length > 0 && el.style.display != "block") el.style.display = "block";
                else if (arr.length == 0) el.style.display = null;
            }
        },

        adjustLinksSuffix: function (el)
        {
            var tt = parseInt(el.getAttribute("parent-type")),
                els = el.querySelectorAll("a"),
                suffix, newref;

            suffix = "";
            if ((tt == THUMB_TYPE.main || tt == THUMB_TYPE.stripFollowing) && _addLinkSuffix) adjustSuffix("main");
            if ((tt == THUMB_TYPE.main || tt == THUMB_TYPE.stripFollowing) && _isIllustrationPage) adjustSuffix("background");
            if (tt == THUMB_TYPE.related && _addLinkSuffixRelated) adjustSuffix("related");
            if (el.hasAttribute("filtered")) adjustSuffix("filtered");

            for (var i = 0, link; i < els.length, link = els[i]; i++)
            {
                if (link.href.length == 0) continue;
                newref = link.href.replace(/\?.+/, "") + ((suffix.length > 0) ? suffix + "#" : "");
                if (newref != link.href) link.href = newref;
            }

            function adjustSuffix(str)
            {
                suffix += (suffix) ? "&" + str : "?" + str;
            }
        }
    };



    /*
    ===================================================================================================================================
        Handles the preview dialog window
    ===================================================================================================================================*/
    var PreviewHQ =
    {
        iidPreview: null,
        iidThumb: null,

        registerForPreviewWindow: function ()
        {
            //console.info("registerForPreviewWindow:");
            var icon = "", items = document.querySelectorAll('a[href*=".pixiv.net/workspace/"][href$=".jpg"]');
            for (var i = 0; i < items.length; i++) items[i].href += "?unwanted"; //Hide profile image link as it is not wanted


            if (/^\/whitecube\/user\/\d+$/.test(location.pathname)) icon = document.querySelector(".cover-footer ._user-icon").style.backgroundImage.match(/http[^'"]+/i)[0];

            //items = document.querySelectorAll('._ranking-item-container .carousel-item:not([data-type])');
            //parseLinks(THUMB_TYPE.stripRanking);

            items = document.querySelectorAll('._latest-follow-item-container .item-container[data-entry-id]:not([data-type])');
            parseLinks(THUMB_TYPE.stripFollowing);

            //._action-button.edit.profile-edit
            /*
            body > div > .items > .item-container[data-entry-id]
            .loaded > .items > .item-container[data-entry-id]
            */
            //items = document.querySelectorAll("div > div > .item-container[data-entry-id]:not([data-type])"); //Not related works --> ._work-modal._modal-container .single_page .info-container
            items = document.querySelectorAll(".loaded > .items > .item-container[data-entry-id]:not([data-type])");
            parseLinks(THUMB_TYPE.main);

            if (_isIllustrationPage) //Illustration Page
            {
                items = document.querySelectorAll("aside > div > .item-container[data-entry-id]:not([data-type])"); //related work --> aside.related-container > div.items > .item-container
                parseLinks(THUMB_TYPE.related);
            }

            //We do not know what it is just parse it anyway
            //items = document.querySelectorAll('.item-container[data-entry-id]:not([data-type]):not([data-wait])');
            //parseLinks(THUMB_TYPE.unlinked);
            
            console.warn("Done parsing");
            Linker.statsCounter();
            function parseLinks(thumbtype)
            {
                if (items.length > 0) console.log("registerForPreviewWindow Length: " + items.length, thumbtype);

                for (var i = 0, id, isNovel, tmp, item, el, els, marker, meta; i < items.length; i++)
                {
                    item = items[i];
                    item.setAttribute("thumb-type", thumbtype);
                    if (/^user/.test(item.getAttribute("data-entry-id")))
                    {
                        item.setAttribute("data-type", 10);
                        continue;
                    }

                    //WhiteCube provides a host of information. Only essential data lacking is illustration extension
                    isNovel = /^novel/.test(item.getAttribute("data-entry-id"));

                    /*  WhiteCube now relies on AJAX heavily so the thumbnail image source is not loaded on page load. We need the url base as it will
                    tell us if the illustration has been updated, as the update date is used to create the download link.The icon is not necessary but
                    might as well wait for the millisecond load time */
                    if (!isNovel)
                    {
                        tmp = item.querySelector(".image").getAttribute("style");
                        tmp = tmp ? Linker.getBaseURL(tmp) : "";
                        if (tmp.length == 0) continue;

                        if (icon.length == 0 && !/http[^'"]+/i.test(item.querySelector("._user-icon").style.backgroundImage)) continue;
                        else icon = icon || item.querySelector("._user-icon").style.backgroundImage.match(/http[^'"]+/i)[0];
                    }


                    id = item.getAttribute("data-entry-id").match(/\d+/)[0];

                    if (isNovel)
                    {
                        meta = _data[id] = createMeta();
                        meta.id = id;
                        meta.type = 5;
                        meta.data.characters = item.querySelector("._context-count").textContent;
                        meta.data.description = item.querySelector(".caption").textContent;
                    }
                    else
                    {
                        meta = getIllustrationData(id, tmp);
                        if (meta.expired) Linker.processID(id);
                        meta.url.base = tmp;
                        meta.user.icon = icon;

                        if (meta.expired)
                        {
                            //In reality we do not know, but we set it according to page count.
                            meta.type = -1; //Unknown
                            el = item.querySelector('._context-count ._icon-text'); //Page count
                            if (el) meta.data.pageCount = parseInt(el.textContent);
                            else if (item.querySelector(".playable")) meta.type = 2;
                        }
                    }

                    el = item.querySelector(".reaction ._balloon-menu-opener");
                    meta.user.id = parseInt(el.getAttribute("data-user-id"));
                    meta.user.name = el.getAttribute("data-user-name");
                    meta.data.title = el.getAttribute("data-caption");

                    if (item.querySelector(".r-18")) meta.data.rating = 1;
                    else if (item.querySelector(".r-18g")) meta.data.rating = 2;
                    else meta.data.rating = 0; //We set it just in case we are updating

                    meta.data.tags = "";
                    els = item.querySelectorAll(".tags .tag"); //Seems to be only authors tags
                    for (var j = 0; j < els.length; j++) meta.data.tags += " " + els[j].textContent;
                    meta.data.tags = meta.data.tags.trim();

                    el = item.querySelector('.like-count');
                    meta.ratings.bookmarks = (el) ? parseInt(el.textContent) : 0;

                    item.setAttribute("data-tags", meta.data.tags);
                    item.setAttribute("data-user-id", meta.user.id);
                    item.setAttribute("data-user-name", meta.user.name);
                    item.setAttribute("data-type", meta.type);
                    item.setAttribute("data-rating", meta.data.rating);
                    item.setAttribute("data-id", id);

                    if (!isNovel)
                    {
                        item.setAttribute("data-extension", meta.url.extension);

                        //We do this to update the timestamp telling it the last time it was accessed.
                        if (!meta.expired) storeIllustrationData(id);

                        //.related-works-container .pppHiddenLinksContainer
                        //GM_setValue("Pixiv: " + meta.id, JSON.parse(meta.id));
                        if (thumbtype < 10)
                        {
                            els = item.querySelector(".meta-container");
                            el = document.createElement("div");
                            el.className = "pppHiddenLinksContainer";
                            el.setAttribute("parent-type", thumbtype);

                            if (meta.expired) el.setAttribute("LinkUs", id);
                            for (var j = 0, link; j < meta.data.pageCount; j++)
                            {
                                link = document.createElement("a");
                                link.textContent = ((j + 1) % 5 == 0) ? "◆" : "◇";
                                if (!meta.expired) link.href = meta.url.original.replace(/_p\d+/, "_p" + j);
                                el.appendChild(link);
                            }
                            el.innerHTML = "[" + el.innerHTML + "]";
                            els.insertBefore(el, els.lastElementChild);

                            if (!meta.expired)
                            {
                                if (Main.filterM && thumbtype == THUMB_TYPE.main) Main.filterThumbnail(item);
                                else if (Main.filterR && thumbtype == THUMB_TYPE.related) Main.filterThumbnail(item);
                                else Linker.adjustLinksSuffix(el);
                            }
                        }


                        el = item.querySelector(".thumbnail-container");
                        if (meta.expired) //Add Activity Marker
                        {
                            marker = document.createElement("span");
                            marker.className = "pppMarker";
                            el.appendChild(marker);
                        }

                        el.onmousemove = el.onmouseleave = el.onmouseenter = PreviewHQ.mouseEvents;
                    }
                }
            }
        },

        illustrationPage: function ()
        {
            var container = document.querySelector(".illust-zoom-in[data-original-src], .ugoira [data-ugoira-meta]");
            if (!container) return false;

            if (document.querySelector(".illustrationLinks")) return true;


            TSL.addStyle("IllustrationPageCSS", ".illustrationLinks {text-align:center;}"
                + ".illustrationLinks a {display:inline-block; width:32px; hight: 18px; border: 1px solid #E3E1E1; margin: 0 1px; border-radius: 2px;}"
                + ".ugoiraLink a {width: auto; padding: 2px 5px;}"
                );

            var el = document.createElement("div");

            el.className = "illustrationLinks ugoiraLink";
            document.querySelector(".main-info-container").appendChild(el);

            if (container.hasAttribute("data-ugoira-meta"))
            {
                el.innerHTML = '<a href="' + JSON.parse(container.getAttribute("data-ugoira-meta")).src.replace("ugoira600x600", "ugoira1920x1080") + '">Ugoira 1920x1080 ZIP</a>'
            }
            else
            {
                var els = document.querySelectorAll(".illust-zoom-in[data-original-src]");

                for (var i = 0; i < els.length; i++)
                {
                    el.innerHTML += '<a href="' + els[i].getAttribute("data-original-src") + '">' + i + '</a>'
                }
            }

            return true;
        },

        mouseEvents: function (e)
        {
            var item = thumbnail = this;
            while (!item.hasAttribute("data-id") && !/\bitem-container\b/.test(item.className)) item = item.parentElement;
            var meta = getIllustrationData(item.getAttribute("data-id"));

            if (e.type == "mousemove") //Entering thumbnail
            {
                PreviewHQ.removePreview(false);
                if (PreviewHQ.iidThumb) return;

                PreviewHQ.iidThumb = setTimeout(function ()
                {
                    PreviewHQ.showPreviewWindow(e, item);
                    PreviewHQ.iidPreview = null;
                }, 500);
            }
            else //Enter and Leave we reset
            {
                PreviewHQ.removePreview(true);
                clearTimeout(PreviewHQ.iidThumb);
                PreviewHQ.iidThumb = null;
            }
        },

        removePreview: function (enabled)
        {
            if (!PreviewHQ.iidPreview && enabled)
            {
                PreviewHQ.iidPreview = setTimeout(function ()
                {
                    TSL.removeNode("PreviewWindow");
                    TSL.removeNode("PreviewWindowOwner");
                }, (GM_getValue("TimidScript", false) ? 60000 : 1500));
            }
            else
            {
                clearTimeout(PreviewHQ.iidPreview);
                PreviewHQ.iidPreview = null;
            }
        },


        showPreviewWindow: function (e, item)
        {
            console.info("showPreviewWindow:");
            var meta, previewWindow, baseURLs

            if (e === 1)
            {
                previewWindow = document.getElementById('PreviewWindow');
                if (!previewWindow) return;

                console.log("showPreviewWindow: re-adjust");

                meta = getIllustrationData(previewWindow.getAttribute("data-id"));
                item = previewWindow.item; //We do this as sometimes the thumbnail appears more than once. Beside listing, in ranking and following strip

                baseURLs = Linker.getPreviewURLS(meta.id, meta.type, meta.url.base);
                setSize();
                adjustPreviewWindow();
                return;
            }

            meta = getIllustrationData(item.getAttribute("data-id"));
            previewWindow = document.querySelector('#PreviewWindow[data-id="' + meta.id + '"]');
            if (previewWindow && previewWindow.item == item) return; //We do this as sometimes the thumbnail appears more than once. Beside listing, in ranking and following strip
            else TSL.removeNode("PreviewWindow");

            baseURLs = Linker.getPreviewURLS(meta.id, meta.type, meta.url.base);
            console.log(meta);
            console.log(baseURLs);

            TSL.addStyle("PreviewWindowOwner", '.item-container[data-id="' + meta.id + '"] .thumbnail-container {box-shadow: 0 0 3px 3px #FDFDA7;}');


            if (meta.expired || meta.reaquire) Linker.remoteProcedureCall(meta.id, function ()
            {
                console.warn("callback:", meta);
                setData();
            });


            previewWindow = document.createElement("article");
            previewWindow.setAttribute("data-id", meta.id);
            previewWindow.setAttribute("data-type", meta.type);
            previewWindow.id = "PreviewWindow";
            previewWindow.item = item;


            if (!_isIllustrationPage) document.body.appendChild(previewWindow);
            else document.querySelector(".modal-scroll-wrapper").appendChild(previewWindow);
            previewWindow.onmouseenter = function () { PreviewHQ.removePreview(false); };
            previewWindow.onmouseleave = function () { PreviewHQ.removePreview(true); };

            previewWindow.innerHTML = '<header>'
                                        + '<div class="pppPH1"><a name="type"></a><a name="title"><h1></h1></a><time></time><span class="checkmark" ><i class="fa fa-unlock"></i><i class="fa fa-lock"></i></span></div>' //✔ ??
                                        + '<div class="pppPH2"><a><img></img><span class="user-name" name="name"></span></a><a name="feed">Feed</a></div>'
                                        + '<div class="pppPH3"><span name="pagecount"></span><span name="extension"></span><span name="dimensions"></span><a name="iqdb">IQDB</a><span name="likes"></span></div>'
                                    + '</header>'
                                    + '<section class="previewImageContainer"></section>';
            //+ '<footer><sectio></section</footer>';


            setData();
            setSize();
            adjustPreviewWindow();

            function setData()
            {
                previewWindow.querySelector("time").style.display = null;
                previewWindow.querySelector(".pppPH2 a[name=feed]").style.display = null;
                previewWindow.querySelector("[name=dimensions]").style.display = null;
                previewWindow.querySelector("[name=pagecount]").style.display = null;
                previewWindow.querySelector("[name=extension]").style.display = null;

                previewWindow.querySelector("a[name=type]").textContent = ["Illust", "MANGA", "UGOIRA", "????"][meta.type];
                previewWindow.querySelector("a[name=title] h1").textContent = meta.data.title;
                previewWindow.querySelector("a[name=title]").href = "http://www.pixiv.net/whitecube/user/" + meta.user.id + "/illust/" + meta.id;
                
                previewWindow.querySelector(".pppPH2 a").href = "http://www.pixiv.net/whitecube/user/" + meta.user.id;
                previewWindow.querySelector(".pppPH2 img").src = meta.user.icon;
                previewWindow.querySelector(".pppPH2 span[name=name]").textContent = meta.user.name;


                previewWindow.querySelector("[name=likes]").innerHTML = '<i class="fa fa-heart" style="color:red;"></i> ' + meta.ratings.bookmarks;
                previewWindow.querySelector("[name=iqdb]").href = "http://www.iqdb.org/?url=" + baseURLs.cu[1] + "&pixiv++";

                if (meta.data.pageCount > 1) previewWindow.querySelector("[name=pagecount]").textContent = "P" + meta.data.pageCount;
                else previewWindow.querySelector("[name=pagecount]").style.display = "none";

                if (meta.url.extension) previewWindow.querySelector("[name=extension]").textContent = meta.url.extension.toUpperCase();
                else previewWindow.querySelector("[name=extension]").style.display = "none";

                if (meta.data.height > 0) previewWindow.querySelector("[name=dimensions]").textContent = meta.data.width + "x" + meta.data.height;
                else previewWindow.querySelector("[name=dimensions]").style.display = "none";

                var m = meta.url.base.match(/\d+/g);
                previewWindow.querySelector("time").textContent = m[0] + "-" + m[1] + "-" + m[2] + " " + m[3] + ":" + m[4];

                //if (meta.data.dateUpdated) previewWindow.querySelector("time").textContent = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4] + ":" + m[5];
                //else previewWindow.querySelector("time").style.display = "none";

                if (meta.user.account) previewWindow.querySelector(".pppPH2 a[name=feed]").href = "http://www.pixiv.net/stacc/" + meta.user.account;
                else previewWindow.querySelector(".pppPH2 a[name=feed]").style.display = "none";
            }

            function setSize()
            {
                var previewSize = GM_getValue("Preview Size", 1),
                    container = previewWindow.querySelector(".previewImageContainer");

                if (previewWindow.previewSize === previewSize) return;
                previewWindow.previewSize = previewSize;
                container.innerHTML = "";

                if (previewSize > 0)
                {
                    if (meta.type == 2)//Ugoira
                    {
                        var img = document.createElement("img");
                        //img.src = (previewSize == 1) ? baseURLs.wc[1] : baseURLs.wc[2];
                        img.src = baseURLs.wc[1];

                        container.appendChild(img);

                        //TODO: Ugoira preview mode
                        /*
                        TSL.addStyle("adasd", '#PreviewWindow .playable {background-color: rgba(0, 0, 0, 0.4); border-radius: 50%; left: 50%; line-height: 64px; margin-left: -32px; position: absolute; text-align: center; top:50%; width: 64px; z-index: 1;}'
                            + '#PreviewWindow ._icon-play { color: #fff; font-size: 36px; line-height: 64px; vertical-align: top;}');

                        container.style.cursor = "pointer";
                        container.innerHTML += '<div class="playable"><i class="_pico-12 _icon-play"></i></div>';
                        */
                    }
                    else if (meta.data.pageCount == 1)
                    {
                        if (meta.expired) container.setAttribute("LinkUs", meta.id);

                        var link = document.createElement("a"),
                            img = document.createElement("img");

                        if (!meta.expired) link.href = meta.url.original;

                        img.src = (previewSize == 1) ? baseURLs.wc[1] : baseURLs.wc[2];
                        link.appendChild(img);
                        container.appendChild(link);
                    }
                    else //Multipaged
                    {
                        if (meta.expired) container.setAttribute("LinkUs", meta.id);

                        TSL.addClass(container, "pagedThumbs");

                        for (var i = 0, link, img; i < meta.data.pageCount; i++)
                        {
                            link = document.createElement("a"),
                            img = document.createElement("img");

                            if (!meta.expired) link.href = meta.url.original.replace(/_p\d+/, "_p" + i);
                            img.src = baseURLs.wc[1].replace(/_p\d+/, "_p" + i);

                            link.appendChild(img);
                            container.appendChild(link);
                        }
                    }
                }
                else if (meta.data.pageCount > 0) //No preview, just provide links
                {
                    TSL.addClass(container, "justLinks");
                    if (meta.expired) container.setAttribute("LinkUs", meta.id);

                    for (var i = 0, link; i < meta.data.pageCount; i++)
                    {
                        link = document.createElement("a");
                        link.text = i;
                        if (!meta.expired) link.href = meta.url.original.replace(/_p\d+/, "_p" + i);
                        container.appendChild(link);
                    }

                    //else if (!meta.expired) container.innerHTML = '<a href="' + meta.url.original + '">Ugoira 1920x1080 ZIP</a>';
                    //else container.innerHTML = '<a href="http://i' + (Math.floor(Math.random() * 4) + 1) + ' .pixiv.net/img-zip-ugoira/img' + meta.url.base + '_ugoira1920x1080.zip">Ugoira 1920x1080 ZIP</a>';
                }
            }

            function adjustPreviewWindow()
            {
                console.log("adjustPreviewWindow");
                var thumbnail = item.querySelector(".thumbnail-container"),
                    container = previewWindow.querySelector(".previewImageContainer"),
                    pos = TSL.getAbsolutePosition(thumbnail),
                    previewSize = GM_getValue("Preview Size", 1);

                var headroom = pos.top - window.scrollY,
                    footroom = window.innerHeight - (headroom + thumbnail.offsetHeight);

                if (_isIllustrationPage)
                {
                    var wrapper = document.querySelector(".modal-scroll-wrapper");
                    headroom = pos.top - wrapper.scrollTop;
                    footroom = wrapper.clientHeight - (headroom + thumbnail.offsetHeight);
                }

                var tmp = GM_getValue("Preview Position", 1) // 0=top; 1=Auto 2=Bottom
                var placeOnTop = headroom > footroom;
                if (tmp == 0) placeOnTop = true;
                else if (tmp == 2) placeOnTop = false;

                previewWindow.style.left = pos.left + "px";
                if (placeOnTop)
                {
                    previewWindow.insertBefore(container, previewWindow.firstElementChild);
                    previewWindow.style.top = (pos.top - previewWindow.offsetHeight - 6) + "px";
                }
                else
                {
                    previewWindow.style.top = (pos.top + thumbnail.offsetHeight + 6) + "px";
                    if (meta.data.pageCount > 1) previewWindow.style.paddingBottom = "20px";
                }

                var iid;
                if (previewSize > 0) iid = setInterval(readjust, 50);
                function readjust()
                {
                    if (!document.querySelector('#PreviewWindow[data-id="' + meta.id + '"]'))
                    {
                        clearInterval(iid);
                        return;
                    }

                    //BUG: It does not clear IID
                    //console.log(iid);
                    if (meta.data.pageCount == 1)
                    {
                        var image = container.getElementsByTagName("img")[0];

                        if (image.naturalWidth == 0) return;
                        clearInterval(iid);

                        if (parseInt(previewWindow.style.left) + 30 + previewWindow.offsetWidth > window.innerWidth)
                            previewWindow.style.left = (window.innerWidth - previewWindow.offsetWidth - 30) + "px";


                        if (image.width < image.naturalWidth)
                        {
                            var tmp = innerWidth - image.naturalWidth - 35;
                            previewWindow.style.left = (tmp < 20) ? "20px" : tmp + "px";
                        }

                        AdjustTop();
                    }
                    else //Multipaged
                    {
                        var images = container.getElementsByTagName("img");

                        if (container.scrollWidth > 0)
                        {
                            var tmp = innerWidth - container.scrollWidth - 25;
                            previewWindow.style.left = (tmp < 20) ? "20px" : tmp + "px";

                            if (previewWindow.offsetWidth + pos.left + 20 < innerWidth) previewWindow.style.left = pos.left + "px";
                        }
                        AdjustTop();
                        for (var i = 0; i < images.length; i++) if (images[i].naturalWidth == 0) return;
                        clearInterval(iid);
                        AdjustTop();
                    }


                    //We do a time delay as sometimes the offset is wrong, unless there's a delay. Makes little sense.
                    function AdjustTop()
                    {
                        setTimeout(function ()
                        {
                            if (placeOnTop) previewWindow.style.top = (pos.top - previewWindow.offsetHeight - 6).toString() + "px";
                            if (meta.type == 2) previewWindow.querySelector("._icon-play").style.top = (previewWindow.querySelector(".previewImageContainer").clientHeight / 2 - 32) + "px";
                        }, 50);
                    }
                }
            }
        }
    };


    function AdjustBackgrounds()
    {
        if (_wholeThumbnail)
        {
            if (!document.getElementById("ContainThosePuppies"))
                TSL.addStyle("ContainThosePuppies", '.item-container[data-type] .image, ._work-items-square._work-items .item, .carousel-item > .image, ._recent-popular-illust > .image {background-size: contain; background-repeat:no-repeat;}'
                    + 'body ._work-items-square._work-items .item {width: 200px; height:200px;}');

            changeBackground(document.querySelectorAll('.item-container[data-type] [style *= "_square1200.jpg"], .carousel-item > .image[style *= "_square1200.jpg"]'), 1);
            changeBackground(document.querySelectorAll('._work-items-square._work-items .item[style*= "_square1200.jpg"], ._recent-popular-illust > .image[style*= "_square1200.jpg"]'), 0);
        }
        else
        {
            TSL.removeNode("ContainThosePuppies");
            var thumbnails = document.querySelectorAll('[bg-corrupted]');

            for (var i = 0, urls; i < thumbnails.length; i++)
            {
                thumbnails[i].style.backgroundImage = thumbnails[i].style.backgroundImage.replace(/http.+\.jpg/i, thumbnails[i].getAttribute("data-bg"));
                thumbnails[i].removeAttribute("bg-corrupted");
            }
        }


        function changeBackground(thumbnails, size)
        {
            for (var i = 0, urls, bg; i < thumbnails.length; i++)
            {
                bg = thumbnails[i].style.backgroundImage;
                urls = Linker.getPreviewURLS(bg.match(/\/(\d+)_/)[1], /_p0_/.test(bg) ? 0 : 2, Linker.getBaseURL(bg));

                if (!thumbnails[i].hasAttribute("data-bg")) thumbnails[i].setAttribute("data-bg", bg.match(/http.+\.jpg/i)[0]);
                thumbnails[i].setAttribute("bg-corrupted", "");
                thumbnails[i].style.backgroundImage = bg.replace(/http.+\.jpg/i, urls.wc[size]);
            }
        }
    }

    var Main =
    {
        filters: GM_getValue("Filters Enabled", ""),
        filterExpressions: (function () {            
            var obj = {}, arr = ["tags", "artistID", "artistName", "likes", "pageCount", "dimensions", "extension"];

            for(var i = 0; i < arr.length; i++) {obj[arr[i]] = GM_getValue("Filter: " + arr[i], "");}

            return obj;
        })(),            
        filterM: false,
        filterR: false,

        addStyles: function ()
        {
            TSL.addStyle("FontAwesomeOK", GM_getResourceText("FontAS"));

            TSL.addStyle("GeneralCSS", ".pppFiltered {display: none;}"
                + '.pppHiddenLinksContainer {display: none; text-align: center; text-overflow: "...]"; overflow: hidden; white-space: nowrap;}' //   ⋯ …);
                );

            TSL.addStyle("SideMenuCSS", '#SideMenuBar {position: fixed; height:0;width:0;padding:0;margin:0;z-index: 2002;}'
                //+ '#SideMenuBar * {font-family:"Helvetica Neue","arial","Hiragino Kaku Gothic ProN",Meiryo,sans-serif;}'
                + '#SideMenuBar * i {font-family:"FontAwesome";}'
                + '#SideMenuBar > section {position: fixed; width:26px; min-width: 26px; text-align:center;}'
                + '#SideMenuBar > section > div {cursor: pointer; background-color: white; border: 2px solid gray; line-height: 20px; margin-bottom: 1px;}'
                + '#SideMenuBar hr {margin: 3px 0; height: 3px; border: 1px solid gray; background-color:lightgray;}'
                + ".pppBottomBar {bottom: 80px; width: auto;}"
                + ".pppBottomBar .pppErrors {background-color:#FFF0F0; color:red;}"
                + ".pppBottomBar div {padding: 2px 3px; border: 2px solid #EBEBEB; cursor:default;}"
                + ".pppErrors, .pppRemaining {display:none;}"
                + ".pppTopBar {top:50px;}"
                + "#SideMenuBar [name=sort], #SideMenuBar [name=reset] {margin-bottom:30px;}"
                + "#SideMenuBar .pppTopBar > div:hover {background-color: #D4F3FF;}"
                + "#SideMenuBar .pppTopBar [on] {color: #2D89AA; border-color: #25C6FF; font-weight: 900; box-shadow: 0 0 1px 1px cyan;}"
            );

            TSL.addStyle("PreviewWindowStyle", '#PreviewWindow {position:absolute; z-index: 1000;background-color:white; border-radius: 8px; max-width:98%;min-width: 300px;border: 3px solid #E7E5E5; box-shadow: 0 0 8px 2px black;}'
                    + '#PreviewWindow header > div {padding: 2px;}'
                    + '#PreviewWindow span {display: inline-block; border-radius: 2px; padding: 1px 5px;}'
                    + '#PreviewWindow header {padding: 5px;}'
                    + '#PreviewWindow .pppPH1 [name=type] {border-radius: 2px; display: inline-block; background-color: #EBEBEB; width:55px;text-align:center; margin-left: 5px; margin-right: 5px; cursor: pointer;color:#6E6666;}'                    
                    + '#PreviewWindow h1 {display: inline-block; font-weight: 550; padding-left: 10px; padding-right: 10px; box-shadow: 0 0 2px black;}'
                    + '#PreviewWindow time {margin-left: 5px; background-color: #E3F6FD; padding: 1px 5px; border-radius: 3px; color: darkblue;}'
                    + '#PreviewWindow .pppPH2 img {height: 20px; width:20px; margin-left: 10px; box-shadow: 0 0 1px 1px #EBEBEB; margin-top: 2px; margin-bottom: 2px;}'
                    + '#PreviewWindow header a:not([name=feed]) {color: black;}'
                    + '#PreviewWindow .pppPH2 .user-name {color: #606262;}'
                    + '.pppPH2 [name=feed] {background-color: #25c6ff; color:white; padding: 1px 2px; margin-left: 5px;}'
                    + '.previewImageContainer {padding: 2px 5px 5px; text-align:center;}'
                    + '.previewImageContainer img {max-width: 100%;}'
                    + '.previewImageContainer.justLinks {text-align:center;}'
                    + '.previewImageContainer.justLinks a {display:inline-block; padding: 1px 1px; min-width: 16px; border: 1px solid #EBEBEB; margin: 0 1px;}'
                    + '#PreviewWindow .pagedThumbs {overflow: auto; white-space: nowrap; max-width: 100%; width: 100%; padding: 0 0 20px 0;}'
                    + '#PreviewWindow .pagedThumbs img {padding: 0 2px; border-right: 1px solid gray; border-left: 1px solid gray;} .pagedThumbs img:first-of-type {padding-left: 5px; border-left: 0 none;} .pagedThumbs img:last-of-type {padding-right: 5px; border-right: 0 none;}'
                    + '#PreviewWindow .checkmark {margin-left: 2px; cursor: pointer; font-weight: 900; padding: 0px 8px; color: gray; border-radius: 3px; background-color:#F2FFF2;}'
                    + '#PreviewWindow .checkmark:hover {background-color:#E4FDE4;}'
                    + '#PreviewWindow .pppPH3 {padding: 0 2px;}'
                    + '#PreviewWindow .pppPH3 > * {display: inline-block; border-radius: 3px; padding: 0px 6px; margin-left: 5px;background-color:lightgray;}'
                    + '#PreviewWindow .pppPH3 > [name=iqdb] {background-color: #ffffa3; color: #969628;}'
                    );

            TSL.addStyle("P++Markers", ".pppMarker {position:absolute;left:-3px;top:-3px;z-index:100;display:inline-block;height:6px;width:6px;background-color:gold; border-radius:5px; border: 1px ridge red;}"
                + "body #TheFeed {color: white;} "
            );

            //+ '#FilterOptions { background-image: linear-gradient(rgba(255, 255, 255, .2) 50%, transparent 50%, transparent); background-size: 10px 10px;}'

            //It's over 9000 (z-index)
            TSL.addStyle("FitlerOptionsCSS", '#FilterOptions {position: fixed; padding: 10px; top: 100px; margin: auto; right: 0; left: 0; z-index: 9001; min-width: 700px; width: 700px;'
                        + 'background-color: lightgray; border-radius: 6px; border: 3px solid white; box-shadow: 0 0 3px 3px black; text-align: center;}'
                + '#FilterOptions span {user-select: none;-webkit-user-select: none; -moz-user-select: none;}'
                + '#FilterOptions > div, .pppFiltersT > div  {margin: 2px 0; display: inline-block; box-sizing: content;}'
                + '#FilterOptions > div > *, .pppFiltersT > div > * {border: 0 none; display: inline-block; height: 22px; line-height: 15px; margin: 0; vertical-align: middle; padding: 0 5px;}'
                + '#FilterOptions .pppFiltersT > div {border-bottom: 1px solid transparent;}'
                + '#FilterOptions .pppFiltersT > div.pppInvalid {border-color:red;}'
                + '#FilterOptions input[type=text] {width: 600px; border-radius: 5px 0 0 5px;}'
                + '#FilterOptions input[type=text]+span {background-color:white; margin-left: 1px;cursor:pointer;}'
                + '#FilterOptions input[type=text]+span input {cursor:pointer;}'
                + '#FilterOptions button {width: 60px;}'
                + '#FilterOptions button[name=accept] {width: 400px; font-weight: 900;}'
                + '#FilterOptions [name=views] [name=views], #FilterOptions [name=likes] [name=likes] {background-color: yellow; color: black;}'
                + '#FilterOptions [name=size] [name=size], #FilterOptions [name=pagecount] [name=pagecount] {background-color: yellow; color: black;}'
                + '#FilterOptions .pppFiltersC > label {line-height: 22px; color: red; font-weight: 900; margin-right: 3px;}'
                + '#FilterOptions .pppFiltersC > span {display: inline-block; background-color: white; margin: 0 2px; padding: 0 2px 0 4px; cursor: pointer;}'
                + '#FilterOptions .pppFiltersC > span > label {cursor: pointer; background-color:transparent;}'
                + '#FilterOptions .pppFiltersC * {display: inline-block; margin: 0; padding: 0;}'
                + '#FilterOptions .pppFiltersC > .pppSelected,  #FilterOptions  input[type=text] + span.pppSelected {background-color: yellow;}'                
                + '#FilterOptions .pppFiltersC > span * {display: inline-block;  padding: 0 5px 0 1px; margin: 0 2px; background-color: white; height: 22px; line-height: 22px; vertical-align: middle; }'
                + '#FilterOptions .pppFiltersC > *:hover, #FilterOptions button:hover, #FilterOptions input[type=text]+span:hover, #FilterOptions .pppFilter > span:hover {background-color: #CFF;}'
                + '#FilterOptions footer {display:block; margin-top: 3px;}'
                + '#FilterOptions footer button {border: 1px solid black; padding: 2px;}'
                + '#FilterOptions footer [name=clear] {float:left;}'
                + '#-FilterOptions .pppFilter span input {vertical-align: bottom;}'
                + '#FilterOptions button:active, #FilterOptions input[type=text]+span:active, #FilterOptions .pppFilter > span:active {background-color: #E1F9F9;}'
                + 'body:not([TimidScript]) #FilterOptions [name=extension], body:not([TimidScript]) #FilterOptions [name=extension]+span {display:none}'
                );


            
            TSL.addStyle("mmmmm", "._pixivision-item-container.item-container, .multi-ads-area.item-container._ad-item-container,"
                + "._events-item-container.item-container._work-items, ._pixiv-comic-item-container.item-container.insert-view,"
                + "._recommended-users-item-container.item-container {display:none;}"
                );
        },

        adjustPage: function (skip)
        {
            if (skip === true)
            {
                cbSideBarButton();
                return;
            }

            Main.addStyles();
            var sidemenu = document.createElement("aside");
            sidemenu.id = "SideMenuBar";

           
            TSL.addStyle("sdfsdf", '.pppTopBar div[on] > .fa-chain {display:none;}'
                +'.pppTopBar div:not([on]) > .fa-chain-broken {display:none;}')
            
            //<i class=""></i>
            sidemenu.innerHTML = '<section class="pppTopBar">'                                  
                                  + '<div name="linker">⬤</div><div name="suffix"><i class="fa fa-chain"></i><i class="fa fa-chain-broken"></i></div><div name="reset">R</div>'
                                  + '<div name="filterD">0</div>'
                                  + '<div name="filter"><i class="fa fa-filter"></i></div>'
                                  + '<div class="pppSort" name="sort"><i class="fa fa-sort-alpha-asc"></i></div>'
                                  + '<div name="thumber">?</div><hr/>'
                                  + '<div name="previewHQ">H</div><div name="previewMQ">M</div><div name="previewJT">-</div><hr/>'
                                  + '<div name="previewT">?</div><div name="previewA">⧳</div><div name="previewB">?</div><hr/>' //⚫
                                  + '<div class="pppFlip" name="flip"></div>'
                                  + '<div name="dummy" style="display:none;"></div>'
                              + '</section>'
                              + '<section class="pppBottomBar"><div class="pppErrors"></div><div class="pppRemaining"></div></section>';

            document.body.appendChild(sidemenu);

            var els = sidemenu.querySelectorAll(".pppTopBar div");
            for (var i = 0; i < els.length; i++) els[i].onclick = cbSideBarButton;

            Linker.enabled = GM_getValue("Linker Disabled", false) ? false : true;
            cbSideBarButton();

            var feed = document.createElement("a");
            feed.href = "http://www.pixiv.net/stacc/?mode=unify";
            feed.id = "TheFeed"
            feed.className = "menu-item _action-button";
            feed.textContent = "Feed"
            var el = document.querySelector('.header .menu');
            el.insertBefore(feed, el.children[1]);

            el = document.querySelector('.user-icon-container');
            if (el)
            {
                feed = feed.cloneNode(true);
                if (!document.querySelector(".profile-edit")) feed.href = "";
                el.appendChild(feed);
            }

            function cbSideBarButton(e)
            {                                
                if (typeof e === "object") e.stopImmediatePropagation();
                var pos = GM_getValue("SideMenu Position", 2);
                switch (e && this.getAttribute("name"))
                {
                    case "filterD":
                        if (document.getElementById("FilterOptions")) break;
                        Main.showFilterOptions();
                        break;
                    case "filter":
                        if (_isIllustrationPage) Main.filterR = !Main.filterR;
                        else Main.filterM = !Main.filterM;
                        setTimeout(Main.applyFilters, 10);
                        break;
                    case "sort":
                        alert("Sorted by date... not yet implemented");
                        break;
                    case "linker":
                        Linker.enabled = !Linker.enabled;
                        GM_setValue("Linker Disabled", !Linker.enabled);
                        if (Linker.enabled) Linker.processParser();
                        break;
                    case "thumber":
                        if (GM_getValue("TimidScript", false))
                        {
                            _wholeThumbnail = !_wholeThumbnail;
                            GM_setValue("Whole Thumbnail", _wholeThumbnail);
                            AdjustBackgrounds();
                        }
                        else
                        {
                            alert("Does something amazing... look over there..");
                            alert("Ah! Too slow... you missed it.");
                            alert("The implementation is half-arsed... so skip along for now");
                        }
                        break;
                    case "suffix":
                        if (!_isIllustrationPage)
                        {
                            _addLinkSuffix = !_addLinkSuffix;
                            GM_setValue("Add Link Suffix", _addLinkSuffix);

                            var containers = document.querySelectorAll('.pppHiddenLinksContainer:not([parent-type="' + THUMB_TYPE.related + '"])');
                            for (var i = 0; i < containers.length; i++) Linker.adjustLinksSuffix(containers[i]);
                        }
                        else
                        {
                            _addLinkSuffixRelated = !_addLinkSuffixRelated;

                            var containers = document.querySelectorAll('.pppHiddenLinksContainer[parent-type="' + THUMB_TYPE.related + '"]');
                            for (var i = 0; i < containers.length; i++) Linker.adjustLinksSuffix(containers[i]);
                        }
                        break;
                    case "reset":

                        if (confirm("Are you sure you wish to remove all database stored data on illustration"))
                        {
                            var names = GM_listValues();
                            for (var i = 0; i < names.length; i++) if (/^:Pixiv-I:/.test(names[i])) GM_deleteValue(names[i]);
                            GM_setValue("Purge Stamp", Date.now());
                            alert("All stored illustration data has been removed.");
                        }
                        break;
                    case "previewJT":
                        GM_setValue("Preview Size", 0);
                        readjustPreview();
                        break;
                    case "previewMQ":
                        GM_setValue("Preview Size", 1);
                        readjustPreview();
                        break;
                    case "previewHQ":
                        GM_setValue("Preview Size", 2);
                        readjustPreview();
                        break;
                    case "previewT":
                        GM_setValue("Preview Position", 0);
                        readjustPreview();
                        break;
                    case "previewA":
                        GM_setValue("Preview Position", 1);
                        readjustPreview();
                        break;
                    case "previewB":
                        GM_setValue("Preview Position", 2);
                        readjustPreview();
                        break;
                    case "flip":
                        pos = (pos == 2) ? 1 : 2;
                        GM_setValue("SideMenu Position", pos);
                        break;
                }

                var els = document.querySelectorAll(".pppTopBar [on]");
                for (var i = 0; i < els.length; i++) els[i].removeAttribute("on");

                document.querySelector('[name="filterD"]').textContent = Main.filters.split(" ").length;

                if (Linker.enabled) document.querySelector('.pppTopBar [name=linker]').setAttribute("on", "");
                if (_wholeThumbnail) document.querySelector(".pppTopBar [name=thumber]").setAttribute("on", "");
                if (_addLinkSuffix && !_isIllustrationPage) document.querySelector(".pppTopBar [name=suffix]").setAttribute("on", "");
                if (_addLinkSuffixRelated && _isIllustrationPage) document.querySelector(".pppTopBar [name=suffix]").setAttribute("on", "");
                if (Main.filterM && !_isIllustrationPage) document.querySelector("#SideMenuBar [name=filter]").setAttribute("on", "");
                if (Main.filterR && _isIllustrationPage) document.querySelector("#SideMenuBar [name=filter]").setAttribute("on", "");

                document.querySelector(".pppTopBar [name='" + ["previewJT", "previewMQ", "previewHQ"][GM_getValue("Preview Size", 1)] + "']").setAttribute("on", "");
                document.querySelector(".pppTopBar [name='" + ["previewT", "previewA", "previewB"][GM_getValue("Preview Position", 1)] + "']").setAttribute("on", "");

                if (pos == 2) TSL.addStyle("GenericCSS", '#SideMenuBar > section {right: 3px;} .pppFlip:before {content:"?";}');
                else TSL.addStyle("GenericCSS", '#SideMenuBar > section {Left: 3px;} .pppFlip:before {content:"?";}');

                return false;

                function readjustPreview()
                {
                    setTimeout(PreviewHQ.showPreviewWindow, 0, 1);
                }
            }
        },

        showSortOptions: function (e)
        {
            //+ '<div class="pppSort"><label>Sort by: </label><span name="disable">Disable</span><span name="likes">Likes <i>❤</i></span><span name="views">Views</span><span name="size">Size</span><span name="pagecount">Page Count</span></div>'

            //        + '#FilterOptions .pppSort * {height: auto; padding: 2px;}'
            //+ '#FilterOptions .pppSort label {font-weight: 900; color: red;}'
            //+ '#FilterOptions .pppSort span {background-color: white; border: 1px gray solid; width: 75px; text-align:center; color: gray; margin: 0 2px; cursor: pointer;}'
            //+ '#FilterOptions .pppSort i {color: red}'
            //+ '#FilterOptions .pppSort:not([name]) [name=disable] {background-color: yellow; color: black;}'
            //+ '#FilterOptions .pppSort span:hover {background-color: #CFF;}'
            //+ '#FilterOptions .pppSort span:active {background-color: #E1F9F9;}'

            //                        case "disable":
            //                    this.parentElement.removeAttribute("name");
            //    break;
            //                case "views":
            //this.parentElement.setAttribute("name", "views");
            //break;
            //                case "likes":
            //this.parentElement.setAttribute("name", "likes");
            //break;
            //                case "size":
            //this.parentElement.setAttribute("name", "size");
            //break;
            //                case "pagecount":
            //this.parentElement.setAttribute("name", "pagecount");
            //break;
        },

        showFilterOptions: function (e)
        {
            var dialog = document.createElement("main");
            dialog.id = "FilterOptions"

            dialog.innerHTML = '<section class="pppFiltersT">'                    
                    + '<div><input name="tags" type="text" placeholder="Tag filter" /><span onclick="this.firstElementChild.click();"><input type="checkbox"/></span></div>'
                    + '<div><input name="likes" type="text" placeholder="❤ Likes filter" /><span onclick="this.firstElementChild.click();"><input type="checkbox"/></span></div>'
                    + '<div><input name="artistID" type="text" placeholder="Artist ID filter" /><span onclick="this.firstElementChild.click();"><input type="checkbox"/></span></div>'
                    + '<div><input name="artistName" type="text" placeholder="Artist name filter" /><span onclick="this.firstElementChild.click();"><input type="checkbox"/></span></div>'                    
                    + '<div><input name="dimensions" type="text" placeholder="Dimensions of illustration filter" /><span onclick="this.firstElementChild.click();"><input type="checkbox"/></span></div>'
                    + '<div><input name="pageCount" type="text" placeholder="Page count filter" /><span onclick="this.firstElementChild.click();"><input type="checkbox"/></span></div>'
                    + '<div><input name="extension" type="text" placeholder="Extensions filter" /><span onclick="this.firstElementChild.click();"><input type="checkbox"/></span></div>'
                + '</section>'
                + '<div class="pppFiltersC"><label>Filter out: </label></div>'
                + '<footer><button name="clear">Clear</button><button name="accept">Accept</button></footer>';
            document.body.appendChild(dialog);
            dialog.onclick = function (e) { e.stopImmediatePropagation(); };

            var el = dialog.querySelector(".pppFiltersC"),
                arr = ["Safe", "R-18", "R-18G", "Illustrations", "Manga", "Ugoira", "Novels"];

            for (var i = 0, c; i < arr.length; i++)
            {
                var c = document.createElement("span");
                c.innerHTML = '<input type="checkbox"><label>' + arr[i] + '</label>';
                c.setAttribute("onclick", "this.firstElementChild.click();");
                c.setAttribute("name", arr[i].toLowerCase());
                el.appendChild(c);
            }

            var els = dialog.querySelectorAll("button, input[type=checkbox]");
            for (var i = 0; i < els.length; i++) els[i].onclick = callback;

            els = document.querySelectorAll('#FilterOptions input[type=text]');
            for (var i = 0; i < els.length; i++)
            {
                els[i].oninput = validateInput;
                els[i].value = Main.filterExpressions[els[i].getAttribute("name")];
            }

            arr = Main.filters.split(" ");
            for (var i = 0; i < arr.length; i++)
            {
                el = dialog.querySelector('[name=' + arr[i] + ']');
                if (el.tagName == "INPUT") el.nextElementSibling.click();
                else el.click();
            }

            validateInput();

            function callback(e)
            {
                //console.log(e.BUBBLING_PHASE);
                //console.log(e.target);
                //if (e.target != this) return;
                e.stopImmediatePropagation();

                switch (this.getAttribute("name"))
                {
                    case "accept":
                        els = document.querySelectorAll('#FilterOptions input[type=text]');
                        for (var i = 0; i < els.length; i++)
                        {                            
                            Main.filterExpressions[els[i].getAttribute("name")] = els[i].value.replace(/  /g, " ").replace(/  /g, " ");
                            GM_setValue("Filter: " + els[i].getAttribute("name"), els[i].value);
                        }

                        var filters = "";
                        els = document.querySelectorAll('#FilterOptions input[type=checkbox]');
                        for (var i = 0, p; i < els.length; i++) if (els[i].value.trim().length > 0)
                        {
                            p = els[i].parentElement;
                            if (els[i].checked) filters += (p.hasAttribute("name") ? p.getAttribute("name") : p.previousElementSibling.getAttribute("name")) + " ";
                        }

                        filters = filters.trim();
                        GM_setValue("Filters Enabled", filters);
                        Main.filters = filters;

                        TSL.removeNode("FilterOptions");

                        Main.adjustPage(true);                        
                        if (Main.filterM || Main.filterR) Main.applyFilters()
                        //if (Main.filterM && !_isIllustrationPage) Main.applyFilters();
                        //else if (Main.filterR && _isIllustrationPage) Main.applyFilters();
                        break;
                    case "clear":
                        var els = document.querySelectorAll("#FilterOptions [type=checkbox]");
                        for (var i = 0; i < els.length; i++) els[i].checked = false;
                        document.querySelector("#FilterOptions [name=disable]").click();
                        break;
                }


                var els = document.querySelectorAll('#FilterOptions input[type=checkbox]');
                for (var i = 0; i < els.length; i++)
                {
                    if (els[i].checked) TSL.addClass(els[i].parentElement, "pppSelected"); else TSL.removeClass(els[i].parentElement, "pppSelected");
                }
            }

            function validateInput()
            {
                var els = dialog.querySelectorAll(".pppFiltersT input[type=text]");

                for (var i = 0; i < els.length; i++) TSL.removeClass(els[i].parentElement, "pppInvalid");

                //tags id name dimension count ext

                validate(els[0], /^!?\*?\w[\w\-]*\*?$/);
                validate(els[1], /^[><=]\d+$/);
                validate(els[2], /^!?\d+$/);
                validate(els[3], /^!?[\w_]+$/);
                validate(els[4], /^[hwp][><=]\d+$/);                
                validate(els[5], /^[><=]\d+$/);
                validate(els[6], /^\w+$/);

                function validate(el, re)
                {
                    var arr = el.value.split(" ");
                    for (var i = 0; i < arr.length; i++)
                    {
                        arr[i] = arr[i].trim();
                        if (arr[i].length == 0) continue;
                        if (!re.test(arr[i])) TSL.addClass(el.parentElement, "pppInvalid");
                    }
                }
            }
        },

        filterThumbnail: function (item, skipSuffix)
        {
            console.log(_data);
            var arr, negate,
                filters = Main.filters,
                expressions = Main.filterExpressions,
                meta = getIllustrationData(item.getAttribute("data-id")),
                filterOut = false,
                el = item.querySelector(".pppHiddenLinksContainer");

            if (/safe/.test(filters) && meta.data.rating == 0) filterOut = true;
            else if (/r-18/.test(filters) && meta.data.rating == 1) filterOut = true;
            else if (/r-18g/.test(filters) && meta.data.rating == 2) filterOut = true;
            else if (/illustrations/.test(filters) && meta.type == 0) filterOut = true;
            else if (/manga/.test(filters) && meta.type == 1) filterOut = true;
            else if (/ugoira/.test(filters) && meta.type == 2) filterOut = true;
            else if (/novels/.test(filters) && meta.type == 5) filterOut = true;

            if (!filterOut && meta.type < 5 && meta.data.height > 0 && /dimensions/.test(filters)) filterOut = checkDimension();
            if (!filterOut && /likes/.test(filters)) filterOut = intCompare(meta.ratings.bookmarks, expressions["likes"]);
            if (!filterOut && (meta.type < 2 || meta.type == 3) && /pageCount/.test(filters)) filterOut = intCompare(meta.data.pageCount, expressions["pageCount"]);

            if (!filterOut && meta.type < 5 && meta.url.extension && /extension/.test(filters)) filterOut = re_check(meta.url.extension, expressions["extension"], false);            
            if (!filterOut && /artistID/.test(filters)) filterOut = re_check(meta.user.id, expressions["artistID"], false);
            if (!filterOut && /artistName/.test(filters)) filterOut = re_check(meta.user.name, expressions["artistName"], false);
            if (!filterOut && /tags/.test(filters)) filterOut = re_check(meta.data.tags, expressions["tags"], true);

            //console.log(filterOut, meta.data.tags);
            if (filterOut)
            {
                TSL.addClass(item, "pppFiltered");
                if (el) el.setAttribute("filtered", "");
            }
            else
            {
                TSL.removeClass(item, "pppFiltered");
                if (el) el.removeAttribute("filtered");
            }

            if (el && !skipSuffix) Linker.adjustLinksSuffix(el);


            function checkDimension()
            {
                arr = expressions["dimensions"];

                for (var i = 0, op, v1, v2; i < arr.length; i++)
                {
                    if (arr[i][0] == "h") v1 = meta.data.height;
                    else if (arr[i][0] == "w") v1 = meta.data.width;
                    else v1 = meta.data.height * meta.data.width; //(arr[i][0] == "p") 
                    
                    op = arr[i][1];
                    v2 = parseInt(arr[i].substr(2));

                    if (op == "=" && v1 != v2) return true;
                    if (op == ">" && v1 <= v2) return true;
                    if (op == "<" && v1 >= v2) return true;
                }

                return false;
            }

            function intCompare(v1, exp)
            {
                arr = exp.split(" ");
                for (var i = 0, op, v2; i < arr.length; i++)
                {
                    op = arr[i][0];
                    v2 = parseInt(arr[i].substr(1));

                    if (op == "=" && v1 != v2) return true;
                    if (op == ">" && v1 <= v2) return true;
                    if (op == "<" && v1 >= v2) return true;
                }

                return false;
            }

            function re_check(text, values, asterisk)
            {
                arr = values.split(" ");
                for (var i = 0, re; i < arr.length; i++)
                {
                    negate = false;
                    re = arr[i].trim();

                    if (re.length == 0) continue;

                    if (re[0] == "!")
                    {
                        negate = true;
                        re = re.substr(1);
                    }

                    re = "(^|\\s)" + TSL.escapeRegExp(re) + "(\\s|$)"; //We do not use the \b operator as it fails on certain Japanese characters

                    if (asterisk) re = re.replace(/\\\*/g, "[\\w\\-]+");

                    re = new RegExp(re, "i");

                    if (!negate && !re.test(text)) return true;
                    if (negate && re.test(text)) return true;
                }
                return false;
            }
        },

        applyFilters: function ()
        {
            var els = document.querySelectorAll('[thumb-type="' + (_isIllustrationPage ? THUMB_TYPE.related : THUMB_TYPE.main) + '"]');

            if (Main.filterM) filterThumbnails(THUMB_TYPE.main); else removeFilters(THUMB_TYPE.main);
            if (Main.filterR && _isIllustrationPage) filterThumbnails(THUMB_TYPE.related); else removeFilters(THUMB_TYPE.related);

            function filterThumbnails(type)
            {
                var els = document.querySelectorAll('[thumb-type="' + type + '"]');
                for (var i = 0; i < els.length; i++) Main.filterThumbnail(els[i]);
            }

            function removeFilters(type)
            {
                var els = document.querySelectorAll('.pppFiltered[thumb-type="' + type + '"]');
                for (var i = 0; i < els.length; i++)
                {
                    TSL.removeClass(els[i], "pppFiltered");
                    els[i].querySelector(".pppHiddenLinksContainer").removeAttribute("filtered");
                }
            }
        },

        keyMonitor: function ()
        {
            document.body.addEventListener("keydown", function (e)
            {
                if (e.target != this || e.shiftKey || e.altKey || e.ctrlKey) return;
                console.log("KeyCode: ", e.keyCode);

                switch (e.keyCode)
                {
                    case 70:
                        document.querySelector("#SideMenuBar [name=filter]").click();
                        break;
                    case 81:
                        document.querySelector("#SideMenuBar [name=previewT]").click();
                        break;
                    case 65:
                        document.querySelector("#SideMenuBar [name=previewA]").click();
                        break;
                    case 90:
                        document.querySelector("#SideMenuBar [name=previewB]").click();
                        break;
                    case 72:
                    case 87:
                        document.querySelector("#SideMenuBar [name=previewHQ]").click();
                        break;
                    case 77:
                    case 83:
                        document.querySelector("#SideMenuBar [name=previewMQ]").click();
                        break;
                    case 74:
                    case 88:
                        document.querySelector("#SideMenuBar [name=previewJT]").click();
                        break;
                    case 67:
                        TSL.removeNode("PreviewWindow");
                        TSL.removeNode("PreviewWindowOwner");
                        break;
                }
            });
        }
    };


    var Observe =
    {
        lastURL: "",
        busy: false,

        bodyChanges: function ()
        {
            var mo = window.MutationObserver || window.MozMutationObserver || window.WebKitMutationObserver;
            if (mo)
            {
                Observe.observer = new mo(Observe.callback);
                Observe.observer.observe(document.body, { childList: true, subtree: true });
            }
        },

        callback: function (mutations)
        {
            if (Observe.busy) return;
            if (Observe.lastURL != document.URL) _isIllustrationPage = /^\/whitecube\/user\/\d+\/illust\/\d+/.test(location.pathname);
            Observe.busy = true;
            PreviewHQ.registerForPreviewWindow();

            if (Observe.lastURL != document.URL)
            {                
                Observe.lastURL = document.URL;
                Main.filterR = false;                                

                if (GM_getValue("TimidScript")) document.body.setAttribute("TimidScript", "");

                if (_isIllustrationPage)
                {
                    if (!PreviewHQ.illustrationPage()) Observe.lastURL = "";
                    else
                    {
                        TSL.addClass(document.body, "illustration-page");
                        Main.adjustPage(true);
                    }
                }
                else
                {
                    TSL.removeClass(document.body, "illustration-page");                    
                    _addLinkSuffixRelated = true;
                    Main.adjustPage(true);
                }

                //var containers = document.querySelectorAll('.pppHiddenLinksContainer:not([parent-type="' + THUMB_TYPE.related + '"])');
                //for (var i = 0; i < containers.length; i++) Linker.adjustLinksSuffix(containers[i]);
            }

            if (_wholeThumbnail) AdjustBackgrounds();
            Observe.busy = false;
            PreviewHQ.registerForPreviewWindow();
        }
    };

    //Removes pop dialog that appears when there isn't a cookie
    (function ()
    {
        console.info("Pixiv Main");

        if (/^accounts/i.test(location.hostname))
        {
            //Authentication.captureLogin();
            return;
        }

        TimedPurging();
        Main.adjustPage();        
        Main.keyMonitor();        
        Observe.bodyChanges();        
        PreviewHQ.registerForPreviewWindow();        

        /*
            Attempts a purge of dated data at minimum every 7 days. By default it purges data that has not been accessed
            in 30 days.
        */
        function TimedPurging()
        {
            var stamp = GM_getValue("Purge Stamp", 0);

            if (stamp == 0)
            {
                GM_setValue("Purge Stamp", Date.now());
                return;
            }

            var current = Date.now();

            stamp = current - stamp;

            if ((current - stamp) / (1000 * 60 * 60 * 24) < 7) return;

            var idx = 0, names = GM_listValues(),
                iid = setInterval(parse, 10);

            function parse()
            {
                if (idx >= names.length)
                {
                    clearInterval(iid);
                    GM_setValue("Purge Stamp", current);
                }

                var len = names.length;

                for (max = 0, meta; idx < names.length && max < 200; idx++, max++)
                {
                    if (!/:PixivI:/.test(names[i])) continue;

                    meta = JSON.parse(GM_getValue(names[idx]));

                    if ((current - meta.dateAccessed) / (1000 * 60 * 60 * 24) > GM_getValue("Purge Wait", 30)) GM_deleteValue(names[idx]);
                    //if ((current - meta.dateUpdated) / (1000 * 60 * 60 * 24) > GM_getValue("Purge Wait", 30)) GM_deleteValue(names[idx]);
                }
            }
        }
    })();
}());



/*
<script>
pixiv.context.illustId         = '44305721';
pixiv.context.illustTitle      = 'フランスパンこいしちゃんgif';
pixiv.context.userId           = '42949';
pixiv.context.userName         = 'ゆぬき うた';
pixiv.context.hasQuestionnaire = false;
pixiv.context.embedId          = '44305721_0286523bc768bf54bbc69e3163d75256';
pixiv.context.explicit         = false;
pixiv.context.illustSize       = [514, 487];
pixiv.context.ugokuIllustData  = {"src":"http:\/\/i2.pixiv.net\/img-zip-ugoira\/img\/2014\/06\/25\/21\/24\/51\/44305721_ugoira600x600.zip","mime_type":"image\/jpeg","frames":[{"file":"000000.jpg","delay":100},{"file":"000001.jpg","delay":100},{"file":"000002.jpg","delay":100},{"file":"000003.jpg","delay":100},{"file":"000004.jpg","delay":100},{"file":"000005.jpg","delay":100},{"file":"000006.jpg","delay":100},{"file":"000007.jpg","delay":100},{"file":"000008.jpg","delay":100},{"file":"000009.jpg","delay":100},{"file":"000010.jpg","delay":100},{"file":"000011.jpg","delay":100}]};
pixiv.context.ugokuIllustFullscreenData  = {"src":"http:\/\/i2.pixiv.net\/img-zip-ugoira\/img\/2014\/06\/25\/21\/24\/51\/44305721_ugoira1920x1080.zip","mime_type":"image\/jpeg","frames":[{"file":"000000.jpg","delay":100},{"file":"000001.jpg","delay":100},{"file":"000002.jpg","delay":100},{"file":"000003.jpg","delay":100},{"file":"000004.jpg","delay":100},{"file":"000005.jpg","delay":100},{"file":"000006.jpg","delay":100},{"file":"000007.jpg","delay":100},{"file":"000008.jpg","delay":100},{"file":"000009.jpg","delay":100},{"file":"000010.jpg","delay":100},{"file":"000011.jpg","delay":100}]};
</script>

http://pixiv.me/<userID>



https://i2.pixiv.net/img-original/img/2016/10/25/23/16/10/59637877_p0.png
Single Paged Mangas
http://www.pixiv.net/member_illust.php?mode=medium&illust_id=46543872
http://www.pixiv.net/member_illust.php?mode=medium&illust_id=52415438
http://www.pixiv.net/member_illust.php?mode=big&illust_id=
*/


/*
Always test on PNG file
56222236
http://www.pixiv.net/member_illust.php?mode=medium&illust_id=56222236

Has extension of file
Remote procedure call (RPC):
http://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=56222236
{"error":false,"message":"","body":{"56222236":{"error":false,"contentType":"illust","is_bookmarked":false,"is_commented":false,"profile_img":"http:\/\/i1.pixiv.net\/user-profile\/img\/2012\/12\/11\/02\/48\/13\/5524016_d4de0ba73ef7f0858d15fce68a50df10_170.jpg","illust_id":"56222236","illust_title":"\u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605","illust_ext":"png","illust_width":"1400","illust_height":"1400","illust_restrict":"0","illust_x_restrict":"0","illust_type":"0","illust_sanity_level":2,"illust_book_style":"0","illust_page_count":"1","url":{"240mw":"http:\/\/i1.pixiv.net\/c\/240x480\/img-master\/img\/2016\/04\/06\/19\/14\/49\/56222236_p0_master1200.jpg","big":"http:\/\/i1.pixiv.net\/img-original\/img\/2016\/04\/06\/19\/14\/49\/56222236_p0.png","ugoira600x600":"","m":"http:\/\/i1.pixiv.net\/c\/600x600\/img-master\/img\/2016\/04\/06\/19\/14\/49\/56222236_p0_master1200.jpg"},"user_name":"Tocky","user_id":"35905","is_rated":false,"is_multiple":false,"ugoira_meta":null,"ugoira_meta_fullscreen":null}}}

Ugoira
{"error":false,"message":"","body":{"59699479":{"error":false,"contentType":"illust","is_bookmarked":false,"is_commented":false,"profile_img":"http:\/\/i4.pixiv.net\/user-profile\/img\/2007\/11\/05\/04\/29\/06\/25359_4fbfe4add7ad0823b4636e8fffbd3745_170.jpg","illust_id":"59699479","illust_title":"\u30ab\u30dc\u30a6\u30a3\u30f32016\u30fb\u6539","illust_ext":"jpg","illust_width":"600","illust_height":"600","illust_restrict":"0","illust_x_restrict":"0","illust_type":"2","illust_sanity_level":2,"illust_book_style":"0","illust_page_count":"1","url":{"240mw":"http:\/\/i4.pixiv.net\/c\/240x480\/img-master\/img\/2016\/10\/30\/03\/44\/44\/59699479_master1200.jpg","big":"http:\/\/i4.pixiv.net\/img-original\/img\/2016\/10\/30\/03\/44\/44\/59699479_ugoira0.jpg","ugoira600x600":"http:\/\/i4.pixiv.net\/img-zip-ugoira\/img\/2016\/10\/30\/03\/44\/44\/59699479_ugoira600x600.zip","m":""},"user_name":"KaOS","user_id":"5831","is_rated":false,"is_multiple":false,"ugoira_meta":"{\u0022src\u0022:\u0022http:\\\/\\\/i4.pixiv.net\\\/img-zip-ugoira\\\/img\\\/2016\\\/10\\\/30\\\/03\\\/44\\\/44\\\/59699479_ugoira600x600.zip\u0022,\u0022mime_type\u0022:\u0022image\\\/jpeg\u0022,\u0022frames\u0022:[{\u0022file\u0022:\u0022000000.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000001.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000002.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000003.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000004.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000005.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000006.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000007.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000008.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000009.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000010.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000011.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000012.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000013.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000014.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000015.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000016.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000017.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000018.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000019.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000020.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000021.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000022.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000023.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000024.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000025.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000026.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000027.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000028.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000029.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000030.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000031.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000032.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000033.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000034.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000035.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000036.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000037.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000038.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000039.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000040.jpg\u0022,\u0022delay\u0022:40}]}","ugoira_meta_fullscreen":"{\u0022src\u0022:null,\u0022mime_type\u0022:\u0022image\\\/jpeg\u0022,\u0022frames\u0022:[{\u0022file\u0022:\u0022000000.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000001.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000002.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000003.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000004.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000005.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000006.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000007.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000008.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000009.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000010.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000011.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000012.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000013.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000014.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000015.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000016.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000017.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000018.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000019.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000020.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000021.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000022.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000023.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000024.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000025.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000026.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000027.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000028.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000029.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000030.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000031.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000032.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000033.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000034.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000035.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000036.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000037.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000038.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000039.jpg\u0022,\u0022delay\u0022:40},{\u0022file\u0022:\u0022000040.jpg\u0022,\u0022delay\u0022:40}]}"}}}

Public API:
https://public-api.secure.pixiv.net/v1/works/56222236.json?image_sizes=large
{"status":"success","response":[{"id":59694252,"title":"オーブオリジンくん","caption":"暇潰し程度に描いたやつ\n「復活の聖剣」は神回だったぜ！","tags":["デフォルメ","オーブオリジン","ウルトラマンオーブ"],"tools":[],"image_urls":{"large":"http://i1.pixiv.net/img-original/img/2016/10/29/23/08/24/59694252_p0.jpg"},"width":1440,"height":1544,"stats":null,"publicity":0,"age_limit":"all-age","created_time":"2016-10-29 23:08:24","reuploaded_time":"2016-10-29 23:08:24","user":{"id":20383552,"account":"claymore_cat","name":"シン・十哲","is_following":false,"is_follower":false,"is_friend":false,"is_premium":null,"profile_image_urls":{"px_50x50":"http://i3.pixiv.net/user-profile/img/2016/10/11/15/07/06/11607578_373067ff48ecdd21ffdb86a14dcb778e_50.jpg"},"stats":null,"profile":null},"is_manga":false,"is_liked":false,"favorite_id":0,"page_count":1,"book_style":"none","type":"illustration","meta":null,"content_type":null}],"count":1}

Ugoira
{"status":"success","response":[{"id":59699479,"title":"カボウィン2016・改","caption":"動きが大きい気がしたので改良＋まばたき追加。","tags":["うごイラ","オリジナル","カボウィン","ハロウィン"],"tools":[],"image_urls":{"large":"http://i4.pixiv.net/img-original/img/2016/10/30/03/44/44/59699479_ugoira0.jpg"},"width":600,"height":600,"stats":null,"publicity":0,"age_limit":"all-age","created_time":"2016-10-30 03:44:44","reuploaded_time":"2016-10-30 03:44:44","user":{"id":5831,"account":"kaosxxxxx","name":"KaOS","is_following":false,"is_follower":false,"is_friend":false,"is_premium":null,"profile_image_urls":{"px_50x50":"http://i4.pixiv.net/user-profile/img/2007/11/05/04/29/06/25359_4fbfe4add7ad0823b4636e8fffbd3745_50.jpg"},"stats":null,"profile":null},"is_manga":false,"is_liked":false,"favorite_id":0,"page_count":1,"book_style":"none","type":"ugoira","meta":{"zip_urls":{"ugoira600x600":"http://i4.pixiv.net/img-zip-ugoira/img/2016/10/30/03/44/44/59699479_ugoira600x600.zip"},"frames":[{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40},{"delay_msec":40}]},"content_type":null}],"count":1}



RPC White Cube
https://www.pixiv.net/rpc/whitecube/index.php?mode=work_details_modal_whitecube&id=56222236&tt=e0f76a97ae515f96fe347faec9a2b0a2
{"error":false,"message":"","body":{"html":"\u003Cdiv class=\u0022modal-header-container\u0022 tabindex=\u0022-1\u0022\u003E\u003Cdiv class=\u0022header-container modal-header\u0022\u003E\u003Cdiv class=\u0022header-author-container\u0022\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\u0022 class=\u0022user-view-popup\u0022 data-user_id=\u002235905\u0022\u003E\u003Cspan class=\u0022_user-icon size-40 \u0022 style=\u0022background-image:url(https:\/\/i.pximg.net\/user-profile\/img\/2012\/12\/11\/02\/48\/13\/5524016_d4de0ba73ef7f0858d15fce68a50df10_170.jpg)\u0022\u003E\u003C\/span\u003E\u003Cdiv class=\u0022user-name\u0022\u003ETocky\u003C\/div\u003E\u003C\/a\u003E\u003C\/div\u003E\u003Cdiv class=\u0022header-reaction-container reaction-menu \u0022\u003E\u003Cdiv class=\u0022react-item\u0022\u003E\u003Cspan class=\u0022_questionnaire-opener\u0022 data-id=\u002256222236\u0022 data-type=\u0022illust\u0022\u003E\u003Ci class=\u0022_pico-30 _icon-questionnaire\u0022\u003E\u003C\/i\u003E\u003Cdiv class=\u0022_questionnaire-popup _modal-container ui-modal-close\u0022\u003E\u003Ci class=\u0022_pico-30 _icon-close ui-modal-close\u0022\u003E\u003C\/i\u003E\u003Cdiv class=\u0022_questionnaire-container form\u0022\u003E\u003Cdiv class=\u0022title\u0022\u003EPoll\u003C\/div\u003E\u003Cdiv class=\u0022question\u0022\u003E\u30c8\u30ac\u3061\u3083\u3093\u304b\u308f\u3044\u3044\u3088\u306d\u003C\/div\u003E\u003Col class=\u0022choices\u0022\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003E\u306f\u3044\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00221\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003EYES\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00222\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003E\u305d\u3046\u3060\u306d\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00223\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003E\u304b\u308f\u3044\u3059\u304e\u308b\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00224\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003C\/ol\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/span\u003E\u003C\/div\u003E\u003Cdiv class=\u0022react-item\u0022\u003E\u003Ca class=\u0022_balloon-menu-opener share-menu\u0022data-type=\u0022illust\u0022data-role=\u0022share\u0022data-id=\u002256222236\u0022data-user-id=\u002235905\u0022data-user-name=\u0022Tocky\u0022data-caption=\u0022\u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605\u0022data-permalink=\u0022http:\/\/www.pixiv.net\/member_illust.php?mode=medium\u0026amp;illust_id=56222236\u0022\u003E\u003Ci title=\u0022Share\u0022 class=\u0022_pico-30 _icon-send\u0022\u003E\u003C\/i\u003E\u003C\/a\u003E\u003C\/div\u003E\u003Ca href=\u0022\/bookmark_add.php?type=illust\u0026amp;illust_id=56222236\u0022title=\u0022Like!\u0022class=\u0022react-item like-action for-work-modal add  illust-bookmark-56222236  user-activity\u0022data-id=\u002256222236\u0022data-type=\u0022illust\u0022data-user-id=\u002235905\u0022data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_bookmark_click\u0022data-activity-zone=\u0022bookmark_illust_modal\u0022data-activity-illust_id=\u002256222236\u0022\u003E\u003C\/a\u003E\u003Cdiv class=\u0022react-item item dot\u0022\u003E\u003Ca class=\u0022_balloon-menu-opener  illust-bookmark-56222236\u0022data-type=\u0022illust\u0022data-id=\u002256222236\u0022data-user-id=\u002235905\u0022data-user-name=\u0022Tocky\u0022data-caption=\u0022\u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605\u0022data-permalink=\u0022http:\/\/www.pixiv.net\/member_illust.php?mode=medium\u0026amp;illust_id=56222236\u0022\u003E\u003Ci title=\u0022More\u0022 class=\u0022_pico-30 _icon-dot\u0022\u003E\u003C\/i\u003E\u003C\/a\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022info-container\u0022\u003E\u003Cdiv class=\u0022header-container\u0022\u003E\u003Cspan class=\u0022_work-items\u0022 data-modal-use-zengo\u003E\u003Cspan class=\u0022zengo-next\u0022\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\/illust\/56731346\u0022class=\u0022thumb-zengo info-left _work-modal-target\u0022data-record-target=\u0022rpc\u0022data-activity-type=\u0022open_work_modal\u0022data-activity-zone=\u0022work_modal\u0022data-activity-work_type=\u0022illust\u0022data-activity-work_id=\u002256731346\u0022\u003E\u003Cdiv class=\u0022_ui-tooltip\u0022 data-tooltip=\u0022\u6681\u306b\u96fb\u96f7\u304c\u97ff\u304f\u0022\u003E\u003Ci class=\u0022_pico-20 _icon-prev icon\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003C\/a\u003E\u003C\/span\u003E\u003Cspan class=\u0022zengo-prev\u0022\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\/illust\/56074120\u0022class=\u0022thumb-zengo info-left _work-modal-target\u0022data-record-target=\u0022rpc\u0022data-activity-type=\u0022open_work_modal\u0022data-activity-zone=\u0022work_modal\u0022data-activity-work_type=\u0022illust\u0022data-activity-work_id=\u002256074120\u0022\u003E\u003Cdiv class=\u0022_ui-tooltip\u0022 data-tooltip=\u0022Jinx\u0022\u003E\u003Ci class=\u0022_pico-20 _icon-next icon\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003C\/a\u003E\u003C\/span\u003E\u003C\/span\u003E\u003Cdiv class=\u0022header-author-container\u0022\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\u0022 class=\u0022_user-icon size-40  user-view-popup\u0022style=\u0022background-image:url(https:\/\/i.pximg.net\/user-profile\/img\/2012\/12\/11\/02\/48\/13\/5524016_d4de0ba73ef7f0858d15fce68a50df10_170.jpg)\u0022data-user_id=\u002235905\u0022\u003E\u003C\/a\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\u0022 class=\u0022user-name user-view-popup\u0022 data-user_id=\u002235905\u0022\u003ETocky\u003C\/a\u003E\u003Cul class=\u0022meta\u0022\u003E\u003Cli class=\u0022datetime\u0022\u003E4\/6\/2016 19:14\u003C\/li\u003E\u003C\/ul\u003E\u003C\/div\u003E\u003Cdiv class=\u0022header-reaction-container reaction-menu \u0022\u003E\u003Cdiv class=\u0022react-item\u0022\u003E\u003Cspan class=\u0022_questionnaire-opener\u0022 data-id=\u002256222236\u0022 data-type=\u0022illust\u0022\u003E\u003Ci class=\u0022_pico-30 _icon-questionnaire\u0022\u003E\u003C\/i\u003E\u003Cdiv class=\u0022_questionnaire-popup _modal-container ui-modal-close\u0022\u003E\u003Ci class=\u0022_pico-30 _icon-close ui-modal-close\u0022\u003E\u003C\/i\u003E\u003Cdiv class=\u0022_questionnaire-container form\u0022\u003E\u003Cdiv class=\u0022title\u0022\u003EPoll\u003C\/div\u003E\u003Cdiv class=\u0022question\u0022\u003E\u30c8\u30ac\u3061\u3083\u3093\u304b\u308f\u3044\u3044\u3088\u306d\u003C\/div\u003E\u003Col class=\u0022choices\u0022\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003E\u306f\u3044\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00221\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003EYES\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00222\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003E\u305d\u3046\u3060\u306d\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00223\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003Cli class=\u0022choice\u0022\u003E\u003Clabel\u003E\u304b\u308f\u3044\u3059\u304e\u308b\u003Cinput type=\u0022radio\u0022 name=\u0022answer\u0022 value=\u00224\u0022\u003E\u003C\/label\u003E\u003C\/li\u003E\u003C\/ol\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/span\u003E\u003C\/div\u003E\u003Cdiv class=\u0022react-item\u0022\u003E\u003Ca class=\u0022_balloon-menu-opener share-menu\u0022data-type=\u0022illust\u0022data-role=\u0022share\u0022data-id=\u002256222236\u0022data-user-id=\u002235905\u0022data-user-name=\u0022Tocky\u0022data-caption=\u0022\u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605\u0022data-permalink=\u0022http:\/\/www.pixiv.net\/member_illust.php?mode=medium\u0026amp;illust_id=56222236\u0022\u003E\u003Ci title=\u0022Share\u0022 class=\u0022_pico-30 _icon-send\u0022\u003E\u003C\/i\u003E\u003C\/a\u003E\u003C\/div\u003E\u003Ca href=\u0022\/bookmark_add.php?type=illust\u0026amp;illust_id=56222236\u0022title=\u0022Like!\u0022class=\u0022react-item like-action for-work-modal add  illust-bookmark-56222236  user-activity\u0022data-id=\u002256222236\u0022data-type=\u0022illust\u0022data-user-id=\u002235905\u0022data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_bookmark_click\u0022data-activity-zone=\u0022bookmark_illust_modal\u0022data-activity-illust_id=\u002256222236\u0022\u003E\u003C\/a\u003E\u003Cdiv class=\u0022react-item item dot\u0022\u003E\u003Ca class=\u0022_balloon-menu-opener  illust-bookmark-56222236\u0022data-type=\u0022illust\u0022data-id=\u002256222236\u0022data-user-id=\u002235905\u0022data-user-name=\u0022Tocky\u0022data-caption=\u0022\u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605\u0022data-permalink=\u0022http:\/\/www.pixiv.net\/member_illust.php?mode=medium\u0026amp;illust_id=56222236\u0022\u003E\u003Ci title=\u0022More\u0022 class=\u0022_pico-30 _icon-dot\u0022\u003E\u003C\/i\u003E\u003C\/a\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_guide _guide-box _whitecube-guide-like\u0022\u003E\u003Cdiv class=\u0022explain\u0022\u003ESaw an interesting post? Try pressing Like!\u003C\/div\u003E\u003Ci class=\u0022_guide-close _pico-12 _icon-remove\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_guide _guide-detail-box _whitecube-guide-like-detail\u0022\u003E\u003Cdiv class=\u0022guide-detail\u0022\u003E\u003Cdiv class=\u0022liked-image-container \u0022\u003E\u003Cdiv class=\u0022liked-work-image illust-thumbnail\u0022style=\u0022background-image:url(https:\/\/i.pximg.net\/c\/100x100_80\/img-master\/img\/2016\/04\/06\/19\/14\/49\/56222236_p0_square1200.jpg);\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022like-icon-container\u0022\u003E\u003Cdiv class=\u0022like-icon\u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/www\/images\/beta\/like-shadow.svg)\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Ci class=\u0022_guide-close _pico-12 _icon-remove\u0022\u003E\u003C\/i\u003E\u003Cdiv class=\u0022explain-title\u0022\u003EYou liked \u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605\u003C\/div\u003E\u003Chr\u003E\u003Cdiv class=\u0022explain\u0022\u003EYou can\u00a0find the works you liked \u003Cbr\u003Ein your \u003Ca href=\u0022\/whitecube\/collection\u0022\u003ECollection\u003C\/a\u003E.\u003Cbr\u003EBy using the Like! function more, your \u003Ca href=\u0022\/whitecube\/\u0022\u003ERecommended\u003C\/a\u003E page will display more results.\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022select-list\u0022\u003E\u003Ca class=\u0022_action-button large ok\u0022 href=\u0022\/whitecube\/\u0022\u003ECheck your recommendations\u003C\/a\u003E\u003Cbutton class=\u0022_guide-close _action-button large cancel\u0022\u003ELater\u003C\/button\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_guide _guide-box _whitecube-guide-like-edit\u0022\u003E\u003Cdiv class=\u0022explain\u0022\u003EYou can tag it with Like! by clicking on it\u003C\/div\u003E\u003Ci class=\u0022_guide-close _pico-12 _icon-remove\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Csection class=\u0022additional-container ad-info-container\u0022\u003E\u003Cdiv style=\u0027width:728px; height:90px; margin-left:auto; margin-right:auto;\u0027\u003E\u003Ciframe class=\u0022lazy-content\u0022name=\u0022w_illust_header\u0022width=\u0022728\u0022height=\u002290\u0022data-src=\u0022http:\/\/d.pixiv.org\/show?zone_id=w_illust_header\u0026segments=abroad\u0026format=html\u0026pla_referer_page_name=pixiv\u0026K=1483b250c68ce\u0026num=581798c0827\u0022\u003E\u003C\/iframe\u003E\u003C\/div\u003E\u003C\/section\u003E\u003Cdiv class=\u0022main-info-container\u0022\u003E\u003Cdiv class=\u0022 reaction-status-container\u0022\u003E\u003Cspan class=\u0022react-item\u0022\u003EViews\u003Cspan class=\u0022react-count\u0022\u003E6786\u003C\/span\u003E\u003C\/span\u003E\u003Cspan class=\u0022react-item like-container\u0022\u003ELike!\u003Cspan class=\u0022react-count _clickable illust-bookmark-count-56222236 count like-count\u0022 data-id=\u002256222236\u0022 data-type=\u0022illust\u0022\u003E236\u003C\/span\u003E\u003C\/span\u003E\u003C\/div\u003E\u003Cdiv class=\u0022work-info-container\u0022\u003E\u003Cdiv class=\u0022_tag-container tags illust-56222236\u0022 data-author-id=\u002235905\u0022\u003E\u003Ca href=\u0022\/whitecube\/search\/%E5%A5%B3%E3%81%AE%E5%AD%90?s_mode=s_tag_full\u0026amp;adult_mode=include\u0022 class=\u0022tag author user-activity\u0022 data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022data-activity-tag_name=\u0022\u5973\u306e\u5b50\u0022\u003E\u5973\u306e\u5b50\u003C\/a\u003E\u003Ca href=\u0022\/whitecube\/search\/%E5%83%95%E3%81%AE%E3%83%92%E3%83%BC%E3%83%AD%E3%83%BC%E3%82%A2%E3%82%AB%E3%83%87%E3%83%9F%E3%82%A2?s_mode=s_tag_full\u0026amp;adult_mode=include\u0022 class=\u0022tag author user-activity\u0022 data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022data-activity-tag_name=\u0022\u50d5\u306e\u30d2\u30fc\u30ed\u30fc\u30a2\u30ab\u30c7\u30df\u30a2\u0022\u003E\u50d5\u306e\u30d2\u30fc\u30ed\u30fc\u30a2\u30ab\u30c7\u30df\u30a2\u003C\/a\u003E\u003Ca href=\u0022\/whitecube\/search\/%E3%83%88%E3%82%AC%E3%83%92%E3%83%9F%E3%82%B3?s_mode=s_tag_full\u0026amp;adult_mode=include\u0022 class=\u0022tag author user-activity\u0022 data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022data-activity-tag_name=\u0022\u30c8\u30ac\u30d2\u30df\u30b3\u0022\u003E\u30c8\u30ac\u30d2\u30df\u30b3\u003C\/a\u003E\u003Ca href=\u0022\/whitecube\/search\/%E3%83%B4%E3%82%A3%E3%83%A9%E3%83%B3%E9%80%A3%E5%90%88?s_mode=s_tag_full\u0026amp;adult_mode=include\u0022 class=\u0022tag  user-activity\u0022 data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022data-activity-tag_name=\u0022\u30f4\u30a3\u30e9\u30f3\u9023\u5408\u0022\u003E\u30f4\u30a3\u30e9\u30f3\u9023\u5408\u003C\/a\u003E\u003Ca href=\u0022\/whitecube\/search\/%E5%83%95%E3%81%AE%E3%83%92%E3%83%BC%E3%83%AD%E3%83%BC%E3%82%A2%E3%82%AB%E3%83%87%E3%83%9F%E3%82%A2100users%E5%85%A5%E3%82%8A?s_mode=s_tag_full\u0026amp;adult_mode=include\u0022 class=\u0022tag  user-activity\u0022 data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022data-activity-tag_name=\u0022\u50d5\u306e\u30d2\u30fc\u30ed\u30fc\u30a2\u30ab\u30c7\u30df\u30a2100users\u5165\u308a\u0022\u003E\u50d5\u306e\u30d2\u30fc\u30ed\u30fc\u30a2\u30ab\u30c7\u30df\u30a2100users\u5165\u308a\u003C\/a\u003E\u003Ca href=\u0022\/whitecube\/search\/%E9%81%95%E5%92%8C%E6%84%9F%E3%81%8C%E8%A1%8C%E6%96%B9%E4%B8%8D%E6%98%8E?s_mode=s_tag_full\u0026amp;adult_mode=include\u0022 class=\u0022tag  user-activity\u0022 data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022data-activity-tag_name=\u0022\u9055\u548c\u611f\u304c\u884c\u65b9\u4e0d\u660e\u0022\u003E\u9055\u548c\u611f\u304c\u884c\u65b9\u4e0d\u660e\u003C\/a\u003E\u003Ca href=\u0022\/whitecube\/search\/%E5%AE%9F%E8%B3%AA%E4%B8%80%E6%8A%9E%E3%81%AA%E3%82%A2%E3%83%B3%E3%82%B1%E3%83%BC%E3%83%88?s_mode=s_tag_full\u0026amp;adult_mode=include\u0022 class=\u0022tag  user-activity\u0022 data-record-target=\u0022rpc\u0022data-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022data-activity-tag_name=\u0022\u5b9f\u8cea\u4e00\u629e\u306a\u30a2\u30f3\u30b1\u30fc\u30c8\u0022\u003E\u5b9f\u8cea\u4e00\u629e\u306a\u30a2\u30f3\u30b1\u30fc\u30c8\u003C\/a\u003E\u003C\/div\u003E\u003Cspan class=\u0022tag _work-tag-edit-modal-opener _ui-tooltip\u0022data-tooltip=\u0022Edit tags\u0022data-work-id=\u002256222236\u0022data-work-type=\u0022illust\u0022data-work-search-type=\u0022all\u0022data-work-adult-mode=\u0022exclude\u0022\u003E\u003Ci class=\u0022_pico-20 _icon-pencil\u0022\u003E\u003C\/i\u003E\u003C\/span\u003E\u003Cscript class=\u0022template-tag-item\u0022 type=\u0022text\/x-handlebars-template\u0022\u003E\u003Ca href=\u0022{{tagSearchUrl}}\u0022 class=\u0022tag {{#if self}}author{{\/if}} user-activity\u0022 data-record-target=\u0022rpc\u0022\ndata-activity-type=\u0022whitecube_tag_click\u0022 data-activity-zone=\u0022tag_illust_modal_tags\u0022\ndata-activity-tag_name=\u0022{{tag}}\u0022\u003E{{tag}}\u003C\/a\u003E\u003C\/script\u003E\u003Cdiv class=\u0022title-container\u0022\u003E\u003Ch1 class=\u0022_title\u0022\u003E\u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605\u003C\/h1\u003E\u003C\/div\u003E\u003Cdiv class=\u0022description-container ui-expander-container\u0022\u003E\u003Cdiv class=\u0022description-text ui-expander-target\u0022\u003E\u30c8\u30ac\u3061\u3083\u3093\u304b\u308f\u3044\u3044\u597d\u304d\u3059\u304e\u308b\u003C\/div\u003E\u003Cdiv class=\u0022expand _clickable\u0022\u003E\u003Cspan class=\u0022_icon-text\u0022\u003EContinue reading\u003C\/span\u003E\u003Ci class=\u0022_pico-12 _icon-menu\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Ciframe sandbox=\u0022allow-scripts allow-top-navigation allow-popups allow-popups-to-escape-sandbox allow-forms\u0022 style=\u0022display:block;margin:auto\u0022 width=\u0022730\u0022 height=\u0022100\u0022 scrolling=\u0022no\u0022 frameborder=\u00220\u0022 src=\u0022\/text_ads.php?type=1\u0026amp;channel=kobetsuue\u0022 name=\u0022kobetsuue\u0022\u003E\u003C\/iframe\u003E\u003Csection class=\u0022content-container illust\u0022\u003E\u003Cdiv class=\u0022main wrapper   \u0022\u003E\u003Cdiv class=\u0022illust-zoom-in thumbnail-container\u0022 data-original-src=\u0022https:\/\/i1.pixiv.net\/img-original\/img\/2016\/04\/06\/19\/14\/49\/56222236_p0.png\u0022 style=\u0022height:1400px;\u0022\u003E\u003Cimg data-src=\u0022https:\/\/i.pximg.net\/img-master\/img\/2016\/04\/06\/19\/14\/49\/56222236_p0_master1200.jpg\u0022 alt=\u0022\u0022 class=\u0022thumbnail\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/section\u003E\u003Ciframe sandbox=\u0022allow-scripts allow-top-navigation allow-popups allow-popups-to-escape-sandbox allow-forms\u0022 style=\u0022display:block;margin:auto\u0022 width=\u0022730\u0022 height=\u0022100\u0022 scrolling=\u0022no\u0022 frameborder=\u00220\u0022 src=\u0022\/text_ads.php?type=1\u0026amp;channel=kobetsushita\u0022 name=\u0022kobetsushita\u0022\u003E\u003C\/iframe\u003E\u003Csection class=\u0022additional-container feedback-area-container\u0022\u003E\u003Ca class=\u0022share twitter\u0022 href=\u0022https:\/\/twitter.com\/intent\/tweet?text=%E2%98%85%E2%98%86%E3%83%88%E3%82%AC%E3%83%92%E3%83%9F%E3%82%B3%E2%98%86%E2%98%85%20%7C%20Tocky\u0026amp;hashtags=pixiv\u0026amp;url=http%3A%2F%2Fwww.pixiv.net%2Fmember_illust.php%3Fmode%3Dmedium%26illust_id%3D56222236\u0022 target=\u0022_blank\u0022\u003E\u003Ci class=\u0022_pico-20 _icon-logo-twitter\u0022\u003E\u003C\/i\u003E\u003C\/a\u003E\u003Ca class=\u0022share facebook\u0022 href=\u0022https:\/\/www.facebook.com\/sharer\/sharer.php?u=http%3A%2F%2Fwww.pixiv.net%2Fmember_illust.php%3Fmode%3Dmedium%26illust_id%3D56222236\u0022 target=\u0022_blank\u0022\u003E\u003Ci class=\u0022_pico-20 _icon-logo-facebook\u0022\u003E\u003C\/i\u003E\u003C\/a\u003E\u003Cform class=\u0022comment-form submit-comment user-activity\u0022action=\u0022\/rpc\/post_comment.php\u0022data-work-type=\u0022illust\u0022data-record-target=\u0022rpc\u0022 data-activity-type=\u0022whitecube_generic_click\u0022 data-activity-zone=\u0022comment_posted\u0022\u003E\u003Cinput class=\u0022comment-type-selector\u0022 type=\u0022hidden\u0022 name=\u0022type\u0022 value=\u0022comment\u0022\u003E\u003Ctextarea class=\u0022comment-text-form\u0022 name=\u0022comment\u0022 maxlength=\u0022140\u0022 placeholder=\u0022\u3088\u304b\u3063\u305f\u3068\u3053\u308d\u3001\u9762\u767d\u304b\u3063\u305f\u3068\u3053\u308d\u3092\u30b3\u30e1\u30f3\u30c8\u3057\u3088\u3046\u0022\u003E\u003C\/textarea\u003E\u003Cbutton class=\u0022post\u0022 title=\u0022Comment\u0022\u003E\u003C\/button\u003E\u003Cinput type=\u0022hidden\u0022 name=\u0022author_user_id\u0022 value=\u002235905\u0022\u003E\u003Cinput type=\u0022hidden\u0022 name=\u0022illust_id\u0022 value=\u002256222236\u0022\u003E\u003Cdiv class=\u0022blocker\u0022\u003E\u003C\/div\u003E\u003C\/form\u003E\u003Ca href=\u0022\/bookmark_add.php?type=illust\u0026amp;illust_id=56222236\u0022title=\u0022Like!\u0022class=\u0022like-action for-work-modal add  illust-bookmark-56222236 \u0022data-id=\u002256222236\u0022data-type=\u0022illust\u0022data-user-id=\u002235905\u0022\u003E\u003C\/a\u003E\u003C\/section\u003E\u003Csection class=\u0022additional-container author-info-container\u0022\u003E\u003Cdiv class=\u0022wrapper sub-container\u0022\u003E\u003Caside class=\u0022other-works-container lazy-content\u0022data-req=\u0022\/rpc\/whitecube\/index.php?mode=modal_details_other_works\u0026amp;work_id=56222236\u0022data-lazy-actions=\u0022xhr\u0022\u003E\u003Csection class=\u0022other-works\u0022\u003E\u003Cul class=\u0022_work-items-square _work-items\u0022\u003E\u003Cli class=\u0022item\u0022\u003E\u003C\/li\u003E\u003Cli class=\u0022item\u0022\u003E\u003C\/li\u003E\u003Cli class=\u0022item\u0022\u003E\u003C\/li\u003E\u003Cli class=\u0022item\u0022\u003E\u003C\/li\u003E\u003Cli class=\u0022item\u0022\u003E\u003C\/li\u003E\u003C\/ul\u003E\u003C\/section\u003E\u003C\/aside\u003E\u003Cdiv class=\u0022info-bottom author-info\u0022\u003E\u003Cdiv class=\u0022user-name-container\u0022\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\u0022 class=\u0022_user-icon size-40 user-view-popup\u0022 data-user_id=\u002235905\u0022 style=\u0022background-image:url(https:\/\/i.pximg.net\/user-profile\/img\/2012\/12\/11\/02\/48\/13\/5524016_d4de0ba73ef7f0858d15fce68a50df10_170.jpg)\u0022\u003E\u003C\/a\u003E\u003Cdiv class=\u0022user-name\u0022\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\u0022 class=\u0022user-view-popup\u0022 data-user_id=\u002235905\u0022\u003ETocky\u003C\/a\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_follow-button-container\u0022\u003E\u003Cdiv class=\u0022_follow-button \u0022\u003E\u003Cbutton class=\u0022_action-button follow user-activity\u0022 data-user_id=\u002235905\u0022data-record-target=\u0022rpc\u0022 data-activity-type=\u0022whitecube_follow_click\u0022 data-activity-zone=\u0022wc_modal\u0022data-activity-followed_user_id=\u002235905\u0022\u003E\u003Ci class=\u0022_pico-12 _icon-add\u0022\u003E\u003C\/i\u003E\u003Cspan class=\u0022_icon-text\u0022\u003EFollow\u003C\/span\u003E\u003C\/button\u003E\u003Cbutton class=\u0022_action-button edit user-activity\u0022 data-user_id=\u002235905\u0022data-record-target=\u0022rpc\u0022 data-activity-type=\u0022whitecube_unfollow_click\u0022 data-activity-zone=\u0022wc_modal\u0022data-activity-followed_user_id=\u002235905\u0022\u003E\u003Ci class=\u0022_pico-12 _icon-smile\u0022\u003E\u003C\/i\u003E\u003Cspan class=\u0022_icon-text\u0022\u003EFollowing\u003C\/span\u003E\u003C\/button\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_balloon-menu-opener arrow _follow-button \u0022data-id=\u002235905\u0022data-user-id=\u002235905\u0022data-type=\u0022user\u0022data-user-name=\u0022Tocky\u0022data-permalink=\u0022http:\/\/www.pixiv.net\/member.php?id=35905\u0022\u003E\u003Cspan class=\u0022_action-button follow _hidden\u0022 data-user_id=\u002235905\u0022\u003E\u003C\/span\u003E\u003Ci class=\u0022_pico-12 _icon-menu\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022user-comment ui-expander-container\u0022\u003E\u003Cdiv class=\u0022ui-expander-target\u0022\u003E\u30a8\u30ed\u3044\u306e\u306f\u7537\u306e\u7f6a\u003Cbr \/\u003E\u003Cbr \/\u003E\u305d\u308c\u3092\u8a31\u3055\u306a\u3044\u306e\u306f\u5973\u306e\u7f6a\u003Cbr \/\u003E\u003Cbr \/\u003E(\u00b4\uff65\u03c9\uff65`)\u003Cbr \/\u003E\u003Cbr \/\u003E\u003Cbr \/\u003E\u003Cbr \/\u003E\u3064\u3044\u3063\u305f\u3063\u305f\u3088.\uff61\uff9f+.(\uff65\u2200\uff65)\uff9f+.\uff9f\u003Cbr \/\u003E\u003Ca href=\u0022\/jump.php?http%3A%2F%2Ftwitter.com%2FTocky18\u0022 target=\u0022_blank\u0022\u003Ehttp:\/\/twitter.com\/Tocky18\u003C\/a\u003E\u003C\/div\u003E\u003Cdiv class=\u0022expand _clickable\u0022\u003E\u003Cspan class=\u0022_icon-text\u0022\u003EContinue reading\u003C\/span\u003E\u003Ci class=\u0022_pico-12 _icon-menu\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_guide _guide-box _whitecube-guide-follow arrow-reverse\u0022\u003E\u003Cdiv class=\u0022explain\u0022\u003ELet\u2019s follow the users you like!\u003C\/div\u003E\u003Ci class=\u0022_guide-close _pico-12 _icon-remove\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_guide _guide-detail-box _whitecube-guide-follow-detail\u0022\u003E\u003Cdiv class=\u0022guide-detail\u0022\u003E\u003Cdiv class=\u0022user-icon\u0022\u003E\u003Ca href=\u0022\/whitecube\/user\/35905\u0022 class=\u0022_user-icon size-80 user-view-popup\u0022 data-user_id=\u002235905\u0022 style=\u0022background-image:url(https:\/\/i.pximg.net\/user-profile\/img\/2012\/12\/11\/02\/48\/13\/5524016_d4de0ba73ef7f0858d15fce68a50df10_170.jpg)\u0022\u003E\u003C\/a\u003E\u003C\/div\u003E\u003Ci class=\u0022_guide-close _pico-12 _icon-remove\u0022\u003E\u003C\/i\u003E\u003Cdiv class=\u0022explain-title\u0022\u003EYou followed  Tocky.\u003C\/div\u003E\u003Chr\u003E\u003Cdiv class=\u0022explain\u0022\u003EYou will receive the latest news about Tocky through the \u003Ca href=\u0022\/whitecube\/all\/latest\/follow\u0022\u003E\u201cNew Updates from Following\u201d\u003C\/a\u003E and through notifications.\u003Cbr\u003EIt is now easier to recommend you to users and artworks similar to Tocky.\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022select-list\u0022\u003E\u003Cbutton class=\u0022_guide-close _action-button large ok\u0022\u003EOK\u003C\/button\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_guide _guide-box _whitecube-guide-follow-edit arrow-reverse\u0022\u003E\u003Cdiv class=\u0022explain\u0022\u003EYou can edit it by clicking it again\u003C\/div\u003E\u003Ci class=\u0022_guide-close _pico-12 _icon-remove\u0022\u003E\u003C\/i\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/section\u003E\u003Csection class=\u0022additional-container ad-info-container\u0022\u003E\u003Cdiv style=\u0027width:728px; height:90px; margin-left:auto; margin-right:auto;\u0027\u003E\u003Ciframe class=\u0022lazy-content\u0022name=\u0022w_super\u0022width=\u0022728\u0022height=\u002290\u0022data-src=\u0022http:\/\/d.pixiv.org\/show?zone_id=w_super\u0026segments=abroad\u0026format=html\u0026pla_referer_page_name=pixiv\u0026K=1483b250c68ce\u0026num=581798c0357\u0022\u003E\u003C\/iframe\u003E\u003C\/div\u003E\u003C\/section\u003E\u003Csection class=\u0022additional-container comment-info-container\u0022\u003E\u003Cdiv class=\u0022wrapper sub-container\u0022\u003E\u003Cdiv class=\u0022main-content-container _unit\u0022\u003E\u003Cdiv class=\u0022comment-input-container\u0022\u003E\u003Ch1 class=\u0022_label\u0022\u003EResponse\u003C\/h1\u003E\u003Cdiv class=\u0022_count-badge comment-count\u0022\u003E10\u003C\/div\u003E\u003Cform class=\u0022submit-comment user-activity\u0022action=\u0022\/rpc\/post_comment.php\u0022data-work-type=illustdata-record-target=\u0022rpc\u0022 data-activity-type=\u0022whitecube_generic_click\u0022 data-activity-zone=\u0022comment_posted\u0022\u003E\u003Cdiv class=\u0022_user-icon own-account\u0022 style=\u0022background-image:url(https:\/\/i.pximg.net\/user-profile\/img\/2016\/10\/23\/01\/45\/40\/11655252_8573bf8e2e396a90da4dd05e09365642_50.png);\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022form-container\u0022\u003E\u003Cinput class=\u0022comment-type-selector\u0022 type=\u0022radio\u0022 name=\u0022type\u0022 value=\u0022comment\u0022 checked\u003E\u003Cdiv class=\u0022comment-text comment-type\u0022\u003E\u003Ctextarea class=\u0022comment-text-form\u0022 name=\u0022comment\u0022 maxlength=\u0022140\u0022\u003E\u003C\/textarea\u003E\u003Cbutton class=\u0022post\u0022 title=\u0022Comment\u0022\u003E\u003C\/button\u003E\u003Cdiv\u003E\u003Cdiv class=\u0022tab-label checked\u0022\u003EComments\u003C\/div\u003E\u003Cdiv class=\u0022tab-label\u0022\u003EStickers\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cinput class=\u0022comment-type-selector\u0022 type=\u0022radio\u0022 name=\u0022type\u0022 value=\u0022stamp\u0022\u003E\u003Cdiv class=\u0022comment-stamp comment-type\u0022\u003E\u003Cinput class=\u0022stamp-series-selector\u0022 type=\u0022radio\u0022 name=\u0022_stamp_series\u0022 value=\u0022hakuzou\u0022 checked\u003E\u003Cdiv class=\u0022stamp-gallery\u0022\u003E\u003Cdiv class=\u0022stamp-series-buttons\u0022\u003E\u003Cdiv class=\u0022stamp-series-selector active\u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/hakuzou.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/kitsune.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/moemusume.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/dokurochan.png)\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022301\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/301_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022302\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/302_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022303\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/303_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022304\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/304_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022305\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/305_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022306\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/306_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022307\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/307_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022308\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/308_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022309\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/309_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022310\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/310_s.jpg\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cinput class=\u0022stamp-series-selector\u0022 type=\u0022radio\u0022 name=\u0022_stamp_series\u0022 value=\u0022kitsune\u0022 \u003E\u003Cdiv class=\u0022stamp-gallery\u0022\u003E\u003Cdiv class=\u0022stamp-series-buttons\u0022\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/hakuzou.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector active\u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/kitsune.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/moemusume.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/dokurochan.png)\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022401\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/401_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022402\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/402_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022403\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/403_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022404\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/404_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022405\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/405_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022406\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/406_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022407\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/407_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022408\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/408_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022409\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/409_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022410\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/410_s.jpg\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cinput class=\u0022stamp-series-selector\u0022 type=\u0022radio\u0022 name=\u0022_stamp_series\u0022 value=\u0022moemusume\u0022 \u003E\u003Cdiv class=\u0022stamp-gallery\u0022\u003E\u003Cdiv class=\u0022stamp-series-buttons\u0022\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/hakuzou.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/kitsune.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector active\u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/moemusume.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/dokurochan.png)\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022201\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/201_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022202\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/202_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022203\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/203_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022204\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/204_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022205\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/205_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022206\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/206_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022207\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/207_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022208\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/208_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022209\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/209_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022210\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/210_s.jpg\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cinput class=\u0022stamp-series-selector\u0022 type=\u0022radio\u0022 name=\u0022_stamp_series\u0022 value=\u0022dokurochan\u0022 \u003E\u003Cdiv class=\u0022stamp-gallery\u0022\u003E\u003Cdiv class=\u0022stamp-series-buttons\u0022\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/hakuzou.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/kitsune.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector \u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/moemusume.png)\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-series-selector active\u0022 style=\u0022background-image:url(https:\/\/source.pixiv.net\/common\/images\/stamp\/main\/dokurochan.png)\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022101\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/101_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022102\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/102_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022103\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/103_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022104\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/104_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022105\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/105_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022106\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/106_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022107\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/107_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022108\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/108_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022109\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/109_s.jpg\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp\u0022\u003E\u003Cinput class=\u0022stamp-id\u0022 type=\u0022radio\u0022 name=\u0022stamp_id\u0022 value=\u0022110\u0022\u003E\u003Cimg class=\u0022stamp lazy-content\u0022 data-src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/110_s.jpg\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022stamp-gallery-dummy\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/301_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/302_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/303_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/304_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/305_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/306_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/307_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/308_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/309_s.jpg\u0022\u003E\u003Cimg class=\u0022stamp\u0022 src=\u0022https:\/\/source.pixiv.net\/common\/images\/stamp\/stamps\/310_s.jpg\u0022\u003E\u003Cdiv style=\u0022clear:both;\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv\u003E\u003Cdiv class=\u0022tab-label\u0022\u003EComments\u003C\/div\u003E\u003Cdiv class=\u0022tab-label checked\u0022\u003EStickers\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022lockout-bar\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cinput type=\u0022hidden\u0022 name=\u0022author_user_id\u0022 value=\u002235905\u0022\u003E\u003Cinput type=\u0022hidden\u0022 name=\u0022illust_id\u0022 value=\u002256222236\u0022\u003E\u003Cdiv class=\u0022blocker\u0022\u003E\u003C\/div\u003E\u003C\/form\u003E\u003C\/div\u003E\u003Cdiv class=\u0022comment-container init \u0022 data-init-url=\u0022\/rpc\/whitecube\/index.php?mode=whitecube_get_more_comments\u0026amp;work_id=56222236\u0026amp;num=30\u0026amp;offset=0\u0026amp;work_type=illust\u0022 data-get-comment-path=\u0022\/rpc\/whitecube\/index.php?mode=whitecube_get_comment\u0026amp;type=illust\u0022\u003E\u003Cdiv class=\u0022_comment-items\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_comments-load-more lazy-content\u0022 data-lazy-actions=\u0022click\u0022 data-next-url=\u0022\/rpc\/whitecube\/index.php?mode=whitecube_get_more_comments\u0026amp;work_id=56222236\u0026amp;num=30\u0026amp;offset=0\u0026amp;work_type=illust\u0022\u003E\u003Cdiv class=\u0022more-text\u0022\u003EView more\u003C\/div\u003E\u003Cdiv class=\u0022animation\u0022\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003Cdiv class=\u0022community-content-container\u0022\u003E\u003Caside class=\u0022image-response-works-container lazy-content\u0022data-req=\u0022\/rpc\/whitecube\/index.php?mode=modal_details_image_response_works\u0026amp;work_id=56222236\u0026amp;work_type=illust\u0026amp;limit=3\u0026amp;offset=0\u0022data-lazy-actions=\u0022xhr\u0022\u003E\u003C\/aside\u003E\u003Cdiv class=\u0022ad\u0022\u003E\u003Cdiv style=\u0027width:300px; height:250px; margin-left:auto; margin-right:auto;\u0027\u003E\u003Ciframe class=\u0022lazy-content\u0022name=\u0022w_illust_rectangle\u0022width=\u0022300\u0022height=\u0022250\u0022data-src=\u0022http:\/\/d.pixiv.org\/show?zone_id=w_illust_rectangle\u0026segments=abroad\u0026format=html\u0026pla_referer_page_name=pixiv\u0026K=1483b250c68ce\u0026num=581798c0796\u0022\u003E\u003C\/iframe\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/section\u003E\u003Csection class=\u0022additional-container _work-shortcut-container\u0022\u003E\u003Cdl\u003E\u003Cdt\u003E\u003Ckbd\u003E\u2190\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003EPrevious\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003E\u2192\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003ENext\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003EShift+\u2190\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003EThe illustrator\u2019s previous upload\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003EShift+\u2192\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003ECreator\u2019s next work\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003E\u2191\u003Cspan class=\u0022or\u0022\u003E\/\u003C\/span\u003EK\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003EPrevious page\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003E\u2193\u003Cspan class=\u0022or\u0022\u003E\/\u003C\/span\u003EJ\u003Cspan class=\u0022or\u0022\u003E\/\u003C\/span\u003ESPACE\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003ENext page\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003EV\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003EShow original\u003C\/dd\u003E\u003C\/dl\u003E\u003Cdl\u003E\u003Cdt\u003E\u003Ckbd\u003EC\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003EComments\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003EL\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003ELike!\u003C\/dd\u003E\u003Cdt\u003E\u003Ckbd\u003EESC\u003C\/kbd\u003E\u003C\/dt\u003E\u003Cdd\u003EClose\u003C\/dd\u003E\u003C\/dl\u003E\u003C\/section\u003E\u003Csection class=\u0022additional-container related-works-container\u0022\u003E\u003Cdiv class=\u0022wrapper sub-container\u0022\u003E\u003Caside class=\u0022big related-container _work-items lazy-content\u0022data-req=\u0022\/rpc\/whitecube\/index.php?mode=modal_details_related_works\u0026amp;work_id=56222236\u0026amp;work_type=illust\u0026amp;limit=50\u0026amp;offset=0\u0022data-context=\u0022related\u0022data-lazy-actions=\u0022xhr\u0022data-lazy-require=\u0022next-url\u0022data-unique-entries=\u0022\u0022data-show-ad=\u0022\u0022\u003E\u003C\/aside\u003E\u003C\/div\u003E\u003Cdiv class=\u0022timeline-load-more-modal auto\u0022\u003E\u003Cdiv class=\u0022animation\u0022\u003E\u003C\/div\u003E\u003Cdiv class=\u0022_mute-ui _hidden\u0022\u003E\u003Cdiv class=\u0022notice\u0022\u003E\u003Cspan class=\u0022few\u0022\u003EYou\u0027ve muted many submissions.\u003C\/span\u003E\u003Cspan class=\u0022zero _hidden\u0022\u003E\u003Cspan class=\u0022tag\u0022\u003E\u003C\/span\u003E is currently muted\u003C\/span\u003E\u003C\/div\u003E\u003Cdiv class=\u0022open-mute-edit-modal\u0022\u003E\u003Cspan class=\u0022_clickable\u0022\u003E\u003Cspan class=\u0022_icon-text\u0022\u003ESee \u0022mute\u0022 settings\u003C\/span\u003E\u003Ci class=\u0022_pico-12 _icon-detail\u0022\u003E\u003C\/i\u003E\u003C\/span\u003E\u003C\/div\u003E\u003Cdiv class=\u0022continue _action-button\u0022\u003EContinue browsing\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/section\u003E\u003Cdiv class=\u0022_hidden\u0022\u003E\u003Cdiv class=\u0022multi-ads-area item-container _ad-item-container\u0022\u003E\u003Cdiv class=\u0022main\u0022\u003E\u003Cdiv style=\u0022position: relative;\u0022\u003E\u003Cdiv style=\u0022position: absolute; left: 0; top: 0; width: 300px; height: 250px; background-color: #ffffff;\u0022\u003E\u003C\/div\u003E\u003Cdiv style=\u0022position: relative;\u0022\u003E\u003Cdiv style=\u0027width:300px; height:270px; margin-left:auto; margin-right:auto;\u0027\u003E\u003Ciframe class=\u0022immediate-content\u0022name=\u0022w_feed_rectangle\u0022width=\u0022300\u0022height=\u0022300\u0022data-src=\u0022http:\/\/d.pixiv.org\/show?zone_id=w_feed_rectangle\u0026segments=abroad\u0026format=html\u0026pla_referer_page_name=pixiv\u0026K=1483b250c68ce\u0026num=581798c0555\u0022\u003E\u003C\/iframe\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E\u003C\/div\u003E","page_url":"\/whitecube\/user\/35905\/illust\/56222236","page_title":"\u2605\u2606\u30c8\u30ac\u30d2\u30df\u30b3\u2606\u2605 - Tocky - pixiv"}}


https://www.pixiv.net/rpc/whitecube/index.php?mode=modal_details_other_works&work_id=56222236&tt=e0f76a97ae515f96fe347faec9a2b0a2

https://www.pixiv.net/rpc/whitecube/index.php?mode=modal_details_image_response_works&work_id=56222236&work_type=illust&limit=3&offset=0&tt=e0f76a97ae515f96fe347faec9a2b0a2
*/