// ==UserScript==
// @name         Google Meet Auto Leave
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to leave meets when others are leaving themselves.
// @author       SaberSpeed77, l0st_idiot
// @match        https://meet.google.com/*-*
// @icon         https://www.mediafire.com/convkey/6b57/sd3demt1u3y6mx19g.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448150/Google%20Meet%20Auto%20Leave.user.js
// @updateURL https://update.greasyfork.org/scripts/448150/Google%20Meet%20Auto%20Leave.meta.js
// ==/UserScript==

// Main Feature - Google Meet Auto Leave
// IMPORTANT! - If You want this to work when you tab switch, then install the extension "Always active Window - Always Visible".
// Click it --> This can read and change site data --> On meet.google.com // Why? Because it will make the meet tab always active (and the default setting makes all your tabs active, which is resource-intensive)
window.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string});
let content = document.createElement("div");
content.innerHTML = '\
    <div style="z-index: 9999; position: absolute; left: 0; padding-left: 10px; top: 0; height: 50px; width: 460px; background-color: #555555;">\
        <p style="color: white; display: inline-block;">How many participants must be left before you leave the meet?</p>\
        <input style="width: 30px;" type="text" id="numToLeave">\
    </div>\
';
document.body.appendChild(content);

var a = setInterval(() => {
    let numToLeave = parseInt(document.getElementById('numToLeave').value); // change num of participants left when you leave
    let numOfPart = parseInt(document.querySelector('.uGOf1d').innerHTML);

    if (numOfPart <= numToLeave) {
        document.querySelector('[aria-label="Leave call"]').click();
        clearInterval(a);
    }
}, 5000);

// Extra Features - Mute Mic & Cam
var b = setInterval(() => {
    if (document.querySelector("[data-is-muted='true'][aria-label*='microphone']")) {
        clearInterval(b);
    }
    document.querySelector("[data-is-muted='false'][aria-label*='microphone']").click();
    document.querySelector("[aria-label*='Turn off camera (CTRL + E)']").click();
}, 500);