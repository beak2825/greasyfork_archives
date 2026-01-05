// ==UserScript==
// @name        Auto-unaway
// @namespace   Raku
// @description Automatically unsets your away
// @include     http://*.chatzy.*/*
// @version     2.0.2
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/12085/Auto-unaway.user.js
// @updateURL https://update.greasyfork.org/scripts/12085/Auto-unaway.meta.js
// ==/UserScript==
window.setInterval(function () {
  if ($('input[value="I am here!"]').is(':visible')) {
    $('input[value="I am here!"]').trigger('click');
    $('form#X144').submit();
  }
}, 150);

