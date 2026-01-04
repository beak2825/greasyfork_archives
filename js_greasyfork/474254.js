// ==UserScript==
// @name         Disable Bing Chat On Scroll Up
// @namespace    https://www.reddit.com/r/bing/comments/11dautm/disabling_scroll_to_chat/?rdt=39675
// @version      0.1
// @description  Don't activate Bing Chat when you scroll up to change your search query
// @author       redditor-pinpann
// @match        *://www.bing.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474254/Disable%20Bing%20Chat%20On%20Scroll%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/474254/Disable%20Bing%20Chat%20On%20Scroll%20Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("wheel", e=>{
if(e.target.className.includes("cib-serp-main")) e.stopPropagation();
});
})();