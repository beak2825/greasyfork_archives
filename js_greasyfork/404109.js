// ==UserScript==
// @name     Terragen Wiki Tab Fix
// @description A temporary fix for Terragen Documentation Tab Menus
// @version  1
// @grant    none
// @include https://planetside.co.uk/wiki/*
// @icon https://planetside.co.uk/favicon.ico
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @namespace https://greasyfork.org/users/572379
// @downloadURL https://update.greasyfork.org/scripts/404109/Terragen%20Wiki%20Tab%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/404109/Terragen%20Wiki%20Tab%20Fix.meta.js
// ==/UserScript==

$(function(){
  
  $("#p-cactions").css("top", "0.2em");
  $("#p-personal > h3:nth-child(1)").css({"opacity":"0","display":"inline"});
  $("#p-cactions > h3:nth-child(1)").css("opacity", "0");
  
});