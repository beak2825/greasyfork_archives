// ==UserScript==
// @name         うんはらバスターV2（モザイクON/OFF専用）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  おんjで画像にモザイクをかけたり外したり！クリックで拡大されないように修正
// @author       icchi
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528413/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCV2%EF%BC%88%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AFONOFF%E5%B0%82%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528413/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCV2%EF%BC%88%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AFONOFF%E5%B0%82%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkImages(targetNode = document) {
        targetNode.querySelectorAll('img.imgur, img[src*="imgur.com"]').forEach(img => {
            if (!img.dataset.checked) { // 未処理の画像のみ対象
                img.dataset.checked = "true"; // 処理済みマーク

                // 初期状態ではモザイクをかける
                img.style.filter = "blur(10px)";
                img.style.transition = "filter 0.3s ease";

                // モザイク切り替えボタン作成
                let btn = document.createElement("button");
                btn.textContent = "モザイク切り替え";
                btn.style.margin = "5px";
                btn.onclick = function(event) {
                    event.preventDefault(); // サイト遷移防止
                    if (img.style.filter === "none") {
                        img.style.filter = "blur(10px)"; // モザイクON
                    } else {
                        img.style.filter = "none"; // モザイクOFF
                    }
                };

                // ボタンを画像の前に挿入
                img.insertAdjacentElement("beforebegin", btn);

                // 拡大防止：画像がクリックされた際にリンクを無効化
                let parentLink = img.closest('a');
                if (parentLink) {
                    parentLink.addEventListener('click', function(event) {
                        event.preventDefault(); // 画像クリックで拡大しないようにする
                    });
                }
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
