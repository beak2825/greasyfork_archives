// ==UserScript==
// @name         AtCoderCharacterColorizer
// @namespace    https://satanic0258.github.io/
// @version      0.1.3
// @description  Colorize kanji meaning color in statements
// @author       satanic0258
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @copyright    2021, satanic0258 (https://satanic0258.github.io/)
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/429815/AtCoderCharacterColorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/429815/AtCoderCharacterColorizer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function background(c, r, g, b, a) {
        return "<span style='background-color:rgba("+r+","+g+","+b+","+a+");'>"+c+"</span>";
    }
    function white(c) {
        return "<span style='color:#fff;text-shadow:1px 0px 1px #000,0px 1px 1px #000,-1px 0px 1px #000,0px -1px 1px #000;'>"+c+"</span>";
    }
    function colorize(obj) {
        obj.innerHTML = obj.innerHTML
            .replace(/黒/g, background('黒',   0,   0,   0, 0.3))
            .replace(/ブラック/g, background('ブラック',   0,   0,   0, 0.3))
            .replace(/青([^木])/g, background('青',   0,   0, 255, 0.3) + '$1')
            .replace(/緑/g, background('緑',   0, 255,   0, 0.3))
            .replace(/水/g, background('水',   0, 255, 255, 0.3))
            .replace(/藍/g, background('藍',  15,  84, 116, 0.3))
            .replace(/灰/g, background('灰', 127, 127, 127, 0.3))
            .replace(/銀/g, background('銀', 127, 127, 127, 0.3))
            .replace(/紫/g, background('紫', 162,  96, 191, 0.4))
            .replace(/茶/g, background('茶', 184, 115,  51, 0.4))
            .replace(/銅/g, background('銅', 184, 115,  51, 0.4))
            .replace(/桃/g, background('桃', 240, 145, 153, 0.4))
            .replace(/ピンク/g, background('ピンク', 240, 145, 153, 0.4))
            .replace(/赤/g, background('赤', 255,   0,   0, 0.3))
            .replace(/橙/g, background('橙', 255, 127,   0, 0.3))
            .replace(/オレンジ/g, background('オレンジ', 255, 127,   0, 0.3))
            .replace(/黄/g, background('黄', 255, 255,   0, 0.5))
            .replace(/金/g, background('金', 255, 255,   0, 0.5))
            .replace(/白/g, white('白'))
            .replace(/ホワイト/g, white('ホワイト'));
    }
    function recColorize(obj) {
        // <section>直下の要素のみ色づけする
        if(obj.tagName === "SECTION") {
            for(const chi of obj.children) {
                // copy機能が壊れるため関連する部分は色付けしない
                if(chi.tagName === "H3" || chi.tagName === "PRE") continue;
                if(chi.tagName === "DIV" && chi.classList.contains("div-btn-copy")) continue;
                colorize(chi);
            }
        }
        else {
            for(const chi of obj.children) recColorize(chi);
        }
    }
    recColorize(document.getElementById("task-statement"));
})();