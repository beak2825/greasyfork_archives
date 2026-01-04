// ==UserScript==
// @name         Medium免费阅读 Medium Unlock
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a button to read full Medium articles via freedium.cfd
// @author       Your name
// @match        https://*.medium.com/*/*
// @match        https://medium.com/*
// @match        https://*.towardsdatascience.com/*
// @match        https://*.plainenglish.io/*
// @match        https://*.gitconnected.com/*
// @match        https://*.betterprogramming.pub/*
// @match        https://*.levelup.gitconnected.com/*
// @match        https://freedium.cfd/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519246/Medium%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%20Medium%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/519246/Medium%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%20Medium%20Unlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Handle freedium.cfd site
    if (window.location.hostname === 'freedium.cfd') {
        // Function to remove notification element and click confirm button if exists
        const handleNotification = () => {
            const notification = document.querySelector("body > div.notification-container.fixed.top-5.p-2.max-h-\\[95vh\\].overflow-y-auto.hidden > div");
            if (notification) {
                const confirmButton = notification.querySelector('button');
                if (confirmButton) {
                    confirmButton.click();
                }
                notification.remove();
            }
        };

        // Try to handle notification immediately
        handleNotification();

        // Also observe DOM changes to handle notification if it appears later
        const observer = new MutationObserver(handleNotification);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return;
    }

    // Wait for page to load completely
    function init() {
        // Skip if we're on the Medium homepage
        if (window.location.hostname === 'medium.com' &&
            (window.location.pathname === '/' || window.location.pathname === '')) {
            return;
        }
        // Create the button
        const button = document.createElement('button');
        button.innerHTML = 'Read Full Article 阅读全文 ';
        button.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 999999;
            padding: 14px 24px;
            background-color: white;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 99em;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            color: rgb(41, 41, 41);
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px;
        `;

        // Add hover effect
        button.onmouseover = function() {
            this.style.backgroundColor = 'rgb(41, 41, 41)';
            this.style.color = 'white';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = 'white';
            this.style.color = 'rgb(41, 41, 41)';
        };

        // Add click event
        button.onclick = function() {
            const currentUrl = window.location.href;
            const freediumUrl = 'https://freedium.cfd/' + currentUrl;
            window.open(freediumUrl, '_blank');
        };

        // Create Chrome extension button
        const chromeButton = document.createElement('button');
        chromeButton.innerHTML = '⚡️ Get Chrome Extension';
        chromeButton.style.cssText = `
            position: fixed;
            right: 20px;
            top: calc(50% + 70px);
            transform: translateY(-50%);
            z-index: 999999;
            padding: 14px 24px;
            background-color: white;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 99em;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            color: rgb(41, 41, 41);
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px;
        `;
        chromeButton.onclick = () => {
            window.open('https://chromewebstore.google.com/detail/hgehpcpfjpephmldhcakokjbpfpndeim', '_blank');
        };

        // Add buttons to page
        document.body.appendChild(button);
        document.body.appendChild(chromeButton);
    }

    // Add button to article list items
    function addReadFullButtons() {
        const articleItems = document.querySelectorAll('article');
        articleItems.forEach(article => {
            const actionsDiv = article.querySelector('div.x.de.kc');
            if (actionsDiv && !actionsDiv.querySelector('.read-full-zh')) {
                const button = document.createElement('button');
                button.className = 'read-full-zh';
                button.textContent = '阅读全文';
                button.style.cssText = 'margin-left: 12px; color: rgb(26, 137, 23); cursor: pointer; font-size: 14px; border: none; background: none; padding: 0;';

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const articleLink = article.querySelector('a[aria-label]');
                    if (articleLink) {
                        window.location.href = articleLink.href;
                    }
                });

                actionsDiv.appendChild(button);
            }
        });
    }

    // Observe DOM changes to handle dynamically loaded content
    const observeDOM = () => {
        const observer = new MutationObserver(() => {
            addReadFullButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Initialize the feature
    function initializeReadFullFeature() {
        addReadFullButtons();
        observeDOM();
    }

    // Run init when page is loaded
    if (document.readyState === 'complete') {
        init();
        initializeReadFullFeature();
    } else {
        window.addEventListener('load', () => {
            init();
            initializeReadFullFeature();
        });
    }

    // Also run init when URL changes (for single page applications)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
            initializeReadFullFeature();
        }
    }).observe(document, { subtree: true, childList: true });
})();


(function() {
    'use strict';

    // 只在 freedium.cfd 网站上执行
    if (window.location.hostname !== 'freedium.cfd') {
        return;
    }

    // 处理弹窗的函数
    const handleNotification = () => {
        // 处理通知弹窗
        const confirmButton = document.querySelector("body > div.notification-container.fixed.top-5.p-2.max-h-\\[95vh\\].overflow-y-auto.hidden > div > button");
        if (confirmButton) {
            confirmButton.click();
            // 获取父级的通知容器并移除
            const notification = confirmButton.closest('.notification-container');
            if (notification) {
                notification.remove();
            }
        }

        // 处理其他可能的弹窗
        const otherPopups = document.querySelectorAll('div[class*="notification"], div[class*="popup"], div[class*="modal"]');
        otherPopups.forEach(popup => {
            const closeButton = popup.querySelector('button');
            if (closeButton) {
                closeButton.click();
            }
            popup.remove();
        });
    };

    // 立即尝试处理弹窗
    handleNotification();

    // 创建观察器持续监视新的弹窗
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            handleNotification();
        });
    });

    // 开始观察 document.body 的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
