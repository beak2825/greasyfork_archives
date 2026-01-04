// ==UserScript==
// @name         Gixen AutoSnipe AutoFill
// @namespace    https://greasyfork.org/en/users/922168-mark-zinzow
// @version      2.18
// @description  Add AutoSnipe to Gixen button with AutoFill, comments and show auctions added 3/27/25
// @author       Mark Zinzow
// @match        https://www.gixen.com/autosnipe.php*
// @match        https://www.gixen.com/main/home_2.php?sessionid=*
// @match        https://www.ebay.com/itm/*
// @match        https://www.ebay.com/sch/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// 
// @downloadURL https://update.greasyfork.org/scripts/465095/Gixen%20AutoSnipe%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/465095/Gixen%20AutoSnipe%20AutoFill.meta.js
// ==/UserScript==

/* This script speeds up adding lots of auctions to Gixen using the Gixen browser extension:

Gixen eBay Sniper Autosnipe - Chrome Web Store
https://chrome.google.com/webstore/detail/gixen-ebay-sniper-autosni/nfjjhbbnailabfbenccobieecimkbmji

Set the bid and Group variables to match what you are using for a series of auction items.
Clear storage and set them for another after you win the first!

Items added with this script are noted in searches with "in Gixen" appended to the auction title.
When viewing an item already added while using this script, the Add to Gixen button is relabled Already in Gixen.

*/


