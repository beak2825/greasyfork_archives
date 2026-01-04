// ==UserScript==
// @name         Highlight purchased item on DLsite
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  購入済みアイテムの背景色を変更します
// @author       PUMPKIN
// @match        https://www.dlsite.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/476375/Highlight%20purchased%20item%20on%20DLsite.user.js
// @updateURL https://update.greasyfork.org/scripts/476375/Highlight%20purchased%20item%20on%20DLsite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const backgroundColor = "gray";

    // 購入済みアイテムに対して背景色を設定する関数
    function highlightPurchasedItems() {
        document.querySelectorAll('.btn_dl').forEach(btn => {
            // 割引中、サークル情報等：.search_result_img_box_inner
            // サークル情報の割引中作品：.n_worklist_item
            // 検索結果：tr
            const parent = btn.closest('.search_result_img_box_inner, .n_worklist_item, tr');
            if (parent) {
                parent.style.backgroundColor = backgroundColor;
            }
        });
    }

    // 動的な変更を監視して、追加された要素に適用する
    const observer = new MutationObserver(() => {
        highlightPurchasedItems(); // DOM に変更があった場合、常に全体を再探索
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true, // 子要素の追加・削除を監視
    });
})();
