// ==UserScript==
// @name           MyAnimeList(MAL) - Anime/Manga Entries Compare
// @description    This script compares anime and manga entries from your userlists with entries from anime detail page and bold similar ones
// @version        1.3.1
// @author         Cpt_mathix
// @namespace      https://greasyfork.org/users/16080
// @match          https://myanimelist.net/anime/*
// @match          https://myanimelist.net/manga/*
// @match          https://myanimelist.net/anime.php?*
// @match          https://myanimelist.net/manga.php?*
// @exclude        /^https?:\/\/myanimelist\.net\/(anime|manga)\/[^0-9]+/
// @exclude        /^https?:\/\/myanimelist\.net\/(anime|manga)\/\d+\/.+\/.+/
// @license        GPL-2.0-or-later
// @run-at         document-end
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/18094/MyAnimeList%28MAL%29%20-%20AnimeManga%20Entries%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/18094/MyAnimeList%28MAL%29%20-%20AnimeManga%20Entries%20Compare.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const version = "1.3.0";

const userName = window.MAL.USER_NAME;
if (!userName) return;

let initializing = true;
let animeList, mangaList;

init();

async function init() {
    animeList = await getUserList("anime");
    mangaList = await getUserList("manga");

    var linksOnPage = document.querySelectorAll("#content .related-entries a");

    for (let link of linksOnPage) {
        const match = link.href.match(/\/myanimelist.net\/(anime|manga)\/(\d+)\//);
        if (!match) continue;
        const [, type, id] = match;

        if (type === "anime" && isAnimeOnList(id)) {
            link.style.fontWeight = "bold";
        }

        if (type === "manga" && isMangaOnList(id)) {
            link.style.fontWeight = "bold";
        }
    }

    initializing = false;
}

function isAnimeOnList(id) {
    return animeList.hasOwnProperty(id);
}

function isMangaOnList(id) {
    return mangaList.hasOwnProperty(id);
}

async function getUserList(type, forceRefresh = false) {
    let userlistWrapper = getSetting(type + 'list', false);

    // Fetch userlist if it is older than 1 hour
    if (forceRefresh || (!(userlistWrapper?.fetchDate && ((new Date() - new Date(userlistWrapper.fetchDate)) / (60*60*1000) < 1)))) {
        const userlist = trimUserList(await fetchUserList(type));
        userlistWrapper = {
            "userlist": userlist,
            "fetchDate": new Date()
        };
        saveSetting(type + 'list', userlistWrapper, false);
    }

    return flatten(userlistWrapper.userlist);
}

async function fetchUserList(type, userlist = [], page = 1) {
    await fetch('https://myanimelist.net/' + type + 'list/' + userName + '/load.json?offset=' + ((page - 1) * 300)).then(function(response) {
        return response.json();
    }).then(async function(json) {
        userlist = userlist.concat(json);

        if (json.length !== 0) {
            await timeout(300);
            userlist = await fetchUserList(type, userlist, ++page);
        }
    });

    return userlist;
}

function trimUserList(userlist) {
    return userlist.map(entry => ({
        "id": entry.anime_id ?? entry.manga_id,
        "status": entry.status,
    }));
}

function saveSetting(key, value, hasVersion = true) {
    localStorage.setItem('MAL#' + key + (hasVersion ? '_' + version : ''), JSON.stringify(value));
}

function getSetting(key, hasVersion = true) {
    const value = localStorage.getItem('MAL#' + key + (hasVersion ? '_' + version : ''));
    if (value) {
        return JSON.parse(value);
    } else {
        return null;
    }
}

function flatten(list) {
    const map = {};
    for (let item of list) {
        map[item.id] = item;
    }
    return map;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}