// ==UserScript==
// @name         Torn Player Tracker
// @namespace    https://www.torn.com/
// @version      2.0
// @description  Track player status, hospital time, and attack links in Torn with persistent data, enhanced UI. Adds players by user ID.
// @author       Xenocide [2216313]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/524544/Torn%20Player%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/524544/Torn%20Player%20Tracker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // === Configuration ===
  const UPDATE_INTERVAL = 30000; // Update interval in milliseconds (30 seconds)

  // Retrieve API key from localStorage or prompt user to enter it
  let API_KEY = localStorage.getItem("tornAPIKey");

  // If API key is not found, prompt the user to input it
  if (!API_KEY) {
    const apiKeyInputSection = document.createElement("div");
    apiKeyInputSection.innerHTML = `
      <div id="apiKeySection" style="position: fixed; top: 10px; right: 10px; background-color: #333; color: white; padding: 10px; border-radius: 8px; z-index: 10001; font-family: Arial, sans-serif;">
        <h3>Enter Your Torn API Key</h3>
        <input type="text" id="apiKeyInput" placeholder="API Key" style="width: 100%; padding: 5px; margin-bottom: 5px;" />
        <button id="saveAPIKeyButton" style="width: 100%; padding: 5px; background-color: green; color: white;">Save API Key</button>
        <small style="color: yellow;">You need an API key to fetch player data.</small>
      </div>
    `;
    document.body.appendChild(apiKeyInputSection);

    // Save API key when the user submits it
    document.getElementById("saveAPIKeyButton").addEventListener("click", () => {
      API_KEY = document.getElementById("apiKeyInput").value.trim();
      if (API_KEY) {
        localStorage.setItem("tornAPIKey", API_KEY); // Save to localStorage
        document.getElementById("apiKeySection").style.display = "none"; // Hide the input form
        alert("API Key saved successfully!"); // Provide feedback to the user
      } else {
        alert("Please enter a valid API Key.");
      }
    });
  }

  // If API key is already stored, proceed with the script as usual
  if (API_KEY) {
    // Retrieve tracked players from localStorage or initialize default IDs
    let trackedPlayers = JSON.parse(localStorage.getItem("trackedPlayers")) || [123456, 654321, 789012];

    // === Create the Floating Box ===
    const box = document.createElement("div");
    box.id = "statusTracker";
    box.innerHTML = `
      <h3>Player Tracker</h3>
      <ul id="statusList">Loading...</ul>
      <div id="userControls">
        <hr>
        <input type="text" id="addPlayerInput" placeholder="Add Player ID" />
        <button id="addPlayerButton">Add</button>
        <ul id="trackedPlayersList"></ul>
      </div>
      <button id="toggleUI">Hide Add Section</button>
    `;
    document.body.appendChild(box);

    // Add some styles for the box
    GM_addStyle(`
      #statusTracker {
        position: fixed;
        top: 10px;
        right: 10px;
        width: 350px;
        background-color: #333;
        color: white;
        border: 2px solid #555;
        border-radius: 8px;
        padding: 10px;
        z-index: 10000;
        font-family: Arial, sans-serif;
      }
      #statusTracker h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
        text-align: center;
      }
      #statusTracker ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      #statusTracker li {
        margin: 5px 0;
      }
      #statusTracker li span {
        font-weight: bold;
      }
      #statusTracker input {
        width: calc(100% - 60px);
        margin-right: 5px;
        padding: 5px;
      }
      #statusTracker button {
        padding: 5px;
        cursor: pointer;
      }
      #statusTracker hr {
        margin: 10px 0;
        border: 0.5px solid #555;
      }
    `);

    // === Function to Format Time in Minutes and Seconds ===
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }

    // === Function to Fetch Player Info by ID ===
    function fetchPlayerStatus(playerId) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: `https://api.torn.com/user/${playerId}?selections=basic,profile&key=${API_KEY}`,
          onload: (response) => {
            if (response.status === 200) {
              const data = JSON.parse(response.responseText);

              // Check for API errors
              if (data.error) {
                console.error(`Error fetching player ${playerId}:`, data.error);
                return resolve({
                  playerId,
                  name: `Error: ${data.error.error}`,
                  status: "Unknown",
                  hospitalTimeLeft: 0,
                  attackLink: "",
                  lastActivity: "N/A",
                });
              }

              // Extract data from API response
              const name = data.name || `ID ${playerId}`;
              const status = data.status?.state || "Unknown";
              const hospitalTimeLeft = data.status?.until ? Math.max(0, Math.ceil((data.status.until * 1000 - Date.now()) / 1000)) : 0;
              const attackLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${playerId}`;
              const lastActivity = data.last_action?.relative || "N/A";

              resolve({ playerId, name, status, hospitalTimeLeft, attackLink, lastActivity });
            } else {
              console.error(`Error fetching status for player ${playerId}:`, response.status);
              reject(`Error fetching status for player ${playerId}`);
            }
          },
          onerror: (error) => {
            console.error(`Error fetching status for player ${playerId}:`, error);
            reject(`Error fetching status for player ${playerId}`);
          },
        });
      });
    }

    // === Function to Update the Status List ===
    async function updateStatusList() {
      const statusList = document.getElementById("statusList");
      statusList.innerHTML = "Updating...";

      try {
        const statusPromises = trackedPlayers.map((id) => fetchPlayerStatus(id));
        const statuses = await Promise.all(statusPromises);

        statusList.innerHTML = "";
        statuses.forEach(({ playerId, name, status, hospitalTimeLeft, attackLink, lastActivity }) => {
          const color =
            status === "Okay"
              ? "green"
              : status === "Hospital"
              ? "red"
              : status === "Traveling"
              ? "blue"
              : "gray";

          const hospitalText = status === "Hospital" ? ` (Time left: ${formatTime(hospitalTimeLeft)})` : "";
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <span style="color: ${color};">${status}</span> - 
            <a href="${attackLink}" target="_blank" style="color: yellow;">${name}</a> 
            (ID: ${playerId})${hospitalText} <br>
            <small>Last Activity: ${lastActivity}</small>`;
          statusList.appendChild(listItem);
        });
      } catch (error) {
        console.error("Error updating statuses:", error);
        statusList.innerHTML = "Error updating statuses.";
      }
    }

    // === Function to Update Tracked Players List ===
    function updateTrackedPlayersList() {
      const trackedPlayersList = document.getElementById("trackedPlayersList");
      trackedPlayersList.innerHTML = "";
      trackedPlayers.forEach((playerId) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `Player ID: ${playerId} <button data-id="${playerId}" class="removePlayerButton">Remove</button>`;
        trackedPlayersList.appendChild(listItem);
      });

      // Add event listeners to remove buttons
      document.querySelectorAll(".removePlayerButton").forEach((button) => {
        button.addEventListener("click", (event) => {
          const playerId = parseInt(event.target.getAttribute("data-id"));
          trackedPlayers = trackedPlayers.filter((id) => id !== playerId);
          localStorage.setItem("trackedPlayers", JSON.stringify(trackedPlayers)); // Save to localStorage
          updateTrackedPlayersList();
          updateStatusList();
        });
      });
    }

    // === Add Player by ID from Input ===
    document.getElementById("addPlayerButton").addEventListener("click", () => {
      const input = document.getElementById("addPlayerInput");
      const playerId = parseInt(input.value);

      if (!isNaN(playerId) && !trackedPlayers.includes(playerId)) {
        trackedPlayers.push(playerId);
        localStorage.setItem("trackedPlayers", JSON.stringify(trackedPlayers)); // Save to localStorage
        input.value = "";
        updateTrackedPlayersList();
        updateStatusList();
      } else if (isNaN(playerId)) {
        alert("Please enter a valid player ID.");
      } else {
        alert("This player is already tracked.");
      }
    });

    // === Hide/Show Add Section ===
    const toggleUI = document.getElementById("toggleUI");
    const userControls = document.getElementById("userControls");

    // Retrieve the saved state of the visibility (default is "shown")
    const isHidden = localStorage.getItem("isUserControlsHidden") === "true";

    // If hidden, hide the controls
    if (isHidden) {
      userControls.style.display = "none";
      toggleUI.innerText = "Show Add Section";
    } else {
      toggleUI.innerText = "Hide Add Section";
    }

    toggleUI.addEventListener("click", () => {
      const isCurrentlyHidden = userControls.style.display === "none";
      if (isCurrentlyHidden) {
        userControls.style.display = "block";
        localStorage.setItem("isUserControlsHidden", "false"); // Store the state
        toggleUI.innerText = "Hide Add Section";
      } else {
        userControls.style.display = "none";
        localStorage.setItem("isUserControlsHidden", "true"); // Store the state
        toggleUI.innerText = "Show Add Section";
      }
    });

    // === Periodic Updates ===
    setInterval(updateStatusList, UPDATE_INTERVAL);
    updateStatusList(); // Initial update
    updateTrackedPlayersList(); // Initial list update
  }
})();
