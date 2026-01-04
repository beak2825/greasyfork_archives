// ==UserScript==
// @name         concatenated raw chat log stumblechat
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Automatic Moderation
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529647/concatenated%20raw%20chat%20log%20stumblechat.user.js
// @updateURL https://update.greasyfork.org/scripts/529647/concatenated%20raw%20chat%20log%20stumblechat.meta.js
// ==/UserScript==
let webSocket;

(function() {
    'use strict';

    let selfHandleSet = false; // Variable to track if the 'self' handle has been set
    let selfHandle; // Variable to store the 'self' handle

    const handleUserMap = {}; // Initialize handleUserMap as an empty object
    // Define yourHandle variable
    const yourHandle = "myHandle"; // Replace "myHandle" with the actual handle

    function parseWebSocketMessage(message) {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.stumble === "join") {
            const { handle, username } = parsedMessage;
            if (!selfHandleSet) {
                // If 'self' handle hasn't been set yet, set it now
                selfHandle = handle;
                handleUserMap[handle] = "self"; // Set the first entry as 'self'
                selfHandleSet = true;
            } else {
                handleUserMap[handle] = username;
            }
            addUserToUserList({ handle, username });
            const joinMessage = `${username} joined the chat.`;
            displayWebSocketMessage(joinMessage);
        } else if (parsedMessage.stumble === "quit") {
            const handle = parsedMessage.handle;
            const username = handleUserMap[handle];
            if (username) {
                delete handleUserMap[handle];
                removeUserFromUserList(handle);
                const quitMessage = `${username} left the chat.`;
                displayWebSocketMessage(quitMessage);
            }
        } else if (parsedMessage.stumble === "msg") {
            // Handle additional changes to the user list for specific "msg" messages
        }
    }

let webSocketURL; // Global variable to store the WebSocket URL!

// Function to set up WebSocket listener
function setupWebSocketListener() {
    // Override WebSocket constructor to intercept WebSocket creation
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        webSocket = new originalWebSocket(url, protocols); // Assign to global webSocket variable
        console.log('WebSocket URL:', webSocketURL);

        // Call original WebSocket constructor
        const ws = new originalWebSocket(url, protocols);

        // Event listener for receiving messages
        webSocket.addEventListener('message', event => {
            handleWebSocketMessage(event.data);
        });

        return webSocket;
    };
}

// WebSocket Listener: Override WebSocket constructor to intercept WebSocket creation
const originalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {

    // Call original WebSocket constructor
    const ws = new originalWebSocket(url, protocols);

    // Event listener for receiving messages
    ws.addEventListener('message', event => {
        const parsedMessage = JSON.parse(event.data);

        // Check if the message is a "joined" message
        if (parsedMessage.stumble === "joined") {
            // Extracting our own handle from the "self" object in the message
            const selfHandle = parsedMessage.self.handle;
            // Update handleUserMap and custom user list when a user joins
            const userList = parsedMessage.userlist;
            if (userList && userList.length > 0) {
                userList.forEach(user => {
                    // Check if the user being added is ourselves
                    const isSelf = user.handle === selfHandle;
                    // If it's our own user, update handleUserMap with our own handle
                    if (isSelf) {
                        handleUserMap[user.handle] = user.username || user.nick;
                        console.log('Found self, handleUserMap updated with self handle');
                    } else {
                        // If it's not ourselves, update the map with the new user
                        handleUserMap[user.handle] = user.username || user.nick;
                    }
                });
            }
        } else if (parsedMessage.stumble === "join") {
            // Handle join messages
            const { handle, username } = parsedMessage;
            if (handle !== yourHandle) {
                handleUserMap[handle] = username;
            }
        } else if (parsedMessage.stumble === "quit") {
            // Handle quit messages
            const handle = parsedMessage.handle;
            const username = handleUserMap[handle];
            if (username) {
                delete handleUserMap[handle];
                console.log('User left:', username);
            }
        } else if (parsedMessage.stumble === "msg") {
            // Handle message messages
            const { handle, text } = parsedMessage;
            const username = handleUserMap[handle] || handle;
            displayWebSocketMessage(event.data);
        }

        // Check if the message is a system message
        if (parsedMessage.stumble === "system") {
            const systemMessage = parsedMessage.message;
            if (systemMessage.startsWith('"Client Version:')) {
                console.log("System message detected, client version info received.");
            }
        }
    });

    return ws;
};



