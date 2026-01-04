// ==UserScript==
// @name         Potato Counter
// @namespace    neopets
// @version      0.1
// @description  Fills in the correct answer (does not auto-submit)
// @author       You
// @match        http://www.neopets.com/medieval/potatocounter.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407748/Potato%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/407748/Potato%20Counter.meta.js
// ==/UserScript==

// If you encounter a long wall of potatoes (>1000 potatoes) you are strongly advised to NOT solve it. Refresh for a new potato count or simply submit a wrong answer.

var amount = $("b:contains('How many potatoes')").parent().next().find("td:has(img)");
$("input[name='guess']").val(amount.length);