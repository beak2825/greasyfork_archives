// ==UserScript==
// @name 自定义延迟点击脚本
// @namespace http://example.com/custom-delay-click-script
// @version 1.2
// @description 允许用户自定义延迟时间的页面元素点击脚本，开启时显示工作状态弹窗，并可暂停或继续
// @match <all_urls>
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524539/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BB%B6%E8%BF%9F%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/524539/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BB%B6%E8%BF%9F%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let delay = prompt("请输入延迟时间（毫秒）", "10000"); // 弹出输入框，默认 10 秒
    delay = parseInt(delay); // 将输入转换为整数
    if (isNaN(delay)) {
        delay = 10000; // 如果输入不是数字，使用默认 10 秒
    }

    // 创建并添加状态弹窗元素
    const statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '10px';
    statusDiv.style.left = '10px';
    statusDiv.style.zIndex = '9999';
    statusDiv.style.backgroundColor = 'white';
    statusDiv.style.padding = '10px';
    statusDiv.style.border = '1px solid black';
    statusDiv.textContent = '脚本已开启，正在等待用户输入延迟时间。';
    document.body.appendChild(statusDiv);

    // 创建控制按钮元素
    const controlDiv = document.createElement('div');
    controlDiv.style.position = 'fixed';
    controlDiv.style.top = '50px';
    controlDiv.style.left = '10px';
    controlDiv.style.zIndex = '9999';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.padding = '10px';
    controlDiv.style.border = '1px solid black';

    const pauseButton = document.createElement('button');
    pauseButton.textContent = '暂停';
    pauseButton.addEventListener('click', function () {
        pauseButton.textContent = pauseButton.textContent === '暂停'? '继续' : '暂停';
    });
    controlDiv.appendChild(pauseButton);
    document.body.appendChild(controlDiv);

    let paused = false;
    let intervalId;

    window.onload = function () {
        statusDiv.textContent = '正在查找并点击元素，延迟时间为 ' + delay + ' 毫秒。';

        // 尝试查找并点击按钮
        const triggerButton = document.querySelector('button.active');
        if (triggerButton) {
            triggerButton.click();
        } else {
            console.warn('未找到 button.active 元素');
        }

        const loopData = [];
        for (let i = 1; i <= 100000000; i++) {
            loopData.push(i);
        }

        let index = 0;
        intervalId = setInterval(() => {
            if (!paused) {
                const targetElement = document.querySelector('.goodsItem-KBGOY5:nth-child(1).goodsAction-JcGBoH >.lvc2-grey-btn-wrapper:nth-child(1) >.lvc2-grey-btn');
                if (targetElement) {
                    targetElement.click();
                    statusDiv.textContent = '已点击元素：' + targetElement.tagName;
                } else {
                    console.warn('未找到目标元素.goodsItem-KBGOY5:nth-child(1).goodsAction-JcGBoH >.lvc2-grey-btn-wrapper:nth-child(1) >.lvc2-grey-btn');
                }
                index++;
                if (index >= loopData.length) {
                    clearInterval(intervalId);
                    statusDiv.textContent = '操作完成';
                }
            }
        }, delay);
    };
})();