// ==UserScript==
// @name         Gota.io hide error banner
// @namespace    http://tampermonkey.net/
// @version      1
// @description  hides error banner on top of the screen
// @author       yl3
// @match        https://gota.io/web/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513612/Gotaio%20hide%20error%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/513612/Gotaio%20hide%20error%20banner.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.innerHTML = ".error-banner { visibility: hidden; }";
document.body.appendChild(style);