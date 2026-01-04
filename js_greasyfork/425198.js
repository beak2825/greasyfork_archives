// ==UserScript==
// @name        	   YouTube Subscription Grid to List View
// @namespace   	   https://greasyfork.org/en/users/241453-happysmacky3453
// @description  	   Automatically redirects you from the grid view to the list view on the YouTube subscriptions page
// @match		 	   https://www.youtube.com/feed/subscriptions
// @version            1.00
// @run-at             document-start
// @author             HappySmacky3453
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/425198/YouTube%20Subscription%20Grid%20to%20List%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/425198/YouTube%20Subscription%20Grid%20to%20List%20View.meta.js
// ==/UserScript==

window.location.replace(window.location.pathname + "?flow=2");