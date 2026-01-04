// ==UserScript==
// @name         抢FF14幻想药/礼物盒
// @version      0.1.0
// @description  抢幻想药/礼物盒。
// @author       Toumei99
// @match        https://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=dff20c7c
// @match        https://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=1357d89a
// @namespace https://greasyfork.org/users/923979
// @downloadURL https://update.greasyfork.org/scripts/446919/%E6%8A%A2FF14%E5%B9%BB%E6%83%B3%E8%8D%AF%E7%A4%BC%E7%89%A9%E7%9B%92.user.js
// @updateURL https://update.greasyfork.org/scripts/446919/%E6%8A%A2FF14%E5%B9%BB%E6%83%B3%E8%8D%AF%E7%A4%BC%E7%89%A9%E7%9B%92.meta.js
// ==/UserScript==

(function() {
'use strict';

// 查询频率
var cyce = 10;

var btn = document.querySelector("section.tool-wrap>div");;

setInterval(function() {
    if (btn !== null && typeof(btn) === 'object') {
        btn.click();
    }
},cyce);

})();