// ==UserScript==
// @name         网课自动更新(全)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  手动更新
// @author       Manre
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517617/%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%28%E5%85%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517617/%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%28%E5%85%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = '.btn.btn-xs.btn-success';
    let intervalId = null;
    let isUpdating = false;
    const clickCount = 3; // 设置一次性更新的数量

    const wrapperElement = document.querySelector('.wrapper-md.control');
    if (!wrapperElement) {
        console.log('未找到 .wrapper-md.control 元素，脚本将不执行。');
        return;
    }

    const existingFloatingButton = document.querySelector('#autoUpdateFloatingButton');
    if (existingFloatingButton) {
        existingFloatingButton.remove();
    }

    const floatingButton = document.createElement('button');
    floatingButton.id = 'autoUpdateFloatingButton';
    floatingButton.innerText = '开始自动更新';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.zIndex = '1000';
    floatingButton.style.padding = '10px';
    floatingButton.style.backgroundColor = '#4CAF50';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'pointer';

    floatingButton.addEventListener('click', function() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            floatingButton.innerText = '开始自动更新';
            console.log('自动更新已停止');
        } else {
            intervalId = setInterval(function() {
                if (!isUpdating) {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        for (let i = 0; i < clickCount && i < elements.length; i++) {
                            elements[i].click();
                            console.log(`更新按钮已点击 (${i + 1}/${clickCount})`);
                        }
                        isUpdating = true;
                        setTimeout(() => {
                            isUpdating = false;
                        }, 10000); 
                    } else {
                        console.log('未找到更新按钮');
                    }
                }
            }, 10000);
            floatingButton.innerText = '停止自动更新';
            console.log('自动更新已开始');
        }
    });

    document.body.appendChild(floatingButton);
})();