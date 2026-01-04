// ==UserScript==
// @name         GGn Control Panel
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  A beautiful control panel that displays advanced capabilities you won't find on the site.
// @author       Animaker
// @icon         https://icons.duckduckgo.com/ip3/gazellegames.net.ico
// @match        https://gazellegames.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526733/GGn%20Control%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/526733/GGn%20Control%20Panel.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const API_KEY = ""; // Replace with your API key

    // Global
    let isDebug = false;
    let globalDialog = null;
    let globalSnackbar = null;
    let loadingScreen = null;
    let minimized = null

    // Best Torrents Section
    let currentTorrentPage = 1; // Initialize pagination when searching the best torrent
    let currentSortBy = "seeders";
    let bestTorrents = []; // Initialize an empty array to hold best torrents
    let minimum = 0;

    // Check Inbox Section
    let checkInboxButton = null;

    // Crafting Simulator Section
    let selectedItems = []; // Initialize an empty array to hold selected items

    function youWish(){
        alert("Oops, ask Santa.");
    }

    /**
     * Displays a full-screen loading overlay.
    **/
    function showLoadingScreen() {
        if (!loadingScreen) {
            loadingScreen = document.createElement("div");
            loadingScreen.style.position = "fixed";
            loadingScreen.style.top = "0";
            loadingScreen.style.left = "0";
            loadingScreen.style.width = "100%";
            loadingScreen.style.height = "100%";
            loadingScreen.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            loadingScreen.style.display = "flex";
            loadingScreen.style.alignItems = "center";
            loadingScreen.style.justifyContent = "center";
            loadingScreen.style.zIndex = "10000";
            // You can customize this inner HTML to include a spinner icon if desired.
            loadingScreen.innerHTML = `<div style="color: #fff; font-size: 24px;">Loading...</div>`;
            document.body.appendChild(loadingScreen);
        }
    }

    /**
     * Hides and removed the loading overlay.
    **/
    function hideLoadingScreen() {
        if (loadingScreen) {
            document.body.removeChild(loadingScreen);
            loadingScreen = null;
        }
    }
    // Function to adjust the scale of the control panel based on window width
    function adjustControlPanelScale() {
        const panel = document.getElementById("control-panel");
        if (!panel) return;
        // For instance, suppose 1920px is our ideal width; scale down if the window is smaller.
        // The scale factor will never exceed 1.
        const scaleFactor = Math.min(window.innerWidth / 2160, 1);
        // Retrieve and clean position values
        const rawRight = Math.max(0, Math.round(parseFloat(localStorage.getItem("panelRight") || "50")));
        const rawBottom = Math.max(0, Math.round(parseFloat(localStorage.getItem("panelBottom") || "20")));
        console.log(`Right: ${rawRight} Bottom: ${rawBottom}`);
        panel.style.right = `${rawRight}px`;
        panel.style.bottom = `${rawBottom}px`;
        panel.style.transform = `scale(${scaleFactor})`;
        panel.style.transformOrigin = "bottom right"; // Adjust the origin as needed
    }

    async function updateSimulateButtonState() {
        const simulateAllButton = window.simulateAllButton;

        if (!simulateAllButton) return;

        // If there are selected items, enable and show the button
        if (selectedItems.length > 0) {
            simulateAllButton.disabled = false;
        } else {
            simulateAllButton.disabled = true;
        }

        // If 9 items are selected, hide the button
        if (selectedItems.length >= 9) {
            simulateAllButton.style.display = "none";
        }
    }

    async function addItemToSelectedList(item, header, container, isReflecting = false) {
        // Prevent adding the same item more than once
        if (selectedItems.some(selectedItem => selectedItem.item.id === item.item.id)) {
            alert("This item is already in the simulation.");
            return;
        }

        // Limit to 9 items in the simulation
        if (selectedItems.length >= 9 && !isReflecting) {
            alert("You can only select up to 9 items.");
            return;
        }

        // Add the item to the list
        selectedItems.push(item);

        // Sort the selected items by amount (descending), name (alphabetical), and id (numeric)
        selectedItems.sort((a, b) => {
            if (Number(b.amount) !== Number(a.amount)) {
                return Number(b.amount) - Number(a.amount); // Sort by amount descending
            }
            if (a.item.name !== b.item.name) {
                return a.item.name.localeCompare(b.item.name); // Sort by name alphabetically
            }
            return Number(a.item.id) - Number(b.item.id); // Sort by id numerically
        });

        // Ensure header exists and create one if necessary
        if (!header) {
            const dialog = document.querySelector("dialog");
            header = document.createElement("h2");
            dialog.insertBefore(header, dialog.firstChild);
        }

        // Create a div to hold both the image and the remove button
        const itemDiv = document.createElement("div");
        itemDiv.style.display = "inline-flex";
        itemDiv.style.alignItems = "center";
        itemDiv.style.marginRight = "10px";
        itemDiv.style.marginBottom = "10px";

        // Add the image only if it's not already in the header
        const existingImages = Array.from(header.getElementsByTagName("img"));
        if (!existingImages.some(img => img.alt === item.item.name)) {
            const img = document.createElement("img");
            img.src = getImageUrl(item.item.image);
            img.alt = item.item.name;
            img.style.maxWidth = "30px";
            img.style.maxHeight = "30px";
            img.style.marginRight = "5px";
            itemDiv.appendChild(img);
        }

        // Add a remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.style.backgroundColor = "#dc3545";
        removeButton.style.color = "#fff";
        removeButton.style.border = "none";
        removeButton.style.borderRadius = "50%";
        removeButton.style.cursor = "pointer";
        removeButton.style.padding = "5px 10px";
        removeButton.style.marginLeft = "5px";

        // Add the event listener to remove the item
        removeButton.addEventListener("click", () => {
            // Remove item from the selectedItems array
            selectedItems = selectedItems.filter(selectedItem => selectedItem.item.id !== item.item.id);

            // Remove the div (UI element) from the container
            itemDiv.remove();
        });

        itemDiv.appendChild(removeButton);
        container.appendChild(itemDiv);
    }

    async function removeItemFromSelectedList(item, header, itemDiv, container) {
        selectedItems = selectedItems.filter(selectedItem => selectedItem.item.id !== item.item.id);

        itemDiv.remove();
        container.removeChild(itemDiv);

        await updateSimulateButtonState();
    }

    async function simulateCrafts(dialog) {
        const crafts = await getCraftsForItems(selectedItems);

        const resultsDiv = document.createElement("div");
        resultsDiv.style.marginTop = "20px";
        const resultsTitle = document.createElement("h3");
        resultsTitle.textContent = "Crafting Results";
        resultsDiv.appendChild(resultsTitle);

        if (crafts.length === 0) {
            const noCraftsMessage = document.createElement("p");
            noCraftsMessage.textContent = "No crafts found.";
            resultsDiv.appendChild(noCraftsMessage);
        } else {
            crafts.forEach(craft => {
                const p = document.createElement("p");
                p.textContent = `Craft Found: ${craft}`;
                resultsDiv.appendChild(p);
            });
        }

        dialog.appendChild(resultsDiv);
    }

    async function getCraftsForItems(items) {
        return items.map(item => `recipe for ${item.item.name}`);
    }

    // Utility function to show a notification snack bar.
    // The third argument 'position' can be either "top" or "bottom".
    function showSnackbar(message, imageSrc, position = "bottom") {
        // If the snackbar doesn't exist yet, create it once.
        if (!globalSnackbar) {
            globalSnackbar = document.createElement("div");
            globalSnackbar.style.position = "fixed";
            // Set default position based on 'position' argument.
            if (position === "top") {
                globalSnackbar.style.top = "20px";
                globalSnackbar.style.bottom = "";
            } else {
                globalSnackbar.style.bottom = "20px";
                globalSnackbar.style.top = "";
            }
            globalSnackbar.style.left = "50%";
            globalSnackbar.style.transform = "translateX(-50%)";
            globalSnackbar.style.backgroundColor = "#333";
            globalSnackbar.style.color = "white";
            globalSnackbar.style.padding = "10px";
            globalSnackbar.style.borderRadius = "3px";
            globalSnackbar.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
            globalSnackbar.style.fontSize = "14px";
            globalSnackbar.style.zIndex = "9999";
            // Set up flexbox to arrange the text and image
            globalSnackbar.style.display = "flex";
            globalSnackbar.style.alignItems = "center";
            // Add transition for a fade-out effect
            globalSnackbar.style.transition = "opacity 0.5s ease-out";
            // Start hidden
            globalSnackbar.style.opacity = "0";
            document.body.appendChild(globalSnackbar);
        } else {
            // If snackbar already exists, update its position
            if (position === "top") {
                globalSnackbar.style.top = "20px";
                globalSnackbar.style.bottom = "";
            } else {
                globalSnackbar.style.bottom = "20px";
                globalSnackbar.style.top = "";
            }
        }

        // Clear the snackbar content before updating it
        globalSnackbar.innerHTML = "";
        // If an image source is provided, create the image element and append it
        if (imageSrc) {
            const img = document.createElement("img");
            img.src = imageSrc;
            img.alt = "icon";
            img.style.width = "24px";
            img.style.height = "24px";
            // Add a margin to separate the image from the text
            img.style.marginLeft = "8px";
            globalSnackbar.appendChild(img);
        }
        // Create a span for the message text and append it
        const messageSpan = document.createElement("span");
        messageSpan.textContent = message;
        globalSnackbar.appendChild(messageSpan);

        // Immediately show the snackbar
        globalSnackbar.style.opacity = "1";

        // Clear any existing hide timeout to avoid overlapping fadeouts
        if (globalSnackbar.hideTimeout) {
            clearTimeout(globalSnackbar.hideTimeout);
        }

        // Set a new timeout to fade out the snackbar after 2.5 seconds
        globalSnackbar.hideTimeout = setTimeout(() => {
            globalSnackbar.style.opacity = "0";
        }, 2500);
    }

    /**
     * Function to log debug messages if debugging is enabled.
     * @param {string} message - The debug message to log.
     * @param {...any} optionalParams - Additional parameters to log.
    **/
    function debugConsole(message, ...optionalParams) {
        if (isDebug) {
            console.log(`[DEBUG]: ${message}`, ...optionalParams);
        }
    }

    function decodeHTML(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    // Function to determine the full image URL
    function getImageUrl(imagePath) {
        // Check if the imagePath starts with 'http' indicating it's an absolute URL
        if (imagePath.startsWith('http')) {
            return imagePath; // Return the absolute URL as is
        } else {
            // Otherwise, treat it as a relative path and prepend the base URL
            const baseUrl = 'https://gazellegames.net/';
            return `${baseUrl}${imagePath.replace(/\\/g, '/')}`;
        }
    }

    // Helper function to sort a table by a given column
    function sortTableByColumn(table, columnIndex, asc = true) {
        const tbody = table.querySelector("tbody");
        const rows = Array.from(tbody.querySelectorAll("tr"));

        rows.sort((a, b) => {
            // Get text content of the target cells
            const aText = a.querySelectorAll("td")[columnIndex].textContent.trim();
            const bText = b.querySelectorAll("td")[columnIndex].textContent.trim();

            // Try to parse as numbers first
            const aNum = parseFloat(aText.replace(/[^0-9\.-]+/g, ""));
            const bNum = parseFloat(bText.replace(/[^0-9\.-]+/g, ""));
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return asc ? aNum - bNum : bNum - aNum;
            }
            // Fall back to string comparison
            return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        // Reattach rows in sorted order
        rows.forEach(row => tbody.appendChild(row));
    }

    // Function to add sorting to your table headers
    function addSortingToTable(table) {
        const thead = table.querySelector("thead");
        if (!thead) return;

        // For each header cell, add a click listener
        const headers = thead.querySelectorAll("th");
        headers.forEach((th, index) => {
            // We'll store the sort order for each column in a data attribute.
            th.style.cursor = "pointer";
            th.dataset.asc = "true";
            th.addEventListener("click", () => {
                const asc = th.dataset.asc === "true";
                sortTableByColumn(table, index, asc);
                // Toggle the sort order for next click
                th.dataset.asc = asc ? "false" : "true";
            });
        });
    }

    // Utility: Create a search text filter to use in any display
    function createSearchFilter(placeholder) {
        const searchField = document.createElement("input");
        searchField.type = "text";
        searchField.placeholder = placeholder;
        searchField.classList.add("search-filter");
        return searchField;
    }

    // Utility: Create a dialog box with a custom title and a close button
    function createDialog(titleText, isPopup=false) {
        if(!isPopup && globalDialog){ globalDialog.remove(); }

        const dialog = document.createElement("div");
        dialog.style.display = "flex";
        dialog.style.flexDirection = "column";
        dialog.style.position = "fixed";
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.transform = "translate(-50%, -50%)";
        dialog.style.backgroundColor = "#333";
        dialog.style.borderRadius = "10px";
        dialog.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
        dialog.style.padding = "20px";
        dialog.style.width = "1200px"; // Fixed width
        dialog.style.height = "800px"; // Fixed height
        dialog.style.zIndex = "10000";
        dialog.style.overflow = "hidden"; // Prevent dialog from growing

        const title = document.createElement("h2");
        title.display = "block";
        title.textContent = titleText;
        title.style.color = "#fff";
        title.style.textAlign = "center";
        dialog.appendChild(title);

        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.border = "none";
        closeButton.style.backgroundColor = "transparent";
        closeButton.style.color = "#fff";
        closeButton.style.fontSize = "24px";
        closeButton.style.fontWeight = "bold";
        closeButton.style.padding = "5px 10px";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => {
            dialog.remove();
            selectedItems = [];
        });
        dialog.appendChild(closeButton);
        document.body.appendChild(dialog);
        return dialog;
    }

    function displayCraftingSimulator(craftableItems) {
        globalDialog = createDialog("Simulate All Possible Crafts");
        const header = document.createElement("h2");
        globalDialog.appendChild(header); // Ensure header exists in the dialog

        // Add space between the selected items and the table
        const selectedItemsContainer = document.createElement("div");
        selectedItemsContainer.style.marginBottom = "20px"; // Add space between icon list and table
        globalDialog.appendChild(selectedItemsContainer);

        // Add the search bar
        const searchBar = createSearchFilter("Search items...");
        globalDialog.appendChild(searchBar);

        // Create table container for growing table
        const tableContainer = document.createElement("div");
        tableContainer.style.overflowY = "auto"; // Enable vertical scrolling
        tableContainer.style.flexGrow = "1"; // Allow container to grow
        tableContainer.style.border = "1px solid #444"; // Optional border

        // Apply flex layout to the dialog
        globalDialog.style.display = "flex";
        globalDialog.style.flexDirection = "column";
        globalDialog.style.height = "600px"; // Make dialog occupy full height
        globalDialog.style.overflow = "hidden"; // Avoid overflow issues

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "20px";
        // table.style.tableLayout = "fixed"; // Columns share equal space

        const headers = ["Item Name", "Image", "Quantity", "Add to Simulation"];
        const headerRow = table.insertRow();
        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            th.style.border = "1px solid #444";
            th.style.padding = "10px";
            th.style.color = "#fff";
            th.style.backgroundColor = "#333";
            headerRow.appendChild(th);
        });

        // Function to filter and display the items based on search input
        const filterItems = (searchTerm) => {
            const filteredItems = craftableItems.filter(item =>
                                                        item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                       );
            displayItems(filteredItems); // Call the function to display the filtered items
        };

        // Display function for items
        const displayItems = (items) => {
            // Clear the table before appending the filtered items
            table.innerHTML = "";
            const headerRow = table.insertRow();
            headers.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                th.style.border = "1px solid #444";
                th.style.padding = "10px";
                th.style.color = "#fff";
                th.style.backgroundColor = "#333";
                headerRow.appendChild(th);
            });

            items.forEach(item => {
                const row = table.insertRow();

                const nameCell = row.insertCell();
                nameCell.textContent = item.item.name;
                nameCell.style.border = "1px solid #444";
                nameCell.style.padding = "10px";

                const imageCell = row.insertCell();
                const link = document.createElement("a"); // Create the link for shop URL
                link.href = `https://gazellegames.net/shop.php?ItemID=${item.itemid}`; // Set the href to the shop URL (ensure it's available in your data)
                link.target = "_blank"; // Open the link in a new tab
                const img = document.createElement("img");
                img.src = getImageUrl(item.item.image);
                img.alt = item.item.name;
                img.style.maxWidth = "50px";
                img.style.maxHeight = "50px";
                img.style.objectFit = "contain";
                img.setAttribute("loading", "lazy"); // Add lazy loading attribute
                link.appendChild(img); // Append the image to the link
                imageCell.appendChild(link); // Append the link to the cell
                imageCell.style.border = "1px solid #444";
                imageCell.style.padding = "10px";

                const quantityCell = row.insertCell();
                quantityCell.textContent = item.amount;
                quantityCell.style.border = "1px solid #444";
                quantityCell.style.padding = "10px";

                const actionCell = row.insertCell();
                const addButton = document.createElement("button");
                addButton.textContent = "Add to Simulation";
                addButton.style.padding = "5px 10px";
                addButton.style.backgroundColor = "#28a745";
                addButton.style.color = "#fff";
                addButton.style.border = "none";
                addButton.style.borderRadius = "5px";
                addButton.style.cursor = "pointer";
                addButton.addEventListener("click", () => {
                    addItemToSelectedList(item, header, selectedItemsContainer); // Pass header and container to update
                });
                actionCell.appendChild(addButton);
                actionCell.style.border = "1px solid #444";
                actionCell.style.padding = "10px";
                actionCell.style.textAlign = "center";
            });
        };

        // Initialize the table with all items
        displayItems(craftableItems);

        // Attach event listener to search bar
        searchBar.addEventListener("input", (event) => {
            filterItems(event.target.value); // Filter items as user types
        });

        // Reflect already selected items if there are any
        selectedItems.forEach(item => {
            addItemToSelectedList(item, header, selectedItemsContainer, true); // Pass `true` to indicate it’s being reflected
        });

        // Create Simulate All button (always present but disabled until list is not empty)
        const simulateAllButton = document.createElement("button");
        simulateAllButton.style.cursor = "pointer";
        simulateAllButton.textContent = "Simulate All";
        simulateAllButton.style.display = "block";
        simulateAllButton.style.margin = "0 auto";
        simulateAllButton.style.padding = "5px 10px";
        simulateAllButton.style.marginTop = "10px";
        simulateAllButton.style.backgroundColor = "#007bff";
        simulateAllButton.style.color = "#fff";
        simulateAllButton.style.border = "none";
        simulateAllButton.style.borderRadius = "5px";
        simulateAllButton.disabled = true; // Initially disabled
        simulateAllButton.addEventListener("click", simulateCrafts(globalDialog));

        // Append the table to the container
        tableContainer.appendChild(table);

        // Add the table container to the dialog
        globalDialog.appendChild(tableContainer);
        globalDialog.appendChild(simulateAllButton);
    }


    // Create a table with recipe details
    function createRecipeTable(recipeParts, itemDetailsMap) {
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.marginTop = "20px";
        table.style.borderCollapse = "collapse";
        table.style.tableLayout = "fixed"; // Ensures all cells are the same size

        const cellSize = "100px"; // Set a fixed size for cells

        recipeParts.forEach((part, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;

            const cell = document.createElement("td");
            cell.style.border = "1px solid #444";
            cell.style.width = cellSize; // Set fixed width
            cell.style.height = cellSize; // Set fixed height
            cell.style.padding = "10px";
            cell.style.textAlign = "center";
            cell.style.verticalAlign = "middle"; // Center content vertically

            if (part === "EEEEE") {
                cell.textContent = "Empty";
            } else {
                const cleanedPart = part.replace(/^0+/, "");
                const item = itemDetailsMap[cleanedPart];

                if (item) {
                    const itemName = document.createElement("p");
                    itemName.textContent = item.name;
                    itemName.style.fontWeight = "bold";
                    itemName.style.color = "#fff";
                    itemName.style.margin = "0"; // Remove default margin for consistent spacing

                    const itemImage = document.createElement("img");
                    itemImage.src = item.image;
                    itemImage.alt = item.name;
                    itemImage.style.maxWidth = "50px";
                    itemImage.style.maxHeight = "50px";
                    itemImage.style.marginTop = "5px";
                    itemImage.style.objectFit = "contain";
                    itemImage.setAttribute("loading", "lazy");

                    // Create the link around the image
                    const itemLink = document.createElement("a");
                    itemLink.href = `https://gazellegames.net/shop.php?ItemID=${item.id}`;
                    itemLink.target = "_blank"; // Open in a new tab

                    // Append the image inside the link
                    itemLink.appendChild(itemImage);

                    // Append the item name and image link inside the cell
                    cell.appendChild(itemName);
                    cell.appendChild(itemLink);
                } else {
                    cell.textContent = "Item not found";
                }
            }

            const rowElement = table.rows[row] || table.insertRow(row);
            rowElement.appendChild(cell);
        });

        return table;
    }

    // Translate a recipe string into a table format
    function translateRecipe(recipeString, recipeResult) {
        const recipeParts = recipeString.match(/.{1,5}/g);
        if (!recipeParts || recipeParts.length !== 9) {
            console.error("[GGn Control Panel] Recipe string format is invalid.");
            return null;
        }

        const uniqueItemIds = [...new Set(recipeParts.filter(part => part !== "EEEEE")), recipeResult];

        return fetchItemDetails(uniqueItemIds).then(itemDetailsArray => {
            const itemDetailsMap = itemDetailsArray.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {});

            // Create the recipe table
            const recipeTable = createRecipeTable(recipeParts, itemDetailsMap);

            // Create the result div
            const resultItem = itemDetailsMap[recipeResult];
            const resultDiv = document.createElement("div");
            resultDiv.style.marginTop = "20px";

            if (resultItem) {
                const resultLabel = document.createElement("p");
                resultLabel.textContent = `Result: ${resultItem.name}`;
                resultLabel.style.fontWeight = "bold";
                resultLabel.style.color = "#fff";

                // Create the anchor tag for the shop URL
                const resultLink = document.createElement("a");
                resultLink.href = `https://gazellegames.net/shop.php?ItemID=${resultItem.id}`; // Assuming the shop URL is available in resultItem
                resultLink.target = "_blank"; // Open the link in a new tab

                const resultImage = document.createElement("img");
                resultImage.src = resultItem.image;
                resultImage.alt = resultItem.name;
                resultImage.style.maxWidth = "75px";
                resultImage.style.maxHeight = "75px";
                resultImage.style.marginTop = "10px";
                resultImage.style.objectFit = "contain";
                resultImage.setAttribute("loading", "lazy");

                // Append the image inside the link
                resultLink.appendChild(resultImage);

                resultDiv.appendChild(resultLabel);
                resultDiv.appendChild(resultLink); // Append the link (with image) to the resultDiv
            } else {
                const errorLabel = document.createElement("p");
                errorLabel.textContent = "Result item not found.";
                errorLabel.style.color = "#f00";
                resultDiv.appendChild(errorLabel);
            }
            debugConsole(`[GGn Control Panel] translateRecipe returns:`,{ recipeTable, resultDiv });
            return { recipeTable, resultDiv };
        });
    }

    function displayCraftingRecipe(recipe){
        const dialog = createDialog(`RecipeId: ${recipe.id}`,true);
        dialog.style.overflowY = "auto";

        const recipeContainer = document.createElement("div");
        recipeContainer.style.borderBottom = "1px solid #444";
        recipeContainer.style.marginBottom = "10px";
        recipeContainer.style.paddingBottom = "10px";

        [
            { label: "Recipe ID", value: recipe.id },
            { label: "Recipe", value: recipe.recipe },
            { label: "Requirement", value: recipe.requirement },
            { label: "Result", value: recipe.result }
        ].forEach(({ label, value }) => {
            const element = document.createElement("p");
            element.textContent = `${label}: ${value}`;
            element.style.color = "#bbb";
            recipeContainer.appendChild(element);
        });

        translateRecipe(recipe.recipe, recipe.result).then(({ recipeTable, resultDiv }) => {
            if (recipeTable && resultDiv) {
                recipeContainer.appendChild(recipeTable);
                recipeContainer.appendChild(resultDiv);
            }
        });

        dialog.appendChild(recipeContainer);
        document.body.appendChild(dialog);
        debugConsole(`[GGn Control Panel] displayCraftedRecipe complete.`);
    }

    // Function to get the list of item IDs from the recipes, result, and inventory
    async function getAllItemIds(craftRecipes, inventory) {
        const allItemIds = new Set();

        // Add item IDs from each recipe
        for (let craftRecipe of craftRecipes) {
            const recipeParts = craftRecipe.recipe.match(/.{1,5}/g); // Break the recipe into parts
            const uniqueRecipeIds = new Set(recipeParts.filter(part => part !== "EEEEE")); // Remove "EEEEE" and add to the set
            uniqueRecipeIds.add(craftRecipe.result); // Add the result item ID to the set
            uniqueRecipeIds.forEach(id => allItemIds.add(id)); // Add all unique IDs to the overall set
        }

        // Add item IDs from the inventory (assuming it's an array of item IDs)
        inventory.forEach(item => allItemIds.add(item.itemid));

        return allItemIds;
    }

    async function displayCraftedRecipes(recipes, allCraftRecipes) {
        globalDialog = createDialog("Crafted Recipes");

        // Add the search bar
        const searchBar = createSearchFilter("Search recipes...");
        globalDialog.appendChild(searchBar);

        // Add category filter dropdown
        const categoryFilterContainer = document.createElement("div");
        categoryFilterContainer.style.marginBottom = "10px";

        const categoryFilterLabel = document.createElement("label");
        categoryFilterLabel.textContent = "Filter by Category: ";
        categoryFilterContainer.appendChild(categoryFilterLabel);

        const categoryDropdown = document.createElement("select");
        categoryDropdown.style.marginLeft = "10px";
        categoryFilterContainer.appendChild(categoryDropdown);

        const innerCategoryDropdown = document.createElement("select");
        innerCategoryDropdown.style.marginLeft = "10px";
        categoryFilterContainer.appendChild(innerCategoryDropdown);

        globalDialog.appendChild(categoryFilterContainer);

        // --- Add the new filter toggles to your filter container ---
        const filterContainer = document.createElement("div");
        filterContainer.style.marginBottom = "10px";

        // Hide Craftable toggle
        const hideCraftableCheckbox = document.createElement("input");
        hideCraftableCheckbox.type = "checkbox";
        hideCraftableCheckbox.id = "hideCraftable";
        const hideCraftableCheckboxLabel = document.createElement("label");
        hideCraftableCheckboxLabel.setAttribute("for", "hideCraftable");
        hideCraftableCheckboxLabel.textContent = "Hide Craftable Recipes";
        hideCraftableCheckboxLabel.style.marginRight = "20px";

        // Hide Uncraftable toggle
        const hideUncraftableCheckbox = document.createElement("input");
        hideUncraftableCheckbox.type = "checkbox";
        hideUncraftableCheckbox.id = "hideUncraftable";
        const hideUncraftableCheckboxLabel = document.createElement("label");
        hideUncraftableCheckboxLabel.setAttribute("for", "hideUncraftable");
        hideUncraftableCheckboxLabel.textContent = "Hide Uncraftable Recipes";
        hideUncraftableCheckboxLabel.style.marginRight = "20px";

        // Hide Untested Crafts toggle
        const hideUntestedCheckbox = document.createElement("input");
        hideUntestedCheckbox.type = "checkbox";
        hideUntestedCheckbox.id = "hideUntested";
        const hideUntestedCheckboxLabel = document.createElement("label");
        hideUntestedCheckboxLabel.setAttribute("for", "hideUntested");
        hideUntestedCheckboxLabel.textContent = "Hide Untested Crafts";
        hideUntestedCheckboxLabel.style.marginRight = "20px";

        // Hide Tested Crafts toggle
        const hideTestedCheckbox = document.createElement("input");
        hideTestedCheckbox.type = "checkbox";
        hideTestedCheckbox.id = "hideTested";
        const hideTestedCheckboxLabel = document.createElement("label");
        hideTestedCheckboxLabel.setAttribute("for", "hideTested");
        hideTestedCheckboxLabel.textContent = "Hide Tested Crafts";
        hideTestedCheckboxLabel.style.marginRight = "20px";

        // Append all toggles to filter container
        filterContainer.appendChild(hideCraftableCheckbox);
        filterContainer.appendChild(hideCraftableCheckboxLabel);
        filterContainer.appendChild(hideUncraftableCheckbox);
        filterContainer.appendChild(hideUncraftableCheckboxLabel);
        filterContainer.appendChild(hideTestedCheckbox);
        filterContainer.appendChild(hideTestedCheckboxLabel);
        filterContainer.appendChild(hideUntestedCheckbox);
        filterContainer.appendChild(hideUntestedCheckboxLabel);

        // Append filterContainer to your dialog or control panel container
        globalDialog.appendChild(filterContainer);

        // Container for the table with scrolling enabled, using flex
        const tableContainer = document.createElement("div");
        tableContainer.style.overflowY = "auto"; // Enable vertical scrolling
        tableContainer.style.flexGrow = "1"; // Allow container to grow
        tableContainer.style.border = "1px solid #444"; // Optional border

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["ID", "Uses", "Name", "Inventory", "Can Craft", "Craft"].forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.border = "1px solid #444";
            th.style.padding = "8px";
            th.style.textAlign = "left";
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");


        // Make displayFilteredRecipes async to use await
        const displayFilteredRecipes = async (recipesToDisplay, craftRecipes, inventory, allItems, selectedCategory, selectedInnerCategory) => {
            tbody.innerHTML = ""; // Clear existing rows

            for (const recipe of recipesToDisplay) {
                const row = document.createElement("tr");
                row.style.cursor = "pointer";

                const craftRecipe = craftRecipes.find(craftRecipe => craftRecipe.id == recipe.id);
                row.id = `recipe_${craftRecipe.recipe}`;

                if (!craftRecipe) {
                    console.error("Craft recipe not found for recipe ID:", recipe.id);
                    continue;
                }

                // Decode the recipe string to get the required items
                const requiredItems = getRequiredItems(craftRecipe.recipe, craftRecipe.result);

                // Check if the inventory has enough of the required items
                const hasEnoughItems = hasSufficientInventory(inventory, requiredItems.filter(item => item.id)); //filter out the result id

                // Highlight the row if enough items are available
                if (hasEnoughItems) {
                    row.style.fontWeight = "bold";
                    row.style.fontSize = "15px";
                }

                // Check if recipe should be displayed based on filter toggles
                const isCraftable = hasEnoughItems;
                const isUncraftable = !hasEnoughItems;

                if ((hideCraftableCheckbox.checked && isCraftable) || (hideUncraftableCheckbox.checked && isUncraftable)) {
                    continue; // Skip rendering the row if the filter doesn't match
                }

                // Add a column for the Maximum Crafts
                const craftCountCell = document.createElement("td");
                craftCountCell.style.border = "1px solid #444";
                craftCountCell.style.padding = "8px";
                craftCountCell.classList.add("craftQuantityColumn");

                // Add a column for the Craft Button
                const craftButtonCell = document.createElement("td");
                craftButtonCell.style.border = "1px solid #444";
                craftButtonCell.style.padding = "8px";
                craftButtonCell.classList.add("craftButtonColumn");
                const craftButton = document.createElement("button");
                craftButtonCell.appendChild(craftButton);

                const resultItem = allItems.find(allItem => allItem.id == craftRecipe.result);

                // Filter based on HideTestedCheckbox and HideUntestedCheckbox
                const craftButtonText = await addCraftButtonToTable(craftRecipe.recipe, inventory, craftCountCell, craftButton, resultItem.name, resultItem.image);
                if (hideTestedCheckbox.checked && !craftButtonText.includes(`Test Craft`)) {
                    continue;
                }
                if (hideUntestedCheckbox.checked && craftButtonText.includes(`Test Craft`)) {
                    continue;
                }

                // Collect categories from the required items
                const itemCategories = requiredItems
                .map(requiredItem => {
                    const item = allItems.find(allItem => allItem.id == requiredItem.id || allItem.id === requiredItem.resultid);
                    return item ? item.category : null;
                })
                .filter(category => category); // Remove null values
                const uniqueCategories = [...new Set(itemCategories)]; // Deduplicate categories

                // Collect categories from the required items
                const itemInnerCategories = requiredItems
                .map(requiredItem => {
                    const item = allItems.find(allItem => allItem.id == requiredItem.id || allItem.id === requiredItem.resultid);
                    return item ? item.innerCategory : null;
                })
                .filter(category => category); // Remove null values
                const uniqueInnerCategories = [...new Set(itemInnerCategories)]; // Deduplicate inner categories

                // Filter recipes based on selected category
                if (selectedCategory && !uniqueCategories.includes(selectedCategory)) {
                    continue; // Skip rendering the row if no matching category is found
                }

                // Filter recipes based on selected category
                if (selectedInnerCategory && !uniqueInnerCategories.includes(selectedInnerCategory)) {
                    continue; // Skip rendering the row if no matching category is found
                }

                // Display recipe information in the table row
                ["id", "uses", "name", "inventory"].forEach(key => {
                    const cell = document.createElement("td");
                    if (key === "name") {
                        const nameContainer = document.createElement("div");
                        nameContainer.style.display = "flex";
                        nameContainer.style.alignItems = "center";

                        // Fetch item image from the result
                        if (resultItem && resultItem.image) {
                            const img = document.createElement("img");
                            img.src = resultItem.image;
                            img.alt = resultItem.name;
                            img.style.width = "30px";
                            img.style.height = "30px";
                            img.style.marginRight = "10px";
                            nameContainer.appendChild(img);
                        }

                        const nameText = document.createElement("span");
                        nameText.textContent = recipe[key];
                        nameContainer.appendChild(nameText);

                        cell.appendChild(nameContainer);
                    }
                    else if (key === "inventory"){
                        const resultItem = requiredItems.find(item => item.amount === 0);
                        const resultItemOnInventory = inventory.find(item => Number(item.itemid) === Number(resultItem.id))
                        cell.textContent = resultItemOnInventory ? resultItemOnInventory.amount : 0;
                    }else {
                        cell.textContent = recipe[key];
                    }

                    cell.style.border = "1px solid #444";
                    cell.style.padding = "8px";
                    row.appendChild(cell);
                });
                row.appendChild(craftCountCell);
                row.appendChild(craftButtonCell);

                // Fetch crafting recipe on click
                row.addEventListener("click", () => {
                    getCraftingRecipe(recipe.id);
                });
                tbody.appendChild(row);
            }
        };

        const inventory = await fetchInventory();

        // Fetch all items data to cache immediately
        const allItemIds = await getAllItemIds(allCraftRecipes, inventory);
        const cleanedItemIds = [...allItemIds].map(id => String(Number(id)));
        const allItems = await fetchItemDetails(cleanedItemIds);

        // Get all unique categories for the dropdown
        const categories = Array.from(new Set(allItems.map(item => item.category))).sort();

        // Get all unique inner categories for the dropdown
        const innerCategories = Array.from(new Set(allItems.map(item => item.innerCategory))).sort();

        const emptyCategoryOption = document.createElement("option");
        emptyCategoryOption.value = ""; // Empty value for no filtering
        emptyCategoryOption.textContent = "All Categories"; // Label for the empty option
        categoryDropdown.appendChild(emptyCategoryOption);
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryDropdown.appendChild(option);
        });
        // Set the default option to the empty value
        categoryDropdown.value = emptyCategoryOption.value;

        const emptyInnerCategoryOption = document.createElement("option");
        emptyInnerCategoryOption.value = ""; // Empty value for no filtering
        emptyInnerCategoryOption.textContent = "All Inner Categories"; // Label for the empty option
        innerCategoryDropdown.appendChild(emptyInnerCategoryOption);
        innerCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            innerCategoryDropdown.appendChild(option);
        });
        // Set the default option to the empty value
        innerCategoryDropdown.value = emptyInnerCategoryOption.value;

        // Initialize the table with all recipes
        displayFilteredRecipes(recipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);

        // Attach event listener to search bar
        searchBar.addEventListener("input", (event) => {
            const searchTerm = event.target.value;
            const filteredRecipes = recipes.filter(recipe =>
                                                   recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                  );
            displayFilteredRecipes(filteredRecipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);
        });
        hideCraftableCheckbox.addEventListener("change", () => {
            displayFilteredRecipes(recipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);
        });
        hideUncraftableCheckbox.addEventListener("change", () => {
            displayFilteredRecipes(recipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);
        });
        hideTestedCheckbox.addEventListener("change", () => {
            displayFilteredRecipes(recipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);
        });
        hideUntestedCheckbox.addEventListener("change", () => {
            displayFilteredRecipes(recipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);
        });
        categoryDropdown.addEventListener("change", () => {
            displayFilteredRecipes(recipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);
        });
        innerCategoryDropdown.addEventListener("change", () => {
            displayFilteredRecipes(recipes, allCraftRecipes, inventory, allItems, categoryDropdown.value, innerCategoryDropdown.value);
        });
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        globalDialog.appendChild(tableContainer);
        document.body.appendChild(globalDialog);
        debugConsole(`[GGn Control Panel] displayCraftedRecipes complete.`);
    }

    /**
     * Function to calculate how many times a recipe can be performed based on inventory.
     * @param {Array} recipe - The crafting recipe with required item IDs and amounts.
     * @param {Array} inventory - The player's inventory containing item amounts.
     * @returns {number} - The maximum number of times the recipe can be crafted.
    **/
    async function calculateCraftingQuantity(recipe, inventory) {
        // Get required items from the recipe
        const requiredItems = await getRequiredItems(recipe, null); // Only interested in crafting parts
        let canCraftTimes = Infinity; // Start with Infinity as a baseline for comparison
        for (const requiredItem of requiredItems) {
            // Find the corresponding inventory item
            const inventoryItem = inventory.find(item => Number(item.item.id) === Number(requiredItem.id));

            if (inventoryItem) {
                // Calculate how many times this item allows the recipe to be crafted
                const maxCraftsWithItem = Math.floor(inventoryItem.amount / requiredItem.amount);
                canCraftTimes = Math.min(canCraftTimes, maxCraftsWithItem);
            } else {
                // If an item is missing, crafting is not possible
                canCraftTimes = 0;
                break;
            }
        }
        debugConsole(`[GGn Control Panel] calculateCraftingQuantity returns ${canCraftTimes}`);
        return canCraftTimes;
    }


    /**
     * Function to determine if inventory has sufficient items.
     * @param {Array} inventory - The player's inventory containing item IDs and amounts.
     * @param {Array} requiredItems - The required items with id and amount.
     * @returns {boolean} - Whether the inventory has sufficient items.
    **/
    function hasSufficientInventory(inventory, requiredItems) {
        for (const requiredItem of requiredItems) {
            const inventoryItem = inventory.find(item => Number(item.itemid) === requiredItem.id);
            if (!inventoryItem || parseInt(inventoryItem.amount, 10) < requiredItem.amount) {
                debugConsole(`[GGn Control Panel] hasSufficientInventory returns false.`);
                return false;
            }
        }
        debugConsole(`[GGn Control Panel] hasSufficientInventory returns true.`);
        return true;
    }

    // Function to add Test Craft button to table and handle actions
    async function addCraftButtonToTable(recipe, inventory, quantityCell, craftButton, resultItemName, resultItemImage) {
        const craftingResult = await fetchCraftingResult(recipe, true, false);
        const canCraftTimes = await calculateCraftingQuantity(recipe, inventory);
        debugConsole(`[GGn Control Panel] addCraftButtonToTable(recipe=${recipe}, inventory): CraftTimes: ${canCraftTimes} craftingResult: ${JSON.stringify(craftingResult)}`);

        const tableRow = document.getElementById(`recipe_${recipe}`);
        quantityCell.textContent = canCraftTimes;
        craftButton.textContent = `Test Craft`;

        if (craftingResult) {
            craftButton.textContent = `Craft (${craftingResult.Name})`;
            craftButton.disabled = canCraftTimes <= 0; // Disable button if cannot craft
            if (craftButton.disabled) {
                craftButton.style.opacity = "0.5";
                craftButton.style.cursor = "not-allowed";
            }

            craftButton.onclick = async (event) => {
                event.stopPropagation(); // Prevents the event from bubbling up to the row
                const actionResult = await fetchCraftingResult(recipe, false, true); // Real Craft with real consequences
                if (actionResult) {
                    showSnackbar(`${resultItemName} has been successfully crafted and added to your inventory.`, getImageUrl(resultItemImage));
                    localStorage.removeItem("inventoryData");
                    localStorage.removeItem("inventoryCacheExpiry");
                    inventory = await fetchInventory();
                }
                debugConsole("[GGn Control Panel] Inventory Refreshed. Successfully crafted:", resultItemName);
                await getCraftedRecipes();
            };

            debugConsole(`[GGn Control Panel] addCraftButtonToTable added a [Test Craft] Button.`);
        } else {
            craftButton.onclick = async (event) => {
                event.stopPropagation(); // Prevents the event from bubbling up to the row
                const actionResult = await fetchCraftingResult(recipe, true, true); // Mock Craft to test consequences
                if (actionResult) {
                    debugConsole("[GGn Control Panel] Successfully crafted (test):", actionResult.name);
                    showSnackbar(`Test Craft for recipe ${recipe} was successful.`);
                    await addCraftButtonToTable(recipe, inventory, quantityCell, craftButton, resultItemName, resultItemImage);

                }
            };
            debugConsole(`[GGn Control Panel] addCraftButtonToTable added a [Craft] Button.`);
        }
        return craftButton.textContent;
    }

    /**
     * Function to get required items for a recipe.
     * @param {string} recipeString - The recipe string containing item IDs.
     * @param {string|null} recipeResult - The recipe result ID to include (optional).
     * @returns {Array} - An array of objects with id and amount.
    **/
    function getRequiredItems(recipeString, recipeResult) {
        if (typeof recipeString !== "string") {
            console.error("Invalid recipe string:", recipeString);
            return [];
        }

        const recipeParts = recipeString.match(/.{1,5}/g);

        if (!recipeParts || recipeParts.length !== 9) {
            console.error("Recipe string format is invalid.");
            return [];
        }

        // Filter and count occurrences of valid parts
        const itemCounts = recipeParts
        .filter(part => part && part !== "EEEEE" && part !== "00000")
        .map(part => parseInt(part, 10))
        .filter(Number.isInteger)
        .reduce((counts, id) => {
            counts[id] = (counts[id] || 0) + 1;
            return counts;
        }, {});

        // Convert the counts object into an array of objects with id and amount
        const requiredItems = Object.entries(itemCounts).map(([id, amount]) => ({
            id: parseInt(id, 10),
            amount
        }));

        // Optionally include the recipe result if valid
        if (recipeResult) {
            const resultInt = parseInt(recipeResult, 10);
            if (Number.isInteger(resultInt)) {
                requiredItems.push({ resultid: resultInt, amount: 0 });
            }
        }
        debugConsole(`[GGn Control Panel] getRequiredItems returns `,requiredItems);
        return requiredItems;
    }

    function extractCategoryFromDescription(description) {
        if (!description) return "Unknown"; // Handle missing descriptions
        const match = description.match(/Category:\s*(.*?)(?:<br|$)/);
        return match ? match[1].trim() : "Unknown"; // Trim whitespace for clean output
    }

    // Helper function to determine stock status
    function determineStockStatus(infStock, stock) {
        if (infStock) {
            return "Shop Item";
        } else if (stock > 0) {
            return "Rare";
        } else {
            return "None";
        }
    }

    function displayInboxMessages(messages) {
        globalDialog = createDialog("Inbox");
        const tableContainer = document.createElement("div");
        tableContainer.style.flexGrow = "1"; // Allow container to grow
        tableContainer.style.overflowY = "auto"; // Enable vertical scrolling
        tableContainer.style.border = "1px solid #444"; // Optional border

        const searchField = createSearchFilter("Search by subject or conversation ID...");
        const searchParticipantsField = createSearchFilter("Search by participant username...");
        globalDialog.appendChild(searchField);
        globalDialog.appendChild(searchParticipantsField);

        const hideStickyToggleLabel = document.createElement("label");
        hideStickyToggleLabel.style.display = "block";
        hideStickyToggleLabel.style.marginBottom = "10px";

        const hideStickyToggle = document.createElement("input");
        hideStickyToggle.type = "checkbox";
        hideStickyToggle.checked = false;
        hideStickyToggle.addEventListener("change", function() {
            // Re-render the inbox table with the updated filter
            const filteredMessages = applyFilters(messages, hideStickyToggle.checked, searchField.value, searchParticipantsField.value);
            displayMessages(filteredMessages);
        });

        hideStickyToggleLabel.appendChild(hideStickyToggle);
        hideStickyToggleLabel.appendChild(document.createTextNode("Hide Stickied Messages"));
        globalDialog.appendChild(hideStickyToggleLabel);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "20px";
        table.style.backgroundColor = "#222";
        table.style.color = "#fff";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        ["ConvId", "Subject", "Participants"].forEach((headerText) => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.border = "1px solid #444";
            th.style.padding = "8px";
            th.style.textAlign = "left";
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        // Function to display messages in the table
        const displayMessages = (filteredMessages) => {
            tbody.innerHTML = "";
            filteredMessages.forEach((msg) => {
                const row = document.createElement("tr");
                row.style.cursor = "pointer";

                if (msg.unread === true) {
                    row.style.color = "#000";
                    row.style.backgroundColor = "#6f9";
                    row.style.fontWeight = "bold";
                }

                const convIdCell = document.createElement("td");
                convIdCell.style.textAlign = "left";
                convIdCell.textContent = msg.convId;
                convIdCell.style.border = "1px solid #444";
                convIdCell.style.padding = "8px";
                row.appendChild(convIdCell);

                const subjectCell = document.createElement("td");
                subjectCell.style.textAlign = "left";

                if (msg.sticky) {
                    const pinEmoji = "📌 ";
                    subjectCell.textContent = pinEmoji + msg.subject;
                    subjectCell.style.fontWeight = "bold";
                } else {
                    subjectCell.textContent = msg.subject;
                }

                subjectCell.style.border = "1px solid #444";
                subjectCell.style.padding = "8px";
                row.appendChild(subjectCell);

                const participantsCell = document.createElement("td");
                participantsCell.style.textAlign = "left";
                participantsCell.textContent = msg.participants.map(participant => participant.username).join(", ");
                participantsCell.style.border = "1px solid #444";
                participantsCell.style.padding = "8px";
                row.appendChild(participantsCell);

                row.addEventListener("click", () => {
                    fetchConversation(msg.convId);
                });

                tbody.appendChild(row);
            });
        };

        // Function to apply both sticky and participant filters
        const applyFilters = (messages, hideSticky, subjectSearch, participantSearch) => {
            return messages.filter((msg) => {
                const matchesStickyFilter = !hideSticky || !msg.sticky;
                const matchesSubjectSearch = msg.convId.toString().includes(subjectSearch.toLowerCase()) ||
                      msg.subject.toLowerCase().includes(subjectSearch.toLowerCase());
                const matchesParticipantSearch = msg.participants.some(
                    (participant) => participant.username.toLowerCase().includes(participantSearch.toLowerCase())
                );

                return matchesStickyFilter && matchesSubjectSearch && matchesParticipantSearch;
            });
        };

        // Initial rendering of all messages
        const filteredMessages = applyFilters(messages, hideStickyToggle.checked, searchField.value, searchParticipantsField.value);
        displayMessages(filteredMessages);

        // Add event listener for subject search input
        searchField.addEventListener("input", (event) => {
            const filteredMessages = applyFilters(messages, hideStickyToggle.checked, event.target.value, searchParticipantsField.value);
            displayMessages(filteredMessages);
        });

        // Add event listener for participant search input
        searchParticipantsField.addEventListener("input", (event) => {
            const filteredMessages = applyFilters(messages, hideStickyToggle.checked, searchField.value, event.target.value);
            displayMessages(filteredMessages);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);
        // container.appendChild(tableContainer);
        globalDialog.appendChild(tableContainer);
        document.body.appendChild(globalDialog);
        debugConsole(`[GGn Control Panel] displayInboxMessages complete.`);
    }

    // Button that downloads all links inside a table.
    function createDownloadAllButton(table) {
        const downloadAllButton = document.createElement("button");
        downloadAllButton.id = "download-all";
        downloadAllButton.textContent = "Download All";
        downloadAllButton.classList.add("custom-button");
        downloadAllButton.style.marginTop = "10px";
        downloadAllButton.addEventListener("click", () => {
            // Query all links whose text is "Download",
            const downloadLinks = table.querySelectorAll('a[title="Download"]');
            console.log(`Found ${downloadLinks.length} download links.`);
            downloadLinks.forEach(link => {
                link.click();
            });
            console.log(`Attempted to open ${downloadLinks.length} download tabs.`);
        });
        return downloadAllButton;
    }

    function createStatusDropdown(labelText, defaultValue) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.marginRight = "10px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.fontSize = "12px";
        label.style.color = "#fff";
        label.style.marginRight = "5px";
        container.appendChild(label);

        const dropdown = document.createElement("select");
        dropdown.style.padding = "4px 8px";
        dropdown.style.margin = "5px 0 0 10px";
        dropdown.style.fontSize = "12px";
        dropdown.style.borderRadius = "4px";
        dropdown.style.backgroundColor = "#333";
        dropdown.style.color = "#fff";

        // Default option
        const defaultOption = document.createElement("option");
        defaultOption.value = defaultValue;
        defaultOption.textContent = defaultValue;
        dropdown.appendChild(defaultOption);

        // Add status options
        const options = [
            { value: "Seeding", text: "Seeding" },
            { value: "Leeching", text: "Leeching" },
            { value: "Download", text: "Download" }
        ];
        options.forEach(optData => {
            const option = document.createElement("option");
            option.value = optData.value;
            option.textContent = optData.text;
            dropdown.appendChild(option);
        });
        container.appendChild(dropdown);
        return { container, dropdown };
    }


    function createMinimumGPHDropdown(labelText, defaultValue) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.marginRight = "10px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.fontSize = "12px";
        label.style.color = "#fff";
        label.style.marginRight = "5px";
        container.appendChild(label);

        const dropdown = document.createElement("select");
        dropdown.style.padding = "4px 8px"; // smaller padding
        dropdown.style.margin = "5px 0 0 10px"; // small top margin and a left margin to separate from the button
        dropdown.style.fontSize = "12px"; // smaller text
        dropdown.style.borderRadius = "4px";
        dropdown.style.backgroundColor = "#333";
        dropdown.style.color = "#fff";

        // Option for no minimum threshold
        const defaultOption = document.createElement("option");
        defaultOption.value = defaultValue;
        defaultOption.textContent = defaultValue;
        dropdown.appendChild(defaultOption);

        // Populate the dropdown with options
        const options = [
            { value: "0.01", text: "0.01" },
            { value: "0.03", text: "0.03" },
            { value: "0.05", text: "0.05" },
            { value: "0.06", text: "0.06" },
            { value: "0.07", text: "0.07" },
            { value: "0.08", text: "0.08" },
            { value: "0.09", text: "0.09" },
            { value: "0.1", text: "0.1" },
            { value: "0.15", text: "0.15" },
            { value: "0.2", text: "0.2" }
        ];
        options.forEach(optData => {
            const option = document.createElement("option");
            option.value = optData.value;
            option.textContent = optData.text;
            dropdown.appendChild(option);
        });
        container.appendChild(dropdown);
        return { container, dropdown };
    }

    // Helper: Create a dropdown for seeders filter with a label.
    function createSeedersDropdown(labelText, defaultValue) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.marginRight = "10px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.fontSize = "12px";
        label.style.color = "#fff";
        label.style.marginRight = "5px";
        container.appendChild(label);

        const dropdown = document.createElement("select");
        dropdown.style.padding = "4px 8px";
        dropdown.style.fontSize = "12px";
        dropdown.style.borderRadius = "4px";
        dropdown.style.backgroundColor = "#333";
        dropdown.style.color = "#fff";

        // Option for no minimum threshold
        const defaultOption = document.createElement("option");
        defaultOption.value = defaultValue;
        defaultOption.textContent = defaultValue;
        dropdown.appendChild(defaultOption);

        // Populate options 1-50.
        for (let i = 1; i <= 50; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            dropdown.appendChild(option);
        }
        container.appendChild(dropdown);
        return { container, dropdown };
    }

    // Helper: Create a date picker for filtering with a label.
    function createDatePicker(labelText, defaultValue) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.marginTop = "10px"; // Adds spacing between rows
        container.style.marginRight = "10px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.fontSize = "12px";
        label.style.color = "#fff";
        label.style.marginRight = "5px";
        container.appendChild(label);

        const datePicker = document.createElement("input");
        datePicker.type = "date"; // Set as a date input
        datePicker.style.padding = "4px 8px";
        datePicker.style.fontSize = "12px";
        datePicker.style.borderRadius = "4px";
        datePicker.style.backgroundColor = "#333";
        datePicker.style.color = "#fff";
        datePicker.style.border = "1px solid #444";

        if (defaultValue) {
            datePicker.value = defaultValue; // Set the default value, if provided
        }

        container.appendChild(datePicker);
        return { container, datePicker };
    }

    // Helper: Create the div container with a pagination selector
    async function createPageIndicatorContainer() {
        // Create the page indicator container.
        const pageIndicatorContainer = document.createElement("div");
        pageIndicatorContainer.style.textAlign = "center";
        pageIndicatorContainer.style.margin = "15px 0";
        pageIndicatorContainer.style.fontSize = "14px";
        pageIndicatorContainer.style.padding = "10px";
        pageIndicatorContainer.style.width = "auto";

        // Create the dropdown for selecting pages.
        const pageDropdown = document.createElement("select");
        pageDropdown.style.padding = "5px";
        pageDropdown.style.fontSize = "14px";
        pageDropdown.style.margin = "0 10px";
        pageDropdown.style.width = "80px"; // Increased width to fit larger numbers.
        pageDropdown.style.minWidth = "80px"; // Ensures the dropdown won't shrink too much.
        pageDropdown.style.height = "30px"; // Explicitly set the height for better visibility.
        pageDropdown.style.border = "1px solid #ccc";
        pageDropdown.style.borderRadius = "3px";

        // Populate the dropdown with values from 1 to 1000.
        for (let i = 0; i <= 1000; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            if (i === currentTorrentPage) {
                option.selected = true;
            }
            pageDropdown.appendChild(option);
        }

        // Add event listener for dropdown changes.
        pageDropdown.addEventListener("change", async () => {
            currentTorrentPage = parseInt(pageDropdown.value, 10);
            await setCacheData(currentTorrentPage, "currentTorrentPage");
            showSnackbar(`Pages Fetched updated to: ${currentTorrentPage}`);
        });

        // Assemble and append the dropdown to the container.
        pageIndicatorContainer.textContent = "Pages Fetched: ";
        pageIndicatorContainer.appendChild(pageDropdown);
        return pageIndicatorContainer;
    }

    async function displayTorrentsData() {
        globalDialog = createDialog("Torrent Search Results");

        // Integrated description with swap search button.
        const descriptionParagraph = document.createElement("p");
        descriptionParagraph.style.textAlign = "center";
        descriptionParagraph.style.fontSize = "14px";
        globalDialog.appendChild(descriptionParagraph);

        const swapSearchButton = document.createElement("button");
        swapSearchButton.classList.add("custom-button");
        swapSearchButton.style.marginLeft = "10px";
        swapSearchButton.style.padding = "2px 5px";
        swapSearchButton.style.fontSize = "inherit";
        swapSearchButton.style.display = "inline";
        swapSearchButton.style.verticalAlign = "middle";

        //Get the last used currentSortBy
        currentSortBy = localStorage.getItem('currentSortBy');

        // Function to update description and button text.
        function updateDescriptionAndButton() {
            console.log(`UpdateDescriptionAndButton called with currentSortBy=${currentSortBy}`);
            descriptionParagraph.innerHTML = "";
            if (currentSortBy === "seeders") {
                descriptionParagraph.appendChild(document.createTextNode("Searching all torrents ordered ascending by # of Seeders."));
                swapSearchButton.textContent = "Swap Search to Search by Age";
            } else {
                descriptionParagraph.appendChild(document.createTextNode("Searching all torrents ordered by Age."));
                swapSearchButton.textContent = "Swap Search to Search by Seeders";
            }
            descriptionParagraph.appendChild(swapSearchButton);
        }
        updateDescriptionAndButton();

        swapSearchButton.addEventListener("click", async () => {
            currentSortBy = (currentSortBy === "seeders") ? "age" : "seeders";
            localStorage.setItem('currentSortBy', currentSortBy);
            updateDescriptionAndButton();
        });

        // The page indicator with a dropdown for selecting Pages Fetched.
        let pageIndicatorContainer = await createPageIndicatorContainer();
        globalDialog.appendChild(pageIndicatorContainer);

        // Create search field for filtering (by Name).
        const searchField = createSearchFilter("Filter results by Name...");
        globalDialog.appendChild(searchField);

        // Count display (distinct groups and torrents).
        const countDisplay = document.createElement("div");
        countDisplay.style.marginBottom = "10px";
        countDisplay.style.fontSize = "14px";
        globalDialog.appendChild(countDisplay);

        // Container for the table.
        const tableContainer = document.createElement("div");
        tableContainer.style.flexGrow = "1";
        tableContainer.style.overflowY = "auto";
        tableContainer.style.border = "1px solid #444";
        tableContainer.style.marginBottom = "10px";
        globalDialog.appendChild(tableContainer);

        // Create the table and header.
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.backgroundColor = "#222";
        table.style.color = "#fff";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["DateUploaded", "GroupId", "TorrentId", "Name", "Status", "Seeders", "SizeGigabytes", "GPH/GB"].forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.border = "1px solid #444";
            th.style.padding = "8px";
            th.style.textAlign = headerText === "Status" ? "center" : "left";
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        addSortingToTable(table); // Makes every column in the table sorteable

        // The container for filters, allowing for two rows of filters, one for dropdowns, one for datepickers
        const filtersContainer = document.createElement("div"); // Container for all filters.
        filtersContainer.style.display = "flex";
        filtersContainer.style.flexDirection = "column"; // Ensures new filters are in a separate row.

        // Create a container for dropdown filters
        const dropdownFiltersContainer = document.createElement("div");
        dropdownFiltersContainer.style.display = "flex";
        dropdownFiltersContainer.style.justifyContent = "center";
        dropdownFiltersContainer.style.marginTop = "10px";

        // Create a container for datepicker filters
        const datePickerFiltersContainer = document.createElement("div");
        datePickerFiltersContainer.style.display = "flex";
        datePickerFiltersContainer.style.justifyContent = "center";
        datePickerFiltersContainer.style.marginTop = "10px";

        // Add the first row of filters
        const minGPHObj = createMinimumGPHDropdown("Select the minimum GPH/GB you tolerate:", "No minimum");
        const minSeedersObj = createSeedersDropdown("Minimum Seeders:", "No minimum");
        const maxSeedersObj = createSeedersDropdown("Maximum Seeders:", "No maximum");
        const statusObj = createStatusDropdown("Status: ", "");

        dropdownFiltersContainer.appendChild(minGPHObj.container);
        dropdownFiltersContainer.appendChild(minSeedersObj.container);
        dropdownFiltersContainer.appendChild(maxSeedersObj.container);
        dropdownFiltersContainer.appendChild(statusObj.container);

        // Add "Date After" and "Date Before" filters.
        const dateAfterObj = createDatePicker("Date After: ", "");
        const dateBeforeObj = createDatePicker("Date Before: ", "");

        datePickerFiltersContainer.appendChild(dateAfterObj.container);
        datePickerFiltersContainer.appendChild(dateBeforeObj.container);

        // Appends the pickers in seperate rows
        filtersContainer.appendChild(dropdownFiltersContainer);
        filtersContainer.appendChild(datePickerFiltersContainer);
        globalDialog.appendChild(filtersContainer);

        // Update count display.
        function updateCountDisplay() {
            const groupIds = new Set(bestTorrents.map(t => t.GroupId));
            const torrentIds = new Set(bestTorrents.map(t => t.TorrentId));
            countDisplay.textContent = `Total Groups: ${groupIds.size} | Total Torrents: ${torrentIds.size}`;
        }

        // Filter torrent results by Name, minimum GPH/GB, minimum seeders, and maximum seeders.
        function applyLocalFilter(results, searchTerm, minGPH, minSeeders, maxSeeders, status, dateAfter, dateBefore) {
            debugConsole(`[GGn Control Panel] Applying Local Filters to TorrentDisplay. MinGPH:${minGPH} MinSeeders: ${minSeeders} MaxSeeders: ${maxSeeders} Status: ${status} DateAfter: ${dateAfter} DateBefore: ${dateBefore}`);
            searchTerm = searchTerm.toLowerCase();
            let filteredResult = results.filter(t => t.Name && t.Name.toLowerCase().includes(searchTerm));
            if(minGPH){
                filteredResult = filteredResult.filter(t => Number(t.GPHperGigabyte) > Number(minGPH));
            }
            if(minSeeders){
                filteredResult = filteredResult.filter(t => Number(t.Seeders) >= Number(minSeeders));
            }
            if(maxSeeders){
                filteredResult = filteredResult.filter(t => Number(t.Seeders) <= Number(maxSeeders));
            }
            if(status){
                filteredResult = filteredResult.filter(t => t.Status.toLowerCase() === status.toLowerCase());
            }
            if (dateAfter) {
                filteredResult = filteredResult.filter(t => {
                    const uploadedDate = new Date(t.DateUploaded); // Convert to Date object
                    const afterDate = new Date(dateAfter);
                    return uploadedDate >= afterDate; // Check if uploaded date is after or equal to dateAfter
                });
            }
            if (dateBefore) {
                filteredResult = filteredResult.filter(t => {
                    const uploadedDate = new Date(t.DateUploaded); // Convert to Date object
                    const beforeDate = new Date(dateBefore);
                    return uploadedDate <= beforeDate; // Check if uploaded date is before or equal to dateBefore
                });
            }
            return filteredResult;
        }

        // Render torrent rows.
        async function renderTorrentRows(torrentArray) {
            tbody.innerHTML = "";
            torrentArray.sort((a, b) => b.GPHperGigabyte - a.GPHperGigabyte);
            torrentArray.forEach(t => {
                const row = document.createElement("tr");
                ["DateUploaded", "GroupId", "TorrentId", "Name", "Status", "Seeders", "SizeGigabytes", "GPHperGigabyte"].forEach(key => {
                    const cell = document.createElement("td");
                    cell.style.border = "1px solid #444";
                    cell.style.padding = "8px";
                    if (key === "Status") {
                        cell.style.textAlign = "center";
                        if(t.Status === "Download" && t.DownloadUrl) {
                            const downloadButton = document.createElement("a");
                            downloadButton.href = t.DownloadUrl;
                            downloadButton.title = "Download";
                            downloadButton.textContent = "Download";
                            downloadButton.target = "_blank";
                            downloadButton.style.display = "block";
                            cell.appendChild(downloadButton);
                        } else if (t.Status === "Leeching"){
                            cell.style.color = "red";
                            cell.textContent = t.Status;
                        } else {
                            cell.style.color = "green";
                            cell.textContent = t.Status;
                        }
                    } else {
                        cell.textContent = t[key];
                    }
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            });
            updateCountDisplay();
        }

        // Update displayed torrents based on filter inputs
        async function updateFilteredDisplay() {
            // Get current filter values
            const minGPH = Number(minGPHObj.dropdown.value) || null;
            const minSeeders = Number(minSeedersObj.dropdown.value) || null;
            const maxSeeders = Number(maxSeedersObj.dropdown.value) || null;
            const status = statusObj.dropdown.value || null;
            const dateAfter = dateAfterObj.datePicker.value || null;
            const dateBefore = dateBeforeObj.datePicker.value || null;

            // Apply filters
            const filtered = applyLocalFilter(bestTorrents, searchField.value.trim(), minGPH, minSeeders, maxSeeders, status, dateAfter, dateBefore);

            // Save current filter values to localStorage
            localStorage.setItem('minGPHFilter', minGPH);
            localStorage.setItem('minSeedersFilter', minSeeders);
            localStorage.setItem('maxSeedersFilter', maxSeeders);
            localStorage.setItem('statusFilter', status);
            localStorage.setItem('dateAfterFilter', dateAfter);
            localStorage.setItem('dateBeforeFilter', dateBefore);

            // Render filtered results
            await renderTorrentRows(filtered);
        }

        // Listen for changes to filtering controls.
        searchField.addEventListener("input", updateFilteredDisplay);
        minGPHObj.dropdown.addEventListener("change", updateFilteredDisplay);
        minSeedersObj.dropdown.addEventListener("change", updateFilteredDisplay);
        maxSeedersObj.dropdown.addEventListener("change", updateFilteredDisplay);
        statusObj.dropdown.addEventListener("change", updateFilteredDisplay);
        dateAfterObj.datePicker.addEventListener("change", updateFilteredDisplay);
        dateBeforeObj.datePicker.addEventListener("change", updateFilteredDisplay);

        // Update filters with their cached result
        async function updateFiltersWithCache() {
            // Retrieve cached values from localStorage
            const cachedMinGPH = localStorage.getItem('minGPHFilter');
            const cachedMinSeeders = localStorage.getItem('minSeedersFilter');
            const cachedMaxSeeders = localStorage.getItem('maxSeedersFilter');
            const cachedStatus = localStorage.getItem('statusFilter');
            const cachedDateAfter = localStorage.getItem('dateAfterFilter');
            const cachedDateBefore = localStorage.getItem('dateBeforeFilter');

            // Update filter dropdowns or date pickers with cached values
            if (cachedMinGPH) minGPHObj.dropdown.value = cachedMinGPH;
            if (cachedMinSeeders) minSeedersObj.dropdown.value = cachedMinSeeders;
            if (cachedMaxSeeders) maxSeedersObj.dropdown.value = cachedMaxSeeders;
            if (cachedStatus) statusObj.dropdown.value = cachedStatus;
            if (cachedDateAfter) dateAfterObj.datePicker.value = cachedDateAfter;
            if (cachedDateBefore) dateBeforeObj.datePicker.value = cachedDateBefore;
        }

        // Function to fetch torrents and update the global result set.
        async function fetchAndRenderTorrents(append = false, sortBy = currentSortBy) {
            showLoadingScreen();
            try {
                if(append){
                    const result = await fetchTorrents(currentTorrentPage, sortBy);
                    if (result) {
                        const newResults = await fetchTorrentsAndExtractGold(result);
                        const uniqueNewResults = newResults.filter(newItem =>
                                                                   !bestTorrents.some(existing =>
                                                                                      existing.GroupId === newItem.GroupId && existing.TorrentId === newItem.TorrentId
                                                                                     )
                                                                  );
                        bestTorrents.push(...uniqueNewResults);
                        await updateFilteredDisplay();
                    } else {
                        showSnackbar("No torrent data fetched.");
                    }
                }
            } catch (error) {
                console.error("Error fetching torrents:", error);
            } finally {
                hideLoadingScreen();
            }
        }

        // Initially load cached torrents then fetch fresh data.
        bestTorrents = await loadAllCachedTorrentsInfo();
        await renderTorrentRows(bestTorrents);
        await fetchAndRenderTorrents(false, currentSortBy);

        // Call this function during initialization to load cached values into filters and apply those filters on the rendered torrents
        await updateFiltersWithCache();
        await updateFilteredDisplay();

        // "Fetch More" button.
        const fetchMoreButton = document.createElement("button");
        fetchMoreButton.textContent = "Fetch More";
        fetchMoreButton.classList.add("custom-button");
        fetchMoreButton.style.width = "100%";
        fetchMoreButton.style.padding = "15px 10px";
        fetchMoreButton.style.border = "none";
        fetchMoreButton.style.borderRadius = "10px";
        fetchMoreButton.style.cursor = "pointer";
        fetchMoreButton.style.backgroundColor = "#007BFF";
        fetchMoreButton.style.color = "#fff";
        fetchMoreButton.style.fontSize = "16px";
        fetchMoreButton.style.marginTop = "10px";
        fetchMoreButton.addEventListener("click", async () => {
            currentTorrentPage += 1;
            await setCacheData(currentTorrentPage, "currentTorrentPage");
            pageIndicatorContainer.querySelector("select").value = currentTorrentPage;
            await fetchAndRenderTorrents(true, currentSortBy);
        });
        globalDialog.appendChild(fetchMoreButton);

        // "Download All" button: create a button that finds all download links in the table and opens them.
        function createDownloadAllButton(table) {
            const downloadAllButton = document.createElement("button");
            downloadAllButton.id = "download-all";
            downloadAllButton.textContent = "Download All";
            downloadAllButton.classList.add("custom-button");
            downloadAllButton.style.marginTop = "10px";
            downloadAllButton.addEventListener("click", () => {
                const userConfirmed = confirm(
                    "Ensure that your browser downloads are set to automatic. Do you want to proceed with downloading all items?"
                );

                if (userConfirmed) {
                    const downloadLinks = table.querySelectorAll('a[title="Download"]');
                    downloadLinks.forEach(link => {
                        window.open(link.href, "_blank");
                    });
                    console.log(`Attempted to open ${downloadLinks.length} download tabs.`);
                } else {
                    console.log("User canceled the download process.");
                }
            });
            return downloadAllButton;
        }
        const downloadAllButton = createDownloadAllButton(table);
        globalDialog.appendChild(downloadAllButton);

        // Append the dialog to the body.
        document.body.appendChild(globalDialog);
    }

    // Example function to open the torrent dialog.
    function openTorrentDialog() {
        displayTorrentsData();
    }

    // Helper: Extract info for all torrents from a group's document
    function extractTorrentInfosFromGroupDoc(doc, groupId, group) {
        const torrentInfos = [];
        // Get all detail rows (assumed to be <tr> with class "pad" and id starting with "torrent_")
        const detailRows = doc.querySelectorAll('tr.pad[id^="torrent_"]');
        detailRows.forEach(detailRow => {
            // Extract torrentId from id attribute, e.g. "torrent_9912" -> "9912"
            const idAttr = detailRow.getAttribute("id");
            const torrentId = idAttr ? idAttr.replace("torrent_", "") : null;
            if (!torrentId) return;
            // Find the corresponding torrent row for status
            const statusRow = doc.querySelector(`tr.group_torrent#torrent${torrentId}`);
            let status = "";
            let downloadUrl = null;
            let magnet = "";
            if (statusRow) {
                // Try to get a status from an <a> element with title "Seeding" or "Downloading"
                const statusLink = statusRow.querySelector('a[title="Seeding"], a[title="Leeching"]');
                if (statusLink) {
                    status = statusLink.getAttribute("title");
                }
                // If no seeding or downloading status found, check for a "Download" link.
                if (!status) {
                    const downloadLink = statusRow.querySelector('a[title="Download"]');
                    if (downloadLink) {
                        status = "Download";
                        downloadUrl = downloadLink.href; // Capture the download URL
                        magnet = downloadLink.outerHTML; // Capture the entire <a> tag HTML
                    }
                }
            }
            // Find the gold element in the detail row
            const goldElem = detailRow.querySelector("#gold_amt");
            if (!goldElem) {
                console.warn(`[GGn Control Panel] Gold element not found for torrent ${torrentId} in group ${groupId}`);
                return;
            }
            const goldPerHourPool = goldElem.getAttribute("title");
            // Get the torrent data from group.Torrents (if available)
            const torrent = group.Torrents[torrentId];
            if (!torrent) {
                console.warn(`[GGn Control Panel] Torrent ${torrentId} not found in group data for group ${groupId}`);
                return;
            }
            // Compute gold per hour and GPH per gigabyte.
            const goldPerHour = Number(goldPerHourPool) / Number(torrent.Seeders);
            const sizeInGB = Number(torrent.Size) / (1024 ** 3);
            const GPHperGigabyte = goldPerHour / sizeInGB;

            torrentInfos.push({
                DateUploaded: torrent.Time,
                GroupId: groupId,
                TorrentId: torrentId,
                Name: decodeHTML(group.Name),
                SizeGigabytes: sizeInGB,
                IsSnatched: torrent.IsSnatched || torrent.isSnatched,
                Status: status, // "Seeding", "Downloading", or "Download"
                DownloadUrl: downloadUrl,
                Magnet: magnet, // Full <a> tag HTML if available
                Seeders: torrent.Seeders,
                LastUpdated: Date.now(),
                GPHperGigabyte: GPHperGigabyte
            });
        });
        return torrentInfos;
    }


    // Fetched torrent information and permanently caches it without an expiration date. The torrent information data can be updated via other function
    async function fetchTorrentsAndExtractGold(torrentGroups) {
        const options = {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9,pt-PT;q=0.8,pt;q=0.7",
                "cache-control": "max-age=0",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            referrer: "https://gazellegames.net/torrents.php",
            referrerPolicy: "same-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include"
        };
        let torrentsWithGoldInfo = [];
        // Iterate over each torrent group (torrentGroups is assumed to be an object with keys as group IDs)
        for (const groupId in torrentGroups) {
            if (!torrentGroups.hasOwnProperty(groupId)) continue;
            const group = torrentGroups[groupId];
            if (!group.Torrents || typeof group.Torrents !== "object") continue;

            // Check if groupId has been processed already
            const processedGroupIds = await getProcessedTorrentGroupIds();
            if (processedGroupIds.includes(groupId)) {
                const cachedGroupData = await getCachedData(`torrent_group_${groupId}`);
                if (cachedGroupData && cachedGroupData.response) {
                    torrentsWithGoldInfo.push(...cachedGroupData.response);
                }
                continue;
            }
            // Otherwise, fetch the group page once
            const url = `https://gazellegames.net/torrents.php?id=${groupId}`;
            let doc;
            try {
                const response = await fetchWithRateLimit(url, options);
                const htmlText = typeof response === "string" ? response : await response.text();
                const parser = new DOMParser();
                doc = parser.parseFromString(htmlText, "text/html");
            } catch (err) {
                console.error(`Error fetching group ${groupId}:`, err);
                continue;
            }
            // Extract all torrent info from the fetched document
            const groupTorrentInfos = extractTorrentInfosFromGroupDoc(doc, groupId, group);
            if (groupTorrentInfos.length > 0) {
                updateProcessedTorrentGroupIds(groupId);
                await setCacheData(groupTorrentInfos, `torrent_group_${groupId}`); // Cache by groupId
                torrentsWithGoldInfo.push(...groupTorrentInfos);
            }
        }
        return torrentsWithGoldInfo;
    }


    // Function to get cached data with expiry check (handles null cacheExpiryKey)
    async function getCachedData(cacheKey, cacheExpiryKey=null, cacheExpiryDuration=null) {
        const cachedData = localStorage.getItem(cacheKey);

        // If there's no cache, return null and indicate expiration
        if (!cachedData) {
            console.log(`[GGn Control Panel] Cache[${cacheKey}] is missing.`);
            return { response: null, isExpired: true };
        }

        // If cacheExpiryKey is null, just return the data without checking expiry
        if (!cacheExpiryKey) {
            console.log(`[GGn Control Panel] Cache[${cacheKey}] fetched without expiration check.`);
            debugConsole(`[GGn Control Panel] Cache[${cacheKey}] Response:`, JSON.parse(cachedData));
            return { response: JSON.parse(cachedData), isExpired: false };
        }

        // If cacheExpiryKey exists, check if the cache has expired
        const cacheExpiryTime = localStorage.getItem(cacheExpiryKey);
        if (cacheExpiryTime && Date.now() < cacheExpiryTime) {
            console.log(`[GGn Control Panel] Cache[${cacheKey}] is valid. You have ${((cacheExpiryTime - Date.now()) / 60000)} minutes of cache left.`);
            debugConsole(`[GGn Control Panel] Cache[${cacheKey}] Response:`, JSON.parse(cachedData));
            return { response: JSON.parse(cachedData), isExpired: false };
        } else {
            console.log(`[GGn Control Panel] Cache[${cacheKey}] expired or missing.`);
            localStorage.removeItem(cacheKey); // Clear expired cache
            localStorage.removeItem(cacheExpiryKey); // Clear expired cache expiry
            return { response: null, isExpired: true };
        }
    }

    // Function to store new data in cache with expiry
    async function setCacheData(data, cacheKey, cacheExpiryKey=null, cacheExpiryDuration=null) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        if(cacheExpiryKey && cacheExpiryDuration){
            const expiryTime = Date.now() + cacheExpiryDuration;
            localStorage.setItem(cacheExpiryKey, expiryTime.toString());
            console.log(`[GGn Control Panel] Cache for key "${cacheKey}" set successfully. Expires at: ${new Date(expiryTime).toLocaleString()}`);
        }else{
            console.log(`[GGn Control Panel] Cache for key "${cacheKey}" set successfully.`);
        }
    }

    async function updateTorrentDictionaryOnCache(newDictionaryData, cacheKey, cacheExpiryKey=null, cacheExpiryDuration=null) {
        if(!newDictionaryData){
            return;
        }
        const existingData = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);

        // Use a Map to store data, where the key is `emitente` and the value is `selectedOption`
        const dataMap = new Map();

        // Add existing data to the map (this will replace any old selectedOption with the new one)
        (existingData.response || []).forEach(item => {
            dataMap.set(item.emitente.trim(), { emitente: item.emitente.trim(), selectedOption: item.selectedOption.trim() });
        });

        // Add new data, replacing the selectedOption for existing emitente
        newDictionaryData.forEach(item => {
            dataMap.set(item.emitente.trim(), { emitente: item.emitente.trim(), selectedOption: item.selectedOption.trim() });
        });

        // Convert the map back to an array and store it in cache
        const uniqueData = Array.from(dataMap.values());
        await setCacheData(uniqueData, cacheKey, cacheExpiryKey, cacheExpiryDuration);
    }

    async function loadAllCachedTorrentsInfo() {
        const processedGroupIds = await getProcessedTorrentGroupIds(); // should return an array of group IDs
        let allCachedTorrentInfos = [];
        for (const groupId of processedGroupIds) {
            const cachedData = await getCachedData(`torrent_group_${groupId}`);
            if (cachedData) {
                // Depending on how you store your data, it might be stored directly as an array...
                if (Array.isArray(cachedData)) {
                    allCachedTorrentInfos = allCachedTorrentInfos.concat(cachedData);
                }
                // ...or wrapped in an object (e.g. { response: [...] })
                else if (cachedData.response && Array.isArray(cachedData.response)) {
                    allCachedTorrentInfos = allCachedTorrentInfos.concat(cachedData.response);
                }
            }
        }
        return allCachedTorrentInfos;
    }

    async function updateProcessedTorrentGroupIds(newGroupId) {
        let stored = localStorage.getItem("processedTorrentGroupIds");
        let processedSet;
        if (stored) {
            try {
                processedSet = new Set(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing processedTorrentGroupIds, resetting the set.", e);
                processedSet = new Set();
            }
        } else {
            processedSet = new Set();
        }
        processedSet.add(newGroupId);
        localStorage.setItem("processedTorrentGroupIds", JSON.stringify(Array.from(processedSet)));
        return processedSet;
    }

    async function getProcessedTorrentGroupIds(){
        const stored = await getCachedData("processedTorrentGroupIds");
        if (stored && stored.response) {
            try {
                const ids = stored.response;
                return Array.isArray(ids) ? ids : [];
            } catch (e) {
                console.error("Error parsing processed torrent group IDs:", e);
                return [];
            }
        }
        return [];
    }

    async function refreshUserProfileCache() {
        localStorage.removeItem("userProfileData");
        localStorage.removeItem("userProfileCacheExpiry");
        console.log("[GGn Control Panel] User Profile cache refreshed.");
    }

    function refreshTorrentCache() {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key.startsWith("torrent_")) {
                localStorage.removeItem(key);
            }
        }
        localStorage.removeItem("processedTorrentGroupIds");
        console.log("[GGn Control Panel] Torrents cache refreshed.");
    }

    async function refreshInboxCache() {
        localStorage.removeItem("getInboxMessagesData");
        localStorage.removeItem("getInboxMessagesCacheExpiry");
        console.log("[GGn Control Panel] Inbox cache refreshed.");
    }

    async function refreshCraftedRecipesCache() {
        localStorage.removeItem("allCraftedRecipesData");
        localStorage.removeItem("allCraftedRecipesCacheExpiry");
        console.log("[GGn Control Panel] Crafted Recipes cache refreshed.");
        localStorage.removeItem("inventoryData");
        localStorage.removeItem("inventoryCacheExpiry");
        console.log("[GGn Control Panel] Inventory cache refreshed.");
        localStorage.removeItem("itemDetailsData");
        localStorage.removeItem("itemDetailsCacheExpiry");
        console.log("[GGn Control Panel] Item Details cache refreshed.");
    }

    async function refreshCraftingSimulatorCache() {
        localStorage.removeItem("inventoryData");
        localStorage.removeItem("inventoryCacheExpiry");
        console.log("[GGn Control Panel] Inventory cache refreshed.");
        localStorage.removeItem("itemDetailsData");
        localStorage.removeItem("itemDetailsCacheExpiry");
        console.log("[GGn Control Panel] Item Details cache refreshed.");
    }

    async function refreshCraftingDataCache() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Check if key starts with the desired patterns.
            if (key.startsWith("craftingResultData_") || key.startsWith("craftingResultCacheExpiry_")) {
                keysToRemove.push(key);
            }
        }
        // Remove all keys that match the patterns.
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log(`[GGn Control Panel] Removed key: ${key}`);
        });
    }

    async function validatePagination(data, cacheKey, cacheExpiryKey){
        console.log("[GGn Control Panel] Validating data:",data);
        try{
            if(!data){
                console.log("[GGn Control Panel] Data is invalid: ",data);;
                throw new Error("Invalid cached data structure");
            }
        }catch(e){
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    async function fetchPagination(){
        const cacheKey = "currentTorrentPage";
        const cachedResponse = await getCachedData(cacheKey);
        if (!cachedResponse || !cachedResponse.response) {
            try {
                await setCacheData(1, cacheKey);
                return 1;
            } catch (error) {
                console.error(`[GGn Control Panel] Error fetching pagination :`, error);
                return 1;
            }
        } else {
            await validatePagination(cachedResponse.response);
            return cachedResponse.response; // Return cached data
        }
    }

    async function validateItemDetails(data, cacheKey, cacheExpiryKey) {
        console.log("[GGn Control Panel] Validating data:", data);
        try {
            // Check if data is an array
            if (!Array.isArray(data)) {
                console.log(`Data is invalid: ${JSON.stringify(data)}`);
                throw new Error("Invalid cached data structure: data is not an array");
            }

            // Define the required fields
            const requiredFields = ['id', 'name', 'image', 'category', 'description', 'infStock', 'stock', 'notTradeable'];

            // Validate each object in the array
            const isValid = data.every(item =>
                                       requiredFields.every(field => {
                const keys = field.split('.');
                return keys.reduce((obj, key) => obj?.[key], item) !== undefined;
            })
                                      );

            if (!isValid) {
                console.log(`Data is invalid: ${JSON.stringify(data)}`);
                throw new Error("[GGn Control Panel] Invalid cached data structure: missing required fields");
            }

        } catch (e) {
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    // Fetch item details for an array of item IDs
    async function fetchItemDetails(itemIds) {
        const cacheKey = "itemDetailsData";
        const cacheExpiryKey = "itemDetailsCacheExpiry";
        const cacheExpiryDuration = 432000000; // 120 hours or 5 days

        const queryItems = itemIds.map(itemId => parseInt(itemId, 10));
        const queryString = queryItems.length > 1
        ? `itemids=[${queryItems.join(",")}]`
        : `itemid=${queryItems[0]}`;

        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);

        if (!cachedResponse || cachedResponse.isExpired || Object.keys(cachedResponse.response || {}).length === 0) {
            try {
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=items&${queryString}`);
                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                await validateItemDetails(response.response, cacheKey, cacheExpiryKey);
                return response.response.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: getImageUrl(item.image),
                    description: item.description,
                    category: item.category,
                    innerCategory: extractCategoryFromDescription(item.description),
                    stock: determineStockStatus(item.infStock, item.stock),
                    tradeable: !item.notTradeable,
                    value: item.gold
                }));
            } catch (error) {
                console.error(`Error fetching all items from ItemIds=${itemIds} :`, error);
                return null; // Or handle the error as needed
            }
        } else {
            await validateItemDetails(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response.map(item => ({
                id: item.id,
                name: item.name,
                image: getImageUrl(item.image),
                description: item.description,
                category: item.category,
                innerCategory: extractCategoryFromDescription(item.description),
                stock: determineStockStatus(item.infStock, item.stock),
                tradeable: !item.notTradeable,
                value: item.gold
            })); // Return cached data
        }
    }

    async function validateInventory(data, cacheKey, cacheExpiryKey) {
        console.log("[GGn Control Panel] Validating data:", data);
        try {
            // Check if data is an array
            if (!Array.isArray(data)) {
                console.log(`[GGn Control Panel] Data is invalid: ${JSON.stringify(data)}`);
                throw new Error("Invalid cached data structure: data is not an array");
            }

            // Define the required fields
            const requiredFields = ['itemid', 'amount', 'item.id', 'item.name', 'item.image', 'item.category'];

            // Validate each object in the array
            const isValid = data.every(item =>
                                       requiredFields.every(field => {
                const keys = field.split('.');
                return keys.reduce((obj, key) => obj?.[key], item) !== undefined;
            })
                                      );

            if (!isValid) {
                console.log(`[GGn Control Panel] Data is invalid: ${JSON.stringify(data)}`);
                throw new Error("Invalid cached data structure: missing required fields");
            }

        } catch (e) {
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    // Function to fetch inventory with caching
    async function fetchInventory() {
        const cacheKey = "inventoryData";
        const cacheExpiryKey = "inventoryCacheExpiry";
        const cacheExpiryDuration = 432000000; // 120 hours or 5 days
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);
        if (!cachedResponse || cachedResponse.isExpired || Object.keys(cachedResponse.response || {}).length === 0) {
            try {
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=items&type=inventory&include_info=true`);
                debugConsole(`[GGn Control Panel] fetchInventory() API Response:`, response);
                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                await validateInventory(response.response, cacheKey, cacheExpiryKey);
                return response.response;
            } catch (error) {
                console.error(`[GGn Control Panel] Error fetching inventory :`, error);
                return null; // Or handle the error as needed
            }
        } else {
            await validateInventory(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response; // Return cached data
        }
    }

    async function validateCraftingResult(data, cacheKey, cacheExpiryKey){
        debugConsole("[GGn Control Panel] Validating data:",data);
        try{
            if(!data){
                console.log("[GGn Control Panel] Data is invalid: ",data);;
                throw new Error("Invalid cached data structure");
            }
        }catch(e){
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    async function fetchCraftingResult(recipe, isTest=true, updateCache=true) {
        debugConsole(`[GGn Control Panel] fetchCraftingResult(recipe=${recipe},isTest=${isTest},updateCache=${updateCache})`);
        const cacheKey = `craftingResultData_${recipe}${isTest ? "_test" : ""}`;
        const cacheExpiryKey = `craftingResultCacheExpiry_${recipe}`;
        const cacheExpiryDuration = 4320000000; // 5000 days (forever)
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);
        // The cache response for a successful craft has cachedResponse.response = null, so we must make a special case to fetch ALWAYS from the API when it's not a test
        if ((updateCache && !isTest) || (updateCache && (!cachedResponse || cachedResponse.isExpired || !cachedResponse.response))) {
            try {
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=items&type=crafting_result&action=${isTest ? "find" : "take"}&recipe=${recipe}`);
                console.log(`[GGn Control Panel] fetchCraftingResult(recipe=${recipe},isTest=${isTest},updateCache=${updateCache}) API Response:`, response);

                // Check if the response is valid
                if (!response || !response.response) {
                    console.error(`[GGn Control Panel] Invalid response from API for ${isTest ? "(Test)" : ""} recipe=${recipe}:`, response);
                    return null; // Handle as needed (e.g., return null or show an error to the user)
                }
                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                await validateCraftingResult(response.response, cacheKey, cacheExpiryKey);
                return response.response;
            } catch (error) {
                console.error(`[GGn Control Panel] Error fetching craft result test from ${isTest ? "(Test)" : ""} recipe=${recipe}:`, error);
                return null; // Handle as needed
            }
        } else {
            // Check if cached response is valid
            if (!cachedResponse || !cachedResponse.response) {
                console.error(`[GGn Control Panel] Invalid cached response for ${isTest ? "(Test)" : ""} recipe=${recipe}:`, cachedResponse);
                return null; // Handle as needed
            }
            await validateCraftingResult(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response;
        }
    }

    async function validateRecipes(data, cacheKey, cacheExpiryKey) {
        console.log("[GGn Control Panel] Validating data:",data);
        try {
            // Check if data is an array
            if (!Array.isArray(data)) {
                debugConsole(`[GGn Control Panel] Data is invalid:`,data);
                throw new Error("Invalid cached data structure: data is not an array");
            }

            // Define the required fields
            const requiredFields = ['id', 'name', 'recipe', 'requirement', 'result'];

            // Validate each object in the array
            const isValid = data.every(item =>
                                       requiredFields.every(field => item.hasOwnProperty(field))
                                      );

            if (!isValid) {
                console.log(`[GGn Control Panel] Data is invalid: ${JSON.stringify(data)}`);
                throw new Error("Invalid cached data structure: missing required fields");
            }

        } catch (e) {
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    // Function to fetch all recipes with caching
    async function fetchAllRecipesFrom(recipeIds) {
        const cacheKey = "allCraftedRecipesData";
        const cacheExpiryKey = "allCraftedRecipesCacheExpiry"; // To store the cache expiry time
        const cacheExpiryDuration = 432000000; // 120 hours or 5 days
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);

        if (!cachedResponse || cachedResponse.isExpired || Object.keys(cachedResponse.response || {}).length === 0) {
            try {
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=items&type=get_crafting_recipe&recipeids=[${recipeIds}]`);
                console.log(`[GGn Control Panel] fetchAllRecipesFrom(recipeIds=${recipeIds}) API Response:`, response);

                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                await validateRecipes(response.response, cacheKey, cacheExpiryKey);
                return response.response;
            } catch (error) {
                console.error(`[GGn Control Panel] Error fetching all recipes from RecipeIds=${recipeIds} :`, error);
                return null; // Or handle the error as needed
            }
        } else {
            await validateRecipes(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response; // Return cached data
        }
    }

    async function validateCraftedRecipes(data, cacheKey, cacheExpiryKey){
        console.log("[GGn Control Panel] Validating data:",data);
        try{
            if(!data || !Array.isArray(data)){
                console.log("[GGn Control Panel] Data is invalid: ",data);;
                throw new Error("Invalid cached data structure");
            }
        }catch(e){
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    // Function to fetch user data with caching
    async function fetchCraftedRecipes() {
        const cacheKey = "craftedRecipesData";
        const cacheExpiryKey = "craftedRecipesCacheExpiry";
        const cacheExpiryDuration = 432000000; // 120 hours or 5 days
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);
        if (!cachedResponse || cachedResponse.isExpired || Object.keys(cachedResponse.response || {}).length === 0) {
            try {
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=items&type=crafted_recipes`);
                console.log(`[GGn Control Panel] fetchCraftedRecipes() API Response:`, response);
                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                await validateCraftedRecipes(response.response, cacheKey, cacheExpiryKey);
                return response.response; // Return fresh data
            } catch (error) {
                console.error("[GGn Control Panel] Error fetching crafting recipes:", error);
                return null;
            }
        } else {
            await validateCraftedRecipes(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response;
        }
    }

    async function markChecked(messages) {
        const cacheKey = "getInboxMessagesData";
        const cacheExpiryKey = "getInboxMessagesCacheExpiry";
        const cacheExpiryDuration = 100000; // 100 Seconds
        const unreadMessages = messages.filter(message => message.unread);

        if (unreadMessages.length === 0) {
            console.log("[GGn Control Panel] No unread messages to mark as read.");
            return;
        }

        const unreadConvIds = unreadMessages.map(message => message.convId);
        const stringifiedConvIds = unreadConvIds.map(convId => convId.toString());

        // Get cached data
        const messageInbox = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);

        const url = `https://gazellegames.net/api.php?key=${API_KEY}&request=inbox&type=markread`;
        const formData = new FormData();
        stringifiedConvIds.forEach(convId => {
            formData.append("messages[]", convId);
        });

        fetch(url, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
            console.log("[GGn Control Panel] markChecked(messages) API Response: ", data);

            if (data.status === "success") {
                console.log("[GGn Control Panel] Unread messages marked as read successfully.");
                if (checkInboxButton) {
                    checkInboxButton.textContent = "Check Inbox";
                }

                // Check if the cached data has the expected structure
                if (messageInbox && messageInbox.response && messageInbox.response.response && Array.isArray(messageInbox.response.response.messages)) {
                    // Update the cache to mark the corresponding conversation(s) as read
                    unreadConvIds.forEach(convId => {
                        const cachedMessage = messageInbox.response.response.messages.find(message => message.convId === convId);

                        if (cachedMessage) {
                            debugConsole("[GGn Control Panel] Marking as read:", cachedMessage.subject);
                            cachedMessage.unread = false; // Mark as read in cache
                        } else {
                            console.error(`[GGn Control Panel] Message with convId ${convId} not found in cache.`);
                        }
                    });

                    setCacheData(messageInbox.response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                    console.log("[GGn Control Panel] Local cache updated to reflect marked as read.");
                } else {
                    console.error("[GGn Control Panel] Error: Cached data does not have the expected structure.");
                }
            } else {
                console.error("[GGn Control Panel] Failed to mark unread messages as read. Response status:", data.status);
            }
        })
            .catch(error => {
            console.error("[GGn Control Panel] Error marking unread messages as read:", error);
        });
    }

    function fetchConversation(convId) {
        const url = `https://gazellegames.net/api.php?key=${API_KEY}&request=inbox&type=viewconv&id=${convId}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
            const messages = data.response.messages;
            const dialog = createDialog(`Messages in ConvId: ${convId}`, true);
            dialog.style.overflowY = "auto";

            messages.forEach((msg) => {
                const messageContainer = document.createElement("div");
                messageContainer.style.borderBottom = "1px solid #444"; // Darker border for message container
                messageContainer.style.marginBottom = "10px";
                messageContainer.style.paddingBottom = "10px";

                const sender = document.createElement("p");
                sender.textContent = `Sender: ${msg.senderName}`;
                sender.style.fontWeight = "bold";

                const sentDate = document.createElement("p");
                sentDate.textContent = `Date: ${msg.sentDate}`;
                sentDate.style.color = "#bbb"; // Lighter gray for the date

                const messageBody = document.createElement("p");
                messageBody.innerHTML = msg.body; // Use innerHTML to parse HTML
                messageBody.style.backgroundColor = "rgba(0, 105, 140, 0.3)";
                messageBody.style.color = "#fff";
                messageBody.style.padding = "10px";
                messageBody.style.borderRadius = "5px";
                messageBody.style.wordWrap = "break-word";
                messageBody.style.marginTop = "10px";

                messageContainer.appendChild(messageBody);
                messageContainer.appendChild(sender);
                messageContainer.appendChild(sentDate);
                messageContainer.appendChild(messageBody);

                dialog.appendChild(messageContainer);
            });

            document.body.appendChild(dialog);
        })
            .catch((error) => {
            alert("Failed to fetch conversation messages: " + error);
        });
    }

    async function validateInboxMessages(data, cacheKey, cacheExpiryKey){
        console.log("[GGn Control Panel] Validating data:",data);
        try{
            if(!data.messages || !data.pages || !data.currentPage){
                console.log("[GGn Control Panel] Data is invalid: ",data);;
                throw new Error("Invalid cached data structure");
            }
        }catch(e){
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    // Function to fetch inbox messages with caching and expiry
    async function fetchInboxMessages() {
        const cacheKey = "getInboxMessagesData";
        const cacheExpiryKey = "getInboxMessagesCacheExpiry";
        const cacheExpiryDuration = 100000; // 100 Seconds

        // Get cached data with expiry check
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);

        if (!cachedResponse || cachedResponse.isExpired || Object.keys(cachedResponse.response || {}).length === 0) {
            try {
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=inbox`);
                debugConsole(`[GGn Control Panel] fetchInboxMessages() API Response:`, response);
                // Store new data in cache with expiry
                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                await validateInboxMessages(response.response, cacheKey, cacheExpiryKey);
                return response.response; // Return fresh data
            } catch (error) {
                console.error("[GGn Control Panel] Error fetching inbox messages:", error);
                return null; // Handle error if necessary
            }
        } else {
            await validateInboxMessages(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response; // Return only the actual cached data
        }
    }

    async function validateTorrents(data, cacheKey, cacheExpiryKey) {
        console.log("[GGn Control Panel] Validating data:", data);
        try {
            // Instead of checking for data.status, check that data is an object
            // and contains at least one key (torrent group)
            if (typeof data !== "object" || data === null || Object.keys(data).length === 0) {
                console.log("[GGn Control Panel] Data is invalid: ", data);
                throw new Error("Invalid cached data structure: expected a non-empty object");
            }
            // Optionally, you can also validate that each torrent group has expected properties
            // For example, check that each group has an "ID" property:
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const group = data[key];
                    if (!group.ID || !group.Name) {
                        console.log("[GGn Control Panel] Data is invalid for group:", key, group);
                        throw new Error(`Invalid data structure in group ${key}`);
                    }
                }
            }
        } catch (e) {
            console.error("[GGn Control Panel] Error parsing cached data:", e);
        }
    }

    // Function to fetch torrents
    async function fetchTorrents(page, sortBy = "seeders") {
        try {
            const url = `https://gazellegames.net/api.php?key=${API_KEY}&request=search&search_type=torrents&hide_dead=1&order_by=${sortBy}&order_way=asc&page=${page}`;
            const response = await fetchWithRateLimit(url);
            debugConsole("[GGn Control Panel] fetchTorrents() API Response:", response);
            await validateTorrents(response.response);
            return response.response;
        } catch (error) {
            console.error("[GGn Control Panel] Error fetching torrents:", error);
            return null;
        }
    }

    async function validateUserProfileData(data, cacheKey, cacheExpiryKey){
        console.log("[GGn Control Panel] Validating data:",data);
        try{
            if(data.id == null || data.username == null || data.title == null || data.personal.class == null || data.community.hourlyGold == null || data.community.seeding == null || data.community.snatched == null || data.community.seedSize == null || data.buffs.TorrentsGold == null){
                console.log(`[GGn Control Panel] Data is invalid:`,data);
                throw new Error("Invalid cached data structure");
            }
        }catch(e){
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    async function fetchUserProfileData(userId) {
        const cacheKey = `userProfileData_${userId}`;
        const cacheExpiryKey = `userProfileCacheExpiry`;
        const cacheExpiryDuration = 432000000; // 120 hours or 5 days

        // Fetch cached data if available
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);
        if (!cachedResponse || cachedResponse.isExpired || Object.keys(cachedResponse.response || {}).length === 0) {
            try {
                // Fetch data from the API
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=user&id=${userId}`);
                // Validate and cache the response
                await validateUserProfileData(response.response, cacheKey, cacheExpiryKey);
                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);

                return response.response;
            } catch (error) {
                console.error(`[GGn Control Panel] Error fetching user data for user ${userId}:`, error);
                return null; // Handle the error as needed
            }
        } else {
            // Validate the cached data before using it
            await validateUserProfileData(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response; // Return cached data
        }
    }

    async function validateUserData(data, cacheKey, cacheExpiryKey){
        console.log("[GGn Control Panel] Validating data:",data);
        try{
            if(!data.id || !data.username || !data.userstats.class){
                console.log(`[GGn Control Panel] Data is invalid: ${JSON.stringify(data)}`);
                throw new Error("Invalid cached data structure");
            }
        }catch(e){
            console.error("[GGn Control Panel] Error parsing cached data:", e);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheExpiryKey);
            console.info("[GGn Control Panel] Cache cleared!");
        }
    }

    async function fetchUserData() {
        const cacheKey = "quickUserData";
        const cacheExpiryKey = "quickUserCacheExpiry";
        const cacheExpiryDuration = 43200000000; // 12 000 hours or 500 days
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);
        if (!cachedResponse || cachedResponse.isExpired || Object.keys(cachedResponse.response || {}).length === 0) {
            try {
                const response = await fetchWithRateLimit(`https://gazellegames.net/api.php?key=${API_KEY}&request=quick_user`);
                debugConsole(`[GGn Control Panel] fetchUserData() API Response: `,response);
                await setCacheData(response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
                await validateUserData(response.response, cacheKey, cacheExpiryKey);
                return response.response;
            } catch (error) {
                console.error("[GGn Control Panel] Error fetching user data:", error);
                return null; // Or handle the error as needed
            }
        } else {
            await validateUserData(cachedResponse.response.response, cacheKey, cacheExpiryKey);
            return cachedResponse.response.response; // Return cached data
        }
    }

    // Utility function to handle API requests and catch 429 errors
    async function fetchWithRateLimit(url, options = {}) {
        try {
            const response = await fetch(url, options);

            // Check if the response status is 429 (Too Many Requests)
            if (response.status === 429) {
                alert("Too many requests! Please tone down your actions to avoid further restrictions.");
                console.warn("[GGn Control Panel] Rate limit exceeded. Please reduce the frequency of API requests.");
                return null;
            }

            // Ensure the response object has a .json method
            if (typeof response.json !== "function") {
                console.error("[GGn Control Panel] Invalid response object:", response);
                return null;
            }

            // Check the content type to determine whether to parse as JSON or text.
            const contentType = response.headers.get("Content-Type") || "";
            if (contentType.includes("application/json")) {
                return await response.json();
            } else if (contentType.includes("text/html") || contentType.includes("text/plain")) {
                return await response.text();
            } else {
                console.warn("[GGn Control Panel] Unexpected response content type:", contentType);
                return null;
            }
        } catch (error) {
            console.error("[GGn Control Panel] Fetch error:", error);
            return null;
        }
    }

    async function createControlPanelMinified() {
        const controlPanel = document.getElementById('control-panel');
        controlPanel.style.display = "none";

        // Create the minimized panel
        const minifiedPanel = document.createElement("div");
        minifiedPanel.id = "control-panel-minified";
        document.body.appendChild(minifiedPanel);

        // Apply styles for the minimized panel
        minifiedPanel.style.position = "fixed";
        minifiedPanel.style.bottom = "0px";
        minifiedPanel.style.right = "0px";
        minifiedPanel.style.backgroundColor = "#222";
        minifiedPanel.style.color = "#fff";
        minifiedPanel.style.padding = "10px 20px";
        minifiedPanel.style.borderRadius = "10px";
        minifiedPanel.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
        minifiedPanel.style.width = "auto";
        minifiedPanel.style.height = "auto";
        minifiedPanel.style.cursor = "pointer";
        minifiedPanel.style.display = "flex";
        minifiedPanel.style.alignItems = "center";
        minifiedPanel.style.justifyContent = "center";
        minifiedPanel.style.fontSize = "14px";
        minifiedPanel.style.zIndex = "10000";

        // Add a label for the minimized panel
        const label = document.createElement("span");
        label.textContent = "GGn Control Panel";
        label.style.color = "#fff";
        minifiedPanel.appendChild(label);

        // Add a click event to maximize the panel
        minifiedPanel.addEventListener("click", async () => {
            localStorage.setItem("panelMinimized", "false");
            minifiedPanel.remove(); // Remove the minimized panel
            controlPanel.style.display = "flex";
        });
    }

    async function createControlPanel() {
        // Remove an existing panel if it exists
        const existingPanel = document.getElementById("control-panel");
        if (existingPanel) existingPanel.remove();

        let panel = null;
        panel = document.createElement("div");
        panel.id = "control-panel"; // Set the ID of the control panel
        // Set the styles directly
        panel.style.position = "fixed"; // Make sure it is fixed position for dragging
        panel.style.bottom = "-10px";
        panel.style.right = "-10px";
        panel.style.width = "auto";
        panel.style.height = "auto";
        panel.style.backgroundColor = "#222";
        panel.style.color = "#fff";
        panel.style.padding = "20px";
        panel.style.gap = "20px";
        panel.style.borderRadius = "15px";
        panel.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
        panel.style.minWidth = "300px"; // Minimum width
        panel.style.maxWidth = "420px"; // Maximum width
        panel.style.display = "flex";
        panel.style.flexDirection = "column";
        panel.style.alignItems = "center";
        panel.style.justifyContent = "space-evenly";
        panel.style.zIndex = "10000";

        const header = document.createElement("h2");
        header.textContent = "GGn Control Panel";
        header.style.textAlign = "center";
        panel.appendChild(header);

        // Add the Animaker© text below the icon
        const animakerText = document.createElement("p");
        animakerText.textContent = "Animaker©";
        animakerText.style.position = "absolute";
        animakerText.style.top = "60px"; // Adjust position as needed
        animakerText.style.left = "20px";
        animakerText.style.fontSize = "9px"; // Small text
        animakerText.style.color = "gold"; // Golden color
        panel.appendChild(animakerText);

        // Create and add the badge icon in the top right (150x150 size)
        const badgeIcon = document.createElement("img");
        badgeIcon.alt = "Badge Icon";
        badgeIcon.style.position = "absolute";
        badgeIcon.style.top = "10px"; // Adjust the position as needed
        badgeIcon.style.right = "10px"; // Position it at the top right
        badgeIcon.style.width = "50px"; // Set the width to 150px
        badgeIcon.style.height = "50px"; // Set the height to 150px
        badgeIcon.style.objectFit = "cover"; // Optional: ensures the image doesn't stretch
        panel.appendChild(badgeIcon);

        // Fetch user data with caching
        const userData = await fetchUserData();
        let userId;
        if (userData) {
            const username = userData.username;
            const userClass = userData.userstats.class;
            userId = userData.id;

            // Change the gazelle icon based on user class
            changeIconBasedOnClass(userClass, badgeIcon);

            // Create and display the personalized message with the username link
            const message = document.createElement("p");
            message.innerHTML = `${userClass} <a href="https://gazellegames.net/user.php?id=${userId}" target="_blank">${username}</a>!<br>How can I help you?`;
            message.style.fontSize = "16px";
            message.style.textAlign = "center";
            panel.appendChild(message);
        } else {
            console.error("[GGn Control Panel] Failed to load user data.");
        }
        if(userId){
            const userProfileData = await fetchUserProfileData(userId);
            if (userProfileData) {
                const statsContainer = createStatsContainer(userProfileData);
                panel.appendChild(statsContainer);
            }else {
                console.error("[GGn Control Panel] Failed to load user profile data.");
            }
        }

        const refreshUserDataIcon = createRefreshIcon("User", refreshUserProfileCache);
        refreshUserDataIcon.style.position = "relative";
        panel.appendChild(refreshUserDataIcon);

        addButtons(panel);
        addAuthorLink(panel);
        addMinimizeButton(panel);
        makePanelDraggable(panel);
        document.body.appendChild(panel);
    }

    function addAuthorLink(panel){
        // Create the link for the badge icon
        const authorLink = document.createElement("a");
        authorLink.href = `https://gazellegames.net/user.php?id=64361`; // Author (Animaker) link, in case you want to submit feedback or report a bug
        authorLink.target = "_blank"; // Open the link in a new tab

        // Create and add the gazelle icon image (added last)
        const icon = document.createElement("img");
        icon.src = "https://ptpimg.me/uf35wd.png"; // Your icon URL
        icon.alt = "Gazelle Icon";
        icon.style.position = "absolute";
        icon.style.top = "20px";
        icon.style.left = "20px";
        icon.style.width = "40px"; /* or any percentage relative to container width */
        icon.style.height = "auto"; /* Maintain aspect ratio */
        // Set a fallback image in case of an error
        icon.onerror = () => {
            console.error("[GGn Control Panel] Failed to load Gazelle icon. Using fallback icon.");
            icon.src = "https://ptpimg.me/uf35wd.png"; // Use your fallback image URL
        };

        authorLink.appendChild(icon);
        panel.appendChild(authorLink);
    }

    function addMinimizeButton(panel){
        // Add minimize button
        const minimizeBtn = document.createElement("button");
        minimizeBtn.title = "Minimize";
        minimizeBtn.textContent = "➖";
        minimizeBtn.style.position = "absolute";
        minimizeBtn.style.alignItems = "center";
        minimizeBtn.style.top = "5px";
        minimizeBtn.style.background = "grey";
        minimizeBtn.style.border = "none";
        minimizeBtn.style.color = "#fff";
        minimizeBtn.style.fontSize = "20px";
        minimizeBtn.style.cursor = "pointer";
        minimizeBtn.addEventListener("click", async () => {
            localStorage.setItem("panelMinimized", "true");
            await createControlPanelMinified();
        });
        panel.appendChild(minimizeBtn);
    }

    function createStatsContainer(userProfileData){
        const uploadedGB = (userProfileData.stats.uploaded / (1024 ** 3)).toFixed(2);
        const downloadedGB = (userProfileData.stats.downloaded / (1024 ** 3)).toFixed(2);
        const goldPerHourPerGigabyte = (userProfileData.community.hourlyGold / (userProfileData.community.seedSize / (1024 ** 3))).toFixed(2);
        const seedingPercentage = ((userProfileData.community.seeding / userProfileData.community.uniqueSnatched) * 100).toFixed(2);
        const avgGPHPerTorrent = (userProfileData.community.hourlyGold / userProfileData.community.seeding).toFixed(2);
        const dailyGoldPercentage = (( (24 * userProfileData.community.hourlyGold) / userProfileData.stats.gold) * 100).toFixed(2);
        const gph = Number(userProfileData.community.hourlyGold/Number(userProfileData.buffs.TorrentsGold)).toFixed(2);

        let gold = userProfileData.stats.gold;
        // Convert the string to a number
        const goldNumber = Number(gold);

        // Check if the conversion was successful
        if (!isNaN(goldNumber)) {
            // Create a NumberFormat instance for the desired locale
            const formatter = new Intl.NumberFormat('en-US', {
                useGrouping: true,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            const formattedGold = formatter.format(goldNumber);
            gold = formattedGold.replace(/,/g, ' ');
        } else {
            console.error('[GGn Control Panel] Invalid number format in userProfileData.stats.gold');
        }

        // Display the uploaded and downloaded stats
        const statsContainer = document.createElement("div");
        statsContainer.style.display = "flex";
        statsContainer.style.flexDirection = "column";
        statsContainer.style.alignItems = "center";
        statsContainer.style.marginBottom = "5px";
        statsContainer.style.fontSize = "14px";
        statsContainer.style.textAlign = "center";

        const tab = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
        const formattedUpload = formatSize(uploadedGB);
        const formattedDownload = formatSize(downloadedGB);
        const uploadValue = `<span style="color: green;">&#x21E7; ${formattedUpload}</span>`;
        const downloadValue = `<span style="color: red;">&#x21E9; ${formattedDownload}</span>`;
        const gphPerGigabyteValue = `<span style="color: gold;">${goldPerHourPerGigabyte}</span>`;
        const gphPerGigabyteLabel = `<span style="color: gold;">GPH per Gigabyte</span>`;
        const goldValue = `<span style="color: gold; align-items: center;"><span>${gold}</span><img src="https://ptpimg.me/yctawt.png" alt="gold" style="margin-left: 8px; width: 20px; height: 20px;"></span>`;
        const gphValue = `<span style="color: gold;">${gph}</span>`;


        // Seeding % styling (color based on value)
        let seedingColor = "green";
        if (seedingPercentage < 40) seedingColor = "red";
        else if (seedingPercentage < 60) seedingColor = "orange";
        const seedingStyled = `<span style="color: ${seedingColor};">${seedingPercentage}%</span>`;
        const avgGPHStyled = `<span style="color: gold;">${avgGPHPerTorrent}</span>`;
        const dailyGoldStyled = `<span style="font-weight: bold; color: gold;">${dailyGoldPercentage}%</span>`;

        // Display stats
        statsContainer.innerHTML = `
                    <div>
                    <p>${uploadValue} ${tab} ${gphPerGigabyteValue} ${tab} ${downloadValue}<br>${gphPerGigabyteLabel}</p>
                    <p>${goldValue}</p>
                    <p>Unbuffed GPH: ${gphValue}<br>Seeding: ${seedingStyled} ${tab} GPH/Torrent: ${avgGPHStyled}<br>Every day your gold grows ${dailyGoldStyled}</p>
                    </div>
                `;
        return statsContainer;
    }

    // Function to add the buttons to the panel
    function addButtons(panel) {
        const buttons = [
            { text: "Best Torrents", action: getBestTorrents, refreshAction: refreshTorrentCache },
            { text: "Check Inbox", action: getInboxMessages, refreshAction: refreshInboxCache },
            { text: "Crafting Recipes", action: getCraftedRecipes, refreshAction: refreshCraftedRecipesCache },
            { text: "Crafting Simulator", action: getCraftingSimulator, refreshAction: refreshCraftingSimulatorCache },
            { text: "Oracle", action: youWish, refreshAction: null },
            { text: "Upload Manager", action: youWish, refreshAction: null },
            { text: "Shop", action: youWish, refreshAction: null },
            { text: "Your Collection", action: youWish, refreshAction: null },
        ];
        const buttonContainer = createButtonContainer(buttons); // Creates button container
        const buttonContainerToggle = createButtonContainerToggle(buttonContainer); // Creates toggle to show/hide button container
        panel.appendChild(buttonContainerToggle);
        panel.appendChild(buttonContainer);
    }

    // Function to add a simple toggle button to hide/show the button container.
    function createButtonContainerToggle(buttonContainer) {
        const toggleButton = document.createElement("button");
        toggleButton.id = "toggle-button";
        toggleButton.classList.add("custom-button"); // Apply the custom button class
        toggleButton.textContent = "Hide Buttons"; // Initial state: buttons visible
        // Determine the initial state from localStorage.
        const hideButtonsStored = localStorage.getItem("hideButtons") === "true";
        if (hideButtonsStored) {
            buttonContainer.style.display = "none";
            toggleButton.textContent = "Show Buttons";
            toggleButton.style.backgroundColor = "#28a745"; // Green indicates "Show"
        } else {
            buttonContainer.style.display = "flex";
            toggleButton.textContent = "Hide Buttons";
            toggleButton.style.backgroundColor = "#dc3545"; // Red indicates "Hide"
        }

        toggleButton.addEventListener("click", function () {
            if (!buttonContainer) return;
            if (buttonContainer.style.display === "none") {
                buttonContainer.style.display = "flex";
                toggleButton.textContent = "Hide Buttons";
                toggleButton.style.backgroundColor = "#dc3545";
                localStorage.setItem("hideButtons", "false");
            } else {
                buttonContainer.style.display = "none";
                toggleButton.textContent = "Show Buttons";
                toggleButton.style.backgroundColor = "#28a745";
                localStorage.setItem("hideButtons", "true");
            }
        });
        return toggleButton;
    }

    function makePanelDraggable(panel) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let dragTimeout;
        let dragDelay = 500;

        // Ensure the panel is fixed positioned and can be dragged.
        panel.style.position = 'fixed';

        // Function to handle the mousemove event
        function onMouseMove(event) {
            if (!isDragging) return;
            if (isDragging) {
                // Disable these styling preferences to avoid inconsistent behavior
                panel.style.right = "";
                panel.style.bottom = "";
                // Calculate the new position while dragging
                const newX = event.clientX - offsetX;
                const newY = event.clientY - offsetY;
                // Optional: Restrict movement to within the bounds of the window
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;
                // Ensure the panel stays within bounds
                const boundedX = Math.max(0, Math.min(newX, maxX));
                const boundedY = Math.max(0, Math.min(newY, maxY));
                // Update panel position using right and bottom.
                // We compute right and bottom based on the window dimensions.
                const right = window.innerWidth - (boundedX + panel.offsetWidth);
                const bottom = window.innerHeight - (boundedY + panel.offsetHeight);
                panel.style.right = `${Math.max(0, right)}px`;
                panel.style.bottom = `${Math.max(0, bottom)}px`;
            }
        }

        // Function to handle the mouseup event
        function onMouseUp() {
            clearTimeout(dragTimeout);
            if (isDragging) {
                // Save position to localStorage
                const panelRight = parseFloat(panel.style.right || "50");
                const panelBottom = parseFloat(panel.style.bottom || "20");
                localStorage.setItem("panelRight", panelRight);
                localStorage.setItem("panelBottom", panelBottom);
            }
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
        // Event listener for mousedown to start dragging
        panel.addEventListener("mousedown", (event) => {
            // Calculate the initial offset from the mouse pointer to the panel's top-left corner
            offsetX = event.clientX - panel.getBoundingClientRect().left;
            offsetY = event.clientY - panel.getBoundingClientRect().top;
            // Set a timeout to start dragging after the specified delay
            dragTimeout = setTimeout(() => {
                isDragging = true;
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            }, dragDelay);
        });
        panel.addEventListener("mouseup", onMouseUp);
        panel.addEventListener("mouseleave", onMouseUp);
    }


    function createButtonContainer(buttons) {
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "button-container";
        // Create the container for the forum filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.id="filter-container";
        buttonContainer.appendChild(filterContainer);
        // Create the container for the forum filter buttons
        const postContainer = document.createElement('div');
        postContainer.id="post-container";
        buttonContainer.appendChild(postContainer);

        buttons.forEach(({ text, action, refreshAction }) => {
            // Create the main button
            const buttonWrapper = document.createElement("div");
            buttonWrapper.style.position = "relative"; // Needed for positioning the refresh icon
            const button = document.createElement("button");
            button.textContent = text;
            button.classList.add("custom-button"); // Apply the custom button class
            button.addEventListener("click", action);
            buttonWrapper.appendChild(button);

            // Create the refresh icon
            const refreshIcon = createRefreshIcon(text, refreshAction);
            buttonWrapper.appendChild(refreshIcon);
            buttonContainer.appendChild(buttonWrapper);
            if (text.toLowerCase().includes("inbox")) {
                checkInboxButton = button;
            }
        });
        return buttonContainer;
    }

    function createRefreshIcon(text, refreshAction) {
        const refreshIcon = document.createElement("div");
        refreshIcon.textContent = "🔄";
        refreshIcon.style.position = "absolute";
        refreshIcon.style.top = "10px";
        refreshIcon.style.right = "10px";
        refreshIcon.style.fontSize = "14px";
        refreshIcon.style.cursor = "pointer";
        refreshIcon.style.color = "#007bff";
        refreshIcon.title = `Refresh ${text} Data`;

        // Event listener for click (refresh action)
        refreshIcon.addEventListener("click", (event) => {
            if (refreshAction) {
                console.log(`[GGn Control Panel] Refreshing data for ${text}...`);
                event.stopPropagation(); // Prevent triggering the main button
                refreshAction();
            }
        });

        // Hover effect
        refreshIcon.addEventListener("mouseover", () => {
            refreshIcon.style.color = "#0056b3";
        });
        refreshIcon.addEventListener("mouseout", () => {
            refreshIcon.style.color = "#007bff";
        });

        return refreshIcon;
    }

    // Function to convert bytes to GB or TB
    function formatSize(sizeInGB) {
        if (sizeInGB >= 1024) {
            return (sizeInGB / 1024).toFixed(2) + " TB"; // Convert GB to TB and format to 2 decimal places
        }
        return sizeInGB + " GB"; // Return in GB if it's less than 1024 GB
    }

    // Function to change the gazelle icon based on the user class
    function changeIconBasedOnClass(userClass, icon) {
        const icons = {
            "Gaming God": "https://ptpimg.me/i5m52t.png",
            "Master Gamer": "https://ptpimg.me/k0gkfm.png",
            "Legendary Gamer": "https://ptpimg.me/sr5z38.png",
            "Elite Gamer": "https://ptpimg.me/we2t80.png",
            "Pro Gamer": "https://ptpimg.me/yyt9c2.png",
            "Gamer": "https://ptpimg.me/nsc932.png",
        };

        if (icons[userClass]) {
            icon.src = icons[userClass]; // Set the appropriate icon based on class
            icon.title = userClass;
        }
    }

    async function getBestTorrents(){
        displayTorrentsData();
    }

    async function getInboxMessages() {
        let data = await fetchInboxMessages();
        const messages = data.messages;
        await displayInboxMessages(messages);

        const unreadMessages = messages.filter(message => message.unread);
        debugConsole(`[GGn Control Panel] Unread Messages: ${JSON.stringify(unreadMessages)}`);
        await markChecked(unreadMessages);
    }

    // Fetch and display crafted recipes
    async function getCraftedRecipes() {
        let data = await fetchCraftedRecipes();
        const recipes = data || [];
        if (recipes.length > 0) {
            const allCraftRecipes = await fetchAllRecipesFrom(recipes.map(recipe => recipe.id));
            displayCraftedRecipes(recipes, allCraftRecipes);
        } else {
            alert("No crafted recipes found.");
        }
    }

    // Fetch and display a crafting recipe for a given recipeId
    async function getCraftingRecipe(recipeId) {
        if (!recipeId) {
            console.error("[GGn Control Panel] Please enter a valid Recipe ID.");
            return;
        }
        const cacheKey = "allCraftedRecipesData";
        const cacheExpiryKey = "allCraftedRecipesCacheExpiry"; // To store the cache expiry time
        const cacheExpiryDuration = 432000000; // 120 hours or 5 days
        const cachedResponse = await getCachedData(cacheKey, cacheExpiryKey, cacheExpiryDuration);
        if(cachedResponse.isExpired){
            await setCacheData(cachedResponse.response, cacheKey, cacheExpiryKey, cacheExpiryDuration);
        }
        const recipe = cachedResponse.response.response.find(recipe => Number(recipe.id) === Number(recipeId));
        if (recipe) {
            displayCraftingRecipe(recipe);
        } else {
            console.error(`[GGn Control Panel] Recipe with ID ${recipeId} not found.`);
        }
    }

    // Fetch and display the crafting simulator
    async function getCraftingSimulator() {
        let data = await fetchInventory();

        const items = data || [];

        // Filter items where amount > 8 (ensure amount is treated as a number)
        const craftableItems = items.filter(item => Number(item.amount) > 8);

        // Sort items by amount (descending)
        craftableItems.sort((a, b) => Number(b.amount) - Number(a.amount));

        displayCraftingSimulator(craftableItems);
        debugConsole(`[GGn Control Panel] getCraftingSimulator with Sorted Items from Inventory:`, craftableItems);

    }

    async function checkForUnreadMessages() {
        try {
            console.log("[GGn Control Panel] Checking Unread Messages...");
            // Fetch inbox messages
            let inbox = await fetchInboxMessages();
            // Check if the 'messages' field exists and is an array
            if (inbox && Array.isArray(inbox.messages)) {
                // Check for unread messages
                const unreadMessages = inbox.messages.filter(message => message.unread);

                if (unreadMessages.length > 0) {
                    if(globalDialog?.querySelector("h2")?.textContent === "Inbox")
                    {
                        await markChecked(unreadMessages);
                        console.log("[GGn Control Panel] Notification automatically read.");
                    }else{
                        if (checkInboxButton && !checkInboxButton.textContent.includes("🔔")) {
                            checkInboxButton.textContent += " 🔔";
                        }
                        console.log("CheckInbox", checkInboxButton);
                        console.log("[GGn Control Panel] Notification received.");

                    }
                } else {
                    // Remove the bell emoji if there are no unread messages
                    if (checkInboxButton) {
                        checkInboxButton.textContent = "Check Inbox";
                    }
                }
            } else {
                console.error("[GGn Control Panel] checkForUnreadMessages() ERROR - No messages or invalid messages format:", inbox);
            }
        } catch (error) {
            console.error("[GGn Control Panel] ERROR - While fetching inbox messages:", error);
        }
    }

    // Function to dynamically add CSS to the head of the document
    function addButtonStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            #button-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                gap: 20px;
            }

            .custom-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 20px;
            font-size: 18px;
            background-color: #444;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
          }

          .custom-button:hover {
            background-color: #555;
          }
        `;
        document.head.appendChild(style);
    }

    function addFilterStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #filter-container {
                 display: flex;
                 justify-content: space-evenly;
                 gap: 20px;
            }

            #filter-container:empty {
                display: none;
            }

            #post-container {
               display: flex;
               justify-content: space-evenly;
               gap: 20px;
            }

            #post-container:empty {
                display: none;
            }

            .search-filter {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #444;
                border-radius: 5px;
                background-color: #333;
                color: #fff;
                box-sizing: border-box;
            }
        `;
        document.head.appendChild(style);
    }

    async function init(){
        //Initialize global variables
        currentTorrentPage = await fetchPagination();
        minimized = localStorage.getItem("panelMinimized") === "true";
        // Initialize the control panel
        await createControlPanel();
        adjustControlPanelScale();
        // Minimize it according to memory
        if(minimized){
            await createControlPanelMinified();
        }
        // Immediately check for unread messages
        await checkForUnreadMessages();
        // Start Cron-Jobs
        setInterval(checkForUnreadMessages, 100000); // Happens every 100 Seconds
        window.addEventListener("resize", adjustControlPanelScale);
    }

    // Call the function to add styles to the document (so other userscripts can use them to integrate with the control panel)
    addButtonStyles();
    addFilterStyles();
    init();
})();

