// ==UserScript==
// @name        FANDOM WEBP-to-original redirector
// @namespace   Violentmonkey Scripts
// @match       https://static.wikia.nocookie.net/*/images/*/*/*.*/revision/latest?cb=*
// @match       https://static.fandom.nocookie.net/*/images/*/*/*.*/revision/latest?cb=*
// @exclude     https://static.wikia.nocookie.net/*/images/*/*/*.webp/*
// @exclude     https://static.fandom.nocookie.net/*/images/*/*/*.webp/*
// @grant       none
// @version     1.0
// @author      https://github.com/Palpabols
// @description Allows one to automatically get redirected to a FANDOM-hosted WEBP image's original extension.
// @downloadURL https://update.greasyfork.org/scripts/485189/FANDOM%20WEBP-to-original%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/485189/FANDOM%20WEBP-to-original%20redirector.meta.js
// ==/UserScript==

window.location.href = window.location.pathname.replace('/revision/latest', '') + "?format=original";
