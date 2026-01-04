// ==UserScript==
// @name     Kartable bypass
// @version  1
// @grant    none
// @include http://www.kartable.fr/* 
// @include https://www.kartable.fr/* 
// @description "Script to bypass kartable.fr"
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/173942
// @downloadURL https://update.greasyfork.org/scripts/39305/Kartable%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/39305/Kartable%20bypass.meta.js
// ==/UserScript==
setTimeout(function(){
  $("#overlayPushMoreContent").remove();
  $("kartable-modal-container").remove();
  $("kartable-app").css("overflow", "auto");
}, 5000)