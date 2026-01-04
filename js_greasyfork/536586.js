// ==UserScript==
// @name         LNB tlačítka & Stylish Team Stats
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Spojení tlačítek Basketbal/Statistiky a stylových týmových statistik (live i po zápase) pro lnb.fr
// @author       Lukáš Malec + Michal
// @license      MIT
// @match        https://www.lnb.fr/elite/game-center/*
// @match        https://www.lnb.fr/espoirs-elite/game-center/*
// @match        https://www.lnb.fr/pro-b/game-center/*
// @match        https://www.lnb.fr/elite/game-center-resume/*
// @match        https://www.lnb.fr/pro-b/game-center-resume/*
// @match        https://www.lnb.fr/espoirs-elite/game-center-resume/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lnb.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536586/LNB%20tla%C4%8D%C3%ADtka%20%20Stylish%20Team%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/536586/LNB%20tla%C4%8D%C3%ADtka%20%20Stylish%20Team%20Stats.meta.js
// ==/UserScript==

/* --- Tlačítka Basketbal/Statistiky --- */
(function() {
    'use strict';

    function createLink(href, text) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = text;
        a.target = "_blank";
        a.className = "custom-link";
        Object.assign(a.style, {
            display: "inline-block",
            textAlign: "center",
            padding: "5px 10px",
            marginRight: text === "Basketbal" ? "10px" : "0",
            fontSize: "14px",
            border: "3px solid #041832",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
            textDecoration: "none",
            cursor: "pointer"
        });
        return a;
    }

    function addButtons() {
        const elements = document.querySelectorAll("span.hour a[href]");
        if (!elements.length) return;

        elements.forEach(element => {
            const url = element.getAttribute("href");
            if (url && url.includes("/game-center-resume?id=")) {
                const centerDiv = element.closest("div.center");
                if (!centerDiv) return;
                if (centerDiv.querySelector("a.custom-link")) return;

                const basketballLink = createLink(url + "/", "Basketbal");
                const statsLink = createLink(url, "Statistiky");

                const linkContainer = document.createElement("span");
                Object.assign(linkContainer.style, {
                    display: "flex",
                    justifyContent: "start",
                    gap: "10px"
                });
                linkContainer.append(basketballLink, statsLink);

                const linkDiv = centerDiv.querySelector("div.link");
                if (linkDiv) linkDiv.parentNode.insertBefore(linkContainer, linkDiv);
            }
        });
    }

    function waitForContent() {
        const observer = new MutationObserver(addButtons);
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(addButtons, 2000);
    }

    if (
        location.pathname.startsWith("/elite/game-center") ||
        location.pathname.startsWith("/espoirs-elite/game-center") ||
        location.pathname.startsWith("/pro-b/game-center")
    ) {
        if (document.readyState === "loading") {
            window.addEventListener("DOMContentLoaded", waitForContent);
        } else {
            waitForContent();
        }
    }
})();

/* --- Stylové týmové statistiky --- */
(function () {
    'use strict';

    function getTeamTotals() {
        const liveTables = document.querySelectorAll('.box-score .sw-grid table');
        const postgameTables = document.querySelectorAll('#boxscore-game .boxscore-tab');
        let tables = liveTables.length >= 2 ? liveTables : (postgameTables.length >= 2 ? postgameTables : null);
        if (!tables) return null;

        const result = {};
        ['home', 'away'].forEach((teamType, i) => {
            const table = tables[i];
            if (!table) return;

            let headers = [];
            let totalRow = null;
            if (table.classList.contains('boxscore-tab')) {
                headers = Array.from(table.querySelectorAll('thead th')).slice(1).map(th => th.innerText.trim());
                totalRow = table.querySelector('tbody tr.total-row');
            } else {
                headers = Array.from(table.querySelectorAll('thead th')).slice(2).map(th => th.innerText.trim());
                totalRow = table.querySelector('tbody tr.grid-custom-row-total');
            }
            if (!totalRow) return;

            const cells = Array.from(totalRow.querySelectorAll('td, th')).slice(1).map(td => td.innerText.trim());
            const stats = {};
            headers.forEach((header, index) => stats[header] = cells[index] || '');
            result[teamType] = stats;
        });

        return result;
    }

    function renderStyledTotalTables(totals) {
        const old = document.getElementById('lnb-total-table-container');
        if (old) old.remove();

        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            margin: '30px auto',
            fontFamily: 'Segoe UI, sans-serif',
            justifyContent: 'center'
        });
        container.id = 'lnb-total-table-container';
        document.body.appendChild(container);

        if (!document.getElementById("lnb-custom-style")) {
            const style = document.createElement('style');
            style.id = "lnb-custom-style";
            style.textContent = `
                .custom-stats-table { width:100%; max-width:420px; border-collapse:separate; border-spacing:0; overflow:hidden; border-radius:14px; background:#1e1e2f; color:#f4f4f4; font-family:'Segoe UI',sans-serif; box-shadow:0 6px 18px rgba(0,0,0,0.25);}
                .custom-stats-table caption { text-align:left; font-size:1.4em; font-weight:bold; padding:16px 20px; background:linear-gradient(90deg,#007ACC,#00BFFF); color:white; letter-spacing:0.5px;}
                .custom-stats-table tr:nth-child(even) {background:#2a2a3d;}
                .custom-stats-table tr:hover {background:#33334a;}
                .custom-stats-table td {padding:12px 16px; font-size:0.95em; border-bottom:1px solid #3a3a5c;}
                .custom-stats-table td.label {font-weight:600; color:#ddddff; text-align:left; width:60%;}
                .custom-stats-table td.value {text-align:right; font-weight:bold; width:40%;}
            `;
            document.head.appendChild(style);
        }

        ['home', 'away'].forEach(teamType => {
            const stats = totals[teamType];
            if (!stats) return;
            const statsTable = document.createElement('table');
            statsTable.className = 'custom-stats-table';
            const caption = document.createElement('caption');
            caption.textContent = teamType === 'home' ? '🏠 Domácí tým' : '🚗 Hostující tým';
            statsTable.appendChild(caption);

            for (const [label, value] of Object.entries(stats)) {
                const row = document.createElement('tr');
                const labelCell = document.createElement('td');
                labelCell.className = 'label';
                labelCell.textContent = label;
                const valueCell = document.createElement('td');
                valueCell.className = 'value';
                valueCell.textContent = value;
                valueCell.id = `${teamType}-${label.replace(/\s+/g, '_').replace(/[^\w\-]/g, '')}`;
                row.append(labelCell, valueCell);
                statsTable.appendChild(row);
            }
            container.appendChild(statsTable);
        });
    }

    function showUnavailableMessage() {
        const messageBox = document.createElement('div');
        Object.assign(messageBox.style, {
            maxWidth: '500px',
            margin: '40px auto',
            padding: '24px 32px',
            backgroundColor: '#1e1e2f',
            color: '#ffcccc',
            fontSize: '1.1em',
            fontFamily: 'Segoe UI, sans-serif',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        });
        messageBox.textContent = '📭 Statistiky momentálně nejsou dostupné. Zkuste to prosím později.';
        document.body.appendChild(messageBox);
    }

    if (
        location.pathname.startsWith("/elite/game-center-resume") ||
        location.pathname.startsWith("/pro-b/game-center-resume") ||
        location.pathname.startsWith("/espoirs-elite/game-center-resume")
    ) {
        setTimeout(() => {
            const totals = getTeamTotals();
            if (totals && totals.home && totals.away) {
                renderStyledTotalTables(totals);
            } else {
                showUnavailableMessage();
            }
        }, 3000);
    }
})();