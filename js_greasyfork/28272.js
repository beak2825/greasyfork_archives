// ==UserScript==
// @name            Change Hupu font
// @namespace       https://dev.donie.me
// @version         0.0.4
// @description     Change hupu font
// @author          forinec
// @match           *://bbs.hupu.com/*
// @downloadURL https://update.greasyfork.org/scripts/28272/Change%20Hupu%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/28272/Change%20Hupu%20font.meta.js
// ==/UserScript==

var css = document.createElement('style');
css.type = "text/css";
css.textContent = "* { font-family: PingFangSC-Regular !important; }";

document.head.appendChild(css);