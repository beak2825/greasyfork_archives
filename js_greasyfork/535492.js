// ==UserScript==
// @name         Faction Warring, Player Status
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Track faction members status
// @author       
// @license      Personal use
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/535492/Faction%20Warring%2C%20Player%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/535492/Faction%20Warring%2C%20Player%20Status.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let isSidebarVisible = false; // Boolean to track the sidebar visibility
    let highlightInput
 
    // Function to create sidebar
    function createSidebar() {
        let sidebar = document.createElement("div");
    sidebar.id = "factionSidebar";
    sidebar.style.position = "fixed";
    sidebar.style.top = "50px";
    sidebar.style.right = "0";
    sidebar.style.width = "370px";
    sidebar.style.background = "#222"; // Dark sidebar background
    sidebar.style.color = "#ccc"; // Light gray text color
    sidebar.style.padding = "10px";
    sidebar.style.border = "1px solid #444";
    sidebar.style.zIndex = "1000";
    sidebar.style.overflowY = "auto";
    sidebar.style.maxHeight = "500px";
    sidebar.style.transition = "transform 0.3s ease-in-out"; // Sidebar transition
    sidebar.style.transform = "translateX(100%)"; // Initially hidden off-screen
 
        let factionIDinputRow = document.createElement("div");
        factionIDinputRow.style.display = "flex";
        factionIDinputRow.style.alignItems = "left"; // Align label and input on the same row
        factionIDinputRow.style.marginBottom = "10px"; // Space between this row and the next element
 
            // Faction ID input Header (always 'Faction ID:')
        let factionIDheader = document.createElement("IDheader");
        factionIDheader.innerText = "Faction ID:";
        factionIDheader.style.marginRight = "10px"; // Space between label and input
        factionIDinputRow.appendChild(factionIDheader);
 
        let factionInput = document.createElement("input");
        factionInput.type = "text";
        factionInput.style.width = "100px";
        factionInput.value = GM_getValue("factionID", "");
        factionInput.onchange = () => GM_setValue("factionID", factionInput.value);
        factionIDinputRow.appendChild(factionInput);
 
         sidebar.appendChild(factionIDinputRow); // Add the row to the sidebar
 
        // Player highlight input
        let highlightLabel = document.createElement("playerlabel");
        highlightLabel.innerText = "Player IDs (ID:color):";
        highlightLabel.style.display = "block";
        highlightLabel.style.marginTop = "10px";
        sidebar.appendChild(highlightLabel);
 
        highlightInput = document.createElement("textarea");
        highlightInput.style.width = "100%";
        highlightInput.style.height = "60px";
        highlightInput.value = GM_getValue("highlightIDs", "");
        highlightInput.onchange = () => GM_setValue("highlightIDs", highlightInput.value);
        sidebar.appendChild(highlightInput);
 
        // Update Button
        let updateButton = document.createElement("button");
        updateButton.innerText = "Update";
        updateButton.style.width = "100%";
        updateButton.style.marginTop = "10px";
        updateButton.style.color = "white";
        updateButton.style.border = "2px solid white";
        updateButton.onclick = fetchData;
        sidebar.appendChild(updateButton);
 
            // Faction Data - Tag/Name/ID
        let factionLabel = document.createElement("factionlabel");
        factionLabel.style.display = "block";
        factionLabel.style.marginBottom = "5px";
        factionLabel.style.marginTop = "10px"
 
        // Check if faction name and tag are stored, if yes, change the label
        let storedFactionName = GM_getValue("factionName", "");
        let storedFactionTag = GM_getValue("factionTag", "");
        let storedFactionID = GM_getValue("factionID", "");
 
        if (storedFactionName && storedFactionTag) {
            // Change factionLabel to show stored faction tag, name and ID in brackets
            factionLabel.innerHTML = `
            <strong> Faction - ${storedFactionName} [${storedFactionID}]</strong>
        `;
    } else {
        // If no faction data is stored, set the default "Faction ID" label
        factionLabel.innerText = "Faction ID:";
    }
 
        sidebar.appendChild(factionLabel);
 
        // Table container
        let tableContainer = document.createElement("div");
        tableContainer.id = "tableContainer";
        tableContainer.style.marginTop = "10px"; // Adjusted for better spacing in the sidebar
        sidebar.appendChild(tableContainer);
 
        document.body.appendChild(sidebar);
 
        // Add "by ]" at the bottom
        let footer = document.createElement("div");
        footer.innerText = "by noOne";
        footer.style.fontSize = "10px";
        footer.style.color = "#999"; // Light gray color
        footer.style.marginTop = "8px"; // Push it to the bottom of the sidebar
        footer.style.textAlign = "right"; // Center align the text
        sidebar.appendChild(footer);
 
        // Create the smaller expandable button (⚔️)
        const toggleButton = document.createElement('div');
        toggleButton.id = 'sidebarToggle';
        toggleButton.innerHTML = '⚔️';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '50px';
        toggleButton.style.right = '0';
        toggleButton.style.width = '40px';
        toggleButton.style.height = '40px';
        toggleButton.style.background = 'black';
        toggleButton.style.color = 'white';
        toggleButton.style.textAlign = 'center';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '1001';
        toggleButton.style.display = 'flex';
        toggleButton.style.justifyContent = 'center';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.fontSize = '20px'; // Size of crossed swords
        toggleButton.style.borderRadius = '5px';
 
        // Toggle the sidebar visibility and update the button's appearance
        toggleButton.onclick = () => {
            isSidebarVisible = !isSidebarVisible; // Toggle the boolean value
            if (isSidebarVisible) {
                sidebar.style.transform = 'translateX(0)'; // Show sidebar
                toggleButton.innerHTML = '❌ Close'; // Change button text to reflect the state
                toggleButton.style.width = '60px';
                toggleButton.style.height = '20px';
                toggleButton.style.fontSize = '10px'
            } else {
                sidebar.style.transform = 'translateX(100%)'; // Hide sidebar
                toggleButton.innerHTML = '⚔️'; // Change button text to reflect the state
                 toggleButton.style.width = '40px';
                toggleButton.style.height = '40px';
                toggleButton.style.fontSize = '18px';
            }
        };
        document.body.appendChild(toggleButton);
 
        let factionID = GM_getValue("factionID", "");
        let apiKey = GM_getValue("apiKey", "");
        if (factionID && apiKey) {
        fetchData(); // Auto-fetch if credentials exist
}
    }
 
    // Function to fetch data from API
    async function fetchData() {
        let factionID = GM_getValue("factionID", "");
        let apiKey = GM_getValue("apiKey", ""); // Load the stored API key
 
        if (!apiKey) {
            // Prompt for API key if not stored
            apiKey = prompt("Enter API Key:", "");
            if (!apiKey) return; // Exit if no API key is entered
            GM_setValue("apiKey", apiKey); // Store the entered API key
        }
 
        if (!factionID) {
            alert("Faction ID is required.");
            return;
        }
 
        let url = `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`;
        let response = await fetch(url);
        let data = await response.json();
 
        var factionName = data.name;
        GM_setValue("factionName", factionName);
        var factionTag = data.tag;
        GM_setValue("factionTag", factionTag)
 
        if (!data.members) {
            alert("Invalid data received");
            return;
        }
        updateSidebar();
        renderTable(data.members);
    }
 
    // Function to update the sidebar with faction name, tag, and ID
