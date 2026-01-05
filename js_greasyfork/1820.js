// ==UserScript==
// @name       NostalgicOverflow
// @version    4.2
// @description  Makes PhysicsOverflow.org look like how it was in the early days of the private beta See here: http://physicsoverflow.org/17999#a18004
// @match      http://physicsoverflow.org/*
// @match      http://www.physicsoverflow.org/*
// @namespace https://greasyfork.org/users/2311
// @downloadURL https://update.greasyfork.org/scripts/1820/NostalgicOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/1820/NostalgicOverflow.meta.js
// ==/UserScript==

$('.qa-logo-link img').css('display','none');
$('.qa-logo-link').append("<a href='http://physicsoverflow.org' style='font-size:36px; color:rgb(0,150,255);'>Physics Overflow</a>");  
$('.qa-nav-main-list').append($('li.qa-nav-admin-item'));
$('.qa-nav-main-list').append($('li#qa-nav-po_header-item'));
$("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: "http://question2answer.org/qa/qa-theme/Snow/qa-styles.css"
}).appendTo("head");
$(".qa-sidepanel").css("width","24%")