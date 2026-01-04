// ==UserScript==
// @name         Quick Pet Switch
// @namespace    http://tampermonkey.net/
// @version      2025-06-21
// @description  Switch pets on Neopets Quickref
// @author       You
// @match        https://www.neopets.com/quickref*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540306/Quick%20Pet%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/540306/Quick%20Pet%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

const style = document.createElement('style');
    style.textContent = `
    @font-face {
    font-family: 'Heffaklump';
    src: url('https://raw.githubusercontent.com/unoriginality786/Neopets_Dailies/main/fonts/Heffaklump.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    }

    #nav td {
    text-align: center;
    };

    body {
    font-family: 'Heffaklump', sans-serif;
    background-color: #fdf6ec;
    padding: 20px;
    margin: 0;
    }

    button {
    font-family: 'Heffaklump', sans-serif;
    }

    .button-purple__2020 {
    color: #fff;
    text-shadow: 0 0 4px #000;
    background: linear-gradient(#9153f3, #7223b7);
    border-radius: 15px;
    box-shadow:
    inset 0 0 0 1px rgba(145, 83, 243, 1),
    inset 0 -3px 2px 3px rgba(67, 29, 112, 1),
    inset 0 2px 0 1px rgba(225, 208, 252, 1),
    0 0 0 2px rgba(0, 0, 0, 1);
    padding: 10px 25px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background 0.3s ease;
    margin: 5px;
    }

    .button-purple__2020:hover:not(:disabled),
    .button-purple__2020:focus:not(:disabled) {
    background: linear-gradient(#ac7bff, #ad22f6);
    outline: none;
    }

    .button-purple__2020:active:not(:disabled) {
    background: linear-gradient(#7223b7, #9153f3);
    }

    .button-default__2020:disabled {
    filter: grayscale(100);
    cursor: default;
    }`;

    document.head.appendChild(style);

    // Get the nav bar to insert buttons
    const navTable = document.getElementById("nav");
    if (!navTable) return;
    const tbody = navTable.querySelector("tbody");
    if (!tbody) return;
    const newRow = document.createElement("tr");
    const newCell = document.createElement("td");

    // Adjust colspan according to your table's columns count
    newCell.colSpan = 8;

    const pets = ["My_H2SO4", "Daeliid"];
    pets.forEach(petName => {
        const btn = document.createElement("button");
        btn.className = "button-purple__2020";
        btn.textContent = `Switch to ${petName}`;
        btn.style.marginRight = "10px";
        btn.addEventListener("click", () => {
            window.location.href = `/process_changepet.phtml?new_active_pet=${encodeURIComponent(petName)}`;
        });
        newCell.appendChild(btn);
    });

    newRow.appendChild(newCell);
    tbody.insertBefore(newRow, tbody.firstChild);

})();