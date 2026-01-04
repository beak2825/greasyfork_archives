// ==UserScript==
// @name         FOFA一键获取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在FOFA网页左下角添加一个按钮，点击一键获取指定内容并复制到粘贴板
// @author       You
// @match        https://fofa.info/*
// @grant        GM_setClipboard
// @license      zh-cn
// @downloadURL https://update.greasyfork.org/scripts/541109/FOFA%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/541109/FOFA%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮并添加到页面底部
    function createButton() {
        const button = document.createElement('button');
        button.innerHTML = '一键获取';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.left = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', handleClick);
        document.body.appendChild(button);
    }

    // 处理按钮点击事件
    function handleClick() {
        const dataElements = document.evaluate('//*[@id="__layout"]/div/div[2]/div[1]/div[4]/div[2]/div[3]/div[1]/div/div/div[2]/div[1]/p[2]/span', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        const uniqueValues = new Set();

        // 遍历匹配的元素并将数据添加到uniqueValues Set
        for (let i = 0; i < dataElements.snapshotLength; i++) {
            uniqueValues.add(dataElements.snapshotItem(i).textContent.trim());
        }

        // 将Set转为字符串，每个值之间用换行符分隔
        const clipboardData = [...uniqueValues].join('\n');

        // 复制数据到粘贴板
        GM_setClipboard(clipboardData);

        // 提示用户复制成功，1秒后关闭提示框
        const alertTimeout = setTimeout(() => {
            alertBox.style.display = 'none';
        }, 1000);

        // 创建提示框
        const alertBox = document.createElement('div');
        alertBox.innerHTML = '已成功复制到粘贴板！';
        alertBox.style.position = 'fixed';
        alertBox.style.bottom = '30px';
        alertBox.style.left = '10px';
        alertBox.style.padding = '10px';
        alertBox.style.background = '#4CAF50';
        alertBox.style.color = '#fff';
        alertBox.style.zIndex = '9999';
        document.body.appendChild(alertBox);

        // 清除定时器和移除提示框
        alertBox.addEventListener('click', () => {
            clearTimeout(alertTimeout);
            alertBox.style.display = 'none';
        });
    }

    // 在页面加载完毕后执行
    window.addEventListener('load', (event) => {
        createButton();
    });
})();
