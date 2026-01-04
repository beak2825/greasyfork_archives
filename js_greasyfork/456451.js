// ==UserScript==
// @name         Log Travian Trade Report
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Open travian trade reports to record the user, report details and accumulative values for each resource type
// @author       Matt Garnett
// @match        ts8.x1.america.travian.com/report/other?id=*
// @icon         https://www.google.com/s2/favicons?domain=travian.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456451/Log%20Travian%20Trade%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/456451/Log%20Travian%20Trade%20Report.meta.js
// ==/UserScript==

let types = {
    0: "wood",
    1: "clay",
    2: "iron",
    3: "wheat",
};

let saveMember = (member) => {
    localStorage.setItem(`member-${member.username}`, JSON.stringify(member));
};

let getMember = (username) => {
    const items = { ...localStorage };
    for (const key in items) {
        if (items.hasOwnProperty(key) && key.startsWith(`member-${username}`)) {
            return JSON.parse(items[key]);
        }
    }
    return false;
};

let newReport = (time, fromVillage, recipientVillage, resources) => {
    return {
        receivedAt: time,
        fromVillage,
        recipientVillage,
        resources,
    };
};

let newResources = () => {
    return {
        wood: 0,
        clay: 0,
        iron: 0,
        wheat: 0,
    };
};

let newMember = (username, alliance) => {
    return {
        username,
        alliance,
        reports: [],
        totals: {
            // "###### HUB 2 ######": {
            //     wood: 0,
            //     clay: 0,
            //     iron: 0,
            //     wheat: 0,
            // }
        },
    };
};

// prettier-ignore
(function () {
    "use strict";

    // get the name of the sender of the resources in the report
    let participants = document.querySelectorAll(".participants")[0];
    let from = participants.querySelector(".from");
    let username = from.querySelector(".player").innerText;
    let fromVillage = from.querySelector(".village").innerText;

    // get the name of the village of the recipient in the report
    let to = participants.querySelector(".to");
    let toVillage = to.querySelector(".village").innerText;

    console.log("From Username: ", username);
    console.log("From Village: ", fromVillage);
    console.log("Recipient Village: ", toVillage);

    // search for a key that matches the username
    let member = getMember(username);

    if (member) {
        // for each village in totals, add up the resources into a total supplied value
        let totalSupplied = 0;
        for (const village in member.totals) {
            if (member.totals.hasOwnProperty(toVillage)) {
                const resources = member.totals[toVillage];
                totalSupplied += resources.wood + resources.clay + resources.iron + resources.wheat;
            }
        }

        console.log(`${member.alliance} ${member.username} supplied ${totalSupplied} resources`);

        // prettier-ignore
        // for (let i = 0; i < pushers.length; i++) {
        //     let supplied = pushers[i].wood + pushers[i].iron + pushers[i].clay + pushers[i].wheat;
        //     console.log(`${pushers[i].alliance} ${pushers[i].username} supplied ${supplied} resources`);
        // }
    } else {
        let alliance = document.querySelectorAll(".player")[0].parentNode.children[0].innerText;

        console.log(`Member from ${alliance} doesn't exist yet, creating...`);

        // create a new member
        member = newMember(username, alliance);
    }

    function logReport() {
        let time = document.querySelectorAll(".time")[0];

        if (time) {
            let timeAndDate = time.firstChild.nextSibling.innerText;
            console.log("Time and Date: ", timeAndDate);

            // check we haven't logged this one already
            for (let i = 0; i < member.reports.length; i++) {
                if (member.reports[i].receivedAt === timeAndDate) {
                    return console.warn("Report already logged - skipping");
                }
            }

            // if we haven't - extract the resources
            let resources = document.querySelectorAll(".resources");

            let tradeRes = newResources();

            for (let i = 0; i < resources.length; i++) {
                // parse the resource value
                tradeRes[types[i]] = resources[i].lastChild.innerText;
                console.log("Resource Value for " + types[i], tradeRes[types[i]]);

                if (!member.totals[toVillage]) {
                    member.totals[toVillage] = newResources();
                }

                // add to rolling total for that resource
                member.totals[toVillage][types[i]] = parseInt(member.totals[toVillage][types[i]]) + parseInt(tradeRes[types[i]]);
                console.log(`User now has ${member.totals[toVillage][types[i]]} ${types[i]} accumulative total`);
            }

            member.reports.push(newReport(timeAndDate, fromVillage, toVillage, tradeRes));

            saveMember(member);
        }
    }

    logReport();
})();
