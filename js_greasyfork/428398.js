// ==UserScript==
// @name         Neopets: Empty shop till
// @author       Tombaugh Regio
// @version      1.1
// @description  Withdraws the full amount in your shop till
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/market.phtml?type=till
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428398/Neopets%3A%20Empty%20shop%20till.user.js
// @updateURL https://update.greasyfork.org/scripts/428398/Neopets%3A%20Empty%20shop%20till.meta.js
// ==/UserScript==

document.querySelector('input[name="amount"]').value = parseInt(document.querySelector(".content p b").textContent.match(/[\d,]+/)[0].split(",").join(""))