// ==UserScript==
// @name         [GC][Backup] - Dailies Preferences Wizard
// @namespace    https://www.grundos.cafe/
// @version      1.0.5
// @license MIT
// @description  Set preferences including redirects for dailies with expanded functionality.
// @match        https://www.grundos.cafe/*
// @require      https://update.greasyfork.org/scripts/514423/1554918/GC%20-%20Universal%20Userscripts%20Settings.js
// @grant        GM.getValue
// @grant        GM.setValue
//

// @downloadURL https://update.greasyfork.org/scripts/547290/%5BGC%5D%5BBackup%5D%20-%20Dailies%20Preferences%20Wizard.user.js
// @updateURL https://update.greasyfork.org/scripts/547290/%5BGC%5D%5BBackup%5D%20-%20Dailies%20Preferences%20Wizard.meta.js
// ==/UserScript==

// *** NOTE *** NOTE *** NOTE ***
//
//
// SETTINGS: You can set the values for dailies at https://www.grundos.cafe/help/userscripts/
//
//

(function() {
    'use strict';

    const BASE_URL = "https://www.grundos.cafe";
    const REDIRECT_CATEGORY = "Dailies Preferences Wizard";

    const CONFIG = {
        PAGE_PATTERNS: {
            SETTINGS: '/help/userscripts/',
            BURIED_TREASURE: '/pirates/buriedtreasure/play/',
            WISHING_WELL: '/wishing/',
            GARDEN: '/garden/',
            FISHING: '/water/fishing/',
            SYMOL_HOLE: '/medieval/symolhole/',
            STOCKS: '/stocks/?view_all=True',
            TOMBOLA: '/island/tombola/',
            GUESS_THE_WEIGHT: '/guessmarrow/',
            TREASURE_HOME: '/pirates/buriedtreasure/',
            LOTTERY: '/games/lottery/',
            BANK: '/bank/',
            TURMACULUS: '/medieval/turmaculus/',
            SPOOKY_TOILET: '/halloween/toilet/',
            GIANT_OMELETTE: '/prehistoric/plateau/omelette/',
            CELEBRATION_CALENDAR: '/winter/celebrationcalendar/',
            DEADLY_DICE: '/worlds/roo/deadlydice/',
            STRENGTH_TEST: '/halloween/strtest/',
            KNOWLEDGE_WHEEL: '/medieval/brightvale/wheel/',
            EXCITEMENT_WHEEL: '/faerieland/wheel/',
            MISFORTUNE_WHEEL: '/halloween/wheel/',
            MEDIOCRITY_WHEEL: '/prehistoric/wheel/',
            TIKI_TOUR: '/island/tikitours/',
            HEALING_SPRINGS: '/faerieland/springs/',
            MERRY_GO_ROUND: '/roo/merrygoround/',
            GREEN_JELLY: '/jelly/greenjelly/',
            FRUIT_MACHINE: '/desert/fruitmachine/',
            GRUMPY_KING: '/medieval/grumpyoldking/',
            WISE_KING: '/medieval/wiseking/',
            COLTZANS_SHRINE: '/desert/shrine/',
            WINTER_KIOSK: '/winter/kiosk/',
            DESERTED_KIOSK: '/halloween/kiosk/',
            DESERT_KIOSK: '/desert/kiosk/',
            NEOSCHOOL_COURSE: '/neoschool/course/'
        },

        REDIRECT_RULES: [
            { urlPattern: '/games/stockmarket/stocks/', redirectUrl: '/games/stockmarket/stocks/?view_all=True' },
            { urlPattern: '/jelly/jelly/', redirectUrl: '/jelly/take_jelly/' },
            { urlPattern: '/faerieland/tdmbgpop/', redirectUrl: '/faerieland/tdmbgpop/visit/' },
            { urlPattern: '/neoschool/courses/', redirectUrl: '/neoschool/course/' },
            { urlPattern: '/winter/snowager/', redirectUrl: '/winter/snowager/approach/' },
            { urlPattern: '/medieval/symolhole/', petParam: 'turmyPetpet' },
            { urlPattern: '/medieval/turmaculus/', petParam: 'turmyPetpet' },
            { urlPattern: '/faerieland/springs/', petParam: 'questPet' },
            { urlPattern: '/island/kitchen/', petParam: 'questPet' },
            { urlPattern: '/faerieland/quests/', petParam: 'questPet' },
            { urlPattern: '/desert/shrine/', petParam: 'questPet' },
            { urlPattern: '/halloween/toilet/', petParam: 'spookyPetpet' },
            { urlPattern: '/winter/kiosk/', petParam: 'scratchcardPet' },
            { urlPattern: '/halloween/kiosk/', petParam: 'scratchcardPet' },
            { urlPattern: '/medieval/brightvale/wheel/', petParam: 'knowledgePet' },
            { urlPattern: '/faerieland/wheel/', petParam: 'excitementPet' },
            { urlPattern: '/prehistoric/wheel/', petParam: 'mediocrePet' },
            { urlPattern: '/halloween/wheel/', petParam: 'misfortunePet' },
            { urlPattern: '/jelly/greenjelly/', petParam: 'jellyPet' },
            { urlPattern: '/faerieland/employ/', petParam: 'jobPet' }
        ],

        PET_PARAMS: [
            { name: 'mainPet', label: 'Primary Pet', tooltip: 'Your primary pet for site-wide browsing. Susceptible to color-changing REs if you do not use shield tokens.' },
            { name: 'turmyPetpet', label: 'Turmaculus Pet', tooltip: 'Turmaculus can eat your petpet. Choose the name of a pet whose default petpet is "safe" to eat.' },
            { name: 'questPet', label: 'Quest Pet', tooltip: 'Quests can issue stat increases.' },
            { name: 'spookyPetpet', label: 'Spooky Pet', tooltip: 'Pet with a spooky petpet set as default. Petpet happiness will decrease.' },
            { name: 'scratchcardPet', label: 'Scratchcard Pet', tooltip: 'Winter and Haunted scratchcards can raise your active pet level.' },
            { name: 'knowledgePet', label: 'Wheel of Knowledge Pet', tooltip: 'Wheel of Knowledge can make your active pet gain intelligence.' },
            { name: 'misfortunePet', label: 'Wheel of Misfortune Pet', tooltip: 'Wheel of Misfortune can make your active pet forget a book it has read.' },
            { name: 'excitementPet', label: 'Wheel of Excitement Pet', tooltip: 'Wheel of Excitement can make your active pet lose levels.' },
            { name: 'mediocrePet', label: 'Wheel of Mediocrity Pet', tooltip: 'Wheel of Mediocrity can make your active pet gain levels.' },
            { name: 'healPet', label: 'Healing Springs Pet', tooltip: 'Healing Springs can sometimes only heal your active pet.' },
            { name: 'coltzanPet', label: 'Coltzans Shrine Pet', tooltip: 'Coltzans Shrine can raise any stat point.' },
            { name: 'jellyPet', label: 'Jelly Pet', tooltip: 'Giant Green Jelly has a chance of turning your active pet Jelly.' },
            { name: 'jobPet', label: 'Employed Pet', tooltip: 'Which pet deserves credit for completed jobs?' },
            { name: 'marrowWeight', label: 'Marrow Weight Guess', tooltip: 'What do you want to autofill for the marrow weight? 300-700 is valid.' },
            { name: 'treasureX', label: 'Buried Treasure X', tooltip: 'Pick a number 1-473 to speed up your Buried Treasure visits.' },
            { name: 'treasureY', label: 'Buried Treasure Y', tooltip: 'Pick a number 1-473 to speed up your Buried Treasure visits.' }
        ],

        WISH_PARAMS: [
            { name: 'firstWish', label: 'Primary Wish', tooltip: 'Your primary wish item.' },
            { name: 'secondWish', label: 'Secondary Wish', tooltip: 'Your secondary wish item if the primary was won recently.' },
            { name: 'thirdWish', label: 'Tertiary Wish', tooltip: 'Your backup wish item if both primary and secondary were won recently.' },
            { name: 'defaultDonation', label: 'Default Donation', tooltip: 'Default NP amount to donate (must be at least 21 NP).' }
        ],

        GARDEN_BUTTONS: [
            { selector: 'input[name="pick"].form-control.half-width', key: 'p', label: 'Press "p" or click here to pick!' },
            { selector: 'input[name="tend"].form-control.half-width', key: 't', label: 'Press "t" to tend the garden.' },
            { selector: 'input[type="button"].form-control.half-width', key: 'd', label: 'Press "d" to donate to Bert.' },
            { selector: 'input[value="Check Next Guild Garden"].form-control', key: 'n', label: 'Press "n" to visit next.' }
        ]
    };

    const STYLES = {
        WISHING_WELL: ``
};

    const Utils = {
        isCurrentPage: (pattern) => {
            if (Array.isArray(pattern)) {
                return pattern.some(p => window.location.href.endsWith(p));
            }
            return window.location.href.endsWith(pattern) || window.location.href.includes(pattern);
        },

        addEnterKeyHandler: (selector, callback = null) => {
            const element = document.querySelector(selector);
            if (!element) return false;

            document.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    if (callback) {
                        callback(element);
                    } else {
                        element.click();
                    }
                }
            });
            return true;
        },

        createElement: (tag, attributes = {}, styles = {}) => {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'textContent') {
                    element.textContent = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            Object.entries(styles).forEach(([key, value]) => {
                element.style[key] = value;
            });
            return element;
        },

        getRandomOption: (selectEl) => {
            if (!selectEl) return null;
            const options = Array.from(selectEl.options).filter(opt => !opt.disabled);
            if (options.length === 0) return null;
            return options[Math.floor(Math.random() * options.length)];
        },

        injectStyles: function(styles) {
            const styleEl = document.createElement('style');
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
            return styleEl;
        }
    };

    const PageHandlers = {
        setupSettings: async function() {
            await Promise.all([
                addCheckboxInput({
                    categoryName: REDIRECT_CATEGORY,
                    settingName: 'redirectEnabled',
                    labelText: 'Enable Redirects',
                    labelTooltip: 'When enabled, links will redirect according to your preferences.',
                    defaultSetting: false
                }),
                ...CONFIG.PET_PARAMS.map(pet =>
                    addTextInput({
                        categoryName: REDIRECT_CATEGORY,
                        settingName: pet.name,
                        labelText: pet.label,
                        labelTooltip: pet.tooltip,
                        defaultSetting: ''
                    })
                ),
                ...CONFIG.WISH_PARAMS.map(wish => {
                    if (wish.name === 'defaultDonation') {
                        return addNumberInput({
                            categoryName: 'Wishing Well',
                            settingName: wish.name,
                            labelText: wish.label,
                            labelTooltip: wish.tooltip,
                            min: 21,
                            defaultSetting: 21
                        });
                    }
                    return addTextInput({
                        categoryName: 'Wishing Well', 
                        settingName: wish.name,
                        labelText: wish.label,
                        labelTooltip: wish.tooltip,
                        defaultSetting: ''
                    });
                })
            ]);
        },

        setupBuriedTreasure: async function() {
            const treasureX = await GM.getValue('treasureX', 236);
            const treasureY = await GM.getValue('treasureY', 236);

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const imageInput = document.querySelector('input[type="image"]');
                    if (imageInput) {
                        imageInput.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            clientX: parseInt(treasureX, 10),
                            clientY: parseInt(treasureY, 10)
                        }));
                    }
                }
            });
        },

