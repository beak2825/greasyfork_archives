// ==UserScript==
// @name         NicoMyPageDontLookAd
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  ニコニコ動画のマイページの広告を非表示にするスクリプト
// @author       You
// @match        *://www.nicovideo.jp/my/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370978/NicoMyPageDontLookAd.user.js
// @updateURL https://update.greasyfork.org/scripts/370978/NicoMyPageDontLookAd.meta.js
// ==/UserScript==

(function ($) {
    // 広告類の非表示化
    $("div[data-follow-container]").css("display","none");
    $("#personalFrameArea").css("display","none");
    $("#web_pc_footer").css("display","none");
    $("#pc_uni_top_468x60_north").css("display","none");
    $(".PcUniTop300x250EastAdContainer").css("display","none");
})(jQuery);
