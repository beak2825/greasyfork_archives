// ==UserScript==
// @name         privatestream.tv responsive embed
// @namespace    http://taima.tv
// @version      1.0
// @description  Makes all privatestream.tv iframes responsive to whatever they're contained in
// @author       early90spants
// @include      http://privatestream.tv/*
// @include      http://*.privatestream.tv/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/30353/privatestreamtv%20responsive%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/30353/privatestreamtv%20responsive%20embed.meta.js
// ==/UserScript==

$(document).ready(function() {
  $('body').css({'width': '100%', 'height': '100%', 'padding': '0', 'margin': '0'});
  $('body > div:first-child').css({'width': '100%', 'height': '100%', 'padding': '0', 'margin': '0'});
  $('iframe').css({'width': '100%', 'height': '100%', 'padding': '0', 'margin': '0'});
  $('#my-video_wrapper').css({'width': '100%', 'height': '100%', 'padding': '0', 'margin': '0'});
  $('#my-video_aspect').css({'width': '100%', 'height': '100%', 'padding': '0', 'margin': '0'});
  $('#my-video_jwpsrv').css({'width': '100%', 'height': '100%', 'padding': '0', 'margin': '0'});
  $('#timer_full').css({'display': 'none', 'height': '100%', 'padding': '0', 'margin': '0'});
  $('#player > div:first-child').css({'width': '100%', 'height': '100%', 'padding': '0', 'margin': '0'});
});