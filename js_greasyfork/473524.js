// ==UserScript==
    // @name         c.ai Neo Panel
    // @namespace    c.ai Neo Panel
    // @version      3.2
    // @description  A toggleable panel with information about the character and other stuff
    // @author       vishanka
    // @license      MIT
    // @match        https://*.character.ai/chat*
    // @icon         https://i.imgur.com/iH2r80g.png
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473524/cai%20Neo%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/473524/cai%20Neo%20Panel.meta.js
    // ==/UserScript==


(function() {
    'use strict';

    var original_prototype_open = XMLHttpRequest.prototype.open;
    const intercepted_data_object = {};

    XMLHttpRequest.prototype.open = function(method, url, async) {
        if (
            url.startsWith('https://plus.character.ai/chat/history/continue/') ||
            url.startsWith('https://plus.character.ai/chat/character/info') ||
            url.startsWith('https://beta.character.ai/chat/history/continue/') ||
            url.startsWith('https://beta.character.ai/chat/character/info')
        ) {
            this.addEventListener('load', function() {
                let info1 = JSON.parse(this.responseText);
                intercepted_data_object.external_id = info1.character.external_id;
                console.log("character_id:",intercepted_data_object.external_id);

                let info2 = JSON.parse(this.responseText);
                intercepted_data_object.tgt = info2.character.participant__user__username;
                intercepted_data_object.name = info2.character.name;
                intercepted_data_object.participant__num_interactions = info2.character.participant__num_interactions;
                intercepted_data_object.greeting = info2.character.greeting;
                intercepted_data_object.title = info2.character.title;
                intercepted_data_object.description = info2.character.description;
                intercepted_data_object.avatar_file_name = info2.character.avatar_file_name;
                intercepted_data_object.base_img_prompt = info2.character.base_img_prompt;
                intercepted_data_object.visibility = info2.character.visibility;
                intercepted_data_object.username = info2.character.user__username;

                // Only create the toggle button and the panel once
                if (!document.getElementById('descriptionPanel')) {
                    createToggleButton();
                    createPermanentPanel();
                    createNeoPanelDelete();
                }
            });

        } else if (url.startsWith(`https://neo.character.ai/chats/recent/${intercepted_data_object.external_id}`)) {
            this.addEventListener('load', function() {
                let info3 = JSON.parse(this.responseText);
                intercepted_data_object.chat_id = info3.chats[0].chat_id;
                console.log("chat_id:",intercepted_data_object.chat_id);
            });
        } else if (url.startsWith('https://beta.character.ai/chat/user/') ||
            url.startsWith('https://plus.character.ai/chat/user/')
          ) {
            this.addEventListener('load', function() {
                let info_user = JSON.parse(this.responseText);
                intercepted_data_object.info_username = info_user.user.name;
                console.log("Username You:",intercepted_data_object.info_username);
            });
        } else if (url.startsWith(`https://neo.character.ai/turns/${intercepted_data_object.chat_id}`)) {
            this.addEventListener('load', function() {
                let info4 = JSON.parse(this.responseText);
                intercepted_data_object.turn_id = info4.turns[0].turn_key.turn_id;
                intercepted_data_object.total_turns = info4.turns.length;
                intercepted_data_object.turns_name = info4.turns[0].author.name;
                console.log("turn_id:",intercepted_data_object.turn_id);
                console.log("total_turns:", intercepted_data_object.total_turns);
                console.log("turns_name:", intercepted_data_object.turns_name);
                // Extract data from the last turn_id if there are turns
                if (intercepted_data_object.total_turns > 0) {
                  const lastTurnIndex = intercepted_data_object.total_turns - 1;
                  const lastTurnData = info4.turns[lastTurnIndex];
                  intercepted_data_object.lastTurnId = lastTurnData.turn_key.turn_id; // Store lastTurnId in intercepted_data_object
                  console.log("Last turn_id:", intercepted_data_object.lastTurnId);
                }
                // Extract candidates for "turn 0", used for fetching limit
                if (intercepted_data_object.total_turns > 0) {
                  const firstTurnData = info4.turns[0];
                  intercepted_data_object.candidatesForTurn0 = firstTurnData.candidates;
                  intercepted_data_object.numberOfCandidatesForTurn0 = intercepted_data_object.candidatesForTurn0.length;
                  console.log("Number of candidates for turn 0:", intercepted_data_object.numberOfCandidatesForTurn0);
                if (intercepted_data_object.numberOfCandidatesForTurn0 > 0) {
                  intercepted_data_object.first_raw = intercepted_data_object.candidatesForTurn0[0].raw_content;
                  console.log("Raw content of the first candidate for turn 0:", intercepted_data_object.first_raw);




                }
}

                XHR_interception_resolve(intercepted_data_object);
            });
        }
        original_prototype_open.apply(this, [method, url, async]);
    };

    let XHR_interception_resolve;
    const XHR_interception_promise = new Promise(function(resolve, reject) {
        XHR_interception_resolve = resolve;
    });

    XHR_interception_promise.then(function() {
        console.log("Intercepted Data:", intercepted_data_object);


// Fetch Command
const fetch10_commandJson = `{
    "command": "generate_turn_candidate",
    "payload": {
        "character_id": "${intercepted_data_object.external_id}",
        "turn_key": {
            "turn_id": "${intercepted_data_object.turn_id}",
            "chat_id": "${intercepted_data_object.chat_id}"
        }
    },
    "origin_id": ""
}`;

// Delete First Message
const delete_first_commandJson = `{
    "command": "remove_turns",
    "request_id": "",
    "payload": {
        "chat_id": "${intercepted_data_object.chat_id}",
        "turn_ids": ["${intercepted_data_object.lastTurnId}"]
    },
    "origin_id": ""
}`;

const delete_last_commandJson = `{
    "command": "remove_turns",
    "request_id": "",
    "payload": {
        "chat_id": "${intercepted_data_object.chat_id}",
        "turn_ids": ["${intercepted_data_object.turn_id}"]
    },
    "origin_id": ""
}`;


// Rest of the WebSocket logic (same as in your original script)
// Create Fetch Button
let disableMouseOut = false;
const fetch_button = document.createElement('button');
fetch_button.textContent = 'Fetch 10 Replies';
fetch_button.style.padding = '5px 10px';
fetch_button.style.backgroundColor = '#007bff';
fetch_button.style.borderRadius = '5px';
fetch_button.style.color = 'white';
fetch_button.style.border = 'none';
fetch_button.style.cursor = 'pointer';
fetch_button.style.transition = 'background-color 0.2s, transform 0.1s';
fetch_button.style.display = 'block';
fetch_button.style.width = '100%';
fetch_button.style.marginTop = '10px';

// Mouseover animation
fetch_button.addEventListener('mouseover', () => {
    fetch_button.style.backgroundColor = '#0056b3';
    fetch_button.style.transform = 'scale(1.0)';
});

// Mouseout animation
fetch_button.addEventListener('mouseout', () => {
    if (!disableMouseOut) {
        fetch_button.style.backgroundColor = '#007bff';
        fetch_button.style.transform = 'scale(1)';
    }
});

// Click animation and logic
fetch_button.addEventListener('click', () => {
    // Change button text and background color
    fetch_button.textContent = 'Please wait...';
    fetch_button.style.backgroundColor = 'darkgray';
    fetch_button.disabled = true; // Disable the button during fetching

    disableMouseOut = true; // Disable mouseout behavior

    fetch10();

});

// Create Delete First Button
const delete_first_message_button = createStyledButton('Delete First Message', showDeleteConfirmation);
delete_first_message_button.style.marginTop = '10px';


// Create Delete Last Button
const delete_last_message_button = createStyledButton('Delete Last Message', showDeleteLastConfirmation);
delete_last_message_button.style.marginTop = '10px';


//----------------------------------------- BUTTON FOR DELETE PANEL ----------------------------------------
// Triggert Panel aus Neo Panel Delete script
const delete_panel_button = createStyledButton('Toggle Delete Panel', toggleNeoPanelDelete);
delete_panel_button.style.marginTop = '10px';


// Append Buttons to Panel
const panel = document.getElementById('descriptionPanel');
panel.appendChild(fetch_button);
panel.appendChild(delete_first_message_button);
panel.appendChild(delete_last_message_button);
panel.appendChild(delete_panel_button);
//panel.appendChild(delete_last_message_button);


// Add reload_information to the panel
const general_information = document.createElement('p');
general_information.textContent = 'Version 3.1';
general_information.style.textAlign = 'center';
general_information.style.marginBottom = '5px';
general_information.style.setProperty('font-size', '12px', 'important'); // Set style with !important

panel.appendChild(general_information);

// Add home button to the panel
/*    const home_button = document.createElement('img');
    home_button.style.maxWidth = '15%';
    home_button.style.display = 'block'; // Ensures that the image occupies full width
    home_button.style.margin = '0 auto'; // Centers the image horizontally
    home_button.style.marginBottom = '10px';
    home_button.src = 'https://i.imgur.com/79IBd1P.png';

    panel.appendChild(home_button);
*/



// Function to create styled buttons
function createStyledButton(text, clickFunction) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#007bff';
    button.style.borderRadius = '5px';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.2s, transform 0.1s';
    button.style.display = 'block';
    button.style.width = '100%';

    // Mouseover animation
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#0056b3';
    });

    // Mouseout animation
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#007bff';
    });

    // Click animation and logic
    button.addEventListener('click', () => {
        clickFunction();
        button.style.backgroundColor = 'darkgray';
    });

    return button;
}



