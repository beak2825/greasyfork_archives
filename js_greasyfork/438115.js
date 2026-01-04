// ==UserScript==
// @description Hide Specific User
// @name     Hide TTROY on ABB
// @match    http://audiobookbay.nl/*
// @match    http://audiobookol.com/*
// @match    http://audiobookabb.com/*
// @match    http://audiobookbay.fi/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @version  1.11

// @namespace https://greasyfork.org/en/users/861623-hannah-gbs
// @downloadURL https://update.greasyfork.org/scripts/438115/Hide%20TTROY%20on%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/438115/Hide%20TTROY%20on%20ABB.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.


$("li.alt").has (".commentRight > span > span:contains('TTROY')").hide ();
$("li").has (".commentRight > span > span:contains('TTROY')").hide ();