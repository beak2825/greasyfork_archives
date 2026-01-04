// ==UserScript==
// @name         VBL - Německý volejbal
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Přidává tlačítko s ID zápasu
// @author       Michal
// @match        https://www.vbl-ticker.de/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522289/VBL%20-%20N%C4%9Bmeck%C3%BD%20volejbal.user.js
// @updateURL https://update.greasyfork.org/scripts/522289/VBL%20-%20N%C4%9Bmeck%C3%BD%20volejbal.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(async function linkMatchesWithIds() {
        try {
            const response = await fetch('https://backend.sams-ticker.de/live/indoor/tickers/vbl');
            if (!response.ok) {
                throw new Error(`HTTP chyba! Status: ${response.status}`);
            }
            const data = await response.json();

            const matchDetails = data.matchDays.flatMap(matchDay =>
                matchDay.matches.map(match => ({
                    id: match.id,
                    team1: match.teamDescription1.trim(),
                    team2: match.teamDescription2.trim(),
                    date: new Date(match.date)
                }))
            );

            const matchCards = document.querySelectorAll('.wrapper .MatchCardHeader');
            matchCards.forEach(card => {
                const team1Element = card.querySelector('.leftTeam .TeamLogo-name');
                const team2Element = card.querySelector('.rightTeam .TeamLogo-name');
                const matchDateElement = card.querySelector('.Match-date div:first-child');
                const matchTimeElement = card.querySelector('.Match-date div:last-child');
                const matchInfoDiv = card.querySelector('.Match-info');

                if (!team1Element || !team2Element || !matchDateElement || !matchTimeElement) {
                    return;
                }

                const team1Name = team1Element.textContent.trim();
                const team2Name = team2Element.textContent.trim();
                const matchDateText = matchDateElement.textContent.trim();
                const matchTimeText = matchTimeElement.textContent.trim();

                const dateRegex = /(\d{2})\.(\d{2})\./;
                const timeRegex = /(\d{2}):(\d{2})/;

                const dateMatch = matchDateText.match(dateRegex);
                const timeMatch = matchTimeText.match(timeRegex);

                if (!dateMatch || !timeMatch) {
                    return;
                }

                const day = parseInt(dateMatch[1], 10);
                const month = parseInt(dateMatch[2], 10) - 1;
                const year = new Date().getFullYear();

                const hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);

                const matchDateTime = new Date(year, month, day, hours, minutes);

                const match = matchDetails.find(m =>
                    ((m.team1 === team1Name && m.team2 === team2Name) ||
                        (m.team1 === team2Name && m.team2 === team1Name)) &&
                    m.date.getTime() === matchDateTime.getTime()
                );

                if (match) {
                    let idButton = matchInfoDiv.querySelector('.match-id-button');
                    if (!idButton) {
                        idButton = document.createElement('div');
                        idButton.classList.add('match-id-button');
                        idButton.style.padding = '10px';
                        idButton.style.marginTop = '10px';
                        idButton.style.marginBottom = '10px';
                        idButton.style.border = '1px solid #ddd';
                        idButton.style.borderRadius = '5px';
                        idButton.style.backgroundColor = '#f9f9f9';
                        idButton.style.textAlign = 'center';
                        idButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        idButton.style.fontFamily = 'Arial, sans-serif';

                        const button = document.createElement('button');
                        button.textContent = 'ID';
                        button.style.padding = '8px 12px';
                        button.style.marginBottom = '10px';
                        button.style.border = 'none';
                        button.style.borderRadius = '5px';
                        button.style.backgroundColor = '#007BFF';
                        button.style.color = 'white';
                        button.style.cursor = 'pointer';
                        button.style.fontSize = '14px';

                        button.onclick = (event) => {
                            event.preventDefault();
                            const liveUrl = `https://www.vbl-ticker.de/detail/${match.id}`;
                            window.history.replaceState({}, '', liveUrl);
                        };

                        const teamsText = document.createElement('div');
                        teamsText.textContent = `${match.team1} : ${match.team2}`;
                        teamsText.style.marginBottom = '5px';
                        teamsText.style.fontSize = '14px';
                        teamsText.style.fontWeight = 'bold';

                        const dateText = document.createElement('div');
                        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                        dateText.textContent = match.date.toLocaleDateString('cs-CZ', options);
                        dateText.style.fontSize = '12px';
                        dateText.style.color = '#555';

                        idButton.appendChild(button);
                        idButton.appendChild(teamsText);
                        idButton.appendChild(dateText);

                        matchInfoDiv.appendChild(idButton);
                    }
                }
            });
        } catch (error) {
            console.error("Chyba při zpracování:", error);
        }
    }, 3000);
})();