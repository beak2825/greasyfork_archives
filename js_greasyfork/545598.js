// ==UserScript==
// @name         X(Twitter) ユーザーページ「認証する」削除（軽量iPhone版／MutationObserverなし）
// @namespace    http://tampermonkey.net/
// @version      0.8テスト版
// @description  ユーザーページの「認証する」などを非表示（iPhone向け軽量版／MutationObserver削除）
// @author       kmikrt
// @license      MIT
// @match        *://twitter.com/*
// @match        *://mobile.twitter.com/*
// @match        *://x.com/*
// @match        *://mobile.x.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545598/X%28Twitter%29%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%9A%E3%83%BC%E3%82%B8%E3%80%8C%E8%AA%8D%E8%A8%BC%E3%81%99%E3%82%8B%E3%80%8D%E5%89%8A%E9%99%A4%EF%BC%88%E8%BB%BD%E9%87%8FiPhone%E7%89%88%EF%BC%8FMutationObserver%E3%81%AA%E3%81%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545598/X%28Twitter%29%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%9A%E3%83%BC%E3%82%B8%E3%80%8C%E8%AA%8D%E8%A8%BC%E3%81%99%E3%82%8B%E3%80%8D%E5%89%8A%E9%99%A4%EF%BC%88%E8%BB%BD%E9%87%8FiPhone%E7%89%88%EF%BC%8FMutationObserver%E3%81%AA%E3%81%97%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 早期非表示用スタイル
    const earlyHideStyle = document.createElement('style');
    earlyHideStyle.textContent = [
        'a[href="/i/premium_sign_up"]',
        'div.css-175oi2r.r-1q9bdsx.r-1udh08x.r-18u37iz.r-1h0z5md'
    ].join(',') + '{display:none !important;}';
    document.documentElement.appendChild(earlyHideStyle);

    const removeVerifyAndExtra = () => {
        document.querySelectorAll(
            'a[href="/i/premium_sign_up"], div.css-175oi2r.r-1q9bdsx.r-1udh08x.r-18u37iz.r-1h0z5md'
        ).forEach(el => el.style.display = 'none');
    };

    const isUserPage = () => {
        const path = location.pathname;
        const specialPaths = ['i', 'home', 'explore', 'notifications', 'messages', 'settings', 'search'];
        return path && !specialPaths.includes(path.split('/')[1] || '');
    };

    const runCleanup = () => {
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

    // 初回実行
    runCleanup();
    startRapidHide();

})();
