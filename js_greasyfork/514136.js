// ==UserScript==
// @name         RankedUpsItemMarket - Heart
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Create a table with the RW sale items and their bonuses from item market
// @author       Upsilon [3212478]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at  document-start
// @license      All Rights Reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514136/RankedUpsItemMarket%20-%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/514136/RankedUpsItemMarket%20-%20Heart.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // In Case button are not displaying, increase the next value like this : let lag = 250.
    let lag = 100;
    // API KEY PUBLIC
    let api_key = 'your api key';

    // Sleep
    const sleep = ms => new Promise(r => setTimeout(r, ms));


    let parsedData = [];
    let sortedItems = {
        'Double Bonus': [],
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
    const COLORS = {
        orange: '#ffa94d',
        red: '#ff8787',
        yellow: '#ffd43b',
        default: '#ddd'
    };

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
        border: 1px solid var(--border-color)!important;
        padding: 4px!important;
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

    const originalFetch = window.fetch;
    window.fetch = function () {
        sleep(lag);
        const url = arguments[0];
        if (url.includes("iMarket") && url.includes("getUserListings")) {
            return originalFetch.apply(this, arguments).then(function (response) {
                const clonedResponse = response.clone();
                clonedResponse.text().then(function (text) {
                    waitForElm('.appHeaderWrapper___uyPti').then(async (wrapper) => {
                        editorContent = wrapper;
                        let jsonResponse = JSON.parse(text);
                        await parseData(jsonResponse);
                        createRegularTable();
                        heartSorting();
                        generateHeartGrids();
                    });
                });
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // Listen until element is found
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function getStorage() {
        return JSON.parse(localStorage.getItem('ups_rankedwar_market_quality')) || {};
    }

    function setItem(id, value) {
        const storage = getStorage();

        storage[id] = {
            value: value,
            lastAccessed: Date.now()
        };

        localStorage.setItem('ups_rankedwar_market_quality', JSON.stringify(storage));
    }

    async function getQuality(uid) {
        const cached = getItem(uid);
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(`https://api.torn.com/torn/${uid}?key=${api_key}&selections=itemdetails`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.error);
            }

            const quality = data.itemdetails?.quality || 0;

            setItem(uid, quality);

            return quality;
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }


    function getItem(id) {
        const storage = getStorage();

        if (storage[id]) {
            storage[id].lastAccessed = Date.now();
            localStorage.setItem('ups_rankedwar_market_quality', JSON.stringify(storage));
            return storage[id].value;
        }
        return null;
    }

    function cleanStorage() {
        const storage = getStorage();
        const now = Date.now();
        const hours24 = 24 * 60 * 60 * 1000;
        let changed = false;

        for (const id in storage) {
            if (now - storage[id].lastAccessed > hours24) {
                delete storage[id];
                changed = true;
            }
        }

        if (changed) {
            localStorage.setItem('ups_rankedwar_market_quality', JSON.stringify(storage));
        }
    }

    function getCurrentTheme() {
        return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    }

    function createBonusElement(bonus) {
        if (bonus.value === '')
            return `<p>${bonus.title}</p>`;
        return `<p>${bonus.value}% ${bonus.title}</p>`;
    }

    function createGlowElement(quality, color = COLORS.default, quality_value) {
        return `<p style="color: ${color}">${Math.floor(quality_value).toString() + '%'} ${quality}</p>`;
    }

    function createBonusElements(bonuses) {
        return bonuses.map(createBonusElement).join('');
    }

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
        const themeClass = getCurrentTheme() === 'dark' ? 'dark-mode' : 'light-mode';
        let tableContainer = createElement('div', {
            class: `table-container ${themeClass}`
        });

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
        button.className = "styled-button";
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

    async function parseData(tornData) {
        for (let data of tornData.list) {
            if ((data.type !== "Primary" && data.type !== "Secondary" && data.type !== "Melee" && data.type !== "Defensive") || data.glowClass === "") {
                continue;
            }
            if (parsedData.some(item => item.name === data.name && item.dmg === data.dmg && item.acc === data.acc && item.arm === data.arm)) {
                continue;
            }
            let item = {
                name: data.name,
                type: data.type,
                price: Number(data.price),
                dmg: Number(data.damage).toFixed(2),
                acc: Number(data.accuracy).toFixed(2),
                arm: Number(data.armor).toFixed(2),
                quality: await getQuality(data.armouryID),
                color: data.glowClass !== null ? data.glowClass.split("-")[1].charAt(0).toUpperCase() + data.glowClass.split("-")[1].slice(1) : '',
                bonuses: []
            }
            for (let bonus of data.bonuses) {
                const numberMatch = bonus.description.match(/\d+/);
                if (numberMatch) {
                    item.bonuses.push({
                        title: bonus.title,
                        value: parseInt(numberMatch[0], 10)
                    });
                } else {
                    item.bonuses.push({
                        title: "Irradiate",
                        value: ''
                    });
                }
            }
            parsedData.push(item);
        }
    }

    function generateTable(items, category, heartTableDisplay) {
        let existingTable = document.getElementById(`${category} Table`);
        if (existingTable)
            existingTable.remove();
        let p = document.createElement("p");
        p.style.color = "#99E9F2";
        p.style.marginTop = "10px";
        p.style.marginBottom = "10px";
        p.style.fontSize = "25px";
        p.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        let headers, rows;
           const specialCategories = ["Double Bonus", "red", "orange", "revitalize", "warlord"];
        if (category === "armor"){
            headers = ['Armor', 'Bonuses', 'Quality', 'Arm', 'Price'];
            rows = items.map(item => {
                let color = COLORS[item.color.toLowerCase()] || COLORS.default;
                return [
                    createTableCell(`<strong>${item.name}</strong>`),
                    createTableCell(createBonusElements(item.bonuses)),
                    createTableCell(createGlowElement(`${item.color}`, color, item.quality)),
                    createTableCell(item.arm.toString()),
                    createTableCell("$" + formatPrice(item.price))
                ];
            });
        } else if (specialCategories.includes(category)) {
            headers = ['Weapon', 'Type', 'Bonuses', 'Quality', 'Dam', 'Accu', 'Price'];
            rows = items.map(item => {
                let color = COLORS[item.color.toLowerCase()] || COLORS.default;
                return [
                    createTableCell(`<strong>${item.name}</strong>`),
                    createTableCell(`${item.type}`),
                    createTableCell(createBonusElements(item.bonuses)),
                    createTableCell(createGlowElement(`${item.color}`, color, item.quality)),
                    createTableCell(item.dmg.toString()),
                    createTableCell(item.acc.toString()),
                    createTableCell("$" + formatPrice(item.price))
                ];
            });
        } else {
            headers = ['Weapon', 'Bonuses', 'Quality', 'Dam', 'Accu', 'Price'];
            rows = items.map(item => {
                let color = COLORS[item.color.toLowerCase()] || COLORS.default;
                return [
                    createTableCell(`<strong>${item.name}</strong>`),
                    createTableCell(createBonusElements(item.bonuses)),
                    createTableCell(createGlowElement(`${item.color}`, color, item.quality)),
                    createTableCell(item.dmg.toString()),
                    createTableCell(item.acc.toString()),
                    createTableCell("$" + formatPrice(item.price))
                ];
            });
        }
        let table = createTable(headers, rows, category);
        heartTableDisplay.appendChild(p);
        heartTableDisplay.appendChild(table);
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

    function setupPage() {
        if (document.querySelector("#RankedUpsItemMarketButtonBasic")) return;

        let dropdownButton = createButton("Show/Hide RW Sale Grid", function () {
            let table = document.getElementById("RankedUps");
            if (table.style.display === "none") {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        });
        dropdownButton.id = 'RankedUpsItemMarketButtonBasic';

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

        sortedItems.armor = parsedDataBis.filter(item => item.type === 'Defensive');
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.armor.includes(item));
        sortedItems.revitalize = parsedDataBis.filter(item => item.bonuses.some(bonus => bonus.title === 'Revitalize'));
        sortedItems.warlord = parsedDataBis.filter(item => item.bonuses.some(bonus => bonus.title === 'Warlord'));
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.warlord.includes(item) && !sortedItems.revitalize.includes(item));
        sortedItems["Double Bonus"] = parsedDataBis.filter(item => item.bonuses.length === 2);
        parsedDataBis = parsedDataBis.filter(item => !sortedItems["Double Bonus"].includes(item));
        sortedItems.red = parsedDataBis.filter(item => item.color.toLowerCase() === 'red');
        sortedItems.orange = parsedDataBis.filter(item => item.color.toLowerCase() === 'orange');
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.red.includes(item) && !sortedItems.orange.includes(item));
        sortedItems.primary = parsedDataBis.filter(item => item.type === 'Primary');
        sortedItems.secondary = parsedDataBis.filter(item => item.type === 'Secondary');
        sortedItems["Macana/DBK"] = parsedDataBis.filter(item => item.name === 'Macana' || item.name === 'Diamond Bladed Knife');
        sortedItems.japanese = parsedDataBis.filter(item => item.name === 'Sai' || item.name === 'Kama' || item.name === 'Kodachi' || item.name === 'Yasukuni Sword' || item.name === 'Katana' || item.name === 'Dual Samurai Swords' || item.name === 'Samurai Sword');
        sortedItems["Other Melees"] = parsedDataBis.filter(item => !sortedItems.primary.includes(item) && !sortedItems.secondary.includes(item) && !sortedItems["Macana/DBK"].includes(item) && !sortedItems.japanese.includes(item)
                                                          );
        const primaryOrder = ["ArmaLite M-15A4", "Enfield SA-80", "Tavor TAR-21", "SIG 552"];
        const dbkOrder = ["Diamond Bladed Knife", "Macana"]
        const japaneseOrder = ["Kodachi", "Yasukuni Sword", "Samurai Sword", "Katana"];
        const secondaryOrder = ["BT MP9", "Qsz-92"];
        const armorOrder = ['EOD', 'Sentinel', 'Marauder', 'Vanguard', 'Delta', 'Assault', 'Riot', 'Dune'];
        const typeOrder = ['Primary', 'Secondary', 'Melee'];

        sortedItems["Double Bonus"].sort((a, b) => weaponSortType(a, b, typeOrder));
        sortedItems["red"].sort((a, b) => weaponSortType(a, b, typeOrder));
        sortedItems["orange"].sort((a, b) => weaponSortType(a, b, typeOrder));
        sortedItems["revitalize"].sort((a, b) => weaponSortType(a, b, typeOrder));
        sortedItems["warlord"].sort((a, b) => weaponSortType(a, b, typeOrder));
        sortedItems["primary"].sort((a, b) => customWeaponSort(a, b, primaryOrder));
        sortedItems["Macana/DBK"].sort((a, b) => customWeaponSort(a, b, dbkOrder));
        sortedItems["japanese"].sort((a, b) => customWeaponSort(a, b, japaneseOrder));
        sortedItems["Other Melees"].sort((a, b) => b.price - a.price);
        sortedItems["secondary"].sort((a, b) => customWeaponSort(a, b, secondaryOrder));
        sortedItems["armor"].sort((a, b) => customWeaponSort(a, b, armorOrder));
    }

    function customWeaponSort(a, b, weaponOrder) {
        const aPriority = weaponOrder.findIndex(weapon => a.name.includes(weapon));
        const bPriority = weaponOrder.findIndex(weapon => b.name.includes(weapon));

        if (aPriority !== -1 || bPriority !== -1) {
            if (aPriority === -1) return 1;
            if (bPriority === -1) return -1;
            if (aPriority !== bPriority) return aPriority - bPriority;
        }

        return b.price - a.price;
    }

    function weaponSortType(a, b, typeOrder) {
        const aPriority = typeOrder.findIndex(weapon => a.type.includes(weapon));
        const bPriority = typeOrder.findIndex(weapon => b.type.includes(weapon));

        if (aPriority !== -1 || bPriority !== -1) {
            if (aPriority === -1) return 1;
            if (bPriority === -1) return -1;
            if (aPriority !== bPriority) return aPriority - bPriority;
        }

        return b.price - a.price;
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
            if (sortedItems[category].length > 0) {
                generateTable(sortedItems[category], category, heartTableDisplay);
            }
        }
    }

    function setupCustomHeartOptions() {
        if (document.querySelector("#RankedUpsItemMarketButtonHeart")) return;

        let dropdownButton = createButton("Show/Hide Heart Sale Grid", function () {
            let table = document.getElementById("heartTableDisplay");
            if (table.style.display === "none") {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        });
        dropdownButton.id = 'RankedUpsItemMarketButtonHeart';

        let copyButton = createButton("Copy Heart Table", function () {
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

    if (location.href.includes("viewListing")) {
        document.addEventListener('DOMContentLoaded', function () {
            waitForElm('.appHeaderWrapper___uyPti').then((wrapper) => {
                editorContent = wrapper;
                setupPage();
                setupCustomHeartOptions();
            });
        });
    }
    window.addEventListener('popstate', function (event) {
        if (location.href.includes("viewListing")) {
            waitForElm('.appHeaderWrapper___uyPti').then((wrapper) => {
                editorContent = wrapper;
                setupPage();
                setupCustomHeartOptions();
            });
        }
    });
})();