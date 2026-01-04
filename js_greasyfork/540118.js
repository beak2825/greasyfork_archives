// ==UserScript==
// @name        AD Block for Aranzulla site
// @namespace   Violentmonkey Scripts
// @match       https://www.aranzulla.it/*
// @grant       none
// @version     1.0
// @author      Gianluca Rainis
// @license     MIT
// @description A simple script to remove ads from the Aranzulla website. This script bypass the adblock detection of the site.
// @downloadURL https://update.greasyfork.org/scripts/540118/AD%20Block%20for%20Aranzulla%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/540118/AD%20Block%20for%20Aranzulla%20site.meta.js
// ==/UserScript==

function loop() {
    document.body.querySelectorAll("iframe").forEach(frame => {
        //frame.src = "";
        frame.remove();
    });

    setTimeout(loop, 100);
}

loop();