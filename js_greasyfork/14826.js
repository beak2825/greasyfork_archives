// ==UserScript==
// @name         YouTube remove trending
// @namespace    http://nodebuck.de/
// @version      0.1
// @description  YouTube remove trending tab
// @author       Nodebuck
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14826/YouTube%20remove%20trending.user.js
// @updateURL https://update.greasyfork.org/scripts/14826/YouTube%20remove%20trending.meta.js
// ==/UserScript==

Array.prototype.forEach.call(document.querySelectorAll("*[href=\"/feed/trending\"]"), function( node ) {
    node.parentNode.removeChild(node);
});