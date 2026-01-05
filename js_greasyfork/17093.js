// ==UserScript==
// @name         动画角色印象色
// @version      0.0.3
// @description  将印象色字段的背景改为该颜色
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/character\/.+/
// @author       woozy
// @grant        none
// @namespace    im.woozy.bangumi
// @downloadURL https://update.greasyfork.org/scripts/17093/%E5%8A%A8%E7%94%BB%E8%A7%92%E8%89%B2%E5%8D%B0%E8%B1%A1%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/17093/%E5%8A%A8%E7%94%BB%E8%A7%92%E8%89%B2%E5%8D%B0%E8%B1%A1%E8%89%B2.meta.js
// ==/UserScript==
'use strict';

$('#infobox li').each(function() {
  var key = $(this).children('.tip').text();
  if (~key.indexOf('印象色')) {
    var str = $(this).contents()[1].textContent;
    var color = str.match(/#[0-9a-f]{6}/i)[0] || str.match(/#[0-9a-f]{3}/i)[0] || str;
    $(this).css({backgroundColor: color});
  }
});
