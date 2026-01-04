// ==UserScript==
// @name         WTA API Matches Table
// @namespace    http://tampermonkey.net/
// @version      2.2
// @license      MIT
// @author       JV
// @description  Zobrazí tabulku zápasů
// @match        https://api.wtatennis.com/tennis/tournaments/*/2026/matches
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539880/WTA%20API%20Matches%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/539880/WTA%20API%20Matches%20Table.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🟢 Vrátí text pro tým (singl nebo debl)
    function formatTeam(m, isHome) {
        if (isHome) {
            if (m.PlayerNameLastA2) {
                // debl domácí
                return `${m.PlayerNameFirstA} ${m.PlayerNameLastA} (${m.PlayerCountryA}) / ${m.PlayerNameFirstA2} ${m.PlayerNameLastA2} (${m.PlayerCountryA2})`;
            }
            // singl domácí
            return `${m.PlayerNameFirstA} ${m.PlayerNameLastA} (${m.PlayerCountryA})`;
        } else {
            if (m.PlayerNameLastB2) {
                // debl hosté
                return `${m.PlayerNameFirstB} ${m.PlayerNameLastB} (${m.PlayerCountryB}) / ${m.PlayerNameFirstB2} ${m.PlayerNameLastB2} (${m.PlayerCountryB2})`;
            }
            // singl hosté
            return `${m.PlayerNameFirstB} ${m.PlayerNameLastB} (${m.PlayerCountryB})`;
        }
    }

    function createTable(matches, tournamentId, year) {
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '1em';
        table.style.color = '#222';
        table.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        table.style.margin = '0 auto';

        const header = table.createTHead();
        const headerRow = header.insertRow();
        ['Domácí', 'Hosté', 'Výsledek', 'MatchState', 'Stats', 'MatchID'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.padding = '6px 12px';
            th.style.borderBottom = '3px solid #ccc';
            th.style.textAlign = 'center';
            th.style.whiteSpace = 'nowrap';
            headerRow.appendChild(th);
        });

        const tbody = document.createElement('tbody');
        matches.slice().reverse().forEach(m => {
            if (m.MatchState === 'F') return;

            const row = tbody.insertRow();
            const cells = [
                formatTeam(m, true),   // domácí
                formatTeam(m, false),  // hosté
                m.ScoreString || '',
                m.MatchState || '',
                '',  // Stats odkaz
                m.MatchID
            ];

            cells.forEach((text, i) => {
                const cell = row.insertCell();
                if (i === 4) {
                    const a = document.createElement('a');
                    a.href = `https://api.wtatennis.com/tennis/tournaments/${tournamentId}/2026/matches/${m.MatchID}/stats`;
                    a.textContent = 'Stats';
                    a.target = '_blank';
                    a.style.color = '#0073e6';
                    a.style.textDecoration = 'none';
                    a.style.fontWeight = '600';
                    a.onmouseenter = () => a.style.textDecoration = 'underline';
                    a.onmouseleave = () => a.style.textDecoration = 'none';
                    cell.appendChild(a);
                } else {
                    cell.textContent = text;
                }
                cell.style.padding = '6px 12px';
                cell.style.borderBottom = '1px solid #eee';
                cell.style.whiteSpace = 'nowrap';
            });
        });

        table.appendChild(tbody);
        return table;
    }

    function parseURL() {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length >= 5) {
            return { tournamentId: parts[2], year: parts[3] };
        }
        return null;
    }

    async function main() {
        const params = parseURL();
        if (!params) return console.error('Nelze získat ID turnaje a rok z URL.');

        try {
            const response = await fetch(window.location.href, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            if (!data || !data.matches) return console.error('Data neobsahují zápasy.');

            // Získání názvu turnaje, města a země (s fallbackem)
            const t = data.tournament || {};
            const tournamentName = t.name || t.tournamentName || t.eventName || params.tournamentId;
            const tournamentCity = t.city || '';
            const tournamentCountry = t.countryName || '';

            // Vyčistit původní stránku
            document.documentElement.innerHTML = '';
            const body = document.createElement('body');
            body.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
            body.style.margin = '0';
            body.style.display = 'flex';
            body.style.flexDirection = 'column';
            body.style.alignItems = 'center';
            body.style.justifyContent = 'center';
            body.style.minHeight = '100vh';
            body.style.backgroundColor = '#fff';
            body.style.padding = '20px';

            const container = document.createElement('div');
            container.style.maxWidth = '900px';
            container.style.width = '100%';
            container.style.textAlign = 'center';

            const heading = document.createElement('h2');
            heading.textContent = `WTA Matches - ${tournamentName} (${params.year}) ${tournamentCity ? "- " + tournamentCity : ""} ${tournamentCountry ? "(" + tournamentCountry + ")" : ""}`;
            heading.style.fontWeight = 'normal';
            heading.style.marginBottom = '20px';

            container.appendChild(heading);
            container.appendChild(createTable(data.matches, params.tournamentId, params.year));
            body.appendChild(container);
            document.documentElement.appendChild(body);

        } catch (e) {
            console.error('Chyba při načítání dat:', e);
        }
    }

    main();

})();
