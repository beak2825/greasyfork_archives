// ==UserScript==
// @name        YouTube Embedded Player Replace
// @namespace   YouTube Embedded Player Replace
// @run-at      start
// @match       *://www.youtube-nocookie.com/embed/*
// @version     1.1
// @author      uJZk
// @description Replace "youtube-nocookie.com" to "www.youtube.com" for a better experience.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438331/YouTube%20Embedded%20Player%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/438331/YouTube%20Embedded%20Player%20Replace.meta.js
// ==/UserScript==

window.location.replace(document.location.href.replace("www.youtube-nocookie.com","www.youtube.com"));
