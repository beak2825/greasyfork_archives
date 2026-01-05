// ==UserScript==
// @name        RYM spoiler removal
// @namespace   spoilerdestroyer
// @description destroys RYM Spoilers
// @include     https://rateyourmusic.com/
// @include     http://rateyourmusic.com/
// @include     https://rateyourmusic.com/*
// @include     http://rateyourmusic.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18763/RYM%20spoiler%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/18763/RYM%20spoiler%20removal.meta.js
// ==/UserScript==
//Static stars
$("span[id^='spoiler']:not(span[id^='spoilerinner'])").each(function (i, el) {
   $(this).html('<span class="spoiler">spoiler begins</span>');
});
$("span[id^='spoilerinner']").each(function (i, el) {
   $(this).css('display','inline-block');
   $(this).append("<span class='spoiler'>spoiler ends</span>");
});