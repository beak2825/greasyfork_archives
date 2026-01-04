// ==UserScript==
// @YouTube Add Skipper
// @namespace https://www.youtube.com
// @description Skips YouTube Ads automatically
// @version 1.0
// @author Your Name
// @match https://www.youtube.com/*
// @grant none
// @name YouTube Add Skipper
// @downloadURL https://update.greasyfork.org/scripts/461769/YouTube%20Add%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/461769/YouTube%20Add%20Skipper.meta.js
// ==/UserScript==

(function() {
'use strict';
setInterval(() => {
const skipButton = document.querySelector('button[aria-label="Skip Ads"]');
if (skipButton) {
skipButton.click();
}
}, 1000);
})();