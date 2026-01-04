// ==UserScript==
// @name       Senpai-agar on PC
// @namespace  天才
// @version    2
// @description  追加
// @match      http://senpai-agar.online/*
// @copyright  fuck
// @downloadURL https://update.greasyfork.org/scripts/397569/Senpai-agar%20on%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/397569/Senpai-agar%20on%20PC.meta.js
// ==/UserScript==

//不要ボタンの削除
$('#btDualAgar').remove();
$('#btSaoMobile').remove();
$('.btn-ext-link').remove();
//接続ボタンの追加
$('ex_server_links').append("<div><p>SAO以外への接続をする</p></div>");
$(function() {
$('#ex_server_links').prepend("<div><a id='join'  id='join' class='btn btn-play-guest btn-success btn-needs-server'data-role='button'>モバイル</a></div>");
    $('#join').on('click', function() {
  connect('ws://133.130.99.220:2530');
});
});