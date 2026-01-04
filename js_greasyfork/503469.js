// ==UserScript==
// @name         Troopcounter
// @namespace    https://tampermonkey.net/
// @version      2024-10-14
// @description  A troopcounter to track your own and your alliance members troops. 
// @author       Vonk
// @match        https://*.grepolis.com/game/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/503469/Troopcounter.user.js
// @updateURL https://update.greasyfork.org/scripts/503469/Troopcounter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const languages = [
        { value: 'nl', text: 'Dutch' },
        { value: 'en', text: 'English' },
        { value: 'el', text: 'Greek' },
        { value: 'it', text: 'Italian' }
    ];
    let selectedLanguage = localStorage.getItem("troopcounterLanguage") || "en";

    const translations = {
        saveToken: {
            nl: "Save token & key",
            en: "Save token & key",
            el: "Αποθήκευση κλειδιού και διακριτικού",
            it: "Salva token e chiave"
        },
        loadTroops: {
            nl: "Laad troepenoverzicht",
            en: "Load troop overview",
            el: "Φόρτωση επισκόπησης στρατευμάτων",
            it: "Carica panoramica truppe"
        },
        updateData: {
            nl: "Update eigen data",
            en: "Update own data",
            el: "Ενημέρωση δικών δεδομένων",
            it: "Aggiorna i propri dati"
        },
        joinDiscord: {
            nl: "Join Discord",
            en: "Join Discord",
            el: "Σύνδεση με το Discord",
            it: "Partecipa a Discord"
        },
        existingGroup: {
            nl: "Gebruik bestaande groep ⓘ",
            en: "Use existing group ⓘ",
            el: "Χρήση υπάρχουσας ομάδας ⓘ",
            it: "Usa gruppo esistente ⓘ"
        },
        existingGroupDesc: {
            nl: "Gebruik deze optie als je al een token en key hebt. Via deze knop kan je de token en key invullen en je troepenoverzicht laden.",
            en: "Use this option if you already have a token and key. This button lets you enter the token and key to load your troop overview.",
            el: "Χρησιμοποιήστε αυτήν την επιλογή αν έχετε ήδη κλειδί και διακριτικό. Μπορείτε να τα εισάγετε για να φορτώσετε την επισκόπηση στρατευμάτων.",
            it: "Usa questa opzione se hai già un token e una chiave. Questo pulsante ti permette di inserire il token e la chiave per caricare la panoramica truppe."
        },
        newGroup: {
            nl: "Maak een nieuwe groep ⓘ",
            en: "Create a new group ⓘ",
            el: "Δημιουργία νέας ομάδας ⓘ",
            it: "Crea un nuovo gruppo ⓘ"
        },
        newGroupDesc: {
            nl: "Gebruik deze optie als je nog geen token en key hebt. Via deze knop kan je een groep aanmaken en genereer je een token en key die je kan delen met je alliantiegenoten.",
            en: "Use this option if you don’t have a token and key yet. This button lets you create a group and generate a token and key to share with your alliance members.",
            el: "Χρησιμοποιήστε αυτήν την επιλογή αν δεν έχετε ακόμη κλειδί και διακριτικό. Δημιουργείτε μια ομάδα και παράγετε κλειδί και διακριτικό για να το μοιραστείτε με τα μέλη της συμμαχίας σας.",
            it: "Usa questa opzione se non hai ancora un token e una chiave. Questo pulsante ti permette di creare un gruppo e generare un token e una chiave da condividere con i membri della tua alleanza."
        },
        moreInfo: {
            nl: "Meer info",
            en: "More info",
            el: "Περισσότερες πληροφορίες",
            it: "Maggiori informazioni"
        },
        refreshData: {
            nl: "Ververs gegevens",
            en: "Refresh Data",
            el: "Ανανέωση Δεδομένων",
            it: "Aggiorna Dati"
        },
        generateToken: {
            nl: "Genereer token",
            en: "Generate Token",
            el: "Δημιουργία Κωδικού",
            it: "Genera Token"
        },
        generateKey: {
            nl: "Genereer sleutel",
            en: "Generate Key",
            el: "Δημιουργία Κλειδιού",
            it: "Genera Chiave"
        },
        optionsInfo: {
            nl: "Je hebt twee opties:\n\n1. Gebruik bestaande groep: Als je al een token en sleutel hebt, kies dan deze optie. Je kunt ze invoeren en je troepenoverzicht laden.\n\n2. Maak een nieuwe groep: Als je nog geen token en sleutel hebt, kun je hier een groep aanmaken. Je genereert een token en sleutel die je kunt delen met je alliantiegenoten.",
            en: "You have two options:\n\n1. Use existing group: If you already have a token and key, choose this option. You can enter them and load your troop overview.\n\n2. Create a new group: If you don't have a token and key yet, you can create a group here. You will generate a token and key that you can share with your alliance members.",
            el: "Έχετε δύο επιλογές:\n\n1. Χρήση υπάρχουσας ομάδας: Αν έχετε ήδη κωδικό και κλειδί, επιλέξτε αυτήν την επιλογή. Μπορείτε να τα εισάγετε και να φορτώσετε την επισκόπηση στρατευμάτων σας.\n\n2. Δημιουργία νέας ομάδας: Αν δεν έχετε ακόμη κωδικό και κλειδί, μπορείτε να δημιουργήσετε μια ομάδα εδώ. Θα δημιουργηθεί ένας κωδικός και κλειδί που μπορείτε να μοιραστείτε με τα μέλη της συμμαχίας σας.",
            it: "Hai due opzioni:\n\n1. Usa gruppo esistente: Se hai già un token e una chiave, scegli questa opzione. Puoi inserirli e caricare la panoramica delle tue truppe.\n\n2. Crea un nuovo gruppo: Se non hai ancora un token e una chiave, puoi creare un gruppo qui. Genererai un token e una chiave da condividere con i membri della tua alleanza."
        },
        createGroup: {
            nl: 'Maak een nieuwe groep',   
            en: 'Create new group',        
            el: 'Δημιουργία νέας ομάδας',    
            it: 'Crea un nuovo gruppo'  
        }
    };

    $(document).ready(function () {
        addTroopCounterButton();
        console.log("Troopcounter loaded");
        setTimeout(function () {
            if (localStorage.getItem(storagetoken) !== null && localStorage.getItem(storagekey) !== null) {
                detectChanges();
            }
        }, 10000);

        var style = document.createElement('style');
        style.innerHTML = `
            .troopcounter-button {
                border: 1px solid #d9b310;
                cursor: pointer;
                display: block;
                font-size: 11px;
                font-weight: bold;
                line-height: 20px;
                margin: 0 0 5px;
                padding: 2px;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
            }
            .dialog-input {
                border: 1px solid #d9b310;
                border-radius: 5px;
                height: 30px;
                margin: 5px 0;
                padding: 0 5px;
                width: 100%;
            }
            .dialog-button {
                background-color: #fff;
                border: 1px solid #d9b310;
                border-radius: 5px;
                color: #d9b310;
                cursor: pointer;
                display: block;
                font-size: 16px;
                font-weight: bold;
                height: 30px;
                line-height: 30px;
                margin: 5px 0;
                padding: 0;
                text-align: center;
                text-decoration: none;
                width: 100%;
            }
            .dialog-button:hover {
                background-color: #d9b310;
                color: #fff;
            }
            .troopcounter-generate-button {
                border-radius: 15px;
                width: 120px;
                font-weight: bold;
                padding: 5px;
            }
            #troopcounterTable {
                border-collapse: collapse;
                table-layout: fixed;
                position: relative;
            }

            #troopcounterTable th,
            #troopcounterTable td {
                padding: 8px;
                text-align: center;
                border: 1px solid #ddd;
            }

            #troopcounterTable th {
                position: sticky;
                top: 0;
                background-color: #cdcdcd;
                z-index: 2; 
            }

            #troopcounterTable th:first-child,
            #troopcounterTable td:first-child {
                position: sticky;
                left: 0;
                background-color: #cdcdcd;
                z-index: 1; 
            }

            #troopcounterTable th:first-child {
                z-index: 3; 
            }
        `;
        document.head.appendChild(style);

        const worldId = Game.world_id;

        const storagetoken = `token_${worldId}`;
        const storagekey = `key_${worldId}`;

        let currentData = null;


        function addTroopCounterButton() {
            if (document.getElementById('troopCounterButton') == null) {
                const ulElement = document.querySelector('.content ul');
                const troopCounterLi = document.createElement('li');
                troopCounterLi.id = 'troopCounterButton';
                troopCounterLi.className = 'main_menu_item';
                troopCounterLi.innerHTML = `
                        <span class="content_wrapper">
                            <span class="button_wrapper">
                            <span class="button">
                                <span class="icon"></span>
                            </span>
                            </span>
                            <span class="name_wrapper">
                            <span class="name">Troop Counter</span>
                            </span>
                        </span>
                        `;

                // Create the fully red box list item
                const refreshBoxLi = document.createElement('li');
                refreshBoxLi.className = 'main_menu_item';
                refreshBoxLi.id = 'troopCounterRefreshButton';
                refreshBoxLi.style.backgroundColor = 'green';


                const contentWrapper = document.createElement('span');
                contentWrapper.className = 'content_wrapper';

                const buttonWrapper = document.createElement('span');
                buttonWrapper.className = 'button_wrapper';

                const button = document.createElement('span');
                button.className = 'button';

                const icon = document.createElement('span');
                icon.className = 'icon';

                const nameWrapper = document.createElement('span');
                nameWrapper.className = 'name_wrapper';

                const name = document.createElement('span');
                name.className = 'name';
                name.textContent = translations.refreshData[selectedLanguage];

                button.appendChild(icon);
                buttonWrapper.appendChild(button);
                contentWrapper.appendChild(buttonWrapper);
                nameWrapper.appendChild(name);
                contentWrapper.appendChild(nameWrapper);
                refreshBoxLi.appendChild(contentWrapper);

                refreshBoxLi.addEventListener('click', function () {
                    fetchData();
                });

                ulElement.appendChild(troopCounterLi);
                ulElement.appendChild(refreshBoxLi);
                $("#troopCounterButton").click(function () {
                    if (localStorage.getItem(storagetoken) !== null && localStorage.getItem(storagekey) !== null && localStorage.getItem(storagetoken) !== "" && localStorage.getItem(storagekey) !== "") {
                        createTroopcounterWindow();
                    } else {
                        startDialog();
                    }
                });
            }
        }

        var troops = [
            { "id": 1, "name": "sword" },
            { "id": 2, "name": "archer" },
            { "id": 3, "name": "hoplite" },
            { "id": 4, "name": "slinger" },
            { "id": 5, "name": "rider" },
            { "id": 6, "name": "chariot" },
            { "id": 7, "name": "catapult" },
            { "id": 8, "name": "godsent" },
            { "id": 9, "name": "manticore" },
            { "id": 10, "name": "harpy" },
            { "id": 11, "name": "pegasus" },
            { "id": 12, "name": "griffin" },
            { "id": 13, "name": "cerberus" },
            { "id": 14, "name": "minotaur" },
            { "id": 15, "name": "medusa" },
            { "id": 16, "name": "zyklop" },
            { "id": 17, "name": "centaur" },
            { "id": 18, "name": "sea_monster" },
            { "id": 19, "name": "ladon" },
            { "id": 20, "name": "spartoi" },
            { "id": 21, "name": "small_transporter" },
            { "id": 22, "name": "big_transporter" },
            { "id": 23, "name": "bireme" },
            { "id": 24, "name": "attack_ship" },
            { "id": 25, "name": "trireme" },
            { "id": 26, "name": "colonize_ship" },
            { "id": 27, "name": "siren" },
            { "id": 28, "name": "fury" },
            { "id": 29, "name": "demolition_ship" },
            { "id": 30, "name": "satyr" },
            { "id": 31, "name": "calydonian_boar" }
        ];

        function createTroopcounterWindow() {
            var windowExists = false;
            var windowItem = null;
            for (var item of document.getElementsByClassName('ui-dialog-title')) {
                if (item.innerHTML == "TroopCounter") {
                    windowExists = true;
                    windowItem = item;
                }
            }
            if (!windowExists) {
                var wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "TroopCounter");
                wnd.setContent('');
            }
            for (var item of document.getElementsByClassName('ui-dialog-title')) {
                if (item.innerHTML == "TroopCounter") {
                    windowItem = item;
                }
            }
            wnd.setHeight('500');
            wnd.setWidth('750');
            wnd.setTitle("TroopCounter");
            var title = windowItem;
            var frame = title.parentElement.parentElement.children[1].children[4];
            frame.innerHTML = '';

            var body = document.createElement('div');
            var element = document.createElement('h3');
            element.innerHTML = "TroopCounter";
            element.style.margin = '0 auto';
            body.appendChild(element);

            var tableContainer = document.createElement('div');
            tableContainer.style.height = '300px';
            tableContainer.style.overflowY = 'auto';

            var table = document.createElement('table');
            table.id = "troopcounterTable";
            table.style.overflowX = 'scroll';

            tableContainer.appendChild(table);
            var headerRow = document.createElement('tr');
            var playernameHeader = document.createElement('th');
            playernameHeader.textContent = 'Playername';
            headerRow.appendChild(playernameHeader);
            var culturalLevelHeader = document.createElement('th');
            culturalLevelHeader.textContent = 'Cultural level';
            headerRow.appendChild(culturalLevelHeader);

            troops.forEach(function (troop) {
                var th = document.createElement('th');
                var spanElement = document.createElement('span');
                spanElement.setAttribute('class', 'unit index_unit unit_icon40x40 ' + troop.name);
                th.appendChild(spanElement);
                headerRow.appendChild(th);
            });

            table.appendChild(headerRow);

            body.appendChild(tableContainer);
            frame.appendChild(body);

            var loginDiv = document.createElement('div');
            loginDiv.style.marginTop = "10px";
            loginDiv.innerHTML = `
                        Token: <input type="text" id="token"><br>
                        Key: <input type="text" id="key"><br>
                        <div id="tc-button" style="display:flex; margin-top: 15px; gap: 10px">
                            <button id="saveButton" class="troopcounter-button">${translations.saveToken[selectedLanguage]}</button>
                            <button id="loadButton" class="troopcounter-button">${translations.loadTroops[selectedLanguage]}</button>
                            <button id="fetchData" class="troopcounter-button">${translations.updateData[selectedLanguage]}</button>
                        </div>
                        
                        `;

            frame.appendChild(loginDiv);

            var buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'row';
            buttonContainer.style.marginTop = '10px';
            buttonContainer.style.float = 'right';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.position = 'relative';

            var createGroupButton = document.createElement('button');
            createGroupButton.innerHTML = translations.createGroup[selectedLanguage];
            createGroupButton.id = 'createGroup';
            createGroupButton.style.height = '30px';
            createGroupButton.style.marginTop = '10px';
            createGroupButton.classList.add('troopcounter-button');

            var discordButton = document.createElement('button');
            discordButton.innerHTML = translations.joinDiscord[selectedLanguage];
            discordButton.style.marginTop = '10px';
            discordButton.style.height = '30px';
            discordButton.onclick = function () {
                window.open('https://discord.gg/rvETEWWQmf', '_blank');
            };
            discordButton.classList.add('troopcounter-button');

            var languageSelect = document.createElement('select');
            languageSelect.id = 'languageSelect';
            languageSelect.style.marginTop = '10px';
            languageSelect.style.height = '30px';
            languageSelect.style.borderRadius = '5px';
            languageSelect.style.border = '1px solid #d9b310';
            languageSelect.style.padding = '0 5px';
            languageSelect.style.backgroundColor = '#fff';

            languages.forEach(language => {
                let option = document.createElement('option');
                option.value = language.value;
                option.text = language.text;
                languageSelect.appendChild(option);
            });

            languageSelect.value = selectedLanguage;


            buttonContainer.appendChild(languageSelect);
            buttonContainer.appendChild(createGroupButton);
            buttonContainer.appendChild(discordButton);

            frame.appendChild(buttonContainer);

            if (localStorage.getItem(storagetoken) !== null && localStorage.getItem(storagekey) !== null) {
                document.getElementById('token').value = localStorage.getItem(storagetoken);
                document.getElementById('key').value = localStorage.getItem(storagekey);
            };

            frame.appendChild(loginDiv);
            document.getElementById('saveButton').addEventListener('click', function () {
                var token = document.getElementById('token').value;
                var key = document.getElementById('key').value;
                localStorage.setItem(storagetoken, token.trim());
                localStorage.setItem(storagekey, key.trim());

                setTimeout(function () {
                    location.reload();
                }, 1000);
            });

            languageSelect.onchange = function () {
                selectedLanguage = languageSelect.value;
                localStorage.setItem("troopcounterLanguage", selectedLanguage);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            };

            document.getElementById('loadButton').addEventListener('click', function () {
                fetchTroopCountData();
            });
            document.getElementById('fetchData').addEventListener('click', function () {
                fetchData();
            });

            document.getElementById('createGroup').addEventListener('click', function () {
                createGroup();
            });
        }

        function compareData() {
            let data = getPlayerData(false);

            if (currentData === null) {
                return true;
            }

            if (currentData.towns.length !== data.towns.length) {
                return true;
            }

            if (currentData.alliance !== data.alliance
                || currentData.culturalLevel !== data.culturalLevel
                || currentData.additionalTownCount !== data.additionalTownCount
                || currentData.currentCP !== data.currentCP
                || currentData.nextlevelCP !== data.nextlevelCP) {
                return true;
            }

            for (let i = 0; i < currentData.towns.length; i++) {
                const currentTown = currentData.towns[i];
                const newTown = data.towns[i];

                if (currentTown.id !== newTown.id ||
                    currentTown.points !== newTown.points ||
                    currentTown.x !== newTown.x ||
                    currentTown.y !== newTown.y ||
                    currentTown.wallLevel !== newTown.wallLevel ||
                    currentTown.phalanx !== newTown.phalanx ||
                    currentTown.ram !== newTown.ram ||
                    currentTown.god !== newTown.god) {
                    return true;
                }

                if (currentTown.availableTroopsInTown.length !== newTown.availableTroopsInTown.length ||
                    currentTown.outerTroopsInTown.length !== newTown.outerTroopsInTown.length ||
                    currentTown.supportTroopsInTown.length !== newTown.supportTroopsInTown.length) {
                    return true;
                }
            }

            return false;
        }

        function detectChanges() {
            setInterval(() => {
                if (compareData()) {
                    document.getElementById("troopCounterRefreshButton").style.backgroundColor = 'red';
                }
            }, 3600000);
        }


        function fetchTroopCountData() {
            var token = localStorage.getItem(storagetoken);
            var key = localStorage.getItem(storagekey);
            if (!token || !key) {
                console.log('No token & key filled in.');
                return;
            }

            var link = `https://www.grepotroopcounter.be/api/Group/GetEncryptedPlayerData?token=${token}`;

            fetch(link)
                .then(response => response.json())
                .then(data => {
                    updateTroopCounts(data.players);
                })
                .catch(error => {
                    console.error('Error fetching troop count data:', error);
                });
        }

        function createPlayerRow(encryptedPlayer) {
            let player = countTroops(encryptedPlayer);
            var existingRow = document.getElementById('player-' + player.id);
            if (existingRow) {
                updatePlayerRow(existingRow, player);
                return existingRow;
            }

            var row = document.createElement('tr');
            row.id = 'player-' + player.id;

            var playerNameCell = document.createElement('td');
            playerNameCell.textContent = player.name;
            row.appendChild(playerNameCell);

            var culturalLevelCell = document.createElement('td');
            culturalLevelCell.textContent = player.culturalLevel;
            row.appendChild(culturalLevelCell);

            troops.forEach(function (troop) {
                var cell = document.createElement('td');
                cell.style.textAlign = "center";

                if (player.troopCounts.hasOwnProperty(troop.name)) {
                    cell.textContent = player.troopCounts[troop.name];
                } else {
                    cell.textContent = "0";
                }

                row.appendChild(cell);
            });

            return row;
        }

        function updateTroopCounts(data) {
            var table = document.querySelector('#troopcounterTable');
            data.forEach(player => {
                var row = createPlayerRow(player);
                table.appendChild(row);
            });
        }

        function updatePlayerRow(row, player) {
            var playerNameCell = row.querySelector('td:first-child');
            playerNameCell.textContent = player.name;

            var culturalLevelCell = row.querySelector('td:nth-child(2)');
            culturalLevelCell.textContent = player.culturalLevel;

            var cells = row.querySelectorAll('td:not(:first-child):not(:nth-child(2)');

            cells.forEach(function (cell, index) {
                var troopName = troops[index].name;
                if (player.troopCounts.hasOwnProperty(troopName)) {
                    cell.textContent = player.troopCounts[troopName];
                } else {
                    cell.textContent = "0";
                }
            });
        }

        function createPlayer() {
            let formattedData = getPlayerData();

            fetch(`https://www.grepotroopcounter.be/api/Players`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add player');
                    }
                    console.log('Player added successfully');
                    setTimeout(fetchData, 5000);
                })
                .catch(error => {
                    console.error('Error adding player:', error);
                });
        }

        function getPlayerData(updateCheck = true) {
            const playerId = Game.player_id
            const playerName = Game.player_name;
            const allianceName = MM.getModels().Player[Game.player_id].attributes.alliance_name;
            let townsObject = ITowns.getTowns();
            let MMTowns = MM.getModels().Town;
            let additionalTownCount = MM.getModels().Player[Game.player_id].attributes.additional_town_count;
            let currentCP = MM.getModels().Player[Game.player_id].attributes.cultural_points;
            let nextlevelCP = MM.getModels().Player[Game.player_id].attributes.needed_cultural_points_for_next_step;
            let cl = MM.getModels().Player[Game.player_id].attributes.cultural_step;
            let lastUpdated = Date.now().toString();

            let townsData = Object.values(townsObject).map(town => {
                let homeUnits = town.units();
                let troopsInTown = [];
                let outerUnits = town.unitsOuter();
                let outerTroopsInTown = [];
                let supportUnits = town.unitsSupport();
                let supportTroopsInTown = [];


                if (homeUnits) {
                    troopsInTown = Object.keys(homeUnits).map(unitType => ({
                        name: unitType,
                        count: homeUnits[unitType]
                    }));
                }

                if (outerUnits) {
                    outerTroopsInTown = Object.keys(outerUnits).map(unitType => ({
                        name: unitType,
                        count: outerUnits[unitType]
                    }));
                }

                if (supportUnits) {
                    supportTroopsInTown = Object.keys(supportUnits).map(unitType => ({
                        name: unitType,
                        count: supportUnits[unitType]
                    }));
                }

                return {
                    id: town.id,
                    name: town.name,
                    points: town.getPoints(),
                    sea_id: MMTowns[town.id].attributes.sea_id,
                    x: MMTowns[town.id].attributes.abs_x,
                    y: MMTowns[town.id].attributes.abs_y,
                    god: town.god(),
                    wallLevel: town.buildings().attributes.wall,
                    phalanx: town.researches().attributes.phalanx,
                    ram: town.researches().attributes.ram,
                    availableTroopsInTown: troopsInTown,
                    outerTroopsInTown: outerTroopsInTown,
                    supportTroopsInTown: supportTroopsInTown
                };
            });

            if (!updateCheck) {
                return {
                    id: playerId,
                    name: playerName,
                    lastUpdated: lastUpdated,
                    towns: townsData,
                    alliance: allianceName,
                    culturalLevel: cl,
                    additionalTownCount: additionalTownCount,
                    currentCP: currentCP,
                    nextlevelCP: nextlevelCP,
                    token: localStorage.getItem(storagetoken),
                };
            }

            let formattedData = {
                id: playerId,
                name: playerName,
                lastUpdated: encryptData(lastUpdated),
                towns: encryptData(townsData),
                alliance: encryptData(allianceName),
                culturalLevel: encryptData(cl),
                additionalTownCount: encryptData(additionalTownCount),
                currentCP: encryptData(currentCP),
                nextlevelCP: encryptData(nextlevelCP),
                token: localStorage.getItem(storagetoken),
            };

            document.getElementById("troopCounterRefreshButton").style.backgroundColor = 'green';

            return formattedData;
        }

        function encryptData(data) {
            let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), localStorage.getItem(storagekey)).toString();
            return encryptedData;
        }

        function decryptData(data) {
            let decryptedData = CryptoJS.AES.decrypt(data, localStorage.getItem(storagekey)).toString(CryptoJS.enc.Utf8);
            //if decrypted data is malformed return invalid data string
            if (decryptedData === "") {
                return "Invalid data";
            }
            return JSON.parse(decryptedData);
        }

        function countTroops(player) {
            let decryptedPlayer = {
                ...player,
                culturalLevel: decryptData(player.culturalLevel),
                alliance: decryptData(player.alliance),
                towns: decryptData(player.towns)
            };

            let troopCounts = {};

            decryptedPlayer.towns.forEach(town => {
                town.availableTroopsInTown.forEach(troop => {
                    troopCounts[troop.name] = (troopCounts[troop.name] || 0) + troop.count;
                });

                town.outerTroopsInTown.forEach(troop => {
                    troopCounts[troop.name] = (troopCounts[troop.name] || 0) + troop.count;
                });
            });

            return {
                id: decryptedPlayer.id,
                name: decryptedPlayer.name,
                troopCounts: troopCounts,
                culturalLevel: decryptedPlayer.culturalLevel
            };
        }

        function createGroup() {
            var windowExists = false;
            var windowItem = null;
            for (var item of document.getElementsByClassName('ui-dialog-title')) {
                if (item.innerHTML == "CreateGroup") {
                    windowExists = true;
                    windowItem = item;
                    return;
                }
            }
            if (!windowExists) {
                var wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "CreateGroup");
                wnd.setContent('');
            }
            for (var item of document.getElementsByClassName('ui-dialog-title')) {
                if (item.innerHTML == "CreateGroup") {
                    windowItem = item;
                }
            }

            wnd.setHeight('300');
            wnd.setWidth('375');
            wnd.setTitle("CreateGroup");
            var title = windowItem;
            var frame = title.parentElement.parentElement.children[1].children[4];
            frame.innerHTML = '';

            var body = document.createElement('div');
            var element = document.createElement('h3');
            element.innerHTML = "CreateGroup";
            element.style.margin = '0 auto';
            body.appendChild(element);
            let inputGroupName = document.createElement('input');
            inputGroupName.type = 'text';
            inputGroupName.id = 'groupName';
            inputGroupName.placeholder = 'Group name';
            inputGroupName.style.marginTop = '10px';
            inputGroupName.style.width = '60%';
            inputGroupName.style.height = '30px';

            let inputToken = document.createElement('input');
            inputToken.type = 'text';
            inputToken.id = 'newToken';
            inputToken.placeholder = 'Token';
            inputToken.style.width = '60%';

            let tokenDiv = document.createElement('div');
            tokenDiv.style.display = 'flex';
            tokenDiv.style.justifyContent = 'space-between';
            tokenDiv.style.marginTop = '10px';

            let inputKey = document.createElement('input');
            inputKey.type = 'text';
            inputKey.id = 'newKey';
            inputKey.placeholder = 'Key';
            inputKey.style.width = '60%';

            let buttonGenerateToken = document.createElement('button');
            buttonGenerateToken.id = 'generateToken';
            buttonGenerateToken.innerHTML = translations.generateToken[selectedLanguage];
            buttonGenerateToken.classList.add('troopcounter-generate-button');

            tokenDiv.appendChild(inputToken);
            tokenDiv.appendChild(buttonGenerateToken);

            buttonGenerateToken.onclick = function () {
                let token = generateToken();
                inputToken.value = token;
            };

            let keyDiv = document.createElement('div');
            keyDiv.style.display = 'flex';
            keyDiv.style.justifyContent = 'space-between';
            keyDiv.style.marginTop = '10px';

            let buttonGenerateKey = document.createElement('button');
            buttonGenerateKey.id = 'generateKey';
            buttonGenerateKey.innerHTML = translations.generateKey[selectedLanguage];
            buttonGenerateKey.classList.add('troopcounter-generate-button');

            let buttonSave = document.createElement('button');
            buttonSave.id = 'saveGroup';
            buttonSave.innerHTML = 'Save group';
            buttonSave.classList.add('dialog-button');

            keyDiv.appendChild(inputKey);
            keyDiv.appendChild(buttonGenerateKey);

            buttonGenerateKey.onclick = function () {
                let key = generateKey();
                inputKey.value = key;
            };

            buttonSave.onclick = function () {
                let groupName = document.getElementById('groupName').value;
                let token = document.getElementById('newToken').value;
                let key = document.getElementById('newKey').value;
                let world = Game.world_id;

                if (!groupName || !token || !key) {
                    alert('Please fill in all fields');
                    return;
                }

                let body = {
                    name: groupName,
                    world: world,
                    token: token,
                };

                fetch(`https://www.grepotroopcounter.be/api/Group/CreateGroup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }).then(async response => {
                    if (!response.ok) {
                        var errorMessage = await response.text();
                        console.log('Failed to create group:', errorMessage);
                    } else {
                        console.log('Group created successfully');
                        localStorage.setItem(storagetoken, token);
                        localStorage.setItem(storagekey, key);
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }
                }
                ).catch(error => {
                    console.error('Error creating group:', error);
                });


            };

            body.appendChild(inputGroupName);
            body.appendChild(tokenDiv);
            body.appendChild(keyDiv);
            body.appendChild(buttonSave);
            frame.appendChild(body);
        }

        function generateKey() {
            var key = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var charactersLength = characters.length;
            for (var i = 0; i < 8; i++) {
                key += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return key;
        }

        function generateToken() {
            var token = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var charactersLength = characters.length;
            for (var i = 0; i < 24; i++) {
                token += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return token;
        }

        function startDialog() {
            var windowExists = false;
            var windowItem = null;
            for (var item of document.getElementsByClassName('ui-dialog-title')) {
                if (item.innerHTML == "TroopCounter - Start") {
                    windowExists = true;
                    windowItem = item;
                    return;
                }
            }
            if (!windowExists) {
                var wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "TroopCounter - Start");
                wnd.setContent('');
            }
            for (var item of document.getElementsByClassName('ui-dialog-title')) {
                if (item.innerHTML == "TroopCounter - Start") {
                    windowItem = item;
                }
            }

            wnd.setHeight('270');
            wnd.setWidth('300');
            wnd.setTitle("TroopCounter - Start");
            var title = windowItem;
            var frame = title.parentElement.parentElement.children[1].children[4];
            frame.innerHTML = '';

            var body = document.createElement('div');
            var element = document.createElement('h3');
            element.innerHTML = "TroopCounter - Start";
            element.style.margin = '0 auto';
            body.appendChild(element);

            var buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'column';
            buttonContainer.style.alignItems = 'flex-end';
            buttonContainer.style.marginTop = '10px';
            buttonContainer.style.float = 'right';
            buttonContainer.style.width = '100%';

            var useExistingButton = document.createElement('button');
            useExistingButton.innerHTML = 'Gebruik bestaande groep ⓘ';
            useExistingButton.id = 'useExistingGroup';
            useExistingButton.style.marginTop = '10px';
            useExistingButton.classList.add('dialog-button');
            useExistingButton.title = translations.existingGroupDesc[selectedLanguage];

            var createNewButton = document.createElement('button');
            createNewButton.innerHTML = 'Maak een nieuwe groep ⓘ';
            createNewButton.id = 'createNewGroup';
            createNewButton.style.marginTop = '10px';
            createNewButton.classList.add('dialog-button');
            createNewButton.title = translations.newGroupDesc[selectedLanguage];

            var moreInfoButton = document.createElement('button');
            moreInfoButton.innerHTML = translations.moreInfo[selectedLanguage];
            moreInfoButton.style.marginTop = '10px';
            moreInfoButton.classList.add('dialog-button');
            moreInfoButton.onclick = function () {
                alert(translations.optionsInfo[selectedLanguage]);
            };

            useExistingButton.onclick = function () {
                createTroopcounterWindow();
            }

            createNewButton.onclick = function () {
                createGroup();
            }

            buttonContainer.appendChild(useExistingButton);
            buttonContainer.appendChild(createNewButton);
            buttonContainer.appendChild(moreInfoButton);

            frame.appendChild(body);
            frame.appendChild(buttonContainer);
        }

        function fetchData() {
            let formattedData = getPlayerData();
            currentData = getPlayerData(false);

            let body = {
                id: formattedData.id,
                lastUpdated: formattedData.lastUpdated,
                towns: formattedData.towns,
                alliance: formattedData.alliance,
                culturalLevel: formattedData.culturalLevel,
                additionalTownCount: formattedData.additionalTownCount,
                currentCP: formattedData.currentCP,
                nextlevelCP: formattedData.nextlevelCP,
                token: localStorage.getItem(storagetoken)
            };

            fetch(`https://www.grepotroopcounter.be/api/Players/AddEncryptedData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(async response => {
                if (!response.ok) {
                    var errorMessage = await response.text();
                    if (errorMessage && errorMessage === "Player doesn't exist") {
                        console.log('Failed due to player not existing, creating player');
                        createPlayer();
                    }
                } else {
                    console.log('Towns data sent successfully');
                }
            }).catch(error => {
                console.error('Error sending towns data:', error);
            });
        };
    });
})();