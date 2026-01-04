// ==UserScript==
// @description Alert for new msg
// @name     New IM Alert
// @match    http://audiobookbay.nl/*
// @match    http://audiobookol.com/*
// @match    http://audiobookabb.com/*
// @match    https://audiobookbay.fi/*
// @match    https://audiobookbay.li/*
// @match    https://audiobookbay.lu/*
// @grant    GM_addStyle
// @version 0.0.24
// @namespace https://greasyfork.org/users/166367
// @icon           http://iconshow.me/media/images/Mixed/small-n-flat-icon/png/512/cat-alt.png
// @downloadURL https://update.greasyfork.org/scripts/370157/New%20IM%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/370157/New%20IM%20Alert.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.
var x = document.getElementById("userarea");
var y = x.getElementsByTagName("strong");
var a = parseInt(y[1].innerHTML);
if (a > "0") {
alert("New message received!");
}