// ==UserScript==
// @name         YTAutoHideChat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422001/YTAutoHideChat.user.js
// @updateURL https://update.greasyfork.org/scripts/422001/YTAutoHideChat.meta.js
// ==/UserScript==

function clickButton() {
    jQuery("#show-hide-button paper-button").trigger("click");
}
jQuery.noConflict();

(function() {
    'use strict';
    setTimeout(clickButton, 3000);
    // Your code here...
})();