// ==UserScript==
// @name Instagram Feed Auto Like
// @description instagram.com like user feed, auto likeer, best ever!
// @namespace Violentmonkey Scripts
// @match https://*.instagram.com/*
// https://www.instagram.com/*/*
// https://www.instagram.com/*/*/*
// https://www.instagram.com/*/*/*/*
// @grant none
// @version 0.1.0
// @downloadURL https://update.greasyfork.org/scripts/381886/Instagram%20Feed%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/381886/Instagram%20Feed%20Auto%20Like.meta.js
// ==/UserScript==


var likes = 0; // initial likes set to 0, result will be visible in console log (ctrl+shift+i, click console)
var scrooltobottom = 200; //we will scrool bottom 200px

// Just checking if page loaded an
// Find this face it where program jump to start <(O.O)>
window.addEventListener('DOMContentLoaded', function() {
  console.log('window - DOMContentLoaded - bubble'); // 3rd
function simulateCliks(el, evntType){
  if (el.fireEvent) {
    el.fireEvent('on' + evntType);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(evntType, true, false);
    el.dispatchEvent(evObj);
  }
  likes++;
}
//  <span class="glyphsSpriteHeart__filled__24__red_5 Szr5J">Unlike</span>
//  <span class="glyphsSpriteHeart__outline__24__grey_9 Szr5J">Like</span>
var greyHearts = [];   //	Array of unliked things
var likeButton = [];   //	Array of buttons
var scrooltobottom =0;
var fixedScrool = 1600; //	scrool for 600 px
var timerInt = 7000; //	7 sec

// <(O.O)> starting here with timer
  setInterval(function(){
    // Selecting all not "Liked Hearts"
    // So we will click "Like" and "Next"
    // Each time then pass simulateCliks function
    //greyHearts = document.getElementsByClassName("glyphsSpriteHeart__outline__24__grey_9");
    greyHearts = document.getElementsByClassName("fr66n");
    console.log(greyHearts);
    var childrenSpanIsHeart = greyHearts[likes].firstChild.firstChild;
    simulateCliks(childrenSpanIsHeart, 'click', likes);
		// Finding right buttons
    window.scrollTo(0,scrooltobottom);
    scrooltobottom=scrooltobottom+fixedScrool;
    console.log(likes+"-- likes for this session");
    // Ctrl+Shift+I
    // Find Console and see stats
    // Thats all folks
  }, timerInt);
});
