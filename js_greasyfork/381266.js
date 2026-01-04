// ==UserScript==
// @name         Pukiwiki Search
// @description  Pukiwiki 検索に移動するやつ
// @version      0.1
// @match        https://www.icd.cs.tut.ac.jp/pukiwiki/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/167332
// @downloadURL https://update.greasyfork.org/scripts/381266/Pukiwiki%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/381266/Pukiwiki%20Search.meta.js
// ==/UserScript==

$(window).on('keydown', function(e) {
    if(e.keyCode == 71 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) { // Alt + G
        click_search();
        return false;
    }
});

function click_search() {
    // 現在のフォーカスを取得
    var search_a = $('#navigator > a[href*="search"]');
    window.location = search_a[0].href;
}