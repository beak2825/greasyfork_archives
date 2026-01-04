// ==UserScript==
// @name         SV NavButtonKeys
// @namespace    https://forums.sufficientvelocity.com/*
// @version      1
// @description  try to take over the world!
// @author       TCGM
// @match        https://forums.sufficientvelocity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402030/SV%20NavButtonKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/402030/SV%20NavButtonKeys.meta.js
// ==/UserScript==

//This script can likely be modified to work on other websites such as SB or QQ, you'd just need to replace backButton and nextButton Element Classes with the proper class of their back and next buttons.

var scriptName = "SV NavButtonKeys";
var backButtonElementClass = "pageNav-jump--prev";
var nextButtonElementClass = "pageNav-jump--next";
var backButton;
var nextButton;
var ctrlDown = false;
var ctrlKey = 17;
var cmdKey = 91;

(function() {
    'use strict';

    backButton = document.getElementsByClassName(backButtonElementClass)[0];
    console.log(scriptName, "Back button check: " + backButton);
    nextButton = document.getElementsByClassName(nextButtonElementClass)[0];
    console.log(scriptName, "Next button check: " + nextButton);

    if(backButton!=null) {
        console.log(scriptName, "Back button Found!");
    }

    if(nextButton!=null) {
        console.log(scriptName, "Next button Found!");
    }

    // Your code here...
})();

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            if(ctrlDown == true) {
                if(backButton!=null) {
                    backButton.click();
                }
            }
        break;

        case 39: // right
            if(ctrlDown == true) {
                if(nextButton!=null) {
                    nextButton.click();
                }
            }
        break;

        case ctrlKey:
            ctrlDown = true;
            break;

        case cmdKey:
            ctrlDown = true;
            break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
$(document).keyup(function(e) {
    switch(e.which) {
        case ctrlKey:
            ctrlDown = false;
            break;

        case cmdKey:
            ctrlDown = false;
            break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});