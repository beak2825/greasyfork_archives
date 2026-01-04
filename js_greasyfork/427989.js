// ==UserScript==
// @name         YouTube channel name log
// @description  Logs names of YouTube channels of watched videos in history to allow searching browsing history by channel owner.
// @namespace    gercomsci
// @version      1.0 beta
// @author       Gercomsci
// @run-at       document-end
// @grant        none
//
// @match        *://youtube.com/watch?v=* 
// @match        *://*.youtube.com/watch?v=* 
// @downloadURL https://update.greasyfork.org/scripts/427989/YouTube%20channel%20name%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/427989/YouTube%20channel%20name%20log.meta.js
// ==/UserScript==
 
/* Code based on https://greasyfork.org/de/scripts/427543-soundcloudlog */

// == Main code ==
 
//  Function to locate relative video URL
var channelName;
function updateChannelName() { 
    channelName = document.getElementsByClassName("slim-owner-icon-and-title")[0].getAttribute("aria-label");
    logChannelName(); 
}
 
function updateDate() {
    timestamp = new Date().toISOString(); 
    // Very practical! https://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript/8563517#8563517
}
 
function hasVideoChanged() {
    updateDate();
    if  ( channelName !== document.getElementsByClassName("slim-owner-icon-and-title")[0].getAttribute("aria-label")) {
        updateChannelName(); // read new video URL
        logChannelName();    // record it to browsing history 
        console.log('YouTube channel name log '+timestamp+': Channel name changed to '+channelName); // for debugging
    } 
  else { (0); } // Placeholder, in case necessary later.
}
 
function logChannelName() { 
        window.location.href = ("#YouTube_channel_name_log-"+timestamp+":"+channelName);
        if (navigator.userAgent.indexOf("Chrome") == -1) { // do not do this on Chromium-based browsers, as it navigates back from the non-anchored state
            javascript:history.go(-1); // Remove anchor after logging, to prevent navigation interference.
               };
        window.history.pushState('page2','Title',window.location.toString().split("#")[0]); // remove anchor to clear the URL
}
 
// Check for change every second. If change detected, apply to URL.
changeCheck = setInterval(function() { hasVideoChanged() }, 1000);
