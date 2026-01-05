// ==UserScript==
// @name        ニコニコ動画:例のアレがあれ
// @description  メニューバーの「オススメ」を例のアレランキングへのリンクに変えます
// @namespace   root_T2
// @match        http://www.nicovideo.jp/*
// @author       root_T2
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27477/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%3A%E4%BE%8B%E3%81%AE%E3%82%A2%E3%83%AC%E3%81%8C%E3%81%82%E3%82%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/27477/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%3A%E4%BE%8B%E3%81%AE%E3%82%A2%E3%83%AC%E3%81%8C%E3%81%82%E3%82%8C.meta.js
// ==/UserScript==

var a = document.getElementsByClassName("siteHeaderHorizon");
var b = a[0].getElementsByTagName("a");
b[0].href="http://www.nicovideo.jp/ranking/fav/hourly/are";
var c = b[0].getElementsByTagName("span");
c[0].innerHTML = "例のアレ";
