// ==UserScript==
// @name        	   CommBank Auto Redirect Homepage To NetBank Page
// @namespace   	   https://greasyfork.org/en/users/241453-happysmacky3453
// @description  	   Automatically redirects you from the CommBank home page to the NetBank page
// @match  	  	       https://www.commbank.com.au/
// @version            1.00
// @run-at             document-start
// @author             happysmacky3453
// @license MIT
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/444300/CommBank%20Auto%20Redirect%20Homepage%20To%20NetBank%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/444300/CommBank%20Auto%20Redirect%20Homepage%20To%20NetBank%20Page.meta.js
// ==/UserScript==

window.location.replace("https://www.my.commbank.com.au/netbank/Logon/Logon.aspx" + window.location.pathname);