// ==UserScript==
// @name        Block
// @namespace   elsie
// @include     http://www.ign.com/boards/*
// @description Fuck that guy
// @version     1
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/13259/Block.user.js
// @updateURL https://update.greasyfork.org/scripts/13259/Block.meta.js
// ==/UserScript==

$(".message").each(function() {
  if($(this).attr("data-author") == "kogunenjou")
    $(this).hide();
});
