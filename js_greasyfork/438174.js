// ==UserScript==
// @name         Bonk input field fix
// @version      1.5
// @author       Salama
// @description  Removes unnecessary password autofills
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/438174/Bonk%20input%20field%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/438174/Bonk%20input%20field%20fix.meta.js
// ==/UserScript==

[...document.querySelectorAll("input[type=text]")].forEach(e => {
    if(!e.classList.contains("loginwindow_field")) {
        e.type="salama";
        e.autocomplete="off";
    }
});

let elem = document.getElementById("passwordChangeContainer")
elem.outerHTML = `<form id="passwordChangeContainer" class="windowShadow">${elem.innerHTML}</form>`;

console.log("Unnecessary password autofills removed");