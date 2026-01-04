// ==UserScript==
// @name        Reboot Tube But Nice
// @namespace   Violentmonkey Scripts
// @match       https://reboot.tube/x/*
// @grant       none
// @version     1.1
// @license     GPLv3
// @author      Gum Coblin
// @description 7/21/2022, 7:35:45 AM
// @downloadURL https://update.greasyfork.org/scripts/448210/Reboot%20Tube%20But%20Nice.user.js
// @updateURL https://update.greasyfork.org/scripts/448210/Reboot%20Tube%20But%20Nice.meta.js
// ==/UserScript==
// Player Size
document.getElementById("videowrap").style.width = "85%"

// Chat visibility
document.getElementById("chatwrap").style.display = "none"

// Empty footer visibilty
document.getElementById("footer").style.display = "none"

// Padding on the left of the player to center it
document.getElementById("videowrap").style.paddingLeft = "15%"

// Set control width to 100% so the rightmost controls are on the right of the screen
document.getElementById("rightcontrols").style.width = "100%" 

var currentURL = ""
setTimeout(CreateLink, 5000)


function CreateLink(){
  // Create a variable containing the link to the currently playing video
  currentURL = document.getElementById("ytapiplayer_html5_api").src
  console.log(currentURL)
  
  // Create a link to the URL from above
  const myLink = document.createElement("a");
  myLink.href = currentURL
  myLink.style.color = "white"
  myLink.innerHTML = currentURL
  document.getElementById("mainpage").appendChild(myLink)
}