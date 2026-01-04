// ==UserScript==
// @name         中键点击自动滚动 (Middle Click Auto Scroll)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  单击鼠标中键切换自动滚动模式。鼠标在初始点击位置上方/下方移动时显示对应黑色小箭头并控制滚动方向/速度。再次单击中键、或单击左/右键、或按ESC键停止。
// @author       William Liu
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535396/%E4%B8%AD%E9%94%AE%E7%82%B9%E5%87%BB%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%20%28Middle%20Click%20Auto%20Scroll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535396/%E4%B8%AD%E9%94%AE%E7%82%B9%E5%87%BB%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%20%28Middle%20Click%20Auto%20Scroll%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isAutoScrolling = false;
    let anchorX = 0;
    let anchorY = 0;
    let scrollIntervalId = null;
    let currentScrollSpeed = 0;

    const SENSITIVITY = 0.2;
    const SCROLL_INTERVAL = 15;
    const DEAD_ZONE = 10;

    let indicatorElement = null;

    // 更新SVG图标：尺寸改小，颜色改为黑色
    const iconSize = "18px"; // 统一图标的SVG画布尺寸
    const neutralDotRadius = "5"; // 中性圆点的半径 (在24x24的viewBox内)

    const svgIconUp = `<svg viewBox="0 0 24 24" fill="black" width="${iconSize}" height="${iconSize}" style="display: block; margin: auto;"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`;
    const svgIconDown = `<svg viewBox="0 0 24 24" fill="black" width="${iconSize}" height="${iconSize}" style="display: block; margin: auto;"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`;
    const svgIconNeutral = `<svg viewBox="0 0 24 24" fill="black" width="${iconSize}" height="${iconSize}" style="display: block; margin: auto;"><circle cx="12" cy="12" r="${neutralDotRadius}"/></svg>`;

    function createIndicator() {
        if (!indicatorElement) {
            indicatorElement = document.createElement('div');
            indicatorElement.style.position = 'fixed';
            indicatorElement.style.zIndex = '9999999';
            // 调整容器尺寸以适应新的图标大小
            indicatorElement.style.width = '28px';
            indicatorElement.style.height = '28px';
            indicatorElement.style.background = 'rgba(200, 200, 200, 0.5)'; // 背景色保持不变，可按需调整
            indicatorElement.style.borderRadius = '50%';
            indicatorElement.style.pointerEvents = 'none';
            indicatorElement.style.display = 'none';
            indicatorElement.style.boxSizing = 'border-box';
            indicatorElement.style.display = 'flex';
            indicatorElement.style.alignItems = 'center';
            indicatorElement.style.justifyContent = 'center';
            document.body.appendChild(indicatorElement);
        }
    }

    function updateIndicatorIcon(currentY) {
        if (!indicatorElement || !isAutoScrolling) return;
        const deltaY = currentY - anchorY;
        let iconToShow = svgIconNeutral;
        if (deltaY < -DEAD_ZONE) {
            iconToShow = svgIconUp;
        } else if (deltaY > DEAD_ZONE) {
            iconToShow = svgIconDown;
        }
        indicatorElement.innerHTML = iconToShow;
    }

    function showIndicator() {
        if (indicatorElement) {
            indicatorElement.style.left = (anchorX - indicatorElement.offsetWidth / 2) + 'px';
            indicatorElement.style.top = (anchorY - indicatorElement.offsetHeight / 2) + 'px';
            indicatorElement.innerHTML = svgIconNeutral;
            indicatorElement.style.display = 'flex';
        }
    }

    function hideIndicator() {
        if (indicatorElement) {
            indicatorElement.style.display = 'none';
        }
    }

    function performScroll() {
        if (currentScrollSpeed !== 0) {
            window.scrollBy(0, currentScrollSpeed);
        }
    }

    function startAutoScrollMode(event) {
        isAutoScrolling = true;
        anchorX = event.clientX;
        anchorY = event.clientY;
        currentScrollSpeed = 0;

        createIndicator();
        showIndicator();
        updateIndicatorIcon(event.clientY);

        document.addEventListener('mousemove', handleMouseMoveForScroll);
        document.addEventListener('mousedown', handleNonMiddleMouseDownToStop, true);
        document.addEventListener('keydown', handleKeyDownToStop);
        document.addEventListener('wheel', handleWheelToStop, { passive: true });

        if (scrollIntervalId) clearInterval(scrollIntervalId);
        scrollIntervalId = setInterval(performScroll, SCROLL_INTERVAL);
        console.log('[Middle Click Auto Scroll by William Liu] MODE: STARTED at X=' + anchorX + ', Y=' + anchorY);
    }

    function stopAutoScrollMode(reason) {
        if (!isAutoScrolling) return;
        isAutoScrolling = false;
        if (scrollIntervalId) {
            clearInterval(scrollIntervalId);
            scrollIntervalId = null;
        }
        currentScrollSpeed = 0;

        document.removeEventListener('mousemove', handleMouseMoveForScroll);
        document.removeEventListener('mousedown', handleNonMiddleMouseDownToStop, true);
        document.removeEventListener('keydown', handleKeyDownToStop);
        document.removeEventListener('wheel', handleWheelToStop);

        hideIndicator();
        console.log('[Middle Click Auto Scroll by William Liu] MODE: STOPPED. Reason: ' + (reason || 'Unknown'));
    }

    function handleMiddleMouseDownToggle(event) {
        if (event.button === 1) {
            event.preventDefault();
            event.stopPropagation();
            if (isAutoScrolling) {
                stopAutoScrollMode('Middle mouse click toggle');
            } else {
                startAutoScrollMode(event);
            }
        }
    }

    function handleMouseMoveForScroll(event) {
        if (!isAutoScrolling) return;
        event.preventDefault();
        const deltaY = event.clientY - anchorY;
        if (Math.abs(deltaY) > DEAD_ZONE) {
            currentScrollSpeed = (deltaY - (Math.sign(deltaY) * DEAD_ZONE)) * SENSITIVITY;
        } else {
            currentScrollSpeed = 0;
        }
        updateIndicatorIcon(event.clientY);
    }

    function handleNonMiddleMouseDownToStop(event) {
        if (!isAutoScrolling) return;
        if (event.button === 0 || event.button === 2) {
            stopAutoScrollMode('Left/Right mouse click');
        }
    }

    function handleKeyDownToStop(event) {
        if (event.key === 'Escape' && isAutoScrolling) {
            stopAutoScrollMode('Escape key');
            event.preventDefault();
        }
    }

    function handleWheelToStop() {
        if (isAutoScrolling) {
            stopAutoScrollMode('Mouse wheel scroll');
        }
    }

    document.addEventListener('mousedown', handleMiddleMouseDownToggle, true);

    window.addEventListener('unload', () => {
        stopAutoScrollMode('Page unload');
        document.removeEventListener('mousedown', handleMiddleMouseDownToggle, true);
    });

    console.log("Middle Click Auto Scroll by William Liu (v2.2) loaded successfully.");

})();