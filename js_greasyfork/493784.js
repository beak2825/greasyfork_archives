// ==UserScript==
// @name 4chan Catalog Flags with base64 BF sprite + sort + overview (toggle) (url fix) (cssfix)
// @namespace http://tampermonkey.net/
// @version 1.4
// @description Various features for showing OP flags in 4chan catalog page
// @author You
// @match https://boards.4chan.org/*catalog
// @downloadURL https://update.greasyfork.org/scripts/493784/4chan%20Catalog%20Flags%20with%20base64%20BF%20sprite%20%2B%20sort%20%2B%20overview%20%28toggle%29%20%28url%20fix%29%20%28cssfix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493784/4chan%20Catalog%20Flags%20with%20base64%20BF%20sprite%20%2B%20sort%20%2B%20overview%20%28toggle%29%20%28url%20fix%29%20%28cssfix%29.meta.js
// ==/UserScript==

(function() {
'use strict';

// URL for the CSS file
const flagsCssUrl = 'https://s.4cdn.org/image/flags/pol/flags.2.css';

// Function to inject the CSS file
function injectCss(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

// Inject the CSS file
injectCss(flagsCssUrl);

function setupFlagToggle() {
    const boardNavDesktop = document.querySelector('.abovePostForm');
    const toggleContainer = document.createElement('div');
    toggleContainer.style.cssText = 'text-align: center; margin: 20px auto; font-weight: bold; font-size: 12px;';

    const toggleLink = document.createElement('a');
    toggleLink.id = 'toggle-flag-overview';
    toggleLink.href = '#';
    toggleLink.textContent = 'Current OP Flags';

    const openBracket = document.createTextNode('[');
    const closeBracket = document.createTextNode(']');

    toggleContainer.appendChild(openBracket);
    toggleContainer.appendChild(toggleLink);
    toggleContainer.appendChild(closeBracket);

    toggleLink.addEventListener('click', function(event) {
        event.preventDefault();
        const flagOverview = document.getElementById('flag-overview');
        if (flagOverview.style.display === 'none') {
            flagOverview.style.display = 'flex';
            toggleLink.textContent = 'Hide Current OP Flags';
        } else {
            flagOverview.style.display = 'none';
            toggleLink.textContent = 'Current OP Flags';
        }
    });

    boardNavDesktop.parentNode.insertBefore(toggleContainer, boardNavDesktop);
}

function processCatalog(catalogData) {
    console.log('Processing catalog...');
    const boardNavDesktop = document.querySelector('.abovePostForm');
    setupFlagToggle();  // Call the toggle setup function here

    const flagOverview = document.createElement('div');
    flagOverview.id = 'flag-overview';
    flagOverview.style.cssText = 'margin-bottom: 10px; display: none; flex-direction: column; align-items: center;';

    const geoFlagContainer = document.createElement('div');
    geoFlagContainer.id = 'geo-flag-container';
    geoFlagContainer.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; width: 100%;';

    const memeFlagContainer = document.createElement('div');
    memeFlagContainer.id = 'meme-flag-container';
    memeFlagContainer.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; width: 100%;';

    const geoTitle = document.createElement('h2');
    geoTitle.textContent = 'OP Flags of All Threads:';

    const memeTitle = document.createElement('h2');
    memeTitle.textContent = '';

    flagOverview.appendChild(geoFlagContainer);
    flagOverview.appendChild(memeTitle);
    flagOverview.appendChild(memeFlagContainer);
    boardNavDesktop.parentNode.insertBefore(flagOverview, boardNavDesktop.nextSibling);

    const flags = []; // Array to store flag elements temporarily
    // Iterate through pages and threads
    catalogData.forEach(page => {
        page.threads.forEach(thread => {
            const threadId = thread && thread.no;
            const country = thread && thread.country;
            const countryName = thread && thread.country_name;
            const boardFlag = thread && thread.board_flag;
            const flagName = thread && thread.flag_name;
            if (!threadId) {
                console.warn('Thread ID not found for thread:', thread);
                return;
            }
            // Construct flag HTML for individual threads
            let flagHTML = '';
            if (country && country !== 'XX') {
                flagHTML +=
                    `<span title="${countryName}" class="flag flag-${country.toLowerCase()}"></span> `;
                // Add flag element directly to overview
                const flagSpan = document.createElement('span');
                flagSpan.className = `flag flag-${country.toLowerCase()}`;
                flagSpan.title = countryName;
                flags.push(flagSpan); // Add flag element to temporary array
            }
            if (boardFlag && flagName) {
                const flagClass = `bfl bfl-${boardFlag.toLowerCase()}`;
                flagHTML += `<span title="${flagName}" class="${flagClass}"></span>`;
                // Add board flag element directly to overview
                const flagSpan = document.createElement('span');
                flagSpan.className = flagClass;
                flagSpan.title = flagName;
                flags.push(flagSpan); // Add flag element to temporary array
            }
            // Insert flags into individual threads
            const metaElement = document.getElementById(`meta-${threadId}`);
            if (metaElement) {
                metaElement.innerHTML = flagHTML + metaElement.innerHTML;
            } else {
                console.warn('Meta element not found for thread ID:', threadId);
            }
        });
    });
    // Count the occurrence of each flag
    const flagCounts = {};
    flags.forEach(flag => {
        const key = flag.title;
        if (!flagCounts[key]) {
            flagCounts[key] = {
                count: 0,
                flag: flag
            };
        }
        flagCounts[key].count++;
    });
    const sortedFlags = Object.values(flagCounts)
        .sort((a, b) => b.count - a.count || a.flag.title.localeCompare(b.flag.title));
    // Create an array from the counts and sort by frequency, then alphabetically
    sortedFlags.forEach(item => {
        let geoFlagCount = 0; // Correctly initialized at the start of geo flags processing
        let memeFlagCount = 0; // Correctly initialized at the start of meme flags processing
        let geoFlagLine = document.createElement('div');
        geoFlagLine.style.display = 'flex';
        geoFlagLine.style.justifyContent = 'center';
        geoFlagLine.style.width = '100%';
        let memeFlagLine = document.createElement('div');
        memeFlagLine.style.display = 'flex';
        memeFlagLine.style.justifyContent = 'center';
        memeFlagLine.style.width = '100%';
        for (let i = 0; i < item.count; i++) {
            const flagClone = item.flag.cloneNode(true);
            flagClone.style.marginRight = '0px'; // Maintain margin as before
            flagClone.classList.add('flag-overview-item');
            if (item.flag.className.includes('flag-')) { // Geo flags
                geoFlagLine.appendChild(flagClone);
                geoFlagCount++;
                if (geoFlagCount % 20 === 0) { // Wrap every 20 flags
                    geoFlagContainer.appendChild(geoFlagLine);
                    geoFlagLine = document.createElement('div');
                    geoFlagLine.style.display = 'flex';
                    geoFlagLine.style.justifyContent = 'center';
                    geoFlagLine.style.width = '100%';
                }
            } else if (item.flag.className.includes('bfl')) { // Meme flags
                memeFlagLine.appendChild(flagClone);
                memeFlagCount++;
                if (memeFlagCount % 20 === 0) { // Wrap every 20 flags
                    memeFlagContainer.appendChild(memeFlagLine);
                    memeFlagLine = document.createElement('div');
                    memeFlagLine.style.display = 'flex';
                    memeFlagLine.style.justifyContent = 'center';
                    memeFlagLine.style.width = '100%';
                }
            }
        }
        // Append any remaining flags in the last line if not empty
        if (geoFlagCount % 20 !== 0) {
            geoFlagContainer.appendChild(geoFlagLine);
        }
        if (memeFlagCount % 20 !== 0) {
            memeFlagContainer.appendChild(memeFlagLine);
        }
    });

    // Add CSS styles using a <style> element (amend to existing or create new as needed)
    const styleElement = document.createElement('style');
    styleElement.textContent = `
    #flag-overview {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 100%;
        margin-top: 20px;
    }
    #flag-overview > div {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    #flag-overview > div > .flag-overview-item {
        margin-right: px;  /* Override margin for flag overview items */
        top: 0px;
    }
    .flag {
        margin-right: 0px; /* Default margin for flags */
    }
        .bfl {
        margin-right: 4px;
    }
    `;
    document.head.appendChild(styleElement);
    console.log('Catalog processing complete.');
}

// Function to fetch catalog JSON
function fetchCatalogJSON() {
    const boardName = window.location.pathname.split('/')[1]; // Extract the board name correctly
    console.log('Fetching catalog JSON...');
    fetch(`https://a.4cdn.org/${boardName}/catalog.json`) // Dynamically fetch catalog JSON based on board
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch catalog JSON');
            }
        })
        .then(catalogData => {
            processCatalog(catalogData);
        })
        .catch(error => {
            console.error('Error fetching catalog JSON:', error);
        });
}

