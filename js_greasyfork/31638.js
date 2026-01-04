// ==UserScript==
// @name        Instagram Keyboard Shortcuts
// @description Helps you like/follow/browse in Instagram ultra-fast via keyboard; use keys A/D/Left/Right for next/previous picture, W/Up for Like/Unlike, S/Down for follow/unfollow ... made by https://www.instagram.com/dunkel1024
// @namespace   https://www.instagram.com/dunkel1024
// @icon        https://www.instagram.com/favicon.ico
// @include     https://www.instagram.com/*
// @version     1.0
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/31638/Instagram%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/31638/Instagram%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

// Based on "Simple Instagram Like Bot" by JoelDare
// https://www.joeldare.com/wiki/simple_instagram_like_bot

// INSTRUCTIONS:
// Make sure you are on the Instagram Paginated Like-Page
// It looks like this: https://imgur.com/a/KB174
// Now Press:
// "w" or ArrowUp for Like/Unlike
// "a" or LeftArrow for previous picture
// "d" or RightArrow for next picture
// "s" or "DownArrow for Follow/Unfollow

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
 
  var buttonElement = $('span > button:contains("Follow")');
  console.log(buttonElement);
  
  // Adding key "s" and ArrowDown for follow/unfollow
  if ((e.which == 83) || (e.which == 40)) { buttonElement.click(); }
  // Adding key "w" and ArrowUp for like/unlike
  if ((e.which == 87) || (e.which == 38)) { doLike(); }
  // Adding key "d" for next pic
  if (e.which == 68) { nextElement.click(); }
  // Adding key "a" for prev pic
  if (e.which == 65) { previousElement.click(); }

  
  
});