// ==UserScript==
// @name         WaniKani: Show me the buttons, please
// @namespace    sad-axolotl
// @version      1
// @description  Show the reviews and lessons buttons on the top regardless of scroll position
// @author       sad-axolotl
// @include     /^https?://(www|preview).wanikani.com(/|/dashboard)?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397738/WaniKani%3A%20Show%20me%20the%20buttons%2C%20please.user.js
// @updateURL https://update.greasyfork.org/scripts/397738/WaniKani%3A%20Show%20me%20the%20buttons%2C%20please.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('<style>').text('.navigation-shortcuts.hidden { display:flex; visibility:visible; }').appendTo(document.head)
})();