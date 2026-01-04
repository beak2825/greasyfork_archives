// ==UserScript==
// @name                Force HTTP to HTTPS
// @namespace           r-a-y/https
// @version             1.0.0
// @match               http://apache.org/*
// @run-at              document-start
// @description         Force HTTP links to use HTTPS. You need to write your own @match or @include rules!
// @downloadURL https://update.greasyfork.org/scripts/38930/Force%20HTTP%20to%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/38930/Force%20HTTP%20to%20HTTPS.meta.js
// ==/UserScript==

document.location.replace(document.location.href.replace(/http\:/, 'https:'));