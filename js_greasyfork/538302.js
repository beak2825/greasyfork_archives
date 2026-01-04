// ==UserScript==
// @name         FMP Player Training Insight Box
// @namespace    https://osama.dev
// @version      1.4
// @description  Show GI + latest increased skills from training in player page
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538302/FMP%20Player%20Training%20Insight%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/538302/FMP%20Player%20Training%20Insight%20Box.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GI_RATING = (gi) => {
        const val = parseFloat(gi);
        if (val <= 5) return 'Low';
        if (val <= 10) return 'Acceptable';
        if (val <= 20) return 'Good';
        if (val <= 30) return 'Very Good';
        if (val <= 40) return 'Excellent';
        if (val <= 60) return 'Legendary';
        return 'Unknown';
    };

    const getPlayerName = () => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.textContent.trim().replace(/\s+/g, ' ') : null;
    };

    const getGI = () => {
        const allTds = Array.from(document.querySelectorAll("td"));
        for (const td of allTds) {
            if (td.textContent.includes("/25")) {
                const match = td.textContent.match(/(\d+(\.\d+)?)\s*\/\s*25/);
                if (match) return match[1];
            }
        }
        return null;
    };

    const extractIncreasedSkillsFromHTML = (html, playerName) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const rows = doc.querySelectorAll('table#gklist tr, table#plist tr');
        const skillNames = ["Sta","Pac","Han","One","Ref","Pos","Ele","Aer","Kic","Jum","Thr",
                            "For","Tac","Mar","Tec","Cro","Hea","Fin","Lon","Pas"];

        for (const row of rows) {
            const nameTd = row.querySelector('a.name');
            if (nameTd && nameTd.textContent.trim().replace(/\s+/g, ' ') === playerName) {
                const tds = Array.from(row.querySelectorAll('td'));
                const increased = [];
                tds.forEach((td, i) => {
                    if (td.querySelector('.training.pl')) {
                        const skillIndex = i - 6; // adjust index to map to skillNames
                        if (skillIndex >= 0 && skillIndex < skillNames.length) {
                            increased.push(skillNames[skillIndex]);
                        }
                    }
                });
                return increased;
            }
        }
        return [];
    };

    const displayBox = (gi, label, skills) => {
        const target = document.querySelector("#Training")?.closest("table");
        if (!target) return;

        const box = document.createElement("div");
        box.style.background = '#003300';
        box.style.color = '#fff';
        box.style.padding = '12px';
        box.style.marginTop = '15px';
        box.style.fontSize = '14px';
        box.style.border = '1px solid #66cc66';
        box.style.borderRadius = '8px';

        box.innerHTML = `<strong>Latest Player Improvement:</strong> ${label}<br>
                         <strong>GI:</strong> ${gi}<br>
                         <strong>Increased in:</strong> ${skills.length ? skills.join(", ") : 'No data found'}`;

        target.parentElement.appendChild(box);
    };

    const start = async () => {
        const playerName = getPlayerName();
        const gi = getGI();
        if (!playerName || !gi) return;

        try {
            const res = await fetch("https://footballmanagerproject.com/Team/Training", { credentials: 'include' });
            const html = await res.text();
            const skills = extractIncreasedSkillsFromHTML(html, playerName);
            const label = GI_RATING(gi);
            displayBox(gi, label, skills);
        } catch (e) {
            console.error('Failed to fetch training data:', e);
        }
    };

    window.addEventListener("load", () => setTimeout(start, 1500));
})();
