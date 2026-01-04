// ==UserScript==
// @name         Torn Burglary Helper - Testing
// @namespace    nichtgersti.torn.burglary-helper
// @version      0.1.2
// @description  Display a risk assessment and (some) loot for each burglary target.
// @author       NichtGersti [3380912]
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538591/Torn%20Burglary%20Helper%20-%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/538591/Torn%20Burglary%20Helper%20-%20Testing.meta.js
// ==/UserScript==

(function() {
    //to only run it once on PDA
    if (window.nichtGerstiTornBurglaryHelper) return;
    window.nichtGerstiTornBurglaryHelper = true;
    
    const tbhLog = (...input) => console.log("[Torn Burglary Helper]", ...input);

    const burglaryInfo = {
        "Apartment": {
            "type": "Residential",
            "safety": "Risky",
            "cases": "4-6",
            "loot": "Bleach, Bottle of Kandy Kane, Bottle of Pumpkin Brew, Graver, Perforator, Printer",
            "ammo": "-",
            "unique": "1x Personal Computer, 1x High-Speed Drive, 1x Blank DVDs : 250",
        },
        "Beach Hut": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "loot": "Hydrochloric Acid, Net, Window Breaker",
            "ammo": "-",
            "unique": "$110,100 - $399,700",
        },
        "Bungalow": {
            "type": "Residential",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "loot": "Bleach, Melatonin",
            "ammo": "Standard",
            "unique": "1x Soap on a Rope, 1x Xanax, 1x Vitamins, 1x Toothbrush",
        },
        "Cottage": {
            "type": "Residential",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "loot": "Bottle of Minty Mayhem, Erotic DVD, Lockpicks, Printer",
            "ammo": "Hollow Point, Piercing, Tracer, Incendiary",
            "unique": "1x Jacket, 1x Lawyer's Business Card",
        },
        "Farmhouse": {
            "type": "Residential",
            "safety": "Unsafe",
            "cases": "2",
            "loot": "Bottle of Stinky Swamp Punch, C4 Explosive, Can of Goose Juice",
            "ammo": "Standard",
            "unique": "1x Turkey Baster, 1x Bull Semen",
        },
        "Lake House": {
            "type": "Residential",
            "safety": "Unsafe",
            "cases": "3+",
            "loot": "Bottle of Mistletoe Madness, Box of Medical Supplies, Diesel, Net, Thimble, Window Breaker",
            "ammo": "Standard",
            "unique": "2x Box of Medical Supplies",
        },
        "Luxury Villa": {
            "type": "Residential",
            "safety": "Risky",
            "cases": "4+",
            "loot": "Bleach, Bottle of Kandy Kane, Melatonin, Xanax",
            "ammo": "Standard",
            "unique": "1x Persian Rug",
        },
        "Manor House": {
            "type": "Residential",
            "safety": "Risky",
            "cases": "4-6",
            "loot": "Horse's Head, Small Suitcase, Xanax",
            "ammo": "Standard, Hollow Point, Piercing, Incendiary",
            "unique": "1x Chandelier",
        },
        "Mobile Home": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "loot": "Blowtorch",
            "ammo": "-",
            "unique": "1x Claymore Mine, 1x Luger, 1x WWII Helmet",
        },
        "Secluded Cabin": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "loot": "Bottle of Mistletoe Madness, Lockpicks, Smoke Grenade",
            "ammo": "Standard",
            "unique": "1x Pack of Cuban Cigars, 1x Windproof Lighter, 1x Cigar Cutter",
        },
        "Suburban Home": {
            "type": "Residential",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "loot": "Bag of Chocolate Truffles, Bleach, Window Breaker",
            "ammo": "-",
            "unique": "1x Lottery Voucher",
        },
        "Tool Shed": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "loot": "Blow Torch, Lockpicks",
            "ammo": "-",
            "unique": "1x Flashlight",
        },
        "Advertising Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "loot": "Pixie Sticks, Serotonin",
            "ammo": "-",
            "unique": "2x Can of Damp Valley",
        },
        "Barbershop": {
            "type": "Commercial",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "loot": "-",
            "ammo": "-",
            "unique": "1x Cut-Throat Razor",
        },
        "Chiropractors": {
            "type": "Commercial",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "loot": "Small Suitcase, Tyrosine",
            "ammo": "-",
            "unique": "3x Xanax",
        },
        "Cleaning Agency": {
            "type": "Commercial",
            "safety": "Safe",
            "cases": "1-2",
            "loot": "Bleach, Hydrochlorid Acid, Lockpicks",
            "ammo": "-",
            "unique": "1x Tumble Dryer",
        },
        "Dentists Office": {
            "type": "Commercial",
            "safety": "Safe",
            "cases": "1-2",
            "loot": "Bleach, Dental Mirror, Drug Pack, Epinephrine, Grinding Stone, Polishing Pad",
            "ammo": "-",
            "unique": "1x Latex Gloves, 6x Golden Tooth",
        },
        "Funeral Directors": {
            "type": "Commercial",
            "safety": "Unsafe",
            "cases": "2-3",
            "loot": "Chloroform, Printer, Small Suitcase",
            "ammo": "-",
            "unique": "1x Empty Blood Bag, 1x Bone Saw, 1x Bone, 1x Cassock",
        },
        "Liquor Store": {
            "type": "Commercial",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "loot": "Bottle of Green Stout (only on St. Patrick's Day), Bottle of Kandy Kane, Bottle of Mistletoe Madness, Bottle of Pumpkin Brew, Bottle of Stinky Swamp Punch, Bottle of Wicked Witch, Can of Crocozade, Lottery Voucher, Skeleton Key",
            "ammo": "-",
            "unique": "1x Six-Pack of Alcohol",
        },
        "Market": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "loot": "Bleach, Bonded Latex, Bottle of Pumpkin Brew, Bottle of Wicked Witch",
            "ammo": "-",
            "unique": "1x Fanny Pack",
        },
        "Postal Office": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "5+",
            "loot": "Advanced Driving Manual, Can of Goose Juice, Lockpicks",
            "ammo": "Hollow Point, Piercing, Tracer, Incendiary",
            "unique": "1x Stamp Collection",
        },
        "Recruitment Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "loot": "Bottle of Stinky Swamp Punch, Can of Damp Valley, Printer, Window Breaker, Xanax",
            "ammo": "-",
            "unique": "1x Jade Buddha, 1x Bowling Trophy",
        },
        "Self Storage Facility": {
            "type": "Commercial",
            "safety": "Dangerous",
            "cases": "6+",
            "loot": "Bleach, C4 Eplosive, Embosser, Graver, Paint Mask, Perforator, Pixie Sticks, Printer, Skeleton Key",
            "ammo": "Standard, Hollow Point, Piercing, Tracer, Incendiary",
            "unique": "4x Opium",
        },
        "Brewery": {
            "type": "Industrial",
            "safety": "Very Dangerous",
            "cases": "8+",
            "loot": "Bottle of Kandy Kane, Bottle of Minty Mayhem, Bottle of Mistletoe Madness, Bottle of Pumpkin Brew, Bottle of Stinky Swamp Punch, Bottle of Wicked Witch, Six-Pack of Alcohol",
            "ammo": "Standard",
            "unique": "1x Empty Box, 6x Bottle of Stinky Swamp Punch",
        },
        "Dockside Warehouse": {
            "type": "Industrial",
            "safety": "Dangerous",
            "cases": "7+",
            "loot": "Bag of Chocolate Truffles, Box of Grenades, Box of Medical Supplies, Kerosine, Smoke Grenade, Tear Gas",
            "ammo": "Hollow Point, Piercing, Tracer, Incendiary",
            "unique": "1x Erotic DVD",
        },
        "Farm Storage Unit": {
            "type": "Industrial",
            "safety": "Risky",
            "cases": "4-6",
            "loot": "Blowtorch, Crucible, Methane Tank",
            "ammo": "Standard",
            "unique": "1x Cattle Prod",
        },
        "Fertilizer Plant": {
            "type": "Industrial",
            "safety": "Unsafe",
            "cases": "2-3",
            "loot": "Fire Extinguisher",
            "ammo": "Hollow Point, Piercing, Tracer, Incendiary",
            "unique": "1x Truck Nuts",
        },
        "Foundry": {
            "type": "Industrial",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "loot": "Fire Extinguisher, Hydrochloric Acid, Magnesium Shavings",
            "ammo": "-",
            "unique": "1x Yasukuni Sword",
        },
        "Old Factory": {
            "type": "Industrial",
            "safety": "Safe",
            "cases": "1",
            "loot": "Bleach, C4 Explosive, Hydrogen Tank",
            "ammo": "-",
            "unique": "1x Empty Box, 1x Small Explosive Device",
        },
        "Paper Mill": {
            "type": "Industrial",
            "safety": "Unsafe",
            "cases": "2-3",
            "loot": "Bleach, Box of Medical Supplies, Printer, Skeleton Key",
            "ammo": "-",
            "unique": "$103,000 - $250,000",
        },
        "Printing Works": {
            "type": "Industrial",
            "safety": "Risky",
            "cases": "4-6",
            "loot": "Blank Tokens, Certificate Seal, Embosser, Erotic DVD, Printer, Wax Seal Stamp",
            "ammo": "Standard",
            "unique": "1x Hot Foil Stamper",
        },
        "Shipyard": {
            "type": "Industrial",
            "safety": "Very Dangerous",
            "cases": "8+",
            "loot": "Box of Medical Supplies, C4 Explosive, Skeleton Key, Thermite, Xanax",
            "ammo": "-",
            "unique": "1x Anchor",
        },
        "Slaughterhouse": {
            "type": "Industrial",
            "safety": "Safe",
            "cases": "1-2",
            "loot": "Bleach, Box of Medical Supplies, Chloroform, Horse's Head, Tyrosine",
            "ammo": "-",
            "unique": "1x Bloody Apron",
        },
        "Truckyard": {
            "type": "Industrial",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "loot": "Bleach, Can of Damp Valley, Diesel, Printer, Skeleton Key, Tear Gas, Window Breaker",
            "ammo": "Standard, Hollow Point, Piercing, Tracer, Incendiary",
            "unique": "1x Can of Munster",
        }
    };
    burglaryInfo["Advertisment Agency"] = burglaryInfo["Advertising Agency"];
    burglaryInfo["Ad Agency"] = burglaryInfo["Advertising Agency"];
    burglaryInfo["Cleaning Firm"] = burglaryInfo["Cleaning Agency"];
    burglaryInfo["Funeral Home"] = burglaryInfo["Funeral Directors"];
    burglaryInfo["Recruit Agency"] = burglaryInfo["Recruitment Agency"];
    burglaryInfo["Temp Agency"] = burglaryInfo["Recruitment Agency"];
    burglaryInfo["Self Storage"] = burglaryInfo["Self Storage Facility"];
    burglaryInfo["Docklands"] = burglaryInfo["Dockside Warehouse"];
    burglaryInfo["Farm Storage"] = burglaryInfo["Farm Storage Unit"];

    function decorateTargetNode(node) {
        if (!node) return;

        const crimOptionSectionNode = node.querySelector("[class*='crime-option-sections']");
        const nameNode = crimOptionSectionNode.childNodes[1];
        const buttonNode = crimOptionSectionNode.querySelector("[class*='commitButtonSection']");
        const imageNode = crimOptionSectionNode.querySelector("[class*='crimeOptionImage']");

        const targetName = nameNode.textContent;
        const targetInfo = burglaryInfo[targetName];

        if (targetInfo === undefined) {
            tbhLog(targetName, "not recognized. Skipping.")
            return;
        }

        const safetyDiv = document.createElement('div');
        safetyDiv.classList.add("safety", targetInfo.safety.replace(' ', ''));
        const casesText = document.createElement('div');
        casesText.textContent = targetInfo.cases;
        const safetyText = document.createElement('div');
        safetyText.textContent = targetInfo.safety;
        safetyDiv.append(safetyText, casesText);
        buttonNode.classList.add("burglary-button-node");
        buttonNode.append(safetyDiv);
        imageNode.title = `<strong>Ammunition:</strong> ${targetInfo.ammo}<br><strong>Interesting Loot:</strong> ${targetInfo.loot}<br><strong>Unique:</strong> ${targetInfo.unique}`;
    }

    function collectTargetNode(node) {
        if (!node?.classList?.contains("virtual-item")) return;
        const targetName = node.firstChild?.childNodes[1]?.firstChild?.childNodes[1]?.textContent
        if (!targetName) return;
        
        decorateTargetNode(node);
    }

    function collectTargetNodesAll(targetList) {
        if (!targetList) return;
        targetList.childNodes.forEach((node) => collectTargetNode(node));
    }

    function observeTargetList(targetList) {
        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                for (const node of mutation.addedNodes) {
                    if (!node.querySelector) continue;
                    if (!node.className.includes('virtual-item')) continue;
                    collectTargetNode(node);
                }
            });
        });
        mo.observe(targetList, { childList: true });
    }

    function findTargetList(root) {
        if (!root) {
            return;
        }

        tbhLog("Burglary root found.");

        let targetList = root.querySelector("[class*='currentCrime'] > [class*='virtualList']");
        if (targetList) {
            collectTargetNodesAll(targetList);
            observeTargetList(targetList);
            return;
        }

        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                for (const node of mutation.addedNodes) {
                    if (!node.querySelector) continue;

                    targetList =
                        node.parentNode.className.includes('currentCrime') && node.className.includes('virtualList')
                            ? node
                            : node.querySelector("[class*='currentCrime'] > [class*='virtualList']");
                    if (targetList) {
                        collectTargetNodesAll(targetList);
                        observeTargetList(targetList);
                        mo.disconnect();
                        return;
                    }
                }
            });
        });
        mo.observe(root, { childList: true, subtree: true });
    }

    function findBurglaryRoot(crimesApp) {
        if (!crimesApp) return;

        let burglaryRoot = crimesApp.querySelector(".burglary-root");
        findTargetList(burglaryRoot);

        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                for (const node of mutation.addedNodes) {
                    if (!node.querySelector) continue;

                    let burglaryRoot = node.className.includes('burglary-root') ? node : node.querySelector('.crime-root');
                    if (burglaryRoot) findTargetList(burglaryRoot);
                }
                for (const node of mutation.removedNodes) {
                    if (node.className?.includes("burglary-root")) findTargetList(undefined)
                }
            });
        });
        mo.observe(crimesApp, { childList: true });
    }

    function findCrimesApp() {
        let crimesApp = document.querySelector('.crimes-app');
        findBurglaryRoot(crimesApp);
        if (crimesApp) return;

        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                for (const node of mutation.addedNodes) {
                    if (!node.querySelector) continue;

                    crimesApp = node.classList.contains('crimes-app') ? node : node.querySelector('.crimes-app');
                    findBurglaryRoot(crimesApp);

                    if (crimesApp) {
                        mo.disconnect();
                        return;
                    }
                }
            });
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    function addStyle() {
        const styles = `
            div.burglary-button-node {
                grid-template: "a b" "c c";
                grid-auto-flow: row !important;
            }

            div.safety {
                width: 115px;
                display: flex;
                justify-content: space-between;
                border-radius: 5px;
                font-size: smaller;
                padding-top: 1px;
                padding-left: 5px;
                padding-right: 5px;
            }

            body:not(.dark-mode) div.safety {
                color: white;
            }

            body.dark-mode div.safety {
                color: black;
            }

            div.safety.Safe {
                background-color: #37b24d;
            }

            div.safety.ModeratelyUnsafe {
                background-color: #74b816;
            }

            div.safety.Unsafe {
                background-color: #f59f00;
            }

            div.safety.Risky {
                background-color: #f76707;
            }

            div.safety.Dangerous {
                background-color: #f03e3e;
            }

            div.safety.VeryDangerous {
                background-color: #7048e8;
            }
        `;

        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styles;
        document.head.appendChild(style);
    }

    addStyle()
    findCrimesApp();
})();