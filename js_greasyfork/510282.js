// ==UserScript==
// @name         Grepolis Notepad Rood Forum testen draggable
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a draggable notepad with template and a custom image button in Grepolis
// @author       Joppie
// @icon         https://i.postimg.cc/J4V3PQ0P/note-button.png
// @match        *://*.grepolis.com/*
// @match        *://*.grepolis.com/game*
// @grant        GM_xmlhttpRequest
// @connect      *.grepolis.com
// @downloadURL https://update.greasyfork.org/scripts/510282/Grepolis%20Notepad%20Rood%20Forum%20testen%20draggable.user.js
// @updateURL https://update.greasyfork.org/scripts/510282/Grepolis%20Notepad%20Rood%20Forum%20testen%20draggable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uw = unsafeWindow;
    let notepadOpen = false;  // Track the state of the notepad

    // Function to create the button in the Grepolis UI
    function createButton() {
        const buttonHTML = `
            <div id="notepad_button" style="position:fixed; bottom:10px; left:150px; width:50px; height:50px; background:url('https://i.postimg.cc/J4V3PQ0P/note-button.png') no-repeat center center; background-size: contain; cursor:pointer; z-index:9999;">
            </div>`;
        $('body').append(buttonHTML);

        // Add click event to the button to toggle the notepad
        $('#notepad_button').on('click', function() {
            if (!notepadOpen) {
                createNotepad();
            } else {
                $('#notepad_container').remove();
            }
            notepadOpen = !notepadOpen;
        });
    }

    function formatUnits(units) {
        let LT = 0;  // Sum of land units: sword, archer, hoplite, chariot
        const landUnits = ['sword', 'archer', 'hoplite', 'chariot'];
        let bireme = units.bireme || 0;
        let trireme = units.trireme || 0;
        let demolition_ship = units.demolition_ship || 0;
        let pegasus = units.pegasus || 0;
        let cerberus = units.cerberus || 0;
        let calydonian_boar = units.calydonian_boar || 0;
        let zyklop = units.zyklop || 0;
        let centaur = units.centaur || 0;
        let hydra = units.hydra || 0;
        let siren = units.siren || 0;

        landUnits.forEach(unit => {
            if (units[unit]) {
                LT += units[unit];
            }
        });

        // Collecting unit strings only if the count is greater than zero
        const unitStrings = [];

        if (LT > 0) unitStrings.push(`${LT} LT`);
        if (bireme > 0) unitStrings.push(`${bireme} Bir`);
        if (trireme > 0) unitStrings.push(`${trireme} Tri`);
        if (demolition_ship > 0) unitStrings.push(`${demolition_ship} Bran`);
        if (pegasus > 0) unitStrings.push(`${pegasus} Pega`);
        if (cerberus > 0) unitStrings.push(`${cerberus} Cerb`);
        if (calydonian_boar > 0) unitStrings.push(`${calydonian_boar} Zwijn`);
        if (zyklop > 0) unitStrings.push(`${zyklop} Cyclop`);
        if (centaur > 0) unitStrings.push(`${centaur} Centaur`);
        if (hydra > 0) unitStrings.push(`${hydra} Hydra`);
        if (siren > 0) unitStrings.push(`${siren} Sirene`);

        // Join all unit strings with a comma and a space completed
        let OS = unitStrings.join(', ');

        return OS ? `${OS}` : "Geen"; // Return "Geen" if no units are present
    }

    // Function to format the researches using the attributes from the town model
    function formatResearches(researchesAttributes) {
        let researchInfo = "Ontwikkelingen: ";

        // Mapping research keys to their respective names
        const researchNames = {
            phalanx: "Falanx",
            ram: "Stormram",
            divine_selection: "Goddelijke selectie"
        };

        // Specific researches to check
        const specificResearches = ['phalanx', 'ram', 'divine_selection'];

        // Collecting researches that are present in the town's attributes
        const activeResearches = [];

        specificResearches.forEach(research => {
            if (researchesAttributes[research]) {
                activeResearches.push(researchNames[research]);  // Push the mapped name
            }
        });

        // Join the active researches with a comma, if any, otherwise return "Geen"
        researchInfo += activeResearches.length > 0 ? activeResearches.join(', ') : "Geen";

        return researchInfo;
    }

    // Function to format and fetch town info
    function formatTownInfo(townId, townName) {
        return `Aangevallen stad: [town]${townId}[/town]\nTown Name: ${townName}`;
    }

    // Define the buildings list to fetch levels for
    function getBuildingsList() {
        return ['wall', 'tower'];
    }

    // Function to format building levels
    function formatBuildingLevels(buildingsList, townModel) {
        let formattedBuildings = "";

        // Get the level of the wall
        let wallLevel = townModel.buildings().getBuildingLevel('wall') || 0;
        formattedBuildings += `Muur: ${wallLevel}\n`;

        // Get the level of the tower and format accordingly
        let towerLevel = townModel.buildings().getBuildingLevel('tower') || 0;
        let towerStatus = towerLevel === 1 ? "ja" : "nee";
        formattedBuildings += `Toren: ${towerStatus}`;

        return formattedBuildings;
    }

    // Function to generate the town info text and display it in the notepad
    function generateTownInfoText(townId, townName, buildingsList, townGod, callback) {
        if (!townId || !townName || !buildingsList || townGod === undefined) {
            console.error("Invalid Town Info:", townId, townName, buildingsList, townGod);
            alert("Unable to fetch the current town info!");
            return;
        }

        var formattedTownInfo = formatTownInfo(townId, townName);
        var townModel = uw.ITowns.getTown(townId);
        var formattedBuildingLevels = formatBuildingLevels(buildingsList, townModel);
        var godInfo = `${townGod}`;

        var townUnits = townModel.units();
        var formattedUnits = formatUnits(townUnits);

        var townResearches = townModel.researches().attributes;
        var formattedResearches = formatResearches(townResearches);

        const wallLevel = townModel.buildings().getBuildingLevel('wall');
        const OS_need = wallLevel < 16 ? "BIR" : "LT";

        let cityDetails = `
Aangevallen stad: [town]${townId}[/town]
${formattedBuildingLevels}
God: ${godInfo}
${formattedResearches}
OS: ${formattedUnits}
Stadsbescherming:

Fase 2 begint om:
Fase 2 eindigt om:

*Opstandsrapport(ten)!!!*
`;

        fetchCoordinates(townId)
            .then(coordinatesData => {
                var fullData = `Dag | ${coordinatesData} | ${townName} | start F2 | ${OS_need}\n\n[*]nr[|]${coordinatesData}[|]start F2[|][town]${townId}[/town][|]${wallLevel}[|]${godInfo}[|]aanvallende speler[|]${OS_need}[|]${formattedUnits}[|]Notes[/*]\n${cityDetails}`;
                callback(fullData);  // Pass the fullData to the callback function
            })
            .catch(err => {
                console.error("Error fetching coordinates: ", err);
                alert("Failed to fetch coordinates.");
            });
    }

     // Function to create the notepad HTML structure
    function createNotepad() {
        const townName = getCurrentTownName();
        const townGod = getCurrentTownGod();
        const townId = getCurrentTownId();
        const buildingsList = getBuildingsList();

        const notepadHTML = `
            <div id="notepad_container" style="position:fixed; top:10%; left:20%; width:700px; height:450px; background-color:skyblue; border:1px solid black; z-index:9999; padding:10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5); cursor: move;">
                <textarea id="notepad_textarea" style="width:100%; height:80%;"></textarea>
                <br>
                <button id="copy_button">Copy to Clipboard</button>
                <button id="clear_button">Clear Notepad</button>
                <button id="close_notepad">Close</button>
                <div style="border-top: 1px solid black; padding-top: 5px; margin-top: 5px; text-align: center;">
                Bij openen laad de notepad het rood format met de gegevens van huidige stad.
                Vul aan op de gewenste plaatsen. Copy to clipboard en paste ingame.
                De eerste regel is topic titel.
                </div>
              </div>`;

        $('body').append(notepadHTML);

        // Make notepad draggable
        makeDraggable($('#notepad_container')[0]);

        // Populate textarea with current town info
        generateTownInfoText(townId, townName, buildingsList, townGod, (fullData) => {
            $('#notepad_textarea').val(fullData);
        });

        // Close notepad functionality
        $('#close_notepad').on('click', function() {
            $('#notepad_container').remove();
            notepadOpen = false;
        });

        // Copy to clipboard functionality
        $('#copy_button').on('click', function() {
            const textToCopy = $('#notepad_textarea').val();
            navigator.clipboard.writeText(textToCopy).then(function() {
                alert('Copied to clipboard!');
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        });

        // Clear button functionality
        $('#clear_button').on('click', function() {
            $('#notepad_textarea').val(''); // Clear the textarea
        });
    }

    // Function to make an element draggable
    function makeDraggable(element) {
        let offsetX, offsetY;

        element.onmousedown = function(event) {
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;

            document.onmousemove = function(event) {
                element.style.left = (event.clientX - offsetX) + 'px';
                element.style.top = (event.clientY - offsetY) + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        element.ondragstart = function() {
            return false; // Prevent default drag behavior
        };
    }

     // Get the current town ID
    function getCurrentTownId() {
        return uw.Game.townId || null;
    }

    // Get the current town name
    function getCurrentTownName() {
        return uw.Game.townName || "No Name assigned";
    }

    // Get the current town's god
    function getCurrentTownGod() {
        const townId = uw.Game.townId;
        if (townId !== undefined) {
            return uw.ITowns.getTowns()[townId].god() || "No God assigned";
        }
        return "No God assigned";
    }

function fetchCoordinates(townId) {
    return new Promise((resolve, reject) => {
        const worldId = uw.Game.world_id;  // Get the world ID
        const url = `https://${worldId}.grepolis.com/data/towns.txt`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const lines = response.responseText.split('\n');
                    const matchingLine = lines.find(line => line.startsWith(townId));

                    if (matchingLine) {
                        const parts = matchingLine.split(',');
                        if (parts.length >= 5) {
                            const x = parts[3];
                            const y = parts[4];

                            // Correct usage of template literals
                            const OC = `${x.charAt(0)}${y.charAt(0)}`;

                            // Assign OC directly to coordinatesData
                            const coordinatesData = OC;

                            resolve(coordinatesData);
                        } else {
                            reject('Line format is incorrect. Unable to extract coordinates.');
                        }
                    } else {
                        reject(`No line found that starts with ${townId}.`);
                    }
                } else {
                    reject('Error fetching data: ' + response.status);
                }
            },
            onerror: function(err) {
                reject('Request failed: ' + err);
            }
        });
    });
}


    // Function to get the current world ID
    function getWorldId() {
        const worldId = uw.Game.world_id || 'nl116';
        return worldId;
    }

    // Wait for the document to be fully loaded before creating the button
    $(document).ready(function() {
        createButton();
    });

})();
