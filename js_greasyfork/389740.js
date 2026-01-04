    // ==UserScript==
    // @name         Blind Mode
    // @namespace    http://tampermonkey.net/
    // @version      1.06
    // @description  Makes Dominion... interesting
    // @author       ceviri
    // @match        http://dominion.games/
    // @require      http://code.jquery.com/jquery-3.3.1.min.js
    // @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389740/Blind%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/389740/Blind%20Mode.meta.js
    // ==/UserScript==

    SILLY_NAMES = ["Cheese Destroyer", "Fief", "Freehold", "Leeches", "Damsel", "Food Taster", "Dagger Tester", "Blacksmith",
                   "Town Square", "Village Idiot", "Campaign", "Bribe", "Kitchen", "Enchant", "Manor", "Flea Market", "Mob",
                   "Tithe Collector", "War Axe", "Hatter", "Barbarian", "Sorceress", "Pirate", "Spare Room", "Wizard",
                   "Battlements", "Stonecutter", "Farm", "Butler", "Poison", "Plague", "Warlock", "Observatory", "Pixie Dust",
                   "Silver Mine", "Espionage", "Ringmaster", "Craftsman", "Court Magician", "Freak Show", "Smelter", "Bad Penny",
                   "Berserker", "Frontier", "Trickster", "Redsmith", "Furrier", "Rubbish Heap", "War Chest", "Renovate", "Kennel",
                   "Balcony", "Study", "Genie", "Magnate", "Toll Road", "Territory", "Crystal Ball", "Magic Hat", "Guard",
                   "Prophet", "Shaman", "Friar", "Architect", "Tailor", "Prospector", "Mummer", "Judge", "Town Crier", "Battle Plan",
                   "Produce", "Magic Mirror", "Fletcher", "Peat Bog", "Caltrops", "Cooper", "Portcullis", "Battering Ram",
                   "Sycophant", "Attendant", "Servant", "Paramour", "Temptress", "Courtesan", "Emissary", "Enlarge", "Boost",
                   "Exalt", "Glorify", "Update", "Promote", "Armorer", "Barber", "Bellfounder", "Bookbinder", "Bowyer", "Dyer",
                   "Farmer", "Fiddler", "Gemcutter", "Glazier", "Goldsmith", "Illuminator", "Joiner", "Locksmith", "Needler",
                   "Painter", "Pilgrim", "Potter", "Proctor", "Tanner", "Vintner", "Wagonwright", "Weaver", "Wheelwright",
                   "Drawbridge", "Liege", "Goblet", "Trebuchet", "Baroness", "Yeoman", "Almoner", "Usher", "Jeweler", "Auctioneer",
                   "Heir", "Hunter", "Troubadour", "Mother Lode", "Alodium", "Mortmain", "Crofter", "Highway Robber", "Worker",
                   "Siege", "Broker", "Consul", "Ingots", "Hides", "Marble", "Charmed Village", "Forest Village", "Swamp Village",
                   "Desert Village", "Northern Village", "Island Village", "Deep Mine", "Surveyor", "Charlatan", "Genius", "Brute",
                   "Wretch", "Rebel", "Vigilante", "Mouse", "Shifty Blacksmith", "Fishmonger", "Tinker", "Specialist", "Archer",
                   "Crusader", "Ninja", "Samurai", "Warlord", "Avenger", "Zealot", "Monk", "Armsmaster", "Ghostly Army", "Snake Charmer",
                   "Orphan", "Cabin Boy", "Bosun", "Bocor", "Silversmith", "Countess", "Earl", "Gatehouse", "Statue Garden", "Park",
                   "Pavilion", "Xyst", "Hippodrome", "Colossus", "Barrens", "Hanging Gardens", "Thieves' Guild", "Skirmish",
                   "Haggle", "Rescue", "Escape", "Burden", "Exploit", "Exodus", "Ransack", "Maraud", "Upheaval", "Decree", "Legacy",
                   "Dowry", "Master Plan", "Revenge", "Den of Brooks", "Escutcheon", "Thingamajig", "Doodad", "Whatnot",
                   "Spicy Village", "Holy Grail", "Secret Lamp", "Cave", "Secret Tunnel", "Secret Chamber", "Secret Village",
                   "Coppersmith", "Thief", "Adventurer", "Crumbling Village", "Sprawling Village", "Opulent Village", "Great Hall",
                   "Mall", "Spice of All Trades", "Metropolis", "Chaplain", "Fishmonger", "Gong Farmer", "Interloper",
                   "Neighboring Village", "Scullion", "Revel", "Madness", "Plantain", "Calamity", "General", "Brummagem",
                   "Swingletree", "Poppycock" , "Kinnikinnick", "Space Merchant", "Boons", "Cats", "Isle", "Pirate", "Cannonade",
                   "Barbican", "Buttress", "Chivalry", "Burgonet", "Cuirassier", "Longbowman", "Halberdier", "Pikeman",
                   "Abbey", "Vellein", "Scriptorium", "Borough", "Demesne", "Devshirme", "Escheat", "Landgable", "Honey Farmer",
                   "Fuller", "Groom of the Stool", "Powdermonkey", "Ewerer"];

    ADJECTIVES = ["Large", "Small", "Magic", "Merchants'", "Bandit", "Warrior", "Old", "Young", "Secret", "Ruined"];
    VANILLA_BONUSES = ["Sugar", "Sodium", "Fat", "Unsaturated Fat", "Saturated Fat", "Trans Fat", "Mass", "Interest Rates",
        "Inflation", "Wages", "Style", "Fashion", "Color", "Barbarians", "Coffee", "Buoys", "Hydration", "Farenheit", "Celsius",
        "Jobs", "Resolution", "Alpha", "Beta", "Gamma", "Upload", "Download", "Construction", "Buttons", "Card Text",
        "Bonus", "Tax Breaks"]
    ART_LINKS = [
        "https://imgur.com/0PxDLR2",
        "https://imgur.com/DCKJMZr",
        "https://imgur.com/SOtHaip",
        "https://imgur.com/QtWjkd0",
        "https://imgur.com/0182aRY",
        "https://imgur.com/olnTxbC",
        "https://imgur.com/2u455G4",
        "https://imgur.com/8IKafpH",
        "https://imgur.com/tUSqyk3",
        "https://imgur.com/Pk4Pv37",
        "https://imgur.com/1Ts3rBQ",
        "https://imgur.com/tPs9cvE",
        "https://imgur.com/GPUdagj",
        "https://imgur.com/WV5i8dF",
        "https://imgur.com/uvCD9aO",
        "https://imgur.com/fncSwya",
        "https://imgur.com/LJLgfdk",
        "https://imgur.com/I78eg1O",
        "https://imgur.com/PNt7tbB",
        "https://imgur.com/P3gZ14r",
        "https://imgur.com/PVGsCMG",
        "https://imgur.com/Qrp7dJu",
        "https://imgur.com/OiwMNmL",
        "https://imgur.com/mVgl1u4",
        "https://imgur.com/ADrReqT",
        "https://imgur.com/jl8A3sk",
        "https://imgur.com/koZVpDe",
        "https://imgur.com/yKBwVHu",
        "https://imgur.com/3LYGimD",
        "https://imgur.com/NXE3VkN",
        "https://imgur.com/g5kM91J",
        "https://imgur.com/Z4GMiGJ",
        "https://imgur.com/XRfTguU",
        "https://imgur.com/KUJdQmn",
        "https://imgur.com/kypwlI7",
        "https://imgur.com/Agzy288",
        "https://imgur.com/js8YqpC",
        "https://imgur.com/HQF5HYz",
        "https://imgur.com/am4Hj0Q",
        "https://imgur.com/mX9fAD5",
        "https://imgur.com/ysHwTGe",
        "https://imgur.com/17Ztl0A",
        "https://imgur.com/t0te35C",
        "https://imgur.com/DSl749i",
        "https://imgur.com/Gi2BHnB",
        "https://imgur.com/sEK6XhD",
    ]

    let correspondences = {};
    fakeLog = [];
    logDirty = true;

    GM_addStyle(`
        .game-page .card-art:not(.fake-art),
        .game-page .card-template:not(.fake-template):not(.card-back),
        .game-page card-text:not(.fake-text),
        .game-page .card-types,
        .game-page .card-production-container-left,
        .game-page .card-production-container-right,
        .game-page .storyline,
        .game-page .card-name:not(.silly-name),
        .game-page .button-label,
        .game-page .button-icon,
        .game-page .game-button-hint,
        .game-page .game-log,
        .game-page .expansion-icon,
        .game-page .card-study-window.info-right,
        .game-page card-study-window,
        .game-page .pile-bottom-text,
        .game-page pile-content,
        .game-page .card-overlay,
        .game-page .status-bar-image,
        .poof
        {
            display: none !important;
        }
        .game-log .blur {
            filter: blur(10px);
            display: inline;
        }
        .done-button, .game-button, .call-text {
            color: rgba(0, 0, 0, 0) !important;
        }
        .game-page .card-study-window.with-autoplay-options {
            background-color: rgba(0,0,0,0) !important;
            box-shadow: none !important;
            transform: translateX(35%);
        }
        .game-button {
            width: 10vw !important;
            height: 6vh !important;
            background: rgba(0, 0, 0, 0.8) !important;
        }
        .silly-name {
            position: absolute;
            font-family: "Comic Sans MS", "Comic Sans", cursive !important;
            font-size: 2em;
            z-index: 1000;
            font-size: 6%;
            width: 80%;
            display: flex;
            justify-content: center;
        }
        .card-full .silly-name {
            top: 2.5% !important;
            height: 8.5% !important;
        }
        .card-mini .silly-name {
            font-size: 7% !important;
        }
        .card-micro .silly-name {
            width: 90% !important;
            left: 10% !important;
            top: 15% !important;
            height: 85% !important;
            font-size: 70% !important;
        }
        .fake-art {
            position: absolute;
            background-size: cover;
            z-index: 1000;
        }
        .card-mini .fake-art {
            width: 93% !important;
            height: 72% !important;
            top: 17% !important;
            left: 4% !important;
        }
        .card-mini.landscape-card .fake-art {
            width: 95% !important;
            height: 62% !important;
            top: 12% !important;
            left: 2.5% !important;
        }
        .card-full .fake-art {
            width: 93% !important;
            height: 42.7% !important;
            top: 10% !important;
            left: 3% !important;
        }
        .card-full.landscape-card .fake-art {
            width: 95% !important;
            height: 62% !important;
            top: 12% !important;
            left: 2.5% !important;
        }
        .player-zones > .silly-name {
            font-size: 1.5vw;
            text-align: center;
            font-family: TrajanPro-Bold;
            color: #fff;
        }
        card-text.fake-text {
            z-index: 150 !important;
        }
        .way-quickselect-box {background: none !important}
        .card-stack.play-border,
        .card-stack.playusingvillager-border,
        .card-stack.discard-border,
        .card-stack.trash-border,
        .card-stack.pass-border,
        .card-stack.exile-border,
        .card-stack.name-border,
        .card-stack.buy-border,
        .card-stack.way-border,
        .card-stack.play-border:hover,
        .card-stack.playusingvillager-border:hover,
        .card-stack.discard-border:hover,
        .card-stack.trash-border:hover,
        .card-stack.pass-border:hover,
        .card-stack.exile-border:hover,
        .card-stack.name-border:hover,
        .card-stack.buy-border:hover,
        .card-stack.way-border:hover {
            border-color: purple !important;
            filter: none !important;
        }
        .game-page .status-bar-container,
        .game-page .player-counter {
            background: linear-gradient(to bottom right, #464E70, #7DE8EF) !important;
            width: 3vh;
        }
    `);

    angular.element(document.body).injector().invoke(['$rootScope', function(rootScope) {
        rootScope.$on(Events.LOBBY_PAGE_LOADED, function (info) {
            correspondences = {};
        });
        rootScope.$on(Events.GAME_PAGE_LOADED, function (info) {
            let seed = angular.element(document.body).injector().get("log").entries[0].logArguments[0].argument.gameId;
            correspondences = {};

            function makeSillyName(i) {
                return SILLY_NAMES[i % SILLY_NAMES.length];
            }

            function makeFakeText(i) {
                let text = `<card-text-line class="medium-font bold-line"><card-text-block class="bold-line"><span>+${1 + (i % 4)} ${VANILLA_BONUSES[i % VANILLA_BONUSES.length]}</span></card-text-block></card-text-line>`;
                for (let j = 0; j < i % 4; j++) {
                    i = (i ** 2 + 17) % (55 * VANILLA_BONUSES.length);
                    text += `<card-text-line class="medium-font bold-line"><card-text-block class="bold-line"><span>+${1 + (i % 4)} ${VANILLA_BONUSES[i % VANILLA_BONUSES.length]}</span></card-text-block></card-text-line>`;
                }
                return text;
            }

            let bigboi = 4294967087;
            let step = 65539;
            let adjective = 0;
            Object.values(CardNames).forEach((c, i) => {
                let sillyName = makeSillyName(seed);
                if (Object.values(correspondences).length >= SILLY_NAMES.length * 0.95) {
                    sillyName = ADJECTIVES[adjective % ADJECTIVES.length] + " " + sillyName;
                    adjective += 1;
                } else {
                    while (Object.values(correspondences).map(e => e.name).indexOf(sillyName) > -1) {
                        seed += 1;
                        sillyName = makeSillyName(seed);
                    }
                }
                correspondences[c.name.replace(/[\W ]/g, '').toLowerCase()] = {name: sillyName, art: ART_LINKS[seed % ART_LINKS.length], text: makeFakeText(seed)};
                seed = ((seed + 1) * step) % bigboi;
            });
        });
        hideReveal = () => {
            $(`.reveal-area`).each((i, e) => {
                $(e).addClass("poof");
            })
        };
        showReveal = () => {
            $(`.reveal-area`).each((i, e) => {
                $(e).removeClass("poof");
            })
        };
        rootScope.$on(Events.CARD_STUDY_REQUEST, hideReveal);
        rootScope.$on(Events.GLOBAL_CLICK, showReveal);
    }]);

    setInterval(function () {
        $(`.game-page .card-full`).each((i, e) => {
            if ($(e).find(".card-name").length > 0) {
                let realName = $($(e).find(".card-name:not(.silly-name)")[0]).html().replace(/[\W ]/g, '').toLowerCase();
                if (realName in correspondences) {
                    let sillyName = correspondences[realName].name;
                    let picId = correspondences[realName].picId;
                    if ($(e).find('.silly-name').length === 0){
                        $(e).prepend(`<div class='silly-name card-name'>${sillyName}</div>`);
                        $(e).prepend(`<div class='fake-template card-template' style="background-image:url('images/cards/templates/action-ruins.png')"></div>`);
                        $(e).prepend(`<card-text class='fake-text'>${correspondences[realName].text}</card-text>`);
                        $(e).prepend(`<div class='card-art fake-art' style="background-image: url('${correspondences[realName].art}.jpg')"></div>`);
                    }
                }
            }
        });
        $(`.game-page .card-mini`).each((i, e) => {
            if ($(e).find(".card-name").length > 0) {
                let realName = $($(e).find(".card-name:not(.silly-name)")[0]).html().replace(/[\W ]/g, '').toLowerCase();
                if (realName in correspondences) {
                    let sillyName = correspondences[realName].name;
                    let picId = correspondences[realName].picId;
                    if ($(e).find('.silly-name').length > 0){
                        if ($(e).find('.silly-name')[0].innerHTML != sillyName) {
                            $(e).find('.silly-name')[0].innerHTML = sillyName;
                            $(e).find('.fake-art')[0].style.backgroundImage = `url('${correspondences[realName].art}.jpg')`;
                        }
                    } else {
                        let isLandscape = e.classList.contains("landscape-card");
                        let bgImage = isLandscape ? "images/cards/templates/state.png" : "images/cards/templates/mini-action-ruins.png";
                        $(e).prepend(`<div class='silly-name card-name' style="font-size: 6%;">${sillyName}</div>`);
                        $(e).prepend(`<div class='fake-template card-template' style="background-image:url('${bgImage}')"></div>`);
                        $(e).prepend(`<div class='card-art fake-art' style="background-image: url('${correspondences[realName].art}.jpg')"></div>`);
                    }
                }
            }
        });
        $(`.game-page .card-micro`).each((i, e) => {
            if ($(e).find(".card-name").length > 0) {
                let realName = $($(e).find(".card-name:not(.silly-name)")[0]).html().replace(/[\W ]/g, '').toLowerCase();
                if (realName in correspondences) {
                    let sillyName = correspondences[realName].name;
                    let picId = correspondences[realName].picId;
                    if ($(e).find('.silly-name').length > 0){
                        if ($(e).find('.silly-name')[0].innerHTML != sillyName)
                            $(e).find('.silly-name')[0].innerHTML = sillyName;
                    } else {
                        $(e).prepend(`<div class='fake-template card-template' style="background-image:url('images/cards/templates/micro-boon.png')"></div>`);
                        $(e).prepend(`<div class='silly-name'>${sillyName}</div>`);
                    }
                }
            }
        });
        $(`.game-log`).each((i, e) => {
            if ($(e).children(".troll-log").length == 0) {
                $(e).prepend(`<div class='troll-log'></div>`);
            }
        });
        if (logDirty) {
            $(`.troll-log`).each((i, e) => {
                let shortLog = fakeLog.filter(e => e.length > 0);
                $(e).html(shortLog.slice(shortLog.length - 15, shortLog.length)
                                  .map(s => `<div class="fake-log">${s}</div>`).join("\n"));
            });
            logDirty = false;
        }
    }, 100);

    angular.element(document.body).injector().invoke(['$rootScope', 'log', 'game', function(rootScope, log, game) {
        function parseLineArguments(line, lineArguments, game) {
            let size = lineArguments.length;
            for (let i = 0; i < size; i++) {
                line = line.replace(new RegExp("Argument" + i, "g"), "<div class='blur'>redact</div>");
            }
            return line;
        }

        function parseLogEntry(logEntry, game) {
            let s = "";
            if (isNewTurnEntry(logEntry)) s += "<br/>";
            s += createDepthString(logEntry.depth);
            s += getTranslatedLogEntry(logEntry.name);
            return parseLineArguments(s, logEntry.logArguments, game) + "</div>";
        }

        function processEntry(entry) {
            fakeLog.splice(entry.index, fakeLog.length - entry.index);
            fakeLog[entry.index] = parseLogEntry(entry, game);
        }

        rootScope.$on(Events.NEW_GAME_LOG, function (event, gameLog) {
            fakeLog = [];
            gameLog.indexedEntries.forEach(e => {
                if (e instanceof LogEntry) {
                    processEntry(e);
                }
            });
            logDirty = true;
        });

        rootScope.$on(Events.NEW_LOG_ENTRY, function (event, logEntry) {
            processEntry(logEntry);
            logDirty = true;
        });
    }]);

