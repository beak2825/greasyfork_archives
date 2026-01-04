// ==UserScript==
// @name         司机社助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  帮助自动回帖并提供磁力链接复制功能
// @author       91SM (优化: Claude)
// @match        https://xsijishe.com/*
// @match        https://xsijishe.net/*
// @match        https://sijishe.link/*
// @match        https://sijishe.info/*
// @match        https://sjs47.me/*
// @match        https://sj474.vip/*
// @match        https://sijishecn.cc/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494834/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/494834/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止与页面上的jQuery冲突
    const $ = jQuery.noConflict();

    /**
     * 全局配置对象
     * @type {Object}
     * @property {string} buttonText - 显示在悬浮按钮上的文本
     * @property {string} replyMessage - 自动回复的默认消息
     * @property {number} cooldownTime - 回复冷却时间（秒）
     * @property {number} refreshDelay - 回复后刷新页面的延迟（毫秒）
     * @property {number} batchSize - DOM处理的批处理大小
     * @property {number} initDelay - 初始化延迟（毫秒）
     */
    const CONFIG = {
        buttonText: '快捷回复',
        replyMessage: '看了LZ的帖子，我只想说一句很好很强大！',
        cooldownTime: 30, // 回复冷却时间（秒）
        refreshDelay: 1000, // 回复后刷新页面的延迟（毫秒）
        batchSize: 5, // DOM处理的批处理大小
        initDelay: 300 // 初始化延迟（毫秒）
    };

    /**
     * DOM元素选择器 - 集中管理DOM选择器以提高可维护性
     * @type {Object}
     */
    const SELECTORS = {
        messageInput: "[name=message]",
        submitButton: "#fastpostsubmit",
        lockedText: ".locked",
        contentArea: ".t_f",
        jammerFont: "font.jammer"
    };

    /**
     * 本地存储键名
     * @type {Object}
     */
    const STORAGE_KEYS = {
        timestamp: "sj_timestamp",
        buttonPosition: "autoReplyButtonPosition"
    };

    /**
     * CSS类名和ID
     * @type {Object}
     */
    const CSS = {
        buttonId: "autoReplyButton",
        copyLink: "magnet-copy-link",
        notification: "magnet-copy-notif",
        notificationId: "magnet-copy-notif",
        showClass: "show"
    };

    /**
     * 按钮状态变量 - 用于拖拽功能
     * @type {Object}
     */
    let buttonState = {
        isDragging: false,
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0
    };

    /**
     * 创建悬浮按钮
     * @returns {HTMLElement} 创建的按钮元素
     */
    function createFloatingButton() {
        // 创建按钮元素
        const button = document.createElement('button');
        button.textContent = CONFIG.buttonText;
        button.id = CSS.buttonId;

        // 设置按钮样式
        Object.assign(button.style, {
            position: 'fixed',
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            cursor: 'move',
            zIndex: '9999',
            userSelect: 'none',
            pointerEvents: 'auto',
            fontSize: '14px',
            fontWeight: 'bold'
        });

        // 获取保存的位置或设置默认位置
        const savedPosition = getSavedPosition();
        if (savedPosition) {
            setButtonPosition(button, savedPosition.left, savedPosition.top);
        } else {
            setButtonPosition(button, window.innerWidth - 120, window.innerHeight / 2);
        }

        return button;
    }

    /**
     * 设置按钮位置，并确保在视口内
     * @param {HTMLElement} button - 按钮元素
     * @param {number} left - 左侧位置
     * @param {number} top - 顶部位置
     */
    function setButtonPosition(button, left, top) {
        // 获取视口尺寸
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 获取或估计按钮尺寸
        const buttonWidth = button.offsetWidth || 100; // 估计宽度
        const buttonHeight = button.offsetHeight || 40; // 估计高度

        // 确保按钮在视口内
        left = Math.max(0, Math.min(left, viewportWidth - buttonWidth));
        top = Math.max(0, Math.min(top, viewportHeight - buttonHeight));

        // 设置按钮位置
        button.style.left = `${left}px`;
        button.style.top = `${top}px`;
    }

    /**
     * 保存按钮位置到localStorage
     * @param {number} left - 左侧位置
     * @param {number} top - 顶部位置
     */
    function saveButtonPosition(left, top) {
        localStorage.setItem(STORAGE_KEYS.buttonPosition, JSON.stringify({ left, top }));
    }

    /**
     * 获取保存的按钮位置
     * @returns {Object|null} 保存的位置对象或null
     */
    function getSavedPosition() {
        const savedPosition = localStorage.getItem(STORAGE_KEYS.buttonPosition);
        return savedPosition ? JSON.parse(savedPosition) : null;
    }

    /**
     * 处理自动回复逻辑
     */
    function handleAutoReply() {
        // 使用缓存的DOM选择器查询元素
        const $lockedText = $(SELECTORS.lockedText);

        // 检查是否有锁定文本元素
        if ($lockedText.length === 0) {
            alert("已经回复或此页面没有回复按钮！");
            return;
        }

        const lockedTextContent = $lockedText.text();

        // 检查是否需要购买主题
        if (lockedTextContent.includes('购买主题')) {
            alert("此页面需要手动点击购买！");
            return;
        }

        // 检查冷却时间
        const timestamp = localStorage.getItem(STORAGE_KEYS.timestamp);
        if (timestamp) {
            const currentTime = Date.now();
            const timeDifference = (currentTime - parseInt(timestamp)) / 1000;

            if (timeDifference < CONFIG.cooldownTime) {
                const remainingTime = Math.ceil(CONFIG.cooldownTime - timeDifference);
                alert(`距离上次自动回复还需等待${remainingTime}秒，请稍后再试`);
                return;
            }
        }

        // 执行回复
        if (lockedTextContent.includes('如果您要查看本帖隐藏内容请')) {
            // 使用缓存的选择器填写回复内容并提交
            $(SELECTORS.messageInput).val(CONFIG.replyMessage);
            $(SELECTORS.submitButton).click();

            // 更新时间戳
            localStorage.setItem(STORAGE_KEYS.timestamp, Date.now().toString());

            // 延迟后刷新页面
            setTimeout(() => {
                window.scrollTo(0, 0);
                location.reload();
            }, CONFIG.refreshDelay);
        }
    }

    /**
     * 为按钮添加拖拽功能
     * @param {HTMLElement} button - 按钮元素
     */
    function addDragFunctionality(button) {
        // 鼠标按下事件
        button.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // 只响应左键
            e.stopPropagation();

            buttonState.isDragging = true;
            buttonState.startX = e.clientX;
            buttonState.startY = e.clientY;
            buttonState.startLeft = parseInt(button.style.left) || 0;
            buttonState.startTop = parseInt(button.style.top) || 0;
        });

        // 鼠标移动事件（添加到document以支持拖出按钮范围）
        document.addEventListener('mousemove', function(e) {
            if (!buttonState.isDragging) return;
            e.preventDefault();

            const newLeft = buttonState.startLeft + e.clientX - buttonState.startX;
            const newTop = buttonState.startTop + e.clientY - buttonState.startY;

            setButtonPosition(button, newLeft, newTop);
            saveButtonPosition(newLeft, newTop);
        });

        // 鼠标松开事件
        document.addEventListener('mouseup', function() {
            buttonState.isDragging = false;
        });
    }

    /**
     * 初始化脚本主功能
     */
    function initScript() {
        // 创建按钮
        const button = createFloatingButton();

        // 添加拖拽功能
        addDragFunctionality(button);

        // 添加双击回复功能
        button.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            if (!buttonState.isDragging) {
                handleAutoReply();
            }
        });

        // 添加按钮到页面
        document.body.appendChild(button);
    }

    /**
     * RequestIdleCallback的兼容性实现
     * 用于在浏览器空闲时执行非关键操作
     */
    const requestIdleCallback = window.requestIdleCallback ||
                               function(cb) {
                                   const start = Date.now();
                                   return setTimeout(function() {
                                       cb({
                                           didTimeout: false,
                                           timeRemaining: function() {
                                               return Math.max(0, 50 - (Date.now() - start));
                                           }
                                       });
                                   }, 1);
                               };

    /**
     * 注入CSS样式
     * 使用一次性注入而不是内联样式，提高性能
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .${CSS.copyLink} {
                color: #1e88e5;
                margin-left: 8px;
                cursor: pointer;
                text-decoration: underline;
                font-size: 12px;
                display: inline-block;
            }
            .${CSS.notification} {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(76, 175, 80, 0.9);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                z-index: 9999;
                font-size: 14px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s;
            }
            .${CSS.notification}.${CSS.showClass} {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     */
    function copyText(text) {
        // 获取或创建通知元素
        let notif = document.getElementById(CSS.notificationId);
        if (!notif) {
            notif = document.createElement('div');
            notif.id = CSS.notificationId;
            notif.className = CSS.notification;
            notif.textContent = '磁力链接已复制!';
            document.body.appendChild(notif);
        }

        // 使用最有效的方法复制到剪贴板
        const copyToClipboard = () => {
            try {
                // 尝试使用现代API
                navigator.clipboard.writeText(text);
            } catch(e) {
                // 回退到传统方法
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            // 显示通知
            notif.classList.add(CSS.showClass);
            setTimeout(() => notif.classList.remove(CSS.showClass), 1500);
        };

        copyToClipboard();
    }

    /**
     * 处理一批元素
     * 使用分批处理避免页面卡顿
     * @param {NodeList} elements - 要处理的元素列表
     * @param {number} index - 当前处理索引
     * @param {number} batchSize - 每批处理的元素数量
     * @param {Function} callback - 处理完成后的回调函数
     */
    function processBatch(elements, index, batchSize, callback) {
        const endIndex = Math.min(index + batchSize, elements.length);

        requestIdleCallback(function(deadline) {
            // 创建磁力链接正则表达式（只创建一次）
            const magnetRegex = /magnet:\?xt=urn:btih:[A-Z0-9]+/g;

            while (index < endIndex && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
                const element = elements[index++];

                // 使用更高效的方式选择和处理干扰元素
                const jammers = element.querySelectorAll(SELECTORS.jammerFont);
                if (jammers.length > 0) {
                    jammers.forEach(j => j.remove());
                }

                // 处理磁力链接
                const text = element.innerHTML;

                // 只有在包含磁力链接时才执行替换，提高性能
                if (magnetRegex.test(text)) {
                    element.innerHTML = text.replace(magnetRegex, function(match) {
                        return match + `<span class="${CSS.copyLink}" data-magnet="${match}">复制</span>`;
                    });
                }
            }

            // 继续处理下一批或完成
            if (index < elements.length) {
                processBatch(elements, index, batchSize, callback);
            } else if (callback) {
                callback();
            }
        });
    }

    /**
     * 初始化磁力链接处理功能
     * 使用事件委托提高性能
     */
    function initMagnetLinkHandler() {
        // 使用事件委托处理复制链接点击
        document.addEventListener('click', function(e) {
            // 检查是否点击了复制链接
            if (e.target && e.target.classList.contains(CSS.copyLink)) {
                const magnetLink = e.target.getAttribute('data-magnet');
                copyText(magnetLink);

                // 更新链接文本提供反馈
                e.target.textContent = '已复制!';
                setTimeout(() => {
                    e.target.textContent = '复制';
                }, 1000);

                e.preventDefault();
            }
        }, false);
    }

    /**
     * 初始化磁力链接功能
     * 使用优化的DOM查询和处理
     */
    function initMagnetFeature() {
        // 一次性查找内容元素，使用缓存的选择器
        const tfElements = document.querySelectorAll(SELECTORS.contentArea);
        if (!tfElements.length) return;

        // 先注入样式
        injectStyles();

        // 设置事件处理器
        initMagnetLinkHandler();

        // 使用批处理处理元素，防止UI卡顿
        processBatch(tfElements, 0, CONFIG.batchSize, null);
    }

    /**
     * 主初始化函数
     * 根据页面状态初始化功能
     */
    function init() {
        // 初始化自动回复功能
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScript);
        } else {
            initScript();
        }

        // 延迟初始化磁力链接功能，优先渲染页面
        setTimeout(initMagnetFeature, CONFIG.initDelay);
    }

    // 执行初始化
    init();
})();