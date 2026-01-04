// ==UserScript==
// @name         Hide Images
// @namespace    CertainPerformance
// @description  Blocks images from loading on all sites
// @version      1
// @match        https://*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/458848/Hide%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/458848/Hide%20Images.meta.js
// ==/UserScript==

document.head.appendChild(document.createElement('style')).textContent = `
img {
  display: none !important
}
`;