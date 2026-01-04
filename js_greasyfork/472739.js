// ==UserScript==
// @name        ChatGPT Confirm Close
// @namespace   gptclose
// @match       https://chat.openai.com/*
// @grant       none
// @version     1.03
// @author      tutacat
// @license     MPL
// @description 3/8/2023, 10:00:00 PM
// @downloadURL https://update.greasyfork.org/scripts/472739/ChatGPT%20Confirm%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/472739/ChatGPT%20Confirm%20Close.meta.js
// ==/UserScript==
// https://greasyfork.org/scripts/472739-chatgpt-confirm-close
 
window.addEventListener("beforeunload", (event) => {
    //// Is a chat open?
    //if (!window.location.pathname.startsWith("/c/") {
        event.preventDefault();
        return false;
    //}
});