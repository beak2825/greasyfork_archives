// ==UserScript==
// @name        KAT - Drunk
// @namespace   DrunkKAT
// @version     1.03
// @description Makes the screen look blurred and offsets cursor
// @require		http://code.jquery.com/jquery-latest.js
// @require		https://greasyfork.org/scripts/4872-foggy/code/Foggy.js?version=16379
// @match     http://kickass.to/*
// @match     https://kickass.to/*
// @downloadURL https://update.greasyfork.org/scripts/4721/KAT%20-%20Drunk.user.js
// @updateURL https://update.greasyfork.org/scripts/4721/KAT%20-%20Drunk.meta.js
// ==/UserScript==

// For licensing of @require scripts, see the files themselves

$( document ).ready(function() {
   $('body').foggy({
   blurRadius: 0.8,          // In pixels.
   opacity: 1,           // Falls back to a filter for IE.
   cssFilterSupport: true  // Use "-webkit-filter" where available.
   });
});

$('li').foggy({
   blurRadius: 0.75,          // In pixels.
   opacity: 0.75,           // Falls back to a filter for IE.
   cssFilterSupport: true  // Use "-webkit-filter" where available.
});

$('body').css({'cursor':'url(http://gazza-911.allalla.com/drunk_auto.cur),auto'});
$('h2').css({'cursor':'url(http://gazza-911.allalla.com/drunk_text.cur),text'});
$('.commentbody').css({'cursor':'url(http://gazza-911.allalla.com/drunk_text.cur),text'});
$('input').css({'cursor':'url(http://gazza-911.allalla.com/drunk_text.cur),text'});
$('textarea').css({'cursor':'url(http://gazza-911.allalla.com/drunk_text.cur),text'});
$('a').css({'cursor':'url(http://gazza-911.allalla.com/drunk_pointer.cur),pointer'});
$('button').css({'cursor':'url(http://gazza-911.allalla.com/drunk_pointer.cur),pointer'});