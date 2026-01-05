// ==UserScript==
// @name        bro3_hitokotokiru
// @namespace   https://greasyfork.org/ja/users/9894
// @description ブラウザ三国志 一言塗りつぶし君（1鯖用）
// @include     http://s1.3gokushi.jp*
// @version     1.02.1
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @grant               GM_deleteValue
// @grant               GM_log
// @grant               GM_registerMenuCommand
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10541/bro3_hitokotokiru.user.js
// @updateURL https://update.greasyfork.org/scripts/10541/bro3_hitokotokiru.meta.js
// ==/UserScript==
jQuery.noConflict();
var box = document.getElementById('commentList');

box.style.color = "#FFF8DC";
