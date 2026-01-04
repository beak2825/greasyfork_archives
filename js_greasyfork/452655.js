// ==UserScript==
// @name        MH - FLRT Tool
// @version     2.1.0
// @description Free Leech Return Tradables
// @author      Maidenless
// @match       https://www.mousehuntgame.com/*
// @match       https://apps.facebook.com/mousehunt/*
// @icon        https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace   https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/452655/MH%20-%20FLRT%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/452655/MH%20-%20FLRT%20Tool.meta.js
// ==/UserScript==

// Global variables
// Chest name : type
let treasureChestsPair = {};
// Friend data directory
let friendData;
// Friend name : snuid
let friendList = {};
// User data
let sendSnuid;
let sendHID;
// Chest to open
let chestSelected;
let chestSelectedKey;
// Items from chests
let itemAll = [];

const initFlrtTool = () => {
    const injectLocation = document.querySelector(".inventory .treasure_chests");

    // Check if injectLocation is found before proceeding
    if (injectLocation) {
        const flrtTP = document.createElement("li");
        flrtTP.classList.add("flrt_tool");
        const flrtBtn = document.createElement("a");
        flrtBtn.innerText = "FLRT Tool";
        console.log("FLRT Tool loaded.");
        flrtBtn.addEventListener('click', handleFlrtButtonClick);

        // Icon
        const icon = document.createElement("div");
        icon.className = "icon";
        flrtBtn.appendChild(icon);
        flrtTP.appendChild(flrtBtn);

        // Insert after injectLocation
        injectLocation.insertAdjacentElement("afterend", flrtTP);
    }
};

// Initialize the tool
window.addEventListener('load', () => {
    initFlrtTool();
});

const handleFlrtButtonClick = async (event) => {
    console.log("Initializing tool box...")
    event.preventDefault();
    // Get all treasure chests in inventory and load toolbox
    const flrtToolBox = document.getElementById("flrt-tool-box");
    if (flrtToolBox) {
        document.body.removeChild(flrtToolBox);
    }
    const promise = await getTreasureLists();
    render(promise, event);
};

//Rendering the tool box
// Helper function to create an element with specific properties
const createElement = (type, properties = {}) => {
    const element = document.createElement(type);

    // Set standard properties
    Object.entries(properties).forEach(([key, value]) => {
        if (key === "style" && typeof value === "object") {
            Object.assign(element.style, value);
        } else {
            element[key] = value;
        }
    });

    return element;
};

