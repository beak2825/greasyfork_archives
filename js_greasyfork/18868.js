// ==UserScript==
// @name        RYM Word Breaker
// @namespace   rymwordbreaker
// @description makes long text behave
// @include     https://rateyourmusic.com/
// @include     http://rateyourmusic.com/
// @include     https://rateyourmusic.com/*
// @include     http://rateyourmusic.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18868/RYM%20Word%20Breaker.user.js
// @updateURL https://update.greasyfork.org/scripts/18868/RYM%20Word%20Breaker.meta.js
// ==/UserScript==
$("blockquote").each(function (i, el) {
   $(this).css('word-break','break-word');
});
