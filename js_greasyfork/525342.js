// ==UserScript==
// @name         Sophia自动答题工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在https://app.sophia.org/页面添加下一题自动和下一题停止按钮，点击下一题自动后每500毫秒自动点击<button class="f-button blue enabled">和<button class="f-button blue">类型的按钮，还能模拟人点击<input type="radio" name="answers" id="answer-0">，同时删除<div class="assessment-two-cols__right">和<div class="tutorial-votes-block">元素，点击下一题停止可随时停止自动点击。
// @author       3588
// @match        https://app.sophia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525342/Sophia%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525342/Sophia%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建下一题自动按钮
    const autoNextButton = document.createElement('button');
    autoNextButton.textContent = '下一题自动';
    autoNextButton.style.position = 'fixed';
    autoNextButton.style.top = '50%';
    autoNextButton.style.left = '45%';
    autoNextButton.style.transform = 'translate(-50%, -50%)';
    autoNextButton.style.backgroundColor = 'yellow';
    autoNextButton.style.border = '2px solid #333';
    autoNextButton.style.borderRadius = '5px';
    document.body.appendChild(autoNextButton);

    // 创建下一题停止按钮
    const stopAutoNextButton = document.createElement('button');
    stopAutoNextButton.textContent = '下一题停止';
    stopAutoNextButton.style.position = 'fixed';
    stopAutoNextButton.style.top = '50%';
    stopAutoNextButton.style.left = '55%';
    stopAutoNextButton.style.transform = 'translate(-50%, -50%)';
    stopAutoNextButton.style.backgroundColor = 'yellow';
    stopAutoNextButton.style.border = '2px solid #333';
    stopAutoNextButton.style.borderRadius = '5px';
    document.body.appendChild(stopAutoNextButton);

    let clickInterval;

    autoNextButton.addEventListener('click', function () {
        // 清除之前可能存在的定时器
        if (clickInterval) {
            clearInterval(clickInterval);
        }

        // 删除指定元素
        const elementsToRemove1 = document.querySelectorAll('div.assessment-two-cols__right');
        elementsToRemove1.forEach((element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        const elementsToRemove2 = document.querySelectorAll('div.tutorial-votes-block');
        elementsToRemove2.forEach((element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        // 每500毫秒自动点击按钮
        clickInterval = setInterval(() => {
            // 模拟人点击单选框
            const radioButton = document.querySelector('input[type="radio"][name="answers"][id="answer-0"]');
            if (radioButton) {
                radioButton.click();
            }

            const actionButtons = document.querySelectorAll('button.f-button.blue.enabled, button.f-button.blue');
            actionButtons.forEach((button) => {
                button.click();
            });
        }, 500);
    });

    stopAutoNextButton.addEventListener('click', function () {
        // 停止自动点击
        if (clickInterval) {
            clearInterval(clickInterval);
        }
    });
})();