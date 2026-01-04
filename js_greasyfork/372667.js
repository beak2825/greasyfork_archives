// ==UserScript==
// @name         picoCTFで既に解いたやつを消す
// @namespace    https://2018game.picoctf.com
// @version      0.2
// @description  picoCTF
// @author       keymoon
// @match        https://2018game.picoctf.com/problems
// @downloadURL https://update.greasyfork.org/scripts/372667/picoCTF%E3%81%A7%E6%97%A2%E3%81%AB%E8%A7%A3%E3%81%84%E3%81%9F%E3%82%84%E3%81%A4%E3%82%92%E6%B6%88%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/372667/picoCTF%E3%81%A7%E6%97%A2%E3%81%AB%E8%A7%A3%E3%81%84%E3%81%9F%E3%82%84%E3%81%A4%E3%82%92%E6%B6%88%E3%81%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#problem-list-holder").bind('DOMNodeInserted', function(event) {
        var target = $('#problem-list-holder > div')[0];
        $('.solved',target).remove();
        $(' > a',target).remove();

        var g2lc = $('.problem:contains("got-2-learn-libc")')[0];
        g2lc.prepend(g2lc.getElementsByClassName('problem-header')[0]);
        $(' > div a:contains(" ")',g2lc).remove();
    });
})();