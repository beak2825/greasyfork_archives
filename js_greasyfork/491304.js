// ==UserScript==
// @name         StumbleChatLog
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  View raw chat log
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491304/StumbleChatLog.user.js
// @updateURL https://update.greasyfork.org/scripts/491304/StumbleChatLog.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const handleUserMap = {}; // Initialize handleUserMap as an empty object
    // Define yourHandle variable
    const yourHandle = "myHandle"; // Replace "myHandle" with the actual handle

    function parseWebSocketMessage(message) {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.stumble === "joined") {
            const userList = parsedMessage.userlist;
            if (userList && userList.length > 0) {
                userList.forEach(user => {
                    const username = user.username || user.nick;
                    handleUserMap[user.handle] = username;
                    addUserToUserList({ handle: user.handle, username });
                });
            }
            const joinMessage = "A user or users joined the chat."; // Example join message
            displayWebSocketMessage(joinMessage);
        } else if (parsedMessage.stumble === "join") {
            const { handle, username } = parsedMessage;
            handleUserMap[handle] = username;
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

// Function to set up WebSocket listener
function setupWebSocketListener() {
    // Override WebSocket constructor to intercept WebSocket creation
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        //console.log('WebSocket URL:', url); :-)//
        console.log('Connected')

        // Call original WebSocket constructor
        const ws = new originalWebSocket(url, protocols);

        // Event listener for receiving messages
        ws.addEventListener('message', event => {
            handleWebSocketMessage(event.data);
        });

        return ws;
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
                        addUserToUserList({
                            username: user.username,
                            handle: user.handle,
                            active: true, // We just joined, so we're considered active
                            icon: "🟣" // Purple icon for our own user entry
                        }, "self");
                    } else {
                        // If it's not our own user, proceed as usual and add them to the user list
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
                addUserToUserList({ handle, username }, "join");
            }
        } else if (parsedMessage.stumble === "quit") {
            // Handle quit messages
            const handle = parsedMessage.handle;
            const username = handleUserMap[handle];
            if (username) {
                delete handleUserMap[handle];
                removeUserFromUserList(handle);
                setTimeout(() => {
                    removeUserFromUserList(handle);
                }, 30000); // 30 seconds delay
                addUserToUserList({ handle, username }, "quit");
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

    // Function to create user list div
    function createUserListDiv() {
        const userListDiv = document.createElement("div");
        userListDiv.id = "userList";
        userListDiv.style.position = "absolute"; // Change to absolute positioning
        userListDiv.style.top = "100px"; // Adjust top position as needed
        userListDiv.style.left = "10px"; // Adjust left position as needed
        userListDiv.style.height = "calc(100% - 100px)"; // Adjust height to fill remaining space
        userListDiv.style.overflowY = "auto";
        userListDiv.style.color = "#ffffff";
        userListDiv.style.padding = "10px";
        userListDiv.style.zIndex = "2"; // Set a higher z-index value
        userListDiv.style.display = "none"; // Hide the custom user list by default
        return userListDiv;
    }

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


// Function to update the user list display
function updateUserListDisplay() {
    // Get the user list element
    const userList = document.getElementById("userList");
    if (userList) {
        // Update the display with modified handleUserMap
        userList.innerHTML = ""; // Clear the user list
        for (const handle in handleUserMap) {
            const username = handleUserMap[handle];
            // Append the user to the user list with 'B' if present
            const listItem = document.createElement("li");
            listItem.textContent = `${username} (${handle})`;
            userList.appendChild(listItem);
        }
    }
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
                    updateUserListDisplay();
                    // Update the users.txt file
                    saveUserListToFile();
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
updateUserListDisplay();


// Function to display WebSocket messages and update user list
function displayWebSocketMessage(message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.stumble === "join") {
        // Handle join messages: Extract handle and username from the message
        const { handle, username } = parsedMessage;
        // Map handle to username in handleUserMap
        handleUserMap[handle] = username;
        // Add the user to the custom user list with the appropriate icon (join user)
        addUserToUserList({ handle, username }, "join");
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
        } else if (text.startsWith("#ai ")) {
            console.log("ai");
            // Extract the word after "#ai"
            const word = text.substring(4);
            console.log("Word after '#ai':", word);
            // Call your AI function here with the extracted word
            DoAi(word); // Adjust parameters as needed
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
                // Add the user to the custom user list with the appropriate icon
                addUserToUserList({ handle: user.handle, username }, "joined");
            });
        }
    } else if (parsedMessage.stumble === "quit") {
        // Handle quit messages: Remove users from handleUserMap and custom user list
        const handle = parsedMessage.handle;
        const username = handleUserMap[handle];
        if (username) {
            // Remove the handle from handleUserMap
            delete handleUserMap[handle];
            // Remove the user from the custom user list
            removeUserFromUserList(handle);
        }
    }
}



// Function to add user to user list with appropriate icon based on user type
function addUserToUserList(user, userType) {
    const userList = document.getElementById("userList");
    if (!userList) return;

    const userItem = document.createElement("div");
    userItem.textContent = `${user.username}`;

    // Define the default dot color and icon
    let dotColor = "red"; // Default dot color
    let icon = "🔴"; // Default icon for inactive users

    // Set dot color and icon based on user type
    if (userType === "self") {
        dotColor = "purple"; // Purple for self user
        icon = "🟣"; // Purple circle icon
    } else if (userType === "join") {
        dotColor = "blue"; // Blue for join user
        icon = "🔵"; // Blue circle icon
    } else if (userType === "joined") { // "self" user type listener for user list"
        dotColor = "green"; // Green for joined user
        icon = "🟢"; // Green circle icon
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
// Function to update handleUserMap and add users to custom user list
function updateUserListAndMapOnJoin(user) {
    // Update handleUserMap with the new user
    handleUserMap[user.handle] = user.username || user.nick; // Derive username from handle or nick
    // Add the new user to the custom user list
    addUserToUserList(user);
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

// Call the function to create the user list div
const userListDiv = createUserListDiv();
const chatContainer = document.getElementById("chat-container");
if (chatContainer) {
    chatContainer.appendChild(userListDiv); // Append to chat container instead
} else {
    document.body.appendChild(userListDiv);
}

 // Function to remove user from custom user list
 function removeUserFromUserList(handle) {
    const userList = document.getElementById("userList");
    if (userList) {
        const userElements = userList.querySelectorAll("div");
        userElements.forEach(userElement => {
            if (userElement.textContent.includes(`(${handle})`)) {
                userElement.remove();
            }
        });
    }
}

    // Function to toggle visibility of custom user list
    function toggleCustomUserList() {
        const userListDiv = document.getElementById("userList");
        if (userListDiv) {
            userListDiv.style.display = userListDiv.style.display === "none" ? "block" : "none";
        }
    }

    // Add a button to toggle visibility of custom user list
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "U";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.left = "10px";
    toggleButton.addEventListener("click", toggleCustomUserList);
    document.body.appendChild(toggleButton);

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

})();

