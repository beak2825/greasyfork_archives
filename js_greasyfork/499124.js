// ==UserScript==
// @name        WOWOW オンデマンド 動画の尺を非表示
// @namespace   Violentmonkey Scripts
// @match       https://wod.wowow.co.jp/*
// @grant       none
// @version     1.0
// @author      Masao S
// @license     MIT
// @description サッカーなどを追っかけ再生する際、動画の長さで延長戦の有無などが分かってしまうのを回避する
// @downloadURL https://update.greasyfork.org/scripts/499124/WOWOW%20%E3%82%AA%E3%83%B3%E3%83%87%E3%83%9E%E3%83%B3%E3%83%89%20%E5%8B%95%E7%94%BB%E3%81%AE%E5%B0%BA%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/499124/WOWOW%20%E3%82%AA%E3%83%B3%E3%83%87%E3%83%9E%E3%83%B3%E3%83%89%20%E5%8B%95%E7%94%BB%E3%81%AE%E5%B0%BA%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blurVideoDuration() {
        const targetNode = document.querySelector('.mainView');
        if (!targetNode) return;

        // 動画一覧・再生画面の動画の時間表示をぼかす
        const metas = targetNode.getElementsByClassName('duration');
        for (let i = 0; i < metas.length; i++) {
            metas[i].style.filter = 'blur(5px)';
        }

        // 再生画面のプレイヤー上の時間表示をぼかし、プログレスバーの現在位置を隠す
        if (document.location.pathname.indexOf('content') > 0) {
            const el = document.querySelector('.time-remaining time span');
            if (el) {
                el.style.filter = 'blur(5px)';
            }
            const bars = document.querySelector('.current-progress');
            if (bars) {
                bars.style.opacity = 0;
            }
        }
    }

    function observeDOMChanges() {
        const targetNode = document.body; // body全体を監視対象に(mainViewにすると、タイミングによっては時間の表示を検出できなかった)
        if (!targetNode) return;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    blurVideoDuration();
                }
            }
        });

        observer.observe(targetNode, {
            attributes: true,
            childList: true,
            subtree: true
        });

        // 初回実行
        blurVideoDuration();
    }

    // 初回監視設定
    observeDOMChanges();

    // URLの変化を監視して再度監視設定を行う
    let previousUrl = window.location.href;
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== previousUrl) {
            previousUrl = currentUrl;
            observeDOMChanges();
        }
    }, 1000);
})();
