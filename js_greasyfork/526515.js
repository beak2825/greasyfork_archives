// ==UserScript==
// @name           YouTube Recommended Video Filtering
// @name:ja        YouTubeおすすめ動画フィルタリング
// @namespace      http://tampermonkey.net/
// @version        0.5-smart(テスト)
// @description    Delete specific videos based on view count or audience size.
// @description:ja 視聴回数や視聴人数に基づいて特定の動画を削除します
// @author         kmikrt
// @license        MIT
// @match          *://www.youtube.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/526515/YouTube%20Recommended%20Video%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/526515/YouTube%20Recommended%20Video%20Filtering.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lineBreakAdded = false;

    const isWatchPage = () =>
        location.href.includes('watch') || location.href.includes('/live/');

    // 数値パース処理（"1.2万" → 12000 など）
    const parseJapaneseNumber = (str) => {
        let num = parseFloat(str.replace(/[^\d.]/g, ''));
        if (str.includes('万')) num *= 10000;
        if (str.includes('億')) num *= 100000000;
        if (str.includes('兆')) num *= 1000000000000;
        return num;
    };

    function removeVideos() {
        const videos = document.querySelectorAll('ytd-compact-video-renderer, yt-lockup-view-model');

        videos.forEach((v) => {
            const text = v.textContent || '';
            let remove = false;

            // ライブなのに視聴人数が無い
            if ((text.includes('ライブ') || text.includes('Live')) &&
                !text.match(/[\d,.]+人が視聴中/)) {
                remove = true;
            }

            // ライブ視聴人数
            const live = text.match(/([\d,.]+)\s*人が視聴中/);
            if (live && parseFloat(live[1].replace(/,/g, '')) <= 1000) {
                remove = true;
            }

            // 通常の視聴回数
            const view = text.match(/([\d,.万億兆]+)\s*回視聴/);
            if (view && parseJapaneseNumber(view[1]) <= 7000) {
                remove = true;
            }

            if (remove) v.remove();
        });
    }

    function removeLoadingSpinner() {
        document.querySelectorAll('tp-yt-paper-spinner#spinner')
            .forEach((s) => setTimeout(() => s.remove(), 2000));
    }

    function addLineBreaksAfterComments() {
        if (lineBreakAdded) return;

        const comments = document.querySelector('ytd-comments');
        if (comments) {
            for (let i = 0; i < 3; i++) comments.after(document.createElement('br'));
            lineBreakAdded = true;
        }
    }

    // 1つにまとめて呼ぶ
    function executeAll() {
        if (!isWatchPage()) return;
        removeVideos();
        removeLoadingSpinner();
        addLineBreaksAfterComments();
    }

    function observeURLChanges() {
        // DOM の変化を監視
        new MutationObserver(executeAll)
            .observe(document.body, { childList: true, subtree: true });

        const wrapHistory = (method) =>
            function () {
                const ret = method.apply(this, arguments);
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            };

        history.pushState = wrapHistory(history.pushState);
        history.replaceState = wrapHistory(history.replaceState);

        // イベントをまとめて登録
        [
            'popstate',
            'locationchange',
            'yt-navigate-finish',
            'yt-page-data-updated',
            'DOMContentLoaded'
        ].forEach((ev) => window.addEventListener(ev, executeAll));

        executeAll();
    }

    observeURLChanges();
})();
