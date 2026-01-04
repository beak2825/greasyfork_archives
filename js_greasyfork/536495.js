// ==UserScript==
// @name         Candidate Vote Bar Chart
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a bar chart after the candidate table (for election commissions)
// @author       Kasden45
// @match        https://wybory.gov.pl/prezydent2025/pl/obkw/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536495/Candidate%20Vote%20Bar%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/536495/Candidate%20Vote%20Bar%20Chart.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('Script working')
function extractCandidateData(table) {
    const candidates = [];
    const rows = table.querySelectorAll('tbody tr');
    const totalVotes = parseInt(table.querySelector('tfoot td:last-child').textContent.replace(/\s+/g, ''), 10);

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const name = cells[1].querySelector('a').textContent.trim();
        const votes = parseInt(cells[2].textContent.trim(), 10);
        const percent = (votes / totalVotes) * 100;

        candidates.push({
            name: name,
            votes: votes,
            percent: percent
        });
    });

    return candidates.sort((a, b) => b.votes - a.votes);
}

// Create a bar chart
function createBarChart(candidateData) {
    const container = document.createElement('div');
    container.className = 'bar-chart-container';
    container.style.margin = '20px 0';
    container.style.width = '100%';

    const title = document.createElement('h4');
    title.textContent = 'Rozkład głosów kandydatów na Prezydenta RP';
    title.style.marginBottom = '15px';
    title.style.color = '#9d032a';
    container.appendChild(title);

    const totalVotes = candidateData.reduce((sum, candidate) => sum + candidate.votes, 0);
    const totalInfo = document.createElement('div');
    totalInfo.textContent = `Łączna liczba głosów: ${totalVotes.toLocaleString()}`;
    totalInfo.style.marginBottom = '15px';
    totalInfo.style.fontWeight = 'bold';
    container.appendChild(totalInfo);

    const chart = document.createElement('div');
    chart.className = 'vote-bars';
    chart.style.display = 'flex';
    chart.style.flexDirection = 'column';
    chart.style.gap = '8px';

    const maxVotes = Math.max(...candidateData.map(c => c.votes));

    candidateData.forEach(candidate => {
        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.alignItems = 'center';
        barContainer.style.gap = '10px';

        const name = document.createElement('div');
        name.textContent = candidate.name;
        name.style.width = '250px';
        name.style.minWidth = '250px';
        name.style.fontWeight = 'bold';

        // Bar container for progress and label
        const barWrapper = document.createElement('div');
        barWrapper.style.display = 'flex';
        barWrapper.style.alignItems = 'center';
        barWrapper.style.gap = '10px';
        barWrapper.style.flexGrow = '1';

        // Progress bar
        const progress = document.createElement('progress');
        progress.value = candidate.percent;
        progress.max = 100;
        progress.style.width = '100%';
        progress.style.height = '25px';
        progress.style.accentColor = '#9d032a'; // Modern browsers support this

        // Label inside the bar
        const label = document.createElement('span');
        label.textContent = `${candidate.percent.toFixed(1)}% (${candidate.votes.toLocaleString()})`;
        label.style.marginLeft = '10px';
        label.style.whiteSpace = 'nowrap';
        label.style.fontWeight = 'bold';
        label.style.color = '#9d032a';

        barWrapper.appendChild(progress);
        barWrapper.appendChild(label);


        barContainer.appendChild(name);
        barContainer.appendChild(barWrapper);
        chart.appendChild(barContainer);
    });

    container.appendChild(chart);
    return container;
}

function addChartToPage() {
        const headers = document.querySelectorAll('h4');
        for (const header of headers) {
            if (/^15\.\s*/.test(header.textContent.trim())) {
                const next = header.nextElementSibling;
                if (next && next.matches('table.table.table-striped')) {
                    const candidateData = extractCandidateData(next);
                    const chart = createBarChart(candidateData);
                    next.parentNode.insertBefore(chart, next.nextSibling);
                    return true;
                }
            }
        }
        return false;
    }

    // Keep checking every 5 seconds until the header appears
    const interval = setInterval(() => {
        const success = addChartToPage();
        if (success) {
            clearInterval(interval); // Stop checking once found and inserted
        }
    }, 500);
    // Your code here...
})();