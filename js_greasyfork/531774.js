// ==UserScript==
// @name         動画再生キーボードショートカット b~g
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  動画操作のキーボードショートカット
// @author       Your Name
// @grant        none
// @license      MIT
// @match        https://*
// @downloadURL https://update.greasyfork.org/scripts/531774/%E5%8B%95%E7%94%BB%E5%86%8D%E7%94%9F%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%20b~g.user.js
// @updateURL https://update.greasyfork.org/scripts/531774/%E5%8B%95%E7%94%BB%E5%86%8D%E7%94%9F%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%20b~g.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 共通の動画取得関数
    const getVideo = () => document.querySelector('video');

    // 速度切り替え
    const toggleSpeed = () => {
        try {
            const v = getVideo();
            v.playbackRate = v.playbackRate === 1 ? 2 : 1;
            console.log(`速度: ${v.playbackRate}x`);
        } catch(e) {
            console.error('動画操作エラー:', e);
        }
    };

    // 再生/停止
    const togglePlay = () => {
        try {
            const v = getVideo();
            v[v.paused ? 'play' : 'pause']();
        } catch(e) {
            console.error('動画操作エラー:', e);
        }
    };

    // 時間操作
    const seekTime = (seconds) => {
        try {
            const v = getVideo();
            v.currentTime = Math.max(0, v.currentTime + seconds);
        } catch(e) {
            console.error('動画操作エラー:', e);
        }
    };

    // キーハンドラ
    const handleKeyPress = (e) => {
        if (!getVideo()) return; // 動画がない場合は処理中止

        switch(e.key.toLowerCase()) {
            case 'b':
                toggleSpeed();
                break;
            case 'c':
                togglePlay();
                break;
            case 'd':
                seekTime(-30);
                break;
            case 'e':
                seekTime(-10);
                break;
            case 'f':
                seekTime(10);
                break;
            case 'g':
                seekTime(30);
                break;
            default:
                return;
        }
        e.preventDefault();
        e.stopPropagation();
    };

    document.addEventListener('keydown', handleKeyPress);
})();