//--------------------------Here begins the fetching craze -------------------------------
// Initialize WebSocket
const socket = new WebSocket('wss://neo.character.ai/ws/');

socket.addEventListener('open', () => {
    console.log('Socket connection opened.');
});

socket.addEventListener('error', (error) => {
    console.error('Socket error:', error);
});

socket.addEventListener('close', () => {
    console.log('Socket connection closed.');
});


let lastWebSocketMessageTime = 0;
let fetchAlertTimeout;

// Function to handle WebSocket messages
function handleWebSocketMessage() {
    lastWebSocketMessageTime = Date.now();

    if (fetchAlertTimeout) {
        clearTimeout(fetchAlertTimeout);
    }

    fetchAlertTimeout = setTimeout(() => {
        if (shouldShowFetchAlert()) {
            const maxCandidates = 31;
            const remainingCandidates = maxCandidates - intercepted_data_object.numberOfCandidatesForTurn0;
            const candidatesToFetch = Math.min(remainingCandidates, 10);

if (candidatesToFetch > 0) {
    // Create a custom modal_fetched_messages
    const modal_fetched_messages = document.createElement('div');
    modal_fetched_messages.style.position = 'fixed';
    modal_fetched_messages.style.top = '0';
    modal_fetched_messages.style.left = '0';
    modal_fetched_messages.style.width = '100%';
    modal_fetched_messages.style.height = '100%';
    modal_fetched_messages.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal_fetched_messages.style.display = 'flex';
    modal_fetched_messages.style.justifyContent = 'center';
    modal_fetched_messages.style.alignItems = 'center';
    modal_fetched_messages.style.zIndex = '9999'; // Set a higher z-index

    // Create modal_fetched_messages content
    const modal_fetched_messagesContent = document.createElement('div');
    modal_fetched_messagesContent.style.backgroundColor = '#fff';
    modal_fetched_messagesContent.style.padding = '20px';
    modal_fetched_messagesContent.style.borderRadius = '5px';
    modal_fetched_messagesContent.style.textAlign = 'center';

    // Add content to modal_fetched_messages
    const modal_fetched_messagesText = document.createElement('div');
    modal_fetched_messagesText.textContent = `${candidatesToFetch} messages fetched. Click below to reload the page.`;
    modal_fetched_messagesText.style.marginBottom = '20px';
    modal_fetched_messagesContent.appendChild(modal_fetched_messagesText);

    // Create a button within the modal_fetched_messages
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Page';
    reloadButton.style.backgroundColor = '#3E4040'; // Example button color
    reloadButton.style.color = 'white'; // Example text color
    reloadButton.style.border = 'none';
    reloadButton.style.borderRadius = '3px';
    reloadButton.style.padding = '5px 15px';

    // Add an event listener to the reload button
    reloadButton.addEventListener('click', () => {
        window.location.reload(); // Reload the page
    });

    // Add button to modal_fetched_messages content
    modal_fetched_messagesContent.appendChild(reloadButton);

    // Add modal_fetched_messages content to modal_fetched_messages
    modal_fetched_messages.appendChild(modal_fetched_messagesContent);

    // Add modal_fetched_messages to the document
    document.body.appendChild(modal_fetched_messages);
}

        }
    }, 10000);
}

