// ==UserScript==
// @name         Hide Google Meet Visitor Icon
// @namespace    https://greasyfork.org/en/users/922168-mark-zinzow
// @version      0.5
// @description  Remove screen space wasting "Visitors are in this meeting" warning icon
// @author       Mark Zinzow
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @supportURL   https://greasyfork.org/en/scripts/481476-hide-google-meet-visitor-icon/feedback
// @license MIT
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/481476/Hide%20Google%20Meet%20Visitor%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/481476/Hide%20Google%20Meet%20Visitor%20Icon.meta.js
// ==/UserScript==

// If you wish to remove the visitor div manually, paste this one line into the console:
//  document.querySelector('div[jscontroller="hVZhab"][data-side="1"]').remove();
(function() {
    'use strict';
    var removed = 0;
    function killIconDiv() {
    const firstDiv = document.querySelector('div[jscontroller="hVZhab"][data-side="1"]'); //This should prevent deleting the controls!
        if (firstDiv && !removed) {
          console.log("Div found.");
          removed = 1;
          firstDiv.remove();
        }
    }
// Didn't work unless a visitor was already in the meeting
    for (let i = 0; i < 600 ; i++) { //600 keeps trying to remove this icon every 2 seconds for 20 minutes
        if (removed) break;
    setTimeout(killIconDiv, i*2000);
}
})();