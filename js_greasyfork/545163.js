// ==UserScript==
// @name         CSDN文库免vip付费阅读全文丨解锁复制限制
// @namespace    http://tampermonkey.net/
// @version      2025-08-09
// @description  CSDN文库阅读全文，去除VIP登录遮挡，解锁鼠标复制文本功能（日志输出到隐藏容器）
// @author       You
// @match        *://*.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/545163/CSDN%E6%96%87%E5%BA%93%E5%85%8Dvip%E4%BB%98%E8%B4%B9%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E4%B8%A8%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/545163/CSDN%E6%96%87%E5%BA%93%E5%85%8Dvip%E4%BB%98%E8%B4%B9%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E4%B8%A8%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------------------ 日志容器初始化（明确输出到指定容器） ------------------------------
    // 创建隐藏的日志容器（样式确保不干扰页面布局）
    const logContainer = document.createElement('div');
    logContainer.setAttribute('id', 'csdn-unlock-log-container'); // 添加唯一ID便于调试
    logContainer.style.cssText = `
        position: fixed;
        top: 0px;  /* 超出屏幕顶部（隐藏） */
        left: 0px; /* 超出屏幕左侧（隐藏） */
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.8);
        color: #0f0;  /* 绿色文字（高对比度） */
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 4px;
        z-index: 999999;
        pointer-events: none; /* 禁止鼠标交互 */
        display: none; /* 强制显示（调试时可改为none隐藏） */    /*更改此选项可显示调试*/
    `;
    document.body.appendChild(logContainer);

    // ------------------------------ 日志函数（明确输出到容器） ------------------------------
    let lastLogTime = 0;
    const LOG_INTERVAL = 200; // 缩短间隔至200ms（平衡实时性与性能）
    const log = (msg) => {
        const now = Date.now();
        // if (now - lastLogTime < LOG_INTERVAL) return; // 防抖：避免频繁写入

        lastLogTime = now;
        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
            color: #0f0;
            font-size: 12px;
            margin-bottom: 4px;
            line-height: 1.4;
        `;
        logEntry.textContent = `[${new Date().toLocaleTimeString([], { hour12: false })}] [CSDN解锁] ${msg}`;
        logContainer.appendChild(logEntry);

        // 自动滚动到最新日志（容器可见时）
        if (logContainer.offsetWidth > 0 && logContainer.offsetHeight > 0) {
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    };

    // ------------------------------ 核心功能函数（优化：避免重复操作） ------------------------------
    // 移除遮罩层（添加已处理标记）
    const removeMask = () => {
        log('开始移除遮罩层');
        const maskSelectors = ['.open', '.vip', '.mask-layer', '.pay-mask', '#mainBox > main > div.hide-article-box.hide-article-pos.text-center'];
        maskSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!el.dataset.processed) {
                    el.remove();
                    el.dataset.processed = 'true';
                    log(`已移除遮罩层: ${selector}`);
                }
            });
        });
        log('遮罩层移除完成');
    };

    // 展开受限内容（添加已处理标记）
    const expandContent = () => {
        log('开始展开文章内容');
        const contentSelectors = [
            '.article-box .cont.first-show',       // 主内容容器（通用）
            '.read-content .main-cont',             // 备用选择器1
            '.csdn-tracking-statistics',            // 备用选择器2
            '.article-container .content',
            '#article_content'// 备用选择器3
        ];

        let articleContainer = null;
        for (const selector of contentSelectors) {
            articleContainer = document.querySelector(selector);
            if (articleContainer) {
                if (!articleContainer.dataset.expanded) {
                    articleContainer.style.maxHeight = 'none';
                    articleContainer.style.height = 'auto';
                    articleContainer.style.overflow = 'visible';
                    articleContainer.dataset.expanded = 'true';
                    log(`已展开文章内容: ${selector}`);
                }
                break;
            }
        }

        if (!articleContainer) {
            log('警告：未找到文章内容容器，当前选择器可能失效');
        }
    };

    // 彻底解锁复制功能（优化：避免重复拦截）
    const unlockCopy = () => {
        log('开始解锁复制功能');
        // 1. 移除oncopy事件监听器（仅执行一次）
        if (!document.body.dataset.copyHandlerRemoved) {
            document.body.oncopy = null;
            document.querySelectorAll('*').forEach(el => {
                el.oncopy = null;
            });
            document.body.dataset.copyHandlerRemoved = 'true';
            log('已移除oncopy事件监听器');
        }

        // 2. 拦截addEventListener绑定的copy事件（仅执行一次）
        if (!EventTarget.prototype.originalAddEventListener) {
            EventTarget.prototype.originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type !== 'copy') {
                    this.originalAddEventListener(type, listener, options);
                }
            };
            log('已拦截addEventListener绑定的copy事件');
        }

        // 3. 启用用户选择（仅修改未处理的元素）
        document.querySelectorAll('*').forEach(el => {
            if (!el.dataset.userSelectEnabled) {
                el.style.userSelect = 'auto';
                el.style.webkitUserSelect = 'auto';
                el.style.mozUserSelect = 'auto';
                el.style.msUserSelect = 'auto';
                el.dataset.userSelectEnabled = 'true';
            }
        });
        log('已启用用户选择');

        // 4. 解除contenteditable限制（仅处理未处理的元素）
        document.querySelectorAll('[contenteditable="false"]').forEach(el => {
            if (!el.dataset.contentEditableFixed) {
                el.setAttribute('contenteditable', 'true');
                el.dataset.contentEditableFixed = 'true';
            }
        });
        log('已解除contenteditable限制');

        log('复制功能解锁完成');
    };

    // ------------------------------ DOM 监听与初始化 ------------------------------
    // 使用MutationObserver监听核心区域变化（减少触发频率）
    const initObserver = () => {
        // 仅监听文章内容区域（避免无关DOM变化触发）
        const TARGET_SELECTOR = '#article_content';
        const targetElement = document.querySelector(TARGET_SELECTOR);

        if (!targetElement) {
            log('警告：未找到核心内容区域，延迟初始化Observer');
            setTimeout(initObserver, 1000); // 延迟重试
            return;
        }

        const observer = new MutationObserver((mutations) => {
            let hasRelevantChanges = false;
            mutations.forEach(mutation => {
                // 仅处理核心区域的子节点变化
                if (mutation.target.closest(TARGET_SELECTOR)) {
                    hasRelevantChanges = true;
                }
            });

            if (hasRelevantChanges) {
                log('检测到核心区域DOM变化，重新执行核心逻辑');
                removeMask();
                expandContent();
                unlockCopy();
            }
        });

        observer.observe(targetElement, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        log('MutationObserver初始化完成（监听核心区域）');
    };

    // 页面加载完成后执行初始化
    const onPageLoad = () => {
        log('===== 脚本启动 =====');
        removeMask();
        expandContent();
        unlockCopy();
        initObserver(); // 初始化DOM监听
    };

    // 启动脚本
    onPageLoad();
})();