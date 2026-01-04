// ==UserScript==
// @name         anti-afk stumblechat hell
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  calls tokes if afk
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522520/anti-afk%20stumblechat%20hell.user.js
// @updateURL https://update.greasyfork.org/scripts/522520/anti-afk%20stumblechat%20hell.meta.js
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

            const joinMessage = `${username} joined the chat.`;
            displayWebSocketMessage(joinMessage);
        } else if (parsedMessage.stumble === "quit") {
            const handle = parsedMessage.handle;
            const username = handleUserMap[handle];
            if (username) {
                delete handleUserMap[handle];
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
                    // If it's our own user, update handleUserMap and display our own handle in the user list
                    if (isSelf) {
                        // Update handleUserMap with our own handle and username
                        handleUserMap[user.handle] = user.username || user.nick;
                        // Add our own handle to the custom user list with purple icon
                            console.log('const originalWebSocket = window.WebSocket found self for white dot. Applying!')
                    } else {

                        updateUserListAndMapOnJoin(user);
                    }
                });
            }
        } else if (parsedMessage.stumble === "join") {
            // Handle join messages
            const { handle, username } = parsedMessage;
            // Check if the user being added is not ourselves
            if (handle !== yourHandle) {
                handleUserMap[handle] = username;
            }
        } else if (parsedMessage.stumble === "quit") {
            // Handle quit messages
            const handle = parsedMessage.handle;
            const username = handleUserMap[handle];
            if (username) {
                // Remove the user from the handleUserMap
                delete handleUserMap[handle];
                // Remove the user from the user list
                console.log('user departed')

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

            // Check if the system message contains the client version
            if (systemMessage.startsWith('"Client Version:')) {
                // Save the user list to a file
                console.log("sysmsgdetected");
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
        if (text.startsWith("#ban")) {
            // Extract the handle from the message
            const handleToBan = text.replace("#ban", "").trim();
            if (handleToBan !== "") {
                // Check if the handle exists in the handleUserMap
                if (handleUserMap.hasOwnProperty(handleToBan)) {
                    // Add 'B' next to the handle number
                    handleUserMap[handleToBan] += " B";
                    // Update the user list display
                } else {
                    alert("Handle not found!");
                }
            } else {
                alert("Invalid handle!");
            }
        }
    }
}

// Call functions to set up overlay, WebSocket listener, and initial user list display

setupWebSocketListener();

// Function to display WebSocket messages and update user list
function displayWebSocketMessage(message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.stumble === "join") {
        // Handle join messages: Extract handle and username from the message
        const { handle, username } = parsedMessage;
        // Map handle to username in handleUserMap
        handleUserMap[handle] = username;
    } else if (parsedMessage.stumble === "msg") {
        // Handle message messages: Extract handle and text from the message
        const { handle, text } = parsedMessage;
        // Retrieve username from handleUserMap or use handle if not found
        const username = handleUserMap[handle] || handle;
        // Display the message in the WebSocket messages div
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        if (webSocketMessagesDiv) {
            // Append the message with a newline character
            webSocketMessagesDiv.textContent += `${username}: ${text}\n`;
            // Scroll to the bottom of the messages div
            webSocketMessagesDiv.scrollTop = webSocketMessagesDiv.scrollHeight;
        }

        // Additional logic for handling commands
        if (text === "#join") {
            console.log("join");
            // Add your logic here
        } else if (text === "#icon") {
            console.log("icon");
            // Add your logic here
        } else if (text === "#tokes") {
            console.log("tokes");
            // Call your tokes function here
            TokesSendEnter();
        } else if (text === ".afk meklin") {
            console.log("tokes");
            // Call your tokes function here
            MeklinSendEnter();
        } else if (text === ".afk kyskye") {
            console.log("tokes");
            // Call your tokes function here
            KyskyeSendEnter();
        } else if (text.startsWith("#ai ")) {
            console.log("ai");
            // Extract the word after "#ai"
            const word = text.substring(4);
            console.log("Word after '#ai':", word);
            // Call your AI function here with the extracted word
            //DoAi(word); // Adjust parameters as needed
        }
    } else if (parsedMessage.stumble === "joined") {
        // Handle joined messages: Add users to handleUserMap and custom user list
        const userList = parsedMessage.userlist;
        if (userList && userList.length > 0) {
            userList.forEach(user => {
                // Extract username from either "username" or "nick"
                const username = user.username || user.nick;
                // Map handle to username in handleUserMap
                handleUserMap[user.handle] = username;
            });
        }
    } else if (parsedMessage.stumble === "quit") {
        // Handle quit messages: Remove users from handleUserMap and custom user list
        const handle = parsedMessage.handle;
        const username = handleUserMap[handle];
        if (username) {
            // Remove the handle from handleUserMap
            delete handleUserMap[handle];
            console.log('line 323 user departed')
        }
    }
}




// Function to update handleUserMap and add users to custom user list
function updateUserListAndMapOnJoin(user) {
    // Update handleUserMap with the new user
    handleUserMap[user.handle] = user.username || user.nick; // Derive username from handle or nick
}

// Function to create WebSocket messages div
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

// Function to send the "Tokes in 20 seconds" message and simulate Enter key press
function KyskyeSendEnter() {
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

// Function to send the "Tokes in 20 seconds" message and simulate Enter key press
function MeklinSendEnter() {
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


let input; // Declare input as a global variable

// Function to create input element
function createInputBox() {
    input = document.createElement('input'); // Assign to global variable
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.position = 'fixed';
    input.style.bottom = '50px';
    input.style.left = '10px';
    input.style.zIndex = '9999';

    const button = document.createElement('button');
    button.textContent = 'Send';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '10px';
    button.style.zIndex = '9999';

    // Attach a single event listener for all behaviors
    button.addEventListener('click', function () {
        const msg = input.value.trim();
        if (msg.startsWith('/kick')) {
            const username = msg.substring(6).trim();
            const handle = Object.keys(handleUserMap).find(key => handleUserMap[key] === username);
            if (handle) {
                webSocket.send(JSON.stringify({
                    "stumble": "kick",
                    "handle": handle
                }));
            } else {
                console.error('Username not found');
            }
        } else if (msg.startsWith('/ban')) {
            const username = msg.substring(5).trim();
            const handle = Object.keys(handleUserMap).find(key => handleUserMap[key] === username);
            if (handle) {
                webSocket.send(JSON.stringify({
                    "stumble": "ban",
                    "handle": handle
                }));
            } else {
                console.error('Username not found');
            }
        } else if (webSocket && webSocket.readyState === WebSocket.OPEN && msg !== "") {
            webSocket.send(JSON.stringify({
                "stumble": "msg",
                "text": msg
            }));
            console.log('Sending regular message:', msg);
        } else {
            console.error('WebSocket is not defined or message is empty');
        }
        input.value = ""; // Clear the input field after handling
    });

    document.body.appendChild(input);
    document.body.appendChild(button);
}

// Function to send JSON data to WebSocket server
function sendJSONData(data) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(data));
        console.log('JSON data sent:', data);
    } else {
        console.error('WebSocket connection is not open');
    }
}

// Initialize input box
createInputBox();

})();