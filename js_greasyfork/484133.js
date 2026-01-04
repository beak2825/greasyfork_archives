// ==UserScript==
// @name         Youtube Music no video player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove youtube music player and make it truely a music player.
// @author       pankaj4u4m@gmail.com
// @match        *://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484133/Youtube%20Music%20no%20video%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/484133/Youtube%20Music%20no%20video%20player.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    console.log("Making player disappear");
    document.getElementById("main-panel").style.display="none";
})();
