// ==UserScript==
// @name         Smithed Timestamps
// @namespace    http://tampermonkey.net/
// @version      2025-08-08-patch
// @description  Smithed timestamp copier
// @author       You
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545071/Smithed%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/545071/Smithed%20Timestamps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let buttonCreated = false;
    setInterval(() => {
        if (buttonCreated) {
            return;
        }
        let buttons = document.querySelector("#owner");
        if (buttons == undefined) {
            return;
        }
        let button = document.createElement("button");
        button.innerText = "Copy Timestamp";
        button.addEventListener("click", () => navigator.clipboard.writeText(document.getElementsByClassName("video-stream html5-main-video")[0].currentTime));

        buttons.appendChild(button);
        buttonCreated = true;
    }, 500);

})();