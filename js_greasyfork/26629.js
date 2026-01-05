// ==UserScript==
// @name           Grey!!
// @description    灰色！
// @author         Eric_Lian
// @version        0.0.3
// @include        http*://*
// @grant          none
// @namespace      https://greasyfork.org/users/87753
// @downloadURL https://update.greasyfork.org/scripts/26629/Grey%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/26629/Grey%21%21.meta.js
// ==/UserScript==
$(function() {
	$('html').append('<style>html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:grayscale(100%);filter:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)}</style>');
});