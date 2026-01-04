// ==UserScript==
// @name         Amiami Redirect Link Button
// @name:zh-CN   Amiami跳转链接按钮
// @namespace    https://greasyfork.org/zh-CN/scripts/521740
// @version      0.6
// @description  Add buttons to redirect between Amiami.jp and Amiami.com.
// @description:zh-cn 在Amiami商品页右下角添加一个实现amiami.jp与amiami.com互相跳转的链接按钮。
// @author       Mr_Ebonycat
// @match        https://www.amiami.jp/top/detail/detail?scode=*
// @match        https://www.amiami.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521740/Amiami%20Redirect%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/521740/Amiami%20Redirect%20Link%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取URL中的scode或gcode参数
    function extractCode(url) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        return params.get('scode') || params.get('gcode');
    }

    // 创建跳转按钮
    function createRedirectButton() {
        const currentUrl = window.location.href;
        const code = extractCode(currentUrl);

        if (!code) {
            console.error('无法从URL中提取scode或gcode参数');
            return null;
        }

        const redirectUrl = createRedirectUrl(currentUrl, code);
        if (!redirectUrl) {
            return null;
        }

        const redirectButton = document.createElement('a');
        redirectButton.href = redirectUrl; // 设置链接地址
        redirectButton.textContent = currentUrl.includes('amiami.com') ? 'Go to JP' : 'Go to COM';
        redirectButton.id = 'amiami-redirect-button';
        redirectButton.style.position = 'fixed';
        redirectButton.style.bottom = '20px';
        redirectButton.style.right = '20px';
        redirectButton.style.zIndex = '9999';
        redirectButton.style.padding = '2px 4px'; // 修改按钮内边距为2px 4px
        redirectButton.style.border = 'none';
        redirectButton.style.backgroundColor = '#4CAF50';
        redirectButton.style.color = 'white';
        redirectButton.style.borderRadius = '5px';
        redirectButton.style.cursor = 'pointer';
        redirectButton.style.display = 'inline-block'; // 使链接表现得像按钮
        redirectButton.style.textDecoration = 'none'; // 去除超链接的下划线

        return redirectButton;
    }

    // 创建跳转URL
    function createRedirectUrl(currentUrl, code) {
        if (currentUrl.includes('amiami.jp')) {
            // 如果当前在amiami.jp页面，跳转到amiami.com的detail页面
            return `https://www.amiami.com/cn/detail?gcode=${code}`;
        } else if (currentUrl.includes('amiami.com')) {
            // 如果当前在amiami.com页面，跳转到amiami.jp的top/detail页面
            return `https://www.amiami.jp/top/detail/detail?scode=${code}`;
        }
        return null;
    }

    // 添加按钮到页面中
    function addButtonToPage() {
        const existingButton = document.getElementById('amiami-redirect-button');
        if (existingButton) {
            existingButton.remove();
        }
        const redirectButton = createRedirectButton();
        if (redirectButton) {
            document.body.appendChild(redirectButton);
        }
    }

    // 初始化脚本
    function initialize() {
        const pathname = window.location.pathname;
        if (pathname.includes('/detail')) {
            addButtonToPage();
        }
    }

    // 监听URL变化
    function observeUrlChanges() {
        let lastUrl = window.location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                initialize();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        initialize();
        observeUrlChanges();
    });
})();