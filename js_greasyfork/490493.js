// ==UserScript==
// @name         Hunter
// @namespace    http://tampermonkey.net/
// @version      0.94
// @description  Blacklist
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490493/Hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/490493/Hunter.meta.js
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

// WebSocket Listener: Override WebSocket constructor to intercept WebSocket creation
const originalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
    console.log('WebSocket URL:', url);

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

// Function to append new content to users.txt file
function appendToUserListFile(newContent) {
    // Create a Blob object containing the new content
    const blob = new Blob([newContent], { type: "text/plain" });

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "users.txt";

    // Simulate a click on the anchor element to start the download
    document.body.appendChild(a);
    a.click();

    // Remove the temporary anchor element
    document.body.removeChild(a);

    // Release the Object URL
    URL.revokeObjectURL(url);
}

// Function to save user list to users.txt file
function saveUserListToFile() {
    // Extracting user information from handleUserMap
    const users = [];
    for (const handle in handleUserMap) {
        const username = handleUserMap[handle];
        users.push(`${username} (${handle}) B`); // Append 'B' to the handle
    }

    // Convert the user list to a string
    const userListString = users.join("\n");

    // Append the new content to the existing users.txt file
    appendToUserListFile(userListString);
}

// Function to display the user list (handle map)
function displayUserList() {
    const userList = document.getElementById("userListDisplay");
    if (userList) {
        // Clear the user list before updating
        userList.innerHTML = "";
        // Iterate over the handleUserMap and display each handle and username
        for (const handle in handleUserMap) {
            const username = handleUserMap[handle];
            const listItem = document.createElement("li");
            listItem.textContent = `${username} (${handle})`;
            userList.appendChild(listItem);
        }
    }
}

// Function to create and append the pop-up window overlay with input menu and close button
function createUserOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "50%";
    overlay.style.width = "80%"; // container width
    overlay.style.left = "50%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9999";
    overlay.style.padding = "20px";
    overlay.style.textAlign = "center";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.addEventListener("click", () => {
        overlay.remove(); // Remove the overlay when the close button is clicked
    });
    overlay.appendChild(closeButton);

    const userListContainer = document.createElement("div");
    userListContainer.style.display = "flex";
    userListContainer.style.justifyContent = "space-between"; // Align columns to left and right edges
    overlay.appendChild(userListContainer);

    const userListHandleMap = document.createElement("ul");
    userListHandleMap.id = "userListHandleMap";
    userListHandleMap.style.listStyleType = "none";
    userListHandleMap.style.padding = "0";
    userListHandleMap.style.width = "50%"; // Adjust the percentage based on your layout needs
    userListHandleMap.style.color = "lime";
    userListHandleMap.style.backgroundColor = "black";
    userListContainer.appendChild(userListHandleMap);

    // Second column for data from loadUsersFromFile() function
    const userListLoadedFromFile = document.createElement("ul");
    userListLoadedFromFile.id = "userListLoadedFromFile"; // Add an id to reference the user list later
    userListLoadedFromFile.style.listStyleType = "none";
    userListLoadedFromFile.style.padding = "0";
    userListLoadedFromFile.style.color = "cyan"; // Set font color to cyan
    userListLoadedFromFile.style.backgroundColor = "black"; // Set background color to black
    userListLoadedFromFile.style.flex = "1"; // Use flex to make the column expand to fill available space
    userListLoadedFromFile.style.marginLeft = "10px"; // Add margin to separate from the first column
    userListContainer.appendChild(userListLoadedFromFile);

    function populateUserListHandleMap() {
        userListHandleMap.innerHTML = "";
        for (const handle in handleUserMap) {
            if (handleUserMap.hasOwnProperty(handle)) {
                const listItem = document.createElement("li");
                listItem.textContent = `${handleUserMap[handle]} (${handle})`;
                listItem.style.marginBottom = "5px";
                userListHandleMap.appendChild(listItem);
            }
        }
    }

    function populateUserListLoadedFromFile(loadedUsers) {
        userListLoadedFromFile.innerHTML = "";
        loadedUsers.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = `${user.username} (${user.handle})`;
            listItem.style.marginBottom = "5px";
            userListLoadedFromFile.appendChild(listItem);
        });
    }

    populateUserListHandleMap();

    const inputLabel = document.createElement("label");
    inputLabel.textContent = "Add 'B' to user handles:";
    inputLabel.style.color = "#ffffff";
    inputLabel.style.marginTop = "20px";
    overlay.appendChild(inputLabel);

    const inputField = document.createElement("input");
    inputField.id = "handleInput";
    inputField.type = "text";
    inputField.style.margin = "10px auto";
    inputField.style.display = "block";
    overlay.appendChild(inputField);

    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply";
    applyButton.style.margin = "10px auto";
    applyButton.style.display = "block";
    overlay.appendChild(applyButton);

    document.body.appendChild(overlay);
}



