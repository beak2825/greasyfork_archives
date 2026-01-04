// ==UserScript==
// @name         抖音接口监听并插入数据（延迟）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  监听抖音接口返回数据并插入到页面中（延迟3秒）
// @author       Your Name
// @match        https://www.douyin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530163/%E6%8A%96%E9%9F%B3%E6%8E%A5%E5%8F%A3%E7%9B%91%E5%90%AC%E5%B9%B6%E6%8F%92%E5%85%A5%E6%95%B0%E6%8D%AE%EF%BC%88%E5%BB%B6%E8%BF%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530163/%E6%8A%96%E9%9F%B3%E6%8E%A5%E5%8F%A3%E7%9B%91%E5%90%AC%E5%B9%B6%E6%8F%92%E5%85%A5%E6%95%B0%E6%8D%AE%EF%BC%88%E5%BB%B6%E8%BF%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 劫持 fetch 方法
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        // 判断是否是目标接口
        if (args[0].includes('/aweme/v1/web/user/profile/other/')) {
            const cloneResponse = response.clone();
            cloneResponse.json().then(data => {
                if (data && data.user && data.user.uid) {
                    console.log('捕获到的返回数据:', data.user.uid);
                    // 延迟 3 秒后插入数据
                    setTimeout(() => {
                        insertUIDIntoPage(data.user.uid);
                    }, 3000);
                }
            });
        }

        return response;
    };

    // 劫持 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this.addEventListener('load', function () {
            // 判断是否是目标接口
            if (url.includes('/aweme/v1/web/user/profile/other/')) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response && response.user && response.user.uid) {
                        console.log('捕获到的返回数据:', response.user.uid);
                        // 延迟 3 秒后插入数据
                        setTimeout(() => {
                            insertUIDIntoPage(response.user.uid);
                        }, 3000);
                    }
                } catch (e) {
                    console.error('解析返回数据失败:', e);
                }
            }
        });
        return originalXHR.apply(this, [method, url, ...rest]);
    };

   // 将 UID 插入到页面指定位置
    function insertUIDIntoPage(uid) {
        // 查找目标元素
        const targetDiv = document.querySelector('.zI865BLc');
        if (targetDiv) {
            // 创建新的 HTML 结构
            const newElement = document.createElement('p');
            newElement.className = 'jYMHaVIt';
            newElement.innerHTML = `<span class="NtumbRDj">UID号：${uid}</span>`;
            targetDiv.appendChild(newElement); // 添加到目标元素中
        } else {
            console.warn('未找到目标元素 .IGPVd8vQ');
        }
    }
})();
