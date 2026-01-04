// ==UserScript==
// @name         Instagram scroll
// @namespace    instagram.scroll
// @license      MIT
// @description  Scroll through posts with mousewheel on web browser
// @version      1.0.0
// @match        https://www.instagram.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503958/Instagram%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/503958/Instagram%20scroll.meta.js
// ==/UserScript==
window.addEventListener('wheel', function(event) {
    const direction = event.deltaY > 0 ? 'Next' : 'Go back';
    const button = document.querySelector(`button:has(svg[aria-label="${direction}"])`);
    if (button) button.click();
});