// ==UserScript==
// @name         bili分享小助手
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  bilibili复制分享纯净链接
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524624/bili%E5%88%86%E4%BA%AB%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524624/bili%E5%88%86%E4%BA%AB%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function getBVNumberFromUrl(url) {
        // 在链接中提取 BV 号
        const bvMatch = url.match(/(BV\w+)/);
        return bvMatch ? bvMatch[1] : null;
    }

    function addButton(text, timeEnabled = false) {
        // 寻找目标元素，可以根据实际页面调整选择器
        const targetSelectors = ['div.video-toolbar-left-main']; // 对于其他页面结构可添加更多选择器
        let targetElement = null;
        for (let selector of targetSelectors) {
            targetElement = document.querySelector(selector);
            if (targetElement) break;
        }

        if (targetElement) {
            const newDivWrap = document.createElement('div');
            newDivWrap.className = 'toolbar-left-item-wrap-csx';

            const newButton = document.createElement('button');
            newButton.style.cssText = 'background-color: #1c2022; color: white; border: none; padding: 10px 20px; cursor: pointer;';
            newButton.textContent = text;
            newButton.className = 'new-custom-button';

            newButton.addEventListener('click', function() {
                console.log('按钮被点击');
                const bvNumber = getBVNumberFromUrl(window.location.href);
                const titleElement = document.querySelector('h1.video-title');
                const title = titleElement ? `「${titleElement.textContent.trim()}」` : '「标题未知」';

                if (bvNumber) {
                    let url = `https://www.bilibili.com/video/${bvNumber}`;

                    if (timeEnabled) {
                        const video = document.querySelector('video');
                        let currentTime = 0;
                        if (video) {
                            currentTime = video.currentTime;
                        } else {
                            const timeElement = document.querySelector('span.bpx-player-ctrl-time-current');
                            if (timeElement) {
                                const timeParts = timeElement.textContent.trim().split(':').reverse();
                                currentTime = timeParts.reduce((acc, part, index) => acc + parseFloat(part) * Math.pow(60, index), 0);
                            }
                        }
                        url += `?t=${currentTime.toFixed(1)}`.replace(/(\.\d*?[1-9])0+$/, '$1');
                    }

                    const fullText = timeEnabled ? `${title}精准空降: ${url}` : `${title} ${url}`;

                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(fullText).then(() => {
                            showTooltip(newButton, '已复制: ' + fullText);
                            console.log('复制成功：', fullText);
                        }).catch(err => {
                            console.error('复制文本失败: ', err);
                        });
                    } else {
                        console.error('Clipboard API 不可用');
                    }
                } else {
                    console.error('无法获取BV号');
                }
            });

            newDivWrap.appendChild(newButton);
            targetElement.appendChild(newDivWrap);
        } else {
            console.error('目标元素未找到');
        }
    }

    function showTooltip(button, message) {
        const tooltip = document.createElement('div');
        tooltip.style.cssText = 'position: fixed; background-color: black; color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px; z-index: 1000; opacity: 0.9; transform: translateY(-10px); transition: opacity 0.5s ease-out;';
        tooltip.textContent = message;

        const rect = button.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top - 10}px`;

        document.body.appendChild(tooltip);
        setTimeout(() => document.body.removeChild(tooltip), 2000);
    }

    setTimeout(() => {
        addButton('点击复制');
        addButton('点击复制（精准空降）', true);
    }, 3500);
})();