// Function to create and append the input box overlay with user list display
function createTartOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "50px";
    overlay.style.left = "0px";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "flex-start";

    const userList = document.createElement("ul");
    userList.id = "userList";
    userList.style.listStyleType = "none";
    overlay.appendChild(userList);

    const inputField = document.createElement("input");
    inputField.id = "commandInput";
    inputField.type = "text";
    inputField.placeholder = "Type command here...";
    inputField.style.margin = "10px";
    inputField.style.width = "200px"; // Adjust width as needed
    overlay.appendChild(inputField);

    // Listen for input changes
    inputField.addEventListener("input", () => {
        const command = inputField.value.trim();
        if (command.startsWith("#ban")) {
            const handle = command.replace("#ban", "").trim();
            if (handle !== "") {
                addBToHandleOrUsername(handle);
                inputField.value = ""; // Clear input field after processing command
            }
        }
        // Add more command listeners here as needed
    });

    document.body.appendChild(overlay);
}

// Function to create buttons for other overlays
function createButtonsForOverlays() {
    // Create button for Tart overlay
    const tartButton = document.createElement("button");
    tartButton.textContent = "Open Tart Overlay";
    tartButton.style.position = "fixed";
    tartButton.style.bottom = "50px";
    tartButton.style.left = "210px"; // Adjust position as needed
    tartButton.style.zIndex = "9999";
    tartButton.addEventListener("click", createTartOverlay);
    document.body.appendChild(tartButton);

    // Create button for User overlay
    const userButton = document.createElement("button");
    userButton.textContent = "Open User Overlay";
    userButton.style.position = "fixed";
    userButton.style.bottom = "50px";
    userButton.style.left = "420px"; // Adjust position as needed
    userButton.style.zIndex = "9999";
    userButton.addEventListener("click", createUserOverlay);
    document.body.appendChild(userButton);
}

// Call the function to create buttons for other overlays
createButtonsForOverlays();

// Function to create and append the input box overlay
function createBox() {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "50px";
    overlay.style.left = "0px";
    overlay.style.zIndex = "9999";

    const inputField = document.createElement("input");
    inputField.id = "commandInput";
    inputField.type = "text";
    inputField.placeholder = "Type command here...";
    inputField.style.margin = "10px";
    inputField.style.width = "200px"; // Adjust width as needed
    overlay.appendChild(inputField);

    let commandBuffer = ""; // Buffer to store the command until Enter is pressed

    // Listen for input changes
    inputField.addEventListener("input", () => {
        commandBuffer = inputField.value.trim(); // Update command buffer with current input
    });

    // Listen for keydown event
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            // Process the command when Enter key is pressed
            if (commandBuffer.startsWith("#ban ")) {
                const usernameOrHandle = commandBuffer.replace("#ban ", "").trim();
                if (usernameOrHandle !== "") {
                    addBToHandleOrUsername(usernameOrHandle);
                    inputField.value = ""; // Clear input field after processing command
                } else {
                    alert("Username or handle not provided!");
                }
            } else {
                alert("Invalid command! Please use '#ban usernameOrHandle'");
            }
            commandBuffer = ""; // Clear the command buffer after processing
        }
    });

    document.body.appendChild(overlay);
}

// Call the function to create the input box overlay
createBox();

