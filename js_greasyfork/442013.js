// ==UserScript==
// @name        	   RIN Auto Redirect Homepage To Upload Page
// @namespace   	   https://greasyfork.org/en/users/241453-happysmacky3453
// @description  	   Automatically redirects you from the RIN home page to the forum page
// @match		https://cs.rin.ru/
// @version            1.00
// @run-at             document-start
// @author             happysmacky3453
// @license MIT
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/442013/RIN%20Auto%20Redirect%20Homepage%20To%20Upload%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/442013/RIN%20Auto%20Redirect%20Homepage%20To%20Upload%20Page.meta.js
// ==/UserScript==

window.location.replace("https://cs.rin.ru/forum" + window.location.pathname);