// Function to create the "Flags" sorting dropdown
function createFlagsSortingDropdown() {
    const orderCtrl = document.getElementById('order-ctrl');
    if (orderCtrl) {
        const flagsDropdown = document.createElement('select');
        flagsDropdown.id = 'flags-ctrl';
        flagsDropdown.style.marginLeft = '10px';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Flags';
        flagsDropdown.appendChild(defaultOption);
        const flagsOption = document.createElement('option');
        flagsOption.value = 'flags';
        flagsOption.textContent = 'Flags';
        flagsDropdown.appendChild(flagsOption);
        // Add event listener to handle sorting change
        flagsDropdown.addEventListener('change', handleFlagsSortChange);
        // Insert the flags dropdown after the existing sorting dropdown
        orderCtrl.parentNode.insertBefore(flagsDropdown, orderCtrl.nextSibling);
    }
}

// Function to handle flags sorting change
function handleFlagsSortChange(event) {
    const selectedOption = event.target.value;
    if (selectedOption === 'flags') {
        sortThreadsByFlag();
    } else {
        // Reload the page to revert to the default sorting
        location.reload();
    }
}

function sortThreadsByFlag() {
    const threads = Array.from(document.querySelectorAll('.thread'));
    threads.sort((a, b) => {
        // Get country and board flags for both threads
        const countryFlagA = a.querySelector('.flag')?.title || '';
        const countryFlagB = b.querySelector('.flag')?.title || '';
        const boardFlagA = a.querySelector('.bfl')?.title || '';
        const boardFlagB = b.querySelector('.bfl')?.title || '';
        // Prioritize country flag sorting
        const countryComparison = countryFlagA.localeCompare(countryFlagB);
        if (countryComparison !== 0) {
            return countryComparison;
        }
        // If country flags are the same, sort by board flag
        return boardFlagA.localeCompare(boardFlagB);
    });
    const threadsContainer = document.getElementById('threads');
    threads.forEach(thread => threadsContainer.appendChild(thread));
}

// Initialize script
createFlagsSortingDropdown();
fetchCatalogJSON();

})();
