// ==UserScript==
// @name           PODS
// @version        6.0.0
// @author         k0gasa
// @description    podx ext
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
// @downloadURL https://update.greasyfork.org/scripts/532390/PODS.user.js
// @updateURL https://update.greasyfork.org/scripts/532390/PODS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG = true;
    const SCRIPT_TAG = '[ItemSearch]';
    const INTERCEPT_XHR_URLS = [
        'wamf/KidInventory/getPaginatedContentOfType',
        'instance/changeColors'
    ];
    const INTERCEPT_WS_HOST = 'sfox.woozworld.com';
    const YOUR_SERVER_URL = 'https://k0gasa.pythonanywhere.com/ww-data';
    const CATALOG_ENABLED_KEY = 'interceptorEnabled';
    const PODS_INTERCEPTOR_ENABLED_KEY = 'podsInterceptorEnabled';
    const PODS_NUMBERS_KEY = 'podsNumbers';
    const log = (...args) => { if (DEBUG) console.log(SCRIPT_TAG, ...args); };
    const error = (...args) => console.error(SCRIPT_TAG, ...args);
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
                     } else {
                        finalResponse = responseDataBuffer;
                    }
                } catch (decodeError) {
                     error("Error processing/decoding response buffer:", decodeError);
                     finalResponse = responseDataBuffer;
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
                navBar.style.overflow = 'visible';
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
    let currentItemType = 'garment';
    let searchTimeout = null;
    let searchResults = [];
    let currentPage = 1;
    const itemsPerPage = 4;
    let activeItemString = null;
    unsafeWindow.hideSearchDropdown = () => {
        const dropdownPanel = document.getElementById('ww-search-results-dropdown');
        if (dropdownPanel) {
            log("Hiding dropdown");
            dropdownPanel.style.opacity = '0';
            dropdownPanel.style.visibility = 'hidden';
            setTimeout(() => {
                if (dropdownPanel.style.opacity === '0') {
                    dropdownPanel.style.display = 'none';
                }
            }, 200);
        } else { log("HideDropdown: Panel not found"); }
    };
    unsafeWindow.showSearchDropdown = () => {
        const dropdownPanel = document.getElementById('ww-search-results-dropdown');
        const searchInput = document.getElementById('ww-descriptor-search');
        if (dropdownPanel && searchInput) {
            log("Showing dropdown");
            const inputRect = searchInput.getBoundingClientRect();
            dropdownPanel.style.top = `${inputRect.bottom + window.scrollY + 2}px`;
            dropdownPanel.style.left = `${inputRect.left + window.scrollX}px`;
            dropdownPanel.style.display = 'flex';
            setTimeout(() => {
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
         resultsListContainer.innerHTML = '';
         const start = (page - 1) * itemsPerPage;
         const end = start + itemsPerPage;
         const pageItems = searchResults.slice(start, end);
         pageItems.forEach(item => {
             const itemDiv = document.createElement('div');
             itemDiv.dataset.itemString = item.item_string;
             itemDiv.dataset.thumbnail = item.thumbnail || '';
             if (item.stackAmount !== undefined) {
                 itemDiv.dataset.stackAmount = item.stackAmount;
             }
             itemDiv.style.display = 'flex';
             itemDiv.style.justifyContent = 'space-between';
             itemDiv.style.alignItems = 'center';
             itemDiv.style.padding = '8px 10px';
             itemDiv.style.cursor = 'pointer';
             itemDiv.style.color = 'white';
             itemDiv.style.borderBottom = '1px solid #444';
             itemDiv.style.whiteSpace = 'nowrap';
             const itemTextSpan = document.createElement('span');
             itemTextSpan.textContent = item.display_text;
             itemDiv.appendChild(itemTextSpan);
             if (item.item_string === activeItemString) {
                 itemDiv.style.backgroundColor = '#00aa00';
                 const removeButton = createRemoveButton(itemDiv, item.item_string);
                 itemDiv.appendChild(removeButton);
             }
             itemDiv.addEventListener('click', (event) => {
                 if (event.target.tagName === 'BUTTON') return;
                 const clickedItemString = itemDiv.dataset.itemString;
                 log(`Item clicked: ${clickedItemString}`);
                 Array.from(resultsListContainer.children).forEach(child => {
                     if (child.tagName.toLowerCase() === 'div' && child.dataset.itemString) {
                         child.style.backgroundColor = 'transparent';
                         const existingButton = child.querySelector('button');
                         if (existingButton) existingButton.remove();
                     }
                 });
                 if (activeItemString === clickedItemString){
                     itemDiv.style.backgroundColor = 'transparent';
                     searchInput.style.backgroundColor = '#c9e0f1';
                     GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                     GM_setValue(PODS_NUMBERS_KEY, '[]');
                     activeItemString = null;
                     searchInput.value = '';
                     const removeButton = itemDiv.querySelector('button');
                     if (removeButton) removeButton.remove();
                 } else {
                     itemDiv.style.backgroundColor = '#00aa00';
                     searchInput.value = clickedItemString;
                     activeItemString = clickedItemString;
                     searchInput.style.backgroundColor = '#aaffaa';
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
                 unsafeWindow.hideSearchDropdown();
             });
             itemDiv.addEventListener('mouseenter', () => {
                 if (itemDiv.dataset.itemString !== activeItemString) { itemDiv.style.backgroundColor = '#555'; }
             });
             itemDiv.addEventListener('mouseleave', () => {
                 if (itemDiv.dataset.itemString !== activeItemString) { itemDiv.style.backgroundColor = 'transparent'; }
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
        removeButton.style.lineHeight = '14px';
        removeButton.style.textAlign = 'center';
        removeButton.style.cursor = 'pointer';
        removeButton.title = 'Remove this item from DB';
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const itemToRemoveString = itemString;
            log(`Remove button clicked for: ${itemToRemoveString}`);
            const payload = { requestType: 'confirmBuy', itemString: itemToRemoveString, itemType: currentItemType };
            if (unsafeWindow.sendWebSocketMessageToServer) {
                unsafeWindow.sendWebSocketMessageToServer(payload);
                const itemIndex = searchResults.findIndex(res => res.item_string === itemToRemoveString);
                if (itemIndex > -1) {
                    const localItem = searchResults[itemIndex];
                    log(`Checking item: ${localItem.item_string}, stackAmount: ${localItem.stackAmount}, type: ${typeof localItem.stackAmount}`);
                    const currentStack = Number(localItem.stackAmount);
                    log(`Converted stack: ${currentStack}, type: ${typeof currentStack}, isNaN: ${isNaN(currentStack)}`);
                    if (!isNaN(currentStack) && currentStack > 1) {
                        log("--> Decrementing stack");
                        localItem.stackAmount = currentStack - 1;
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
                    activeItemString = null;
                    GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                    GM_setValue(PODS_NUMBERS_KEY, '[]');
                    const searchInput = document.getElementById('ww-descriptor-search');
                    if(searchInput) {
                        searchInput.value = '';
                        searchInput.style.backgroundColor = '#c9e0f1';
                    }
                    unsafeWindow.renderSearchPage(currentPage);
                } else {
                    log("Item not found in local searchResults array for removal/decrement.");
                    itemDiv.remove();
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
        searchResults = (results || []).map(item => ({
            ...item,
            stackAmount: item.stackAmount !== undefined ? Number(item.stackAmount) : 1
        }));
        currentPage = 1;
        resultsListContainer.innerHTML = '';
        thumbnailContainer.style.display = 'none';
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
        if (searchResults[0].thumbnail) {
            dropdownThumbnailImg.src = searchResults[0].thumbnail;
            thumbnailContainer.style.display = 'flex';
        }
        unsafeWindow.renderSearchPage(currentPage);
        unsafeWindow.showSearchDropdown();
    }
    function addSearchUI(navBar) {
        if (!navBar || document.getElementById('ww-search-container')) return;
        const searchContainer = document.createElement('div');
        searchContainer.id = 'ww-search-container';
        searchContainer.style.display = 'inline-flex';
        searchContainer.style.alignItems = 'center';
        searchContainer.style.zIndex = '10001';
        searchContainer.style.position = 'relative';
        searchContainer.style.padding = '14px 20px';
        const inputWrapper = document.createElement('div');
        inputWrapper.style.position = 'relative';
        inputWrapper.style.display = 'inline-block';
        const typeSelector = document.createElement('span');
        typeSelector.id = 'ww-item-type-selector';
        typeSelector.textContent = '👕';
        typeSelector.style.position = 'absolute';
        typeSelector.style.left = '5px';
        typeSelector.style.top = '50%';
        typeSelector.style.transform = 'translateY(-50%)';
        typeSelector.style.cursor = 'pointer';
        typeSelector.style.fontSize = '14px';
        typeSelector.style.zIndex = '2';
        typeSelector.title = 'Click to switch between Garment/Furniture';
        inputWrapper.appendChild(typeSelector);
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'ww-descriptor-search';
        searchInput.placeholder = 'Search ID...';
        searchInput.style.padding = '4px 10px 4px 28px';
        searchInput.style.border = '1px solid #666';
        searchInput.style.borderRadius = '4px';
        searchInput.style.color = '#333';
        searchInput.style.backgroundColor = '#c9e0f1';
        searchInput.style.fontSize = '12px';
        searchInput.style.fontFamily = 'Lato';
        searchInput.style.minWidth = '100px';
        searchInput.style.boxSizing = 'border-box';
        inputWrapper.appendChild(searchInput);
        searchContainer.appendChild(inputWrapper);
        const dropdownPanel = document.createElement('div');
        dropdownPanel.id = 'ww-search-results-dropdown';
        dropdownPanel.style.display = 'none';
        dropdownPanel.style.visibility = 'hidden';
        dropdownPanel.style.opacity = '0';
        dropdownPanel.style.position = 'fixed';
        dropdownPanel.style.display = 'flex';
        dropdownPanel.style.backgroundColor = 'rgba(40, 40, 40, 0.95)';
        dropdownPanel.style.border = '1px solid #555';
        dropdownPanel.style.borderRadius = '8px';
        dropdownPanel.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        dropdownPanel.style.zIndex = '99999';
        dropdownPanel.style.transition = 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out';
        const resultsListContainer = document.createElement('div');
        resultsListContainer.id = 'ww-search-results-list';
        resultsListContainer.style.flex = '1';
        resultsListContainer.style.padding = '5px 0';
        resultsListContainer.style.borderRight = '1px solid #555';
        resultsListContainer.style.minHeight = '50px';
        dropdownPanel.appendChild(resultsListContainer);
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.id = 'ww-search-thumbnail-container';
        thumbnailContainer.style.padding = '10px';
        thumbnailContainer.style.display = 'none';
        thumbnailContainer.style.alignItems = 'center';
        thumbnailContainer.style.justifyContent = 'center';
        thumbnailContainer.style.minWidth = '80px';
        const dropdownThumbnailImg = document.createElement('img');
        dropdownThumbnailImg.id = 'ww-search-dropdown-thumbnail';
        dropdownThumbnailImg.style.maxWidth = '100%';
        dropdownThumbnailImg.style.maxHeight = '120px';
        dropdownThumbnailImg.style.objectFit = 'contain';
        dropdownThumbnailImg.style.display = 'block';
        thumbnailContainer.appendChild(dropdownThumbnailImg);
        dropdownPanel.appendChild(thumbnailContainer);
        document.body.appendChild(dropdownPanel);
        navBar.appendChild(searchContainer);
        const updateTypeSelector = () => {
            typeSelector.textContent = currentItemType === 'garment' ? '👕' : '🪑';
        };
        typeSelector.addEventListener('click', () => {
            currentItemType = (currentItemType === 'garment') ? 'furniture' : 'garment';
            updateTypeSelector();
            if (searchInput.value.trim()) {
                clearTimeout(searchTimeout);
                triggerSearch();
            }
        });
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchInput.style.backgroundColor = '#c9e0f1';
            if (activeItemString) {
                 GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                 GM_setValue(PODS_NUMBERS_KEY, '[]');
                 activeItemString = null;
                 log('Item deactivated due to input change.');
            }
            searchTimeout = setTimeout(triggerSearch, 300);
        });
        document.addEventListener('click', (event) => {
            if (!searchContainer.contains(event.target) && !dropdownPanel.contains(event.target)) {
                unsafeWindow.hideSearchDropdown();
            }
        });
        searchInput.addEventListener('click', (event) => {
            event.stopPropagation();
            if (resultsListContainer.children.length > 0) {
                 unsafeWindow.showSearchDropdown();
            }
        });
        function triggerSearch() {
            const descriptorId = searchInput.value.trim();
            if (!/^\d+$/.test(descriptorId)) {
                log('Invalid Descriptor ID entered.');
                unsafeWindow.displaySearchResults([]);
                return;
            }
            log(`Triggering search for ID: ${descriptorId}, Type: ${currentItemType}`);
            const payload = {
                requestType: 'searchItems',
                descriptorId: descriptorId,
                itemType: currentItemType
            };
            if (unsafeWindow.sendWebSocketMessageToServer) {
                unsafeWindow.sendWebSocketMessageToServer(payload);
            } else {
                error("sendWebSocketMessageToServer function not available for triggerSearch.");
                unsafeWindow.displaySearchResults([]);
            }
        }
        function sendConfirmBuy() {
             if (activeItemString) {
                 log(`Sending confirmBuy for: ${activeItemString}, Type: ${currentItemType}`);
                 const payload = {
                     requestType: 'confirmBuy',
                     itemString: activeItemString,
                     itemType: currentItemType
                 };
                 if (unsafeWindow.sendWebSocketMessageToServer) {
                     unsafeWindow.sendWebSocketMessageToServer(payload);
                 } else {
                     error("sendWebSocketMessageToServer function not available for confirmBuy.");
                 }
                 GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                 GM_setValue(PODS_NUMBERS_KEY, '[]');
                 activeItemString = null;
                 searchInput.value = '';
                 searchInput.style.backgroundColor = '#c9e0f1';
             } else {
                 log('No active item to confirm buy for.');
             }
        }
        unsafeWindow.sendConfirmBuy = sendConfirmBuy;
        log('Search UI added.');
    }
    unsafeWindow.sendWebSocketMessageToServer = function(payload) {
        log(`Sending request to server from Main Page:`, payload);
        GM_xmlhttpRequest({
            method: 'POST',
            url: YOUR_SERVER_URL,
            data: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            responseType: 'text',
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
                         } catch (e) { error('Error parsing confirmBuy response:', e); }
                     } else {
                         error('Confirm buy request failed on server:', serverResponse.status, serverResponse.statusText);
                         alert(`Server failed to remove item ${payload.itemString} from database.`);
                     }
                }
            },
            onerror: function(error) {
                error(`GM_XHR Error for ${payload.requestType}:`, error);
                 if (payload.requestType === 'searchItems') {
                    if (typeof unsafeWindow.displaySearchResults === 'function') { unsafeWindow.displaySearchResults([]); }
                } else if (payload.requestType === 'confirmBuy') {
                    alert(`Network error trying to remove item ${payload.itemString}.`);
                }
            },
             ontimeout: function() {
                error(`GM_XHR Timeout for ${payload.requestType}`);
                 if (payload.requestType === 'searchItems') {
                    if (typeof unsafeWindow.displaySearchResults === 'function') { unsafeWindow.displaySearchResults([]); }
                } else if (payload.requestType === 'confirmBuy') {
                    alert(`Timeout trying to remove item ${payload.itemString}.`);
                }
            }
        });
    }
    function setupInnerIframe() {
        log("Setting up Inner Iframe Interceptors...");
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
                        let finalData = originalData;
                        if (serverResponse.status === 200) {
                            try {
                                const responseJson = JSON.parse(serverResponse.responseText);
                                if (responseJson && responseJson.modifiedMessageData !== undefined && responseJson.dataType) {
                                    log('WS Inner: Received processed message from server, type:', responseJson.dataType);
                                    if (responseJson.dataType === 'text') { finalData = String(responseJson.modifiedMessageData); }
                                    else if (responseJson.dataType === 'base64_arraybuffer') { finalData = base64ToArrayBuffer(responseJson.modifiedMessageData); }
                                    else if (responseJson.dataType === 'base64_blob') { finalData = base64ToBlob(responseJson.modifiedMessageData, responseJson.contentType || ''); }
                                    else { log('WS Inner: Unknown dataType from server, using original data.'); }
                                } else { log('WS Inner: Server response OK but invalid format or no modified data, using original data.'); }
                            } catch (e) { error('WS Inner: Error parsing server response:', e, serverResponse.responseText); log('WS Inner: Using original data due to server response parse error.'); }
                        } else { error('WS Inner: Server returned error status:', serverResponse.status, serverResponse.statusText); log('WS Inner: Using original data due to server error.'); }
                        try {
                            const instanceOriginalSend = originalWebSocket.send;
                            if (originalWebSocket && originalWebSocket.readyState === WebSocket.OPEN) {
                                instanceOriginalSend.call(originalWebSocket, finalData);
                            } else { log('WS Inner: Cannot send final data. State:', originalWebSocket ? originalWebSocket.readyState : 'N/A'); }
                        } catch (sendError) { error("WS Inner: Error sending final data on real WebSocket:", sendError); }
                    }
                },
                onerror: function(error) {
                    error(`Inner Frame GM_XHR Error for ${payload.requestType}:`, error);
                    if (payload.requestType === 'websocketMessage' && originalWebSocket && originalData) {
                        log('WS Inner: Using original data due to GM_XHR network error.');
                        try {
                            const instanceOriginalSend = originalWebSocket.send;
                            if (originalWebSocket.readyState === WebSocket.OPEN) { instanceOriginalSend.call(originalWebSocket, originalData); }
                            else { log('WS Inner: Not OPEN after server error. State:', originalWebSocket.readyState); }
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
                            else { log('WS Inner: Not OPEN after server timeout. State:', originalWebSocket.readyState); }
                        } catch (sendError) { error("WS Inner: Error sending original data after server timeout:", sendError); }
                    }
                }
            });
        }
        if (!unsafeWindow._wwXHRInterceptorInstalled) {
            setupXHRInterception();
        } else {
            log('XHR Interceptor already installed.');
        }
        if (!unsafeWindow._wwWebSocketInterceptorInstalled) {
            setupWebSocketInterception(sendWebSocketMessageToServerInner);
        } else {
             log('WebSocket Interceptor already installed.');
        }
    }
    function setupXHRInterception() {
        unsafeWindow._wwXHRInterceptorInstalled = true;
        const origXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const origXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;
        const origSetRequestHeader = unsafeWindow.XMLHttpRequest.prototype.setRequestHeader;
        unsafeWindow.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (!this._wwRequestHeaders) this._wwRequestHeaders = {};
            this._wwRequestHeaders[header] = value;
            try { return origSetRequestHeader.apply(this, arguments); }
            catch (e) { error("Error applying original setRequestHeader:", e); return undefined; }
        };
        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, async ) {
            this._wwOriginalUrl = String(url || '');
            this._wwMethod = String(method || 'GET').toUpperCase();
            this._wwIsAsync = async !== false;
            this._wwRequestHeaders = {};
             try { return origXHROpen.apply(this, arguments); }
             catch (e) { error("Error applying original XHR open:", e); throw e; }
        };
        unsafeWindow.XMLHttpRequest.prototype.send = function(data) {
            const url = this._wwOriginalUrl;
            const method = this._wwMethod;
            const xhr = this;
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
                const originalResponseType = xhr.responseType;
                if (isChangeColors) { handleChangeColorsRequest(xhr, url, method, data); }
                else { handlePaginatedContentRequest(xhr, url, method, data, originalResponseType); }
                return;
            }
            log('XHR send: Not intercepting (Catalog disabled or URL mismatch):', url);
             try { return origXHRSend.apply(this, arguments); }
             catch (e) { error("Error applying original XHR send (not intercepted):", e); setXHRProperties(xhr, 0, 'Send Error', null); return undefined; }
        };
        log('XHR interception hooks installed.');
    }
     function handlePaginatedContentRequest(xhr, url, method, data, originalResponseType) {
         let dataToSend, dataFormat;
         try {
             if (data instanceof Uint8Array) { dataToSend = arrayBufferToBase64(data.buffer); dataFormat = 'base64'; }
             else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataFormat = 'base64'; }
             else if (data === null || data === undefined) { dataToSend = ''; dataFormat = 'text'; }
             else if (typeof data === 'object' && data !== null && !(data instanceof Blob)) { dataToSend = JSON.stringify(data); dataFormat = 'json'; }
             else if (typeof data === 'string') { dataToSend = data; dataFormat = 'text'; }
             else if (data instanceof Blob) { throw new Error('Blob data type not handled in getPaginatedContentOfType'); }
             else { dataToSend = String(data); dataFormat = 'text'; }
         } catch(e) { error('XHR data conversion error:', e); setXHRProperties(xhr, 500, 'Script Error', null); return; }
         let urlParams = {}; try { const urlObj = new URL(url, unsafeWindow.location.origin); urlObj.searchParams.forEach((v, k) => { urlParams[k] = v; }); } catch (e) {  }
         const copyRequest = new XMLHttpRequest(); copyRequest._wwIsCopyRequest = true; copyRequest.open(method, url, true); copyRequest.responseType = 'arraybuffer';
         if (xhr._wwRequestHeaders) { for (const h in xhr._wwRequestHeaders) { try {copyRequest.setRequestHeader(h, xhr._wwRequestHeaders[h]);} catch(e){ log(`Warn: Could not copy header ${h}`, e)} } }
         copyRequest.onload = function() {
             if (copyRequest.status >= 200 && copyRequest.status < 300) {
                 const originalResponse = copyRequest.response; const originalResponseBase64 = arrayBufferToBase64(originalResponse);
                 GM_xmlhttpRequest({
                     method: 'POST', url: YOUR_SERVER_URL,
                     data: JSON.stringify({ requestType: 'getPaginatedContentOfType', requestData: dataToSend, dataFormat: dataFormat, originalResponseBase64: originalResponseBase64, urlParams: urlParams, originalResponseType: originalResponseType }),
                     headers: { 'Content-Type': 'application/json', 'X-Original-URL': url, 'X-Original-Method': method },
                     responseType: 'text',
                     timeout: 15000,
                     onload: function(serverResponse) {
                         if (serverResponse.status === 200) {
                             try {
                                 const modBuffer = base64ToArrayBuffer(serverResponse.responseText);
                                 setXHRResponse(xhr, 200, 'OK', modBuffer, originalResponseType);
                             } catch (e) { error('Error processing server response:', e); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); }
                         } else { log("XHR Fallback: Server error status."); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); }
                     },
                     onerror: function(error) { error('XHR GM_XHR network error:', error); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); },
                     ontimeout: function() { error('XHR GM_XHR timeout'); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); }
                 });
             } else { error('XHR Original request (copy) failed:', copyRequest.status); setXHRProperties(xhr, copyRequest.status, copyRequest.statusText, copyRequest.response); }
         };
         copyRequest.onerror = function() { error('XHR Network error on copy request'); setXHRProperties(xhr, 0, 'Network Error', null); };
         copyRequest.ontimeout = function() { error('XHR Network timeout on copy request'); setXHRProperties(xhr, 0, 'Network Timeout', null); };
         copyRequest.timeout = 10000;
         try { copyRequest.send(data); } catch(e) { error("Error sending XHR copy request:", e); setXHRProperties(xhr, 0, 'Send Error', null); }
     }
    function handleChangeColorsRequest(xhr, url, method, data) {
         log('Handling changeColors request via server (Catalog)');
         let dataToSend, dataFormat;
          try {
             if (data instanceof Uint8Array) { dataToSend = arrayBufferToBase64(data.buffer); dataFormat = 'base64'; }
             else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataFormat = 'base64'; }
             else if (data === null || data === undefined) { dataToSend = ''; dataFormat = 'text'; }
             else if (typeof data === 'object' && data !== null && !(data instanceof Blob)) { dataToSend = JSON.stringify(data); dataFormat = 'json'; }
             else if (typeof data === 'string') { dataToSend = data; dataFormat = 'text'; }
             else if (data instanceof Blob) { throw new Error('Blob data type not handled in changeColors'); }
             else { dataToSend = String(data); dataFormat = 'text'; }
         } catch(e) { error('XHR data conversion error:', e); setXHRProperties(xhr, 500, 'Script Error', null); return; }
         let urlParams = {}; try { const urlObj = new URL(url, unsafeWindow.location.origin); urlObj.searchParams.forEach((v, k) => { urlParams[k] = v; }); } catch (e) {  }
         GM_xmlhttpRequest({
             method: 'POST', url: YOUR_SERVER_URL,
             data: JSON.stringify({ requestType: 'changeColors', requestData: dataToSend, dataFormat: dataFormat, urlParams: urlParams, originalResponseType: xhr.responseType }),
             headers: { 'Content-Type': 'application/json', 'X-Original-URL': url, 'X-Original-Method': method },
             responseType: 'text',
             timeout: 15000,
             onload: function(serverResponse) {
                 if (serverResponse.status === 200) {
                     try {
                         const finalBuffer = base64ToArrayBuffer(serverResponse.responseText);
                         setXHRResponse(xhr, 200, 'OK', finalBuffer, xhr.responseType);
                     } catch (e) { error('Error processing changeColors response:', e); setXHRProperties(xhr, 502, 'Bad Gateway Response', null); }
                 } else {
                     error('XHR Server returned error for changeColors:', serverResponse.status, serverResponse.statusText);
                     setXHRProperties(xhr, serverResponse.status, serverResponse.statusText || 'Server Error', null);
                 }
             },
             onerror: function(error) {
                 error('XHR GM_XHR network error changeColors:', error);
                 setXHRProperties(xhr, 0, 'Network Error', null);
             },
             ontimeout: function() {
                 error('XHR GM_XHR timeout changeColors');
                 setXHRProperties(xhr, 0, 'Gateway Timeout', null);
             }
         });
     }
    function setupWebSocketInterception(sendMessageToServerFn) {
        unsafeWindow._wwWebSocketInterceptorInstalled = true;
        const OriginalWebSocket = unsafeWindow.WebSocket;
        unsafeWindow.WebSocket = function(url, protocols) {
            let instance = this;
            let targetUrl;
            try { targetUrl = new URL(url); }
            catch (e) { error("Invalid WebSocket URL:", url, e); return new OriginalWebSocket(url, protocols); }
            const isTargetHost = targetUrl.hostname === INTERCEPT_WS_HOST;
            if (!isTargetHost) {
                log('WS: Not target host, using original WebSocket:', url);
                return new OriginalWebSocket(url, protocols);
            }
            log('WS: Intercepting WebSocket connection to:', url);
            let realWebSocket;
            try {
                 realWebSocket = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
            } catch (e) { error("Error creating original WebSocket instance:", e); throw e; }
            const instanceOriginalSend = realWebSocket.send;
            let proxiedEventHandlers = {};
            ['binaryType', 'bufferedAmount', 'extensions', 'protocol', 'readyState', 'url'].forEach(prop => {
                 Object.defineProperty(instance, prop, {
                    get: () => { try { return realWebSocket[prop]; } catch(e) { error(`Error getting WS prop '${prop}':`, e); return undefined;} },
                    set: (value) => { if (prop === 'binaryType') { try { realWebSocket[prop] = value; } catch(e) { error(`Error setting WS prop '${prop}':`, e); } } },
                    enumerable: true, configurable: true
                 });
             });
            ['open', 'message', 'close', 'error'].forEach(type => {
                 Object.defineProperty(instance, `on${type}`, {
                     get: () => proxiedEventHandlers[type] || null,
                     set: (handler) => {
                         if (proxiedEventHandlers[type] && proxiedEventHandlers[type]._wrapper) {
                             try { realWebSocket.removeEventListener(type, proxiedEventHandlers[type]._wrapper); }
                             catch(e){ error(`Error removing old WS listener for ${type}:`, e); }
                         }
                         if (typeof handler === 'function') {
                              proxiedEventHandlers[type] = handler;
                              const wrapper = (event) => {
                                  try { handler.call(instance, event); }
                                  catch(e) { error(`Error in proxied on${type} handler:`, e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                              };
                              proxiedEventHandlers[type]._wrapper = wrapper;
                              try { realWebSocket.addEventListener(type, wrapper); }
                              catch(e){ error(`Error adding WS listener for ${type}:`, e); }
                         } else { proxiedEventHandlers[type] = null; }
                     },
                    enumerable: true, configurable: true
                 });
             });
            instance.addEventListener = function(type, listener, options) {
                 log(`WS addEventListener: ${type}`);
                 try { return realWebSocket.addEventListener(type, listener, options); }
                 catch(e) { error("Error in proxied WS addEventListener:", e); }
            };
            instance.removeEventListener = function(type, listener, options) {
                log(`WS removeEventListener: ${type}`);
                 try { return realWebSocket.removeEventListener(type, listener, options); }
                 catch(e) { error("Error in proxied WS removeEventListener:", e); }
            };
            instance.close = function(code, reason) {
                log('WS proxy close called');
                 try { return realWebSocket.close(code, reason); }
                 catch(e) { error("Error in proxied WS close:", e); }
            };
            instance.send = async function(data) {
                log('WS proxy send called');
                const podsEnabled = GM_getValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                log(`>>> [WS Send Check] PODS Interceptor Enabled: ${podsEnabled}`);
                if (podsEnabled) {
                    log("WS: Interceptor is ENABLED. Processing message for server.");
                    let dataToSend, dataType;
                    try {
                         if (typeof data === 'string') { dataToSend = data; dataType = 'text'; log('WS: Data is string'); }
                         else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataType = 'base64_arraybuffer'; log('WS: Data is ArrayBuffer'); }
                         else if (data instanceof Blob) { log('WS: Data is Blob, converting...'); dataToSend = await blobToBase64(data); dataType = 'base64_blob'; log('WS: Blob converted'); }
                         else {
                             log('WS: Data type unknown, sending directly (interceptor enabled but type unknown).');
                             instanceOriginalSend.call(realWebSocket, data);
                             return;
                         }
                     } catch (conversionError) {
                         error("Error converting WebSocket data for interception:", conversionError);
                         log("WS: Sending original data due to conversion error.");
                         try { instanceOriginalSend.call(realWebSocket, data); } catch (e) { error("Error sending original WS data after conversion error:", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                         return;
                     }
                     let payload = {
                         requestType: 'websocketMessage',
                         wsUrl: realWebSocket.url,
                         messageData: dataToSend,
                         dataType: dataType,
                         contentType: (data instanceof Blob) ? data.type : undefined
                     };
                     let podsNumbers = [];
                     let storedNumbersJson = "NOT_RETRIEVED";
                     try {
                         storedNumbersJson = GM_getValue(PODS_NUMBERS_KEY, '[]');
                         if (storedNumbersJson !== '[]') {
                             podsNumbers = JSON.parse(storedNumbersJson);
                         }
                         if (!Array.isArray(podsNumbers) || podsNumbers.length !== 3) {
                             log(`[Send Payload] Stored podsNumbers invalid or empty: ${storedNumbersJson}. Clearing.`);
                             podsNumbers = [];
                             GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                             GM_setValue(PODS_NUMBERS_KEY, '[]');
                         }
                     } catch (e) {
                         error("[WS Send Payload] Error parsing stored podsNumbers:", e, "Value was:", storedNumbersJson);
                         podsNumbers = [];
                         GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                         GM_setValue(PODS_NUMBERS_KEY, '[]');
                     }
                     if (podsNumbers.length === 3) {
                        payload.podsNumbers = podsNumbers;
                        if (typeof sendMessageToServerFn === 'function') {
                            sendMessageToServerFn(payload, realWebSocket, data);
                        } else {
                            error("WS Intercept: sendMessageToServerFn is not a function! Cannot send to server.");
                            log("WS Intercept: Sending original data directly due to missing sender function.");
                            try { instanceOriginalSend.call(realWebSocket, data); }
                            catch (e) { error("Error sending original data after missing sender function:", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                        }
                     } else {
                         log('WS: PODS Interceptor enabled but numbers invalid, sending data directly.');
                         try { instanceOriginalSend.call(realWebSocket, data); }
                         catch (e) { error("Error sending data on real WebSocket (invalid podsNumbers):", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                     }
                } else {
                    log("WS: Interceptor is DISABLED. Sending data directly to game server.");
                    try {
                        instanceOriginalSend.call(realWebSocket, data);
                    } catch (e) {
                        error("Error sending original data directly to game server:", e);
                        try { instance.dispatchEvent(new Event('error')); } catch {}
                    }
                }
            };
            return instance;
        };
         try {
            unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;
            Object.defineProperty(unsafeWindow.WebSocket.prototype, 'constructor', { value: unsafeWindow.WebSocket, writable: true, configurable: true, enumerable: false });
            ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(state => {
                 if (state in OriginalWebSocket) {
                     Object.defineProperty(unsafeWindow.WebSocket, state, { value: OriginalWebSocket[state], writable: false, configurable: false, enumerable: true });
                 }
             });
         } catch (e) { error("Error setting up WebSocket prototype/statics:", e); }
         log('WebSocket interception hooks installed.');
    }
})();