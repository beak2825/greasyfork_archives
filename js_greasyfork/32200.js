// ==UserScript==
// @name        Youtube video section cleaner
// @description Unclutters the video page on Youtube's video section and resizes it
// @include     /^http(|s)://www\.youtube\.com/watch\?v=.*$/
// @grant       none
// @author      iceman94
// @copyright   2014+, iceman94
// @version     0.01
// @grant       none
// @namespace   2883c859593dd67ceaea42331264acf6
// @downloadURL https://update.greasyfork.org/scripts/32200/Youtube%20video%20section%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/32200/Youtube%20video%20section%20cleaner.meta.js
// ==/UserScript==


// Wraps all the code in a single function to bypass issues with some browsers
function main()
{

// Gets browser's current height and width
var w = window.screen.availWidth;
var h = window.screen.availHeight;

// Sets video player size to browser's size minus reserved height and width
var rh = 5;
var rw = 5;
var vw = rw * w / 100;
vw = w - vw;
var vh = rh * w / 100;
vh = h - vh;

// Video container manipulation
var vidc = document.getElementsByClassName('html5-video-container')[0];
vidc.style.width = vw + 'px';
vidc.style.height = vh + 'px';

// Adds the video container directly to the body
var bdy = document.getElementById('body');
bdy.appendChild(vidc);

// Main video manipulation
var vidm = document.getElementsByClassName('video-stream html5-main-video')[0];
vidm.style.width = vw + 'px';
vidm.style.height = vh + 'px';

// Removes all clutter but the video container itself
var clutter = document.getElementById('body-container');
clutter.parentNode.removeChild(clutter);


}; //<-- DON'T REMOVE, CLOSES MAIN FUNCTION

// Call the main function with a delay of 1 second
setTimeout(main, 100);
