// ==UserScript==
// @name        Mavenlink Blue
// @namespace   RPIC
// @match       https://*.mavenlink.com/*
// @grant       none
// @version     1.0
// @author      Frank Baxendale
// @description Changes default theme from kantana to mavenlink. No clue how long this will work or if it works for all pages.
// @run-at      document-end

// @downloadURL https://update.greasyfork.org/scripts/456637/Mavenlink%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/456637/Mavenlink%20Blue.meta.js
// ==/UserScript==

document.getElementsByTagName("body")[0].dataset['theme'] = "mavenlink"