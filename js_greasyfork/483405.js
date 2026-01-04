// ==UserScript==
// @name         Meklin Shutdownchat Script
// @version      1.9
// @description  Modified Shutdownchat, unmatched scripts, brace to be thunderstruck
// @author       MeKLiN
// @namespace    https://greasyfork.org/en/scripts/483405-meklin-shutdownchat-script
// @match        https://www.shutdown.chat/rooms*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shutdown.chat
// @license      MIT
// @grant        none
// @exclude      https://www.shutdown.chat/profiles*
// @exclude      https://www.shutdown.chat/manage*
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/jshint/2.9.7/jshint.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.5/es6-shim.min.js
// @downloadURL https://update.greasyfork.org/scripts/483405/Meklin%20Shutdownchat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/483405/Meklin%20Shutdownchat%20Script.meta.js
// ==/UserScript==
// Declare global variables
var blocked_uuids = JSON.parse(localStorage.getItem('blocked_uuids')) || [];
var observer;
var chatbox = document.querySelector('.chatbox');
var customChatmsg;
var customInputWindow;
var customInputWindow2;
var customInputWindow3;
var customInputWindow4; // Declare only once
var clonedGridboxTools;
//dontusethis var ignoreListDiv = document.createElement("div");
// Call the function to observe the chatbox
observeChatbox();
// Function to initialize the script
function initializeScript() {
    console.log("MSS 1.1 STARTED");
    debugger;
    // Call the function to create the toggle button
    createToggleButton();
    // Call the initial function to start handling new chat messages
    handleNewChatMessages();
    // Call the function to observe mutations in the chatbox
    observeChatboxMutations();
    // Call the function to create the ignore list button
    createButtons();
    // Call the function to create the save and load buttons
    createSaveLoadButtons();
    // Call the function to create the ignore button in the user menu
    createIgnoreButton();
    // Call the function to create the clear cache button
    createClearCacheButton();
    // Call the function to create the collapse button
    createCollapseButton();
    // Clone gridbox
    cloneGridbox();
    // Create the custom input window
    createCustomInputWindow();
    // Create additional custom input window
    createAdditionalCustomInputWindow();
    // Now, you should be able to access customInputWindow
    console.log(customInputWindow);
    // Call the function to ignore a user
    ignoreUser('example_uuid');
    // Call the cloneGridbox function when needed
    cloneGridbox();
    // Call the function to create Ignore List Button
    createIgnoreListButton();
    // Call the function to initialize the observer
    initializeObserver();
    // Create customInputWindow4
    customInputWindow4 = document.createElement("div");
    customInputWindow4.className = "your-custom-class";
    // Clone gridbox
    function cloneGridbox() {
        var gridboxTools = document.querySelector('.gridbox_tools');
        var clonedGridboxTools = gridboxTools.cloneNode(true);
        // Append the new button to the custom input window
        customInputWindow4.appendChild(clonedGridboxTools);

        // ... other logic related to cloneGridbox ...

        // Append the custom input window to the body
        document.body.appendChild(customInputWindow4);
    }
}
// Function to initialize the observer
function initializeObserver() {
    // Check if the .chatbox element is found
    if (chatbox) {
        // Initialize the observer if not already initialized
        if (!observer) {
            observer = new MutationObserver(function (mutations) {
                // Handle mutations
                console.log("Mutations:", mutations);
                // You can add your logic to handle mutations here
            });
            // Start observing the .chatbox element
            observer.observe(chatbox, { childList: true });
        }
    }
}
// Call the function to initialize the observer
initializeObserver();
console.log("MAIN OBSERVER INITIALIZED")
function createToggleButton() {
    // Add a button to the body
    var toggleBackgroundButton = document.createElement("button");
    toggleBackgroundButton.textContent = "Toggle Background";
    document.body.appendChild(toggleBackgroundButton);

    // Add an event listener to the button
    toggleBackgroundButton.addEventListener("click", function() {
        // Get the container element
        var container = document.querySelector("#container");

        // Toggle the background style
        if (container.style.background === "") {
            // Set the background color when it's not set
            container.style.background = "#e0e0e0";
        } else {
            // Remove the background color when it's set
            container.style.background = "";
        }
    });
}
// Function to observe mutations in the chatbox
function observeChatboxMutations() {
    var chatbox = document.querySelector('.chatbox')
    if (chatbox instanceof Node && !observer) {
        // Create a mutation observer to monitor changes in the chatbox
        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeName === "P" && node.dataset.t === "c") {
                        // Your logic for handling new chat messages goes here
                        console.log("Processing Chatbox Now");
                    }
                });
            });
        });
        // Start observing the chatbox
        observer.observe(chatbox, { childList: true });
    } else {
        console.error("Chatbox element not found or is not a valid Node. Cannot add event listener.");
    }
}
// Now you can call observeChatbox() from any other function that needs to observe the chatbox
// Function to create a MutationObserver for the chatbox
function observeChatbox() {
    // Get the chatbox element
    var chatbox = document.querySelector('.chatbox');
    // Check if the chatbox element is found
    if (chatbox) {
        // Initialize the observer if not already initialized
        if (!observer) {
            observer = new MutationObserver(function (mutations) {
                // Handle mutations
                console.log("Mutations:", mutations);
                // You can add your logic to handle mutations here
            });
            // Start observing the chatbox
            observer.observe(chatbox, { childList: true });
        }
    } else {
        console.error("Chatbox element not found. Cannot add event listener.");
    }
}
// Function to handle system messages
function handleSystemMessage(systemNode) {
    // Move system messages to the bottom right in their own DIV
    var systemDiv = document.createElement("div");
    systemDiv.className = "system-message";
    systemDiv.style.position = "fixed";
    systemDiv.style.bottom = "10px";
    systemDiv.style.right = "10px";
    systemDiv.style.backgroundColor = "#f0f0f0";
    systemDiv.style.padding = "10px";
    systemDiv.appendChild(systemNode.cloneNode(true));
    document.body.appendChild(systemDiv);
}
function createCollapseButton() {
    console.log("createCollapseButton function is called");
    var collapseButton = document.createElement("button");
    // Set the inner HTML with an SVG and additional text
    collapseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M8 4v5l-2.5-1.5L3 9V4l5-2zm8 0l5 2v5l-2.5-1.5L16 9V4zM3 11l3.5-1.5L8 11V9L3 7zm13 0l3.5-1.5L21 11V9l-5-2z"/>
    </svg>min`;
    // Adjust the font size of the text
    collapseButton.style.fontSize = "12px"; // Adjust the font size as needed
    collapseButton.style.position = "fixed";
    collapseButton.style.top = "90px";
    collapseButton.style.left = "10px";
    // Function to append the button to the body
    function appendButtonToBody() {
        document.body.appendChild(collapseButton);
    }
    // Check if the body is available
    if (document.body) {
        // Append the collapseButton to the body
        appendButtonToBody();
    } else {
        // If the body is not available, wait for DOMContentLoaded event
        document.addEventListener("DOMContentLoaded", appendButtonToBody);
    }
    collapseButton.addEventListener("click", function () {
        // Toggle visibility of the chatbox
        var chatbox = document.querySelector('.chatbox');
        chatbox.style.display = (chatbox.style.display === 'none' || chatbox.style.display === '') ? 'block' : 'none';
    });
    // Get the chatbox element after creating the button
    var chatbox = document.querySelector('.chatbox');
    // Check if the chatbox element is found
    if (chatbox) {
        // Initialize the observer if not already initialized
        if (!observer) {
            observer = new MutationObserver(function (mutations) {
                // Handle mutations
                console.log("Mutations:", mutations);
                // You can add your logic to handle mutations here
            });
            // Start observing the chatbox
            observer.observe(chatbox, { childList: true });
        }
        // Log the chatbox element to the console
        console.log("Chatbox element:", chatbox);
    }
}
function handleNewChatMessages() {
    // Get the chatbox element
    console.log("Attempting to get chatbox element");
    var chatbox = document.querySelector('.chatbox');
    // Check if the chatbox element is found
    if (!chatbox) {
        console.error("Chatbox element not found. Cannot add event listener.");
        return;
    }
    console.log("Chatbox element found. Proceeding with event listener setup.");
    // Use the existing observer if not already initialized
    if (!observer) {
        observer = new MutationObserver(function (mutations) {
            // Handle mutations
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    handleChatMessage(node);
                    console.log("Mutations:", mutations);
                    // You can add your logic to handle mutations here
                });
            });
        });
        // Start observing the chatbox if observer is defined
        if (typeof observer !== 'undefined' && observer !== null) {
            observer.observe(chatbox, { childList: true });
        } else {
            console.error("Observer not defined. Cannot add event listener.");
        }
    }
    // Continue with handling new chat messages
    var chatboxElems = chatbox.getElementsByTagName('p');
    for (var i = 0; i < chatboxElems.length; i++) {
        var chatElem = chatboxElems[i];
        if (!chatElem.handled) {
            chatElem.handled = true;
            // Additional logic for handling specific types of messages
            // Remove text containing 'roll'
            if (chatElem.textContent.toLowerCase().includes('roll')) {
                chatElem.style.display = 'none'; // hide the message
            }
            // Alter messages of the type .fs_3
            if (chatElem.classList.contains('fs_3')) {
                chatElem.style.fontSize = '12px';
                chatElem.style.color = 'white';
            }
            // Check if the message is a system message
            var systemMessage = chatElem.classList.contains('system');
            if (systemMessage) {
                // Add a button to hide the system message
                addHideButtonToSystemMessage(chatElem);
            } else {
                // Check if the user is ignored
                var fcuserSpan = chatElem.querySelector('.nm.fcuser, .nm.fcmod, .user');
                var uuid = fcuserSpan ? fcuserSpan.dataset.uuid : null;
                console.log("fcuserSpan:", fcuserSpan); // Add this line to log fcuserSpan
                console.log("uuid:", uuid); // Add this line to log uuid
                if (uuid) {
                    // Check if the user is ignored
                    var isIgnored = blocked_uuids.includes(uuid);
                    // Modify the appearance based on whether the user is ignored or not
                    if (isIgnored) {
                        chatElem.style.display = 'none'; // hide the message
                    } else {
                        // Add an "ignore" button to the user menu
                        addIgnoreButtonToUserMenu(uuid);
                    }
                }
            }
        }
    }
}
// Function to get the user UUID from the user list within FreeChat context
function getUserUUIDFromUserList() {
    var userContainer = document.querySelector("#chat > div.fc > div.gridbox_list > div.userlist p.user.fcuser[data-uuid]");
    if (userContainer) {
        return userContainer.dataset.uuid;
    } else {
        // If user container is not found, set up a MutationObserver to wait for changes
        var observer = new MutationObserver(function (mutations) {
            userContainer = document.querySelector("#chat > div.fc > div.gridbox_list > div.userlist p.user.fcuser[data-uuid]");
            if (userContainer) {
                console.log("User container found after mutation.");
                console.log("User UUID: ", userContainer.dataset.uuid);
                // Stop observing once the user container is found
                observer.disconnect();
            }
        });
        // Start observing changes in the user list
        observer.observe(document.querySelector("#chat > div.fc > div.gridbox_list > div.userlist"), { childList: true, subtree: true });
        console.error("User container not found in the user list within FreeChat context. Waiting for mutations...");
        return null;
    }
}
// Define createIgnoreListButton globally
function createIgnoreListButton() {
    console.log("createIgnoreListButton function is called");
    var ignoreListButton = document.createElement("button");
    ignoreListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 18V8a6 6 0 0 0-12 0v10h12zM12 2C6.48 2 2 6.48 2 12v10h2V12a5.978 5.978 0 0 1 5.985-6H12V2zm8.293 2.293a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1 0 1.414L19.414 10l3.707 3.707a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414 0L18 13.414l-3.707 3.707a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 0 1 0-1.414L14.586 12 10.88 8.293a1 1 0 0 1 0-1.414L12.294 5.465a1 1 0 0 1 1.414 0z"/></svg>lst`;
    ignoreListButton.style.position = "fixed";
    ignoreListButton.style.top = "100px";
    ignoreListButton.style.left = "10px";
    ignoreListButton.addEventListener("click", function () {
        // Display the ignore list (you can customize this part)
        alert("Ignore List:\n" + blocked_uuids.join(", "));
    });
    document.body.appendChild(ignoreListButton);
}

