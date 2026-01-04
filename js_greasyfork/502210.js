// ==UserScript==
// @name         Bundestag Election Results Chart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Parse Bundestag election results and display as a Chart.js graph
// @author       You
// @match        https://www.wahlrecht.de/ergebnisse/bundestag.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502210/Bundestag%20Election%20Results%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/502210/Bundestag%20Election%20Results%20Chart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the document to fully load
    window.addEventListener('load', function() {
        // Check if Chart.js is already loaded, if not, load it
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = createChart;
            document.head.appendChild(script);
        } else {
            createChart();
        }

        function createChart() {
            // Define party colors
            const partyColors = {
                'CDU/CSU': 'black',
                'SPD': 'red',
                'FDP': 'yellow',
                'GRÜNE': 'green',
                'DIE LINKE': 'purple',
                'NPD': 'brown',
                'PIRATEN': 'orange',
                'AfD': 'blue',
                'SSW': 'lightblue',
                'REP': 'grey',
                'KPD/DKP': 'darkred'
            };
            function getColorFromName(name) {
                // Hash function to generate a hash code from the name
                let hash = 0;
                for (let i = 0; i < name.length; i++) {
                    hash = name.charCodeAt(i) + ((hash << 5) - hash);
                }
                // Generate color from hash
                const color = '#' + ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
                      ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
                      ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
                return color;
            }
            // Get the table
            const table = document.querySelector('table.border');

            // Extract data
            const labels = [];
            const datasets = {};
            const parties = [];

            // Populate labels
            table.querySelectorAll('thead th.jahr').forEach((th, index) => {
                labels.push(th.textContent.trim());
            });

            // Extract party data
            table.querySelectorAll('tbody tr').forEach((tr) => {
                const party = tr.querySelector('td.l strong').textContent.trim();
                if (party === 'Wahlbeteiligung') return; // Ignore Wahlbeteiligung

                const data = [];
                tr.querySelectorAll('td').forEach((td, index) => {
                    if (index % 2 != 0) { // only take percentage values
                        const value = parseFloat(td.textContent.replace(',', '.'));
                        data.push(isNaN(value) ? 0 : value);
                    }
                });

                parties.push(party);
                datasets[party] = data;
            });

            // Prepare datasets for Chart.js
            const chartDatasets = parties.map(party => ({
                label: party,
                data: datasets[party],
                fill: true,
                backgroundColor: partyColors[party] || getColorFromName(party),
                borderColor: partyColors[party] || getColorFromName(party),
                tension: 0.1
            }));

            // Create canvas for the chart
            const canvas = document.createElement('canvas');
            canvas.id = 'bundestagChart';
            table.parentElement.insertBefore(canvas, table);

            // Draw the chart
            new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: chartDatasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                    interaction: {
                        mode: 'nearest',
                        intersect: false
                    },
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Datum'
                            }
                        },
                        y: {
                            min: 0,
                            max: 100,
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Prozent'
                            }
                        }
                    }
                }
            });
        }
    });
})();
