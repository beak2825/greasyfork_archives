// ==UserScript==
// @name FP2 CSS ANIME
// @grant GM_AddStyle
// @include http*://facepunchforum.azurewebsites.net/anime*
// @include http*://lab.facepunch.com/anime*
// @include http*://lab.facepunch.com/.*
// @include https://lab.facepunch.com/
// @include https://lab.facepunch.com
// @grant        GM_addStyle
// @namespace 
// @description Anime CSS for new facepunch
// @version 0.0.1.20160627213543
// @downloadURL https://update.greasyfork.org/scripts/20316/FP2%20CSS%20ANIME.user.js
// @updateURL https://update.greasyfork.org/scripts/20316/FP2%20CSS%20ANIME.meta.js
// ==/UserScript==

$("head").append ( '<style type="text/css"> @import url("https://files.catbox.moe/jzey9i.css"); </style>' );

console.log("Changed style of page: " + document.URL);