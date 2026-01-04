// ==UserScript==
// @name         X/Twitter タブフリック移動 (フォロー中スキップ)
// @name:ja      X/Twitter タブフリック移動 (フォロー中スキップ)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  X (Twitter) のタイムラインタブをフリックで移動。「フォロー中」タブをスキップします。
// @description:ja X (Twitter) のタイムラインタブをフリックで移動。「フォロー中」タブをスキップします。
// @description:en Allows you to switch between X (Twitter) timeline tabs by flicking, skipping the "Following" tab.
// @author       K-shir0
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539604/XTwitter%20%E3%82%BF%E3%83%96%E3%83%95%E3%83%AA%E3%83%83%E3%82%AF%E7%A7%BB%E5%8B%95%20%28%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E4%B8%AD%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539604/XTwitter%20%E3%82%BF%E3%83%96%E3%83%95%E3%83%AA%E3%83%83%E3%82%AF%E7%A7%BB%E5%8B%95%20%28%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E4%B8%AD%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // スキップしたいタブのテキスト
    const TAB_TO_SKIP = 'フォロー中';
    // スワイプ操作を検知する領域のセレクタ
    const TAB_LIST_SELECTOR = '[role="tablist"]';
    // スワイプを検知する最小距離 (ピクセル)
    const MIN_SWIPE_DISTANCE = 30;

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    function findTabs() {
        const tabList = document.querySelector(TAB_LIST_SELECTOR);
        if (!tabList) return { tabs: [], activeIndex: -1 };

        const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
        const activeIndex = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');

        return { tabs, activeIndex };
    }

    function switchTab(direction) {
        const { tabs, activeIndex } = findTabs();
        if (activeIndex === -1 || tabs.length === 0) return;

        let nextIndex = activeIndex;

        if (direction === 'right') { // 右フリック（左へ移動）
            nextIndex++;
            // 次のタブが「フォロー中」なら、さらに次のタブへ
            if (tabs[nextIndex] && tabs[nextIndex].textContent === TAB_TO_SKIP) {
                nextIndex++;
            }
        } else { // 左フリック（右へ移動）
            nextIndex--;
            // 前のタブが「フォロー中」なら、さらに前のタブへ
            if (tabs[nextIndex] && tabs[nextIndex].textContent === TAB_TO_SKIP) {
                nextIndex--;
            }
        }

        if (nextIndex >= 0 && nextIndex < tabs.length) {
            tabs[nextIndex].click();
        }
    }

    function handleSwipeStart(e) {
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        isSwiping = true;
    }

    function handleSwipeEnd(e) {
        if (!isSwiping) return;
        isSwiping = false;

        const touch = e.type === 'touchend' ? e.changedTouches[0] : e;
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;

        // 左右のスワイプを優先するため、垂直方向の移動が大きい場合は無視
        if (Math.abs(diffX) < Math.abs(diffY)) {
            return;
        }

        if (Math.abs(diffX) > MIN_SWIPE_DISTANCE) {
            if (diffX > 0) {
                // 右へのスワイプ -> 左のタブへ
                switchTab('left');
            } else {
                // 左へのスワイプ -> 右のタブへ
                switchTab('right');
            }
        }
    }

    // イベントリスナーをセットアップする関数
    function setupSwipeListeners() {
        if (window.flickTabListenerAdded) return;

        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.addEventListener('touchstart', handleSwipeStart, { passive: true });
            mainContent.addEventListener('touchend', handleSwipeEnd, { passive: true });
            mainContent.addEventListener('mousedown', handleSwipeStart, { passive: true });
            mainContent.addEventListener('mouseup', handleSwipeEnd, { passive: true });

            window.flickTabListenerAdded = true;
            console.log('X/Twitter Tab Flipper (Skip Following) is active.');
        }
    }

    // ページ遷移やコンテンツの動的読み込みに対応するため、MutationObserver を使用
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector(TAB_LIST_SELECTOR) && !window.flickTabListenerAdded) {
            setupSwipeListeners();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初期読み込み時にも実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSwipeListeners);
    } else {
        setupSwipeListeners();
    }
})();