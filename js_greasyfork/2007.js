// ==UserScript==
// @name        Navigation Improvements for Surviving the World
// @namespace   http://userscripts.org/users/scuzzball
// @description Keyboard Navigation
// @include     http://survivingtheworld.net/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2007/Navigation%20Improvements%20for%20Surviving%20the%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/2007/Navigation%20Improvements%20for%20Surviving%20the%20World.meta.js
// ==/UserScript==


navNext = document.getElementsByClassName('next')[0].childNodes[1].href;
navPrev = document.getElementsByClassName('previous')[0].childNodes[1].href

function leftArrowPressed() {
   window.location = navPrev;
}

function rightArrowPressed() {
   window.location = navNext;
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
