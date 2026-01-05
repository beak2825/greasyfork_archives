// ==UserScript==
// @name Minecraft非公式ユーザーフォーラムの投稿欄の「,」を「、」に置換するスクリプト
// @namespace @h_ya58,@_lem0n_(Thanks!)
// @description 記事投稿欄の「，」を「、」に置換します。
// @include http://forum.minecraftuser.jp/posting.php*
// @include https://forum.minecraftuser.jp/posting.php*
// @include http://forum.minecraftuser.jp/ucp.php*
// @include https://forum.minecraftuser.jp/ucp.php*
// @version 1.2.0
// @grant none
// @licence https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/26204/Minecraft%E9%9D%9E%E5%85%AC%E5%BC%8F%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A9%E3%83%A0%E3%81%AE%E6%8A%95%E7%A8%BF%E6%AC%84%E3%81%AE%E3%80%8C%2C%E3%80%8D%E3%82%92%E3%80%8C%E3%80%81%E3%80%8D%E3%81%AB%E7%BD%AE%E6%8F%9B%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/26204/Minecraft%E9%9D%9E%E5%85%AC%E5%BC%8F%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A9%E3%83%A0%E3%81%AE%E6%8A%95%E7%A8%BF%E6%AC%84%E3%81%AE%E3%80%8C%2C%E3%80%8D%E3%82%92%E3%80%8C%E3%80%81%E3%80%8D%E3%81%AB%E7%BD%AE%E6%8F%9B%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

var element = document.getElementById("message");

element.onblur = function(e){
 var text = document.getElementById("message").value;
 document.getElementById("message").value = text.replace(/，/g,"、");
};
element.onfocus = function(e){
 var text = document.getElementById("message").value;
 document.getElementById("message").value = text.replace(/，/g,"、");
};