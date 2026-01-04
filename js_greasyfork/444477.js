// ==UserScript==
// @name        Find user profiles - Moodle
// @namespace   Violentmonkey Scripts
// @match       *://*moodle*/message/*
// @match       *://ena*/message/*
// @grant       none
// @version     1.0
// @author      -
// @description 04/05/2022, 11:05:08
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444477/Find%20user%20profiles%20-%20Moodle.user.js
// @updateURL https://update.greasyfork.org/scripts/444477/Find%20user%20profiles%20-%20Moodle.meta.js
// ==/UserScript==


// IF YOUR MOODLE'S DOMAIN NAME DOES NOT MATCH THE WILDCARD UP THERE, CHANGE THE @match ATTRIBUTE ACCORDINGLY
// AND ADD THE `/messages/*` PATH TO IT !! EXAMPLE : https://moodl.yourschool.com/message/*


var baseURL = window.location.origin;

// Refresh every 3 seconds, to see if the pane opened is the correct one
setInterval(function(){
  var button = document.getElementById("view-profile-button");
  if(button != null){
    button.remove();
  }
  refresh();
}, 3000);


function refresh(){
  var messageIndexContainer = document.querySelectorAll(`[data-region*="message-index"]`)[0];
  var viewContactContainer = messageIndexContainer.querySelectorAll(`[data-region="view-contact"]`)[0];
  var contentContainer = viewContactContainer.childNodes[1];
  if(contentContainer.childNodes[2] != undefined){
    var buttonsContainer = contentContainer.childNodes[2].childNodes[5] // Container where all user buttons are located
    var userid = buttonsContainer.childNodes[1].getAttribute("data-route-param-3");
    
    // Create button
    var viewProfileButton = document.createElement("button");
    viewProfileButton.id = "view-profile-button"
    viewProfileButton.className = "btn btn-primary btn-block "
    viewProfileButton.innerHTML = "Profile";
    viewProfileButton.userId = userid;
    viewProfileButton.addEventListener("click", function(evt){window.open(baseURL + "/user/profile.php?id=" + evt.currentTarget.userId,'_blank');})
    buttonsContainer.appendChild(viewProfileButton);
  }
}