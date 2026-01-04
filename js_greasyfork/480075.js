// ==UserScript==
// @name         [STEAM] Highlight My Products
// @namespace    [STEAM] Highlight My Products
// @description  Highlight My Products
// @version      0.1
// @author       el9in
// @license      el9in
// @match        https://steamcommunity.com/market*
// @match        https://steamcommunity.com/market/
// @match        https://steamcommunity.com/market/listings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/480075/%5BSTEAM%5D%20Highlight%20My%20Products.user.js
// @updateURL https://update.greasyfork.org/scripts/480075/%5BSTEAM%5D%20Highlight%20My%20Products.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let _saveSteamIDs = await GM.getValue("STEAM_My_Items", []);
    const href = window.location.href;
    if(href == "https://steamcommunity.com/market" || href == "https://steamcommunity.com/market/") {
        function start() {
            const myElements = document.querySelector("#tabContentsMyListings").querySelectorAll('[id*="mylisting_"]');
            myElements.forEach(function(element) {
                const match = element.id.match(/\d+/);
                if (match && _saveSteamIDs.indexOf(match[0]) === -1) {
                    element.style.backgroundColor = "#8B0000";
                    _saveSteamIDs.push(match[0]);
                    GM.setValue("STEAM_My_Items", _saveSteamIDs);
                } else if(_saveSteamIDs.indexOf(match[0]) !== -1) {
                    element.style.backgroundColor = "#00FF00";
                }
            });
        }
        setInterval(start, 1000);
    }

    const searchResultsRows = document.querySelector("#searchResultsRows");
    if(searchResultsRows) {
        function start() {
            console.log("I'll find.");
            const myElements = document.querySelectorAll('[id^="listing_"]');
            myElements.forEach(function(element) {
                const match = element.id.match(/\d+/);
                if (match && _saveSteamIDs.indexOf(match[0]) !== -1) {
                    element.style.backgroundColor = "#00FF00";
                }
            });
        }
        setInterval(start, 1000);
    }
    return;
})();