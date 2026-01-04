// ==UserScript==
// @name         Turn off "Quick Access"
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Turn off "Quick Access" option in Host Controls (09-Jun-21)
// @author       Alexey Pyatovsky
// @match        *://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @run-at document-end

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427725/Turn%20off%20%22Quick%20Access%22.user.js
// @updateURL https://update.greasyfork.org/scripts/427725/Turn%20off%20%22Quick%20Access%22.meta.js
// ==/UserScript==


function MeetingSafetyMenu(){
    //clicking on "shield" icon to populate the menu
    var QuickAccess1 = document.querySelector('[aria-label="Host controls"]');
    QuickAccess1.click();

    //check the switch
    var QuickAccess2 = document.querySelector('[aria-label="Quick access"]');
    if(QuickAccess2.getAttribute('aria-checked') == "true"){
        //flip it because it was set to "ON"
        QuickAccess2.setAttribute("aria-checked", false);
        QuickAccess2.click();
    }
    else{
        //switch already in "OFF" position, so don't need to flip it
    }
    //stop looping
    clearAllIntervals();
    //hide the menu
    QuickAccess1.click();
}



var intervalTracking = [];
var intervalCount=0;

window.oldSetInterval = window.setInterval;
window.setInterval = (function(func, interval) {
    interval = oldSetInterval(func, interval);
    intervalTracking[++intervalCount]=interval;
    return interval;
});

function clearAllIntervals() {
    for (var i = 0 ; i <= intervalCount ; i++) {
    window.clearInterval( intervalTracking[i] );
    }
}

function worker() {
 try {
    MeetingSafetyMenu();
  } catch (e) {
    console.log(e);
  }
}

//loop every 2 seconds until we can see "Host Controls" button
setInterval(worker, 4000);