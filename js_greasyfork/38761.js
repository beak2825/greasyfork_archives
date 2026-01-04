// ==UserScript==
// @name            4chan Board List Toggle
// @namespace       4chan
// @version         1.0.5
// @description     Add a button to toggle the board list
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAACVBMVEUAAGcAAABmzDNZt9VtAAAAAXRSTlMAQObYZgAAAF5JREFUeNrtkTESABAQxPD/R6tsE2dUGYUtFJvLDKf93KevHJAjpBorAQWSBIKqFASC4G0pCAkm4GfaEvgYXl0T6HBaE97f0vmnfYHbZOMLZCx9ISdKWwjOWZSC8GYm4SUGwfYgqI4AAAAASUVORK5CYII=
// @include         https://boards.4chan.org/*
// @include         https://boards.4channel.org/*
// @include         http://boards.4channel.org/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/38761/4chan%20Board%20List%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/38761/4chan%20Board%20List%20Toggle.meta.js
// ==/UserScript==

var trigger = document.createElement('button');
trigger.id = 'trigger-btn';
var text_trigger = document.createTextNode('board');
trigger.appendChild(text_trigger);
document.body.appendChild(trigger);
var board = document.getElementById('board-list');
trigger.onclick = function() {
    board.style.bottom = '0px';
};
var close = document.createElement('button');
close.id = 'close-btn';
var text_close = document.createTextNode('close');
close.appendChild(text_close);
board.appendChild(close);
close.onclick = function() {
    board.style.bottom = '-250px';
};