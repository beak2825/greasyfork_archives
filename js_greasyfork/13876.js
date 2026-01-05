// ==UserScript==
// @name        Disable Fixed Header
// @namespace   https://greasyfork.org/en/users/20118
// @description Changes the CSS of the header of http://tsumino.com on doujin pages from "fixed" to "absolute".
// @include     http://tsumino.com/Home/Read/*
// @version     1.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// Credits:     Thank you Toby for the help.
// @downloadURL https://update.greasyfork.org/scripts/13876/Disable%20Fixed%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/13876/Disable%20Fixed%20Header.meta.js
// ==/UserScript==
$(".navbar-fixed-top").css("position","absolute");