// ==UserScript==
// @name         Waze clear cache
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a refresh button to clear cache and reload the page
// @author       Your Name
// @match        https://www.waze.com/ja/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496199/Waze%20clear%20cache.user.js
// @updateURL https://update.greasyfork.org/scripts/496199/Waze%20clear%20cache.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ボタンを作成してスタイルを設定
    var button = document.createElement("button");
    button.innerText = "clear cache";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "380px";
    button.style.zIndex = "1000";
    button.style.padding = "10px";
    button.style.backgroundColor = "blue"; // 色を青に変更
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    // ボタンクリック時のキャッシュクリアとページリロード
    button.onclick = function() {
        caches.keys().then(names => {
            for (let name of names) {
                caches.delete(name);
            }
        }).then(() => {
            location.reload(true);
        });
    };

    // ページにボタンを追加
    document.body.appendChild(button);
})();