function addBToHandleOrUsername(handleOrUsername) {
    let handle = handleOrUsername;
    let found = false;

    // Check if the handle exists in the handleUserMap
    if (handleUserMap.hasOwnProperty(handleOrUsername)) {
        handle = handleOrUsername;
        found = true;
    }

    if (found) {
        // Add 'B' next to the handle number
        handleUserMap[handle] += " B";
        // Update the user list display
        displayUserList();
        // Save the updated user list to the file
        saveUserListToFile();
    } else {
        alert("User not found!");
    }
}

// Function to load users from the users.txt file
function loadUsersFromFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const fileContent = event.target.result;
            // Update handleUserMap with user data from the loaded file
            updateHandleUserMap(fileContent);
            // Display loaded users
            console.log("Loaded Users:");
            for (const handle in handleUserMap) {
                if (handleUserMap.hasOwnProperty(handle)) {
                    console.log(`${handleUserMap[handle]} (${handle})`);
                }
            }
            // Define and populate loadedUsers based on handleUserMap
            const loadedUsers = Object.keys(handleUserMap).map(handle => ({
                handle: handle,
                username: handleUserMap[handle]
            }));
            // Example usage of addBToHandleOrUsername with loadedUsers
            addBToHandleOrUsername("handleOrUsername", loadedUsers);
        };

        reader.readAsText(file);
    });

    fileInput.click();
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
// Function to get the user's own handle number (implement your own logic)
function getOwnHandle() {
    // Implement your logic to retrieve the user's own handle number
    // For demonstration purposes, return a hardcoded value
    return "123456"; // Replace with your actual handle number
 }
// Function to set up WebSocket listener
function setupWebSocketListener() {
    // Override WebSocket constructor to intercept WebSocket creation
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log('WebSocket URL:', url);

        // Call original WebSocket constructor
        const ws = new originalWebSocket(url, protocols);

        // Event listener for receiving messages
        ws.addEventListener('message', event => {
            handleWebSocketMessage(event.data);
        });

        return ws;
    };
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

// Function to create fadeaway popup text with "WELCOME" message
function showWelcomePopupText() {
    const popup = document.createElement("div");
    popup.textContent = "WELCOME";
    popup.classList.add("fadeaway-popup");
    document.body.appendChild(popup);

    // Remove the popup after 3 seconds
    setTimeout(() => {
        popup.remove();
    }, 3000); // 3 seconds delay
}

 // Function to create SVG animation
function createSVGAnimation() {
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create rectangle inside SVG
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100");
    rect.setAttribute("height", "100");
    rect.setAttribute("fill", "blue");
    svg.appendChild(rect);

    // Append SVG to body
    document.body.appendChild(svg);

    // Animate SVG
    const animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animation.setAttribute("attributeName", "x");
    animation.setAttribute("from", "-100");
    animation.setAttribute("to", "100%");
    animation.setAttribute("dur", "5s");
    animation.setAttribute("repeatCount", "indefinite");
    rect.appendChild(animation);
}
// Call the function to show the welcome popup with SVG animation
showWelcomePopupText();
// Call the function to create SVG animation
createSVGAnimation();

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


// Function to handle click events for the new button
function handleLoadButtonClick() {
    // Add functionality for the new button here
    console.log('Load button clicked');
}

// Function to handle click events for the new button
function handleDisplayThingsButtonClick() {
    // Add functionality for the new button here
    console.log('Load button clicked');
}

// Create a new button configuration
const DisplayThingsButtonConfig = { name: 'd', text: 'display', clickHandler: handleDisplayThingsButtonClick };

// Create a new button configuration
const LoadButtonConfig = { name: 'n', text: 'Load', clickHandler: handleLoadButtonClick };

