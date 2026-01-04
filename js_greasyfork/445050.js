// ==UserScript==
// @name         OWL Auto Check Token Drops
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically checks if "CONNECTED" button appears, if not refresh the webpage periodically.
// @author       LeoTan
// @match        https://www.youtube.com/watch?v=wyy1X6mje-Y
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445050/OWL%20Auto%20Check%20Token%20Drops.user.js
// @updateURL https://update.greasyfork.org/scripts/445050/OWL%20Auto%20Check%20Token%20Drops.meta.js
// ==/UserScript==

const interval = 5 * 60; // in seconds
const targetTime = new Date('May 16, 2022 05:30:00');

const check = () => {
    const buttons = document.querySelectorAll("ytd-button-renderer[is-icon-button][style-action-button]");
    // console.log(buttons);
    let found = false;
    for (const button of buttons) {
        if (button.childNodes[0].text.includes("Connected")) {
            console.log("Found CONNECTED button");
            found = true;
            break;
        }
    }
    if (!found) {
        const now = new Date();
        if (now.getTime() <= targetTime.getTime()) {
            console.log("No CONNECTED button, refreshing...");
            location.reload();
        } else {
            console.log("Time has past, skipping refreshing...");
        }
    }
};

setInterval(check, interval * 1000);