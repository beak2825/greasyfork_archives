// ==UserScript==
// @name         Find New Accounts - Experimental Search
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      2.20
// @description  Load 50 most recent accounts with tracked IP info, individual and bulk ban actions, posts/topics links, custom account loading, COPPA action, and forum IP indicators with click-to-load; tracked IP UI is shown only on pages containing <h1 id="moddog_logo">ModDog</h1>.
// @author
// @match        https://www.gaiaonline.com/moddog/
// @match        https://www.gaiaonline.com/admin/user/mod/*
// @match        https://www.gaiaonline.com/admin/?mode=banManager*
// @match        https://www.gaiaonline.com/gaia/report.php?r=52
// @match        https://www.gaiaonline.com/forum/*/*/t.*
// @match        https://www.gaiaonline.com/forum/*/*/t.*/#*
// @match        https://www.gaiaonline.com/admin/user/mod/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/491754/Find%20New%20Accounts%20-%20Experimental%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/491754/Find%20New%20Accounts%20-%20Experimental%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------ COPPA AUTO-FILL ------------------
    if (window.location.href.indexOf("report.php?r=52") > -1) {
        const coppaUserIDs = localStorage.getItem("coppaUserID");
        if (coppaUserIDs) {
            const textbox = document.querySelector('input[name="data[username]"]');
            if (textbox) {
                textbox.value = coppaUserIDs;
            }
            localStorage.removeItem("coppaUserID");
        }
        return;
    }

    // ------------------ BAN MANAGER AUTO-FILL ------------------
    if (window.location.href.indexOf("mode=banManager") > -1) {
        const banUserIDs = localStorage.getItem("banUserID");
        if (banUserIDs) {
            const textarea = document.querySelector('textarea[name="userid"]');
            if (textarea) {
                textarea.value = banUserIDs;
            }
            localStorage.removeItem("banUserID");
        }
        return;
    }

    // ------------------ Expose Global Ban Functions ------------------
    if (typeof unsafeWindow !== "undefined") {
        unsafeWindow.banUser = function(userId) {
            localStorage.setItem("banUserID", userId);
            window.open("https://www.gaiaonline.com/admin/?mode=banManager", "_blank");
        };
    } else {
        window.banUser = function(userId) {
            localStorage.setItem("banUserID", userId);
            window.open("https://www.gaiaonline.com/admin/?mode=banManager", "_blank");
        };
    }

    // ------------------ Expose Global COPPA Function ------------------
    if (typeof unsafeWindow !== "undefined") {
        unsafeWindow.coppaUser = function(userId) {
            localStorage.setItem("coppaUserID", userId);
            window.open("https://www.gaiaonline.com/gaia/report.php?r=52", "_blank");
        };
    } else {
        window.coppaUser = function(userId) {
            localStorage.setItem("coppaUserID", userId);
            window.open("https://www.gaiaonline.com/gaia/report.php?r=52", "_blank");
        };
    }

    // Bulk ban function – called by the "Bulk Ban Selected" button.
    function bulkBanSelected() {
        const checkboxes = document.querySelectorAll('input.bulkCheckbox:checked');
        if (checkboxes.length === 0) {
            alert("No users selected for bulk ban.");
            return;
        }
        const ids = [];
        checkboxes.forEach(cb => {
            const id = cb.getAttribute('data-userid');
            if (id) { ids.push(id); }
        });
        const bulkIDs = ids.join(',');
        localStorage.setItem("banUserID", bulkIDs);
        window.open("https://www.gaiaonline.com/admin/?mode=banManager", "_blank");
    }

    // ------------------ Global Variables ------------------
    let loadNewAccountsButton = null;
    let bulkBanButton = null; // Reference for the Bulk Ban Selected button.
    let startID = 50527112; // Hardcoded starting ID

    // ------------------ Utility Functions ------------------
    function ipToDecimal(ip) {
        return ip.split('.').reduce((acc, octet) => acc * 256 + parseInt(octet, 10), 0);
    }

    // Checks if an IP is tracked.
    function isIPTracked(ip) {
        const trackedIPs = JSON.parse(localStorage.getItem('trackedIPs') || '{}');
        return ip in trackedIPs;
    }

    // Returns true if there is an exact match for IP tracking.
    function hasExactMatch(ip, trackedIPs) {
        return ip in trackedIPs;
    }

    // Returns an array of strings for partial IP matches.
    // For each tracked IP that partially matches (sharing the same first three octets),
    // it returns "alias (IP)" if an alias exists, or just the IP otherwise.
    function getPartialMatchAliases(ip, trackedIPs) {
        const ipParts = ip.split('.');
        if (ipParts.length !== 4) return [];
        const ipPrefix = ipParts.slice(0, 3).join('.');
        let matches = [];
        for (const trackedIP in trackedIPs) {
            if (trackedIP === ip) continue;
            const trackedParts = trackedIP.split('.');
            if (trackedParts.length !== 4) continue;
            const trackedPrefix = trackedParts.slice(0, 3).join('.');
            if (ipPrefix === trackedPrefix) {
                if (trackedIPs[trackedIP]) {
                    matches.push(`${trackedIPs[trackedIP]} (${trackedIP})`);
                } else {
                    matches.push(trackedIP);
                }
            }
        }
        return matches;
    }

    function createIpLink(ipAddress, userId) {
        return `<a href="https://www.gaiaonline.com/forum/mod/ip/?i=${ipToDecimal(ipAddress)}&u=${userId}" target="_blank">${ipAddress}</a>`;
    }

    // ------------------ UI Creation for ModDog Pages ------------------
    // These UI elements (buttons, table, tracked IP list) are only inserted on pages containing the ModDog logo.
    function addButtonsAndTable() {
        const insertionPoint = document.getElementById('tools_and_resources');
        if (!insertionPoint) {
            console.warn('Insertion point for buttons not found.');
            return;
        }
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.width = 'calc(100% - 15px)';
        container.style.margin = '0 auto';
        container.style.padding = '5px';

        // Check for Latest ID button.
        const checkLatestIdButton = createButton('Check for Latest ID', findLatestAccountId);
        container.appendChild(checkLatestIdButton);

        // Load New Accounts button.
        const checkButton = createButton('Load New Accounts', checkForNewUserIDs);
        checkButton.disabled = true;
        checkButton.style.opacity = '0.5';
        loadNewAccountsButton = checkButton;
        container.appendChild(checkButton);

        // Bulk Ban Selected button.
        const bulkButton = createButton('Bulk Ban Selected', bulkBanSelected);
        container.appendChild(bulkButton);
        bulkBanButton = bulkButton;

        // Input for new start ID.
        const startIdInput = createInput('number', 'Enter new start ID');
        container.appendChild(startIdInput);

        // Input for Custom Account IDs.
        const customIdsInput = createInput('text', 'Enter custom IDs (comma separated)');
        customIdsInput.id = 'customIdsInput';
        container.appendChild(customIdsInput);

        const loadCustomButton = createButton('Load Custom Accounts', loadCustomAccounts);
        container.appendChild(loadCustomButton);

        insertionPoint.parentNode.insertBefore(container, insertionPoint.nextSibling);

        createEmptyTable();

        const disclaimerDiv = createDisclaimerDiv();
        insertionPoint.parentNode.insertBefore(disclaimerDiv, container.nextSibling);
    }

    function createButton(text, clickEvent) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.marginLeft = '5px';
        button.addEventListener('click', clickEvent);
        return button;
    }

    function createInput(type, placeholder) {
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.style.marginLeft = '5px';
        return input;
    }

    function createDisclaimerDiv() {
        const disclaimerDiv = document.createElement('div');
        disclaimerDiv.id = 'disclaimerDiv';
        disclaimerDiv.textContent = "Disclaimer! This tool is not intended to be a one-stop-shop for your modding activities. Just because an account is flagged does NOT mean it is truly a BoS User or an Exclusive Advertiser. Do your due diligence and investigate an account fully before taking any actions. This tool finds the 50 most recent accounts.";
        disclaimerDiv.style.marginTop = '10px';
        disclaimerDiv.style.width = 'calc(100% - 15px)';
        disclaimerDiv.style.margin = '0 auto';
        disclaimerDiv.style.padding = '5px';
        return disclaimerDiv;
    }

    function createLegend() {
        const legend = document.createElement("div");
        legend.id = "legend";
        legend.style.margin = "10px auto";
        legend.style.width = "calc(100% - 15px)";
        legend.style.textAlign = "center";
        legend.style.fontSize = "14px";
        legend.innerHTML =
            `<span style="display: inline-block; background-color: #ffcccc; padding: 2px 6px; margin-right: 10px;">Flagged IP (tracked)</span>
             <span style="display: inline-block; background-color: #ffffcc; padding: 2px 6px; margin-right: 10px;">Partial match to flagged IP</span>
             <span style="display: inline-block; background-color: #cce5ff; padding: 2px 6px;">Account with posts > 0</span>`;
        return legend;
    }

    function setupTrackedIPsUI() {
        const container = document.createElement('div');
        container.id = 'tracked-ips-container';
        container.style.marginTop = '20px';
        container.style.padding = '10px';
        container.style.border = '1px solid #ccc';

        const title = document.createElement('h3');
        title.textContent = 'Tracked IPs';
        container.appendChild(title);

        const trackedIPsList = document.createElement('div');
        trackedIPsList.id = 'tracked-ips-list';
        container.appendChild(trackedIPsList);

        const ipInput = createInput('text', 'Enter IP to track');
        container.appendChild(ipInput);

        const ipButtonsContainer = document.createElement('span');
        ipButtonsContainer.style.marginLeft = '5px';

        const addButton = createButton('Add IP', () => {
            const ip = ipInput.value.trim();
            if (ip) {
                updateTrackedIPs(ip, true);
                ipInput.value = '';
                refreshTrackedIPsList();
            }
        });
        ipButtonsContainer.appendChild(addButton);

        const exportButton = createButton('Export IPs', exportTrackedIPs);
        ipButtonsContainer.appendChild(exportButton);

        const importButton = createButton('Import IPs', () => {
            document.getElementById('importFileInput').click();
        });
        ipButtonsContainer.appendChild(importButton);

        container.appendChild(ipButtonsContainer);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.id = 'importFileInput';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', importTrackedIPs);
        container.appendChild(fileInput);

        const disclaimerDiv = document.getElementById('disclaimerDiv');
        if (disclaimerDiv) {
            disclaimerDiv.parentNode.insertBefore(container, disclaimerDiv.nextSibling);
        } else {
            document.body.appendChild(container);
        }

        refreshTrackedIPsList();
    }

    // ------------------ Modified Function: refreshTrackedIPsList ------------------
    function refreshTrackedIPsList() {
        const list = document.getElementById('tracked-ips-list');
        list.innerHTML = '';
        let trackedIPs = JSON.parse(localStorage.getItem('trackedIPs') || '{}');
        if (Array.isArray(trackedIPs)) {
            trackedIPs = {};
            localStorage.setItem('trackedIPs', JSON.stringify(trackedIPs));
        }
        console.log("Retrieved Tracked IPs: ", trackedIPs);
        Object.entries(trackedIPs).forEach(([ip, alias]) => {
            const entry = document.createElement('div');
            const ipLink = document.createElement('a');
            ipLink.href = `https://www.gaiaonline.com/forum/mod/ip/?i=${ipToDecimal(ip)}`;
            ipLink.target = '_blank';
            ipLink.textContent = ip;
            entry.appendChild(ipLink);
            if (alias) {
                const aliasText = document.createTextNode(` - ${alias}`);
                entry.appendChild(aliasText);
            }
            const removeButton = createButton('Remove', () => {
                updateTrackedIPs(ip, false);
            });
            entry.appendChild(removeButton);
            list.appendChild(entry);
        });
    }

    function exportTrackedIPs() {
        let trackedIPs = JSON.parse(localStorage.getItem('trackedIPs') || '{}');
        let textContent = '';
        for (const ip in trackedIPs) {
            if (trackedIPs.hasOwnProperty(ip)) {
                textContent += ip + (trackedIPs[ip] ? " - " + trackedIPs[ip] : "") + "\n";
            }
        }
        const blob = new Blob([textContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "trackedIPs.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function importTrackedIPs(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const lines = content.split('\n');
            let importedIPs = JSON.parse(localStorage.getItem('trackedIPs') || '{}');
            lines.forEach(line => {
                line = line.trim();
                if (line) {
                    const parts = line.split(' - ');
                    const ip = parts[0].trim();
                    const alias = parts.length > 1 ? parts[1].trim() : '';
                    if (!(ip in importedIPs)) {
                        importedIPs[ip] = alias;
                    }
                }
            });
            localStorage.setItem('trackedIPs', JSON.stringify(importedIPs));
            refreshTrackedIPsList();
            alert("Imported IP addresses successfully.");
        };
        reader.readAsText(file);
        event.target.value = "";
    }

    function updateTrackedIPs(ip, isAdding, alias = '') {
        let trackedIPs = JSON.parse(localStorage.getItem('trackedIPs') || '{}');
        if (Array.isArray(trackedIPs)) {
            trackedIPs = {};
            localStorage.setItem('trackedIPs', JSON.stringify(trackedIPs));
        }
        console.log("Current Tracked IPs: ", trackedIPs);
        if (isAdding) {
            if (!alias && confirm("Do you want to add an alias for this IP?")) {
                alias = prompt("Enter an alias for the IP:", '');
            }
            trackedIPs[ip] = alias;
            console.log(`Adding/Updating IP ${ip} with alias '${alias}'`);
        } else {
            delete trackedIPs[ip];
            console.log(`Removing IP ${ip} from tracking`);
        }
        localStorage.setItem('trackedIPs', JSON.stringify(trackedIPs));
        refreshTrackedIPsList();
    }

    function addButtonNextToIP() {
        window.addEventListener('load', () => {
            const textNodes = document.evaluate("//text()[contains(., 'Last Login IP:')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < textNodes.snapshotLength; i++) {
                const node = textNodes.snapshotItem(i);
                if (node.nextSibling && node.nextSibling.tagName === 'A') {
                    const ipLink = node.nextSibling;
                    const button = createIPTrackButton(ipLink);
                    ipLink.parentNode.insertBefore(button, ipLink.nextSibling);
                }
            }
        });
    }

    function createIPTrackButton(ipLink) {
        const button = document.createElement('button');
        button.textContent = 'Track IP';
        button.style.marginLeft = '10px';
        button.onclick = function() {
            const ip = ipLink.textContent;
            updateTrackedIPs(ip, true);
        };
        return button;
    }

    addButtonNextToIP();

    // ------------------ Account Loading ------------------
    function findLatestAccountId() {
        let low = startID;
        let high = startID + 333333;
        high -= (high - startID) % 3;
        const checkExistence = (id, resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.gaiaonline.com/admin/user/mod/${id}`,
                onload: function(response) {
                    const expectedErrorMessage = `User ${id} cannot be found.`;
                    if (response.responseText.includes(expectedErrorMessage)) {
                        high = id - 3;
                    } else {
                        low = id + 3;
                    }
                    if (low > high) {
                        resolve(high);
                    } else {
                        checkExistence(low + Math.floor((high - low) / 6) * 3, resolve);
                    }
                },
                onerror: function() {
                    console.error(`Error checking ID: ${id}`);
                    resolve(low);
                }
            });
        };
        return new Promise((resolve) => {
            checkExistence(low + Math.floor((high - low) / 6) * 3, resolve);
        }).then((latestID) => {
            const newStartID = (latestID + 3) - 147;
            updateInputWithValue(newStartID);
            console.log(`Start ID updated for loading the latest 50 accounts: ${newStartID}`);
            if (loadNewAccountsButton) {
                loadNewAccountsButton.disabled = false;
                loadNewAccountsButton.style.opacity = '1';
            }
        });
    }

    function updateInputWithValue(id) {
        const startIdInput = document.querySelector('input[type="number"][placeholder="Enter new start ID"]');
        if (startIdInput) {
            startIdInput.value = id;
            startID = id;
            localStorage.setItem('lastReviewedUserID', (id - 3).toString());
            console.log(`Input and startID updated with latest ID: ${id}`);
        }
    }

    function checkForNewUserIDs() {
        const table = document.getElementById('userIdInfoTable');
        if (table) {
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
        }
        let batchMessage = document.getElementById('batchMessage');
        if (!batchMessage) {
            batchMessage = document.createElement('div');
            batchMessage.id = 'batchMessage';
            batchMessage.style.textAlign = 'center';
            batchMessage.style.margin = '10px';
            const tableWrapper = document.getElementById('tableWrapper');
            tableWrapper.appendChild(batchMessage);
        }
        batchMessage.textContent = "Loading 50 accounts...";
        let userID = Math.max(getNextUserID(), startID);
        const foundIDsUsernamesIPs = [];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                checkUserID(userID, foundIDsUsernamesIPs);
                userID += 3;
                if (i === 49) {
                    setTimeout(() => {
                        displayResultsInTable(foundIDsUsernamesIPs);
                        batchMessage.textContent = "";
                    }, 1000);
                }
            }, i * 500);
        }
    }

    function checkUserID(userID, foundIDsUsernamesIPs) {
        const url = `https://www.gaiaonline.com/admin/user/mod/${userID}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const responseBody = response.responseText;
                const usernameRegex = /Username:\s*([\w\s\-]+)/;
                const lastLoginIPRegex = /Last Login IP:.*?(\d+\.\d+\.\d+\.\d+)/;
                const joinDateRegex = /Joined: <strong>(.*?)<\/strong>/;
                const postsRegex = /Posts:\s*<strong>(\d+)<\/strong>/;
                const activatedRegex = /Activated:\s*<\/td>\s*<td>\s*<strong>\s*(Yes|No)\s*<\/strong>/i;
                const usernameMatch = usernameRegex.exec(responseBody);
                const lastLoginIPMatch = lastLoginIPRegex.exec(responseBody);
                const joinDateMatch = joinDateRegex.exec(responseBody);
                const isActivatedMatch = activatedRegex.exec(responseBody);
                const isActivated = isActivatedMatch ? isActivatedMatch[1] : 'Unknown';
                const postsMatch = postsRegex.exec(responseBody);
                const postCount = postsMatch ? postsMatch[1] : 'Unknown';
                const parser = new DOMParser();
                const doc = parser.parseFromString(responseBody, "text/html");
                const avatarImg = doc.querySelector('img[alt*="avatar"]');
                const bannedElement = doc.querySelector('p.error');
                if (usernameMatch && lastLoginIPMatch && avatarImg) {
                    const lastLoginIP = lastLoginIPMatch[1];
                    const lastLoginIPDecimal = ipToDecimal(lastLoginIP);
                    const lastLoginIPLink = `https://www.gaiaonline.com/forum/mod/ip/?i=${lastLoginIPDecimal}&u=${userID}`;
                    foundIDsUsernamesIPs.push({
                        id: userID,
                        username: usernameMatch[1],
                        lastLoginIP: lastLoginIP,
                        lastLoginIPLink: lastLoginIPLink,
                        joinDate: joinDateMatch ? joinDateMatch[1] : 'Unknown',
                        isActivated: isActivated,
                        postCount: postCount,
                        avatarURL: avatarImg ? avatarImg.src : '',
                        isBanned: !!bannedElement
                    });
                } else {
                    console.log(`Incomplete data for User ID ${userID}.`);
                }
                saveLastReviewedID(userID);
            },
            onerror: function(err) {
                console.error(`Error fetching data for User ID ${userID}:`, err);
            }
        });
    }

    function getNextUserID() {
        return parseInt(localStorage.getItem('lastReviewedUserID') || '0', 10) + 3;
    }

    function saveLastReviewedID(id) {
        localStorage.setItem('lastReviewedUserID', id.toString());
    }

    function createEmptyTable() {
        const insertionPoint = document.getElementById('tools_and_resources');
        if (!insertionPoint) {
            console.warn('Insertion point for table not found.');
            return;
        }
        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = 'tableWrapper';
        wrapperDiv.style.width = 'calc(100% - 15px)';
        wrapperDiv.style.margin = '0 auto';

        const legend = createLegend();
        wrapperDiv.appendChild(legend);

        const containerDiv = document.createElement('div');
        containerDiv.id = 'tableContainer';
        containerDiv.style.maxHeight = '400px';
        containerDiv.style.overflowY = 'auto';
        containerDiv.style.width = '100%';
        containerDiv.style.margin = '0 auto';

        const table = document.createElement('table');
        table.id = 'userIdInfoTable';
        table.style.width = '100%';
        table.border = '1';
        table.style.margin = '0 auto';
        const headerRow = table.createTHead().insertRow(0);
        // New header for bulk selection.
        const bulkHeader = headerRow.insertCell(0);
        bulkHeader.textContent = "Bulk";
        const headers = ['ID', 'Avatar', 'Username', 'Last Login IP'];
        headers.forEach(text => {
            const headerCell = headerRow.insertCell(-1);
            headerCell.textContent = text;
        });
        containerDiv.appendChild(table);
        wrapperDiv.appendChild(containerDiv);
        insertionPoint.parentNode.insertBefore(wrapperDiv, insertionPoint.nextSibling);
    }

    // ------------------ Display results in the table ------------------
    function displayResultsInTable(foundIDsUsernamesIPs) {
        const table = document.getElementById('userIdInfoTable');
        const trackedIPs = JSON.parse(localStorage.getItem('trackedIPs') || '{}');
        console.log("Displaying results in table. Total entries: ", foundIDsUsernamesIPs.length);
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        foundIDsUsernamesIPs.forEach(data => {
            const row = table.insertRow(-1);
            // Cell 0: Bulk checkbox.
            const bulkCell = row.insertCell(0);
            const bulkCheckbox = document.createElement('input');
            bulkCheckbox.type = 'checkbox';
            bulkCheckbox.className = 'bulkCheckbox';
            bulkCheckbox.setAttribute('data-userid', data.id);
            bulkCell.appendChild(bulkCheckbox);
            // Cell 1: ID & actions.
            const idCell = row.insertCell(-1);
            const postsLine = `Posts ${data.postCount} [<a href="https://www.gaiaonline.com/forum/myposts/${data.id}/" target="_blank">Posts</a> | <a href="https://www.gaiaonline.com/forum/mytopics/${data.id}/" target="_blank">Topics</a>]`;
            idCell.innerHTML = `<strong>${data.id}</strong>${data.isBanned ? '<span style="color:red; font-weight:bold;"> - BANNED</span>' : ''}<br>Joined: ${data.joinDate}<br>${postsLine}<br><i class="fa-solid fa-user"></i> <a href="https://www.gaiaonline.com/admin/user/mod/${data.id}" target="_blank">Profile Tools</a> <br><i class="fa-solid fa-dog"></i> <a href="https://www.gaiaonline.com/moddog/note/search/${data.id}" target="_blank">ModDog</a> <br>[<a href="#" onclick="banUser(${data.id}); return false;">Ban</a>] [<a href="#" onclick="coppaUser(${data.id}); return false;">COPPA</a>]`;
            // Cell 2: Avatar.
            const avatarCell = row.insertCell(-1);
            const avatarImg = document.createElement('img');
            avatarImg.src = data.avatarURL;
            avatarImg.alt = "User's Avatar";
            avatarImg.style.maxWidth = '50px';
            avatarImg.style.height = 'auto';
            avatarCell.appendChild(avatarImg);
            // Cell 3: Username with IP match details.
            const usernameCell = row.insertCell(-1);
            if (hasExactMatch(data.lastLoginIP, trackedIPs)) {
                usernameCell.innerHTML = `${data.username}<br><small><strong>Potentially: </strong>${trackedIPs[data.lastLoginIP]}</small>`;
            } else {
                const partialAliases = getPartialMatchAliases(data.lastLoginIP, trackedIPs);
                if (partialAliases.length > 0) {
                    usernameCell.innerHTML = `${data.username}<br><small><strong>Partial match:</strong><br>${partialAliases.join('<br>')}</small>`;
                } else {
                    usernameCell.textContent = data.username;
                }
            }
            // Cell 4: Last Login IP.
            const ipCell = row.insertCell(-1);
            ipCell.innerHTML = createIpLink(data.lastLoginIP, data.id);
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = data.lastLoginIP in trackedIPs;
            checkbox.addEventListener('click', function() {
                handleCheckboxInteraction(data.lastLoginIP, checkbox, usernameCell);
            });
            ipCell.prepend(checkbox);

            // Set row background based on tracked IP conditions.
            if (data.lastLoginIP in trackedIPs) {
                row.style.backgroundColor = "#ffcccc";
            } else if (getPartialMatchAliases(data.lastLoginIP, trackedIPs).length > 0) {
                row.style.backgroundColor = "#ffffcc";
            } else if (!isNaN(parseInt(data.postCount)) && parseInt(data.postCount) > 0) {
                row.style.backgroundColor = "#cce5ff";
            }
        });
        localStorage.setItem('persistedAccounts', JSON.stringify(foundIDsUsernamesIPs));
    }

    function loadPersistedAccounts() {
        const persistedData = localStorage.getItem('persistedAccounts');
        if (persistedData) {
            try {
                const accounts = JSON.parse(persistedData);
                if (Array.isArray(accounts) && accounts.length > 0) {
                    displayResultsInTable(accounts);
                    displayPersistedNote();
                }
            } catch (e) {
                console.error("Error parsing persisted accounts:", e);
            }
        }
    }

    function displayPersistedNote() {
        const tableWrapper = document.getElementById('tableWrapper');
        if (tableWrapper) {
            let noteDiv = document.getElementById('persistedAccountsNote');
            if (!noteDiv) {
                noteDiv = document.createElement('div');
                noteDiv.id = 'persistedAccountsNote';
                noteDiv.style.textAlign = 'center';
                noteDiv.style.margin = '10px';
                noteDiv.style.color = '#888';
                noteDiv.textContent = "Note: These are previously loaded accounts. Check for the latest ID and load new accounts to see most recent accounts.";
                tableWrapper.appendChild(noteDiv);
            }
        }
    }

    // ------------------ New: Load Custom Accounts by ID ------------------
    function loadCustomAccounts() {
        const table = document.getElementById('userIdInfoTable');
        if (table) {
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
        }
        let batchMessage = document.getElementById('batchMessage');
        if (batchMessage) {
            batchMessage.textContent = "";
        }
        let persistedNote = document.getElementById('persistedAccountsNote');
        if (persistedNote) {
            persistedNote.style.display = 'none';
        }
        const input = document.getElementById('customIdsInput');
        if (!input || !input.value.trim()) {
            alert("Please enter one or more valid user IDs, separated by commas.");
            return;
        }
        const idStrings = input.value.split(',');
        const customIds = idStrings.map(s => s.trim()).filter(s => s !== "").map(Number).filter(num => !isNaN(num) && num > 0);
        if (customIds.length === 0) {
            alert("No valid IDs found.");
            return;
        }
        let customMessage = document.getElementById('customMessage');
        if (!customMessage) {
            customMessage = document.createElement('div');
            customMessage.id = 'customMessage';
            customMessage.style.textAlign = 'center';
            customMessage.style.margin = '10px';
            const tableWrapper = document.getElementById('tableWrapper');
            tableWrapper.appendChild(customMessage);
        }
        customMessage.textContent = "Loading custom accounts...";
        Promise.all(customIds.map(id => fetchUserData(id)))
        .then(results => {
            const validResults = results.filter(res => res !== null);
            displayResultsInTable(validResults);
            customMessage.textContent = validResults.length > 0 ? "" : "No valid account data found for the provided IDs.";
        })
        .catch(err => {
            console.error("Error loading custom accounts:", err);
            customMessage.textContent = "Error loading custom accounts.";
        });
    }

    function fetchUserData(userID) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.gaiaonline.com/admin/user/mod/${userID}`,
                onload: function(response) {
                    const responseBody = response.responseText;
                    const usernameRegex = /Username:\s*([\w\s\-]+)/;
                    const lastLoginIPRegex = /Last Login IP:.*?(\d+\.\d+\.\d+\.\d+)/;
                    const joinDateRegex = /Joined: <strong>(.*?)<\/strong>/;
                    const postsRegex = /Posts:\s*<strong>(\d+)<\/strong>/;
                    const activatedRegex = /Activated:\s*<\/td>\s*<td>\s*<strong>\s*(Yes|No)\s*<\/strong>/i;
                    const usernameMatch = usernameRegex.exec(responseBody);
                    const lastLoginIPMatch = lastLoginIPRegex.exec(responseBody);
                    const joinDateMatch = joinDateRegex.exec(responseBody);
                    const isActivatedMatch = activatedRegex.exec(responseBody);
                    const isActivated = isActivatedMatch ? isActivatedMatch[1] : 'Unknown';
                    const postsMatch = postsRegex.exec(responseBody);
                    const postCount = postsMatch ? postsMatch[1] : 'Unknown';
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(responseBody, "text/html");
                    const avatarImg = doc.querySelector('img[alt*="avatar"]');
                    const bannedElement = doc.querySelector('p.error');
                    if (usernameMatch && lastLoginIPMatch && avatarImg) {
                        const lastLoginIP = lastLoginIPMatch[1];
                        const lastLoginIPDecimal = ipToDecimal(lastLoginIP);
                        const lastLoginIPLink = `https://www.gaiaonline.com/forum/mod/ip/?i=${lastLoginIPDecimal}&u=${userID}`;
                        resolve({
                            id: userID,
                            username: usernameMatch[1],
                            lastLoginIP: lastLoginIP,
                            lastLoginIPLink: lastLoginIPLink,
                            joinDate: joinDateMatch ? joinDateMatch[1] : 'Unknown',
                            isActivated: isActivated,
                            postCount: postCount,
                            avatarURL: avatarImg ? avatarImg.src : '',
                            isBanned: !!bannedElement
                        });
                    } else {
                        console.log(`Incomplete data for User ID ${userID}.`);
                        resolve(null);
                    }
                },
                onerror: function(err) {
                    console.error(`Error fetching data for User ID ${userID}:`, err);
                    resolve(null);
                }
            });
        });
    }

    // ------------------ New: Forum IP Indicator with Click-to-Load ------------------
    // This function scans the page for forum IP search links (anchor with class "post-ip")
    // and inserts an indicator if the IP is flagged (exact match) or is a partial match.
    // When the indicator is clicked, it extracts the user ID from the IP link, stores it in localStorage,
    // and redirects you to the moddog page where loadCustomAccounts() is automatically triggered.
    function checkForumIPs() {
        const trackedIPs = JSON.parse(localStorage.getItem('trackedIPs') || '{}');
        const ipAnchors = document.querySelectorAll("a.post-ip");
        ipAnchors.forEach(anchor => {
            const ip = anchor.getAttribute("title");
            if (!ip) return;
            let indicator = document.createElement("span");
            indicator.style.marginLeft = "5px";
            indicator.style.fontSize = "12px";
            indicator.style.padding = "2px";
            indicator.style.border = "1px solid";
            indicator.style.cursor = "pointer"; // indicate clickability
            if (hasExactMatch(ip, trackedIPs)) {
                indicator.style.backgroundColor = "#ff0000";
                const alias = trackedIPs[ip] ? trackedIPs[ip] : ip;
                indicator.textContent = `Flagged: ${alias}`;
            } else {
                const partialMatches = getPartialMatchAliases(ip, trackedIPs);
                if (partialMatches.length > 0) {
                    indicator.style.backgroundColor = "#ffffcc";
                    indicator.innerHTML = `Partial match:<br>${partialMatches.join("<br>")}`;
                } else {
                    return; // No match, so don't add an indicator.
                }
            }
            // When the indicator is clicked, extract the "u" parameter from the anchor's href,
            // store it, and redirect to the moddog page.
            indicator.addEventListener("click", function() {
                try {
                    const urlObj = new URL(anchor.href, window.location.origin);
                    const userId = urlObj.searchParams.get("u");
                    if (userId) {
                        localStorage.setItem("customAccountsID", userId);
                        window.location.href = "https://www.gaiaonline.com/moddog/";
                    }
                } catch(e) {
                    console.error("Error processing IP link:", e);
                }
            });
            // Insert the indicator right after the IP search link.
            anchor.parentNode.insertBefore(indicator, anchor.nextSibling);
        });
    }

    // ------------------ Initialization ------------------
    // On ModDog pages (where <h1 id="moddog_logo">ModDog</h1> is detected),
    // show the tracked IPs UI.
    if (document.getElementById("moddog_logo")) {
        addButtonsAndTable();
        setupTrackedIPsUI();
        loadPersistedAccounts();
    }

    // If we're on a forum page, check for IP indicators.
    if (window.location.href.indexOf("/forum/") !== -1) {
        window.addEventListener('load', checkForumIPs);
    }

    // On the moddog page, check for a stored custom account ID and auto-load it.
    if (window.location.href.indexOf("/moddog/") !== -1) {
        window.addEventListener('load', function() {
            const customId = localStorage.getItem("customAccountsID");
            if (customId) {
                const input = document.getElementById("customIdsInput");
                if (input) {
                    input.value = customId;
                    loadCustomAccounts();
                }
                localStorage.removeItem("customAccountsID");
            }
        });
    }

        // ------------------ Add “Ban User” button after Report User’s Profile ------------------
    if (/^\/admin\/user\/mod\/\d+/.test(window.location.pathname)) {
        window.addEventListener('load', () => {
            // find the <li> that contains the “Report User’s Profile” link
            const reportLi = Array.from(document.querySelectorAll('li')).find(li => {
                const a = li.querySelector('a[target="_blank"]');
                return a && a.href.includes('/gaia/report.php?r=22');
            });
            if (!reportLi) return;

            // create our new <li><a>Ban User</a></li>
            const newLi = document.createElement('li');
            const banLink = document.createElement('a');
            banLink.href = '#';
            banLink.textContent = 'Ban User';
            banLink.addEventListener('click', e => {
                e.preventDefault();
                // extract the user ID from the URL, e.g. /admin/user/mod/47201955
                const uidMatch = window.location.pathname.match(/\/admin\/user\/mod\/(\d+)/);
                if (uidMatch) banUser(uidMatch[1]);
            });
            newLi.appendChild(banLink);

            // insert it right after the reportLi
            reportLi.parentNode.insertBefore(newLi, reportLi.nextSibling);
        });
    }


})();
