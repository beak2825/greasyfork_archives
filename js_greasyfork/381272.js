// ==UserScript==
// @name         Pukiwiki Focus Menu
// @description  Pukiwikiのメニューバーを移動するやつ
// @version      0.1
// @match        https://www.icd.cs.tut.ac.jp/pukiwiki/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/167332
// @downloadURL https://update.greasyfork.org/scripts/381272/Pukiwiki%20Focus%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/381272/Pukiwiki%20Focus%20Menu.meta.js
// ==/UserScript==

$(window).on('keydown', function(e) {
    if(e.keyCode == 73 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) { // Alt + I
        focus_prev();
        return false;
    }
    if(e.keyCode == 75 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) { // Alt + K
        focus_next();
        return false;
    }
});

/**
 * フォーカスを前に移動する
 */
function focus_prev() {
    // 現在のフォーカスを取得
    var currentFocusIndex = $('div#menubar a').index($(':focus'));

    if(currentFocusIndex > -1) {
        for (var i = 0; i < $('div#menubar a').length; i++) {
            if(i === currentFocusIndex && i > 0) {
                $('div#menubar a').eq(i - 1).focus();
            }
        }
    }
}

/**
 * フォーカスを次に移動する
 */
function focus_next() {
    // 現在のフォーカスを取得
    var currentFocusIndex = $('div#menubar a').index($(':focus'));

    if(currentFocusIndex > -1) {
        for (var i = 0; i < $('div#menubar a').length; i++) {
            if(i === currentFocusIndex && i < $('div#menubar a').length - 1) {
                $('div#menubar a').eq(i + 1).focus();
            }
        }
    } else {
        $('div#menubar a').eq(0).focus();
    }
}