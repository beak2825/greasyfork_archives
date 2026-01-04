// ==UserScript==
// @name         Google AdSense Ads Remover
// @namespace    https://openuserjs.org/users/ner0
// @description  Removes Google ads from its search results
// @icon         https://www.google.com/adsense/start/images/favicon.ico
// @author       ner0
// @copyright    2020, ner0 (https://openuserjs.org/users/ner0)
// @license      MIT
// @version      0.1
// @supportURL   https://openuserjs.org/scripts/ner0/Google_AdSense_Ads_Remover/issues
//
// @grant        none
// @include      https://www.google.*/search*
// @downloadURL https://update.greasyfork.org/scripts/426836/Google%20AdSense%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/426836/Google%20AdSense%20Ads%20Remover.meta.js
// ==/UserScript==


// Find all ads-ad class elements and remove them from the page
document.querySelectorAll(".ads-ad").forEach(element => element.remove());