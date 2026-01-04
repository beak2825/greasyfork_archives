// ==UserScript==
// @name         CEV Live URL Button_edit
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Add Live URL button next to Match Centre without overriding original links - párování i podle času
// @match        https://eurobeachvolley.cev.eu/en/2025/women/*
// @match        https://eurobeachvolley.cev.eu/en/2025/men/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547603/CEV%20Live%20URL%20Button_edit.user.js
// @updateURL https://update.greasyfork.org/scripts/547603/CEV%20Live%20URL%20Button_edit.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const isWomen = window.location.href.includes("/women/");
    const apiUrl = isWomen
        ? "https://eurobeachvolley.cev.eu/umbraco/api/CompetitionApi/GetResultList?tabKey=bfd3f451-e240-4fd3-9cab-495b24d9e410&nodeId=250957&culture=en-US&componentIdent=1"
        : "https://eurobeachvolley.cev.eu/umbraco/api/CompetitionApi/GetResultList?tabKey=c8479385-5ade-4426-ae40-ace174d1b2cc&nodeId=250956&culture=en-US&componentIdent=1";

    let matchData = [];

    async function fetchData() {
        try {
            const res = await fetch(apiUrl);
            const json = await res.json();
            matchData = json.Pools.flatMap(pool => pool.Results || []);
        } catch (e) {
            console.error("Chyba při načítání API dat:", e);
        }
    }

    function updateButtons() {
        document.querySelectorAll('.c-match-summary').forEach(block => {
            const teams = block.querySelectorAll('.c-match-summary__teamCode');
            const dateElem = block.querySelector('.c-match-summary__overview__date');
            const existingLiveBtn = block.querySelector('.btn-live-url');

            if (existingLiveBtn) return;

            const button = block.querySelector('a.btn-box');
            if (teams.length !== 2 || !dateElem || !button) return;

            const team1 = teams[0].innerText.trim();
            const team2 = teams[1].innerText.trim();

            // Příklad: "30/07/2025 17:00"
            const dateParts = dateElem.innerText.trim().split(" ");
            if (dateParts.length < 2) return;
            const [day, month, year] = dateParts[0].split("/");
            const timeText = dateParts[1]; // "HH:MM"

            const dateISO = `${year}-${month}-${day}`;

            const found = matchData.find(m => {
                const [matchDate, matchTime] = (m.MatchDateTime || "").split("T");
                const matchTimeShort = matchTime ? matchTime.slice(0,5) : ""; // "HH:MM"
                const t1 = m.HomeTeam?.NationId;
                const t2 = m.AwayTeam?.NationId;
                return matchDate === dateISO &&
                       matchTimeShort === timeText &&
                       ((t1 === team1 && t2 === team2) || (t1 === team2 && t2 === team1));
            });

            if (found) {
                const liveUrl = `https://www-old.cev.eu/Competition-Area/MatchStatistics.aspx?ID=${found.MatchId}`;
                const newBtn = document.createElement('a');
                newBtn.textContent = 'Live URL';
                newBtn.href = liveUrl;
                newBtn.target = '_blank';
                newBtn.className = 'btn-box btn-live-url';
                newBtn.style.marginLeft = '8px';
                newBtn.style.backgroundColor = '#007bff';
                newBtn.style.color = 'white';
                button.parentNode.appendChild(newBtn);
            }
        });
    }

    await fetchData();
    updateButtons();

    const targetNode = document.querySelector('.matches-container') || document.body;
    const observer = new MutationObserver(() => {
        updateButtons();
    });
    observer.observe(targetNode, { childList: true, subtree: true });
})();
