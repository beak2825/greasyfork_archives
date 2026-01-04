// ==UserScript==
// @name        botlike4like
// @namespace   like4like
// @include     http://www.like4like.org/user/earn-facebook.php
// @version     1
// @description AntiBot script
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36516/botlike4like.user.js
// @updateURL https://update.greasyfork.org/scripts/36516/botlike4like.meta.js
// ==/UserScript==

$('a').each(function(){
   if($(this).css('background-image')=='url("http://www.like4like.org/img/icon/earn-facebook-like-antibot.png")'){
       $(this).parent().remove();
   } 
});