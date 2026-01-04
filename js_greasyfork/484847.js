// ==UserScript==
// @name               Twitter to Nitter
// @namespace          https://greasyfork.org/en/users/29389-fons-visionem-suum
// @description        Always redirects to nitter
// @match            *://twitter.com/*
// @version            0.2
// @run-at             document-start
// @author             Fons visionem suum
// @grant              none
// @license            Mozilla

// @downloadURL https://update.greasyfork.org/scripts/484847/Twitter%20to%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/484847/Twitter%20to%20Nitter.meta.js
// ==/UserScript==

window.location.replace("https://nitter.net" + window.location.pathname + window.location.search);