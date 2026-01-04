// ==UserScript==
// @name         Force Multiple Audio/Video Playback
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow multiple audio/video playback in split-screen browser
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531600/Force%20Multiple%20AudioVideo%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/531600/Force%20Multiple%20AudioVideo%20Playback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ページ内のすべてのvideoとaudio要素を取得
    const mediaElements = document.querySelectorAll('video, audio');

    // 各メディア要素に対して処理
    mediaElements.forEach(element => {
        // ミュート解除と再生を試みる
        element.muted = false;
        element.play().catch(error => {
            console.log('再生エラー:', error);
        });

        // 再生が停止された場合に再開する
        element.addEventListener('pause', () => {
            if (!element.paused) return; // 既に再生中なら何もしない
            element.play().catch(error => {
                console.log('再開エラー:', error);
            });
        });

        // タブが非アクティブになっても再生を維持
        element.addEventListener('webkitvisibilitychange', () => {
            if (document.hidden) {
                element.play().catch(error => {
                    console.log('非表示時の再生エラー:', error);
                });
            }
        });
    });

    // 新しいメディア要素が追加された場合にも対応
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const newMedia = mutation.target.querySelectorAll('video, audio');
            newMedia.forEach(element => {
                element.muted = false;
                element.play().catch(error => {
                    console.log('動的追加メディアの再生エラー:', error);
                });
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();