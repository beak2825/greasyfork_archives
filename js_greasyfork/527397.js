// ==UserScript==
// @name        Remove Placeholder text in chat box
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:8000/*
// @grant       none
// @version     1.0
// @author      -
// @description 2/18/2025, 8:38:59 PM
// @downloadURL https://update.greasyfork.org/scripts/527397/Remove%20Placeholder%20text%20in%20chat%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/527397/Remove%20Placeholder%20text%20in%20chat%20box.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", function () {
    let textarea = document.getElementById("send_textarea");
    if (textarea) {
        textarea.removeAttribute("placeholder"); // Removes the placeholder
    }
});
setInterval(() => {
    let textarea = document.getElementById("send_textarea");
    if (textarea) {
        textarea.removeAttribute("placeholder");
    }
}, 500); // Runs every 0.5 seconds to ensure the placeholder stays removed
