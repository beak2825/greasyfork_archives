// ==UserScript==
// @name        	   Discord Auto Redirect Homepage To App Page
// @namespace   	   https://greasyfork.org/en/users/241453-happysmacky3453
// @description  	   Automatically redirects you from the Discord homepage to the app page
// @match  	  	       https://discord.com/
// @version            1.00
// @run-at             document-start
// @author             happysmacky3453
// @license MIT
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/443738/Discord%20Auto%20Redirect%20Homepage%20To%20App%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/443738/Discord%20Auto%20Redirect%20Homepage%20To%20App%20Page.meta.js
// ==/UserScript==

window.location.replace("https://discord.com/app" + window.location.pathname);