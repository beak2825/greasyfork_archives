// ==UserScript==
// @name          Dominion Fix
// @namespace     http://userstyles.org
// @description	  Fix dominion.games it
// @author        giusb
// @include       https://dominion.games/
// @include       https://dominion.games/*
// @run-at        document-start
// @version       1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455634/Dominion%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/455634/Dominion%20Fix.meta.js
// ==/UserScript==
var styleSheet = document.createElement("style")
style = '.status-bar-border, .status-bar, .status-bar-left-block, .storyline, .status-bar-main-row { width: auto !important; } .status-bar-border { left: 0 !important; bottom: calc(var(--vh,1vh) * 21) !important;}';
styleSheet.innerText = style;
document.head.appendChild(styleSheet);
