// ==UserScript==
// @name         致美化一键签到
// @namespace    https://blog.adproqwq.xyz
// @version      0.1.0
// @description  在致美化顶栏增加签到按钮，点击后自动跳转签到。
// @author       Adpro
// @match        https://zhutix.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3
// @downloadURL https://update.greasyfork.org/scripts/476709/%E8%87%B4%E7%BE%8E%E5%8C%96%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/476709/%E8%87%B4%E7%BE%8E%E5%8C%96%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建按钮，并绑定样式和属性
    var button = document.createElement('button');
    button.textContent = '签到';
    button.style.width = '90px';
    button.style.height = '28px';
    button.style.align = 'center';
    button.style.color = 'black';
    button.style.background = '#ffffff';
    button.style.border = '1px solid';
    button.style.borderRadius = '4px';
    button.addEventListener('click',clickButton); // 监听按钮点击事件

    // 按钮点击触发该函数
    function clickButton(){
        setTimeout(function(){
            var newWindow = window.open('https://zhutix.com/mission/today');
            setTimeout(function(){
                newWindow.document.getElementsByClassName('custom-page-row gold-row mg-t')[0].getElementsByTagName('div')[1].getElementsByTagName('button')[0].click();
            },5000);
        },100);
    };

    // 将按钮插入至指定位置
    var display = document.getElementsByClassName('he_glfds')[0];
    display.appendChild(button);

    // Your code here...
})();