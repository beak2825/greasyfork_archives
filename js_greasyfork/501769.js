// ==UserScript==
// @name        wahlrecht.de Time Series
// @namespace   saf12490ßioj
// @match       https://www.wahlrecht.de/umfragen/*.htm
// @match       https://www.wahlrecht.de/umfragen/*/*.htm
// @exclude     https://www.wahlrecht.de/umfragen/index.htm
// @grant       none
// @version     0.74
// @author      tdhg
// @description Adds a table of checkboxes for summing party data with average color blending for summed results.
// @downloadURL https://update.greasyfork.org/scripts/501769/wahlrechtde%20Time%20Series.user.js
// @updateURL https://update.greasyfork.org/scripts/501769/wahlrechtde%20Time%20Series.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
    document.head.appendChild(script);

    script.onload = function () {
        let table = document.querySelector('.wilko');
        if (!table) return;

        let headers = table.querySelectorAll('thead th.part');
        let rows = table.querySelectorAll('tbody tr');

        let partyNames = [];
        let dataByParty = {};
        let dates = [];

        const partyColors = {
            "CDU/CSU": "#000000", // Black
            "CDU": "#000000", // Black
            "CSU": "#000000", // Black
            "SPD": "#ff0000",    // Red
            "GRÜNE": "#008000",  // Green
            "FDP": "#ffff00",    // Yellow
            "LINKE": "#800080",  // Purple
            "AfD": "#0000ff",    // Blue
            "FW": "#ffa500",     // Orange
            "PIRATEN": "#ffa500",     // Orange
            "BSW": "#d11754",    //
            "Sonstige": "#a52a2a" // Brown
        };

        headers.forEach((header, index) => {
            //if (index > 1 && index < 11) { // CDU/CSU to BSW
            let partyName = header.textContent.trim();
            partyNames.push(partyName);
            dataByParty[partyName] = [];
            //}
        });

        rows.forEach(row => {
            let cells = row.querySelectorAll('td');
            let date = cells[0].textContent.trim();
            if (cells[1]) {
                dates.push(date);
                partyNames.forEach((party, index) => {
                    let voteCell = cells[index + 2].textContent.trim();
                    let voteValue = voteCell.includes('–') ? 0 : parseFloat(voteCell.replace('%', '').replace(',', '.'));
                    dataByParty[party].push(voteValue);
                });
            }
        });
        dates.reverse();
        function rgbToHex(rgb) {
            let [r, g, b] = rgb;
            return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
        }

        function averageColors(colors) {
            let totalR = 0, totalG = 0, totalB = 0;
            colors.forEach(color => {
                let [r, g, b] = color.match(/\w\w/g).map(x => parseInt(x, 16));
                totalR += r;
                totalG += g;
                totalB += b;
            });
            let count = colors.length;
            return rgbToHex([totalR / count, totalG / count, totalB / count]);
        }

        function createChart(datasets) {

            chartContainer.parentNode.insertBefore(ctx, chartContainer);
            window.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Wahlrecht.de Umfragen - Zeitreihe'
                        }
                    },        interaction: {
                        mode: 'nearest',
                        axis: 'x',
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

        function updateChart() {
            let datasets = [];
            let selectedParties = new Set();
            let partieGroups = new Set();

            // Determine which parties are selected
            partyNames.forEach(party => {
                let checkboxes = document.querySelectorAll(`input[data-party="${party}"]`);
                let selectedPartiesForRow = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

                let combinedData = new Array(dates.length).fill(0);
                let colors = [];

                selectedPartiesForRow.forEach(party => {
                    dataByParty[party].forEach((value, index) => {
                        combinedData[index] += value;
                    });
                    colors.push(partyColors[party] ? partyColors[party] : '#000000');
                });

                if (selectedPartiesForRow.length > 0) {
                    let blendedColor = averageColors(colors);
                    let partiesArray = Array.from(selectedPartiesForRow);
                    datasets.push({
                        label: `${partiesArray.join(', ')}`,
                        data: combinedData.reverse(),
                        fill: true,
                        backgroundColor: blendedColor,
                        borderColor: blendedColor,
                        tension: 0.1
                    });
                }
            });
            if (window.chart) {
                window.chart.destroy();
            }
            createChart(datasets);
        }

        // Create checkbox table
        let ctx = document.createElement('canvas');

        let tableContainer = document.createElement('div');
        let checkboxTable = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        // Header row
        let headerRow = document.createElement('tr');
        let headerCell = document.createElement('th');
        headerCell.textContent = 'Partys';
        headerRow.appendChild(headerCell);
        partyNames.forEach(party => {
            let th = document.createElement('th');
            th.textContent = party;
            th.style.width = '4em';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Data rows
        partyNames.forEach(party => {
            let row = document.createElement('tr');
            let labelCell = document.createElement('td');
            labelCell.textContent = party;
            row.appendChild(labelCell);

            partyNames.forEach(otherParty => {
                let cell = document.createElement('td');
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${party}-${otherParty}`;
                checkbox.value = otherParty;
                checkbox.dataset.party = party;
                if (party === otherParty) {
                    checkbox.checked = true; // Default selection for individual party
                }
                checkbox.addEventListener('change', updateChart);

                cell.appendChild(checkbox);
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        checkboxTable.appendChild(thead);
        checkboxTable.appendChild(tbody);
        tableContainer.appendChild(checkboxTable);

        let chartContainer = document.createElement('div');
        chartContainer.style.marginTop = '20px';
        table.parentNode.insertBefore(tableContainer, table);
        table.parentNode.insertBefore(chartContainer, table);

        // Initial chart render
        updateChart();
    };
}, false);
