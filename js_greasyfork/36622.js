// ==UserScript==
// @name     Magistream Facebook Share Fix
// @description  Fixes the Facebook share button on Magistream creature pages.
// @include http://magistream.com/creature/*
// @version  1
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/63861
// @downloadURL https://update.greasyfork.org/scripts/36622/Magistream%20Facebook%20Share%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/36622/Magistream%20Facebook%20Share%20Fix.meta.js
// ==/UserScript==


var newh = "https://www.facebook.com/sharer.php?u=" + window.location.href

document.querySelector(".content > a:nth-child(8)").href = newh;