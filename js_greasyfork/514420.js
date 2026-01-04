// ==UserScript==
// @name         RankedUpsItemMarket - Heart
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Create a table with the RW sale items and their bonuses from item market
// @author       Heart [3034011]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at  document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514420/RankedUpsItemMarket%20-%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/514420/RankedUpsItemMarket%20-%20Heart.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // In Case button are not displaying, increase the next value like this : let lag = 250.
    let lag = 100;

    // Sleep
    const sleep = ms => new Promise(r => setTimeout(r, ms));


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
    const COLORS = {
        orange: '#ffa94d',
        red: '#ff8787',
        yellow: '#ffd43b',
        default: '#ddd'
    };

    const originalFetch = window.fetch;
    window.fetch = function () {
        sleep(lag);
        const url = arguments[0];
        if (url.includes("iMarket") && url.includes("getUserListings")) {
            return originalFetch.apply(this, arguments).then(function (response) {
                const clonedResponse = response.clone();
                clonedResponse.text().then(function (text) {
                    let jsonResponse = JSON.parse(text);
                    parseData(jsonResponse);
                    createRegularTable();
                    heartSorting();
                    generateHeartGrids();
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

    function createBonusElement(bonus) {
        return `<p>${bonus.value}% ${bonus.title}</p>`;
    }

    function createGlowElement(quality, color = COLORS.default) {
        return `<p style="color: ${color}">${quality}</p>`;
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

    function createTableCell(content, color = COLORS.default) {
        return createElement('td', {
            style: `color: ${color}; border: 1px solid ${COLORS.default}; padding: 4px;`
        }, content);
    }

    function createTableRow(cells) {
        let row = createElement('tr');
        cells.forEach(cell => {
            row.appendChild(cell);
        });
        return row;
    }

    function createTable(headers, rows, category) {
        let table = createElement('table', {
            style: 'margin-top: 10px; margin-bottom: 10px; color: rgb(255, 255, 255);'
        });
        let headerRow = createTableRow(headers.map(header => createTableCell(`<strong>${header}</strong>`)));
        table.appendChild(headerRow);
        rows.forEach(row => {
            table.appendChild(createTableRow(row));
        });
        table.id = `${category} Table`
        return table;
    }

    function createButton(text, onClick) {
        let button = document.createElement("button");
        button.innerText = text;
        button.style.color = "#fff";
        button.style.cursor = 'pointer';
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
                color: data.glowClass !== null ? data.glowClass.split("-")[1].charAt(0).toUpperCase() + data.glowClass.split("-")[1].slice(1) : '',
                bonuses: []
            }
            for (let bonus of data.bonuses) {
                item.bonuses.push({
                    title: bonus.title,
                    value: parseInt(bonus.description.match(/\d+/)[0], 10)
                });
            }
            parsedData.push(item);
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

    function generateTable(items, category, heartTableDisplay) {
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
            let color = COLORS[item.color.toLowerCase()] || COLORS.default;
            return [
                createTableCell(`<strong>${item.name}</strong>`),
                createTableCell(createBonusElements(item.bonuses)),
                createTableCell(createGlowElement(`${item.color}`, color)),
                createTableCell(item.dmg.toString()),
                createTableCell(item.acc.toString()),
                createTableCell("$" + formatPrice(item.price))
            ];
        });
        if (category === "armor")
            rows = items.map(item => {
                let color = COLORS[item.color.toLowerCase()] || COLORS.default;
                return [
                    createTableCell(`<strong>${item.name}</strong>`),
                    createTableCell(createBonusElements(item.bonuses)),
                    createTableCell(createGlowElement(`${item.color}`, color)),
                    createTableCell(item.arm.toString()),
                    createTableCell("$" + formatPrice(item.price))
                ];
            });
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
        sortedItems.armor = parsedDataBis.filter(item => item.type === 'Defensive');
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.armor.includes(item));
        sortedItems.revitalize = parsedDataBis.filter(item => item.bonuses.some(bonus => bonus.title === 'Revitalize'));
        sortedItems.warlord = parsedDataBis.filter(item => item.bonuses.some(bonus => bonus.title === 'Warlord'));
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.warlord.includes(item) && !sortedItems.revitalize.includes(item));
        sortedItems.red = parsedDataBis.filter(item => item.color.toLowerCase() === 'red');
        sortedItems.orange = parsedDataBis.filter(item => item.color.toLowerCase() === 'orange');
        parsedDataBis = parsedDataBis.filter(item => !sortedItems.red.includes(item) && !sortedItems.orange.includes(item));
        sortedItems.primary = parsedDataBis.filter(item => item.type === 'Primary');
        sortedItems.secondary = parsedDataBis.filter(item => item.type === 'Secondary');
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
        let dropdownButton = createButton("Show/Hide Heart Sale Grid", function () {
            let table = document.getElementById("heartTableDisplay");
            if (table.style.display === "none") {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        });
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
            waitForElm('.wrapper').then((elm) => {
                editorContent = document.getElementsByClassName("wrapper")[0];
                setupPage();
                setupCustomHeartOptions();
            });
        });
    }
    window.addEventListener('popstate', function (event) {
        if (location.href.includes("viewListing")) {
                waitForElm('.wrapper').then((elm) => {
                    editorContent = document.getElementsByClassName("wrapper")[0];
                    setupPage();
                    setupCustomHeartOptions();
                });
        }
    });
})();