// ==UserScript==
// @name         RankedUpsItemMarket - SPQ
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Create the report for the forum with the RW sale items and their bonuses from item market
// @author       Upsilon [3212478]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @require https://update.greasyfork.org/scripts/545650/1642425/Upsilon%20Library.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546159/RankedUpsItemMarket%20-%20SPQ.user.js
// @updateURL https://update.greasyfork.org/scripts/546159/RankedUpsItemMarket%20-%20SPQ.meta.js
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
    let forumChunks = [];
    let currentChunkIndex = 0;

    // CSS for dark and light modes
    const style = document.createElement('style');
    style.textContent = `
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
        p.style.marginTop = "12px";
        p.style.fontSize = "12px";
        p.style.textDecoration = "underline";
        p.style.fontWeight = "bold";
        p.style.marginBottom = "1px";
        p.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        container.appendChild(p);

        let itemsContainer = document.createElement("div");
        for (let item of items) {
            let bonusesText = item.bonuses.map(b => `${b.value}% ${b.title}`).join(" + ");
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
            let text = `
            <span style="color: var(${color})">${item.name} ${bonusesText} ${item.quality}Q ${item.dmg.toString()}/${item.acc.toString()}</span>.
            <span style="color: var(--te-text-color-lime)">$${formatPrice(item.price)} OBO</span>
        `;
            span.innerHTML = text;
            itemsContainer.appendChild(span);
        }

        container.appendChild(itemsContainer);
    }

    function createReport() {
        if (document.getElementById("RankedUps")) {
            document.getElementById("RankedUps").remove();
        }
        let rankedUpsSPQDisplay = document.createElement("div");
        rankedUpsSPQDisplay.style.display = "none";
        rankedUpsSPQDisplay.id = "RankedUps";
        editorContent.after(rankedUpsSPQDisplay);
        for (let category in sortedItems) {
            if (sortedItems[category].length > 0) {
            if (sortedItems[category].length > 0) generateReport(sortedItems[category], category, rankedUpsSPQDisplay);
            }
        }
    }

    function splitIntoChunksByGroup(container, maxLen = 50000) {
        let chunks = [];
        let currentChunk = "";

        const bonusNames = [
            'Achilles','Assassinate','Backstab','Berserk','Bleed','Blindside',
            'Bloodlust','Comeback','Conserve','Cripple','Crusher','Cupid',
            'Deadeye','Deadly','Disarm','Double-edged','Double Tap','Empower',
            'Eviscerate','Execute','Expose','Finale','Focus','Frenzy','Fury',
            'Grace','Home Run','Irradiate','Motivation','Paralyze','Parry',
            'Penetrate','Plunder','Powerful','Proficience','Puncture','Quicken',
            'Rage','Revitalize','Roshambo','Slow','Smurf','Specialist','Stricken',
            'Stun','Suppress','Sure Shot','Throttle','Warlord','Weaken','Wind-up','Wither'
        ];
        const allGroups = [...bonusNames, 'Untiered'];

        for (let bonus of allGroups) {
            const key = Object.keys(sortedItems).find(k => k.startsWith(bonus));
            if (!key || !sortedItems[key] || sortedItems[key].length === 0) continue;

            let tempContainer = document.createElement("div");
            generateReport(sortedItems[key], key, tempContainer);
            let groupHtml = `<div class="group-block">${tempContainer.innerHTML}</div>`;

            if ((currentChunk.length + groupHtml.length) > maxLen) {
                if (currentChunk.length > 0) chunks.push(currentChunk);
                currentChunk = groupHtml;
            } else {
                currentChunk += groupHtml;
            }
        }
        if (currentChunk.length > 0) chunks.push(currentChunk);
        return chunks;
    }

    function setupPage() {
        let dropdownButton = createButton("Show/Hide RW Sale Grid", function () {
            let table = document.getElementById("RankedUps");
            table.style.display = table.style.display === "none" ? "block" : "none";
        });

        let copyChunkButton = createButton("Copy Next Chunk", function () {
            let table = document.getElementById("RankedUps");
            table.style.display = "block";

            if (forumChunks.length === 0) {
                forumChunks = splitIntoChunksByGroup(table, 50000);
                currentChunkIndex = 0;
            }

            if (currentChunkIndex < forumChunks.length) {
                navigator.clipboard.writeText(forumChunks[currentChunkIndex]).then(() => {
                    alert(`Chunk ${currentChunkIndex + 1} of ${forumChunks.length} copied!`);
                    currentChunkIndex++;
                });
            } else {
                alert("No more chunks left!");
            }

            table.style.display = "none";
        });

        editorContent.appendChild(dropdownButton);
        editorContent.appendChild(copyChunkButton);
    }

    function sortItemsByBonus() {
        let parsedDataBis = [...parsedData];
        const bonusDefinitions = {
            'Achilles': 'Increased foot damage %',
            'Assassinate': 'Increased damage % on the first turn',
            'Backstab': 'Chance % of double damage when opponent is distracted',
            'Berserk': 'Increased Damage %, Reduced Hit Chance half%',
            'Bleed': '% change to appluBleeding causing 225% damage over 9 turns',
            'Blindside': 'Increased damage % if target has full life',
            'Bloodlust': 'Life regenerated by a % of damage dealt',
            'Comeback': 'Increased damage % while under 1/4 life',
            'Conserve': 'Increase % ammo conservation',
            'Cripple': 'Chance % to Cripple opponent reducing Dexterity by 25% (x3)',
            'Crusher': 'Increased Head damage %',
            'Cupid': 'Increased Heart damage %',
            'Deadeye': 'Increased Critical hit damage %',
            'Deadly': '% chance of a deadly hit',
            'Disarm': 'Disables opponents weapon for (X) turns upon hitting their hand or arm.',
            'Double-edged': 'Chance % of double damage at the cost of self injury',
            'Double Tap': 'Chance % at hitting twice in a single turn',
            'Empower': 'Increased Strength while using the weapon %',
            'Eviscerate': 'Opponent receives extra damage % under this effect',
            'Execute': 'Instant defeat a target upon a damaging hit when opponent is below % life',
            'Expose': 'Increased critical hit rate %',
            'Finale': 'Increased damage % for every turn the weapon is not used',
            'Focus': 'Hit Chance increase % for every successive miss',
            'Frenzy': '% Increase to Damage and Accuracy on each successive hit',
            'Fury': 'Chance % of hitting twice in a single turn',
            'Grace': 'Increased Hit Chance %, Reduced Damage half%',
            'Home Run': 'Chance % to deflect incoming temporary items',
            'Irradiate': 'Apply 1-3 hours radiation poisoning when used for the finishing hit',
            'Motivation': 'Chance % to increase all stats by 10% (up to 5 of these may stack)',
            'Paralyze': 'Adds 300 seconds ‘Paralyze’ effect (50% chance of missing turns)',
            'Parry': '% Chance to block incoming melee attacks',
            'Penetrate': 'Ignores % of enemy armor mitigation',
            'Plunder': 'Increase % to money mugged when used for finishing hit',
            'Powerful': 'Increased Damage %',
            'Proficience': 'Increase XP % gained when used for the finishing hit',
            'Puncture': 'Chance % of ignoring armor',
            'Quicken': 'Increased Speed while using the weapon %',
            'Rage': 'Chance % at hitting 2-8 times in a single turn',
            'Revitalize': 'Chance % of restoring the energy spent attacking, when used for the finishing hit',
            'Roshambo': 'Increased Groin damage %',
            'Slow': 'Chance % to Slow opponent reducing Speed by 25% (x3)',
            'Smurf': '% damage increase for each level under an opponent',
            'Specialist': 'Increased Damage %, weapon is limited to a single clip',
            'Stricken': '% Increased hospital time upon final hit',
            'Stun': 'Chance % to cause opponent to miss next turn',
            'Suppress': '% chance to Suppress opponent causing 25% chance to miss future turns',
            'Sure Shot': 'Chance % at a guaranteed hit',
            'Throttle': 'Increased Throat damage %',
            'Warlord': 'Increases respect gained %',
            'Weaken': 'Chance % to Weaken opponent reducing Defense by 25% (x3)',
            'Wind-up': 'Increased damage % after spending a turn to wind up the weapon',
            'Wither': 'Chance % to Wither opponent reducing Strength by 25% (x3)'
        };
        const bonusNames = Object.keys(bonusDefinitions);

        bonusNames.forEach(bonus => {
            sortedItems[`${bonus} - ${bonusDefinitions[bonus]}`] = parsedDataBis.filter(item =>
                                                                                        item.bonuses.some(b => b.title === bonus)
                                                                                       );
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