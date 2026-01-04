// ==UserScript==
// @name         Hide Review Accuracy
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Hide the review accuracy in the top right during review sessions
// @author       RysingDragon
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370528/Hide%20Review%20Accuracy.user.js
// @updateURL https://update.greasyfork.org/scripts/370528/Hide%20Review%20Accuracy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var thumb = document.getElementsByClassName("fa-thumbs-up")[0];
    thumb.parentNode.removeChild(thumb);

    var accuracy = document.getElementById("correct-rate");
    accuracy.parentNode.removeChild(accuracy);
})();