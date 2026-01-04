// ==UserScript==
// @name         Yahoo!ニュース：特定メディアの記事を非表示
// @namespace    nikukoppun
// @version      0.1
// @description  Yahoo!ニュースの一覧画面で特定メディアの記事を非表示にする
// @author       nikukoppun
// @match        https://news.yahoo.co.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390629/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%EF%BC%9A%E7%89%B9%E5%AE%9A%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%81%AE%E8%A8%98%E4%BA%8B%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/390629/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%EF%BC%9A%E7%89%B9%E5%AE%9A%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%81%AE%E8%A8%98%E4%BA%8B%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 非表示にしたいメディアをカンマ区切りで記述してください
    var ngMediaCsv = "WoW!Korea,朝鮮日報,中央日報,東洋経済オンライン";

    var ngMediaArr = ngMediaCsv === "" ? [] : ngMediaCsv.split(",");
    hideNgMedia();

    var observer1 = new MutationObserver(function (MutationRecords, MutationObserver) {
        hideNgMedia();
    });
    observer1.observe($(".newsFeed_list").get(0), {
        childList: true,
        subtree: true,
    });

    function hideNgMedia() {
        $(".newsFeed_item_media").each(function(i, elem) {
            var mediaText = $(elem).text();
            for (var j = 0; j < ngMediaArr.length; ++j) {
                if (-1 < mediaText.indexOf(ngMediaArr[j])) {
                    $(elem).closest(".newsFeed_item").hide();
                    break;
                }
            }
        });
    }

})();