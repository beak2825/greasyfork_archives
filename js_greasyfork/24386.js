// ==UserScript==
// @name         iTunes ジャケットいただきまう
// @namespace    http://mizle.net/
// @version      0.1
// @description  ジャケットの下に1200x1200のリンクを追加する。
// @author       eai04191
// @license     MIT
// @match        https://itunes.apple.com/jp/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/24386/iTunes%20%E3%82%B8%E3%83%A3%E3%82%B1%E3%83%83%E3%83%88%E3%81%84%E3%81%9F%E3%81%A0%E3%81%8D%E3%81%BE%E3%81%86.user.js
// @updateURL https://update.greasyfork.org/scripts/24386/iTunes%20%E3%82%B8%E3%83%A3%E3%82%B1%E3%83%83%E3%83%88%E3%81%84%E3%81%9F%E3%81%A0%E3%81%8D%E3%81%BE%E3%81%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cover = $(".product .artwork img");
    var coverUrl = cover.attr("src");
    var hiresCoverUrl = coverUrl.replace("cover170x170","cover1200x1200");
    $(cover).after("<a href='"+hiresCoverUrl+"'>"+"Download 1200x1200 cover"+"</a>");
})();