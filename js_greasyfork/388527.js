// ==UserScript==
// @name          Gunnerkrigg Court Arrow Navigation
// @author        EleventhEric
// @namespace     EleventhEric
// @description   Use arrow right or left to go to next or previous chapter.
// @include       *://www.gunnerkrigg.com/*
// @version       1.0
// @grant         none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388527/Gunnerkrigg%20Court%20Arrow%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/388527/Gunnerkrigg%20Court%20Arrow%20Navigation.meta.js
// ==/UserScript==

//Note: this site uses duplicate class names for "right" and "left" so I had to hard code the correct ones for going to the next or previous comic

$(document).keydown(function(e){
    // PREV CHAPTER - Left Arrow
    if (e.keyCode == 37) {document.getElementsByClassName('left')[6].click();}
    // NEXT CHAPTER - Right Arrow
    else if (e.keyCode == 39) {document.getElementsByClassName('right')[2].click();}
});

