// ==UserScript==
// @name         うんはらバスター
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  おんjで画像を表示するか逐一確認！
// @author       icchi
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528352/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/528352/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkImages() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes("imgur.com") && !img.dataset.checked) { // imgur画像で未処理のもの
                img.dataset.checked = "true"; // 重複処理防止
                img.style.display = "none"; // 画像を非表示
                let btn = document.createElement("button");
                btn.textContent = "画像を表示する";
                btn.style.margin = "5px";
                btn.onclick = function() {
                    img.style.display = "block"; // 画像を表示
                    btn.remove(); // ボタン削除
                };
                img.insertAdjacentElement("beforebegin", btn);
            }
        });
    }

    // 初回実行
    checkImages();

    // ページの変更を監視（新しく読み込まれた画像にも対応）
    let observer = new MutationObserver(checkImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();
