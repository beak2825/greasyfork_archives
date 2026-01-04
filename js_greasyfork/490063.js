// ==UserScript==
// @name         Intercept VIII
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  Intercept WebSocket messages on StumbleChat and display them
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490063/Intercept%20VIII.user.js
// @updateURL https://update.greasyfork.org/scripts/490063/Intercept%20VIII.meta.js
// ==/UserScript==

(function() {
    'use strict';

function createWebSocketMessagesDiv() {
    const div = document.createElement("div");
    div.id = "webSocketMessages";
    div.style.position = "relative";
    div.style.height = "25%";
    div.style.paddingLeft = "2px";
    div.style.visibility = "visible"; // Ensure the div is visible
    div.style.willChange = "transform";
    div.style.boxSizing = "border-box";
    div.style.overflowX = "hidden";
    div.style.overflowY = "auto";
    div.style.color = "#ffffff"; // Set font color to white
    div.style.padding = "10px"; // Example padding
    div.style.zIndex = "777"; // Set a higher z-index value

    // Additional styles for specific scenarios
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "flex-end";
    div.style.fontSize = "18px";

    div.style.whiteSpace = "pre-wrap"; // Allow text to wrap within the container
    div.style.wordWrap = "break-word"; // Allow long words to break and wrap

    // Locate the chat-position div
    const chatPositionDiv = document.getElementById("chat-position");
    if (chatPositionDiv) {
        // Append custom div to the chat-position div
        chatPositionDiv.appendChild(div);
    } else {
        // If chat-position div not found, append to document body as fallback
        document.body.appendChild(div);
    }
}

    // Call the function to create the WebSocket messages div
    createWebSocketMessagesDiv();

    // Handle-username mapping
    let handleUserMap = {};

function displayWebSocketMessage(message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.stumble === "join") {
        // Handle regular join messages as before
        const { handle, username } = parsedMessage;
        handleUserMap[handle] = username;
    } else if (parsedMessage.stumble === "msg") {
        // Handle regular message messages as before
        const { handle, text } = parsedMessage;
        const username = handleUserMap[handle] || handle;
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        if (webSocketMessagesDiv) {
            // Append the message with a newline character
            webSocketMessagesDiv.textContent += `${username}: ${text}\n`;
            webSocketMessagesDiv.scrollTop = webSocketMessagesDiv.scrollHeight;
        }
    } else if (parsedMessage.stumble === "joined") {
        // Handle the special "joined" messages to add users to the handleUserMap
        const userList = parsedMessage.userlist;
        if (userList && userList.length > 0) {
            userList.forEach(user => {
                handleUserMap[user.handle] = user.username || user.nick;
            });
        }
    }
}

    // Override WebSocket constructor to intercept WebSocket creation
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log('WebSocket URL:', url);

        // Call original WebSocket constructor
        const ws = new originalWebSocket(url, protocols);

        // Event listener for receiving messages
        ws.addEventListener('message', event => {
            displayWebSocketMessage(event.data);
        });

        return ws;
    };

    // Function to clear messages
    function clr() {
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        if (webSocketMessagesDiv) {
            webSocketMessagesDiv.innerHTML = "";
        }
    }

function IrcMode() {
    const chatContent = document.getElementById("chat-content");
    if (chatContent) {
        // Remove the chat-content div from the DOM
        chatContent.remove();
        // Move the webSocketMessagesDiv and the form input to fixed position
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        const formInput = document.getElementById("input");
        if (webSocketMessagesDiv && formInput) {
            webSocketMessagesDiv.style.position = "fixed";
            webSocketMessagesDiv.style.top = "0px";
            webSocketMessagesDiv.style.height = "90%"; // Adjust height to 90%
            webSocketMessagesDiv.style.overflowY = "auto"; // Add scrollbar
            formInput.style.position = "fixed";
            formInput.style.bottom = "0px";
        }
        // Create Save Text button
        createSaveTextButton();
    }
    // Disable the room.js functionality
    disableRoomJS();
}

