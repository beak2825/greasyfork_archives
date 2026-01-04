// ==UserScript==
// @name         Hide Youtube Video Recommandations while watching videos
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  To help you to Focus on the contents that you Really need
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443451/Hide%20Youtube%20Video%20Recommandations%20while%20watching%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/443451/Hide%20Youtube%20Video%20Recommandations%20while%20watching%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intv = setInterval(()=>{
        var rel = document.querySelector("#related.style-scope.ytd-watch-flexy")
        if(rel != void 0){
            clearInterval(intv)
            rel.style.display = "none"
        }
    }, 300)
    // Your code here...
})();