// ==UserScript==
// @name         xHamster Comments Button
// @namespace    https://greasyfork.org/en/scripts/370228-xhamster-comments-button
// @version      0.3
// @description  Replaces the "New xHamster" button with direct access to your new comments
// @author       Phlegomatic
// @match        https://xhamster.com/*
// @include      https://*.xhamster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370228/xHamster%20Comments%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/370228/xHamster%20Comments%20Button.meta.js
// ==/UserScript==

var TAG = "New Comments";
var URL = "https://xhamster.com/my/subscriptions/news?show=comments";

var cName = "design-switcher no-popunder";

document.getElementsByClassName(cName)[0].innerHTML=TAG;
document.getElementsByClassName(cName)[0].href=URL;