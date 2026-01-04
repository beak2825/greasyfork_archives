// ==UserScript==
// @name         抖音直播全屏助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  抖音直播自动全屏、关闭弹幕、设置原画质量、隐藏观众列表
// @author       Your name
// @match        https://live.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528142/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528142/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let optimizeButton = null;
    let isButtonVisible = true;

    async function waitForElement(selector, maxWait = 10000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, maxWait);
        });
    }

    // 设置清晰度
    async function setVideoQuality() {
        console.log('1. 开始设置清晰度...');
        const qualityContainer = await waitForElement('.QualitySwitchPluginContainer');
        if (qualityContainer) {
            const currentQuality = qualityContainer.querySelector('[data-e2e="quality"]');
            if (currentQuality) {
                console.log('打开清晰度选项');
                currentQuality.click();

                return new Promise(resolve => {
                    setTimeout(() => {
                        // 找到选择器容器并点击第一个选项（原画）
                        const qualitySelector = document.querySelector('[data-e2e="quality-selector"]');
                        if (qualitySelector) {
                            const firstOption = qualitySelector.firstElementChild;
                            if (firstOption) {
                                console.log('选择原画质量');
                                firstOption.click();
                            }
                        }
                        resolve();
                    }, 500);
                });
            }
        }
    }

    // 关闭弹幕
    function toggleDanmu() {
        console.log('2. 关闭弹幕');
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'b',
            code: 'KeyB',
            keyCode: 66,
            which: 66,
            bubbles: true
        }));
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    // 设置全屏
    async function setFullscreen() {
        console.log('3. 设置全屏');
        const fullscreenButton = await waitForElement('.xg-get-fullscreen');
        if (fullscreenButton) {
            fullscreenButton.closest('div').click();
        } else {
            console.log('未找到全屏按钮');
        }
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    // 关闭观众列表
    async function hideViewerList() {
        console.log('4. 关闭观众列表');
        const closeButton = await waitForElement('.chatroom_close');
        if (closeButton) {
            closeButton.click();
        }
    }

    // 切换按钮显示/隐藏
    function toggleButton() {
        if (!optimizeButton) return;

        isButtonVisible = !isButtonVisible;
        optimizeButton.style.display = isButtonVisible ? 'block' : 'none';
    }

    // 主函数：按顺序执行所有操作
    async function enhanceLiveStream() {
        console.log('开始优化直播...');
        try {
            await setVideoQuality();
            await toggleDanmu();
            await setFullscreen();
            await hideViewerList();
            console.log('所有操作已完成');
        } catch (error) {
            console.error('执行过程中出错:', error);
        }
    }

    // 添加控制按钮
    function addButton() {
        optimizeButton = document.createElement('button');
        optimizeButton.innerHTML = '一键优化';
        optimizeButton.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999;
            padding: 8px 16px;
            background: rgba(0,0,0,0.6);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
            display: block;
        `;

        optimizeButton.onmouseover = () => {
            optimizeButton.style.background = 'rgba(0,0,0,0.8)';
        };
        optimizeButton.onmouseout = () => {
            optimizeButton.style.background = 'rgba(0,0,0,0.6)';
        };

        optimizeButton.onclick = async () => {
            await enhanceLiveStream();
            toggleButton(); // 执行完优化后隐藏按钮
        };

        document.body.appendChild(optimizeButton);
    }

    // 初始化
    function initialize() {
        addButton();

        // 添加快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'f') {
                if (!isButtonVisible) {
                    // 如果按钮当前是隐藏的，按F显示按钮
                    toggleButton();
                } else {
                    // 如果按钮当前是显示的，执行优化并隐藏按钮
                    enhanceLiveStream().then(() => {
                        toggleButton();
                    });
                }
            }
        });
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();