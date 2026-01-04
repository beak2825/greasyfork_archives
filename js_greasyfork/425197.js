// ==UserScript==
// @name        	   Imgur Auto Redirect Homepage To Upload Page
// @namespace   	   https://greasyfork.org/en/users/241453-happysmacky3453
// @description  	   Automatically redirects you from the Imgur homepage to the upload page
// @match		 	   https://imgur.com/
// @version            1.00
// @run-at             document-start
// @author             HappySmacky3453
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/425197/Imgur%20Auto%20Redirect%20Homepage%20To%20Upload%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/425197/Imgur%20Auto%20Redirect%20Homepage%20To%20Upload%20Page.meta.js
// ==/UserScript==

window.location.replace("https://imgur.com/upload" + window.location.pathname);