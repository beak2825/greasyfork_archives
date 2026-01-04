// ==UserScript==
// @name        ABEMA 動画の尺を非表示
// @namespace   Violentmonkey Scripts
// @match       https://abema.tv/*
// @grant       none
// @version     1.1
// @author      Masao S
// @license     MIT
// @description サッカーなどを追っかけ再生する際、動画の長さで延長戦の有無などが分かってしまうのを回避する
// @downloadURL https://update.greasyfork.org/scripts/499123/ABEMA%20%E5%8B%95%E7%94%BB%E3%81%AE%E5%B0%BA%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/499123/ABEMA%20%E5%8B%95%E7%94%BB%E3%81%AE%E5%B0%BA%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blurVideoDuration() {
        // 動画一覧の動画の時間表示をぼかす
        const durations = document.querySelectorAll('.com-content-list-ContentListLiveEventItem__duration');
        if (durations) {
          durations.forEach(function(item) {
            item.style.filter = 'blur(5px)'
          });
        }

        // 再生画面のプレイヤー上の時間表示をぼかし、プログレスバーの現在位置を隠す
        if (document.location.pathname.indexOf('live-event') > 0) {
            const el = document.querySelectorAll('.com-vod-VideoControlBar__time time');
            if (el && el.length > 1) {
                el[1].style.filter = 'blur(5px)';
            }
            const bars = document.querySelectorAll('.com-live-event-LiveEventSeekBar__highlighter, .com-live-event-LiveEventSeekBar__marker');
            if (bars) {
              bars.forEach(function(item) {
                item.style.opacity = 0;
              });
            }
        }
    }

    function observeDOMChanges() {
        const targetNode = document.body; // FIXME: body全体でなくても良いかも
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
