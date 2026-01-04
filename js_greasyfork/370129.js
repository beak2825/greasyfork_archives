// ==UserScript==
// @name        next previous arrows for tutorials point
// @namespace   keyboard
// @description maps the next and previous buttons to the right and left arrow keys for tutorialspoint.com
// @include     https://www.tutorialspoint.com/*
// @include     http://www.tutorialspoint.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/370129/next%20previous%20arrows%20for%20tutorials%20point.user.js
// @updateURL https://update.greasyfork.org/scripts/370129/next%20previous%20arrows%20for%20tutorials%20point.meta.js
// ==/UserScript==
function leftArrowPressed() {
   document.getElementsByClassName("pre-btn")[0].getElementsByTagName("a")[0].click();
}

function rightArrowPressed() {
    document.getElementsByClassName("nxt-btn")[0].getElementsByTagName("a")[0].click();
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 37:
            leftArrowPressed();
            break;
        case 39:
            rightArrowPressed();
            break;
    }
};