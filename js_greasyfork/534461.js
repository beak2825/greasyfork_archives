// ==UserScript==
// @name         gooboo部落2叠技能，自动保存要设置10秒
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动进入部落点击技能
// @author       Your Name
// @match        https://*/gooboo/*
// @match        https://gooboo.g8hh.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534461/gooboo%E9%83%A8%E8%90%BD2%E5%8F%A0%E6%8A%80%E8%83%BD%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E8%A6%81%E8%AE%BE%E7%BD%AE10%E7%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/534461/gooboo%E9%83%A8%E8%90%BD2%E5%8F%A0%E6%8A%80%E8%83%BD%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E8%A6%81%E8%AE%BE%E7%BD%AE10%E7%A7%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

const config = {
        initialDelay: 500,    // 等待页面稳定
        hoverDuration: 300     // 有效悬停时长
    };

    // 精准选择器组合
    const targetSelector = [
        '.v-btn__content:has(.mdi-apps)',      // 图标容器
        '.v-btn__content:has(span.ml-2)',      // 文字容器
        '.v-btn[class*="menu-activator"]'      // Vuetify 菜单激活器
    ].join(',');

    const simulateHover = (element) => {
        // 创建真实悬停事件流
        const events = ['mouseover', 'mouseenter', 'mousemove'];
        events.forEach(type => {
            element.dispatchEvent(new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: element.getBoundingClientRect().x + 10,
                clientY: element.getBoundingClientRect().y + 10
            }));
        });

        // 保持悬停状态足够触发
        setTimeout(() => {
            element.dispatchEvent(new MouseEvent('mouseout', {
                bubbles: true,
                cancelable: true
            }));
        }, config.hoverDuration);
    };

    const init = () => {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        // 单次精准触发
        simulateHover(target);

        // 验证展开状态
        setTimeout(() => {
            const menu = document.querySelector('.v-menu__content:not([aria-hidden="true"])');
            if (!menu) console.warn('菜单可能未正确展开');
        }, 500);
    };

    // 智能启动
    if (document.readyState === 'complete') {
        setTimeout(init, config.initialDelay);
    } else {
        window.addEventListener('load', () => setTimeout(init, config.initialDelay));
    }
    // 配置检查间隔（毫秒）
    const CHECK_INTERVAL = 1000;
    // 创建检查器
    const checkAndClick = setInterval(() => {
        // 查询目标元素
        const motionIcon = document.querySelector('.mdi-motion');
        const waterIcon = document.querySelector('.mdi-water');
        const heartIcon = document.querySelector('.mdi-heart');
        const groupIcon = document.querySelector('.mdi-account-group');
        

        // 如果找到元素
        if (groupIcon) {
            // 执行点击操作
         groupIcon.click();
        }
        if (heartIcon) {
            // 执行点击操作
         heartIcon.click();
            clearInterval(checkAndClick);
        setTimeout(() => location.reload(), 10000);
            //10秒后刷新
        }
        if (waterIcon) {
            // 执行点击操作
         waterIcon.click();
            clearInterval(checkAndClick);
        setTimeout(() => location.reload(), 10000);
        }
        if (motionIcon) {
            // 执行点击操作
          motionIcon.click();
            clearInterval(checkAndClick);
        setTimeout(() => location.reload(), 10000);
        }
    }, CHECK_INTERVAL);
})();