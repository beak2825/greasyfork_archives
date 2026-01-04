// ==UserScript==
// @name         爱发电直接跳转测试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  爱发电直接跳转
// @author       zyb
// @match        https://afdian.net/link?target=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=afdian.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459078/%E7%88%B1%E5%8F%91%E7%94%B5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/459078/%E7%88%B1%E5%8F%91%E7%94%B5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // let pDom = document.querySelectorAll('.black-5')[0] || {};
    // let urlStr = pDom.innerText;
    let urlStr = decodeURIComponent(window.location.href.split('target=')[1]);
    window.location.href = urlStr;
})();