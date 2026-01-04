// ==UserScript==
// @name         TVer 自動で「詳細を見る」をクリック（SPA対応）
// @namespace    https://tver.jp/
// @version      1.2
// @description  TVerの動画ページで「詳細を見る」ボタンを自動でクリック（タブ内遷移にも対応）
// @author       ChatGPT
// @match        https://tver.jp/episodes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533218/TVer%20%E8%87%AA%E5%8B%95%E3%81%A7%E3%80%8C%E8%A9%B3%E7%B4%B0%E3%82%92%E8%A6%8B%E3%82%8B%E3%80%8D%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%EF%BC%88SPA%E5%AF%BE%E5%BF%9C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533218/TVer%20%E8%87%AA%E5%8B%95%E3%81%A7%E3%80%8C%E8%A9%B3%E7%B4%B0%E3%82%92%E8%A6%8B%E3%82%8B%E3%80%8D%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%EF%BC%88SPA%E5%AF%BE%E5%BF%9C%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentUrl = location.href;

    function clickDetailsButton() {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            if (btn.textContent.trim() === '詳細を見る') {
                console.log('「詳細を見る」ボタンをクリックします');
                btn.click();
                return true;
            }
        }
        return false;
    }

    function observeForDetailsButton() {
        const observer = new MutationObserver(() => {
            if (clickDetailsButton()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function onUrlChange() {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            console.log('URLが変更されました。再確認します:', currentUrl);
            observeForDetailsButton();
        }
    }

    // 初期読み込み
    observeForDetailsButton();

    // URL変更監視（SPA対応）
    const urlObserver = new MutationObserver(onUrlChange);
    urlObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // pushState/replaceState のフックでURL変更検知を強化（必要に応じて）
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(onUrlChange, 100);
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(onUrlChange, 100);
    };

    window.addEventListener('popstate', onUrlChange);
})();
// ==UserScript==
// @name        New script chatgpt.com
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/c/68020a4c-2a9c-8000-a36a-c6f647ce9e95*
// @grant       none
// @version     1.0
// @author      -
// @description 2025/4/18 17:29:02
// ==/UserScript==
