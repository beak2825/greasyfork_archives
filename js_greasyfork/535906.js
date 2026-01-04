// ==UserScript==
// @name           PODS
// @version        6.1.0 // Increment version
// @author         k0gasa
// @description    podx scamurs with DB selector
// @match          *://www.woozworld.com/*
// @match          *://application.woozworld.com/*
// @match          *://client.woozworld.com/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @connect        k0gasa.pythonanywhere.com
// @connect        pythonanywhere.com
// @connect        localhost
// @connect        sfox.woozworld.com
// @run-at         document-start
//
// @namespace https://greasyfork.org/users/1446917
// @downloadURL https://update.greasyfork.org/scripts/535906/PODS.user.js
// @updateURL https://update.greasyfork.org/scripts/535906/PODS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG = true;
    const SCRIPT_TAG = '[ItemSearchDB]'; // Changed tag slightly for clarity
    const INTERCEPT_XHR_URLS = [
        'wamf/KidInventory/getPaginatedContentOfType',
        'instance/changeColors'
    ];
    const INTERCEPT_WS_HOST = 'sfox.woozworld.com';
    const YOUR_SERVER_URL = 'https://k0gasa.pythonanywhere.com/ww-data'; // Or 'http://localhost:5000/ww-data' for local dev
    const CATALOG_ENABLED_KEY = 'interceptorEnabled';
    const PODS_INTERCEPTOR_ENABLED_KEY = 'podsInterceptorEnabled';
    const PODS_NUMBERS_KEY = 'podsNumbers';
    const SELECTED_DATABASE_KEY = 'selectedDatabase'; // NEW KEY for DB selection

    const log = (...args) => { if (DEBUG) console.log(SCRIPT_TAG, ...args); };
    const error = (...args) => console.error(SCRIPT_TAG, ...args);

    // ... (arrayBufferToBase64, base64ToArrayBuffer, blobToBase64, base64ToBlob functions remain the same)
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    function base64ToArrayBuffer(base64) {
        try {
            const padding = '='.repeat((4 - base64.length % 4) % 4);
            const binary_string = atob(base64 + padding);
            const len = binary_string.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (e) {
            error("Error in base64ToArrayBuffer:", e, "Input:", base64.substring(0, 50) + "...");
            return new ArrayBuffer(0);
        }
    }
    async function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const base64String = reader.result.split(',')[1];
                    if (base64String !== undefined) {
                         resolve(base64String);
                    } else {
                         reject(new Error("FileReader result did not contain base64 data."));
                    }
                } else {
                    reject(new Error("FileReader result is null"));
                }
            };
            reader.onerror = (err) => reject(err || new Error("FileReader error"));
            reader.readAsDataURL(blob);
        });
    }
    function base64ToBlob(base64, contentType = '') {
         try {
            const padding = '='.repeat((4 - base64.length % 4) % 4);
            const byteCharacters = atob(base64 + padding);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: contentType });
         } catch (e) {
             error("Error in base64ToBlob:", e);
             return new Blob();
         }
    }
    // ... (setXHRProperties, setXHRResponse, triggerXHREvents functions remain the same)
    function setXHRProperties(xhr, status, statusText, response) {
        setTimeout(() => {
            log(`Setting XHR props: Status=${status}, ReadyState=4`);
            try {
                Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true, enumerable: true });
                Object.defineProperty(xhr, 'status', { value: status, configurable: true, enumerable: true });
                Object.defineProperty(xhr, 'statusText', { value: statusText, configurable: true, enumerable: true });
                let responseTextValue = '';
                 if (response !== null && response !== undefined) {
                    Object.defineProperty(xhr, 'response', { value: response, configurable: true, enumerable: true });
                    try {
                        if (response instanceof ArrayBuffer) {
                             responseTextValue = new TextDecoder('utf-8', { fatal: false }).decode(response);
                        } else if (typeof response === 'string') {
                            responseTextValue = response;
                        }
                    } catch (e) { log("Could not generate responseText", e); }
                } else {
                     Object.defineProperty(xhr, 'response', { value: null, configurable: true, enumerable: true });
                }
                Object.defineProperty(xhr, 'responseText', { value: responseTextValue, configurable: true, enumerable: true });
                triggerXHREvents(xhr, ['readystatechange', status >= 200 && status < 300 ? 'load' : 'error', 'loadend']);
            } catch (e) {
                error("Error setting XHR properties:", e);
                 try { triggerXHREvents(xhr, ['readystatechange', 'error', 'loadend']); } catch{}
            }
        }, 0);
    }
    function setXHRResponse(xhr, status, statusText, responseDataBuffer, originalResponseType) {
        setTimeout(() => {
             try {
                let finalResponse = null;
                let responseTextValue = '';
                try {
                    if (responseDataBuffer && responseDataBuffer.byteLength > 0) {
                        responseTextValue = new TextDecoder('utf-8', { fatal: false }).decode(responseDataBuffer);
                    }
                    if (originalResponseType === '' || originalResponseType === 'text') {
                        finalResponse = responseTextValue;
                    } else if (originalResponseType === 'json') {
                        try { finalResponse = responseTextValue ? JSON.parse(responseTextValue) : null; }
                        catch (e) { error('Failed to parse JSON response from buffer', e); finalResponse = null; }
                    } else if (originalResponseType === 'blob') {
                        finalResponse = new Blob([responseDataBuffer || new ArrayBuffer(0)], {type: xhr.getResponseHeader('Content-Type') || ''});
                    } else if (originalResponseType === 'document') {
                        error('Unsupported responseType: document. Setting response to null.'); finalResponse = null;
                     } else { // arraybuffer
                        finalResponse = responseDataBuffer;
                    }
                } catch (decodeError) {
                     error("Error processing/decoding response buffer:", decodeError);
                     finalResponse = responseDataBuffer; // Fallback to raw buffer
                     status = 500; statusText = "Response Processing Error";
                }
                Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true, enumerable: true });
                Object.defineProperty(xhr, 'status', { value: status, configurable: true, enumerable: true });
                Object.defineProperty(xhr, 'statusText', { value: statusText, configurable: true, enumerable: true });
                Object.defineProperty(xhr, 'response', { value: finalResponse, configurable: true, enumerable: true });
                Object.defineProperty(xhr, 'responseText', { value: responseTextValue, configurable: true, enumerable: true });
                triggerXHREvents(xhr, ['readystatechange', status >= 200 && status < 300 ? 'load' : 'error', 'loadend']);
             } catch(e) {
                 error("Error setting XHR response:", e);
                 try { triggerXHREvents(xhr, ['readystatechange', 'error', 'loadend']); } catch {}
             }
        }, 0);
    }
    function triggerXHREvents(xhr, eventNames) {
         log('Triggering XHR events:', eventNames.join(', '));
         eventNames.forEach(eventName => {
            const event = new Event(eventName, { bubbles: false, cancelable: false });
            try {
                 if (typeof xhr[`on${eventName}`] === 'function') {
                    log(`Calling on${eventName} handler`);
                    try { xhr[`on${eventName}`](event); } catch (handlerError) { error(`Error in on${eventName} handler:`, handlerError); }
                }
                 log(`Dispatching ${eventName} event`);
                 try { xhr.dispatchEvent(event); } catch (dispatchError) { error(`Error dispatching ${eventName} event:`, dispatchError); }
             } catch (e) { error(`General error during ${eventName} trigger:`, e); }
        });
    }

    const currentURL = window.location.href;
    log('Script running on:', currentURL);

    if (currentURL.includes('www.woozworld.com')) {
        setupMainPage();
    } else if (currentURL.includes('application.woozworld.com')) {
        log('Detected outer iframe - no action needed');
    } else if (currentURL.includes('client.woozworld.com')) {
        setupInnerIframe();
    }

    function setupMainPage() {
        function addUIWhenReady() {
             const navBar = document.querySelector('.socnet__navigationBar');
             if (navBar) {
                navBar.style.overflow = 'visible'; // Important for dropdown visibility
                 if (!document.getElementById('ww-search-container')) {
                     addSearchUI(navBar);
                 }
             } else {
                log('Navigation bar not found yet, retrying...');
                setTimeout(addUIWhenReady, 500);
             }
        }
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            addUIWhenReady();
        } else {
            window.addEventListener('DOMContentLoaded', addUIWhenReady);
        }
    }

    let currentItemType = 'garment'; // For item type (garment/furniture) selector
    let searchTimeout = null;
    let searchResults = [];
    let currentPage = 1;
    const itemsPerPage = 4;
    let activeItemString = null; // For selected item from search results

    // ... (unsafeWindow.hideSearchDropdown, unsafeWindow.showSearchDropdown, unsafeWindow.addPaginationControls, unsafeWindow.renderSearchPage, createRemoveButton, unsafeWindow.displaySearchResults functions remain largely the same,
    // just ensure triggerSearch is called correctly when DB selector changes)
     unsafeWindow.hideSearchDropdown = () => {
        const dropdownPanel = document.getElementById('ww-search-results-dropdown');
        if (dropdownPanel) {
            log("Hiding dropdown");
            dropdownPanel.style.opacity = '0';
            dropdownPanel.style.visibility = 'hidden';
            setTimeout(() => {
                if (dropdownPanel.style.opacity === '0') { // Check if still hidden before setting display none
                    dropdownPanel.style.display = 'none';
                }
            }, 200); // Match transition duration
        } else { log("HideDropdown: Panel not found"); }
    };
    unsafeWindow.showSearchDropdown = () => {
        const dropdownPanel = document.getElementById('ww-search-results-dropdown');
        const searchInput = document.getElementById('ww-descriptor-search'); // Or reference element
        if (dropdownPanel && searchInput) {
            log("Showing dropdown");
            const inputRect = searchInput.getBoundingClientRect();
            dropdownPanel.style.top = `${inputRect.bottom + window.scrollY + 2}px`; // Position below input
            dropdownPanel.style.left = `${inputRect.left + window.scrollX}px`;
            dropdownPanel.style.display = 'flex'; // Change from 'block' to 'flex'
            setTimeout(() => { // Allow display to apply before transitioning opacity
                dropdownPanel.style.visibility = 'visible';
                dropdownPanel.style.opacity = '1';
            }, 10);
        } else { log("ShowDropdown: Panel or Search Input not found"); }
    };
    unsafeWindow.addPaginationControls = (currentPageNum) => {
        const resultsListContainer = document.getElementById('ww-search-results-list');
        if (!resultsListContainer) return;

        const paginationDiv = document.createElement('div');
        paginationDiv.style.textAlign = 'center';
        paginationDiv.style.padding = '5px 0';
        paginationDiv.style.borderTop = '1px solid #555';

        const totalPages = Math.ceil(searchResults.length / itemsPerPage);

        if (currentPageNum > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = '<';
            prevButton.style.margin = '0 5px';
            prevButton.style.background = 'none';
            prevButton.style.border = 'none';
            prevButton.style.color = 'white';
            prevButton.style.padding = '0 5px';
            prevButton.style.fontSize = '14px';
            prevButton.style.cursor = 'pointer';
            prevButton.onclick = (e) => { e.stopPropagation(); currentPage = currentPageNum - 1; unsafeWindow.renderSearchPage(currentPage); };
            prevButton.addEventListener('mouseenter', () => { prevButton.style.textDecoration = 'underline'; });
            prevButton.addEventListener('mouseleave', () => { prevButton.style.textDecoration = 'none'; });
            paginationDiv.appendChild(prevButton);
        }

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPageNum} of ${totalPages}`;
        pageInfo.style.color = '#ccc';
        pageInfo.style.fontSize = '11px';
        pageInfo.style.margin = '0 5px';
        paginationDiv.appendChild(pageInfo);

        if (currentPageNum < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = '>';
            nextButton.style.margin = '0 5px';
            nextButton.style.background = 'none';
            nextButton.style.border = 'none';
            nextButton.style.color = 'white';
            nextButton.style.padding = '0 5px';
            nextButton.style.fontSize = '14px';
            nextButton.style.cursor = 'pointer';
            nextButton.onclick = (e) => { e.stopPropagation(); currentPage = currentPageNum + 1; unsafeWindow.renderSearchPage(currentPage); };
            nextButton.addEventListener('mouseenter', () => { nextButton.style.textDecoration = 'underline'; });
            nextButton.addEventListener('mouseleave', () => { nextButton.style.textDecoration = 'none'; });
            paginationDiv.appendChild(nextButton);
        }
        resultsListContainer.appendChild(paginationDiv);
    }
    unsafeWindow.renderSearchPage = (page) => {
         const resultsListContainer = document.getElementById('ww-search-results-list');
         const searchInput = document.getElementById('ww-descriptor-search');
         if (!resultsListContainer || !searchInput) {
             error("RenderSearchPage: Missing required UI elements.");
             return;
         }
         log(`Rendering page ${page}`);
         resultsListContainer.innerHTML = ''; // Clear previous items

         const start = (page - 1) * itemsPerPage;
         const end = start + itemsPerPage;
         const pageItems = searchResults.slice(start, end);

         pageItems.forEach(item => {
             const itemDiv = document.createElement('div');
             itemDiv.dataset.itemString = item.item_string; // Store for later use
             itemDiv.dataset.thumbnail = item.thumbnail || '';
             if (item.stackAmount !== undefined) { // Ensure stackAmount is handled
                 itemDiv.dataset.stackAmount = item.stackAmount;
             }

             itemDiv.style.display = 'flex';
             itemDiv.style.justifyContent = 'space-between';
             itemDiv.style.alignItems = 'center';
             itemDiv.style.padding = '8px 10px';
             itemDiv.style.cursor = 'pointer';
             itemDiv.style.color = 'white';
             itemDiv.style.borderBottom = '1px solid #444';
             itemDiv.style.whiteSpace = 'nowrap'; // Prevent text wrapping that might mess with layout

             const itemTextSpan = document.createElement('span');
             itemTextSpan.textContent = item.display_text; // Use the server-formatted display text
             itemDiv.appendChild(itemTextSpan);

             // If this item is the currently active one, highlight it and add remove button
             if (item.item_string === activeItemString) {
                 itemDiv.style.backgroundColor = '#00aa00'; // Active highlight
                 const removeButton = createRemoveButton(itemDiv, item.item_string);
                 itemDiv.appendChild(removeButton);
             }


             itemDiv.addEventListener('click', (event) => {
                 if (event.target.tagName === 'BUTTON') return; // Ignore clicks on the remove button itself

                 const clickedItemString = itemDiv.dataset.itemString;
                 log(`Item clicked: ${clickedItemString}`);

                 // Remove active state from all other items
                 Array.from(resultsListContainer.children).forEach(child => {
                     if (child.tagName.toLowerCase() === 'div' && child.dataset.itemString) {
                         child.style.backgroundColor = 'transparent';
                         const existingButton = child.querySelector('button');
                         if (existingButton) existingButton.remove(); // Remove existing remove buttons
                     }
                 });

                 if (activeItemString === clickedItemString){ // Clicked on already active item (deselect)
                     itemDiv.style.backgroundColor = 'transparent';
                     searchInput.style.backgroundColor = '#c9e0f1'; // Reset input color
                     GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                     GM_setValue(PODS_NUMBERS_KEY, '[]');
                     activeItemString = null;
                     searchInput.value = ''; // Clear input if deselecting
                     const removeButton = itemDiv.querySelector('button'); // Should exist, but check
                     if (removeButton) removeButton.remove();
                 } else { // Clicked on a new item (select)
                     itemDiv.style.backgroundColor = '#00aa00'; // Highlight selected
                     searchInput.value = clickedItemString; // Set input field to item string
                     activeItemString = clickedItemString;
                     searchInput.style.backgroundColor = '#aaffaa'; // Highlight input field

                     // Add remove button to the newly selected item
                     const removeButton = createRemoveButton(itemDiv, clickedItemString);
                     itemDiv.appendChild(removeButton);


                     const numbers = activeItemString.split(',').map(Number);
                     if (numbers.length === 3) {
                         GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, true);
                         GM_setValue(PODS_NUMBERS_KEY, JSON.stringify(numbers));
                         log('Item activated for purchase:', numbers);
                     } else {
                         error('Selected item string format is incorrect:', activeItemString);
                         GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                         GM_setValue(PODS_NUMBERS_KEY, '[]');
                     }
                 }

                 // Update thumbnail in dropdown
                 const dropdownThumbnailImg = document.getElementById('ww-search-dropdown-thumbnail');
                 const thumbnailContainer = document.getElementById('ww-search-thumbnail-container');
                 if (dropdownThumbnailImg && thumbnailContainer) {
                     const itemThumbnail = itemDiv.dataset.thumbnail;
                     if (itemThumbnail) {
                         dropdownThumbnailImg.src = itemThumbnail;
                         thumbnailContainer.style.display = 'flex';
                     } else {
                         dropdownThumbnailImg.src = '';
                         thumbnailContainer.style.display = 'none';
                     }
                 }
                 unsafeWindow.hideSearchDropdown(); // Hide dropdown after selection
             });

             itemDiv.addEventListener('mouseenter', () => {
                 if (itemDiv.dataset.itemString !== activeItemString) { // Don't change active item's hover
                     itemDiv.style.backgroundColor = '#555';
                 }
             });
             itemDiv.addEventListener('mouseleave', () => {
                 if (itemDiv.dataset.itemString !== activeItemString) {
                     itemDiv.style.backgroundColor = 'transparent';
                 }
             });
             resultsListContainer.appendChild(itemDiv);
         });

         if (searchResults.length > itemsPerPage) {
             unsafeWindow.addPaginationControls(page);
         }
    }
    function createRemoveButton(itemDiv, itemString) {
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.style.marginLeft = '10px';
        removeButton.style.border = '1px solid #a00';
        removeButton.style.background = '#d00';
        removeButton.style.color = 'white';
        removeButton.style.borderRadius = '50%';
        removeButton.style.width = '16px';
        removeButton.style.height = '16px';
        removeButton.style.padding = '0';
        removeButton.style.fontSize = '10px';
        removeButton.style.lineHeight = '14px'; // Adjust for vertical centering
        removeButton.style.textAlign = 'center';
        removeButton.style.cursor = 'pointer';
        removeButton.title = 'Remove this item from DB';

        removeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the itemDiv's click handler
            const itemToRemoveString = itemString;
            log(`Remove button clicked for: ${itemToRemoveString}`);

            const payload = {
                requestType: 'confirmBuy',
                itemString: itemToRemoveString,
                itemType: currentItemType // currentItemType should be correct
                // databaseSelection will be added by sendWebSocketMessageToServer
            };

            if (unsafeWindow.sendWebSocketMessageToServer) {
                unsafeWindow.sendWebSocketMessageToServer(payload); // Server will handle DB removal

                // Update local searchResults and UI
                const itemIndex = searchResults.findIndex(res => res.item_string === itemToRemoveString);
                if (itemIndex > -1) {
                    const localItem = searchResults[itemIndex];
                    log(`Checking item: ${localItem.item_string}, stackAmount: ${localItem.stackAmount}, type: ${typeof localItem.stackAmount}`);

                    const currentStack = Number(localItem.stackAmount); // Ensure it's a number
                     log(`Converted stack: ${currentStack}, type: ${typeof currentStack}, isNaN: ${isNaN(currentStack)}`);

                    if (!isNaN(currentStack) && currentStack > 1) {
                        log("--> Decrementing stack");
                        localItem.stackAmount = currentStack - 1;
                        // Update display_text: "Price: P, xS"
                        const stackTextMatch = localItem.display_text.match(/, x(\d+)$/);
                        if (stackTextMatch) {
                            localItem.display_text = localItem.display_text.replace(stackTextMatch[0], `, x${localItem.stackAmount}`);
                        } else {
                             log(`Warning: Could not find ', xN' pattern to update display text: ${localItem.display_text}`);
                        }
                        log(`Decremented local stack for ${localItem.item_string}. New stack: ${localItem.stackAmount}. New text: ${localItem.display_text}`);
                    } else {
                        log("--> Removing item completely");
                        searchResults.splice(itemIndex, 1);
                        log(`Removed item ${itemToRemoveString} from local searchResults.`);
                    }

                    // If the removed/decremented item was the active one, clear active state
                    if (activeItemString === itemToRemoveString) {
                        activeItemString = null;
                        GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                        GM_setValue(PODS_NUMBERS_KEY, '[]');
                        const searchInput = document.getElementById('ww-descriptor-search');
                        if(searchInput) {
                            searchInput.value = '';
                            searchInput.style.backgroundColor = '#c9e0f1';
                        }
                    }
                    unsafeWindow.renderSearchPage(currentPage); // Re-render the current page
                } else {
                    log("Item not found in local searchResults array for removal/decrement. Just removing from DOM if it's this specific div.");
                    itemDiv.remove(); // Fallback if not in array but button was on it
                }
            } else {
                error("sendWebSocketMessageToServer function not available for remove button.");
            }
        });
        return removeButton;
    }
    unsafeWindow.displaySearchResults = (results) => {
        const dropdownPanel = document.getElementById('ww-search-results-dropdown');
        const thumbnailContainer = document.getElementById('ww-search-thumbnail-container');
        const dropdownThumbnailImg = document.getElementById('ww-search-dropdown-thumbnail');
        const resultsListContainer = document.getElementById('ww-search-results-list');

        if (!dropdownPanel || !thumbnailContainer || !dropdownThumbnailImg || !resultsListContainer) {
            error("DisplayResults: Dropdown or child elements not found.");
            return;
        }
        log("Displaying results:", results);
        // Ensure stackAmount is a number for reliable decrement logic
        searchResults = (results || []).map(item => ({
            ...item,
            stackAmount: item.stackAmount !== undefined ? Number(item.stackAmount) : 1 // Default to 1 if undefined
        }));
        currentPage = 1; // Reset to first page for new results

        resultsListContainer.innerHTML = ''; // Clear previous results
        thumbnailContainer.style.display = 'none'; // Hide thumbnail initially
        dropdownThumbnailImg.src = '';

        if (searchResults.length === 0) {
            const noResultItem = document.createElement('div');
            noResultItem.textContent = 'No items found.';
            noResultItem.style.padding = '8px 10px';
            noResultItem.style.color = '#aaa';
            noResultItem.style.fontStyle = 'italic';
            resultsListContainer.appendChild(noResultItem);
            unsafeWindow.showSearchDropdown();
            return;
        }

        // Optionally show thumbnail of the first item by default
        if (searchResults[0].thumbnail) {
            dropdownThumbnailImg.src = searchResults[0].thumbnail;
            thumbnailContainer.style.display = 'flex';
        }

        unsafeWindow.renderSearchPage(currentPage);
        unsafeWindow.showSearchDropdown();
    }

    function addSearchUI(navBar) {
    if (!navBar || document.getElementById('ww-search-container')) return;

    // Create our container as a list item to match existing navigation items
    const searchListItem = document.createElement('li');
    searchListItem.className = 'tab_link hide_if_mobile'; // Match existing tab styling
    searchListItem.id = 'ww-search-tab';

    // Create the search container inside the list item
    const searchContainer = document.createElement('div');
    searchContainer.id = 'ww-search-container';
    searchContainer.style.display = 'inline-flex'; // Use flex for alignment
    searchContainer.style.alignItems = 'center';
    searchContainer.style.height = '100%'; // Match height of navigation

    const inputWrapper = document.createElement('div');
    inputWrapper.style.position = 'relative';
    inputWrapper.style.display = 'inline-block';
    inputWrapper.style.margin = 'auto 0'; // Center vertically

    const typeSelector = document.createElement('span');
    typeSelector.id = 'ww-item-type-selector';
    typeSelector.textContent = '👕'; // Default to garment
    typeSelector.style.position = 'absolute';
    typeSelector.style.left = '5px';
    typeSelector.style.top = '50%';
    typeSelector.style.transform = 'translateY(-50%)';
    typeSelector.style.cursor = 'pointer';
    typeSelector.style.fontSize = '14px';
    typeSelector.style.zIndex = '2'; // Above input field
    typeSelector.title = 'Click to switch between Garment/Furniture';
    inputWrapper.appendChild(typeSelector);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'ww-descriptor-search';
    searchInput.placeholder = 'Search ID...';
    searchInput.style.padding = '4px 10px 4px 28px'; // Left padding for type selector
    searchInput.style.border = '1px solid #666';
    searchInput.style.borderRadius = '4px';
    searchInput.style.color = '#333';
    searchInput.style.backgroundColor = '#c9e0f1';
    searchInput.style.fontSize = '12px';
    searchInput.style.fontFamily = 'Lato';
    searchInput.style.minWidth = '100px'; // Adjust as needed
    searchInput.style.boxSizing = 'border-box';
        searchInput.style.height = '26px'; // Set fixed height
searchInput.style.margin = '0'; // Reset margin
    inputWrapper.appendChild(searchInput);
    searchContainer.appendChild(inputWrapper);

    // --- NEW: Database Selector ---
    const dbSelector = document.createElement('select');
    dbSelector.id = 'ww-db-selector';
    dbSelector.style.marginLeft = '5px';
    dbSelector.style.padding = '4px'; // Consistent padding
    dbSelector.style.borderRadius = '4px';
    dbSelector.style.backgroundColor = '#0c2038'; // Match input style
    dbSelector.style.color = '#ffffff'; // Add text color for better visibility
    dbSelector.style.border = '1px solid #666';
    dbSelector.style.fontSize = '12px';
    dbSelector.style.fontFamily = 'Lato';
    dbSelector.style.cursor = 'pointer';
        dbSelector.style.height = '26px'; // Match input height
dbSelector.style.margin = 'auto 0'; // Center vertically

    const optionDb1 = document.createElement('option');
    optionDb1.value = 'db1';
    optionDb1.textContent = 'DB 1'; // Or more descriptive like "Primary"
    dbSelector.appendChild(optionDb1);

    const optionDb2 = document.createElement('option');
    optionDb2.value = 'db2';
    optionDb2.textContent = 'DB 2'; // Or "Secondary"
    dbSelector.appendChild(optionDb2);
    searchContainer.appendChild(dbSelector);
    // --- END: Database Selector ---

    // Dropdown Panel for search results (remains mostly the same)
    const dropdownPanel = document.createElement('div');
    dropdownPanel.id = 'ww-search-results-dropdown';
    dropdownPanel.style.display = 'none'; // Initially hidden
    dropdownPanel.style.visibility = 'hidden';
    dropdownPanel.style.opacity = '0';
    dropdownPanel.style.position = 'fixed'; // Use fixed to position relative to viewport
    // dropdownPanel.style.top and dropdownPanel.style.left will be set by showSearchDropdown
    dropdownPanel.style.display = 'flex'; // Use flex for side-by-side list and thumbnail
    dropdownPanel.style.backgroundColor = 'rgba(40, 40, 40, 0.95)';
    dropdownPanel.style.border = '1px solid #555';
    dropdownPanel.style.borderRadius = '8px';
    dropdownPanel.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    dropdownPanel.style.zIndex = '99999'; // Very high z-index
    dropdownPanel.style.transition = 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out';

    const resultsListContainer = document.createElement('div');
    resultsListContainer.id = 'ww-search-results-list';
    resultsListContainer.style.flex = '1'; // Take available space
    resultsListContainer.style.padding = '5px 0'; // Padding for items
    resultsListContainer.style.borderRight = '1px solid #555'; // Separator
    resultsListContainer.style.minHeight = '50px'; // Minimum height
    // resultsListContainer.style.maxHeight = '200px'; // Optional: if list can get too long
    // resultsListContainer.style.overflowY = 'auto';  // Optional: scroll for long lists
    dropdownPanel.appendChild(resultsListContainer);

    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.id = 'ww-search-thumbnail-container';
    thumbnailContainer.style.padding = '10px';
    thumbnailContainer.style.display = 'none'; // Initially hidden
    thumbnailContainer.style.alignItems = 'center';
    thumbnailContainer.style.justifyContent = 'center';
    thumbnailContainer.style.minWidth = '80px'; // Space for thumbnail

    const dropdownThumbnailImg = document.createElement('img');
    dropdownThumbnailImg.id = 'ww-search-dropdown-thumbnail';
    dropdownThumbnailImg.style.maxWidth = '100%'; // Fit within container
    dropdownThumbnailImg.style.maxHeight = '120px'; // Limit height
    dropdownThumbnailImg.style.objectFit = 'contain';
    dropdownThumbnailImg.style.display = 'block'; // Remove extra space below img
    thumbnailContainer.appendChild(dropdownThumbnailImg);
    dropdownPanel.appendChild(thumbnailContainer);

    document.body.appendChild(dropdownPanel); // Append to body for fixed positioning

    // Add the search container to the list item
    searchListItem.appendChild(searchContainer);

    // Fix: Simply append to navBar directly - this avoids the parent-child relationship issue
    navBar.appendChild(searchListItem);

    // Event Listeners
    const updateTypeSelector = () => {
        typeSelector.textContent = currentItemType === 'garment' ? '👕' : '🪑';
    };


        // Add the search container to the list item
searchListItem.appendChild(searchContainer);

// Find the correct parent UL for the tabs
const tabsUl = document.getElementById('tabs'); // This is the UL for "Store", "WoozIn", "World"

if (tabsUl) {
    tabsUl.appendChild(searchListItem); // Append your LI to the UL
} else {
    console.error("WoozWorld UI Enhancer: Could not find #tabs element to append search UI.");
    // As a fallback, you might append it where you were before,
    // but it's better to log an error if the primary target is missing.
    // For example, if navBar was document.querySelector('.socnet__navigationBar .top_navigation_bar');
    // navBar.appendChild(searchListItem); // This was likely wrong
}

    typeSelector.addEventListener('click', () => {
        currentItemType = (currentItemType === 'garment') ? 'furniture' : 'garment';
        updateTypeSelector();
        if (searchInput.value.trim()) { // If there's text, re-search with new type
            clearTimeout(searchTimeout);
            triggerSearch();
        }
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchInput.style.backgroundColor = '#c9e0f1'; // Reset color on input
        if (activeItemString) { // Deactivate item if user types in input
             GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
             GM_setValue(PODS_NUMBERS_KEY, '[]');
             activeItemString = null;
             log('Item deactivated due to input change.');
        }
        searchTimeout = setTimeout(triggerSearch, 300);
    });

    // --- NEW: DB Selector Listener ---
    const savedDb = GM_getValue(SELECTED_DATABASE_KEY, 'db1'); // Default to 'db1'
    dbSelector.value = savedDb;
    dbSelector.addEventListener('change', () => {
        const newDb = dbSelector.value;
        GM_setValue(SELECTED_DATABASE_KEY, newDb);
        log(`Database selection changed to: ${newDb}`);
        activeItemString = null; // Clear active item when DB changes
        GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
        GM_setValue(PODS_NUMBERS_KEY, '[]');
        searchInput.style.backgroundColor = '#c9e0f1'; // Reset input color

        if (searchInput.value.trim()) { // If there's a search term, re-search in the new DB
            triggerSearch();
        } else {
            unsafeWindow.displaySearchResults([]); // Clear results if no search term
        }
    });
    // --- END: DB Selector Listener ---

    document.addEventListener('click', (event) => { // Hide dropdown on outside click
        if (!searchContainer.contains(event.target) && !dropdownPanel.contains(event.target)) {
            unsafeWindow.hideSearchDropdown();
        }
    });
    searchInput.addEventListener('click', (event) => { // Show dropdown on input click if results exist
        event.stopPropagation(); // Prevent body click listener from hiding it immediately
        if (resultsListContainer.children.length > 0 && (resultsListContainer.firstChild.textContent !== 'No items found.' && resultsListContainer.firstChild.textContent !== '')) {
             unsafeWindow.showSearchDropdown();
        }
    });

    function triggerSearch() {
        const descriptorId = searchInput.value.trim();
        if (!/^\d+$/.test(descriptorId) && descriptorId !== "") { // Allow empty to clear
            log('Invalid Descriptor ID entered for search.');
            unsafeWindow.displaySearchResults([]); // Clear results for invalid ID
            return;
        }
        if (descriptorId === "") {
            unsafeWindow.displaySearchResults([]);
            return;
        }

        log(`Triggering search for ID: ${descriptorId}, Type: ${currentItemType}`);
        const payload = {
            requestType: 'searchItems',
            descriptorId: descriptorId,
            itemType: currentItemType
            // databaseSelection will be added by sendWebSocketMessageToServer
        };

        if (unsafeWindow.sendWebSocketMessageToServer) {
            unsafeWindow.sendWebSocketMessageToServer(payload);
        } else {
            error("sendWebSocketMessageToServer function not available for triggerSearch.");
            unsafeWindow.displaySearchResults([]); // Show no results on error
        }
    }

    function sendConfirmBuy() { // This function is kept for potential direct calls if needed
         if (activeItemString) {
             log(`Sending confirmBuy for: ${activeItemString}, Type: ${currentItemType}`);
             const payload = {
                 requestType: 'confirmBuy',
                 itemString: activeItemString,
                 itemType: currentItemType
                 // databaseSelection will be added by sendWebSocketMessageToServer
             };
             if (unsafeWindow.sendWebSocketMessageToServer) {
                 unsafeWindow.sendWebSocketMessageToServer(payload);
             } else {
                 error("sendWebSocketMessageToServer function not available for confirmBuy.");
             }
             // Resetting active item state is now handled within the remove button's logic
             // or if input changes. If called directly, ensure UI state is managed.
         } else {
             log('No active item to confirm buy for.');
         }
    }
    unsafeWindow.sendConfirmBuy = sendConfirmBuy; // Expose if needed elsewhere

    // Add custom CSS to ensure proper integration
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #ww-search-tab {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 10px;
        }

#ww-search-container {
    margin: auto 0; /* Center vertically */
    line-height: normal; /* Reset line height */
    margin-left: 10px;
}

#ww-descriptor-search, #ww-db-selector {
    vertical-align: middle;


}

        #tabs li {
            vertical-align: middle;
        }

        @media (max-width: 768px) {
            #ww-search-tab {
                display: none;
            }
        }
    `;
    document.head.appendChild(styleElement);

    log('Search UI with DB selector added.');
}

    unsafeWindow.sendWebSocketMessageToServer = function(payload) {
        log(`Sending request to server from Main Page:`, payload);

        // --- MODIFIED: Add databaseSelection if applicable ---
        if (payload.requestType === 'searchItems' || payload.requestType === 'confirmBuy') {
            const selectedDB = GM_getValue(SELECTED_DATABASE_KEY, 'db1'); // Default 'db1'
            payload.databaseSelection = selectedDB;
            log(`Using database: ${selectedDB} for request type ${payload.requestType}`);
        }
        // --- END MODIFICATION ---

        GM_xmlhttpRequest({
            method: 'POST',
            url: YOUR_SERVER_URL,
            data: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            responseType: 'text', // Expecting JSON text from server for these types
            timeout: 20000,
            onload: function(serverResponse) {
                log(`Server response status: ${serverResponse.status} for ${payload.requestType}`);
                if (payload.requestType === 'searchItems') {
                    if (serverResponse.status === 200) {
                        try {
                            const responseJson = JSON.parse(serverResponse.responseText);
                            log("Search results received:", responseJson);
                            if (typeof unsafeWindow.displaySearchResults === 'function') {
                                unsafeWindow.displaySearchResults(responseJson.results || []);
                            } else { error("displaySearchResults function not found on unsafeWindow."); }
                        } catch (e) {
                            error('Error parsing search results:', e, serverResponse.responseText);
                            if (typeof unsafeWindow.displaySearchResults === 'function') { unsafeWindow.displaySearchResults([]); }
                        }
                    } else {
                        error('Search request failed:', serverResponse.status, serverResponse.statusText);
                        if (typeof unsafeWindow.displaySearchResults === 'function') { unsafeWindow.displaySearchResults([]); }
                    }
                }
                else if (payload.requestType === 'confirmBuy') {
                     if (serverResponse.status === 200) {
                         try {
                             const responseJson = JSON.parse(serverResponse.responseText);
                             log("Confirm buy response from server:", responseJson);
                             // UI update for confirmBuy is handled client-side optimistically now by createRemoveButton
                         } catch (e) { error('Error parsing confirmBuy response:', e); }
                     } else {
                         error('Confirm buy request failed on server:', serverResponse.status, serverResponse.statusText);
                         alert(`Server failed to process item ${payload.itemString} from database ${payload.databaseSelection}. Item might still be in local list if optimistic removal failed to match server.`);
                         // Potentially re-fetch or revert optimistic UI change here if strict consistency is needed.
                     }
                }
            },
            onerror: function(error) {
                error(`GM_XHR Error for ${payload.requestType}:`, error);
                 if (payload.requestType === 'searchItems') {
                    if (typeof unsafeWindow.displaySearchResults === 'function') { unsafeWindow.displaySearchResults([]); }
                } else if (payload.requestType === 'confirmBuy') {
                    alert(`Network error trying to remove item ${payload.itemString} from ${payload.databaseSelection}.`);
                }
            },
             ontimeout: function() {
                error(`GM_XHR Timeout for ${payload.requestType}`);
                 if (payload.requestType === 'searchItems') {
                    if (typeof unsafeWindow.displaySearchResults === 'function') { unsafeWindow.displaySearchResults([]); }
                } else if (payload.requestType === 'confirmBuy') {
                    alert(`Timeout trying to remove item ${payload.itemString} from ${payload.databaseSelection}.`);
                }
            }
        });
    }

    function setupInnerIframe() {
        log("Setting up Inner Iframe Interceptors...");

        // This function is for WS messages, DB selection doesn't directly apply here
        // as item details for WS buy come from PODS_NUMBERS_KEY, not from a search involving DB selection.
        const sendWebSocketMessageToServerInner = function(payload, originalWebSocket = null, originalData = null) {
            log(`Sending request to server from Inner Iframe:`, payload);
            GM_xmlhttpRequest({
                method: 'POST',
                url: YOUR_SERVER_URL,
                data: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
                responseType: 'text',
                timeout: 20000,
                onload: function(serverResponse) {
                    log(`Inner Frame Server response status: ${serverResponse.status} for ${payload.requestType}`);
                    if (payload.requestType === 'websocketMessage') {
                        let finalData = originalData; // Default to original if something goes wrong
                        if (serverResponse.status === 200) {
                            try {
                                const responseJson = JSON.parse(serverResponse.responseText);
                                if (responseJson && responseJson.modifiedMessageData !== undefined && responseJson.dataType) {
                                    log('WS Inner: Received processed message from server, type:', responseJson.dataType);
                                    if (responseJson.dataType === 'text') { finalData = String(responseJson.modifiedMessageData); }
                                    else if (responseJson.dataType === 'base64_arraybuffer') { finalData = base64ToArrayBuffer(responseJson.modifiedMessageData); }
                                    else if (responseJson.dataType === 'base64_blob') { finalData = base64ToBlob(responseJson.modifiedMessageData, responseJson.contentType || ''); }
                                    else { log('WS Inner: Unknown dataType from server, using original data.'); }
                                } else {
                                    log('WS Inner: Server response OK but invalid format or no modified data, using original data.');
                                }
                            } catch (e) {
                                error('WS Inner: Error parsing server response:', e, serverResponse.responseText);
                                log('WS Inner: Using original data due to server response parse error.');
                            }
                        } else {
                            error('WS Inner: Server returned error status:', serverResponse.status, serverResponse.statusText);
                            log('WS Inner: Using original data due to server error.');
                        }

                        // Send the (potentially modified) data
                        try {
                            const instanceOriginalSend = originalWebSocket.send; // Get the original send method
                            if (originalWebSocket && originalWebSocket.readyState === WebSocket.OPEN) {
                                instanceOriginalSend.call(originalWebSocket, finalData);
                            } else {
                                log('WS Inner: Cannot send final data. Real WebSocket not open. State:', originalWebSocket ? originalWebSocket.readyState : 'N/A');
                            }
                        } catch (sendError) {
                            error("WS Inner: Error sending final data on real WebSocket:", sendError);
                        }
                    }
                },
                onerror: function(error) {
                    error(`Inner Frame GM_XHR Error for ${payload.requestType}:`, error);
                    if (payload.requestType === 'websocketMessage' && originalWebSocket && originalData) {
                        log('WS Inner: Using original data due to GM_XHR network error.');
                        try {
                            const instanceOriginalSend = originalWebSocket.send;
                            if (originalWebSocket.readyState === WebSocket.OPEN) { instanceOriginalSend.call(originalWebSocket, originalData); }
                            else { log('WS Inner: Real WebSocket not OPEN after server error. State:', originalWebSocket.readyState); }
                        } catch (sendError) { error("WS Inner: Error sending original data after server error:", sendError); }
                    }
                },
                 ontimeout: function() {
                    error(`Inner Frame GM_XHR Timeout for ${payload.requestType}`);
                    if (payload.requestType === 'websocketMessage' && originalWebSocket && originalData) {
                        log('WS Inner: Using original data due to server timeout.');
                        try {
                            const instanceOriginalSend = originalWebSocket.send;
                            if (originalWebSocket.readyState === WebSocket.OPEN) { instanceOriginalSend.call(originalWebSocket, originalData); }
                            else { log('WS Inner: Real WebSocket not OPEN after server timeout. State:', originalWebSocket.readyState); }
                        } catch (sendError) { error("WS Inner: Error sending original data after server timeout:", sendError); }
                    }
                }
            });
        }

        if (!unsafeWindow._wwXHRInterceptorInstalled) {
            setupXHRInterception(); // XHR interception for catalog, etc. - not directly related to DB selector for search
        } else {
            log('XHR Interceptor already installed.');
        }
        if (!unsafeWindow._wwWebSocketInterceptorInstalled) {
            setupWebSocketInterception(sendWebSocketMessageToServerInner); // WS interception for !buy command
        } else {
             log('WebSocket Interceptor already installed.');
        }
    }

    // ... (setupXHRInterception, handlePaginatedContentRequest, handleChangeColorsRequest, setupWebSocketInterception functions remain the same as they are not directly affected by the DB selection for search/buy)
    // Minor corrections and loggings in XHR/WS might be useful but core logic stays.
    function setupXHRInterception() {
        unsafeWindow._wwXHRInterceptorInstalled = true;
        const origXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const origXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;
        const origSetRequestHeader = unsafeWindow.XMLHttpRequest.prototype.setRequestHeader;

        unsafeWindow.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (!this._wwRequestHeaders) this._wwRequestHeaders = {};
            this._wwRequestHeaders[header] = value;
            try { return origSetRequestHeader.apply(this, arguments); }
            catch (e) { error("Error applying original setRequestHeader:", e); return undefined; /* Or rethrow */ }
        };

        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, async /*, user, password */) {
            this._wwOriginalUrl = String(url || '');
            this._wwMethod = String(method || 'GET').toUpperCase();
            this._wwIsAsync = async !== false; // Default to true if undefined
            this._wwRequestHeaders = {}; // Reset headers for new request
             try { return origXHROpen.apply(this, arguments); }
             catch (e) { error("Error applying original XHR open:", e); throw e; }
        };

        unsafeWindow.XMLHttpRequest.prototype.send = function(data) {
            const url = this._wwOriginalUrl;
            const method = this._wwMethod;
            const xhr = this; // `this` is the XHR instance

            // Bypass conditions: non-async, already a copy, or no URL
            if (!url || this._wwIsAsync === false || this._wwIsCopyRequest) {
                 try { return origXHRSend.apply(this, arguments); }
                 catch (e) { error("Error applying original XHR send (bypassed):", e); setXHRProperties(xhr, 0, 'Send Error', null); return undefined; }
            }

            let shouldIntercept = false;
            let isChangeColors = false;
            for (const pattern of INTERCEPT_XHR_URLS) {
                try {
                    if (url.includes(pattern)) {
                        shouldIntercept = true;
                        isChangeColors = pattern === 'instance/changeColors';
                        break;
                    }
                } catch (e) { error(`Error matching URL pattern '${pattern}' with URL '${url}':`, e); }
            }

            const catalogEnabled = GM_getValue(CATALOG_ENABLED_KEY, false);

            if (shouldIntercept && catalogEnabled) {
                const originalResponseType = xhr.responseType; // Capture before any modification
                if (isChangeColors) {
                    handleChangeColorsRequest(xhr, url, method, data); // Pass originalResponseType if needed by server logic
                } else { // Must be getPaginatedContentOfType
                    handlePaginatedContentRequest(xhr, url, method, data, originalResponseType);
                }
                return; // send is now handled asynchronously
            }

            log('XHR send: Not intercepting (Catalog disabled or URL mismatch):', url);
             try { return origXHRSend.apply(this, arguments); }
             catch (e) { error("Error applying original XHR send (not intercepted):", e); setXHRProperties(xhr, 0, 'Send Error', null); return undefined; }
        };
        log('XHR interception hooks installed.');
    }

     function handlePaginatedContentRequest(xhr, url, method, data, originalResponseType) {
         // Convert data to a suitable format for JSON stringification if necessary
         let dataToSend, dataFormat;
         try {
             if (data instanceof Uint8Array) { dataToSend = arrayBufferToBase64(data.buffer); dataFormat = 'base64'; }
             else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataFormat = 'base64'; }
             else if (data === null || data === undefined) { dataToSend = ''; dataFormat = 'text'; } // Handle null/undefined data
             else if (typeof data === 'object' && data !== null && !(data instanceof Blob)) {
                 // FormData or URLSearchParams might need special handling if used, for now assume simple JSON.stringify works
                 dataToSend = JSON.stringify(data); dataFormat = 'json';
             }
             else if (typeof data === 'string') { dataToSend = data; dataFormat = 'text'; }
             else if (data instanceof Blob) {
                 // Blobs need to be read asynchronously if we were to send their content.
                 // For this specific interception, if blobs are used in requests, this will need adjustment.
                 // For now, assume it's not a common case for these intercepted URLs or error out.
                 error('Blob data type for getPaginatedContentOfType request data not handled for server forwarding. Sending original.');
                 setXHRProperties(xhr, 500, 'Script Error - Blob Data', null); return;
             }
             else { dataToSend = String(data); dataFormat = 'text'; } // Fallback
         } catch(e) {
             error('XHR data conversion error for getPaginatedContentOfType:', e);
             setXHRProperties(xhr, 500, 'Script Error - Data Conversion', null); return;
         }

         let urlParams = {}; try { const urlObj = new URL(url, unsafeWindow.location.origin); urlObj.searchParams.forEach((v, k) => { urlParams[k] = v; }); } catch (e) { /* ignore if URL parsing fails */ }

         // Make a copy of the original request to get the actual server response
         const copyRequest = new XMLHttpRequest();
         copyRequest._wwIsCopyRequest = true; // Mark this as a non-intercepted copy
         copyRequest.open(method, url, true); // Always async for copy
         copyRequest.responseType = 'arraybuffer'; // We always want arraybuffer for original binary

         // Copy request headers from original XHR
         if (xhr._wwRequestHeaders) {
             for (const h in xhr._wwRequestHeaders) {
                 try {copyRequest.setRequestHeader(h, xhr._wwRequestHeaders[h]);}
                 catch(e){ log(`Warn: Could not copy header ${h} to copyRequest`, e)}
             }
         }

         copyRequest.onload = function() {
             if (copyRequest.status >= 200 && copyRequest.status < 300) {
                 const originalResponse = copyRequest.response; // This is an ArrayBuffer
                 const originalResponseBase64 = arrayBufferToBase64(originalResponse);

                 GM_xmlhttpRequest({
                     method: 'POST', url: YOUR_SERVER_URL,
                     data: JSON.stringify({
                         requestType: 'getPaginatedContentOfType',
                         requestData: dataToSend, // The (potentially converted) request body
                         dataFormat: dataFormat,
                         originalResponseBase64: originalResponseBase64, // The actual response from game server
                         urlParams: urlParams,
                         originalResponseType: originalResponseType // Tell server original XHR's expectation
                     }),
                     headers: { 'Content-Type': 'application/json', 'X-Original-URL': url, 'X-Original-Method': method },
                     responseType: 'text', // Expecting base64 encoded binary data from our server
                     timeout: 15000,
                     onload: function(serverResponse) {
                         if (serverResponse.status === 200) {
                             try {
                                 const modBuffer = base64ToArrayBuffer(serverResponse.responseText);
                                 setXHRResponse(xhr, 200, 'OK', modBuffer, originalResponseType);
                             } catch (e) {
                                 error('Error processing server response for getPaginatedContentOfType:', e);
                                 setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); // Fallback to original
                             }
                         } else {
                             log("XHR Fallback (getPaginated): Server error status. Using original response.");
                             setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType);
                         }
                     },
                     onerror: function(error) {
                         error('XHR GM_XHR network error for getPaginatedContentOfType:', error);
                         setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); // Fallback
                     },
                     ontimeout: function() {
                         error('XHR GM_XHR timeout for getPaginatedContentOfType');
                         setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); // Fallback
                     }
                 });
             } else {
                 error('XHR Original request (copy) for getPaginatedContentOfType failed:', copyRequest.status);
                 setXHRProperties(xhr, copyRequest.status, copyRequest.statusText, copyRequest.response);
             }
         };
         copyRequest.onerror = function() { error('XHR Network error on copy request for getPaginatedContentOfType'); setXHRProperties(xhr, 0, 'Network Error', null); };
         copyRequest.ontimeout = function() { error('XHR Network timeout on copy request for getPaginatedContentOfType'); setXHRProperties(xhr, 0, 'Network Timeout', null); };
         copyRequest.timeout = 10000; // Timeout for the copy request

         try { copyRequest.send(data); } // Send original data with copy request
         catch(e) { error("Error sending XHR copy request for getPaginatedContentOfType:", e); setXHRProperties(xhr, 0, 'Send Error', null); }
     }

    function handleChangeColorsRequest(xhr, url, method, data /*, originalResponseType - already captured */) {
         log('Handling changeColors request via server (Catalog)');
         const originalResponseType = xhr.responseType;

         let dataToSend, dataFormat;
          try {
             if (data instanceof Uint8Array) { dataToSend = arrayBufferToBase64(data.buffer); dataFormat = 'base64'; }
             else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataFormat = 'base64'; }
             else if (data === null || data === undefined) { dataToSend = ''; dataFormat = 'text'; }
             else if (typeof data === 'object' && data !== null && !(data instanceof Blob)) { dataToSend = JSON.stringify(data); dataFormat = 'json'; }
             else if (typeof data === 'string') { dataToSend = data; dataFormat = 'text'; }
             else if (data instanceof Blob) {
                 error('Blob data type for changeColors request data not handled for server forwarding.');
                 setXHRProperties(xhr, 500, 'Script Error - Blob Data', null); return;
             }
             else { dataToSend = String(data); dataFormat = 'text'; }
         } catch(e) {
             error('XHR data conversion error for changeColors:', e);
             setXHRProperties(xhr, 500, 'Script Error - Data Conversion', null); return;
         }

         let urlParams = {}; try { const urlObj = new URL(url, unsafeWindow.location.origin); urlObj.searchParams.forEach((v, k) => { urlParams[k] = v; }); } catch (e) { /* ignore */ }

         GM_xmlhttpRequest({
             method: 'POST', url: YOUR_SERVER_URL,
             data: JSON.stringify({
                 requestType: 'changeColors',
                 requestData: dataToSend,
                 dataFormat: dataFormat,
                 urlParams: urlParams,
                 originalResponseType: originalResponseType // Pass original XHR's expectation
             }),
             headers: { 'Content-Type': 'application/json', 'X-Original-URL': url, 'X-Original-Method': method },
             responseType: 'text', // Expecting base64 encoded binary from our server
             timeout: 15000,
             onload: function(serverResponse) {
                 if (serverResponse.status === 200) {
                     try {
                         const finalBuffer = base64ToArrayBuffer(serverResponse.responseText);
                         setXHRResponse(xhr, 200, 'OK', finalBuffer, originalResponseType);
                     } catch (e) {
                         error('Error processing changeColors response from server:', e);
                         setXHRProperties(xhr, 502, 'Bad Gateway Response - Script Error', null); // Or some other error
                     }
                 } else {
                     error('XHR Server returned error for changeColors:', serverResponse.status, serverResponse.statusText);
                     setXHRProperties(xhr, serverResponse.status, serverResponse.statusText || 'Server Error', null); // Pass through server error
                 }
             },
             onerror: function(error) {
                 error('XHR GM_XHR network error changeColors:', error);
                 setXHRProperties(xhr, 0, 'Network Error', null); // Simulate network error
             },
             ontimeout: function() {
                 error('XHR GM_XHR timeout changeColors');
                 setXHRProperties(xhr, 0, 'Gateway Timeout', null); // Simulate timeout
             }
         });
     }

    function setupWebSocketInterception(sendMessageToServerFn) {
        unsafeWindow._wwWebSocketInterceptorInstalled = true;
        const OriginalWebSocket = unsafeWindow.WebSocket; // Cache original

        unsafeWindow.WebSocket = function(url, protocols) {
            let instance = this; // The proxy WebSocket instance
            let targetUrl;
            try { targetUrl = new URL(url); }
            catch (e) { // Invalid URL
                error("Invalid WebSocket URL:", url, e);
                return new OriginalWebSocket(url, protocols); // Let original WS handle it
            }

            const isTargetHost = targetUrl.hostname === INTERCEPT_WS_HOST;
            if (!isTargetHost) {
                log('WS: Not target host, using original WebSocket:', url);
                return new OriginalWebSocket(url, protocols);
            }

            log('WS: Intercepting WebSocket connection to:', url);
            let realWebSocket;
            try {
                 realWebSocket = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
            } catch (e) {
                error("Error creating original WebSocket instance:", e);
                // This is tricky. If the constructor throws, the 'instance' (this) is not fully set up.
                // Re-throwing might be best, or trying to mimic an error state on 'instance'.
                throw e; // Re-throw for now. The caller (game code) should handle this.
            }

            const instanceOriginalSend = realWebSocket.send; // Cache original send for this instance
            let proxiedEventHandlers = {}; // To store handlers like onmessage, onopen

            // Proxy properties
            ['binaryType', 'bufferedAmount', 'extensions', 'protocol', 'readyState', 'url'].forEach(prop => {
                 Object.defineProperty(instance, prop, {
                    get: () => { try { return realWebSocket[prop]; } catch(e) { error(`Error getting WS prop '${prop}':`, e); return undefined;} },
                    // Only allow setting binaryType, others are read-only or managed by the browser/WS
                    set: (value) => { if (prop === 'binaryType') { try { realWebSocket[prop] = value; } catch(e) { error(`Error setting WS prop '${prop}':`, e); } } },
                    enumerable: true, configurable: true
                 });
             });

            // Proxy event handlers (onopen, onmessage, onclose, onerror)
            ['open', 'message', 'close', 'error'].forEach(type => {
                 Object.defineProperty(instance, `on${type}`, {
                     get: () => proxiedEventHandlers[type] || null,
                     set: (handler) => {
                         // Remove previous wrapper if it exists
                         if (proxiedEventHandlers[type] && proxiedEventHandlers[type]._wrapper) {
                             try { realWebSocket.removeEventListener(type, proxiedEventHandlers[type]._wrapper); }
                             catch(e){ error(`Error removing old WS listener for ${type}:`, e); }
                         }
                         if (typeof handler === 'function') {
                              proxiedEventHandlers[type] = handler;
                              // Create a wrapper to call the handler with `instance` (proxy) as `this`
                              const wrapper = (event) => {
                                  try { handler.call(instance, event); } // Call with proxy as `this`
                                  catch(e) {
                                      error(`Error in proxied on${type} handler:`, e);
                                      // Dispatch a generic error event on the proxy if a handler fails
                                      try { instance.dispatchEvent(new Event('error')); } catch {}
                                  }
                              };
                              proxiedEventHandlers[type]._wrapper = wrapper; // Store wrapper for removal
                              try { realWebSocket.addEventListener(type, wrapper); } // Attach to real WebSocket
                              catch(e){ error(`Error adding WS listener for ${type}:`, e); }
                         } else {
                             proxiedEventHandlers[type] = null; // Clear handler
                         }
                     },
                    enumerable: true, configurable: true
                 });
             });

            // Proxy methods
            instance.addEventListener = function(type, listener, options) {
                 log(`WS proxy addEventListener: ${type}`);
                 try { return realWebSocket.addEventListener(type, listener, options); } // Forward to real WS
                 catch(e) { error("Error in proxied WS addEventListener:", e); }
            };
            instance.removeEventListener = function(type, listener, options) {
                log(`WS proxy removeEventListener: ${type}`);
                 try { return realWebSocket.removeEventListener(type, listener, options); } // Forward to real WS
                 catch(e) { error("Error in proxied WS removeEventListener:", e); }
            };
            instance.close = function(code, reason) {
                log('WS proxy close called');
                 try { return realWebSocket.close(code, reason); } // Forward to real WS
                 catch(e) { error("Error in proxied WS close:", e); }
            };

            instance.send = async function(data) {
                log('WS proxy send called');
                const podsEnabled = GM_getValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                log(`>>> [WS Send Check] PODS Interceptor Enabled: ${podsEnabled}`);

                if (podsEnabled) {
                    log("WS: PODS Interceptor is ENABLED. Processing message for server.");
                    let dataToSend, dataType;
                    try {
                         if (typeof data === 'string') { dataToSend = data; dataType = 'text'; log('WS: Data is string'); }
                         else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataType = 'base64_arraybuffer'; log('WS: Data is ArrayBuffer'); }
                         else if (data instanceof Blob) {
                             log('WS: Data is Blob, converting...');
                             dataToSend = await blobToBase64(data); // Asynchronously convert blob
                             dataType = 'base64_blob';
                             log('WS: Blob converted');
                         }
                         else { // Unknown data type
                             log('WS: Data type unknown, sending directly (interceptor enabled but type unknown).');
                             instanceOriginalSend.call(realWebSocket, data); // Use cached original send
                             return;
                         }
                     } catch (conversionError) {
                         error("Error converting WebSocket data for interception:", conversionError);
                         log("WS: Sending original data due to conversion error.");
                         try { instanceOriginalSend.call(realWebSocket, data); }
                         catch (e) { error("Error sending original WS data after conversion error:", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                         return;
                     }

                     let payload = {
                         requestType: 'websocketMessage',
                         wsUrl: realWebSocket.url, // URL of the real WebSocket
                         messageData: dataToSend,
                         dataType: dataType,
                         contentType: (data instanceof Blob) ? data.type : undefined // Include blob content type
                     };

                     let podsNumbers = [];
                     let storedNumbersJson = "NOT_RETRIEVED"; // For debugging
                     try {
                         storedNumbersJson = GM_getValue(PODS_NUMBERS_KEY, '[]');
                         if (storedNumbersJson !== '[]') { // Avoid parsing '[]' if it's common
                             podsNumbers = JSON.parse(storedNumbersJson);
                         }
                         if (!Array.isArray(podsNumbers) || podsNumbers.length !== 3) {
                             log(`[Send Payload] Stored podsNumbers invalid or empty: ${storedNumbersJson}. Clearing PODS interceptor state.`);
                             podsNumbers = []; // Ensure it's an empty array
                             // If numbers are invalid, maybe we shouldn't intercept? Or let server decide?
                             // For now, we disable PODS if numbers are bad to prevent faulty !buy
                             GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                             GM_setValue(PODS_NUMBERS_KEY, '[]');
                         }
                     } catch (e) {
                         error("[WS Send Payload] Error parsing stored podsNumbers:", e, "Value was:", storedNumbersJson);
                         podsNumbers = []; // Ensure it's an empty array on error
                         GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false); // Disable on error
                         GM_setValue(PODS_NUMBERS_KEY, '[]');
                     }

                     // Only proceed with server if podsNumbers are valid (3 elements)
                     if (podsNumbers.length === 3) {
                        payload.podsNumbers = podsNumbers;
                        if (typeof sendMessageToServerFn === 'function') {
                            // Pass realWebSocket and original data for fallback within sendMessageToServerFn
                            sendMessageToServerFn(payload, realWebSocket, data);
                        } else {
                            error("WS Intercept: sendMessageToServerFn is not a function! Cannot send to server.");
                            log("WS Intercept: Sending original data directly due to missing sender function.");
                            try { instanceOriginalSend.call(realWebSocket, data); }
                            catch (e) { error("Error sending original data after missing sender function:", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                        }
                     } else {
                         // PODS enabled but numbers became invalid; send data directly to game
                         log('WS: PODS Interceptor enabled but numbers invalid/cleared, sending data directly to game server.');
                         try { instanceOriginalSend.call(realWebSocket, data); }
                         catch (e) { error("Error sending data on real WebSocket (invalid podsNumbers path):", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                     }
                } else { // PODS Interceptor is DISABLED
                    log("WS: PODS Interceptor is DISABLED. Sending data directly to game server.");
                    try {
                        instanceOriginalSend.call(realWebSocket, data); // Use cached original send
                    } catch (e) {
                        error("Error sending original data directly to game server (interceptor disabled):", e);
                        // Try to dispatch an error on the proxy instance so game code might react
                        try { instance.dispatchEvent(new Event('error')); } catch {}
                    }
                }
            };
            return instance; // Return the proxy instance
        };

         // Attempt to make the proxy's prototype chain and statics match the original WebSocket
         try {
            // Set prototype to ensure `instanceof WebSocket` might still work (though often unreliable with proxies)
            Object.setPrototypeOf(unsafeWindow.WebSocket, OriginalWebSocket);
            unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;
            // Ensure constructor points to our proxy
            Object.defineProperty(unsafeWindow.WebSocket.prototype, 'constructor', { value: unsafeWindow.WebSocket, writable: true, configurable: true, enumerable: false });

            // Copy static properties like CONNECTING, OPEN, etc.
            ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(state => {
                 if (state in OriginalWebSocket) { // Check if property exists on OriginalWebSocket
                     Object.defineProperty(unsafeWindow.WebSocket, state, {
                         value: OriginalWebSocket[state],
                         writable: false, configurable: false, enumerable: true
                     });
                 }
             });
         } catch (e) {
             error("Error setting up WebSocket prototype/statics for proxy:", e);
             // If this fails, the game might detect the proxy more easily, but core functionality should remain.
         }
         log('WebSocket interception hooks installed.');
    }

})();