// Wrap function calls inside DomContentLoaded event listener ensuring page load
document.addEventListener('DOMContentLoaded', function () {
    // Function to be called after DOMContentLoaded
    function afterDOMContentLoaded() {
        console.log("dom loaded!")
    }

    // Use MutationObserver to detect when userlist and chatbox are added to the DOM
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.classList && (node.classList.contains('userlist') || node.classList.contains('chatbox'))) {
                    // Userlist or chatbox added to the DOM, stop observing and call functions
                    observer.disconnect();
                    afterDOMContentLoaded();
                }
            });
        });
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Check if userlist and chatbox are already present
    var userlist = document.querySelector('.userlist');
    var chatbox = document.querySelector('.chatbox');

    if (userlist && chatbox) {
        // Call the function to create the button
        createIgnoreListButton();
        // ... rest of your code ...
    } else {
        console.error("The userlist element is not found.");
    }
});
// Function to remove chat log entries
function removeChatEntries() {
  // Get all chat log entries
  var chatEntries = document.querySelectorAll('.chat-entry');

  // Remove each chat log entry
  chatEntries.forEach(function (entry) {
    entry.remove();
  });
}
// Example usage
removeChatEntries();
// Function to show a notification
function showNotification(message) {
    var notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.top = "10px";
    notification.style.left = "10px";
    notification.style.backgroundColor = "#000000";
    notification.style.padding = "10px";
    notification.style.border = "1px solid #ccc";
    notification.style.borderRadius = "5px";
    notification.style.fontSize = "12px";
    notification.style.color = "#C0FF00";
    notification.style.opacity = 1;
    notification.style.transition = "opacity 2s ease-in-out";
    notification.innerHTML = message;
    document.body.appendChild(notification);
    // Set a timeout to fade out the notification
    setTimeout(function () {
        notification.style.opacity = 0;
    }, 5000); // Adjust the timeout value as needed
    // Remove the notification from the DOM after fading out
    setTimeout(function () {
        document.body.removeChild(notification);
    }, 6000); // Adjust the timeout value to match the fade-out duration
}
// Function to create a button to clear the JSON local saved cache
function createClearCacheButton() {
    console.log("createClearCacheButton function is called");
    var clearCacheButton = document.createElement("button");
    clearCacheButton.innerText = "clr";
    clearCacheButton.style.position = "fixed";
    clearCacheButton.style.top = "50px";
    clearCacheButton.style.left = "10px";
    clearCacheButton.addEventListener("click", function () {
        // Clear the JSON local saved cache
        localStorage.removeItem('blocked_uuids');
        showNotification("Cache cleared. Please refresh the page.");
    });
    // Check if the body is available
    if (document.body) {
        // Append the clearCacheButton to the body
        document.body.appendChild(clearCacheButton);
    } else {
        // If the body is not available, wait for DOMContentLoaded event
        document.addEventListener("DOMContentLoaded", function () {
            // Append the clearCacheButton to the body
            document.body.appendChild(clearCacheButton);
        });
    }
}
// Function to create a button to collapse the view
function getNickname(fcuserSpan) {
    if (!fcuserSpan) return;
    // Check if fcuserSpan is a direct child of p
    var isDirectChild = fcuserSpan.parentNode.nodeName === "P";
    var nickname;
    if (isDirectChild) {
        nickname = fcuserSpan.innerText.replace(/[:\-]/g, '').trim();
    } else {
        // If not a direct child, assume it's under an anchor tag (a) in the user list
        nickname = fcuserSpan.parentNode.querySelector('.fcuser').innerText.replace(/[:\-]/g, '').trim();
    }
    return nickname;
}
// Function to handle the new chat messages

