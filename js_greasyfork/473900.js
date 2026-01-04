// ==UserScript==
// @name        Search Jail For Reason - torn.com
// @namespace   Phantom Scripts
// @match       https://www.torn.com/jailview.php*
// @version     1.0
// @author      ErrorNullTag
// @description Search jail for specific reasons.
// @grant       GM_xmlhttpRequest
// @license     Mit
// @downloadURL https://update.greasyfork.org/scripts/473900/Search%20Jail%20For%20Reason%20-%20torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/473900/Search%20Jail%20For%20Reason%20-%20torncom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptActive = true;
    let navigationInProgress = false;
    let recordedUsers = [];

    const targetNode = document.querySelector('.user-info-list-wrap');
    const config = { childList: true, subtree: true };

    const callback = function(mutationList, observer) {
        if (!scriptActive) return;

        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                hideNonTargetedUsers();
                navigateToNextPage();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    function hideNonTargetedUsers() {
    let allUsers = document.querySelectorAll(".user-info-list-wrap li");
    for (let user of allUsers) {
        let reasonSpan = user.querySelector(".reason");
        if (reasonSpan) {
            let reasonText = reasonSpan.textContent;
            let userName = user.querySelector(".user.name").textContent.trim();

            // Check if user is already recorded based on their username
            if (!recordedUsers.some(u => u.name === userName)) {
                recordedUsers.push({name: userName, reason: reasonText});
            }

            user.style.display = 'none';
        } else {
            user.style.display = 'none';
        }
    }
}

    function navigateToNextPage() {
        if (navigationInProgress) return;

        navigationInProgress = true;
        const nextPageValue = Number(window.location.hash.replace('#start=', '')) + 50;
        if (nextPageValue <= 600) {
            setTimeout(function() {
                window.location.href = `https://www.torn.com/jailview.php#start=${nextPageValue}`;
                navigationInProgress = false;
            }, 850);
        } else {
            scriptActive = false;
            createMenu();
        }
    }

    function createMenu() {
        // Check if menu box already exists and remove it
        let existingMenu = document.getElementById("jailUsersMenu");
        if (existingMenu) existingMenu.remove();

        let menuBox = document.createElement("div");
        menuBox.id = "jailUsersMenu";
        menuBox.style.position = "fixed";
        menuBox.style.top = "10px";
        menuBox.style.right = "10px";
        menuBox.style.zIndex = 9999;
        menuBox.style.border = "1px solid #ddd";
        menuBox.style.background = "black";
        menuBox.style.padding = "10px";
        menuBox.style.width = "350px";
        menuBox.style.height = "500px";
        menuBox.style.overflowY = "auto";
        menuBox.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
        document.body.appendChild(menuBox);

        // Collapse button
        let collapseButton = document.createElement("button");
        collapseButton.textContent = "Toggle Menu";
        collapseButton.style.position = "absolute";
        collapseButton.style.top = "0";
        collapseButton.style.left = "0";
        collapseButton.style.backgroundColor = "lime";
        collapseButton.onclick = function() {
            menuBox.style.display = menuBox.style.display === "none" ? "block" : "none";
        };
        menuBox.appendChild(collapseButton);

        // Reload button
        let reloadButton = document.createElement("button");
        reloadButton.textContent = "Reload";
        reloadButton.style.position = "absolute";
        reloadButton.style.top = "0";
        reloadButton.style.right = "0";
        reloadButton.style.backgroundColor = "lime";
        reloadButton.onclick = function() {
            window.location.href = "https://www.torn.com/jailview.php#";
            location.reload();
        };
        menuBox.appendChild(reloadButton);

        // Title
        let menuTitle = document.createElement("h3");
        menuTitle.textContent = "Phantom Scripting";
        menuTitle.style.margin = "0";
        menuTitle.style.marginBottom = "10px";
        menuTitle.style.textAlign = "center";
        menuTitle.style.color = "gold";
        menuBox.appendChild(menuTitle);

        // Search Box
        let searchBox = document.createElement("input");
        searchBox.setAttribute("type", "text");
        searchBox.setAttribute("placeholder", "Search users by reason...");
        searchBox.style.width = "100%";
        searchBox.style.padding = "5px";
        searchBox.style.marginBottom = "10px";
        searchBox.addEventListener("input", function() {
            filterUsersByReason(this.value.toLowerCase());
        });
        menuBox.appendChild(searchBox);

        // Display Area for Results
        let resultList = document.createElement("ul");
        menuBox.appendChild(resultList);

        // Copy to Clipboard Button
        let copyButton = document.createElement("button");
        copyButton.textContent = "Copy Results to Clipboard";
        copyButton.onclick = function() {
            let textToCopy = '';
            let currentDisplay = [...resultList.childNodes].map(node => node.textContent.trim()).filter(Boolean);
            textToCopy = currentDisplay.join('\n').replace(/\s+/g, ' ');
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert("Results copied to clipboard!");
            });
        };
        menuBox.appendChild(copyButton);

        // Time left
        let timeLeft = document.querySelector('.countdown').textContent;
        let timeElement = document.createElement("div");
        timeElement.textContent = `Time left: ${timeLeft}`;
        timeElement.style.color = "lime";
        menuBox.appendChild(timeElement);

        function updateDisplayedRecords(records) {
            resultList.innerHTML = ""; // Clear previous records

            // Sorting the records alphabetically based on the name
            records.sort((a, b) => a.name.localeCompare(b.name));

            for (let record of records) {
                let li = document.createElement("li");
                li.style.color = "lime";  // Set color to bright green
                li.textContent = `${record.name} - ${record.reason}`;
                resultList.appendChild(li);
            }
        }

        function filterUsersByReason(query) {
            let filteredUsers = recordedUsers.filter(user => user.reason.toLowerCase().includes(query));
            updateDisplayedRecords(filteredUsers);
        }

        updateDisplayedRecords(removeDuplicates(recordedUsers));
    }

    function removeDuplicates(recordArray) {
        let uniqueUsers = [];
        let uniqueUserNames = new Set();

        for (let user of recordArray.reverse()) {  // reverse to keep the latest record if there are duplicates
            if (!uniqueUserNames.has(user.name)) {
                uniqueUserNames.add(user.name);
                uniqueUsers.push(user);
            }
        }
        return uniqueUsers.reverse();  // reverse back to original order
    }
})();