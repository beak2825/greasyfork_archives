// ==UserScript==
// @name         Remove adds Ad
// @namespace    http://tampermonkey.net/
// @version      2025-01-27
// @description  Eliminates the annoying ad to pay premiun every time you enter the page.
// @author       Cat dev
// @match        https://chan.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525073/Remove%20adds%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/525073/Remove%20adds%20Ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

const divs = document.querySelectorAll('div');
divs.forEach(div => {
    const zIndex = window.getComputedStyle(div).zIndex;
    if (zIndex && !isNaN(zIndex) && parseInt(zIndex, 10) > 50000) {
        console.log('Eliminando div:', div);
        div.remove();
    }
});
})();