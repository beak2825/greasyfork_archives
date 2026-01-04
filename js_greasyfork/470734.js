// ==UserScript==
// @name         51job
// @namespace    your-namespace
// @version      1.0
// @description  在页面左下角添加按钮，点击按钮执行指定代码
// @author       Your Name
// @match        https://we.51job.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470734/51job.user.js
// @updateURL https://update.greasyfork.org/scripts/470734/51job.meta.js
// ==/UserScript==

(function() {
    'use strict';



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
        for (let i = 1; i <= 20; i++) {
            // 多选框
            var element = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.j_joblist > div:nth-child(${i}) > div.e_icons.ick`);
            if(element == null){
                continue;
            }
            // 创建一个鼠标点击事件
            var innerEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            // 触发点击事件
            element.dispatchEvent(innerEvent);
        }

        // 延迟1秒后执行按钮点击
        setTimeout(function() {
            // 按钮点击
            var btn = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div.j_tlc > div.tright > div > button:nth-child(2)`);
            if(btn != null) {
                var btnEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                btn.dispatchEvent(btnEvent);
                // 关闭弹窗
                setTimeout(function() {
                    var closeElement = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.van-popup.van-popup--center > i`);
                    if(closeElement != null) {
                        var innerEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        closeElement.dispatchEvent(innerEvent);
                    }
                },2500);
            }
            var nextBtn = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div.bottom-page > div > div > div > button.btn-next`);
            var nextEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
            nextBtn.dispatchEvent(nextEvent);
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        }, 1000);
    });
})();
