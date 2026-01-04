// ==UserScript==
// @name     ニコニコ大百科新着レス非表示
// @namespace   https://greasyfork.org/ja/users/379103-tr-m-m
// @description ニコニコ大百科インデックスページ新着レスの詳細を非表示にする
// @include     https://dic.nicovideo.jp/
// @include     https://dic.nicovideo.jp/?*
// @include     https://dic.nicovideo.jp/t/
// @include     https://dic.nicovideo.jp/t/?*
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/390505/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E6%96%B0%E7%9D%80%E3%83%AC%E3%82%B9%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/390505/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E6%96%B0%E7%9D%80%E3%83%AC%E3%82%B9%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

var PC_NEW_RES_DETAIL = ".index-new-res-detail";
var SP_NEW_RES_DETAIL = ".sw-Colum_Resboard";

Array.from(document.querySelectorAll(PC_NEW_RES_DETAIL))
    .concat(Array.from(document.querySelectorAll(SP_NEW_RES_DETAIL)))
    .forEach(function(detail){
        detail.hidden = true;
    });
  