// ==UserScript==
// @name         BilinovelAntiBlock
// @name:zh      Bilinovel 反广告屏蔽
// @namespace    https://github.com/SuniRein/scripts
// @version      1.2.0
// @description  抑制 Bilinovel 检测到广告屏蔽插件后隐藏内容
// @author       SuniRein
// @match        https://www.bilinovel.com/*
// @match        https://www.linovelib.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilinovel.com
// @license      GPL3
// @supportURL   https://github.com/SuniRein/scripts/blob/main/CHANGELOG.md
// @downloadURL https://update.greasyfork.org/scripts/534788/BilinovelAntiBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/534788/BilinovelAntiBlock.meta.js
// ==/UserScript==

// 灵感来源: https://greasyfork.org/zh-CN/scripts/533617-bilinovel

(function () {
    'use strict';

    const checkElementInterval = 100;
    const maxWaitTime = 15000;
    let timeWaited = 0;

    // 根据不同网页定位目标元素
    function analyzePage() {
        const hostname = window.location.hostname;
        const href = window.location.href;
        if (hostname == 'www.bilinovel.com') {
            console.log('Bilinovel: 检测到 Bilinovel 网站');
            if (href.includes('/catalog')) {
                return {
                    getContent: () => document.getElementById('volumes'),
                    isTitle: (ele) => ele.classList.contains('module-header'),
                };
            }
            return {
                getContent: () => document.getElementById('acontent'),
                isTitle: (ele) => ele.classList.contains('atitle'),
            };
        } else if (hostname == 'www.linovelib.com') {
            console.log('Bilinovel: 检测到 Linovelib 网站');
            if (href.includes('/catalog')) {
                return {
                    getContent: () => document.getElementById('volume-list'),
                    isTitle: (ele) => ele.classList.contains('section_title'),
                };
            }
            return {
                getContent: () => document.getElementById('TextContent'),
                isTitle: (ele) => ele.tagName === 'H1',
            };
        }
    }

    function showElement(element) {
        element.style.setProperty('display', 'block', 'important');
    }

    function hideElement(element) {
        element.style.setProperty('display', 'none', 'important');
    }

    const { getContent, isTitle } = analyzePage();

    console.log('Bilinovel: 开始轮询获取目标元素...');

    function displayContent(content) {
        try {
            // 显示文本
            showElement(content);
            content.classList.remove('adv-box');
            console.log('Bilinovel: 显示目标元素');

            // 移除广告框
            const adBox = content.previousElementSibling;
            if (adBox && !isTitle(adBox)) {
                hideElement(adBox);
                console.log('Bilinovel: 隐藏广告框');
            }
        } catch (e) {
            console.error('Bilinovel: 修改目标元素时出错:', e);
        }
    }

    const intervalId = setInterval(() => {
        const content = getContent();
        timeWaited += checkElementInterval;

        if (content) {
            console.log('Bilinovel: 找到目标元素');
            clearInterval(intervalId);

            displayContent(content);

            // 监测目标元素样式改变
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        displayContent(content);
                    }
                }
            });
            observer.observe(content, {
                attributes: true,
                attributeFilter: ['style'],
            });

            // 监测广告横幅
            const headerElement = document.body.firstChild;
            if (headerElement) {
                const headerObserver = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            hideElement(headerElement);
                            console.log('Bilinovel: 隐藏广告横幅');
                        }
                    }
                });
                headerObserver.observe(headerElement, {
                    attributes: true,
                    attributeFilter: ['style'],
                });
            }
        } else if (timeWaited >= maxWaitTime) {
            console.warn('Bilinovel: 获取目标元素超时 (' + maxWaitTime + 'ms)，停止检查。');
            clearInterval(intervalId);
        }
    }, checkElementInterval);
})();
