// ==UserScript==
// @name                      自动滚屏助手
// @namespace                 http://tampermonkey.net/
// @version                   1.2
// @description               一个带有开关控制的自动滚屏助手，按 ESC 暂停/继续, 上/下方向键跳跃, <小于号键/>大于号键调速。左右方向键未设置，避免与翻页冲突
// @author                    coccvo
// @include                  *
// @match                    *weibo.com/*
// @match                    https://69shuba.cx/*
// @match                    https://www.or77.net/*
// @match                    https://uukan.net/*
// @icon                      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAeBJREFUWEftl1lKxEAURU87oB/qFhxAxQHB7TigbqN//NJlOKMLcsIBpy3oh7P2hVdShqSqkg6I0PWTpqty38nLe1U3Df54NCrG7wVGAV013oBbu5aSLAMwDJwAA5EIT8A8cJ1CkgqgwDOe4BdwBbzbfz3AOODrXQKTMYgUgGegz4RWgL2IqNbs2JoXoD+0PgZwBkwBeuKu2NNk5j8tI9Lws/drWQhgxApLN8RAi9gEriGt+7xFIeFHK7iUtBcBrALbgLSGygI4+hDkhhXieuD1BHWKxNXfrwnvPgXS1YI0Xdf88BYBTAAXQKyVUgCkIz21pPSSilBVq94PVrBlKFakp8A0MAvodwegk4H/nYFuw/+wa7YNs/NaVmsXZPd2H0B+4c7A/P2lVoD9ltFYsiByRHJBGgruDpvDlldY9F50rQDSlR9YLtj7j1q73UJmrhJAbCv2M+HiZZ/c/V9pK045jA68VBcFF0Slw0g3phw0m/aYzbqPY+k5QyJTsRsIEJpaA7aqGpI6LZm65CGPNOb1XAW3Y0qloaM4d8QAdJNvy5VSZ7mLNJ0P1HzbttwFqfJhcm5GJFg+KRlwAnqPx8BgpCBVvHPetlwbgC+kT7GxzMfpTZ7pjHVPmQzEtCrNfwMMv4whwzA6nAAAAABJRU5ErkJggg==
// @license                   MIT
// @grant                     GM_registerMenuCommand
// @grant                     GM_unregisterMenuCommand
// @grant                     GM_notification
// @run-at                    document-end
// @downloadURL https://update.greasyfork.org/scripts/531924/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%B1%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531924/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%B1%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 滚动控制变量
    let isEnabled = false;
    let isScrolling = false;
    let animationFrameId;
    let lastTimestamp = 0;
    let pixelsPerSecond = 70;
    const speedAdjustAmount = 3;
    const jumpIncrement = 200;
    const maxPixelsPerSecond = 800;
    const minPixelsPerSecond = 59;
    const pressedKeys = new Set();

    // 菜单命令ID
    let enableCommandId, disableCommandId;

    // 初始化菜单
    function initMenu() {
        // 注册"启用自动滚屏"命令
        enableCommandId = GM_registerMenuCommand("▶ 启用自动滚屏", function() {
            enableAutoScroll();
        });

        // 注册"禁用自动滚屏"命令（初始时禁用）
        disableCommandId = GM_registerMenuCommand("⏸ 禁用自动滚屏", function() {
            disableAutoScroll();
        }, { autoClose: true });

        // 初始状态禁用"禁用"命令
        GM_unregisterMenuCommand(disableCommandId);
    }

    // 启用自动滚屏
    function enableAutoScroll() {
        if (isEnabled) return;
        isEnabled = true;
        initAutoScroll();
        startRAFScroll();
        // 更新菜单状态
        GM_unregisterMenuCommand(enableCommandId);
        disableCommandId = GM_registerMenuCommand("⏸ 禁用自动滚屏", function() {
            disableAutoScroll();
        }, { autoClose: true });
        GM_notification({
            text: "自动滚屏已启用\n按ESC控制暂停/继续  按INS启用/禁用\n方向键跳跃\n<键/>键调速",
            title: "自动滚屏助手",
            timeout: 2000
        });
    }

    // 禁用自动滚屏
    function disableAutoScroll() {
        if (!isEnabled) return;
        isEnabled = false;
        turnOff();
        removeEventListeners();
        // 更新菜单状态
        GM_unregisterMenuCommand(disableCommandId);
        enableCommandId = GM_registerMenuCommand("▶ 启用自动滚屏", function() {
            enableAutoScroll();
        });
        GM_notification({
            text: "自动滚屏已禁用",
            title: "自动滚屏助手",
            timeout: 1000
        });
    }

    // 滚动逻辑
    function scrollStepRAF(timestamp) {
        if (!isScrolling || !isEnabled) return;

        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
            animationFrameId = requestAnimationFrame(scrollStepRAF);
            return;
        }
        const deltaTime = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;
        const scrollAmount = pixelsPerSecond * deltaTime;
        window.scrollBy(0, scrollAmount);
        animationFrameId = requestAnimationFrame(scrollStepRAF);
    }
    function startRAFScroll() {
        if ((isScrolling && animationFrameId) || !isEnabled) return;
        isScrolling = true;
        lastTimestamp = 0;
        animationFrameId = requestAnimationFrame(scrollStepRAF);
    }
    function turnOff() {
        if (!isScrolling) return;
        isScrolling = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // 获取滚动状态函数
    function getIsScrollingState() {
        return isScrolling;
    }

    // 快捷键逻辑
    function handleKeyDown(event) {
        const targetElement = event.target;
        const isInInputElement =
              targetElement.tagName === 'INPUT' ||
              targetElement.tagName === 'TEXTAREA' ||
              targetElement.tagName === 'SELECT' ||
              targetElement.isContentEditable;

        // 在输入元素中，只允许ESC和Insert键
        if (isInInputElement && event.key !== 'Escape' && event.key !== 'Insert') {
            return;
        }

        pressedKeys.add(event.key);
        let handled = false;

        // 以下功能仅在启用状态下生效
        if (isEnabled) {
            // ESC键：控制暂停/继续
            if (pressedKeys.has('Escape')) {
                if (isScrolling) {
                    turnOff();
                    console.log("自动滚屏: 已暂停 (ESC)");
                } else {
                    startRAFScroll();
                    console.log("自动滚屏: 已启动 (ESC)");
                }
                handled = true;
            }

            // 方向键：跳跃滚动
            if (pressedKeys.has('ArrowUp')) {
                window.scrollBy(0, -jumpIncrement);
                handled = true;
            }

            if (pressedKeys.has('ArrowDown')) {
                window.scrollBy(0, jumpIncrement);
                handled = true;
            }

            // 调速键：, 减速 / . 加速
            if (pressedKeys.has('.')) {
                pixelsPerSecond += speedAdjustAmount;
                if (pixelsPerSecond > maxPixelsPerSecond) pixelsPerSecond = maxPixelsPerSecond;
                console.log("自动滚屏: 速度", pixelsPerSecond, "px/s");
                handled = true;
            }

            if (pressedKeys.has(',')) {
                pixelsPerSecond -= speedAdjustAmount;
                if (pixelsPerSecond < minPixelsPerSecond) pixelsPerSecond = minPixelsPerSecond;
                console.log("自动滚屏: 速度", pixelsPerSecond, "px/s");
                handled = true;
            }
        }

        if (handled) {
            event.preventDefault();
        }
    }

    function handleKeyUp(event) {
        pressedKeys.delete(event.key);
    }
    function initAutoScroll() {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp, false);
    }
    function removeEventListeners() {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    }

    // 暴露对外接口
    if (typeof window !== 'undefined') {
        unsafeWindow.turnOffAutoScroll = turnOff; // 停止滚动
        unsafeWindow.startAutoScroll = startRAFScroll; // 开始滚动
        unsafeWindow.getAutoScrollState = getIsScrollingState; // 获取当前滚动状态
    }

    //INS键控制启用/禁用
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Insert') {
            if (isEnabled) {
                disableAutoScroll();
            } else {
                enableAutoScroll();
            }
            event.preventDefault();
        }
    });
    initMenu();
})();