// ==UserScript==
// @name             Always Old Reddit
// @namespace        ghostrider47
// @version          0.1
// @description      Reddit Redirect to Old Reddit
// @author           ghostrider47
// @include          *://*.reddit.com/*
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/412388/Always%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/412388/Always%20Old%20Reddit.meta.js
// ==/UserScript==
// @run-at           document-start
// @run-at           document-end
// @run-at           document-idle

document.location = document.URL.replace('www','old');