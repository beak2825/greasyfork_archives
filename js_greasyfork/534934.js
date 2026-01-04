// ==UserScript==
// @name         Free Game Alert (Old Reddit)
// @namespace    http://tampermonkey.net/
// @version      2025.06.20
// @description  Highlight posts containing the word "free"
// @author       SwanKnight
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/534934/Free%20Game%20Alert%20%28Old%20Reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534934/Free%20Game%20Alert%20%28Old%20Reddit%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByClassName("title");

    // Convert HTMLCollection to an array
    Array.from(elements).forEach(element => {
        const regex = /\bfree\b/i;
        const regex2 = /\bweekend\b/i;
        var str = element.textContent.toLowerCase();
        if (regex2.test(str) == false && (regex.test(str) || str.includes('$0/100%'))) {
            var parentDiv = element.closest('div.top-matter');
            if (parentDiv) {
                parentDiv.style.backgroundColor = "lightgreen"; // Change the background color of the parent div
            }
        }
    });
})();