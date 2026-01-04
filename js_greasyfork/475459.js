// ==UserScript==
// @name         Torn Crimes Burglary Extended
// @namespace    https://github.com/SOLiNARY
// @version      0.6.1
// @description  Sorts all scouted by target, created date, expire date, confidence, risk or uniques number. Remembers your choice.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475459/Torn%20Crimes%20Burglary%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/475459/Torn%20Crimes%20Burglary%20Extended.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const isSortingEnabled = true;
    const burglaryCrimesUrl = 'loader.php?sid=crimesData&step=crimesList&typeID=7&';
    const scoutResidentialUrl = 'loader.php?sid=crimesData&step=attempt&typeID=7&crimeID=66&';
    const scoutCommercialUrl = 'loader.php?sid=crimesData&step=attempt&typeID=7&crimeID=67&';
    const scoutIndustrialUrl = 'loader.php?sid=crimesData&step=attempt&typeID=7&crimeID=68&';
    const observerConfig = { childList: true, subtree: true };
    let foundTargets = false;
    let noTargets = false;
    let targets = {};
    let burgledPlaces;
    const safetyAssessments = {
        "Apartment": {
            "type": "Residential",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Printer, Graver, Paperclips, premium alcohol",
            "unique": "1x Personal Computer, 1x High-Speed Drive, 1x Blank DVDs : 250",
            "advice": "Either avoid this location or case 4-6 times. Loot is good, mostly items related to forgeries. Can find 2N alcohol here."
        },
        "Beach Hut": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "finds": "Window Breaker",
            "unique": "Money (approx. 160k to 400k)",
            "advice": "Case once then burgle. Earliest known place where one can find the window breaker."
        },
        "Bungalow": {
            "type": "Residential",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "finds": "Melatonin, Laptop",
            "unique": "1x Soap on a Rope, 1x Xanax, 1x Vitamins, 1x Toothbrush",
            "advice": "Case once or twice. Only melatoning being noteworthy, everything else mostly being common consumables, clothes and weapons."
        },
        "Cottage": {
            "type": "Residential",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "finds": "Lockpicks, Handcuffs, Printer, Bottle of Minty Mayhem",
            "unique": "1x Jacket, 1x Lawyer's Business Card",
            "advice": "Case twice more often than not. Has a lot of noteworthy finds including lockpicks. Can rarely find premium alcohol here."
        },
        "Farmhouse": {
            "type": "Residential",
            "safety": "Unsafe",
            "cases": "2",
            "finds": "Razor Wire, Drill, C4 Explosive, Detonator & Ignition Cord, Energy Drinks, Permanent Marker",
            "unique": "1x Turkey Baster, 1x Bull Semen",
            "advice": "Case twice, maybe thrice. Loot is very interesting, explosively so."
        },
        "Lake House": {
            "type": "Residential",
            "safety": "Unsafe",
            "cases": "3+",
            "finds": "Window Breaker, Box of Medical Supplies, Binoculars, Bottle of Mistletoe Madness",
            "unique": "2x Box of Medical Supplies",
            "advice": "Case thrice or more. Only other residential location to give the window breaker, loot is mostly consumables and junk, with an extremely lucrative find of premium booze."
        },
        "Luxury Villa": {
            "type": "Residential",
            "safety": "Risky",
            "cases": "4+",
            "finds": "Wirecutters, Stash Box, Melatonin, Xanax",
            "unique": "1x Persian Rug",
            "advice": "Case four times or more. Loot is pretty good, mostly money and consumables like xanax, premium booze and melatonin."
        },
        "Manor House": {
            "type": "Residential",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Special ammunition",
            "unique": "1x Chandelier",
            "advice": "Case four to six times. Not enough data regarding loot."
        },
        "Mobile Home": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "finds": "Jemmy, Blowtorch, Drill. Money for the most part",
            "unique": "1x Claymore Mine, 1x Luger, 1x WWII Helmet",
            "advice": "Case once, rarely twice. Can find the jemmy here."
        },
        "Secluded Cabin": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "finds": "Lockpicks, Binoculars, Stick of Dynamite, Igniter Cord, Remote Detonator",
            "unique": "1x Pack of Cuban Cigars, 1x Windproof Lighter, 1x Cigar Cutter",
            "advice": "Case once, rarely twice. Loot includes mostly weapons and gear, as well as many tools for upcoming crimes."
        },
        "Suburban Home": {
            "type": "Residential",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "finds": "Coat Hanger, Drill, Jemmy, Wirecutters, consumables",
            "unique": "1x Lottery Voucher",
            "advice": "Case once or twice. Many tools used for existing and upcoming crimes."
        },
        "Tool Shed": {
            "type": "Residential",
            "safety": "Safe",
            "cases": "1",
            "finds": "Lockpicks, Blowtorch, Ammonia, Drill. Generally seemingly useful items",
            "unique": "1x Flashlight",
            "advice": "Case once then burgle, best place to find lockpicks."
        },
        "Advertisement Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "",
            "unique": "2x Can of Damp Valley",
            "advice": "Case four to six times. Money finds are fairly common here, not enough data regarding other interesting finds."
        }, // Advertisement Agency == Advertising Agency == Ad Agency
        "Advertising Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "",
            "unique": "2x Can of Damp Valley",
            "advice": "Case four to six times. Money finds are fairly common here, not enough data regarding other interesting finds."
        },
        "Ad Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "",
            "unique": "2x Can of Damp Valley",
            "advice": "Case four to six times. Money finds are fairly common here, not enough data regarding other interesting finds."
        },
        "Barbershop": {
            "type": "Commercial",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "finds": "Mostly junk, some consumables",
            "unique": "1x Cut-Throat Razor",
            "advice": "Case once or twice. Loot is either basic components found elsewhere or just junk items, with a few weapons here and there."
        },
        "Chiropractors": {
            "type": "Commercial",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "finds": "Small Suitcase, Ketamine, Morphine, Tyrosine",
            "unique": "3x Xanax",
            "advice": "Case once or twice. Loot is mostly junk but some interesting finds remain, main one being a suitcase."
        },
        "Cleaning Agency": {
            "type": "Commercial",
            "safety": "Safe",
            "cases": "1-2",
            "finds": "Lye, Ammonia, Ladder, Lockpicks",
            "unique": "1x Tumble Dryer",
            "advice": "Case twice. Loot appears to be used for body disposal and as fertilizer/explosive manufacturing, with a ladder for lord knows what reason."
        }, // Cleaning Agency == Cleaning Firm
        "Cleaning Firm": {
            "type": "Commercial",
            "safety": "Safe",
            "cases": "1-2",
            "finds": "Lye, Ammonia, Ladder, Lockpicks",
            "unique": "1x Tumble Dryer",
            "advice": "Case twice. Loot appears to be used for body disposal and as fertilizer/explosive manufacturing, with a ladder for lord knows what reason."
        },
        "Dentists Office": {
            "type": "Commercial",
            "safety": "Safe",
            "cases": "1-2",
            "finds": "Grinding Stone, Polishing Pad, Small Suitcase, Epinephirne, Drug Pack",
            "unique": "1x Latex Gloves, 6x Golden Tooth",
            "advice": "Case once or twice. Has some forgery-related loot, and multiple extremely lucrative finds. Arguably the best commercial location overall."
        },
        "Funeral Directors": {
            "type": "Commercial",
            "safety": "Unsafe",
            "cases": "2-3",
            "finds": "Casket, Bone Saw, Chloroform, Small Suitcase, Medical Bill",
            "unique": "1x Empty Blood Bag, 1x Bone Saw, 1x Bone, 1x Cassock",
            "advice": "Case twice or thrice. Loot seems mostly related to future crimes, including a fairly lucrative small suitcase."
        }, // Funeral Directors == Funeral Home
        "Funeral Home": {
            "type": "Commercial",
            "safety": "Unsafe",
            "cases": "2-3",
            "finds": "Casket, Bone Saw, Chloroform, Small Suitcase, Medical Bill",
            "unique": "1x Empty Blood Bag, 1x Bone Saw, 1x Bone, 1x Cassock",
            "advice": "Case twice or thrice. Loot seems mostly related to future crimes, including a fairly lucrative small suitcase."
        },
        "Liquor Store": {
            "type": "Commercial",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "finds": "Premium consumables",
            "unique": "1x Six-Pack of Alcohol",
            "advice": "Case twice, rarely thrice. Loot is quite good, mostly junk but a lot of premium alcohol up to 4N drinks, and rarely cans of crocozade as well."
        },
        "Market": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Laptop, Bonded Latex, consumables",
            "unique": "1x Fanny Pack",
            "advice": "Case four to six times. Loot includes a few crime components and a significant amount of premium consumables."
        },
        "Postal Office": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "5+",
            "finds": "Advanced Driving Manual, energy drinks, special ammunition",
            "unique": "1x Stamp Collection",
            "advice": "Case as many times as needed, upwards from five. Loot is mostly lackluster bar a few very good exceptions."
        },
        "Recruitment Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Printer, Window Breaker, Premium alcohol, Energy drinks",
            "unique": "1x Jade Buddha, 1x Bowling Trophy",
            "advice": "Case four to six times. Loot is junk for the most part with a few fairly lucrative exceptions."
        }, // Recruitment Agency == Recruit Agency == Temp Agency
        "Recruit Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Printer, Window Breaker, Premium alcohol, Energy drinks",
            "unique": "1x Jade Buddha, 1x Bowling Trophy",
            "advice": "Case four to six times. Loot is junk for the most part with a few fairly lucrative exceptions."
        },
        "Temp Agency": {
            "type": "Commercial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Printer, Window Breaker, Premium alcohol, Energy drinks",
            "unique": "1x Jade Buddha, 1x Bowling Trophy",
            "advice": "Case four to six times. Loot is junk for the most part with a few fairly lucrative exceptions."
        },
        "Self Storage Facility": {
            "type": "Commercial",
            "safety": "Dangerous",
            "cases": "6+",
            "finds": "Skeleton Key, Binoculars, Ammonia, Potassium Nitrate, Phosphorus, Embosser, Printer, Graver, Paint Mask",
            "unique": "4x Opium",
            "advice": "Case as many times as needed, upwards from six. Loot is very good, with items useful for forgeries, bombing, growing plants and stalking targets. The Key Item Skeleton Key can be found here."
        }, // Self Storage Facility == Self Storage
        "Self Storage": {
            "type": "Commercial",
            "safety": "Dangerous",
            "cases": "6+",
            "finds": "Skeleton Key, Binoculars, Ammonia, Potassium Nitrate, Phosphorus, Embosser, Printer, Graver, Paint Mask",
            "unique": "4x Opium",
            "advice": "Case as many times as needed, upwards from six. Loot is very good, with items useful for forgeries, bombing, growing plants and stalking targets. The Key Item Skeleton Key can be found here."
        },
        "Brewery": {
            "type": "Industrial",
            "safety": "Very Dangerous",
            "cases": "8+",
            "finds": "Premium alcohol, Dynamite, Ignition Cord, Six-Pack of Alcohol",
            "unique": "1x Empty Box, 6x Bottle of Stinky Swamp Punch",
            "advice": "Avoid entirely or case upwards from eight. Premium alcohol finds in this location are very lucrative, ranging from 2N to 4N drinks. Can find Six-Packs of Alcohol here as a common find. My personal favourite."
        },
        "Dockside Warehouse": {
            "type": "Industrial",
            "safety": "Dangerous",
            "cases": "7+",
            "finds": "Consumables, Special Ammunition",
            "unique": "1x Erotic DVD",
            "advice": "Case as many times as needed, upwards from seven. Loot seems to be weapons, armor, temps and meds, as well as special ammunition and other consumables."
        }, // Dockside Warehouse == Docklands
        "Docklands": {
            "type": "Industrial",
            "safety": "Dangerous",
            "cases": "7+",
            "finds": "Consumables, Special Ammunition",
            "unique": "1x Erotic DVD",
            "advice": "Case as many times as needed, upwards from seven. Loot seems to be weapons, armor, temps and meds, as well as special ammunition and other consumables."
        },
        "Farm Storage Unit": {
            "type": "Industrial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Machine Parts, Ammonia, Urea, Phosphorus, Potassium Nitrate, Lye, Crucible, Razor Wire",
            "unique": "1x Cattle Prod",
            "advice": "Case four to six times. Loot is excellent, mostly fertilizers or explosive components, plus a crucible which can be related to ammunition production paired with shipyard loot."
        }, // Farm Storage Unit == Farm Storage
        "Farm Storage": {
            "type": "Industrial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Machine Parts, Ammonia, Urea, Phosphorus, Potassium Nitrate, Lye, Crucible, Razor Wire",
            "unique": "1x Cattle Prod",
            "advice": "Case four to six times. Loot is excellent, mostly fertilizers or explosive components, plus a crucible which can be related to ammunition production paired with shipyard loot."
        },
        "Fertilizer Plant": {
            "type": "Industrial",
            "safety": "Unsafe",
            "cases": "2-3",
            "finds": "Fertilizer, Razor Wire, Ignition Cord, Remote Detonator",
            "unique": "1x Truck Nuts",
            "advice": "Case twice or thrice. Loot is interesting, fertilizer is extremely common, some explosives and cannabis as well."
        },
        "Foundry": {
            "type": "Industrial",
            "safety": "Moderately Unsafe",
            "cases": "2",
            "finds": "Machine Parts, Aluminum Plate, Brass Ingot, Phosphorus",
            "unique": "1x Yasukuni Sword",
            "advice": "Case twice, rarely thrice. Loot is extremely interesting including multiple materials for future crimes."
        },
        "Old Factory": {
            "type": "Industrial",
            "safety": "Safe",
            "cases": "1",
            "finds": "Brass Ingots, Machine Parts, Sticks of Dynamite, Remote Detonator, Ignition Cord",
            "unique": "1x Empty Box, 1x Small Explosive Device",
            "advice": "Case once, rarely twice. Loot is fairly interesting, mostly future crime components."
        },
        "Paper Mill": {
            "type": "Industrial",
            "safety": "Unsafe",
            "cases": "2-3",
            "finds": "Bond Paper, Machine Parts, Box of Medical Supplies, Skeleton Key",
            "unique": "Money (approx. 224k?)",
            "advice": "Case twice or thrice. Loot is mainly stationery, forgery-related items, plus two interesting finds being the skeleton key and a box of medical supplies."
        },
        "Printing Works": {
            "type": "Industrial",
            "safety": "Risky",
            "cases": "4-6",
            "finds": "Blank Credit Cards, Blank Tokens, Certificate Seal, Bond Paper, Wax Seal Stamp, Erotic DVD",
            "unique": "1x Hot Foil Stamper",
            "advice": "Case 4-6 times. Loot is completely centered on forgery components. Can find E-DVDs here as a common find."
        },
        "Shipyard": {
            "type": "Industrial",
            "safety": "Very Dangerous",
            "cases": "8+",
            "finds": "Skeleton Key, Box of Medical Supplies, C4 Explosive, Brass Ingot, Machine Part, Xanax",
            "unique": "1x Anchor",
            "advice": "Case as many times as needed, upwards from eight. Loot is very interesting including brass ingots, potentially useful for ammunition production."
        },
        "Slaughterhouse": {
            "type": "Industrial",
            "safety": "Safe",
            "cases": "1-2",
            "finds": "Box of Medical Supplies, Chloroform, Potassium Nitrate, Empty Blood Bag",
            "unique": "1x Bloody Apron",
            "advice": "Case once or twice. Loot seems to be mostly medical items and other components."
        },
        "Truckyard": {
            "type": "Industrial",
            "safety": "Moderately Unsafe",
            "cases": "1-2",
            "finds": "Binoculars, Wirecutters, Window Breaker, Skeleton Key, special ammunition, temporaries, energy drinks.",
            "unique": "1x Can of Munster",
            "advice": "Case once or twice. Loot is extremely interesting, including ammo both standard and special, tools for this and other crimes, temporaries, and other assorted junk."
        }
    }
    const safetyLevels = {
        'Safe': 10,
        'Moderately Unsafe': 20,
        'Unsafe': 30,
        'Risky': 40,
        'Dangerous': 50,
        'Very Dangerous': 60,
        'Unknown': 70,
        'Not Found': 80
    }
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const delimiter = document.createElement('div');
    delimiter.className = 'sectionDelimiter___NpsSC';

    const { fetch: originalFetch } = isTampermonkeyEnabled ? unsafeWindow : window;

    const customFetch = async (...args) => {
        let [resource, config] = args;
        let response = await originalFetch(resource, config);

        if (!foundTargets && response.url.indexOf(burglaryCrimesUrl) >= 0) {
            foundTargets = true;

            try {
                const jsonData = await response.clone().json();
                jsonData.DB.crimesByType.properties.forEach((property, index) => {
                    let createdFixed = property.created.toString().length == 10 ? property.created : property.created.toString().substr(0, 10); // Hotfix for Torn's bug
                    targets[index] = {
                        created: createdFixed,
                        expire: property.expire
                    };
                });

                response.json = async () => jsonData;
                response.text = async () => JSON.stringify(jsonData);
            } catch (error) {
                noTargets = true;
                console.log('[TornCrimesBurglaryExtended] No targets, skipping the script init', error);
            }
        }

        if (response.url.indexOf(scoutResidentialUrl) >= 0 || response.url.indexOf(scoutCommercialUrl) >= 0 || response.url.indexOf(scoutIndustrialUrl) >= 0) {
            try {
                const jsonData = await response.clone().json();
                if (jsonData.DB.outcome.result === 'success') {
                    const targetsNode = document.querySelector("div[class*=crimeOptionGroup___]:not([class*=firstGroup___])");
                    const targetsObserver = new MutationObserver((mutationsList, observer) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList' && mutation.target.className.indexOf('crimeOptionGroup___') > -1) {
                                let newTargets = mutation.target.querySelectorAll('div[class*=crimeOption___]:not(.silmaril-crimes-burglary-header):not([data-created-time])');
                                newTargets.forEach((element) => {
                                    const nowTimestamp = (Date.now()/1000).toFixed(0);
                                    const threeDaysAfterTimestamp = (Date.now()/1000 + 3*86400 - 1).toFixed(0);
                                    element.setAttribute('data-created-time', nowTimestamp);
                                    element.setAttribute('data-expire-time', threeDaysAfterTimestamp);
                                    addSafetyAssessment(element);
                                    if (isMobileView) {
                                        let expireDiv = addExpireDiv(element);
                                        expireDiv.innerText = 'In 3 days';
                                    } else {
                                        let createdDiv = addCreatedAndExpireDivs(element);
                                        let expireDiv = element.querySelector('div[class*=sections___] > div.expireTime');
                                        createdDiv.innerText = 'Just now';
                                        expireDiv.innerText = 'In 3 days';
                                    }
                                })
                                observer.disconnect();
                                break;
                            }
                        }
                    });

                    targetsObserver.observe(targetsNode, observerConfig);
                }

                response.json = async () => jsonData;
                response.text = async () => JSON.stringify(jsonData);
            } catch (error) {
                noTargets = true;
                console.error('[TornCrimesBurglaryExtended] Failed to register scouting attempt', error);
            }
        }

        return response;
    };

    if (isTampermonkeyEnabled){
        unsafeWindow.fetch = customFetch;
    } else {
        window.fetch = customFetch;
    }

    await addStyle();

    const sortBy = {
        "Target": 10,
        "CreationTime": 14,
        "ExpirationTime": 15,
        "Confidence": 20,
        "Status": 30,
        "Risk": 35,
        "HasUniques": 40
    };
    const sortDirection = {
        "Ascending": 1,
        "Descending": -1
    };
    const timeDeltas = {
        "After": 1,
        "Ago": -1
    };

    const timeElementsToShow = 2; // Options: 1,2,3,4

    const isMobileView = window.innerWidth <= 784;

    let currentSortBy = localStorage.getItem("silmaril-torn-crimes-burglary-sorting-by") ?? sortBy.Target;
    currentSortBy = parseInt(currentSortBy);
    let currentSortDirection = localStorage.getItem("silmaril-torn-crimes-burglary-sorting-direction") ?? sortDirection.Descending;
    currentSortDirection = parseInt(currentSortDirection);

    while (document.querySelector("html") == null) {
        await sleep(50);
    }
    const targetNode = document.querySelector("html");

    const observer = new MutationObserver(async (mutationsList, observer) => {
        const divs = document.querySelectorAll("div[class*=currentCrime___]");
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.className == 'crime-root burglary-root') {

                getBurgledPlaces();

                divs.forEach((div) => {
                    div.addEventListener("click", function (event) {
                        if (event.target.matches("div[class*=topSection___] div[class*=crimeBanner___] div[class*=crimeSliderArrowButtons___] button[class*=arrowButton___]")) {
                            observer.observe(targetNode, observerConfig);
                            noTargets = false;
                        }
                        if (event.target.matches("div[class*=crimeOptionGroup___]:not([class*=firstGroup___]) div.silmaril-crimes-burglary-sorting")) {
                            let sortName = event.target.getAttribute("data-sort-name");
                            let newSortBy = sortBy[sortName];
                            let newSortDirection = newSortBy === currentSortBy ? currentSortDirection * -1 : currentSortDirection;
                            sortChildElements(mutation.target, newSortBy, newSortDirection);
                            currentSortBy = newSortBy;
                            currentSortDirection = newSortDirection;
                            localStorage.setItem("silmaril-torn-crimes-burglary-sorting-by", newSortBy);
                            localStorage.setItem("silmaril-torn-crimes-burglary-sorting-direction", newSortDirection);
                        }
                    });
                });

                if (isSortingEnabled) {
                    addHeader(mutation.target);
                }

                if (noTargets) {
                    observer.disconnect();
                    break;
                }

                await addTimestamps();
                sortChildElements(mutation.target, currentSortBy, currentSortDirection);
                observer.disconnect();
                break;
            }
        }
    });

    observer.observe(targetNode, observerConfig);
    setInterval(applyBurgledStatus, 1000);

    function getBurgledPlaces() {
        const stats = document.querySelectorAll("button[class^=statistic___]");
        burgledPlaces = [...stats].map(button => button.querySelector("span[class*=label___]"))
            .filter(span => {
            if(!span) { return false; }
            const words = span.innerHTML.split(' ');
            if(words[words.length - 1] !== "burgled") { return false; }
            const target = span.innerHTML.replace(" burgled", "")
            return safetyAssessments.hasOwnProperty(target);
        }).map(span => {
            const target = span.innerHTML.replace(" burgled", "")
            return target;
        });
        if (burgledPlaces.find(x => x == 'Advertising Agency') != null) {
            burgledPlaces.push('Advertisement Agency', 'Ad Agency');
        }
        if (burgledPlaces.find(x => x == 'Cleaning Agency') != null) {
            burgledPlaces.push('Cleaning Firm');
        }
        if (burgledPlaces.find(x => x == 'Funeral Directors') != null) {
            burgledPlaces.push('Funeral Home');
        }
        if (burgledPlaces.find(x => x == 'Recruitment Agency') != null) {
            burgledPlaces.push('Recruit Agency', 'Temp Agency');
        }
        if (burgledPlaces.find(x => x == 'Self Storage Facility') != null) {
            burgledPlaces.push('Self Storage');
        }
        if (burgledPlaces.find(x => x == 'Dockside Warehouse') != null) {
            burgledPlaces.push('Docklands Farm');
        }
        if (burgledPlaces.find(x => x == 'Farm Storage Unit') != null) {
            burgledPlaces.push('Farm Storage', 'Storage Unit');
        }
    }

    function applyBurgledStatus(){
        try {
            const currentTargetsHeader = document.querySelectorAll("div.crime-root.burglary-root div[class^=crimeOptionGroup]");
            if (currentTargetsHeader.length == 0) {
                return;
            }
            const currentTargets = currentTargetsHeader[1].querySelectorAll("div.crime-option");
            [...currentTargets].forEach(line => {
                let targetName = line.getAttribute('data-target-name');
                let titleDiv;
                if (isMobileView) {
                    titleDiv = line.firstChild.childNodes[1].querySelector('div[class*=confidenceSectionTablet___] div[class*=titleAndProgress___] div[class*=title___]');
                } else {
                    titleDiv = line.querySelector('[class*=crimeOptionSection___][class*=flexGrow___]');
                };
                if(burgledPlaces.includes(targetName)) {
                    titleDiv.style.color = "var(--crimes-stats-successes-color)";
                } else {
                    titleDiv.style.color = "var(--crimes-stats-criticalFails-color)";
                };
            });
        } catch (e) {
            console.log('No burgle targets available to apply burgled status');
        }
    }

    // Function to sort child elements
    function sortChildElements(element, sortByProperty, sortDirection) {
        const parentElement = element.querySelector('[class*=crimeOptionGroup___]:not([class*=firstGroup___])');
        const childElements = Array.from(parentElement.querySelectorAll('[class*=crimeOption___]:not(.silmaril-crimes-burglary-header)'));

        if (isMobileView) {
            childElements.forEach((child) => {
                if (child.querySelector('div[class*=sections___] > div[class*=crimeOptionSection___] > div.safetyAssessment') === null) {
                    addSafetyAssessment(child);
                }
                let expireDiv = child.querySelector('div[class^="sections___"] > div[class^="crimeOptionSection___"] > div[class^="confidenceSectionTablet___"] div[class^="titleAndProgress___"] > div.expireTime') === null
                ? addExpireDiv(child)
                : child.querySelector('div[class^="sections___"] > div[class^="crimeOptionSection___"] > div[class^="confidenceSectionTablet___"] div[class^="titleAndProgress___"] > div.expireTime');
                expireDiv.innerText = child.getAttribute('data-expire-time') === null ? 'Expires in 3 d' : calculateTimeDelta(child.getAttribute('data-expire-time'), timeDeltas.After, isMobileView);
            });
        } else {
            childElements.forEach((child) => {
                let createdDiv = child.querySelector('div[class*=sections___] > div.createdTime') === null ? addCreatedAndExpireDivs(child) : child.querySelector('div[class*=sections___] > div.createdTime');
                let expireDiv = child.querySelector('div[class*=sections___] > div.expireTime');
                createdDiv.innerText = child.getAttribute('data-created-time') === null ? 'Just now' : calculateTimeDelta(child.getAttribute('data-created-time'), timeDeltas.Ago, isMobileView);
                expireDiv.innerText = child.getAttribute('data-expire-time') === null ? 'In 3 days' : calculateTimeDelta(child.getAttribute('data-expire-time'), timeDeltas.After, isMobileView);
                if (child.querySelector('div[class*=sections___] > div[class*=crimeOptionSection___] > div.safetyAssessment') === null) {
                    addSafetyAssessment(child);
                }
            });
        }

        if (isSortingEnabled) {
            // Sort properties based on the filter
            switch (sortByProperty){
                case sortBy.Target:
                    childElements.sort((a, b) => {
                        const aValue = a.querySelector('div[class*=sections___] > [class*=crimeOptionSection___]').textContent;
                        const bValue = b.querySelector('div[class*=sections___] > [class*=crimeOptionSection___]').textContent;
                        return aValue.localeCompare(bValue) * sortDirection;
                    });
                    break;
                case sortBy.CreationTime:
                    childElements.sort((a, b) => {
                        const aValue = a.getAttribute('data-created-time') ?? (Date.now()/1000).toFixed(0);
                        const bValue = b.getAttribute('data-created-time') ?? (Date.now()/1000).toFixed(0);
                        return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                    });
                    break;
                case sortBy.ExpirationTime:
                    childElements.sort((a, b) => {
                        const aValue = a.getAttribute('data-expire-time') ?? (Date.now()/1000 + 86400*3).toFixed(0);
                        const bValue = b.getAttribute('data-expire-time') ?? (Date.now()/1000 + 86400*3).toFixed(0);
                        return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                    });
                    break;
                case sortBy.Confidence:
                    if (isMobileView){
                        childElements.sort((a, b) => {
                            const aValue = a.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[0].querySelector('[class*=progressFill___]').style.width.slice(0, -1);
                            const bValue = b.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[0].querySelector('[class*=progressFill___]').style.width.slice(0, -1);
                            return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                        })
                    } else {
                        childElements.sort((a, b) => {
                            const aValue = a.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[3].querySelector('[class*=progressFill___]').style.height.slice(0, -1);
                            const bValue = b.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[3].querySelector('[class*=progressFill___]').style.height.slice(0, -1);
                            return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                        })
                    }
                    break;
                case sortBy.Status:
                    if (isMobileView){
                        childElements.sort((a, b) => {
                            const aValue = a.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[0].querySelector('[class*=safetyStatusIcon___]').style.backgroundPositionY.slice(0, -2);
                            const bValue = b.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[0].querySelector('[class*=safetyStatusIcon___]').style.backgroundPositionY.slice(0, -2);
                            return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                        })
                    } else {
                        childElements.sort((a, b) => {
                            const aValue = a.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[3].querySelector('[class*=safetyStatusIcon___]').style.backgroundPositionY.slice(0, -2);
                            const bValue = b.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___]')[3].querySelector('[class*=safetyStatusIcon___]').style.backgroundPositionY.slice(0, -2);
                            return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                        })
                    }
                    break;
                case sortBy.Risk:
                    childElements.sort((a, b) => {
                        const aValue = a.getAttribute('data-safety-level') ?? safetyLevels.Unknown;
                        const bValue = b.getAttribute('data-safety-level') ?? safetyLevels.Unknown;
                        return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                    });
                    break;
                case sortBy.HasUniques:
                    childElements.sort((a, b) => {
                        const aValue = a.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___][class*=commitButtonSection___] div[class*=uniqueStar___]').length;
                        const bValue = b.querySelectorAll('div[class*=sections___] > [class*=crimeOptionSection___][class*=commitButtonSection___] div[class*=uniqueStar___]').length;
                        return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * sortDirection;
                    });
                    break;
                default:
                    console.error("[TornCrimesBurglaryExtended] Unexpected sort values!", sortByProperty, sortDirection);
                    break;
            }
        }

        parentElement.append(...childElements);
    }

    function addExpireDiv(element) {
        const expireTimeDiv = document.createElement('div');
        expireTimeDiv.className = 'expireTime';
        const titleDiv = element.querySelector('div[class^="sections___"] > div[class^="crimeOptionSection___"] > div[class^="confidenceSectionTablet___"] div[class^="titleAndProgress___"] > div[class^="title___"]');
        titleDiv.parentNode.insertBefore(expireTimeDiv, titleDiv.nextSibling);
        return titleDiv.parentNode.querySelector('div.expireTime');
    }

    function addCreatedAndExpireDivs(element) {
        const createdTimeDiv = document.createElement('div');
        createdTimeDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ createdTime';
        const expireTimeDiv = document.createElement('div');
        expireTimeDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ expireTime';
        const innerDiv = element.querySelector('div[class*=sections___]');
        const targetDiv = innerDiv.querySelector('div[class*=crimeOptionSection___]');
        const tempDelimiter = delimiter.cloneNode();
        const tempDelimiter2 = delimiter.cloneNode();

        targetDiv.parentNode.insertBefore(tempDelimiter, targetDiv.nextSibling);
        tempDelimiter.parentNode.insertBefore(createdTimeDiv, tempDelimiter.nextSibling);
        createdTimeDiv.parentNode.insertBefore(tempDelimiter2, createdTimeDiv.nextSibling);
        tempDelimiter2.parentNode.insertBefore(expireTimeDiv, tempDelimiter2.nextSibling);
        expireTimeDiv.parentNode.insertBefore(delimiter.cloneNode(), expireTimeDiv.nextSibling);

        return innerDiv.querySelector('div.createdTime');
    }

    function addSafetyAssessment(element) {
        const titleCard = element.querySelector('[class*=crimeOptionSection___]');
        const targetName = titleCard.textContent;
        if (targetName === null) {
            return;
        }
        element.setAttribute('data-target-name', targetName);
        if (safetyAssessments[targetName] === undefined) {
            element.setAttribute('data-safety-level', safetyLevels['Not Found']);
            const safetyAssessmentDiv = document.createElement('div');
            safetyAssessmentDiv.className = "safetyAssessment NotFound";
            safetyAssessmentDiv.title = "Please, click on 'Not Found' to copy report into your clipboard & then send (paste) it right into chat to the script author Silmaril [2665762]";
            safetyAssessmentDiv.addEventListener('click', async function(){
                let report = `[Burglary] Target not found: ${targetName}, Mobile: ${isMobileView}`;
                isTampermonkeyEnabled ? GM_setClipboard(report, "text") : navigator.clipboard.writeText(report);
                this.textContent = "Copied!";
                await sleep(1500);
                this.textContent = "Not found";
            });
            const safetyText = document.createElement('div');
            safetyText.textContent = "Not found";
            safetyAssessmentDiv.appendChild(safetyText);
            titleCard.append(safetyAssessmentDiv);
        } else {
            element.setAttribute('data-safety-level', safetyLevels[safetyAssessments[targetName].safety]);
            const safetyAssessmentDiv = document.createElement('div');
            safetyAssessmentDiv.className = `safetyAssessment ${safetyAssessments[targetName].safety.replace(' ', '')}`;
            safetyAssessmentDiv.title = `<strong>Unique</strong>: ${safetyAssessments[targetName].unique}<br><strong>Finds</strong>: ${safetyAssessments[targetName].finds}<br><strong>Advice</strong>: ${safetyAssessments[targetName].advice}`;
            const casesText = document.createElement('div');
            casesText.textContent = safetyAssessments[targetName].cases;
            const safetyText = document.createElement('div');
            safetyText.textContent = safetyAssessments[targetName].safety;
            safetyAssessmentDiv.append(safetyText, casesText);
            titleCard.append(safetyAssessmentDiv);
        }
    }

    function addHeader(element) {
        if (element.querySelector('[class*=crimeOptionGroup___]:not([class*=firstGroup___]) > .silmaril-crimes-burglary-header') !== null) {
            return;
        }

        const parentElement = element.querySelector('[class*=crimeOptionGroup___]:not([class*=firstGroup___])');

        if (parentElement === null) {
            return;
        }

        let headerOuterDiv = document.createElement('div');
        headerOuterDiv.className = 'crimeOption___LP90y crime___tIT_g silmaril-crimes-burglary-header';

        let headerInnerDiv = document.createElement('div');
        headerInnerDiv.className = 'sections___tZPkg';

        let sortByDiv = document.createElement('div');
        sortByDiv.className = 'crimeOptionImage___o2cmT';
        sortByDiv.textContent = 'Sort by';

        let targetDiv = document.createElement('div');
        targetDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ silmaril-crimes-burglary-sorting silmaril-crimes-burglary-sorting-target';
        targetDiv.setAttribute('data-sort-name', 'Target');
        targetDiv.textContent = 'Target ⇧⇩';

        headerInnerDiv.append(sortByDiv, targetDiv, delimiter.cloneNode());

        let createdTimeDiv = document.createElement('div');
        createdTimeDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ silmaril-crimes-burglary-sorting silmaril-crimes-burglary-sorting-created';
        createdTimeDiv.setAttribute('data-sort-name', 'CreationTime');
        createdTimeDiv.textContent = 'Created ⇧⇩';

        headerInnerDiv.append(createdTimeDiv, delimiter.cloneNode());

        let expireTimeDiv = document.createElement('div');
        expireTimeDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ silmaril-crimes-burglary-sorting silmaril-crimes-burglary-sorting-expire';
        expireTimeDiv.setAttribute('data-sort-name', 'ExpirationTime');
        expireTimeDiv.textContent = 'Expires ⇧⇩';

        headerInnerDiv.append(expireTimeDiv, delimiter.cloneNode());

        let confidenceDiv = document.createElement('div');
        confidenceDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ silmaril-crimes-burglary-sorting silmaril-crimes-burglary-sorting-confidence';
        confidenceDiv.setAttribute('data-sort-name', 'Confidence');
        confidenceDiv.textContent = 'Confidence ⇧⇩';

        headerInnerDiv.append(confidenceDiv, delimiter.cloneNode());

        let riskDiv = document.createElement('div');
        riskDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ silmaril-crimes-burglary-sorting silmaril-crimes-burglary-sorting-risk';
        riskDiv.setAttribute('data-sort-name', 'Risk');
        riskDiv.textContent = 'Risk ⇧⇩';

        headerInnerDiv.append(riskDiv, delimiter.cloneNode());

        let hasUniquesDiv = document.createElement('div');
        hasUniquesDiv.className = 'crimeOptionSection___hslpu flexGrow___S5IUQ silmaril-crimes-burglary-sorting silmaril-crimes-burglary-sorting-has-uniques';
        hasUniquesDiv.setAttribute('data-sort-name', 'HasUniques');
        hasUniquesDiv.textContent = 'Uniques ⇧⇩';

        headerInnerDiv.append(hasUniquesDiv, delimiter.cloneNode());

        headerOuterDiv.appendChild(headerInnerDiv);
        parentElement.appendChild(headerOuterDiv);
    }

    async function addTimestamps() {
        while (Object.keys(targets).length == 0){
            await sleep(50);
        }

        const parentElement = document.querySelector('[class*=crimeOptionGroup___]:not([class*=firstGroup___])');
        const childElements = Array.from(parentElement.querySelectorAll('[class*=crimeOption___]:not(.silmaril-crimes-burglary-header)'));

        childElements.forEach((element, index) => {
            element.setAttribute('data-created-time', targets[index].created);
            element.setAttribute('data-expire-time', targets[index].expire);
        });
    }

    function calculateTimeDelta(timestamp, timeDeltaType, mobile) {
        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        let timeDelta = timestamp - now; // Time remaining in seconds

        if (timeDeltaType === timeDeltas.After && timeDelta <= 0) {
            return "Expired";
        }
        if (timeDeltaType === timeDeltas.Ago) {
            timeDelta = Math.abs(timeDelta);
            if (timeDelta <= 0) {
                return "Just now";
            }
        }

        const days = Math.floor(timeDelta / 86400); // 86400 seconds in a day
        const hours = Math.floor((timeDelta % 86400) / 3600); // 3600 seconds in an hour
        const minutes = Math.floor((timeDelta % 3600) / 60); // 60 seconds in a minute
        const seconds = timeDelta % 60;

        let timeElementsAdded = 0;
        let timeDeltaText = mobile ? timeDeltaType === timeDeltas.After ? "Expires in " : "Created " : timeDeltaType === timeDeltas.After ? "In " : "";
        if (days != 0 && timeElementsAdded < timeElementsToShow) {
            timeDeltaText += mobile ? `${days} d` : `${days} day${days === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (hours != 0 && timeElementsAdded < timeElementsToShow) {
            if (days !== 0){
                timeDeltaText += ', ';
            }
            timeDeltaText += mobile ? `${hours} h` : `${hours} hour${hours === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (minutes != 0 && timeElementsAdded < timeElementsToShow) {
            if (days !== 0 || hours !== 0){
                timeDeltaText += ', ';
            }
            timeDeltaText += mobile ? `${minutes} m` : `${minutes} minute${minutes === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (seconds != 0 && timeElementsAdded < timeElementsToShow) {
            if (days !== 0 || hours !== 0 || minutes !== 0){
                timeDeltaText += ', ';
            }
            timeDeltaText += mobile ? `${seconds} s` : `${seconds} second${seconds === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (timeDeltaType === timeDeltas.Ago) {
            timeDeltaText += ' ago';
        }

        return timeDeltaText;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function addStyle() {
        const styles = `
[class*=abandonButtonWrapper___] {
  display: block !important;
}

div.silmaril-crimes-burglary-header > div[class*=sections___] {
  height: 25px;
}

div.burglary-root div[class*=crimeOptionSection___][class*=flexGrow___] {
  width: -webkit-fill-available;
  width: -moz-available;
}

div.createdTime, div.expireTime {
  font-size: smaller;
}

div.safetyAssessmentSiblingButtons {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-column-gap: 0.3125rem;
  -moz-column-gap: .3125rem;
  column-gap: 0.3125rem;
}

div.burglary-root div[class*=crimeOptionSection___][class*=flexGrow___] {
  flex-wrap: wrap;
}

div.safetyAssessment {
  width: 125px;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  font-size: smaller;
  padding-left: 3px;
  padding-right: 5px;
}

body:not(.dark-mode) div.safetyAssessment {
  color: white;
}

body.dark-mode div.safetyAssessment {
  color: black;
}

div.safetyAssessment.Safe {
  background-color: #37b24d;
}

div.safetyAssessment.ModeratelyUnsafe {
  background-color: #74b816;
}

div.safetyAssessment.Unsafe {
  background-color: #f59f00;
}

div.safetyAssessment.Risky {
  background-color: #f76707;
}

div.safetyAssessment.Dangerous {
  background-color: #f03e3e;
}

div.safetyAssessment.VeryDangerous {
  background-color: #7048e8;
}

div.safetyAssessment.Unknown {
  background-color: #1c7cd6;
}

div.safetyAssessment.NotFound {
  background-color: gray;
  cursor: pointer;
}

div.silmaril-crimes-burglary-header > div[class*=sections___] > div.silmaril-crimes-burglary-sorting {
  cursor: pointer;
}

div.silmaril-crimes-burglary-header > div[class*=sections___] > div[class*=crimeOptionImage___] {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 25px;
}

div.silmaril-crimes-burglary-sorting-risk {
  width: 34px;
}

div.silmaril-crimes-burglary-sorting-has-uniques {
  width: 34px;
}

@media only screen and (max-width: 784px) {
  div.burglary-root div.createdTime {
    display: none;
  }

  div.burglary-root div.expireTime {
    font-size: x-small;
  }

  div.silmaril-crimes-burglary-sorting {
    text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
  }

  div.silmaril-crimes-burglary-sorting-created {
    display: none;
  }
}
`;

        if (isTampermonkeyEnabled){
            GM_addStyle(styles);
        } else {
            let style = document.createElement("style");
            style.type = "text/css";
            style.innerHTML = styles;
            while (document.head == null){
                await sleep(50);
            }
            document.head.appendChild(style);
        }
    }
})();