// Function to determine if the fetch alert should be shown
function shouldShowFetchAlert() {
    const currentTime = Date.now();
    const timeSinceLastMessage = currentTime - lastWebSocketMessageTime;
    return timeSinceLastMessage >= 10000;
}



// Function to determine if the fetch alert should be shown
function fetch10() {
    const maxCandidates = 31;
    const command = JSON.parse(fetch10_commandJson);

if (intercepted_data_object.info_username === intercepted_data_object.turns_name) {
// ------------------- Create an extra Style for the User Message Popup
const modal_user_message = document.createElement('div');
modal_user_message.style.position = 'fixed';
modal_user_message.style.top = '0';
modal_user_message.style.left = '0';
modal_user_message.style.width = '100%';
modal_user_message.style.height = '100%';
modal_user_message.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
modal_user_message.style.display = 'flex';
modal_user_message.style.justifyContent = 'center';
modal_user_message.style.alignItems = 'center';
modal_user_message.style.zIndex = '9999'; // Set a higher z-index

// Create modal_user_message content
const modal_user_messageContent = document.createElement('div');
modal_user_messageContent.style.backgroundColor = '#fff';
modal_user_messageContent.style.padding = '20px';
modal_user_messageContent.style.borderRadius = '5px';
modal_user_messageContent.style.textAlign = 'center';

// Add content to modal_user_message
const modal_user_messageText = document.createElement('div');
modal_user_messageText.textContent = `You tried to fetch on a user message. Reload or generate a reply.`;
modal_user_messageText.style.marginBottom = '20px';
modal_user_messageContent.appendChild(modal_user_messageText);

// Create reload button
const reloadButton = document.createElement('button');
reloadButton.textContent = 'Reload Page';
reloadButton.style.marginRight = '10px';
reloadButton.style.backgroundColor = 'red'; // Example button color
reloadButton.style.color = 'white'; // Example text color
reloadButton.style.border = 'none';
reloadButton.style.borderRadius = '3px';
reloadButton.style.padding = '5px 15px';

// Add event listener to reload button
reloadButton.addEventListener('click', () => {
    window.location.reload(); // Reload the page
});

// Create cancel button
const cancelButton = document.createElement('button');
cancelButton.textContent = 'Cancel';
cancelButton.style.backgroundColor = '#DDDDDD'; // Example button color
cancelButton.style.border = 'none';
cancelButton.style.borderRadius = '3px';
cancelButton.style.padding = '5px 15px';

// Add event listener to cancel button
cancelButton.addEventListener('click', () => {
    modal_user_message.remove(); // Remove the modal
    fetch_button.textContent = 'Fetch 10 Replies';
    fetch_button.style.backgroundColor = '#007bff';
});

// Add buttons to modal_user_message content
modal_user_messageContent.appendChild(reloadButton);
modal_user_messageContent.appendChild(cancelButton);

// Add modal_user_message content to modal_user_message
modal_user_message.appendChild(modal_user_messageContent);

// Add modal_user_message to the document
document.body.appendChild(modal_user_message);

// ------------------- END Create an extra Style for the User Message Popup
    fetch_button.textContent = 'Reload Page Please';
    fetch_button.disabled = false; // Disable the button during fetching
    disableMouseOut = true; // Disable mouseout behavior
}
 else {

        proceedWithFetch();
        observer.disconnect(); // Disconnect the observer after finding the text



        const observer = new MutationObserver(performTextSearch);
        observer.observe(document, { subtree: true, childList: true });


    }
}


