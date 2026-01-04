// ==UserScript==
// @name         雨课堂自动刷未读PPT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一款可以支持将未读的PPT刷下去的插件!
// @author       高蚁开发组GAOYI DevTeam
// @match        https://www.yuketang.cn/v2/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license	 BSD 2-Clause
// @downloadURL https://update.greasyfork.org/scripts/474957/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E6%9C%AA%E8%AF%BBPPT.user.js
// @updateURL https://update.greasyfork.org/scripts/474957/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E6%9C%AA%E8%AF%BBPPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function () {
        var elements = document.querySelectorAll('.thumbImg-container');
        var index = 0;
        function simulateClick() {
            if (index < elements.length) {
                var element = elements[index];
                element.click();
                console.log("已点击按钮")
                index++;
                setTimeout(simulateClick, 2000); 
            }
        }
        simulateClick();
    }, 5000);
    // Your code here...
})();