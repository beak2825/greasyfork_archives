// ==UserScript==
// @name         Less distracted reviews for WaniKani
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Either hides information on review and lesson counts or for the dashboard only gives you a rough idea of the order of magnitude.
// @author       John-John Tedro <udoprog@tedro.se>
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      Apache 2.0 OR MIT
// @downloadURL https://update.greasyfork.org/scripts/472280/Less%20distracted%20reviews%20for%20WaniKani.user.js
// @updateURL https://update.greasyfork.org/scripts/472280/Less%20distracted%20reviews%20for%20WaniKani.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".quiz-progress { display: none !important; }");
    GM_addStyle(".quiz-statistics { display: none !important; }");
    GM_addStyle(".forecast { display: none !important; }");

    let selector = ".lessons-and-reviews__button-count, .navigation-shortcut__count, .srs-progress li > span";

    let lessonsStyle = GM_addStyle(`${selector} { opacity: 0; }`);

    window.addEventListener("load", () => {
        for (let el of document.querySelectorAll(selector)) {
            let count = parseInt(el.textContent);

            if (count < 128) {
                el.textContent = `< 128`;
            } else {
                let n = Math.floor(Math.log2(count));
                let from = Math.pow(2, n);
                let to = Math.pow(2, n + 1);
                el.textContent = `${from} - ${to}`;
            }
        }

        lessonsStyle.remove();
    });
})();