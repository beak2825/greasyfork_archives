// ==UserScript==
// @name         平滑滚动翻页
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  使用上下键或WS键进行平滑滚动翻页，一次翻页0.9倍页面距离。键盘左右键或A/D键模拟点击页面中【上一页|上一章】【下一页|下一章】按钮，双击只点击【上一章】【下一章】按钮。可以与自动滚屏助手脚本联动。适配开源阅读的web端翻页。
// @author       coccvo
// @include      *
// @exclude      https://www.bilibili.com/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAVdJREFUWEftlj1Ow0AQhd9YWKKmy3b8FPSpiKUojXMaKOAg0HAZCEUktB0HoMDu4twBkwxaLEvG7C7GzMoowvV437dvfnYIA3/k00+TgiX4Flo5df4BfuVABEx5yxuOSPtSFSQFRvxOq0cjPD9bTXwQ4gBN8frmPghRAJv4dxCCAPRCtH325Zs5OgX4pBkjCNBvKuwmAAMZgFvjSQQ6Z/Cxyx9xB8p4FC+X9NYUnM14Ly7XpQ1CFMAmXou6IMQACJTd69GnCm/fOE3WGcBHQbqAgasHrW58vTBPiksGrncTAEC+0MpZ7ebWaVLkAA6DOGAO9RXhePwUH+yr13aKxIqwPtgG4RI3/4gDVCCUE/hjEDFw0bY9WAr6vAaBHOiOIgjwB55j70IyXU1483U/FHSgst26kjnEg3XBoEtpXX6DruXdeyDYIOqOIF6E3aWryN4APxXqE/8OqY/0IehdmXQAAAAASUVORK5CYII=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497164/%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/497164/%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==============================
    // 全局状态管理
    // ==============================
    let isScrollKeyPressed = false;// 用户是否正在按 W/S 键滚动
    let autoScrollWasActive = false;// 记录自动滚屏是否曾运行（用于恢复）
    let scrollDistance = window.innerHeight * 0.9; // 每次手动滚动的距离（视口高度的 90%）
    let clickTimer = null;// 用于实现“单击 vs 双击”逻辑的定时器
    const kaiyuanCooldown = 600; // 开源阅读专用冷却时间（毫秒）
    let lastKaiyuanClick = 0;

    // ==============================
    // 页面类型识别
    // ==============================
    function isKaiyuanReaderChapterPage() {
        try {
            return window.location.pathname.endsWith('/vue/index.html') &&
                window.location.hash.startsWith('#/chapter');
        } catch (e) {
            return false;
        }
    }// 判断当前页面是否为「开源阅读 Web 端」的阅读页

    // ==============================
    // 与「自动滚屏助手」脚本的协同
    // ==============================
    const hasAutoScrollAssistant = () =>
    typeof window.getAutoScrollState === 'function';

    // ==============================
    // 通用页面：通过文本查找并点击导航按钮
    // ==============================
    function clickElementByText(textContent) {
        const clickableElements = document.querySelectorAll(
            'a, button, [role="button"], span[onclick], div[onclick]'
        );
        for (const el of clickableElements) {
            if (el.textContent.trim() === textContent) {
                el.click();
                return true;
            }
        }
        return false;
    }

    // ==============================
    // 开源阅读 Web 端：通过图标查找章节切换按钮
    // ==============================
    function findChapterButtonByIcon(iconText) {
        const icons = document.querySelectorAll('.tool-icon .iconfont');
        for (const icon of icons) {
            if (icon.textContent.includes(iconText)) {
                return icon.parentElement;
            }
        }
        return null;
    }

    function triggerToolBarClick() {
        const toolBar = document.querySelector('.tool-bar');
        if (toolBar) toolBar.click();
    }//竖屏翻页时关闭菜单

    // ==============================
    // 导航处理：统一翻页入口（A/D/←/→）
    // ==============================
    function handleNavigation(direction) {
        const now = Date.now();

        // ── 1. 开源阅读 Web 端：带 cooldown 的图标点击 ──
        if (isKaiyuanReaderChapterPage()) {
            if (now - lastKaiyuanClick < kaiyuanCooldown) {
                return; // 防抖：避免快速连点
            }

            const iconMap = { prev: '', next: '' };
            const button = findChapterButtonByIcon(iconMap[direction]);
            if (button) {
                button.click();
                triggerToolBarClick();
                document.body.focus();
                lastKaiyuanClick = now; // 更新冷却时间
            }
            return;
        }

        // ── 2. 其他网站：纯双击逻辑，无 cooldown 干扰 ──
        if (clickTimer === null) {
            // 第一次点击：延迟执行“翻页”
            clickTimer = setTimeout(() => {
                const pageTexts = direction === 'prev'
                ? ['上一页', '<上一页']
                : ['下一页', '下一页>'];

                let clicked = false;
                for (const text of pageTexts) {
                    if (clickElementByText(text)) {
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) {
                    // 降级：尝试“跳章”
                    clickElementByText(direction === 'prev' ? '上一章' : '下一章');
                }
                document.body.focus();
                clickTimer = null;
            }, 300); // 双击判定窗口
        } else {
            // 快速第二次点击：取消翻页，立即跳章
            clearTimeout(clickTimer);
            clickTimer = null;
            clickElementByText(direction === 'prev' ? '上一章' : '下一章');
            document.body.focus();
        }
    }

    // ==============================
    // 手动滚动处理（W/S/↑/↓）
    // ==============================
    /**
     * 执行一次视口比例的平滑滚动，并与自动滚屏助手协同。
     * @param {boolean} isDown - 是否向下滚动
     */
    function performManualScroll(isDown) {
        // 若自动滚屏助手正在运行，先暂停它
        if (hasAutoScrollAssistant() && window.getAutoScrollState()) {
            autoScrollWasActive = true;
            window.turnOffAutoScroll();
        }

        const distance = isDown ? scrollDistance : -scrollDistance;
        window.scrollBy({ top: distance, left: 0, behavior: 'smooth' });
    }

    // ==============================
    // 键盘事件监听
    // ==============================
    function onKeyDown(event) {
        // 忽略组合键（Ctrl/Alt/Shift + 其他）
        if (event.ctrlKey || event.altKey || event.shiftKey) return;

        const target = event.target;
        // 在输入框、文本域或可编辑区域中不拦截快捷键
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable ||
            target.closest('[contenteditable="true"]')
        ) return;

        const key = event.key.toLowerCase();
        let handled = false;

        // --- 手动滚动：W / S / ↑ / ↓ ---
        if (['w', 'arrowup'].includes(key)) {
            event.preventDefault();
            performManualScroll(false);
            isScrollKeyPressed = true;
            handled = true;
        } else if (['s', 'arrowdown'].includes(key)) {
            event.preventDefault();
            performManualScroll(true);
            isScrollKeyPressed = true;
            handled = true;
        }

        // --- 页面/章节导航：A / D / ← / → ---
        if (key === 'a' || key === 'arrowleft') {
            event.preventDefault();
            handleNavigation('prev');
            handled = true;
        } else if (key === 'd' || key === 'arrowright') {
            event.preventDefault();
            handleNavigation('next');
            handled = true;
        }
    }

    function onKeyUp(event) {
        const key = event.key.toLowerCase();
        // 松开滚动键后，延迟恢复自动滚屏（如果之前被暂停）
        if (['w', 's', 'arrowup', 'arrowdown'].includes(key)) {
            isScrollKeyPressed = false;
            if (autoScrollWasActive) {
                setTimeout(() => {
                    if (!isScrollKeyPressed && hasAutoScrollAssistant()) {
                        window.startAutoScroll?.();
                        autoScrollWasActive = false;
                    }
                }, 500);
            }
        }
    }

    // ==============================
    // 初始化
    // ==============================
    function init() {
        scrollDistance = window.innerHeight * 0.9;

        // 监听键盘事件
        document.addEventListener('keydown', onKeyDown, { passive: false });
        document.addEventListener('keyup', onKeyUp, { passive: false });

        // 响应窗口尺寸变化
        window.addEventListener('resize', () => {
            scrollDistance = window.innerHeight * 0.9;
        });
    }

    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();