// ==UserScript==
// @name         Adidas Turn Notifier Updater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check if we have a slot to purchase Yeezy shoes, and notify the user if so. Intended to be run on multiple tabs with separate sessions and IPs. Will Auto-focus the tab when a slot is available.
// @author       firefish6000
// @match        http://www.adidas.com/*
// @match        https://www.adidas.com/*
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/28591/Adidas%20Turn%20Notifier%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/28591/Adidas%20Turn%20Notifier%20Updater.meta.js
// ==/UserScript==

// This is to keep us up to date, at all times. The contained script may be altered during use to accommodate unexpected changes to the site. Since we are targeting something available only for ~30 minutes, additional time taken to check and update scripts manually is being removed (since I maintain both scripts, and am the primary user of it, I don't think this should be a problem) 

var script = document.createElement("script");
script .type = "text/javascript";
script .src = 'https://greasyfork.org/scripts/28153-adidas-turn-notifier/code/28153-adidas-turn-notifier.js';
document.body.appendChild(script);