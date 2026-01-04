// ==UserScript==
// @name         RIP Shorts links
// @namespace    http://tampermonkey.net/
// @description  Open Youtube Short in non short overlay
// @author       Viarra
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @version 1.0.20220522
// @downloadURL https://update.greasyfork.org/scripts/445380/RIP%20Shorts%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/445380/RIP%20Shorts%20links.meta.js
// ==/UserScript==
let ytbvid = 'https://www.youtube.com/watch?v='

let lastUrl = window.location.href;
new MutationObserver(() => {
  const url = window.location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    let part = url.split('/');
    if(part && part[part.length - 2] && part[part.length - 2] === "shorts") {
        let id = part[part.length - 1];
        let ripshort = ytbvid + id
        window.location.href = ripshort;
    }
  }
}).observe(document, {subtree: true, childList: true});
