// ==UserScript==
// @name        Title Rethingifier
// @namespace   Alice Cheshire
// @description Rethingifies page titles
// @include     http://dynasty-scans.com/*
// @include     https://dynasty-scans.com/*
// @version     1.1
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/22478/Title%20Rethingifier.user.js
// @updateURL https://update.greasyfork.org/scripts/22478/Title%20Rethingifier.meta.js
// ==/UserScript==

document.title = document.title.replace(/Dynasty Reader »(.+)/, "$1 | Dynasty Reader");