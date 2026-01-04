// ==UserScript==
// @name         bbc-cpu
// @version      0.1
// @description  Stops the massively stupid and pointless animations causing a constant 30% CPU usage on the BBC.
// @grant        none
// @match        *://*.bbc.com/*
// @match        *://*.bbc.co.uk/*
// @namespace    https://greasyfork.org/en/users/217495-eric-toombs
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463932/bbc-cpu.user.js
// @updateURL https://update.greasyfork.org/scripts/463932/bbc-cpu.meta.js
// ==/UserScript==

for (e of document.getElementsByClassName("ssrcss-11azffs-PulsingCircle")) {
  	// The animation code refers to the objects being animated by a class name,
    // so remove these objects from all classes. Now, the animation code can't
    // find them.
    e.classList = [];
} 

style_tag = document.createElement('style');
style_tag.innerHTML = `
  .gs-c-live-pulse__icon {
    visibility: collapse !important;
`;
document.getElementsByTagName('head')[0].append(style_tag);