// ==UserScript==
// @name         Remove Roblox URL Tracking
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the newly implemented roblox URL tracking parameters.
// @author       ImFirstPlace
// @match        *://www.roblox.com/*
// @match        *://web.roblox.com/*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @run-at       document-start
// @noframes
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/441651/Remove%20Roblox%20URL%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/441651/Remove%20Roblox%20URL%20Tracking.meta.js
// ==/UserScript==

// For some reason userscripts run multiple times on roblox so noframes is added

(function() {
    'use strict';

    const knownTrackingParams = [
        "gameSetTypeId",
        "homePageSessionInfo",
        "SearchId",
        "gameSearchSessionInfo"
    ]

    function sanitizeURL(Url) {
        var urlSplit = Url.split("?")
        if (urlSplit.length >= 2) {
            const urlParams = new URLSearchParams(Url)

            // Game referring
            if (Url.includes("refer?") && urlParams.has("PlaceId")) {
                return `https://www.roblox.com/games/${urlParams.get("PlaceId")}`
            }

            // Library referring
            if (urlSplit[0].includes("/library/refer")) {
                const slashSplit = urlSplit[0].split("/")
                return `https://www.roblox.com/library/${slashSplit[5]}`
            }

            // General parameters
            for (const param of knownTrackingParams) {
                if (urlSplit[1].includes(param)) { // urlParams.has seems to not work with the homePageSessionInfo param
                    return urlSplit[0]
                }
            }
        }
        return false // Don't bother setting the url exact same thing!
    }

    function handleClick(e) {
        var a = e.target;

        while (a && !a.href) {
            a = a.parentElement;
        }

        if (!a) {
            return;
        }

        var realUrl = sanitizeURL(a.href)
        if (realUrl) {
            a.href = realUrl
        }
    }
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('touchstart', handleClick, true);
})();