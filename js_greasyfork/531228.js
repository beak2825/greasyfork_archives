// ==UserScript==
// @name         AutoDL 修复用户名密码自动填充
// @namespace    http://tampermonkey.net/
// @version      2025-01-15
// @description  去掉影响浏览器自动填充的 .hidden-input
// @author       Ganlv
// @match        https://www.autodl.com/login*
// @match        https://www.autodl.com/subAccountLogin*
// @match        https://www.autodl.com/console*
// @icon         https://www.autodl.com/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531228/AutoDL%20%E4%BF%AE%E5%A4%8D%E7%94%A8%E6%88%B7%E5%90%8D%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/531228/AutoDL%20%E4%BF%AE%E5%A4%8D%E7%94%A8%E6%88%B7%E5%90%8D%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationList, observer) => {
        document.querySelectorAll('.hidden-input').forEach(el => el.remove());
    });
    observer.observe(document.querySelector('#app'), {childList: true, subtree: true});
})();