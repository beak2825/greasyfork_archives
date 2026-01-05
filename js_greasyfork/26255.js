// ==UserScript==
// @name        局名表示
// @namespace   https://greasyfork.org/users/19523
// @description ニコニコ実況のページタイトルに局名を追加
// @include     http://jk.nicovideo.jp/watch/jk*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26255/%E5%B1%80%E5%90%8D%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/26255/%E5%B1%80%E5%90%8D%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==


document.title = document.getElementById('channel_title').getElementsByTagName('span')[1].innerHTML + ' - ' + document.title;