// Function to update handleUserMap with user data from the loaded file
function updateHandleUserMap(fileContent) {
    // Split the file content into lines
    const lines = fileContent.split('\n');

    // Iterate over each line to parse user data
    lines.forEach(line => {
        const userData = line.trim().split(' '); // Splitting by space to separate username and handle
        if (userData.length === 2) {
            const username = userData[0].trim();
            const handle = userData[1].trim();

            // Check if the handle already exists in the handleUserMap
            if (!handleUserMap.hasOwnProperty(handle)) {
                // Update user map with the new username and handle
                handleUserMap[handle] = username;
            }
        }
    });
}

// Function to get the user's own handle number (implement your own logic)
function getOwnHandle() {
    // Implement your logic to retrieve the user's own handle number
    // For demonstration purposes, return a hardcoded value
    return "123456"; // Replace with your actual handle number
 }

// WebSocket listener for handling messages
function handleWebSocketMessage(message) {
    const parsedMessage = JSON.parse(message);
    const ownHandle = getOwnHandle(); // Function to get the user's own handle number

    if (parsedMessage.stumble === "msg" && ownHandle === parsedMessage.handle) {
        const text = parsedMessage.text;
        // No ban logic, so just checking if it's a message
        // You can handle other message types here if necessary
    }
}

// Call functions to set up WebSocket listener
setupWebSocketListener();


// List of blocked usernames
const blockedUsers = ['AccountNameHere', 'hell']; // Modify this list as needed

// Track if blocking is enabled
let isBlockingEnabled = true;

// Flag to control whether messages should be concatenated or displayed individually
let isMessagesConcatenated = true;

// Function to toggle between concatenated and individual message displays
function toggleConcatenation() {
    isMessagesConcatenated = !isMessagesConcatenated;
    console.log(`Message display mode: ${isMessagesConcatenated ? "Concatenated" : "Individual"}`);

    // If we want to clear all previous concatenated messages when switching modes
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    if (webSocketMessagesDiv) {
        webSocketMessagesDiv.innerHTML = ''; // Clear all messages
    }

    // You can decide whether to clear the messages completely or preserve the chat history
    // based on your specific requirements.
}
// Modify the `displayWebSocketMessage` function to handle both concatenated and individual modes
function displayWebSocketMessage(message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.stumble === "join") {
        const { handle, username } = parsedMessage;
        handleUserMap[handle] = username;
        addUserToUserList({ handle, username }, "join");
    } else if (parsedMessage.stumble === "msg") {
        const { handle, text } = parsedMessage;
        const username = handleUserMap[handle] || handle;

        if (isMessagesConcatenated) {
            // Handle concatenated messages
            const webSocketMessagesDiv = document.getElementById("webSocketMessages");
            if (webSocketMessagesDiv) {
                let existingMessage = webSocketMessagesDiv.querySelector(`#message-${handle}`);
                if (existingMessage) {
                    existingMessage.textContent += ` . ${text}`;
                } else {
                    const messageDiv = document.createElement("div");
                    messageDiv.id = `message-${handle}`;
                    messageDiv.textContent = `${username}: ${text}`;
                    webSocketMessagesDiv.appendChild(messageDiv);
                }
                webSocketMessagesDiv.scrollTop = webSocketMessagesDiv.scrollHeight;
            }
        } else {
            // Handle individual messages (unconcatenated)
            const webSocketMessagesDiv = document.getElementById("webSocketMessages");
            if (webSocketMessagesDiv) {
                const messageDiv = document.createElement("div");
                messageDiv.id = `message-${handle}`;
                messageDiv.textContent = `${username}: ${text}`;
                webSocketMessagesDiv.appendChild(messageDiv);
                webSocketMessagesDiv.scrollTop = webSocketMessagesDiv.scrollHeight;
            }
        }

        // Additional logic for handling commands
        if (text === "#join") {
            console.log("join");
        } else if (text === "#icon") {
            console.log("icon");
        } else if (text === "#tokes") {
            console.log("tokes");
            TokesSendEnter();
        } else if (text.startsWith("#ai ")) {
            console.log("ai");
            const word = text.substring(4);
            console.log("Word after '#ai':", word);
        }
    } else if (parsedMessage.stumble === "joined") {
        const userList = parsedMessage.userlist;
        if (userList && userList.length > 0) {
            userList.forEach(user => {
                const username = user.username || user.nick;
                handleUserMap[user.handle] = username;
                addUserToUserList({ handle: user.handle, username }, "joined");
            });
        }
    } else if (parsedMessage.stumble === "quit") {
        const handle = parsedMessage.handle;
        const username = handleUserMap[handle];
        if (username) {
            delete handleUserMap[handle];
            removeUserFromUserList(handle);
            console.log('line 323 user departed')
        }
    }
}

