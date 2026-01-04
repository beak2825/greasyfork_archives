// ==UserScript==
// @name     Wista
// @version	1.2001
// @description Hide readed article
// @include    https://codewithmosh.com/*
// @include    http://codewithmosh.com/* 
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @namespace https://greasyfork.org/users/38384
// @downloadURL https://update.greasyfork.org/scripts/375012/Wista.user.js
// @updateURL https://update.greasyfork.org/scripts/375012/Wista.meta.js
// ==/UserScript==

jQuery(function() {
   var x = jQuery("div.attachment-wistia-player").attr("data-wistia-id");
   jQuery(".lecture-content").prepend("http://fast.wistia.net/embed/iframe/" + x);
   
   jQuery("#lecture_complete_button").click(function() {
     setTimeout(function() {
       var x = jQuery("div.attachment-wistia-player").attr("data-wistia-id");
       jQuery(".lecture-content").prepend("http://fast.wistia.net/embed/iframe/" + x);
   
     }, 3000);
   });
});