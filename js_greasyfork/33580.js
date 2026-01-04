// ==UserScript==
// @namespace raina
// @version 1.0
// @name Subreddit Header Link
// @description Changes the header link to current subreddit home on comment pages.
// @match *://*.reddit.com/*/comments/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33580/Subreddit%20Header%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/33580/Subreddit%20Header%20Link.meta.js
// ==/UserScript==
document.getElementById("header-img").href = window.location.href.replace(/comments.*$/, "");
