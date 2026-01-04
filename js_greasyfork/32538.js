// ==UserScript==
// @name	Unlock Bassrebels Downloads
// @include	http://www.bassrebels.co.uk/*
// @include	https://bassrebels.co.uk/*
// @include	https://www.bassrebels.co.uk/*
// @include	http://bassrebels.co.uk/*
// @description	Unlock Bassrebels's download link.
// @version	1
// @namespace https://greasyfork.org/users/31723
// @downloadURL https://update.greasyfork.org/scripts/32538/Unlock%20Bassrebels%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/32538/Unlock%20Bassrebels%20Downloads.meta.js
// ==/UserScript==


var html = document.body.innerHTML;
html = html.replace( /display: none;"/g, 'display: true;' );
document.body.innerHTML = html;