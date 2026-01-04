// ==UserScript==
// @description Hide Specific User
// @name     Hide User on ABB
// @match    http://audiobookbay.nl/*
// @match    http://audiobookol.com/*
// @match    http://audiobookabb.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @version 0.0.1.20180610142044
// @namespace https://greasyfork.org/users/166367
// @downloadURL https://update.greasyfork.org/scripts/373417/Hide%20User%20on%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/373417/Hide%20User%20on%20ABB.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.

$(".post").has (".postContent:contains('USERNAME')").hide ();