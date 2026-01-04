// ==UserScript==
// @name         Roblox Web To UWP Joiner
// @namespace    RobloxJoiner
// @version      0.1
// @description  Redirects you from roblox web to roblox UWP
// @author       BeboMods
// @match        https://www.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474485/Roblox%20Web%20To%20UWP%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/474485/Roblox%20Web%20To%20UWP%20Joiner.meta.js
// ==/UserScript==

(function() {
   'use strict';
   const currentURL = window.location.href;
   const numbers = extractNumbersFromURL(currentURL);
   const newURL = `roblox://experiences/start?placeId=${numbers}`;
   window.open(newURL, '_blank');
   function extractNumbersFromURL(url) {
       const matches = url.match(/\/(\d+)\//);
       return matches ? matches[1] : "";
   }
})();