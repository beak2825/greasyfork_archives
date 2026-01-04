// ==UserScript==
// @name         Hotkeys for webtoons.com navigation 2023
// @namespace    https://github.com/ChristopherLeitner
// @license      MIT
// @version      1.0
// @description  Add navigation hotkeys for Webtoons.com
// @author       CodeFox
// @match        https://www.webtoons.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/458658/Hotkeys%20for%20webtoonscom%20navigation%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/458658/Hotkeys%20for%20webtoonscom%20navigation%202023.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight') {
        var nextBtn = document.querySelector("[class*='pg_next']");
        if (nextBtn) {
          	console.log("Going to next page");
            nextBtn.click();
        }
    }
    if (event.code === 'ArrowLeft') {
        var prevBtn = document.querySelector("[class*='pg_prev']");
        if (prevBtn) {
            prevBtn.click();
        }
    }
}, true);