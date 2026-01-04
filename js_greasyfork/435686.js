// ==UserScript==
// @name	GettyImages without watermarks
// @include	http://www.gettyimages.co.uk/detail/*
// @include	https://gettyimages.co.uk/detail/*
// @include	https://www.gettyimages.co.uk/detail/*
// @description	Remove GettyImages' watermarks.
// @version	1.2
// @namespace https://greasyfork.org/users/31723
// @downloadURL https://update.greasyfork.org/scripts/435686/GettyImages%20without%20watermarks.user.js
// @updateURL https://update.greasyfork.org/scripts/435686/GettyImages%20without%20watermarks.meta.js
// ==/UserScript==


var html = document.body.innerHTML;
html = html.replace( /w=0/g, 'w=125' );
html = html.replace( /s=2048x2048/g, 's=2048x2048&w=125' );
document.body.innerHTML = html;