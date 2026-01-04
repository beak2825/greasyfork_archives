// ==UserScript==
// @name         pixiv-hide-bar
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide bottom toolbar on Pixiv
// @author       蝙蝠の目
// @license      MIT
// @match        https://www.pixiv.net/artworks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443485/pixiv-hide-bar.user.js
// @updateURL https://update.greasyfork.org/scripts/443485/pixiv-hide-bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wait(ms) {
        return new Promise(resolve => {
            window.setTimeout(resolve, ms);
        });
    }

    function insertCSS(cssText) {
        const styleElement = document.createElement("style");
        styleElement.textContent = cssText;
        document.head.appendChild(styleElement);
    }

    function getDivs() {
        const res = [];
        for (const div of document.getElementsByTagName("div")) {
            if (div.style && div.style.transform && div.parentElement) {
                res.push(div.parentElement);
            }
        }
        return res;
        return [...document.getElementsByTagName("div")].filter(div => div.style.transform && div.parentElement);
    }

    function processDiv(div) {
        const cssText = ["", ...div.classList].join(".") + "{position: static !important;}";
        insertCSS(cssText);
    }

    async function main() {
        while (true) {
            await wait(1000);
            const divs = getDivs();
            for (const div of divs) processDiv(div);
        }
    }

    main();
})();