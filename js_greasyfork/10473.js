// ==UserScript==
// @name        bungie-hideheader
// @namespace   SamPittman
// @include     https://www.bungie.net/*
// @version     4
// @grant       none
// @description This hides the video header at the top of the Bungie webpage.  The video is obnoxious.  Version 3 also hides the regular banner. Version 4 also hides promo ads.

// @downloadURL https://update.greasyfork.org/scripts/10473/bungie-hideheader.user.js
// @updateURL https://update.greasyfork.org/scripts/10473/bungie-hideheader.meta.js
// ==/UserScript==

//console.log('= Hide bungie header =');

// remove the stupid "promo" advertisement
var badSpan = document.evaluate("//a[contains(concat(' ',normalize-space(@class),' '), 'promo')]",
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var badHtmlElement = badSpan.snapshotItem (0);
//console.log(badHtmlElement);
if ( null != badHtmlElement) badHtmlElement.style.visibility = 'hidden';

var badSpan = document.evaluate("//*[@class='video-link']",
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
//console.log(badSpan);
var badHtmlElement = badSpan.snapshotItem (0);
//console.log(badHtmlElement);
if ( null != badHtmlElement) badHtmlElement.style.visibility = 'hidden';

var badSpan = document.evaluate("//*[@class='callout ']",
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var badHtmlElement = badSpan.snapshotItem (0);
//console.log(badHtmlElement);
if ( null != badHtmlElement) badHtmlElement.style.visibility = 'hidden';
