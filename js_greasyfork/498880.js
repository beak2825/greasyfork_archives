    // ==UserScript==
    // @name        Disable obtrusive chat, all of dog-water fextralife.com
    // @namespace   Violentmonkey Scripts
    // @match       https://*.wiki.fextralife.com/*
    // @grant       none
    // @license     MIT
    // @version     1.1
    // @author      Devdraco
    // @description This script disables the annoying chat feature present on all dog-water fextralife "wiki" pages.
// @downloadURL https://update.greasyfork.org/scripts/498880/Disable%20obtrusive%20chat%2C%20all%20of%20dog-water%20fextralifecom.user.js
// @updateURL https://update.greasyfork.org/scripts/498880/Disable%20obtrusive%20chat%2C%20all%20of%20dog-water%20fextralifecom.meta.js
    // ==/UserScript==

      document.getElementById("mchato")?.remove();