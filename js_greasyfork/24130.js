// ==UserScript==
// @name         sergey movies $.05
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Selects default values and focuses textbox
// @author       Sam Burger
// @grant        none
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/24130/sergey%20movies%20%2405.user.js
// @updateURL https://update.greasyfork.org/scripts/24130/sergey%20movies%20%2405.meta.js
// ==/UserScript==


document.getElementsByName("suggestedtags")[0].focus();
document.getElementsByName("tag1")[0].click();
document.getElementsByName("recentlyseen")[1].click();
