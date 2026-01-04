// ==UserScript==
// @name        Remove Roblox App Banner
// @namespace   Violentmonkey Scripts
// @match       https://www.roblox.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 9/21/2022, 4:55:02 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451784/Remove%20Roblox%20App%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/451784/Remove%20Roblox%20App%20Banner.meta.js
// ==/UserScript==
document.getElementById("desktop-app-banner").remove()