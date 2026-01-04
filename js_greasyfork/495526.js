// ==UserScript==
// @name         Reddit New Redirect
// @namespace    https://www.reddit.com
// @version      1.1
// @description  a fork of https://greasyfork.org/en/scripts/471477-reddit-old-redirect/ but for https://new.reddit.com/
// @author       Someone12421 (forked from a script made by Agreasyforkuser)
// @match        https://*.reddit.com/*
// @exclude      https://*.reddit.com/poll/*
// @exclude      https://*.reddit.com/gallery/*
// @exclude      https://www.reddit.com/media*
// @exclude      https://chat.reddit.com/*
// @exclude      https://www.reddit.com/appeal*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495526/Reddit%20New%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/495526/Reddit%20New%20Redirect.meta.js
// ==/UserScript==

if (GM_info.isIncognito) {
  return
}

if ( window.location.host != "new.reddit.com" ) {
    var newReddit = window.location.protocol + "//" + "new.reddit.com" + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace (newReddit);
}