const render = (treasureChestsList, event) => {
    // Create the main div
    console.log("Rendering tool box...");
    const div = createElement("div", {
        id: "flrt-tool-box",
        style: {
            backgroundColor: "#F5F5F5",
            position: "fixed",
            zIndex: "9999",
            left: localStorage.getItem('MHFLRTToolElementLeft') || `${event.pageX}px`,
            top: localStorage.getItem('MHFLRTToolElementTop') || `${event.pageY}px`,
            border: "solid 3px #696969",
            borderRadius: "20px",
            padding: "10px",
            textAlign: "center",
            fontSize: "12px"
        }
    });

    const refreshChestsButton = createElement("button", {
        textContent: "↻",
        style: {
            marginLeft: "5px",
            cursor: "pointer"
        },
        onclick: async () => {
            const newTreasureChestPairs = await getTreasureLists();
            updateChestSelectionBox(newTreasureChestPairs);
        }
    });

    const updateChestSelectionBox = (treasureChestPairs) => {
        // Clear existing options
        chest_select.innerHTML = "";

        // Populate the chestSelectionBox with new options
        Object.keys(treasureChestPairs).forEach(chestName => {
            const option = createElement("option", { innerText: chestName });
            chest_select.appendChild(option);
        });
    };

    // Create the close button
    const closeButton = createElement("button", {
        textContent: "Close",
        style: {
            marginLeft: "5px",
            cursor: "pointer",
        },
        onclick: () => {
            document.body.removeChild(div);
        }
    });

    // Create the drag button
    const dragButton = createElement("button", {
        textContent: "Drag me",
        style: {
            marginLeft: "5px",
            cursor: "move"
        }
    });

    // Make the div draggable by the drag button
    dragElement(div, dragButton);

    // Create the button div and append the close button to it
    const btnDiv = createElement("div");
    btnDiv.appendChild(closeButton);
    btnDiv.appendChild(dragButton);
    div.appendChild(btnDiv);

    // Create the header
    const toolHeader = createElement("div", {
        className: "flrt-tool-header",
        textContent: "FLRT Tool",
        style: {
            height: "21px",
            textAlign: "center",
            marginTop: "10px",
            fontWeight: "bold",
            cursor: "FLRT Tool Menu"
        }
    });
    div.appendChild(toolHeader);

    // Append the main div to the body
    document.body.appendChild(div);

    // Content (Chest + Hunter ID OR friend ID)
    const toolContent = createElement("div", { id: "flrt-tool-content" });

    // Content Table
    const contentTable = createElement("table", {
        id: "flrt-tool-table",
        style: {
            textAlign: "left",
            borderSpacing: "1em 0"
        }
    });

    // Content 1 : Chest Selection
    const chest_row = createElement("tr");
    const chest_td1 = createElement("td", { style: { textAlign: "right" } });
    const chest_td2 = createElement("td");

    const chest_label = createElement("label", { innerText: "Chest: " });
    chest_td1.appendChild(chest_label);

    // Chest functions
    // Renders all treasure chests as OPTION type
    const chest_select = createElement("select", { id: "chestSelectionBox", style: { width: "auto" } });
    Object.keys(treasureChestsList).forEach(chestName => {
        const option = createElement("option", { innerText: chestName });
        chest_select.appendChild(option);
    });

    // Resume chest appendment
    chest_td2.appendChild(chest_select);
    chest_td2.appendChild(refreshChestsButton);
    chest_row.appendChild(chest_td1);
    chest_row.appendChild(chest_td2);
    contentTable.appendChild(chest_row);

    console.log("Chest options created.");

    // Content 2: Hunter ID and Friend ID
    // Hunter ID
    const hid_row = createElement("tr");
    const hid_td1 = createElement("td");
    const hid_td2 = createElement("td");

    // Radio function
    const processRadio = async () => {
        // Allows only 1 radio to be clicked
        const isHidRadioChecked = hid_radio.checked;
        hid_input.disabled = !isHidRadioChecked;
        friend_input.disabled = isHidRadioChecked;
        hid_input.value = isHidRadioChecked ? "" : hid_input.value;
        friend_input.value = isHidRadioChecked ? friend_input.value : "";

        if (!isHidRadioChecked) {
            // Gets the friend ID from server
            const list = await getFriendID();

            // Create a datalist element
            let datalist = document.createElement("datalist");
            datalist.id = "friend-input-list";

            // Populate the datalist with options
            for (let key in list) {
                let option = document.createElement("option");
                option.value = key;
                datalist.appendChild(option);
            }

            // Attach the datalist to the input
            friend_input.setAttribute("list", "friend-input-list");
            friend_input.parentNode.appendChild(datalist);
        }
    }

    const hid_radio = createElement("input", {
        type: "radio",
        name: "mi-hunter-friend",
        id: "mi-hunter-radio",
        style: { verticalAlign: "middle", marginTop: "-2px" },
        checked: true,
        onchange: processRadio
    });

    hid_td1.append(hid_radio, createElement("label", {
        innerHTML: "Hunter ID: ",
        htmlFor: "mi-radio-friend"
    }));

    const hid_input = createElement("input", {
        type: "text",
        id: "flrt-hid-input",
        placeholder: "Your maptain's Hunter ID",
        pattern: "\\d*", // Only allow digits
    });

    hid_td2.appendChild(hid_input);

    hid_row.append(hid_td1, hid_td2);
    contentTable.appendChild(hid_row);

    console.log("Hunter ID selection created.")

    // Friend ID
    const friend_row = createElement("tr");
    const friend_td1 = createElement("td", { style: { textAlign: "right" } });
    const friend_td2 = createElement("td");

    const friend_radio = createElement("input", {
        type: "radio",
        name: "mi-hunter-friend",
        id: "mi-friend-radio",
        style: { verticalAlign: "middle", marginTop: "-2px", position: "relative", right: "17.5px" },
        onchange: processRadio
    });

    friend_td1.append(friend_radio, createElement("label", {
        innerHTML: "Friend:",
        htmlFor: "mi-radio-friend"
    }));

    const friend_input = createElement("input", {
        type: "text",
        id: "friend-input-id",
        disabled: true
    });
    friend_td2.appendChild(friend_input);

    friend_row.append(friend_td1, friend_td2);
    contentTable.appendChild(friend_row);

    toolContent.appendChild(contentTable);
    console.log("Friend ID selection created.")

    // Helper function to create a profile table
    function createProfileTable(res) {
        const profileTable = createElement("table", {
            id: "profile-table",
            style: {
                borderSpacing: "1em 2px"
            }
        });
        const profileData = [
            { title: "Name:", value: res.name },
            { title: "Title:", value: res.rank },
            { title: "Location:", value: res.location }
        ];
        profileData.forEach(data => {
            const row = createElement("tr", {});
            const titleCell = createElement("td", { textContent: data.title });
            const valueCell = createElement("td", { textContent: data.value });
            row.appendChild(titleCell);
            row.appendChild(valueCell);
            profileTable.appendChild(row);
        });
        return profileTable;
    }

    // Profile button
    const contentAction = createElement("div", { id: "flrt-tool-action" });
    const profileContainer = createElement("div", { id: "profile-container" });

    const profileBtn = createElement("button", {
        id: "mi-profile-btn",
        textContent: "Select chest, get profile",
        style: {
            cursor: "pointer",
            marginTop: "10px"
        },
        onclick: async () => {
            try {
                if (hid_input.disabled) {
                    sendSnuid = friendList[friend_input.value];
                    sendHID = friendData[sendSnuid].user_id;
                } else {
                    sendHID = hid_input.value;
                }

                if (!/^\d*$/.test(sendHID)) {
                    // Show an alert if sendHID is not an integer
                    alert("Please enter a valid integer for Hunter ID.");
                    return;
                }

                console.log(`Entered Hunter ID is ${sendHID}`);
                chestSelected = treasureChestsPair[chest_select.value];
                chestSelectedKey = chest_select.value;
                console.log(`Selected chest is ${chestSelected}`);
                const res = await getProfile(sendHID);
                if (res) {
                    // Display the profile
                    const image = createElement("img", {
                        style: {
                            width: "40px",
                            height: "40px",
                            margin: "10px"
                        },
                        src: res.profile_pic
                    });

                    // Clear the contents of profileContainer
                    while (profileContainer.firstChild) {
                        profileContainer.removeChild(profileContainer.firstChild);
                    }
                    profileContainer.appendChild(image);
                    profileContainer.appendChild(createProfileTable(res));

                    // Add a second button
                    const confirmBtn = createElement("button", {
                        id: "mi-confirm-btn",
                        textContent: `Confirm hunter and open ${chestSelectedKey}`,
                        style: {
                            cursor: "pointer",
                            marginTop: "10px"
                        },
                        onclick: async () => {
                            // Remove all old things
                            chest_label.remove();
                            document.querySelector('label[for="mi-hunter-radio"]')?.remove();
                            document.querySelector('label[for="mi-friend-radio"]')?.remove();
                            chest_select.remove();
                            refreshChestsButton.remove();
                            hid_row.remove();
                            friend_row.remove();
                            profileContainer.remove();
                            profileBtn.remove();
                            confirmBtn.remove();

                            // Display the chosen sendHID and res.name
                            const chosenChestAndHunter = document.createElement("div");
                            chosenChestAndHunter.innerHTML = `You are opening a ${chestSelectedKey}.<br>You are sending (some of) the contents to ${res.name}.<br> Their hunter ID is ${sendHID}.<br><br>Close the tool box to cancel.`;
                            console.log(chosenChestAndHunter.innerHTML);
                            contentAction.appendChild(chosenChestAndHunter);

                            // Open the chest and record the contents
                            try {
                                const chestResult = await openChest(chestSelected);
                                const tradability = await checkTradable(chestResult);
                                createLootTable(tradability);
                            } catch (error) {
                                console.error("An error occurred:", error);
                            }
                        }
                    });
                    profileContainer.appendChild(confirmBtn);
                }
            } catch (error) {
                console.log("Error getting profile:", error)
            }
        }
    });

    // Append the profile container to the parent element
    contentAction.appendChild(profileBtn);
    contentAction.appendChild(profileContainer);

    toolContent.appendChild(contentAction);

    // Final appendments
    div.appendChild(toolContent);
    document.body.appendChild(div);
    console.log("Tool box rendered.")
};

