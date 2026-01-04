// ==UserScript==
// @name         阅读助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  页面中只要有 <p> 标签，则提供竖直滑块调节字体大小并设置为 serif 字体；长按 2 秒页面任意位置显示悬浮面板，兼容移动端。
// @author       qwen3
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536962/%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536962/%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // == 判断是否有 <p> 标签 ==
    function hasParagraphs() {
        return document.querySelectorAll('p').length > 0;
    }

    // == 创建全屏按钮 ==
    const fullscreenBtn = document.createElement('div');
    fullscreenBtn.textContent = '⛶ 全屏';
    Object.assign(fullscreenBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '99999',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '14px 18px',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        transition: 'opacity 0.3s',
        display: 'none',
        textAlign: 'center'
    });
    document.body.appendChild(fullscreenBtn);

    // == 创建竖直字体调节控件（放在按钮上面）==
    const sliderContainer = document.createElement('div');
    sliderContainer.style.position = 'fixed';
    sliderContainer.style.bottom = '100px'; // 按钮上方
    sliderContainer.style.right = '20px';
    sliderContainer.style.zIndex = '99999';
    sliderContainer.style.backgroundColor = '#f9f9f9';
    sliderContainer.style.padding = '12px';
    sliderContainer.style.borderRadius = '8px';
    sliderContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    sliderContainer.style.fontFamily= 'Arial, sans-serif';
    sliderContainer.style.fontSize= '14px';
    sliderContainer.style.display = 'none';
    sliderContainer.style.textAlign = 'center';

    const sliderLabel = document.createElement('div');
    sliderLabel.textContent = 'Aa';
    sliderLabel.style.fontWeight = 'bold';
    sliderLabel.style.marginBottom = '6px';

    const fontSizeSlider = document.createElement('input');
    fontSizeSlider.type = 'range';
    fontSizeSlider.min = '12';
    fontSizeSlider.max = '36';
    fontSizeSlider.value = '16';
    fontSizeSlider.setAttribute('orient', 'vertical'); // Firefox 支持竖向
    fontSizeSlider.style.appearance = 'slider-vertical'; // Webkit 浏览器支持
    fontSizeSlider.style.height = '150px';
    fontSizeSlider.style.width = '24px';
    fontSizeSlider.style.transform = 'scaleY(-1)'; // 倒置使数值从上往下递增
    fontSizeSlider.style.writingMode = 'bt-lr'; // Chrome 等兼容

    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(fontSizeSlider);
    document.body.appendChild(sliderContainer);

    // == 注入样式，仅修改 <p> 的字体 ==
    const fontStyles = document.createElement('style');
    fontStyles.id = 'custom-font-style';
    document.head.appendChild(fontStyles);

    function applyFontStyle(fontSize) {
        fontStyles.textContent = `
            p {
                font-family: serif !important;
                font-size: ${fontSize}px !important;
                line-height: 1.6 !important;
            }
        `;
    }

    // == 获取本地保存的字体大小 ==
    const FONT_SIZE_KEY = 'custom_font_size_v2';
    let currentFontSize = parseInt(localStorage.getItem(FONT_SIZE_KEY)) || 16;
    fontSizeSlider.value = currentFontSize;

    if (hasParagraphs()) {
        applyFontStyle(currentFontSize);
    }

    // == 滑块事件监听 ==
    fontSizeSlider.addEventListener('input', function () {
        const newSize = parseInt(this.value);
        currentFontSize = newSize;
        applyFontStyle(newSize);
        localStorage.setItem(FONT_SIZE_KEY, newSize.toString());
    });

    // == 长按逻辑：2秒触发显示面板 ==
    let longPressTimer = null;

    // 防止误操作输入框等
    function shouldIgnoreTarget(target) {
        return ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(target.tagName);
    }

    function startLongPress(e) {
        if (shouldIgnoreTarget(e.target)) return;
        longPressTimer = setTimeout(() => {
            togglePanel(true);
        }, 600);
    }

    function stopLongPress() {
        clearTimeout(longPressTimer);
    }

    // 添加鼠标事件（桌面）
    document.addEventListener('mousedown', startLongPress);
    document.addEventListener('mouseup', stopLongPress);
    document.addEventListener('mouseleave', stopLongPress);

    // 添加触摸事件（移动端）
    document.addEventListener('touchstart', startLongPress, { passive: true });
    document.addEventListener('touchend', stopLongPress);
    document.addEventListener('touchcancel', stopLongPress);

    // == 显示/隐藏面板函数 ==
    function togglePanel(show = false) {
        const isVisible = fullscreenBtn.style.display === 'block';
        const shouldShow = show ? true : !isVisible;
        fullscreenBtn.style.display = shouldShow ? 'block' : 'none';
        sliderContainer.style.display = shouldShow ? 'block' : 'none';
    }

    // == 点击外部区域关闭面板 ==
    document.addEventListener('click', (e) => {
        const isClickInside =
            e.target === fullscreenBtn ||
            fullscreenBtn.contains(e.target) ||
            e.target === sliderContainer ||
            sliderContainer.contains(e.target);

        if (!isClickInside) {
            fullscreenBtn.style.display = 'none';
            sliderContainer.style.display = 'none';
        }
    });

    // == 全屏切换功能 ==
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .catch(err => console.error('全屏请求失败:', err));
        } else {
            document.exitFullscreen();
        }
    });

})();