// Function to proceed with the fetch logic
function proceedWithFetch() {
    const maxCandidates = 31;
    const command = JSON.parse(fetch10_commandJson);

    if (intercepted_data_object.numberOfCandidatesForTurn0 < maxCandidates) {
        const remainingCandidates = maxCandidates - intercepted_data_object.numberOfCandidatesForTurn0;
        const candidatesToFetch = Math.min(remainingCandidates, 10);
        for (let i = 0; i < candidatesToFetch; i++) {
            sendSocketMessage(socket, command, false);
        }
    } else {
    clearTimeout(fetchAlertTimeout); // Clear the timeout here

    // Create a custom modal
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.textAlign = 'center';

        const modalText = document.createElement('div');
        modalText.innerHTML = 'Max swipes reached.<br>Messages fetched beyond this point will be unavailable.<br><br>Proceed?';
        modalContent.appendChild(modalText);

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Confirm';
        yesButton.style.marginRight = '10px';
        yesButton.style.backgroundColor = 'red'; // Example button color
        yesButton.style.color = 'white'; // Example text color
        yesButton.style.border = 'none';
        yesButton.style.borderRadius = '3px';
        yesButton.style.padding = '5px 15px';
        yesButton.style.marginTop = '10px';

let activityTimeout;
let candidatesToFetch = 10; // You need to set this value

const modal_yes_fetch = createModal();

function createModal() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '9999';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.textAlign = 'center';

    const modalText = document.createElement('div');
    modalText.textContent = `${candidatesToFetch} messages fetched. Click below to reload the page.`;
    modalText.style.marginBottom = '20px';
    modalContent.appendChild(modalText);

    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Page';
    reloadButton.style.marginRight = '10px';
    reloadButton.style.backgroundColor = '#3E4040'; // Example button color
    reloadButton.style.color = 'white'; // Example text color
    reloadButton.style.border = 'none';
    reloadButton.style.borderRadius = '3px';
    reloadButton.style.padding = '5px 15px';
    reloadButton.addEventListener('click', () => {
        window.location.reload();
    });
    modalContent.appendChild(reloadButton);

    modal.appendChild(modalContent);

    return modal;
}

yesButton.addEventListener('click', () => {
    document.body.removeChild(modal);
    fetch_button.textContent = 'Please wait...';
    fetch_button.style.backgroundColor = 'darkgray';
    fetch_button.disabled = true; // Disable the button during fetching
    disableMouseOut = true; // Disable mouseout behavior
    clearTimeout(activityTimeout);

    for (let i = 0; i < candidatesToFetch; i++) {
        sendSocketMessage(socket, command, false);
    }

    activityTimeout = setTimeout(() => {
        document.body.appendChild(modal_yes_fetch);
    }, 10000);
});

socket.addEventListener('message', () => {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
        document.body.appendChild(modal_yes_fetch);
    }, 10000);
});


        const noButton = document.createElement('button');
        noButton.textContent = 'Cancel';
        noButton.style.backgroundColor = 'gray'; // Example button color
        noButton.style.color = 'white'; // Example text color
        noButton.style.border = 'none';
        noButton.style.borderRadius = '3px';
        noButton.style.padding = '5px 15px';

        noButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modalContent.appendChild(yesButton);
        modalContent.appendChild(noButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        fetch_button.textContent = 'Fetch 10 Replies';
        fetch_button.style.backgroundColor = '#007bff';
        fetch_button.disabled = false;
        disableMouseOut = false;
    }
}


// Attach message event listener to the WebSocket
socket.addEventListener('message', handleWebSocketMessage);

//------------------------------------ END OF FETCHING FUNCTION------------------------------------

//------------------------------------ START OF DELETE FIRST FUNCTION------------------------------------
// Delete first message command logic
// Delete first message command logic
function deleteFirstMessage() {
    const deleteCommand = JSON.parse(delete_first_commandJson);
    sendSocketMessage(socket, deleteCommand, true); // Pass `true` for reload argument
}

// Show confirmation modal
function showDeleteConfirmation() {
    const modal_delete_first = document.createElement('div');
    modal_delete_first.style.position = 'fixed';
    modal_delete_first.style.top = '0';
    modal_delete_first.style.left = '0';
    modal_delete_first.style.width = '100%';
    modal_delete_first.style.height = '100%';
    modal_delete_first.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal_delete_first.style.display = 'flex';
    modal_delete_first.style.justifyContent = 'center';
    modal_delete_first.style.alignItems = 'center';
    modal_delete_first.style.zIndex = '9999';

    const modal_content = document.createElement('div');
    modal_content.style.backgroundColor = 'white';
    modal_content.style.padding = '20px';
    modal_content.style.borderRadius = '5px';
    modal_content.style.textAlign = 'center';

    const modal_text = document.createElement('p');
    modal_text.textContent = "The first message will be deleted. Proceed?";
    modal_text.style.marginBottom = '20px';

    const modal_buttons = document.createElement('div');
    modal_buttons.style.display = 'flex';
    modal_buttons.style.justifyContent = 'center';

    const modal_confirm_button = document.createElement('button');
    modal_confirm_button.textContent = 'Confirm';
    modal_confirm_button.style.marginRight = '10px';
    modal_confirm_button.style.backgroundColor = 'red'; // Example button color
    modal_confirm_button.style.color = 'white'; // Example text color
    modal_confirm_button.style.border = 'none';
    modal_confirm_button.style.borderRadius = '3px';
    modal_confirm_button.style.padding = '5px 15px';
    modal_confirm_button.addEventListener('click', () => {
        document.body.removeChild(modal_delete_first);
        deleteFirstMessage();
    });

    const modal_cancel_button = document.createElement('button');
    modal_cancel_button.textContent = 'Cancel';
    modal_cancel_button.style.backgroundColor = 'gray'; // Example button color
    modal_cancel_button.style.color = 'white'; // Example text color
    modal_cancel_button.style.border = 'none';
    modal_cancel_button.style.borderRadius = '3px';
    modal_cancel_button.style.padding = '5px 15px';
    modal_cancel_button.addEventListener('click', () => {
        document.body.removeChild(modal_delete_first);
    });

    modal_buttons.appendChild(modal_confirm_button);
    modal_buttons.appendChild(modal_cancel_button);

    modal_content.appendChild(modal_text);
    modal_content.appendChild(modal_buttons);

    modal_delete_first.appendChild(modal_content);
    document.body.appendChild(modal_delete_first);
}

//------------------------------------ END OF DELETE FIRST FUNCTION------------------------------------


