// ==UserScript==
// @name         chatshare激活码渠道全炸出📄
// @namespace    https://h5ma.cn/caicats
// @version      1.34
// @description  在chatshare网站把相关激活码获取方式全部展开，展示出目前可用渠道。
// @author       @有事反馈微信：caicats
// @match        https://**.chatshare.biz/*
// @match        https://**.chatshare.me/*
// @match        https://**.chatshare.tv/*
// @match        https://**.chatshare.xyz/*
// @match        https://**.chatshare.cc/*
// @match        https://**.chatshare.online/*
// @match        https://**.chatshare.com/*
// @match        https://**.chatshare.top/*
// @match        https://chatshare.biz/*
// @match        https://chatshare.me/*
// @match        https://chatshare.tv/*
// @match        https://chatshare.xyz/*
// @match        https://chatshare.cc/*
// @match        https://chatshare.online/*
// @match        https://chatshare.com/*
// @match        https://chatshare.top/*
// @match        https://new.oaifree.com/**
// @match        https://share.github.cn.com/**
// @match        https://chatgpt.com/**
// @match        https://oai.253282.xyz/**
// @match        https://gpt.universalbus.cn/**
// @match        https://go.gptdsb.com/**
// @match        https://*.azs.ai/**

// @license      MIT
// @icon         https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/539173/chatshare%E6%BF%80%E6%B4%BB%E7%A0%81%E6%B8%A0%E9%81%93%E5%85%A8%E7%82%B8%E5%87%BA%F0%9F%93%84.user.js
// @updateURL https://update.greasyfork.org/scripts/539173/chatshare%E6%BF%80%E6%B4%BB%E7%A0%81%E6%B8%A0%E9%81%93%E5%85%A8%E7%82%B8%E5%87%BA%F0%9F%93%84.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        createFloatingMenu();
    });

    const observer = new MutationObserver(() => {
        if (!document.querySelector('#floating-menu')) {
            createFloatingMenu();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function createFloatingMenu() {
        if (document.querySelector('#floating-menu')) return;

        const menuContainer = document.createElement('div');
        menuContainer.id = 'floating-menu';
        menuContainer.style.position = 'fixed';
        menuContainer.style.bottom = '80px';
        menuContainer.style.right = '15px';
        menuContainer.style.zIndex = '10000';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.alignItems = 'center';
        menuContainer.style.gap = '10px';

        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '12px';
        tooltip.style.visibility = 'hidden';
        tooltip.style.zIndex = '10001';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.maxWidth = '200px';
        tooltip.style.wordWrap = 'break-word';
        document.body.appendChild(tooltip);

        const mainButton = document.createElement('button');
        mainButton.id = 'main-button';
        mainButton.style.width = '40px';
        mainButton.style.height = '40px';
        mainButton.style.borderRadius = '50%';
        mainButton.style.border = 'none';
        mainButton.style.backgroundColor = '#FF69B4';
        mainButton.style.color = 'white';
        mainButton.style.cursor = 'pointer';
        mainButton.style.fontSize = '26px';
        mainButton.textContent = '+';

        let isExpanded = false;
        mainButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            toggleMenu(isExpanded, menuContainer);
        });
        addTooltip(mainButton, '展开功能列表');

        // 替换为跳转链接按钮
        const markdownButton = createMenuButton('🍑', '跳转到淘宝', () => {
            window.open('http://c8a.cn/jBCkq', '_blank');
        }, '#FFA500');
        addTooltip(markdownButton.querySelector('button'), '🍑 跳转到淘宝');

        const htmlButton = createMenuButton('🌐', '跳转到小红书', () => {
            window.open('http://c8a.cn/D2nDB', '_blank');
        }, '#FFA500');
        addTooltip(htmlButton.querySelector('button'), '🌐 跳转到小红书');

        const sponsorButton = createMenuButton('❤️', '使用教程和赞赏', () => {
            window.open('http://c8a.cn/KQLYD', '_blank');
        }, '#FF6347');
        addTooltip(sponsorButton.querySelector('button'), '❤️ 使用教程和赞赏');

        const shopButton = createMenuButton('🛒', '其他付费GPT库系统', () => {
            window.open('http://c8a.cn/Yr6Zd', '_blank');
        }, '#32CD32');
        addTooltip(shopButton.querySelector('button'), '🛒 其他付费GPT库系统');

        menuContainer.appendChild(mainButton);
        menuContainer.appendChild(markdownButton);
        menuContainer.appendChild(htmlButton);
        menuContainer.appendChild(sponsorButton);
        menuContainer.appendChild(shopButton);
        document.body.appendChild(menuContainer);

        toggleMenu(false, menuContainer);

        function addTooltip(element, text) {
            element.addEventListener('mouseenter', (event) => {
                tooltip.textContent = text;
                tooltip.style.visibility = 'visible';
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
                tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;
            });

            element.addEventListener('mouseleave', () => {
                tooltip.style.visibility = 'hidden';
            });
        }
    }

    function createMenuButton(icon, text, onClick, bgColor) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'relative';

        const button = document.createElement('button');
        button.className = 'menu-button';
        button.style.width = '36px';
        button.style.height = '36px';
        button.style.borderRadius = '50%';
        button.style.border = 'none';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.textContent = icon;
        button.addEventListener('click', onClick);

        buttonContainer.appendChild(button);
        return buttonContainer;
    }

    function toggleMenu(expand, menuContainer) {
        const buttons = menuContainer.querySelectorAll('.menu-button');
        buttons.forEach(button => {
            button.style.display = expand ? 'block' : 'none';
        });
    }
})();
