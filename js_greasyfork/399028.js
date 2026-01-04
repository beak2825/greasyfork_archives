// ==UserScript==
// @name        Remove FB Live Video Emojis
// @namespace   fbliveemojis.com
// @match       https://www.facebook.com/*
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @grant       none
// @version     1.0
// @description 3/30/2020, 3:49:14 PM
// @downloadURL https://update.greasyfork.org/scripts/399028/Remove%20FB%20Live%20Video%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/399028/Remove%20FB%20Live%20Video%20Emojis.meta.js
// ==/UserScript==

function removeEmojiLane() {
  console.log("removeEmojiLane");
  var emojiLane = $('._3htz._3ah-');
  if (emojiLane != null) {
    emojiLane.remove();
    console.log("emojis removed");
  }  
}

$(document).ready(function() {
  setTimeout(removeEmojiLane, 1000);
});

$(document).focus(function() {
  removeEmojiLane();
});

$(document).blur(function() {
  removeEmojiLane();
});