// Create a button to toggle concatenation mode
const toggleConcatenateButton = document.createElement("button");
toggleConcatenateButton.textContent = "T";
toggleConcatenateButton.style.position = "fixed";
toggleConcatenateButton.style.top = "40px"; // Below the checkbox
toggleConcatenateButton.style.left = "10px";
toggleConcatenateButton.style.zIndex = "9999"; // Ensure the button is on top of other elements

// Add event listener to toggle the concatenation mode
toggleConcatenateButton.addEventListener("click", toggleConcatenation);

// Append the button to the body
document.body.appendChild(toggleConcatenateButton);

// Create a checkbox to toggle blocking functionality
const blockMessagesCheckbox = document.createElement("input");
blockMessagesCheckbox.type = "checkbox";
blockMessagesCheckbox.checked = isBlockingEnabled; // Initially checked
blockMessagesCheckbox.id = "blockMessagesCheckbox";

// Create a label for the checkbox
const checkboxLabel = document.createElement("label");
checkboxLabel.setAttribute("for", "blockMessagesCheckbox");
checkboxLabel.textContent = "Block messages from ignored users";

// Style the checkbox and label
blockMessagesCheckbox.style.position = "fixed";
blockMessagesCheckbox.style.top = "10px";
blockMessagesCheckbox.style.left = "10px";
blockMessagesCheckbox.style.zIndex = "9999"; // Ensure the checkbox is on top of other elements

checkboxLabel.style.position = "fixed";
checkboxLabel.style.top = "10px";
checkboxLabel.style.left = "40px";
checkboxLabel.style.zIndex = "9999"; // Ensure the label is on top of other elements
checkboxLabel.style.fontSize = "14px";
checkboxLabel.style.color = "white";

// Add event listener to the checkbox to toggle the blocking functionality
blockMessagesCheckbox.addEventListener("change", function () {
    isBlockingEnabled = blockMessagesCheckbox.checked;
    console.log(`Message blocking ${isBlockingEnabled ? "enabled" : "disabled"}`);
});

// Append the checkbox and label to the body
document.body.appendChild(blockMessagesCheckbox);
document.body.appendChild(checkboxLabel);


