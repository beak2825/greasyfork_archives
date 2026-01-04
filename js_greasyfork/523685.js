// ==UserScript==
// @name         Pixifi Master Tool - Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A standalone script that registers a Lead/Client search tool with the Master Tools window.
// @match        https://www.pixifi.com/admin/*
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523685/Pixifi%20Master%20Tool%20-%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/523685/Pixifi%20Master%20Tool%20-%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * We'll define our search tool here. We use a function so we can call it later.
     */
    const mySearchTool = {
        name: '',
        domainRegex: /https:\/\/www\.pixifi\.com\/admin\/leads\//,  // Only render on leads/* pages

        render(parentContainer) {
            const searchQueryInput = document.createElement('input');
            Object.assign(searchQueryInput.style, {
                width: '200px',
                marginBottom: '5px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                display: 'block'
            });
            searchQueryInput.type = 'text';
            searchQueryInput.placeholder = 'Search Query';

            const searchButton = document.createElement('button');
            Object.assign(searchButton.style, {
                display: 'block',
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textAlign: 'center'
            });
            searchButton.textContent = 'Search';

            searchButton.addEventListener('click', () => {
                const searchQuery = searchQueryInput.value.trim();
                if (searchQuery) {
                    searchLeadsAndClients(searchQuery);
                } else {
                    alert('Please enter a Search Query.');
                }
            });

            parentContainer.appendChild(searchQueryInput);
            parentContainer.appendChild(searchButton);
        }
    };

    /*************************************************************************/
    /*         HELPER #1: Show a modal that lists possible results           */
    /*************************************************************************/
    function showSelectionModal(links, type) {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.3)',
            zIndex: '2000',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '400px',
            overflowY: 'auto'
        });

        // We'll insert a UL to list the leads/clients
        modal.innerHTML = `
            <h3>Select a ${type}</h3>
            <ul id="modalListContainer" style="list-style: none; padding: 0; margin: 0;">
                ${links
                  .map(
                      (link, index) =>
                          `<li style="margin-bottom: 10px;">
                              <button style="width: 100%; padding: 10px; text-align: left;" data-index="${index}">
                                  ${link.innerText || link.getAttribute('href')}
                              </button>
                          </li>`
                  )
                  .join('')}
            </ul>
            <button id="closeModal" style="
                display: block;
                margin: 20px auto 0;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;">
                Close
            </button>
        `;

        // If more than 8 items, set the UL to have a fixed max-height and auto-scroll
        if (links.length > 8) {
            const listContainer = modal.querySelector('#modalListContainer');
            Object.assign(listContainer.style, {
                maxHeight: '480px',
                overflowY: 'auto'
            });
        }

        // Link button click => open the URL in a new tab
        modal.querySelectorAll('button[data-index]').forEach(button => {
            button.addEventListener('click', e => {
                const index = e.target.getAttribute('data-index');
                const link = links[index].getAttribute('href');
                const absoluteLink = new URL(link, window.location.origin).href;
                window.open(absoluteLink, '_blank');
            });
        });

        // Close button
        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    }

    /*************************************************************************/
    /* HELPER #2: Check if a string might be a phone number, ignoring punctuation */
    /*************************************************************************/
    function isPhoneNumberLike(query) {
        // Strip out parentheses, spaces, and dashes
        const digits = query.replace(/[\(\)\s\-]/g, '');
        // A simple check: if it’s 10 or 11 digits, call it a “phone number”
        return /^\d{10,11}$/.test(digits);
    }

    /*************************************************************************/
    /* HELPER #3: Generate all standard phone number variants from digits   */
    /*************************************************************************/
    function getPhoneNumberVariants(rawQuery) {
        // 1) Strip to just digits
        const digits = rawQuery.replace(/\D/g, '');
        // Because we might have 10 or 11 digits, handle that
        // For example: 10-digit => 1234567890
        // or 11-digit => 11234567890
        // If 11-digit, we assume the first digit might be a leading country code (1).
        // You may or may not want that logic. This is just an example.

        // In this example, we’ll assume we want to handle 10-digit only:
        // If the user typed 11 digits, but the leading digit is "1," we’ll strip it to 10 for the variants below.
        let phone10 = digits;
        if (digits.length === 11 && digits.startsWith('1')) {
            phone10 = digits.substring(1);
        }

        // If it’s not exactly 10 at this point, just return [digits] or handle differently
        if (phone10.length !== 10) {
            return [digits];
        }

        // phone10 is now something like "1234567890"
        // Generate the possible variations. Examples:
        // 1. (123) 456-7890
        // 2. (123) 4567890
        // 3. (123)4567890
        // 4. 1234567890
        // 5. 123 456-7890
        // 6. 123 4567890
        // 7. 123 456 7890
        // ...
        // You can generate as many as you need:

        const area = phone10.substring(0, 3);   // 123
        const prefix = phone10.substring(3, 6); // 456
        const line = phone10.substring(6);      // 7890

        return [
            `(${area}) ${prefix}-${line}`,
            `(${area}) ${prefix}${line}`,
            `(${area})${prefix}${line}`,
            `${area}${prefix}${line}`,
            `${area} ${prefix}-${line}`,
            `${area} ${prefix}${line}`,
            `${area} ${prefix} ${line}`,
            // ...add any other permutations you want
        ];
    }

    /*************************************************************************/
    /* HELPER #4: Make a POST call to lead-search or client-search           */
    /*************************************************************************/
    // We'll extract “getLeads” and “getClients” into separate functions
    // that simply return the array of DOM <a> elements (or an empty array).

    async function getLeads(searchQuery) {
        try {
            const response = await fetch("https://www.pixifi.com/admin/fn/leads/getLeads/", {
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },
                referrer: "https://www.pixifi.com/admin/leads/",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: new URLSearchParams({
                    clientID: "12295",
                    page: 1,
                    section: "id",
                    searchQuery,
                    dir: "D",
                    viewFilter: "all"
                }).toString(),
                method: "POST",
                mode: "cors",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            const leadLinks = [...doc.querySelectorAll('a[href^="/admin/leads/"]')]
                .filter(link => {
                    const txt = link.textContent
                        .replace(/\u00A0/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    return txt.length > 0;
                })
                .filter((link, index, self) => {
                    const href = link.getAttribute('href');
                    return (
                        index === self.findIndex(otherLink => otherLink.getAttribute('href') === href)
                    );
                });

            return leadLinks;
        } catch (error) {
            console.error('getLeads Error:', error);
            // Return an empty array so that the caller can handle “nothing found”
            return [];
        }
    }

    async function getClients(searchQuery) {
        try {
            const response = await fetch("https://www.pixifi.com/admin/fn/clients/getClientListing/", {
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },
                referrer: "https://www.pixifi.com/admin/clients/",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: new URLSearchParams({
                    clientID: "12295",
                    page: 1,
                    searchQuery,
                    section: "name",
                    dir: "A",
                    archived: "unarchived",
                    card: "all"
                }).toString(),
                method: "POST",
                mode: "cors",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            const clientLinks = [...doc.querySelectorAll('a[href^="/admin/clients/"]')]
                .filter(link => {
                    const txt = link.textContent
                        .replace(/\u00A0/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    return txt.length > 0;
                })
                .filter(link => !link.getAttribute('href').startsWith('/admin/clients/delete/'))
                .filter((link, index, self) => {
                    const href = link.getAttribute('href');
                    return (
                        index === self.findIndex(otherLink => otherLink.getAttribute('href') === href)
                    );
                });

            return clientLinks;
        } catch (error) {
            console.error('getClients Error:', error);
            return [];
        }
    }

    /*************************************************************************/
    /* MAIN SEARCH FLOW:  Try leads, then clients, then phone expansions     */
    /*************************************************************************/
    async function searchLeadsAndClients(searchQuery) {
        console.log(`Searching leads with query: ${searchQuery}`);
        const leadLinks = await getLeads(searchQuery);

        if (leadLinks.length > 0) {
            showSelectionModal(leadLinks, 'Lead');
            return;
        }

        console.warn('No leads found, now searching clients...');
        const clientLinks = await getClients(searchQuery);

        if (clientLinks.length > 0) {
            showSelectionModal(clientLinks, 'Client');
            return;
        }

        console.warn('No clients found. Checking if the query is phone-like...');
        if (isPhoneNumberLike(searchQuery)) {
            // Generate phone number variants
            console.log('Query looks like a phone number. Searching all variants in parallel...');
            const phoneVariants = getPhoneNumberVariants(searchQuery);

            // Run leads/clients calls in parallel for each variant
            // We’ll gather all leads, all clients into a single array.
            const allFetches = phoneVariants.map(async variant => {
                const theseLeads = await getLeads(variant);
                const theseClients = await getClients(variant);
                return { variant, leads: theseLeads, clients: theseClients };
            });

            const results = await Promise.all(allFetches);

            // Flatten out all the leads and all the clients from each variant
            let combinedLeads = [];
            let combinedClients = [];

            results.forEach(r => {
                if (r.leads.length > 0) {
                    combinedLeads = combinedLeads.concat(r.leads);
                }
                if (r.clients.length > 0) {
                    combinedClients = combinedClients.concat(r.clients);
                }
            });

            // Deduplicate by href
            const uniqueLeads = deduplicateByHref(combinedLeads);
            const uniqueClients = deduplicateByHref(combinedClients);

            // Show leads if any
            if (uniqueLeads.length > 0) {
                showSelectionModal(uniqueLeads, 'Lead (Phone Variants)');
            }
            // Show clients if any
            if (uniqueClients.length > 0) {
                showSelectionModal(uniqueClients, 'Client (Phone Variants)');
            }

            // If still nothing
            if (uniqueLeads.length === 0 && uniqueClients.length === 0) {
                alert('No leads or clients found (even after phone expansions).');
            }
        } else {
            alert('No leads or clients found. Please refine your search.');
        }
    }

    function deduplicateByHref(links) {
        const seen = new Set();
        return links.filter(link => {
            const href = link.getAttribute('href');
            if (seen.has(href)) {
                return false;
            }
            seen.add(href);
            return true;
        });
    }

    /*************************************************************************/
    /* Attempt to register our tool with the MasterTools if it exists        */
    /*************************************************************************/
    const MAX_ATTEMPTS = 10;
    let attempts = 0;

    function tryRegisterSearchTool() {
        if (window.MasterTools && typeof window.MasterTools.registerTool === 'function') {
            window.MasterTools.registerTool(mySearchTool);
        } else if (attempts < MAX_ATTEMPTS) {
            attempts++;
            setTimeout(tryRegisterSearchTool, 500);
        } else {
            console.warn('Master Tools not found. The Search Tool will not be registered.');
        }
    }

    tryRegisterSearchTool();
})();