// Helper function to make a POST request and parse the response
const postAndParse = async (url, payload) => {
    const { unique_hash: uh } = user;
    const res = await postReq(url, `${payload}&uh=${uh}`);
    return JSON.parse(res.responseText);
};

// Gets the List of Treasure Chests from inventory
const getTreasureLists = async () => {
    console.log("Looking for all treasure chests in inventory...");
    const response = await postAndParse(
        "https://www.mousehuntgame.com/managers/ajax/pages/page.php",
        `sn=Hitgrab&hg_is_ajax=1&page_class=Inventory&page_arguments%5Btab%5D=special&page_arguments%5Bsub_tab%5D=all&page_arguments%5Btag%5D=treasure_chests&last_read_journal_entry_id=${lastReadJournalEntryId}`
    );

    const subDirect = response.page.tabs[4].subtabs[0].tags;
    const treasureChestsItem = subDirect.find(item => item.name == "Treasure Chests");
    const treasureChestsList = treasureChestsItem.items;

    // List of desired treasure chests
    const desiredChests = [
        "Rare New Year's Party Treasure Chest",
        "Rare Halloween Trick Treasure Chest",
        "Rare Naughty Treasure Chest",
        "Fort Rox Treasure Chest",
        "Rare Fort Rox Treasure Chest",
        "Warpath Treasure Chest",
        "Rare Warpath Treasure Chest",
        "Rare Empyrean Sky Palace Treasure Chest",
        "Rare Folklore Forest Prelude Treasure Chest",
        "Rare Bountiful Beanstalk Treasure Chest",
        "Rare Draconic Depths Treasure Chest",
    ];

    // Define a mapping of treasure chests to dates
    const chestDates = {
        "Rare New Year's Party Treasure Chest": { start: new Date('2024-12-06'), end: new Date('2025-01-17') },
        "Rare Naughty Treasure Chest": { start: new Date('2024-12-06'), end: new Date('2025-01-17') },
        "Rare Halloween Trick Treasure Chest": { start: new Date('2024-10-01'), end: new Date('2024-11-31') },
    };

    // Get the current date
    const currentDate = new Date();

    // Filter treasureChestsList to only include chests in desiredChests
    const filteredChestsList = treasureChestsList.filter(chest => {
        // If the chest is not in the desiredChests list, exclude it
        if (!desiredChests.includes(chest.name)) {
            return false;
        }

        // If the chest has a date range, check if the current date is within that range
        const dates = chestDates[chest.name];
        if (dates) {
            const { start, end } = dates;
            if (!(start <= currentDate && currentDate <= end)) {
                return false;
            }
        }

        // If the chest passed all checks, include it
        return true;
    });

    // Use Object.entries to preserve the order of key-value pairs
    treasureChestsPair = Object.fromEntries(filteredChestsList.map(chest => [chest.name, chest.type]));

    if (Object.keys(treasureChestsPair).length === 0) {
        console.log("No treasure chests found.");
    } else {
        console.log("Treasure chests found.");
    }
    return treasureChestsPair;
};