// Function to add user to user list with appropriate icon based on user type
function addUserToUserList(user, userType) {
    const userList = document.getElementById("userList");
    if (!userList) return;

    const userItem = document.createElement("div");
    userItem.textContent = `${user.username}`;

    // Define the default dot color and icon
    let dotColor; // Default dot color
    let icon; // Default icon

    // Set dot color and icon based on user type
    if (userType === "self") {
        console.log('[function addUserToList] found "self" for purple dot. Applying!')
        dotColor = "purple";
        icon = "🟣";

    } else if (userType === "join") {
        console.log('[function addUserToList] found "join" for green dot. Applying!')
        dotColor = "green";
        icon = "🟢";

    } else if (userType === "joined") {
        console.log('[function addUserToList] found "joined" for blue dot. Applying!')
        dotColor = "blue";
        icon = "🔵";

    } else {
        // For other user types, default to red dot
        console.log('[function addUserToList] found "userList" for green dot. Applying!')
        dotColor = "green";
        icon = "🟢";
        //dotColor = "red"; // FOR QUIT MSG
        //icon = "🔴";
    }

    // Add colored dot based on user status
    const dot = document.createElement("span");
    dot.textContent = icon;
    dot.style.color = dotColor;
    userItem.appendChild(dot);

    // Add custom icon for the user
    if (user.icon) {
        const customIcon = document.createElement("span");
        customIcon.textContent = user.icon;
        customIcon.style.marginLeft = "5px"; // Adjust margin as needed
        userItem.appendChild(customIcon);
    }

    userList.appendChild(userItem); // Append user item to the user list

    // If user is not active and not yourself, show popup for 5 seconds
    //if (!user.active && user.handle !== yourHandle) {
        //const popup = document.createElement("div");
        //popup.textContent = "WELCOME TO STUMBLECHAT YEOPARDY!";
        //popup.style.fontSize = "48px";
        //popup.style.position = "fixed";
        //popup.style.top = "50%";
        //popup.style.left = "50%";
        //popup.style.transform = "translate(-50%, -50%)";
        //popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        //popup.style.color = "white";
        //popup.style.padding = "10px";
        //popup.style.borderRadius = "5px";
        //document.body.appendChild(popup);

}
// Function to update handleUserMap without affecting the user list div
function updateUserListAndMapOnJoin(user) {
    // Update handleUserMap with the new user
    handleUserMap[user.handle] = user.username || user.nick; // Derive username from handle or nick
}

// Call the function to update the user list
function updateUserListOnMessage(userList) {
    return function(message) {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.stumble === "join" || parsedMessage.stumble === "msg" || parsedMessage.stumble === "joined") {
            // Add user to user list
            addUserToUserList(parsedMessage);
        }
    };
}

