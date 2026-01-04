// ==UserScript==
// @name         威海专技学习辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  威海专技学习辅助，自动跳过答题窗口（适用于 山东大众云学教育平台）
// @author       WHJZW
// @match        *://*.yxlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415987/%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/415987/%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
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