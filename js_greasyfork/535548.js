// ==UserScript==
// @name         百度网盘视频笔记控制增强
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  ALT+1视频截图，ALT+2后退3秒，ALT+3快进3秒，自动调整布局宽度（全局生效）
// @author       微信公众号：阿虚同学
// @match        *://pan.baidu.com/fcb/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535548/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E6%8E%A7%E5%88%B6%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535548/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E6%8E%A7%E5%88%B6%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 布局调整功能 ====================

    function adjustLayout() {
        const videoElement = document.querySelector('.wp-edit-content__video');
        const docElement = document.querySelector('.wp-edit-content__doc');
        const editorElement = document.querySelector('.wp-edit-content__editor');

        let adjusted = false;

        if (videoElement) {
            videoElement.style.width = '60%';
            adjusted = true;
        }

        if (docElement) {
            docElement.style.width = '40%';
            adjusted = true;
        }

        if (editorElement) {
            editorElement.style.width = '100%';
            adjusted = true;
        }

        return adjusted;
    }

    // 监听DOM变化，自动应用布局调整
    function observeLayoutChanges() {
        const observer = new MutationObserver(() => {
            adjustLayout();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ==================== 截图功能相关 ====================

    // 控制栏的选择器
    const CONTROL_BAR_SELECTOR = 'section.wp-video__control-bar.vjs-user-active';

    // 备用选择器（如果上面的找不到）
    const CONTROL_BAR_FALLBACK_SELECTORS = [
        '.wp-video__control-bar.vjs-user-active',
        '.wp-video__control-bar',
        'section.wp-video__control-bar'
    ];

    // 视频截图按钮的文本和类名
    const SCREENSHOT_BUTTON_TEXT = '视频截图';
    const SCREENSHOT_BUTTON_CLASS = 'wp-ai-note-aside-item__title';

    // 添加防重复执行的标志
    let isExecutingScreenshot = false;

    function findControlBar() {
        // 首先尝试主要选择器
        let controlBar = document.querySelector(CONTROL_BAR_SELECTOR);

        if (controlBar) {
            console.log('找到主要控制栏:', controlBar);
            return controlBar;
        }

        // 尝试备用选择器
        for (const selector of CONTROL_BAR_FALLBACK_SELECTORS) {
            controlBar = document.querySelector(selector);
            if (controlBar) {
                console.log(`通过备用选择器找到控制栏 (${selector}):`, controlBar);
                return controlBar;
            }
        }

        console.warn('未找到任何控制栏元素');
        return null;
    }

    function simulateClick(element) {
        // 创建多种点击事件确保触发
        const events = [
            'mousedown',
            'mouseup',
            'click'
        ];

        console.log('开始模拟点击控制栏:', element);

        events.forEach(eventType => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0, // 左键
                buttons: 1,
                clientX: element.offsetLeft + element.offsetWidth / 2,
                clientY: element.offsetTop + element.offsetHeight / 2
            });

            console.log(`触发 ${eventType} 事件在控制栏`);
            element.dispatchEvent(event);
        });

        // 也尝试在父元素上触发点击（如果需要）
        const videoContainer = element.closest('.video-img-container');
        if (videoContainer) {
            console.log('在父容器 video-img-container 上也触发点击事件');
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            videoContainer.dispatchEvent(clickEvent);
        }

        // 尝试触发focus事件（可能有助于显示控制栏）
        if (element.focus) {
            element.focus();
            console.log('已对控制栏执行 focus()');
        }
    }

    function findScreenshotButton() {
        // 首先尝试精确匹配
        const buttons = document.querySelectorAll(`span.${SCREENSHOT_BUTTON_CLASS}`);
        for (const btn of buttons) {
            if (btn.textContent && btn.textContent.trim() === SCREENSHOT_BUTTON_TEXT) {
                console.log('通过类名找到截图按钮:', btn);
                return btn;
            }
        }

        // 备用方法：查找所有包含"视频截图"文本的span元素
        const allSpans = document.querySelectorAll('span');
        for (const span of allSpans) {
            if (span.textContent && span.textContent.trim() === SCREENSHOT_BUTTON_TEXT) {
                console.log('通过文本内容找到截图按钮:', span);
                return span;
            }
        }

        // 更广泛的搜索：查找任何包含"截图"文本的可点击元素
        const clickableElements = document.querySelectorAll('button, span, div, a, [role="button"]');
        for (const element of clickableElements) {
            if (element.textContent && element.textContent.includes('截图')) {
                console.log('找到包含"截图"的元素:', element);
                return element;
            }
        }

        // 尝试查找可能的截图相关按钮（通过属性）
        const screenshotSelectors = [
            '[title*="截图"]',
            '[aria-label*="截图"]',
            '[data-title*="截图"]'
        ];

        for (const selector of screenshotSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`通过属性选择器找到截图按钮 (${selector}):`, element);
                return element;
            }
        }

        return null;
    }

    function clickScreenshotButton(button) {
        console.log('准备点击截图按钮:', button);

        try {
            // 方式1: 直接点击
            button.click();
            console.log('✅ 已通过 click() 方法点击截图按钮');
            return true;
        } catch (e) {
            console.log('直接点击失败，尝试事件方式:', e);

            try {
                // 方式2: 通过事件触发
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,
                    buttons: 1
                });
                button.dispatchEvent(clickEvent);
                console.log('✅ 已通过事件方式点击截图按钮');
                return true;
            } catch (e2) {
                console.error('事件方式点击也失败:', e2);
                return false;
            }
        }
    }

    function executeScreenshot() {
        // 防止重复执行
        if (isExecutingScreenshot) {
            console.log('⚠️ 截图功能正在执行中，跳过重复调用');
            return;
        }

        isExecutingScreenshot = true;
        console.log('🎬 ALT+1 按下，开始执行截图操作...');

        const controlBar = findControlBar();

        if (controlBar) {
            console.log('✅ 控制栏已找到，开始模拟点击...');

            // 模拟点击控制栏
            simulateClick(controlBar);

            // 延时500ms后查找并点击截图按钮
            setTimeout(() => {
                console.log('⏰ 延时结束，开始查找截图按钮...');

                const screenshotButton = findScreenshotButton();

                if (screenshotButton) {
                    console.log('✅ 截图按钮已找到');

                    const success = clickScreenshotButton(screenshotButton);

                    if (success) {
                        showTips('📸 视频截图成功');
                    } else {
                        showTips('❌ 截图按钮点击失败');
                    }
                } else {
                    console.warn('❌ 未能找到截图按钮');
                    showTips('❌ 未找到截图按钮');
                }

                // 重置执行标志
                setTimeout(() => {
                    isExecutingScreenshot = false;
                }, 1000);

            }, 500);

        } else {
            console.log('❌ 未找到控制栏');
            showTips('❌ 未找到控制栏');

            // 重置执行标志
            setTimeout(() => {
                isExecutingScreenshot = false;
            }, 1000);
        }
    }

    // ==================== 视频控制功能相关 ====================

    // 创建提示元素的样式
    const style = document.createElement('style');
    style.textContent = `
        .video-custom-tips {
            position: fixed;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            z-index: 2147483647;
            font-size: 14px;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.5s ease-out;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);

    // 显示提示的函数
    function showTips(message, videoElement, duration = 1000) {
        // 移除已存在的提示
        const oldTip = document.querySelector('.video-custom-tips');
        if (oldTip) {
            oldTip.remove();
        }
        // 创建新的提示元素
        const tip = document.createElement('div');
        tip.className = 'video-custom-tips';
        tip.textContent = message;
        // 如果指定了视频元素，则定位到视频左上角
        if (videoElement) {
            const rect = videoElement.getBoundingClientRect();
            tip.style.left = `${rect.left + window.scrollX + 10}px`;
            tip.style.top = `${rect.top + window.scrollY + 10}px`;
        } else {
            // 默认居中显示
            tip.style.left = '50%';
            tip.style.top = '50%';
            tip.style.transform = 'translate(-50%, -50%)';
        }
        document.body.appendChild(tip);
        // 设置延时自动移除
        setTimeout(() => {
            tip.style.opacity = '0';
            setTimeout(() => tip.remove(), 300);
        }, duration);
    }

    // 通用视频跳转函数
    function handleVideoSeek(seconds, message) {
        const videos = document.querySelectorAll('video, .vjs-tech, [data-vjs-player]');
        let found = false;
        let firstVideo = null;
        videos.forEach(video => {
            // 跳过不可操作的视频
            if (isNaN(video.duration)) return;
            const oldTime = video.currentTime;
            let newTime = oldTime + seconds;
            // 限制时间范围
            newTime = Math.max(0, newTime);
            newTime = Math.min(video.duration, newTime);
            // 执行跳转
            if (Math.abs(newTime - oldTime) > 0.1) { // 防止微小误差触发
                video.currentTime = newTime;
                if (!firstVideo) firstVideo = video;
                found = true;
            }
        });
        if (found) {
            showTips(message, firstVideo);
        } else {
            showTips('没有找到可操作的视频');
        }
    }

    // ==================== 统一的键盘事件处理 ====================

    function handleKeyDown(event) {
        // 日志记录事件状态
        console.log(`按下了: ${event.key} (altKey=${event.altKey}, ctrlKey=${event.ctrlKey}, shiftKey=${event.shiftKey}, target=${event.target.tagName})`);

        // 检查是否在内容可编辑区域（如笔记输入框）
        if ((event.target.isContentEditable ||
             event.target.tagName === 'INPUT' ||
             event.target.tagName === 'TEXTAREA') &&
            (event.altKey && (event.key === '2' || event.key === '3'))) {
            event.preventDefault(); // 防止默认行为
        }

        // ALT+1 触发截图功能
        if (event.altKey && event.key === '1') {
            event.preventDefault(); // 阻止可能的浏览器默认行为
            executeScreenshot();
            return false;
        }

        // 检查是否按下 ALT+2（后退3秒）
        if (event.altKey && event.key === '2') {
            handleVideoSeek(-3, '⏪ 后退3秒');
        }

        // 检查是否按下 ALT+3（快进3秒）
        if (event.altKey && event.key === '3') {
            handleVideoSeek(3, '⏩ 快进3秒');
        }
    }

    // ==================== 初始化和监听 ====================

    // 页面加载完成后的初始化
    function initialize() {
        // 截图功能初始化检查
        const controlBar = findControlBar();
        if (controlBar) {
            console.log('✅ 控制栏元素已找到，截图功能准备就绪');
        } else {
            console.log('⚠️ 未找到控制栏元素');
        }

        // 自动调整布局
        setTimeout(() => {
            adjustLayout();
        }, 1000);

        // 启动DOM变化监听
        setTimeout(() => {
            observeLayoutChanges();
        }, 2000);
    }

    // 使用事件捕获阶段监听事件
    document.addEventListener('keydown', handleKeyDown, true);

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 页面完全加载后再次初始化
    window.addEventListener('load', () => {
        setTimeout(initialize, 1000);
    });

    console.log('🚀 百度网盘视频增强工具已加载');
    console.log('📸 ALT+1: 视频截图');
    console.log('⏪ ALT+2: 后退3秒');
    console.log('⏩ ALT+3: 快进3秒');
    console.log('📐 自动调整布局: 视频60% | 文档40% | 编辑器100%');

})();
