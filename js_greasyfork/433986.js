// ==UserScript==
// @name     Disable YouTube Shorts
// @description Disables YouTube Shorts player on the website by redirecting to the standard player.
// @version  1.0
// @grant    none
// @match *://www.youtube.com/shorts/*
// @run-at document-start
// @namespace https://greasyfork.org/users/237565
// @downloadURL https://update.greasyfork.org/scripts/433986/Disable%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/433986/Disable%20YouTube%20Shorts.meta.js
// ==/UserScript==

window.location.href = window.location.href.replace("shorts/", "watch?v=")