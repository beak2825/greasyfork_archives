// ==UserScript==
// @name         RankedUps - Heart (updated)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       Heart [3034011]
// @description  Create a table with the RW sale items and their bonuses
// @match        https://www.torn.com/bazaar.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512538/RankedUps%20-%20Heart%20%28updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512538/RankedUps%20-%20Heart%20%28updated%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let parsedData = [];
    let sortedItems = {
        red: [],
        orange: [],
        revitalize: [],
        warlord: [],
        primary: [],
        'Macana/DBK': [],
        japanese: [],
        'Other Melees': [],
        secondary: [],
        armor: []
    };
    let editorContent = document.getElementsByClassName("wrapper")[0];

    // CSS for dark and light modes
    const style = document.createElement('style');
    style.textContent = `
      .table-container {
        --border-color: #ddd;
        --text-color: #fff;
      }

      .table-container.light-mode {
        --border-color: #ddd;
        --text-color: #000;
      }

      .table-container.dark-mode {
        --border-color: #444;
        --text-color: #fff;
      }

      .table-container table {
        border-collapse: collapse;
        width: 100%;
      }

      .table-container th, .table-container td {
        border: 1px solid var(--border-color);
        padding: 4px;
        color: var(--text-color);
      }

      .table-container th {
        font-weight: bold;
      }

      /* Add this section for button styling */
  .styled-button {
    background-color: #007bff;
    color: #fff;
    padding: 5px 10px;
    border: none;
    border-radius: -10px;
    cursor: pointer;
    font-size: 14px;
    margin: 10px;
    transition: background-color 0.3s ease;
  }

  .styled-button:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }
    `;
    document.head.appendChild(style);

    function createElement(tag, attributes, content) {
        let element = document.createElement(tag);
        for (let attr in attributes) {
            element.setAttribute(attr, attributes[attr]);
        }
        if (content) {
            element.innerHTML = content;
        }
        return element;
    }

    function createTableCell(content) {
        return createElement('td', {}, content);
    }

    function createTableRow(cells) {
        let row = createElement('tr');
        cells.forEach(cell => {
            row.appendChild(cell);
        });
        return row;
    }

    function createTable(headers, rows, category) {
        let tableContainer = createElement('div', { class: 'table-container light-mode' }); // Default to light mode
        let table = createElement('table');
        let headerRow = createTableRow(headers.map(header => createTableCell(`<strong>${header}</strong>`)));
        table.appendChild(headerRow);
        rows.forEach(row => {
            table.appendChild(createTableRow(row));
        });
        tableContainer.appendChild(table);
        tableContainer.id = `${category} Table`;
        return tableContainer;
    }

    function createButton(text, onClick) {
    let button = document.createElement("button");
    button.innerText = text;
    button.className = "styled-button"; // Apply the CSS class
    button.addEventListener("click", onClick);
    return button;
}


    function formatPrice(price) {
        if (price >= 1e9) {
            return (price / 1e9).toFixed(2) + 'B';
        } else if (price >= 1e6) {
            return (price / 1e6).toFixed(2) + 'M';
        } else if (price >= 1e3) {
            return (price / 1e3).toFixed(2) + 'K';
        } else {
            return price.toString();
        }
    }

    function parseData(tornData) {
        for (let data of tornData.list) {
            if ((data.type !== "Weapon" && data.type !== "Armour") || data.glowClass === null) {
                continue;
            }
            if (data.type2 === "Temporary") {
                continue;
            }
            let item = {
                name: data.name,
                type: data.type,
                type2: data.type2,
                price: Number(data.price),
                dmg: Number(data.damage).toFixed(2),
                acc: Number(data.accuracy).toFixed(2),
                arm: Number(data.arm).toFixed(2),
                stealth: Number(data.stealthLevel),
                quality: Number(data.quality).toFixed(2),
                color: data.glowClass !== null ? data.glowClass.split("-")[1].charAt(0).toUpperCase() + data.glowClass.split("-")[1].slice(1) : '',
                currentBonuses: []
            }
            for (let bonusKey in data.currentBonuses) {
                let bonus = data.currentBonuses[bonusKey];
                item.currentBonuses.push({
                    title: bonus.title,
                    value: Number(bonus.value)
                });
            }
            let itemExists = parsedData.some(existingItem => existingItem.name === item.name && existingItem.quality === item.quality);
            if (!itemExists) {
                parsedData.push(item);
            }
        }
    }

    function sortArmorAndWeapons(items, category) {
        if (category !== "armor")
            return items.sort((a, b) => b.price - a.price);
        const sortOrder = ['EOD', 'Sentinel', 'Marauder', 'Vanguard', 'Delta', 'Assault', 'Riot', 'Dune'];
        items.sort((a, b) => {
            const aIndex = sortOrder.findIndex(order => a.name.includes(order));
            const bIndex = sortOrder.findIndex(order => b.name.includes(order));
            if (aIndex === bIndex)
                return b.price - a.price;
            return aIndex - bIndex;
        });
        return items;
    }

    function generateTable(items, category, tableContainer) {
        items = sortArmorAndWeapons(items, category);
        let existingTable = document.getElementById(`${category} Table`);
        if (existingTable)
            existingTable.remove();
        let p = document.createElement("p");
        let headers = ['Weapon', 'Bonuses', 'Quality', 'Dam', 'Accu', 'Price'];
        p.style.color = "#99E9F2";
        p.style.marginTop = "10px";
        p.style.marginBottom = "10px";
        p.style.fontSize = "25px";
        p.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        if (category === "armor")
            headers = ['Armor', 'Bonuses', 'Quality', 'Arm', 'Price'];
        let rows = items.map(item => {
            let color = item.color.toLowerCase() === 'red' ? '#ff8787' : item.color.toLowerCase() === 'orange' ? '#ffa94d' : item.color.toLowerCase() === 'yellow' ? '#ffd43b' : '#ddd';
            return [
                createTableCell(`<strong>${item.name}</strong>`),
                createTableCell(item.currentBonuses.map(bonus => `<p>${bonus.value}% ${bonus.title}</p>`).join('')),
                createTableCell(`<p style="color: ${color}">${item.quality}% ${item.color}</p>`),
                createTableCell(item.dmg.toString()),
                createTableCell(item.acc.toString()),
                createTableCell("$" + formatPrice(item.price))
            ];
        });
        if (category === "armor")
            rows = items.map(item => {
                let color = item.color.toLowerCase() === 'red' ? '#ff8787' : item.color.toLowerCase() === 'orange' ? '#ffa94d' : item.color.toLowerCase() === 'yellow' ? '#ffd43b' : '#ddd';
                return [
                    createTableCell(`<strong>${item.name}</strong>`),
                    createTableCell(item.currentBonuses.map(bonus => `<p>${bonus.value}% ${bonus.title}</p>`).join('')),
                    createTableCell(`<p style="color: ${color}">${item.quality}% ${item.color}</p>`),
                    createTableCell(item.arm.toString()),
                    createTableCell("$" + formatPrice(item.price))
                ];
            });
        let table = createTable(headers, rows, category);
        tableContainer.appendChild(p);
        tableContainer.appendChild(table);
    }

    function createRegularTable() {
        if (document.getElementById("RankedUps")) {
            document.getElementById("RankedUps").remove();
        }
        let rankedUpsTableDisplay = document.createElement("div");
        rankedUpsTableDisplay.id = "RankedUps";
        rankedUpsTableDisplay.style.display = "none";
        editorContent.after(rankedUpsTableDisplay);
        generateTable(parsedData, "RW Sale", rankedUpsTableDisplay);
    }

    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function () {
            return originalFetch.apply(this, arguments).then((response) => {
                if (response.url.includes("bazaar.php")) {
                    response.clone().json().then((data) => {
                        parseData(data);
                        createRegularTable();
                        heartSorting();
                        generateHeartGrids();
                        console.log(sortedItems);
                    });
                }
                return response;
            });
        };
    }

    function setupPage() {
        let dropdownButton = createButton("Show/Hide RW Sale Grid", function () {
            let table = document.getElementById("RankedUps");
            if (table.style.display === "none") {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        });

        let copyButton = createButton("Copy Table", function () {
            let table = document.getElementById("RankedUps");
            table.style.display = "block";
            let tableHtml = table.outerHTML;

            navigator.clipboard.writeText(tableHtml).then(function () {
                alert("Table HTML copied to clipboard!");
            }, function (err) {
                console.error('Could not copy text: ', err);
            });
            table.style.display = "none";
        });

        copyButton.style.marginLeft = "10px";
        editorContent.appendChild(dropdownButton);
        editorContent.appendChild(copyButton);
    }

    function heartSorting() {
        let parsedDataBis = [...parsedData];
        sortedItems.armor = parsedDataBis.filter(item => item.type === 'Armour');
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.armor.includes(item));
        sortedItems.revitalize = parsedDataBis.filter(item => item.currentBonuses.some(bonus => bonus.title === 'Revitalize'));
        sortedItems.warlord = parsedDataBis.filter(item => item.currentBonuses.some(bonus => bonus.title === 'Warlord'));
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.warlord.includes(item) && !sortedItems.revitalize.includes(item));
        sortedItems.red = parsedDataBis.filter(item => item.color.toLowerCase() === 'red');
        sortedItems.orange = parsedDataBis.filter(item => item.color.toLowerCase() === 'orange');
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.red.includes(item) && !sortedItems.orange.includes(item));
        sortedItems.primary = parsedDataBis.filter(item => item.type2 === 'Primary');
        sortedItems.secondary = parsedDataBis.filter(item => item.type2 === 'Secondary');
        sortedItems["Macana/DBK"] = parsedDataBis.filter(item => item.name === 'Macana' || item.name === 'Diamond Bladed Knife');
        sortedItems.japanese = parsedDataBis.filter(item => item.name === 'Sai' || item.name === 'Kama' || item.name === 'Kodachi' || item.name === 'Yasukuni Sword' || item.name === 'Katana' || item.name === 'Dual Samurai Swords' || item.name === 'Samurai Sword');
        sortedItems["Other Melees"] = parsedDataBis.filter(item =>
            !sortedItems.primary.includes(item) &&
            !sortedItems.secondary.includes(item) &&
            !sortedItems["Macana/DBK"].includes(item) &&
            !sortedItems.japanese.includes(item)
        );
    }

    function generateHeartGrids() {
        if (document.getElementById("heartTableDisplay")) {
            document.getElementById("heartTableDisplay").remove();
        }
        let heartTableDisplay = document.createElement("div");
        heartTableDisplay.id = "heartTableDisplay";
        heartTableDisplay.style.display = "none";
        editorContent.after(heartTableDisplay);
        for (let category in sortedItems) {
            generateTable(sortedItems[category], category, heartTableDisplay);
        }
    }

    function setupCustomHeartOptions() {
        let dropdownButton = createButton("Show/Hide Heart's Grid", function () {
            let table = document.getElementById("heartTableDisplay");
            if (table.style.display === "none") {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        });
        let copyButton = createButton("Copy Table 2", function () {
            let table = document.getElementById("heartTableDisplay");
            table.style.display = "block";
            let tableHtml = table.outerHTML;

            navigator.clipboard.writeText(tableHtml).then(function () {
                alert("Table HTML copied to clipboard!");
            }, function (err) {
                console.error('Could not copy text: ', err);
            });
            table.style.display = "none";
        });
        copyButton.style.marginLeft = "10px";
        editorContent.appendChild(dropdownButton);
        editorContent.appendChild(copyButton);
    }

    if (location.href.startsWith("https://www.torn.com/bazaar.php?") || location.href.startsWith("https://www.torn.com/bazaar.php#/")) {
        setupPage();
        setupCustomHeartOptions();
        interceptFetch();
    }
})();
