// ==UserScript==
// @name         Humble Choice Steam Links
// @namespace    https://greasyfork.org/en/scripts/415686-humble-choice-steam-links
// @version      0.3
// @description  Add direct steam links to Humble Choice
// @author       Tusk
// @match        https://www.humblebundle.com/membership/*
// @grant        GM_xmlhttpRequest
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/415686/Humble%20Choice%20Steam%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/415686/Humble%20Choice%20Steam%20Links.meta.js
// ==/UserScript==

var STEAM_URL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/?format=json';
var STEAM_APP_IDS1;
var STEAM_APP_IDS2;
var WORDS_TO_REMOVE = ['Deluxe Edition', 'Early Access', 'Digital Edition', 'Ultimate Edition', 'Gold Edition'];

(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        setTimeout(function() {
            urlChange();
        }, 200);
        return pushState.apply(history, arguments);
    };
})(window.history);

function addButton(url, text, color='rgba(62, 126, 167, 0.8)') {
    let titleSpan = $('div.humblemodal-modal--open h2.title');
    titleSpan.after(`<a style="font-size:12px;color: white;display: inline-block;text-transform: initial;border:1px solid #171a21;padding: 3px 7px;margin-right: 5px;background: ${color};border-radius: 10px;text-decoration: none;" href="${url}" target="_blank">${text}</a>`);
}

function urlChange() {
    let titleSpan = $('div.humblemodal-modal--open h2.title');
    let name = titleSpan.text().trim();
    WORDS_TO_REMOVE.forEach(function(word) {name = name.replace(word, '')});
    name = name.trim();
    if(name) {
        let searchURL = `https://store.steampowered.com/search/?term=${name}`
        addButton(searchURL, 'Search Steam', 'red')
        findGameID(name);
    }
}

function findGameID(gameName) {
    let games = STEAM_APP_IDS1.concat(STEAM_APP_IDS2).filter((item) => item.name === gameName)
    games = _.uniqBy(games, 'appid');
    games.forEach(item => addButton(`https://store.steampowered.com/app/${item.appid}`, item.name));
}

function getAppIDs() {
    GM_xmlhttpRequest({
        method: "GET",
        url: `${STEAM_URL}&page=1`,
        onload: function(response) {
            let json = JSON.parse(response.responseText);
            STEAM_APP_IDS1 = json.applist.apps;
        }
    });
    GM_xmlhttpRequest({
        method: "GET",
        url: `${STEAM_URL}&page=2`,
        onload: function(response) {
            let json = JSON.parse(response.responseText);
            STEAM_APP_IDS2 = json.applist.apps;
        }
    });
}

(function() {
    'use strict';
    getAppIDs();
})();