// ==UserScript==
// @name         pt站 种子魔力值分析
// @namespace    http://tampermonkey.net/
// @version      2.99.3
// @description  Add a td into the Points row in the provided HTML table
// @author       Your Name
// @match        https://pt.keepfrds.com/torrents.php*
// @match        https://ptchdbits.co/torrents.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493435/pt%E7%AB%99%20%E7%A7%8D%E5%AD%90%E9%AD%94%E5%8A%9B%E5%80%BC%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/493435/pt%E7%AB%99%20%E7%A7%8D%E5%AD%90%E9%AD%94%E5%8A%9B%E5%80%BC%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

var config = [{
        host: "example.cc",
        abbrev: "",
        seedList: "",
        seedDate: "",
        seedSize: "",
        seedUploaderNum: "",
        seedDownloaderNum: "",
        seedFInishNum: "",
        numOfClumns: "",
        fixedT0: "",
        fixedN0: "",
        A_ValueLevels: [
            { A_Value: 1, fontWeight: 'bold', color: '#900C3F ', fontSize: '140%' },
            { A_Value: 0.98, fontWeight: 'bold', color: 'red', fontSize: '100%' },
            { A_Value: 0, fontWeight: '', color: '', fontSize: '100%' }
        ]
    },
    {
        host: "keepfrds.com",
        abbrev: "keepfrds",
        seedList: "table.torrents > tbody > tr",
        seedDate: "td:nth-child(4)",
        seedSize: "td:nth-child(5)",
        seedUploaderNum: "td:nth-child(6)",
        seedDownloaderNum: "td:nth-child(7)",
        seedFInishNum: "td:nth-child(8)",
        numOfClumns: "9",
        fixedT0: "52",
        fixedN0: "7",
        A_ValueLevels: [
            { A_Value: 1, fontWeight: 'bold', color: '#f41a1a ', fontSize: '140%' },
            { A_Value: 0.98, fontWeight: 'bold', color: 'red', fontSize: '100%' },
            { A_Value: 0, fontWeight: '', color: '', fontSize: '100%' }
        ]
    },
    {
        host: "chdbits.co",
        abbrev: "chd",
        seedList: "table.torrents > tbody > tr",
        seedDate: "td:nth-child(4)",
        seedSize: "td:nth-child(5)",
        seedUploaderNum: "td:nth-child(6)",
        seedDownloaderNum: "td:nth-child(7)",
        seedFInishNum: "td:nth-child(8)",
        numOfClumns: "10",
        fixedT0: "4",
        fixedN0: "7",
        A_ValueLevels: [
            { A_Value: 1, fontWeight: 'bold', color: '#f41a1a ', fontSize: '140%' },
            { A_Value: 0.98, fontWeight: 'bold', color: 'red', fontSize: '100%' },
            { A_Value: 0, fontWeight: '', color: '', fontSize: '100%' }
        ]
    }
]

function sizeStringToGB(sizeString) {
    var sizeRegex = /(\d+(\.\d+)?)(\s*)(GB|MB|TB)/i;
    var matches = sizeRegex.exec(sizeString.trim());
    if (!matches) return 0;
    var value = parseFloat(matches[1]);
    var unit = matches[4].toLowerCase();
    switch (unit) {
        case 'gb':
            return value.toFixed(5);
        case 'mb':
            return (value / 1024).toFixed(5);
        case 'tb':
            return (value * 1024).toFixed(5);
        default:
            return 0;
    }
}

function timeStringToWeeks(timeString) {
    var hoursRegex = /(\d+)\s*时/;
    var daysRegex = /(\d+)\s*天/;
    var monthsRegex = /(\d+)\s*月/;
    var yearsRegex = /(\d+)\s*年/;
    var totalMinutes = 0;
    [hoursRegex, daysRegex, monthsRegex, yearsRegex].forEach(regex => {
        var match = regex.exec(timeString);
        if (match) {
            var value = parseInt(match[1]);
            if (regex === hoursRegex) totalMinutes += value * 60;
            else if (regex === daysRegex) totalMinutes += value * 1440;
            else if (regex === monthsRegex) totalMinutes += value * 43200;
            else if (regex === yearsRegex) totalMinutes += value * 525600;
        }
    });
    var weeks = totalMinutes / 10080;
    return weeks.toFixed(10);
}

