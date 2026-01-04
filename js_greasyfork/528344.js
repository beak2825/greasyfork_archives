// ==UserScript==
// @name         Turecké basketbaly - Testování statusů - upravená verze
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  Api pro stats - Možnost plnit Turecké Basketbaly
// @author       Michal
// @match        https://eapi.web.prod.cloud.atriumsports.com/v1/embed/*/fixture_detail?state=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528344/Tureck%C3%A9%20basketbaly%20-%20Testov%C3%A1n%C3%AD%20status%C5%AF%20-%20upraven%C3%A1%20verze.user.js
// @updateURL https://update.greasyfork.org/scripts/528344/Tureck%C3%A9%20basketbaly%20-%20Testov%C3%A1n%C3%AD%20status%C5%AF%20-%20upraven%C3%A1%20verze.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const stateId = window.location.href.split("state=")[1];
    const storageKey = `savedStatuses_${stateId}`;
    const timeKey = `suspect_konec_2q_time_${stateId}`;
    let savedStatuses = JSON.parse(sessionStorage.getItem(storageKey)) || {};

    function sanitizeId(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    function getCurrentMinute(timeStr) {
        if (!timeStr || ["N/A", "null"].includes(timeStr)) return 0;
        const match = timeStr.match(/PT(\d+)M(\d+)S/);
        if (!match) return 0;
        const totalSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
        const remaining = Math.floor(totalSeconds / 60);
        return Math.max(0, Math.min(10 - remaining, 10));
    }

    function isRunning(time) {
        if (!time || ["N/A", "null", "PT0M0S"].includes(time)) return false;
        const match = time.match(/PT(\d+)M(\d+)S/);
        if (!match) return false;
        const totalSec = parseInt(match[1]) * 60 + parseInt(match[2]);
        return totalSec > 0 && totalSec <= 599;
    }

    function getStatuses(matchData) {
        const result = matchData?.data?.banner?.fixture?.competitors?.[0]?.resultStatus || "N/A";
        const period = parseInt(matchData?.data?.summary?.status?.periodId || "0");
        const mainTime = matchData?.data?.summary?.clock?.main || "N/A";

        let showKonec2Q = false;

        if (period === 3) {
            showKonec2Q = true;
        } else if (period === 2) {
            const timeIsStopped = !mainTime || ["N/A", "null", "PT0M0S"].includes(mainTime);
            const now = Date.now();
            const savedTime = parseInt(sessionStorage.getItem(timeKey) || "0");

            if (timeIsStopped) {
                if (!savedTime) {
                    sessionStorage.setItem(timeKey, now.toString());
                } else if (now - savedTime >= 2 * 60 * 1000) {
                    showKonec2Q = true;
                }
            } else {
                sessionStorage.removeItem(timeKey);
            }
        } else {
            sessionStorage.removeItem(timeKey);
        }

        const currentStatuses = {
            "Start zápasu": (
                (["1", "2", "3", "4"].includes(period.toString()) && result === "IN_PROGRESS")
                || (period === 1 && isRunning(mainTime))
            ) ? "Start zápasu" : null,
            "Konec 1. čtvrtiny": (period === 2) ? "Konec 1. čtvrtiny" : null,
            "Konec 2. čtvrtiny": showKonec2Q ? "Konec 2. čtvrtiny" : null,
            "3. čtvrtina": (period === 3 && isRunning(mainTime)) ? "3. čtvrtina" : null,
            "Konec 3. čtvrtiny": (period === 4) ? "Konec 3. čtvrtiny" : null,
            "Prodloužení": (period === 11) ? "Prodloužení" : null,
            "Konec zápasu": (result === "CONFIRMED") ? "Konec zápasu" : null
        };

        let updated = false;
        for (const key in currentStatuses) {
            if (currentStatuses[key] && !savedStatuses[key]) {
                savedStatuses[key] = currentStatuses[key];
                updated = true;
            }
        }

        if (updated) {
            sessionStorage.setItem(storageKey, JSON.stringify(savedStatuses));
        }

        return {
            "Start zápasu": savedStatuses["Start zápasu"] || "N/A",
            "Konec 1. čtvrtiny": savedStatuses["Konec 1. čtvrtiny"] || "N/A",
            "Konec 2. čtvrtiny": savedStatuses["Konec 2. čtvrtiny"] || "N/A",
            "3. čtvrtina": savedStatuses["3. čtvrtina"] || "N/A",
            "Konec 3. čtvrtiny": savedStatuses["Konec 3. čtvrtiny"] || "N/A",
            "Prodloužení": savedStatuses["Prodloužení"] || "N/A",
            "Konec zápasu": savedStatuses["Konec zápasu"] || "N/A",
            "Výsledek (API)": result
        };
    }

    function createStatsTable(matchData) {
        const oldTable = document.getElementById("custom-stats-container");
        if (oldTable) oldTable.remove();

        const container = document.createElement("div");
        container.id = "custom-stats-container";
        Object.assign(container.style, {
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: "999999", overflow: "auto", maxHeight: "90vh"
        });

        const statuses = getStatuses(matchData);
        const homeTeam = matchData?.data?.banner?.fixture?.competitors?.find(t => t.isHome) || {};
        const awayTeam = matchData?.data?.banner?.fixture?.competitors?.find(t => !t.isHome) || {};
        const leagueName = matchData?.data?.banner?.competition?.name || "N/A";
        const mainTime = matchData?.data?.summary?.clock?.main || "N/A";

        const statusTable = document.createElement("table");
        statusTable.style.width = "100%";
        statusTable.style.borderCollapse = "collapse";
        statusTable.style.marginBottom = "20px";

        const allStatusData = [
            ["Soutěž", leagueName],
            ["Výsledek (API)", statuses["Výsledek (API)"]],
            ["Domácí tým", homeTeam.name || "N/A"],
            ["Hostující tým", awayTeam.name || "N/A"],
            ["Hlavní čas", mainTime],
            ["Uplynulá minuta", getCurrentMinute(mainTime)],
            ["Čas běží", matchData?.data?.summary?.clock?.running ? "Ano" : "Ne"],
            ["Fáze hry", matchData?.data?.summary?.status?.period || "N/A"],
            ["Část zápasu", matchData?.data?.summary?.status?.periodId || "N/A"],
            ["Skóre domácí", homeTeam.score || "N/A"],
            ["Skóre hosté", awayTeam.score || "N/A"],
            ["Start zápasu", statuses["Start zápasu"]],
            ["Konec 1. čtvrtiny", statuses["Konec 1. čtvrtiny"]],
            ["Konec 2. čtvrtiny", statuses["Konec 2. čtvrtiny"]],
            ["3. čtvrtina", statuses["3. čtvrtina"]],
            ["Konec 3. čtvrtiny", statuses["Konec 3. čtvrtiny"]],
            ["Prodloužení", statuses["Prodloužení"]],
            ["Konec zápasu", statuses["Konec zápasu"]]
        ];

        allStatusData.forEach(([label, value]) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td id="${sanitizeId(label)}-label" style="border:1px solid;padding:8px;background:#f0f0f0;font-weight:bold;">${label}</td>
                <td id="${sanitizeId(label)}-value" style="border:1px solid;padding:8px;">${value}</td>
            `;
            statusTable.appendChild(row);
        });

        const stats = matchData?.data?.statistics?.data?.base || {};
        const homeStats = stats.home?.entity || {};
        const awayStats = stats.away?.entity || {};

        const statNames = [
            "assists", "blocks", "fieldGoalsAttempted", "fieldGoalsMade", "fieldGoalsPercentage",
            "foulsDrawn", "foulsTotal", "freeThrowsAttempted", "freeThrowsMade", "freeThrowsPercentage",
            "minutes", "points", "pointsThreeAttempted", "pointsThreeMade", "pointsThreePercentage",
            "pointsTwoAttempted", "pointsTwoMade", "pointsTwoPercentage", "rebounds", "reboundsDefensive",
            "reboundsOffensive", "steals", "turnovers"
        ];

        const statsTable = document.createElement("table");
        statsTable.style.width = "100%";
        statsTable.style.borderCollapse = "collapse";
        statsTable.innerHTML = `<tr>${["Statistika", homeTeam.name, awayTeam.name].map(h => `<th style="border:1px solid;padding:8px;">${h}</th>`).join("")}</tr>`;

        statNames.forEach(stat => {
            statsTable.innerHTML += `<tr>${[stat, homeStats[stat] || "N/A", awayStats[stat] || "N/A"]
                .map(d => `<td style="border:1px solid;padding:8px;">${d}</td>`).join("")}</tr>`;
        });

        container.append(statusTable, statsTable);
        document.body.appendChild(container);
    }

    const url = new URL(window.location.href);
const embedId = url.pathname.split("/")[3]; // vezme číslo po /embed/

fetch(`https://eapi.web.prod.cloud.atriumsports.com/v1/embed/${embedId}/fixture_detail?state=${stateId}`)
    .then(r => r.json())
    .then(d => setTimeout(() => createStatsTable(d), 3000))
    .catch(e => console.error(e));


})();