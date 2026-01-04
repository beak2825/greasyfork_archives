// ==UserScript==
// @name        Path Of Exile Trade Aggregator
// @namespace   Violentmonkey Scripts
// @match       https://www.pathofexile.com/trade*
// @grant       none
// @version     1.0.2.1
// @author      CerikNguyen
// @license MIT
// @description Aggregates the number of listings per account name and displays a whisper button for each account name in the Path Of Exile trade site.
// @downloadURL https://update.greasyfork.org/scripts/491939/Path%20Of%20Exile%20Trade%20Aggregator.user.js
// @updateURL https://update.greasyfork.org/scripts/491939/Path%20Of%20Exile%20Trade%20Aggregator.meta.js
// ==/UserScript==

// ------------------------------------------------- helper functions -------------------------------------------------

// helper function to add an element to the DOM
function addElement(parent, elm) {
    const tmp = parent.querySelector(`#${elm.id}`);
    if (tmp) {
        tmp.remove();
    }
    parent.appendChild(elm);
}

function resetCountByListing(accountName, listingKey) {
    delete accountData[accountName][listingKey];
}

function resetCount(accountName) {
    delete accountData[accountName];
}

function resetAllCounts() {
    for (const accountName in accountData) {
        resetCount(accountName);
    }
    listings.clear();
}

function extractResultsDiv() {
    const results = document.body.querySelectorAll('.resultset');
    if (results.length === 0) {
        return null;
    }

    // Collect arrays of child nodes
    const childNodesArrays = Array.from(results).map(result => Array.from(result.childNodes));

    // Flatten the array of arrays into a single array
    const flattened = childNodesArrays.flat();

    return flattened;
}

function extractResults() {
    const res = extractResultsDiv();
    if (!res) {
        return [];
    }
    return res;
}

// Object to hold the counts and whisper button links of each account name
const accountData = {};

// Set to hold listing keys to avoid duplicates
const listings = new Set();

// Extract the logged-in user's account name, preventing aggregated search of own listings
const loggedInUserElement = document.querySelector('.loggedInStatus .profile-link a');
const loggedInUsername = loggedInUserElement ? loggedInUserElement.textContent : null;

// ------------------------------------------------- element initialization ------------------------------------------------
// styling css
const style = document.createElement('style');
style.id = 'aggregator-style';

style.innerHTML = `

#aggregator {
    position: fixed;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 5px;
    z-index: 1000;
    transition: right 0.2s ease 0s;
}

#showAggregator {
    position: fixed;
    top: 50px;
    right: 0;
    z-index: 1001;
    transition: right 0.2s ease 0s;
}

/*
compatibility with Better Trading
*/

.bt-body > #aggregator,
.bt-body > #showAggregator {
    right: 400px; /* Adjust based on the width of the other extension */
    top: 100px;
}

.bt-is-collapsed > #aggregator,
.bt-is-collapsed > #showAggregator {
    right: 0; /* Move it back when the other extension is collapsed */
    top: 100px;
}

#results-table {
    border-spacing: 0 0.4em;
    border-collapse: separate;
}

.actions-cell {
    display: flex;
    justify-content: center;
    padding-left: 5px;
    padding-right: 5px;
}

.text-cell {
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
}

.action-button{
    margin-left: 2px;
    margin-right: 2px;
}

.thead-cell{
    padding: 5px;
}

tbody tr:nth-child(even) {
    background-color: rgba(50, 50, 50, 0.7);
}

#hide-about {
    margin: 5px;
}

.aboutDiv {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 1);
    padding: 5px;
    z-index: 1000;
    display: none;
}

.hidden {
    display: none;
}

ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

`;

addElement(document.head, style);

//initializing  the main injecting div
const aggregator = document.createElement('div');
aggregator.id = 'aggregator';
aggregator.classList.add('aggregator', 'results', 'bt-body');

