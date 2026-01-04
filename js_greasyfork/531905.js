// ==UserScript==
// @name         Torn Arrest Target Predictor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show crime stats from most recent week with jail activity (up to 4 weeks back)
// @author       fourzees [3002874]
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531905/Torn%20Arrest%20Target%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/531905/Torn%20Arrest%20Target%20Predictor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'INSERT PUBLIC API KEY HERE';

    const STAT_KEYS = [
        "jailed",
        "criminaloffenses",
        "vandalism",
        "theft",
        "counterfeiting",
        "fraud",
        "illicitservices",
        "cybercrime"
    ];

    const DISPLAY_NAMES = {
        jailed: "Jailed",
        criminaloffenses: "Criminal Offenses",
        vandalism: "Vandalism",
        theft: "Theft",
        counterfeiting: "Counterfeiting",
        fraud: "Fraud",
        illicitservices: "Illicit Services",
        cybercrime: "Cybercrime"
    };

    const nativeFetch = window.fetch;
    window.fetch = function (...args) {
        if (args.length === 1) return nativeFetch.call(this, args[0]);
        return nativeFetch.apply(this, args);
    };

    function extractUserId() {
        const params = new URLSearchParams(window.location.search);
        return params.get("XID");
    }

    async function fetchStats(userId, timestamp = null) {
        const statList = STAT_KEYS.join(",");
        let url = `https://api.torn.com/v2/user/${userId}/personalstats?stat=${statList}&key=${API_KEY}`;
        if (timestamp) url += `&timestamp=${timestamp}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(data.error.error);

        const stats = {};

        if (Array.isArray(data.personalstats)) {
            for (const stat of data.personalstats) {
                stats[stat.name] = stat.value;
            }
        } else if (typeof data.personalstats === 'object') {
            const ps = data.personalstats;
            stats.jailed = ps.jailed ?? ps.jail?.times_jailed ?? 0;
            stats.criminaloffenses = ps.criminaloffenses ?? ps.crimes?.offenses?.total ?? 0;
            stats.vandalism = ps.vandalism ?? ps.crimes?.offenses?.vandalism ?? 0;
            stats.theft = ps.theft ?? ps.crimes?.offenses?.theft ?? 0;
            stats.counterfeiting = ps.counterfeiting ?? ps.crimes?.offenses?.counterfeiting ?? 0;
            stats.fraud = ps.fraud ?? ps.crimes?.offenses?.fraud ?? 0;
            stats.illicitservices = ps.illicitservices ?? ps.crimes?.offenses?.illicit_services ?? 0;
            stats.cybercrime = ps.cybercrime ?? ps.crimes?.offenses?.cybercrime ?? 0;
        }

        return stats;
    }

    async function findMostRecentJailWeek(userId, current) {
        const now = Math.floor(Date.now() / 1000);
        const weekSeconds = 7 * 24 * 60 * 60;

        for (let weeksAgo = 1; weeksAgo <= 4; weeksAgo++) {
            const timestamp = now - weeksAgo * weekSeconds;
            const past = await fetchStats(userId, timestamp);

            const jailedDelta = (current.jailed ?? 0) - (past.jailed ?? 0);
            if (jailedDelta > 0 || weeksAgo === 4) {
                return { past, weeksAgo };
            }
        }
    }

    function buildStatsTable(current, past, weeksAgo) {
        const jailedDelta = (current.jailed ?? 0) - (past.jailed ?? 0);

        const wrapper = document.createElement("div");
        wrapper.style.padding = "10px";
        wrapper.style.backgroundColor = "#f9f9f9";
        wrapper.style.color = "#333";
        wrapper.style.marginTop = "10px";
        wrapper.style.border = "1px solid #ccc";
        wrapper.style.borderRadius = "6px";
        wrapper.style.fontSize = "13px";
        wrapper.style.maxWidth = "400px";

        // Jail warning with dynamic wording and coloring
        const weeksAgoDisplay = weeksAgo - 1;

        const warning = document.createElement("div");

        if (jailedDelta >= 0) {
            if (weeksAgoDisplay >= 3) {
                warning.textContent = `🚨 LAST JAILED MORE THAN 4 WEEKS AGO`;
                warning.style.color = "green";
            } else {
                const weekText = weeksAgoDisplay === 1 ? "WEEK" : "WEEKS";
                warning.textContent = `🚨 LAST JAILED ${weeksAgoDisplay} ${weekText} AGO`;
                warning.style.color = weeksAgoDisplay >= 2 ? "green" : "red";
            }

            warning.style.fontSize = "16px";
            warning.style.fontWeight = "bold";
            warning.style.marginBottom = "8px";
            wrapper.appendChild(warning);
        }

        // ðŸ”¹ Clean header (no week info in title now)
        const title = document.createElement("h3");
        title.textContent = "📊 Crime Activity";
        title.style.marginTop = "0";
        title.style.marginBottom = "8px";
        title.style.fontSize = "16px";
        title.style.color = "#222";
        wrapper.appendChild(title);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const headerRow = document.createElement("tr");
        ["Crime", "Total", `Past ${weeksAgo} week${weeksAgo > 1 ? 's' : ''}`].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            th.style.padding = "4px";
            th.style.borderBottom = "1px solid #bbb";
            th.style.textAlign = "left";
            th.style.fontSize = "13px";
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        const boldRows = ["illicitservices", "fraud", "cybercrime"];

        for (const key of STAT_KEYS) {
            const currentVal = current[key] ?? 0;
            const pastVal = past[key] ?? 0;
            const delta = currentVal - pastVal;
            const label = DISPLAY_NAMES[key] || key.charAt(0).toUpperCase() + key.slice(1);

            const row = document.createElement("tr");
            const cells = [label, currentVal, delta > 0 ? `+${delta}` : `${delta}`];

            cells.forEach((val, i) => {
                const td = document.createElement("td");
                td.textContent = val;
                td.style.padding = "4px";
                td.style.fontSize = "13px";
                td.style.color = (i === 2 && delta > 0) ? "green" : "#333";
                if (boldRows.includes(key)) {
                    td.style.fontWeight = "bold";
                }
                row.appendChild(td);
            });

            table.appendChild(row);
        }

        wrapper.appendChild(table);
        return wrapper;
    }

    function insertBelowButtons(wrapper) {
        const container = document.querySelector(".profile-container");
        const buttons = container?.querySelector(".buttons-container");

        if (buttons && buttons.parentNode) {
            buttons.parentNode.insertBefore(wrapper, buttons.nextSibling);
        } else if (container) {
            container.appendChild(wrapper);
        }
    }

    async function run() {
        const userId = extractUserId();
        if (!userId) return;

        try {
            const current = await fetchStats(userId);
            const { past, weeksAgo } = await findMostRecentJailWeek(userId, current);
            const table = buildStatsTable(current, past, weeksAgo);
            insertBelowButtons(table);
        } catch (e) {
            console.error("ðŸ”¥ Error fetching or displaying stats:", e.message || e);
        }
    }

    function waitAndRun() {
        const interval = setInterval(() => {
            const found = document.querySelector(".profile-container");
            if (found) {
                clearInterval(interval);
                run();
            }
        }, 300);
    }

    waitAndRun();
})();
