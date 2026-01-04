// ==UserScript==
// @name        CyTube But Nice 2
// @namespace   Violentmonkey Scripts
// @match       https://cytu.be/*
// @grant       none
// @version     1.5
// @license     GPLv2
// @author      Gum Coblin
// @description 29/08/2023, 06:02:02
// @downloadURL https://update.greasyfork.org/scripts/474122/CyTube%20But%20Nice%202.user.js
// @updateURL https://update.greasyfork.org/scripts/474122/CyTube%20But%20Nice%202.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function styling() {
    // Wide video player
    document.getElementById("videowrap").style.width = "85%";

    // Chat visibility
    document.getElementById("chatwrap").style.display = "none";

    // Empty footer visibilty
    document.getElementById("footer").style.display = "none";

    // Poll visibilty
    document.getElementById("pollwrap").style.display = "none";

    // Padding on the left of the player to center it
    document.getElementById("videowrap").style.paddingLeft = "15%";

    // Set control width to 100% so the rightmost controls are on the right of the screen
    document.getElementById("rightcontrols").style.width = "100%";
  }



  var currentURL = "";
  //setTimeout(CreateLink, 5000)

  var interval = 100;
  setInterval(recurringTasks, interval);

  function recurringTasks() {
    CreateLink();
    HideMOTD();
    interval = 10000;
  }

  function HideMOTD() {
    // If it's currently visible, hide it; otherwise show it
    if (window.getComputedStyle(motd).display !== "none") {
        motd.style.display = "none";
    }
  }

  function CreateLink() {
    // Create a variable containing the link to the currently playing video
    currentURL = document.getElementById("ytapiplayer_html5_api").src;
    if (currentURL == null) {return;}
    console.log(currentURL);

    if (document.getElementById("video_link") == null) {
      const linkContainer = document.createElement("p");
      linkContainer.innerHTML = "Direct media link: ";
      const myLink = document.createElement("a");
      myLink.href = currentURL;
      myLink.id = "video_link";
      myLink.style.color = "white";
      myLink.innerHTML = currentURL;
      linkContainer.appendChild(myLink);
      document.getElementById("rightcontrols").appendChild(linkContainer);
    }
    document.getElementById("video_link").innerHTML = currentURL;
    document.getElementById("video_link").href = currentURL;
    currentURL = "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", styling);
  } else {
    styling();
  }
})();
