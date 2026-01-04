// ==UserScript==
// @name        Twitter CharCount Enabler
// @namespace   twittercharcount
// @description Versteckt Beiträge von bestimmten Usern auf DBNA.
// @include     http://*.twitter.com/*
// @include     https://*.twitter.com/*
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34936/Twitter%20CharCount%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/34936/Twitter%20CharCount%20Enabler.meta.js
// ==/UserScript==

//Tweetboxen bekommen
var tweetBox = document.getElementById("tweet-box-global");

//Länge bekommen
var tweetLength = tweetBox.innerText.length;

//Länge ausgeben
alert(tweetLength);