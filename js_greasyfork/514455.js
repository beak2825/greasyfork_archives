// ==UserScript==
// @name         Profile Statistics
// @namespace    Apo
// @version      1.5
// @description  Provides info on a user's activity over the past month!
// @author       Apollyon [445323]
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514455/Profile%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/514455/Profile%20Statistics.meta.js
// ==/UserScript==

var api_key = "APIKEYHERE";

// Helper function to fetch stats
async function fetchPersonalStats(id, time) {
    const stats = "xantaken,energydrinkused,useractivity,refills,attackswon,respectforfaction,retals,traveltimes,statenhancersused,networth";
    const url = time !== undefined
        ? `https://api.torn.com/user/${id}?selections=personalstats&stat=${stats}&timestamp=${time}&key=${api_key}`
        : `https://api.torn.com/user/${id}?selections=personalstats&key=${api_key}`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        return data.personalstats || null;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Main function to process and display stats
async function displayStats() {
    console.log("Fetching personal statistics...");
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const monthAgo = Math.floor(d / 1000);
    const id = window.location.href.split("=")[1];
    const days = (Math.floor(Date.now() / 1000) - monthAgo) / 86400;

    const [statsOld, statsNew] = await Promise.all([fetchPersonalStats(id, monthAgo), fetchPersonalStats(id)]);
    if (!statsOld || !statsNew) {
        console.log("Incomplete data fetch.");
        return;
    }

    // Calculate differences
    const xanaxTaken = statsNew.xantaken - statsOld.xantaken;
    const edrinkTaken = statsNew.energydrinkused - statsOld.energydrinkused;
    const userActivity = (statsNew.useractivity - statsOld.useractivity) / 86400;
    const refills = statsNew.refills - statsOld.refills;
    const attacks = statsNew.attackswon - statsOld.attackswon;
    const totalRespect = statsNew.respectforfaction - statsOld.respectforfaction;
    const retals = statsNew.retals - statsOld.retals;
    const travel = statsNew.traveltimes - statsOld.traveltimes;
    const se = statsNew.statenhancersused - statsOld.statenhancersused;
    const networthChange = statsNew.networth - statsOld.networth;

    // Function to color-code values
    function colorCodeNetworth(current, change) {
        const changeText = `(${(change / 1000000000).toFixed(2)}b)`;
        if (change >= 0) {
            return `<span style="color: green;">${(current / 1000000000).toFixed(2)}b ${changeText}</span>`;
        } else {
            return `<span style="color: red;">${(current / 1000000000).toFixed(2)}b ${changeText}</span>`;
        }
    }

    function colorCodeActivity(value) {
        if (value <= 0.5) return `<span style="color: red;">${value.toFixed(2)} hrs/day</span>`;
        else if (value <= 2) return `<span style="color: yellow;">${value.toFixed(2)} hrs/day</span>`;
        else return `<span style="color: green;">${value.toFixed(2)} hrs/day</span>`;
    }

    function colorCodeXanax(value) {
        const perDay = xanaxTaken / days;
        if (perDay < 1.5) return `<span style="color: red;">${xanaxTaken} (${perDay.toFixed(2)} /day)</span>`;
        else if (perDay <= 2) return `<span style="color: yellow;">${xanaxTaken} (${perDay.toFixed(2)} /day)</span>`;
        else return `<span style="color: green;">${xanaxTaken} (${perDay.toFixed(2)} /day)</span>`;
    }

    function colorCodeRefills(value) {
        const perDay = refills / days;
        if (perDay < 0.5) return `<span style="color: red;">${refills} (${perDay.toFixed(2)} /day)</span>`;
        else if (perDay <= 0.8) return `<span style="color: yellow;">${refills} (${perDay.toFixed(2)} /day)</span>`;
        else return `<span style="color: green;">${refills} (${perDay.toFixed(2)} /day)</span>`;
    }

    const outputStr = `
        Activity: ${colorCodeActivity(userActivity)}<br>
        Xanax: ${colorCodeXanax(xanaxTaken)}<br>
        Refills: ${colorCodeRefills(refills)}<br>
        Cans: ${edrinkTaken} ( ${(edrinkTaken / days).toFixed(2)} /day )<br>
        Attacks: ${attacks}<br>
        Respect: ${totalRespect}<br>
        Retals: ${retals}<br>
        Travel: ${travel}<br>
        Networth: ${colorCodeNetworth(statsNew.networth, networthChange)}<br>
        SEs: ${se}<br>
    `;

    // Mutation Observer to ensure element availability
    const observer = new MutationObserver(() => {
        const container = document.querySelector(".personal-information.profile-right-wrapper.right");
        if (container) {
            const title = container.querySelector(".title-black.top-round");
            if (title) title.textContent = "Statistics";

            const infoSection = container.querySelector(".profile-container.personal-info");
            if (infoSection) {
                infoSection.style.padding = "10px";
                infoSection.style.fontSize = "14px";
                infoSection.style.color = "#CCCCCC";
                infoSection.style.overflow = "visible";
                infoSection.style.height = "auto";
                infoSection.innerHTML = outputStr;

                // Stop observing after updating
                observer.disconnect();
                console.log("Statistics updated successfully.");
            }
        }
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });
}

// Run the script
displayStats();
