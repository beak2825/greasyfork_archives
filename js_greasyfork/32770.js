// ==UserScript==
// @name         自動しおり for 小説を読もう
// @version      0.20
// @description  自動的にしおりを差し込む（おせっかい）システム。
// @author       Velgail
// @include       http*://ncode.syosetu.com/*
// @include       http*://novel*.syosetu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/135617
// @downloadURL https://update.greasyfork.org/scripts/32770/%E8%87%AA%E5%8B%95%E3%81%97%E3%81%8A%E3%82%8A%20for%20%E5%B0%8F%E8%AA%AC%E3%82%92%E8%AA%AD%E3%82%82%E3%81%86.user.js
// @updateURL https://update.greasyfork.org/scripts/32770/%E8%87%AA%E5%8B%95%E3%81%97%E3%81%8A%E3%82%8A%20for%20%E5%B0%8F%E8%AA%AC%E3%82%92%E8%AA%AD%E3%82%82%E3%81%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and trigger the bookmark link
    function checkAndTriggerBookmark() {
        // すべての「しおりを挿む」リンクを検索し、2番目（インデックスは1）のものを選択
        const bookmarkLink = $("a[href='javascript:void(0)']").filter(function() {
            return $(this).text() === "しおりを挿む";
        }).eq(1); // eq(1) は2番目の要素を選択します。インデックスは0から始まります。

        // リンクが存在する場合のみ以下の処理を実行
        if (bookmarkLink.length) {
            const scrollPosition = $(window).height() + $(window).scrollTop();
            if (scrollPosition > bookmarkLink.offset().top + 100) {
                bookmarkLink.trigger("click");
            }
        }
    }

    // Attach scroll and touchmove events
    $(window).on("scroll touchmove", checkAndTriggerBookmark);
})();