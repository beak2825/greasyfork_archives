// ==UserScript==
// @name         Redirect Google to ecosia
// @namespace    Tunisiano18
// @version      0.2
// @description  Forward any search on Google to ecosia
// @author       Tunisiano18
// @include      /^https:\/\/www\.google\.com
// @exclude      /^https:\/\/www\.google\.com\/maps
// @exclude      /^https:\/\/www\.google\.com\/url
// @exclude      /^https:\/\/www\.google\.com\/recaptcha
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392958/Redirect%20Google%20to%20ecosia.user.js
// @updateURL https://update.greasyfork.org/scripts/392958/Redirect%20Google%20to%20ecosia.meta.js
// ==/UserScript==

window.location.replace(window.location.href.replace('https://www.google.com', 'https://ecosia.org'));