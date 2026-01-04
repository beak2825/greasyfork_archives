// ==UserScript==
// @name         Litcharts ShakesCLEARE Unlocker
// @version      1.0
// @description  Unlock Litcharts ShakesCLEARE translation without paying for the A+ Subscription
// @author       nightshade
// @match        https://www.litcharts.com/
// @include      *://*litcharts.com/*
// @grant        none
// @namespace https://greasyfork.org/users/824640
// @downloadURL https://update.greasyfork.org/scripts/433806/Litcharts%20ShakesCLEARE%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/433806/Litcharts%20ShakesCLEARE%20Unlocker.meta.js
// ==/UserScript==

//get paywalled text
var userTypeNodes = $(".paywall");
//remove paywall modifier
userTypeNodes.removeClass ("paywall");