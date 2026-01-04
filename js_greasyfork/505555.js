// ==UserScript==
// @name        Disable image/title overlapping on mobile on notebookcheck
// @namespace   shitkiller
// @match       https://www.notebookcheck.net/*
// @match       https://www.notebookcheck.com/*
// @description UX designers are awesome, they can play nicely with opacity, but I want to see full images without hurting my eyes
// @grant       none
// @version     1.0
// @author      shit-killer
// @downloadURL https://update.greasyfork.org/scripts/505555/Disable%20imagetitle%20overlapping%20on%20mobile%20on%20notebookcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/505555/Disable%20imagetitle%20overlapping%20on%20mobile%20on%20notebookcheck.meta.js
// ==/UserScript==

// It can and MUST be implemented in Stylus, but I have no time to explore this

const style = document.createElement('style');
document.head.appendChild(style);

style.innerHTML = `
@media only screen and (max-width: 450px) {
.introa_rm_img {
  max-height: initial;
  min-height: auto;
}
`;