function updateSidebar() {
    let factionLabel = document.querySelector("factionlabel"); // Get the label from sidebar
 
    // Check if faction name, tag, and ID are stored
    let storedFactionName = GM_getValue("factionName", "");
    let storedFactionID = GM_getValue("factionID", "");
 
    // If data is stored, update the faction label
    if (storedFactionName && storedFactionID) {
        factionLabel.innerHTML = `
            <strong> Faction - ${storedFactionName} [${storedFactionID}]</strong>
        `;
    } else {
        // If no faction data is stored, display default "Faction ID" label
        factionLabel.innerText = "Faction ID:";
    }
}
 
    // Function to render table
    function renderTable(members) {
        let highlightData = GM_getValue("highlightIDs", "").split("\n").reduce((acc, line) => {
            let [key, color] = line.split(":");
            if (key && color) acc[key.trim().toLowerCase()] = color.trim();
            return acc;
        }, {});
 
 
    // First, sort by state (Okay > Hospital = Jail > Abroad > Traveling > Fallen)
        let sortedMembers = Object.entries(members).map(([id, member]) => {
        let hospTime = member.status.state === "Hospital" ? member.status.until - Math.floor(Date.now() / 1000) : 0;
        let jailTime = member.status.state === "Jail" ? member.status.until - Math.floor(Date.now() / 1000) : 0;
 
    return { id, ...member, hospTime, jailTime };
        }).sort((a, b) => {
 
        const statusOrder = {
        "Okay": 1,
        "Hospital": 2,
        "Jail": 2, // Now Jail has the same priority as Hospital
        "Abroad": 4,
        "Traveling": 5,
        "Fallen": 6
    };
    const stateComparison = statusOrder[a.status.state] - statusOrder[b.status.state];
 
    // If both are in Hospital or Jail, sort by their respective times
    if (stateComparison === 0) {
        if (a.status.state === "Hospital") {
            return a.hospTime - b.hospTime; // Sort by hospital time ascending
        }
        if (a.status.state === "Jail") {
            return a.jailTime - b.jailTime; // Sort by jail time ascending
        }
    }
 
    // Otherwise, return the state comparison result
    return stateComparison;
});
 
        let tableHTML = `<table style='width: 100%; border-collapse: collapse; background: ${getTableBackgroundColor()}; color: ${getTextColor()}; font-size: 16px;'>\n
            <thead>\n
                <tr style='background: ${getTableHeaderColor()}; color: ${getHeaderTextColor()};'>\n
                    <th>For BSP</th><th>Name & Status</th><th>Level</th><th>State</th><th>AtK Link</th>\n
                </tr>\n
            </thead>\n
            <tbody>`;
 
sortedMembers.forEach((member, index) => {
    let bgColor = highlightData[member.id] || highlightData[member.name.toLowerCase()] || "transparent";
    let attackLink = `<a href='https://www.torn.com/loader.php?sid=attack&user2ID=${member.id}' target='_blank' style='color: #ff4747;'>Attack</a>`;
 
    // Format hospital time if available, otherwise show status (Abroad, Traveling)
    let timeLeft = '';
    if (member.status.state === "Hospital" && member.hospTime > 0) {
        timeLeft = `${formatTime(member.hospTime)}`;
    } else if (member.status.state === "Jail" && member.jailTime > 0) {
        timeLeft = `Jail ${formatTime(member.jailTime)}`;
    } else {
        timeLeft = member.status.state; // Show state if not in Hospital or Jail
    }
 
// Detect if TDup_ColoredStatsInjectionDiv exists anywhere on the page
const statsElementExists = document.querySelector('.TDup_ColoredStatsInjectionDiv') !== null;
 
// Choose alignment based on presence of TDup stats
const textAlignStyle = statsElementExists ? "right" : "left";
 
    tableHTML += `<tr style='background: ${bgColor}; border: 1px solid #555;'>\n
          <td style="text-align:center"> <a rel="noopener noreferrer" class="linkWrap___ZS6r9 flexCenter___bV1QP" "<div class="title-black top-round"
                href="/profiles.php?XID=${member.id}" i-data="i_${index}">
                <span class="honorName___JWG9U">  🔗</td>
        <td><span class="player-name-clickable" data-name="${member.name}">${member.name}</span></span> </a>   <span style="font-size: 12px; color: ${getLastActionColor(member.last_action)};">
        ${getLastActionText(member.last_action)} </span></td>
 
        <td>${member.level}</td>\n
        <td>
    <span class="live-timer" data-seconds="${member.hospTime || member.jailTime || 0}">
        ${timeLeft}
    </span>
</td>
        <td>${attackLink}</td>\n
    </tr>`;
 
    // Build the table row HTML
 
});
 
        tableHTML += "</tbody></table>";
 
        let tableContainer = document.getElementById("tableContainer");
        tableContainer.innerHTML = tableHTML;
 
        // Store last updated data
        const rawData = sortedMembers.map(m => ({
            id: m.id,
            name: m.name,
            status: m.status.state,
            timeLeft: (m.hospTime || m.jailTime || 0),
            level: m.level
        }));
        GM_setValue("lastMemberData", JSON.stringify(rawData));;
        initLiveTimers();
    }
 
    function getLastActionColor(action) {
    if (!action || !action.status) return "red";
    if (action.status === "Online") return "green";
    if (action.status === "Idle") return "orange";
    return "red";
}
 