// Function to save text content without <br> elements
async function saveText() {
    console.log("Save Text button clicked."); // Debugging: Log button click
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    if (webSocketMessagesDiv) {
        console.log("webSocketMessagesDiv found:", webSocketMessagesDiv); // Debugging: Log webSocketMessagesDiv
        const textContent = webSocketMessagesDiv.textContent.replaceAll('\n', '\r\n');
        console.log("Text content:", textContent); // Debugging: Log extracted text content
        try {
            // Use File System Access API to prompt user to save text content to a file
            const handle = await window.showSaveFilePicker({
                types: [{
                    description: 'Text Files',
                    accept: {
                        'text/plain': ['.txt']
                    }
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(textContent);
            await writable.close();
            console.log("Text content saved."); // Debugging: Log text saving success
        } catch (error) {
            console.error("Error saving text content:", error); // Log error if saving fails
        }
    } else {
        console.log("webSocketMessagesDiv not found."); // Debugging: Log if webSocketMessagesDiv is not found
    }
}

// Function to create Save Text button
function createSaveTextButton() {
    const saveTextButton = document.createElement("button");
    saveTextButton.id = "saveTextButton";
    saveTextButton.textContent = "Save Text";
    saveTextButton.style.position = "fixed"; // Position fixed
    saveTextButton.style.bottom = "10px"; // Adjust bottom position
    saveTextButton.style.left = "10px"; // Adjust left position
    saveTextButton.style.background = "black";
    saveTextButton.style.color = "lime";
    saveTextButton.style.border = "none";
    saveTextButton.style.padding = "5px 10px";
    saveTextButton.style.cursor = "pointer";
    saveTextButton.type = "button"; // Specify that it's a button and not submit
    saveTextButton.addEventListener("click", saveText);
    document.body.appendChild(saveTextButton); // Append to document body
}

// Function to remove Save Text button
function removeSaveTextButton() {
    const saveTextButton = document.getElementById("saveTextButton");
    if (saveTextButton) {
        saveTextButton.remove();
    }
}

// Call the function to remove the Save Text button initially
removeSaveTextButton();

// Function to disable room.js functionality
function disableRoomJS() {
    // Remove the event listener for message reception
    window.removeEventListener('messageReceived', handleMessageReceived);
}

// Example function that handles incoming messages in room.js
function handleMessageReceived(event) {
    // Logic to process incoming messages
}

// Modify the handleKeyPress function to handle button clicks as well
function handleKeyPress(event) {
    if ((event.key === 'Enter' || event.code === 'Enter') && !event.shiftKey) {
        event.preventDefault(); // Prevent the default behavior (creating a new line)
        // Call your message sending function here
        sendMessage();
        // Reset the input box's content
        resetInputBox();
    }
}

// Function to insert predefined text and simulate Enter key press
function insertPredefinedTextAndPressEnter() {
    // Insert predefined text
    const textArea = document.getElementById("textarea");
    textArea.value += "(╭☞ ͡ ͡°͜ ʖ ͡ ͡ )╭☞";

    // Simulate Enter key press
    const event = new KeyboardEvent('keypress', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
    });
    textArea.dispatchEvent(event);
}

// Create a button to insert predefined text and press Enter
function createInsertTextButton() {
    const insertTextButton = document.createElement("button");
    insertTextButton.textContent = "☞";
    insertTextButton.style.background = "black";
    insertTextButton.style.color = "lime";
    insertTextButton.style.border = "none";
    insertTextButton.style.padding = "5px 10px";
    insertTextButton.style.cursor = "pointer";
    insertTextButton.type = "button"; // Specify that it's a button and not submit
    insertTextButton.addEventListener("click", insertPredefinedTextAndPressEnter);
    const textArea = document.getElementById("textarea");
    textArea.parentElement.appendChild(insertTextButton);
}

// Call the function to create the insert text button
createInsertTextButton();

// Function to reset the input box's content
function resetInputBox() {
    const textArea = document.getElementById("textarea");
    if (textArea) {
        textArea.value = ""; // Clear the textarea
    }
}

    function createPopup() {
        const popup = document.createElement("div");
        popup.id = "messagePopup";
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.background = "#fff";
        popup.style.padding = "20px";
        popup.style.border = "1px solid #ccc";
        popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
        popup.style.zIndex = "9999";

        const textarea = document.createElement("textarea");
        textarea.id = "popupTextarea";
        textarea.placeholder = "Type a message";
        textarea.maxLength = "500";
        textarea.style.width = "100%";
        textarea.style.marginBottom = "10px";
        popup.appendChild(textarea);

        const sendButton = document.createElement("button");
        sendButton.textContent = "Send";
        sendButton.style.background = "black";
        sendButton.style.color = "lime";
        sendButton.style.border = "none";
        sendButton.style.padding = "5px 10px";
        sendButton.style.cursor = "pointer";
        sendButton.addEventListener("click", sendMessage);
        popup.appendChild(sendButton);

        document.body.appendChild(popup);
    }

    function openPopup() {
        const popup = document.getElementById("messagePopup");
        if (popup) {
            popup.style.display = "block";
        } else {
            createPopup();
        }
    }

    function closePopup() {
        const popup = document.getElementById("messagePopup");
        if (popup) {
            popup.style.display = "none";
        }
    }

    function sendMessage() {
        const textArea = document.getElementById("popupTextarea");
        if (textArea) {
            const message = textArea.value.trim();
            if (message !== "") {
                // Modify your logic here to match the behavior of their Message.send function
                // For example, if you're directly sending to the WebSocket:
                StumbleChat.WebSocket.send(JSON.stringify({
                    "stumble": "msg",
                    "text": message
                }));
                // Clear the textarea after sending the message
                textArea.value = "";
                closePopup();
            }
        }
    }

function clrall() {
    const chatContent = document.getElementById("chat-content");
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    if (chatContent && webSocketMessagesDiv) {
        // Clear all child elements of chatContent
        chatContent.innerHTML = "";
        // Move webSocketMessagesDiv to the bottom
        chatContent.appendChild(webSocketMessagesDiv);
        // Adjust height of webSocketMessagesDiv
        webSocketMessagesDiv.style.height = "75%";
    }
}

// Function to toggle compact view
function toggleCompactView() {
    const messages = document.querySelectorAll('.message .content');
    messages.forEach(message => {
        message.classList.toggle('compact');
    });
}

// Function to create and populate handle-username dropdown menu
function createHandleUsernameDropdown() {
    const handleUsernameDropdown = document.createElement("select");
    handleUsernameDropdown.id = "handleUsernameDropdown";
    handleUsernameDropdown.style.margin = "0 5px";
    handleUsernameDropdown.innerHTML = '<option value="" disabled selected>who</option>';
    for (const handle in handleUserMap) {
        const option = document.createElement("option");
        option.value = handle;
        option.textContent = handleUserMap[handle];
        handleUsernameDropdown.appendChild(option);
    }
    return handleUsernameDropdown;
}

// Create top buttons
function createTopButtons() {
    const topButtonsDiv = document.createElement("div");
    topButtonsDiv.id = "topButtons";
    topButtonsDiv.style.position = "fixed";
    topButtonsDiv.style.top = "10px";
    topButtonsDiv.style.left = "50%";
    topButtonsDiv.style.transform = "translateX(-50%)";
    topButtonsDiv.style.zIndex = "9999";

    // Clear WebSocket messages button
    const clrButton = document.createElement("button");
    clrButton.textContent = "clr";
    clrButton.style.background = "black";
    clrButton.style.color = "lime";
    clrButton.addEventListener("click", clr);
    topButtonsDiv.appendChild(clrButton);

    // Clear WebSocket messages button
    const clrallButton = document.createElement("button");
    clrallButton.textContent = "clrall";
    clrallButton.style.background = "black";
    clrallButton.style.color = "lime";
    clrallButton.addEventListener("click", clr);
    topButtonsDiv.appendChild(clrallButton);

    // Delete chat and switch to IRC only mode
    const IrcModeButton = document.createElement("button");
    IrcModeButton.textContent = "irc";
    IrcModeButton.style.background = "black";
    IrcModeButton.style.color = "lime";
    IrcModeButton.addEventListener("click", IrcMode);
    topButtonsDiv.appendChild(IrcModeButton);

    // Dropdown menu for handle-username mapping
    const handleUsernameDropdown = createHandleUsernameDropdown();
    topButtonsDiv.appendChild(handleUsernameDropdown);

    // Color picker button
    const colorPickerButton = document.createElement("button");
    colorPickerButton.textContent = "Color";
    colorPickerButton.style.background = "black";
    colorPickerButton.style.color = "lime";
    colorPickerButton.style.margin = "0 5px";
    colorPickerButton.addEventListener("click", () => {
        openColorPickerPopup();
    });
    topButtonsDiv.appendChild(colorPickerButton);

    // Font size dropdown
    const fontSizeDropdown = document.createElement("select");
    fontSizeDropdown.id = "fontSizeDropdown";
    fontSizeDropdown.style.margin = "0 5px";
    for (let i = 1; i <= 20; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        fontSizeDropdown.appendChild(option);
    }
    fontSizeDropdown.addEventListener("change", () => {
        const selectedFontSize = fontSizeDropdown.value;
        applyFontSize(selectedFontSize);
    });
    topButtonsDiv.appendChild(fontSizeDropdown);

    // Append top buttons div to document body
    document.body.appendChild(topButtonsDiv);
}

// Function to apply font size to WebSocket messages
function applyFontSize(fontSize) {
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    if (webSocketMessagesDiv) {
        webSocketMessagesDiv.style.fontSize = `${fontSize}px`;
    }
}

// Call the function to create top buttons
createTopButtons();

// Function to open color picker popup
function openColorPickerPopup() {
    const popup = document.createElement("div");
    popup.id = "colorPickerPopup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#1f1f1f";
    popup.style.padding = "20px";
    popup.style.border = "2px solid #ffffff";
    popup.style.zIndex = "99999";

    const backgroundLabel = document.createElement("label");
    backgroundLabel.textContent = "Background Color:";
    backgroundLabel.style.color = "#ffffff";
    popup.appendChild(backgroundLabel);

    const backgroundColorInput = document.createElement("input");
    backgroundColorInput.type = "color";
    backgroundColorInput.id = "backgroundColorInput";
    backgroundColorInput.style.marginRight = "10px";
    backgroundColorInput.value = "#000000";
    popup.appendChild(backgroundColorInput);

    const fontColorLabel = document.createElement("label");
    fontColorLabel.textContent = "Font Color:";
    fontColorLabel.style.color = "#ffffff";
    popup.appendChild(fontColorLabel);

    const fontColorInput = document.createElement("input");
    fontColorInput.type = "color";
    fontColorInput.id = "fontColorInput";
    fontColorInput.style.marginRight = "10px";
    fontColorInput.value = "#ffffff";
    popup.appendChild(fontColorInput);

    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply";
    applyButton.style.background = "black";
    applyButton.style.color = "lime";
    applyButton.style.marginTop = "10px";
    applyButton.addEventListener("click", () => {
        applyColors(backgroundColorInput.value, fontColorInput.value);
        popup.remove();
    });
    popup.appendChild(applyButton);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.background = "black";
    closeButton.style.color = "lime";
    closeButton.style.marginTop = "10px";
    closeButton.style.marginLeft = "10px";
    closeButton.addEventListener("click", () => {
        popup.remove();
    });
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
}

// Function to apply selected colors to WebSocket log
function applyColors(backgroundColor, fontColor) {
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    if (webSocketMessagesDiv) {
        webSocketMessagesDiv.style.backgroundColor = backgroundColor;
        webSocketMessagesDiv.style.color = fontColor;
    }
}

/* Additional compacting styles */
/*@-moz-document url-prefix("https://stumblechat.com/room/") {*/
// Compact message styles
const compactStyles = `
.message .nickname ~ .content {
    display: inline-block;
    top: -7px;
    position: relative;
    margin-left: 2px;
    margin-right: 1em;
}
.content + .content {
    display: inline-block!important;
    margin-right: 1em;
}
.message .nickname ~ .content span {
    line-height: 1.5em;
}
`;

// Apply compact styles to the document
const style = document.createElement('style');
style.textContent = compactStyles;
document.head.appendChild(style);
/*}*/

function createGenericButtons() {
    // Define button configurations
    const buttonConfigurations = [
        { name: 'c', text: 'Compact', clickHandler: toggleCompactView },
        { name: 's', text: 'Save', clickHandler: () => {
            // Functionality to save handle-username map to memory or file
            console.log("Save button clicked");
        }}
        // Add more button configurations as needed
    ];

    // Get the container for the buttons
    const container = document.getElementById('topButtons');

    // Loop through each button configuration and generate a button
    buttonConfigurations.forEach(config => {
        // Create a button element
        const button = document.createElement('button');
        button.textContent = config.text; // Use button text as text content
        button.style.background = "black";
        button.style.color = "lime";
        button.style.width = "50px"; // Set button width
        button.style.height = "20px"; // Set button height
        button.style.margin = "0 5px"; // Set button margin

        // Add event listener based on configuration
        button.addEventListener('click', config.clickHandler);

        // Append the button to the container in the DOM
        container.appendChild(button);
    });
}

// Call the function to create generic buttons
createGenericButtons();

})();









