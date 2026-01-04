// ==UserScript==
// @name         lagou
// @namespace    your-namespace
// @version      1.0
// @description  在页面左下角添加按钮，点击按钮执行指定代码
// @author       Your Name
// @match        https://www.lagou.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470735/lagou.user.js
// @updateURL https://update.greasyfork.org/scripts/470735/lagou.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个鼠标点击事件
    var event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    // 创建按钮元素
    var button = document.createElement('button');
    button.innerHTML = '执行操作'; // 按钮文本
    button.style.position = 'fixed';
    button.style.bottom = '10px'; // 距离底部的距离
    button.style.left = '10px'; // 距离左侧的距离
    button.style.zIndex = '9999';

    // 将按钮添加到页面中
    document.body.appendChild(button);

    // 绑定按钮点击事件
    button.addEventListener('click', function() {
        var first = document.querySelector(`#s_position_list > ul > li.con_list_item.first_row.default_list > div.list_item_top > div.position > div.p_top > a > h3`);
        first.dispatchEvent(event);
        for (let i = 2; i <= 15; i++) {
            // 窗口打开链接
            setTimeout(function() {
                var element = document.querySelector(`#s_position_list > ul > li:nth-child(${i}) > div.list_item_top > div.position > div.p_top > a > h3`);
                var innerEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                // 触发点击事件
                element.dispatchEvent(innerEvent);
            },1000);
        }
    });
})();
