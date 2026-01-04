// ==UserScript==
// @name         Bunker Buck Collector
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Highlights Weapons and Armor below set BB limit for BB exchange + cache selling profit.
// @author       Allenone[2033011]
// @match        https://www.torn.com/amarket.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518405/Bunker%20Buck%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/518405/Bunker%20Buck%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURABLE SETTINGS
    const API_KEY = ''; // Public API key
    const PDA_APIKey = "###PDA-APIKEY###" // TornPDA backup;
    const BB_Margin = 0.05; // % below breakeven BB value
    const BB_Value_Override = false; // set to true to use a static BB value
    let BB_VALUE = 5000000; // Set your static Bunker Buck value here

    const CACHE_PREFIX = 'BBC_'; // ;)
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Define a map of weapon names to weapon types
    const weaponTypeMap = {
        // Melee Weapons
        "Axe": "Clubbing",
        "Baseball Bat": "Clubbing",
        "Bo Staff": "Clubbing",
        "Butterfly Knife": "Piercing",
        "Chain Whip": "Slashing",
        "Claymore Sword": "Slashing",
        "Cricket Bat": "Clubbing",
        "Crowbar": "Clubbing",
        "Dagger": "Piercing",
        "Diamond Bladed Knife": "Piercing",
        "Flail": "Clubbing",
        "Frying Pan": "Clubbing",
        "Guandao": "Slashing",
        "Hammer": "Clubbing",
        "Kama": "Slashing",
        "Katana": "Slashing",
        "Kodachi": "Slashing",
        "Kitchen Knife": "Piercing",
        "Knuckle Dusters": "Clubbing",
        "Leather Bullwhip": "Slashing",
        "Macana": "Piercing",
        "Metal Nunchakus": "Clubbing",
        "Naval Cutlass": "Slashing",
        "Ninja Claws": "Piercing",
        "Pen Knife": "Piercing",
        "Sai": "Piercing",
        "Samurai Sword": "Slashing",
        "Scimitar": "Slashing",
        "Spear": "Piercing",
        "Swiss Army Knife": "Piercing",
        "Wooden Nunchakus": "Clubbing",
        "Yasukuni Sword": "Slashing",
        "Metal Nunchaku": "Clubbing",
        "Wooden Nunchaku": "Clubbing",

        // Pistols
        "Beretta 92FS": "Pistol",
        "Beretta M9": "Pistol",
        "Cobra Derringer": "Pistol",
        "Desert Eagle": "Pistol",
        "Fiveseven": "Pistol",
        "Glock 17": "Pistol",
        "Lorcin 380": "Pistol",
        "Luger": "Pistol",
        "Magnum": "Pistol",
        "Qsz-92": "Pistol",
        "Raven MP25": "Pistol",
        "Ruger 57": "Pistol",
        "S&W Revolver": "Pistol",
        "Springfield 1911-A1": "Pistol",
        "Taurus": "Pistol",
        "USP": "Pistol",
        "Springfield 1911": "Pistol",

        // SMGs
        "9mm Uzi": "SMG",
        "AK74U": "SMG",
        "BT MP9": "SMG",
        "Bushmaster Carbon 15": "SMG",
        "MP 40": "SMG",
        "MP5 Navy": "SMG",
        "MP5k": "SMG",
        "P90": "SMG",
        "Skorpion": "SMG",
        "Thompson": "SMG",
        "TMP": "SMG",

        // Rifles
        "AK-47": "Rifle",
        "ArmaLite M-15A4 Rifle": "Rifle",
        "Enfield SA-80": "Rifle",
        "Heckler & Koch SL8": "Rifle",
        "M16 A2 Rifle": "Rifle",
        "M4A1 Colt Carbine": "Rifle",
        "SIG 552": "Rifle",
        "SKS Carbine": "Rifle",
        "Steyr AUG": "Rifle",
        "Tavor TAR-21": "Rifle",
        "Vektor CR-21": "Rifle",
        "XM8 Rifle": "Rifle",
        "ArmaLite M-15A4": "Rifle",

        // Shotguns
        "Benelli M1 Tactical": "Shotgun",
        "Benelli M4 Super": "Shotgun",
        "Blunderbuss": "Shotgun",
        "Ithaca 37": "Shotgun",
        "Jackhammer": "Shotgun",
        "Mag 7": "Shotgun",
        "Sawed-Off Shotgun": "Shotgun",

        // Machine Guns
        "M249 SAW": "Machine gun",
        "Minigun": "Machine gun",
        "Negev NG-5": "Machine gun",
        "PKM": "Machine gun",
        "Stoner 96": "Machine gun",

        // Heavy Artillery
        "China Lake": "Heavy Artillery",
        "Milkor MGL": "Heavy Artillery",
        "RPG Launcher": "Heavy Artillery",
        "SMAW Launcher": "Heavy Artillery",
        "Type 98 Anti Tank": "Heavy Artillery",

        // Special
        "Bread Knife": "Bread Knife",
        "Poison Umbrella": "Poison Umbrella",
        "Sledgehammer": "Sledgehammer",
        "Nock Gun": "Nock Gun",
        "Rheinmetall MG 3": "Rheinmetall MG 3",
        "Snow Cannon": "Snow Cannon",
        "Hazmat Suit": "Hazmat Suit",
        "Handbag": "Handbag",
        "Pink Mac-10": "Pink Mac-10",
        "Dual TMPs": "Dual TMPs",
        "Dual Bushmasters": "Dual Bushmasters",
        "Dual MP5s": "Dual MP5s",
        "Dual P90s": "Dual P90s",
        "Dual Uzis": "Dual Uzis",
        "Gold Plated AK-47": "Gold Plated AK-47",

        // Riot Armor
        "Riot Gloves": "Armor",
        "Riot Body": "Armor",
        "Riot Pants": "Armor",
        "Riot Boots": "Armor",
        "Riot Helmet": "Armor",

        // Assault Armor
        "Assault Gloves": "Armor",
        "Assault Body": "Armor",
        "Assault Pants": "Armor",
        "Assault Boots": "Armor",
        "Assault Helmet": "Armor",

        // Dune Armor
        "Dune Gloves": "Armor",
        "Dune Vest": "Armor",
        "Dune Pants": "Armor",
        "Dune Boots": "Armor",
        "Dune Helmet": "Armor",

        // Marauder Armor
        "Marauder Gloves": "Armor",
        "Marauder Body": "Armor",
        "Marauder Pants": "Armor",
        "Marauder Boots": "Armor",
        "Marauder Face Mask": "Armor",

        // Vanguard Armor
        "Vanguard Gloves": "Armor",
        "Vanguard Body": "Armor",
        "Vanguard Pants": "Armor",
        "Vanguard Boots": "Armor",
        "Vanguard Helmet": "Armor",

        // Delta Armor
        "Delta Gloves": "Armor",
        "Delta Body": "Armor",
        "Delta Pants": "Armor",
        "Delta Boots": "Armor",
        "Delta Helmet": "Armor",

        // Sentinel Armor
        "Sentinel Gloves": "Armor",
        "Sentinel Body": "Armor",
        "Sentinel Pants": "Armor",
        "Sentinel Boots": "Armor",
        "Sentinel Helmet": "Armor",

        // EOD Armor
        "EOD Gloves": "Armor",
        "EOD Apron": "Armor",
        "EOD Pants": "Armor",
        "EOD Boots": "Armor",
        "EOD Helmet": "Armor",
    };

    // quality multipliers
    const qualityMultipliers = {
        Yellow: 1,
        Orange: 3,
        OrangeTwoEffects: 4.5,
        Red: 9,
        RedTwoEffects: 13.5,
    };

    const weaponValueMap = {
        "Clubbing": 6,
        "Piercing": 6,
        "Slashing": 6,
        "Pistol": 4,
        "SMG": 4,
        "Rifle": 10,
        "Shotgun": 10,
        "Heavy Artillery": 14,
        "Machine gun": 14,
        "Armor": 12,
        "Bread Knife": 6,
        "Poison Umbrella": 6,
        "Sledgehammer": 6,
        "Nock Gun": 10,
        "Rheinmetall MG 3": 14,
        "Snow Cannon": 14,
        "Hazmat Suit": 50,
        "Handbag": 100,
        "Pink Mac-10": 150,
        "Dual TMPs": 200,
        "Dual Bushmasters": 200,
        "Dual MP5s": 200,
        "Dual P90s": 200,
        "Dual Uzis": 200,
        "Gold Plated AK-47": 200,
    };

    const cacheBBValue = {
        "Armor Cache": 60,
        "Melee Cache": 30,
        "Small Arms Cache": 20,
        "Medium Arms Cache": 50,
        "Heavy Arms Cache": 70
    }

    function determineQualityMultiplier(itemClass, itemElement) {
        const quality = determineQualityFromClass(itemClass);
        const bonusCount = countItemBonuses(itemElement);
        let multiplier;

        switch (quality) {
            case 'Yellow':
                multiplier = qualityMultipliers.Yellow;
                break;
            case 'Orange':
                multiplier = bonusCount > 1 ? qualityMultipliers.OrangeTwoEffects : qualityMultipliers.Orange;
                break;
            case 'Red':
                multiplier = bonusCount > 1 ? qualityMultipliers.RedTwoEffects : qualityMultipliers.Red;
                break;
            default:
                console.warn(`Unknown quality class: ${itemClass}. Defaulting to Yellow multiplier.`);
                multiplier = qualityMultipliers.Yellow;
        }

        return multiplier;
    }

    function countItemBonuses(itemElement) {
        const bonusIcons = itemElement.querySelectorAll('.bonus-attachment-icons');
        return bonusIcons.length;
    }

    function determineQualityFromClass(itemClass) {
        if (itemClass.includes('glow-yellow')) return 'Yellow';
        if (itemClass.includes('glow-orange')) return 'Orange';
        if (itemClass.includes('glow-red')) return 'Red';
        return 'Yellow'; // Default to Yellow if no class matches ( Bread Knife/Umbrella, etc )
    }

    function processItems() {
        const tabContainers = document.querySelectorAll('.tabContainer #types-tab-1, .tabContainer #types-tab-2');

        tabContainers.forEach((tabContainer) => {
            const listItems = tabContainer.querySelectorAll('.items-list.t-blue-cont.h > li');

            listItems.forEach((li) => {
                if (!li.textContent.trim() || li.classList.contains('clear') || li.classList.contains('processed') || !li.offsetParent) return;

                const weaponNameElement = li.querySelector('.title .item-name');
                const itemClass = li.querySelector('.item-plate')?.className || '';

                if (weaponNameElement && weaponNameElement.textContent.trim()) {
                    const weaponName = weaponNameElement.textContent.trim();
                    const weaponType = weaponTypeMap[weaponName];
                    if (weaponType) {
                        const baseValue = weaponValueMap[weaponType];
                        const trueBBValue = determineQualityMultiplier(itemClass, li) * baseValue;
                        const formattedValue = (Math.round((trueBBValue * BB_VALUE) * (1 - BB_Margin))).toLocaleString();

                        const valueSpan = document.createElement('span');
                        valueSpan.textContent = ` [BB: ${trueBBValue} Value: ${formattedValue}]`;
                        valueSpan.style.color = 'white';
                        weaponNameElement.appendChild(valueSpan);

                        const bidElement = li.querySelector('.c-bid-wrap');
                        if (bidElement) {
                            const bidPriceText = bidElement.textContent.trim();
                            const bidPrice = parseInt(bidPriceText.replace(/[^0-9.-]+/g, ''), 10);
                            const threshold = Math.round((BB_VALUE * trueBBValue) * (1 - BB_Margin));

                            if (bidPrice < threshold) {
                                li.style.backgroundColor = 'darkgreen'; // Highlight the entire row
                            }
                        }

                        li.classList.add('processed');
                    } else {
                        console.warn(`No type found for weapon: ${weaponName}`);
                    }
                }
            });
        });
    }

    const targetElement = document.body;
    const observer = new MutationObserver(() => {
        const auctionHouseTabs = document.querySelector('#auction-house-tabs');
        const itemsList = document.querySelector('.items-list.t-blue-cont.h');

        if (auctionHouseTabs && itemsList) {
            processItems();
        }
    });

    observer.observe(targetElement, {
        childList: true,
        subtree: true,
    });

    function setCachedData(itemID, value) {
        const cacheEntry = {
            data: value,
            timestamp: Date.now()
        };
        localStorage.setItem(`${CACHE_PREFIX}${itemID}`, JSON.stringify(cacheEntry));
    }

    function getCachedData(itemID) {
        const cached = localStorage.getItem(`${CACHE_PREFIX}${itemID}`);
        if (!cached) return null;

        const cacheEntry = JSON.parse(cached);
        const now = Date.now();

        if (now - cacheEntry.timestamp > CACHE_DURATION) {
            localStorage.removeItem(`${CACHE_PREFIX}${itemID}`);
            return null;
        }

        return cacheEntry.data;
    }

    //boolean logic functions
    function isPDA() {
        const PDATestRegex = !/^(###).+(###)$/.test(PDA_APIKey);
        return PDATestRegex;
    }

    const request = GM.xmlHttpRequest || GM.xmlhttpRequest;

    async function CacheMarketValue() {
        if (!BB_Value_Override) {
            try {
                const cachedBBValue = getCachedData('BB_VALUE');
                if (cachedBBValue) {
                    BB_VALUE = cachedBBValue;
                    return BB_VALUE;
                }

                let api_key = isPDA() ? PDA_APIKey : API_KEY;
                const response = await new Promise((resolve, reject) => {
                    request({
                        method: 'GET',
                        url: `https://api.torn.com/v2/torn/1118,1119,1120,1121,1122/items?key=${api_key}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve({ json: () => Promise.resolve(data) });
                            } catch (err) {
                                reject(new Error('Failed to parse response: ' + err.message));
                            }
                        },
                        onerror: (err) => reject(new Error('Request failed: ' + err.message))
                    });
                });

                const data = await response.json();
                if (data.items) {
                    let highestBBValue = 0;

                    data.items.forEach(item => {
                        const cacheValue = cacheBBValue[item.name];

                        if (cacheValue && item.value?.market_price) {
                            const bbValue = Math.round(item.value.market_price / cacheValue);

                            highestBBValue = Math.max(highestBBValue, bbValue);

                            setCachedData(item.id, {
                                market_price: item.value.market_price,
                                bb_value: bbValue
                            });
                        }
                    });

                    BB_VALUE = highestBBValue;
                    setCachedData('BB_VALUE', BB_VALUE);
                    return BB_VALUE;
                }
            } catch (err) {
                console.error(`Error fetching market values: `, err);
                return null;
            }
        }

    }

    CacheMarketValue();

})();
