// ==UserScript==
// @name         EARN
// @description  Rain Notifications
// @version      1.1
// @author       CATIORO :v | Gamdom.com
// @match        *://earn.gg/*
// @namespace    https://greasyfork.org/en/scripts/30087-gamdom-notify
// @update       https://greasyfork.org/scripts/30087-gamdom-notify/code/Gamdom%20Utils.user.js
// @run-at       document-start
// @grant        GM_notification
// @grant        GM_info
// @grant        window.focus
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/32045/EARN.user.js
// @updateURL https://update.greasyfork.org/scripts/32045/EARN.meta.js
// ==/UserScript==
var delay = 1000, start = 10, winnings = 0;
var script = document.createElement('script');
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
var current = start, max = start*Math.pow(2, 8);
function gamble() {
  console.log('current bet: ', current);
  $.get("https://earn.gg/gamble/fifty?amount=" + current, function(e) {
    if(e.won){
      console.log('won!');
      winnings = winnings + current;
      current = start;
    }
    else{
      console.log('loss');
      winnings = winnings - current;
      current = current * 2;
    }
    if(current >= max) current = start; // give up :(
    setTimeout(gamble, delay);
    console.log('current winnings: ', winnings);
  });
}
setTimeout(gamble, 1000);