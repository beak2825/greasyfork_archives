// ==UserScript==
// @name        改变宽度
// @namespace   Violentmonkey Scripts
// @match       *://*.wnacg.com/photos-slide-aid-*.html*
// @grant       none
// @version     1.3
// @author      -
// @description 2024/7/28 09:24:03
// @downloadURL https://update.greasyfork.org/scripts/501970/%E6%94%B9%E5%8F%98%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/501970/%E6%94%B9%E5%8F%98%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取所有图片元素
    let images = document.querySelectorAll('img');

    // 保存原始图片宽度
    let originalWidths = [];

    // 遍历所有图片，保存原始宽度
    images.forEach(img => {
        originalWidths.push(img.style.width);
    });

    // 创建包裹按钮的 div 元素
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10%';
    buttonContainer.style.right = '10px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    document.body.appendChild(buttonContainer);

    // 创建按钮
    const buttons = {
        '60%': document.createElement('button'),
        '75%': document.createElement('button'),
        '90%': document.createElement('button'),
        '100%': document.createElement('button')
    };

    // 设置按钮文本
    for (const [key, btn] of Object.entries(buttons)) {
        btn.textContent = key;
        buttonContainer.appendChild(btn);
    }

    let intervalId;

    function clearExistingInterval() {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }

    // 点击按钮，调整图片宽度
    buttons['60%'].addEventListener('mousedown', function() {
        clearExistingInterval();
        intervalId = setInterval(() => {
            images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '60%';
            });
        }, 1000);
    });

    buttons['75%'].addEventListener('mousedown', function() {
        clearExistingInterval();
        intervalId = setInterval(() => {
            images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '75%';
            });
        }, 1000);
    });

    buttons['90%'].addEventListener('mousedown', function() {
        clearExistingInterval();
        intervalId = setInterval(() => {
            images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '90%';
            });
        }, 1000);
    });

    // 点击按钮，复原图片宽度
    buttons['100%'].addEventListener('click', function() {
        clearExistingInterval();
        intervalId = setInterval(() => {
            images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '100%';
            });
        }, 1000);
    });

})();
