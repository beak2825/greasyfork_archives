// ==UserScript==
// @name Small Text on Tumblr Asks
// @description Restores traditional small text on tumblr asks. Text will only appear small for users with the script installed. This will only work on Tumblr's "vanilla" dashboard (it will not work on the Beta dashboard).
// @namespace gwennifer
// @match https://www.tumblr.com/*
// @version 1.1.0
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/402837/Small%20Text%20on%20Tumblr%20Asks.user.js
// @updateURL https://update.greasyfork.org/scripts/402837/Small%20Text%20on%20Tumblr%20Asks.meta.js
// ==/UserScript==

var interval = setInterval(smallChange, 500);

function smallChange(size){
  var mywords = document.getElementsByTagName("p");
  var answers = document.getElementsByClassName("answer post_info");

  for(var i=0; i<answers.length; i++){
     answers[i].setAttribute("style",'font-size:small');
  }
}