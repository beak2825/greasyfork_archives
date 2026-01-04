// ==UserScript==
// @name     		Hide tumblr Activity Likes
// @description	Removes "Likes" from tumblr activity page
// @version  		1.0
// @grant    		none
// @namespace		Tumblr-Like-Hider
// @match		https://*.tumblr.com/blog/*/activity
// @match		http://*.tumblr.com/blog/*/activity
// @downloadURL https://update.greasyfork.org/scripts/412701/Hide%20tumblr%20Activity%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/412701/Hide%20tumblr%20Activity%20Likes.meta.js
// ==/UserScript==

// Developer: https://github.com/dzamie/

// Created Oct. 8, 2020
// Removes "Likes" from the tumblr activity page. May break when tumblr updates.
// Repeats every 2 seconds. Shouldn't cause performance problems unless you put a couple thousand notes on the page.

var like_class_name = "_8n5Bm";
var repeat_time = 2*1000;

function checkAndRemove(item) {
  if(item.outerHTML.includes("liked your post")) {
    item.remove();
    return true;
  }
  return false;
}

function foo() {
  var notes = document.getElementsByClassName(like_class_name);
  var i;
  for(i = 0; i < notes.length; i ++) {
    if(checkAndRemove(notes[i])) {
      i --;
    }
  }
  
  setTimeout(foo, repeat_time);
}

foo();
