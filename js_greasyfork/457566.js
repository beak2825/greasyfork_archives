// ==UserScript==
// @name         Print Diet Troops
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open travian rally point and go to overview in diet village
// @author       Matt Garnett
// @match        https://ts8.x1.america.travian.com/build.php?gid=16&tt=1&filter=3&page=*
// @icon         https://www.google.com/s2/favicons?domain=travian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457566/Print%20Diet%20Troops.user.js
// @updateURL https://update.greasyfork.org/scripts/457566/Print%20Diet%20Troops.meta.js
// ==/UserScript==

let unitMap = {
    // roman
    roman: {
        u1: "Legionnaire",
        u2: "Praetorian",
        u3: "Imperian",
        u4: "Equites Legati",
        u5: "Equites Imperatoris",
        u6: "Equites Caesaris",
        u7: "Battering Ram",
        u8: "Fire Catapult",
        u9: "Senator",
        u10: "Settler",
    },
    // teuton
    teuton: {
        u11: "Clubswinger",
        u12: "Spearman",
        u13: "Axeman",
        u14: "Scout",
        u15: "Paladin",
        u16: "Teutonic Knight",
        u17: "Ram",
        u18: "Catapult",
        u19: "Chief",
        u20: "Settler",
    },
    // gaul
    gaul: {
        u21: "Phalanx",
        u22: "Swordsman",
        u23: "Pathfinder",
        u24: "Theutates Thunder",
        u25: "Druidrider",
        u26: "Haeduan",
        u27: "Ram",
        u28: "Trebuchet",
        u29: "Chieftain",
        u30: "Settler",
    },
};

function resetKey() {
    // reset the key for the current page
    localStorage.removeItem("print-diet-troops-tracker");

    // give confirmation
    alert("Reset the tracker for this page");
}

function setupResetButton() {
    // add a button to the top right of the page to reset all keys
    let resetButton = document.createElement("button");

    resetButton.innerText = "Reset Diet Troops Data";
    resetButton.style.position = "absolute";
    resetButton.style.top = "0";
    resetButton.style.right = "0";
    resetButton.style.zIndex = "9999";
    // make it styled grey
    resetButton.style.backgroundColor = "#4CAF50";
    resetButton.style.border = "none";
    resetButton.style.color = "white";
    resetButton.style.padding = "7px 16px";
    resetButton.style.textAlign = "center";
    resetButton.style.textDecoration = "none";
    resetButton.style.display = "inline-block";
    resetButton.style.fontSize = "16px";
    resetButton.style.margin = "4px 2px";
    resetButton.style.cursor = "pointer";

    resetButton.onclick = resetKey;

    document.body.appendChild(resetButton);
}

function getPlayerNames(p, addData) {
    // Find all table elements with the class name "troop_details"
    let tables = document.querySelectorAll(".troop_details");

    let players = p || [];

    // for each table, find the value of the element attribute "data-player-name"
    if (addData) {
        for (let i = 0; i < tables.length; i++) {
            let dvid = parseInt(tables[i].getAttribute("data-vid"));
            let consumption = parseInt(
                tables[i].querySelector(".value").innerText
            );

            // prettier-ignore
            let tribe = dvid === 1 ? "roman" : ((dvid === 2) ? "teuton" : "gaul");

            let troops = {};

            // retrieve the tbody element with the classes "units" and "last"
            let tbody = tables[i].querySelector(".units.last");

            // get a list of children elements on the first tr element in tbody
            let tr = tbody.children[0].children;

            // map unitMap[tribe] values to a new object as keys and set each value to 0
            Object.values(unitMap[tribe]).forEach((value, j) => {
                troops[value] = parseInt(tr[j + 1].innerText);
            });

            let username = tables[i].getAttribute("data-player-name");

            if (players.some((p) => p.username === username)) {
                // find the player in the players array
                let pi = players.findIndex((p) => p.username === username);

                // update the player's troops iteratively with the new troops
                for (let troop in troops) {
                    players[pi].troops[troop] += parseInt(troops[troop]);
                }

                // add consumption
                players[pi].consumption += consumption;
            } else {
                let newPlayer = {
                    username,
                    tribe,
                    troops,
                    consumption,
                };

                players.push(newPlayer);
            }
        }
    }

    // log
    console.log(players);

    // save to local storage
    localStorage.setItem("print-diet-troops-tracker", JSON.stringify(players));
}

(function () {
    "use strict";

    setupResetButton();

    // if local storage contains key "print-diet-troops-tracker", retrieve it
    let players = localStorage.getItem("print-diet-troops-tracker");

    // log players before
    console.log(players);

    // if players is not null, parse it
    if (players) players = JSON.parse(players);

    getPlayerNames(players, false);
})();
