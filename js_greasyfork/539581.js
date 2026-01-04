// ==UserScript==
// @name         Comick Auto Scroller
// @namespace    https://github.com/GooglyBlox
// @version      1.4
// @description  Adds auto-scroll functionality to Comick.dev manga reader
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539581/Comick%20Auto%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/539581/Comick%20Auto%20Scroller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrollSpeed = 2;
    let isScrolling = false;
    let animationFrame;
    let savedPosition = null;
    let keyPressCount = 0;
    let lastToastTime = 0;
    let modal = null;
    let isListening = false;
    let currentUrl = location.href;
    let cachedScrollTarget = null;
    let lastScrollPosition = 0;
    let manualScrollTimeout;
    let isManualScrolling = false;
    let lastAutoScrollTime = 0;

    function injectStyles() {
        if (document.getElementById('autoscroller-styles')) return;

        let style = document.createElement('style');
        style.id = 'autoscroller-styles';
        style.textContent = `
            .autoscroller-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }

            .autoscroller-panel {
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 400px;
                max-width: 90vw;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }

            .dark .autoscroller-panel {
                background: #374151;
                color: #f3f4f6;
            }

            .autoscroller-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid #e5e7eb;
            }

            .dark .autoscroller-header {
                border-bottom-color: #6b7280;
            }

            .autoscroller-title {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .autoscroller-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .autoscroller-close:hover {
                color: #374151;
            }

            .dark .autoscroller-close:hover {
                color: #f3f4f6;
            }

            .autoscroller-controls {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .autoscroller-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }

            .autoscroller-label {
                font-weight: 500;
                min-width: 100px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .autoscroller-slider-container {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .autoscroller-slider {
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: #e5e7eb;
                outline: none;
                -webkit-appearance: none;
            }

            .dark .autoscroller-slider {
                background: #6b7280;
            }

            .autoscroller-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #3b82f6;
                cursor: pointer;
            }

            .autoscroller-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #3b82f6;
                cursor: pointer;
                border: none;
            }

            .autoscroller-toggle {
                position: relative;
                display: inline-block;
                width: 52px;
                height: 28px;
            }

            .autoscroller-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .autoscroller-slider-toggle {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #d1d5db;
                transition: .4s;
                border-radius: 28px;
            }

            .autoscroller-slider-toggle:before {
                position: absolute;
                content: "";
                height: 22px;
                width: 22px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .autoscroller-slider-toggle {
                background-color: #3b82f6;
            }

            input:checked + .autoscroller-slider-toggle:before {
                transform: translateX(24px);
            }

            .autoscroller-value {
                min-width: 50px;
                text-align: center;
                font-weight: 500;
                font-size: 14px;
                color: #6b7280;
            }

            .dark .autoscroller-value {
                color: #d1d5db;
            }

            .autoscroller-buttons {
                display: flex;
                gap: 12px;
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid #e5e7eb;
            }

            .dark .autoscroller-buttons {
                border-top-color: #6b7280;
            }

            .autoscroller-button {
                flex: 1;
                padding: 10px 16px;
                border: none;
                border-radius: 8px;
                background: #3b82f6;
                color: white;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s;
            }

            .autoscroller-button:hover {
                background: #2563eb;
            }

            .autoscroller-button.stop {
                background: #ef4444;
            }

            .autoscroller-button.stop:hover {
                background: #dc2626;
            }

            .autoscroller-button.secondary {
                background: #6b7280;
            }

            .autoscroller-button.secondary:hover {
                background: #4b5563;
            }

            .autoscroller-status-indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ef4444;
                margin-left: 8px;
            }

            .autoscroller-status-indicator.active {
                background: #10b981;
            }

            .autoscroller-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                z-index: 10001;
                font-size: 14px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .autoscroller-help {
                background: #f8fafc;
                border-radius: 8px;
                padding: 16px;
                margin-top: 16px;
                font-size: 13px;
                line-height: 1.5;
            }

            .dark .autoscroller-help {
                background: #4b5563;
            }

            .autoscroller-help-title {
                font-weight: 600;
                margin-bottom: 8px;
                color: #374151;
            }

            .dark .autoscroller-help-title {
                color: #f3f4f6;
            }

            .autoscroller-help-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }

            .autoscroller-help-key {
                font-family: monospace;
                background: #e5e7eb;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
            }

            .dark .autoscroller-help-key {
                background: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(message) {
        let existingToast = document.querySelector('.autoscroller-toast');
        if (existingToast) {
            existingToast.remove();
        }

        let toast = document.createElement('div');
        toast.className = 'autoscroller-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function calculateScrollTarget() {
        let navElements = Array.from(document.querySelectorAll('div.flex.items-center'));
        let targetNavElement = null;
        let lowestPosition = -1;

        for (let nav of navElements) {
            let hasComicLink = false;
            let hasHomeLink = false;
            let links = nav.querySelectorAll('a');

            for (let link of links) {
                let href = link.getAttribute('href');
                if (href) {
                    if (href.includes('/comic/')) hasComicLink = true;
                    if (href.includes('/home')) hasHomeLink = true;
                }
            }

            if (hasComicLink && hasHomeLink) {
                let rect = nav.getBoundingClientRect();
                let absoluteTop = rect.top + window.scrollY;

                if (absoluteTop > lowestPosition) {
                    lowestPosition = absoluteTop;
                    targetNavElement = nav;
                }
            }
        }

        if (targetNavElement) {
            let rect = targetNavElement.getBoundingClientRect();
            return rect.bottom + window.scrollY;
        }

        return document.documentElement.scrollHeight;
    }

    function getScrollTarget() {
        if (cachedScrollTarget === null) {
            cachedScrollTarget = calculateScrollTarget();
        }
        return cachedScrollTarget;
    }

    function refreshScrollTarget() {
        cachedScrollTarget = null;
    }

    function hasReachedBottom() {
        let target = getScrollTarget();
        let currentScrollBottom = window.scrollY + window.innerHeight;
        return currentScrollBottom >= target;
    }

    function detectManualScroll() {
        let currentScrollPosition = window.scrollY;
        let timeSinceLastAutoScroll = Date.now() - lastAutoScrollTime;

        if (Math.abs(currentScrollPosition - lastScrollPosition) > scrollSpeed * 2 && timeSinceLastAutoScroll > 100) {
            isManualScrolling = true;
            clearTimeout(manualScrollTimeout);
            manualScrollTimeout = setTimeout(() => {
                isManualScrolling = false;
            }, 1000);
        }

        lastScrollPosition = currentScrollPosition;
    }

    function smoothScroll() {
        if (!isScrolling || isManualScrolling) {
            if (isScrolling && !isManualScrolling) {
                animationFrame = requestAnimationFrame(smoothScroll);
            }
            return;
        }

        if (hasReachedBottom()) {
            stopScrolling();
            return;
        }

        lastAutoScrollTime = Date.now();
        window.scrollBy({
            top: scrollSpeed,
            behavior: 'auto'
        });

        animationFrame = requestAnimationFrame(smoothScroll);
    }

    function startScrolling() {
        if (!isScrolling) {
            refreshScrollTarget();
            isScrolling = true;
            lastScrollPosition = window.scrollY;
            isManualScrolling = false;
            lastAutoScrollTime = Date.now();
            animationFrame = requestAnimationFrame(smoothScroll);
            updateModal();
        }
    }

    function stopScrolling() {
        isScrolling = false;
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        updateModal();
    }

    function enableKeyListener() {
        if (!isListening) {
            isListening = true;
            document.addEventListener('keydown', keyControl);
            window.addEventListener('scroll', detectManualScroll, { passive: true });
        }
    }

    function disableKeyListener() {
        if (isListening) {
            isListening = false;
            document.removeEventListener('keydown', keyControl);
            window.removeEventListener('scroll', detectManualScroll);
        }
    }

    function keyControl(event) {
        let currentTime = Date.now();

        if (event.key === ' ') {
            event.preventDefault();
            if (isScrolling) {
                stopScrolling();
                showToast("Auto-scroll paused");
            } else {
                startScrolling();
                showToast("Auto-scroll resumed");
            }
        } else if (event.key === 'ArrowDown') {
            if (!isScrolling) startScrolling();
            scrollSpeed = Math.min(20, scrollSpeed + 1);
            keyPressCount++;
            updateModal();

            if (keyPressCount >= 5 || (currentTime - lastToastTime > 3000)) {
                showToast(`Speed increased to ${scrollSpeed}px/frame`);
                keyPressCount = 0;
                lastToastTime = currentTime;
            }
        } else if (event.key === 'ArrowUp') {
            if (!isScrolling) startScrolling();
            scrollSpeed = Math.max(1, scrollSpeed - 1);
            keyPressCount++;
            updateModal();

            if (keyPressCount >= 5 || (currentTime - lastToastTime > 3000)) {
                showToast(`Speed decreased to ${scrollSpeed}px/frame`);
                keyPressCount = 0;
                lastToastTime = currentTime;
            }
        } else if (event.ctrlKey && event.key.toLowerCase() === 'm') {
            event.preventDefault();
            let scrollTarget = getScrollTarget();
            let maxScroll = scrollTarget - window.innerHeight;
            if (maxScroll > window.scrollY) {
                savedPosition = window.scrollY;
                let percent = ((savedPosition / maxScroll) * 100).toFixed(1);
                showToast(`Position marked at ${percent}%`);
            } else {
                showToast("Cannot mark position (page too short)");
            }
        } else if (event.ctrlKey && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            if (savedPosition !== null) {
                window.scrollTo({ top: savedPosition, behavior: "smooth" });
                showToast("Returned to marked position");
            } else {
                showToast("No position marked");
            }
        }
    }

    function createModal() {
        modal = document.createElement('div');
        modal.className = 'autoscroller-modal';
        modal.style.display = 'none';

        modal.innerHTML = `
            <div class="autoscroller-panel">
                <div class="autoscroller-header">
                    <h3 class="autoscroller-title">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M144,12H112A68.07,68.07,0,0,0,44,80v96a68.07,68.07,0,0,0,68,68h32a68.07,68.07,0,0,0,68-68V80A68.07,68.07,0,0,0,144,12Zm44,164a44.05,44.05,0,0,1-44,44H112a44.05,44.05,0,0,1-44-44V80a44.05,44.05,0,0,1,44-44h32a44.05,44.05,0,0,1,44,44ZM140,93V163l3.51-3.52a12,12,0,0,1,17,17l-24,24a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,163V93l-3.51,3.52a12,12,0,0,1-17-17l24-24a12,12,0,0,1,17,0l24,24a12,12,0,0,1-17,17Z"></path>
                        </svg>
                        Auto Scroller
                        <span class="autoscroller-status-indicator"></span>
                    </h3>
                    <button class="autoscroller-close">×</button>
                </div>

                <div class="autoscroller-controls">
                    <div class="autoscroller-row">
                        <span class="autoscroller-label">Enable</span>
                        <label class="autoscroller-toggle">
                            <input type="checkbox" class="autoscroller-enabled">
                            <span class="autoscroller-slider-toggle"></span>
                        </label>
                    </div>

                    <div class="autoscroller-row">
                        <span class="autoscroller-label">Speed</span>
                        <div class="autoscroller-slider-container">
                            <input type="range" min="1" max="20" value="${scrollSpeed}" class="autoscroller-slider autoscroller-speed">
                            <span class="autoscroller-value">${scrollSpeed}px</span>
                        </div>
                    </div>
                </div>

                <div class="autoscroller-buttons">
                    <button class="autoscroller-button autoscroller-start">Start</button>
                    <button class="autoscroller-button stop autoscroller-stop">Stop</button>
                    <button class="autoscroller-button secondary autoscroller-mark">Mark Position</button>
                    <button class="autoscroller-button secondary autoscroller-return">Return</button>
                </div>

                <div class="autoscroller-help">
                    <div class="autoscroller-help-title">Keyboard Shortcuts</div>
                    <div class="autoscroller-help-item">
                        <span>Pause/Resume</span>
                        <span class="autoscroller-help-key">Space</span>
                    </div>
                    <div class="autoscroller-help-item">
                        <span>Speed Up/Down</span>
                        <span class="autoscroller-help-key">↑ / ↓</span>
                    </div>
                    <div class="autoscroller-help-item">
                        <span>Mark Position</span>
                        <span class="autoscroller-help-key">Ctrl + M</span>
                    </div>
                    <div class="autoscroller-help-item">
                        <span>Return to Mark</span>
                        <span class="autoscroller-help-key">Ctrl + B</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setupModalEvents();
    }

    function setupModalEvents() {
        let closeBtn = modal.querySelector('.autoscroller-close');
        let enableToggle = modal.querySelector('.autoscroller-enabled');
        let speedSlider = modal.querySelector('.autoscroller-speed');
        let startBtn = modal.querySelector('.autoscroller-start');
        let stopBtn = modal.querySelector('.autoscroller-stop');
        let markBtn = modal.querySelector('.autoscroller-mark');
        let returnBtn = modal.querySelector('.autoscroller-return');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        enableToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                startScrolling();
                enableKeyListener();
                showToast("Auto-scroll enabled");
            } else {
                stopScrolling();
                disableKeyListener();
                showToast("Auto-scroll disabled");
            }
        });

        speedSlider.addEventListener('input', (e) => {
            scrollSpeed = parseInt(e.target.value);
            updateModal();
        });

        startBtn.addEventListener('click', () => {
            startScrolling();
            enableKeyListener();
            enableToggle.checked = true;
            showToast("Auto-scroll started");
        });

        stopBtn.addEventListener('click', () => {
            stopScrolling();
            disableKeyListener();
            enableToggle.checked = false;
            showToast("Auto-scroll stopped");
        });

        markBtn.addEventListener('click', () => {
            let scrollTarget = getScrollTarget();
            let maxScroll = scrollTarget - window.innerHeight;
            if (maxScroll > window.scrollY) {
                savedPosition = window.scrollY;
                let percent = ((savedPosition / maxScroll) * 100).toFixed(1);
                showToast(`Position marked at ${percent}%`);
            } else {
                showToast("Cannot mark position (page too short)");
            }
        });

        returnBtn.addEventListener('click', () => {
            if (savedPosition !== null) {
                window.scrollTo({ top: savedPosition, behavior: "smooth" });
                showToast("Returned to marked position");
            } else {
                showToast("No position marked");
            }
        });
    }

    function updateModal() {
        if (!modal) return;

        let statusIndicator = modal.querySelector('.autoscroller-status-indicator');
        let enableToggle = modal.querySelector('.autoscroller-enabled');
        let speedSlider = modal.querySelector('.autoscroller-speed');
        let speedValue = modal.querySelector('.autoscroller-value');

        if (statusIndicator) {
            statusIndicator.classList.toggle('active', isScrolling);
        }

        if (enableToggle) {
            enableToggle.checked = isScrolling;
        }

        if (speedSlider) {
            speedSlider.value = scrollSpeed;
        }

        if (speedValue) {
            speedValue.textContent = scrollSpeed + 'px';
        }
    }

    function isMobileMenu(menu) {
        return menu.classList.contains('w-56') || menu.querySelector('.space-x-2') !== null;
    }

    function addAutoScrollerToMenu(menu) {
        if (menu.querySelector('.autoscroller-option')) return;

        let isMobile = isMobileMenu(menu);
        let autoScrollerOption = document.createElement("span");

        if (isMobile) {
            autoScrollerOption.className = "px-4 py-4 text-sm rounded flex items-center space-x-2 autoscroller-option";
        } else {
            autoScrollerOption.className = "py-2 text-sm rounded flex items-center cursor-pointer active:opacity-80 autoscroller-option";
        }

        autoScrollerOption.setAttribute("role", "menuitem");
        autoScrollerOption.setAttribute("tabindex", "-1");
        autoScrollerOption.style.cursor = "pointer";

        if (isMobile) {
            autoScrollerOption.innerHTML = `
                <span class="cursor-pointer flex items-center space-x-1">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" class="w-5 h-5 hover:brightness-150" xmlns="http://www.w3.org/2000/svg">
                        <path d="M144,12H112A68.07,68.07,0,0,0,44,80v96a68.07,68.07,0,0,0,68,68h32a68.07,68.07,0,0,0,68-68V80A68.07,68.07,0,0,0,144,12Zm44,164a44.05,44.05,0,0,1-44,44H112a44.05,44.05,0,0,1-44-44V80a44.05,44.05,0,0,1,44-44h32a44.05,44.05,0,0,1,44,44ZM140,93V163l3.51-3.52a12,12,0,0,1,17,17l-24,24a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,163V93l-3.51,3.52a12,12,0,0,1-17-17l24-24a12,12,0,0,1,17,0l24,24a12,12,0,0,1-17,17Z"></path>
                    </svg>
                    <div>Auto Scroller</div>
                </span>
            `;
        } else {
            autoScrollerOption.innerHTML = `
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" class="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M144,12H112A68.07,68.07,0,0,0,44,80v96a68.07,68.07,0,0,0,68,68h32a68.07,68.07,0,0,0,68-68V80A68.07,68.07,0,0,0,144,12Zm44,164a44.05,44.05,0,0,1-44,44H112a44.05,44.05,0,0,1-44-44V80a44.05,44.05,0,0,1,44-44h32a44.05,44.05,0,0,1,44,44ZM140,93V163l3.51-3.52a12,12,0,0,1,17,17l-24,24a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,163V93l-3.51,3.52a12,12,0,0,1-17-17l24-24a12,12,0,0,1,17,0l24,24a12,12,0,0,1-17,17Z"></path>
                </svg>
                Auto Scroller
            `;
        }

        autoScrollerOption.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!modal) createModal();
            modal.style.display = 'flex';
            updateModal();

            document.body.click();
        });

        menu.appendChild(autoScrollerOption);
    }

    function observeMenus() {
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        let menus = [];

                        if (node.querySelectorAll) {
                            menus = Array.from(node.querySelectorAll('div[role="menu"]'));
                        }

                        if (node.matches && node.matches('div[role="menu"]')) {
                            menus.push(node);
                        }

                        menus.forEach((menu) => {
                            let menuText = menu.innerText || menu.textContent || '';
                            if (menuText.includes('Reader Settings') || menuText.includes('FAQ') || menuText.includes('Fullscreen') || menuText.includes('Mark as last read') || menuText.includes('Download')) {
                                setTimeout(() => addAutoScrollerToMenu(menu), 50);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function handlePageChange() {
        if (currentUrl !== location.href) {
            currentUrl = location.href;
            if (isScrolling) {
                stopScrolling();
                disableKeyListener();
            }
            savedPosition = null;
            refreshScrollTarget();
        }
    }

    function observeUrlChanges() {
        let originalPushState = history.pushState;
        let originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(handlePageChange, 100);
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(handlePageChange, 100);
        };

        window.addEventListener('popstate', () => {
            setTimeout(handlePageChange, 100);
        });

        setInterval(handlePageChange, 1000);
    }

    function init() {
        injectStyles();
        observeMenus();
        observeUrlChanges();

        let existingMenus = document.querySelectorAll('div[role="menu"]');
        existingMenus.forEach((menu) => {
            let menuText = menu.innerText || menu.textContent || '';
            if (menuText.includes('Reader Settings') || menuText.includes('FAQ') || menuText.includes('Fullscreen') || menuText.includes('Mark as last read') || menuText.includes('Download')) {
                addAutoScrollerToMenu(menu);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();