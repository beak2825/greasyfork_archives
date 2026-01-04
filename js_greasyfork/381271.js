// ==UserScript==
// @name         Pukiwiki Focus Action
// @description  Pukiwiki のアクションバーを移動するやつ
// @version      0.1
// @match        https://www.icd.cs.tut.ac.jp/pukiwiki/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/167332
// @downloadURL https://update.greasyfork.org/scripts/381271/Pukiwiki%20Focus%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/381271/Pukiwiki%20Focus%20Action.meta.js
// ==/UserScript==

$(window).on('keydown', function(e) {
    if(e.keyCode == 74 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) { // Alt + J
        focus_prev();
        return false;
    }
    if(e.keyCode == 76 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) { // Alt + L
        focus_next();
        return false;
    }
});

/**
 * フォーカスを前に移動する
 */
function focus_prev() {
    // 現在のフォーカスを取得
    var currentFocusIndex = $('div#navigator>a').index($(':focus'));

    if(currentFocusIndex > -1) {
        for (var i = 0; i < $('div#navigator>a').length; i++) {
            if(i === currentFocusIndex && i > 0) {
                $('div#navigator>a').eq(i - 1).focus();
            }
        }
    }
}

/**
 * フォーカスを次に移動する
 */
function focus_next() {
    // 現在のフォーカスを取得
    var currentFocusIndex = $('div#navigator>a').index($(':focus'));

    if(currentFocusIndex > -1) {
        for (var i = 0; i < $('div#navigator>a').length; i++) {
            if(i === currentFocusIndex && i < $('div#navigator>a').length - 1) {
                $('div#navigator>a').eq(i + 1).focus();
            }
        }
    } else {
        $('div#navigator>a').eq(0).focus();
    }
}