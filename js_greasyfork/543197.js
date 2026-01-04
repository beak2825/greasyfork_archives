// ==UserScript==
// @name         TORN Bunker Bucks Calculator On Item Market Listings
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add bunker bucks calculation to item previews
// @author       swervelord
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543197/TORN%20Bunker%20Bucks%20Calculator%20On%20Item%20Market%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/543197/TORN%20Bunker%20Bucks%20Calculator%20On%20Item%20Market%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Bunker Buck values
    const bunkerBuckTable = {
        'Yellow': {
            'Pistol / SMG': 4,
            'Melee': 6,
            'Shotgun/rifle': 10,
            'Armour': 12,
            'Heavies': 14
        },
        'Orange': {
            1: { 'Pistol / SMG': 12, 'Melee': 18, 'Shotgun/rifle': 30, 'Armour': 26, 'Heavies': 42 },
            2: { 'Pistol / SMG': 18, 'Melee': 27, 'Shotgun/rifle': 45, 'Armour': 26, 'Heavies': 63 }
        },
        'Red': {
            1: { 'Pistol / SMG': 36, 'Melee': 54, 'Shotgun/rifle': 90, 'Armour': 108, 'Heavies': 126 },
            2: { 'Pistol / SMG': 54, 'Melee': 81, 'Shotgun/rifle': 135, 'Armour': 108, 'Heavies': 189 }
        }
    };

    // Hardcoded weapon lists for accurate classification
    const weaponLists = {
        'Armour': [
            'EOD Boots', 'EOD Gloves', 'EOD Helmet', 'EOD Pants', 'EOD Apron',
            'Sentinel Helmet', 'Sentinel Apron', 'Sentinel Pants', 'Sentinel Gloves', 'Sentinel Boots',
            'Marauder Boots', 'Marauder Gloves', 'Marauder Pants', 'Marauder Body',
            'Delta Boots', 'Delta Gloves', 'Delta Gas Mask', 'Delta Pants', 'Delta Body',
            'Vanguard Respirator', 'Vanguard Body', 'Vanguard Pants', 'Vanguard Gloves', 'Vanguard Boots',
            'Assault Boots', 'Assault Gloves', 'Assault Helmet', 'Assault Pants', 'Assault Body',
            'Riot Boots', 'Riot Gloves', 'Riot Pants', 'Riot Body',
            'Dune Boots', 'Dune Gloves', 'Dune Helmet', 'Dune Pants', 'Dune Vest'
        ],
        'Heavies': [
            'China Lake', 'Egg Propelled Launcher', 'Flamethrower', 'Milkor MGL', '73 Neutrilux',
            'RPG Launcher', 'SMAW Launcher', 'Type 98 Anti Tank', 'Negev NG-5', 'M249 SAW',
            'Minigun', 'PKM', 'Rheinmetall MG 3', 'Stoner 96'
        ],
        'Shotgun/rifle': [
            'Benelli M1 Tactical', 'Benelli M4 Super', 'Blunderbuss', 'Homemade Pocket Shotgun',
            'Ithaca 37', 'Jackhammer', 'Mag 7', 'Nock Gun', 'Sawed-Off Shotgun',
            'AK-47', 'ArmaLite M-15A4', 'Enfield SA-80', 'Heckler & Koch SL8', 'M16 A2 Rifle',
            'M4A1 Colt Carbine', 'SIG 550', 'SIG 552', 'Steyr AUG', 'Tavor TAR-21',
            'Vektor CR-21', 'XM8 Rifle', 'SKS Carbine'
        ],
        'Melee': [
            'Axe', 'Baseball Bat', 'Bo Staff', 'Bread Knife', 'Butterfly Knife', 'Chain Whip',
            'Chainsaw', 'Claymore Sword', 'Cleaver', 'Cricket Bat', 'Crowbar', 'Dagger',
            'Diamond Bladed Knife', 'Fine Chisel', 'Flail', 'Frying Pan', 'Golf Club',
            'Guandao', 'Hammer', 'Ice Pick', 'Kama', 'Katana', 'Kitchen Knife',
            'Knuckle Dusters', 'Kodachi', 'Lead Pipe', 'Leather Bullwhip', 'Macana',
            'Metal Nunchakus', 'Naval Cutlass', 'Ninja Claws', 'Pen Knife', 'Poison Umbrella',
            'Riding Crop', 'Sai', 'Samurai Sword', 'Scalpel', 'Scimitar', 'Sledgehammer',
            'Spear', 'Swiss Army Knife', 'Wooden Nunchaku', 'Yasukuni Sword'
        ],
        'Pistol / SMG': [
            'Beretta 92FS', 'Beretta M9', 'Beretta Pico', 'Desert Eagle', 'Fiveseven',
            'Glock 17', 'Luger', 'Magnum', 'Qsz-92', 'Raven MP25', 'Ruger 57',
            'S&W M29', 'S&W Revolver', 'Springfield 1911', 'Taurus', 'USP 9mm',
            'Uzi', 'AK74U', 'BT MP9', 'MP5 Navy', 'MP5k', 'P90', 'Skorpion', 'TMP', 'Thompson', 'MP 40'
        ]
    };

    // Function to get item name from the popup
    function getItemName(itemInfo) {
        const descriptionElement = itemInfo.querySelector('.description___xJ1N5');
        if (descriptionElement) {
            const boldElement = descriptionElement.querySelector('.bold');
            if (boldElement) return boldElement.textContent.trim();
        }
        return '';
    }

    // Function to extract weapon type from item name
    function getWeaponType(itemName) {
        if (!itemName) return null;
        const name = itemName.trim();

        // Check hardcoded weapon lists first
        for (const [category, weapons] of Object.entries(weaponLists)) {
            if (weapons.includes(name) || weapons.some(weapon => name.includes(weapon) || weapon.includes(name))) {
                return category;
            }
        }

        // Fallback text-based detection
        const text = itemName.toLowerCase();
        if (text.includes('pistol') || text.includes('smg') || text.includes('uzi') || text.includes('glock') || text.includes('beretta')) return 'Pistol / SMG';
        if (text.includes('shotgun') || text.includes('rifle') || text.includes('ak-') || text.includes('m4')) return 'Shotgun/rifle';
        if (text.includes('armor') || text.includes('armour') || text.includes('vest')) return 'Armour';
        if (text.includes('heavy') || text.includes('minigun') || text.includes('flamethrower')) return 'Heavies';
        if (text.includes('melee') || text.includes('knife') || text.includes('sword') || text.includes('bat')) return 'Melee';
        return null;
    }

    // Function to extract rarity from quality section
    function getRarity(itemInfo) {
        let qualityElement = itemInfo.querySelector('.rarity___bDCDD');
        if (!qualityElement) qualityElement = itemInfo.querySelector('[class*="rarity"]');

        if (qualityElement) {
            if (qualityElement.className.includes('yellow')) return 'Yellow';
            if (qualityElement.className.includes('red')) return 'Red';
            if (qualityElement.className.includes('orange')) return 'Orange';
        }
        return null;
    }

    // Function to count bonuses
    function countBonuses(itemInfo) {
        let bonusCount = 0;
        itemInfo.querySelectorAll('.title___DbORn').forEach(element => {
            if (element.textContent.trim() === 'Bonus:') bonusCount++;
        });
        return bonusCount;
    }

    // Function to calculate bunker bucks
    function calculateBunkerBucks(rarity, weaponType, bonusCount) {
        if (rarity === 'Yellow') {
            return bunkerBuckTable['Yellow'][weaponType] || null;
        } else if (rarity === 'Orange' || rarity === 'Red') {
            if (bonusCount === 0) return null;
            const bonusKey = bonusCount >= 2 ? 2 : 1;
            if (bunkerBuckTable[rarity][bonusKey] && bunkerBuckTable[rarity][bonusKey][weaponType]) {
                return bunkerBuckTable[rarity][bonusKey][weaponType];
            }
        }
        return null;
    }

    // Function to format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Main function to add bunker bucks to item popup
    function addBunkerBucks(itemInfo) {
        if (itemInfo.dataset.bunkerBucksAdded) return;
        itemInfo.dataset.bunkerBucksAdded = 'true';

        const itemName = getItemName(itemInfo);
        const weaponType = getWeaponType(itemName);
        const rarity = getRarity(itemInfo);
        const bonusCount = countBonuses(itemInfo);

        if (!weaponType || !rarity) return;

        const bunkerBucks = calculateBunkerBucks(rarity, weaponType, bonusCount);
        if (bunkerBucks === null) return;

        const propertiesList = itemInfo.querySelector('.properties___pva_l');
        if (!propertiesList) return;

        // Expand popup height slightly to ensure visibility
        const previewWrapper = itemInfo.querySelector('.previewAndPropertiesWrapper___hqsZP');
        if (previewWrapper) {
            const currentHeight = parseInt(previewWrapper.style.height) || 203;
            previewWrapper.style.height = (currentHeight + 40) + 'px';
        }

        // Look for an empty row to populate
        const allWrappers = propertiesList.querySelectorAll('.propertyWrapper___xSOH1');
        let emptyRow = null;

        for (let wrapper of allWrappers) {
            const propertyDiv = wrapper.querySelector('.property___hqXXN');
            if (propertyDiv && propertyDiv.children.length === 0) {
                emptyRow = wrapper;
                break;
            }
        }

        if (emptyRow) {
            // Populate existing empty row
            const propertyDiv = emptyRow.querySelector('.property___hqXXN');
            propertyDiv.innerHTML = `
                <span class="title___DbORn">Bunker Bucks:</span>
                <div class="valueWrapper___vVHLn t-overflow" data-is-tooltip-opened="false">
                    <span class="t-overflow">${formatNumber(bunkerBucks)} BB</span>
                </div>
            `;
        } else {
            // Fallback: create new row
            const bunkerRow = document.createElement('li');
            bunkerRow.className = 'propertyWrapper___xSOH1 property___vsfqU';
            bunkerRow.innerHTML = `
                <div class="property___hqXXN">
                    <span class="title___DbORn">Bunker Bucks:</span>
                    <div class="valueWrapper___vVHLn t-overflow" data-is-tooltip-opened="false">
                        <span class="t-overflow">${formatNumber(bunkerBucks)} BB</span>
                    </div>
                </div>
            `;
            propertiesList.appendChild(bunkerRow);
        }
    }

    // Observer to watch for item popups
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList) {
                    if (node.classList.contains('itemInfoWrapper___nA_eu') || node.classList.contains('itemInfo___mNZ5j')) {
                        const popup = node.classList.contains('itemInfo___mNZ5j') ? node : node.querySelector('.itemInfo___mNZ5j');
                        if (popup) {
                            setTimeout(() => addBunkerBucks(popup), 100);
                            setTimeout(() => addBunkerBucks(popup), 500);
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();