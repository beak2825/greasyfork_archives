// ==UserScript==
// @name         武汉理工大学语文自动刷新网页刷时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动刷新网页刷时间
// @author       Chenbh
// @match       http://59.69.102.9/zgyw/study/LearningIndex.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432053/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%AD%E6%96%87%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5%E5%88%B7%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/432053/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%AD%E6%96%87%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5%E5%88%B7%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //time：5分钟
    let time=300000;
    setTimeout(() => {
        location.reload()
    },time);
    // Your code here...
})();