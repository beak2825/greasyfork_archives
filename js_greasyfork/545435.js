// ==UserScript==
// @name         即梦批量图片下载
// @namespace    http://weixin.13296305689.com
// @version      1.1
// @description  自动化批量图片点击与下载
// @author       幽谷丰云
// @match        https://jimeng.jianying.com/ai-tool/asset*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545435/%E5%8D%B3%E6%A2%A6%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/545435/%E5%8D%B3%E6%A2%A6%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 工具函数：缓慢滚动到底部，触发页面加载更多图片
    async function scrollToBottomUntilNoMoreImages(imageListSelector, checkDelay = 600, maxTries = 30) {
        let imageList = document.querySelector(imageListSelector);
        if (!imageList) return;

        let previousImageCount = 0;
        let sameCountTimes = 0;

        for (let i = 0; i < maxTries; i++) {
            imageList.scrollTo({ top: imageList.scrollHeight, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, checkDelay));
            let imgs = imageList.querySelectorAll('img');
            if (imgs.length === previousImageCount) {
                sameCountTimes++;
            } else {
                sameCountTimes = 0;
            }
            previousImageCount = imgs.length;
            if (sameCountTimes >= 3) break;
        }
    }

    // 多选按钮功能（只执行第一步和第二步）
    async function multiSelectOnly(clickTarget) {
        // 1. 点批量按钮
        let batchBtn = document.querySelector("#dreamina-ui-configuration-content-wrapper .batch-btn-LpMMCe");
        if (batchBtn) batchBtn.click();
        await new Promise(r => setTimeout(r, 800));

        // 2. 滚动加载所有图片
        let imageListSelector = '.imageList-ulqnt3';
        await scrollToBottomUntilNoMoreImages(imageListSelector, 600, 30);

        // 3. 批量点击
        let imageList = document.querySelector(imageListSelector);
        if (!imageList) {
            alert("未找到图片列表区域！");
            return;
        }
        let clickCount = 0;
        let imgs = Array.from(imageList.querySelectorAll('img'));
        for (let img of imgs) {
            if (clickCount >= clickTarget) break;
            let isChecked = img.parentElement.querySelector('[class*="check"]') || img.closest('div[style*="border"]');
            if (!isChecked) {
                img.click();
                clickCount++;
                await new Promise(r => setTimeout(r, 100));
            }
        }

        alert("多选完成");
    }

    // 自动批量按钮功能（全流程）
    async function automate(clickTarget) {
        let batchBtn = document.querySelector("#dreamina-ui-configuration-content-wrapper .batch-btn-LpMMCe");
        if (batchBtn) batchBtn.click();
        await new Promise(r => setTimeout(r, 800));

        let imageListSelector = '.imageList-ulqnt3';
        await scrollToBottomUntilNoMoreImages(imageListSelector, 600, 30);

        let imageList = document.querySelector(imageListSelector);
        if (!imageList) {
            alert("未找到图片列表区域！");
            return;
        }
        let clickCount = 0;
        let imgs = Array.from(imageList.querySelectorAll('img'));
        for (let img of imgs) {
            if (clickCount >= clickTarget) break;
            let isChecked = img.parentElement.querySelector('[class*="check"]') || img.closest('div[style*="border"]');
            if (!isChecked) {
                img.click();
                clickCount++;
                await new Promise(r => setTimeout(r, 100));
            }
        }

        if (clickCount < clickTarget) {
            alert(`只找到并点击了${clickCount}张图片，少于你输入的${clickTarget}。`);
            return;
        }

        // 自动点击确认提交按钮
        async function waitForSelector(selector, timeout = 5000) {
            const start = Date.now();
            return new Promise((resolve, reject) => {
                function check() {
                    const el = document.querySelector(selector);
                    if (el) return resolve(el);
                    if (Date.now() - start > timeout) return reject(new Error('Timeout'));
                    setTimeout(check, 100);
                }
                check();
            });
        }
        try {
            const btn = await waitForSelector("#dreamina-ui-configuration-content-wrapper button:nth-child(4) > div > span", 5000);
            btn.click();
        } catch (e) {}
    }

    // 界面
    function addUI() {
        // 容器，方便竖直堆叠
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = '30px';
        container.style.bottom = '30px';
        container.style.zIndex = 99999;
        container.style.display = 'flex';
        container.style.flexDirection = 'column'; // 竖直排列
        container.style.gap = '14px';
        container.style.alignItems = 'flex-end';

        // 输入框
        const input = document.createElement('input');
        input.type = "number";
        input.value = 3;
        input.min = 1;
        input.max = 9999;
        input.style.width = '60px';
        input.style.height = '38px';
        input.style.fontSize = '16px';
        input.style.padding = '6px';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #ccc';
        input.style.marginBottom = '0';

        // 多选按钮
        const btnMulti = document.createElement('button');
        btnMulti.textContent = "多选";
        btnMulti.style.padding = '10px 22px';
        btnMulti.style.background = '#67C23A';
        btnMulti.style.color = '#fff';
        btnMulti.style.border = 'none';
        btnMulti.style.borderRadius = '6px';
        btnMulti.style.cursor = 'pointer';
        btnMulti.style.fontSize = '16px';
        btnMulti.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
        btnMulti.onclick = () => {
            let val = parseInt(input.value, 10);
            if (!val || val < 1) {
                alert("请输入正确的点击数量！");
                return;
            }
            multiSelectOnly(val);
        };

        // 自动批量按钮
        const btnAuto = document.createElement('button');
        btnAuto.textContent = "自动批量";
        btnAuto.style.padding = '10px 22px';
        btnAuto.style.background = '#409eff';
        btnAuto.style.color = '#fff';
        btnAuto.style.border = 'none';
        btnAuto.style.borderRadius = '6px';
        btnAuto.style.cursor = 'pointer';
        btnAuto.style.fontSize = '16px';
        btnAuto.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
        btnAuto.onclick = () => {
            let val = parseInt(input.value, 10);
            if (!val || val < 1) {
                alert("请输入正确的点击数量！");
                return;
            }
            automate(val);
        };

        container.appendChild(input);
        container.appendChild(btnMulti);
        container.appendChild(btnAuto);
        document.body.appendChild(container);
    }

    window.addEventListener('load', addUI);
})();
