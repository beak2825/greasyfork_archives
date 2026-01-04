// ==UserScript==
// @name         JoySpace Search Focus
// @namespace    Violentmonkey Scripts
// @version      1.0.2
// @description  Set focus on search box on JoySpace homepage
// @match        https://joyspace.jd.com/
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/481584/JoySpace%20Search%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/481584/JoySpace%20Search%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('start scripts');

    // 等待页面加载完成
    window.addEventListener('load', function() {
         // 延迟执行设置焦点的代码
        setTimeout(function() {
        console.log('windwos loads ');
        // 获取搜索框元素
        var searchBox = document.querySelector('.search-area-input');
        
        // 将焦点设置在搜索框上
        if (searchBox) {
            console.log('get search box');
            searchBox.focus();
        }
        }, 3000); // 延迟时间可以根据实际情况进行调整
    });
})();
