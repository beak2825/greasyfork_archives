// ==UserScript==
// @name         Hide Neopets Premium Toolbar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the premium toolbar at the bottom of neopets.com
// @author       Your Name
// @match        *://*.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520612/Hide%20Neopets%20Premium%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/520612/Hide%20Neopets%20Premium%20Toolbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to hide the premium toolbar
    const style = document.createElement('style');
    style.textContent = `
        #superfooter {
            display: none !important;
        }
    `;
    document.head.append(style);
})();