// ==UserScript==
// @name         cytube_copy_emote
// @namespace    https://cytube.xyz/
// @version      1.1
// @description  エモートクリックで入力欄にエモート名をコピー
// @author       hatarake-
// @match        https://cytube.xyz/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404615/cytube_copy_emote.user.js
// @updateURL https://update.greasyfork.org/scripts/404615/cytube_copy_emote.meta.js
// ==/UserScript==

$("#messagebuffer").on("click", "img", function(){
  var chatline = $("#chatline");
  var text = chatline.val();
  text += (text == "" || text.slice(-1) == " " ? "" : " ") + this["title"];
  chatline.val(text).focus();
});