//------------------------------------ START OF DELETE LAST FUNCTION------------------------------------


// Delete last message command logic
function deleteLastMessage() {
    const deleteCommand = JSON.parse(delete_last_commandJson);
    sendSocketMessage(socket, deleteCommand, true); // Pass `true` for the reload argument
}

// Show confirmation modal
function showDeleteLastConfirmation() {
    const modal_delete_last = document.createElement('div');
    modal_delete_last.style.position = 'fixed';
    modal_delete_last.style.top = '0';
    modal_delete_last.style.left = '0';
    modal_delete_last.style.width = '100%';
    modal_delete_last.style.height = '100%';
    modal_delete_last.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal_delete_last.style.display = 'flex';
    modal_delete_last.style.justifyContent = 'center';
    modal_delete_last.style.alignItems = 'center';
    modal_delete_last.style.zIndex = '9999';

    const modal_content = document.createElement('div');
    modal_content.style.backgroundColor = 'white';
    modal_content.style.padding = '20px';
    modal_content.style.borderRadius = '5px';
    modal_content.style.textAlign = 'center';

    const modal_text = document.createElement('p');
    modal_text.textContent = "The first message will be deleted. Proceed?";
    modal_text.style.marginBottom = '20px';

    const modal_buttons = document.createElement('div');
    modal_buttons.style.display = 'flex';
    modal_buttons.style.justifyContent = 'center';

    const modal_confirm_button = document.createElement('button');
    modal_confirm_button.textContent = 'Confirm';
    modal_confirm_button.style.marginRight = '10px';
    modal_confirm_button.style.backgroundColor = 'red'; // Example button color
    modal_confirm_button.style.color = 'white'; // Example text color
    modal_confirm_button.style.border = 'none';
    modal_confirm_button.style.borderRadius = '3px';
    modal_confirm_button.style.padding = '5px 15px';
    modal_confirm_button.addEventListener('click', () => {
        document.body.removeChild(modal_delete_last);
        deleteLastMessage();
    });

    const modal_cancel_button = document.createElement('button');
    modal_cancel_button.textContent = 'Cancel';
    modal_cancel_button.style.backgroundColor = 'gray'; // Example button color
    modal_cancel_button.style.color = 'white'; // Example text color
    modal_cancel_button.style.border = 'none';
    modal_cancel_button.style.borderRadius = '3px';
    modal_cancel_button.style.padding = '5px 15px';
    modal_cancel_button.addEventListener('click', () => {
        document.body.removeChild(modal_delete_last);
    });

    modal_buttons.appendChild(modal_confirm_button);
    modal_buttons.appendChild(modal_cancel_button);

    modal_content.appendChild(modal_text);
    modal_content.appendChild(modal_buttons);

    modal_delete_last.appendChild(modal_content);
    document.body.appendChild(modal_delete_last);
}



//------------------------------------ END OF DELETE FUNCTION------------------------------------
// wenn ich den anderen button hier rein mache dann muss der promise erfüllt sein

// Function to send socket message
function sendSocketMessage(socket, command, shouldReload) {
    try {
        socket.send(JSON.stringify(command));
        console.log('Socket message sent:', command);
        if (shouldReload) {
            location.reload(); // Reload the page after sending the message
        }
    } catch (error) {
        console.error('Error sending socket message:', error);
    }
}


    }); //------------------------------------ END OF XHR INTERCEPTION PROMISE ------------------------------------



function createToggleButton() {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Details';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '0px';
    toggleButton.style.left = '0%';
    toggleButton.style.backgroundColor = '#3E4040';
    toggleButton.style.color = 'white';
    toggleButton.style.fontWeight = 'bold';
    toggleButton.style.padding = '4px';
    toggleButton.style.margin = '0px';
    toggleButton.style.width = '15%';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '0px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.userSelect = 'none';
    toggleButton.style.zIndex = '101';
    toggleButton.addEventListener('click', togglePanel);

    document.body.appendChild(toggleButton);
}



//--------------------------------------------------------- PERMANENT PANEL -------------------------------------------------------

