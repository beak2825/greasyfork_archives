// ==UserScript==
// @name         đầu trang
// @version      1
// @description  make life easier
// @author       P
// @include      https://www3.chotot.com/*
// @grant        none
// @run-at       document-end
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/32888/%C4%91%E1%BA%A7u%20trang.user.js
// @updateURL https://update.greasyfork.org/scripts/32888/%C4%91%E1%BA%A7u%20trang.meta.js
// ==/UserScript==

window.onbeforeunload = function() {window.scrollTo(0,0);};