// ==UserScript==
// @name         hide review accuracy new
// @version      1.0
// @description  hide the review accuracy in the top right during review sessions
// @author       fen
// @match        https://www.wanikani.com/subjects/review
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1060865
// @downloadURL https://update.greasyfork.org/scripts/464082/hide%20review%20accuracy%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/464082/hide%20review%20accuracy%20new.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var thumb = document.getElementsByClassName("fa-thumbs-up")[0];
    thumb.parentElement.parentElement.style.visibility = 'hidden';
})();