// ==UserScript==
// @name           lite.qwant without ads
// @description    Hides 2 annonces on the top of results in https://lite.qwant.com
// @include        https://lite.qwant.com*
// @include        https://lite.qwant.com/?q=*
// @include        https://lite.qwant.com/?l=*
// @include        https://lite.qwant.com/?l=fr&s=1&a=1&q=*
// @include        http://*.lite.qwant.com/*
// @include        https://*.lite.qwant.com/*
// @include        https://*.lite.qwant.*/*
// @require        http://code.jquery.com/jquery-3.3.1.min.js
// @version 0.2
// @namespace https://greasyfork.org/users/225244
// @downloadURL https://update.greasyfork.org/scripts/374265/liteqwant%20without%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/374265/liteqwant%20without%20ads.meta.js
// ==/UserScript==



// Hide ads (annonces) in lite.qwant.com
$(".result:has('.info')").hide ();