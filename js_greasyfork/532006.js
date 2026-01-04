// ==UserScript==
// @name         推特优化
// @namespace    http://tampermonkey.net/
// @version      2.26
// @description  隐藏页面上的元素
// @author       AI
// @match        https://x.com/*
// @downloadURL https://update.greasyfork.org/scripts/532006/%E6%8E%A8%E7%89%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532006/%E6%8E%A8%E7%89%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_KEY = 'x_post_filter_hidden';

    // 隐藏页面元素
    function hideElements() {
        const isHomeOrSearch = location.pathname === '/home' || location.pathname === '/search';
        const isStatusPage = /^\/[^\/]+\/status\/\d+$/.test(location.pathname);
        const isGrokPage = location.pathname === '/i/grok';
        if (!isHomeOrSearch && !isStatusPage && !isGrokPage) return;

        const elements = document.querySelectorAll('div[data-testid="cellInnerDiv"]');
        let anyHidden = false;
        let hideNext = false;

        elements.forEach((element) => {
            let shouldHide = false;

            if (isHomeOrSearch) {
                if (element.innerText.includes("Show more replies")) {
                    shouldHide = true;
                }

                const tweet9 = element.querySelector('div > div > article[data-testid="tweet"] > div > div > div > div > div > div');
                if (tweet9 && tweet9.classList.length === 9) {
                    shouldHide = true;
                }

                let avatar = element.querySelector('div[data-testid="Tweet-User-Avatar"]');
                if (avatar) {
                    const sibling = avatar.nextElementSibling;
                    if (sibling && sibling.style.display !== 'none') {
                        sibling.style.display = 'none';
                        anyHidden = true;
                    }
                }

                const replyTexts = element.querySelectorAll('div[dir="ltr"][style*="color: rgb(83, 100, 113)"]');
                for (const rt of replyTexts) {
                    if (rt.innerText.includes("Replying to") && rt.querySelector('a')) {
                        shouldHide = true;
                        break;
                    }
                }

                const liveCard = element.querySelector('div[data-testid="wrapperView"]');
                if (liveCard) {
                    shouldHide = true;
                }
            }

            const firstChildDiv = element.querySelector('div');
            if (firstChildDiv) {
                const nestedDiv = firstChildDiv.querySelector('div');
                if (nestedDiv && nestedDiv.children.length === 0 && nestedDiv.innerText.trim() === '' && nestedDiv.childNodes.length === 0) {
                    shouldHide = true;
                }
            }

            if (isStatusPage) {
                const discoverMore = element.querySelector('span');
                if (discoverMore && discoverMore.innerText === 'Discover more') {
                    hideNext = true;
                } else if (hideNext) {
                    shouldHide = true;
                }
            }

            if (shouldHide) {
                element.style.display = 'none';
                anyHidden = true;
            }
        });

        if (anyHidden) {
            localStorage.setItem(CACHE_KEY, 'true');
        }
    }

    // 初始运行
    function initialHide() {
        hideElements();
    }

    // MutationObserver 监控
    const observer = new MutationObserver(() => {
        const isHomeOrSearch = location.pathname === '/home' || location.pathname === '/search';
        const isStatusPage = /^\/[^\/]+\/status\/\d+$/.test(location.pathname);
        if (isHomeOrSearch || isStatusPage) {
            hideElements();
        }
    });

    const mainContent = document.querySelector('main') || document.body;
    observer.observe(mainContent, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // 清理
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})();