function createPermanentPanel() {
    const panel = document.createElement('div');
    panel.id = 'descriptionPanel';
    panel.style.position = 'fixed';
    panel.style.bottom = '32px';
    panel.style.left = '0%';
    panel.style.width = '15%';
    panel.style.height = '100%';
    panel.style.backgroundColor = 'white';
    panel.style.borderRight = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.zIndex = '100';
    panel.style.resize = 'horizontal';
    panel.style.direction = 'ltr';
    panel.style.overflow = 'auto';
    // Set the initial display state to 'none'
    panel.style.display = 'block';


//--------------------------------------------------------- ALL ELEMENTS IN THE PANEL -------------------------------------------------------
// Add headline to the panel
const name_h = document.createElement('h4');
name_h.textContent = intercepted_data_object.name;
name_h.style.marginTop = '35px';
name_h.style.textAlign = 'center';  // Center-align the text
panel.appendChild(name_h);

// Create a container div for the name and the new div
const containerDiv = document.createElement('div');
containerDiv.style.display = 'flex'; // Use flexbox to arrange items in a row
containerDiv.style.alignItems = 'center'; // Vertically center items
containerDiv.style.justifyContent = 'center'; // Center items horizontally
containerDiv.style.textAlign = 'center';
panel.appendChild(containerDiv);

// Append the name_h to the container div
containerDiv.appendChild(name_h);

// Assuming you have access to the intercepted_data_object and containerDiv

if (
    intercepted_data_object.external_id === "EEI6sjnddRIJTVC59MODiYjL0-JyDIVI2IEGLkPx2Jk" ||
    intercepted_data_object.external_id === "qtEICpGfFS8f5Zr5kCHR1EsGsHlawNutYSZJq_IEZDY" ||
    intercepted_data_object.external_id === "0FGHpcylr6O0l46xHrTMzRGnqAU6beVz0k3i294wbUQ" ||
    intercepted_data_object.external_id === "iV5qb8ttzD7Ytl69U_-ONcW2tW_lrFrOVKExyKJHlJM" ||
    intercepted_data_object.external_id === "YntB_ZeqRq2l_aVf2gWDCZl4oBttQzDvhj9cXafWcF8"
) {
    const caitagDiv = document.createElement('div');
caitagDiv.innerHTML = '<div class="rounded py-0 px-1" style="vertical-align: middle; margin-top: 31px; margin-left: 5px; background-color: rgb(60, 133, 246); color: white; font-weight: 600; font-size: 12px;" aria-label="AI Character using new C1.2 Model. See Community Announcements to learn more." data-darkreader-inline-bgcolor="" data-darkreader-inline-color=""><div class="d-flex flex-row"><div class="d-flex flex-column">c.ai@1.2</div></div></div>';
   containerDiv.appendChild(caitagDiv);
} else {
    const aiCharacterDiv = document.createElement('div');
    aiCharacterDiv.className = 'rounded py-0 px-1';
    aiCharacterDiv.style.marginLeft = '5px';
    aiCharacterDiv.style.backgroundColor = 'rgb(60, 133, 246)';
    aiCharacterDiv.style.color = 'white';
    aiCharacterDiv.style.fontWeight = '600';
    aiCharacterDiv.style.fontSize = '12px';
    aiCharacterDiv.textContent = 'c.ai';
    aiCharacterDiv.style.verticalAlign = 'middle'; // Adjust vertical alignment
    aiCharacterDiv.style.marginTop = '31px'; // Adjust margin-top

    containerDiv.appendChild(aiCharacterDiv);
}


// Function to map visibility strings to symbols or numbers
function mapVisibilityToContent(visibility) {
  switch (visibility) {
    case 'PRIVATE':
      return '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-top: -3px;"><path fill="none" d="M0 0h24v24H0z"></path><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>';
    case 'UNLISTED':
      return '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="mb-1" height="18" width="18" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-top: 5px;"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></svg>';
    case 'PUBLIC':
      return '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-top: -2px;"><path fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M87.49 380c1.19-4.38-1.44-10.47-3.95-14.86a44.86 44.86 0 00-2.54-3.8 199.81 199.81 0 01-33-110C47.65 139.09 140.73 48 255.83 48 356.21 48 440 117.54 459.58 209.85a199 199 0 014.42 41.64c0 112.41-89.49 204.93-204.59 204.93-18.3 0-43-4.6-56.47-8.37s-26.92-8.77-30.39-10.11a31.09 31.09 0 00-11.12-2.07 30.71 30.71 0 00-12.09 2.43l-67.83 24.48a16 16 0 01-4.67 1.22 9.6 9.6 0 01-9.57-9.74 15.85 15.85 0 01.6-3.29z"></path></svg>';
    default:
      return 0; // Handle other cases, if needed
  }
}


  // Example visibility value from intercepted data
  const visibilityValue = intercepted_data_object.visibility;

  // Map visibility to an SVG icon or number
  const visibilityContent = mapVisibilityToContent(visibilityValue);

  // Create the visibility element and set its content
  const visibilityElement = document.createElement('div');
  visibilityElement.style.display = 'flex'; // Use flexbox
  visibilityElement.style.alignItems = 'center'; // Align items vertically
  visibilityElement.style.justifyContent = 'center'; // Center items horizontally
  visibilityElement.style.textAlign = 'center';
  visibilityElement.innerHTML = visibilityContent;
  panel.appendChild(visibilityElement);

    // Function to format the interaction count
    function formatInteractionCount(count) {
      if (count < 10000) {
        return count.toString(); // Display full number
      } else if (count < 100000) {
        return (count / 1000).toFixed(1) + 'k'; // Display as X.Xk
      } else if (count < 1000000) {
        return (count / 1000).toFixed(0) + 'k'; // Display as Xk
      } else {
        return (count / 1000000).toFixed(1) + 'm'; // Display as X.Xm
      }
    }

    // Interaction count from intercepted data
    const numInteractions = intercepted_data_object.participant__num_interactions;

    // Format the interaction count
    const formattedInteractions = formatInteractionCount(numInteractions);

    // Create a span for the interaction count
    const interactionCountSpan = document.createElement('span');
    interactionCountSpan.textContent = `${formattedInteractions}`;
    interactionCountSpan.style.marginLeft = '5px'; // Add margin to the left
    //interactionCountSpan.style.marginTop = '-6px'; // Add margin to the left

    // Add the interaction count span to the visibility element
    visibilityElement.appendChild(interactionCountSpan);


    // Add a horizontal line (divider)
    const divider = document.createElement('hr');
    panel.appendChild(divider);

    // Add longdescription header to the panel
    const longdescription_h = document.createElement('h5');
    longdescription_h.textContent = 'Long Description';
    longdescription_h.style.marginTop = '0';
    longdescription_h.style.textAlign = 'center';  // Center-align the text
    longdescription_h.style.display = 'block';
    panel.appendChild(longdescription_h);



    // Add longdescription to the panel
const longdescription = document.createElement('p');
longdescription.textContent = intercepted_data_object.description;
longdescription.style.textAlign = 'center'; // Center-align the text
longdescription.style.display = 'none'; // Initially hide the long description
longdescription.style.marginBottom = '7px';
longdescription.style.whiteSpace = 'normal';
longdescription.style.overflowWrap = 'break-word';

panel.appendChild(longdescription);

const expandButton = document.createElement('button');
//expandButton.style.margin = '10px auto'; // Center the button horizontally with top margin
expandButton.style.backgroundColor = 'transparent'; // Set background color to transparent
expandButton.style.border = 'none'; // Remove the button border
expandButton.style.width = '100%';

const buttonTextContainer = document.createElement('div');
buttonTextContainer.style.textAlign = 'center'; // Center-align the text inside the container

/*const line1Span = document.createElement('span');
line1Span.textContent = 'Long Description';
line1Span.style.fontSize = '20px'; // Set font size for the first line
line1Span.style.color = '#C8C5BE'; // Set the color for the first line
*/
const line2Span = document.createElement('span');
line2Span.textContent = 'click to expand';
line2Span.style.fontSize = '14px'; // Set smaller font size for the second line
line2Span.style.marginTop = '0px';


//buttonTextContainer.appendChild(line1Span);
//buttonTextContainer.appendChild(document.createElement('br')); // Add a line break
buttonTextContainer.appendChild(line2Span);

expandButton.appendChild(buttonTextContainer);

expandButton.addEventListener('click', () => {
    if (longdescription.style.display === 'none') {
//        longdescription_h.style.display = 'block';
        longdescription.style.display = 'block'; // Show the long description
//        line1Span.style.color = 'transparent'; // Hide the long description title
        line2Span.textContent = 'click to collapse'; // Change the second line text

    } else {
//        longdescription_h.style.display = 'none';
        longdescription.style.display = 'none';
//        line1Span.style.color = '#C8C5BE'; // Show the long description
        line2Span.textContent = 'click to expand'; // Change the second line text
    }
});

panel.appendChild(expandButton);


    // Add a horizontal line (divider)
    const divider1 = document.createElement('hr');
    panel.appendChild(divider1);


    // Add image to the panel
    const image = document.createElement('img');
    image.style.maxWidth = '100%';
    image.style.marginTop = '10px';
    image.style.display = 'block'; // Ensures that the image occupies full width
    image.style.margin = '0 auto'; // Centers the image horizontally
    // Set the original image source
    image.src = `https://characterai.io/i/400/static/avatars/${intercepted_data_object.avatar_file_name}`;

    // Add an event listener to handle image load error
    image.onerror = function() {
    // Load the fallback image if the original image fails to load
    image.src = 'https://i.imgur.com/G19HeCH.png';
    };

    panel.appendChild(image);


    // Add short description (title) to the panel
    const shortdescription = document.createElement('p');
    shortdescription.textContent = intercepted_data_object.title;
    shortdescription.style.textAlign = 'center';  // Center-align the text
    shortdescription.style.marginTop = '10px';
    panel.appendChild(shortdescription);


    // Add a horizontal line (divider)
    const divider2 = document.createElement('hr');
    divider2.style.marginTop = '-5px';
    panel.appendChild(divider2);



    // Create the username element and set its content using string interpolation
    const username = document.createElement('p');
    username.textContent = `${intercepted_data_object.name} and their greeting was authored by @${intercepted_data_object.username}`;
    username.style.textAlign = 'center';  // Center-align the text
    username.style.marginTop = '5px';
    username.style.setProperty('font-size', '14px', 'important'); // Set style with !important
    panel.appendChild(username);



//--------------------------------------------------------- QPR BUTTON -------------------------------------------------------
const qpr_button = document.createElement('button');
qpr_button.textContent = 'Send a QPR';
qpr_button.style.padding = '5px 10px';
qpr_button.style.backgroundColor = '#007bff';
qpr_button.style.borderRadius = '5px';
qpr_button.style.color = 'white';
qpr_button.style.border = 'none';
qpr_button.style.cursor = 'pointer';
qpr_button.style.transition = 'background-color 0.3s, transform 0.2s';
qpr_button.style.display = 'block';
qpr_button.style.width = '100%';

// Mouseover animation
qpr_button.addEventListener('mouseover', () => {
    qpr_button.style.backgroundColor = '#0056b3';
    qpr_button.style.transform = 'scale(1.0)';
});

// Mouseout animation
qpr_button.addEventListener('mouseout', () => {
    qpr_button.style.backgroundColor = '#007bff';
    qpr_button.style.transform = 'scale(1)';
});

// Click animation and open URL
qpr_button.addEventListener('click', () => {
    // Open the URL in a new tab
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSe4I9TQAc32ghQLWBaVhzSjTp7mIADBVDxcrb-UmP4EqdM57w/viewform', '_blank');
});

// Append the QPR button to the panel
panel.appendChild(qpr_button);


//--------------------------------------------------------- AUTOSCROLL BUTTON -------------------------------------------------------


const autoscroll_button = document.createElement('button');
autoscroll_button.textContent = 'Autoscroll';
autoscroll_button.style.padding = '5px 10px';
    autoscroll_button.style.marginTop = '10px';
autoscroll_button.style.backgroundColor = '#007bff';
autoscroll_button.style.borderRadius = '5px';
autoscroll_button.style.color = 'white';
autoscroll_button.style.border = 'none';
autoscroll_button.style.cursor = 'pointer';
autoscroll_button.style.transition = 'background-color 0.3s, transform 0.2s';
autoscroll_button.style.display = 'block';
autoscroll_button.style.width = '100%';

// Mouseover animation
autoscroll_button.addEventListener('mouseover', () => {
    if (autoscroll_button.style.backgroundColor !== 'red') { // Check if background color is not red
        autoscroll_button.style.backgroundColor = '#0056b3';
        autoscroll_button.style.transform = 'scale(1.0)';
    }
});

// Mouseout animation
autoscroll_button.addEventListener('mouseout', () => {
    if (autoscroll_button.style.backgroundColor !== 'red') { // Check if background color is not red
        autoscroll_button.style.backgroundColor = '#007bff';
        autoscroll_button.style.transform = 'scale(1)';
    }
});

// Click animation and scroll
autoscroll_button.addEventListener('click', () => {
    event.stopPropagation();
    toggleAutoscroll(autoscroll_button);
    autoscroll_button.removeEventListener('mouseover', mouseoverHandler); // Remove the mouseover listener
    autoscroll_button.removeEventListener('mouseout', mouseoutHandler);   // Remove the mouseout listener
});

// Append the autoscroll button to the panel
panel.appendChild(autoscroll_button);

function mouseoverHandler() {
    autoscroll_button.style.backgroundColor = '#0056b3';
    autoscroll_button.style.transform = 'scale(1.0)';
}

function mouseoutHandler() {
    autoscroll_button.style.backgroundColor = '#007bff';
    autoscroll_button.style.transform = 'scale(1)';
}




    function ArrowRightKeyDown() {
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                key: 'ArrowRight',
            })
        );
        console.log("Arrow right pressed");
    }

    function scroll_totheright() {
        if (document.querySelector('div[class="swiper-button-next"]')) {
            ArrowRightKeyDown();
            setTimeout(scroll_totheright, 100); // Add a delay between scrolls
        } else {
            scroll_totheright_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]'), { childList: true, subtree: true });
        }
    }

    const scroll_totheright_observer = new MutationObserver(scroll_totheright);

