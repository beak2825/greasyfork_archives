// ==UserScript==
// @name         ニコ生追い出しされたらリロード
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  「プレミアム会員が入場したため、席を譲りました」「優先視聴ユーザーが入場したため、席を譲りました」されたらリロードするだけ
// @match        https://live.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467148/%E3%83%8B%E3%82%B3%E7%94%9F%E8%BF%BD%E3%81%84%E5%87%BA%E3%81%97%E3%81%95%E3%82%8C%E3%81%9F%E3%82%89%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/467148/%E3%83%8B%E3%82%B3%E7%94%9F%E8%BF%BD%E3%81%84%E5%87%BA%E3%81%97%E3%81%95%E3%82%8C%E3%81%9F%E3%82%89%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchTextPattern = /席を譲りました/;
    const playerScreenClass = document.querySelector('[class*="___player-display-screen___"]').classList[0];
    const targetElement = document.querySelector(`.${playerScreenClass}`);

    if (targetElement) {
        // MutationObserverのコールバック関数
        const observerCallback = function(mutationsList) {
            for (const mutation of mutationsList) {
                for (const addedNode of mutation.addedNodes) {
                    // 追加されたノードがdialogLayerに属しているかチェック
                    if (addedNode.dataset.layerName === 'dialogLayer') {
                        // dialogLayer内の要素を処理する関数を呼び出す
                        handleDialogLayerElement(addedNode);
                    }
                }
            }
        };

        // dialogLayer内の要素を処理する関数
        const handleDialogLayerElement = function(dialogLayerElement) {
            // alert要素をクエリセレクタで検索
            const alertElements = dialogLayerElement.querySelectorAll('[data-type="alert"]');
            for (const alertElement of alertElements) {
                // alert要素内のh2要素を取得
                const h2Element = alertElement.querySelector('h2');
                if (h2Element && searchTextPattern.test(h2Element.textContent)) {
                    // マッチするテキストが見つかった場合、ページをリロード
                    reloadPage();
                    break;
                }
            }
        };

        // ページをリロードする関数
        const reloadPage = function() {
            location.reload();
        };

        // MutationObserverのオプション設定
        const observerOptions = { childList: true, subtree: true };
        const observer = new MutationObserver(observerCallback);

        // 監視対象要素にMutationObserverを設定
        observer.observe(targetElement, observerOptions);
    }
})();