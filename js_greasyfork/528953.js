// ==UserScript==
// @name         Open Selected Address in Google Maps
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  選択したテキストや住所をGoogleマップで開く
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528953/Open%20Selected%20Address%20in%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/528953/Open%20Selected%20Address%20in%20Google%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // キーボードショートカット（例: Ctrl + M）を押したときに動作
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'm') { // Ctrl + M で起動
            openInGoogleMaps();
        }
    });

    // 選択したテキストを取得してGoogleマップで開く関数
    function openInGoogleMaps() {
        let selectedText = window.getSelection().toString().trim();

        if (selectedText) {
            // Googleマップの検索URLを生成
            let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedText)}`;
            // 新しいタブで開く
            window.open(mapsUrl, '_blank');
        } else {
            alert('住所またはテキストを選択してください！');
        }
    }

    // オプション: 右クリックメニューに項目を追加（ブラウザの制限で動作しない場合あり）
    document.addEventListener('contextmenu', function(event) {
        setTimeout(() => { // 右クリック後に少し待機して選択テキストを確認
            let selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                if (confirm(`"${selectedText}" をGoogleマップで開きますか？`)) {
                    let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedText)}`;
                    window.open(mapsUrl, '_blank');
                }
            }
        }, 100);
    });
})();