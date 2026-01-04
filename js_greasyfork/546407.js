// ==UserScript==
// @name        Move The Clouldflare Box
// @namespace   Violentmonkey Scripts
// @description Moves the cloudflare check box to the lower right corner. It covers the location button.
// @match       https://wplace.live/*
// @grant       none
// @version     1.1
// @author      nopeee
// @license MIT
// @description 16/08/2025, 10:36:39
// @downloadURL https://update.greasyfork.org/scripts/546407/Move%20The%20Clouldflare%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/546407/Move%20The%20Clouldflare%20Box.meta.js
// ==/UserScript==


const intervalToCancel = setInterval(()=>{
    if (document.querySelector(".z-100")) {
       document.querySelector(".z-100").className = document.querySelector(".z-100").className.replace("left-1/2", "right-1").replace("-translate-x-1/2", "")
    }
  }, 1000)
