// ==UserScript==
// @name         大众云学嘎嘎乱跳
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动跳过答题窗口（适用于 山东大众云学教育平台）
// @author       呲牙小土逗
// @match        *://*.yxlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443966/%E5%A4%A7%E4%BC%97%E4%BA%91%E5%AD%A6%E5%98%8E%E5%98%8E%E4%B9%B1%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/443966/%E5%A4%A7%E4%BC%97%E4%BA%91%E5%AD%A6%E5%98%8E%E5%98%8E%E4%B9%B1%E8%B7%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    clearInterval(myTimer);
    function enterCourse() {
        var a = document.getElementsByTagName("BUTTON");
            for (var i = 0; i < a.length; i++) {
                if(a[i].innerHTML=="跳过")
                    a[i].click();
            }
    }
    var myTimer = setInterval(enterCourse, 3000);
})();