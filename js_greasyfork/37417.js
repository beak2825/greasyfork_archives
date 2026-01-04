// ==UserScript==
// @description Hide Specific Category
// @name     Hide Category on ABB True Crime
// @match    http://audiobookbay.nl/*
// @match    https://audiobookbay.fi/*
// @match    https://audiobookbay.li/*
// @match    https://audiobookbay.lu/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @version 0.0.24
// @namespace https://greasyfork.org/users/166367
// @downloadURL https://update.greasyfork.org/scripts/37417/Hide%20Category%20on%20ABB%20True%20Crime.user.js
// @updateURL https://update.greasyfork.org/scripts/37417/Hide%20Category%20on%20ABB%20True%20Crime.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.

$(".post").has (".postInfo:contains('True Crime')").hide ();