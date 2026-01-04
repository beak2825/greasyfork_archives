// ==UserScript==
// @name         プレミアムDayブロッカー
// @namespace    https://ic731.net/
// @version      0.2
// @description  消し去るやつ
// @author       ichii731
// @include        https://*.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442366/%E3%83%97%E3%83%AC%E3%83%9F%E3%82%A2%E3%83%A0Day%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/442366/%E3%83%97%E3%83%AC%E3%83%9F%E3%82%A2%E3%83%A0Day%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    window.addEventListener("load", function() {
        // top
        var target = document.querySelector('.common-header-1fketcj');
        // video
        if (target == null) {
            target = document.querySelector('.common-header-ii5yd9');
        }
        // live
        if (target == null) {
            target = document.querySelector('.common-header-k93j6r');
        }
        // dic
        if (target == null) {
            target = document.querySelector('.common-header-15fn3mu');
        }
        // seiga
        if (target == null) {
            target = document.querySelector('.common-header-15lsty1');
        }
        // 非表示にする
        target.style.display = 'none';
        console.log(target);
    })
})();