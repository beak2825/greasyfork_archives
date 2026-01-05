// ==UserScript==
// @name         daum.net remove events
// @namespace    uk.jixun
// @version      0.3
// @description  移除右键等限制
// @author       Jixun
// @match        http://cafe.daum.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/11827/daumnet%20remove%20events.user.js
// @updateURL https://update.greasyfork.org/scripts/11827/daumnet%20remove%20events.meta.js
// ==/UserScript==

var s = document.createElement('style');
s.textContent = 'body, body * {user-focus: initial !important;user-select: initial !important}';
document.head.appendChild(s);

window.addEventListener = null;
window.attachEvent = true;
