// ==UserScript==
// @name         Hide Already-Nominated Maps
// @namespace    https://greasyfork.org/en/users/689296
// @version      1.0.0
// @description  Hides already nominated Maps of the Week
// @author       l4vr0vatyahoo@gmail.com
// @license      MIT
// @icon         https://avatars1.githubusercontent.com/u/55962744
// @match        *://*warzone.com/mapoftheweek/Nominate
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/439591/Hide%20Already-Nominated%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/439591/Hide%20Already-Nominated%20Maps.meta.js
// ==/UserScript==
nomineesTable = document.getElementsByClassName("dataTable")[0];
console.log("Hiding already-nominated maps of the week!");
for (var row_idx = 0, row; row = nomineesTable.rows[row_idx]; row_idx++) {
    if (row.cells[1].textContent.includes("been voted on before")) {
        row.style = "display: none";
    }
}