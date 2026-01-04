// ==UserScript==
// @name        Koalitionenrechner - wahlrecht.de
// @namespace   Violentmonkey Scripts
// @match       https://www.wahlrecht.de/umfragen/
// @grant       none
// @version     5.2
// @author      Sidem
// @description 11/13/2024, 11:00:16 PM
// @downloadURL https://update.greasyfork.org/scripts/431183/Koalitionenrechner%20-%20wahlrechtde.user.js
// @updateURL https://update.greasyfork.org/scripts/431183/Koalitionenrechner%20-%20wahlrechtde.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

window.addEventListener('load', function () {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.js';
    document.head.appendChild(script);
    let setNewChart = () => { };
    let setNewCoalitionChart = () => { };
    let seatFactor = 1.0;
    let data = [
        { id: 'cdu', name: 'CDU/CSU', icon: '⚫️', color: '#000000FF', votes: 0, projectedSeats: 0, logoUrl: '<img src="https://i.ibb.co/tYm4PG9/CDUCSU.png" alt="CDUCSU" border="0">', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEUAAACnej3aAAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' },
        { id: 'afd', name: 'AfD', icon: '🔵', color: '#009DE0FF', votes: 0, projectedSeats: 0, logoUrl: '<img src="https://i.ibb.co/3hzmWRr/AfD.png" alt="AfD" border="0">', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEUAneDDnyv1AAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' },
        { id: 'spd', name: 'SPD', icon: '🔴', color: '#E3000FFF', votes: 0, projectedSeats: 0, logoUrl: '<img src="https://i.ibb.co/LScLCYC/SPD.png" alt="SPD" border="0">', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEXjAA+cYU6yAAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' },
        { id: 'gru', name: 'GRÜNE', icon: '🟢', color: '#64A12DFF', votes: 0, projectedSeats: 0, logoUrl: '<img src="https://i.ibb.co/M6cx5K3/GRUENE.png" alt="GRUENE" border="0">', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEVkoS0aZ4/7AAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' },
        { id: 'lin', name: 'LINKE', icon: '🟣', color: '#FF0000FF', votes: 0, projectedSeats: 0, logoUrl: '<img src="https://i.ibb.co/Mp4TFzX/LINKE.png" alt="LINKE" border="0">', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX/AAAZ4gk3AAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' },
        { id: 'bsw', name: 'BSW', icon: '🟠', color: '#CC0077FF', votes: 0, projectedSeats: 0, logoUrl: '<img src="https://i.ibb.co/3hzmWRr/AfD.png" alt="BSW" border="0">', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEXMAHfxrrZhAAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' },
        { id: 'fdp', name: 'FDP', icon: '🟡', color: '#FFED00FF', votes: 0, projectedSeats: 0, logoUrl: '<img src="https://i.ibb.co/m093TBw/FDP.png" alt="FDP" border="0">', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX/7QDyMoSWAAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' },
        { id: 'son', name: 'Sonstige', icon: '⚪️', color: '#AAAAAAFF', votes: 0, projectedSeats: 0, logoUrl: '', colorUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEVmZmZ8VoIEAAAAC0lEQVQI12MgEQAAADAAAWV61nwAAAAASUVORK5CYII=' }
    ];
    let voteData = data;
    let coalitionData = [];
    let columnHover = '';

    function calculateWeight(date, newestDate) {
        let daysOld = (newestDate - date.getTime()) / (1000 * 60 * 60 * 24);
        return 5 * Math.exp(-Math.log(5) * daysOld / 30);
    }

    function calculateWeightedAverage(rowId) {
        let dates = [];
        let values = [];
        let weights = [];

        let dateRow = document.getElementById('datum');
        let dataRow = document.getElementById(rowId);
        let cells = dataRow.getElementsByTagName('td');
        let dateCells = dateRow.getElementsByTagName('td');

        let thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        for (let i = 1; i < cells.length - 2; i++) {
            let dateSpan = dateCells[i].querySelector('span.li');
            let value = cells[i].textContent.trim();

            if (dateSpan && value !== '–') {
                let dateText = dateSpan.textContent;
                let dateParts = dateText.split('.');
                let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

                if (date >= thirtyDaysAgo) {
                    let numValue = parseFloat(value.replace(' %', '').replace(',', '.'));
                    if (!isNaN(numValue)) {
                        dates.push(date);
                        values.push(numValue);
                    }
                }
            }
        }

        if (values.length === 0) return '–';
        let newest = Math.max(...dates.map(d => d.getTime()));
        weights = dates.map(date => calculateWeight(date, newest));
        let weightSum = weights.reduce((a, b) => a + b, 0);
        let weightedSum = values.reduce((sum, value, i) => sum + value * weights[i], 0);
        let result = (weightedSum / weightSum).toFixed(1);
        return result % 1 === 0 ? Math.round(result) + ' %' : result + ' %';
    }

    function updateTooltipsWithWeights() {
        let dateRow = document.getElementById('datum');
        let dateCells = dateRow.getElementsByTagName('td');
        let dates = [];
        let newestDate = null;

        for (let i = 1; i < dateCells.length - 2; i++) {
            let dateSpan = dateCells[i].querySelector('span.li');
            if (dateSpan) {
                let dateText = dateSpan.textContent;
                let dateParts = dateText.split('.');
                let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                dates.push({ cell: dateCells[i], date: date });

                if (!newestDate || date > newestDate) {
                    newestDate = date;
                }
            }
        }

        for (let dateObj of dates) {
            let weight = calculateWeight(dateObj.date, newestDate.getTime());
            let cell = dateObj.cell;
            let thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            if (dateObj.date >= thirtyDaysAgo) {
                let currentTitle = cell.getAttribute('title') || '';
                let weightText = `\nGewichtung: ${weight.toFixed(2)}x`;

                if (currentTitle.includes('Gewichtung:')) {
                    cell.setAttribute('title', currentTitle.replace(/\nGewichtung:.*/, weightText));
                } else {
                    cell.setAttribute('title', currentTitle + weightText);
                }
            }
        }
    }

    function calculateMedian(rowId) {
        let values = [];
        let dataRow = document.getElementById(rowId);
        let cells = dataRow.getElementsByTagName('td');
        let dateRow = document.getElementById('datum');
        let dateCells = dateRow.getElementsByTagName('td');

        let thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Collect values from the last 30 days
        for (let i = 1; i < cells.length - 2; i++) {
            let dateSpan = dateCells[i].querySelector('span.li');
            let value = cells[i].textContent.trim();

            if (dateSpan && value !== '–') {
                let dateText = dateSpan.textContent;
                let dateParts = dateText.split('.');
                let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

                if (date >= thirtyDaysAgo) {
                    let numValue = parseFloat(value.replace(' %', '').replace(',', '.'));
                    if (!isNaN(numValue)) {
                        values.push(numValue);
                    }
                }
            }
        }

        if (values.length === 0) return '–';

        // Sort values and find median
        values.sort((a, b) => a - b);
        let middle = Math.floor(values.length / 2);

        if (values.length % 2 === 0) {
            // Average of two middle values for even number of values
            let median = (values[middle - 1] + values[middle]) / 2;
            return median.toFixed(1) + ' %';
        } else {
            // Middle value for odd number of values
            return values[middle].toFixed(1) + ' %';
        }
    }

    function insertMedianColumn() {
        let headerRow = document.querySelector('thead tr');
        let newHeader = document.createElement('th');
        newHeader.className = 'in';
        newHeader.innerHTML = 'Median<br>(30d)';
        headerRow.insertBefore(newHeader, headerRow.lastElementChild.previousElementSibling);

        let dateRow = document.getElementById('datum');
        let dateTd = document.createElement('td');
        dateTd.className = 'di';
        dateRow.insertBefore(dateTd, dateRow.lastElementChild.previousElementSibling);

        let partyIds = ["cdu", "afd","spd", "gru", "lin", "bsw", "fdp", "son"];
        partyIds.forEach(partyId => {
            let row = document.getElementById(partyId);
            if (row) {
                let medianTd = document.createElement('td');
                medianTd.className = 'di col-median';
                medianTd.style.cursor = 'pointer';
                medianTd.textContent = calculateMedian(partyId);
                medianTd.onclick = getChart;

                medianTd.addEventListener("mouseenter", function (e) {
                    let column = document.getElementsByClassName('col-median');
                    for (let item of column) {
                        item.style.backdropFilter = 'brightness(0.5)';
                    }
                });

                medianTd.addEventListener("mouseleave", function (e) {
                    let column = document.getElementsByClassName('col-median');
                    for (let item of column) {
                        item.style.backdropFilter = 'unset';
                    }
                });

                row.insertBefore(medianTd, row.lastElementChild.previousElementSibling);
            }
        });
    }

    function insertAverageColumn() {
        let headerRow = document.querySelector('thead tr');
        let newHeader = document.createElement('th');
        newHeader.className = 'in';
        newHeader.innerHTML = 'Durch-<br>schnitt';
        headerRow.insertBefore(newHeader, headerRow.lastElementChild.previousElementSibling);
        let dateRow = document.getElementById('datum');
        let dateTd = document.createElement('td');
        dateTd.className = 'di';
        dateRow.insertBefore(dateTd, dateRow.lastElementChild.previousElementSibling);

        let partyIds = ["cdu", "afd","spd", "gru", "lin", "bsw", "fdp", "son"];
        partyIds.forEach(partyId => {
            let row = document.getElementById(partyId);
            if (row) {
                let avgTd = document.createElement('td');
                avgTd.className = 'di col-avg';
                avgTd.style.cursor = 'pointer';
                avgTd.textContent = calculateWeightedAverage(partyId);
                avgTd.onclick = getChart;
                avgTd.addEventListener("mouseenter", function (e) {
                    let column = document.getElementsByClassName('col-avg');
                    for (let item of column) {
                        item.style.backdropFilter = 'brightness(0.5)';
                    }
                });
                avgTd.addEventListener("mouseleave", function (e) {
                    let column = document.getElementsByClassName('col-avg');
                    for (let item of column) {
                        item.style.backdropFilter = 'unset';
                    }
                });
                row.insertBefore(avgTd, row.lastElementChild.previousElementSibling);
            }
        });


        let results = partyIds.map(partyId => {
            let valStr = calculateWeightedAverage(partyId);
            let valNum = parseFloat(valStr.replace('%', '').trim());
            return isNaN(valNum) ? 0 : valNum;
        });
      /*
        let sum = results.reduce((a, b) => a + b, 0);

        if (sum > 0) {
            results = results.map(val => (val / sum) * 100);
        }*/

        partyIds.forEach((partyId, i) => {
            let row = document.getElementById(partyId);
            if (row) {
                // Die Durchschnitts-Spalte wird z.B. anhand ihrer CSS-Klasse gefunden.
                let avgCell = row.querySelector('.col-avg');
                if (avgCell) {
                    avgCell.textContent = results[i].toFixed(1) + ' %';
                }
            }
        });
    }

    function insertCustomColumn() {
        // Add header
        let headerRow = document.querySelector('thead tr');
        let newHeader = document.createElement('th');
        newHeader.className = 'in custom-header';
        newHeader.innerHTML = 'Custom<br>Werte';
        headerRow.insertBefore(newHeader, headerRow.lastElementChild);

        // Add empty cell in date row
        let dateRow = document.getElementById('datum');
        let dateTd = document.createElement('td');
        dateTd.className = 'di';
        dateRow.insertBefore(dateTd, dateRow.lastElementChild);

        // Add cells with number inputs for each party
        let partyIds = ["cdu", "afd", "spd", "gru", "lin", "bsw", "fdp",  "son"];
        let currentValues = {};

        // Initialize with current average values
        partyIds.forEach(partyId => {
            let row = document.getElementById(partyId);
            if (row) {
                let avgCell = row.querySelector('.col-avg');
                if (avgCell) {
                    let value = parseFloat(avgCell.textContent.replace(',', '.').replace('%', '').trim()) || 0;
                    currentValues[partyId] = value;
                }
            }
        });

        function updateAllValues(changedPartyId, newValue) {
            newValue = Math.max(0, Math.min(100, newValue));

            const oldValue = currentValues[changedPartyId];
            const difference = newValue - oldValue;

            let otherPartiesTotal = Object.entries(currentValues)
                .filter(([id]) => id !== changedPartyId)
                .reduce((sum, [, value]) => sum + value, 0);

            if (otherPartiesTotal + newValue !== 100) {
                const targetOtherTotal = 100 - newValue;
                const factor = targetOtherTotal / otherPartiesTotal;

                Object.keys(currentValues).forEach(partyId => {
                    if (partyId !== changedPartyId) {
                        currentValues[partyId] *= factor;
                        const input = document.querySelector(`#${partyId} .custom-input`);
                        if (input) {
                            input.value = currentValues[partyId].toFixed(1);
                        }
                    }
                });
            }

            currentValues[changedPartyId] = newValue;
            return currentValues;
        }

        partyIds.forEach(partyId => {
            let row = document.getElementById(partyId);
            if (row) {
                let customTd = document.createElement('td');
                customTd.className = 'di custom-cell';

                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';

                let input = document.createElement('input');
                input.style.cursor = 'pointer';
                input.type = 'number';
                input.className = 'custom-input';
                input.min = '0';
                input.max = '100';
                input.step = '0.1';
                input.value = currentValues[partyId].toFixed(1);
                input.style.width = '60px';

                let percentSymbol = document.createElement('span');
                percentSymbol.textContent = '%';
                percentSymbol.style.marginLeft = '2px';

                input.addEventListener('change', (e) => {
                    let newValue = parseFloat(e.target.value) || 0;
                    updateAllValues(partyId, newValue);

                    Object.entries(currentValues).forEach(([id, value]) => {
                        const otherInput = document.querySelector(`#${id} .custom-input`);
                        if (otherInput) {
                            otherInput.value = value.toFixed(1);
                        }
                    });

                    getChart({ target: customTd });
                });

                input.addEventListener('blur', (e) => {
                    e.target.value = parseFloat(e.target.value || 0).toFixed(1);
                });

                container.appendChild(input);
                container.appendChild(percentSymbol);
                customTd.appendChild(container);

                customTd.onclick = getChart;
                customTd.classList.add('col-custom');

                row.insertBefore(customTd, row.lastElementChild);
            }
        });
    }

    function getCombinations(array) {
        var result = [];
        for (var i = 1; i < (1 << array.length); i++) {
            var subset = [];
            for (var j = 0; j < array.length; j++)
                if (i & (1 << j))
                    subset.push(array[j]);
            result.push(subset);
        }
        return result;
    }

    function cleanVote(str) {
        if (str.includes('\n')) {
            let split = str.split('\n');
            return cleanVote(split[0].split(' ')[1]) + cleanVote(split[1].split(' ')[1]);
        }
        if (str.includes('–')) return 0;
        return parseFloat(str.replace(',', '.').replace(' %', ''));
    }

    function getPartyByIdentifier(identifier) {
        for (let p of voteData) {
            if (p.name == identifier || p.color == identifier || p.icon == identifier || p.id == identifier) {
                return p;
            }
        }
        return { id: 'son', name: 'Sonstige', icon: '⚪️', color: '#666666', votes: 0 };
    }

    let allPossibleCoalitions = getCombinations(['⚫️', '🔴', '🟣', '🟡', '🟢', '🔵', '🟠', '⚪️']);
    allPossibleCoalitions = allPossibleCoalitions.filter((el) => { return (el.length >= 1 && el.length < 5) }); // filter to only 2-4 party coalitions
    let coalitions = allPossibleCoalitions.filter((el) => {
        if (el.includes('🔵') && el.includes('🟢')) return false;
        if (el.includes('🔵') && el.includes('🔴')) return false;
        if (el.includes('🔵') && el.includes('🟣')) return false;
        if (el.includes('🟣') && el.includes('🟡')) return false;
        if (el.includes('🟣') && el.includes('⚫️')) return false;
        return true;
    });

    function isPermutation(a, b) {
        return b.filter(x => !a.includes(x)).length === 0 && a.length == 3;
    }

    function coalitionSymbol(coalition) {
        if (isPermutation(coalition, ['⚫️', '🔴', '🟢'])) return "<img src='https://flagcdn.com/w20/ke.png' alt='🇰🇪' title='Kenia'>";
        if (isPermutation(coalition, ['⚫️', '🔴', '🟡'])) return "<img src='https://flagcdn.com/w20/de.png' alt='🇩🇪' title='Deutschland'>";
        if (isPermutation(coalition, ['⚫️', '🟡', '🟢'])) return "<img src='https://flagcdn.com/w20/jm.png' alt='🇯🇲' title='Jamaika'>";
        if (isPermutation(coalition, ['🟣', '🔴', '🟢'])) return "<img src='https://flagcdn.com/w20/by.png' alt='🇧🇾' title='Weissrussland'>";
        if (isPermutation(coalition, ['⚫️', '🟡', '🔵'])) return "<img src='https://flagcdn.com/w20/bs.png' alt='🇧🇸' title='Bahamas'>";
        if (isPermutation(coalition, ['🟡', '🔴', '🟢'])) return "🚦";
        return "";
    }

    function getCoalitions() {
        let str = "<strong>Anteil der Sitze im Bundestag</strong>";
        let results = [];
        for (let coalition of coalitions) {
            let currentCoalitionVotes = 0;
            let containsBelow = false;
            coalition.sort((p1, p2) => { return getPartyByIdentifier(p2).votes - getPartyByIdentifier(p1).votes });
            for (let p of coalition) {
                if (currentCoalitionVotes >= 50.0) containsBelow = true;
                currentCoalitionVotes += getPartyByIdentifier(p).votes * seatFactor;
                if (getPartyByIdentifier(p).name == "Sonstige") containsBelow = true;
                if (getPartyByIdentifier(p).votes < 5.0) containsBelow = true;
            }

            if (!containsBelow) results.push({ coalition: coalition.join(""), parties: coalition, votes: currentCoalitionVotes });
        }
        results.sort((a, b) => { return b.votes - a.votes; });
        let line = false;
        let weight = "bold;";
        for (let c of results) {
            if (!line && c.votes < 50) {
                line = true;
                weight = '100;';
            }
            str += "<p style='margin: 0px; font-size: 1rem; font-weight: " + weight + "'><strong style='display: inline-block; vertical-align: middle; width: 64px;'>" + c.parties.map((e) => { return '<img class="partyColor" src="' + getPartyByIdentifier(e).colorUri + '" alt="' + getPartyByIdentifier(e).icon + '" title="' + getPartyByIdentifier(e).name + '" />'; }).join("") + "</strong>" + c.votes.toFixed(1) + "% " + coalitionSymbol(c.parties) + "</p>";
        }
        coalitionData = results;
        //str += "<button id='copyCoalitionBtn'>Copy</button>";
        coalitionBox.innerHTML = str;
        let copyBtn = document.createElement('button');
        copyBtn.innerText = "Copy";
        copyBtn.onclick = (e) => {
            navigator.clipboard.writeText(getCoalitionString(coalitionBox)).then(() => {
                console.log("success");
            }, function () {
                console.log("failed writing clipboard");
            });
        };
        coalitionBox.appendChild(copyBtn);
        setNewCoalitionChart();
    }

    const getCoalitionString = (container) => {
        let str = "";
        for (let p of container.childNodes) {
            for (let item of p.childNodes) {
                if (item.nodeName == 'STRONG') {
                    for (let color of item.childNodes) {
                        str += color.alt;
                    }
                } else if (item.nodeName == '#text' && item.data != 'Copy') {
                    str += item.data;
                } else if (item.nodeName == 'IMG') {
                    str += item.alt;
                }
            }
            str += "\n";
        }
        return str;
    };

    let getBelowFivePercentage = () => {
        let total = getPartyByIdentifier('son').votes;
        let partyIds = ["cdu", "afd", "spd", "gru", "lin", "bsw", "fdp",  "son"];
        for (let id of partyIds) {
            let thisVotes = getPartyByIdentifier(id).votes;
            if (thisVotes < 5.0) total += thisVotes;
        }
        return total;
    };


    let getChart = (e) => {
        let isCustomColumn = e.target.classList.contains('custom-cell') ||
            e.target.closest('.custom-cell') !== null;

        let i = 0;
        voteData = [];

        if (isCustomColumn) {
            // Handle custom column values
            for (let partyId of ["cdu", "spd", "gru", "fdp", "lin", "afd", "bsw", "son"]) {
                let input = document.querySelector(`#${partyId} .custom-input`);
                if (input) {
                    let value = parseFloat(input.value) || 0;
                    voteData.push({ ...data[i], votes: value });
                }
                i++;
            }
        } else {
            // Handle regular columns
            let colDataElements = document.getElementsByClassName(e.target.classList[e.target.classList.length - 1]);
            for (let el of colDataElements) {
                voteData.push({ ...data[i], votes: cleanVote(el.innerText) });
                i++;
            }
        }

        voteData.sort((a, b) => { return b.votes - a.votes; });
        seatFactor = 1 / ((100 - getBelowFivePercentage()) / 100);
        getCoalitions();
        setNewChart();
    };



    let getCoalitionDatasets = () => {
        let datasets = [];
        let numberset = [];
        for (let party of voteData) {
            numberset = [];
            if (party.name != 'Sonstige' && party.votes >= 5.0) {
                for (let coalition of coalitionData) {
                    if (coalition.parties.includes(party.icon)) {
                        numberset.push(party.votes * seatFactor);
                    } else {
                        numberset.push(0);
                    }
                }
                datasets.push({ label: party.name, data: numberset, backgroundColor: party.color });
            }
        }
        return datasets;
    }

    let partyIds = ["cdu", "afd", "spd", "gru", "lin", "bsw", "fdp",  "son"];
    let rows = document.getElementsByTagName('tr');
    for (let row of rows) {
        if (partyIds.includes(row.id)) {
            let numbers = row.getElementsByTagName('td');
            let n = 0;
            for (let number of numbers) {
                if (n != 0 && n != 9) {
                    number.classList.add('col-' + n);
                    number.onclick = getChart;
                    number.style.cursor = 'pointer';
                    number.addEventListener("mouseenter", function (e) {
                        let columnClass = e.target.classList[e.target.classList.length - 1];
                        let column = document.getElementsByClassName(columnClass);
                        for (let item of column) {
                            item.style.backdropFilter = 'brightness(0.5)';
                        }
                    });
                    number.addEventListener("mouseleave", function (e) {
                        let columnClass = e.target.classList[e.target.classList.length - 1];
                        let column = document.getElementsByClassName(columnClass);
                        for (let item of column) {
                            item.style.backdropFilter = 'unset';
                        }
                    });
                }
                n++;
            }
        }
    }

    let info = document.getElementById('info');
    let coalitionBox = document.createElement('div');
    coalitionBox.setAttribute('id', 'coalitionBox');
    info.parentNode.insertBefore(coalitionBox, info);
    let table = document.querySelector('.wilko');
    table.id = 'tableBox';
    table.parentNode.id = 'tableContainer';

    script.onload = function () {
        let ctx = document.getElementById('myChart').getContext('2d');
        let myChart = {};

        let ctx2 = document.getElementById('myCoalitionChart').getContext('2d');
        let myCoalitionChart = {};

        setNewChart = () => {
            if (myChart instanceof Chart) {
                myChart.data.labels = voteData.map(a => a.name);
                myChart.data.datasets[0].data = voteData.map(a => a.votes);
                myChart.data.datasets[0].backgroundColor = voteData.map(a => a.color);
                myChart.update();
            } else {
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: voteData.map(a => a.name),
                        datasets: [{
                            label: '% der Stimmen',
                            data: voteData.map(a => a.votes),
                            backgroundColor: voteData.map(a => a.color),
                            borderWidth: 1,
                            circumference: 180,
                            rotation: 270
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                suggestedMin: 0,
                                //suggestedMax: 50
                            }
                        }
                    }
                });
            }
        };

        setNewCoalitionChart = () => {
            if (myCoalitionChart instanceof Chart) {
                myCoalitionChart.data.labels = coalitionData.map(a => "");
                myCoalitionChart.data.datasets = [...getCoalitionDatasets(), {
                    label: '50% Grenze',
                    data: coalitionData.map(a => 50),
                    borderColor: "#000000",
                    backgroundColor: "#000000",
                    type: 'line',
                    order: 10
                }];
                myCoalitionChart.update();
            } else {
                myCoalitionChart = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: coalitionData.map(a => ""),
                        datasets: [...getCoalitionDatasets(), {
                            label: '50% Grenze',
                            data: coalitionData.map(a => 50),
                            borderColor: "#000000",
                            backgroundColor: "#000000",
                            type: 'line',
                            order: 10
                        }]
                    },
                    options: {
                        radius: 0,
                        indexAxis: 'y',
                        scales: {
                            x: {
                                suggestedMin: 0,
                                suggestedMax: 50,
                                stacked: true
                            },
                            y: {
                                stacked: true
                            }
                        },
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                            },
                            title: {
                                display: true,
                                text: 'Mögliche Koalitionen (% der projezierten Sitze)'
                            }
                        }
                    }
                });
            }
        };
    };
    let chartContainer = document.createElement('div');
    chartContainer.id = 'chartBox';
    info.parentNode.insertBefore(chartContainer, info);
    let chartBox = document.createElement('canvas');
    chartBox.id = 'myChart';
    chartContainer.appendChild(chartBox);

    let coalitionChartContainer = document.createElement('div');
    coalitionChartContainer.id = 'coalitionContainer';
    info.parentNode.insertBefore(coalitionChartContainer, info);
    let coalitionChartBox = document.createElement('canvas');
    coalitionChartBox.id = 'myCoalitionChart';
    coalitionChartContainer.appendChild(coalitionChartBox);

    var style = document.createElement("style");
    style.type = "text/css";
    let styleRows = ["cdu", "afd", "spd", "gru", "lin", "bsw", "fdp",  "son"];
    for (let x of styleRows) {
        style.innerHTML += `
        tr#${x} > td, tr#${x} > th {
          background-color: ${getPartyByIdentifier(x).color.slice(0, -2)}66 !important;
        }
      `;
    }
    style.innerHTML += `
        #tableContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        #tableBox {
            width: 90%;
        }

        #coalitionBox {
          width: 10%;
        }

        #resultContainer {
          display:flex;

        }

        #chartBox {
            width: 45%;
        }

        #coalitionContainer {
            width: 45%;
        }

        #myChart {

        }
        .col-10 {
          color: black;
        }

        .custom-cell {
        padding: 8px;
        text-align: center;
    }
    .custom-input {
        padding: 2px 4px;
        text-align: right;
    }
    table.wilko {
    border-spacing: 0px;
    }
    .custom-input[type=number] {
        -moz-appearance: textfield;
    }
    `;
    document.head.appendChild(style);
    let container = document.createElement('div');
    container.id = 'resultContainer';
    info.parentNode.insertBefore(container, info);
    container.appendChild(coalitionBox);
    container.appendChild(chartContainer);
    container.appendChild(coalitionChartContainer);
    insertMedianColumn();
    insertAverageColumn();
    insertCustomColumn();
    updateTooltipsWithWeights();
}, false);