// ==UserScript==
// @name        Github auto dark mode
// @namespace   kamikazechaser/auto-dark-mode
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @author      kamikazechaser
// @description 12/16/2020, 7:09:34 PM
// @downloadURL https://update.greasyfork.org/scripts/418707/Github%20auto%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/418707/Github%20auto%20dark%20mode.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    const now = new Date();
    if (now.getHours() > 18) document.documentElement.setAttribute("data-color-mode", "dark")
}, false);
