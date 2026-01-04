// ==UserScript==
// @name         Keep Outlook/Teams/Sharepoint Alive
// @version      1
// @description  Simulates user activity on a webpage by refreshing the page to prevent it from logging out due to inactivity, with reset if user interacts
// @match        https://outlook.office.com/*
// @match        https://outlook.office365.com/*
// @match        https://teams.microsoft.com/*
// @match        https://*-my.sharepoint.com/*
// @author       chaoscreater
// @grant        none
// @namespace    outlookalive.pureandapplied.com.au
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/486306/Keep%20OutlookTeamsSharepoint%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/486306/Keep%20OutlookTeamsSharepoint%20Alive.meta.js
// ==/UserScript==

// (function() {
//     const timeOutMinutes = 15;
//     //console.log("ohai");
//     var timer = setInterval(function() {
//         console.log("reloading");
//         location.reload();
//     }, timeOutMinutes * 60 * 1000); // Reload the page every 15 minutes

//     document.addEventListener("click", resetTimer);
//     document.addEventListener("mousemove", resetTimer);
//     document.addEventListener("keypress", resetTimer);

//     function resetTimer() {
//         //console.log("timer reset");
//         clearInterval(timer);
//         var timer = setInterval(
//             function() {
//                 location.reload();
//             },
//             timeOutMinutes * 60 * 1000); // Reload the page every 15 minutes
//     }
// })();


(function() {
    const timeOutMinutes = 15;
    var inactivityTimer;

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(function() {
            console.log("reloading due to inactivity");
            location.reload();
        }, timeOutMinutes * 60 * 1000); // Reload the page after 15 minutes of inactivity
    }

    // Reset the inactivity timer on user actions
    document.addEventListener("click", resetInactivityTimer);
    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keypress", resetInactivityTimer);

    // Initialize the timer
    resetInactivityTimer();
})();