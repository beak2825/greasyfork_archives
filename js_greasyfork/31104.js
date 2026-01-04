// ==UserScript==
// @name        Desktop Notifications for YourTurnMyTurn
// @namespace   ktaragorn
// @include     https://www.yourturnmyturn.com/status.php
// @description Desktop Notifications for YourTurnMyTurn.com overview page when it is your turn
// @version     6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31104/Desktop%20Notifications%20for%20YourTurnMyTurn.user.js
// @updateURL https://update.greasyfork.org/scripts/31104/Desktop%20Notifications%20for%20YourTurnMyTurn.meta.js
// ==/UserScript==

function refresh()
{ 
    if(!is_your_turn()){
      console.log("refreshing")
      location.reload();
    }
}

function is_your_turn(){
  var search_for="It is not your turn right now."
  return (
    document.documentElement.textContent || document.documentElement.innerText
  ).indexOf(search_for) === -1
}

function notify(){
  var notification = new Notification("Its your turn", {
    sticky: true, 
    icon:"https://www.yourturnmyturn.com/favicon.ico", 
    requireInteraction: true})
  alert("Your turn") // stop gap fix until firefox fixes the requireinteraction feature
}

function setup_notifications() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

$(function(){if(is_your_turn()) notify();})


setup_notifications()
var refreshTime = 15;
window.setTimeout(refresh,refreshTime * 1000);