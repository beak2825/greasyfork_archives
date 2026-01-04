// ==UserScript==
// @name         Implant QuickStats
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Change jolly, mutant, fortune implant stats on click while holding keys 1, 2, 3, 4, 5, or 6
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/543694/Implant%20QuickStats.user.js
// @updateURL https://update.greasyfork.org/scripts/543694/Implant%20QuickStats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This class is designed to temporarily disable dragging of implants when the keys 1 through 6 are pressed,
    // specifically when the info box indicates that the mouse is hovering over Jolly, Mutant, or Fortune implants.
    // Occasionally, Leaving dragging enabled did not update the implant stats correctly.
    // Therefore, this solution implements a mechanism to disable dragging temporarily to ensure proper functionality
    class DragController {
        constructor() {
            this.invC = document.getElementById("invController");
            this.isDragDisabled = false;
            this.init();
        }

        init() {
            this.addEventListeners();
            this.observeInfoBox();
        }

        addEventListeners() {
            window.addEventListener('keydown', this.checkKeyPress.bind(this));
            window.addEventListener('keyup', this.checkKeyRelease.bind(this));
        }

        disableDrag() {
            if (!this.isDragDisabled) {
                //console.log("Drag actions disabled.");
                if (unsafeWindow.dragStart) {
                    this.invC.removeEventListener("mousedown", unsafeWindow.dragStart, false);
                    this.isDragDisabled = true;
                } else {
                    console.error("dragStart function is not defined.");
                }
            }
        }

        enableDrag() {
            if (this.isDragDisabled) {
                //console.log("Drag actions enabled.");
                if (unsafeWindow.dragStart) {
                    this.invC.addEventListener("mousedown", unsafeWindow.dragStart, false);
                    this.isDragDisabled = false;
                } else {
                    console.error("dragStart function is not defined.");
                }
            }
        }

        checkKeyPress(event) {
            const keyPressed = event.key;
            const itemName = document.querySelector("#infoBox .itemName").textContent;

            if (keyPressed >= '1' && keyPressed <= '6' &&
                (itemName === "Mutant Implant" || itemName === "Jolly Implant" || itemName === "Fortune Implant")) {
                this.disableDrag();
            }
        }

        checkKeyRelease(event) {
            const keyReleased = event.key;
            if (keyReleased >= '1' && keyReleased <= '6') {
                this.enableDrag();
            }
        }

        observeInfoBox() {
            const infoBox = document.getElementById("infoBox");
            const observer = new MutationObserver(() => {
                const itemName = document.querySelector("#infoBox .itemName").textContent;
                if (itemName !== "Mutant Implant" && itemName !== "Jolly Implant" && itemName !== "Fortune Implant") {
                    this.enableDrag();
                }
            });

            observer.observe(infoBox, { childList: true, subtree: true });
        }
    }

    // Instantiate the DragController class
    new DragController();

    // Default key presets for all implants
    const defaultPresets = {
        key1: {
            jolly: "jollyimplant_stats1z4",
            mutant: "mutantimplant_statse1og",
            fortune: "fortuneimplant_statsb3jrb4"
        },
        key2: {
            jolly: "jollyimplant_stats4g",
            mutant: "mutantimplant_statsfsw",
            fortune: "fortuneimplant_statschhq8"
        },
        key3: {
            jolly: "jollyimplant_statsa",
            mutant: "mutantimplant_statshs",
            fortune: "fortuneimplant_statse1og"
        },
        key4: {
            jolly: "jollyimplant_statsa",
            mutant: "mutantimplant_statsk",
            fortune: "fortuneimplant_statsfsw"
        },
        key5: {
            jolly: "jollyimplant_statsa",
            mutant: "mutantimplant_statsk",
            fortune: "fortuneimplant_statshs"
        },
        key6: {
            jolly: "jollyimplant_statsa",
            mutant: "mutantimplant_statsk",
            fortune: "fortuneimplant_statsk"
        }
    };

    // Load presets from local storage or use defaults
    let presets = JSON.parse(localStorage.getItem('jollyImplantPresets'));

    // Check if presets exist, if not, initialize with default values
    if (!presets) {
        presets = defaultPresets;
        localStorage.setItem('jollyImplantPresets', JSON.stringify(presets));
    }
    // Track key states
    let keys = {
        key1: false,
        key2: false,
        key3: false,
        key4: false,
        key5: false,
        key6: false
    };

    // Listen for keydown and keyup events to track key states
    document.addEventListener('keydown', function(event) {
        if (event.key === '1') keys.key1 = true;
        if (event.key === '2') keys.key2 = true;
        if (event.key === '3') keys.key3 = true;
        if (event.key === '4') keys.key4 = true;
        if (event.key === '5') keys.key5 = true;
        if (event.key === '6') keys.key6 = true;
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === '1') keys.key1 = false;
        if (event.key === '2') keys.key2 = false;
        if (event.key === '3') keys.key3 = false;
        if (event.key === '4') keys.key4 = false;
        if (event.key === '5') keys.key5 = false;
        if (event.key === '6') keys.key6 = false;
    });

    // Function to serialize the request parameters
    function serializeObject(obj) {
        return Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');
    }
    // Function to hide the infoBox
    function hideInfoBox() {
        const infoBox = document.getElementById('infoBox');
        if (infoBox) {
            infoBox.style.visibility = 'hidden'; // Set visibility to hidden
            //console.log("InfoBox hidden."); // Debugging: log the action
        } else {
            console.error("InfoBox not found."); // Log an error if the element is not found
        }
    }

    // Function to make the implant slot glow with a specified color
    function glowColor(implant, color) {
        const slot = implant.closest('td'); // Get the closest td element (the slot)
        if (slot) {
            slot.style.transition = "background-color 0.1s ease"; // Smooth transition
            slot.style.backgroundColor = color; // Set the background color to the specified color
            setTimeout(() => {
                slot.style.backgroundColor = ""; // Reset the background color after 1 second
            }, 1000); // Duration for the glow effect
        }
    }

    // Function to update the data-type of implants with specified stats
    function updateImplant(newStats, implantType) {
        const implants = document.querySelectorAll(`div[data-type^="${implantType}"]`);
        implants.forEach(implant => {
            const currentType = implant.getAttribute('data-type');
            //console.log(`Current Type: ${currentType}`); // Debugging: log current type

            // Replace the stats part with the new stats provided
            const newType = currentType.replace(/_stats\w+$/, `_${newStats}`);
           //console.log(`New Type: ${newType}`); // Debugging: log new type

            // Update the data-type attribute
            implant.setAttribute('data-type', newType);

            // Optionally, update the displayed text if needed
            const displayElement = implant.querySelector('.item'); // Adjust selector as needed
            if (displayElement) {
                displayElement.textContent = newType; // Update displayed text
            }
        });
    }


    // Function to make the POST request
    function makeRequest(itemNum, currentStats, newStats, implantType) {
        const requestUrl = "https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php";
        const requestParams = {
            pagetime: unsafeWindow.userVars["pagetime"],
            templateID: "0",
            sc: unsafeWindow.userVars["sc"],
            creditsnum: "0",
            buynum: "0",
            renameto: "undefined",
            expected_itemprice: "-1",
            expected_itemtype2: newStats, // stats you're changing into
            expected_itemtype: currentStats, // implant stats current one's
            itemnum2: "0",
            itemnum: itemNum,
            price: "0",
            gv: "21",
            userID: unsafeWindow.userVars["userID"],
            password: unsafeWindow.userVars["password"],
            action: "mutate"
        };

        // Calculate the hash
        const payload = serializeObject(requestParams);
        const hash = unsafeWindow.hash(payload);
        const fullPayload = "hash=" + hash + "&" + payload;

        // Send the POST request
        GM_xmlhttpRequest({
            method: "POST",
            url: requestUrl,
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                "x-requested-with": "ImplantStatsHotKeys"
            },
            data: fullPayload,
            onload: function(response) {
                const implants = document.querySelectorAll(`div[data-type^="${implantType}"]`);
                implants.forEach(implant => {
                    const slot = implant.closest('td'); // Get the closest td element (the slot)

                    if (response.status === 200) {
                        //console.log("Request successful:", response.responseText);

                        // Check if responseText is defined
                        if (response.responseText) {
                            // Check if the response contains the expected format
                            //const match = response.responseText.match(/df_implant\d+_type=${implantType}_(\w+)&df_servertime=\d+&OK/);
                            const match = response.responseText.match(new RegExp(`df_implant\\d+_type=${implantType}_(\\w+)&df_servertime=\\d+&OK`));

                            if (match) {
                                const newStats = match[1]; // Extract the new stats (e.g., '1z4')
                                updateImplant(newStats, implantType); // Call the function to update the implant with new stats
                                hideInfoBox();
                                glowColor(slot, "green"); // Glow green on success
                            } else {
                                glowColor(slot, "red"); // Glow red if response is successful but format is unexpected
                            }
                        } else {
                            console.error("Response text is undefined.");
                            glowColor(slot, "red"); // Glow red if response text is undefined
                        }
                    } else {
                        console.error("Request failed:", response.status, response.statusText);
                        glowColor(slot, "red"); // Glow red on request failure
                    }
                });
            }
        });
    }

    function confirmSetNewStats(keyPressed, implantName, currentStats) {
        return new Promise((resolve) => {
            // Create the dialog elements
            const prompt = document.createElement('div');
            prompt.id = 'prompt';
            prompt.style.display = 'block'; // Set to block to make it visible

            const gameContent = document.createElement('div');
            gameContent.id = 'gamecontent';
            gameContent.tabIndex = 0; // Make it focusable
            //gameContent.className = 'warning redhighlight'; // Add classes for styling
            gameContent.style.position = 'relative'; // Position relative for absolute children
            gameContent.style.textAlign = 'center'; // Center text

            const message = document.createElement('div');
            // Truncate if longer than 100 characters
            if (currentStats.length > 100) {
                currentStats = currentStats.substring(0, 100) + '...'; // Truncate and append "..."
                message.innerHTML = `Set ${keyPressed} For ${implantName}: <span style="text-decoration-color: #D20303; color: #12FF00;">${currentStats}</span>`;
            }
            else{
                message.innerHTML = `Set ${keyPressed} For ${implantName}: <span style="text-decoration-color: #D20303; color: #12FF00;">${currentStats}</span> ?`;
            }

            const yesButton = document.createElement('button');
            yesButton.textContent = 'Yes';
            yesButton.style.position = 'absolute';
            yesButton.style.left = '86px';
            yesButton.style.bottom = '8px';

            const noButton = document.createElement('button');
            noButton.textContent = 'No';
            noButton.style.position = 'absolute';
            noButton.style.bottom = '8px';
            noButton.style.right = '86px';

            // Append elements to the dialog
            gameContent.appendChild(message);
            gameContent.appendChild(yesButton);
            gameContent.appendChild(noButton);
            prompt.appendChild(gameContent);

            // Append the dialog to the invController div
            const invController = document.getElementById('invController');
            invController.appendChild(prompt);

            // Handle Yes button click
            yesButton.onclick = function() {
                // Remove the dialog
                invController.removeChild(prompt);
                resolve(true); // Resolve the promise with true
            };

            // Handle No button click
            noButton.onclick = function() {
                // Remove the dialog
                invController.removeChild(prompt);
                resolve(false); // Resolve the promise with false
            };
        });
    }
    // Function to extract stats from the info box
    function extractStats() {
        const infoBox = document.getElementById('infoBox');
        if (!infoBox) return ""; // Return empty string if infoBox is not found

        const itemName = infoBox.querySelector('.itemName').textContent.trim();
        const itemData = infoBox.querySelectorAll('.itemData');

        let currentStats = []; // Initialize currentStats as an array

        // Check for specific item names
        if (itemName === 'Mutant Implant' || itemName === 'Jolly Implant' || itemName === 'Fortune Implant') {
            // Loop through itemData to find the relevant stats
            itemData.forEach(data => {
                // Extract the text content if it contains a "+" sign
                if (data.textContent.includes('+')) {
                    currentStats.push(data.textContent.trim()); // Append to the array
                }
            });
        }

        // Join the stats into a single string
        const statsOutput = currentStats.join(', ');

        // Log the currentStats to the console
        //console.log("Current Stats:", statsOutput || "No relevant stats found.");

        // Log the entire content of the info box
        //console.log("Info Box Content:", infoBox.innerHTML);

        // Return the currentStats or an empty string if not found
        return statsOutput || "";
    }
    // Delay execution to ensure the DOM is fully loaded
    setTimeout(function() {
        //console.log("Script is running and DOM is loaded.");

        // Right-click detection for the main document
        document.getElementById("inventoryholder").addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Prevent the default context menu from appearing
            //console.log('Right-click detected in main inventory holder');

            // Check if the right-clicked element is an implant
            const target = event.target.closest('.item'); // Find the closest item element
            if (target) {
                const implantType = target.getAttribute('data-type'); // Get the data-type attribute
                if (!implantType.startsWith('jollyimplant') && !implantType.startsWith('mutantimplant') && !implantType.startsWith('fortuneimplant')) {
                    //console.log("Not a valid implant. Current Stats:", implantType);
                    return;
                }
            } else {
                //console.log('Right-click detected in main inventory holder, but not on an implant.');
                return;
            }

            // Check if a key is pressed
            let keyPressed = Object.keys(keys).find(key => keys[key]);
            if (keyPressed) {
                const slot = event.target.closest('.validSlot'); // Get the closest valid slot
                if (slot) {
                    // Calculate the item number based on the data-slot attribute
                    let itemNum = parseInt(slot.getAttribute('data-slot')) + 1000;
                    //console.log(itemNum);

                    // Get the current stats of the implant from the data-type attribute
                    //let currentStats = slot.querySelector('.item').getAttribute('data-type');
                    // Run the function to extract stats and store the result
                    const currentStats = extractStats();
                    // Get the current stats of the implant from the data-type attribute
                    let currentStatsencrypted = slot.querySelector('.item').getAttribute('data-type');

                    // Set stats to an empty string if no relevant stats are found
                    const finalStats = currentStats ? currentStats : "";
                    // Get the name of the implant
                    const implantNameFull = document.querySelector('.itemName').textContent;
                    //const implantName = slot.querySelector('.item').textContent;

                    hideInfoBox();
                    // Confirm the action with the user
                    confirmSetNewStats(keyPressed, implantNameFull, currentStats).then((confirmed) => {
                        if (confirmed) {
                            // Update the preset with the current stats for the specific implant type
                            if (currentStatsencrypted.startsWith('jollyimplant')) {
                                presets[keyPressed].jolly = currentStatsencrypted;
                            } else if (currentStatsencrypted.startsWith('mutantimplant')) {
                                presets[keyPressed].mutant = currentStatsencrypted;
                            } else if (currentStatsencrypted.startsWith('fortuneimplant')) {
                                presets[keyPressed].fortune = currentStatsencrypted;
                            }
                            // Save the updated presets to local storage
                            localStorage.setItem('jollyImplantPresets', JSON.stringify(presets));
                            console.log(`Updated ${keyPressed} for ${implantNameFull} to ${currentStatsencrypted}`);
                        }
                    });
                }
            }
        });

        // Select all valid implant slots within the #implants container
        document.querySelectorAll('#implants .validSlot').forEach(slot => {
            // Add a click event listener to each slot
            slot.addEventListener('click', function(event) {
                // Calculate the item number based on the data-slot attribute
                let itemNum = parseInt(this.getAttribute('data-slot')) + 1000;
                //console.log(itemNum);

                // Get the current stats of the implant from the data-type attribute
                let currentStats = this.querySelector('.item').getAttribute('data-type');

                // Check if the current implant is one of the valid implants
                if (!currentStats.startsWith('jollyimplant') && !currentStats.startsWith('mutantimplant') && !currentStats.startsWith('fortuneimplant')) {
                    //console.log("Not a valid implant. Current Stats:", currentStats);
                    return; // Exit if it's not a valid implant
                }

                // Variable to hold the new stats based on key presses
                let newStats;

                // If left-click, determine which key is pressed and use the corresponding preset stats
                if (keys.key1) {
                    newStats = presets.key1.jolly; // Key 1 for jolly implant
                } else if (keys.key2) {
                    newStats = presets.key2.jolly; // Key 2 for jolly implant
                } else if (keys.key3) {
                    newStats = presets.key3.jolly; // Key 3 for jolly implant
                } else if (keys.key4) {
                    newStats = presets.key4.jolly; // Key 4 for jolly implant
                } else if (keys.key5) {
                    newStats = presets.key5.jolly; // Key 5 for jolly implant
                } else if (keys.key6) {
                    newStats = presets.key6.jolly; // Key 6 for jolly implant
                } else {
                    //console.log("No valid key pressed.");
                    return; // No valid key pressed
                }

                // Check if the current implant is a mutant or fortune implant
                if (currentStats.startsWith('mutantimplant')) {
                    if (keys.key1) {
                        newStats = presets.key1.mutant; // Key 1 for mutant implant
                    } else if (keys.key2) {
                        newStats = presets.key2.mutant; // Key 2 for mutant implant
                    } else if (keys.key3) {
                        newStats = presets.key3.mutant; // Key 3 for mutant implant
                    } else if (keys.key4) {
                        newStats = presets.key4.mutant; // Key 4 for mutant implant
                    } else if (keys.key5) {
                        newStats = presets.key5.mutant; // Key 5 for mutant implant
                    } else if (keys.key6) {
                        newStats = presets.key6.mutant; // Key 6 for mutant implant
                    }
                } else if (currentStats.startsWith('fortuneimplant')) {
                    if (keys.key1) {
                        newStats = presets.key1.fortune; // Key 1 for fortune implant
                    } else if (keys.key2) {
                        newStats = presets.key2.fortune; // Key 2 for fortune implant
                    } else if (keys.key3) {
                        newStats = presets.key3.fortune; // Key 3 for fortune implant
                    } else if (keys.key4) {
                        newStats = presets.key4.fortune; // Key 4 for fortune implant
                    } else if (keys.key5) {
                        newStats = presets.key5.fortune; // Key 5 for fortune implant
                    } else if (keys.key6) {
                        newStats = presets.key6.fortune; // Key 6 for fortune implant
                    }
                }

                // Check if newStats is defined
                if (!newStats) {
                    //console.log("New Stats is undefined for the current implant type.");
                    return; // Exit if newStats is undefined
                }

                // Make the request with the determined parameters
                makeRequest(itemNum, currentStats, newStats, currentStats.split('_')[0]); // Pass the implant type
                unsafeWindow.updateAllFields(); // Update any necessary fields in the game
            });
        });
    }, 1000); // Delay to ensure the DOM is fully loaded
})();

