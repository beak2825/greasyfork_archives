// ==UserScript==
// @name         RankedUps
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Create a table with the RW sale items and their bonuses
// @author       Upsilon [3212478]
// @match        https://www.torn.com/bazaar.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507403/RankedUps.user.js
// @updateURL https://update.greasyfork.org/scripts/507403/RankedUps.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let parsedData = [];
    let editorContent = document.getElementsByClassName("wrapper")[0];
    const COLORS = {
        orange: '#ffa94d',
        red: '#ff8787',
        yellow: '#ffd43b',
        default: '#ddd'
    };
    const BONUS_STYLE = "color: #ddd; margin: 0;";

    function createBonusElement(bonus) {
        return `<p style="${BONUS_STYLE}">${bonus.value}% ${bonus.title}</p>`;
    }

    function createBonusElements(bonuses) {
        return bonuses.map(createBonusElement).join('');
    }

    function createGlowElement(quality, color  = COLORS.default) {
        return `<p style="color: ${color}">${quality}</p>`;
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

    function createTable(headers, rows) {
        let table = createElement('table', {
            style: 'margin-top: 10px; margin-bottom: 10px; color: rgb(255, 255, 255);'
        });
        let headerRow = createTableRow(headers.map(header => createTableCell(`<strong>${header}</strong>`)));
        table.appendChild(headerRow);
        rows.forEach(row => {
            table.appendChild(createTableRow(row));
        });
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
            if (data.type !== "Weapon" || data.glowClass === null) {
                continue;
            }
            if (data.type2 === "Temporary" || data.type2 === "Armor") {
                continue;
            }
            let item = {
                name: data.name,
                type: data.type2,
                price: Number(data.price).toFixed(2),
                dmg: Number(data.damage).toFixed(2),
                acc: Number(data.accuracy).toFixed(2),
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

    function displayData() {
        let existingTable = document.getElementById("parsedDataTable");
        if (existingTable) {
            existingTable.remove();
        }
        parsedData.sort((a, b) => b.price - a.price);
        let headers = ['Weapon', 'Bonuses', 'Quality', 'Dam', 'Accu', 'Price'];
        let rows = parsedData.map(item => {
            let color = COLORS[item.color.toLowerCase()] || COLORS.default;
            return [
                createTableCell(`<strong>${item.name}</strong>`),
                createTableCell(createBonusElements(item.currentBonuses)),
                createTableCell(createGlowElement(`${item.quality}% ${item.color}`, color)),
                createTableCell(item.dmg.toString()),
                createTableCell(item.acc.toString()),
                createTableCell("$" + formatPrice(item.price))
            ];
        });
        let table = createTable(headers, rows);
        table.style.display = "none";
        table.id = "parsedDataTable";
        editorContent.after(table);
    }

    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function () {
            return originalFetch.apply(this, arguments).then((response) => {
                if (response.url.includes("bazaar.php")) {
                    response.clone().json().then((data) => {
                        parseData(data);
                        displayData();
                    });
                }
                return response;
            });
        };
    }

    function setupPage() {
        let dropdownButton = createButton("Show/Hide RW Sale Grid", function () {
            let table = document.getElementById("parsedDataTable");
            if (table.style.display === "none") {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        });

        let copyButton = createButton("Copy Table", function () {
            let table = document.getElementById("parsedDataTable");
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
        interceptFetch();
    }
})();