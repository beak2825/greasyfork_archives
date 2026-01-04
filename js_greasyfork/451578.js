// ==UserScript==
// @name         capturemytweet RTL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  RTL for capturemytweet.in
// @author       Javad
// @match        https://capturemytweet.in/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=capturemytweet.in
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/451578/capturemytweet%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/451578/capturemytweet%20RTL.meta.js
// ==/UserScript==

(function() {
	'use strict';
	document.querySelector("#tweetparent > div.py-2.px-2.tweet-body").dir = "auto";
	// Your code here...
})();