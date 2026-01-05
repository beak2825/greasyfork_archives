// ==UserScript==
// @name FP2 CSS
// @grant GM_AddStyle
// @include http*://facepunchforum.azurewebsites.net*
// @include http*://lab.facepunch.com*
// @grant        GM_addStyle
// @namespace 
// @description General CSS for new facepunch
// @version 0.0.1.20160606142410
// @downloadURL https://update.greasyfork.org/scripts/20252/FP2%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/20252/FP2%20CSS.meta.js
// ==/UserScript==

$("head").append ( '<style type="text/css"> @import url("https://files.catbox.moe/ii0kln.css"); </style>' );

console.log("Changed style of page: " + document.URL);