function getLastActionText(action) {
    if (!action || !action.status || !action.timestamp) return "";
 
    const now = Math.floor(Date.now() / 1000);
    const diff = now - action.timestamp;
 
    if (action.status === "Online") return "🟢 On";
    if (action.status === "Idle") return `🟧 AFK${formatShortTime(diff)}`;
    return ` 🔴 Off ${formatShortTime(diff)}`;
}
 
function formatShortTime(seconds) {
    const mins = Math.floor(seconds / 60);
 
    if (mins < 60) return `${mins}m`;// Up to 59 minutes
    if (mins < 90) return `1h`;// 60–89 mins → 1h
    if (mins < 1440) return `${Math.round(mins / 60)}h`; // 90 mins–23h59m
 
    const days = Math.floor(mins / 1440);
    return `${days}d`; // 1d+ if over 24h
}
 
    // Helper function to format time in seconds into hh:mm:ss
    function formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
    }
 
    // Function to return background color based on mode
    function getTableBackgroundColor() {
        return document.body.classList.contains("torn-dark") ? "#333" : "#fff"; // Dark table for dark mode, white for light mode
    }
 
    // Function to return text color based on mode
    function getTextColor() {
        return document.body.classList.contains("torn-dark") ? "#ccc" : "#333"; // Light text for dark mode, dark text for light mode
    }
 
    // Function to return header background color based on mode
    function getTableHeaderColor() {
        return document.body.classList.contains("torn-dark") ? "#222" : "#333"; // Dark header for dark mode, dark gray for light mode
    }
 
    // Function to return header text color based on mode
    function getHeaderTextColor() {
        return "#fff"; // Always white for headers
    }
 
    createSidebar();
