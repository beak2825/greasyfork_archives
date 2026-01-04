// ==UserScript==
// @name         Corrige les synopsis
// @namespace    http://tampermonkey.net/
// @version      2025-07-11
// @description  Corrige les problèmes d'encodage de texte dans les synopsis
// @author       ConnorMcLeod
// @include      /^https:\/\/www\.wawacity\.[^\/]+\/\?p=film&id=.*/
// @include      /^https:\/\/www\.wawacity\.[^\/]+\/\?p=serie&id=.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wawacity.shop
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542328/Corrige%20les%20synopsis.user.js
// @updateURL https://update.greasyfork.org/scripts/542328/Corrige%20les%20synopsis.meta.js
// ==/UserScript==

function decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

(function() {
    'use strict';
    const sBody = Array.from(document.querySelectorAll('div.wa-sub-block'))?.find(block => block.innerText.trim().startsWith("Synopsis "))?.querySelector("p");
    if (sBody) {
        sBody.innerHTML = decodeHTMLEntities(sBody.innerHTML);
    }
})();