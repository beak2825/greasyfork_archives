// ==UserScript==
// @name         nowhots.com 布局调整
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  调整 nowhots.com 布局，交换左右侧栏，并调整导航菜单高度。
// @author       Gemini, Doubao
// @match        https://nowhots.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529613/nowhotscom%20%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/529613/nowhotscom%20%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(() => {
    'use strict';
    // 获取元素的辅助函数
    const getEl = (cls) => document.querySelector(cls);

    // 从本地存储获取导航位置设置，默认为左侧
    const getNavPosition = () => localStorage.getItem('nowhotsNavPosition') || 'left';

    // 保存导航位置设置到本地存储
    const saveNavPosition = (position) => localStorage.setItem('nowhotsNavPosition', position);

    // 检测当前模式 - 注意：class=dark-mode 为日间模式的配色
    const isDayMode = () => document.body.classList.contains('dark-mode');

    // 获取当前模式的按钮样式
    const getButtonStyles = () => {
        // 日夜间模式样式配置
        const styles = {
            day: {
                active: {
                    bgColor: 'rgb(248, 248, 248)',
                    darkreader: 'var(--darkreader-background-f8f8f8, #1c1e1f)'
                }
            },
            night: {
                active: {
                    bgColor: 'rgb(82, 83, 84)',
                    darkreader: 'var(--darkreader-background-525354, #3e4446)'
                }
            }
        };
        // 返回当前模式的样式
        return isDayMode() ? styles.night : styles.day;
    };
    // 添加导航设置选项
    const addNavSettings = () => {
        const setupContainer = getEl('.barrier-setup-base-container-box');
        if (!setupContainer) return;

        // 创建导航设置选项
        const navSettingsDiv = document.createElement('div');
        navSettingsDiv.className = 'barrier-setup-base-container-common-box';
        navSettingsDiv.innerHTML = `
            <div class="barrier-setup-base-container-common-text-box">
                <span>导航显示</span>
            </div>
            <div class="barrier-setup-base-container-common-switch-box" id="nav-position-left">
                <span>左</span>
            </div>
            <div class="barrier-setup-base-container-common-switch-box" id="nav-position-right">
                <span>右</span>
            </div>
        `;
        // 插入到设置容器中
        setupContainer.appendChild(navSettingsDiv);

        // 更新按钮状态
        updateSettingsUI();
        // 添加点击事件
        document.getElementById('nav-position-left').addEventListener('click', () => {
            if (getNavPosition() !== 'left') {
                saveNavPosition('left');
                window.location.reload();
            }
        });
        document.getElementById('nav-position-right').addEventListener('click', () => {
            if (getNavPosition() !== 'right') {
                saveNavPosition('right');
                window.location.reload();
            }
        });
        // 监听 body 类变化，自动更新按钮样式
        const observer = new MutationObserver(() => updateSettingsUI());
        observer.observe(document.body, { attributes: true });
    };

    // 更新设置按钮UI状态
    const updateSettingsUI = () => {
        const position = getNavPosition();
        const leftBtn = document.getElementById('nav-position-left');
        const rightBtn = document.getElementById('nav-position-right');

        if (!leftBtn || !rightBtn) return;
        // 重置按钮样式
        [leftBtn, rightBtn].forEach(btn => {
            btn.removeAttribute('style');
            btn.removeAttribute('data-darkreader-inline-bgcolor');
        });
        // 获取当前模式的按钮样式
        const styles = getButtonStyles();
        // 设置激活按钮的样式
        const activeBtn = position === 'left' ? leftBtn : rightBtn;
        activeBtn.style.backgroundColor = styles.active.bgColor;
        activeBtn.setAttribute('data-darkreader-inline-bgcolor', styles.active.darkreader);
    };

    // 交换左右侧栏位置
    const swapSidebars = () => {
        const leftBox = getEl('.main-scope-left-box');
        const rightBox = getEl('.main-scope-right-box');

        if (leftBox && rightBox && leftBox.parentNode) {
            try {
                const parent = leftBox.parentNode;
                parent.appendChild(leftBox);
                parent.insertBefore(rightBox, parent.firstChild);
            } catch (error) {
                console.error('交换左右侧栏位置时出错:', error);
            }
        }
    };
    // 调整左侧菜单高度
    const adjustMenuHeight = () => {
        const leftMenuBox = getEl('.main-scope-left-menu-box');
        const centerBox = getEl('.main-scope-center-box');
        const leftMenuOverflowBox = getEl('.main-scope-left-menu-overflow-box');

        if (leftMenuBox && centerBox && leftMenuOverflowBox) {
            try {
                const height = centerBox.offsetHeight;
                const setHeight = (el, h) => {
                    el.style.setProperty('height', `${h}px`, 'important');
                };
                setHeight(leftMenuBox, height);
                setHeight(leftMenuOverflowBox, height - 36);
            } catch (error) {
                console.error('设置左侧菜单和溢出框高度时出错:', error);
            }
        }
    };
    // 应用导航位置设置
    const applySettings = () => {
        const position = getNavPosition();
        if (position === 'right') {
            swapSidebars();
        }
        adjustMenuHeight();
    };
    // 初始化函数
    const init = () => {
        // 等待DOM完全加载后添加设置选项
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(addNavSettings, 1000);
            });
        } else {
            setTimeout(addNavSettings, 1000);
        }
    };

    // 页面加载完成后执行应用设置
    window.addEventListener('load', () => {
        applySettings();
    });

    // 监听页面变化，动态调整高度 (保持不变)
    const observer = new MutationObserver(() => {
        adjustMenuHeight();
    });

    window.addEventListener('load', () => {
        const mainContent = document.querySelector('.main-scope-content');
        if (mainContent) {
            observer.observe(mainContent, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
    });

    init();
})();