// ==UserScript==
// @name         缓慢滑动网页（支持上下滑动 + 可调参数）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  支持向上/向下滑动，可调步长与间隔，滑动到顶/底自动停止，状态精准同步
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544946/%E7%BC%93%E6%85%A2%E6%BB%91%E5%8A%A8%E7%BD%91%E9%A1%B5%EF%BC%88%E6%94%AF%E6%8C%81%E4%B8%8A%E4%B8%8B%E6%BB%91%E5%8A%A8%20%2B%20%E5%8F%AF%E8%B0%83%E5%8F%82%E6%95%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544946/%E7%BC%93%E6%85%A2%E6%BB%91%E5%8A%A8%E7%BD%91%E9%A1%B5%EF%BC%88%E6%94%AF%E6%8C%81%E4%B8%8A%E4%B8%8B%E6%BB%91%E5%8A%A8%20%2B%20%E5%8F%AF%E8%B0%83%E5%8F%82%E6%95%B0%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认配置
    let scrollStep = 5;           // 每步滚动像素
    let scrollInterval = 50;      // 每次滚动间隔（毫秒）
    let scrollDirection = 'down'; // 当前方向：'down' 或 'up'

    // 全局状态
    let isScrolling = false;
    let isInitialized = false;

    // 公共样式基础
    const baseStyle = `
        font-family: Arial, sans-serif;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    /**
     * 创建所有控制 UI：参数调节 + 方向选择 + 开关按钮
     */
    function createControls() {
        if (document.getElementById('tm-scroll-controls') || isInitialized) return;
        isInitialized = true;

        // 主容器
        const container = document.createElement('div');
        container.id = 'tm-scroll-controls';
        container.style.cssText = `
            position: fixed;
            bottom: 110px;
            right: 20px;
            z-index: 99999;
            width: 200px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 12px;
            font-family: Arial, sans-serif;
            user-select: none;
        `;

        // 标题
        const title = document.createElement('div');
        title.textContent = '自动滑动设置';
        title.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #333; font-size: 14px;';
        container.appendChild(title);

        // 步长调节
        container.appendChild(createLabeledSlider('步长(px)', 'step', 1, 20, 1, scrollStep, (val) => { scrollStep = parseInt(val); }));
        // 间隔调节
        container.appendChild(createLabeledSlider('间隔(ms)', 'interval', 10, 200, 10, scrollInterval, (val) => { scrollInterval = parseInt(val); }));

        // 方向选择按钮
        const directionDiv = document.createElement('div');
        directionDiv.style.margin = '10px 0 0 0';
        directionDiv.innerHTML = `
            <span style="font-size:12px;color:#555;display:inline-block;width:50px;">方向</span>
            <button id="scroll-dir-up" style="${baseStyle} background:#e0e0e0; width:40px; height:24px; margin-left:4px; font-size:12px;">↑</button>
            <button id="scroll-dir-down" style="${baseStyle} background:#4CAF50; width:40px; height:24px; margin:0 4px; font-size:12px; color:white;">↓</button>
        `;
        container.appendChild(directionDiv);

        // 绑定方向按钮事件
        const btnUp = container.querySelector('#scroll-dir-up');
        const btnDown = container.querySelector('#scroll-dir-down');

        btnUp.onclick = () => {
            scrollDirection = 'up';
            btnUp.style.background = '#4CAF50';
            btnUp.style.color = 'white';
            btnDown.style.background = '#e0e0e0';
            btnDown.style.color = 'black';
            updateButtonUI(); // 更新主按钮文字
        };

        btnDown.onclick = () => {
            scrollDirection = 'down';
            btnDown.style.background = '#4CAF50';
            btnDown.style.color = 'white';
            btnUp.style.background = '#e0e0e0';
            btnUp.style.color = 'black';
            updateButtonUI(); // 更新主按钮文字
        };

        document.body.appendChild(container);

        // 创建主开关按钮
        createToggleButton();
    }

    /**
     * 创建带 +/- 按钮的调节项
     */
    function createLabeledSlider(label, idSuffix, min, max, step, value, onChange) {
        const div = document.createElement('div');
        div.style.margin = '8px 0';

        div.innerHTML = `
            <span style="display:inline-block;width:50px;font-size:12px;color:#555;">${label}</span>
            <button data-action="decr" style="${baseStyle} background:#f8f8f8; width:24px; height:24px; margin-left:4px;">−</button>
            <input type="number" id="scroll-${idSuffix}" value="${value}" min="${min}" max="${max}" step="${step}"
                   style="width:50px; height:24px; text-align:center; border:1px solid #ddd; border-radius:4px; margin:0 4px; padding:0; font-size:12px;">
            <button data-action="incr" style="${baseStyle} background:#f8f8f8; width:24px; height:24px;">+</button>
        `;

        const input = div.querySelector('input');
        const decrBtn = div.querySelector('[data-action="decr"]');
        const incrBtn = div.querySelector('[data-action="incr"]');

        input.addEventListener('change', () => {
            let val = parseInt(input.value) || parseInt(input.defaultValue);
            val = Math.max(min, Math.min(max, val));
            input.value = val;
            onChange(val);
        });

        decrBtn.addEventListener('click', () => {
            let val = Math.max(min, parseInt(input.value) - step);
            input.value = val;
            onChange(val);
        });

        incrBtn.addEventListener('click', () => {
            let val = Math.min(max, parseInt(input.value) + step);
            input.value = val;
            onChange(val);
        });

        return div;
    }

    /**
     * 创建主开关按钮
     */
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'tm-scroll-toggle-btn';
        button.textContent = getButtonText(); // 动态文字
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: bold;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        `;
        updateButtonStyle(false); // 初始为红色

        button.onclick = toggleScroll;

        button.onmouseenter = () => {
            if (!isScrolling) button.style.transform = 'scale(1.05)';
        };
        button.onmouseleave = () => {
            button.style.transform = 'scale(1)';
        };

        document.body.appendChild(button);
    }

    /**
     * 根据当前方向生成按钮文字
     */
    function getButtonText() {
        const directionText = scrollDirection === 'up' ? '上滑' : '下滑';
        return `自动${directionText}：${isScrolling ? '开' : '关'}`;
    }

    /**
     * 更新按钮文字和颜色
     */
    function updateButtonUI() {
        const button = document.getElementById('tm-scroll-toggle-btn');
        if (!button) return;
        button.textContent = getButtonText();
        updateButtonStyle(isScrolling);
    }

    /**
     * 更新按钮背景色
     */
    function updateButtonStyle(running) {
        const button = document.getElementById('tm-scroll-toggle-btn');
        if (!button) return;
        button.style.backgroundColor = running ? '#4CAF50' : '#f44336';
    }

    /**
     * 切换滚动状态
     */
    function toggleScroll() {
        isScrolling = !isScrolling;
        updateButtonUI();
        if (isScrolling) {
            smoothScroll();
        }
    }

    /**
     * 平滑滚动主函数
     */
    function smoothScroll() {
        if (!isScrolling) return;

        const currentScroll = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;

        let canContinue = true;

        if (scrollDirection === 'down') {
            // 向下：检查是否到底
            if (currentScroll >= maxScroll) {
                canContinue = false;
            } else {
                window.scrollBy(0, scrollStep);
            }
        } else if (scrollDirection === 'up') {
            // 向上：检查是否到顶
            if (currentScroll <= 0) {
                canContinue = false;
            } else {
                window.scrollBy(0, -scrollStep);
            }
        }

        // 停止条件：到顶或到底
        if (!canContinue) {
            isScrolling = false;
            updateButtonUI();
            return;
        }

        // 继续滚动
        setTimeout(smoothScroll, scrollInterval);
    }

    /**
     * 初始化入口
     */
    function init() {
        if (document.body) {
            createControls();
        } else {
            document.addEventListener('DOMContentLoaded', createControls);
        }
    }

    // 快捷键 S：切换开关
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 's') {
            const btn = document.getElementById('tm-scroll-toggle-btn');
            if (btn) btn.click();
        }
    });

    // 启动
    init();

})();