document.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("player-name-clickable")) {
    const name = target.dataset.name;
    navigator.clipboard.writeText(name).then(() => {
      console.log(`Copied to clipboard: ${name}`);
    });
  }
});
 
    document.addEventListener("dblclick", (e) => {
        const target = e.target;
        if (target.classList.contains("player-name-clickable")) {
            const name = target.dataset.name;
            const lines = highlightInput.value.split("\n");
            const newLine = `${name}:`;
            if (!lines.includes(newLine)) {
                lines.push(newLine);
            }
            highlightInput.value = lines.join("\n").trim();
            highlightInput.dispatchEvent(new Event("change")); // trigger save
        }
    });
 
})();
 
function initLiveTimers() {
    const timers = document.querySelectorAll(".live-timer");
    timers.forEach(span => {
        let seconds = parseInt(span.getAttribute("data-seconds"), 10);
        const update = () => {
            if (seconds <= 0) {
                span.textContent = "Okay";
                return;
            }
            span.textContent = formatTime(seconds--);
        };
        update();
        setInterval(update, 1000);
    });
}
 
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
 
// Clipboard + highlightInput logic
document.addEventListener('DOMContentLoaded', () => {
  const highlightInput = document.querySelector('#highlightInput');
 
  document.addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('player-name-clickable')) {
      const name = target.dataset.name;
 
      // Single-click = copy to clipboard
      navigator.clipboard.writeText(name);
    }
  });
 
  document.addEventListener('dblclick', function (e) {
    const target = e.target;
    if (target.classList.contains('player-name-clickable')) {
      const name = target.dataset.name;
 
      if (highlightInput) {
        const lines = highlightInput.value.split('\n');
        const newLine = `${name}:`;
 
        if (!lines.includes(newLine)) {
          lines.push(newLine);
        }
 
        highlightInput.value = lines.join('\n').trim();
      }
    }
  });
});