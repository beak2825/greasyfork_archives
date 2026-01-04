// ==UserScript==
// @name         解除CSDN/知乎/哔哩哔哩登录界面限制并允许复制内容
// @namespace    https://www.example.com
// @version      1.2
// @description  要啥登录 | 直接复制 | 不需要看它脸色
// @author       Li De Zhuo
// @license      GPL-3.0 License
// @match        https://www.zhihu.com/*
// @match        https://*.zhihu.com/*
// @match        https://blog.csdn.net/*
// @match        https://*.csdn.net/*
// @match        https://www.jianshu.com/*
// @match        https://*.jianshu.com/*
// @match        https://www.bilibili.com/*
// @match        https://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470598/%E8%A7%A3%E9%99%A4CSDN%E7%9F%A5%E4%B9%8E%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E9%99%90%E5%88%B6%E5%B9%B6%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/470598/%E8%A7%A3%E9%99%A4CSDN%E7%9F%A5%E4%B9%8E%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E9%99%90%E5%88%B6%E5%B9%B6%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

// @note         0.1.2 优化了屏蔽策略，增加CSDN/哔哩哔哩功能

(function() {
    'use strict';

    // 去除知乎登录页面的遮罩层
    const removeLoginBackdrop = () => {
        const backdropElement = document.querySelector('.Modal-wrapper');
        if (backdropElement) {
            backdropElement.remove();
        }
    };

    // 去除知乎登录页面的弹窗
    const removeLoginModal = () => {
        const modalElement = document.querySelector('.css-1ynzxqw');
        if (modalElement) {
            modalElement.remove();
        }
    };

    // 去除知乎登录页面的下拉窗
    const removeLoginDropdown = () => {
        const dropdownElement = document.querySelector('.css-1hwwfws');
        if (dropdownElement) {
            dropdownElement.remove();
        }
    };

    // 阻止知乎class为css-jmxm1g的button鼠标经过效果
    const blockButtonHoverEffect = () => {
        const buttonElement = document.querySelector('.css-jmxm1g');
        if (buttonElement) {
            buttonElement.style.pointerEvents = 'none';
        }
    };

    blockButtonHoverEffect();

    // 允许复制内容
    const allowCopyContent = () => {
        document.body.removeEventListener('copy', blockCopyEvent, true);
        document.body.removeEventListener('cut', blockCopyEvent, true);
        document.body.removeEventListener('paste', blockPasteEvent, true);
    };

    // 阻止复制事件的默认行为
    const blockCopyEvent = (event) => {
        event.stopPropagation();
    };

    // 阻止粘贴事件的默认行为
    const blockPasteEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    // 设置知乎页面的overflow属性为auto
    const setPageOverflowAuto = () => {
        document.documentElement.style.overflow = 'auto';
    };

    // 执行去除限制和允许复制操作，以及设置overflow属性为auto
    const removeLoginRestrictions = () => {
        removeLoginBackdrop();
        removeLoginModal();
        removeLoginDropdown(); // Added this line to remove login dropdown
        allowCopyContent();
        setPageOverflowAuto();
    };

    // 监听页面加载完成事件，执行去除限制、允许复制和设置overflow属性为auto操作
    window.addEventListener('load', removeLoginRestrictions);

    // 增加CSDN免登录功能
    const removeCSDNLogin = () => {
        const loginElement = document.querySelector('.login-box');
        if (loginElement) {
            loginElement.remove();
        }
    };

    // 增加哔哩哔哩免登录功能
    const removeBilibiliLogin = () => {
        const loginElement = document.querySelector('.bili-header-m');
        if (loginElement) {
            loginElement.remove();
        }
    };

    removeCSDNLogin();
    removeBilibiliLogin();
})();