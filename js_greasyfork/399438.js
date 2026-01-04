// ==UserScript==
// @name         豆瓣恢復彩色
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  我們用彩色哀悼，我們用彩色抗議（讓豆瓣頁面重回彩色模式，禁用黑白灰度）
// @author       YY
// @match        https://www.douban.com/
// @match        https://www.douban.com/?p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399438/%E8%B1%86%E7%93%A3%E6%81%A2%E5%BE%A9%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/399438/%E8%B1%86%E7%93%A3%E6%81%A2%E5%BE%A9%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.body.className = 'none';
})();