function toggleAutoscroll(autoscroll_button) {
    if (sessionStorage.getItem("RAs_Autoscroll") === "true") {
        sessionStorage.removeItem("RAs_Autoscroll");
        autoscroll_button.innerHTML = 'Autoscroll';
        autoscroll_button.style.backgroundColor = '';
        scroll_totheright_observer.disconnect();
    } else {
        sessionStorage.setItem("RAs_Autoscroll", "true");
        autoscroll_button.innerHTML = 'Autoscroll ⏭️';
        autoscroll_button.style.backgroundColor = 'red'; // Set background color to red
        scroll_totheright();
        scroll_totheright_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]'), { childList: true, subtree: true });
    }
}

    function createAutoscrollButton(panel) {
        const autoscroll_button = document.createElement('button');
        autoscroll_button.innerHTML = 'Autoscroll';
        autoscroll_button.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleAutoscroll(autoscroll_button);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px'; // Adjust margin as needed
        buttonContainer.appendChild(autoscroll_button);

        panel.appendChild(buttonContainer);

        if (sessionStorage.getItem("RAs_Autoscroll") === "true") {
            toggleAutoscroll(autoscroll_button);
        }
    }
//--------------------------------------------------------- AUTOSCROLL BUTTON END -------------------------------------------------------


    document.body.appendChild(panel);
}


