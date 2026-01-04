// ==UserScript==
// @name         IGG-GAMES ad blocker bypass
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bypasses the blocker that blocks your ad blocker.
// @author       hacker8990
// @match        *://igg-games.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390668/IGG-GAMES%20ad%20blocker%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/390668/IGG-GAMES%20ad%20blocker%20bypass.meta.js
// ==/UserScript==

setTimeout(function(){ jQuery('#idModal').remove() }, 2000);