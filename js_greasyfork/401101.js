// ==UserScript==
// @version 0.1
// @namespace matastic
// @name LaravelDebugbar navbar @BOTTOM
// @description Navbar opens bottom->up instead of default
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @include *://*.test/*
// 
// @downloadURL https://update.greasyfork.org/scripts/401101/LaravelDebugbar%20navbar%20%40BOTTOM.user.js
// @updateURL https://update.greasyfork.org/scripts/401101/LaravelDebugbar%20navbar%20%40BOTTOM.meta.js
// ==/UserScript==

$( document ).ready(function () {
  $('.phpdebugbar-header').insertAfter($('.phpdebugbar-body'));
  $('.phpdebugbar-body').css('box-shadow', '0 -20px 27px 0 #c6c6c6');

  $('.phpdebugbar-widgets-toolbar')
    .css('border', '1px solid #999')
    .css('bottom', '30px')
    .css('padding', '5px');
});