// Gets Friend IDs from server
const getFriendID = async () => {
    const data = await postAndParse(
        "https://www.mousehuntgame.com/managers/ajax/users/userData.php",
        "sn=Hitgrab&hg_is_ajax=1&get_friends=true"
    );
    if (data.user_data) {
        friendData = data.user_data;
        Object.entries(friendData).forEach(([snuid, { name }]) => {
            friendList[name] = snuid;
        });
        return friendList;
    }
};

// Opens Chest
const openChest = async (chest) => {
    console.log(`Opening ${chest}...`);
    const response = await postAndParse(
        "https://www.mousehuntgame.com/managers/ajax/users/useconvertible.php",
        `sn=Hitgrab&hg_is_ajax=1&item_type=${chest}&item_qty=1`
    );
    if (response.convertible_open.items) {
        itemAll = response.convertible_open.items.map(item => item);
        console.log("Chest contents recorded.");
        return itemAll;
    } else {
        console.error("Failed to open chest or chest is empty.");
        return [];
    }
};

// Checks whether items are tradable or not and adds a property value isTradable
const checkTradable = async (itemAll) => {
    console.log("Checking tradability of items...");
    const promises = itemAll.map(async (item) => {
        const response = await postAndParse(
            "https://www.mousehuntgame.com/managers/ajax/users/userInventory.php",
            `sn=Hitgrab&hg_is_ajax=1&item_types%5B%5D=${item.type}&action=get_items`
        );
        item.isTradable = response.items[0] ? response.items[0].is_givable || response.items[0].is_tradable : false;
        return item;
    });
    const results = await Promise.all(promises);
    console.log("Tradability checked.");
    return results;
};

