// ==UserScript==
// @name        Discord antihijack clicks
// @namespace   Violentmonkey Scripts
// @match       https://discord.com/*
// @grant       none
// @version     1.0
// @license     0BSD
// @author      -
// @description Prevents discord from hijacking right and middle mouse button clicks. That means your context menu will be the same as usual.
// @downloadURL https://update.greasyfork.org/scripts/505294/Discord%20antihijack%20clicks.user.js
// @updateURL https://update.greasyfork.org/scripts/505294/Discord%20antihijack%20clicks.meta.js
// ==/UserScript==

document.addEventListener("contextmenu", e => e.stopPropagation(), true);
document.addEventListener("auxclick", e => e.stopPropagation(), true);
