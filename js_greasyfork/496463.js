// ==UserScript==
// @name         命运2自动收集
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  命运2DIM自动收集
// @author       lmj
// @match        https://app.destinyitemmanager.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=destinyitemmanager.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496463/%E5%91%BD%E8%BF%902%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/496463/%E5%91%BD%E8%BF%902%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置定时器，每隔1000 * 60 * 3毫秒（3分钟）执行一次
    // 等待页面加载完成
    window.addEventListener('load', function(){
        setInterval(function() {
            // 找到页面上需要自动点击的按钮
            // 
            var button = document.querySelector('.dim-button');
            var buttonrefresh = document.querySelector('button[title*="刷新命运数据 [R]"]');
            // document.querySelector(".dim-button").click();
            // 检查按钮是否存在
            if (buttonrefresh) {
                // 模拟点击按钮
                buttonrefresh.click();
                console.log('已刷新');
            } else {
                console.log('未找到刷新按钮');
            }
            if (button) {
                // 模拟点击按钮
                button.click();
                console.log('已领取');
            } else {
                console.log('没有物品需要领取');
            }
        }, 1000 * 60 * 3);

    })

})();