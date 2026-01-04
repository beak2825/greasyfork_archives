// ==UserScript==
// @name         小鹅通PDF电子书保存
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动翻页并保存pdf图片，需要自行手动合并为PDF。
// @author       Canis
// @match        *://*.xiaoeknow.com/*
// @grant        GM_download
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500610/%E5%B0%8F%E9%B9%85%E9%80%9APDF%E7%94%B5%E5%AD%90%E4%B9%A6%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/500610/%E5%B0%8F%E9%B9%85%E9%80%9APDF%E7%94%B5%E5%AD%90%E4%B9%A6%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let running = false;
    let startButton;
    let stopButton;
    let intervalId;
    let saveDelay = 1000;

    // 创建开始和停止按钮
    function createButtons() {
        startButton = document.createElement('button');
        startButton.innerText = '开始保存';
        startButton.style.position = 'fixed';
        startButton.style.top = '16px';
        startButton.style.left = '16px';
        startButton.style.fontSize = '16px';
        startButton.style.padding = '4px';
        startButton.style.zIndex = 1000;
        startButton.onclick = startSaving;
        document.body.appendChild(startButton);

        stopButton = document.createElement('button');
        stopButton.innerText = '停止保存';
        stopButton.style.position = 'fixed';
        stopButton.style.top = '64px';
        stopButton.style.left = '16px';
        stopButton.style.fontSize = '16px';
        stopButton.style.padding = '4px';
        stopButton.style.zIndex = 1000;
        stopButton.onclick = stopSaving;
        document.body.appendChild(stopButton);

        // 创建输入框设置延迟
        let saveDelayLabel = document.createElement('label');
        saveDelayLabel.innerText = '保存延迟：';
        saveDelayLabel.style.position = 'fixed';
        saveDelayLabel.style.top = '112px';
        saveDelayLabel.style.left = '16px';
        saveDelayLabel.style.fontSize = '16px'
        saveDelayLabel.style.zIndex = 1000;
        document.body.appendChild(saveDelayLabel);

        let saveDelayInput = document.createElement('input');
        saveDelayInput.type = 'number';
        saveDelayInput.value = saveDelay;
        saveDelayInput.style.position = 'fixed';
        saveDelayInput.style.top = '112px';
        saveDelayInput.style.left = '100px';
        saveDelayInput.style.fontSize = '16px';
        saveDelayInput.style.zIndex = 1000;
        saveDelayInput.style.width = '60px';
        saveDelayInput.onchange = () => { saveDelay = parseInt(saveDelayInput.value, 10); };
        document.body.appendChild(saveDelayInput);
    }

    // 延迟函数，用于等待页面加载完成
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function saveImage() {
        // 获取图片的URL
        let imgElement = document.querySelector('#pdfImg');
        if (imgElement) {
            let imgUrl = imgElement.src;
            let currentPage = document.querySelector('.pdf-entity').getAttribute('page');
            let fileName = 'image-' + currentPage + '.jpg'; // 以当前页码命名图片
            GM_download(imgUrl, fileName);
            GM_log('图片已保存: ' + fileName);
        } else {
            GM_log('未找到目标图片');
        }
    }

    async function nextPage() {
        // 获取当前页数和总页数
        let pageElement = document.querySelector('.pdf-entity');
        if (pageElement) {
            let currentPage = parseInt(pageElement.getAttribute('page'), 10);
            let totalPages = parseInt(document.querySelector('.percentage').innerText.split('/')[1].trim(), 10);

            if (currentPage < totalPages) {
                // 模拟点击下一页按钮
                let nextPageBtn = document.evaluate("//span[text()='下一页']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (nextPageBtn) {
                    nextPageBtn.click();
                } else {
                    GM_log('未找到“下一页”按钮');
                    return false;
                }

                // 增加页数
                pageElement.setAttribute('page', currentPage + 1);
                GM_log(`翻到第 ${currentPage + 1} 页`);

                // 更新按钮文字
                startButton.innerText = `正在保存：${currentPage + 1}/${totalPages}`;
            } else {
                GM_log('已到达最后一页');
                return false; // 到达最后一页，停止循环
            }
        } else {
            GM_log('未找到页面元素');
            return false;
        }
        return true;
    }

    async function main() {
        // 获取总页数
        let totalPages = parseInt(document.querySelector('.percentage').innerText.split('/')[1].trim(), 10);

        while (running) {
            await saveImage(); // 保存图片
            await delay(saveDelay); // 等待1秒，确保图片下载完成并且页面加载完成
            let hasNext = await nextPage(); // 翻页
            if (!hasNext) break;
            await delay(saveDelay); // 等待1秒，确保下一页加载完成
        }

        // 恢复按钮初始文字
        startButton.innerText = '开始保存';

        // 弹窗提示用户下载已完成
        if (!running) {
            alert('下载完成！');
        }
    }

    function startSaving() {
        if (!running) {
            running = true;
            main();
        }
    }

    function stopSaving() {
        running = false;
        GM_log('停止保存图片');
        alert('保存已停止');
    }

    // 创建按钮
    createButtons();
})();