// ==UserScript==
// @name         自动刷新页面
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  每30秒自动刷新页面
// @author       lokua
// @match        *://*/*
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/502584/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/502584/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

// ==UserScript==
// @name         自动刷新页面
// @namespace    http://tampermonkey.net/ 
// @version      0.2
// @description  每5秒自动刷新页面
// @author       你的名字
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        location.reload();
    }, 5000); // 5秒 = 5000毫秒
})();