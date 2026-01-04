// ==UserScript==
// @name         抖音视频放弃喜欢自动选择
// @namespace    Apple280
// @version      0.1
// @description  抖音视频放弃喜欢自动选择1
// @author       Apple280
// @match        https://*.douyin.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523060/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E6%94%BE%E5%BC%83%E5%96%9C%E6%AC%A2%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/523060/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E6%94%BE%E5%BC%83%E5%96%9C%E6%AC%A2%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
        `;

        const startButton = document.createElement('button');
        startButton.textContent = '开始自动选择';
        startButton.style.cssText = `
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
        `;

        const statusText = document.createElement('div');
        statusText.style.marginTop = '5px';

        panel.appendChild(startButton);
        panel.appendChild(statusText);
        document.body.appendChild(panel);

        return { panel, startButton, statusText };
    }

    async function simulateMouseEvents(element) {
        const events = ['mouseover', 'mousedown', 'mouseup', 'click'];
        const rect = element.getBoundingClientRect();

        for (const eventType of events) {
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: rect.left + 5,
                clientY: rect.top + 5
            });
            await sleep(50);
            element.dispatchEvent(event);
        }
    }

    // 自动选择视频
    async function autoSelectVideos() {
        const { startButton, statusText } = createPanel();
        let isRunning = false;

        startButton.addEventListener('click', async () => {
            if (isRunning) {
                isRunning = false;
                startButton.textContent = '开始自动选择';
                return;
            }

            isRunning = true;
            startButton.textContent = '停止';
            let selectedCount = 0;
            let currentIndex = 1;

            while (isRunning) {
                try {
                    const xpath = `//*[@id="douyin-right-container"]/div[2]/div/div/div/div[3]/div/div/div[2]/div/ul/li[${currentIndex}]/div[2]/div/div/span/span/span`;
                    const element = document.evaluate(
                        xpath,
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;

                    if (element && isElementVisible(element)) {
                        console.log(`尝试选择第 ${currentIndex} 个视频`);

                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await sleep(5);

                        try {
                            const parentCheckbox = element.closest('div[class*="check"]') || element.parentElement;

                            if (parentCheckbox) {
                                await simulateMouseEvents(parentCheckbox);

                                // 直接修改元素的类名和状态
                                parentCheckbox.classList.add('checked');
                                const input = parentCheckbox.querySelector('input[type="checkbox"]');
                                if (input) {
                                    input.checked = true;
                                }

                                // 触发自定义事件
                                const changeEvent = new Event('change', { bubbles: true });
                                parentCheckbox.dispatchEvent(changeEvent);

                                console.log('点击父级元素');
                            } else {
                                await simulateMouseEvents(element);
                                console.log('点击当前元素');
                            }

                            selectedCount++;
                            statusText.textContent = `已选择 ${selectedCount} 个视频`;
                            console.log(`成功选择第 ${currentIndex} 个视频`);

                            await sleep(5);
                        } catch (clickError) {
                            console.error('点击元素失败:', clickError);
                        }
                    } else {
                        console.log(`未找到第 ${currentIndex} 个视频或视频不可见`);
                    }

                    currentIndex++;

                    if (!element || !isElementVisible(element)) {
                        console.log('滚动页面寻找更多视频...');
                        window.scrollBy(0, 200);
                        await sleep(10);
                    }

                } catch (error) {
                    console.error('选择视频时出错:', error);
                    statusText.textContent = '出错: ' + error.message;
                    currentIndex++;
                }
            }
        });
    }

    // 检查元素是否可见
    function isElementVisible(element) {
        try {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                parseFloat(style.opacity) > 0
            );
        } catch (e) {
            console.error('检查元素可见性时出错:', e);
            return false;
        }
    }

    // 延时函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 等待页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoSelectVideos);
    } else {
        autoSelectVideos();
    }
})();