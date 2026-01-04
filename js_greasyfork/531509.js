// ==UserScript==
// @name        Reddit Mobile Annoyance blocker
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @match       https://sh.reddit.com/*
// @grant       none
// @version     1.0
// @author      AfZ
// @description Bypass "Open in app" prompts, unblur NSFW
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531509/Reddit%20Mobile%20Annoyance%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/531509/Reddit%20Mobile%20Annoyance%20blocker.meta.js
// ==/UserScript==

'use-strict';

const callback = () => {
    document.querySelector("#xpromo-bottom-sheet")?.remove();    // Remove "Open in app prompt"
    document.querySelector("#blocking-modal")?.remove();         // Remove "Mature Content" modal
    document.querySelector("div[style='position: fixed; inset: 0px; backdrop-filter: blur(4px);']")?.remove(); // Unblur
    var prompt = document.getElementsByTagName("xpromo-nsfw-blocking-container");
    prompt[0]?.shadowRoot?.querySelector(".prompt")?.remove(); // Remove "Mature Content" message in description
};

const observer = new MutationObserver(callback);
observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
});

const shredditInterval = setInterval(() => {
    const isShreddit = document.querySelector("shreddit-app");
    // Check if Shreddit
    if (!isShreddit) {
      observer.disconnect();
      clearInterval(shredditInterval);
      }
}, 8000);