const createLootTable = (itemAll) => {
    // Log the creation of the loot table
    console.log("Creating loot table...");

    // Remove any existing loot table divs
    document.querySelectorAll("#mi-loot-table-div").forEach(el => el.remove());

    // Create the loot table div with the specified styles
    const lootTableDiv = createElement("div", {
        id: "mi-loot-table-div",
        style: {
            backgroundColor: "#F5F5F5",
            position: "fixed",
            zIndex: "9999",
            left: "18vw",
            top: "20vh",
            border: "solid 2px #696969",
            borderRadius: "20px",
            padding: "10px",
            textAlign: "center",
            fontSize: "12px"
        }
    });

    // Create the close button and append it to the loot table div
    const closeHeader = createElement("div");
    const closeButton = createElement("button", {
        id: "close-button",
        innerText: "x",
        style: {
            marginLeft: "5px",
            cursor: "pointer"
        },
        onclick: () => document.body.removeChild(lootTableDiv)
    });
    closeHeader.appendChild(closeButton);
    lootTableDiv.appendChild(closeHeader);

    // Define common styles for table headers
    const commonStyles = {
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#eaeef0",
        padding: "3px",
        border: "0.5px solid #696969"
    };

    // Function to create a table section
    const createTableSection = (title, items, includeCheckbox) => {
        // Create the section div and header
        const sectionDiv = createElement("div");
        const header = createElement("h1", {
            id: `${title.toLowerCase()}-header`,
            innerText: title,
            style: {
                fontWeight: "bold",
                paddingTop: "4px"
            }
        });
        sectionDiv.appendChild(header);

        // Create the table with the specified styles
        const table = createElement("table", {
            id: `${title.toLowerCase()}-table`,
            style: {
                borderSpacing: "1em 6px",
                borderCollapse: "collapse"
            }
        });

        // Create the table headers
        const headers = [
            includeCheckbox ? createElement("th", {
                id: `${title.toLowerCase()}-table-item-checkbox`,
                style: {}
            }) : null,
            createElement("th", {
                id: `${title.toLowerCase()}-table-item-heading`,
                innerText: "Item",
                style: Object.assign({}, commonStyles, { width: "100px" })
            }),
            createElement("th", {
                id: `${title.toLowerCase()}-table-quantity-heading`,
                innerText: "Quantity",
                style: commonStyles
            })
        ].filter(Boolean);

        // Append the headers to the table
        headers.forEach(header => {
            table.appendChild(header);
        });

        // Create the table body and append it to the table
        const createTableBody = (items, includeCheckbox) => {
            const tbody = createElement("tbody", {
                id: `${title.toLowerCase()}-table-body`
            });

            items.forEach((item, index) => {
                const row = createElement("tr", {
                    id: `${item.name}-row`,
                    style: {
                        backgroundColor: index % 2 === 0 ? "white" : ""
                    }
                });

                if (includeCheckbox) {
                    const checkboxCell = createElement("td", {});
                    const checkbox = createElement("input", {
                        type: "checkbox",
                        id: `${item.name}-checkbox`,
                        className: `mi-${title.toLowerCase()}-item`,
                        name: `mi-${title.toLowerCase()}-item${index}`,
                        style: {
                            verticalAlign: "middle",
                            marginTop: "-2px"
                        },
                        checked: item.type !== "gold_stat_item"
                    });
                    checkboxCell.appendChild(checkbox);
                    row.appendChild(checkboxCell);
                }

                const itemCell = createElement("td", {
                    innerText: item.name,
                    id: `${item.name}-item-cell`,
                    style: {
                        textAlign: "center",
                        border: "0.5px solid #696969",
                        padding: "3px"
                    }
                });
                row.appendChild(itemCell);

                const quantityCell = createElement("td", {
                    innerText: item.quantity,
                    id: `${item.name}-quantity-cell`,
                    style: {
                        textAlign: "center",
                        border: "0.5px solid #696969",
                        padding: "3px"
                    }
                });
                row.appendChild(quantityCell);

                tbody.appendChild(row);
            });

            return tbody;
        };
        const tableBody = createTableBody(items, includeCheckbox);
        table.appendChild(tableBody);

        // Append the table to the section div
        sectionDiv.appendChild(table);

        // Return the section div
        return sectionDiv;
    };

    // Filter the items into tradable and untradable
    const tradableItems = itemAll.filter(item => item.isTradable);
    const untradableItems = itemAll.filter(item => !item.isTradable);

    // Create the tradable and untradable sections
    const tradableSection = createTableSection("Tradable", tradableItems, true);
    const untradableSection = createTableSection("Untradable", untradableItems, false);

    // Append the sections to the loot table div
    lootTableDiv.append(tradableSection, untradableSection);

    // Create the send item button
    const sendItemBtn = document.createElement("button");
    sendItemBtn.id = "mi-item-cfm-btn";
    sendItemBtn.textContent = "Send Selected Items";
    sendItemBtn.style.cursor = "pointer";
    sendItemBtn.style.marginTop = "10px";

    // Add the onclick event
    sendItemBtn.onclick = async function () {
        // Disable the button to prevent double clicking
        this.disabled = true;

        // Create a list that lists down items that are checked
        const checkList = [];
        // Get the list of tradables which are checked
        const toCheckList = document.querySelectorAll(".mi-tradable-item");
        for (let i = 0; i < toCheckList.length; i++) {
            if (toCheckList[i].checked) {
                // Add item to list
                let item = toCheckList[i].parentNode.nextSibling.innerText;
                checkList.push(item);
            }
        }

        // Send items
        if (checkList.length > 0) {
            const sendResults = await sendItems(checkList);

            lootTableDiv.remove();

            let alertMessage = "";

            if (sendResults.successfulItems.length > 0) {
                alertMessage += `Successfully sent items:\n${sendResults.successfulItems.join('\n')}`;
            }

            if (sendResults.failedItems.length > 0) {
                if (alertMessage.length > 0) {
                    alertMessage += "\n\n";  // Add line break if there were successful items
                }
                alertMessage += `Failed to send items:\n${sendResults.failedItems.join('\n')}\nPlease send these manually to ${sendHID}.`;
            }

            // Show the alert and wait for it to be closed
            console.log(alertMessage);
            alert(alertMessage);

            // Re-initialize the FLRT Tool
            const fakeEvent = new MouseEvent("click");
            await handleFlrtButtonClick(fakeEvent);
        } else {
            alert("No items selected to send.");
        }

        // Re-enable the button
        this.disabled = false;
    };

    // Append the confirm button to the loot table div
    lootTableDiv.appendChild(sendItemBtn);

    // Append the loot table div to the body
    document.body.appendChild(lootTableDiv);
    console.log("Loot table created.");
};

