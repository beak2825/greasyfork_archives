// ==UserScript==
// @name         Confluence 编辑模式侧边目录
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在 mgtv Confluence 编辑模式下显示侧边目录，带有显示/隐藏开关
// @match        https://wiki.imgo.tv/pages/viewpage.action?pageId=*
// @match        https://wiki.imgo.tv/pages/editpage.action?pageId=*
// @author       ccx
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506731/Confluence%20%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F%E4%BE%A7%E8%BE%B9%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/506731/Confluence%20%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F%E4%BE%A7%E8%BE%B9%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tocElement = null;
    let toggleButton = null;
    let debounceTimer = null;
    let currentMode = null;

    function log(message) {
        console.log(`[Confluence TOC ${new Date().toISOString()}]: ${message}`);
    }

    function debounce(func, delay) {
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(func, delay);
        };
    }

    function createToggleButton() {
        if (toggleButton) return;
        toggleButton = document.createElement('button');
        toggleButton.textContent = 'TOC';
        toggleButton.style.cssText = `
            position: fixed;
            right: 20px;
            top: 85px;
            z-index: 10001;
            padding: 5px 10px;
            background-color: #0052CC;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        toggleButton.addEventListener('click', toggleTOC);
        document.body.appendChild(toggleButton);
    }

    function toggleTOC() {
        const isVisible = tocElement.style.display !== 'none';
        tocElement.style.display = isVisible ? 'none' : 'block';
        GM_setValue('tocVisible', !isVisible);
        updateToggleButtonState(!isVisible);
    }

    function updateToggleButtonState(isVisible) {
        if (toggleButton) {
            toggleButton.style.backgroundColor = isVisible ? '#0052CC' : '#6B778C';
        }
    }

    function smoothScroll(target) {
        const headerHeight = 60; // 估计的固定头部高度，根据实际情况调整
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // 滚动持续时间（毫秒）
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        window.requestAnimationFrame(step);
    }

    function createTOC() {
        log('Attempting to create TOC');
        let content = null;

        if (currentMode === 'edit') {
            const iframe = document.getElementById('wysiwygTextarea_ifr');
            if (iframe) {
                log('Found wysiwygTextarea_ifr iframe');
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                content = iframeDocument.body;
            }
            if (!content) {
                content = document.querySelector('.ak-editor-content-area') ||
                          document.querySelector('[data-testid="editor-wrapper"]');
            }
        } else {
            content = document.getElementById('main-content');
        }

        if (!content) {
            log('Content not found');
            return;
        }

        log('Content found');

        const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            log('No headings found');
            if (tocElement) tocElement.style.display = 'none';
            return;
        }

        if (!tocElement) {
            tocElement = document.createElement('div');
            tocElement.id = 'custom-toc';
            tocElement.style.cssText = `
                position: fixed;
                right: 20px;
                top: 100px;
                width: 250px;
                max-height: 80vh;
                overflow-y: auto;
                background-color: #f4f5f7;
                border: 1px solid #dfe1e6;
                border-radius: 3px;
                padding: 10px;
                font-size: 14px;
                z-index: 10000;
            `;
            document.body.appendChild(tocElement);

            // 根据存储的设置设置初始可见性
            const isVisible = GM_getValue('tocVisible', true);
            tocElement.style.display = isVisible ? 'block' : 'none';
            updateToggleButtonState(isVisible);
        }

        tocElement.innerHTML = ''; // Clear existing content

        const tocList = document.createElement('ul');
        tocList.style.listStyleType = 'none';
        tocList.style.padding = '0';

        headings.forEach((heading, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = heading.textContent;
            listItem.style.marginLeft = `${(parseInt(heading.tagName.slice(1)) - 1) * 10}px`;
            listItem.style.cursor = 'pointer';
            listItem.addEventListener('click', () => {
                if (currentMode === 'edit') {
                    heading.scrollIntoView({ behavior: 'smooth' });
                    const iframe = document.getElementById('wysiwygTextarea_ifr');
                    if (iframe) iframe.contentWindow.focus();
                } else {
                    smoothScroll(heading);
                }
            });
            tocList.appendChild(listItem);
        });

        tocElement.appendChild(tocList);
        log('TOC created/updated successfully');
    }

    function setupObserver() {
        const observer = new MutationObserver(debounce(() => {
            log('DOM changed, updating TOC');
            createTOC();
        }, 5000)); // 5000ms 延迟

        if (currentMode === 'edit') {
            const iframe = document.getElementById('wysiwygTextarea_ifr');
            if (iframe) {
                observer.observe(iframe.contentDocument.body, { childList: true, subtree: true });
            } else {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        } else {
            const content = document.getElementById('main-content');
            if (content) {
                observer.observe(content, { childList: true, subtree: true });
            }
        }
    }

    function init() {
        currentMode = window.location.href.includes('editpage.action') ? 'edit' : 'view';
        log(`Initializing in ${currentMode} mode`);
        createToggleButton();
        createTOC();
        setupObserver();
    }

    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            const newMode = currentUrl.includes('editpage.action') ? 'edit' : 'view';
            if (newMode !== currentMode) {
                currentMode = newMode;
                log(`Mode changed to ${currentMode}, refreshing TOC`);
                init();
            }
        }
    }

    log('Script started');
    let lastUrl = window.location.href;
    init();
    // 检查 URL 变化
    setInterval(checkUrlChange, 1000);
})();