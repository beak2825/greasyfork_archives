// ==UserScript==
// @name        AO Scroll top next/prew
// author       Wiktor Radecki
// @namespace   AnimeOdcinki
// @include     http://anime-odcinki.pl/*
// @version     4
// @grant       none
// @description Add to anime-odcinki.pl's players form stict to top
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22022/AO%20Scroll%20top%20nextprew.user.js
// @updateURL https://update.greasyfork.org/scripts/22022/AO%20Scroll%20top%20nextprew.meta.js
// ==/UserScript==

var div = $('#video-player-control');
var div2 = $('#video-player');
var navbarHeight = $('#navbar').height();
var divTop = div.offset().top;
$(window).scroll(function (event) {
  if ($(window).scrollTop() >= (divTop - navbarHeight - 20)){
    div.addClass('docked');
    div2.addClass('docked');
  }
   else { 
     div.removeClass('docked');
     div2.removeClass('docked');
   }
});