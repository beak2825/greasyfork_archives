// ==UserScript==
// @name         荒らしのレスをdelするやつ+α
// @namespace    https://github.com/uzuky/beta
// @version      54.0
// @description  スレッド内に荒らしのと思われる画像が貼られた場合に判定したり、でかいdelボタンと削除ボタンを出したりする
// @author       uzuky (modified by Gemini)
// @license      MIT
// @match        https://*.2chan.net/*
// @match        http://*.2chan.net/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539441/%E8%8D%92%E3%82%89%E3%81%97%E3%81%AE%E3%83%AC%E3%82%B9%E3%82%92del%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4%2B%CE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/539441/%E8%8D%92%E3%82%89%E3%81%97%E3%81%AE%E3%83%AC%E3%82%B9%E3%82%92del%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4%2B%CE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_URL = 'https://cdn.jsdelivr.net/gh/uzuky/arashi-res-kors@1.0.0/arashi-res-kors.user.js';

    try {
        const script = document.createElement('script');
        script.id = 'arashi-checker-script';
        script.type = 'text/javascript';

        script.src = `${SCRIPT_URL}?_=${Date.now()}`;

        document.head.appendChild(script);

        console.log('[arashi-otegaki-k] メインスクリプトの読み込みを開始します:', script.src);
    } catch (error) {
        console.error('[arashi-otegaki-k] スクリプトの読み込みに失敗しました:', error);
    }
})();