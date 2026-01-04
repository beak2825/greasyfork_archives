// ==UserScript==
    // @name         c.ai Neo Panel Delete
    // @namespace    c.ai Neo Panel Delete
    // @version      1.0
    // @description  A toggleable panel that lets you delete any turn. You need c.ai Neo Panel as well in order to use this
    // @author       vishanka
    // @license      MIT
    // @match        https://*.character.ai/chat*
    // @icon         https://i.imgur.com/iH2r80g.png
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473976/cai%20Neo%20Panel%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/473976/cai%20Neo%20Panel%20Delete.meta.js
    // ==/UserScript==



(function() {
    'use strict';

// WebSocket handling
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

function sendSocketMessage(socket, message, reload) {
    socket.send(JSON.stringify(message));
    if (reload) {
        location.reload();
    }
}


    var original_prototype_open = XMLHttpRequest.prototype.open;
    const intercepted_data_object_delete = {};

    XMLHttpRequest.prototype.open = function(method, url, async) {
        if (
            url.startsWith('https://plus.character.ai/chat/history/continue/') ||
            url.startsWith('https://plus.character.ai/chat/character/info') ||
            url.startsWith('https://beta.character.ai/chat/history/continue/') ||
            url.startsWith('https://beta.character.ai/chat/character/info')
        ) {
            this.addEventListener('load', function() {
                let info1_delete = JSON.parse(this.responseText);
                intercepted_data_object_delete.external_id = info1_delete.character.external_id;
                intercepted_data_object_delete.name = info1_delete.character.name;
                console.log("character_id:",intercepted_data_object_delete.external_id);

                // Only create the toggle button and the panel once
                if (!document.getElementById('NeoPanelDelete')) {
//                    createToggleButton_NeoPanelDelete();
                    createNeoPanelDelete();
                }
            });

        } else if (url.startsWith(`https://neo.character.ai/chats/recent/${intercepted_data_object_delete.external_id}`)) {
            this.addEventListener('load', function() {
                let info2_delete = JSON.parse(this.responseText);
                intercepted_data_object_delete.chat_id = info2_delete.chats[0].chat_id;
                console.log("chat_id:",intercepted_data_object_delete.chat_id);
            });
// ---------------------------------- Ab hier kann ich turns extracten ----------------------------------------
        } else if (url.startsWith(`https://neo.character.ai/turns/${intercepted_data_object_delete.chat_id}`)) {
    this.addEventListener('load', function() {
        let info3_delete = JSON.parse(this.responseText);
        intercepted_data_object_delete.total_turns = info3_delete.turns.length;
        console.log("total_turns:", intercepted_data_object_delete.total_turns);

const delete_list = document.createElement('div');
delete_list.style.textAlign = 'left';
delete_list.style.marginTop = '10px';
delete_list.style.overflowY = 'auto';

// Iterate through the turns array in reverse
for (let i = 0; i < info3_delete.turns.length; i++) {
    let turn = info3_delete.turns[i];
    let turn_id = turn.turn_key.turn_id;
    let candidates = turn.candidates;
    let name = turn.author.name;

if (candidates.length > 0) {
    let raw_content = candidates[0].raw_content;

    // Create a container for each raw_content
    const contentContainer = document.createElement('div');
    contentContainer.style.cursor = 'pointer'; // Make it appear clickable
    contentContainer.style.alignItems = 'center'; // Center-align vertically
    contentContainer.style.direction = 'ltr';
contentContainer.style.transform = 'rotate(180deg)';

    // Function to toggle the red color
    function toggleRedColor() {
        if (contentContainer.style.backgroundColor === 'red') {
            contentContainer.style.backgroundColor = '';
        } else {
            contentContainer.style.backgroundColor = 'red';
        }
    }

    // Add click event to toggle red color
    contentContainer.addEventListener('click', toggleRedColor);

    // Create a div element for the name
    const nameDiv = document.createElement('div');
    nameDiv.style.fontWeight = 'bold'; // Make the name bold
    nameDiv.textContent = name; // Use the "name" variable
    contentContainer.appendChild(nameDiv);


// Create a div element for the raw_content
const div = document.createElement('div');
div.style.textAlign = 'left';
div.style.overflowWrap = 'break-word';
div.style.whiteSpace = 'pre-wrap';
div.style.color = '#958C7F';


// Changes the color of the text
const formattedContent = raw_content.replace(/(["“”«»].*?["“”«»])/g, '<span style="color: #FFFFFF">$1</span>');
const finalContent1 = formattedContent.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold;">$1</span>');
const finalContent = finalContent1.replace(/\*(.*?)\*/g, '<span style="font-style: italic; color: #E0DF7F;">$1</span>');
// Use regular expressions to find text within backticks and apply formatting
const formattedBackticks_3 = finalContent.replace(/```([^`]*)```/g, '<div style="display: inline-block; margin: 0px 10px; vertical-align: middle;"><div style="color: white; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 13px; tab-size: 4; hyphens: none; padding: 5px; margin: 0px; overflow: auto; background: rgb(1, 22, 39);"><code style="color: rgb(214, 222, 235); font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre-wrap; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 1em; tab-size: 4; hyphens: none;">$1</code></div></div>');
const formattedBackticks_tilde = formattedBackticks_3.replace(/~~~([^`]*)~~~/g, '<div style="display: inline-block; margin: 0px 10px; vertical-align: middle;"><div style="color: white; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 13px; tab-size: 4; hyphens: none; padding: 5px; margin: 0px; overflow: auto; background: rgb(1, 22, 39);"><code style="color: rgb(214, 222, 235); font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre-wrap; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 1em; tab-size: 4; hyphens: none;">$1</code></div></div>');

const formattedBackticks_1 = formattedBackticks_tilde.replace(/`(?!`)(.*?)`/g, '<div style="display: inline-block; margin: 0px 10px; vertical-align: middle;"><div style="color: white; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 13px; tab-size: 4; hyphens: none; padding: 5px; margin: 0px; overflow: auto; background: rgb(1, 22, 39);"><code style="color: rgb(214, 222, 235); font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre-wrap; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 1em; tab-size: 4; hyphens: none;">$1</code></div></div>');

// Set the final formatted content as innerHTML
div.innerHTML = formattedBackticks_1;


    contentContainer.appendChild(div);

    // Add a horizontal line
    const hr = document.createElement('hr');
    contentContainer.appendChild(hr);

    // Add a click event listener
    contentContainer.addEventListener('click', () => {
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

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.textAlign = 'center';
    modal.appendChild(modalContent);

    // Create message element
    const messageElement = document.createElement('p');
    messageElement.textContent = 'The selected message will be deleted. Proceed?';
    messageElement.style.marginBottom = '20px';
    modalContent.appendChild(messageElement);

    // Create "Yes" button
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Confirm';
    yesButton.style.marginRight = '10px';
    yesButton.style.backgroundColor = 'red'; // Example button color
    yesButton.style.color = 'white'; // Example text color
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '3px';
    yesButton.style.padding = '5px 15px';
    yesButton.addEventListener('click', () => {
        // Remove the modal
        document.body.removeChild(modal);

        // Your existing code for deletion
        const delete_commandJson = `{
            "command": "remove_turns",
            "request_id": "",
            "payload": {
                "chat_id": "${intercepted_data_object_delete.chat_id}",
                "turn_ids": ["${turn_id}"]
            },
            "origin_id": ""
        }`;

        const deleteCommand = JSON.parse(delete_commandJson);
        sendSocketMessage(socket, deleteCommand, true); // Pass `true` for reload argument
    });
    modalContent.appendChild(yesButton);

    // Create "No" button
    const noButton = document.createElement('button');
    noButton.textContent = 'Cancel';
    noButton.style.backgroundColor = 'gray'; // Example button color
    noButton.style.color = 'white'; // Example text color
    noButton.style.border = 'none';
    noButton.style.borderRadius = '3px';
    noButton.style.padding = '5px 15px';
    noButton.addEventListener('click', () => {
        // Remove the modal
        document.body.removeChild(modal);
        // Reset red color on "No" button click
        toggleRedColor();
    });
    modalContent.appendChild(noButton);

    // Append the modal to the body
    document.body.appendChild(modal);
});

        delete_list.appendChild(contentContainer);
    }
}

        // Append the delete_list to NeoPanelDelete
        NeoPanelDelete.appendChild(delete_list);
const lastContentContainer = delete_list.lastElementChild;
lastContentContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });



                XHR_interception_resolve(intercepted_data_object_delete);
            });
        }


        original_prototype_open.apply(this, [method, url, async]);
    };

    let XHR_interception_resolve;
    const XHR_interception_promise = new Promise(function(resolve, reject) {
        XHR_interception_resolve = resolve;
    });

    XHR_interception_promise.then(function() {
        console.log("Intercepted Data:", intercepted_data_object_delete);
    // Add a horizontal line (divider)
    const divider_Delete1 = document.createElement('hr');
    divider_Delete1.style.marginTop = '-5px';
    NeoPanelDelete.appendChild(divider_Delete1);

    // Add greeting header to the panel
    const Delete_headline = document.createElement('h5');
    Delete_headline.textContent = 'Greeting';
    Delete_headline.style.marginTop = '0px';
    Delete_headline.style.textAlign = 'center';  // Center-align the text
    Delete_headline.style.transform = 'rotate(180deg)';
    NeoPanelDelete.appendChild(Delete_headline);

    });



/*function createToggleButton_NeoPanelDelete() {
    const toggleButton_NeoPanelDelete = document.createElement('button');
    toggleButton_NeoPanelDelete.textContent = 'Swipe List';
    toggleButton_NeoPanelDelete.style.position = 'fixed';
    toggleButton_NeoPanelDelete.style.bottom = '0px';
    toggleButton_NeoPanelDelete.style.right = '0%';
    toggleButton_NeoPanelDelete.style.backgroundColor = '#3E4040';
    toggleButton_NeoPanelDelete.style.color = 'white';
    toggleButton_NeoPanelDelete.style.fontWeight = 'bold';
    toggleButton_NeoPanelDelete.style.padding = '4px';
    toggleButton_NeoPanelDelete.style.margin = '0px';
    toggleButton_NeoPanelDelete.style.width = '15%';
    toggleButton_NeoPanelDelete.style.border = 'none';
    toggleButton_NeoPanelDelete.style.borderRadius = '0px';
    toggleButton_NeoPanelDelete.style.cursor = 'pointer';
    toggleButton_NeoPanelDelete.style.userSelect = 'none';
    toggleButton_NeoPanelDelete.style.zIndex = '101';
    toggleButton_NeoPanelDelete.addEventListener('click', toggleNeoPanelDelete);

    document.body.appendChild(toggleButton_NeoPanelDelete);
}*/

function createNeoPanelDelete() {
    const NeoPanelDelete = document.createElement('div');
    NeoPanelDelete.id = 'NeoPanelDelete';
    NeoPanelDelete.style.position = 'fixed';
    NeoPanelDelete.style.bottom = '0px';
    NeoPanelDelete.style.left = '15%';
    NeoPanelDelete.style.width = '15%';
    NeoPanelDelete.style.height = '100%';
    NeoPanelDelete.style.backgroundColor = 'white';
    NeoPanelDelete.style.borderLeft = '1px solid #ccc';
    NeoPanelDelete.style.padding = '10px';
    NeoPanelDelete.style.zIndex = '100';
    NeoPanelDelete.style.resize = 'none';
    NeoPanelDelete.style.direction = 'rtl';
    NeoPanelDelete.style.overflow = 'auto';
    // Set the initial display state to 'none'
    NeoPanelDelete.style.display = 'none';
NeoPanelDelete.style.transform = 'rotate(180deg)';

// Add a wheel event listener to reverse the scroll direction
NeoPanelDelete.addEventListener('wheel', (event) => {
    // Reverse the wheel event's deltaY to reverse the scroll direction
    const scrollAmount = event.deltaY * -1;

    // Scroll the panel content by the reversed amount
    NeoPanelDelete.scrollTop += scrollAmount;

    // Prevent the default scroll behavior
    event.preventDefault();
});




    document.body.appendChild(NeoPanelDelete);
}





/* function toggleNeoPanelDelete() {
    const NeoPanelDelete = document.getElementById('NeoPanelDelete');
    if (NeoPanelDelete.style.display === 'block') {
        NeoPanelDelete.style.display = 'none';
    } else {
        NeoPanelDelete.style.display = 'block';
    }
}
*/
})();