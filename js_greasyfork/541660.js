// ==UserScript==
// @name         Drawaria Console Test
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple test script that logs a message in console on drawaria.online to verify userscript is loaded.
// @author       Lucas
// @match        https://www.drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541660/Drawaria%20Console%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/541660/Drawaria%20Console%20Test.meta.js
// ==/UserScript==

console.log("Drawaria userscript loaded ✅");