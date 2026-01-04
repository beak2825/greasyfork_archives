// ==UserScript==
// @name         芒果TV网页版自动关闭弹幕
// @namespace    http://tampermonkey.net/
// @version      1.17.4
// @description  自动关闭芒果TV视频弹幕，支持切换集数后自动关闭弹幕，用户可选择启用或禁用功能，支持快捷键 D 手动开启/关闭弹幕
// @author       mankaki
// @match        *://www.mgtv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mgtv.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/515421/%E8%8A%92%E6%9E%9CTV%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/515421/%E8%8A%92%E6%9E%9CTV%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    let autoCloseDanmu = JSON.parse(localStorage.getItem('autoCloseDanmu')) ?? true;
    let networkErrorFlag = false;
    let lastUrl = window.location.href;
 
    function createTooltip(text, direction = 'top') {
        const tooltip = document.createElement('div');
        tooltip.innerText = text;
        tooltip.style.position = 'fixed';
        tooltip.style.padding = '6px 10px';
        tooltip.style.fontSize = '13px';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = '#fff';
        tooltip.style.borderRadius = '6px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '10000';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transition = 'opacity 0.2s ease';
        tooltip.style.opacity = '0';
 
        if (direction === 'left') {
            tooltip.style.transform = 'translate(-105%, -50%)';
        } else {
            tooltip.style.transform = 'translate(-50%, -120%)';
        }
 
        return tooltip;
    }
 
    function addTooltip(button, text, direction) {
        if (!button || button.dataset.tooltipAttached) return;
        button.dataset.tooltipAttached = 'true';
 
        const tooltip = createTooltip(text, direction);
        document.body.appendChild(tooltip);
 
        button.addEventListener('mouseenter', () => {
            const rect = button.getBoundingClientRect();
            if (direction === 'left') {
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.top + rect.height / 2}px`;
            } else {
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top}px`;
            }
            tooltip.style.opacity = '1';
        });
 
        button.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    }
 
    function createToggleIconButton() {
        const button = document.createElement('div');
        button.id = 'autoDanmuToggleBtn';
        button.style.position = 'fixed';
        button.style.bottom = '9px'; // 距离底部9px
        button.style.right = '0'; // 紧贴右边
        button.style.zIndex = '9999';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '52px';
        button.style.height = '40px';
        button.style.borderTopLeftRadius = '20px';
        button.style.borderBottomLeftRadius = '20px';
        button.style.borderTopRightRadius = '0';
        button.style.borderBottomRightRadius = '0';
        button.style.backgroundColor = '#fff';
        button.style.boxShadow = '-2px 2px 8px rgba(0, 0, 0, 0.1)';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
 
        // 图标 img
        const icon = document.createElement('img');
        icon.style.width = '24px';
        icon.style.height = '24px';
        icon.style.marginRight = '-4px'; // 让图标更靠右，减少内边距空隙
        icon.src = autoCloseDanmu
            ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02IDE4aDEyYzMuMzExIDAgNi0yLjY4OSA2LTZzLTIuNjg5LTYtNi02aC0xMi4wMzljLTMuMjkzLjAyMS01Ljk2MSAyLjcwMS01Ljk2MSA2IDAgMy4zMTEgMi42ODggNiA2IDZ6bTEyLTEwYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0IDQtMS43OTIgNC00LTEuNzkyLTQtNC00eiIvPjwvc3ZnPg=='
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xOCAxOGgtMTJjLTMuMzExIDAtNi0yLjY4OS02LTZzMi42ODktNiA2LTZoMTIuMDM5YzMuMjkzLjAyMSA1Ljk2MSAyLjcwMSA1Ljk2MSA2IDAgMy4zMTEtMi42ODggNi02IDZ6bTAtMTBoLTEyYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0aDEyYzIuMjA4IDAgNC0xLjc5MiA0LTQgMC0yLjE5OS0xLjc3OC0zLjk4Ni0zLjk3NC00aC0uMDI2em0tMTIgMWMxLjY1NiAwIDMgMS4zNDQgMyAzcy0xLjM0NCAzLTMgMy0zLTEuMzQ0LTMtMyAxLjM0NC0zIDMtM3oiLz48L3N2Zz4=';
 
        button.appendChild(icon);
 
        button.addEventListener('click', () => {
            autoCloseDanmu = !autoCloseDanmu;
            localStorage.setItem('autoCloseDanmu', JSON.stringify(autoCloseDanmu));
            icon.src = autoCloseDanmu
                ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02IDE4aDEyYzMuMzExIDAgNi0yLjY4OSA2LTZzLTIuNjg5LTYtNi02aC0xMi4wMzljLTMuMjkzLjAyMS01Ljk2MSAyLjcwMS01Ljk2MSA2IDAgMy4zMTEgMi42ODggNiA2IDZ6bTEyLTEwYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0IDQtMS43OTIgNC00LTEuNzkyLTQtNC00eiIvPjwvc3ZnPg=='
            : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xOCAxOGgtMTJjLTMuMzExIDAtNi0yLjY4OS02LTZzMi42ODktNiA2LTZoMTIuMDM5YzMuMjkzLjAyMSA1Ljk2MSAyLjcwMSA1Ljk2MSA2IDAgMy4zMTEtMi42ODggNi02IDZ6bTAtMTBoLTEyYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0aDEyYzIuMjA4IDAgNC0xLjc5MiA0LTQgMC0yLjE5OS0xLjc3OC0zLjk4Ni0zLjk3NC00aC0uMDI2em0tMTIgMWMxLjY1NiAwIDMgMS4zNDQgMyAzcy0xLjM0NCAzLTMgMy0zLTEuMzQ0LTMtMyAxLjM0NC0zIDMtM3oiLz48L3N2Zz4=';
        });
 
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#ff5f00';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#fff';
        });
 
        document.body.appendChild(button);
 
        // 左侧显示 tooltip（不使用 title）
        addTooltip(button, '💡 是否自动关闭弹幕', 'left');
    }
 
    function closeDanmu() {
        if (!autoCloseDanmu) return;
        const danmuButtonOn = document.querySelector("._danmuSwitcher_1qow5_208._on_1qow5_238");
        if (danmuButtonOn) {
            danmuButtonOn.click();
            console.log("弹幕已关闭");
        }
    }
 
    function toggleDanmu() {
        const btn = document.querySelector("._danmuSwitcher_1qow5_208");
        if (btn) {
            btn.click();
            console.log("快捷键切换弹幕");
        }
    }
 
    window.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            toggleDanmu();
        }
    });
 
    function addDanmuShortcutTooltip() {
        const danmuButton = document.querySelector("._danmuSwitcher_1qow5_208");
        if (!danmuButton || danmuButton.dataset.tooltipAttached) return;
        // 使用默认上方 tooltip
        addTooltip(danmuButton, "💡 按 D 键可开关弹幕", 'top');
    }
 
    function init() {
        closeDanmu();
        addDanmuShortcutTooltip();
    }
 
    window.addEventListener('load', init);
 
    const originalConsoleError = console.error;
    console.error = function (...args) {
        originalConsoleError.apply(console, args);
        if (args.some(arg => typeof arg === 'string' && /^Ne/.test(arg))) {
            networkErrorFlag = true;
            closeDanmu();
        }
    };
 
    const playerElement = document.querySelector(".mango-player.p-MacIntel.player-s");
    if (playerElement) {
        playerElement.addEventListener('click', () => {
            if (autoCloseDanmu && networkErrorFlag) {
                setTimeout(() => {
                    closeDanmu();
                    networkErrorFlag = false;
                }, 3000);
            }
        });
    }
 
    document.addEventListener('click', () => {
        setTimeout(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                init();
            }
        }, 2000);
    });
 
    const titleObserver = new MutationObserver(() => {
        setTimeout(() => {
            init();
        }, 3000);
    });
 
    titleObserver.observe(document.querySelector('title'), { childList: true });
 
    createToggleIconButton();
})();
