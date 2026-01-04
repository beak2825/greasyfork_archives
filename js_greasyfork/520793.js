// ==UserScript==
// @name        Gemini force 2.0 Flash
// @namespace   Violentmonkey Scripts
// @description Auto change 1.5 to 2.0 (Google may change it later)
// @match       *://gemini.google.com/*
// @grant       none
// @version     1.2
// @license MIT
// @author      Artin
// @description 12/15/2024, 9:35:58 PM
// @downloadURL https://update.greasyfork.org/scripts/520793/Gemini%20force%2020%20Flash.user.js
// @updateURL https://update.greasyfork.org/scripts/520793/Gemini%20force%2020%20Flash.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndClick() {
        const spanElement = document.querySelector("#app-root > main > div > bard-mode-switcher > button > span.mdc-button__label > div.current-mode-title.ng-star-inserted > span");
        if (spanElement && spanElement.textContent.trim() === '1.5 Flash') {
            const firstButton = document.querySelector('#app-root > main > div > bard-mode-switcher > button');
            if (firstButton) {
                firstButton.click();
                setTimeout(() => {
                    const thirdButton = document.querySelector('#mat-menu-panel-0 > div > button:nth-child(3)');
                    if (thirdButton) {
                        thirdButton.click();
                        setTimeout(() => {
                            const temp = document.createElement('div');
                            temp.tabIndex = -1;
                            document.body.appendChild(temp);
                            temp.focus();
                            document.body.removeChild(temp);
                        }, 200);
                    }
                }, 200);
            }
        }
    }

    // 檢查 URL 是否符合條件
    function shouldExecute() {
        return window.location.pathname === '/app';
    }

    // 設置觀察者和 URL 變化監聽
    function setupObserver() {
        let hasExecuted = false;
        const targetNode = document.querySelector('#app-root');

        if (targetNode) {
            const observer = new MutationObserver(() => {
                if (!hasExecuted && shouldExecute()) {
                    hasExecuted = true;
                    checkAndClick();
                    observer.disconnect();
                }
            });

            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    // 監聽 URL 變化
    function initUrlChangeListener() {
        let lastPath = window.location.pathname;

        // 監聽 pushState 和 replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            if (lastPath.startsWith('/app/') && window.location.pathname === '/app') {
                setupObserver();
            }
            lastPath = window.location.pathname;
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            if (lastPath.startsWith('/app/') && window.location.pathname === '/app') {
                setupObserver();
            }
            lastPath = window.location.pathname;
        };

        // 監聽瀏覽器的前進/後退
        window.addEventListener('popstate', () => {
            if (lastPath.startsWith('/app/') && window.location.pathname === '/app') {
                setupObserver();
            }
            lastPath = window.location.pathname;
        });
    }

    // 當頁面載入完成時開始執行
    window.addEventListener('load', () => {
        if (shouldExecute()) {
            setupObserver();
        }
        initUrlChangeListener();
    });
})();