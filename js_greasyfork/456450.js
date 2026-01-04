// ==UserScript==
// @name         GreasyFork aggregate stats
// @namespace    https://greasyfork.org/en/users/198860-zyenith
// @version      0.3
// @description  View the total GreasyFork stats of a user
// @author       You
// @match        https://greasyfork.org/en/users*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456450/GreasyFork%20aggregate%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/456450/GreasyFork%20aggregate%20stats.meta.js
// ==/UserScript==

let total = 0;
let daily = 0;
Array.from(document.getElementById("user-script-list-section").children[1].children).forEach(e => (total += +e.getAttribute("data-script-total-installs"), (daily += +e.getAttribute("data-script-daily-installs"))))

console.log(`
Total installs: ${total}
Daily installs: ${daily}
`);