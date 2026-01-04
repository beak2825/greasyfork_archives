// ==UserScript==
// @name Twitter night mode without login
// @description Turns on night mode on Twitter even if you're not logged in.
// @namespace flan
// @match https://twitter.com/*
// @grant none
// @inject-into auto
// @version 0.0.1.20190221041324
// @downloadURL https://update.greasyfork.org/scripts/378062/Twitter%20night%20mode%20without%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/378062/Twitter%20night%20mode%20without%20login.meta.js
// ==/UserScript==
document.querySelectorAll("link[rel=stylesheet]:not([href*=nightmode_])").forEach(l => l.href = l.href.replace(/[^\/]*$/, "/nightmode_$&"));