// ==UserScript==
// @name        学生评价_全部10分
// @namespace   Violentmonkey Scripts
// @match       http://jwglxt.webvpn.zufedfc.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html
// @grant       none
// @version     1.0
// @author      kalicyh
// @license     MIT
// @description 2023/12/20 23:23:02
// @downloadURL https://update.greasyfork.org/scripts/482764/%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7_%E5%85%A8%E9%83%A810%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/482764/%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7_%E5%85%A8%E9%83%A810%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮
    const button = document.createElement('button');
    button.textContent = '点击我执行操作';
    button.style.position = 'fixed';
    button.style.top = '680px';
    button.style.left = '100px';
    document.body.appendChild(button);

    // 给按钮添加点击事件处理程序
    button.addEventListener('click', function() {
        // 获取所有具有"data-dyf"属性值为"100"的单选按钮
        const radioButtons = document.querySelectorAll('input[type="radio"][data-dyf="100"]');

        // 遍历并点击每个单选按钮
        radioButtons.forEach(function(radioButton) {
            radioButton.click();
        });
    });
})();

