// ==UserScript==
// @name         Script for Roblox Status (CSS)
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Use this with my userstyle: https://userstyles.world/api/style/4519.user.css
// @author       cocngk
// @match        http://status.roblox.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444510/Script%20for%20Roblox%20Status%20%28CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444510/Script%20for%20Roblox%20Status%20%28CSS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sticky bar
    $(window).scroll(function(e){
  var $el = $('#statusio_status_bar');
  var isPositionFixed = ($el.css('position') == 'fixed');
  if ($(this).scrollTop() > 200 && !isPositionFixed){
    $el.css({'position': 'fixed', 'top': '0px'});
  }
  if ($(this).scrollTop() < 200 && isPositionFixed){
    $el.css({'position': 'static', 'top': '0px'});
  }
        $('.panel').mouseenter(function(){
  $('.panel').css('filter','blur(5px)'); // Blurs each .blur div
  $('.panel').css('z-index',-1);
  $(this).css('filter','blur(0px)'); // Removes blur from the currently hovered .blur div
            $(this).css('z-index',1);
  $('#statusio_status_bar').css('filter','blur(0px)');
            $('#statusio_status_bar').hide();
})
$('.panel').mouseleave(function(){
  $('.panel').css('filter','blur(0px)'); // Removes blur from all when none are hovered
  $('.panel').css('z-index',1);
    $('#statusio_status_bar').show();
})
});
})();