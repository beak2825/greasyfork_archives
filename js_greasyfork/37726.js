// ==UserScript==
// @name         ニコ生HTML5プレイヤーで放送が止まる現象の回避
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adblockを使っているとニコ生の放送が固まる現象を回避
// @author       とげとげ
// @match        http://live2.nicovideo.jp/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37726/%E3%83%8B%E3%82%B3%E7%94%9FHTML5%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%A7%E6%94%BE%E9%80%81%E3%81%8C%E6%AD%A2%E3%81%BE%E3%82%8B%E7%8F%BE%E8%B1%A1%E3%81%AE%E5%9B%9E%E9%81%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/37726/%E3%83%8B%E3%82%B3%E7%94%9FHTML5%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%A7%E6%94%BE%E9%80%81%E3%81%8C%E6%AD%A2%E3%81%BE%E3%82%8B%E7%8F%BE%E8%B1%A1%E3%81%AE%E5%9B%9E%E9%81%BF.meta.js
// ==/UserScript==

$(window.onload = function(){
    setTimeout(function(){
        $(".___reload-button___abF8m").click();
        //$("[ aria-label = '映像・音声が止まった際に押して下さい' ]").click();
    },300);
})(jQuery);