const getProfile = async (sendHID) => {
    console.log("Getting profile...");
    try {
        const res = await postReq(
            "https://www.mousehuntgame.com/managers/ajax/pages/friends.php",
            `sn=Hitgrab&hg_is_ajax=1&action=community_search_by_id&user_id=${sendHID}&uh=${user.unique_hash}`
        );
        const response = JSON.parse(res.responseText);

        if (response) {
            sendSnuid = response.friend.sn_user_id;

            const profileRes = await postReq(
                "https://www.mousehuntgame.com/managers/ajax/pages/page.php",
                `sn=Hitgrab&hg_is_ajax=1&page_class=HunterProfile&page_arguments%5Bsnuid%5D=${sendSnuid}&last_read_journal_entry_id=${lastReadJournalEntryId}&uh=${user.unique_hash}`
            );
            const profileResponse = JSON.parse(profileRes.responseText);

            if (profileResponse) {
                const userPage = profileResponse.page.tabs.profile.subtabs[0];
                const { name, user_id: id, title_name: rank, gold_formatted: gold, environment_name: location, profile_pic } = userPage;

                const recipientData = {
                    name,
                    id,
                    rank,
                    gold,
                    location,
                    profile_pic
                };

                console.log("Profile retrieved.");
                return recipientData;
            }
        }
    } catch (error) {
        console.error("Error getting profile:", error);
    }

};

