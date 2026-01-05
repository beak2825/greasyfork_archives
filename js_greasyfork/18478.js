// ==UserScript==
// @name           MyAnimeList(MAL) - Anime Recommendations Filter
// @version        1.2.1
// @description    This script can hide recommendations that you already have on your list/don't have on your list
// @author         Cpt_mathix
// @match          https://myanimelist.net/anime/*
// @match          https://myanimelist.net/manga/*
// @match          https://myanimelist.net/anime/*/*/userrecs
// @match          https://myanimelist.net/manga/*/*/userrecs
// @match          https://myanimelist.net/anime.php?*
// @match          https://myanimelist.net/manga.php?*
// @exclude        /^https?:\/\/myanimelist\.net\/(anime|manga)\/[^0-9]+/
// @exclude        /^https?:\/\/myanimelist\.net\/(anime|manga)\/\d+\/.+\/(?!userrecs$)[^\s]/
// @license        GPL-2.0+; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant          GM_getValue
// @grant          GM_setValue
// @namespace      https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/18478/MyAnimeList%28MAL%29%20-%20Anime%20Recommendations%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/18478/MyAnimeList%28MAL%29%20-%20Anime%20Recommendations%20Filter.meta.js
// ==/UserScript==

var href = document.location.href;
var page = /^http.*:\/\/myanimelist\.net\/manga*/.test(href) ? 'manga' : 'anime';

var userrecs = href.indexOf('userrecs') > -1;
var version = '1.1.3';

// get user
var user = document.getElementsByClassName('header-profile-link')[0];
if (user) {
    user = user.textContent;
    init();
} else {
    console.log('Not logged in (Anime Recommendations Filter)');
}

function init() {
    // get header
    var AnchorLink;
    var allTextareas = document.getElementsByTagName('H2');
    for(var element in allTextareas) {
        if(allTextareas[element].textContent.indexOf("ecommendation") > -1) {
            AnchorLink = allTextareas[element];
            break;
        }
    }

    if (AnchorLink !== null) {
        addCheckboxes(AnchorLink);
        AnchorLink.id = "RecHeader";
    }

    if (userrecs) {
        startFilter1(getSetting('Rec'), getSetting('Rec2'));
    } else {
        scrollFunction();
        startFilter2(getSetting('Rec'), getSetting('Rec2'));
    }
}

function addCheckboxes(AnchorLink) {
    var checkbox1 = document.createElement('input');
    var checkbox2 = document.createElement('input');
    checkbox1.type = "checkbox";
    checkbox2.type = "checkbox";
    checkbox1.className = "checkbox";
    checkbox2.className = "checkbox";
    checkbox1.name = "Rec";
    checkbox2.name = "Rec";
    checkbox1.id = "Rec";
    checkbox2.id = "Rec2";
    checkbox1.title = "Hide entries on your list";
    checkbox2.title = "Hide entries that are not on your list";
    checkbox1.checked = getSetting("Rec");
    checkbox2.checked = getSetting("Rec2");
    checkbox1.addEventListener('change', function(e) {
        addClickEvent(e);
    });
    checkbox2.addEventListener('change', function(e) {
        addClickEvent(e);
    });
    AnchorLink.appendChild(checkbox1);
    AnchorLink.appendChild(checkbox2);
}

function scrollFunction() {
    var right = document.querySelector('#' + page + '_recommendation > div.btn-anime-slide-side.right > span');
    var left = document.querySelector('#' + page + '_recommendation > div.btn-anime-slide-side.left > span');

    if (right !== null) {
        var elCloneR = right.cloneNode(true);
        right.parentNode.replaceChild(elCloneR, right);
        elCloneR.onclick = function() {
            scrollRight();
        };
    }

    if (left !== null) {
        var elCloneL = left.cloneNode(true);
        left.parentNode.replaceChild(elCloneL, left);
        elCloneL.onclick = function() {
            scrollLeft();
        };
    }
}

function scrollRight() {
    var ul = document.querySelector('#' + page + '_recommendation > div.anime-slide-outer > ul');
    var li = ul.querySelectorAll('li:not(.hidden):not(.off)');

    if (li.length > 7) {
        for(var i = 0; i < 7; i++) {
            if (typeof jQuery == 'undefined') {
                li[i].setAttribute('style', 'display:none !important');
            } else {
                $(li[i]).animate({width: 'toggle'}, "fast");
            }
            li[i].classList.add('off');
        }
    }
}

function scrollLeft() {
    var ul = document.querySelector('#' + page + '_recommendation > div.anime-slide-outer > ul');
    var li = ul.querySelectorAll('li.off:not(.hidden)');

    if (li.length > 0) {
        for(var i = li.length - 1; i >= li.length - 7 && i >= 0; i--) {
            if (typeof jQuery == 'undefined') {
                li[i].setAttribute('style', 'display:inline-block; width: 90px;');
            } else {
                $(li[i]).animate({width: 'toggle'}, "fast");
            }
            li[i].classList.remove('off');
        }
    }
}

