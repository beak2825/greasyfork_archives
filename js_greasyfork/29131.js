// ==UserScript==
// @name        程序师网站文章全文显示
// @namespace   程序师网站文章全文显示
// @description 程序师网站文章去除“余下全文”按钮，直接全文显示
// @include     http://www.techug.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29131/%E7%A8%8B%E5%BA%8F%E5%B8%88%E7%BD%91%E7%AB%99%E6%96%87%E7%AB%A0%E5%85%A8%E6%96%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/29131/%E7%A8%8B%E5%BA%8F%E5%B8%88%E7%BD%91%E7%AB%99%E6%96%87%E7%AB%A0%E5%85%A8%E6%96%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
$('#content0').css('maxHeight', '100%');
$('#rest').hide();