function findFDRSOfficalAValue(spanElements) {
    for (let j = 0; j < spanElements.length; j++) {
        let spanElement = spanElements[j];
        let textContent = spanElement.textContent.trim();
        var extractedNumber = textContent.match(/^\d+(\.\d{1,2})?$/);
        if (extractedNumber) {
            extractedNumber = extractedNumber[0];
            return extractedNumber;
        }
    }
}

async function add_A_Value_Columns(html, theConfig) {
    var magicValueHeader = '<td class="colhead">A值</td>';
    var magicValueHeader2 = '<td class="colhead">A值每GB</td>';
    var magicValueHeaderFDRS = '<td class="colhead">官方预期</td>';

    var rows = document.querySelectorAll(theConfig.seedList);
    if (rows) {
        // Assume `theConfig.numOfClumns` is the target column index (1-based).
        var colheadCells = rows[0].querySelectorAll('td.colhead');
        var targetIndex = theConfig.numOfClumns - 1; // Convert to 0-based index.

        if (colheadCells[targetIndex]) { // Check if the target column exists.
            if (theConfig.abbrev == "keepfrds") {
                colheadCells[targetIndex].insertAdjacentHTML('afterend', magicValueHeaderFDRS);
            }
            colheadCells[targetIndex].insertAdjacentHTML('afterend', magicValueHeader2);
            colheadCells[targetIndex].insertAdjacentHTML('afterend', magicValueHeader);
        }
    }



    var dataRows = rows;
    for (let i = 1; i < dataRows.length; i++) {
        var row = dataRows[i];
        var extractedNumber;
        if (theConfig.abbrev == "keepfrds") {
            extractedNumber = findFDRSOfficalAValue(row.querySelectorAll('span'));
        }
        var timeCell = row.querySelector(theConfig.seedDate);
        var sizeCell = row.querySelector(theConfig.seedSize);
        var seederCell = row.querySelector(theConfig.seedUploaderNum);
        var timeString = timeCell.innerText;
        var sizeString = sizeCell.innerText;
        var numOfSeeders = parseInt(seederCell.innerText.replace(/,/g, ''));
        var weeks = timeStringToWeeks(timeString);
        var size = sizeStringToGB(sizeString);
        var decayFactor = 1 - Math.pow(10, -weeks / parseInt(theConfig.fixedT0));
        var seederFactor = 1 + Math.sqrt(2) * Math.pow(10, -(numOfSeeders) / (parseInt(theConfig.fixedN0) - 1));
        var ANumber = decayFactor * size * seederFactor;
        ANumber = ANumber.toFixed(2);
        var weeksCell = document.createElement('td');
        weeksCell.textContent = ANumber;
        row.appendChild(weeksCell);


        var weeksCell2 = document.createElement('td');
        var ANumberPerGB = ANumber / size;
        weeksCell2.textContent = ANumberPerGB.toFixed(3);
        if (parseFloat(ANumberPerGB) > theConfig.A_ValueLevels[0].A_Value) {
            weeksCell2.style.fontWeight = theConfig.A_ValueLevels[0].fontWeight;
            weeksCell2.style.color = theConfig.A_ValueLevels[0].color;
            weeksCell2.style.fontSize = theConfig.A_ValueLevels[0].fontSize;
        } else if (parseFloat(ANumberPerGB) > theConfig.A_ValueLevels[1].A_Value) {
            weeksCell2.style.fontWeight = theConfig.A_ValueLevels[1].fontWeight;
            weeksCell2.style.color = theConfig.A_ValueLevels[1].color;
            weeksCell2.style.fontSize = theConfig.A_ValueLevels[1].fontSize;
        } else {
            weeksCell2.style.fontWeight = theConfig.A_ValueLevels[2].fontWeight;
            weeksCell2.style.color = theConfig.A_ValueLevels[2].color;
            weeksCell2.style.fontSize = theConfig.A_ValueLevels[2].fontSize;
        }
        row.appendChild(weeksCell2);

        //FRDS增加官方魔力值数据
        if (theConfig.abbrev == "keepfrds") {
            var weeksCell3 = document.createElement('td');
            ANumberPerGB = extractedNumber;
            weeksCell3.textContent = ANumberPerGB;
            if (parseFloat(ANumberPerGB) > 0.73) {
                weeksCell3.style.fontWeight = 'bold';
                weeksCell3.style.color = 'red';
            }
            row.appendChild(weeksCell3);
        }
    }


    //CHD高亮已下载
    if (theConfig.abbrev == "chd") {
        var wholepage = document.querySelectorAll('body > table.mainouter');
        wholepage[0].style = "width:60%";
        // Get all the second <td> elements in the specified table rows
        var chdrows = document.querySelectorAll('table.torrents > tbody > tr ');
        for (var j = 1; j < chdrows.length; j++) {
            var percentCell = chdrows[j].querySelector('td:nth-child(10)');
            if (percentCell && percentCell.innerText !== "--") {
                var percentText = percentCell.innerText.trim();
                var titleBar = rows[j].querySelector('td:nth-child(2) > table.torrentname > tbody > tr');
                var percentValue = parseFloat(percentText.replace('%', '')); // Convert percentage to a number

                // Determine the background color based on the percentage value
                var backgroundColor = "";
                if (percentValue === 100) {
                    backgroundColor = "#35f41a"; // Green for 100%
                } else if (percentValue >= 71 && percentValue <= 99) {
                    backgroundColor = "#cdfa78"; // Light green for 71-99%
                } else if (percentValue >= 30 && percentValue <= 70) {
                    backgroundColor = "#FFC300"; // Yellow for 30-70%
                } else if (percentValue >= 1 && percentValue <= 30) {
                    backgroundColor = "#fa8f78"; // Orange for 1-30%
                } else if (percentValue === 0) {
                    backgroundColor = "#fc3a10"; // Red for 0%
                }

                // Apply the background color to the row and title bar
                chdrows[j].style.backgroundColor = backgroundColor;

                titleBar.style.backgroundColor = backgroundColor;

            }
        }
    }


    // CHD收藏页增加一键清除100%下载
    if (theConfig.abbrev == "chd") {
        if (window.location.href.includes("torrents.php?inclbookmarked=1")) {
            // Create the button
            var clearBookButton = document.createElement("button");
            clearBookButton.type = "button";
            clearBookButton.className = "btn";
            clearBookButton.textContent = "清除100%已下载";

            // Add a click event listener to the button
            clearBookButton.addEventListener("click", async function() {
                for (let i = 1; i < dataRows.length; i++) {
                    if (dataRows[i].querySelector('td:nth-child(10)').innerText == "100%") {
                        var starpart = dataRows[i].querySelector('td:nth-child(2)').querySelector('td > table.torrentname > tbody > tr > td:nth-child(2)').querySelectorAll('td > a')[1];
                        starpart.click();
                        // Wait for 10ms before continuing to the next click
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                }
            });

            // Find the position to place the button
            var positionToPutButton = document.querySelector('table.main > tbody > tr > td.embedded > h1');
            if (positionToPutButton) {
                // Create a container for the button to keep layout intact
                var container = document.createElement("div");
                container.style.display = "flex";
                container.style.justifyContent = "center";
                container.style.alignItems = "center";
                container.style.gap = "10px"; // Space between h1 and button

                // Wrap the h1 element and the button together
                positionToPutButton.parentNode.insertBefore(container, positionToPutButton);
                container.appendChild(positionToPutButton);
                container.appendChild(clearBookButton);
            }
        }

        // CHD种子页清除低下载人数种子《20
        if (theConfig.abbrev == "chd") {
        if (window.location.href.includes("sort=8&type=desc")) {
            // Create the button
            var clearBookButton2 = document.createElement("button");
            clearBookButton2.type = "button";
            clearBookButton2.className = "btn";
            clearBookButton2.textContent = "清除低下载人数种子";
            var positionToPutButton2= document.querySelector('table.main > tbody > tr > td.embedded > p');
            positionToPutButton2.appendChild(clearBookButton2);
            // Add a click event listener to the button
            clearBookButton2.addEventListener("click", async function() {
            // Assuming dataRows contains the rows in the table


            for (let i = 1; i < dataRows.length; i++) {

                let downloadCount = parseInt(dataRows[i].querySelector('td:nth-child(7)').innerText);
                if (downloadCount < 20) {
                    dataRows[i].style.display = 'none'; // Hide the row
                }
            }
        });

        }
        }





    }






}

(function() {
    'use strict';
    var currentwebsite = window.location.host;
    var foundConfig = config.find(cc => currentwebsite.includes(cc.host));
    console.log(foundConfig);
    var intv = setInterval(function() {
        var rows = document.querySelectorAll(foundConfig.seedList);
        if (rows && rows.length < 1) {
            return false;
        }
        clearInterval(intv);
        add_A_Value_Columns(document, foundConfig);
    }, 1000);
})();