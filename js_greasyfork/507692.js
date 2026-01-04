"use strict";
// ==UserScript==
// @name         Dwell Support Boost
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  Convert Boost ticket dashboard TT to support Dwell
// @author       @conlane
// @license       Internal Use Only
// @match        https://myday-website-pdx.amazon.com/dashboard
// @match        https://myday-website-pdx.pdx.proxy.amazon.com/dashboard*
// @match        https://midway-auth.amazon.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/1835/1835120.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @include      http*://myday-website-*.*.*.amazon.com/ticket/*
// @match        http*://myday-website-*.aka.corp.amazon.com/*
// @match        http*://myday-website-*.*.proxy.amazon.com/*
// @match        http*://myday-website.*.aws-border.com/*
// @match        http*://myday-website.*.aws-border.cn/*
// @match        http*://myday-website-*.*.com/*
// @match        http*://myday-website.us-iso-east-1.c2s.ic.gov/*
// @match        http*://myday-website.us-isob-east-1.sc2s.sgov.gov/*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      kerberizer-prod.corp.amazon.com
// @connect      drive-render.corp.amazon.com
// @connect      maxis-service-prod-pdx.amazon.com
// @connect      myday-website-nrt.aka.corp.amazon.com
// @connect      amazon.com
// @copyright    AWS
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/507692/Dwell%20Support%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/507692/Dwell%20Support%20Boost.meta.js
// ==/UserScript==
//Link to CODE.AMAZON REPO
//https://code.amazon.com/packages/Dwell_support_boost/
//CHANGELOG  1.3.5
/*

(!) Whats NEW
(!) A lot less links to other pages
(!) Can now short tickets

(?) Bug fixes
(?) Fixed Count bar not showing up
(?) Fixed SLA Time for ProtoOne tickets



(*) Known Bugs to fixes
(*) Ticket that do not get called in request to not update with any Details and get updated with another tickets data
(*) Code is running slower on newest update


(%) Upcoming
(%) option to hide proto
(%) option to hide low TT, high TT or Not_in_Dwell
(%) option to hide tickets with techs
(%) UX Fix and redesign
(%) More ProtoOne support
(%) Faster loading and v2 makeover of Code







(contributors)
@conlane
@camewith -support with Nitro


*/
(function () {
    const sesstickets = [];
    let Bounty_HighCount = 0;
    let Bounty_LowCount = 0;
    let ProtoOne = 0;
    const BP = /BP_(\d+)/;
    const name = /([a-zA-Z]{5,})/;
    const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    //example https://maxis-service-prod-iad.amazon.com/issues?id.1=f2e90d34-f21c-4155-8c92-a495e5dcc361&id.2=37aa1bd4-6168-4848-b22d-e906665742db&id.3=A123456789
    //url: `https://maxis-service-prod-iad.amazon.com/issues/${ticekt.UUID}/`,
    const authTriggerURL = 'https://maxis-service-prod-iad.amazon.com/issues/f57988a9-2f07-49a3-bbe8-d301103c8fe2/';
    const midway = 'https://midway-auth-sigv4.us-east-1.amazonaws.com';
    const ssoLoginURL = 'https://maxis-service-prod-iad.amazon.com/sso/login';
    function createIframeForAuth() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none'; // Make the iframe invisible
        iframe.src = authTriggerURL; // might need to change at some point
        document.body.appendChild(iframe);
        iframe.onload = function () {
            // Give some time for the authentication to complete
            setTimeout(() => {
                // Remove the iframe after loading to clean up
                document.body.removeChild(iframe);
                checkAuthentication();
            }, 1000); // 5 seconds delay for authentication process
        };
        iframe.onerror = function () {
            console.log('Error loading the iframe.');
            // Cleanup even if there's an error
            document.body.removeChild(iframe);
        };
    }
    function checkAuthentication() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: ssoLoginURL,
            responseType: 'json',
            onload: function (response) {
                if (response.status == 200) {
                    const payload = JSON.parse(response.responseText);
                    if (payload.is_authenticated) {
                        observeTbody();
                    }
                    else {
                        console.log('User is not authenticated, triggering background authentication...');
                        createIframeForAuth();
                    }
                }
                else {
                    console.log('Failed to check authentication. Status:', response.status);
                }
            },
            onerror: function (error) {
                console.log('Error during authentication check:', error);
            }
        });
    }
    checkAuthentication();
    let observer = null;
    function observeTbody() {
        const targetNode = document.querySelector('tbody');
        if ((targetNode?.clientHeight ?? 0) > 0 && targetNode) {
            if (observer) {
                // Disconnect the existing observer
                observer.disconnect();
            }
            observer = new MutationObserver((mutationsList) => {
                let triggered = false;
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && !triggered) {
                        triggered = true;
                        const rows = Array.from(targetNode.querySelectorAll('tr'));
                        let UUID = rows[0]?.textContent?.match(/Not_in_Dwell|Bounty/)?.[0];
                        if (!(rows[0]?.textContent === "Loading your ticketsLoading your tickets" || rows[0]?.textContent === "Loading your tickets" || rows[0]?.textContent === "No tickets found" || UUID !== undefined)) {
                            //Remove Elements not Needed by Boost 
                            const button = document.getElementById('awsui-button-dropdown__trigger:r1e:');
                            if (button) {
                                button.remove();
                            }
                                // Usage
    createClickableAlert(
        'The Dwell Support Boost script has moved to a new location. Please reinstall it from',
        'https://axzile.corp.amazon.com/-/carthamus/download_script/dwell-support-boost.user.js'
    );

                            GetTickets();
                        }
                    }
                }
            });
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }
        else {
            console.error('Tbody element not found during MutationObserver setup. Retrying...');
            setTimeout(observeTbody, 2000);
        }
    }



    function createClickableAlert(message, link) {
        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            font-family: var(--font-family-base-4om3hr, "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif);
            font-weight: 400;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
    
        // Create alert box
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
            padding: 20px;
            color: var(--color-text-body-default-ffdwgg, #16191f);
            border-radius: 5px;
            max-width: 80%;
        `;
    
        // Create text content
        const text = document.createElement('p');
        text.textContent = message.split(link)[0];
    
        // Create link
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.textContent = link;
        linkElement.target = "_blank";
    
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.onclick = () => document.body.removeChild(modal);
    
        // Assemble the alert box
        alertBox.appendChild(text);
        alertBox.appendChild(linkElement);
        alertBox.appendChild(document.createElement('br'));
        alertBox.appendChild(closeButton);
    
        // Add alert box to modal
        modal.appendChild(alertBox);
    
        // Add modal to body
        document.body.appendChild(modal);
    }
    

    





    function GetTickets() {
        return new Promise((resolve, reject) => {
            let tbody = document.querySelector('tbody');
            if (tbody !== null) {
                const addtoqueue = checkfornewtickets(tbody);
                if (addtoqueue !== null) {
                    resolve(addtoqueue);
                    new Promise((resolve) => {
                        if (addtoqueue.length > 0) {
                            const update = updatesess(addtoqueue);
                            resolve(update);
                        }
                        else {
                            resolve([]);
                        }
                    })
                        .then((update) => {
                        return new Promise((resolve) => {
                            if (update) {
                                let queuefilter = "All";
                                UpdateTbodyText(tbody, sesstickets, resolve, queuefilter);
                            }
                            else {
                                resolve();
                            }
                            resolve();
                        });
                    })
                        .catch((error) => {
                        console.error('Error:', error);
                    });
                }
                else {
                    resolve([]);
                }
            }
            else {
                reject('tbody element not found');
            }
        });
    }
    function checkfornewtickets(tbody) {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        let callbucket = [];
        rows.forEach(row => {
            const rowTextContent = row.textContent;
            if (rowTextContent !== null) {
                const matches = rowTextContent.match(uuidRegex);
                if (matches) {
                    matches.forEach(match => {
                        const uuid = match;
                        if (sesstickets.every(ticket => ticket.UUID != uuid)) {
                            callbucket.push({ UUID: uuid });
                        }
                    });
                }
                else {
                    callbucket.push({ UUID: "null" });
                }
            }
        });
        return callbucket;
    }
    ;
    function createIdArray(uuids) {
        let idArray = [];
        uuids.forEach((uuid, index) => {
            idArray.push(`id.${index + 1}=${uuid}`);
        });
        return idArray;
    }
    async function updatesess(ticketlist) {
        let ticketcallarray = createIdArray(ticketlist.map(ticket => ticket.UUID));
        const url = 'https://maxis-service-prod-iad.amazon.com/issues?' + ticketcallarray.join('&');
        const fetchTicketData = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'json',
                onload: function (response) {
                    if (response.status === 200) {
                        let ticketData = response.response;
                        ticketData.documents.forEach((ticket) => {
                            let tags = [];
                            let tickage;
                            let bp;
                            if (ticket.tags !== undefined) {
                                const bountyTags = ticket.tags.filter((tag) => ['Bounty_High', 'Bounty_Low'].includes(tag.id));
                                if (bountyTags.length > 0) {
                                    tags.push(...bountyTags);
                                }
                                else {
                                    tags.push({ id: "Not_in_Dwell" });
                                }
                            }
                            if (ticket.title !== undefined) {
                                if (ticket.title.match("ProtoOne")) {
                                    tags.push({ id: "ProtoOne" });
                                    tickage = Number(((Date.now() - new Date(ticket.createDate).getTime()) / (1000 * 60 * 60 * 24)).toFixed(2));
                                    if (ticket.title.match(BP)) {
                                        bp = (ticket.title.match(BP)[1]);
                                        if (bp) {
                                            let slaLimit = (bp >= 1 && bp <= 3) ? 5 : (bp >= 4 && bp <= 7) ? 14 : undefined;
                                            if (slaLimit !== undefined) {
                                                tickage = Number((slaLimit - tickage).toFixed(4));
                                                if (tickage <= 0) {
                                                    tags.push({ id: "Out of SLA" });
                                                }
                                                else {
                                                    tags.push({ id: "In SLA" });
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (ticket.title.match(BP)) {
                                        bp = (ticket.title.match(BP)[1]);
                                    }
                                }
                            }
                            if (tickage !== undefined) {
                                if (ticket) {
                                    sesstickets.push({
                                        UUID: ticket.id,
                                        tags: tags.flat().map((tag) => tag.id),
                                        ticketage: tickage,
                                        BP: bp
                                    });
                                }
                            }
                            else {
                                sesstickets.push({
                                    UUID: ticket.id,
                                    tags: tags.flat().map((tag) => tag.id),
                                    BP: bp
                                });
                            }
                        });
                        resolve(sesstickets);
                    }
                    else {
                        reject('Failed to fetch ticket data');
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
        try {
            await fetchTicketData;
            return sesstickets;
        }
        catch (error) {
            console.error('Error fetching ticket data:', error);
            return [];
        }
    }
    function filter(tbody, texas) {
        const headerCell = document.querySelector('[data-focus-id=sorting-control-ticketId]');
        if (headerCell) {
            let filterElement = document.getElementById('filter');
            let filterSelect;
            if (!filterElement) {
                // Create the filter element only if it doesn't exist
                filterElement = document.createElement('div');
                filterElement.id = 'filter';
                headerCell.appendChild(filterElement);
                // Create the filter content
                filterElement.innerHTML = `
      <div style="display: flex; align-items: center; margin-right: 10px;">
        <label for="filter-select" style="margin-right: 5px;">Filter:</label>
        <select id="filter-select" style="padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
          <option value="All">All</option>
          <option value="Bounty_High">Bounty High</option>
          <option value="Bounty_Low">Bounty Low</option>
          <option value="ProtoOne">ProtoOne</option>
          <option value="Not_in_Dwell">Not in Dwell</option>
          <option value="Out of SLA">Out of SLA</option>
          <option value="In SLA">In SLA</option>
        </select>
      </div>
      `;
                filterSelect = filterElement.querySelector('#filter-select');
                // Add event listener only when creating the element for the first time
                filterSelect.addEventListener('change', (event) => filterChangeHandler(event, tbody, texas));
            }
            else {
                // If the filter already exists, just get a reference to the select element
                filterSelect = filterElement.querySelector('#filter-select');
            }
            // Ensure the filterSelect is not null before using it
            if (filterSelect) {
                // You can update the options here if needed, without resetting the entire innerHTML
                // For example, if you need to add or remove options dynamically
            }
        }
    }
    function filterChangeHandler(event, tbody, texas) {
        let queuefilter = event.target.value;
        updateDataBasedOnFilter(tbody, texas, queuefilter);
    }
    function updateDataBasedOnFilter(tbody, texas, filterValue) {
        // Update the tbody with the filtered data
        UpdateTbodyText(tbody, texas, () => { }, filterValue);
    }
    function updateHeaderText() {
        const headerCell = document.querySelector('[data-focus-id=sorting-control-ticketId]');
        if (headerCell) {
            let countElement = headerCell.querySelector('.count-element');
            if (!countElement) {
                // Create the element only if it doesn't exist
                countElement = document.createElement('div');
                countElement.classList.add('count-element');
                countElement.id = "Bounty-row";
                countElement.style.display = 'flex';
                countElement.style.justifyContent = 'space-between';
                countElement.style.marginLeft = '10px';
                countElement.style.fontWeight = 'normal';
                countElement.style.fontSize = '14px';
                countElement.style.color = 'gray';
                headerCell.appendChild(countElement);
            }
            countElement.textContent = `(Bounty High:${Bounty_HighCount}, Bounty Low:${Bounty_LowCount}, Proto:${ProtoOne})`;
        }
        else {
            console.error('Header cell not found.');
        }
    }
    function UpdateTbodyText(tbody, texas, resolve, queuefilter) {
        Bounty_HighCount = 0;
        Bounty_LowCount = 0;
        ProtoOne = 0;
        let queue = queuefilter;
        let rows = Array.from(tbody.querySelectorAll('small'));
        rows.forEach(row => {
            const rowTextContent = row.textContent;
            let validname = "";
            if (rowTextContent !== null) {
                const matches = rowTextContent.match(uuidRegex);
                let ticketname = (rowTextContent.match(name)?.[0] ?? null);
                if (ticketname) {
                    if (!(ticketname.includes("Bounty") || ticketname.includes("Created"))) {
                        validname = ticketname;
                    }
                    else {
                        validname = "Workable";
                    }
                }
                if (!matches) {
                    row.style.fontWeight = 'bold';
                    row.textContent = `Not_in_Dwell`;
                }
                if (matches) {
                    matches.forEach(match => {
                        const matchingTicket = texas.find(ticket => ticket.UUID === match);
                        let parentElement = row.parentElement?.closest('tr');
                        if (queue === "All") {
                            // Show all rows when "All" is selected
                            if (parentElement) {
                                parentElement.style.display = '';
                            }
                        }
                        else if (matchingTicket) {
                            if (matchingTicket.tags?.includes(queue)) {
                                // Show matching rows
                                if (parentElement) {
                                    parentElement.style.display = '';
                                }
                            }
                            else {
                                // Hide non-matching rows
                                if (parentElement) {
                                    parentElement.style.display = 'none';
                                }
                            }
                        }
                        if (matchingTicket) {
                            if (matchingTicket.tags) {
                                if (matchingTicket.tags.includes("Bounty_High")) {
                                    row.style.color = 'purple';
                                    Bounty_HighCount++;
                                    let parentElement = row.parentElement?.closest('tr');
                                    if (parentElement) {
                                        tbody.insertBefore(parentElement, tbody.firstChild);
                                    }
                                }
                                if (matchingTicket.tags.includes("Bounty_Low")) {
                                    Bounty_LowCount++;
                                    row.style.color = '#00a8e1';
                                }
                                if (matchingTicket.tags.includes("Not_in_Dwell")) {
                                    row.style.color = 'Green';
                                    if (!(matchingTicket.tags.includes("ProtoOne"))) {
                                        let parentElement = row.parentElement?.closest('tr');
                                        if (parentElement) {
                                            tbody.insertBefore(parentElement, tbody.lastChild);
                                        }
                                    }
                                }
                                if (matchingTicket.tags.includes("ProtoOne")) {
                                    ProtoOne++;
                                    // Apply the rainbow gradient to the text
                                    row.style.background = 'linear-gradient(to right, #067d62, #1196ab, #ffaf38, #cc0c39)';
                                    row.style.webkitBackgroundClip = 'text';
                                    row.style.webkitTextFillColor = 'transparent';
                                    let parentElement = row.parentElement?.closest('tr');
                                    if (parentElement) {
                                        tbody.insertBefore(parentElement, tbody.firstChild);
                                    }
                                }
                            }
                            row.style.fontWeight = 'bold';
                            if (matchingTicket.UUID && matchingTicket.tags?.length) {
                                let content = `[${validname}]     `;
                                // Create a span for the UUID
                                content += `<span class="copyable-uuid" title="Click to copy UUID" style="cursor: pointer;">${matchingTicket.UUID}  ${matchingTicket.tags}`;
                                if (matchingTicket.ticketage !== undefined) {
                                    content += `   [${matchingTicket.ticketage}]`;
                                }
                                content += '';
                                row.innerHTML = content;
                                // Add click event listener to the UUID span
                                const uuidSpan = row.querySelector('.copyable-uuid');
                                if (uuidSpan) {
                                    uuidSpan.addEventListener('click', (event) => {
                                        event.stopPropagation(); // Prevent row click event if there's any
                                        navigator.clipboard.writeText(matchingTicket.UUID)
                                            .then(() => {
                                            // Visual feedback
                                            uuidSpan.style.backgroundColor = '#e0e0e0';
                                            setTimeout(() => {
                                                uuidSpan.style.backgroundColor = '';
                                            }, 200);
                                            console.log('UUID copied to clipboard');
                                        })
                                            .catch(err => {
                                            console.error('Failed to copy UUID: ', err);
                                        });
                                    });
                                }
                            }
                            else {
                                row.textContent = 'Not_in_Dwell';
                            }
                        }
                        else {
                            row.style.fontWeight = 'bold';
                            row.textContent = `Not_in_Dwell`;
                        }
                    });
                }
            }
        });
        updateHeaderText();
        resolve();
        filter(tbody, texas);
    }
    function checkForUpdates() {
        const currentVersion = "1.3.2"; // Make sure this matches your current @version
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://axzile.corp.amazon.com/-/carthamus/download_script/dwell-support-boost.user.js",
            onload: function (response) {
                const scriptContent = response.responseText;
                const versionMatch = scriptContent.match(/\/\/ @version\s+(\d+\.\d+\.\d+)/);
                if (versionMatch && versionMatch[1]) {
                    const latestVersion = versionMatch[1];
                    if (compareVersions(latestVersion, currentVersion) > 0) {
                        // Notify the user about the update
                        GM_notification({
                            text: `A new version (${latestVersion}) of Dwell Support Boost is available!`,
                            title: "Update Available",
                            timeout: 10000,
                            onclick: () => window.open("https://axzile.corp.amazon.com/-/carthamus/download_script/dwell-support-boost.user.js")
                        });
                    }
                }
                else {
                    console.error("Failed to extract version from the script");
                }
            },
            onerror: function (error) {
                console.error("Failed to fetch the script:", error);
            }
        });
    }
    // Helper function to compare version strings
    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const p1 = parts1[i] || 0; // Use 0 if part is undefined
            const p2 = parts2[i] || 0; // Use 0 if part is undefined
            if (p1 > p2)
                return 1;
            if (p1 < p2)
                return -1;
        }
        return 0;
    }
    // Call this function when your script initializes
    checkForUpdates();
})();
