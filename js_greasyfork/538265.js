// ==UserScript==
// @name         隐藏搜索框左侧的Google Logo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏Google搜索页面的Logo元素
// @author       User
// @match        https://*.google.com/*
// @match        https://google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538265/%E9%9A%90%E8%97%8F%E6%90%9C%E7%B4%A2%E6%A1%86%E5%B7%A6%E4%BE%A7%E7%9A%84Google%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/538265/%E9%9A%90%E8%97%8F%E6%90%9C%E7%B4%A2%E6%A1%86%E5%B7%A6%E4%BE%A7%E7%9A%84Google%20Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function hideGoogleLogo() {
        // 方法1: 通过class名称查找
        const logoDiv = document.querySelector('div.logo');
        if (logoDiv) {
            logoDiv.style.display = 'none';
            console.log('Google Logo已隐藏 (通过class)');
            return true;
        }

        // 方法2: 通过ID查找a标签
        const logoLink = document.querySelector('a#logo');
        if (logoLink && logoLink.parentElement) {
            logoLink.parentElement.style.display = 'none';
            console.log('Google Logo已隐藏 (通过ID)');
            return true;
        }

        // 方法3: 通过href属性查找
        const logoByHref = document.querySelector('a[href*="google.com/webhp"]');
        if (logoByHref && logoByHref.parentElement && logoByHref.parentElement.classList.contains('logo')) {
            logoByHref.parentElement.style.display = 'none';
            console.log('Google Logo已隐藏 (通过href)');
            return true;
        }

        return false;
    }

    // 立即执行一次
    if (hideGoogleLogo()) {
        return; // 如果成功隐藏，就退出
    }

    // 如果页面还没加载完成，等待DOM加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideGoogleLogo);
    } else {
        // 页面已加载，使用观察器监听动态变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (hideGoogleLogo()) {
                        observer.disconnect(); // 成功隐藏后停止观察
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 10秒后自动停止观察，避免性能问题
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }
})();