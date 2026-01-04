// ==UserScript==
// @name         PTT Disp BBS AD blocking dectection blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove PTT Disp BBS AD blocking dectection dialog
// @author       regchiu
// @match        https://disp.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475034/PTT%20Disp%20BBS%20AD%20blocking%20dectection%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/475034/PTT%20Disp%20BBS%20AD%20blocking%20dectection%20blocker.meta.js
// ==/UserScript==
let isRemovedDialog = false;
document.addEventListener("readystatechange", () => {
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("body");

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = () => {
        const element = document.querySelector(".fc-ab-root");
        if (element) {
            element.remove();
            isRemovedDialog = true;
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    if (isRemovedDialog) {
        observer.disconnect();
    }
});