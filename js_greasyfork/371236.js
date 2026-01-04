// ==UserScript==
// @name         GoogleIsWatchingYou
// @namespace    https://openuserjs.org/users/sammcj
// @version      0.3
// @description  Warns with a pop-up if signed into Google / YouTube
// @author       Sam McLeod
// @twitter      https://twitter.com/s_mcleod
// @copywrite    2018, Sam McLeod
// @license      MIT
// @include     /^https?://www\.google\.com.*/.*$/
// @include     /^https?://www\.youtube\.com.*/.*$/
// @exclude     /^https?://www.google.com/recaptcha/.*
// @grant        metadata
// @downloadURL https://update.greasyfork.org/scripts/371236/GoogleIsWatchingYou.user.js
// @updateURL https://update.greasyfork.org/scripts/371236/GoogleIsWatchingYou.meta.js
// ==/UserScript==

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_using_XPath_in_JavaScript
var xpathResult = document.evaluate('count(//*[@id="gb_70"])', document, null, XPathResult.ANY_TYPE, null);

if (xpathResult.numberValue === 0) {
  alert("WARNING: You are signed into Google!");
}