const aggregatorInnerHTML = `
    <button id="hide" class="btn btn-default">Hide</button>
    <button id="clear-all" class="btn btn-default">Clear All</button>
    <button id="refresh" class="btn btn-default">Refresh</button>
    <button id="about" class="btn btn-default">About</button>
    <div class="table-responsive" style="margin: 5px">
        <table id="results-table" class="table">
            <thead>
                <tr>
                    <th class="thead-cell">Account Name</th>
                    <th class="thead-cell">Amount Listed</th>
                    <th class="thead-cell">Count</th>
                    <th class="thead-cell">Total</th>
                    <th class="thead-cell">Actions</th>
                </tr>
            </thead>
            <tbody id="results-list">
            </tbody>
        </table>
    </div>
`;

addElement(document.body, aggregator);

const aboutDiv = document.createElement('div');
aboutDiv.id = 'aboutDiv';
aboutDiv.classList.add('aboutDiv');
aboutDiv.innerHTML = `

    <button id="hide-about" class="btn btn-default">Close</button>
    <h3> Path Of Exile Trade Aggregator </h3>
    <br/>
    <span> This extension aggregates the all listings under the same account name and displays a whisper button for each account name in the Path Of Exile trade site. </span>
    <br/>
    <br/>
    <span> Changelog: </span>
    <br/>
    <ul>
        <li> Minor UI tweaks </li>
        <li> "Whisper" now becomes "Whispered" after clicking </li>
        <li> Alternate row color for better readability </li>
        <li> Added an about section </li>
        <li> Added a Kofi link for donation. Thank you for your support! </li>
    </ul>
    <br/>
    <a href='https://ko-fi.com/H2H4WPVOX' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

`;

aboutDiv.querySelector('#hide-about').addEventListener('click', () => {
    aboutDiv.style.display = 'none';
});

const showButton = document.createElement('button');
showButton.id = 'showAggregator';
showButton.classList.add('btn', 'btn-default');
showButton.textContent = 'Show Aggregator';

showButton.addEventListener('click', () => {
    aggregator.classList.remove('hidden');
    showButton.classList.add('hidden');
    localStorage.setItem('aggregatorState', 'open'); // Update localStorage
});

addElement(document.body, showButton);

function initAggregator() {
    aggregator.innerHTML = aggregatorInnerHTML;

    addElement(aggregator, aboutDiv);

    aggregator.querySelector('#about').addEventListener('click', () => {
        aboutDiv.style.display = 'block';
    });

    // Check localStorage for the aggregator's state
    const aggregatorState = localStorage.getItem('aggregatorState');

    if (aggregatorState === 'closed') {
        aggregator.classList.add('hidden');
        showButton.classList.remove('hidden');
    } else {
        // By default or if the state is 'open', the aggregator is visible
        aggregator.classList.remove('hidden');
        showButton.classList.add('hidden');
    }

    document.getElementById('hide').addEventListener('click', () => {
        aggregator.classList.add('hidden');
        showButton.classList.remove('hidden');
        localStorage.setItem('aggregatorState', 'closed');
    });

    document.getElementById('clear-all').addEventListener('click', () => {
        resetAllCounts();
        updateAggregator();
    });

    document.getElementById('refresh').addEventListener('click', () => {
        // Reset the counts and reprocess the nodes to get the latest counts
        resetAllCounts();
        const results = extractResults();
        // console.log(results);
        processNodes(results);
        updateAggregator();
    });

    // Initial check in case the page has already loaded
    processNodes(extractResults());
    updateAggregator();
}

