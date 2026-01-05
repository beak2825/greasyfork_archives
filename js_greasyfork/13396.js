// ==UserScript==
// @name        Chatzy time align
// @namespace   Raku
// @description Fixes time align
// @include     http://*.chatzy.com/*
// @version     1.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13396/Chatzy%20time%20align.user.js
// @updateURL https://update.greasyfork.org/scripts/13396/Chatzy%20time%20align.meta.js
// ==/UserScript==
window.setInterval(function () {
  $('.a').each(function () {
    $('.X724', $(this)).prependTo($(this));
  });
}, 64);
// Thanks dust ;3c
