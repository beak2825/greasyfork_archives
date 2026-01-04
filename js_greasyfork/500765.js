// ==UserScript==
// @name         智谱清言（自动聚焦到输入框）Focus on Input Box on Window Focus
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  用来使智谱清言网页端的输入框自动聚焦
// @author       XYZzz
// @match        https://chatglm.cn/*
// @icon        https://chatglm.cn/img/icons/favicon-32x32.png
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/500765/%E6%99%BA%E8%B0%B1%E6%B8%85%E8%A8%80%EF%BC%88%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E5%88%B0%E8%BE%93%E5%85%A5%E6%A1%86%EF%BC%89Focus%20on%20Input%20Box%20on%20Window%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/500765/%E6%99%BA%E8%B0%B1%E6%B8%85%E8%A8%80%EF%BC%88%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E5%88%B0%E8%BE%93%E5%85%A5%E6%A1%86%EF%BC%89Focus%20on%20Input%20Box%20on%20Window%20Focus.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // console.log(1)
    var clickCount = 0;
    var lastClickTime = 0;
    // 确定两次点击之间的最大间隔时间（毫秒）
    var maxInterval = 500;

    // 确保页面加载完成后执行
    window.addEventListener('load', function () {
        // 选择页面中的输入框
        var inputBox = document.querySelector('textarea[slot="reference"]');
        // console.log(inputBox)
        // 如果输入框存在，添加窗口焦点事件监听器
        // console.log(2)
        if (inputBox) {
            inputBox.focus();
            window.addEventListener('focus', function () {
                // 当窗口获得焦点时，将焦点聚焦到输入框
                inputBox.focus();
                setTimeout(()=>{
                    inputBox.focus();
                }, 200)
                // console.log(3)
            });


            // 监听键盘按下事件
            document.addEventListener('keydown', function (event) {
                // console.log(123321)
                // console.log(event)

                // 检查是否按下了F键
                if (event.key === 'f') {
                    // console.log(10001203)
                    var currentTime = new Date().getTime();

                    // 如果两次点击之间的时间间隔小于设定值，则增加点击计数
                    if (currentTime - lastClickTime < maxInterval) {
                        clickCount++;
                    } else {
                        clickCount = 1;
                    }

                    lastClickTime = currentTime;

                    // 如果点击次数达到2次，则聚焦到输入框
                    if (clickCount === 2) {
                        // debugger
                        setTimeout(()=>{
                            inputBox.focus();
                        }, 150)
                        clickCount = 0; // 重置点击计数
                    }
                }
            });
        }
    }, false);
})();