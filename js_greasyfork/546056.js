// ==UserScript==
// @name           YouTube ホームフィード動画フィルタ
// @namespace      http://tampermonkey.net/
// @version        1.3.0
// @description    ホームフィード動画フィルタリング
// @match          *://www.youtube.com/*
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/546056/YouTube%20%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%95%E3%82%A3%E3%83%BC%E3%83%89%E5%8B%95%E7%94%BB%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/546056/YouTube%20%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%95%E3%82%A3%E3%83%BC%E3%83%89%E5%8B%95%E7%94%BB%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /********************
     * 共通ユーティリティ
     ********************/
    const isHomePage = () =>
        location.hostname === "www.youtube.com" &&
        (location.pathname === "/" || location.pathname === "");

    const getVideoIdFromItem = item => {
        const a = item.querySelector('a[href^="/watch"]');
        if (!a) return '';
        const href = a.getAttribute('href') || '';
        const q = href.split('?')[1] || '';
        return new URLSearchParams(q).get('v') || href;
    };

    const parseJapaneseCount = str => {
        const m = str.match(/([\d.,]+)\s*(万|億|兆)?/);
        if (!m) return 0;
        let num = parseFloat(m[1].replace(/,/g, '')) || 0;
        const unit = m[2] || '';
        if (unit === '万') num *= 1e4;
        else if (unit === '億') num *= 1e8;
        else if (unit === '兆') num *= 1e12;
        return num;
    };

    const shouldHideByText = text => {
        if (!text) return false;

        const liveMatch = text.match(/([\d.,]+)\s*(万)?\s*人が視聴中/);
        if (liveMatch) {
            let viewers = parseFloat(liveMatch[1].replace(/,/g, '')) || 0;
            if (liveMatch[2]) viewers *= 1e4;
            return viewers < 1000;
        } else if (text.includes('ライブ') || text.includes('Live')) {
            return true;
        }

        const viewMatch = text.match(/([\d.,万億兆]+)\s*回視聴/);
        if (viewMatch) {
            const views = parseJapaneseCount(viewMatch[1]);
            return views < 10000;
        }
        return false;
    };


    /********************
     * ホーム動画フィルタ
     ********************/
    let homeObserver = null;
    let rafPending = false;

    const filterHomePageVideos = (root = document) => {
        if (!isHomePage()) return;

        const items = root.querySelectorAll('ytd-rich-item-renderer');

        items.forEach(item => {
            const vid = getVideoIdFromItem(item);
            if (item.dataset.homeCleanedFor === vid) return;

            const hide = shouldHideByText(item.textContent || '');
            item.style.display = hide ? 'none' : '';

            item.dataset.homeCleaned = 'true';
            item.dataset.homeCleanedFor = vid;
        });
    };

    const observeHomePage = () => {
        if (!isHomePage()) {
            homeObserver?.disconnect();
            homeObserver = null;
            return;
        }

        const feed = document.querySelector('ytd-rich-grid-renderer');
        if (!feed) return;

        homeObserver?.disconnect();

        homeObserver = new MutationObserver(() => {
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    filterHomePageVideos(feed);
                    rafPending = false;
                });
            }
        });

        homeObserver.observe(feed, { childList: true, subtree: true });
        filterHomePageVideos(feed);
    };


    /********************
     * 共通呼び出し関数
     ********************/
    const runObserve = () => observeHomePage();


    /********************
     * 初期遅延対策
     ********************/
    let earlyInterval = setInterval(runObserve, 200);
    setTimeout(() => clearInterval(earlyInterval), 5000);


    /********************
     * SPA イベント対応 ★追加
     ********************/
    // SPA ナビゲーション開始 → 旧要素の data-home-cleaned を削除してクリーン状態に
    const resetCleanFlags = () => {
        document
            .querySelectorAll('ytd-rich-item-renderer[data-home-cleaned]')
            .forEach(el => {
                delete el.dataset.homeCleaned;
                delete el.dataset.homeCleanedFor;
            });
    };

    window.addEventListener("yt-navigate-start", () => {
        resetCleanFlags();        // ★追加
    });

    window.addEventListener("yt-navigate-finish", () => {
        runObserve();             // ★追加
    });


    /********************
     * ページ復帰対策
     ********************/
    window.addEventListener("focus", runObserve);
    window.addEventListener("load", runObserve);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) runObserve();
    });
    document.addEventListener("DOMContentLoaded", runObserve);


    /********************
     * YouTube SPA / URL監視
     ********************/
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            requestAnimationFrame(runObserve);
        }
    }, 100);


    // 初回実行
    runObserve();

})();
