// ==UserScript==
// @name         animefun ncc beautify
// @name:zh-TW   動畫瘋年齡確認美化
// @namespace    http://github.com/jtdjdu6868
// @version      0.1
// @description  Beautify Animefun ncc confirm page
// @description:zh-TW    美化動畫瘋年齡確認畫面，使集數縮圖可以顯示
// @author       jtdjdu6868
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @icon         https://ani.gamer.com.tw/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493565/animefun%20ncc%20beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/493565/animefun%20ncc%20beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(`<style>
        .R18
        {
            background: transparent;
        }
        .R18 .video-cover-ncc
        {
            top: auto;
            bottom: 0;
            transform: none;
            background-color: #00000026
        }
        .R18 .video-cover-ncc .ncc-choosearea
        {
            justify-content: inherit;
        }
    </style>`).appendTo("body");
})();