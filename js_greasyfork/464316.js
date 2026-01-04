// ==UserScript==
// @name         Trouve du BITCOIN sur KEYS.LOL automatiquement
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  Find a non-zero Bitcoin wallet balance on keys.lol and show an alert message
// @author       sd
// @match        https://keys.lol/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464316/Trouve%20du%20BITCOIN%20sur%20KEYSLOL%20automatiquement.user.js
// @updateURL https://update.greasyfork.org/scripts/464316/Trouve%20du%20BITCOIN%20sur%20KEYSLOL%20automatiquement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function find() {
        let bals = document.getElementsByClassName("wallet-balance");

        let nonZeroFound = false;
        for (let i = 0; i < bals.length; i++) {
            const balance = bals[i].innerText;
            if (balance !== "0 btc" && balance !== "0 eth") {
                nonZeroFound = true;
                break;
            }
        }

        if (nonZeroFound) {
            alert("Tu es riche GG");
        } else {
            document.getElementsByClassName("text-black")[5].click();
        }
    }

    // UI to show remaining time and adjust delay
    const delayInput = document.createElement("input");
    delayInput.type = "range";
    delayInput.min = "1";
    delayInput.max = "60";
    delayInput.value = localStorage.getItem("delay") || "10";
    delayInput.addEventListener("input", () => {
        delaySpan.innerText = delayInput.value;
       localStorage.setItem("delay", delaySpan.innerText)
    });

    const delaySpan = document.createElement("span");
    delaySpan.innerText = delayInput.value;

    const refreshDiv = document.createElement("div");
    refreshDiv.style = "position: fixed; top: 10px; right: 10px; background-color: white; border: 1px solid black; padding: 5px;";
    refreshDiv.appendChild(document.createTextNode("Refresh delay (seconds): "));
    refreshDiv.appendChild(delaySpan);
    refreshDiv.appendChild(delayInput);
    document.body.appendChild(refreshDiv);

    // Refresh loop with delay based on user input
    let refreshDelay = parseInt(delayInput.value) * 1000;
    let remainingTime = refreshDelay / 1000;
    const remainingTimeSpan = document.createElement("span");
    remainingTimeSpan.innerText = remainingTime;
    refreshDiv.appendChild(document.createElement("br"));
    refreshDiv.appendChild(document.createTextNode("Remaining time: "));
    refreshDiv.appendChild(remainingTimeSpan);

    setInterval(() => {
        remainingTime--;
        if (remainingTime === 0) {
            remainingTime = refreshDelay / 1000;
            find();

        }
        remainingTimeSpan.innerText = remainingTime;
    }, 1000);
})();
