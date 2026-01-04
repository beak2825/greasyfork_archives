// ==UserScript==
// @name        GreasyFork: My own 800 scripts
// @namespace   Violentmonkey Scripts
// @match       https://greasyfork.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/2/2025, 12:05:03 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522499/GreasyFork%3A%20My%20own%20800%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/522499/GreasyFork%3A%20My%20own%20800%20scripts.meta.js
// ==/UserScript==

const elm = document.querySelector('.user-profile-link a[href]');
const href = elm?.getAttribute('href') || '';
if (href.length > 5 && /^(https:\/\/greasyfork\.org)?\/[\w-]+\/users\/\d+-[^?\/\s]+$/.test(href)) {
    elm.setAttribute('href', href + '?per_page=800');
}