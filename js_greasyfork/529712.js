// ==UserScript==
// @name         学习通阅读刷课
// @namespace    https://space.bilibili.com/314017356
// @version      1.0
// @description  通过自动点击下一页链接进行自动刷课
// @author       清遥
// @match        https://mooc1-1.chaoxing.com/mooc-ans/ztnodedetailcontroller/*
// @match        https://mooc1-1.chaoxing.com/mooc-ans/course/*
// @run-at       document-end
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/529712/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%98%85%E8%AF%BB%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/529712/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%98%85%E8%AF%BB%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSelectors = 'a.ml40.nodeItem.r, a#loadbutton';
    let hasClicked = false;
    let currentInterval = 20000; // 默认20秒

    // 间隔选择器
    function createIntervalSelector() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = 'white';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

        const label = document.createElement('label');
        label.textContent = '点击间隔：';
        label.style.marginRight = '10px';

        const select = document.createElement('select');
        select.id = 'speedSelector';
        select.innerHTML = `
            <option value="700">0.7秒(慎用)</option>
            <option value="1000">1秒</option>
            <option value="10000">10秒</option>
            <option value="20000">20秒</option>
            <option value="30000">30秒</option>
            <option value="60000">60秒</option>
        `;

        // 从存储中加载先前使用间隔
        const savedSpeed = GM_getValue('clickInterval', '20000');
        select.value = savedSpeed;
        currentInterval = parseInt(savedSpeed);

        select.addEventListener('change', (event) => {
            currentInterval = parseInt(event.target.value);
            GM_setValue('clickInterval', currentInterval.toString());
        });

        container.appendChild(label);
        container.appendChild(select);
        document.body.appendChild(container);
    }

    // 匹配及点击
    function clickTargets() {
        const elements = document.querySelectorAll(targetSelectors);
        if (elements.length && !hasClicked) {
            hasClicked = true;
            elements.forEach(element => {
                setTimeout(() => {
                    console.log(`执行延迟点击（${currentInterval/1000}秒）:`, element);
                    element.click();
                }, currentInterval);
            });
        }
    }

    createIntervalSelector();

    const observer = new MutationObserver(clickTargets);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    clickTargets();
})();