const sendItems = async (checkList) => {
    console.log("Sending items...");
    const results = {
        successfulItems: [],
        failedItems: []
    };

    for (const item of checkList) {
        const index = itemAll.findIndex(i => i.name === item);
        const { quantity: item_quantity, type: item_type} = itemAll[index];

        try {
            const res = await postReq("https://www.mousehuntgame.com/managers/ajax/users/supplytransfer.php",
                `sn=Hitgrab&hg_is_ajax=1&receiver=${sendSnuid}&uh=${user.unique_hash}&item=${item_type}&item_quantity=${item_quantity}`
            );

            let response;
            try {
                response = JSON.parse(res.responseText);
            } catch (error) {
                console.error("Failed to parse response:", error);
                results.failedItems.push(`+${item_quantity} ${item}`);
                continue;
            }

            if (response.success) {
                console.log(`Sent +${item_quantity} ${item}`);
                results.successfulItems.push(`+${item_quantity} ${item}`);
            } else {
                console.log(`Failed to send ${item}`);
                results.failedItems.push(`+${item_quantity} ${item}`);
            }
        } catch (error) {
            console.error("Error sending item:", error);
            results.failedItems.push(`+${item_quantity} ${item}`);
        }
    }

    return results;
};

const postReq = (url, form) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr);
            } else {
                reject(new Error(`Request failed with status ${xhr.status}`));
            }
        };
        xhr.onerror = () => {
            reject(new Error("Network error"));
        };
        xhr.send(form);
    });
};

const dragElement = (elmnt, dragEl) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const dragMouseDown = (e) => {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
    }

    dragEl.addEventListener('mousedown', dragMouseDown);

    const elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = `${elmnt.offsetTop - pos2}px`;
        elmnt.style.left = `${elmnt.offsetLeft - pos1}px`;

        // Store the position in localStorage
        localStorage.setItem('MHFLRTToolElementTop', elmnt.style.top);
        localStorage.setItem('MHFLRTToolElementLeft', elmnt.style.left);
    }

    const closeDragElement = () => {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
    }
};
