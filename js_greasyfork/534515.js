// ==UserScript==
// @name         自动滚动控制器
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  带有平滑滑动动画的自动页面滚动器，向上和向下按钮直接控制滚动，增加按钮联动和交互反馈及互斥状态，停止按钮尺寸与方向按钮一致，增加自动开启/关闭开关按钮
// @author       You
// @match        https://linux.do/*
// @grant        none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534515/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534515/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const colors = {
        background: '#f0f4f7',
        container: '#ffffff',
        primary: '#4caf50',   // 绿色，表示开启
        primaryHover: '#81c784',
        primaryActive: '#388e3c',
        accent: '#f44336',    // 红色，表示关闭
        accentDark: '#d32f2f',
        border: '#e0e0e0',
        textPrimary: '#212121',   // 主要文本颜色
        textSecondary: '#757575', // 辅助文本颜色
        inactive: '#bdbdbd',
        error: '#f44336',
        buttonTextPrimary: '#e8f5e9', // 主要按钮文字颜色 (浅绿色)
        buttonTextAccent: '#ffebee'  // 强调按钮文字颜色 (浅红色)
    };

    const config = {
        scrollDistance: 150,
        scrollInterval: 500,
        scrollBehavior: 'smooth',
        defaultDirection: 'down', // 默认向下滚动
        autoStart: false,         // 新增：控制是否自动开始滚动
        blacklist: ["https://linux.do/c/", "https://linux.do/latest", "https://linux.do/tag/", "https://linux.do/new", "https://linux.do/unread","https://linux.do/search","https://linux.do/u/cores/"],
        topicUrlPattern: /^https:\/\/linux\.do\/t\/topic\/\d+\/\d+$/, // 匹配形如 https://linux.do/t/topic/579964/2 的 URL
        styles: {
            buttonBase: {
                background: colors.background,
                color: colors.primary,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease-in-out',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                fontWeight: '500',
                letterSpacing: '0.3px',
                backdropFilter: 'blur(10px)', // 模糊背景
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' // 轻微阴影
            },
            directionButton: {
                width: '48px',
                height: '48px',
                lineHeight: '48px',
                padding: 0,
                margin: '6px 0',
                fontSize: '22px',
                borderRadius: '12px'
            },
            directionButtonActive: {
                background: colors.container,
                color: colors.primaryActive,
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            },
            directionButtonInactive: {
                opacity: '0.7',
                color: colors.inactive
            },
            stopButton: {
                width: '48px',
                height: '48px',
                lineHeight: '48px',
                padding: 0,
                margin: '6px 0',
                fontSize: '22px',
                background: colors.background,
                color: colors.accent,
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            },
            stopButtonActive: {
                background: colors.container,
                color: colors.accentDark,
                transform: 'scale(0.95)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            },
            autoStartButton: {
                width: '60px', // 更小的宽度
                height: '32px',
                lineHeight: '32px',
                padding: 0,
                margin: '8px 0 0 0',
                fontSize: '14px',
                borderRadius: '16px',
                fontWeight: 'bold',
                color: colors.buttonTextPrimary,
                background: colors.primary, // 初始为开启状态的颜色
                border: 'none'
            },
            autoStartButtonOff: {
                color: colors.buttonTextAccent,
                background: colors.accent
            },
            container: {
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: colors.container,
                backdropFilter: 'blur(15px)', // 更强的模糊效果
                padding: '12px',
                borderRadius: '15px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                border: `1px solid ${colors.border}`
            }
        },
        icons: {
            up: '▲',
            down: '▼',
            stop: '◼',
            autoStartOn: '开',
            autoStartOff: '关'
        }
    };

    // 检查是否在黑名单中
    function isBlacklisted(url) {
        console.log(url);
        return config.blacklist.some(prefix => url.startsWith(prefix)) || url == 'https://linux.do/';
    }

    // 检查是否是特定 topic URL（形如 https://linux.do/t/topic/579964/2）
    function isTopicUrl(url) {
        return config.topicUrlPattern.test(url);
    }

    // 状态变量
    let isScrolling = false;
    let scrollDirection = null;
    let scrollIntervalId = null;
    let lastUrl = window.location.href;
    let autoScrollEnabled = config.autoStart; // 控制自动滚动是否开启

    // 创建元素并应用基础样式
    function createButton(text, additionalStyles = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, config.styles.buttonBase, additionalStyles);
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = additionalStyles.boxShadow;
        });
        return button;
    }

    // 创建容器
    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, config.styles.container);

    // 创建向上滚动按钮
    const upBtn = createButton(config.icons.up, config.styles.directionButton);

    // 创建向下滚动按钮
    const downBtn = createButton(config.icons.down, config.styles.directionButton);

    // 创建停止按钮
    const stopBtn = createButton(config.icons.stop, config.styles.stopButton);
    stopBtn.disabled = true;

    // 创建自动滚动控制按钮（开关）
    const autoStartBtn = createButton(autoScrollEnabled ? config.icons.autoStartOn : config.icons.autoStartOff, config.styles.autoStartButton);
    if (!autoScrollEnabled) {
        Object.assign(autoStartBtn.style, config.styles.autoStartButtonOff);
    }

    // 滚动函数
    function autoScroll() {
        if (scrollDirection === 'up') {
            window.scrollBy({ top: -config.scrollDistance, behavior: config.scrollBehavior });
            if (window.scrollY <= 0) stopAutoScroll();
        } else if (scrollDirection === 'down') {
            window.scrollBy({ top: config.scrollDistance, behavior: config.scrollBehavior });
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) stopAutoScroll();
        }
    }

    function startAutoScroll(direction) {
        // 如果自动滚动未启用，则不执行任何操作
        if (!autoScrollEnabled) {
            return;
        }

        // 如果已经在滚动，先清除现有定时器
        if (scrollIntervalId) {
            clearInterval(scrollIntervalId);
            scrollIntervalId = null;
        }

        isScrolling = true;
        scrollDirection = direction;
        stopBtn.disabled = false;

        // 更新按钮状态和样式
        if (direction === 'up') {
            upBtn.disabled = true;
            Object.assign(upBtn.style, config.styles.directionButtonActive);
            downBtn.disabled = false;
            Object.assign(downBtn.style, config.styles.buttonBase, config.styles.directionButton, config.styles.directionButtonInactive);
        } else if (direction === 'down') {
            downBtn.disabled = true;
            Object.assign(downBtn.style, config.styles.directionButtonActive);
            upBtn.disabled = false;
            Object.assign(upBtn.style, config.styles.buttonBase, config.styles.directionButton, config.styles.directionButtonInactive);
        }

        scrollIntervalId = setInterval(autoScroll, config.scrollInterval);
    }

    function stopAutoScroll() {
        isScrolling = false;
        scrollDirection = null;
        clearInterval(scrollIntervalId);
        scrollIntervalId = null;
        upBtn.disabled = false;
        downBtn.disabled = false;
        stopBtn.disabled = true;

        // 重置方向按钮样式为非选中状态
        Object.assign(upBtn.style, config.styles.buttonBase, config.styles.directionButton, config.styles.directionButtonInactive);
        Object.assign(downBtn.style, config.styles.buttonBase, config.styles.directionButton, config.styles.directionButtonInactive);
    }

    // 按钮点击事件监听
    upBtn.addEventListener('click', () => {
        if (isScrolling && scrollDirection !== 'up') {
            startAutoScroll('up');
        } else if (!isScrolling) {
            startAutoScroll('up');
        } else {
            stopAutoScroll();
        }
    });

    downBtn.addEventListener('click', () => {
        if (isScrolling && scrollDirection !== 'down') {
            startAutoScroll('down');
        } else if (!isScrolling) {
            startAutoScroll('down');
        } else {
            stopAutoScroll();
        }
    });

    stopBtn.addEventListener('click', stopAutoScroll);

    // 停止按钮的视觉反馈
    stopBtn.addEventListener('mousedown', () => {
        Object.assign(stopBtn.style, config.styles.stopButtonActive);
    });

    stopBtn.addEventListener('mouseup', () => {
        Object.assign(stopBtn.style, config.styles.stopButton);
    });

    stopBtn.addEventListener('mouseout', () => {
        Object.assign(stopBtn.style, config.styles.stopButton);
    });

    // 自动滚动控制按钮（开关）点击事件
    autoStartBtn.addEventListener('click', () => {
        autoScrollEnabled = !autoScrollEnabled;
        autoStartBtn.textContent = autoScrollEnabled ? config.icons.autoStartOn : config.icons.autoStartOff;
        Object.assign(autoStartBtn.style, config.styles.autoStartButton, autoScrollEnabled ? {} : config.styles.autoStartButtonOff);

        if (autoScrollEnabled && !isBlacklisted(window.location.href) && !isTopicUrl(window.location.href) && !isScrolling) {
            startAutoScroll(config.defaultDirection);
        } else if (!autoScrollEnabled) {
            stopAutoScroll();
        }
    });

    // 添加按钮到容器
    buttonContainer.appendChild(upBtn);
    buttonContainer.appendChild(downBtn);
    buttonContainer.appendChild(stopBtn);
    buttonContainer.appendChild(autoStartBtn); // 添加自动滚动控制按钮（开关）

    // 检查是否应显示按钮和启动滚动
    function updateButtonVisibility(url) {
        if (isBlacklisted(url)) {
            buttonContainer.style.display = 'none';
            stopAutoScroll();
        } else {
            buttonContainer.style.display = 'flex';
            if (autoScrollEnabled && !isTopicUrl(url) && !isScrolling) {
                startAutoScroll(config.defaultDirection);
            } else if (isTopicUrl(url)) {
                stopAutoScroll(); // 如果是 topic URL，不自动启动
            }
        }
    }

    // 初始化时检查当前 URL
    if (!isBlacklisted(window.location.href)) {
        document.body.appendChild(buttonContainer);
        window.addEventListener('load', () => {
            if (autoScrollEnabled && !isTopicUrl(window.location.href)) {
                startAutoScroll(config.defaultDirection);
            }
        });
    }

    // 检测地址栏变化（排除 # 哈希变化）
    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl && !currentUrl.startsWith(lastUrl + '#')) {
            lastUrl = currentUrl;
            updateButtonVisibility(currentUrl);
        }
    }

    // 使用 MutationObserver 检测 URL 变化（适用于单页应用）
    const observer = new MutationObserver(() => {
        checkUrlChange();
    });

    observer.observe(document, { subtree: true, childList: true });

    // 使用 setInterval 定期检查 URL 变化（适用于传统页面导航）
    setInterval(checkUrlChange, 1000);

    // 添加防抖清理函数
    window.addEventListener('beforeunload', () => {
        clearInterval(scrollIntervalId);
        observer.disconnect();
    });

})();