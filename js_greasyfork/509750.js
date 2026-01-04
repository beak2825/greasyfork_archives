// ==UserScript==
// @name         itguard_tool
// @namespace    itguard_tool
// @version      2024-05-15
// @description  web-tool for itguard.hisense.com
// @author       Yubug
// @match        https://itguard.hisense.com/shterm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itguard.hisense.com
// @grant        none
// @license      Copyright Yubug
// @downloadURL https://update.greasyfork.org/scripts/509750/itguard_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/509750/itguard_tool.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 监听页面上的点击事件
    document.addEventListener('click', function(e) {
        // 检查点击的元素是否有ng-binding和ng-scope类
        if(e.target.classList.contains('ng-binding') && e.target.classList.contains('ng-scope')) {
            // 创建一个textarea元素用于复制内容
            var textArea = document.createElement('textarea');
            textArea.value = e.target.textContent; // 将元素的内容赋值给textarea
            document.body.appendChild(textArea);
            textArea.select(); // 选择textarea中的内容
            document.execCommand('copy'); // 执行复制操作
            document.body.removeChild(textArea); // 移除用于复制的textarea元素

            // 创建一个提示元素
            var copyAlert = document.createElement('div');
            copyAlert.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);background-color:rgb(0, 207, 226);color:white;padding:10px;z-index:1000;';
            copyAlert.textContent = '内容已复制: ' + textArea.value;
            document.body.appendChild(copyAlert);

            // 设置3秒后淡出提示
            setTimeout(function(){
                copyAlert.style.opacity = '0';
                setTimeout(function(){ document.body.removeChild(copyAlert); }, 1000);
            }, 3000);
        }
    });
})();