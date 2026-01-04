// ==UserScript==
// @name         Fetch Fiba.basketball
// @namespace    http://tampermonkey.net/
// @version      2.14
// @description  Přenáší data z jakéhokoliv zápasu FIBA na cílovou stránku a sleduje změny v URL v reálném čase
// @author       Michal
// @match        https://example.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517489/Fetch%20Fibabasketball.user.js
// @updateURL https://update.greasyfork.org/scripts/517489/Fetch%20Fibabasketball.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = '';
    let container;

    function checkUrlAndFetchData() {
        const hash = window.location.hash;

        const fibaUrlPattern = /^#https:\/\/www\.fiba\.basketball\/.+\/games\/\d+-[\w-]+$/;
        if (fibaUrlPattern.test(hash)) {
            const fibaUrl = hash.substring(1);
            if (fibaUrl !== currentUrl) {
                currentUrl = fibaUrl;
                fetchFibaData(fibaUrl);
            }
        } else {
            console.error('Hash neobsahuje platnou FIBA URL:', hash);
        }
    }

    function fetchFibaData(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                const scoreElement = doc.querySelector('.qap2wa2');
                const score = scoreElement ? scoreElement.innerText.trim() : 'N/A';

                const homeTeamElement = doc.querySelector('h1._1bu5s946._1d88n031.japnshh.japnsh17.japnsh1c._1d88n032.japnshs.japnsh1p');
                const awayTeamElement = doc.querySelector('h1._1bu5s946._1d88n031.japnshh.japnsh17.japnsh1c._1d88n032.japnsh1e.japnshs.japnsh1p');
                const homeTeam = homeTeamElement ? homeTeamElement.innerText : 'N/A';
                const awayTeam = awayTeamElement ? awayTeamElement.innerText : 'N/A';

                const statusElement = doc.querySelector('.qap2wa7');
                const status = statusElement ? statusElement.innerText.trim() : 'N/A';

                displayData(homeTeam, awayTeam, score, status);
            },
            onerror: function() {
                console.error('Chyba při načítání stránky:', url);
            }
        });
    }

    function displayData(homeTeam, awayTeam, score, status) {
        if (!container) {
            container = document.createElement('div');
            container.id = 'fiba-data';

            container.style.position = 'fixed';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.backgroundColor = 'white';
            container.style.border = '1px solid black';
            container.style.padding = '10px';
            container.style.zIndex = '1000';
            container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            document.body.appendChild(container);
        }

        let table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        let headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th style="border: 1px solid black; padding: 5px;">Home Team</th>
            <th style="border: 1px solid black; padding: 5px;">Away Team</th>
            <th style="border: 1px solid black; padding: 5px;">Score</th>
            <th style="border: 1px solid black; padding: 5px;">Status</th>
        `;
        table.appendChild(headerRow);

        let dataRow = document.createElement('tr');
        dataRow.innerHTML = `
            <td style="border: 1px solid black; padding: 5px;">${homeTeam}</td>
            <td style="border: 1px solid black; padding: 5px;">${awayTeam}</td>
            <td style="border: 1px solid black; padding: 5px;">${score}</td>
            <td style="border: 1px solid black; padding: 5px;">${status}</td>
        `;
        table.appendChild(dataRow);

        container.innerHTML = '';
        container.appendChild(table);
    }

    setInterval(checkUrlAndFetchData, 3000);

    checkUrlAndFetchData();
})();