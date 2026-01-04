// ==UserScript==
// @name         过滤GitHub Trending中已标星项目
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在GitHub趋势榜上不显示已标星的项目，只看没看过的
// @author       CarbonGlory
// @match        https://github.com/trending*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470696/%E8%BF%87%E6%BB%A4GitHub%20Trending%E4%B8%AD%E5%B7%B2%E6%A0%87%E6%98%9F%E9%A1%B9%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/470696/%E8%BF%87%E6%BB%A4GitHub%20Trending%E4%B8%AD%E5%B7%B2%E6%A0%87%E6%98%9F%E9%A1%B9%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const repoList = document.querySelectorAll('.Box-row');

    repoList.forEach(repo => {
        const starButton = repo.querySelector('.js-social-container .starred');
        if (starButton) {
            repo.style.display = 'none';
        }
    });
})();

