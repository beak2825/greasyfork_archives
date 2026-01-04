// ==UserScript==
// @name         知乎首页跳转保护
// @version      1.0.0
// @description  为知乎主页(仅)的跳转行为作加上反悔选项,防止意外的 推荐回答页 刷新
// @author       Rubbe
// @grant        GM_notification
// @match        *://www.zhihu.com/
// @copyright    2023, Rubbe
// @license      MIT
// @namespace https://greasyfork.org/users/1168752
// @downloadURL https://update.greasyfork.org/scripts/474821/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E8%B7%B3%E8%BD%AC%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/474821/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E8%B7%B3%E8%BD%AC%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const preventReload = ()=>{
        window.addEventListener("beforeunload", function (e) {
            e.preventDefault();     // default
            (e || window.event).returnValue = "";   // chrome
            return "";  //old browsers 
        });
    };
    preventReload();
})();