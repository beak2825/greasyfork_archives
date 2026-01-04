// ==UserScript==
// @name         うんはらバスターZ（モザイク版）
// @namespace    うんはらバスターZ (モザイク版)
// @version      1.0
// @description  おんjで画像にモザイクをかけ、解除ボタンを表示！スレ移動でもモザイクが適用されるように改善！
// @author       Wai
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528418/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCZ%EF%BC%88%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AF%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528418/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCZ%EF%BC%88%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AF%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 画像にモザイクをかける関数
    function applyMosaic(img) {
        img.style.filter = "blur(10px)"; // モザイク効果
    }

    // モザイクを解除する関数
    function removeMosaic(img) {
        img.style.filter = "none"; // モザイク解除
    }

    // 画像の拡張子を取得する関数
    function getFileExtension(url) {
        const match = url.match(/\.([0-9a-z]+)(?=[?#])|(\.[0-9a-z]+)$/i);
        return match ? match[1] || match[2].substring(1) : null;
    }

    // 新しい画像をチェックしてモザイクを適用する関数
    function checkImages(targetNode = document) {
        targetNode.querySelectorAll('img').forEach(img => {
            if (img.src.includes("imgur.com") && !img.dataset.checked) { // imgur画像で未処理のもの
                img.dataset.checked = "true"; // 重複処理防止
                applyMosaic(img); // 画像にモザイクをかける

                // 画像クリックで遷移を防ぐ
                img.addEventListener('click', function(event) {
                    event.preventDefault();
                });

                // モザイク解除ボタンを作成
                let btn = document.createElement("button");
                btn.textContent = "モザイク解除";
                btn.style.margin = "5px";
                btn.style.fontSize = "1.2em"; // ボタンの文字サイズを大きくする
                btn.style.padding = "5px 10px"; // ボタンのパディングを追加
                btn.onclick = function(event) {
                    event.preventDefault(); // ボタンの遷移を防止
                    removeMosaic(img); // モザイク解除
                    btn.remove(); // ボタン削除
                    // モザイクボタンを再度追加
                    let mosaicBtn = document.createElement("button");
                    mosaicBtn.textContent = "モザイク";
                    mosaicBtn.style.margin = "5px";
                    mosaicBtn.style.fontSize = "1.2em"; // ボタンの文字サイズを大きくする
                    mosaicBtn.style.padding = "5px 10px"; // ボタンのパディングを追加
                    mosaicBtn.onclick = function(event) {
                        event.preventDefault(); // ボタンの遷移を防止
                        applyMosaic(img); // モザイクをかける
                        mosaicBtn.remove(); // ボタン削除
                        img.insertAdjacentElement("beforebegin", btn); // モザイク解除ボタンを再度追加
                    };
                    img.insertAdjacentElement("beforebegin", mosaicBtn);
                };
                img.insertAdjacentElement("beforebegin", btn);

                // 拡張子を表示
                const ext = getFileExtension(img.src);
                const extDisplay = document.createElement("span"); // spanに変更
                extDisplay.style.color = "red";
                extDisplay.style.fontSize = "1.2em"; // 拡張子表示を大きくする
                extDisplay.style.marginLeft = "5px"; // ボタンとの間隔を調整
                extDisplay.textContent = ext ? (ext.toUpperCase() === "GIF" ? "⚠️GIF" : ext) : "拡張子不明";
                img.insertAdjacentElement("afterend", extDisplay); // 拡張子を画像の後に表示

                // 画像URLを青文字で表示
                const urlDisplay = document.createElement("div");
                urlDisplay.style.color = "blue";
                urlDisplay.style.wordWrap = "break-word"; // 長いURLを折り返す
                urlDisplay.textContent = img.src;
                img.insertAdjacentElement("afterend", urlDisplay);
            }
        });
    }

    // 初回実行
    checkImages();

    // 常にページを監視して、新たに追加された画像にモザイクを適用
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // ノードが要素ノードであるか確認
                    if (node.tagName === "IMG") {
                        checkImages(node); // 新しく追加された画像をチェック
                    } else if (node.querySelectorAll) {
                        checkImages(node); // 新しく追加されたコンテンツ内に画像が含まれていればチェック
                    }
                }
            });
        });
    });

    // 全体のDOMを監視
    observer.observe(document.body, { childList: true, subtree: true });

    // 履歴操作を監視してスレ移動時にも対応
    window.addEventListener('popstate', () => {
        checkImages(); // スレ移動後に再チェック
    });

    // pushState / replaceState を監視してスレ移動時にも対応
    let originalPushState = history.pushState;
    let originalReplaceState = history.replaceState;

    function hookHistoryMethod(original) {
        return function() {
            let result = original.apply(this, arguments);
            checkImages(); // スレ移動後に再チェック
            return result;
        };
    }

    history.pushState = hookHistoryMethod(originalPushState);
    history.replaceState = hookHistoryMethod(originalReplaceState);

})();