// ==UserScript==
// @name        Facebook recent
// @namespace   alt.io
// @include     https://www.facebook.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1
// @grant       none
// @description This just sets the Facebook F icon to display the newsfeed in Recents order, rather than the default Top order.  Saves clicking the ... menu each time.
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/32348/Facebook%20recent.user.js
// @updateURL https://update.greasyfork.org/scripts/32348/Facebook%20recent.meta.js
// ==/UserScript==
var _href = $('a._19eb').attr('href');
$('a._19eb').attr('href', _href + '&sk=h_chr');
