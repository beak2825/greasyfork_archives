// ==UserScript==
// @name         X(Twitter) ユーザーページ「認証する」削除 + home右側削除
// @namespace    http://tampermonkey.net/
// @version      0.8 決定版
// @description  kmikrt 個人用UI調整スクリプト
// @author       kmikrt 
// @license      MIT
// @match        *://twitter.com/*
// @match        *://mobile.twitter.com/*
// @match        *://x.com/*
// @match        *://mobile.x.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534138/X%28Twitter%29%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%9A%E3%83%BC%E3%82%B8%E3%80%8C%E8%AA%8D%E8%A8%BC%E3%81%99%E3%82%8B%E3%80%8D%E5%89%8A%E9%99%A4%20%2B%20home%E5%8F%B3%E5%81%B4%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/534138/X%28Twitter%29%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%9A%E3%83%BC%E3%82%B8%E3%80%8C%E8%AA%8D%E8%A8%BC%E3%81%99%E3%82%8B%E3%80%8D%E5%89%8A%E9%99%A4%20%2B%20home%E5%8F%B3%E5%81%B4%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const rightSideSelectors = [
        // 元の長いセレクタ一覧
        '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1jocfgc > div > div.css-175oi2r.r-1jocfgc.r-gtdqiz > div > div > div > div.css-175oi2r.r-1awozwy.r-aqfbo4.r-14lw9ot.r-18u37iz.r-1h3ijdo.r-6gpygo.r-15ysp7h.r-1xcajam.r-ipm5af.r-136ojw6.r-1jocfgc',
        '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1jocfgc > div > div.css-175oi2r.r-1jocfgc.r-gtdqiz > div > div > div > div:nth-child(2)',
        '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1jocfgc > div > div.css-175oi2r.r-1jocfgc.r-gtdqiz > div > div > div > div:nth-child(3)',
        '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1jocfgc > div > div.css-175oi2r.r-jxzhtn.r-1867qdf.r-1phboty.r-1ifxtd0.r-1udh08x.r-1niwhzg.r-1yadl64',
        '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1jocfgc > div > div.css-175oi2r.r-1jocfgc.r-1xcajam > div > div > div > div > div:nth-child(4)',
        '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1jocfgc > div > div.css-175oi2r.r-1jocfgc.r-1xcajam > div > div > div > div > div.css-175oi2r.r-jxzhtn.r-1867qdf.r-1phboty.r-1ifxtd0.r-1udh08x.r-1niwhzg.r-1yadl64',
        '#react-root > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz:last-child > main.css-175oi2r.r-16y2uox.r-1wbh5a2.r-1habvwh:last-child > div.css-175oi2r.r-150rngu.r-16y2uox.r-1wbh5a2.r-rthrr5 > div.css-175oi2r.r-aqfbo4.r-16y2uox > div.css-175oi2r.r-1oszu61.r-1niwhzg.r-18u37iz.r-16y2uox.r-2llsf.r-13qz1uu.r-1wtj0ep > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1hycxz:last-child > div.css-175oi2r.r-1pi2tsx > div.css-175oi2r.r-1hycxz.r-1xcajam:last-child > div.css-175oi2r.r-1adg3ll > div.css-175oi2r > div.css-175oi2r > div.css-175oi2r.r-vacyoi.r-ttdzmv > div.css-175oi2r.r-14lw9ot.r-jxzhtn.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x:nth-child(5)',
        '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-1hycxz > div > div.css-175oi2r.r-1hycxz.r-1xcajam > div > div > div > div > div.css-175oi2r.r-jxzhtn.r-1867qdf.r-1phboty.r-1ifxtd0.r-1udh08x.r-1niwhzg.r-1yadl64',
        '#react-root > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz:last-child > main.css-175oi2r.r-16y2uox.r-1wbh5a2.r-1habvwh:last-child > div.css-175oi2r.r-150rngu.r-16y2uox.r-1wbh5a2.r-rthrr5 > div.css-175oi2r.r-aqfbo4.r-16y2uox > div.css-175oi2r.r-1oszu61.r-1niwhzg.r-18u37iz.r-16y2uox.r-2llsf.r-13qz1uu.r-1wtj0ep > div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1hycxz:last-child > div.css-175oi2r.r-1pi2tsx > div.css-175oi2r.r-1hycxz.r-1xcajam:last-child > div.css-175oi2r.r-1adg3ll > div.css-175oi2r > div.css-175oi2r > div.css-175oi2r.r-vacyoi.r-ttdzmv > div.css-175oi2r.r-14lw9ot.r-jxzhtn.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x:nth-child(4)'
    ];

    // 早期非表示用スタイル
    const earlyHideStyle = document.createElement('style');
    earlyHideStyle.textContent = [
        'div.css-175oi2r.r-1q9bdsx.r-1udh08x.r-18u37iz.r-1h0z5md',
        ...rightSideSelectors
    ].join(',') + '{display:none !important;}';
    document.documentElement.appendChild(earlyHideStyle);

    const hideElements = (selectors) => {
        selectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.style.display = 'none';
        });
    };

    const removeRightSideElements = () => {
        hideElements(rightSideSelectors);
        document.querySelectorAll('[data-testid="super-upsell-UpsellCardRenderProperties"], aside[aria-label="おすすめユーザー"]').forEach(el => el.closest('div.css-175oi2r')?.style && (el.closest('div.css-175oi2r').style.display = 'none'));
        document.querySelectorAll('section[aria-labelledby]').forEach(section => {
            const heading = section.querySelector('h1,h2');
            if (heading?.textContent.trim() === '速報') section.closest('div.css-175oi2r').style.display = 'none';
        });
        document.querySelectorAll('nav[aria-label="フッター"]').forEach(nav => nav.closest('div.css-175oi2r').style.display = 'none');
    };

    const removeVerifyAndExtra = () => {
        document.querySelectorAll('a[href="/i/premium_sign_up"], div.css-175oi2r.r-1q9bdsx.r-1udh08x.r-18u37iz.r-1h0z5md')
            .forEach(el => el.style.display = 'none');
    };

    const isUserPage = () => {
        const path = location.pathname;
        const specialPaths = ['i', 'home', 'explore', 'notifications', 'messages', 'settings', 'search'];
        return path && !specialPaths.includes(path.split('/')[1] || '');
    };

    const runCleanup = () => {
        removeRightSideElements();
        if (isUserPage()) removeVerifyAndExtra();
    };

    // rapidHideLoop（2秒間高速ループ）
    let rapidHideTimer = null;
    const startRapidHide = () => {
        const start = performance.now();
        const loop = () => {
            runCleanup();
            if (performance.now() - start < 2000) {
                rapidHideTimer = requestAnimationFrame(loop);
            }
        };
        if (rapidHideTimer) cancelAnimationFrame(rapidHideTimer);
        loop();
    };

    // URL変化検出を history API フック化
    const onUrlChange = () => {
        startRapidHide();
        runCleanup();
    };
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        onUrlChange();
    };
    window.addEventListener('popstate', onUrlChange);

    // MutationObserver の監視範囲を #react-root に限定
    const targetNode = document.querySelector('#react-root') || document.body;
    const observer = new MutationObserver(runCleanup);
    observer.observe(targetNode, { childList: true, subtree: true });

    // 初回実行
    runCleanup();
    startRapidHide();

})();
