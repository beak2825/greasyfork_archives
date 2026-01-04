// ==UserScript==
// @name         Steam Inventory Fix
// @namespace    https://greasyfork.org/en/users/738914-ibreakeverything
// @version      2025-06-08
// @description  Fix steam inventory economy_v2.js requesting 5000 items instead of 2000.
// @author       iBreakEverything
// @match        https://steamcommunity.com/id/*/inventory*
// @match        https://steamcommunity.com/profiles/*/inventory*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538764/Steam%20Inventory%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/538764/Steam%20Inventory%20Fix.meta.js
// ==/UserScript==

(function() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('count=5000')) {
            url = url.replace('count=5000', 'count=2000');
        }
        return originalOpen.apply(this, arguments);
    };
})();