setupGarden: function() {
    const handleKeyDown = function(event) {
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            const keyToSelector = {
                'p': 'input[name="pick"].form-control.half-width',
                't': 'input[name="tend"].form-control.half-width',
                'd': 'input[type="button"].form-control.half-width',
                'n': 'input[type="button"]:not([name="pick"]):not([name="tend"]):not([value="Give Bert Supplies"])'            };

            if (keyToSelector[event.key]) {
                const button = document.querySelector(keyToSelector[event.key]);
                if (button) button.click();
            }
        }
    };

    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);

    CONFIG.GARDEN_BUTTONS.forEach(config => {
        const button = document.querySelector(config.selector);
        if (button) button.value = config.label;
    });

    const gardenMsg = document.querySelectorAll('main i')[1];
    if (!gardenMsg) return;

    const countText = document.querySelector('#page_content p.center')?.textContent || '';
    const countMatch = countText.replace(/,/g, '').match(/\d+/);
    const gardenCount = countMatch ? parseInt(countMatch[0], 10) : 0;

    const messageDiv = Utils.createElement('div', {
        textContent: gardenCount < 1000
            ? "Oh no! This garden needs more inventory to be able to award you the highest tier of prizes. Consider donating supplies before picking!"
            : "This garden is doing great, but don't forget - in order to give as much as you take, you should donate at least 300 points per month! 🍃"
    }, {
        color: gardenCount < 1000 ? "#f45957" : "#538bf9",
        fontSize: gardenCount < 1000 ? "18px" : "14px",
        marginTop: "10px",
        fontWeight: "bold",
        textAlign: "center"
    });

    gardenMsg.parentNode.insertBefore(messageDiv, gardenMsg);
    gardenMsg.remove();
},

        setupFishing: function() {
            const paragraphs = document.querySelectorAll('main p');
            if (paragraphs.length < 3) return;

            const getCost = paragraphs[2].textContent;
            const buttonSelector = getCost === "You can also choose to send all of your eligible pets fishing at the same time for FREE!!"
                ? 'input[type="submit"][value="Fish with Everyone!"]'
                : 'input[type="submit"][value="Reel in Your Line"]';

            Utils.addEnterKeyHandler(buttonSelector);
        },

        setupSymolHole: function() {
            const hole = document.getElementById("waiting");

            if (!hole) {
                const selectEl = document.getElementById("enter_action");
                const option = Utils.getRandomOption(selectEl);
                if (option) {
                    option.selected = true;
                    const submitBtn = document.querySelector('input[type="submit"][name="enter"]');
                    if (submitBtn) {
                        submitBtn.value = "Press Enter or click here to enter!";
                        Utils.addEnterKeyHandler('input[type="submit"][name="enter"]');
                    }
                }
            } else {
                hole.style.display = "none";
                const waitForMe = document.getElementById("wait-for-me");
                if (waitForMe) waitForMe.style.display = "block";
            }
        },

        setupStocks: function() {
            const table = document.querySelector('.stock-table');
            if (!table) return;

            const rows = Array.from(table.querySelectorAll('tr'));
            const curr15Rows = rows.filter(row => {
                const cells = row.querySelectorAll('td');
                return cells.length >= 6 && cells[5].textContent.trim() === "15";
            });

            if (curr15Rows.length === 0) {
                table.parentNode.insertBefore(
                    Utils.createElement('div', {
                        textContent: "😭 There are no buyable stocks at this time."
                    }, {
                        fontSize: '24px',
                        textAlign: 'center'
                    }),
                    table
                );
            } else {
                curr15Rows.forEach(row => {
                    row.parentNode.removeChild(row);
                    table.insertBefore(row, table.firstChild);
                    Array.from(row.querySelectorAll('td')).forEach(cell => {
                        cell.style.backgroundColor = 'yellow';
                    });
                });
            }
        },

        enhanceSubmitButton: function(selector, text) {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.value = text || "Press Enter or click here!";
                Utils.addEnterKeyHandler(selector);
            }
            return btn;
        },

        setupTombola: function() {
            const btn = document.querySelector('main input[type="submit"].form-control');
            if (btn) {
                btn.value = "Press Enter or click here to play!";
                Utils.addEnterKeyHandler('main input[type="submit"].form-control');
nd             }
        },

        setupTreasureHome: function() {
            const btn = document.querySelector('main input[type="submit"]');
            if (btn) {
                btn.value = "Press Enter or click here to dig!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            }
        },

        setupLottery: function() {
            const btn = document.querySelector('main input[type="submit"][value="Quick Pick!"]');
            if (btn) {
                btn.value = "Press Enter or click here to buy all!";
                Utils.addEnterKeyHandler('main input[type="submit"][value="Press Enter or click here to buy all!"]');
            }
        },

        setupBank: function() {
            const btn = document.querySelector('input[type="submit"].form-control.half-width');
            if (btn && btn.value.includes("Collect Interest")) {
                btn.value = "Click/Enter to " + btn.value;
                Utils.addEnterKeyHandler('input[type="submit"].form-control.half-width');
            }
        },

        setupTurmaculus: function() {
            // Select random option from dropdown
            const option = Utils.getRandomOption(document.getElementById("wakeup"));
            if (option) option.selected = true;

            // Setup enter key handler for the Wake Up button
            const wakeButton = document.querySelector('input[type="submit"][name="wake"]');
            if (wakeButton) {
                wakeButton.value = "Press Enter or click here to wake!";
                Utils.addEnterKeyHandler('input[type="submit"][name="wake"]');
            }
        },

        setupSpookyToilet: function() {
            const btn = document.querySelector('main input[type="submit"].form-control');
            if (btn) {
                btn.value = "Press Enter or click here to jump!";
                Utils.addEnterKeyHandler('main input[type="submit"].form-control');
            }        },

        setupGiantOmelette: function() {
            const btn = document.querySelector('main input[type="submit"].form-control');
            if (btn) {
                btn.value = "Press Enter or click here to grab some!";
                Utils.addEnterKeyHandler('main input[type="submit"].form-control');
            }
        },

        setupCelebrationCalendar: function() {
            this.enhanceSubmitButton('input[type="submit"].form-control.half-width',
                "Press Enter or click here to redeem!");
        },

        setupDeadlyDice: function() {
            const btn = document.querySelector('button[type="submit"].form-control');
            if (btn) {
                btn.textContent = "Press Enter or click here to play!";
                Utils.addEnterKeyHandler('button[type="submit"].form-control');
            }
        },

        setupColtzansShrine: function() {
            const btn = document.querySelector('main input[type="submit"]');
            if (btn) {
                btn.value = "Press Enter or click here to visit!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            }
        },

        setupStrengthTest: function() {
            const strPrize = document.querySelector('#modal-body > div > p:nth-child(3)');
            if (strPrize && strPrize.textContent.trim() !== "") {
                const gameContainer = document.getElementById('game-container');
                if (gameContainer) {
                    gameContainer.prepend(Utils.createElement('div', {
                        textContent: strPrize.textContent.trim()
                    }, {
                        color: '#ff9900',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }));
                }
            }
        },

        setupKnowledgeWheel: function() {
            const submitButton = document.querySelector('input[type="submit"].form-control.half-width');

            if (submitButton) {
                submitButton.value = "Press Enter or click here to spin!";
                Utils.addEnterKeyHandler('input[type="submit"].form-control.half-width');
            } else {
                const spinning = document.getElementById("spinning");
                const prizeContainer = document.getElementById("prize-container");
                if (spinning) spinning.style.display = "none";
                if (prizeContainer) prizeContainer.style.display = "block";
            }
        },

        setupExcitementWheel: function() {
            const submitButton = document.querySelector('main input[type="submit"]');

            if (submitButton) {
                submitButton.value = "Press Enter or click here to spin!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            } else {
                const spinning = document.getElementById("spinning");
                const prizeContainer = document.getElementById("prize-container");
                if (spinning) spinning.style.display = "none";
                if (prizeContainer) prizeContainer.style.display = "block";
            }
        },

        setupMisfortuneWheel: function() {
            const submitButton = document.querySelector('main input[type="submit"]');

            if (submitButton) {
                submitButton.value = "Press Enter or click here to spin!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            } else {
                const spinning = document.getElementById("spinning");
                const prizeContainer = document.getElementById("prize-container");
                if (spinning) spinning.style.display = "none";
                if (prizeContainer) prizeContainer.style.display = "block";
            }
        },


        setupMediocrityWheel: function() {
            const submitButton = document.querySelector('main input[type="submit"]');

            if (submitButton) {
                submitButton.value = "Press Enter or click here to spin!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            } else {
                const spinning = document.getElementById("spinning");
                const prizeContainer = document.getElementById("prize-container");
                if (spinning) spinning.style.display = "none";
                if (prizeContainer) prizeContainer.style.display = "block";
            }
        },

        setupTikiTour: function() {
            const petCount = (document.querySelectorAll('.userLookupPet').length * 1000).toLocaleString();
            const tourAll = document.querySelector("button[name='all_pets']");

            if (tourAll) {
                tourAll.onclick = function() {
                    return confirm(`Do you really want to spend ${petCount} NP to take all of your pets on tour?`);
                };
            }
        },

        setupHealingSprings: function() {
            const btn = document.querySelector('main input[type="submit"]');
            if (btn) {
                btn.value = "Press Enter or click here to visit!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            }
        },

        setupMerryGoRound: function() {
            const sadPets = document.querySelectorAll('.mgr__pet .med-image[src*="sad"]');
            const sadPetCount = sadPets.length;

            if (sadPetCount > 0) {
                const totalCost = 50 + 100 * (sadPetCount - 1);
                const totalVisits = Math.ceil(sadPetCount / 6);
                const userPetList = document.getElementById('userPetList');

                if (userPetList) {
                    const costDetails = Utils.createElement('div', {}, { marginBottom: "40px" });
                    costDetails.innerHTML = `<h3>${sadPetCount} pets can be cheered up for ${totalCost} NP.</h3> <p>Cheering up everyone will take ${totalVisits} rides.</p> <strong>Press enter to start the ride!</strong>`;
                    userPetList.parentNode.insertBefore(costDetails, userPetList);
                }
            }
            const btn = document.querySelector('main input[type="submit"]');
            if (btn) {
                btn.value = "Press Enter or click here to ride!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            }
        },

        setupGreenJelly: function() {
            const btn = document.querySelector('main input[type="submit"].form-control');
            if (btn) {
                btn.value = "Press Enter or click here to go!";
                Utils.addEnterKeyHandler('main input[type="submit"].form-control');
            }        },

        setupFruitMachine: function() {
            const btn = document.querySelector('main input[type="submit"].form-control');
            if (btn) {
                btn.value = "Press Enter or click here to spin!";
                Utils.addEnterKeyHandler('main input[type="submit"].form-control');
            }
        },

        setupGrumpyKing: function() {
            const submitButton = document.querySelector('input[type="submit"][name="joke"]');
            const againButton = document.querySelector('input[type="button"][value="Try Again?"]');

            if (againButton) {
                againButton.value = "Press Enter or click to tell another!";
                document.addEventListener("keydown", function(event) {
                    if (event.key === "Enter") againButton.click();
                });
            } else if (submitButton) {
                // Fill dropdowns randomly
                for (let i = 1; i <= 8; i++) {
                    const option = Utils.getRandomOption(document.getElementById("answer" + i));
                    if (option) option.selected = true;
                }

                // Fill joke fields for avatar solutions
                const jokeFields = {
                    "question1": "What",
                    "question2": "do",
                    "question3": "you do if",
                    "question4": "*Leave blank*",
                    "question5": "fierce",
                    "question6": "Grundos",
                    "question7": "*Leave blank*",
                    "question8": "has eaten too much",
                    "question9": "*Leave blank*",
                    "question10": "tin of olives"
                };

                Object.entries(jokeFields).forEach(([id, value]) => {
                    document.getElementById(id).value = value;
                });

                submitButton.value = "Press Enter or click here to joke!";
                document.addEventListener("keydown", function(event) {
                    if (event.key === "Enter") submitButton.click();
                });
            }
        },

        setupWiseKing: function() {
            // Random values for wisdom dropdowns
            [1, 3, 4, 5, 7].forEach(num => {
                const option = Utils.getRandomOption(document.getElementById("wisdom" + num));
                if (option) option.selected = true;
            });

            // Fixed values
            document.getElementById("wisdom2").value = "pride";
            document.getElementById("wisdom6").value = "nugget";

            const btn = document.querySelector('main input[type="submit"].form-control');
            if (btn) {
                btn.value = "Press Enter or click here to joke!";
                Utils.addEnterKeyHandler('main input[type="submit"].form-control');
            }
        },

setupWinterKiosk: function() {
            const buyButton = document.querySelector('main button[type="submit"]');
            const scratchButton = document.querySelector('input.form-control.half-width, #page_content > main > form > input.form-control');

            if (buyButton) {
                buyButton.textContent = 'Press "b" or click to buy a scratchcard.';
                document.addEventListener("keydown", (event) => {
                    if (event.key === "b") buyButton.click();
                });
            }

            if (scratchButton) {
                const selectCard = document.querySelector('select[name="card"]');
                const option = Utils.getRandomOption(selectCard);
                if (option) option.selected = true;

                scratchButton.value = 'Press "s" or click to begin scratching.';
                document.addEventListener("keydown", (event) => {
                    if (event.key === "s") scratchButton.click();
                });
            }
        },

        setupDesertedKiosk: function() {
            const buyButton = document.querySelector("#page_content > main > form > button");
            const scratchButton = document.querySelector('input.form-control.half-width, #page_content > main > form > input.form-control');

            if (buyButton) {
                buyButton.textContent = 'Press "b" or click to buy a scratchcard.';
                document.addEventListener("keydown", (event) => {
                    if (event.key === "b") buyButton.click();
                });
            }

            if (scratchButton) {
                const selectCard = document.querySelector('select[name="card"]');
                const option = Utils.getRandomOption(selectCard);
                if (option) option.selected = true;

                scratchButton.value = 'Press "s" or click to begin scratching.';
                document.addEventListener("keydown", (event) => {
                    if (event.key === "s") scratchButton.click();
                });
            }
        },

        setupDesertKiosk: function() {
            const buyButton = document.querySelector("#page_content > main > form > button");
            const scratchButton = document.querySelector('input.form-control.half-width, #page_content > main > form > input.form-control');

            if (buyButton) {
                buyButton.textContent = 'Press "b" or click to buy a scratchcard.';
                document.addEventListener("keydown", (event) => {
                    if (event.key === "b") buyButton.click();
                });
            }

            if (scratchButton) {
                const selectCard = document.querySelector('select[name="card"]');
                const option = Utils.getRandomOption(selectCard);
                if (option) option.selected = true;

                scratchButton.value = 'Press "s" or click to begin scratching.';
                document.addEventListener("keydown", (event) => {
                    if (event.key === "s") scratchButton.click();
                });
            }
        },

        setupNeoschoolCourse: function() {
            const error = document.querySelector(".errorpage");
            if (error) window.location.replace("/neoschool/courses/");
        },

        setupGuessTheWeight: async function() {
            // Get the stored marrow weight value
            const marrowWeight = await GM.getValue('marrowWeight', '');

            // Find the guess input field and submit button
            const guessInput = document.querySelector('input[name="weight"]');
            const guessButton = document.querySelector('main input[type="submit"]');
            
            // Set the value and add enter key handler
            if (guessInput && marrowWeight) guessInput.value = marrowWeight;
            if (guessButton) {
                guessButton.value = "Press Enter or click here to guess!";
                Utils.addEnterKeyHandler('main input[type="submit"]');
            }
        },

        setupWishingWell: async function() {
            // Inject custom styles
            Utils.injectStyles(STYLES.WISHING_WELL);

            // Get recent winners from the table
            const winnerTable = document.querySelectorAll("table > tbody > tr td.bg-liteyellow.center");
            const recentWishes = [];
            
            winnerTable.forEach((element, index) => {
                if (index % 3 === 2 && recentWishes.length < 14) {
                    recentWishes.push(element.textContent.trim());
                }
            });

            // Check if special condition (all three wands) is met
            if (recentWishes.includes("Golden Aisha Wand") &&
                recentWishes.includes("Rainbow Cybunny Wand") &&
                recentWishes.includes("Starry Scorchio Wand")) {
                recentWishes.push("Relic");
            }

            // Get stored wishes and donation amount
            const wishList = {
                firstWish: await GM.getValue('firstWish', ''),
                secondWish: await GM.getValue('secondWish', ''),
                thirdWish: await GM.getValue('thirdWish', '')
            };
            const donationAmount = await GM.getValue('defaultDonation', '21');

            // Find first available wish that hasn't been won recently
            let defaultWish = '';
            for (const [key, wish] of Object.entries(wishList)) {
                if (!wish) {
                    defaultWish = '';
                    break;
                }
                const wishLowerCase = wish.toLowerCase();
                if (!recentWishes.some(recentWish => recentWish.toLowerCase() === wishLowerCase)) {
                    defaultWish = wish;
                    break;
                }
            }

            // Set the values
            const donation = document.querySelector('[name="donation"]');
            if (donation) donation.value = donationAmount;
            
            const wishInput = document.querySelector('[name="wish"]');
            if (wishInput) wishInput.value = defaultWish;

            // Add enter key handler to Quick Wish button
            const submitButton = document.querySelector('input[name="quick-wish"]');
            if (submitButton) {
                submitButton.value = "Press Enter or click here to quick wish!";
                Utils.addEnterKeyHandler('input[name="quick-wish"]');
            }


        },

setupClickInterceptor: async function() {
    // Cache the current path
    const currentPath = window.location.pathname;
    
    // Add hidden input field to SDB form once
    if (currentPath.includes('/safetydeposit/')) {
        const sdbForm = document.querySelector('#sdb-form');
        if (sdbForm && !sdbForm.querySelector('input[name="view"]')) {
            const viewInput = document.createElement('input');
            viewInput.type = 'hidden';
            viewInput.name = 'view';
            viewInput.value = '100';
            sdbForm.appendChild(viewInput);
        }
    }

    // Pre-compile regex patterns for better performance
    const redirectPatterns = CONFIG.REDIRECT_RULES.map(rule => ({
        ...rule,
        regex: new RegExp(`^${rule.urlPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
    }));

    document.addEventListener('click', async function(event) {
        const link = event.target.closest('a') || event.target.closest('area');
        if (!link || !link.href.startsWith(BASE_URL)) return;

        const path = link.href.substring(BASE_URL.length);
        
        // Don't redirect if we're already on the target page
        if (path === currentPath) return;

        const isNewTab = event.ctrlKey || event.metaKey || event.which === 2 ||
                        (link.target && link.target === "_blank");

        // Handle SDB view parameter
        if (path.includes('/safetydeposit/') && !link.href.includes('view=100')) {
            event.preventDefault();
            const separator = link.href.includes('?') ? '&' : '?';
            const modifiedUrl = `${link.href}${separator}view=100`;
            if (isNewTab) {
                window.open(modifiedUrl, '_blank');
            } else {
                window.location.href = modifiedUrl;
            }
            return;
        }

        // Check redirect rules
        for (const rule of redirectPatterns) {
            // Special case for stocks
            if (rule.urlPattern === '/games/stockmarket/stocks/' && path.startsWith(rule.urlPattern)) {
                if (path === rule.urlPattern || path === rule.urlPattern.slice(0, -1)) {
                    event.preventDefault();
                    const redirectUrl = BASE_URL + rule.redirectUrl;
                    if (isNewTab) {
                        window.open(redirectUrl, '_blank');
                    } else {
                        window.location.href = redirectUrl;
                    }
                    return;
                }
                continue;
            }

            // Check if path matches rule pattern using regex
            if (rule.regex.test(path)) {
                event.preventDefault();
                
                if (rule.redirectUrl) {
                    const redirectUrl = BASE_URL + rule.redirectUrl;
                    if (isNewTab) {
                        window.open(redirectUrl, '_blank');
                    } else {
                        window.location.href = redirectUrl;
                    }
                    return;
                }

                if (rule.petParam) {
                    const petName = await GM.getValue(rule.petParam, '');
                    if (!petName) {
                        console.warn(`No pet name set for ${rule.petParam}`);
                        if (isNewTab) {
                            window.open(link.href, '_blank');
                        } else {
                            window.location.href = link.href;
                        }
                        return;
                    }
                    const redirectUrl = `${BASE_URL}/setactivepet/?pet_name=${encodeURIComponent(petName)}&redirect=${encodeURIComponent(path)}`;
                    if (isNewTab) {
                        window.open(redirectUrl, '_blank');
                    } else {
                        window.location.href = redirectUrl;
                    }
                    return;
                }
            }
        }
    }, true);
}
    };

    async function init() {
        if (Utils.isCurrentPage(CONFIG.PAGE_PATTERNS.SETTINGS)) {
            await PageHandlers.setupSettings();
        }

        if (await GM.getValue('redirectEnabled', false)) {
            PageHandlers.setupClickInterceptor();
        }

        const pageHandlerMap = {
            [CONFIG.PAGE_PATTERNS.BURIED_TREASURE]: PageHandlers.setupBuriedTreasure,
            [CONFIG.PAGE_PATTERNS.GARDEN]: PageHandlers.setupGarden,
            [CONFIG.PAGE_PATTERNS.FISHING]: PageHandlers.setupFishing,
            [CONFIG.PAGE_PATTERNS.SYMOL_HOLE]: PageHandlers.setupSymolHole,
            [CONFIG.PAGE_PATTERNS.STOCKS]: PageHandlers.setupStocks,
            [CONFIG.PAGE_PATTERNS.TOMBOLA]: PageHandlers.setupTombola,
            [CONFIG.PAGE_PATTERNS.TREASURE_HOME]: PageHandlers.setupTreasureHome,
            [CONFIG.PAGE_PATTERNS.LOTTERY]: PageHandlers.setupLottery,
            [CONFIG.PAGE_PATTERNS.BANK]: PageHandlers.setupBank,
            [CONFIG.PAGE_PATTERNS.TURMACULUS]: PageHandlers.setupTurmaculus,
            [CONFIG.PAGE_PATTERNS.GUESS_THE_WEIGHT]: PageHandlers.setupGuessTheWeight,
            [CONFIG.PAGE_PATTERNS.SPOOKY_TOILET]: PageHandlers.setupSpookyToilet,
            [CONFIG.PAGE_PATTERNS.GIANT_OMELETTE]: PageHandlers.setupGiantOmelette,
            [CONFIG.PAGE_PATTERNS.CELEBRATION_CALENDAR]: PageHandlers.setupCelebrationCalendar,
            [CONFIG.PAGE_PATTERNS.DEADLY_DICE]: PageHandlers.setupDeadlyDice,
            [CONFIG.PAGE_PATTERNS.STRENGTH_TEST]: PageHandlers.setupStrengthTest,
            [CONFIG.PAGE_PATTERNS.KNOWLEDGE_WHEEL]: PageHandlers.setupKnowledgeWheel,
            [CONFIG.PAGE_PATTERNS.EXCITEMENT_WHEEL]: PageHandlers.setupExcitementWheel,
            [CONFIG.PAGE_PATTERNS.MISFORTUNE_WHEEL]: PageHandlers.setupMisfortuneWheel,
            [CONFIG.PAGE_PATTERNS.MEDIOCRITY_WHEEL]: PageHandlers.setupMediocrityWheel,
            [CONFIG.PAGE_PATTERNS.TIKI_TOUR]: PageHandlers.setupTikiTour,
            [CONFIG.PAGE_PATTERNS.HEALING_SPRINGS]: PageHandlers.setupHealingSprings,
            [CONFIG.PAGE_PATTERNS.MERRY_GO_ROUND]: PageHandlers.setupMerryGoRound,
            [CONFIG.PAGE_PATTERNS.GREEN_JELLY]: PageHandlers.setupGreenJelly,
            [CONFIG.PAGE_PATTERNS.FRUIT_MACHINE]: PageHandlers.setupFruitMachine,
            [CONFIG.PAGE_PATTERNS.GRUMPY_KING]: PageHandlers.setupGrumpyKing,
            [CONFIG.PAGE_PATTERNS.WISE_KING]: PageHandlers.setupWiseKing,
            [CONFIG.PAGE_PATTERNS.WINTER_KIOSK]: PageHandlers.setupWinterKiosk,
            [CONFIG.PAGE_PATTERNS.DESERTED_KIOSK]: PageHandlers.setupDesertedKiosk,
            [CONFIG.PAGE_PATTERNS.DESERT_KIOSK]: PageHandlers.setupDesertKiosk,
            [CONFIG.PAGE_PATTERNS.COLTZANS_SHRINE]: PageHandlers.setupColtzansShrine,
            [CONFIG.PAGE_PATTERNS.NEOSCHOOL_COURSE]: PageHandlers.setupNeoschoolCourse,
            [CONFIG.PAGE_PATTERNS.WISHING_WELL]: PageHandlers.setupWishingWell
        };

        for (const [pattern, handler] of Object.entries(pageHandlerMap)) {
            if (Utils.isCurrentPage(pattern)) {
                handler();
                break;
            }
        }
    }

    init();
})();