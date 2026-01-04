// ==UserScript==
// @name         逛丢自动跳转电脑版
// @namespace    http://kirin.moe/
// @version      0.1
// @description  自动从逛丢移动版切换到电脑版
// @author       You
// @match        *guangdiu.com/m/mdetail.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34766/%E9%80%9B%E4%B8%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/34766/%E9%80%9B%E4%B8%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var itemid = window.location.href.match('[0-9]{1,}')[0];
    window.location.href='../detail.php?id='.concat(itemid,'&kf=m');
    // Your code here...
})();