// ==UserScript==
// @name         Bilibili 专栏复制
// @namespace    https://github.com/zerobiubiu
// @version      1.0
// @description  删除bilibili专栏复制带有版权信息
// @author       zerobiubiu
// @match        *.bilibili.com/read/*
// @grant        none
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png
// @downloadURL https://update.greasyfork.org/scripts/528856/Bilibili%20%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/528856/Bilibili%20%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建一个异步等待函数
    function wait(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    function getSelectedText() {
        const selection = window.getSelection();
        return selection.toString();
    }

    // 使用异步函数
    async function run() {
        // 等待 3000 毫秒（3 秒）
        await wait(3000);

        console.log('监听');
        const copyArea = document.getElementById('article-content');
        console.log(copyArea);

        copyArea.addEventListener('copy', (event) => {
            console.log('执行');

            // 获取当前选中的文本
            const copiedText = getSelectedText();
            event.clipboardData.setData('text/plain', copiedText);
            event.preventDefault();
        });
    }

    // 调用异步函数
    run();

})();
