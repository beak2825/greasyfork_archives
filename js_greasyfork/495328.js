// ==UserScript==
// @name         Steam 批量操作
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  批量出售，批量下架
// @author       hansa
// @match        *://steamcommunity.com/market/*
// @match        *://steamcommunity.com/market
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495328/Steam%20%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/495328/Steam%20%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get sessionid from cookies
    function getSessionId() {
        const name = 'sessionid=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null;
    }

    const sessionid = getSessionId();  // Get sessionid from cookies
    if (!sessionid) {
        console.warn('sessionid not found. Checkboxes will not be rendered.');
        return;
    }

    let selectedIds = new Set();

    // Function to send POST request to remove listing
    function removeListing(id) {
        const url = `https://steamcommunity.com/market/removelisting/${id}`;
        const data = `sessionid=${sessionid}`;

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
        .then(response => response.text())
        .then(responseText => {
            console.log(`Response for ID ${id}:`, responseText);
        })
        .catch(error => {
            console.error(`Error for ID ${id}:`, error);
        });
    }

    // Function to add the "Select All" checkbox
    function addSelectAllCheckbox() {
        // Create a container for the "Select All" checkbox
        var container = document.createElement('div');
        container.style.marginBottom = '10px';

        // Create the "Select All" checkbox
        var selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'select_all_checkbox';
        selectAllCheckbox.style.marginRight = '5px';

        // Create the label for the "Select All" checkbox
        var label = document.createElement('label');
        label.htmlFor = 'select_all_checkbox';
        label.textContent = 'Select All';

        // Append the checkbox and label to the container
        container.appendChild(selectAllCheckbox);
        container.appendChild(label);

        // Insert the container after the <h3 class="my_market_header"> element
        var marketHeader = document.querySelector('.my_listing_section.market_content_block.market_home_listing_table .my_market_header');
        if (marketHeader) {
            marketHeader.insertAdjacentElement('afterend', container);
        }

        // Add event listener to the "Select All" checkbox
        selectAllCheckbox.addEventListener('change', function() {
            var checkboxes = document.querySelectorAll('.market_listing_checkbox');
            selectedIds.clear();
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = selectAllCheckbox.checked;
                if (selectAllCheckbox.checked) {
                    selectedIds.add(checkbox.dataset.id);
                }
            });
            console.log('Selected IDs:', Array.from(selectedIds));
        });
    }

    // Function to add checkboxes to each market listing row
    function addCheckboxes() {
        // Select all market listing rows within the specific content block
        var rows = document.querySelectorAll('.my_listing_section.market_content_block.market_home_listing_table .market_listing_row');

        // Iterate through each row and add a checkbox if not already added
        rows.forEach(function(row) {
            // Check if the checkbox is already added
            if (!row.querySelector('.market_listing_checkbox')) {
                // Create a new checkbox element
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'market_listing_checkbox';
                checkbox.dataset.id = row.id.split('_').pop();  // Store only the numerical part of the ID

                // Add an event listener to log the id of the row when the checkbox is checked
                checkbox.addEventListener('change', function() {
                    if (checkbox.checked) {
                        selectedIds.add(checkbox.dataset.id);
                    } else {
                        selectedIds.delete(checkbox.dataset.id);
                    }
                    console.log('Selected IDs:', Array.from(selectedIds));
                });

                // Insert the checkbox at the beginning of the row
                row.insertBefore(checkbox, row.firstChild);
            }
        });
    }

    // Add checkboxes when the page loads
    window.addEventListener('load', function() {
        addSelectAllCheckbox();
        addCheckboxes();
    });

    // Add checkboxes when new listings are dynamically loaded
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                addCheckboxes();
            }
        });
    });

    // Observe the container with the listing rows for changes
    var listingContainer = document.querySelector('.my_listing_section.market_content_block.market_home_listing_table');
    if (listingContainer) {
        observer.observe(listingContainer, { childList: true, subtree: true });
    }

    // Add a button to remove selected listings
    function addRemoveButton() {
        var removeButton = document.createElement('button');
        removeButton.textContent = '全部撤下';
        removeButton.style.marginTop = '10px';
        removeButton.addEventListener('click', function() {
            if (confirm('确定要撤下所选物品吗？')) {
                let removePromises = [];
                selectedIds.forEach(function(id) {
                    removePromises.push(removeListing(id));
                });
                Promise.all(removePromises).then(() => {
                    window.location.reload();
                });
            }
        });

        var marketContentBlock = document.querySelector('.my_listing_section.market_content_block.market_home_listing_table');
        if (marketContentBlock) {
            marketContentBlock.appendChild(removeButton);
        }
    }

    window.addEventListener('load', function() {
        addRemoveButton();
    });

    // Function to add the "Batch Sell" button on item detail pages
    function addBatchSellButton() {
        var itemDetailContainer = document.querySelector('.market_commodity_explanation');
        var itemNameMatch = window.location.pathname.match(/\/market\/listings\/730\/(.+)/);

        if (itemDetailContainer && itemNameMatch) {
            var itemName = decodeURIComponent(itemNameMatch[1]);
            var batchSellButton = document.createElement('button');
            batchSellButton.textContent = '批量出售';
            batchSellButton.style.display = 'block';
            batchSellButton.style.width = '100%';
            batchSellButton.style.padding = '10px';
            batchSellButton.style.marginTop = '10px';
            batchSellButton.style.backgroundColor = '#4CAF50';
            batchSellButton.style.color = 'white';
            batchSellButton.style.border = 'none';
            batchSellButton.style.cursor = 'pointer';
            batchSellButton.style.fontSize = '16px';

            batchSellButton.addEventListener('click', function() {
                var batchSellUrl = `https://steamcommunity.com/market/multisell?appid=730&contextid=2&items[]=${encodeURIComponent(itemName)}`;
                window.location.href = batchSellUrl;
            });

            itemDetailContainer.appendChild(batchSellButton);
        }
    }

    window.addEventListener('load', function() {
        if (window.location.href.includes('/market/listings/730/')) {
            addBatchSellButton();
        }
    });

})();
