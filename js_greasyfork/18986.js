// ==UserScript==
// @name          invis snake
// @namespace     http:/penple.org/
// @description	  Turns all images on page to Ducks 
// @include       http://slither.*
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/18986/invis%20snake.user.js
// @updateURL https://update.greasyfork.org/scripts/18986/invis%20snake.meta.js
// ==/UserScript==

$(document).keydown(function(e) {
    switch(e.which) {

        case 38: // up
        setSkin(snake,25);
        break;

        case 40: // down
        setSkin(snake,-1);
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});