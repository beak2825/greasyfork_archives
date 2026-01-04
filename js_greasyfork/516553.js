// ==UserScript==
// @name         TORN Friend Extender
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @author       Clyoth
// @description  A script that lets you add, store, and delete friends on Torn with custom descriptions.
// @match        https://www.torn.com/friendlist.php
// @icon         https://play-lh.googleusercontent.com/BkaIDbibtUpGcziVQsgCya-eC7oxTUHL5G8m8v3XW3S11_-GZEItaxzeXxhKmoAiX8x6
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516553/TORN%20Friend%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/516553/TORN%20Friend%20Extender.meta.js
// ==/UserScript==

(function () {
    const apiKey = 'ADD_API_KEY_HERE';
    const FRIENDS_STORAGE_KEY = 'tornFriendList';

    let addButtonAdded = false;
    let addedFriends = new Set(); // Track added friends by ID
    let friendsLoaded = false; // Flag to track if friends have been loaded already

    const style = document.createElement('style');
    style.textContent = `
        .add-button {
            padding: 12px 20px;
            background-color: #3b3b3b;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease, transform 0.2s ease;
            margin-top: 4px;
            width: auto;
            text-align: center;
        }
        .add-button:hover {
            background-color: #5c5c5c;
            transform: scale(1.05);
        }
        #friendForm {
            padding: 20px;
            border-radius: 8px;
            margin-top: 10px;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            background-color: #2c2f33;
        }
        #friendForm h3 {
            margin-top:4px;
        }
        #friendDataForm input[type="text"] {
            width: 30%;
            padding: 8px;
            margin-top: 8px;
            border: 2px solid #555;
            border-radius: 5px;
            background-color: #444;
            color: white;
            font-size: 12px;
        }
        #friendDataForm label {
            font-weight: bold;
            display: block;
            margin-bottom: 4px;
            color: #d3d3d3;
        }
        #friendDataForm button {
            padding: 8px 16px;
            background-color: #3b3b3b;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin-top: 10px;
            transition: background-color 0.3s ease;
        }
        #friendDataForm button:hover {
            background-color: #5c5c5c;
        }
        #friendDataForm #cancelForm {
            background-color: #8b0000;
            margin-left: 10px;
        }
        #friendDataForm #cancelForm:hover {
            background-color: #b22222;
        }
    `;
    document.head.appendChild(style);

    function loadFriends() {
        const storedFriends = localStorage.getItem(FRIENDS_STORAGE_KEY);
        return storedFriends ? JSON.parse(storedFriends) : [];
    }

    function saveFriends(friends) {
        localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
    }

    function createForm() {
        if (document.getElementById('friendForm')) return;

        const formHTML = `
            <div id="friendForm" style="padding: 10px; background-color: #323233; border-radius: 5px; margin-top: 10px;">
                <h3>Add Friend</h3>
                <form id="friendDataForm">
                    <label for="friendId">ID:</label>
                    <input type="text" id="friendId" name="id" required /><br><br>
                    <label for="friendDescription">Description:</label>
                    <input type="text" id="friendDescription" name="description" maxlength="40"/><br><br>
                    <button type="submit">Fetch and Add Friend</button>
                    <button type="button" id="cancelForm">Cancel</button>
                </form>
            </div>
        `;

        const formContainer = document.createElement('div');
        formContainer.innerHTML = formHTML;

        const paginationWrapper = document.querySelector('.pagination-wrapper');
        if (paginationWrapper) {
            paginationWrapper.appendChild(formContainer);
        } else {
            console.error('pagination-wrapper not found.');
        }

        document.getElementById('cancelForm').addEventListener('click', () => {
            formContainer.remove();
        });

        document.getElementById('friendDataForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const friendId = document.getElementById('friendId').value;
            const description = document.getElementById('friendDescription').value || 'None';

            // Only store the ID and description
            const friends = loadFriends();
            friends.push({ id: friendId, description });
            saveFriends(friends);
            addFriendToList({ id: friendId, description });

            formContainer.remove();
        });
    }

    async function fetchFriendData(id) {
        try {
            const response = await fetch(`https://api.torn.com/user/${id}?selections=profile&key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                alert(`Error: ${data.error.code} - ${data.error.error}`);
                return null;
            }

            return {
                id: id,
                name: data.name,
                level: data.level,
                status: data.status.description,
                profileUrl: `/profiles.php?XID=${id}`,
                description: "None" // The description will be stored separately
            };
        } catch (error) {
            console.error("Failed to fetch friend data:", error);
            alert("Failed to fetch friend data. Please check the console for details.");
            return null;
        }
    }

    function addFriendButton() {
        // Check if the button already exists
        if (document.querySelector('.add-button')) return;

        const addButton = document.createElement('button');
        addButton.textContent = 'Add Friend by ID';
        addButton.addEventListener('click', createForm);
        addButton.classList.add('add-button');

        const paginationWrapper = document.querySelector('.pagination-wrapper');
        if (paginationWrapper && !paginationWrapper.contains(addButton)) {
            paginationWrapper.appendChild(addButton);
        }
    }

    async function addFriendToList(friendData) {
    const targetUL = document.querySelector(".user-info-blacklist-wrap");

    if (targetUL) {
        if (addedFriends.has(friendData.id)) return; // Prevent adding duplicate friends

        // Fetch the latest data every time a friend is added
        const latestData = await fetchFriendData(friendData.id);
        if (!latestData) return;

        // Extract the first word from the status
        const firstWordStatus = latestData.status.split(' ')[0];

        const newLI = document.createElement("li");
        newLI.setAttribute('data-id', friendData.id);

        newLI.innerHTML = `
            <div class="delete">
                <i class="delete-user"></i>
            </div>

            <div class="acc-wrapper">
                <div class="expander left">
                    <span class="honor-text-wrap blue big" style="display: block; text-align: center; width: 100%;">
                        <a href="${latestData.profileUrl}" title="${latestData.name} [${latestData.id}]" style="text-decoration: none; color:white;">
                            ${latestData.name}
                        </a>
                    </span>
                    <div class="d-hide expand right">
                        <i class="collapse-arrow"></i>
                    </div>
                </div>

                <div class="acc-body">
                    <div class="level left">
                        <span class="d-hide bold">Level:</span> ${latestData.level}
                    </div>

                    <div class="status left">
                        <span class="d-hide bold">Status:</span>
                        <div class="status-description" style="text-overflow:elipsis;">${firstWordStatus}</div>
                    </div>

                    <div class="description">
                        <div class="left"></div>
                        <div class="text left t-overflow">${friendData.description}</div>
                    </div>
                </div>
            </div>
        `;

        targetUL.appendChild(newLI);

        addedFriends.add(friendData.id); // Mark as added to prevent duplicates

        const deleteButton = newLI.querySelector('.delete-user');
        deleteButton.addEventListener('click', () => deleteFriend(friendData.id, newLI));
    }
}


    function deleteFriend(id, listItem) {
        listItem.remove();
        addedFriends.delete(id); // Remove from the added friends set
        const friends = loadFriends().filter(friend => friend.id !== id);
        saveFriends(friends);
    }

    function loadAndDisplayFriends() {
        if (friendsLoaded) return; // Prevent loading friends again

        const friends = loadFriends();
        friends.forEach(friendData => {
            // Avoid re-adding the same friend
            if (!addedFriends.has(friendData.id)) {
                addFriendToList(friendData);
            }
        });

        friendsLoaded = true; // Set the flag to prevent reloading
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.pagination-wrapper')) {
            addFriendButton();
        }
        if (document.querySelector('.user-info-blacklist-wrap')) {
            loadAndDisplayFriends();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

