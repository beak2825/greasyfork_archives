// ==UserScript==
// @name         AVERY S-Cut
// @namespace    http://tampermonkey.net/
// @version      5.01
// @description  try to take over the world!
// @author       You
// @match        https://www.tasks2go.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391556/AVERY%20S-Cut.user.js
// @updateURL https://update.greasyfork.org/scripts/391556/AVERY%20S-Cut.meta.js
// ==/UserScript==

(function() {
    'use strict';
        window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 97) {
            document.getElementById("jspsych-image-button-response-button-0").click();
        } else if (key == 98) {
            document.getElementById("jspsych-image-button-response-button-1").click();
        } else if (key == 99) {
            document.getElementById("jspsych-image-button-response-button-2").click();
        } else if (key == 100) {
            document.getElementById("jspsych-image-button-response-button-3").click();
        } else if (key == 101) {
            document.getElementById("jspsych-image-button-response-button-4").click();

        } else if (key == 49) {
            document.getElementById("jspsych-image-button-response-button-0").click();
        } else if (key == 50) {
            document.getElementById("jspsych-image-button-response-button-1").click();
        } else if (key == 51) {
            document.getElementById("jspsych-image-button-response-button-2").click();
        } else if (key == 52) {
            document.getElementById("jspsych-image-button-response-button-3").click();
        } else if (key == 53) {
            document.getElementById("jspsych-image-button-response-button-4").click();
        }
    };
    // Your code here...
})();