// Function to add a button to hide system messages
function addHideButtonToSystemMessage(chatElem) {
    var hideButton = document.createElement('button');
    hideButton.textContent = 'Hide';
    hideButton.style.marginLeft = '5px';
    hideButton.addEventListener('click', function () {
        chatElem.style.display = 'none'; // hide the system message
    });
    // Append the button to the system message
    chatElem.appendChild(hideButton);
}
// Function to add an "ignore" button to the user menu
function addIgnoreButtonToUserMenu(chatElem) {
    // Check if the user menu exists
    var userMenu = document.querySelector('.usermenu');
    if (userMenu && chatElem && chatElem.querySelector) {
        // Check if the user is already ignored
        var uuid = chatElem.querySelector('.nm.fcuser, .nm.fcmod')?.dataset.uuid;
        var isIgnored = blocked_uuids.includes(uuid);
        // Create a button for either ignoring or unignoring the user
        var ignoreButton = document.createElement('button');
        ignoreButton.textContent = isIgnored ? 'Unignore' : 'Ignore';
        // Add an event listener to handle ignoring/unignoring the user
        ignoreButton.addEventListener('click', function () {
            if (isIgnored) {
                // Unignore the user
                unignoreUser(uuid);
            } else {
                // Ignore the user
                ignoreUser(uuid);
            }
        });
        // Append the button to the user menu
        userMenu.appendChild(ignoreButton);
    } else {
        console.error("Invalid userMenu, chatElem, or querySelector is not supported. Conditions: userMenu=" + userMenu + ", chatElem=" + chatElem + ", chatElem.querySelector=" + (chatElem ? chatElem.querySelector : null));
    }
}
// Function to ignore a user
function ignoreUser(uuid) {
    // Add your logic here to handle ignoring a user
    // For example, you can add the user's UUID to the blocked_uuids array
    blocked_uuids.push(uuid);
    // Save the updated blocked_uuids to localStorage
    localStorage.setItem('blocked_uuids', JSON.stringify(blocked_uuids));
    // You can also add additional logic as needed
    console.log("Ignoring user with UUID:", uuid);
}
// Function to unignore a user
function unignoreUser(uuid) {
    blocked_uuids = blocked_uuids.filter(function (blockedUuid) {
        return blockedUuid !== uuid;
    });
    // Add additional logic as needed
    console.log("Unignoring user with UUID:", uuid);
}
// Function to get the user UUID from a chat message
function getUserUUIDFromChatMessage(messageNode) {
    var uuidElement = messageNode.querySelector('.nm.fcuser, .nm.fcmod');
    if (uuidElement) {
        return uuidElement.dataset.uuid;
    } else {
        console.error("UUID element not found in the chat message:", messageNode);
        return null;
    }
}
// Function to handle different types of chat messages
function handleChatMessage(node) {
    // Check if the node is a chat message
    if (node.nodeName === "P" && node.dataset.t === "c") {
        // Get the uuid of the user who sent the message
        var uuid = getUserUUIDFromChatMessage(node);
        if (uuid) {
            console.log("Found message with UUID:", uuid);
            // Check if the uuid is in the blocked list
            if (blocked_uuids.includes(uuid)) {
                console.log("Blocking message with UUID:", uuid);
                // Hide the message
                node.style.display = "none";
            } else {
                // Alter messages of the type .fs_3
                if (node.classList.contains('fs_3')) {
                    node.style.fontSize = '12px';
                    node.style.color = 'white';
                }
                // Add an "ignore" button to the user menu
                addIgnoreButtonToUserMenu(node);
            }
        }
    } else if (node.nodeName === "P" && node.querySelector(".sysmsg.fcsys")) {
        // Handle system messages
        handleSystemMessage(node);
    }
}
// Function to block/unblock a user
function blockUser(uuid) {
    console.log("blockUser function is called");
    var index = blocked_uuids.indexOf(uuid);
    if (index !== -1) {
        // User is already blocked, so unblock
        blocked_uuids.splice(index, 1);
        showNotification("User unblocked!");
    } else {
        // User is not blocked, so block
        blocked_uuids.push(uuid);
        showNotification("User blocked!");
    }
    // Save the updated blocked_uuids to localStorage
    localStorage.setItem('blocked_uuids', JSON.stringify(blocked_uuids));
}
// usermenu block button event listener:
document.querySelector('.usermenu button[data-btntype="block"]').addEventListener('click', function() {
    console.log("User menu block button clicked");
    // Get the parent element of the button, assuming it contains user-related data
    var userContainer = this.closest('.user-container');
    // Assuming the user UUID is stored in a data attribute called data-uuid
    var userUUID = userContainer ? userContainer.dataset.uuid : null;
    // Check if userUUID is not null before blocking
    if (userUUID) {
        // Now you have the user UUID, and you can proceed to block the user
        blockUser(userUUID);
    } else {
        console.error("User UUID not found. Unable to block user.");
    }
});
// Function to create an ignore button in the user menu
function createIgnoreButton() {
    console.log("createIgnoreButton function is called");
    // Check if the ignore button is already created
    var ignoreButton = document.querySelector('.usermenu button[data-btntype="ignore"]');
    if (!ignoreButton) {
        ignoreButton = document.createElement("button");
        ignoreButton.innerText = "Ignore";
        ignoreButton.setAttribute("data-btntype", "ignore"); // Set a new attribute for identification
        ignoreButton.style.display = "block";
        ignoreButton.style.marginTop = "5px"; // Adjust the styling as needed
        // Insert the ignore button into the user menu
        var userMenu = document.querySelector('.usermenu');
        if (userMenu) {
            userMenu.insertBefore(ignoreButton, userMenu.firstChild);
            // Add click event directly to the button
            ignoreButton.addEventListener("click", function () {
                // Log to console to check if the button click is being registered
                console.log("Ignore button clicked");
                // Invoke the function to get the user UUID from the user list
                var userUUID = getUserUUIDFromUserList();
                // Check if the user UUID is found
                if (userUUID) {
                    blockUser(userUUID);
                } else {
                    console.error("User UUID not found. Ignoring user without blocking.");
                }
            });
        } else {
            console.error("User menu not found.");
        }
    }
}
// Function to get the user UUID from the chat log
function getUserUUIDFromChatLog() {
    var chatLog = document.querySelector('.chatbox');
    if (chatLog) {
        // Find the first chat message in the log
        var firstChatMessage = chatLog.querySelector('p[data-t="c"]');
        if (firstChatMessage) {
            // Get the UUID from the first chat message
            var uuidElement = firstChatMessage.querySelector('.nm.fcuser, .nm.fcmod');
            if (uuidElement) {
                return uuidElement.dataset.uuid;
            } else {
                // Handle the case where UUID element is not found
                console.error("UUID element not found in the first chat message:", firstChatMessage);
                return null;
            }
        } else {
            // Handle the case where no chat messages are found
            console.error("No chat messages found in the chat log.");
            return null;
        }
    } else {
        // Handle the case where the chatbox element is not found
        console.error("Chatbox element not found.");
        return null;
    }
}
// Create the ignore list div once and append the content dynamically
var ignoreListDiv = document.createElement("div");
ignoreListDiv.style.position = "fixed";
ignoreListDiv.style.top = "135px"; // Move to the top
ignoreListDiv.style.left = "10px";
ignoreListDiv.style.backgroundColor = "white"; // Adjust styling as needed
ignoreListDiv.style.padding = "10px";
ignoreListDiv.style.border = "1px solid black"; // Add border for visibility
ignoreListDiv.style.fontSize = "12px"; // Set font size to 12px
// Create a heading for the ignore list
var ignoreListHeading = document.createElement("h3");
ignoreListHeading.innerText = "Ignore List";
ignoreListDiv.appendChild(ignoreListHeading);
// Create a list to display ignored users
var ignoreList = document.createElement("ul");
ignoreList.style.listStyleType = "none"; // Remove default list styling
ignoreListDiv.appendChild(ignoreList);
// Append the ignore list div to the body
document.body.appendChild(ignoreListDiv);
// Function to create a list item with the ignore list entry and remove button
function createIgnoreListItem(uuid, username) {
    var listItem = document.createElement("li");
    listItem.innerText = `${username} (${uuid})`;
    // Create a remove button for each entry
    var removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.addEventListener("click", function () {
        // Remove the entry when the button is clicked
        removeIgnoreEntry(uuid);
    });
    // Append the remove button to the list item
    listItem.appendChild(removeButton);
    // Append the list item to the ignore list
    ignoreList.appendChild(listItem);
}
// Function to refresh the ignore list display
function refreshIgnoreList() {
    // Clear the existing content
    ignoreList.innerHTML = "";

    // Populate the ignore list with entries and remove buttons
    blocked_uuids.forEach(function (uuid) {
        createIgnoreListItem(uuid);
    });
}
// Populate the ignore list with entries and remove buttons
blocked_uuids.forEach(function (uuid) {
    createIgnoreListItem(uuid);
});
// Function to handle removing an entry from the ignore list
function removeIgnoreEntry(uuid) {
    var index = blocked_uuids.indexOf(uuid);
    if (index !== -1) {
        // Remove the entry from the ignore list
        blocked_uuids.splice(index, 1);
        // Refresh the ignore list display after removal
        refreshIgnoreList();
    }
}
// Function to save blocked_uuids to a text file
function saveToTextFile() {
    var textToSave = blocked_uuids.join('\n');
    var blob = new Blob([textToSave], { type: 'text/plain' });
    var link = document.createElement('a');
    link.download = 'ignore_list.txt';
    link.href = window.URL.createObjectURL(blob);
    link.onclick = function () {
        document.body.removeChild(link);
    };
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
}
// Function to load blocked_uuids from a text file
function loadFromTextFile() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // Parse the content of the file and update blocked_uuids
                blocked_uuids = e.target.result.split('\n').map(function (uuid) {
                    return uuid.trim();
                });
                // Update the ignore list display
                refreshIgnoreList();
            };
            reader.readAsText(file);
        }
    };
    input.click();
}
// Function to create a button to save and load ignore list
function createSaveLoadButtons() {
    var saveButton = document.createElement("button");
    saveButton.innerText = "Save to Text File";
    saveButton.addEventListener("click", function () {
        saveToTextFile();
    });
    var loadButton = document.createElement("button");
    loadButton.innerText = "Load from Text File";
    loadButton.addEventListener("click", function () {
        loadFromTextFile();
    });
    var buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "10px";
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(loadButton);

    // Append the button container to the ignore list div
    ignoreListDiv.appendChild(buttonContainer);
}
// Function to create buttons, including the collapse button
function createButtons() {
    // Create a container for the buttons
    var buttonContainer = document.createElement("div");
    buttonContainer.style.position = "fixed";
    buttonContainer.style.top = "10px";
    buttonContainer.style.left = "10px";
    document.body.appendChild(buttonContainer);
    // Function to create a button
    function createButton(text, clickHandler) {
        var button = document.createElement("button");
        button.innerText = text;
        button.addEventListener("click", clickHandler);
        buttonContainer.appendChild(button);
    }
    // Create the collapse button
    createButton("Collapse", function () {
        var chatbox = document.querySelector('.chatbox');
        chatbox.style.display = (chatbox.style.display === 'none' || chatbox.style.display === '') ? 'block' : 'none';
    });
    // Create the clear cache button
    createButton("Clear Cache", function () {
        localStorage.removeItem('blocked_uuids');
        showNotification("Cache cleared. Please refresh the page.");
    });
    // Create the button to hide system messages
    createButton("Hide System", function () {
        // Get all system messages
        var systemMessages = document.querySelectorAll('.chatbox .system');
        // Toggle visibility of system messages
        systemMessages.forEach(function (systemMessage) {
            systemMessage.style.display = (systemMessage.style.display === 'none' || systemMessage.style.display === '') ? 'block' : 'none';
        });
    });
}
// Function to create and style the gridbox_tools clone input window
function createCustomInputWindow() {
    // Create the custom input window
    var customInputWindow1 = document.createElement("div");
    customInputWindow.className = "gridbox_tools";
    customInputWindow.innerHTML = `
        <div class="tb">
            <!-- Add other elements here similar to the default menu -->
            <input type="text" autocomplete="off" class="chatmsg fs_1" style="color: rgb(221, 221, 221);" maxlength="500">
            <button class="sendbtn material-icons">Send</button>
        </div>
    `;
    // Append the custom input window to the body
    document.body.appendChild(customInputWindow);
    // Style the text input
    var customChatmsg = customInputWindow.querySelector(".chatmsg");
    customChatmsg.style.flex = "1";
    customChatmsg.style.padding = "5px";
    // Style the send button
    var customSendbtn = customInputWindow.querySelector(".sendbtn");
    customSendbtn.innerText = "msg"; // Customize the button text as needed
    // Add event listener for the send button
    customSendbtn.addEventListener("click", function () {
        handleCustomButtonClick(customChatmsg.value.trim());
    });
}
// Function to create and style additional custom input window
function createAdditionalCustomInputWindow() {
    // Create the custom input window
    var customInputWindow2 = document.createElement("div");
    customInputWindow2.className = "command-input-window";
    customInputWindow2.innerHTML = `
        <input type="text" autocomplete="off" class="custom-chatmsg" placeholder="Type your command...">
        <button class="custom-sendbtn material-icons">Send</button>
        <button class="custom-sendbtn2">Send 2</button>
    `;
    // Style the custom input window
    customInputWindow2.style.position = "fixed";
    customInputWindow2.style.bottom = "10px";
    customInputWindow2.style.left = "10px";
    customInputWindow2.style.display = "flex";
    customInputWindow2.style.alignItems = "center";
    // Append the custom input window to the body
    document.body.appendChild(customInputWindow2);
    // Style the text input
    var customChatmsg = customInputWindow2.querySelector(".custom-chatmsg");
    customChatmsg.style.flex = "1";
    customChatmsg.style.padding = "5px";
    // Style the send buttons
    var customSendbtn = customInputWindow2.querySelector(".custom-sendbtn");
    customSendbtn.innerText = "cmd"; // Customize the button text as needed
    var customSendbtn2 = customInputWindow2.querySelector(".custom-sendbtn2");
    customSendbtn2.innerText = "msg"; // Customize the button text as needed
    var sendButtons = [customSendbtn, customSendbtn2];
    // Create a third button for saying hello
    var customSendbtn3 = document.createElement("button");
    customSendbtn3.innerText = "hi"; // Customize the button text as needed
    // Append the button to the custom input window
    customInputWindow2.appendChild(customSendbtn3);
    // Add an event listener for the "Send" button
    customSendbtn.addEventListener("click", function () {
        handleCustomButtonClick(customChatmsg.value.trim());
    });
    // Add a click event listener to the "Hello" button
    customSendbtn3.addEventListener("click", function () {
        // Your logic for handling the "Hello" button goes here
        var command = customChatmsg.value.trim();
        // Clear the input field after processing the command
        customChatmsg.value = "";
        // Simulate a click on the button
        customSendbtn3.click();
    });
    // Create the button element
    var customSendBtn = document.createElement("button");
    customSendBtn.className = "sendbtn"; // Add the desired class name
    customSendBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"></path></svg>';
    // Replace the innerHTML with your SVG code or use an external SVG file
    // Append the button to the desired container (e.g., document.body)
    document.body.appendChild(customSendBtn);
    // Append the third button to the custom input window
    customInputWindow2.appendChild(customSendbtn3);
    // Style all send buttons
    sendButtons.forEach(function (btn) {
        btn.style.cursor = "pointer";
        btn.style.padding = "5px";
        // Add event listener for each button
        btn.addEventListener("click", function () {
            handleButtonClick(btn);
            console.log("handleButtonClick clicked!");
        });
    });
    // Append the new button to the custom input window
    customInputWindow2.appendChild(customSendbtn2);
    // Add an event listener for the new "Message" button
    customSendbtn2.addEventListener("click", function () {
        // Your logic for handling the command goes here
        var command = customChatmsg.value.trim();
        // Clear the input field after processing the command
        customChatmsg.value = "";
    });
    // Append the new button to the custom input window
    customInputWindow2.appendChild(customSendbtn2);
// Function to handle default "Send" button click
function handleDefaultSendButtonClick(btn, customChatmsg) {
    var command = customChatmsg.value.trim();
    // Your logic for handling the command with the default "Send" button goes here
    // Use btn to identify which button triggered the click event
    // Clear the input field after processing the command
    customChatmsg.value = "";
}
// Add an event listener for the original "Send" button
var defaultSendBtn = customInputWindow.querySelector(".sendbtn");
defaultSendBtn.addEventListener("click", function () {
    handleButtonClick(defaultSendBtn);
});
// Function to handle button clicks
function handleButtonClick(btn, customChatmsg) {
    var command = customChatmsg.value.trim();
    // Your logic for handling the command goes here
    // Use btn to identify which button triggered the click event
    // Clear the input field after processing the command
    customChatmsg.value = "";
}
function handleCustomButtonClick(command) {
    // Your logic for handling the command goes here
    // This might involve calling the necessary functions from furtherchat.js
    // Ensure the logic aligns with the existing chat system
    // Clear the input field after processing the command
    customChatmsg.value = "";
}
// Function to create and style the combined input window
function createCombinedInputWindow() {
    // Create the custom input window
    var customInputWindow3 = document.createElement("div");
    customInputWindow.className = "combined-input-window";
    // Append the custom input window to the body
    document.body.appendChild(customInputWindow);
    // <!-- Add other elements here similar to the default menu -->
    customInputWindow.innerHTML = `
        <div class="tb">
            <input type="text" autocomplete="off" class="chatmsg fs_1" style="color: rgb(221, 221, 221);" maxlength="500">
            <button class="sendbtn material-icons">Send</button>
            <button class="custom-sendbtn2">Send 2</button>
        </div>
    `;
    // Move the following code inside the createCombinedInputWindow function
    var additionalButtonsHTML = `
        <select class="sizesel">
            <option value="0">smaller</option>
            <option value="1">normal</option>
            <option value="2">bigger</option>
            <option value="3">more bigger</option>
        </select>
        <button style="display: inline-block;">YouTube Player</button>
        <div class="fccb">
            <input type="checkbox">
            <label><span class="material-icons"></span>Kageshi Mode</label>
        </div>
        <input type="text" autocomplete="off" class="chatmsg fs_1" maxlength="700" style="color: rgb(221, 221, 221);">
        <button class="sendbtn material-icons"></button>
    `;
    customInputWindow.querySelector('.tb').innerHTML += additionalButtonsHTML;
    // Event listener for your "Command" button
    var customSendbtn2 = customInputWindow.querySelector(".custom-sendbtn2");
    customSendbtn2.addEventListener("click", function () {
        // Call the backend function or method for "Send 2"
        // Adjust the logic as needed
        send2ButtonClick();
    });
    // Event listener for your additional buttons
    var additionalButtons = customInputWindow.querySelectorAll(".your-additional-buttons-class");
    additionalButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Call the backend function or method associated with the clicked button
            // Adjust the logic as needed
            yourAdditionalButtonClick(button);
        });
    });
    // Additional styling or event listeners for the combined input window if needed
}
// Create the combined input window
createCombinedInputWindow();
// Function to handle the "Send 2" button click
function send2ButtonClick() {
    // Your logic for handling "Send 2" goes here
    console.log("Send 2 button clicked!");
}
// Function to handle additional button clicks
function yourAdditionalButtonClick(button) {
    // Determine which button was clicked based on its properties or class, and call the corresponding backend method
    if (button.classList.contains("your-specific-button-class")) {
        // Call the backend method for the specific button
        console.log("Your specific button clicked!");
    } else {
        // Handle other buttons if needed
    }
}
    // Append the custom input window to the body
    document.body.appendChild(customInputWindow);
        // Style the text input
    var customChatmsg = customInputWindow.querySelector(".chatmsg");
    customChatmsg.style.flex = "1";
    customChatmsg.style.padding = "5px";
        // Style the send button
    var customSendbtn = customInputWindow.querySelector(".sendbtn");
    customSendbtn.innerText = "msg"; // Customize the button text as needed
        // Add event listener for the send button
    customSendbtn.addEventListener("click", function () {
        handleCustomButtonClick(customChatmsg.value.trim());
    });
        // Assuming you have a reference to your combined input window
    var combinedInputWindow = document.querySelector(".combined-input-window");
        // Event listener for your "Command" button
    var customSendbtn2 = combinedInputWindow.querySelector(".custom-sendbtn2");
    customSendbtn2.addEventListener("click", function () {
        // Call the backend function or method for "Send 2"
        // Adjust the logic as needed
        send2ButtonClick();
    });
        // Event listener for your additional buttons
    var additionalButtons = combinedInputWindow.querySelectorAll(".your-additional-buttons-class");
    additionalButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Call the backend function or method associated with the clicked button
            // Adjust the logic as needed
            yourAdditionalButtonClick(button);
        });
    });
}
// Declare customInputWindow4 at the beginning of your code
var customInputWindow4 = document.createElement("div");
customInputWindow4.className = "your-custom-class"; // Fix the typo here
// Clone gridbox
function cloneGridbox() {
    var gridboxTools = document.querySelector('.gridbox_tools');
    var clonedGridboxTools = gridboxTools.cloneNode(true);
    // Append the new button to the custom input window
    customInputWindow4.appendChild(clonedGridboxTools);
    // Append the new button to the custom input window
    var customSendbtn2 = customInputWindow4.querySelector(".custom-sendbtn2");
    customSendbtn2.addEventListener("click", function () {
        // Your logic for handling the "Send 2" command goes here
        var command = customChatmsg.value.trim();
        // Clear the input field after processing the command
        customChatmsg.value = "";
    });
    // Additional styling or event listeners for the combined input window if needed
    // Move this block inside the createCombinedInputWindow function
    // Add additional buttons and elements from your HTML code
    var additionalButtonsHTML = `
        <select class="sizesel">
            <option value="0">smaller</option>
            <option value="1">normal</option>
            <option value="2">bigger</option>
            <option value="3">more bigger</option>
        </select>
        <button style="display: inline-block;">YouTube Player</button>
        <div class="fccb">
            <input type="checkbox">
            <label><span class="material-icons"></span>Kageshi Mode</label>
        </div>
        <input type="text" autocomplete="off" class="chatmsg fs_1" maxlength="700" style="color: rgb(221, 221, 221);">
        <button class="sendbtn material-icons"></button>
    `;
    clonedGridboxTools.querySelector('.tb').innerHTML += additionalButtonsHTML;
    // Append the custom input window to the body
    document.body.appendChild(customInputWindow4);
}
//fc_cam.prototype.setkmode = function(t) {
//    this.kageshi_mode = t,
//    null === this.video || null === this.user || this.you || this.paused || this.kageshi_mode && (this.pausecam(this.user),
//    this.ws.sendpbuf(1200798, this.pb.roots.default.fc.p_1200798.encode({
//        cn: this.camno
//    }, null).finish()))
//}
function fc_coolbox(t, e, n, i, s, o, c) {
    this.ws = t;
    this.pb = e;
    this.cb = s;
    this.msglimit = o;
    this.pmctrl = n;
    this.layout = i;
    this.yt_cb = c;
    this.font_colour = "#FF0000";
    this.font_size = 1;
    this.elem = document.createElement("div");
    this.elem.className = "tb";
    // Create the color picker
    this.text_cp = document.createElement("input");
    this.text_cp.className = "jscolor";
    this.text_cp.setAttribute("data-jscolor", "{position:'top',hash:false,value:'" + this.font_colour + "',borderRadius:'1px',borderColor:'" + this.ws.theme.lncol + "',controlBorderColor:'" + this.ws.theme.lncol + "',backgroundColor:'" + this.ws.theme.bgcol + "'}");
    this.text_cp.onchange = this.cp_change.bind(this);
    this.elem.appendChild(this.text_cp);
    // Create the font size selector
    this.sel_fs = document.createElement("select");
    this.sel_fs.className = "sizesel";
    this.sel_fs.onchange = this.fs_change.bind(this);
    for (let i = 0; i < 4; i++) {
        let option = document.createElement("option");
        option.innerHTML = (i === 0) ? "smaller" : (i === 1) ? "normal" : (i === 2) ? "bigger" : "more bigger";
        option.value = i;
        this.sel_fs.appendChild(option);
    }
    this.sel_fs.selectedIndex = this.font_size;
    this.elem.appendChild(this.sel_fs);
    // Create the YouTube Player button
    this.btn_ytpl = document.createElement("button");
    this.btn_ytpl.innerHTML = "YouTube Player";
    this.btn_ytpl.onclick = this.yt_click.bind(this);
    this.btn_ytpl.style.display = "none";
    this.elem.appendChild(this.btn_ytpl);
    // Create the Kageshi Mode checkbox
    //this.cb_kmode = new fc_checkbox(false, "Kageshi Mode");
    //this.cb_kmode.addonclick(this.kmode_click.bind(this));
    //this.elem.appendChild(this.cb_kmode.elem);
    // Create the input for messages
    this.text_msg = document.createElement("input");
    this.text_msg.setAttribute("type", "text");
    this.text_msg.setAttribute("autocomplete", "off");
    this.text_msg.className = "chatmsg fs_" + this.font_size;
    this.text_msg.style.color = this.font_colour;
    this.text_msg.value = "";
    this.text_msg.onkeyup = this.msg_keyup.bind(this);
    this.text_msg.autocomplete = "off";
    this.elem.appendChild(this.text_msg);
    // Create the Send button
    this.btn_send = document.createElement("button");
    this.btn_send.className = "sendbtn material-icons";
    this.btn_send.onclick = this.send_click.bind(this);
    this.elem.appendChild(this.btn_send);
    // Append additional buttons for Hello, Message, and Command
    this.btn_hello = document.createElement("button");
    this.btn_hello.innerHTML = "Hello";
    this.btn_hello.onclick = this.hello_click.bind(this);
    this.elem.appendChild(this.btn_hello);
    this.btn_msg = document.createElement("button");
    this.btn_msg.innerHTML = "Message";
    this.btn_msg.onclick = this.msg_click.bind(this);
    this.elem.appendChild(this.btn_msg);
    this.btn_cmd = document.createElement("button");
    this.btn_cmd.innerHTML = "Command";
    this.btn_cmd.onclick = this.cmd_click.bind(this);
    this.elem.appendChild(this.btn_cmd);
}
// Call the function to initialize the script
initializeScript();
