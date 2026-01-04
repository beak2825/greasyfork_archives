// ==UserScript==
// @name        c.ai Neo Panel Add Favorites
// @namespace   c.ai Neo Panel Add Favorites
// @match       https://*.character.ai/*
// @version      1.0
// @license      MIT
// @description  Enables you to add favorites
// @author       vishanka
// @icon         https://i.imgur.com/iH2r80g.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475308/cai%20Neo%20Panel%20Add%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/475308/cai%20Neo%20Panel%20Add%20Favorites.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Check if local storage already has the data and initialize the object
    var storedData = JSON.parse(localStorage.getItem('interception_data_generate_turn')) || [];

    var original_prototype_open = XMLHttpRequest.prototype.open;
    var interception_data_generate_turn = {};

    var currentEntry = {}; // Object to store the current data entry

    // Function to handle storing the data into a local variable
function storeData() {
    if (Object.keys(currentEntry).length > 0) {
        // Check if the current entry already exists in storedData
        const entryIndex = storedData.findIndex((entry) => {
            return (
                entry.external_id === currentEntry.external_id &&
                entry.name === currentEntry.name
            );
        });

        if (entryIndex !== -1) {
            // Entry already exists, so remove it
            storedData.splice(entryIndex, 1);
        } else {
            // Entry doesn't exist, so push it
            storedData.push(currentEntry);
        }

        localStorage.setItem('interception_data_generate_turn', JSON.stringify(storedData));

    }
}



    XMLHttpRequest.prototype.open = function (method, url, async) {
        if (
            url.startsWith('https://plus.character.ai/chat/character/info') ||
            url.startsWith('https://beta.character.ai/chat/character/info')
        ) {
            this.addEventListener('load', function () {
            let info = JSON.parse(this.responseText);
            interception_data_generate_turn.external_id = info.character.external_id;
            interception_data_generate_turn.name = info.character.name;
            interception_data_generate_turn.avatar_file_name = info.character.avatar_file_name;

            // Assign the values to currentEntry as well
            currentEntry.external_id = info.character.external_id;
            currentEntry.name = info.character.name;
            currentEntry.avatar_file_name = info.character.avatar_file_name;

            // Log currentEntry to see the values
            console.log("currentEntry:", currentEntry);
            });
        } else if (url.startsWith(`https://neo.character.ai/chats/recent/${interception_data_generate_turn.external_id}`)) {
            this.addEventListener('load', function () {
                let info3 = JSON.parse(this.responseText);
                interception_data_generate_turn.chat_id = info3.chats[0].chat_id;
                console.log("chat_id:", interception_data_generate_turn.chat_id);
            });
        } else if (url.startsWith(`https://neo.character.ai/turns/${interception_data_generate_turn.chat_id}`)) {
            this.addEventListener('load', function () {
                let info4 = JSON.parse(this.responseText);
                interception_data_generate_turn.turn_id = info4.turns[0].turn_key.turn_id;
                interception_data_generate_turn.total_turns = info4.turns.length;
                interception_data_generate_turn.turns_name = info4.turns[0].author.name;
                console.log("turn_id:", interception_data_generate_turn.turn_id);
                console.log("total_turns:", interception_data_generate_turn.total_turns);
                console.log("turns_name:", interception_data_generate_turn.turns_name);

                // Extract data from the last turn_id if there are turns
                if (interception_data_generate_turn.total_turns > 0) {
                    const lastTurnIndex = interception_data_generate_turn.total_turns - 1;
                    const lastTurnData = info4.turns[lastTurnIndex];
                    interception_data_generate_turn.lastTurnId = lastTurnData.turn_key.turn_id; // Store lastTurnId in interception_data_generate_turn
                    console.log("Last turn_id:", interception_data_generate_turn.lastTurnId);
                }

                // Extract candidates for "turn 0", used for fetching limit
                if (interception_data_generate_turn.total_turns > 0) {
                    const firstTurnData = info4.turns[0];
                    interception_data_generate_turn.candidatesForTurn0 = firstTurnData.candidates;
                    interception_data_generate_turn.numberOfCandidatesForTurn0 = interception_data_generate_turn.candidatesForTurn0.length;
                    console.log("Number of candidates for turn 0:", interception_data_generate_turn.numberOfCandidatesForTurn0);
                }

                XHR_interception_resolve(interception_data_generate_turn);
            });
        }
        original_prototype_open.apply(this, [method, url, async]);
    };

    let XHR_interception_resolve;
    const XHR_interception_promise = new Promise(function (resolve, reject) {
        XHR_interception_resolve = resolve;
    });

    XHR_interception_promise.then(function () {
        console.log("interception_data_generate_turn:", interception_data_generate_turn);
        // Add a clickable button to show the data in a new tab

// Create a separate button with a star icon
const storeDataButton = document.createElement('div');
storeDataButton.innerHTML = '⭐'; // Use the star character as content
storeDataButton.style.position = 'relative';
storeDataButton.style.fontSize = '18px'; // Adjust the size of the star
storeDataButton.style.lineHeight = '18px'; // Center the star vertically
storeDataButton.style.width = '18px'; // Set a fixed width for the icon
storeDataButton.style.height = '18px'; // Set a fixed height for the icon
storeDataButton.style.textAlign = 'center'; // Center the star horizontally
storeDataButton.style.marginRight = '10px'; // Center the star horizontally
storeDataButton.style.cursor = 'pointer'; // Change the cursor on hover

// Define a function to update the storeDataButton based on storedData
function updateStoreDataButton() {
    const entryIndex = storedData.findIndex((entry) => {
        return (
            entry.external_id === currentEntry.external_id &&
            entry.name === currentEntry.name
        );
    });

if (entryIndex !== -1) {
    // Entry already exists, so remove it
    storeDataButton.innerHTML = '⭐';
    storeDataButton.style.textShadow = '0 0 0 #F5D258';
    storeDataButton.style.fontSize = '18px';
    storeDataButton.style.marginBottom = '0';
} else if (window.innerWidth <= 768) {
    // Window width is less than or equal to 768
    storeDataButton.innerHTML = '★';
    storeDataButton.style.textShadow = '0 0 0 #FFFFFF';
    storeDataButton.style.fontSize = '25px';
    storeDataButton.style.marginBottom = '3px';
} else {
    // Entry doesn't exist, so push it
    storeDataButton.innerHTML = '⭐';
    storeDataButton.style.color = 'transparent';
    storeDataButton.style.textShadow = '0 0 0 #CFC9BF';
    storeDataButton.style.fontSize = '18px';
    storeDataButton.style.marginBottom = '0';
}
}

// Call the function initially to set the button state
updateStoreDataButton();

storeDataButton.addEventListener('click', function () {
    console.log("currentEntry1:", currentEntry);

    // Store a temporary copy of currentEntry
    const temporaryStore = { ...currentEntry };

    storeData(); // Call the function to store data

    // Update the currentEntry object with the data in storedData
    const entryIndex = storedData.findIndex((entry) => {
        return (
            entry.external_id === currentEntry.external_id &&
            entry.name === currentEntry.name
        );
    });

if (entryIndex !== -1) {
    // Entry exists, no need to change currentEntry
    storeDataButton.innerHTML = '⭐';
    storeDataButton.style.textShadow = '0 0 0 #F5D258';
    storeDataButton.style.fontSize = '18px';
    storeDataButton.style.marginBottom = '0';
} else if (window.innerWidth <= 768) {
    currentEntry = { ...temporaryStore };
    storeDataButton.innerHTML = '★';
    storeDataButton.style.textShadow = '0 0 0 #FFFFFF';
    storeDataButton.style.fontSize = '25px';
    storeDataButton.style.marginBottom = '3px';
} else {
    // Entry doesn't exist, restore currentEntry from the temporary copy
    currentEntry = { ...temporaryStore };
    storeDataButton.style.color = 'transparent';
    storeDataButton.style.textShadow = '0 0 0 #CFC9BF';
    storeDataButton.innerHTML = '⭐';
    storeDataButton.style.fontSize = '18px';
    storeDataButton.style.marginBottom = '0';
}


    updateStoreDataButton();
});

// Find the target panel
const targetPanel = document.querySelector('.chat2 > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)');
const targetPanel_characterAssistant = document.querySelector('.chat2 > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(3)');

if (targetPanel) {
    // Insert the store data button as the first child of the target panel
    targetPanel.insertBefore(storeDataButton, targetPanel.firstChild);
} else if (targetPanel_characterAssistant) {
    // Insert the store data button as the first child of the targetPanel_characterAssistant
    targetPanel_characterAssistant.insertBefore(storeDataButton, targetPanel_characterAssistant.firstChild);
} else {
    console.error('Target panel not found.');
}

    });

})();