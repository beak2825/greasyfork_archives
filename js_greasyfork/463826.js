// ==UserScript==
// @name         Remove Swipe Div
// @namespace    your-namespace
// @version      1.0
// @description  Removes the div with class "swipe van-swipe"
// @match        https://www.telghub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463826/Remove%20Swipe%20Div.user.js
// @updateURL https://update.greasyfork.org/scripts/463826/Remove%20Swipe%20Div.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var swipeDiv = document.querySelector('.swipe.van-swipe');
    if (swipeDiv) {
        swipeDiv.parentNode.removeChild(swipeDiv);
    }
})();
