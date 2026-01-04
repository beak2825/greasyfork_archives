// ==UserScript==
// @name         自动完成 Weekly Poll
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动完成 Rewards Weekly Polls
// @author       You
// @match        https://www.bing.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463984/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20Weekly%20Poll.user.js
// @updateURL https://update.greasyfork.org/scripts/463984/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20Weekly%20Poll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const btoption = document.querySelector('#btoption0');

        if (btoption) {
            btoption.click();
        }
    }, 3000);
})();