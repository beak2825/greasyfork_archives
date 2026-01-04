// ==UserScript==
// @name        Instagram Keyboard Shortcuts
// @description Helps you like/follow/browse in Instagram ultra-fast via numpad; use keys Numpad 7/9 for next/previous picture, for posts with multiple pictures use Numpad 1/3 for next/previous picture. Numpad 4/6 cycle through pictures in multiple picture post as well.  Numpad 8 for Like/Unlike, Numpad 5 for play/pause video ...Update of script made by https://www.instagram.com/dunkel1024
// @namespace   https://www.instagram.com/bigjim963
// @icon        https://www.instagram.com/favicon.ico
// @include     https://www.instagram.com/*
// @version     1.0
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/371977/Instagram%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/371977/Instagram%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

// Based on "Simple Instagram Like Bot" by JoelDare
// https://www.joeldare.com/wiki/simple_instagram_like_bot

// INSTRUCTIONS:
// Make sure you are on the Instagram Paginated Like-Page
// It looks like this: https://imgur.com/a/KB174
// Now Press:
// Numpad 8 for Like/Unlike
// Numpad 5 for play/pause video
// Numpad 9 for next post
// Numpad 7 for prev post
// Numpad 4 for Follow/Unfollow
// Numpad 3 for next image in a post
// Numpad 1 for previous image in a post
// Numpad 6 for next picture in multiple picture post, at end of pictures moves to next post
// Numpad 4 for prev picture in multiple picture post, at start of pictures moves to prev post

function getHeartElement() {
  var knownHeartElementNames = [
    'coreSpriteHeartOpen',
    'coreSpriteLikeHeartOpen',
    'coreSpriteHeartFull'
  ];
  var i = 0;
  // Loop through the known heart elements until one works
  for (i = 0; i < knownHeartElementNames.length; i++) {
    var heartElement = document.querySelector('.' + knownHeartElementNames[i]);
    if (heartElement != undefined) {
      break;
    }
  }
  return heartElement;
}



function doLike() {
  var nextElement = document.querySelector('.coreSpriteRightPaginationArrow');
  var previousElement = document.querySelector('.coreSpriteLeftPaginationArrow');
  var likeElement = getHeartElement();
  likeElement.click();
   // If you want auto-next after like, uncomment this
   // nextElement.click();
}

$(document).on('keydown', function (e) {
  
  // Find pagination element for skipping to next pic
  var nextElement = document.querySelector('.coreSpriteRightPaginationArrow');
  // Find pagination element for skipping to previous pic
  var previousElement = document.querySelector('.coreSpriteLeftPaginationArrow');

  // Find play button
  var playbutton = document.querySelector('.videoSpritePlayButton');

  // multiple pics
  var nextpic = document.querySelector('.coreSpriteRightChevron');
  var prevpic = document.querySelector('.coreSpriteLeftChevron');
  
  // Adding key "numpad 5" for video play/pause
  if (e.which == 101) { playbutton.click(); }

  // Adding key "numpad 9" for next post
  if (e.which == 105) { nextElement.click(); }
  // Adding key "numpad 7" for next post
  if (e.which == 103) { previousElement.click(); }

  // Adding key "numpad 6" for next picture in multiple picture post, at end of pictures moves to next post
  if ((e.which == 102) && (nextpic)) { nextpic.click(); }
    else if (e.which == 102) { nextElement.click(); }
  // Adding key "numpad4" for prev picture in multiple picture post, at start of pictures moves to prev post
  if ((e.which == 100) && (prevpic)) { prevpic.click(); }
    else if (e.which == 100) { previousElement.click(); }

  // Adding key "numpad 3" for next pic in multiple pic post
  if (e.which == 99) { nextpic.click(); }
  // Adding key "numpad 1" for prev pic in multiple pic post
  if (e.which == 97) { prevpic.click(); }

  // Adding key "numpad 8" for like/unlike
  if (e.which == 104) { doLike(); }
  
});