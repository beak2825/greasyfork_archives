// ==UserScript==
// @name         Grepolis Notepad Forum Template 3
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Generates a forum template for Grepolis with units, building data, town god, and OC.
// @author       Joppie
// @icon         https://i.postimg.cc/7Pzd6360/def-button-2.png
// @match        *://*.grepolis.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/512594/Grepolis%20Notepad%20Forum%20Template%203.user.js
// @updateURL https://update.greasyfork.org/scripts/512594/Grepolis%20Notepad%20Forum%20Template%203.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const uw = unsafeWindow; // Define uw as a shortcut

    const specialUnits = [
        'agamemnon', 'ajax', 'alexandrios', 'hector', 'heracles', 'leonidas',
        'lysippe', 'melousa', 'mihalis', 'pelops', 'perseus', 'telemachos',
        'themistokles', 'urephon', 'zuretha','andromeda', 'anysia', 'argos', 'apheledes', 'aristotle', 'atalanta', 'chiron', 'christopholus',
        'daidalos', 'democritus', 'deimos', 'eurybia', 'ferkyon', 'helen', 'iason', 'medea', 'odysseus',
        'orpheus', 'pariphaistes', 'philoctetes', 'rekonos', 'terylea', 'ylestres'
    ];

    // Function to fetch coordinates and return OC
    function fetchCoordinates(townId) {
    return new Promise((resolve, reject) => {
        const worldId = uw.Game.world_id; // Get the world ID
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
                            let x = parts[3]; // X coordinate
                            let y = parts[4]; // Y coordinate

                            // Ensure x and y are padded to 3 digits if necessary
                            x = x.padStart(3, '0');
                            y = y.padStart(3, '0');

                            // Calculate OC (Ocean Code) by taking the first digit of both x and y
                            const OC = `${x.charAt(0)}${y.charAt(0)}`;

                            // Debugging logs
                            console.log(`Town ID: ${townId}`);
                            console.log(`X: ${x}, Y: ${y}`);
                            console.log(`OC: ${OC}`); // Log the calculated OC

                            resolve(OC);
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

    // Function to retrieve current town ID and name
    function getCurrentTownData() {
        const currentTown = uw.ITowns.getCurrentTown(); // Accessing via uw
        if (currentTown) {
            return {
                townId: currentTown.id,
                townName: currentTown.name,
            };
        }
        return {
            townId: 'Unknown',
            townName: 'Unknown',
        };
    }

    // Function to get the current town's god
    function getCurrentTownGod() {
        const townId = uw.Game.townId;
        if (townId !== undefined) {
            return uw.ITowns.getTowns()[townId].god() || "No God assigned";
        }
        return "No God assigned";
    }

    // Function to retrieve building data and generate the template, including osNeed
    function retrieveBuildingPlaceData() {
        const buildingPlaceData = uw.BuildingPlace?.index_data; // Accessing via uw
        let output = '';

        // Get current town data
        const { townId } = getCurrentTownData();

        // Add "Aangevallen stad" line to the output
        output += `Aangevallen stad: [town]${townId}[/town]\n`;

        // Add "God" line to the output
        const currentTownGod = getCurrentTownGod();
        output += `God: ${currentTownGod}\n`;

        let osLine = ''; // To store the generated OS line

        if (buildingPlaceData && buildingPlaceData.all_units) {
            const units = buildingPlaceData.all_units;

            // Sum LT units
            const ltUnits = ['sword', 'archer', 'hoplite', 'chariot'];
            let ltSum = ltUnits.reduce((sum, unit) => sum + (units[unit] || 0), 0);

            // Map other specific units
            const bireme = units['bireme'] || 0;
            const trireme = units['trireme'] || 0;
            const demolitionShip = units['demolition_ship'] || 0;
            const pegasus = units['pegasus'] || 0;
            const cerberus = units['cerberus'] || 0;
            const calydonianBoar = units['calydonian_boar'] || 0;

            // Check if all unit sums are zero
            if (ltSum === 0 && bireme === 0 && trireme === 0 && demolitionShip === 0 &&
                pegasus === 0 && cerberus === 0 && calydonianBoar === 0) {
                osLine = 'geen';
            } else {
                osLine = `${ltSum} LT`;
                if (bireme > 0) osLine += `, ${bireme} Bir`;
                if (trireme > 0) osLine += `, ${trireme} Tri`;
                if (demolitionShip > 0) osLine += `, ${demolitionShip} Bran`;
                if (pegasus > 0) osLine += `, ${pegasus} Pega`;
                if (cerberus > 0) osLine += `, ${cerberus} Cerb`;
                if (calydonianBoar > 0) osLine += `, ${calydonianBoar} Zwijn`;

                osLine += '';
            }

            // Append OS line to the output
            output += 'OS: ' + osLine + '\n';

            // Determine wall level and calculate OS_nodig
            const wallLevel = retrieveWallLevel(); // Get wall level
            const osNeed = wallLevel < 16 ? "BIR" : "LT"; // Set OS_nodig based on wall level
            output += `OS nodig: ${osNeed}\n`; // Output the osNeed line

            let heroFound = false; // Track if any hero is found

            for (const unit of specialUnits) {
                const unitLevel = units[unit] || 0;
                console.log(`Unit: ${unit}, Level: ${unitLevel}`); // Debug log
                if (unitLevel > 0) {
                    output += `Held: ${unit}, level ${unitLevel}\n`;
                    heroFound = true; // Set to true if any hero is found
                }
            }

            // If no hero was found, add a fallback message or skip the hero section
            if (!heroFound) {
                output += `Held: geen\n`; // You can replace 'geen' with any fallback message you'd like
            }

            return { output, osNeed, osLine }; // Return output, osNeed, and osLine
        } else {
            return { output: 'No units available', osNeed: 'Unknown', osLine: 'OS: geen' };
        }
    }

    // Retrieve the wall level
    function retrieveWallLevel() {
        const { townId } = getCurrentTownData();
        const townModel = uw.ITowns.getTown(townId); // Access the town model

        if (townModel) {
            return townModel.buildings().getBuildingLevel('wall') || 0;
        }
        return 0; // Default wall level if the model is not found
    }

    // Retrieve building levels
    function retrieveBuildingLevels() {
        const { townId } = getCurrentTownData();
        const townModel = uw.ITowns.getTown(townId); // Access the town model

        if (!townModel) return 'No building data available\n';

        let formattedBuildings = '';
        let wallLevel = townModel.buildings().getBuildingLevel('wall') || 0;
        formattedBuildings += `Muur: ${wallLevel}\n`;

        let towerLevel = townModel.buildings().getBuildingLevel('tower') || 0;
        let towerStatus = towerLevel === 1 ? "ja" : "nee";
        formattedBuildings += `Toren: ${towerStatus}`;

        return formattedBuildings;
    }

    // Function to retrieve and format researches for the current town
    function getTownResearches() {
    const { townId } = getCurrentTownData();
    const townModel = uw.ITowns.getTown(townId); // Access the town model

    if (townModel) {
        const researches = townModel.researches().attributes;

        // Only keep the three specific researches you're interested in
        const researchNames = {
            phalanx: "Falanx",
            ram: "Stormram",
            divine_selection: "Goddelijke selectie"
        };

        // Filter the active researches to include only the relevant ones
        let completedResearches = Object.keys(researches)
            .filter(research => researchNames[research] && researches[research] === true);

        // Format the completed researches into a string
        let formattedResearches = completedResearches
            .map(research => researchNames[research]) // Translate to Dutch names
            .join(', ');

        return formattedResearches ? `Ontwikkelingen: ${formattedResearches}` : "Ontwikkelingen: geen";
    }
    return "Ontwikkelingen: geen";
}

    // Open the Place window and retrieve data
    function openPlaceWindow(callback) {
        if (typeof uw.PlaceWindowFactory !== 'undefined') {
            uw.PlaceWindowFactory.openPlaceWindow('index');

            const checkPlaceWindowInterval = setInterval(() => {
                const placeWindow = document.querySelector(".place_window_background");
                if (placeWindow) {
                    const { output, osNeed, osLine } = retrieveBuildingPlaceData();
                    const buildingData = retrieveBuildingLevels();
                    callback(output + '\n' + buildingData, osNeed, osLine );

                    minimizePlaceWindow();
                    clearInterval(checkPlaceWindowInterval);
                }
            }, 500);
        } else {
            console.error("PlaceWindowFactory is not available.");
            setTimeout(() => openPlaceWindow(callback), 500);
        }
    }

	    // Function to minimize the Place window
    function minimizePlaceWindow() {
        const placeWindow = document.querySelector('#place_defense').closest('.ui-dialog');
        if (placeWindow) {
            const minimizeButton = placeWindow.querySelector('.ui-dialog-titlebar-minimize');
            if (minimizeButton) {
                minimizeButton.click(); // Click the minimize button
            } else {
                console.error("Minimize button not found.");
            }
        } else {
            console.error("Place window not found for minimizing.");
        }
    }
 // Function to add a button to the BBCode wrapper
    function addButtonToBBWrapper() {
        const bbButtonWrapper = document.querySelector("#bbcodes > div");
        const textArea = document.querySelector("#forum_post_textarea");
        const titleField = document.querySelector("#forum_thread_name");

        // Only add the button if the BBCode wrapper and textarea exist, and the button isn't already present
        if (bbButtonWrapper && textArea && titleField && !document.querySelector('.template_button')) {
            let button = document.createElement('a');
            button.href = '#';
            button.className = 'bbcode_option template_button';
            button.title = 'Insert ROOD Template';
            button.style.cursor = 'pointer';
            button.style.display = 'inline-block';

            let buttonImage = document.createElement('img');
            buttonImage.src = 'https://i.postimg.cc/7Pzd6360/def-button-2.png';
            buttonImage.style.width = '23px';
            buttonImage.style.height = '23px';
            buttonImage.alt = 'Insert Template with Game Data';
            button.appendChild(buttonImage);

            bbButtonWrapper.appendChild(button);

            button.addEventListener('click', function (e) {
                e.preventDefault();

                const { townId, townName } = getCurrentTownData();
                const god = getCurrentTownGod(); // Fetch the god of the current town
                const townResearches = getTownResearches(); // Fetch the town researches

                fetchCoordinates(townId).then(OC => {
                    const wallLevel = retrieveWallLevel(); // Fetch wall level here
                    const buildingData = retrieveBuildingLevels(); // Get building levels like wall and tower

                    openPlaceWindow(function (gameData, osNeed, osLine) {
                        const titleTemplate = `${OC} | ${townName} | hh:mm:ss | ${osNeed}`;

                        // New Post Template
const postTemplate = `
[*]nr[|]${OC}[|]start F2[|][town]${townId}[/town][|]${wallLevel}[|]${god}[|]aanvallende speler[|]${osNeed}[|]${osLine}[|]Notes[/*]

Aangevallen stad: [town]${townId}[/town]
God: ${god}
${buildingData}
${gameData.match(/Held: .+/)}
${townResearches}

OS aanwezig: ${osLine}
OS nodig: ${osNeed}

Stadsbescherming:

Fase 2 begint om:
Fase 2 eindigt om:

[spoiler=Rapporten]
*Opstandsrapport(ten)!!!*
[/spoiler]
`;
                        // Update both title and post template every time the button is clicked
                        titleField.value = titleTemplate; // Always update the title
                        textArea.value = postTemplate.trim(); // Set the formatted post in the text area
                    });
                }).catch(error => {
                    console.error('Failed to fetch coordinates: ', error);
                });
            });

            console.log("Button added successfully.");
        }
    }

    // MutationObserver to watch for forum content changes
    const observer = new MutationObserver((mutations) => {
        const bbButtonWrapper = document.querySelector("#bbcodes > div");
        const textArea = document.querySelector("#forum_post_textarea");
        const titleField = document.querySelector("#forum_thread_name");

        if (bbButtonWrapper && textArea && titleField) {
            addButtonToBBWrapper();
        }
    });

    // Start observing the document for changes in the body
    observer.observe(document.body, { childList: true, subtree: true });

    // Optional: Re-add button on hash change (navigation change within the game)
    window.addEventListener('hashchange', function () {
        setTimeout(addButtonToBBWrapper, 500); // Timeout to ensure content is fully loaded before adding the button
    });

})();