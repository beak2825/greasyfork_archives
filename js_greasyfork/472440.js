// ==UserScript==
// @name         Anti Cloudflare Block (Zombs.io)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically reloads the page when the "You have been blocked" screen appears.
// @author       You
// @match        *://zombs.io/*
// @icon         https://cdn-icons-png.flaticon.com/512/5969/5969044.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472440/Anti%20Cloudflare%20Block%20%28Zombsio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472440/Anti%20Cloudflare%20Block%20%28Zombsio%29.meta.js
// ==/UserScript==

if (document.getElementById("cf-wrapper")) {
    location.href = location.href
}