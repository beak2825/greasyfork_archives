// ==UserScript==
// @name         Unlisted Script Selector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/en/script_versions/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32189/Unlisted%20Script%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/32189/Unlisted%20Script%20Selector.meta.js
// ==/UserScript==

document.querySelectorAll("input[type='radio']")[1].click();