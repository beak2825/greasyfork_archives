// ==UserScript==
// @name         うんはらバスターV2
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  おんjで画像を表示するか逐一確認！
// @author       icchi
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528405/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCV2.user.js
// @updateURL https://update.greasyfork.org/scripts/528405/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCV2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkImages(targetNode = document) {
        targetNode.querySelectorAll('img.imgur, img[src*="imgur.com"]').forEach(img => {
            if (!img.dataset.checked) { // 未処理の画像のみ対象
                img.dataset.checked = "true"; // 処理済みマーク

                // 画像を非表示
                img.style.display = "none";

                // 親の <a> タグを探してリンクを無効化
                let parentLink = img.closest('a');
                if (parentLink) {
                    parentLink.dataset.originalHref = parentLink.href; // 元のリンクを保存
                    parentLink.removeAttribute("href"); // 無効化
                }

                // ボタン作成
                let btn = document.createElement("button");
                btn.textContent = "画像を表示する";
                btn.style.margin = "5px";
                btn.onclick = function(event) {
                    event.preventDefault(); // サイト遷移防止
                    img.style.display = "block"; // 画像表示
                    btn.remove(); // ボタン削除

                    // 親の <a> タグのリンクを復元
                    if (parentLink && parentLink.dataset.originalHref) {
                        parentLink.href = parentLink.dataset.originalHref;
                    }
                };

                // ボタンを画像の前に挿入
                img.insertAdjacentElement("beforebegin", btn);
            }
        });
    }

    function resetImages() {
        document.querySelectorAll('img.imgur[data-checked], img[src*="imgur.com"][data-checked]').forEach(img => {
            img.removeAttribute("data-checked"); // 処理リセット
        });
    }

    // 初回実行
    checkImages();

    // ページの変更を監視（新しく読み込まれた画像にも対応）
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.tagName === "IMG" && node.src.includes("imgur.com")) {
                        checkImages(node.parentNode); // 追加されたimgur画像を処理
                    } else if (node.querySelectorAll) {
                        checkImages(node); // 追加された要素内の画像を処理
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 「前のレスを取得」ボタンが押されたら、新しく追加された要素を処理
    document.body.addEventListener("click", (event) => {
        if (event.target.closest(".prev_bt")) {
            setTimeout(() => checkImages(), 1000); // レス取得後に適用
        }
    });

    // 履歴操作を監視してスレ移動時にも対応
    window.addEventListener('popstate', () => {
        resetImages();
        setTimeout(() => checkImages(), 500);
    });

    // pushState / replaceState を監視するためのフック
    let originalPushState = history.pushState;
    let originalReplaceState = history.replaceState;

    function hookHistoryMethod(original) {
        return function() {
            let result = original.apply(this, arguments);
            resetImages();
            setTimeout(() => checkImages(), 500);
            return result;
        };
    }

    history.pushState = hookHistoryMethod(originalPushState);
    history.replaceState = hookHistoryMethod(originalReplaceState);

})();