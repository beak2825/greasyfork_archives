// ==UserScript==
// @name         OC 2.0 Helper
// @namespace    https://www.torn.com/
// @version      0.10.0
// @description  Displays faction members that are not currently participating in a faction crime. Highlights members inactive for days.
// @author       Slaterz [2479416]
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/522296/OC%2020%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/522296/OC%2020%20Helper.meta.js
// ==/UserScript==
console.log("OC2 Helper script loading");
(function () {
  "use strict";

  const TORN_API_BASE_V2 = "https://api.torn.com/v2/";
  const TORN_API_BASE_V1 = "https://api.torn.com/";

  let {
    MEMBERS_ENDPOINT,
    CRIME_RANKS_ENDPOINT,
    PLANNED_CRIMES_ENDPOINT,
    RECRUITING_CRIMES_ENDPOINT,
  } = buildEndpoints();

  function constructEndpoint(base, params) {
    const apiKey = localStorage.getItem("OC2H_API");
    return `${base}?key=${apiKey}&${params}`;
  }

  function buildEndpoints() {
    return {
      MEMBERS_ENDPOINT: constructEndpoint(
        `${TORN_API_BASE_V2}faction/members`,
        "striptags=false"
      ),
      CRIME_RANKS_ENDPOINT: constructEndpoint(
        `${TORN_API_BASE_V1}faction/`,
        "selections=crimeexp"
      ),
      PLANNED_CRIMES_ENDPOINT: constructEndpoint(
        `${TORN_API_BASE_V2}faction/crimes`,
        "cat=planning&offset=0"
      ),
      RECRUITING_CRIMES_ENDPOINT: constructEndpoint(
        `${TORN_API_BASE_V2}faction/crimes`,
        "cat=recruiting&offset=0"
      ),
    };
  }

  async function fetchData(endpoint) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      // Parse the response JSON
      const data = await response.json();

      // Check for API error in the response
      if (data.error) {
        throw new Error(data.error.error); // Extract and throw the API error message
      }

      return data; // Return the valid data
    } catch (error) {
      console.error("Error fetching data from API:", error.message); // Log the error message
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  function populateFactionMembersTable(members, recruitingCrimeMembers) {
    const table = document.getElementById("oc2h-faction-members-table");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; // Clear previous rows

    members.forEach((member) => {
      const row = document.createElement("tr");
      const lastActiveText = member.last_action?.relative || "Unknown";

      // Check if the member is inactive
      if (lastActiveText.includes("day")) {
        row.classList.add("inactive-row"); // Apply class to the entire row
      }

      // Check if the member is in a recruiting crime
      if (recruitingCrimeMembers.has(member.id.toString())) {
        row.classList.add("recruiting-row");
      }

      row.innerHTML = `
      <td class="member-name">${member.name} [${member.id}]</td>
      <td>${member.rank || "Unranked"}</td>
      <td>${lastActiveText}</td>
    `;
      tbody.appendChild(row);
    });

    table.classList.remove("hidden");
  }

  async function fetchAllFactionData() {
    const dataContainer = document.getElementById("oc2h-data-container");
    const errorMessage = document.getElementById("oc2h-error-message");

    try {
      const [membersData, crimeRanks, plannedCrimes, recruitingCrimes] =
        await Promise.all([
          fetchData(MEMBERS_ENDPOINT),
          fetchData(CRIME_RANKS_ENDPOINT),
          fetchData(PLANNED_CRIMES_ENDPOINT),
          fetchData(RECRUITING_CRIMES_ENDPOINT),
        ]);

      if (!membersData || !crimeRanks || !plannedCrimes || !recruitingCrimes) {
        throw new Error("Failed to fetch faction data.");
      }

      const membersObj = membersData.members || {};
      const crimeRanksArray = crimeRanks.crimeexp || {};

      // Create a Set of members already in planned crimes
      const plannedCrimeMembers = new Set();
      plannedCrimes.crimes.forEach((crime) => {
        crime.slots.forEach((slot) => {
          if (slot.user && slot.user.id) {
            plannedCrimeMembers.add(slot.user.id.toString());
          }
        });
      });

      //Create a Set of members in recruiting crimes
      const recruitingCrimeMembers = new Set();
      recruitingCrimes.crimes.forEach((crime) => {
        crime.slots.forEach((slot) => {
          if (slot.user && slot.user.id) {
            recruitingCrimeMembers.add(slot.user.id.toString());
          }
        });
      });

      // Map crime ranks to IDs
      const crimeRankMap = {};
      crimeRanksArray.forEach((id, index) => {
        crimeRankMap[id.toString()] = index + 1;
      });

      // Filter and sort members, and add the rank property
      const sortedMembers = Object.values(membersObj)
        .filter((member) => !plannedCrimeMembers.has(member.id.toString())) // Exclude planned members
        .map((member) => ({
          ...member,
          rank: crimeRankMap[member.id.toString()] || "Unranked", // Map the rank
        }))
        .sort((a, b) => {
          const rankA = crimeRankMap[a.id.toString()] || Infinity;
          const rankB = crimeRankMap[b.id.toString()] || Infinity;
          return rankA - rankB;
        });

      if (sortedMembers.length === 0) {
        throw new Error("No valid faction members found.");
      }

      // Populate table and show the data container
      populateFactionMembersTable(sortedMembers, recruitingCrimeMembers);
      dataContainer.classList.remove("hidden");
      errorMessage.classList.add("hidden");
    } catch (error) {
      // Display detailed error message
      console.error("Error fetching faction data:", error.message);
      errorMessage.textContent =
        error.message || "An unexpected error occurred.";
      errorMessage.classList.remove("hidden");
      dataContainer.classList.add("hidden");
    }
  }

  let uiInitialized = false; // Flag to track if the UI has been created

  // Function to create and insert the OC2 Helper UI.
  function createOC2HelperUI() {
    const factionCrimesElement = document.getElementById("faction-crimes");

    if (!factionCrimesElement) {
      return; // Do nothing if the target element doesn't exist
    }

    if (document.getElementById("oc2h-helper-container")) {
      return; // Skip if the UI already exists
    }

    const factionCrimesWrap = factionCrimesElement.querySelector(
      ".faction-crimes-wrap"
    );

    if (!factionCrimesWrap) {
      return; // Do nothing if the reference element doesn't exist
    }

    // Create the OC2 Helper container
    const oc2HelperContainer = document.createElement("div");
    oc2HelperContainer.id = "oc2h-helper-container";
    oc2HelperContainer.className = "oc2h-container";
    oc2HelperContainer.innerHTML = `
    <div class="oc2h-header">
      <div class="oc2h-title">OC 2.0 Helper</div>
      <div id="oc2h-api-key-wrapper" class="oc2h-api-key-wrapper">
        <div id="oc2h-api-key-form" class="oc2h-api-key-form hidden">
          <input
            type="text"
            id="oc2h-api-key-input"
            class="oc2h-api-key-input"
            placeholder="Enter Limited API key"
          />
          <button id="oc2h-api-key-submit" class="torn-btn oc2h-api-key-submit">Submit</button>
        </div>
        <button id="oc2h-set-api-key-btn" class="torn-btn oc2h-set-api-key-btn">Set API Key</button>
      </div>
    </div>
    <div id="oc2h-data-container" class="oc2h-data-container hidden">
      <div class="oc2h-table-title">Members not in Planning OC</div>
      <table id="oc2h-faction-members-table" class="oc2h-table hidden">
        <thead>
          <tr>
            <th>Member</th>
            <th>Rank</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          <!-- Faction members will be populated here -->
        </tbody>
      </table>
    </div>
    <div id="oc2h-error-message" class="oc2h-error-message hidden">
      <!-- Error messages will be displayed here -->
    </div>
  `;

    factionCrimesElement.insertBefore(oc2HelperContainer, factionCrimesWrap);

    // Add event listeners for the API key form and fetch button
    initializeApiKeyForm();

    // Automatically fetch data
    fetchAllFactionData();
  }

  function initializeApiKeyForm() {
    const setApiKeyBtn = document.getElementById("oc2h-set-api-key-btn");
    setApiKeyBtn.addEventListener("click", () => {
      const form = document.getElementById("oc2h-api-key-form");
      form.classList.remove("hidden"); // Show the input box and submit button
    });

    const submitBtn = document.getElementById("oc2h-api-key-submit");
    submitBtn.addEventListener("click", async () => {
      const input = document.getElementById("oc2h-api-key-input");
      const newKey = input.value.trim();
      console.log("New API Key entered:", newKey); // Log for debugging
      if (newKey) {
        localStorage.setItem("OC2H_API", newKey); // Directly store the key in localStorage
        alert("API Key has been set!");
        input.value = ""; // Clear the input field
        const form = document.getElementById("oc2h-api-key-form");
        form.classList.add("hidden"); // Hide the input box and submit button
        console.log("API Key successfully updated in localStorage.");
        // Rebuild the endpoints with the new API key
        ({ MEMBERS_ENDPOINT, CRIME_RANKS_ENDPOINT, PLANNED_CRIMES_ENDPOINT } =
          buildEndpoints());
        console.log("Endpoints rebuilt with new API key.");

        // Trigger fetching data
        await fetchAllFactionData();
      } else {
        alert("Please enter a valid API key.");
      }
    });
  }

  // Function to observe DOM changes and reinitialize UI
  function observeCrimesTab() {
    const observer = new MutationObserver(() => {
      const factionCrimesElement = document.getElementById("faction-crimes");

      if (factionCrimesElement) {
        createOC2HelperUI();
      } else {
        uiInitialized = false; // Reset the flag when the element is removed
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Add global styles
  function addGlobalStyle(css) {
    const head = document.getElementsByTagName("head")[0];
    if (!head) return;

    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    head.appendChild(style);
  }

  addGlobalStyle(`
    .oc2h-container {
        background: var(--default-bg-panel-color);
        padding: 15px;
        margin: 15px 0;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }
    .oc2h-header {
        display: flex;
        justify-content: space-between;
        align-items: center; /* Ensures vertical alignment */
        margin-bottom: 10px;
    }
    .oc2h-title {
        font-size: 2.5em;
        font-weight: bold;
        margin: 0; /* Remove margin to align with the header */
        color: var(--text-color);
    }
    .oc2h-table-title {
        font-size: 2.0em;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 10px;
        color: var(--text-color);
    }
    .oc2h-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        font-size: 1.1em;
        background-color: var(--default-bg-panel-color);
    }
    .oc2h-table thead th {
        background: var(--btn-background);
        color: var(--btn-color);
        text-align: left;
        padding: 12px;
        border-bottom: 2px solid var(--border-color);
        text-transform: uppercase;
        font-size: 1.2em;
        font-weight: bold;
    }
    .oc2h-table tbody td {
        padding: 10px;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-color);
    }
    .oc2h-table tbody tr td {
      padding: 2px 10px;
    }
    .oc2h-table tbody tr:hover {
        background-color: var(--btn-hover-background);
    }
    .oc2h-table tbody tr:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.05); /* Subtle striped rows for readability */
    }
    .oc2h-table tbody tr.inactive-member {
        background-color: rgba(255, 0, 0, 0.1); /* Highlight inactive members */
    }
    .oc2h-table td.member-name {
        font-weight: bold;
        color: var(--text-color);
    }
    .oc2h-api-key-wrapper {
        display: flex;
        align-items: center;
        gap: 10px; /* Add spacing between the elements */
    }
    .oc2h-api-key-form.hidden {
        display: none; /* Hides the API key form */
    }
    .oc2h-api-key-form {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .oc2h-api-key-input {
        padding: 5px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.9em;
    }
    .oc2h-api-key-submit {
        padding: 5px 10px;
        background: var(--btn-background);
        color: var(--btn-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .oc2h-api-key-submit:hover {
        background: var(--btn-hover-background);
    }
    .oc2h-set-api-key-btn {
        background: var(--btn-background);
        color: var(--btn-color);
        border: 1px solid var(--btn-border-color);
        padding: 5px 10px;
        font-size: 0.9em;
        cursor: pointer;
        border-radius: 4px;
    }
    .oc2h-set-api-key-btn:hover {
        background: var(--btn-hover-background);
    }
    .oc2h-data-container.hidden {
        display: none;
    }
    .oc2h-error-message {
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: var(--oc-level-color-text-hard);
        font-weight: bold;
        border-radius: 5px;
    }
    .oc2h-error-message.hidden {
        display: none;
    }
    .oc2h-table tbody tr.inactive-row {
        color: var(--oc-level-color-text-hard);
        font-weight: bold;
    }
    .oc2h-table tbody tr.recruiting-row {
        color: var(--oc-slot-menu-text);
        font-weight: bold;
    }
  `);

  // Initialize the script
  function waitForDOMReady() {
    const interval = setInterval(() => {
      if (document.body) {
        clearInterval(interval);
        observeCrimesTab();
        createOC2HelperUI();
      }
    }, 100);
  }

  waitForDOMReady();
})();