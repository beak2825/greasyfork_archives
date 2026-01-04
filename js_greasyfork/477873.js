// ==UserScript==
// @name         matheboard
// @namespace    matheboard
// @version      0.1
// @author       You
// @match        https://www.matheboard.de/*
// @description  Updates raw Unicode HTML entities by their interpreted counterparts
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477873/matheboard.user.js
// @updateURL https://update.greasyfork.org/scripts/477873/matheboard.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let allElements = window.document.getElementsByClassName("normalfont");
    for (let i in allElements){
        if (!allElements[i] || !allElements[i].innerHTML) continue;
        const re = new RegExp("&amp;#(\\d{4});", 'g');
        allElements[i].innerHTML = allElements[i].innerHTML.replaceAll(re, '&#$1;');
    }
})();