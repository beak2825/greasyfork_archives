// ==UserScript==
// @name		wiki open image
// @version		2.3
// @description	wiki
// @include		https://*.wikia.com/wiki/*
// @include		https://*.fandom.com/wiki/*
// @include		https://*.wikia.nocookie.net/*
// @grant		none
// @run-at		document-end
// @namespace https://greasyfork.org/users/85
// @downloadURL https://update.greasyfork.org/scripts/2639/wiki%20open%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/2639/wiki%20open%20image.meta.js
// ==/UserScript==

var temp=/^https?:\/\/.*\.(wikia|fandom)\.com\/wiki\/file/i;
if(temp.test(location.href)) temp=document.getElementsByClassName("internal")[0];
var a = temp.href.split("/revision");
temp.href=a[0];
temp.click();