function startFilter1(conditionEdit, conditionAdd) {
    // get Anime/Manga Entries on current page
    var allElements;
    allElements = document.evaluate(
        '//*[@class="borderClass"]/table/tbody/tr/td[2]/div[2]/a[2]',
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    for (var i = 0; i < allElements.snapshotLength; i++) {
        var EditLink = allElements.snapshotItem(i);
        if (conditionEdit && EditLink.className.indexOf('button_edit') > -1) {
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
        } else if (conditionAdd && EditLink.className.indexOf('button_add') > -1) {
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
        } else {
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="";
        }
    }

}

async function startFilter2(conditionNotOnList, conditionOnList) {
    // get Anime/Manga Entries on current page
    var allElements;
    allElements = document.evaluate(
        '//*[@id="' + page + '_recommendation"]/div[3]/ul/li[*]',
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    var list = /^http.*:\/\/myanimelist\.net\/manga*/.test(document.location.href) ? flatten(await tryCachedUserList(user, "manga")) : flatten(await tryCachedUserList(user, "anime"));

    for (var i = 0; i < allElements.snapshotLength; i++) {
        var linkEl = allElements.snapshotItem(i).firstChild;
        var href = linkEl.href;
        var id = href.match(/\d+/g);
        var self = document.location.href.match(/\d+/g)[0];

        if(linkEl.parentNode.classList.contains("off")) {
            linkEl.parentNode.classList.remove("off");
            linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
        }

        if (conditionNotOnList) {
            if (self != id[0] && haveListHit(list, id[0])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
                linkEl.parentNode.classList.add("hidden");
            } else if (id[1] !== undefined && self != id[1] && haveListHit(list, id[1])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
                linkEl.parentNode.classList.add("hidden");
            } else {
                linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
                linkEl.parentNode.classList.remove("hidden");
            }
        } else if (conditionOnList) {
            if (self != id[0] && !haveListHit(list, id[0])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
                linkEl.parentNode.classList.add("hidden");
            } else if (id[1] !== undefined && self != id[1] && !haveListHit(list, id[1])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
                linkEl.parentNode.classList.add("hidden");
            } else {
                linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
                linkEl.parentNode.classList.remove("hidden");
            }
        } else {
            linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
            linkEl.parentNode.classList.remove("hidden");
        }
    }
}

function haveListHit(list, id) {
    return list[id];
}

function flatten(list) {
    let map = {};
    for (let item of list) {
        map[item.anime_id] = item;
    }
    return map;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryCachedUserList(user, type) {
    let userlistWrapper = localStorage.getItem('MAL#' + type + 'list');

    if (userlistWrapper) {
        userlistWrapper = JSON.parse(userlistWrapper);
    }

    if (!(userlistWrapper && userlistWrapper.fetchDate && ((new Date() - new Date(userlistWrapper.fetchDate)) / 3600000 < 1))) {
        let userlist = await fetchUserList(user, type);
        userlistWrapper = {
            "userlist": userlist,
            "fetchDate": new Date()
        }
        localStorage.setItem('MAL#' + type + 'list', JSON.stringify(userlistWrapper));
    }

    return userlistWrapper.userlist;
}

async function fetchUserList(user, type, userlist = [], page = 1) {
    await fetch('https://myanimelist.net/' + type + 'list/' + user + '/load.json?offset=' + ((page - 1) * 300)).then(function(response) {
        return response.json();
    }).then(async function(json) {
        userlist = userlist.concat(json);

        if (json.length !== 0) {
            await timeout(1000);
            userlist = await fetchUserList(user, type, userlist, ++page);
        }
    });

    return userlist;
}

// Save a setting of type = value (true or false)
function saveSetting(type, value) {
    GM_setValue('MALRec_' + type + version, value);
}

// Get a setting of type
function getSetting(type) {
    var value = GM_getValue('MALRec_' + type + version);
    if (value) {
        return value;
    } else {
        return false;
    }
}

function addClickEvent(e) {
    var clickedCheckbox = e.target;
    var checkboxes = document.getElementsByName('Rec');

    for(var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].id != clickedCheckbox.id) {
            checkboxes[i].checked = false;
            saveSetting(checkboxes[i].id, false);
        } else {
            saveSetting(checkboxes[i].id, checkboxes[i].checked);
        }
    }

    if (userrecs) {
        startFilter1(getSetting('Rec'), getSetting('Rec2'));
    } else {
        startFilter2(getSetting('Rec'), getSetting('Rec2'));
    }
}