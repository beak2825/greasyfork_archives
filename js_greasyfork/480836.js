// ==UserScript==
// @name         Auto-Refresh Goto
// @namespace    https://www.netstationen.dk/rightpages/other/lift_goto.asp
// @version      1.1
// @description  Ja godav
// @author       Din mor
// @match        https://www.netstationen.dk/rightpages/other/lift_goto.asp*
// @match        https://www.netstationen.dk/rightpages/other/Lift_Goto.asp*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/480836/Auto-Refresh%20Goto.user.js
// @updateURL https://update.greasyfork.org/scripts/480836/Auto-Refresh%20Goto.meta.js
// ==/UserScript==

setTimeout(function() { location.reload(); }, 100);