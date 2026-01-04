// ==UserScript==
// @name         HackerWars QOL Script
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  Clears logs if conditions are met, inserts a custom log message, parses IPs, BTC addresses and Bank accounts from logs, provides modals for viewing/editing these, and auto refreshes the page with a countdown (paused when menu is open). Also toggles auto deletion of red-fonted software.
// @match        https://hackerwars.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528293/HackerWars%20QOL%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/528293/HackerWars%20QOL%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Persistent settings and saved data
    let autoClearEnabled = localStorage.getItem("autoClearEnabled");
    if (autoClearEnabled === null) {
        autoClearEnabled = true;
        localStorage.setItem("autoClearEnabled", "true");
    } else {
        autoClearEnabled = (autoClearEnabled === "true");
    }
    let customLogMessage = localStorage.getItem("customLogMessage") || "";
    let savedIPs = JSON.parse(localStorage.getItem("savedIPs") || "[]");
    let savedBTC = JSON.parse(localStorage.getItem("savedBTC") || "[]");
    let savedBank = JSON.parse(localStorage.getItem("savedBank") || "[]");

    // New setting for auto deletion of software with red font
let deleteSoftwareWithRedFontEnabled = localStorage.getItem("deleteSoftwareWithRedFont");
if (deleteSoftwareWithRedFontEnabled === null) {
    deleteSoftwareWithRedFontEnabled = false;
    localStorage.setItem("deleteSoftwareWithRedFont", "false");
} else {
    deleteSoftwareWithRedFontEnabled = (deleteSoftwareWithRedFontEnabled === "true");
}

    function deleteSoftwareWithRedFont() {
        let rows = document.querySelectorAll('.table-software tbody tr');
        for (let row of rows) {
            let nameCell = row.querySelector('td:nth-child(2) b font[color="red"]');
            if (nameCell) {
                let softwareName = nameCell.textContent.trim();
                console.log(`Found software for deletion: ${softwareName}`);

                let deleteButton = row.querySelector('td:nth-child(5) a[href*="cmd=del"]');
                if (deleteButton) {
                    console.log(`Deleting: ${softwareName}`);
                    deleteButton.click();
                    return;
                }
            }
        }
        console.log("No software with red font found for deletion.");
    }

    // New auto-refresh settings
    let autoRefreshEnabled = localStorage.getItem("autoRefreshEnabled");
    if (autoRefreshEnabled === null) {
        autoRefreshEnabled = false;
        localStorage.setItem("autoRefreshEnabled", "false");
    } else {
        autoRefreshEnabled = (autoRefreshEnabled === "true");
    }
    let autoRefreshInterval = parseInt(localStorage.getItem("autoRefreshInterval") || "60", 10); // default: 60 seconds

    // Global variables for auto refresh countdown
    let autoRefreshTimer;
    let countdownInterval;
    let autoRefreshTargetTime = null;

    if (window.location.href === "https://hackerwars.io/list?action=collect&show=last") {
        window.location.href = "https://hackerwars.io/log";
    }

    // --- Helper function to sort IPs numerically ---
    function sortIPsNumerically(ips) {
        return ips.sort((a, b) => {
            let partsA = a.split('.').map(Number);
            let partsB = b.split('.').map(Number);
            for (let i = 0; i < 4; i++) {
                if (partsA[i] !== partsB[i]) {
                    return partsA[i] - partsB[i];
                }
            }
            return 0;
        });
    }

    // Update the status message with countdown to next refresh
    function updateCountdown() {
        if (!autoRefreshEnabled || !autoRefreshTargetTime) return;
        let remaining = Math.ceil((autoRefreshTargetTime - Date.now()) / 1000);
        if (remaining < 0) remaining = 0;
        setStatusMessage("Next refresh in " + remaining + "s");
    }

    // Auto-refresh the current page based on settings and start countdown
    function scheduleAutoRefresh() {
        if (autoRefreshTimer) {
            clearTimeout(autoRefreshTimer);
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        if (autoRefreshEnabled) {
            autoRefreshTargetTime = Date.now() + autoRefreshInterval * 1000;
            // Update countdown every second
            countdownInterval = setInterval(updateCountdown, 1000);
            // Also update immediately
            updateCountdown();
            autoRefreshTimer = setTimeout(() => {
                clearInterval(countdownInterval);
                console.log("Auto refreshing page...");
                window.location.reload();
            }, autoRefreshInterval * 1000);
        }
    }

    // Create the main status container and dropdown menu
    function createStatusContainer() {
        let container = document.getElementById("hw-status-container");
        if (!container) {
            container = document.createElement("li");
            container.id = "hw-status-container";
            container.className = "btn btn-inverse";
            container.style.position = "relative"; // for dropdown positioning

            let link = document.createElement("a");
            link.href = "#";

            let mainSpan = document.createElement("span");
            mainSpan.className = "main-status";

            let icon = document.createElement("i");
            icon.className = "fa fa-inverse fa-info";
            mainSpan.appendChild(icon);

            mainSpan.appendChild(document.createTextNode(" "));

            let textSpan = document.createElement("span");
            textSpan.className = "text";
            textSpan.textContent = "Status";
            mainSpan.appendChild(textSpan);

            link.appendChild(mainSpan);
            container.appendChild(link);

            // Create dropdown menu (hidden by default)
            let dropdown = document.createElement("div");
            dropdown.id = "hw-status-dropdown";
            dropdown.style.position = "absolute";
            dropdown.style.top = "100%";
            dropdown.style.left = "0";
            dropdown.style.backgroundColor = "#333333";
            dropdown.style.border = "1px solid #ccc";
            dropdown.style.padding = "5px";
            dropdown.style.zIndex = "1000";
            dropdown.style.display = "none";
            dropdown.style.minWidth = "150px";

            // Auto-clear toggle option
            let toggleOption = document.createElement("div");
            toggleOption.classList.add("btn-inverse");
            toggleOption.id = "hw-auto-clear-toggle";
            toggleOption.style.cursor = "pointer";
            toggleOption.style.padding = "5px";
            toggleOption.style.margin = "2px";
            toggleOption.textContent = autoClearEnabled ? "Auto Clear Logs: On" : "Auto Clear Logs: Off";
            toggleOption.addEventListener("click", function(e) {
                e.stopPropagation();
                autoClearEnabled = !autoClearEnabled;
                localStorage.setItem("autoClearEnabled", autoClearEnabled ? "true" : "false");
                toggleOption.textContent = autoClearEnabled ? "Auto Clear Logs: On" : "Auto Clear Logs: Off";
                setStatusMessage("Auto Clear toggled " + (autoClearEnabled ? "On" : "Off"));
            });
            dropdown.appendChild(toggleOption);

            // Custom Log Message option
            let customMsgOption = document.createElement("div");
            customMsgOption.classList.add("btn-inverse");
            customMsgOption.id = "hw-custom-msg-toggle";
            customMsgOption.style.cursor = "pointer";
            customMsgOption.style.padding = "5px";
            customMsgOption.style.margin = "2px";
            customMsgOption.textContent = "Set Log Message";
            customMsgOption.addEventListener("click", function(e) {
                e.stopPropagation();
                $("#customMessage").val(localStorage.getItem("customLogMessage") || "");
                $("#customModal").modal("show");
            });
            dropdown.appendChild(customMsgOption);

            // Auto Refresh toggle option
            let autoRefreshOption = document.createElement("div");
            autoRefreshOption.classList.add("btn-inverse");
            autoRefreshOption.id = "hw-auto-refresh-toggle";
            autoRefreshOption.style.cursor = "pointer";
            autoRefreshOption.style.padding = "5px";
            autoRefreshOption.style.margin = "2px";
            autoRefreshOption.textContent = autoRefreshEnabled ? "Auto Refresh: On (" + autoRefreshInterval + "s)" : "Auto Refresh: Off";
            autoRefreshOption.addEventListener("click", function(e) {
                e.stopPropagation();
                autoRefreshEnabled = !autoRefreshEnabled;
                localStorage.setItem("autoRefreshEnabled", autoRefreshEnabled ? "true" : "false");
                autoRefreshOption.textContent = autoRefreshEnabled ? "Auto Refresh: On (" + autoRefreshInterval + "s)" : "Auto Refresh: Off";
                setStatusMessage("Auto Refresh toggled " + (autoRefreshEnabled ? "On" : "Off"));
                if (autoRefreshEnabled) {
                    scheduleAutoRefresh();
                } else {
                    if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
                    if (countdownInterval) clearInterval(countdownInterval);
                }
            });
            dropdown.appendChild(autoRefreshOption);

            // Set custom auto-refresh interval option (opens modal)
            let setRefreshIntervalOption = document.createElement("div");
            setRefreshIntervalOption.classList.add("btn-inverse");
            setRefreshIntervalOption.id = "hw-set-refresh-interval";
            setRefreshIntervalOption.style.cursor = "pointer";
            setRefreshIntervalOption.style.padding = "5px";
            setRefreshIntervalOption.style.margin = "2px";
            setRefreshIntervalOption.textContent = "Set Refresh Interval";
            setRefreshIntervalOption.addEventListener("click", function(e) {
                e.stopPropagation();
                $("#refreshIntervalInput").val(autoRefreshInterval);
                $("#refreshModal").modal("show");
            });
            dropdown.appendChild(setRefreshIntervalOption);

            // View/Edit Parsed IPs option
            let ipsOption = document.createElement("div");
            ipsOption.classList.add("btn-inverse");
            ipsOption.id = "hw-ips-toggle";
            ipsOption.style.cursor = "pointer";
            ipsOption.style.padding = "5px";
            ipsOption.style.margin = "2px";
            ipsOption.textContent = "View/Edit Parsed IPs";
            ipsOption.addEventListener("click", function(e) {
                e.stopPropagation();
                $("#ipsList").val(sortIPsNumerically(savedIPs.slice()).join("\n"));
                $("#ipsModal").modal("show");
            });
            dropdown.appendChild(ipsOption);

            // View/Edit BTC Addresses option
            let btcOption = document.createElement("div");
            btcOption.classList.add("btn-inverse");
            btcOption.id = "hw-btc-toggle";
            btcOption.style.cursor = "pointer";
            btcOption.style.padding = "5px";
            btcOption.style.margin = "2px";
            btcOption.textContent = "View/Edit BTC Addresses";
            btcOption.addEventListener("click", function(e) {
                e.stopPropagation();
                renderBTCList();
                $("#btcModal").modal("show");
            });
            dropdown.appendChild(btcOption);

            // View/Edit Bank Accounts option
            let bankOption = document.createElement("div");
            bankOption.classList.add("btn-inverse");
            bankOption.id = "hw-bank-toggle";
            bankOption.style.cursor = "pointer";
            bankOption.style.padding = "5px";
            bankOption.style.margin = "2px";
            bankOption.textContent = "View/Edit Bank Accounts";
            bankOption.addEventListener("click", function(e) {
                e.stopPropagation();
                renderBankList();
                $("#bankModal").modal("show");
            });
            dropdown.appendChild(bankOption);

            // New option: Toggle deleteSoftwareWithRedFont on/off
            let deleteSoftwareOption = document.createElement("div");
            deleteSoftwareOption.classList.add("btn-inverse");
            deleteSoftwareOption.id = "hw-delete-software-toggle";
            deleteSoftwareOption.style.cursor = "pointer";
            deleteSoftwareOption.style.padding = "5px";
            deleteSoftwareOption.style.margin = "2px";
            deleteSoftwareOption.textContent = deleteSoftwareWithRedFontEnabled ? "Delete Red Software: On" : "Delete Red Software: Off";
            deleteSoftwareOption.addEventListener("click", function(e) {
                e.stopPropagation();
                deleteSoftwareWithRedFontEnabled = !deleteSoftwareWithRedFontEnabled;
                localStorage.setItem("deleteSoftwareWithRedFont", deleteSoftwareWithRedFontEnabled ? "true" : "false");
                deleteSoftwareOption.textContent = deleteSoftwareWithRedFontEnabled ? "Delete Red Software: On" : "Delete Red Software: Off";
                setStatusMessage("Delete Red Software toggled " + (deleteSoftwareWithRedFontEnabled ? "On" : "Off"));
            });
            dropdown.appendChild(deleteSoftwareOption);

            // Insert HR between the two sections
            let hrElement = document.createElement("hr");
            hrElement.style.cursor = "default";
            dropdown.appendChild(hrElement);

            // Developer info option
            let devBy = document.createElement("div");
            devBy.id = "hw-dev-by";
            devBy.style.cursor = "default";
            devBy.style.padding = "5px";
            devBy.style.margin = "2px";
            devBy.textContent = "Dev by TOXIK/GingerDev";
            dropdown.appendChild(devBy);

            container.appendChild(dropdown);

            // Toggle dropdown visibility with pause/resume for auto refresh
            link.addEventListener("click", function(e) {
                e.preventDefault();
                if (dropdown.style.display === "none") {
                    dropdown.style.display = "block";
                    // Pause auto-refresh and countdown when menu is open
                    if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
                    if (countdownInterval) clearInterval(countdownInterval);
                } else {
                    dropdown.style.display = "none";
                    // Resume auto-refresh when menu is closed
                    if (autoRefreshEnabled) {
                        scheduleAutoRefresh();
                    }
                }
            });

            // Hide dropdown when clicking outside and resume auto refresh if needed
            document.addEventListener("click", function(e) {
                if (!container.contains(e.target)) {
                    if (dropdown.style.display !== "none") {
                        dropdown.style.display = "none";
                        if (autoRefreshEnabled) {
                            scheduleAutoRefresh();
                        }
                    }
                }
            });

            // Insert container into page navigation
            let userNav = document.getElementById("user-nav");
            if (userNav) {
                let btnGroup = userNav.querySelector("ul.nav.btn-group");
                if (btnGroup) {
                    btnGroup.insertBefore(container, btnGroup.firstChild);
                } else {
                    userNav.appendChild(container);
                }
            } else {
                document.body.appendChild(container);
            }
        }
        return container;
    }

    // Display a status message in the status container
    function setStatusMessage(message) {
        const container = createStatusContainer();
        let msgEl = container.querySelector("span.status-msg");
        if (!msgEl) {
            msgEl = document.createElement("span");
            msgEl.className = "status-msg";
            msgEl.style.fontWeight = "bold";
            msgEl.style.marginLeft = "10px";
            let mainSpan = container.querySelector("span.main-status");
            if (mainSpan) {
                mainSpan.appendChild(msgEl);
            } else {
                container.appendChild(msgEl);
            }
        }
        msgEl.textContent = message;
    }

    // Retrieve your IP from the header element
    function getMyIP() {
        let ipElement = document.querySelector('.header-ip-show');
        if (ipElement) {
            return ipElement.innerText.trim();
        }
        console.log("IP element not found.");
        return null;
    }

    // Parse IP addresses from log text (IPs enclosed in square brackets)
    function parseIPsFromText(text) {
        const ipRegex = /\[(\d{1,3}(?:\.\d{1,3}){3})\]/g;
        let matches = [];
        let match;
        while ((match = ipRegex.exec(text)) !== null) {
            matches.push(match[1]);
        }
        return [...new Set(matches)]; // remove duplicates
    }

    // Checks if the current page should be parsed (either logs, /internet)
    function shouldParse() {
        return (window.location.href.indexOf("view=logs") !== -1 || window.location.pathname === "/internet");
    }

    // Parse and save IPs from logs (excluding your own IP), merging with existing entries
    function parseAndSaveIPs() {
        if (!shouldParse()) return;
        let logArea = document.querySelector('.logarea');
        if (!logArea) {
            console.log("Log area element not found for IP parsing.");
            return;
        }
        let logText = logArea.value || logArea.innerText;
        let allIPs = parseIPsFromText(logText);
        let myIP = getMyIP();
        let filteredIPs = myIP ? allIPs.filter(ip => ip !== myIP) : allIPs;

        // Merge with existing saved IPs
        let existingIPs = JSON.parse(localStorage.getItem("savedIPs") || "[]");
        let mergedIPs = [...new Set(existingIPs.concat(filteredIPs))];

        savedIPs = mergedIPs;
        localStorage.setItem("savedIPs", JSON.stringify(savedIPs));
        console.log("Merged IPs (excluding your IP):", savedIPs);
    }

    // Parse and save BTC addresses (account and key) from logs, merging with existing entries
    function parseAndSaveBTC() {
        if (!shouldParse()) return;
        let logArea = document.querySelector('.logarea');
        if (!logArea) {
            console.log("Log area element not found for BTC parsing.");
            return;
        }
        let logText = logArea.value || logArea.innerText;
        // Regex: capture account and key
        const btcRegex = /on account ([0-9A-Za-z]+)\s+using key ([0-9A-Za-z]+)/g;
        let matches = [];
        let match;
        while ((match = btcRegex.exec(logText)) !== null) {
            matches.push({account: match[1], key: match[2]});
        }
        // Remove duplicate entries from new matches
        let uniqueBTC = [];
        matches.forEach(item => {
            if (!uniqueBTC.find(existing => existing.account === item.account && existing.key === item.key)) {
                uniqueBTC.push(item);
            }
        });
        // Merge with existing saved BTC entries
        let existingBTC = JSON.parse(localStorage.getItem("savedBTC") || "[]");
        uniqueBTC.forEach(newItem => {
            if (!existingBTC.find(existing => existing.account === newItem.account && existing.key === newItem.key)) {
                existingBTC.push(newItem);
            }
        });
        savedBTC = existingBTC;
        localStorage.setItem("savedBTC", JSON.stringify(savedBTC));
        console.log("Merged BTC addresses:", savedBTC);
    }

    // Parse and save Bank accounts from logs, merging with existing entries
    function parseAndSaveBank() {
        if (!shouldParse()) return;
        let logArea = document.querySelector('.logarea');
        if (!logArea) {
            console.log("Log area element not found for Bank parsing.");
            return;
        }
        let logText = logArea.value || logArea.innerText;
        const bankRegex = /logged on account #([0-9]+)\s+on bank \[([0-9]{1,3}(?:\.[0-9]{1,3}){3})\]/g;
        let matches = [];
        let match;
        while ((match = bankRegex.exec(logText)) !== null) {
            matches.push({account: match[1], bankIP: match[2]});
        }
        // Remove duplicate entries from new matches
        let uniqueBank = [];
        matches.forEach(item => {
            if (!uniqueBank.find(existing => existing.account === item.account && existing.bankIP === item.bankIP)) {
                uniqueBank.push(item);
            }
        });
        // Merge with existing saved Bank entries
        let existingBank = JSON.parse(localStorage.getItem("savedBank") || "[]");
        uniqueBank.forEach(newItem => {
            if (!existingBank.find(existing => existing.account === newItem.account && existing.bankIP === newItem.bankIP)) {
                existingBank.push(newItem);
            }
        });
        savedBank = existingBank;
        localStorage.setItem("savedBank", JSON.stringify(savedBank));
        console.log("Merged Bank accounts:", savedBank);
    }

    // Listen for alerts and handle actions accordingly
    function listenForAlerts() {
        function handleAlert(alertElement) {
            const alertText = alertElement.innerText;
            if (alertText.includes('Log successfully edited')) {
                console.log("Success message detected, redirecting to software page...");
                window.location.href = "https://hackerwars.io/internet?view=software";
            } else if (alertText.includes('Software successfully downloaded')) {
                console.log("Software successfully downloaded detected, redirecting to logs page...");
                window.location.href = "https://hackerwars.io/internet?view=logs";
            } else if (alertText.includes('Successfully cracked') && alertText.includes('Password is')) {
                console.log("Cracked message detected, clicking the Login button...");
                const loginButton = document.querySelector('input[type="submit"].btn.btn-inverse[value="Login"]');
                if (loginButton) {
                    loginButton.click();
                } else {
                    console.log("Login button not found.");
                }
            } else if (alertText.includes('This IP is already on your hacked database')) {
                console.log("Error alert detected, clicking the Login button...");
                const loginButton = document.querySelector('input[type="submit"].btn.btn-inverse[value="Login"]');
                if (loginButton) {
                    loginButton.click();
                } else {
                    console.log("Login button not found.");
                }
            } else if (alertText.includes('Software uninstalled') || alertText.includes('Software installed') || alertText.includes('Success! Software deleted. Mission completed!')) {
                console.log("Software alert detected, redirecting to log page...");
                window.location.href = "https://hackerwars.io/internet?view=logs";
            } else if (alertText.includes('Software successfully uploaded')) {
                console.log("Software successfully uploaded detected, redirecting to logs page...");
                window.location.href = "https://hackerwars.io/internet?view=logs";
            }
        }

        const existingAlertSuccess = document.querySelector('.alert.alert-success');
        const existingAlertDanger = document.querySelector('.alert.alert-danger');
        if (existingAlertSuccess) {
            handleAlert(existingAlertSuccess);
            return;
        }
        if (existingAlertDanger) {
            handleAlert(existingAlertDanger);
            return;
        }
        const observer = new MutationObserver((mutations, obs) => {
            const alertSuccess = document.querySelector('.alert.alert-success');
            const alertDanger = document.querySelector('.alert.alert-danger');
            if (alertSuccess) {
                handleAlert(alertSuccess);
                obs.disconnect();
                return;
            }
            if (alertDanger) {
                handleAlert(alertDanger);
                obs.disconnect();
                return;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Check logs, update if needed, and trigger parsing functions
    function checkAndClearLogs() {
        if (!autoClearEnabled) {
            console.log("Auto log clearing is disabled.");
            setStatusMessage("Auto log clearing is disabled.");
            return;
        }
        let logArea = document.querySelector('.logarea');
        if (!logArea) {
            console.log("Log area element not found.");
            setStatusMessage("Looking for logs 👀");
            return;
        }
        let logText = logArea.value || logArea.innerText;
        function clearAndInsert() {
            logArea.value = "";
            logArea.value = customLogMessage;
            setStatusMessage("Log updated with custom message.");
            let editLogBtn = document.querySelector('input[type="submit"][value="Edit log file"]');
            if (editLogBtn) {
                console.log("Clicking the Edit log file button...");
                editLogBtn.click();
            } else {
                console.log("Edit log file button not found.");
            }
        }
        if (window.location.pathname === "/log") {
            // If log area is empty OR already matches the custom message, do nothing
            if (logText.trim() === "" || logText.trim() === customLogMessage.trim()) {
                console.log("Log is empty or already matches the custom message. No action taken.");
                setStatusMessage("Log is empty or up-to-date.");
            } else {
                console.log("On log page, updating log file with custom message...");
                clearAndInsert();
            }
            // Always parse IPs, BTC addresses, and Bank accounts on the log page
            parseAndSaveIPs();
            parseAndSaveBTC();
            parseAndSaveBank();
            return;
        }
        let myIP = getMyIP();
        if (!myIP) {
            console.log("Unable to retrieve IP. Aborting log check.");
            setStatusMessage("IP not found.");
            return;
        }
        console.log("My IP:", myIP);
        if (logText.includes(myIP) && logText.trim() !== "" && logText.trim() !== customLogMessage.trim()) {
            console.log("IP found in logs and log does not match custom message. Updating log file...");
            clearAndInsert();
            listenForAlerts();
        } else {
            console.log("IP not found in logs or log area is empty. No action taken.");
            setStatusMessage("No log entries for IP: " + myIP);
        }
        // Also parse IPs, BTC addresses, and Bank accounts on pages that should be parsed
        if (shouldParse()) {
            parseAndSaveIPs();
            parseAndSaveBTC();
            parseAndSaveBank();
        }
    }

    // Create and append the modal for custom log messages
    function createCustomMessageModal() {
        if (document.getElementById("customModal")) return;
        const modalHTML = `
            <div id="customModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="customModalLabel" aria-hidden="true">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 id="customModalLabel">Insert Custom Log Message</h3>
              </div>
              <div class="modal-body">
                <textarea id="customMessage" class="input-block-level" rows="5" placeholder="Enter your custom log message here..." style="resize: none;">${customLogMessage}</textarea>
              </div>
              <div class="modal-footer">
                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                <button class="btn btn-primary" id="saveCustomMessage">Save changes</button>
              </div>
            </div>
        `;
        let modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        $("#saveCustomMessage").on("click", function() {
            let newMessage = $("#customMessage").val();
            localStorage.setItem("customLogMessage", newMessage);
            customLogMessage = newMessage;
            setStatusMessage("Custom log message saved.");
            $("#customModal").modal("hide");
        });
    }

    // Create and append the modal for setting the refresh interval
    function createRefreshModal() {
        if (document.getElementById("refreshModal")) return;
        const modalHTML = `
            <div id="refreshModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="refreshModalLabel" aria-hidden="true">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 id="refreshModalLabel">Set Auto Refresh Interval</h3>
              </div>
              <div class="modal-body">
                <label for="">Enter seconds (1-60)</label>
                <input id="refreshIntervalInput" type="number" min="1" max="60" placeholder="" value="${autoRefreshInterval}" class="input-block-level">
              </div>
              <div class="modal-footer">
                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                <button class="btn btn-primary" id="saveRefreshInterval">Save changes</button>
              </div>
            </div>
        `;
        let modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        $("#saveRefreshInterval").on("click", function() {
            let newInterval = parseInt($("#refreshIntervalInput").val(), 10);
            if (isNaN(newInterval) || newInterval < 1 || newInterval > 60) {
                alert("Please enter a valid number between 1 and 60.");
            } else {
                autoRefreshInterval = newInterval;
                localStorage.setItem("autoRefreshInterval", autoRefreshInterval);
                let autoRefreshOption = document.getElementById("hw-auto-refresh-toggle");
                if (autoRefreshOption) {
                    autoRefreshOption.textContent = autoRefreshEnabled ? "Auto Refresh: On (" + autoRefreshInterval + "s)" : "Auto Refresh: Off";
                }
                setStatusMessage("Auto Refresh interval set to " + autoRefreshInterval + " seconds.");
                $("#refreshModal").modal("hide");
                if (autoRefreshEnabled) {
                    scheduleAutoRefresh();
                }
            }
        });
    }

    // Create and append the modal for viewing/editing parsed IPs
    function createIPsModal() {
        if (document.getElementById("ipsModal")) return;
        const modalHTML = `
            <div id="ipsModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="ipsModalLabel" aria-hidden="true">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 id="ipsModalLabel">Parsed IP Addresses</h3>
              </div>
              <div class="modal-body">
                <textarea id="ipsList" class="input-block-level" rows="10" placeholder="Parsed IPs will appear here..." style="resize: none;"></textarea>
              </div>
              <div class="modal-footer">
                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                <button class="btn btn-primary" id="saveIPs">Save changes</button>
              </div>
            </div>
        `;
        let modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        $("#saveIPs").on("click", function() {
            let ipsText = $("#ipsList").val();
            let ipArray = ipsText.split("\n").map(ip => ip.trim()).filter(ip => ip !== "");
            savedIPs = ipArray;
            localStorage.setItem("savedIPs", JSON.stringify(savedIPs));
            setStatusMessage("Parsed IPs updated.");
            $("#ipsModal").modal("hide");
        });
    }

    // Create and append the modal for viewing/editing BTC addresses
    function createBTCModal() {
        if (document.getElementById("btcModal")) return;
        const modalHTML = `
            <div id="btcModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="btcModalLabel" aria-hidden="true">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 id="btcModalLabel">Parsed BTC Addresses</h3>
              </div>
              <div class="modal-body">
                <div id="btcListContainer"></div>
              </div>
              <div class="modal-footer">
                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
              </div>
            </div>
        `;
        let modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
    }

    // Render the list of BTC addresses inside the BTC modal
    function renderBTCList() {
        let btcListContainer = document.getElementById("btcListContainer");
        if (!btcListContainer) return;
        let btcData = JSON.parse(localStorage.getItem("savedBTC") || "[]");
        btcListContainer.innerHTML = "";
        if (btcData.length === 0) {
            btcListContainer.innerHTML = "<p>No BTC addresses found.</p>";
            return;
        }
        btcData.forEach((item, index) => {
            let alertDiv = document.createElement("div");
            alertDiv.className = "alert alert-info";
            alertDiv.style.position = "relative";
            alertDiv.style.paddingRight = "35px";
            alertDiv.innerHTML = `<strong>${item.account}</strong><br>${item.key}`;
            let deleteBtn = document.createElement("button");
            deleteBtn.className = "close";
            deleteBtn.innerHTML = "&times;";
            deleteBtn.style.position = "absolute";
            deleteBtn.style.top = "0";
            deleteBtn.style.right = "10px";
            deleteBtn.onclick = function() {
                btcData.splice(index, 1);
                localStorage.setItem("savedBTC", JSON.stringify(btcData));
                renderBTCList();
            };
            alertDiv.appendChild(deleteBtn);
            btcListContainer.appendChild(alertDiv);
        });
    }

    // Create and append the modal for viewing/editing Bank accounts
    function createBankModal() {
        if (document.getElementById("bankModal")) return;
        const modalHTML = `
            <div id="bankModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="bankModalLabel" aria-hidden="true">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 id="bankModalLabel">Parsed Bank Accounts</h3>
              </div>
              <div class="modal-body">
                <div id="bankListContainer"></div>
              </div>
              <div class="modal-footer">
                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
              </div>
            </div>
        `;
        let modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
    }

    // Render the list of Bank accounts inside the Bank modal
    function renderBankList() {
        let bankListContainer = document.getElementById("bankListContainer");
        if (!bankListContainer) return;
        let bankData = JSON.parse(localStorage.getItem("savedBank") || "[]");
        bankListContainer.innerHTML = "";
        if (bankData.length === 0) {
            bankListContainer.innerHTML = "<p>No Bank accounts found.</p>";
            return;
        }
        bankData.forEach((item, index) => {
            let alertDiv = document.createElement("div");
            alertDiv.className = "alert alert-info";
            alertDiv.style.position = "relative";
            alertDiv.style.paddingRight = "35px";
            alertDiv.innerHTML = `<strong>Acc: ${item.account}</strong><br>Bank IP: ${item.bankIP}`;
            let deleteBtn = document.createElement("button");
            deleteBtn.className = "close";
            deleteBtn.innerHTML = "&times;";
            deleteBtn.style.position = "absolute";
            deleteBtn.style.top = "0";
            deleteBtn.style.right = "10px";
            deleteBtn.onclick = function() {
                bankData.splice(index, 1);
                localStorage.setItem("savedBank", JSON.stringify(bankData));
                renderBankList();
            };
            alertDiv.appendChild(deleteBtn);
            bankListContainer.appendChild(alertDiv);
        });
    }

    // Initialize all elements and start processing
    function initScript() {
        createStatusContainer();
        createCustomMessageModal();
        createRefreshModal();
        createIPsModal();
        createBTCModal();
        createBankModal();
        setTimeout(checkAndClearLogs, 500);
        if (shouldParse()) {
            parseAndSaveIPs();
            parseAndSaveBTC();
            parseAndSaveBank();
        }
        listenForAlerts();
        scheduleAutoRefresh();
        if ((window.location.href.includes("view=software") || window.location.href.includes("/internet")) && deleteSoftwareWithRedFontEnabled) {
            setTimeout(deleteSoftwareWithRedFont, 500);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initScript();
    } else {
        document.addEventListener("DOMContentLoaded", initScript);
    }
})();
