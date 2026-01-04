// ==UserScript==
// @name         RankedUpsItemMarket - The_teej
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Create the report for the forum with the RW sale items and their bonuses from item market
// @author       Upsilon [3212478]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at  document-start
// @require https://update.greasyfork.org/scripts/545650/1642425/Upsilon%20Library.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546116/RankedUpsItemMarket%20-%20The_teej.user.js
// @updateURL https://update.greasyfork.org/scripts/546116/RankedUpsItemMarket%20-%20The_teej.meta.js
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
    let sortedItems = {};
    let editorContent = document.getElementsByClassName("wrapper")[0];
    const COLORS = {
        orange: '#ffa94d',
        red: '#ff8787',
        yellow: '#ffd43b',
        default: '#ddd'
    };

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
                        sortItemsByBonus();
                        createReport();
                    });
                });
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };

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


    function generateReport(items, category, container) {
        let p = document.createElement("p");
        p.style.marginTop = "10px";
        p.style.marginBottom = "10px";
        p.style.fontSize = "16px";
        p.style.textDecoration = "underline";
        p.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        container.appendChild(p);

        let itemsContainer = document.createElement("div");
        for (let item of items) {
            let bonusesText = item.bonuses.map(b => `${b.value}% ${b.title}`).join(", ");
            let color;
            if (item.color === 'Yellow') {
                color = '--te-text-color-yellow'
            } else if (item.color === 'Orange') {
                color = '--te-text-color-orange'
            } else {
                color = '--te-text-color-red'
            }

            let span = document.createElement("span");
            span.style.display = "block";
            span.style.margin = "5px 0";
            let text = `
            <strong>${item.name}</strong> -
            <span style="color: var(--te-text-color-lime)">${bonusesText}</span>.
            <span style="color: var(${color})">${item.color}</span>.
            Quality: ${item.quality}.
            ${item.dmg.toString()}/${item.acc.toString()}.
            <span style="color: var(--te-text-color-cyan)">$${formatPrice(item.price)}</span>
        `;
            if (item.bonuses.length > 1) {
                text += ` <span style="color:var(--te-text-color-grape);">DOUBLE PERK!!!</span>`;
            }
            span.innerHTML = text;
            itemsContainer.appendChild(span);
        }

        container.appendChild(itemsContainer);
    }

    function createReport() {
        if (document.getElementById("RankedUps")) {
            document.getElementById("RankedUps").remove();
        }
        let rankedUpsTeejDisplay = document.createElement("div");
        rankedUpsTeejDisplay.style.display = "none";
        rankedUpsTeejDisplay.id = "RankedUps";
        editorContent.after(rankedUpsTeejDisplay);
        for (let category in sortedItems) {
            if (sortedItems[category].length > 0) {
                generateReport(sortedItems[category], category, rankedUpsTeejDisplay);
            }
        }
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

    function sortItemsByBonus() {
        let parsedDataBis = [...parsedData];
        const bonusNames = [
            'Achilles', 'Assassinate', 'Backstab', 'Berserk', 'Bleed', 'Blindside',
            'Bloodlust', 'Comeback', 'Conserve', 'Cripple', 'Crusher', 'Cupid',
            'Deadeye', 'Deadly', 'Disarm', 'Double-edged', 'Double Tap', 'Empower',
            'Eviscerate', 'Execute', 'Expose', 'Finale', 'Focus', 'Frenzy', 'Fury',
            'Grace', 'Home Run', 'Irradiate', 'Motivation', 'Paralyze', 'Parry',
            'Penetrate', 'Plunder', 'Powerful', 'Proficience', 'Puncture', 'Quicken',
            'Rage', 'Revitalize', 'Roshambo', 'Slow', 'Smurf', 'Specialist', 'Stricken',
            'Stun', 'Suppress', 'Sure Shot', 'Throttle', 'Warlord', 'Weaken', 'Wind-up', 'Wither'
        ];

        bonusNames.forEach(bonus => {
            sortedItems[bonus] = parsedDataBis.filter(item =>
                                                      item.bonuses.some(b => b.title === bonus)
                                                     ).sort((a, b) => b.price - a.price);
        });


        const allSortedItems = Object.values(sortedItems).flat();
        sortedItems.Untiered = parsedDataBis.filter(item => !allSortedItems.includes(item));
        return sortedItems;
    }


    if (location.href.includes("viewListing")) {
        document.addEventListener('DOMContentLoaded', function () {
            waitForElm('.appHeaderWrapper___uyPti').then((wrapper) => {
                editorContent = wrapper;
                setupPage();
            });
        });
    }
    window.addEventListener('popstate', function (event) {
        if (location.href.includes("viewListing")) {
            waitForElm('.appHeaderWrapper___uyPti').then((wrapper) => {
                editorContent = wrapper;
                setupPage();
            });
        }
    });
})();