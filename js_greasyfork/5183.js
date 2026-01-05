// ==UserScript==
// @name		Hacker Experience
// @version		0.0.1
// @description		Hacker Experience Helper
// @include		https://hackerexperience.com/*
// @namespace https://greasyfork.org/users/5507
// @downloadURL https://update.greasyfork.org/scripts/5183/Hacker%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/5183/Hacker%20Experience.meta.js
// ==/UserScript==

var Ads = document.getElementById("lower-ad");

if (Ads) {
    Ads.parentNode.removeChild(Ads);
}