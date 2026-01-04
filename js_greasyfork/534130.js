// ==UserScript==
// @name         Freeze console
// @namespace    http://tampermonkey.net/
// @version      2025-04-28
// @description  Forbid any script to modify window.console
// @author       VoltaX
// @match        *://*/*
// @icon         http://milkywayidle.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534130/Freeze%20console.user.js
// @updateURL https://update.greasyfork.org/scripts/534130/Freeze%20console.meta.js
// ==/UserScript==

Object.freeze(window.console);