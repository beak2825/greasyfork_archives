// ==UserScript==
// @name          AtCoder URL Change Key Shortcut
// @name:ja       AtCoder URL変更キーショートカット
// @namespace     https://greasyfork.org/ja/users/570127
// @version       1.3.2
// @description   Keyboard shortcuts for AtCoder contest navigation
// @description:ja AtCoderのコンテスト画面をキー操作で移動します
// @author        universato
// @match         https://atcoder.jp/contests/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/500683/AtCoder%20URL%20Change%20Key%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/500683/AtCoder%20URL%20Change%20Key%20Shortcut.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (event) {
        // --- 基本的な誤作動防止 ---
        if (event.repeat) return;
        if (event.isComposing) return;
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;

        const activeElement = document.activeElement;
        if (!activeElement) return;
        if (activeElement.isContentEditable) return;
        if (activeElement.tagName === 'INPUT') return;
        if (activeElement.tagName === 'TEXTAREA') return;

        const key = event.key;

        // --- キーの許可リスト ---
        if (!key.match(/^[a-hmst]$/)) return;

        // --- URL 構造チェック ---
        const paths = location.pathname.split('/');
        if (paths[1] !== 'contests' || !paths[2]) return;

        const contestName = paths[2];

        // --- 遷移処理 ---
        if (key.match(/^[a-h]$/)) {
            location.assign(`/contests/${contestName}/tasks/${contestName}_${key}`);
        }else if (key === 'm') {
            location.assign(`/contests/${contestName}/submissions/me`);
        }else if (key === 's') {
            location.assign(`/contests/${contestName}/submit`);
        }else if (key === 't') {
            location.assign(`/contests/${contestName}/custom_test`);
        }
    });
})();
