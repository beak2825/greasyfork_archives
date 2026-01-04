// ==UserScript==
// @name         afk scripti
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  afk kalmanızı sağlar
// @author       Ryzex
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528902/afk%20scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/528902/afk%20scripti.meta.js
// ==/UserScript==

setInterval(() => document.querySelector(".ic-yes")?.click(), 400);
