// ==UserScript==
// @name         TheBlast优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides <div> elements containing the exact text "Advertisement" on theblast.com
// @author       Grok
// @match        https://theblast.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534534/TheBlast%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534534/TheBlast%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Select all div elements
    const divs = document.querySelectorAll('div');
    // Loop through divs to find those with exact text "Advertisement"
    divs.forEach(div => {
        if (div.textContent.trim() === 'Advertisement') {
            div.style.display = 'none';
        }
    });
})();