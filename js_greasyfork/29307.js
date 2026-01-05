// ==UserScript==
// @name         I9g4lo9Y: Disable html5 video autoplay
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  I9g4lo9Y: cnn first
// @author       I9g4lo9Y
// @match        http://*.cnn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29307/I9g4lo9Y%3A%20Disable%20html5%20video%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/29307/I9g4lo9Y%3A%20Disable%20html5%20video%20autoplay.meta.js
// ==/UserScript==

window.onload = function() {
    console.log("disable html5 video autoplay begin");
    autoStartVideo = false;
    console.log("disable html5 video autoplay done");
};