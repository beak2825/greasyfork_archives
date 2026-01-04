// ==UserScript==
// @name         百度点击
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  百度首页跳过推荐页面
// @license      MIT
// @author       You
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490824/%E7%99%BE%E5%BA%A6%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/490824/%E7%99%BE%E5%BA%A6%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        document.querySelector("#s_menu_mine").click();
    }, 800);
})();
