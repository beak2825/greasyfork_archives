// ==UserScript==
// @name         Reddit Old Redirect 🔙
// @namespace    https://www.reddit.com
// @version      1.6
// @description  redirect to old reddit
// @author       Agreasyforkuser
// @match        https://*.reddit.com/*
// @exclude      https://*.reddit.com/poll/*
// @exclude      https://*.reddit.com/gallery/*
// @exclude      https://www.reddit.com/media*
// @exclude      https://chat.reddit.com/*
// @exclude      https://www.reddit.com/appeal*
// @exclude      https://www.reddit.com/notifications*
// @exclude      https://embed.reddit.com/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471477/Reddit%20Old%20Redirect%20%F0%9F%94%99.user.js
// @updateURL https://update.greasyfork.org/scripts/471477/Reddit%20Old%20Redirect%20%F0%9F%94%99.meta.js
// ==/UserScript==

if ( window.location.host != "old.reddit.com" ) {
    var oldReddit = window.location.protocol + "//" + "old.reddit.com" + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace (oldReddit);
}

