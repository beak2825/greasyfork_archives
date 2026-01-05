// ==UserScript==
// @name         DR spoilersOnClick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show spoilers on click
// @author       kaffekop
// @match        http://www.dailyrush.dk/*
// @match        http://dailyrush.dk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22597/DR%20spoilersOnClick.user.js
// @updateURL https://update.greasyfork.org/scripts/22597/DR%20spoilersOnClick.meta.js
// ==/UserScript==

// http://www.greasespot.net/2012/08/greasemonkey-10-jquery-broken-with.html
this.$ = this.jQuery = jQuery.noConflict(true); // GM/jQ v1.0 quickfix

$("span.d4pbbc-spoiler").replaceWith(function () {
    return $("<div class='d4pbbc-spoiler'>").append( $(this).contents() );
});
$('.d4pbbc-spoiler').each(function(){
	$(this).before('<span class="toggle-spoiler" style="cursor:pointer;font-weight:bold;">[SPOILER]</span>').hide();
});
$('.toggle-spoiler').on('click', function(){
	$(this).next('.d4pbbc-spoiler').css('background','#FFF').css('color','#222').css('border','2px dashed red').css('padding','4px').toggle();
});