// ==UserScript==
// @name YouTube to Invidious
// @version 1.1
// @namespace 1993.uk
// @description Redirects youtube to invidious
// @run-at document-start
// @license CC0
// @match https://www.youtube.com/watch*
// @match https://www.youtube.com/embed*
// @downloadURL https://update.greasyfork.org/scripts/491686/YouTube%20to%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/491686/YouTube%20to%20Invidious.meta.js
// ==/UserScript==
location.replace('https://yt.cdaut.de' + location.pathname + location.search)