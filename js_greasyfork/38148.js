// ==UserScript==
// @name         Middle-Click Web+Panda Everywhere
// @namespace    yuvaraja
// @version      3.2
// @description  .
// @author       yuvaraja
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38148/Middle-Click%20Web%2BPanda%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/38148/Middle-Click%20Web%2BPanda%20Everywhere.meta.js
// ==/UserScript==

const MIDDLE_BUTTON_CODE = 1;

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 300;

document.body.addEventListener("mousedown", function(event) {
    console.log(event);
    if(event.target.tagName === "A" && (event.target.href.includes("/accept_random") || event.target.href.includes("worker.mturk.com/projects/")) ) {
        if(event.button === MIDDLE_BUTTON_CODE) {
            event.preventDefault();
            window.open(`web+panda://${event.target.href}`, undefined, `width=${WINDOW_WIDTH},height=${WINDOW_HEIGHT},left=${screen.width/2 - WINDOW_WIDTH/2},top=${screen.height/2 - WINDOW_HEIGHT/2}`);
        }
    }
});