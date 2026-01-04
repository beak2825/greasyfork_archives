///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ==UserScript==
// @name         Amazon Prime Autocheck
// @namespace    https://cbass92.org/
// @version      1.1
// @description  Auto checks the amazon prime box
// @author       Cbass92
// @match        https://www.amazon.com/s*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498620/Amazon%20Prime%20Autocheck.user.js
// @updateURL https://update.greasyfork.org/scripts/498620/Amazon%20Prime%20Autocheck.meta.js
// ==/UserScript==

var match = document.querySelectorAll("i[aria-label='Prime Eligible']");
match[0].parentElement.children[0].children[0].children[0].checked = true