//--------------------------------------------------------- NEO PANEL DELETE -------------------------------------------------------


/*function createNeoPanelDelete() {
    const NeoPanelDelete = document.createElement('div');
    NeoPanelDelete.id = 'NeoPanelDelete';
    NeoPanelDelete.style.position = 'absolute';
    NeoPanelDelete.style.bottom = '32px';
    NeoPanelDelete.style.left = '15%';
    NeoPanelDelete.style.width = '15%';
    NeoPanelDelete.style.height = '100%';
    NeoPanelDelete.style.backgroundColor = 'white';
    NeoPanelDelete.style.borderLeft = '1px solid #ccc';
    NeoPanelDelete.style.padding = '10px';
    NeoPanelDelete.style.zIndex = '100';
    NeoPanelDelete.style.resize = 'horizontal';
    NeoPanelDelete.style.direction = 'rtl';
    NeoPanelDelete.style.overflow = 'auto';
    // Set the initial display state to 'none'
    NeoPanelDelete.style.display = 'block';




    // Add longdescription header to the panel
    const Delete_headline = document.createElement('h5');
    Delete_headline.textContent = 'Delete';
    Delete_headline.style.marginTop = '30px';
    Delete_headline.style.textAlign = 'center';  // Center-align the text
    NeoPanelDelete.appendChild(Delete_headline);

    // Add a horizontal line (divider)
    const divider_Delete1 = document.createElement('hr');
    NeoPanelDelete.appendChild(divider_Delete1);

    document.body.appendChild(NeoPanelDelete);
}
*/

 function toggleNeoPanelDelete() {
    const NeoPanelDelete = document.getElementById('NeoPanelDelete');
    if (NeoPanelDelete.style.display === 'block') {
        NeoPanelDelete.style.display = 'none';
    } else {
        NeoPanelDelete.style.display = 'block';
    }
}







//--------------------------------------------------------- ERROR 500 maybe -------------------------------------------------------



    waitForElement('div[id="root"]>div[class="Toastify"]', 60000).then(function() {
      //console.log("Toastify observer SUCCESS");
      const error500_observer = new MutationObserver (function () {
        //console.log("error500_observer observer fired");
        if (document.querySelector('div[class*="Toastify__toast--error"]')) {
          console.log("500 Internal Server Error detected");
          document.querySelector('textarea[id="user-input"]').style.setProperty("background-color", "lightpink", "important");
          document.querySelector('textarea[id="user-input"]').setAttribute("placeholder", "   “500 Internal Server Error” was fired! Refresh the page!");
        };
      });
      error500_observer.observe(document.querySelector('div[id="root"]>div[class="Toastify"]'), {childList: true, subtree: true});
    }).catch(function() {
      console.log("Toastify observer ERROR");
    });

//--------------------------------------------------------- ERROR 500 maybe END -------------------------------------------------------



 function togglePanel() {
    const panel = document.getElementById('descriptionPanel');
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'block';
    }
}


})();