// Function to update the floating div with the latest counts and whisper buttons
function updateAggregator() {
    const resultsList = document.getElementById('results-list');

    if (!resultsList) {
        initAggregator();
        return;
    }

    resultsList.innerHTML = ''; // Clear previous results

    // Calculate total listings per account
    const accountsTotalListings = Object.entries(accountData).map(([account, listings]) => {
        const totalListings = Object.values(listings).reduce((sum, { count }) => sum + count, 0);
        return { account, totalListings, listings };
    });

    // Sort accounts by total listings and keep only the top 10
    const topAccounts = accountsTotalListings.sort((a, b) => b.totalListings - a.totalListings).slice(0, 10);


    // Iterate and display sorted accounts
    topAccounts.forEach(({ account, listings }) => {
        Object.entries(listings).forEach(([listingKey, data]) => {
            const row = document.createElement('tr');

            const accountCell = document.createElement('td');
            accountCell.classList.add('text-cell');
            accountCell.textContent = account;

            const amountListedCell = document.createElement('td');
            amountListedCell.classList.add('text-cell');
            amountListedCell.textContent = listingKey;

            const countCell = document.createElement('td');
            countCell.classList.add('text-cell');
            countCell.textContent = data.count;

            const totalCell = document.createElement('td');
            totalCell.classList.add('text-cell');
            listingPrice = Number.parseFloat(listingKey.split(" ")[0]);
            //get currency as the rest of the string
            listingCurrency = listingKey.split(" ").slice(1).join(" ");
            totalCell.textContent = `${listingPrice * data.count} ${listingCurrency}`;


            const actionsCell = document.createElement('td');
            actionsCell.classList.add('actions-cell');

            const whisperButton = document.createElement('button');
            whisperButton.classList.add('btn', 'btn-xs', 'btn-default', 'action-button');
            whisperButton.textContent = 'Whisper';
            whisperButton.addEventListener('click', () => {
                row.classList.add('whispered');
                whisperButton.textContent = 'Whispered';
                data.whisperButton.click();
            });

            const resetButton = document.createElement('button');
            resetButton.classList.add('btn', 'btn-xs', 'btn-default', 'action-button');
            resetButton.textContent = 'Clear';
            resetButton.addEventListener('click', () => {
                delete accountData[account][listingKey];
                updateAggregator();
            });
            actionsCell.appendChild(whisperButton);
            actionsCell.appendChild(resetButton);

            row.appendChild(accountCell);
            row.appendChild(amountListedCell);
            row.appendChild(countCell);
            row.appendChild(totalCell);
            row.appendChild(actionsCell);

            resultsList.appendChild(row);
        });
    });
}

// Flag to check if the aggregator has been updated
var updated = false;

// Function to process added nodes
function processNodes(addedNodes) {
    addedNodes.forEach(node => {
        if (node.parentElement && !node.parentElement.classList.contains('resultset')) return;

        if (listings.has(node)) {
            return; // Skip nodes that have already been processed
        }

        listings.add(node);

        const profileLink = node.querySelector ? node.querySelector('span.profile-link a') : null;
        const whisperButton = node.querySelector ? node.querySelector('button.direct-btn') : null;
        const priceField = node.querySelector ? node.querySelector('div.price span[data-field="price"]') : null;
        if (!priceField) return;
        const priceSpan = priceField.querySelector ? priceField.childNodes[3] : null;
        const currencySpan = priceField.querySelector ? priceField.childNodes[5] : null;
        const errorSpan = node.querySelector ? node.querySelector('span.error') : null;

        if (errorSpan) {
            return;
        }

        if (profileLink && whisperButton && priceSpan && currencySpan) {
            const accountName = profileLink.textContent.trim();
            if (accountName === loggedInUsername) return;

            const quantity = priceSpan.textContent.trim();
            const currencyType = currencySpan.textContent.trim();
            const listingKey = `${quantity} ${currencyType}`;

            if (!accountData[accountName]) {
                accountData[accountName] = {};
            }

            if (!accountData[accountName][listingKey]) {
                // console.log("Adding new listing for " + accountName + " " + listingKey);
                accountData[accountName][listingKey] = { count: 1, whisperButton: whisperButton };
            } else {
                // console.log("Incrementing count for " + accountName + " " + listingKey);
                accountData[accountName][listingKey].count += 1;
            }

            updated = true;
        }

    });
}

// observer to watch for changes in the DOM
const observer = new MutationObserver(mutations => {
    updated = false;
    mutations.forEach(mutation => {
        processNodes(mutation.addedNodes);
    });
    if (updated) {
        updateAggregator();
    }
});

// Configuration of the observer:
const config = { childList: true, subtree: true };

// Start observing the body for changes
observer.observe(document.body, config);

initAggregator();
