// ==UserScript==
// @name        YouTube Auto Pause Blocker
// @namespace   https://greasyfork.org/en/users/750152
// @description Block the "Video paused. Continue watching?" popup and keep YouTube videos playing even if you are away for too long.
// @include     https://youtube.com/*
// @include     https://*.youtube.com/*
// @version     1
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/423761/YouTube%20Auto%20Pause%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/423761/YouTube%20Auto%20Pause%20Blocker.meta.js
// ==/UserScript==

var interval = setInterval(function() {
    window.wrappedJSObject._lact = Date.now();
}, 300000);