// ==UserScript==
// @name         Reddit App Bypass
// @namespace    http://tampermonkey.net/
// @version      2024-08-24
// @description  Bypass Reddits App enforcement for NSFW content.
// @author       emlinhax
// @match        https://www.reddit.com/r/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504930/Reddit%20App%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/504930/Reddit%20App%20Bypass.meta.js
// ==/UserScript==

document.getElementsByTagName("xpromo-nsfw-blocking-modal")[0].remove();