// ==UserScript==
// @name         Facebook - hide unwanted posts
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      GNU GPLv3
// @description  Remove Facebook divs containing "join", "reel", or "follow"
// @author       You
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540931/Facebook%20-%20hide%20unwanted%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/540931/Facebook%20-%20hide%20unwanted%20posts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add keywords here (case-insensitive)
    const KEYWORDS = [/join/i, /reels/i, /follow/i];
    const REQUIRED_CLASSES = [
        "xdj266r", "x14z9mp", "xat24cr", "x1lziwak",
        "xexx8yu", "xyri2b", "x18d9i69", "x1c1uobl",
        "x78zum5", "x1n2onr6", "xh8yej3"
    ];

    function matchesClassList(element, requiredClasses) {
        return requiredClasses.every(cls => element.classList.contains(cls));
    }

    function findMatchingKeyword(text) {
        return KEYWORDS.find(re => re.test(text));
    }

    function scanAndRemove() {
        const allDivs = document.querySelectorAll('div');

        allDivs.forEach(div => {
            if (matchesClassList(div, REQUIRED_CLASSES)) {
                const text = div.innerText || div.textContent || "";
                const matchedKeyword = findMatchingKeyword(text);
                if (matchedKeyword) {
                    console.log(
                        `%c[Removed] %cMatched keyword: "${matchedKeyword.source}" in text:`,
                        'color: red; font-weight: bold;',
                        'color: green;',
                        text.trim().slice(0, 150) + (text.length > 150 ? '…' : '')
                    );
                    div.remove();
                }
            }
        });
    }

    // Initial cleanup
    scanAndRemove();

    // Watch for new content
    const observer = new MutationObserver(() => {
        scanAndRemove();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
