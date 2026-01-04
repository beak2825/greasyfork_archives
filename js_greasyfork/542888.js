// ==UserScript==
// @name         隐藏Google Logo和搜索按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于你不想被发现在使用Google时，隐藏Google搜索页面的所有Logo元素和搜索按钮。
// @author       User
// @match        https://*.google.com/*
// @match        https://google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542888/%E9%9A%90%E8%97%8FGoogle%20Logo%E5%92%8C%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/542888/%E9%9A%90%E8%97%8FGoogle%20Logo%E5%92%8C%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1.隐藏主页的Google Logo SVG元素
    function hideMainGoogleLogo() {
        let found = false;

        // 方法1.1: 通过class名称查找SVG
        const logoSvg = document.querySelector('svg.lnXdpd');
        if (logoSvg) {
            logoSvg.style.display = 'none';
            console.log('主页Google Logo SVG已隐藏');
            found = true;
        }

        // 方法1.2: 通过SVG属性查找
        const logoByAttr = document.querySelector('svg[height="92"][width="272"][viewBox="0 0 272 92"]');
        if (logoByAttr) {
            logoByAttr.style.display = 'none';
            console.log('主页Google Logo SVG已隐藏 (通过属性)');
            found = true;
        }

        return found;
    }

    // 2.隐藏搜索按钮
    function hideSearchButtons() {
        let found = false;

        // 方法2.1: 通过class名称查找按钮容器
        const buttonContainer = document.querySelector('div.FPdoLc.lJ9FBc');
        if (buttonContainer) {
            buttonContainer.style.display = 'none';
            console.log('Google搜索按钮已隐藏');
            found = true;
        }

        // 方法2.2: 通过按钮的value属性查找
        const searchButton = document.querySelector('input[value="Google 搜索"]');
        const luckyButton = document.querySelector('input[value*="手气不错"]');
        if (searchButton || luckyButton) {
            // 找到按钮的父容器并隐藏
            const parent = (searchButton || luckyButton).closest('div, center');
            if (parent) {
                parent.style.display = 'none';
                console.log('Google搜索按钮已隐藏 (通过按钮查找)');
                found = true;
            }
        }

        // 方法2.3: 通过center标签查找
        const centerElements = document.querySelectorAll('center');
        for (let center of centerElements) {
            const hasSearchButton = center.querySelector('input[value="Google 搜索"]');
            const hasLuckyButton = center.querySelector('input[value*="手气不错"]');
            if (hasSearchButton || hasLuckyButton) {
                center.style.display = 'none';
                console.log('Google搜索按钮已隐藏 (通过center标签)');
                found = true;
            }
        }

        return found;
    }

    // 3.隐藏搜索框左侧的Google Logo
    function hideSearchGoogleLogo() {
        let found = false;

        // 方法3.1: 通过class名称查找
        const logoDiv = document.querySelector('div.logo');
        if (logoDiv) {
            logoDiv.style.display = 'none';
            console.log('搜索框Google Logo已隐藏 (通过class)');
            found = true;
        }

        // 方法3.2: 通过ID查找a标签
        const logoLink = document.querySelector('a#logo');
        if (logoLink && logoLink.parentElement) {
            logoLink.parentElement.style.display = 'none';
            console.log('搜索框Google Logo已隐藏 (通过ID)');
            found = true;
        }

        // 方法3.3: 通过href属性查找
        const logoByHref = document.querySelector('a[href*="google.com/webhp"]');
        if (logoByHref && logoByHref.parentElement && logoByHref.parentElement.classList.contains('logo')) {
            logoByHref.parentElement.style.display = 'none';
            console.log('搜索框Google Logo已隐藏 (通过href)');
            found = true;
        }

        return found;
    }

    // 执行所有隐藏操作
    function hideAllElements() {
        const mainLogoHidden = hideMainGoogleLogo();
        const buttonsHidden = hideSearchButtons();
        const searchLogoHidden = hideSearchGoogleLogo();
        return mainLogoHidden || buttonsHidden || searchLogoHidden ;
    }

    // 立即执行一次
    if (hideAllElements()) {
        // 如果成功隐藏了某些元素，再等待一下看是否有其他元素需要隐藏
        setTimeout(hideAllElements, 500);
    }

    // 如果页面还没加载完成，等待DOM加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            hideAllElements();
            setTimeout(hideAllElements, 500); // 延迟再检查一次
        });
    } else {
        // 页面已加载，使用观察器监听动态变化
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });
            if (shouldCheck) {
                hideAllElements();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 15秒后自动停止观察，避免性能问题
        setTimeout(() => {
            observer.disconnect();
            console.log('观察器已停止');
        }, 15000);
    }

    // 额外的定时检查，确保元素被隐藏
    const checkInterval = setInterval(() => {
        hideAllElements();
    }, 1000);

    // 10秒后停止定时检查
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log('定时检查已停止');
    }, 10000);
})();