// Function to create WebSocket messages div
function createWebSocketMessagesDiv() {
    const div = document.createElement("div");
    div.id = "webSocketMessages";
    div.style.position = "fixed";
    div.style.height = "100%";
    div.style.paddingLeft = "2px";
    div.style.visibility = "visible"; // Ensure the div is visible
    div.style.willChange = "transform";
    div.style.boxSizing = "border-box";
    div.style.overflowX = "hidden";
    div.style.overflowY = "auto";
    div.style.color = "#ffffff"; // Set font color to white
    div.style.padding = "10px"; // Example padding
    div.style.zIndex = "2"; // Set a higher z-index value for the WebSocket messages div

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

function toggleWebSocketMessagesDiv() {
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    const chatContentDiv = document.getElementById("chat-content");
    if (webSocketMessagesDiv && chatContentDiv) {
        // Check the current display style of the WebSocket messages div
        const webSocketMessagesDisplayStyle = webSocketMessagesDiv.style.display;

        // Toggle the display of both divs based on the current display style of the WebSocket messages div
        if (webSocketMessagesDisplayStyle === "none") {
            // If WebSocket messages div is hidden, show it and hide chat content div
            webSocketMessagesDiv.style.display = "block";
            chatContentDiv.style.display = "none";
        } else {
            // If WebSocket messages div is visible, hide it and show chat content div
            webSocketMessagesDiv.style.display = "none";
            chatContentDiv.style.display = "block";
        }
    }
}
// This line keeps the default style and hides the socket log by default remove for default wss log
toggleWebSocketMessagesDiv()

// Add a button to toggle visibility of WebSocket messages div
const toggleMessagesButton = document.createElement("button");
toggleMessagesButton.textContent = "M";
toggleMessagesButton.style.position = "fixed";
toggleMessagesButton.style.right = "0px";
toggleMessagesButton.style.bottom = "0px";
toggleMessagesButton.addEventListener("click", toggleWebSocketMessagesDiv);
document.body.appendChild(toggleMessagesButton);

// Call the function to create the user list div


 // Function to remove user from custom user list
 function removeUserFromUserList(handle) {
    const userList = document.getElementById("userList");
    if (userList) {
        const userElements = userList.querySelectorAll("div");
        userElements.forEach(userElement => {
            if (userElement.textContent.includes(`(${handle})`)) {
                userElement.remove();
                console.log('line 490 user remove/depart')
            }
        });
    }
}



    // Function to clear messages
    function clr() {
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        if (webSocketMessagesDiv) {
            webSocketMessagesDiv.innerHTML = "";
        }
    }

// Function to apply font size to WebSocket messages
function applyFontSize(fontSize) {
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    if (webSocketMessagesDiv) {
        webSocketMessagesDiv.style.fontSize = `${fontSize}px`;
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

// Function to send the "Tokes in 20 seconds" message and simulate Enter key press
function TokesSendEnter() {
    // Insert predefined text
    const textArea = document.getElementById("textarea");
    textArea.value += 'Tokes in 20 seconds\n';

    // Simulate Enter key press
    const event = new KeyboardEvent('keypress', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
    });
    textArea.dispatchEvent(event);

    // Set a timeout to display "tokes started" message after 20 seconds
    setTimeout(function() {
        textArea.value += 'tokes started\n'; // Send message indicating tokes has started

        // Simulate Enter key press again
        textArea.dispatchEvent(event);
    }, 20000); // 20 seconds delay
}


// Function to create input element
function createInputBox() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.position = 'fixed'; // Set position to fixed
    input.style.bottom = '50px'; // Adjust bottom position as needed
    input.style.left = '10px'; // Adjust left position as needed
    input.style.zIndex = '9999'; // Set a high z-index value to ensure it's above other elements

    // Add event listener to detect when user presses Enter key
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const msg = input.value.trim();
            // Check if the message starts with '/kick'
            if (msg.startsWith('/kick')) {
                // Extract the username from the input text
                const username = msg.substring(6).trim(); // Assuming '/kick ' is 6 characters long
                // Check if the username exists in the handleUserMap
                const handle = Object.keys(handleUserMap).find(key => handleUserMap[key] === username);
                if (handle) {
                    // Send kick message to WebSocket server
                    webSocket.send(JSON.stringify({
                        "stumble": "kick",
                        "handle": handle
                    }));
                } else {
                    console.error('Username not found');
                }
                // Clear the input field after sending the message
                input.value = "";
            }
            // Check if the message starts with '/ban'
            else if (msg.startsWith('/ban')) {
                // Extract the username from the input text
                const username = msg.substring(5).trim(); // Assuming '/ban ' is 5 characters long
                // Check if the username exists in the handleUserMap
                const handle = Object.keys(handleUserMap).find(key => handleUserMap[key] === username);
                if (handle) {
                    // Send ban message to WebSocket server
                    webSocket.send(JSON.stringify({
                        "stumble": "ban",
                        "handle": handle
                    }));
                } else {
                    console.error('Username not found');
                }
                // Clear the input field after sending the message
                input.value = "";
            }
            // If the message is not a kick or ban command, send it as a regular message
            else {
                // Send normal message via sendMessage function
                sendMessage();
            }
        }
    });

    return input;
}

// Call the function to create input box
const input = createInputBox();

// Append input to the document body or wherever you want it to appear
document.body.appendChild(input);

// Function to handle sending message
function sendMessage() {
    // Get the value of the input
    const msg = input.value.trim();

    // Check if the WebSocket is not null and the message is not empty
    if (webSocket !== undefined && msg !== "") { // Check if webSocket is defined
        // Send the message via WebSocket
        webSocket.send(JSON.stringify({
            "stumble": "msg",
            "text": msg
        }));

        // Clear the input field after sending the message
        input.value = "";
    }
}

// Add event listener to input for the 'Enter' key press to send message
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});





})();
