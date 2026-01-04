// ==UserScript==
// @name         Stumblechat Stalker
// @namespace    http://tampermonkey.net/
// @version      1.072
// @description  Intercept WebSocket messages on StumbleChat and display them in tabs, sorted by sender's handle, with minimize and resize functionality
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516691/Stumblechat%20Stalker.user.js
// @updateURL https://update.greasyfork.org/scripts/516691/Stumblechat%20Stalker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let overlayVisible = true; // Flag to track overlay visibility
    let userMap = {}; // Maps handles to user info (username, nick)
    let selfHandle = null; // Store the handle of the current user

    // Function to update userMap based on "joined", "join", or "quit" events
    function updateUserMap(message) {
        if (message.stumble === "join" || message.stumble === "joined") {
            const { handle, username, nick, userlist } = message;

            if (userlist) {
                userlist.forEach(user => {
                    if (user.handle && user.username) {
                        userMap[user.handle] = { username: user.username, nick: user.nick };
                    }
                });
            }

            if (handle && username) {
                userMap[handle] = { username, nick };
            }

            if (handle && !selfHandle) {
                selfHandle = handle; // Store the user's handle if it's the first "joined"
            }
        } else if (message.stumble === "quit") {
            const { handle } = message;
            if (handle) {
                delete userMap[handle];
            }
        }
    }

    // Function to display the user list in the joinTab
    function displayUserList() {
        const joinTab = document.getElementById('joinTab');
        joinTab.innerHTML = ''; // Clear previous content

        Object.keys(userMap).forEach(handle => {
            const user = userMap[handle];
            const userButton = document.createElement('button');
            userButton.innerText = `${user.username} (${handle} / ${user.nick})`;
            joinTab.appendChild(userButton);
        });
    }

    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new originalWebSocket(url, protocols);
        ws.addEventListener('message', event => {
            try {
                const message = JSON.parse(event.data);

                if (["join", "joined", "quit"].includes(message.stumble)) {
                    updateUserMap(message);
                    displayUserList();
                } else if (message.stumble === "msg") {
                    displayWebSocketMessage(message); // Handle message event
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        });
        return ws;
    };

    // Create the overlay container
    const overlayDiv = document.createElement("div");
    overlayDiv.id = "overlayContainer";
    Object.assign(overlayDiv.style, {
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "9999",
        backgroundColor: "#222",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        maxWidth: "400px",
        maxHeight: "80vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        resize: "both",
        visibility: "visible"
    });

    // Create the toggle button (separate from the overlay)
    const toggleButton = document.createElement("button");
    toggleButton.innerHTML = "+";
    Object.assign(toggleButton.style, {
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: "10001", // Ensure it's on top of everything
        marginBottom: "10px",
        padding: "8px",
        cursor: "pointer",
    });
    toggleButton.onclick = () => {
        overlayDiv.style.display = overlayVisible ? "none" : "flex";
        overlayVisible = !overlayVisible;
        toggleButton.innerHTML = overlayVisible ? "-" : "+";
    };
    document.body.appendChild(toggleButton); // Add button to the body

    // Add the overlay content (tabs)
    const tabNames = ["msg", "join"];  // Reordered 'msg' to be first
    tabNames.forEach(tab => {
        const tabButton = document.createElement("button");
        tabButton.innerHTML = tab.charAt(0).toUpperCase() + tab.slice(1);
        Object.assign(tabButton.style, { backgroundColor: "#444", border: "none", padding: "10px", margin: "2px", cursor: "pointer" });
        tabButton.onclick = () => showTab(tab);
        overlayDiv.appendChild(tabButton);
    });

    // Add the tab content
    const tabContentDivs = ["msg", "join"];  // Reordered 'msg' to be first
    tabContentDivs.forEach(tab => {
        const tabDiv = document.createElement("div");
        tabDiv.id = `${tab}Tab`;
        Object.assign(tabDiv.style, { display: "none", padding: "10px", border: "1px solid #555", borderRadius: "5px", marginTop: "5px", maxHeight: "60vh", overflowY: "auto" });
        overlayDiv.appendChild(tabDiv);
    });

    document.body.appendChild(overlayDiv);

    // Function to display WebSocket messages in the "msg" tab
    function displayWebSocketMessage(message) {
        const { handle, text } = message;
        const username = userMap[handle] ? userMap[handle].username : handle;  // Use handle if user not in map

        // Display the message in the "msg" tab
        const msgTab = document.getElementById("msgTab");
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `${username}: ${text}`;
        msgTab.appendChild(messageDiv);

        // Scroll to the bottom of the messages div
        msgTab.scrollTop = msgTab.scrollHeight;
    }

    // Function to show the selected tab (join or msg)
    function showTab(tab) {
        tabContentDivs.forEach(tabName => {
            document.getElementById(`${tabName}Tab`).style.display = tabName === tab ? "block" : "none";
        });
    }

    showTab("join");  // Initially show the "join" tab
})();