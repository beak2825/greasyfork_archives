// ==UserScript==
// @name         YouTube - Fix Fullscreen Scrollbar
// @namespace    cprn
// @version      0.2
// @description  Hides YouTube fullscreen player's scrollbar that appeared in Firefox 86
// @author       cprn
// @match        https://*.youtube.com/*
// @match        http://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422547/YouTube%20-%20Fix%20Fullscreen%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/422547/YouTube%20-%20Fix%20Fullscreen%20Scrollbar.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.innerHTML="ytd-app { --ytd-app-fullerscreen-scrollbar-width: 11px !important; }";
document.head.appendChild(css);
