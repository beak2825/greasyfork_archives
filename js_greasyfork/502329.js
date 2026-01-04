// ==UserScript==
// @name         ebaysearch
// @namespace    http://tampermonkey.net/
// @version      2024-08-01
// @description  ebaysearchdaima
// @license      NO LICENSE
// @author       yang
// @match        *://*.ebay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502329/ebaysearch.user.js
// @updateURL https://update.greasyfork.org/scripts/502329/ebaysearch.meta.js
// ==/UserScript==

(function() {
    'use strict';
const boldSpans = document.querySelectorAll('span.BOLD');


boldSpans.forEach(function (span) {

    const matches = span.textContent.match(/\d+/);
    if (span.textContent.trim().includes('已售') || span.textContent.trim().includes('sold')  && matches) {
        const price = span.parentNode.parentNode.parentNode.firstChild.firstChild.textContent.trim()
        if (price.match(/\d+/) >= 50) {
            const hrefa = span.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('a').href;
            console.log(span.textContent, price, hrefa)
        }
    }
});



})();


