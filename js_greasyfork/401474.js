// ==UserScript==
// @name        kijiji.ca Sanitizer
// @namespace   kijiji sanitizer
// @author      lobo
// @version     1.4.6
// @include     https://*.kijiji.ca/*
// @include     http://*.kijiji.ca/*
// @grant       none
// @description Removes ads and hides divs based on keywords
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33547/kijijica%20Sanitizer.user.js
// @updateURL https://update.greasyfork.org/scripts/33547/kijijica%20Sanitizer.meta.js
// ==/UserScript==

$('.third-party').css('display', 'none');
$('#AdsenseTop').css('display', 'none');
$('div#InlineBanner').css('display', 'none');
$('[data-fes-id="admarktTopSpot"]').css('display', 'none');
$('.top-feature').css('display', 'none');
//top-ads-top-bar
$('.top-ads-top-bar').css('display', 'none');
//srp-bottom-links
$('.srp-bottom-links').css('display', 'none');
//kill ebay
$(".fes-pagelet > [data-fes-id*='Tree']").css('display', 'none');

//add your words to this array - lower case only. Back up your words as they will reset if the script updates
    var array = [ "pomerleau", "uniway", "cashopolis" ];
    $('.description p').each(function() {
    var ourText = $(this).text().toLowerCase(); // convert text to Lowercase
    if( (new RegExp( '\\b' + array.join('\\b|\\b') + '\\b') ).test(ourText) ) {
      $(this).parents().eq(2).css('display', 'none');
    }
  });