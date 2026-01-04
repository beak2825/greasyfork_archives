// ==UserScript==
// @name         Print Trade Summary
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Open travian reports tab to display a summary of all trade reports received by all members of your confederation
// @author       Matt Garnett
// @match        ts8.x1.america.travian.com/report/other
// @match        ts8.x1.america.travian.com/report/other?page=*
// @icon         https://www.google.com/s2/favicons?domain=travian.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456449/Print%20Trade%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/456449/Print%20Trade%20Summary.meta.js
// ==/UserScript==

let types = {
    0: "wood",
    1: "clay",
    2: "iron",
    3: "wheat",
};

// reset all local storage keys related to this process
function resetAllKeys() {
    const items = { ...localStorage };

    for (const key in items) {
        if (items.hasOwnProperty(key) && key.startsWith("member-")) {
            localStorage.removeItem(key);
        }
    }

    // give confirmation
    alert("Reset the tracker for this page");
}

function setupResetButton() {
    // add a button to the top right of the page to reset all keys
    let resetButton = document.createElement("button");

    resetButton.innerText = "Reset Trade Report Data";
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

    resetButton.onclick = resetAllKeys;

    document.body.appendChild(resetButton);
}

let getMembers = () => {
    let members = [];
    const items = { ...localStorage };
    for (const key in items) {
        if (items.hasOwnProperty(key) && key.startsWith("member-")) {
            members.push(JSON.parse(items[key]));
        }
    }

    console.log("members", members);

    return members;
};

let receivingVillages = ["@@@@ HUB 1 @@@@", "###### HUB 2 ######"];

// ignore this - this isn't required it's just whether you want some reports to not show up as you're paginating through trade reports
// insert village names to ignore
let villageNames = [];

// prettier-ignore
function hideOrHighlightVillageNames(reports) {
    let newMessages = document.querySelectorAll(".newMessage");

    if (newMessages) {
        for (let i = 0; i < newMessages.length; i++) {
            // run this below section for hiding village names
            // for (let j = 0; j < villageNames.length; j++) {
            //     if (villageNames[j].localeCompare(fromVillageName.trimEnd()) == 0) {
            //         newMessages[i].children[2].children[0].innerText = "";
            //     }
            // }
        }
    }

    let oldMessages = document.querySelectorAll(".sub");

    if (oldMessages) {
        for (let i = 0; i < oldMessages.length; i++) {
            // if this element also has class name "newMessage" then skip it
            if (oldMessages[i].classList.contains("newMessage")) {
                continue;
            }

            if (oldMessages[i].children[2].children[0].innerText) {
                let text = oldMessages[i].children[2].children[0].innerText;
                // get the village names
                let fromVillageName = text.split("supplies")[0].trimEnd();
                let recipientVillageName = text.split("supplies")[1].trimStart();
                // get the parent element in the DOM
                let parent = oldMessages[i].parentElement;
                // find the inner text of the parent element with class name "dat"
                let dat = parent.querySelector(".dat").innerText;
                // sentTime equals the hour and minute of the value like "today, 01:11" to "01:11"
                let sentTime = dat.split(",")[1].trim();

                // if reports contains a report with the same recipientVillage and hourMinute value
                // then highlight the village name in orange
                for (let j = 0; j < reports.length; j++) {
                    let { recipientVillage, fromVillage, hourMinute } = reports[j];

                    if (
                        fromVillage.localeCompare(fromVillageName) == 0
                        && recipientVillage.localeCompare(recipientVillageName) == 0
                        && hourMinute == sentTime
                    ) {
                        oldMessages[i].children[2].children[0].style.color = "orange";
                    }
                }
            }

            // run this below section for hiding village names
            // for (let j = 0; j < villageNames.length; j++) {
            //     if (villageNames[j].localeCompare(fromVillageName.trimEnd()) == 0) {
            //         oldMessages[i].children[2].children[0].innerText = "";
            //     }
            // }
        }
    }
}

// prettier-ignore
(function () {
    "use strict";

    setupResetButton();

    // search for a key that matches a username
    let members = getMembers();

    let allReports = [];
    let totalReportCount = 0;
    for (let i = 0; i < members.length; i++) {
        let { username, alliance, totals, reports } = members[i];

        totalReportCount += reports.length;

        // for each report
        for (let j = 0; j < reports.length; j++) {
            let { receivedAt } = reports[j];

            // extract the hour and minute from receivedAt formatted like: "09.12.22, 00:25:34" to get "00:25"
            reports[j].hourMinute = receivedAt.split(",")[1].trim().split(":").slice(0, 2).join(":");

            allReports.push(reports[j]);
        }

        // for each village in totals
        for (const key in totals) {
            if (totals.hasOwnProperty(key)) {
                const { wood, iron, clay, wheat } = totals[key];

                let supplied = wood + iron + clay + wheat;

                // pad alliance tag to characters
                console.log(`${alliance.padEnd(10, " ")} ${username.padEnd(25, " ")} supplied ${supplied} resources to village ${key}`);
            }
        }
    }

    console.log(`Total reports: ${totalReportCount}`);
    // console.log(allReports);

    hideOrHighlightVillageNames(allReports);
})();
