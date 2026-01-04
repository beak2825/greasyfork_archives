// ==UserScript==
// @name         Show Server Errors with Time / by leizingyiu with gpt
// @namespace    http://leizingyiu.net/
// @version      1.1
// @description  Display a floating layer for server errors with time and animations, and fix unnecessary alerts.
// @author       leizingyiu & GPT
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518803/Show%20Server%20Errors%20with%20Time%20%20by%20leizingyiu%20with%20gpt.user.js
// @updateURL https://update.greasyfork.org/scripts/518803/Show%20Server%20Errors%20with%20Time%20%20by%20leizingyiu%20with%20gpt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建浮层容器
    const errorContainer = document.createElement('div');
    errorContainer.style.position = 'fixed';
    errorContainer.style.bottom = '0';
    errorContainer.style.left = '0';
    errorContainer.style.width = '100%';
    errorContainer.style.maxHeight = '30vh'; // 限制显示高度
    errorContainer.style.overflowY = 'auto';
    errorContainer.style.pointerEvents = 'none'; // 默认不干扰页面操作
    errorContainer.style.zIndex = '9999';
    errorContainer.style.display = 'flex';
    errorContainer.style.flexDirection = 'column';
    errorContainer.style.alignItems = 'center';
    errorContainer.style.gap = '5px';
    document.body.appendChild(errorContainer);

    // 记录当前错误数
    const MAX_ERRORS = 10;
    let errorCount = 0;

    // 创建错误显示元素
    function createErrorElement(message, time) {
        const errorElement = document.createElement('div');
        errorElement.innerHTML = `<strong>${time}</strong>: ${message}`;
        errorElement.style.background = 'rgba(255, 69, 58, 0.9)'; // 错误背景色
        errorElement.style.color = 'white';
        errorElement.style.padding = '10px 20px';
        errorElement.style.borderRadius = '5px';
        errorElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(100%)';
        errorElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        errorElement.style.pointerEvents = 'auto'; // 鼠标可交互
        errorElement.style.cursor = 'default';

        // 鼠标悬停暂停倒计时
        let hideTimeout;
        errorElement.addEventListener('mouseover', () => {
            clearTimeout(hideTimeout);
        });
        errorElement.addEventListener('mouseout', () => {
            hideTimeout = setTimeout(() => {
                hideErrorElement(errorElement);
            }, 3000);
        });

        // 动画显示
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);

        // 自动消失
        hideTimeout = setTimeout(() => {
            hideErrorElement(errorElement);
        }, 3000);

        return errorElement;
    }

    // 隐藏错误元素
    function hideErrorElement(errorElement) {
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(100%)';
        setTimeout(() => {
            errorElement.remove();
            errorCount--;
        }, 500);
    }

    // 显示错误
    function showError(message) {
        const currentTime = new Date().toLocaleTimeString(); // 错误时间
        if (errorCount >= MAX_ERRORS) {
            // 移除最旧的错误
            errorContainer.firstChild?.remove();
            errorCount--;
        }
        const errorElement = createErrorElement(message, currentTime);
        errorContainer.appendChild(errorElement);
        errorCount++;
    }

    // 拦截 fetch
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        try {
            const response = await originalFetch(...args);
            if (!response.ok && response.status === 413) {
                showError(`Error ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            showError(`Network Error: ${error.message}`);
            throw error;
        }
    };

    // 拦截 XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        this.addEventListener('load', function () {
            if (this.status === 413) {
                showError(`Error ${this.status}: ${this.statusText}`);
            }
        });
        originalXhrOpen.apply(this, args);
    };
})();
