// ==UserScript==
// @name         Geoguessr Reloader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Reloads Page
// @author       Reloader
// @match        https://www.geoguessr.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536727/Geoguessr%20Reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536727/Geoguessr%20Reloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver((mutations, obs) => {
        const pano = document.querySelector('div[class*="panorama"] canvas');
        const map = document.querySelector('div[class*="guess-map"]');
        const errorScreen = document.body.innerText.includes("Page not found");

        if (errorScreen) {
            console.warn("'Page not found' detected. Reloading page...");
            obs.disconnect();
            setTimeout(() => {
                location.reload();
            }, 100);
            return;
        }

        if (pano && map && !errorScreen) {
            console.log("Panorama and map loaded. Reloading...");
            obs.disconnect();
            location.reload();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();