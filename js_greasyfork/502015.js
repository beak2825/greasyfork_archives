// ==UserScript==
// @name         unlimited scroll
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  scroll infinitely up and down
// @author       therandomdude
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502015/unlimited%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/502015/unlimited%20scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const contentDiv = document.createElement('div');
    contentDiv.style.width = '10000px';
    contentDiv.style.height = '10000px';
    document.body.appendChild(contentDiv);

    window.addEventListener('scroll', function() {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        if (scrollX + window.innerWidth >= contentDiv.offsetWidth) {
            contentDiv.style.width = (contentDiv.offsetWidth + window.innerWidth) + 'px';
        }

        if (scrollY + window.innerHeight >= contentDiv.offsetHeight) {
            contentDiv.style.height = (contentDiv.offsetHeight + window.innerHeight) + 'px';
        }
    });
})();