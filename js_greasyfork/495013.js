// ==UserScript==
// @name         宇宙蛇皮棒棒糖泰国蛇油屏蔽bilibili广告
// @namespace    http://tampermonkey.net/bilibili
// @version      0.1.0
// @description  疯狂屏蔽屏蔽
// @author       DannyD
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495013/%E5%AE%87%E5%AE%99%E8%9B%87%E7%9A%AE%E6%A3%92%E6%A3%92%E7%B3%96%E6%B3%B0%E5%9B%BD%E8%9B%87%E6%B2%B9%E5%B1%8F%E8%94%BDbilibili%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/495013/%E5%AE%87%E5%AE%99%E8%9B%87%E7%9A%AE%E6%A3%92%E6%A3%92%E7%B3%96%E6%B3%B0%E5%9B%BD%E8%9B%87%E6%B2%B9%E5%B1%8F%E8%94%BDbilibili%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a class name matches the criteria
    function matchesCriteria(className) {
        const hasLetterAndNumber = /[a-zA-Z]/.test(className) && /\d/.test(className);
        const hasNoDash = !className.includes('-');
        return hasLetterAndNumber && hasNoDash;
    }

    // Select all div elements
    const divs = document.querySelectorAll('div');

   // Select all div elements under elements with class 'carousel-container'
    const containers = document.querySelectorAll('.carousel-container');
    containers.forEach(container => {
        const divs = container.querySelectorAll('div');
        // Iterate over each div element
        divs.forEach(div => {
            const classList = div.classList;
            classList.forEach(className => {
                if (matchesCriteria(className)) {
                    div.style.display = 'none'; // Hide the div
                }
            });
        });
    });
    //移除before和after伪元素
    function removePseudoElements() {
        let elements = document.querySelectorAll('.carousel-container div');
        elements.forEach(el => {
            let beforeStyle = window.getComputedStyle(el, '::before');
            let afterStyle = window.getComputedStyle(el, '::after');
            if (beforeStyle) {
                el.style.setProperty('--before-display', 'none');
            }
            if (afterStyle) {
                el.style.setProperty('--after-display', 'none');
            }
            el.classList.add('remove-pseudo-elements');
        });
    }

    // Add CSS to hide ::before and ::after elements
    const style = document.createElement('style');
    style.textContent = `
        .remove-pseudo-elements::before,
        .remove-pseudo-elements::after {
            content: none !important;
        }
    `;
    document.head.append(style);

    // Initial call to remove pseudo elements
    removePseudoElements();

    // Observe changes in the DOM and reapply the removal
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                removePseudoElements();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    //严肃处理跟踪参数
// List of query parameters to be removed
     // List of query parameters to be removed
    const paramsToRemove = ['spm_id_from'];

    // Function to remove specified query parameters
    function removeQueryParams(url) {
        let urlObj = new URL(url);
        let params = urlObj.searchParams;

        paramsToRemove.forEach(param => {
            if (params.has(param)) {
                params.delete(param);
            }
        });

        return urlObj.toString();
    }

    // Check if URL contains any of the specified query parameters
    function hasQueryParams(url) {
        let urlObj = new URL(url);
        let params = urlObj.searchParams;

        return paramsToRemove.some(param => params.has(param));
    }

    // If current URL has specified query parameters, remove them
    if (hasQueryParams(window.location.href)) {
        let newUrl = removeQueryParams(window.location.href);
        if (newUrl !== window.location.href) {
            window.history.replaceState(null, '', newUrl);
        }
    }

    // Listen for pushState and replaceState to handle AJAX navigation
    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        if (hasQueryParams(window.location.href)) {
            let newUrl = removeQueryParams(window.location.href);
            if (newUrl !== window.location.href) {
                window.history.replaceState(null, '', newUrl);
            }
        }
    };

    const replaceState = history.replaceState;
    history.replaceState = function() {
        replaceState.apply(history, arguments);
        if (hasQueryParams(window.location.href)) {
            let newUrl = removeQueryParams(window.location.href);
            if (newUrl !== window.location.href) {
                window.history.replaceState(null, '', newUrl);
            }
        }
    };
})();