(function() {
    'use strict';

    // ==========================================================
    //                        CONFIGURATION
    // ==========================================================

    // Set to 1 to enable color-coding, class name display, and storage logging.
    // Set to 0 for normal operation (no visual changes, faster processing).
    var DEBUG_MODE = 0;

    const CONFIG_DEFAULT_BID = "25"; // Default bid used if no stored bid is found for a group.
    const CONFIG_DEFAULT_GROUP = "1"; // Default group used if no last-used group is stored.

    // List of container class names to skip (Sponsored Listings, etc.).
    // Add unwanted classes here when DEBUG_MODE is 0 to filter them out.
    const CONFIG_AD_CLASS_FILTERS = [
        // 's-sponsored-sg-grid-item', // Example ad container class
        // 'b-ad-container'             // Example ad container class
    ];

    // ==========================================================
    //                     END CONFIGURATION
    // ==========================================================

    const currentUrl = window.location.href;

    function itemSaved(key, item) { // Find if we have a particular item in storage
    let sids = GM_getValue(key, []);
    return sids.includes(item);
    }

    function saveList(key, item) { // Add a single item to storage, or a list in storage
    let items = GM_getValue(key, []);
    if (DEBUG_MODE) console.log("Got", items.length, "in key: " + key);
    if (!items.includes(item)) {
        items.push(item);
        items = items.sort((a, b) => a - b); // sort our list for easy search in storage
        GM_setValue(key, items);
        if (DEBUG_MODE) console.log("Stored", items.length, " in ", key);
            GM_setValue(key + '-length', items.length); // For reference when looking at Storage
        }
    }

    function removeItem(key, item) { // Remove an auction from storage if we view bidding ended page
    let items = GM_getValue(key, []);
    if (DEBUG_MODE) console.log("Got", items.length, "in key: " + key);
    if (items.includes(item)) {
            items.splice(items.indexOf(item), 1);
            GM_setValue(key, items);
            if (DEBUG_MODE) console.log("Removed", item, "from", key);
            //if (key == 'items')
                GM_setValue(key + '-length', items.length); // For reference when looking at Storage
        }
    }

function saveObject(key, id, comment) {
    // Retrieve the existing array from storage, defaulting to an empty array
    let existingData = GM_getValue(key, []);

    // Ensure the retrieved value is an array
    if (!Array.isArray(existingData)) {
        if (DEBUG_MODE) console.warn("Stored data for key " + key + " was not an array. Resetting.");
        existingData = [];
    }

    // Find the index of the existing object with the matching id
    const existingIndex = existingData.findIndex(obj => obj.id === id);

    if (existingIndex !== -1) {
        // If object exists, update its comment, preventing duplicates
        existingData[existingIndex].comment = comment;
        if (DEBUG_MODE) console.log(`Updated comment for item ID: ${id}`);
    } else {
        // If object does not exist, add the new object to the array
        existingData.push({id: id, comment: comment});
        if (DEBUG_MODE) console.log(`Added new comment for item ID: ${id}`);
    }

    // Save the updated array back to storage
    GM_setValue(key, existingData);
}



function getObject(key, id) {
    // Retrieve the array from storage
    let list = GM_getValue(key, []);

    // Ensure the retrieved value is an array
    if (!Array.isArray(list)) {
        if (DEBUG_MODE) console.log("The stored data is not an array.");
        return false; // Return false if the data isn't structured as an array
    }

    // Iterate through the array to find an object with the matching id
    for (let obj of list) {
        if (obj.id === id) {
            // Return the matching object
            return obj;
        }
    }

    // Return false if no matching object is found
    return false;
}

// Helper function to extract all displayed item IDs on the Gixen page
function getDisplayedItemIDs(auctionRows) {
    const displayedIDs = new Set();
    auctionRows.forEach(row => {
        let sid = null;

        // Try mobile/desktop (where ID is in first TD): Find a link in the first TD whose text is a pure number.
        let idLink = row.querySelector('td:first-child a');

        if (idLink) {
            let text = idLink.textContent.trim();
            if (/^\d+$/.test(text)) {
                sid = text;
            }
        }

        // Fallback for Desktop (where ID is often in the second TD):
        if (!sid) {
            idLink = row.querySelector('td:nth-child(2) a');
            if (idLink) {
                let text = idLink.textContent.trim();
                if (/^\d+$/.test(text)) {
                    sid = text;
                }
            }
        }

        if (sid) {
            displayedIDs.add(sid);
        }
    });
    return Array.from(displayedIDs);
}

// Function to convert a string (like a class name) into a consistent, unique color
function stringToColor(str) {
    let hash = 0;
    // Simple hash function for consistent color generation
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    // Use the hash to generate 3 color components (R, G, B)
    for (let i = 0; i < 3; i++) {
        // Take a byte from the hash, offset by 128 to ensure some brightness
        const value = ((hash >> (i * 8)) & 0xFF);
        // Ensure the value is not too dark (by offsetting), and limit to 255
        const component = Math.min(255, (value % 128) + 100);
        color += ('00' + component.toString(16)).substr(-2);
    }
    return color;
}


    if (currentUrl.indexOf("www.gixen.com/autosnipe.php") > -1) { // @match https://www.gixen.com/autosnipe.php*
        setTimeout(function() {

            const maxBidInput = document.getElementById('maxbid');
            const groupInput = document.getElementById("snipegroup");

            // --- 1. Load Stored Defaults ---
            const currentGroup = GM_getValue('currentGroup', CONFIG_DEFAULT_GROUP);
            let groupBids = GM_getValue('groupBids', {});
            const defaultBid = groupBids[currentGroup] || CONFIG_DEFAULT_BID;

            if (DEBUG_MODE) console.log(`DEBUG: Loading Group ${currentGroup} with Bid ${defaultBid}`);

            // Apply loaded values
            maxBidInput.value = defaultBid;
            groupInput.value = currentGroup;

            // --- 2. Save New Defaults Function ---
            // Saves the bid for the current group and updates the last-used group
            function saveDefaults() {
                const newGroup = groupInput.value.trim();
                const newBid = maxBidInput.value.trim();

                // Save the currently used group as the default for next time
                if (newGroup) {
                    GM_setValue('currentGroup', newGroup);
                }

                // Save the bid for this specific group
                if (newGroup && newBid) {
                    // Refresh groupBids to ensure we're using the latest state
                    groupBids = GM_getValue('groupBids', {});
                    groupBids[newGroup] = newBid;
                    GM_setValue('groupBids', groupBids);
                    if (DEBUG_MODE) console.log(`DEBUG: Saved default bid "${newBid}" for Group ${newGroup}.`);
                }
            }

            // --- 3. Attach Listeners to Save Changes Immediately ---
            // If the user manually changes the values, save them before auto-submission.
            maxBidInput.addEventListener('change', saveDefaults);
            groupInput.addEventListener('change', saveDefaults);

            // Call saveDefaults immediately before auto-clicking,
            // in case the user quickly opens the window and the script's default values are new.
            saveDefaults();

            const urlParams = new URLSearchParams(window.location.search);
            const itemId = urlParams.get('itemid');
            saveList('itemId', itemId);

        }, 500);

        // Auto-click the "Add" button - Increased delay to 9999ms to allow manual changes
        setTimeout(function() {
            // New check for element existence before calling .click()
            const addButton = document.querySelectorAll('input[type="submit"]')[1];
            if (addButton) {
                addButton.click();
            }
        }, 9999);

    } else if (currentUrl.indexOf("www.gixen.com/main/home_2.php?sessionid=") > -1) { // @match https://www.gixen.com/main/home_2.php?sessionid*

        // Use a 500ms delay to ensure the auction data (which may load dynamically) is present
        setTimeout(function() {

            // --- 1. Identify all starting auction block rows ---
            // Selects rows that start an auction block in mobile view (tr.dX.test)
            let mobileRows = document.querySelectorAll('tr.d1.test, tr.d0.test');
            // Selects rows that start an auction block in desktop view (tr.d1 or tr.d0 which has a <td> with rowspan="2")
            let desktopRows = Array.from(document.querySelectorAll('tr[class^="d"] > td[rowspan="2"]')).map(td => td.closest('tr'));

            // Combine and deduplicate the list of starting rows
            let auctionRows = [...new Set([...mobileRows, ...desktopRows])];

            // Fallback for older/simpler structures: just take all d1/d0 rows
            if (auctionRows.length === 0) {
                 auctionRows = document.querySelectorAll('tr.d1, tr.d0');
            }

            if (DEBUG_MODE) console.log(`DEBUG: Found ${auctionRows.length} total starting auction block rows to process.`);


            // --- 2. Clean Storage (Remove Deleted Items) WITH CONFIRMATION PROMPT ---
            const storedItemIDs = GM_getValue('itemId', []);
            const displayedItemIDs = getDisplayedItemIDs(auctionRows);

            if (DEBUG_MODE) console.log(`DEBUG: Stored IDs: ${storedItemIDs.length}, Displayed IDs: ${displayedItemIDs.length}`);

            const displayedSet = new Set(displayedItemIDs);
            const itemsToDelete = storedItemIDs.filter(id => !displayedSet.has(id));

            if (itemsToDelete.length > 0) {
                const itemIdsString = itemsToDelete.join(', ');
                const confirmationMessage = `Gixen AutoSnipe detected ${itemsToDelete.length} item(s) in local storage that are NOT currently on your Gixen home page list:\n\nIDs: ${itemIdsString}\n\nDo you want to PERMANENTLY remove these items from your Gixen AutoSnipe storage (This should only be done if you deleted them from Gixen)?`;

                if (confirm(confirmationMessage)) {
                    let itemsRemoved = 0;
                    itemsToDelete.forEach(id => {
                        removeItem('itemId', id);
                        itemsRemoved++;
                    });

                    if (DEBUG_MODE) {
                        console.log(`DEBUG: Cleaned storage. Removed ${itemsRemoved} item(s) not found on Gixen page.`);
                        alert(`Gixen AutoSnipe: Successfully removed ${itemsRemoved} item(s) from storage.`);
                    }
                } else {
                    if (DEBUG_MODE) console.log("DEBUG: Item removal cancelled by user.");
                }
            }

            // --- 3. Process Displayed Items (Add Comments) ---
            auctionRows.forEach((row, index) => {
                let sid = null;
                let descriptionCell = null;

                // Re-find SID using the same logic as the cleaning function
                let idLink = row.querySelector('td:first-child a');
                if (idLink) {
                    let text = idLink.textContent.trim();
                    if (/^\d+$/.test(text)) {
                        sid = text;
                    }
                }

                if (!sid) {
                    idLink = row.querySelector('td:nth-child(2) a');
                    if (idLink) {
                        let text = idLink.textContent.trim();
                        if (/^\d+$/.test(text)) {
                            sid = text;
                        }
                    }
                }

                if (!sid) {
                    if (DEBUG_MODE) console.log(`DEBUG: Row ${index} | Skipping (No numeric Item ID link found).`);
                    return; // No valid numeric Item ID found, skip row
                }

                // --- 4. Find the Description Cell (Varies by View) ---
                descriptionCell = row.querySelector('td[colspan="4"]');

                if (!descriptionCell) {
                    let nextRow = row.nextElementSibling;
                    if (nextRow && !nextRow.classList.contains('test')) {
                         descriptionCell = nextRow.querySelector('td[colspan="2"]');
                    }
                }

                if (!descriptionCell) {
                    if (DEBUG_MODE) console.log(`DEBUG: Row ${index} | Item ${sid}: Could not find description cell.`);
                    return; // Cannot insert comment, skip
                }

                // --- 5. Insert Comment (After Seller Info) ---
                let idobj = getObject('Coments', sid);

                if (idobj && idobj.comment) {
                    if (DEBUG_MODE) console.log(`DEBUG: Row ${index} | Item ${sid}: Found comment: ${idobj.comment}`);

                    // Create the elements
                    let commentBr = document.createElement("br");
                    let commentSpan = document.createElement("span");

                    commentSpan.textContent = idobj.comment;
                    commentSpan.style.color = "red";
                    commentSpan.style.fontWeight = "bold";

                    // The seller info is typically in the <i> tag. This is our insertion point.
                    let insertionPoint = descriptionCell.querySelector('i');

                    // Fallback insertion point for desktop view's internal table (if <i> isn't present)
                    if (!insertionPoint) {
                        insertionPoint = descriptionCell.querySelector('table');
                    }

                    if (insertionPoint) {
                        // Insert order matters when using insertAdjacentElement('afterend'):
                        // To get ...seller_info</i> <br> <span>comment</span> ...
                        // We must insert <span>comment</span> first, then <br>.
                        insertionPoint.insertAdjacentElement('afterend', commentSpan);
                        insertionPoint.insertAdjacentElement('afterend', commentBr);

                    } else {
                        // Final fallback: append to the end of the cell
                        descriptionCell.appendChild(commentBr);
                        descriptionCell.appendChild(commentSpan);
                    }

                    if (DEBUG_MODE) console.log(`DEBUG: Row ${index} | Item ${sid}: Inserted comment successfully.`);
                } else {
                    if (DEBUG_MODE) console.log(`DEBUG: Row ${index} | Item ${sid}: No comment found in storage.`);
                }
            });
        }, 500);

    } else if (currentUrl.indexOf("www.ebay.com/itm") > -1) { // @match  https://www.ebay.com/itm/*
        const id = currentUrl.split('/').at(-1).split('?')[0];
        let ENDED = 0;
        // 1st check to see if auction has ended!
        // Get all the span elements with the class name "ux-textspans ux-textspans--BOLD"
        let spans = document.getElementsByClassName("ux-textspans ux-textspans--BOLD");
        // Loop through the span elements
        for (let i = 0; i < spans.length; i++) {
          // Get the text content of the span element
          let text = spans[i].textContent;
          // Check if the text matches "Bidding has ended on this item."
          if (text === "Bidding has ended on this item.") {
            // If Bidding has ended, remove auction from storage
              removeItem('itemId',id);
            console.log("The element is on the page.");
            // Break the loop
            break;
          }
        }
        if (!ENDED) {

        if (itemSaved('itemId',id)) {
            setTimeout(function() {
            // Check if the element exists before attempting to set the innerHTML
            const gixenButton = document.querySelector('.ux-call-to-action.vilens-item.fake-btn.fake-btn--fluid.fake-btn--primary');
            if (gixenButton) {
                gixenButton.innerHTML = 'Already in Gixen';
            }
            }, 500); // Wait for Gixen Add button to load, then update it to reflect we've already added this auction
        }

        let idobj = getObject('Coments', id);
        let h1 = document.getElementsByClassName("x-item-title__mainTitle")[0];
        if (idobj) {
            // Create a new span element
            let span = document.createElement("span");
            // Set the text content and style of the span
            span.textContent = idobj.comment;
            span.style.color = "red";
            // Append the span as a child of the h1 element
            h1.appendChild(span);
        } else {
            let button = document.createElement("button");
            // Set the text content and id of the button
            button.textContent = "Add Comment";
            button.id = "add-comment";
            // Append the button as a child of h1 element
            h1.appendChild(button);
            // Define a function that takes key and id as parameters
            function addComment(key, id) {
              // Get a comment string from a dialog
              let comment = prompt("Enter your comment:");
              // Check if the comment is not empty or null
              if (comment) {
                // Store the comment with saveObject function
                saveObject(key, id, comment);
                // Alert the user that the comment is saved
                alert("Your comment is saved.");
              } else {
                // Alert the user that the comment is invalid
                alert("Your comment is invalid.");
              }
            }
            // Add an event listener to the button to run the function when clicked
            // Check if the button element exists before adding the event listener
            const addButton = document.getElementById('add-comment');
            if (addButton) {
                addButton.addEventListener("click", function() {
                  // Run the addComment function with the key and id
                  addComment('Coments', id);
                });
            }
        }
        }
    } else if (currentUrl.indexOf("www.ebay.com/sch") > -1) { // @match  https://www.ebay.com/sch/*

        // --- LINK SELECTOR LOGIC ---
        // 1. Try the most common modern class for item links.
        let links = document.querySelectorAll("a.s-item__link");

        // 2. Fallback to a highly robust selector that finds any link pointing to an item page.
        if (links.length === 0) {
            links = document.querySelectorAll("a[href*='/itm/']");
            if (DEBUG_MODE) console.log(`DEBUG: Using generic selector a[href*='/itm/'], found ${links.length} potential links.`);
        } else {
            if (DEBUG_MODE) console.log(`DEBUG: Using a.s-item__link selector, found ${links.length} potential links.`);
        }

        // Storage for logging class names of processed items (only if DEBUG_MODE is true)
        let processedClasses = GM_getValue('ProcessedLinkClasses', {});
        let processedCount = 0;

        for (let i = 0; i < links.length; i++) {

            const link = links[i];

            // Try to find the closest parent search result container (LI or DIV)
            const resultContainer = link.closest('li, div.s-item__wrapper');

            if (!resultContainer) {
                if (DEBUG_MODE) console.log(`DEBUG: Skipping link ${link.href.match(/\/itm\/(\d+)\??/)?.[1] || 'Unknown'} - No parent container found.`);
                continue;
            }

            // --- AD FILTERING ---
            let isAd = false;
            // Get the class names from the container element
            const containerClassNames = Array.from(resultContainer.classList).join(' ') || 'No Container Class';

            // Check if the container class names match any filter
            for (const filter of CONFIG_AD_CLASS_FILTERS) {
                if (resultContainer.classList.contains(filter)) {
                    isAd = true;
                    if (DEBUG_MODE) console.log(`DEBUG: Item ${link.href.match(/\/itm\/(\d+)\??/)?.[1] || 'Unknown'} - SKIPPING AD (Matched container filter: ${filter})`);
                    break;
                }
            }
            if (isAd) continue;
            // --- END AD FILTERING ---

            // Safely extract the item ID from the link's href using a RegExp.
            let hrefMatch = link.href.match(/\/itm\/(\d+)\??/);
            let sid = hrefMatch ? hrefMatch[1] : null;

            if (!sid) {
                if (DEBUG_MODE) console.log(`DEBUG: Skipping link ${link.href} - No Item ID found.`);
                continue;
            }

            // --- TITLE SPAN SELECTOR LOGIC ---
            // Try to find the title span element
            let span = link.querySelector("div[role='heading'] span.su-styled-text.primary.default");

            if (!span) {
                span = link.querySelector("span[role='heading'], div.s-item__title > span, span.s-item__title");
            }

            if (span) {
                let inGixen = itemSaved('itemId', sid);
                let idobj = getObject('Coments', sid);
                let commentText = idobj ? idobj.comment : null;
                let hasComment = !!commentText;

                if (DEBUG_MODE) {
                    // Use the container class names for color and logging
                    const color = stringToColor(containerClassNames);

                    // --- VISUAL HIGHLIGHTING ---
                    // Set the background color of the title span based on its container's class names
                    span.style.backgroundColor = color;
                    span.style.padding = '2px';

                    // --- Add the class name to the title for easy identification ---
                    let classLabel = document.createElement('i');
                    // Show only the first class for brevity
                    let firstClass = containerClassNames.split(' ')[0];
                    classLabel.textContent = `[Class: ${firstClass}]`;
                    classLabel.style.color = 'black';
                    classLabel.style.fontSize = '8pt';
                    classLabel.style.float = 'right';
                    classLabel.style.paddingLeft = '5px';
                    span.insertAdjacentElement('afterbegin', classLabel);
                    // --- END VISUAL HIGHLIGHTING ---

                    // --- LOG CLASS NAMES FOR DEBUGGING ---
                    if (!processedClasses[containerClassNames]) {
                        processedClasses[containerClassNames] = { count: 0, exampleID: sid, isGixen: inGixen, hasComment: hasComment };
                    }
                    processedClasses[containerClassNames].count++;
                    processedCount++;

                    // Save periodically to storage
                    if (inGixen || hasComment || processedClasses[containerClassNames].count === 1) {
                        if (processedCount >= 50) {
                            GM_setValue('ProcessedLinkClasses', processedClasses);
                            processedCount = 0; // Reset counter after saving
                        }
                    }
                    // --- END LOG CLASS NAMES ---

                    console.log(`DEBUG: Item ${sid} - Container Classes: "${containerClassNames}" (Color: ${color}), In Gixen: ${inGixen}, Has Comment: ${hasComment}`);
                }

                if (inGixen && hasComment) {
                    // Case 1: In Gixen AND has a comment: Append " - in Gixen"
                    if (DEBUG_MODE) console.log(`DEBUG: Item ${sid} - Case 1: Comment + " - in Gixen"`);
                    span.innerHTML += ` <i style='color:red'> ${commentText} - in Gixen</i>`;
                } else if (inGixen && !hasComment) {
                    // Case 2: In Gixen BUT NO comment: Prefix with a line break
                    if (DEBUG_MODE) console.log(`DEBUG: Item ${sid} - Case 2: Line break + "In Gixen"`);
                    span.innerHTML += ` <br> <i style='color:red'> In Gixen</i>`;
                } else if (!inGixen && hasComment) {
                    // Case 3: NOT in Gixen BUT has a comment: Standard comment display
                    if (DEBUG_MODE) console.log(`DEBUG: Item ${sid} - Case 3: Comment only`);
                    span.innerHTML += ` <i style='color:red'> ${commentText}</i>`;
                }
            }
        }

        // Final save of class names after the loop (if debugging is enabled)
        if (DEBUG_MODE) {
            GM_setValue('ProcessedLinkClasses', processedClasses);
            console.log("DEBUG: Class name logging finished. Check GM_storage for 'ProcessedLinkClasses'.");
        }
    } else {
        if (DEBUG_MODE) console.log("Target Page NOT FOUND!");
    }
})();