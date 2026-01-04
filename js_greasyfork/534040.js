// ==UserScript==
// @name         Mokuro.moe Better Chrome's Translate
// @namespace    PlanetXX2
// @version      2025-04-26
// @description  Better translation for mokuro.moe's html manga, also rotated vertical japanese text to horizontal when translating to other languages
// @author       You
// @match        https://mokuro.moe/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mokuro.moe
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534040/Mokuromoe%20Better%20Chrome%27s%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/534040/Mokuromoe%20Better%20Chrome%27s%20Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // replace all .textBox p with .textBox span
    // so that Google Translate can inline the text
    // which in result, provides better translation
    document.querySelectorAll('.textBox p').forEach(p => {
        const span = document.createElement('span');
        span.innerHTML = p.innerHTML;
        p.parentNode.replaceChild(span, p);
    });

    GM_addStyle(`
    .textBox:hover:has(font) {
    writing-mode: horizontal-tb !important;
    }

    .textBox:hover span {
    opacity: 100%;
    display: table;
    }

    .textBox:hover span:has(font) {
    background-color: white;
    width: fit-content;
    }

    .textBox span {
    opacity: 0%;
    white-space: nowrap;
    letter-spacing: 0.1em;
    line-height: 1.1em;
    margin: 0;
    background-color: rgb(255, 255, 255);
    }
    `)

})();