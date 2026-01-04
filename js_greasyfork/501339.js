// ==UserScript==
// @name         Tabでかな入力切り替え
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tabでかな入力に切り替える
// @author       You
// @match        https://typing-tube.net/movie/show*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501339/Tab%E3%81%A7%E3%81%8B%E3%81%AA%E5%85%A5%E5%8A%9B%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/501339/Tab%E3%81%A7%E3%81%8B%E3%81%AA%E5%85%A5%E5%8A%9B%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // キーボードイベントをシミュレートする関数
    function simulateAltKanaKeyPress() {
        const altKeyEvent = new KeyboardEvent('keydown', {
            key: 'Alt',
            code: 'AltLeft',
            keyCode: 18,
            altKey: true,
            bubbles: true,
            cancelable: true
        });

        const kanaKeyEvent = new KeyboardEvent('keydown', {
            key: 'KanaMode',
            code: 'KanaMode',
            keyCode: 21,
            altKey: true,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(altKeyEvent);
        document.dispatchEvent(kanaKeyEvent);
    }

    // Tabキーが押されたときのイベントリスナー
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault(); // Tabキーのデフォルト動作を無効化
            simulateAltKanaKeyPress(); // Alt+Kanaキーをシミュレート
        }
    });
})();