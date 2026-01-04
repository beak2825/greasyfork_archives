// ==UserScript==
// @name        NHK Web copy
// @namespace   conquerist2@gmail.com
// @include     https://www3.nhk.or.jp/news/html/*
// @include			file://*NHK%20Online/*
// @grant       GM.setClipboard
// @description NHK Web News - Copy Article text
// @require  		http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @license MIT
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/469850/NHK%20Web%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/469850/NHK%20Web%20copy.meta.js
// ==/UserScript==
// 2023 06 30 v1.0 -- initial version

$(document).focus(copy_nhk);

function copy_nhk() {
  my_text = ' ' +
  document.querySelector('.content--title').innerText.trim() + '\r\n\r\n' + 
  document.querySelector('.content--date').innerText.trim() + '\r\n\r\n' + 
  document.querySelector('.content--detail-main').innerText.trim() + '\r\n\r\n';

  my_text += '---\r\n\r\n';

  GM.setClipboard(my_text);
}