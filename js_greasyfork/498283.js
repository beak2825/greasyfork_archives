// ==UserScript==
// @name         Agma.io Free Coins Hack SİGARAM
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Generate free coins in Agma.io
// @author       SİGARAM
// @match        http://agma.io/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498283/Agmaio%20Free%20Coins%20Hack%20S%C4%B0GARAM.user.js
// @updateURL https://update.greasyfork.org/scripts/498283/Agmaio%20Free%20Coins%20Hack%20S%C4%B0GARAM.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Hide element
    const dashboardBox = document.querySelector(".innerBoxDashboard2");
    if (dashboardBox) dashboardBox.style.display = "none";
 
    // Remove advertisement
    const ad = document.getElementById('AGM_agma-io_300x250');
    if (ad) ad.remove();
 
    // Create and style UI
    const ui = document.createElement("div");
    ui.id = "ui";
    ui.style.width = "100%";
    document.getElementById("advertCenterPanel").appendChild(ui);
 
    ui.innerHTML = `
        <style type="text/css">
        .buttonHack {
            width: 96%;
            height: 38px;
            background-color: #e25e13;
            border-radius: 4px;
            border: 0;
            color: #FFEB3B;
            line-height: 1.42857143;
            text-transform: uppercase;
            letter-spacing: 0.13em;
            font-size: 19px;
        }
        </style>
        <button class="buttonHack" id="hackBtn">Start Hack</button>
    `;
 
    const hackBtn = document.getElementById("hackBtn");
 
    hackBtn.addEventListener("click", function() {
        const amount = prompt("Enter an amount of coins to generate");
        if (amount === null || amount.trim() === "") {
            console.log("Cancelled");
            return;
        }
 
        let counter = 0;
        const statuses = ["generating", "generating.", "generating..", "generating..."];
        const interval = setInterval(function() {
            hackBtn.innerHTML = statuses[counter % statuses.length];
            counter++;
            if (counter === 15) {
                clearInterval(interval);
                hackBtn.setAttribute("disabled", "");
                hackBtn.style.opacity = "0.7";
                hackBtn.innerHTML = "AĞLA!";
                window.location = "https://www.youtube.com/watch?v=_-Fvczk7VOM";
            }
        }, 200);
    });
})();