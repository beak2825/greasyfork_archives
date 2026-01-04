// ==UserScript==
// @name         YT redirect to Invidious on login request
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  Redirects youtube links to invidious instances if youtube requires you to login for geo-blocking or age restriction
// @author       Xynoth
// @match        https://www.youtube.com/watch?*
// @match        https://consent.youtube.com/m?continue=*
// @grant        none
// @inject-into  content
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/407977/YT%20redirect%20to%20Invidious%20on%20login%20request.user.js
// @updateURL https://update.greasyfork.org/scripts/407977/YT%20redirect%20to%20Invidious%20on%20login%20request.meta.js
// ==/UserScript==

(function() {
    // Edit your invidious instance in the variable below.
    // You can find a list with invidious instances at https://redirect.invidious.io/
    var invidiousInstance = "https://invidio.xamh.de";

    // Enable button to Invidious on youtube?
    var enableInvButton = true;

    // Enable youtube consent page bypass
    var bypassConsent = false;
  
    // Initial script variables
    var currentLocation = window.location.href;
    var bypassedConsent = false;
    
  
    // Checks if the consent page appears and tries to bypass it the variable is enabled
    if (currentLocation.startsWith("https://consent.") && bypassConsent == true) {
      var firstFragment = currentLocation.split("%3D")[1];
      var videoID = firstFragment.split("&gl")[0];
      bypassedConsent = true;
      currentLocation = "https://www.youtube.com/watch?v=" + videoID;
    }
  
    // Other variables
    var instanceFix = currentLocation.replace("https://www.youtube.com/watch?", invidiousInstance + "/watch?");
    var newLocation = instanceFix.replace("&feature=youtu.be", "");
    var loginWarning;
    var subscribeDiv;
    var invButton;
    var adsOnScreen;
    var nsfwTag;
    var timedLoop = 0;

    // In case we just arrived at a normal video
    if (!bypassedConsent) {
      
      // We append the "watch on invidious" button here
      subscribeDiv = document.getElementById("analytics-button");

      // We check for the "Must login" container for 5 seconds before removing checker
      var checkExist = setInterval(function() {
          loginWarning = document.querySelector(".ytp-error[role='alert']");
          nsfwTag = document.querySelector("ytd-metadata-row-renderer a.yt-formatted-string[href$='community_guidelines']");
          adsOnScreen = document.querySelector(".ytp-ad-module");
          subscribeDiv = document.querySelector("#meta-contents #analytics-button");
          invButton = document.getElementById("invidious-Button");
          if ((loginWarning && !adsOnScreen) || nsfwTag) {
              console.log("Redirecting to Invidious instance...")
              window.location.href = newLocation;
              clearInterval(checkExist);
          } else if (invButton == null && enableInvButton) {
              var watchOnInv = document.createElement("a");
              watchOnInv.setAttribute('id', "invidious-Button");
              watchOnInv.href = newLocation;
              watchOnInv.style.background = "#444";
              watchOnInv.style.fontSize = "14px";
              watchOnInv.style.textDecoration = "none";
              watchOnInv.style.color = "#fff";
              watchOnInv.style.padding = "11px 15px";
              watchOnInv.style.borderRadius = "5px";
              watchOnInv.innerHTML = "INVIDIOUS";
              console.log("Potato")
              subscribeDiv.appendChild(watchOnInv);
          } else if (timedLoop >= 5) {
              clearInterval(checkExist);
          }
          timedLoop += 1;
      }, 1000);
      
    }
    // If we arrived at the consent page with bypassConsent enabled instead
    else {
      window.location.href = newLocation;
    }
  


})();