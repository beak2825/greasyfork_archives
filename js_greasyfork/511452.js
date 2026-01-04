// ==UserScript==
// @name         MemeFI web
// @version      1.0
// @description  Running TapSwap in a browser
// @author       amir-homous
// @match        https://tg-app.memefi.club/*
// @grant        none
// @icon         https://s2.coinmarketcap.com/static/img/coins/64x64/29373.png
// @downloadURL  https://github.com/amir-homous/MemeFi-Coin/raw/main/memefi-web.user.js
// @updateURL    https://github.com/amir-homous/MemeFi-Coin/raw/main/memefi-web.user.js
// @homepage     https://github.com/amir-homous/MemeFi-Coin
// ==/UserScript==

(function() {
    'use strict';

    const originalUrl = 'https://telegram.org/js/telegram-web-app.js';
    const newUrl = 'https://ktnff.tech/universal/telegram-web-app.js';

    // Create a MutationObserver to watch for script tags being added to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' && node.src === originalUrl) {
                    node.src = newUrl;
                }
            });
        });
    });

    // Start observing the document for script tags being added
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Override the appendChild method to replace the script URL
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
        if (child.tagName === 'SCRIPT' && child.src === originalUrl) {
            child.src = newUrl;
        }
        return originalAppendChild.call(this, child);
    };

})();
