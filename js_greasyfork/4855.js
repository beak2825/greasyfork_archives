// ==UserScript==
// @description NO more "stay in focus"
// @name Enable Focus (by Darknit)
// @namespace http://userscripts.org:8080/users/670670
// @include http://www.ptcircle.com/*
// @version 1
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/4855/Enable%20Focus%20%28by%20Darknit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4855/Enable%20Focus%20%28by%20Darknit%29.meta.js
// ==/UserScript==
setInterval(function() { window.focus() }, 1000)
document.hasFocus = function () {return true;};