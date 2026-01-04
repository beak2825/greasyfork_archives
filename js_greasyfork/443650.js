// ==UserScript==
// @description Hide Specific User
// @name     Hide User on ABB
// @match    http://audiobookbay.nl/*
// @match    http://audiobookol.com/*
// @match    http://audiobookabb.com/*
// @match    https://audiobookbay.fi/*
// @match    https://audiobookbay.li/*
// @match    https://audiobookbay.lu/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @version 0.0.24
// @namespace https://greasyfork.org/users/166654
// @downloadURL https://update.greasyfork.org/scripts/443650/Hide%20User%20on%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/443650/Hide%20User%20on%20ABB.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.

$(".post").has (".postContent:contains('USERNAME')").hide ();