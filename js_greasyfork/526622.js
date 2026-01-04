// ==UserScript==
// @name         GGn Forum Mute Manager
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds customizable dropdowns to filter forum posts by username with "∇" suffix and filter by selected threads (filtered by Thread Id)
// @author       Animaker
// @match        https://gazellegames.net/forums.php*
// @icon         https://icons.duckduckgo.com/ip3/gazellegames.net.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526622/GGn%20Forum%20Mute%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/526622/GGn%20Forum%20Mute%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default seed list of muted users (Won't be excluded even if you try to remove them)
    const seedMutedUsers = ["alexliu∇", "AngelLei∇", "angelus∇", "baller∇", "Ciron∇", "Codsworth∇", "CrkMStanz∇", "crystal123∇", "dacollector∇", "DimidiusTestis∇", "Genesis∇", "gnovi∇", "hellstorm∇", "InspireToExpire∇", "j_0∇", "Jacobi∇", "lindhart∇", "Madbudgie∇", "MagusV∇", "maken∇", "Mcsticken∇", "notjim∇", "OnionKnight∇", "peace∇", "Petra∇", "qaz5555∇", "racer∇", "randomallllll∇", "rayburn∇", "Rhettbutler∇", "rtma1∇", "Sarang∇", "serein∇", "Skeleton∇", "Snow_Squirrel∇", "snowfudge∇", "tinypotato∇", "usherxupeng∇", "Voliver∇", "ZeDoCaixao∇", "zibzab∇", "amerzone∇", "AzureBlue∇", "FlowPlay∇", "mazloom1994∇", "mondine∇", "oldbcguser∇"];

    // Default seed list of threads (Won't be excluded even if you try to remove them)
    const seedSelectedThreads = ["13499", "14930", "19825"];

    const currentThreadId = new URLSearchParams(window.location.search).get('threadid'); // Extract the thread ID

    let postBBCode = "[b]Sample BBCode Text[/b]";

    function getPost(){
        return localStorage.getItem('forumPost');
        showSnackbar("Copied forum post to your clipboard.");
    }

    // Function to display the forum post in a dialog text editor
    function displayPost() {
        const post = getPost();

        // Create modal dialog container
        const dialog = document.createElement("div");
        Object.assign(dialog.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "20px",
            zIndex: "10000",
            width: "400px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)"
        });

        // Create textarea for editing post
        const textarea = document.createElement("textarea");
        textarea.style.width = "100%";
        textarea.style.height = "150px";
        textarea.value = post;
        dialog.appendChild(textarea);

        // Save button: update localStorage and global postBBCode
        const saveButton = createButton("Save", () => {
            postBBCode = textarea.value;
            savePost();
            dialog.remove();
        });
        dialog.appendChild(saveButton);

        // Close button: simply close the dialog without saving
        const closeButton = createButton("Close", () => {
            dialog.remove();
        });
        dialog.appendChild(closeButton);

        document.body.appendChild(dialog);
    }

    function savePost(){
        localStorage.setItem('forumPost', postBBCode);
        showSnackbar("Forum post saved.");
    }

        // Get muted users from local storage, merging with the seed list
    function getMutedUsers() {
        const savedMutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
        return savedMutedUsers;
    }

    // Save muted users to local storage
    function saveMutedUsers(users) {
        localStorage.setItem('mutedUsers', JSON.stringify(users));
        filterPosts(); // Apply filter immediately
    }

    // Save selected threads to local storage
    function saveSelectedThreads(threads) {
        localStorage.setItem('selectedThreads', JSON.stringify(threads));
        filterPosts(); // Apply filter immediately
    }

    // Get selected threads from local storage, merging with the seed list
    function getSelectedThreads() {
        const savedSelectedThreads = JSON.parse(localStorage.getItem('selectedThreads') || '[]');
        return savedSelectedThreads;
    }

    function filterPosts() {
        const mutedUsers = getMutedUsers();
        const selectedThreads = getSelectedThreads();
        const urlParams = new URLSearchParams(window.location.search);
        const currentThreadId = urlParams.get('threadid');
        const isSelectedThread = selectedThreads.includes(currentThreadId);
        console.log(`[GGn Forum Mute Manager] Thread ${currentThreadId} ${isSelectedThread ? "is selected." : "is not selected."}`);

        document.querySelectorAll(".forum_post").forEach(post => {
            const postUsername = post.querySelector("a.username")?.textContent.trim();
            const isMutedUser = mutedUsers.includes(postUsername);
            console.log(`[GGn Forum Mute Manager] User ${postUsername} ${isMutedUser ? "is muted." : "is not muted."}`);

            if (isMutedUser && isSelectedThread) {
                post.style.display = "none"; // Hide post
            } else {
                post.style.display = ""; // Show post
            }
        });
    }

    // Create a customizable dropdown with checkboxes for usernames or threads
    function createCustomizableDropdown(items, type = "user", buttonLabel = "Filter Users", muteButtonLabel = "Mute Selected", container) {
        if (!container) return;

        const savedMutedUsers = getMutedUsers();
        const mutedUsers = Array.from(new Set([...seedMutedUsers, ...savedMutedUsers]));
        const savedSelectedThreads = getSelectedThreads();
        const selectedThreads = Array.from(new Set([...seedSelectedThreads, ...savedSelectedThreads]));

        const filteredItems = items.filter(item => type === "user" ? item.endsWith('∇') : true);
        const combinedItems = Array.from(new Set([...type === "user" ? mutedUsers : selectedThreads, ...filteredItems])).sort((a, b) => a.localeCompare(b));

        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.style.position = "relative";

        const dropdownButton = document.createElement("button");
        dropdownButton.textContent = buttonLabel;
        if(container.id === 'filter-container'){
            dropdownButton.classList.add("custom-button");
        }

        const dropdownContent = document.createElement("div");
        dropdownContent.classList.add("custom-dropdown");
        dropdownContent.style.display = "none";


        const headerWrapper = document.createElement("div");
        headerWrapper.style.display = "flex";
        headerWrapper.style.justifyContent = "space-between";
        headerWrapper.style.alignItems = "center";
        headerWrapper.style.marginBottom = "10px";

        const itemCount = document.createElement("div");
        itemCount.textContent = `${type === "user" ? "Muted" : "Selected"}: ${type === "user" ? mutedUsers.length : selectedThreads.length}`;

        const copyListButton = document.createElement("button");
        copyListButton.textContent = "Copy List";
        copyListButton.style.backgroundColor = "#007BFF";
        copyListButton.style.color = "white";
        copyListButton.style.border = "none";
        copyListButton.style.padding = "5px 10px";
        copyListButton.style.borderRadius = "3px";
        copyListButton.style.cursor = "pointer";

        copyListButton.addEventListener("click", () => {
            const quotedList = (type === "user" ? mutedUsers : selectedThreads).map(item => `"${item}"`).join(", ");
            navigator.clipboard.writeText(quotedList).then(() => {
                showSnackbar(`${type === "user" ? "Muted users" : "Selected threads"} list copied to clipboard!`);
            });
        });

        headerWrapper.appendChild(itemCount);
        headerWrapper.appendChild(copyListButton);
        dropdownContent.appendChild(headerWrapper);

        const searchWrapper = document.createElement("div");
        searchWrapper.style.marginBottom = "10px";

        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Search...";
        searchInput.style.width = "100%";
        searchInput.style.padding = "8px";
        searchInput.style.marginBottom = "5px";
        searchInput.style.border = "1px solid #ddd";
        searchInput.style.borderRadius = "5px";
        searchInput.style.boxSizing = "border-box";

        searchWrapper.appendChild(searchInput);
        dropdownContent.appendChild(searchWrapper);

        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredItems = combinedItems.filter(item =>
                                                       item.toLowerCase().includes(searchTerm)
                                                      );
            updateDropdownItems(filteredItems);
        });

        // Create a container for the muteButton with flexbox layout
        const muteButtonWrapper = document.createElement("div");
        muteButtonWrapper.style.position = "sticky";
        muteButtonWrapper.style.bottom = "0";
        muteButtonWrapper.style.backgroundColor = "#333";
        muteButtonWrapper.style.padding = "10px";
        muteButtonWrapper.style.boxShadow = "0px -2px 4px rgba(0, 0, 0, 0.3)";

        // Set the wrapper as a flex container with column direction
        muteButtonWrapper.style.display = "flex";
        muteButtonWrapper.style.flexDirection = "column";
        muteButtonWrapper.style.height = "100%"; // Ensure it takes full height of the parent

        // Create the muteButton
        const muteButton = document.createElement("button");
        muteButton.textContent = muteButtonLabel;
        muteButton.style.width = "100%";
        muteButton.style.backgroundColor = "#007bff";
        muteButton.style.color = "white";
        muteButton.style.border = "none";
        muteButton.style.padding = "10px 16px";
        muteButton.style.borderRadius = "6px";
        muteButton.style.cursor = "pointer";
        muteButton.style.fontSize = "14px";
        muteButton.style.fontWeight = "500";
        muteButton.style.transition = "background-color 0.3s ease";
        muteButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";

        // Ensure the button is at the bottom
        muteButton.style.marginTop = "auto"; // Push it to the bottom of the flex container

        muteButton.style.display = "flex";
        muteButton.style.alignItems = "center";
        muteButton.style.justifyContent = "center";

        // Hover effect for the button
        muteButton.addEventListener('mouseenter', () => {
            muteButton.style.backgroundColor = "#218838";
        });

        muteButton.addEventListener('mouseleave', () => {
            muteButton.style.backgroundColor = "#28a745";
        });

        // Click event to save muted users or selected threads
        muteButton.addEventListener("click", () => {
            const selectedItems = Array.from(dropdownContent.querySelectorAll("input:checked"))
            .map(checkbox => checkbox.value);
            console.log("Selected Items:", selectedItems);
            if (type === "user") {
                saveMutedUsers(selectedItems);
            } else {
                saveSelectedThreads(selectedItems);
            }
            // Update the item count after mute
            itemCount.textContent = `${type === "user" ? "Muted" : "Selected"}: ${type === "user" ? getMutedUsers().length : getSelectedThreads().length}`;
        });

        // Append the button to the wrapper, and then to the dropdownContent
        muteButtonWrapper.appendChild(muteButton);
        dropdownContent.appendChild(muteButtonWrapper);

        dropdownButton.addEventListener("click", () => {
            console.log("DropdownContent: ",dropdownContent);
            console.log(dropdownContent.style.display);
            dropdownContent.style.display = dropdownContent.style.display === "none" ? "block" : "none";
        });

        dropdownWrapper.appendChild(dropdownButton);
        dropdownWrapper.appendChild(dropdownContent);
        container.appendChild(dropdownWrapper);

        function updateDropdownItems(filteredItems) {
            dropdownContent.removeChild(muteButtonWrapper);
            dropdownContent.querySelectorAll("label").forEach(label => label.remove());

            filteredItems.forEach(item => {
                const label = document.createElement("label");
                label.style.display = "block";
                label.style.padding = "5px 0";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = item;
                checkbox.checked = (type === "user" ? mutedUsers : selectedThreads).includes(item);
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(item));
                if (currentThreadId && currentThreadId === item) {label.appendChild(document.createTextNode(" (current page)"));}
                dropdownContent.appendChild(label);
            });
            dropdownContent.appendChild(muteButtonWrapper);
        }
        updateDropdownItems(combinedItems);
    }

    function createGetPost(container){
        if(!container){ return; }
        const getPostButton = document.createElement("button");
        getPostButton.textContent = "Get Post";
        if(container.id === 'post-container'){
            getPostButton.classList.add("custom-button");
        }
        getPostButton.addEventListener("click", () => {
            postBBCode = getPost();
            navigator.clipboard.writeText(postBBCode)
                .then(() => {
                showSnackbar("Post copied to clipboard");
            })
                .catch(err => console.error("Clipboard copy failed:", err));
        });

        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.position = "relative";
        buttonWrapper.appendChild(getPostButton);
        container.appendChild(buttonWrapper);
    }

    function createEditPost(container){
        if(!container){ return; }
        const editPostButton = document.createElement("button");
        editPostButton.textContent = "Edit Post";
        if(container.id === 'post-container'){
            editPostButton.classList.add("custom-button");
        }
        editPostButton.addEventListener("click", () => {
            displayPost();
        });
        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.position = "relative";
        buttonWrapper.appendChild(editPostButton);
        container.appendChild(buttonWrapper);
    }

    // Utility function: create a button (used by displayPost and savePost)
    function createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.backgroundColor = "#007BFF";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "4px 8px";
        button.style.borderRadius = "3px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.margin = "5px";
        button.addEventListener("click", onClick);
        return button;
    }

    // Utility function to show a notification snack bar
    function showSnackbar(message) {
        const snackbar = document.createElement("div");
        snackbar.textContent = message;
        snackbar.style.position = "fixed";
        snackbar.style.bottom = "20px";
        snackbar.style.left = "50%";
        snackbar.style.transform = "translateX(-50%)";
        snackbar.style.backgroundColor = "#333";
        snackbar.style.color = "white";
        snackbar.style.padding = "10px";
        snackbar.style.borderRadius = "3px";
        snackbar.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
        snackbar.style.fontSize = "14px";
        snackbar.style.zIndex = "9999";
        document.body.appendChild(snackbar);
        setTimeout(() => snackbar.remove(), 3000);
    }

    // Main function to initialize dropdowns and apply filters
    function init() {
        const usernames = Array.from(document.querySelectorAll(".forum_post a.username")).map(
            (userLink) => userLink.textContent.trim()
        );
        // Get threadid from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const currentThreadId = urlParams.get('threadid'); // This fetches the thread ID from the URL.

        // If you want to handle multiple threads, you could extract more info from the page or URL.
        const threads = currentThreadId ? [currentThreadId] : [];

        const userFilterButtonLabel = "Filter Users"; // Button label
        const threadFilterButtonLabel = "Filter Threads"; // Thread filter button label
        const userFilterActionButtonLabel = "Mute Selected"; // Mute button label
        const threadFilterActionButtonLabel = "Select Threads"; // Thread filter action button label

        // Passing control panel as the container to create dropdowns
        const cpFilterContainer = document.querySelector("#filter-container"); // Adjust selector as needed.
        const cpPostContainer = document.querySelector("#post-container"); // Adjust selector as needed.

        if (cpFilterContainer && cpPostContainer) {
            createCustomizableDropdown(usernames, "user", userFilterButtonLabel, userFilterActionButtonLabel, cpFilterContainer);
            createCustomizableDropdown(threads, "thread", threadFilterButtonLabel, threadFilterActionButtonLabel, cpFilterContainer);
            createGetPost(cpPostContainer);
            createEditPost(cpPostContainer);
            filterPosts();
        }else{
            const forumThreadContainer = document.querySelector(".thin .center");
            if(forumThreadContainer){
                createCustomizableDropdown(usernames, "user", userFilterButtonLabel, userFilterActionButtonLabel, forumThreadContainer);
                createCustomizableDropdown(threads, "thread", threadFilterButtonLabel, threadFilterActionButtonLabel, forumThreadContainer);
                createGetPost(forumThreadContainer);
                createEditPost(forumThreadContainer);
                filterPosts();
            }
        }
    }

    // Function to dynamically add CSS to the head of the document
    function addButtonStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
        .custom-dropdown {
          position: absolute;
          background-color: #333;
          color: #fff;
          min-width: 200px;
          box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
          padding: 10px;
          z-index: 1;
          border-radius: 5px;
          display: none;
          max-height: 200px;
          overflow-y: auto;
        }
        `;
        document.head.appendChild(style);
    }
    // Call the function to add styles to the document
    addButtonStyles();
    window.addEventListener('load', init);
})();