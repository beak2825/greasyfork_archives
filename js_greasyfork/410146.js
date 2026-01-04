// ==UserScript==
// @name        Basic KongChat Filter
// @namespace   Basic KongChat Filter
// @match       https://www.kongregate.com/games/*
// @grant       none
// @version     1.4.6
// @author      Lexiebean <lexie@lexiebean.net>
// @description Basic filter to remove messages sent by the recent chat bots.
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/410146/Basic%20KongChat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/410146/Basic%20KongChat%20Filter.meta.js
// ==/UserScript==

// *********** This script will stop working as soon as the bots update their message. DM me on discord and I'll update it. @Lexie#4024 ***********

function KongFilter() {
  var els = document.getElementsByClassName("chat-message");
  var searchValue = /(s(e|е)xy|nud(e|е).*http)/;                            //This is the message that we're looking to remove.

  //Look for spam in the last 5 messages -- Last 5 just incase 5 messages come in on a same second.
  for(var i = els.length-5; i < els.length ; i++){
    if(els[i]) {
      if (searchValue.test(els[i].innerHTML)) {
      
        spamRemoved++;
        localStorage.setItem("BKCFspamRemoved", spamRemoved);
        span.innerHTML = "Spam Removed:" + spamRemoved;
      
        var username = els[i].getElementsByTagName("span")[1].getAttribute('username');
        var searchValuej = new RegExp(username);
      
        console.log('[Basic KongChat Filter] (' + spamRemoved + ') Removing > ' + username + ': ' + els[i].getElementsByTagName("span")[3].innerHTML);   //Log the removed message
        els[i].remove();
      
        for (var j = els.length-10; j < els.length; j++){
          if(els[j]) {
            if (searchValuej.test(els[j].innerHTML)) {           
              console.log('[Basic KongChat Filter] (' + spamRemoved + ') Removing > ' + username + ': ' + els[j].getElementsByTagName("span")[3].innerHTML);   //Log the removed message
              els[j].remove();
            }
          }
        }
      }
    }
  }
}


console.log('[Basic KongChat Filter] Initializing...');

spamRemoved = 0;
//Load spamRemoved count
if (localStorage.getItem("BKCFspamRemoved")) {
  spamRemoved = localStorage.getItem("BKCFspamRemoved");
}

//Create <span> to display spamRemoved Count
var span = document.createElement("SPAN");
span.style.float = "right";
span.innerHTML = "Spam Removed:" + spamRemoved;

function initialise() {

  var hook = document.getElementById("chat_window_header").children[0];

  if (hook) { 
    hook.appendChild(span);
    setInterval(KongFilter, 1000);
    console.log('[Basic KongChat Filter] Loaded!');
    console.log('[Basic KongChat Filter] Total Removed: ' + spamRemoved);
    clearInterval(initialise);
  }
}

var initialise = setInterval(initialise, 1000);
