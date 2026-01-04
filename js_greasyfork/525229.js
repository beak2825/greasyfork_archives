// ==UserScript==
// @name         Saylor一键Mark as done按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在https://learn.saylor.org/页面中，若存在Mark as done按钮，则在页面中间添加黄色背景的开始按钮，点击后查找并点击全部Mark as done按钮
// @author       3588
// @match        https://learn.saylor.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525229/Saylor%E4%B8%80%E9%94%AEMark%20as%20done%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525229/Saylor%E4%B8%80%E9%94%AEMark%20as%20done%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 查找所有Mark as done按钮
    const allButtons = document.evaluate('//button[contains(text(), "Mark as done")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const buttonCount = allButtons.snapshotLength;

    // 如果存在Mark as done按钮，则创建开始按钮
    if (buttonCount > 0) {
        // 创建开始按钮
        const startButton = document.createElement('button');
        startButton.textContent = '开始';
        startButton.style.position = 'fixed';
        startButton.style.top = '50%';
        startButton.style.left = '50%';
        startButton.style.transform = 'translate(-50%, -50%)';
        startButton.style.backgroundColor = 'yellow';
        document.body.appendChild(startButton);

        // 开始按钮点击事件处理函数
        startButton.addEventListener('click', function () {
            for (let i = 0; i < buttonCount; i++) {
                const button = allButtons.snapshotItem(i);
                if (button) {
                    button.click();
                }
            }
            console.log(`共点击了 ${buttonCount} 个Mark as done按钮。`);
        });
    }
})();