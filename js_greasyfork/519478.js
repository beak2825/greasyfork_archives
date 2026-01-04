// ==UserScript==
// @name         2Poi链接批量提交
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  批量向2Poi的购物车中添加商品。
// @author       得翛
// @match        https://2poi.cc/*
// @supportURL   https://styhsub.org/DeXiao/
// @license      MIT
// @grant        none
// @Created      2024-12-02 03:10:23
// @downloadURL https://update.greasyfork.org/scripts/519478/2Poi%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/519478/2Poi%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.right = '10px';
    controlPanel.style.backgroundColor = 'white';
    controlPanel.style.border = '1px solid black';
    controlPanel.style.padding = '10px';
    controlPanel.style.zIndex = '10000';

    const textarea = document.createElement('textarea');
    textarea.rows = 10;
    textarea.cols = 30;
    textarea.placeholder = '粘贴商品链接，每行一个';
    controlPanel.appendChild(textarea);

    const startButton = document.createElement('button');
    startButton.innerText = '开始批量处理';
    controlPanel.appendChild(startButton);

    document.body.appendChild(controlPanel);

    let links = [];
    let currentIndex = 0;
    let lastTitle = ''; // 保存上一个商品的标题

    startButton.addEventListener('click', () => {
        links = textarea.value.trim().split('\n').filter(link => link.length > 0);
        currentIndex = 0;
        if (links.length > 0) {
            processLinks();
        } else {
            alert('请粘贴至少一个商品链接！');
        }
    });

    async function processLinks() {
        if (currentIndex >= links.length) {
            alert('所有链接已处理完成！');
            return;
        }

        const currentLink = links[currentIndex];
        const searchInput = document.querySelector('input[placeholder="输入/粘贴 原站商品链接一键代购"]'); // 搜索框
        const searchButton = document.querySelector('.box .img img'); // 搜索按钮

        if (searchInput && searchButton) {
            // 填写搜索框并点击
            searchInput.value = currentLink;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchButton.click();

            try {
                // 等待加载动画消失
                await waitForElementDisappearance('.ant-spin.ant-spin-spinning', 10000);

                // 获取商品标题
                const currentTitle = document.querySelector('.product-header p.title')?.innerText || '';

                // 重复检测
                if (lastTitle && currentTitle === lastTitle) {
                    alert('有一个链接被重复提交');
                    currentIndex++; // 跳过重复的链接
                    setTimeout(processLinks, 1000);
                    return;
                }

                lastTitle = currentTitle;

                // 点击加入购物车按钮
                const addToCartButton = document.querySelector('.btn-add-cart');
                if (addToCartButton) {
                    addToCartButton.click();

                    // 等待新增的成功弹窗
                    await waitForNewElement('.ant-message-success', 5000);
                    console.log('加入购物车成功：', currentLink);
                }

                currentIndex++;
                setTimeout(processLinks, 1000); // 延时处理下一个链接
            } catch (e) {
                console.error(`处理链接失败：${currentLink}`, e);
                currentIndex++;
                setTimeout(processLinks, 1000); // 跳过继续
            }
        } else {
            alert('未找到搜索框或按钮，请检查页面元素选择器。');
        }
    }

    // 等待新增节点
    function waitForNewElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for new element'));
            }, timeout);

            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && node.matches(selector)) {
                                clearTimeout(timer);
                                observer.disconnect();
                                resolve(true);
                                return;
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // 等待元素消失
    function waitForElementDisappearance(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for element disappearance'));
            }, timeout);

            const observer = new MutationObserver(() => {
                if (!document.querySelector(selector)) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(true);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
})();