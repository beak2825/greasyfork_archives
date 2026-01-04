// ==UserScript==
// @name         履约-日志按钮功能替换
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  日志按钮功能替换,支持xingyun和jagile-
// @license MIT
// @author       wxq
// @include        http://xingyun.jd.com/jdosCD/*
// @include        http://jagile.jd.com/jdosCD/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519956/%E5%B1%A5%E7%BA%A6-%E6%97%A5%E5%BF%97%E6%8C%89%E9%92%AE%E5%8A%9F%E8%83%BD%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/519956/%E5%B1%A5%E7%BA%A6-%E6%97%A5%E5%BF%97%E6%8C%89%E9%92%AE%E5%8A%9F%E8%83%BD%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        [id^="jdosCD_"] > div > div > div.jdos-page-shell__content > div.instanceLayout.jdos-page-shell__content-wrapper > div.jdos-instance-main > div.jdos-instance-main-container > div > div.jdos-pod-list > div:nth-child(3) > div > div.comp-offcanvas__main > div {
            display: none !important;
        }
    `);

    function replaceButtonClickMethod(button) {
        if (button.dataset.replaced) return;

        button.onclick = async function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                const row = this.closest('tr');
                if (!row) {
                    throw new Error('未找到按钮所在的行');
                }

                const ipCell = row.querySelector('td:nth-child(2)');
                let ipAddress = ipCell ? ipCell.textContent.trim() : null;
                if (!ipAddress) {
                    throw new Error('未找到IP地址');
                }

                const ipMatch = ipAddress.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
                if (ipMatch) {
                    ipAddress = ipMatch[0];
                } else {
                    throw new Error('未能提取到有效的IP地址');
                }

                const currentURL = window.location.href;

                let appName;
                if (currentURL.includes('jagile.jd.com')) {
                    const match = currentURL.match(/\/jdosCD\/ls\/instance\/([^\/]+)/);
                    if (match && match[1]) {
                        appName = match[1];
                    } else {
                        throw new Error('未能从jagile URL中提取appName');
                    }
                } else {
                    const match = currentURL.match(/\/([^\/]+)\/[^\/]+\/status/);
                    if (match && match[1]) {
                        appName = match[1];
                    } else {
                        throw new Error('未能从xingyun URL中提取appName');
                    }
                }

                const newURL = `https://taishan.jd.com/logbook/query/grep?appName=${appName}&platform=jdos&ip=${encodeURIComponent(ipAddress)}&keyword=xcep`;

                window.open(newURL, '_blank');
            } catch (error) {
                alert(`操作失败: ${error.message}`);
            }
        };

        button.dataset.replaced = 'true';
    }

    function replaceAllButtons() {
        const buttons = document.querySelectorAll('button:not([data-replaced])');
        buttons.forEach(button => {
            if (button.textContent.includes('日志') || button.title.includes('日志')) {
                replaceButtonClickMethod(button);
            }
        });
        return buttons.length > 0;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedReplaceAllButtons = debounce(replaceAllButtons, 250);

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                debouncedReplaceAllButtons();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(debouncedReplaceAllButtons, 1000);

    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            debouncedReplaceAllButtons();
        }
    }, true);

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            debouncedReplaceAllButtons();
        });
        originalXHROpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
            debouncedReplaceAllButtons();
            return response;
        });
    };

    const customEvents = ['pageUpdated', 'contentLoaded', 'dataReceived'];
    customEvents.forEach(eventName => {
        document.addEventListener(eventName, debouncedReplaceAllButtons);
    });

    function handleUrlChange() {
        debouncedReplaceAllButtons();
    }

    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handleUrlChange();
    };

    window.addEventListener('popstate', handleUrlChange);

    debouncedReplaceAllButtons();

})();