// Function to create generic buttons
function createGenericButtons() {
    // Define button configurations
    const buttonConfigurations = [
        { name: 'c', text: 'Compact', clickHandler: toggleCompactView },
        { name: 's', text: 'Save', clickHandler: () => {
            // Functionality to save handle-username map to memory or file
            console.log("Save button clicked");
            saveUserListToFile();
        }},
        { name: 'L', text: 'Load Users', clickHandler: loadUsersFromFile }, // Button to load users from file
        LoadButtonConfig, // Add the new button configuration here
        { name: 'D', text: 'Display Things', clickHandler: handleDisplayThingsButtonClick } // Button to load users from file
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


// Function to create a new button and append it to the container
function createDisconnectButton() {
    const container = document.getElementById('topButtons');

    // Create the button element
    const newButton = document.createElement('button');
    newButton.textContent = 'DC'; // Change the text as needed
    newButton.style.background = 'black';
    newButton.style.color = 'lime';
    newButton.style.width = '100px'; // Set the button width
    newButton.style.height = '30px'; // Set the button height
    newButton.style.margin = '0 5px'; // Set the button margin

    // Add event listener to the new button
    newButton.addEventListener('click', () => {
        // Add functionality for the new button here
        console.log('New button clicked');
    });

    // Append the new button to the container
    container.appendChild(newButton);
}

// Call the function to create the new button
createDisconnectButton();

// Function to load users from the users.txt file
function displayThings() {
    const users = [];
    // Placeholder for file content, replace this with your file reading logic
    // Example: You can use XMLHttpRequest, fetch API, or any other method to read the file
    // For simplicity, I'll use fetch API assuming users.txt is in the same directory
    fetch('users.txt')
        .then(response => response.text())
        .then(fileContent => {
            // Split the file content into lines
            const lines = fileContent.split('\n');

            // Iterate over each line to parse user data
            lines.forEach(line => {
                const userData = line.trim().split(' '); // Splitting by space to separate username and handle
                if (userData.length === 2) {
                    const username = userData[0].trim();
                    const handle = userData[1].trim();
                    users.push({ username, handle });
                    // Update user map
                    handleUserMap[handle] = username;
                }
            });

            // Display loaded users
            console.log("Loaded Users:");
            users.forEach(user => {
                console.log(`${user.username} (${user.handle})`);
            });
        })
        .catch(error => {
            console.error('Error loading users from file:', error);
        });

    return users;
}

// Find the CSP meta tag and modify its content attribute
const cspMeta = document.querySelector("meta[http-equiv='Content-Security-Policy']");
if (cspMeta) {
    cspMeta.setAttribute("content", "your-updated-csp-directives");
}

const proxyUrl = "http://65.25.72.68:43435"; // Add http:// or https:// as needed

// Function to call the AI and send its response to the chat room
function DoAi(cmd_arg) {
    // Define your OpenAI API key and other parameters
    const api_key = 'your-api-key';
    const endpoint = proxyUrl; // Use proxy server endpoint
    const max_tokens = 200;
    const max_parts = 10;
    const delay_between_parts = 2;
    const min_response_length = 10;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + api_key,
    };

    const data = {
        model: 'gpt-3.5-turbo',
        messages: [{role: 'system', content: 'You are a helpful assistant.'},
                    {role: 'user', content: cmd_arg}],
        max_tokens: max_tokens,
    };

    // Send the POST request to the API via proxy server
    fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Request failed with status code ' + response.status);
        }
        return response.json();
    })
    .then(result => {
        if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
            let response_text = result.choices[0].message.content;

            // Check if the response_text is not empty and meets the minimum length
            if (response_text.trim() && response_text.length >= min_response_length) {
                // Use regular expression to replace various line break characters
                response_text = response_text.replace(/[\r\n\t\f\v]+/g, ' ');

                // Split the response into parts based on sentence-like breaks
                const parts = response_text.match(/.{1,200}(?:\.\s|\.$|$)/g) || [];

                const num_parts = Math.min(max_parts, parts.length);

                // Calculate the time interval for rate limiting (15 seconds / 3 messages)
                const rate_limit_interval = 15.0 / 3;

                // Send each part with a delay
                parts.slice(0, num_parts).forEach((part, index) => {
                    setTimeout(() => {
                        // Send the part to the chat room
                        sendMessage(part);
                    }, index * delay_between_parts * 1000);
                });
            } else {
                sendMessage("AI response was blank or too short.");
            }
        } else {
            sendMessage("AI response format unexpected: " + JSON.stringify(result));
        }
    })
    .catch(error => {
        sendMessage("AI request failed: " + error.message);
    });
}


})();







