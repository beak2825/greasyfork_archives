// ==UserScript==
// @name         Trading Chart Patterns Helper
// @namespace    http://yoursite.example.com
// @version      1.0
// @description  Highlights trading chart patterns for swing trading
// @author       Your Name
// @match        https://www.strike.money/technical-analysis/chart-patterns*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520318/Trading%20Chart%20Patterns%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520318/Trading%20Chart%20Patterns%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Example: Add a highlight effect to the chart patterns link
    const targetLink = document.querySelector('a[href*="chart-patterns"]');
    if (targetLink) {
        targetLink.style.backgroundColor = 'yellow';
        targetLink.style.fontWeight = 'bold';
    }
})();
