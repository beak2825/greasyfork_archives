// ==UserScript==
// @name         MTV Autoexpand
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  expand courses in MTV automatically
// @author       tippfehlr
// @match        https://mtv.math.kit.edu/
// @icon         https://kit.edu/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523643/MTV%20Autoexpand.user.js
// @updateURL https://update.greasyfork.org/scripts/523643/MTV%20Autoexpand.meta.js
// ==/UserScript==

document.querySelectorAll("button.show-assignments[aria-expanded=false]").forEach(b => b.click());