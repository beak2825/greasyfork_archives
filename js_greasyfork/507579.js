// ==UserScript==
// @name         Hide Youtube Mobile Top Comment
// @namespace    http://tampermonkey.net/
// @version      2025-03-18
// @author       mesmere
// @description  Hide the top comment to avoid spoilers.
// @match        https://m.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        window.onurlchange
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507579/Hide%20Youtube%20Mobile%20Top%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/507579/Hide%20Youtube%20Mobile%20Top%20Comment.meta.js
// ==/UserScript==

function attempt() {
    if (window.location.href.match(/^https:\/\/m.youtube.com\/watch.+/) === null) {
        return;
    }
    const cep = document.querySelector(".ytm-comments-entry-point-teaser-content [role=text]");
    if (cep) {
        cep.innerText = "The top comment is hidden. Tap to view.";
    } else {
        window.setTimeout(attempt, 200);
    }
}

attempt();
window.addEventListener("urlchange", attempt);