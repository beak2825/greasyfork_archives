// ==UserScript==
// @name         Скрыть рекомендации в ленте ВКонтакте
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрывает рекомендуемые посты в ленте ВКонтакте с кнопкой "Подписаться"
// @author       byNickSan
// @match        https://vk.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534986/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D1%80%D0%B5%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D0%B4%D0%B0%D1%86%D0%B8%D0%B8%20%D0%B2%20%D0%BB%D0%B5%D0%BD%D1%82%D0%B5%20%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/534986/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D1%80%D0%B5%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D0%B4%D0%B0%D1%86%D0%B8%D0%B8%20%D0%B2%20%D0%BB%D0%B5%D0%BD%D1%82%D0%B5%20%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideRecommendedPosts() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/feed?section=recommended')) {
            return; // Не скрывать посты на этой странице
        }

        if (window.location.pathname !== '/feed') return;

        const xpath = "//div[contains(@class, 'feed_row')]//button[.//span[contains(text(), 'Подписаться')]]";
        const buttons = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < buttons.snapshotLength; i++) {
            const button = buttons.snapshotItem(i);
            const feedRow = button.closest('.feed_row');
            if (feedRow) {
                feedRow.style.display = 'none';
            }
        }
    }

    const observer = new MutationObserver(() => {
        requestAnimationFrame(hideRecommendedPosts);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const urlObserver = new MutationObserver(() => {
        if (window.location.pathname === '/feed' && !window.location.href.includes('/feed?section=recommended')) {
            requestAnimationFrame(hideRecommendedPosts);
        }
    });

    const baseElement = document.querySelector('base');
    if (baseElement) {
        urlObserver.observe(baseElement, { attributes: true });
    }

    let timeout;
    window.addEventListener('scroll', () => {
        if (window.location.pathname !== '/feed' || window.location.href.includes('/feed?section=recommended')) return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            requestAnimationFrame(hideRecommendedPosts);
        }, 200);
    });

    window.addEventListener('load', () => {
        requestAnimationFrame(hideRecommendedPosts);
    });

    requestAnimationFrame(hideRecommendedPosts);
})();