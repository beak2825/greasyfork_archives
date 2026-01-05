// ==UserScript==
// @name        zive.cz - odstraneni horni reklamy
// @namespace   monnef.tk
// @include     http://www.zive.cz/*
// @include     https://www.zive.cz/*
// @version     7
// @grant       none
// @run-at      document-start
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @description:en Removes top ads from zive.cz.
// @description Removes top ads from zive.cz.
// @downloadURL https://update.greasyfork.org/scripts/23479/zivecz%20-%20odstraneni%20horni%20reklamy.user.js
// @updateURL https://update.greasyfork.org/scripts/23479/zivecz%20-%20odstraneni%20horni%20reklamy.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// This is a quick and dirty solution to those annoying ads on top of a page which are not blocked by uBlock origin, because zive tries really hard to make it difficult.
// PS: This script took like 15 minutes to write, I wonder how much money went to this "protection" of ads ;-).

var tries = 100;

function nukeAds(){
  $('div:contains("reklama")').filter(function(){
    var style = $(this).attr('style');
    return style === 'text-align:right; font:9px sans-serif;' || style === 'text-align:right; font:9px sans-serif;color:#000000';
  }).parent().remove();
  var ifr = $('iframe[style="margin:0px;width:998px;height:200px;border-style:none;"]');
  ifr.parent().parent().css('display', 'none');
  ifr.remove();
  $('.performax-logo').parent().remove();
  $('img[src$="OBA/en.png"]').first().parents().eq(5).remove();
  $('div#leader_banner_wrapper, a#left_clicable_arena, a#right_clickable_area').remove();
  $('body').css('background', '#eee');
  $('#banner-980x200').remove();
  if(tries-- > 0) { setTimeout(nukeAds, 25) }
}

setTimeout(nukeAds, 250);
