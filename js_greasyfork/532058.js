// ==UserScript==
// @name         Back to Top
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  为网页添加平滑返回顶部按钮
// @author       sept
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/532058/Back%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/532058/Back%20to%20Top.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.self !== window.top || window.myBackToTopScriptHasRun) {
        return;
    }
    window.myBackToTopScriptHasRun = true;

    const HOSTNAME = window.location.hostname;
    const ENABLED_SITES_KEY = 'back-to-top-enabled-sites';
    const BUTTON_POSITION_KEY = `back-to-top-button-position_${HOSTNAME}`;

    // 获取已启用的网站列表，默认为 a list of 'github.com'
    let enabledSites = GM_getValue(ENABLED_SITES_KEY, ['github.com']);

    // 检查当前网站是否已启用
    function isSiteEnabled() {
        return enabledSites.includes(HOSTNAME);
    }

    // 切换当前网站的启用状态
    function toggleSite() {
        if (isSiteEnabled()) {
            enabledSites = enabledSites.filter(site => site !== HOSTNAME);
        } else {
            enabledSites.push(HOSTNAME);
        }
        GM_setValue(ENABLED_SITES_KEY, enabledSites);
        window.location.reload();
    }

    // 注册菜单命令
    GM_registerMenuCommand(`${isSiteEnabled() ? '关闭' : '开启'}返回顶部`, toggleSite);

    // 如果当前网站未启用，则不执行任何操作
    if (!isSiteEnabled()) {
        return;
    }

    // 创建按钮元素
    const backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'gemini-back-to-top-button';
    backToTopBtn.innerHTML = '↑';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #gemini-back-to-top-button {
            position: fixed;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #238636, #2ea043);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            font-size: 20px;
            font-weight: bold;
            z-index: 9999;
        }

        #gemini-back-to-top-button.visible {
            opacity: 1;
        }

        #gemini-back-to-top-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        #gemini-back-to-top-button:active {
            cursor: pointer;
            transform: scale(0.9);
        }
    `;

    // 添加样式和按钮到页面
    document.head.appendChild(style);
    document.body.appendChild(backToTopBtn);

    function applyPosition(position) {
        let top, left;

        const buttonWidth = 40;
        const buttonHeight = 40;

        if (position.pctTop !== undefined && position.pctLeft !== undefined) {
            top = position.pctTop * (window.innerHeight - buttonHeight);
            left = position.pctLeft * (window.innerWidth - buttonWidth);
        } else if (position.top !== undefined && position.left !== undefined) {
            top = position.top;
            left = position.left;
        } else {
            return;
        }

        top = Math.max(0, Math.min(top, window.innerHeight - buttonHeight));
        left = Math.max(0, Math.min(left, window.innerWidth - buttonWidth));

        backToTopBtn.style.top = `${top}px`;
        backToTopBtn.style.left = `${left}px`;
    }

    const defaultPosition = { pctTop: 0.9, pctLeft: 0.9 };
    const savedPosition = GM_getValue(BUTTON_POSITION_KEY, defaultPosition);
    applyPosition(savedPosition);

    function smoothScrollTo(targetY, duration) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startY, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // easeInOutQuad easing function
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }


    // 滚动事件监听
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // 窗口大小调整事件监听
    window.addEventListener('resize', () => {
        const pos = GM_getValue(BUTTON_POSITION_KEY, defaultPosition);
        applyPosition(pos);
    });

    let isDragging = false;
    let hasDragged = false;
    let offsetX, offsetY, startX, startY;

    backToTopBtn.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasDragged = false;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = e.clientX - backToTopBtn.getBoundingClientRect().left;
        offsetY = e.clientY - backToTopBtn.getBoundingClientRect().top;
        backToTopBtn.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.sqrt(dx * dx + dy * dy) > 5) {
                hasDragged = true;
            }

            if (hasDragged) {
                let newTop = e.clientY - offsetY;
                let newLeft = e.clientX - offsetX;

                // Constrain to viewport
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - backToTopBtn.offsetHeight));
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - backToTopBtn.offsetWidth));

                backToTopBtn.style.top = `${newTop}px`;
                backToTopBtn.style.left = `${newLeft}px`;
            }
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            backToTopBtn.style.transition = 'opacity 0.3s, transform 0.3s'; // Re-enable transition
            if (hasDragged) {
                const pctTop = backToTopBtn.offsetTop / (window.innerHeight - backToTopBtn.offsetHeight);
                const pctLeft = backToTopBtn.offsetLeft / (window.innerWidth - backToTopBtn.offsetWidth);

                GM_setValue(BUTTON_POSITION_KEY, {
                    pctTop: Math.max(0, Math.min(1, pctTop)),
                    pctLeft: Math.max(0, Math.min(1, pctLeft)),
                });
            }
        }
    });

    // 点击事件 - 平滑滚动
    backToTopBtn.addEventListener('click', function () {
        if (!hasDragged) {
            smoothScrollTo(0, 300);
        }
    });
})();