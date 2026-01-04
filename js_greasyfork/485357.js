// ==UserScript==
// @name         yt2009 Bottom-side Description
// @namespace    http://yt20092.giabs.ovh/
// @version      0.1
// @description  moves description below the video.
// @author       MikanYan
// @match        http://yt20092.giabs.ovh/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ftde-projects.tk
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/485357/yt2009%20Bottom-side%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/485357/yt2009%20Bottom-side%20Description.meta.js
// ==/UserScript==

async function waitForElm(q) {
    while (document.querySelector(q) == null) {
        await new Promise(r => requestAnimationFrame(r));
    }
    return document.querySelector(q);
}

waitForElm("#watch-channel-vids-div").then((e) => {
    waitForElm("#watch-main-area").then((f) => {
        f.insertAdjacentElement("beforebegin", e);
    });
});