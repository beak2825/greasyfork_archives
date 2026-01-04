// ==UserScript==
// @name         radiko ワンクリックプレイ
// @namespace    https://yyya-nico.co/
// @version      1.4.1
// @description  選局したらすぐ再生する。
// @author       yyya_nico
// @license      MIT License
// @match        https://radiko.jp/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=radiko.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464414/radiko%20%E3%83%AF%E3%83%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%83%97%E3%83%AC%E3%82%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/464414/radiko%20%E3%83%AF%E3%83%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%83%97%E3%83%AC%E3%82%A4.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 監視ターゲットの取得
    const target = document.getElementById('contents');
    let initComplete = false;

    // オブザーバーの作成
    const observer = new MutationObserver(records => {
        records.forEach(record => {
            if (record.target.id == 'now-programs-list') {
                const playBtn = Array.from(record.addedNodes)
                    .find(node => node.nodeType == 1/*ELEMENT*/ && node.classList.contains('live-detail__body'))
                    .querySelector('.live-detail__play .btn--play');
                if (playBtn != null) {
                    if (!initComplete) {
                        setTimeout(() => playBtn.click(), 100);
                        initComplete = true;
                    } else {
                        playBtn.click();
                    }
                }
                observer.disconnect();
            }
        });
    });

    const options = { //監視オプション
        childList: true, //直接の子の変更を監視
        subtree: true //全ての子要素を監視
    }

    window.addEventListener('hashchange', () => {
        if(location.hash.includes('live')) {
            // 監視の開始
            observer.observe(target, options);
        }
    });
})();