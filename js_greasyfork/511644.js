// ==UserScript==
// @name         滚动条及顶部底部按钮
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  在任何网页顶部显示滚动进度条，并提供滚动到顶部和底部的按钮，优化性能，减少卡顿现象。
// @author       Leo
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511644/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E5%8F%8A%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/511644/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E5%8F%8A%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 缓存 DOM 元素和变量
    const { documentElement: docEl, body } = document;
    let pageHeight = 0, clientHeight = 0, maxScroll = 0;
    let lastScrollTop = -1, lastMaxScroll = -1;

    // 进度条类
    class ProgressBar {
        constructor() {
            this._progress = -1;
            this.bar = this._createBar();
        }

        _createBar() {
            const progressBar = document.createElement('div');
            progressBar.id = 'progress-bar';
            progressBar.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 2px; transform: scaleX(0);
                background: linear-gradient(90deg, #03a9f4, #f441a5); z-index: 999999999;
                pointer-events: none; transform-origin: left;
                box-shadow: 0 0 40px #03a9f4, 0 0 50px #f441a5, 0 0 60px #03a9f4;
                border-radius: 0.5em; transition: transform 0.2s ease;
            `;
            document.body.insertBefore(progressBar, document.body.firstChild);
            return progressBar;
        }

        update(progress) {
            if (this._progress !== progress) {
                this.bar.style.transform = `scaleX(${progress / 100})`;
                this._progress = progress;
            }
        }
    }

    // 滚动按钮类
    class ScrollButtons {
        constructor() {
            this._visible = false;
            this.buttons = this._createButtons();
        }

        _createButtons() {
            const scrollBtns = document.createElement('div');
            scrollBtns.className = 'scroll-buttons';
            scrollBtns.style.cssText = `
                position: fixed; bottom: 10px; right: 5rem; z-index: 1000000000; display: none;
            `;

            ['⬆️顶部', '⬇️最新'].forEach((text, i) => {
                const button = document.createElement('button');
                button.innerText = text;
                button.onclick = () => smoothScroll(i ? maxScroll : 0);
                button.style.cssText = `
                    background-color: #0005; color: #eee; border: none; font-size: 16px;
                    padding: 10px; margin: 0 5px; border-radius: 5px; cursor: pointer;
                `;
                scrollBtns.appendChild(button);
            });

            document.body.appendChild(scrollBtns);
            return scrollBtns;
        }

        update(scrollTop) {
            const showScrollButtons = maxScroll > 0;
            if (this._visible !== showScrollButtons) {
                this.buttons.style.display = showScrollButtons ? 'flex' : 'none';
                this._visible = showScrollButtons;
            }

            // 当在顶部时隐藏顶部按钮，当在底部时隐藏底部按钮
            this.buttons.children[0].style.display = scrollTop > 100 ? 'inline-block' : 'none';
            this.buttons.children[1].style.display = (maxScroll - scrollTop > 100) ? 'inline-block' : 'none';
        }
    }

    // 初始化进度条和滚动按钮
    const progressBar = new ProgressBar();
    const scrollButtons = new ScrollButtons();

    // 更新页面尺寸
    const updatePageDimensions = () => {
        const newClientHeight = docEl.clientHeight;
        const newPageHeight = Math.max(
            body.scrollHeight, docEl.scrollHeight,
            body.offsetHeight, docEl.offsetHeight,
            body.clientHeight, docEl.clientHeight
        );

        if (newPageHeight !== pageHeight || newClientHeight !== clientHeight) {
            clientHeight = newClientHeight;
            pageHeight = newPageHeight;
            maxScroll = pageHeight - clientHeight;
            return true;
        }
        return false;
    };

    // 节流的滚动处理器
    const scrollHandler = throttle(() => {
        requestAnimationFrame(updateUI);
    }, 16);

    // 防抖的调整大小处理器
    const resizeHandler = debounce(() => {
        if (updatePageDimensions()) updateUI();
    }, 100);

    // 添加事件监听器
    const addListeners = () => {
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', resizeHandler, { passive: true });
    };

    // 更新 UI（进度条和滚动按钮）
    function updateUI() {
        const scrollTop = window.scrollY;
        if (scrollTop === lastScrollTop && maxScroll === lastMaxScroll) return;

        lastScrollTop = scrollTop;
        lastMaxScroll = maxScroll;

        const progress = maxScroll ? (scrollTop / maxScroll) * 100 : 0;
        progressBar.update(progress);
        scrollButtons.update(scrollTop);
    }

    // 平滑滚动到目标
    function smoothScroll(target) {
        const start = window.scrollY;
        const change = target - start;
        const duration = 400;
        const increment = 16;

        const animateScroll = (startTime) => {
            const currentTime = performance.now() - startTime;
            const val = easeInOutQuad(currentTime, start, change, duration);
            window.scrollTo(0, val);
            if (currentTime < duration) requestAnimationFrame(() => animateScroll(startTime));
        };
        requestAnimationFrame((startTime) => animateScroll(startTime));
    }

    // 缓动函数
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        return t < 1 ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
    }

    // 节流函数
    function throttle(fn, delay) {
        let lastTime = 0;
        return (...args) => {
            const now = performance.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                fn(...args);
            }
        };
    }

    // 防抖函数
    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    // 初始化函数
    function init() {
        updatePageDimensions();
        updateUI();
        addListeners();
    }

    // 执行初始化
    init();

    // 清理函数
    const cleanup = () => {
        window.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', resizeHandler);
    };

    // 添加清理监听器
    window.addEventListener('beforeunload', cleanup);

    // 使用 IntersectionObserver 替代部分滚动监听
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 处理元素进入视口的逻辑
            }
        });
    });

    // 缓存 DOM 元素
    const progressBarElement = document.getElementById('progress-bar');
    const scrollButtonsElement = document.querySelector('.scroll-buttons');

    // 使用 CSS 类切换
    function updateProgressBar(progress) {
        if (progressBarElement) {
            progressBarElement.style.transform = `scaleX(${progress / 100})`;
        }
    }

    function updateScrollButtonsVisibility(visible) {
        if (scrollButtonsElement) {
            scrollButtonsElement.classList.toggle('visible', visible);
        }
    }

    // 使用 passive 事件监听
    window.addEventListener('scroll', scrollHandler, { passive: true });
})();