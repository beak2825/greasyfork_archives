// ==UserScript==
// @name         ランキングページのニコニコニュースを隠す
// @namespace    https://twitter.com/jdoiwork
// @version      0.2
// @description  ニコニコ動画のランキングページ上のニコニコニュースランキングを隠します。
// @author       https://twitter.com/jdoiwork
// @match        https://www.nicovideo.jp/ranking/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376081/%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AE%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%82%92%E9%9A%A0%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/376081/%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AE%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%82%92%E9%9A%A0%E3%81%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var a = document.querySelector(".NicoNewsContainer") || { style: {}};
    a.style.display = "none";
    
    //console.log(a)
    //console.log(a.parentElement)
    //console.log()

})();