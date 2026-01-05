// ==UserScript==
// @name         PrivateStream Responsive Embed
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Stupid Website
// @author       BubbaGrace
// @include      http://privatestream.tv/*
// @include      http://*.privatestream.tv/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25409/PrivateStream%20Responsive%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/25409/PrivateStream%20Responsive%20Embed.meta.js
// ==/UserScript==

$(document).ready(function() {
  $('body').css({'width': '100%', 'height': 'auto', 'padding': '0', 'margin': '0'});
  $('body > div:first-child').css({'width': '100%', 'height': 'auto', 'padding': '0', 'margin': '0'});
  $('iframe').css({'width': '100%', 'height': 'auto', 'padding': '0', 'margin': '0'});
  $('#my-video_wrapper').css({'width': '100%', 'height': 'auto', 'padding': '0', 'margin': '0'});
  $('#my-video_aspect').css({'width': '100%', 'height': 'auto', 'padding': '0', 'margin': '0'});
  $('#my-video_jwpsrv').css({'width': '100%', 'height': 'auto', 'padding': '0', 'margin': '0'});
  $('#timer_full').css({'display': 'none', 'height': 'auto', 'padding': '0', 'margin': '0'});
});