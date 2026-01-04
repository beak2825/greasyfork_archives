// ==UserScript==
// @name        記録を見るぜ
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  記録をみるボタン
// @author       You
// @match        https://typing-tube.net/movie/show*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js
// @downloadURL https://update.greasyfork.org/scripts/512887/%E8%A8%98%E9%8C%B2%E3%82%92%E8%A6%8B%E3%82%8B%E3%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/512887/%E8%A8%98%E9%8C%B2%E3%82%92%E8%A6%8B%E3%82%8B%E3%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addBtn = () => {
        document.querySelector('.twitter.btn').parentElement.insertAdjacentHTML('beforeend',
            `<input type="button" id="getLyricsBtn" value="記録をみるよ！">`);
    };

    const getLyrics = async () => {
        // ① 現在のページのURLを取得
        const currentUrl = window.location.href;

        // ② 最後の数字を取得
        const movieId = currentUrl.match(/(\d+)$/)[0];

        // ③ 新しいウィンドウで開く
        const newUrl = `https://typing-tube.net/my/rankings/movie/${movieId}`;
        window.open(newUrl, '_blank');
    };

    // ボタンを追加
    addBtn();

    // ボタンにイベントリスナーを追加
    document.getElementById('getLyricsBtn').addEventListener('click', getLyrics);
})();