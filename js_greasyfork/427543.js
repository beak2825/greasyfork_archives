// ==UserScript==
// @name         SoundCloudLog
// @description  Log played SoundCloud tracks in browsing history to avoid losing music. More detailed instructions and logMode setting inside code.
// @namespace    gercomsci
// @version      1.1
// @author       Gercomsci
// @run-at       document-end
// @grant        none
//
// @match        *://soundcloud.com/* 
// @downloadURL https://update.greasyfork.org/scripts/427543/SoundCloudLog.user.js
// @updateURL https://update.greasyfork.org/scripts/427543/SoundCloudLog.meta.js
// ==/UserScript==

/*  SoundCloudLog – Never lose that tune again!
    This is my first ever user script. Feel free to fork and improve.
    Because SoundCloud is a progressive web application, music playing in background is not logged in the browsing history; only when the playback page is actually opened. 
    This user script makes clever use of browsers' logging of pushState and anchor URLs in the history, and could have saved several tracks I've lost.
*/

//  == Instructions ==
/*  Originally, I was going to release separate "variant A" and "variant B" scripts for two distinct logging modes. But I decided to combine both variants into a single script for simplicity. This preference can easily be adjusted in the source code of the script, in the "preferences" section.
    Log mode A: "pushState" generates a shareable URL. Log mode B: "URL anchor" changes the URL back to prevent interfering with history navigation. For maximum compatibility, "B" is preferred, thus it is preset.
    I might implement an in-website user interface for settings in future, but for now, this fullfills its purpose.
*/

// ----
// == Preferences ==
var logMode = "B"; // A: pushState    B: URL anchor

// ----
// == Main code ==

//  Function to locate relative track URL
var trackURL;
function updateTrackURL() { 
    trackURL = document.getElementsByClassName("playbackSoundBadge__titleLink")[0].getAttribute("href");
    logTrackURL(); 
}

function updateDate() {
    timestamp = new Date().toISOString(); 
    // Very practical! https://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript/8563517#8563517
}

function hasTrackChanged() {
    updateDate();
    if  ( trackURL !== document.getElementsByClassName("playbackSoundBadge__titleLink")[0].getAttribute("href")) {
        updateTrackURL(); // read new track URL
        logTrackURL();    // record it to browsing history 
        console.log('SoundCloudLog [mode '+logMode+'] '+timestamp+': Track URL changed to '+trackURL); // for debugging
    } 
  else { (0); } // Placeholder, in case necessary later.
}

function logTrackURL() {
    if ( logMode == "A" ) { // using pushState
        window.history.pushState('page2', 'Title', trackURL+'#SoundCloudLog-'+timestamp);
    } else { 
    if ( logMode == "B" ) { // using anchor URL
        window.location.href = ("#SoundCloudLog-"+timestamp+"-"+trackURL);
        if (navigator.userAgent.indexOf("Chrome") == -1) { // do not do this on Chromium-based browsers, as it navigates back from the non-anchored state
            javascript:history.go(-1); // Remove anchor after logging, to prevent navigation interference.
               };
        window.history.pushState('page2','Title',window.location.toString().split("#")[0]); // remove anchor to make URL of playing track more suitable for sharing. (for mode B, this is only fallback code.)
           } else { // If logMode specified in settings is invalid:
                    console.log('SoundCloudLog Error '+timestamp+': Invalid logMode: '+logMode); //debug
                    alert('SoundCloudLog Error: Invalid logMode: '+logMode+'.\nCheck the "Instructions" section of this user script\'s source code for help.'); //notify user
                    logMode = "B"; // reset mode to B, for foolproofness
        }
    }
}

// Check for change every second. If change detected, apply to URL.
changeCheck = setInterval(function() { hasTrackChanged() }, 1000);

// Original script author's committed identity: 66ace7785a9f
