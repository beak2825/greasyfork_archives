// ==UserScript==
// @name         MetaMod
// @namespace    http://tampermonkey.net/
// @version      0.96
// @description  Screensaver
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/491324/MetaMod.user.js
// @updateURL https://update.greasyfork.org/scripts/491324/MetaMod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let websocketUrl = null; // Initialize websocketUrl variable
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

// Function to send ban message to WebSocket listener using the URL from wss.txt
function ban(handle) {
    // Fetch the WebSocket URL from the wss.txt file
    fetch('wss.txt')
        .then(response => {
            if (response.ok) {
                // Read the contents of wss.txt
                return response.text();
            }
            throw new Error('Failed to read WebSocket URL from wss.txt');
        })
        .then(webSocketUrl => {
            // Establish WebSocket connection using the URL from wss.txt
            const socket = new WebSocket(webSocketUrl);
            // Event listener for when the WebSocket connection is open
            socket.addEventListener('open', () => {
                // Send the ban message using the WebSocket connection
                socket.send(JSON.stringify({
                    "stumble": "ban",
                    "handle": handle
                }));
            });
            // Event listener for errors
            socket.addEventListener('error', error => {
                console.error('WebSocket connection error:', error);
            });
        })
        .catch(error => {
            console.error('Error reading WebSocket URL:', error);
        });
}

    // Function to set up WebSocket listener
    function setupWebSocketListener() {
        // Override WebSocket constructor to intercept WebSocket creation
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            // Store the WebSocket URL when the connection is established
            websocketUrl = url;
            console.log('WebSocket URL:', websocketUrl);

            // Save the WebSocket URL to a file
            saveWebSocketUrlToFile(websocketUrl);

            // Call original WebSocket constructor
            const ws = new originalWebSocket(url, protocols);

            // Event listener for receiving messages
            ws.addEventListener('message', event => {
                handleWebSocketMessage(event.data);
            });

            return ws;
        };
    }

    // Function to save WebSocket URL to a file
    function saveWebSocketUrlToFile(url) {
        // Check if the file already exists
        fetch('wss.txt')
            .then(response => {
                // If the file exists, do nothing
                if (response.ok) {
                    console.log('File already exists. Skipping saving.');
                    return;
                }
                // If the file does not exist, save it
                const blob = new Blob([url], { type: 'text/plain' });
                const anchor = document.createElement('a');
                anchor.download = 'wss.txt';
                anchor.href = window.URL.createObjectURL(blob);
                anchor.click();
                window.URL.revokeObjectURL(anchor.href);
            })
            .catch(error => {
                // Handle errors
                console.error('Error checking file existence:', error);
            });
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

        // Add CSS to change cursor to pointer on hover
        userListDiv.style.cursor = "pointer";

        // Add hover effect to change background color
        userListDiv.addEventListener("mouseenter", () => {
            userListDiv.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        });

        userListDiv.addEventListener("mouseleave", () => {
            userListDiv.style.backgroundColor = "transparent";
        });

        return userListDiv;
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
    } else if (userType === "joined") { // "#join msg listener for game
        dotColor = "green"; // Green for joined user
        icon = "🟢"; // Green circle icon
    }

    // Add colored dot based on user status
    const dot = document.createElement("span");
    dot.textContent = icon;
    dot.style.color = dotColor;

    // Attach a click listener to the colored circle
    dot.addEventListener("click", () => {
        // Pass the handle to the ban function
        ban(user.handle);
    });

    userItem.appendChild(dot);

    // Add custom icon for the user
    if (user.icon) {
        const customIcon = document.createElement("span");
        customIcon.textContent = user.icon;
        customIcon.style.marginLeft = "5px"; // Adjust margin as needed
        userItem.appendChild(customIcon);
    }

    userList.appendChild(userItem); // Append user item to the user list
}

    // If user is not active and not yourself, show popup for 5 seconds
    //if (!user.active && user.handle !== yourHandle) { //this activates on anyone joining or leaving
        //const popup = document.createElement("div"); /the yeopardy script has svg animates for it
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

    // Call the function to create the user list div
    const userListDiv = createUserListDiv();

    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
        chatContainer.appendChild(userListDiv); // Append to chat container instead
    } else {
        document.body.appendChild(userListDiv);
    }

    // Call the function to attach click listener to colored Unicode circles
    attachClickListenerToCircles();

    // Call functions to set up overlay, WebSocket listener, and initial user list display
    setupWebSocketListener();
    updateUserListDisplay();

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

    // Function to attach click listener to colored Unicode circles
    function attachClickListenerToCircles() {
        // Get all elements with class 'colored-circle'
        const coloredCircles = document.querySelectorAll('.colored-circle');

        // Loop through each colored circle element
        coloredCircles.forEach(circle => {
            // Attach click listener
            circle.addEventListener('click', function() {
                // Get the handle associated with the clicked circle
                const handle = this.getAttribute('data-handle');
                // Log the handle to the console
                console.log('Clicked handle:', handle);
                // Call the banUser function with the WebSocket URL and handle
                ban(handle);
            });
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
                        //saveUserListToFile();
                    } else {
                        alert("Handle not found!");
                    }
                } else {
                    alert("Invalid handle!");
                }
            }
        }
    }

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
                //TokesSendEnter();
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
        const usersButton = document.createElement("button");
        usersButton.textContent = "U";
        usersButton.style.position = "fixed";
        usersButton.style.top = "10px";
        usersButton.style.left = "10px";
        usersButton.addEventListener("click", toggleCustomUserList);
        document.body.appendChild(usersButton);



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









    // Define a function to display surreal visuals within a toggleable overlay
    function createSurrealVisuals() {
        // Select the HTML element to display visuals
        const visualsContainer = document.createElement('div');
        visualsContainer.id = 'surreal-visuals-overlay';
        visualsContainer.style.position = 'fixed';
        visualsContainer.style.top = '0';
        visualsContainer.style.left = '0';
        visualsContainer.style.width = '100%';
        visualsContainer.style.height = '100%';
        visualsContainer.style.zIndex = '999'; // Set a high z-index
        visualsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        visualsContainer.style.display = 'none'; // Initially hide the overlay

        // Array of shapes and colors for surreal visuals
        const shapes = ['circle', 'square', 'triangle'];
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

        // Function to create surreal visuals
        function createVisuals() {
            // Clear existing visuals
            visualsContainer.innerHTML = '';

            // Create new visuals
            for (let i = 0; i < 10; i++) {
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];

                const visual = document.createElement('div');
                visual.classList.add('surreal-visual');
                visual.style.width = '50px';
                visual.style.height = '50px';
                visual.style.backgroundColor = color;
                visual.style.position = 'absolute';
                visual.style.top = Math.random() * window.innerHeight + 'px';
                visual.style.left = Math.random() * window.innerWidth + 'px';

                visualsContainer.appendChild(visual);
            }
        }

        // Call the function to create surreal visuals initially
        createVisuals();

        // Set interval to update visuals periodically
        const intervalId = setInterval(createVisuals, 5000); // Update every 5 seconds

        // Append the visuals container to the document body
        document.body.appendChild(visualsContainer);

        // Function to clear the interval when the overlay is closed
        visualsContainer.addEventListener('transitionend', function(event) {
            if (event.propertyName === 'display' && visualsContainer.style.display === 'none') {
                clearInterval(intervalId); // Stop updating visuals when overlay is closed
            }
        });
    }


    // Define a function to display cryptic messages within a toggleable overlay
    function displayCrypticMessages() {
        // Select the HTML element to display messages
        const overlayContainer = document.createElement('div');
        overlayContainer.id = 'cryptic-messages-overlay';
        overlayContainer.style.position = 'fixed';
        overlayContainer.style.top = '20%';
        overlayContainer.style.left = '50%';
        overlayContainer.style.width = '90%';
        overlayContainer.style.transform = 'translate(-50%, -50%)';
        overlayContainer.style.height = '100%';
        overlayContainer.style.zIndex = '1000';
        overlayContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlayContainer.style.display = 'none'; // Initially hide the overlay

        // Array of cryptic messages
        const messages = [
            '“It’s better to face madness with a plan than to sit still and let it take you in pieces.” ― Josh Malerman, "Bird Box"',
            '“What an excellent day for an exorcism.” — Demon, “The Exorcist”',
            '“Vampires, werewolves, fallen angels and fairies lurk in the shadows, their intentions far from honorable.” — Jeaniene Frost',
            '“If you gaze long enough into an abyss, the abyss will gaze back into you.” — Friedrich Nietzsche',
            '“Beware the dark pool at the bottom of our hearts. In its icy, black depths dwell strange and twisted creatures it is best not to disturb.” — Sue Grafton, “I is for Innocent”',
            '“Am I walking away from something I should be running away from?” — Shirley Jackson, “The Haunting of Hill House”',
            '“Sometimes dead is better.” — Stephen King, “Pet Sematary”',
            '“I was a newborn vampire, weeping at the beauty of the night.” — Anne Rice, “Interview with the Vampire”',
            '“All that we see or seem is but a dream within a dream.” — Edgar Allan Poe',
            '“Unfathomable to mere mortals is the lore of fiends.” — Nathaniel Hawthorne, “Young Goodman Brown”',
            '“Love will have its sacrifices. No sacrifice without blood.” — J. Sheridan Le Fanu, “Carmilla”',
            '“Everybody is a book of blood; wherever we’re opened, we’re red.” — Clive Barker, “Books of Blood”',
            '“Where there is no imagination, there is no horror.” — Arthur Conan Doyle',
            '“Would you like to see a magic trick?” — The Grabber, “The Black Phone”',
            '“Horror is like a serpent; always shedding its skin, always changing. And it will always come back.” — Dario Argento',
            '“There is something at work in my soul which I do not understand.” — Mary Shelley, “Frankenstein”',
            '“I’m scared to close my eyes, I’m scared to open them. We’re gonna die out here.” — Heather Donahue, “The Blair Witch Project”',
            '“Is there someone inside you?” — Psychiatrist, “The Exorcist”',
            '“I know of witches who whistle at different pitches, calling things that don’t have names.” — Helen Oyeyemi, “White is for Witching”',
            '“This is all it takes for people to plunge into insanity: one night alone with themselves and what they fear the most.” — Thomas Olde Heuvelt, “Hex”',
            '“They’re here.” — Carol Anne, “Poltergeist”',
            '“Come, dear. It’ll be easier for you than it was for Jason.” — Mrs. Voorhees, “Friday the 13th”',
            '“I knew nothing but shadows and I thought them to be real.” -Oscar Wilde, “The Picture of Dorian Gray”',
            '“Let’s talk, you and I. Let’s talk about fear.” — Stephen King, “Night Shift”',
            '“Dementors are vicious creatures. They will not distinguish between the one they hunt and the one who gets in their way.” — Albus Dumbledore, “Harry Potter and the Prisoner of Azkaban”',
            '“Evil thenceforth became my good.” — Mary Shelley, “Frankenstein”',
            '“Evil has only the power that we give it.” — Ray Bradbury, “Something Wicked This Way Comes”',
            '“When shall we meet again? In thunder, lightening, or in rain?” — William Shakespeare, “Macbeth”',
            '“I’m not gonna hurt ya. You didn’t let me finish my sentence. I said, ‘I’m not gonna hurt ya. I’m just going to bash your brains in!’” — Jack Torrance, “The Shining”',
            '“I shall never forget the afternoon when first I stumbled upon the half-hidden house of the dead.” — H.P. Lovecraft, “The Tomb”',
            '“Once upon a time, there was a girl and the girl had a shadow.” — Red, “Us”',
            '“I don’t know who he is, but he’s burned, and he wears a weird hat and a red and green sweater, really dirty. And he uses these knives, like giant fingernails.” — Nancy Thompson, “A Nightmare on Elm Street”',
            '“In this town, Michael Myers is a myth. He’s the Boogeyman. A ghost story to scare kids. But this Boogeyman is real. An evil like his never stops, it just grows older. Darker.” — Laurie Strode, “Halloween (2018)”',
            '“Out for a little walk … in the moonlight, are we?” — Severus Snape, “Harry Potter and the Prisoner of Azkaban”',
            '“People who cease to believe in God or goodness altogether still believe in the devil. I don’t know why. No, I do indeed know why. Evil is always possible.” — Anne Rice, “Interview with the Vampire”',
            '“They look exactly like us. They think like us. They know where we are. We need to move and keep moving. They won’t stop until they kill us ... or we kill them.” — Adelaide Wilson, “Us”',
            '“A deep sleep fell upon me — a sleep like that of death.” — Edgar Allan Poe, “The Pit and the Pendulum”',
            '“Every fairytale had a bloody lining. Every one had teeth and claws.” — Alice Hoffman, “The Ice Queen”',
            '“There’s a monster outside my room, can I have a glass of water?” — Bo Hess, “Signs”',
            '“Someone once told her that the stars were merely sewing pins, holding the black sky up so that it did not come down on the world and suffocate it.” — Alma Katsu, “The Deep”',
            '“ He’s not like us. He smiles a lot. But I think there might be worms inside him, making him smile.” — Stephen King, “The Stand”',
            '“I would die for her. I would kill for her. Either way, what bliss.” — Gomez, “The Addams Family”',
            '“It is only when a man feels himself face to face with such horrors that he can understand their true import.” — Bram Stoker, “Dracula”',
            '“One, two, Freddy’s coming for you. Three, four, better lock your door.” — Children, “A Nightmare on Elm Street”',
            '“A census taker once tried to test me. I ate his liver with some fava beans and a nice Chianti.” — Hannibal Lecter, “The Silence of the Lambs”',
            '“But the most frightening thing of all was the wind howling among the trees. Ichabod was sure that it was the sound of the Headless Horseman out looking for his head.” — Washington Irving, “The Legend of Sleepy Hollow',
            '“Its probably wrong to believe there can be any limit to the horror which the human mind can experience ...and the most terrifying question of all may be just how much horror the human mind can stand and still maintain a wakeful, staring, unrelenting sanity.” — Stephen King, “Pet Sematary”',
            '“Now, sink into the floor.” — Missy Armitage, “Get Out”',
            '“I am the writing on the walls. I am the sweet smell of blood on the street. The buzz that echoes in the alleyways.” — Anthony McCoy, “Candyman (2021)”',
            '“When the music stops, you’ll see him in the mirror standing behind you.” — April, “The Conjuring”',
            '“It was a death cry, rising until it seemed it could go no higher, then dwindling into a mournful, hopeless, ghastly farewell.” — Louise Morgan, “A Secret History of Witches”',
            '“A witch never gets caught. Don’t forget that she has magic in her fingers and devilry dancing in her blood.” — Roald Dahl, “The Witches”',
            '“Hate the smell of dampness, don’t you? It’s such a, I don’t know, creepy smell.” — Norman Bates, “Psycho”',
            '“I see dead people.” — Cole Sear, “The Sixth Sense”',
            '“I looked upon the sea; it was to be my grave.” — Mary Shelley, “Frankenstein”',
            '“Where are you, beautiful? Come out, come out, wherever you are!” — Frank, “Hellraiser”',
            '“Be warned: I sleep as the earth sleeps beneath the night sky or the winter’s snow; and once awakened, I am servant to no man.” — Anne Rice, “The Mummy”',
            '“You ever feel prickly things on the back of your neck?”— Cole Sear, “The Sixth Sense”',
            '“Something bumped into me — something soft and plump. It must have been the rats; the vicious, gelatinous, ravenous army that feast on the dead and the living.” — H.P. Lovecraft, “The Rats in the Walls”',
            '“Hell is empty and all the devils are here.” — William Shakespeare, “The Tempest”',
            '“Souls and memories can do strange things during trance.” — Bram Stoker, “Dracula”',
            '“The Further is a world far beyond our own, yet it’s all around us. A place without time as we know it. It’s a dark realm filled with the tortured souls of the dead. A place not meant for the living.” — Elise Reiner, “Insidious”',
            '“He knew what the wind was doing to them, where it was taking them, to all the secret places that were never so secret again in life.” — Ray Bradbury, “Something Wicked This Way Comes”',
            '“A black cat crossed my path, and I stopped to dance around it widdershins and to sing the rhyme, Ou va-ti mistigri? Passe sans faire de mai ici.” — Joanne Harris, “Chocolat”',
            'Embrace the chaos within...',
            'Seek truth in the depths of darkness...',
            'Transcend reality and enter the void...'
        ];

        // Create a message element
        const messageElement = document.createElement('div');
        messageElement.style.color = '#ffffff'; // Set font color to white
        messageElement.style.fontSize = '44px'; // Set font size as needed
        messageElement.style.textAlign = 'center'; // Center-align the message
        messageElement.style.marginTop = '20%'; // Adjust margin top to center vertically

        // Append the message to the overlay container
        overlayContainer.appendChild(messageElement);

        // Function to update the message content
        function updateMessage() {
            const randomIndex = Math.floor(Math.random() * messages.length);
            const message = messages[randomIndex];
            messageElement.textContent = message;
        }

        // Call the function to update the message content initially
        updateMessage();

        // Set interval to update message content periodically
        const intervalId = setInterval(updateMessage, 10000); // Update every 5 seconds

        // Append the overlay container to the document body
        document.body.appendChild(overlayContainer);

        // Function to clear the interval when the overlay is closed
        overlayContainer.addEventListener('transitionend', function(event) {
            if (event.propertyName === 'display' && overlayContainer.style.display === 'none') {
                clearInterval(intervalId); // Stop updating messages when overlay is closed
            }
        });
    }

    // Function to toggle both overlays on or off
    function toggleOverlays() {
        const visualsOverlay = document.getElementById('surreal-visuals-overlay');
        const messagesOverlay = document.getElementById('cryptic-messages-overlay');

        if (visualsOverlay.style.display === 'none') {
            visualsOverlay.style.display = 'block';
            messagesOverlay.style.display = 'block';
        } else {
            visualsOverlay.style.display = 'none';
            messagesOverlay.style.display = 'none';
        }
    }

        // Call functions to create surreal visuals and display cryptic messages
        createSurrealVisuals();
        displayCrypticMessages();

    // Create a button to toggle both overlays on or off
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'O';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '20px';
    toggleButton.style.zIndex = '1001';

    // Add event listener to toggle the overlays visibility
    toggleButton.addEventListener('click', toggleOverlays);

    // Append the toggle button to the document body
    document.body.appendChild(toggleButton);


































})();
