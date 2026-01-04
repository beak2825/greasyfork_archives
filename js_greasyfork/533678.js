// ==UserScript==
// @name         Torn Faction Lookup API Caller
// @license      MIT 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fetches faction data using the Torn API when on a faction profile page.
// @author       Tinkt [3169756]
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/533678/Torn%20Faction%20Lookup%20API%20Caller.user.js
// @updateURL https://update.greasyfork.org/scripts/533678/Torn%20Faction%20Lookup%20API%20Caller.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Configuratoin data for the script. You will be prompted to enter an API key if you have not yet.
   */
  const API_KEY_STORAGE_KEY = null;
  const REFRESH_FREQUENCY_IN_SECONDS = 10;
  const ERRORS = {
    KEY_REQUIRED:
      "API key is required. The script will not function without it.",
    FETCH_ERROR: "Error fetching Torn data. Check console for details.",
    NETWORK_ERROR:
      "Network error while fetching faction data. Check console for details.",
    NO_FACTION_ID:
      "Not on a faction profile page, or could not extract faction ID.",
  };

  /**
   * Torn specific data.
   */
  const USER_STATUSES = {
    OKAY: "Okay",
    ABROAD: "Abroad",
    HOSPITAL: "Hospital",
    TRAVELING: "Traveling",
  };
  const LOCATIONS = {
    TORN: "Torn",
    ARGENTINA: "Argentina",
    CANADA: "Canada",
    CHINA: "China",
    CAYMAN_ISLANDS: "Cayman Islands",
    JAPAN: "Japan",
    MEXICO: "Mexico",
    SWITZERLAND: "Switzerland",
    UAE: "United Arab Emirates",
    UK: "United Kingdom",
    SOUTH_AFRICA: "South Africa",
  };

  let my_location = null;
  let apiKey = GM_getValue(API_KEY_STORAGE_KEY, null);

  if (!apiKey) {
    apiKey = prompt(
      "Please enter your Torn API key, any level of key will work:"
    );
    if (apiKey) {
      GM_setValue(API_KEY_STORAGE_KEY, apiKey);
    } else {
      alert(ERRORS.KEY_REQUIRED);
      return; // Exit if no API key is provided.
    }
  }

  // Function to extract the faction ID from the URL
  function getFactionId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ID");
  }

  function secondsToMilliseconds(seconds) {
    return seconds * 1000;
  }

  // Function to fetch data from the Torn API
  function fetchFactionData(factionId, apiKey) {
    const apiUrl = `https://api.torn.com/faction/${factionId}?selections=basic&key=${apiKey}`;

    GM_xmlhttpRequest({
      method: "GET",
      url: apiUrl,
      onload: function (response) {
        if (response.status === 200) {
          const data = JSON.parse(response.responseText);
          updatePlayerStatuses(data.members);
        } else {
          console.error(
            "Torn API Error:",
            response.status,
            response.responseText
          );
          alert(ERRORS.FETCH_ERROR);
        }
      },
      onerror: function (error) {
        console.error("GM_xmlhttpRequest Error:", error);
        alert(ERRORS.NETWORK_ERROR);
      },
    });
  }

  function fetchUserData(apiKey) {
    const apiUrl = `https://api.torn.com/user/?selections=profile&key=${apiKey}`;

    GM_xmlhttpRequest({
      method: "GET",
      url: apiUrl,
      onload: function (response) {
        if (response.status === 200) {
          const data = JSON.parse(response.responseText);
          my_location = determineLocation(data.status);
        } else {
          console.error(
            "Torn API Error:",
            response.status,
            response.responseText
          );
          alert(ERRORS.FETCH_ERROR);
        }
      },
      onerror: function (error) {
        console.error("GM_xmlhttpRequest Error:", error);
        alert(ERRORS.NETWORK_ERROR);
      },
    });
  }

  function determineLocation({ state, description }) {
    const locations = {
      "In Argentina": LOCATIONS.ARGENTINA,
      "In Canada": LOCATIONS.CANADA,
      "In the Cayman Islands": LOCATIONS.CAYMAN_ISLANDS,
      "In China": LOCATIONS.CHINA,
      "In Hawaii": LOCATIONS.HAWAII,
      "In Japan": LOCATIONS.JAPAN,
      "In Mexico": LOCATIONS.MEXICO,
      Okay: LOCATIONS.TORN,
      "In South Africa": LOCATIONS.SOUTH_AFRICA,
      "In Switzerland": LOCATIONS.SWITZERLAND,
      "In UAE": LOCATIONS.UAE,
      "In the United Kingdom": LOCATIONS.UK,
    };

    const hospitalLocations = {
      "In an Argentinian": LOCATIONS.ARGENTINA,
      "In a Canadian": LOCATIONS.CANADA,
      "In a Cayman": LOCATIONS.CAYMAN_ISLANDS,
      "In a Chinese": LOCATIONS.CHINA,
      "In an Emirati": LOCATIONS.UAE,
      "In a Hawaiian": LOCATIONS.HAWAII,
      "In hospital": LOCATIONS.TORN,
      "In a Japanese": LOCATIONS.JAPAN,
      "In a Mexican": LOCATIONS.MEXICO,
      "In a South African": LOCATIONS.SOUTH_AFRICA,
      "In a Swiss": LOCATIONS.SWITZERLAND,
      "In a UK": LOCATIONS.UK,
    };

    const travelLocations = {
      "to Argentina": LOCATIONS.ARGENTINA,
      "to Canada": LOCATIONS.CANADA,
      "to the Cayman": LOCATIONS.CAYMAN_ISLANDS,
      "to China": LOCATIONS.CHINA,
      "to UAE": LOCATIONS.UAE,
      "to Hawaii": LOCATIONS.HAWAII,
      "to Japan": LOCATIONS.JAPAN,
      "to Mexico": LOCATIONS.MEXICO,
      "to South Africa": LOCATIONS.SOUTH_AFRICA,
      "to Switzerland": LOCATIONS.SWITZERLAND,
      "to United Kingdom": LOCATIONS.UK,
      "to Torn": LOCATIONS.TORN,
    };
    if (state === USER_STATUSES.HOSPITAL) {
      for (const [key, value] of Object.entries(hospitalLocations)) {
        if (description.includes(key)) {
          return value;
        }
      }
    }

    if (state === USER_STATUSES.TRAVELING) {
      for (const [key, value] of Object.entries(travelLocations)) {
        if (description.includes(key)) {
          return value;
        }
      }
    }

    return locations[description] || state;
  }

  /**
   * A user is where you are if they are not traveling and their location evaluates to your location.
   * @param {*} param0
   * @returns
   */
  function isUserWhereYouAre({ state, description }) {
    const location = determineLocation({ state, description });
    if (state === USER_STATUSES.TRAVELING) {
      return false;
    }
    return determineLocation({ state, description }) === my_location;
  }

  /**
   * A user is approaching if they are traveling to your current location. This function does
   * not take into account when you are traveling. This could be improved to handle that scenario.
   * @param {*} param0
   * @returns
   */
  function isUserApproaching({ state, description }) {
    if (state !== USER_STATUSES.TRAVELING) return false;
    const their_destination = determineLocation({ state, description });
    return their_destination === my_location;
  }

  function isUserAttackable({ state, description }) {
    if (state === USER_STATUSES.OKAY && my_location === LOCATIONS.TORN) {
      return true;
    }
    if (state === USER_STATUSES.ABROAD && my_location !== LOCATIONS.TORN) {
      if (description.includes(my_location)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Styling related functions
   */

  function applyPlayerRowMutations(playerRow) {
    playerRow.style.height = "80px";
  }

  function applyIconTrayMutations(memberIconsDiv) {
    const iconTray = memberIconsDiv.querySelector("#iconTray");
    // Update its width to 50%
    if (iconTray) {
      iconTray.style.width = "50%";
    }
  }
  function applyDetailContainerStyles(detailsContainer) {
    detailsContainer.className = "player-details";
    detailsContainer.style.marginTop = "5px";
    detailsContainer.style.width = "50%";
  }

  function applyStatusTextStyles(statusTextContainer) {
    // Create a span for the "Status:" label
    const statusLabel = document.createElement("span");
    statusLabel.textContent = "Status: ";
    statusTextContainer.appendChild(statusLabel);
  }

  function applyStatusDescriptionStyles(
    statusTextContainer,
    { description, color }
  ) {
    // Create a span for the status description and apply the color
    const statusDescription = document.createElement("span");
    statusDescription.textContent = description;

    // Map colors to their respective hex codes
    const colorMap = {
      red: "#FF8787",
      green: "#82C91E",
      blue: "#3BC9DB",
    };

    // Apply the mapped color or default to black if the color is not in the map
    statusDescription.style.color = colorMap[color] || "black";
    statusTextContainer.appendChild(statusDescription);
  }

  function applyAttackButtonStyles(attackButton) {
    attackButton.textContent = "Attack";
    attackButton.style.marginTop = "2px";
    attackButton.style.padding = "2px 10px"; // Smaller padding for a compact button
    attackButton.style.border = "none"; // Remove default border
    attackButton.style.borderRadius = "3px"; // Add slightly rounded corners
    attackButton.style.color = "white"; // Set text color to white
    attackButton.style.cursor = "pointer"; // Change cursor to pointer on hover
    attackButton.style.fontSize = "12px"; // Set font size to 12px
    attackButton.style.height = "15px"; // Set a fixed height for the button
  }

  function applyAttackButtonMutations(attackButton, status) {
    if (isUserApproaching(status)) {
      attackButton.style.backgroundColor = "orange";
      attackButton.style.color = "black";
      attackButton.style.cursor = "wait";
    }
    if (isUserAttackable(status)) {
      attackButton.style.backgroundColor = "red";
      attackButton.style.color = "black";
      attackButton.style.cursor = "crosshair";
    }
    if (isUserWhereYouAre(status) && !isUserAttackable(status)) {
      attackButton.style.backgroundColor = "blue";
      attackButton.style.color = "white";
      attackButton.style.cursor = "wait";
    }
    if (
      !isUserAttackable(status) &&
      !isUserApproaching(status) &&
      !isUserWhereYouAre(status)
    ) {
      attackButton.style.backgroundColor = "gray";
      attackButton.style.cursor = "not-allowed";
    }
  }

  /**
   * Main function responsible for building out and changing the page.
   * @param {*} payload - The data from the Torn API for the faction.
   */
  function updatePlayerStatuses(payload) {
    Object.keys(payload).forEach((playerId) => {
      const playerRowXpath = `//div[contains(@class, "members-list")]//li[.//a[contains(@href, "/profiles.php?XID=${playerId}")]]`;
      const playerRow = document.evaluate(
        playerRowXpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (playerRow) {
        applyPlayerRowMutations(playerRow);
        // Find the div with the class "member-icons" within the playerRow
        const memberIconsDiv = playerRow.querySelector(".member-icons");
        applyIconTrayMutations(memberIconsDiv);

        if (memberIconsDiv) {
          // Check if the details already exist to avoid duplication
          if (!memberIconsDiv.querySelector(".player-details")) {
            // Create a new container for player details
            const detailsContainer = document.createElement("div");
            applyDetailContainerStyles(detailsContainer);

            // Add the status text
            const statusTextContainer = document.createElement("p");
            applyStatusTextStyles(statusTextContainer);
            applyStatusDescriptionStyles(
              statusTextContainer,
              payload[playerId].status
            );

            // Append the status text container to the details container
            detailsContainer.appendChild(statusTextContainer);

            // Add the attack button
            const attackButton = document.createElement("button");
            applyAttackButtonStyles(attackButton);
            applyAttackButtonMutations(attackButton, payload[playerId].status);

            attackButton.onclick = () => {
              // Redirect to the attack URL
              window.location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${playerId}`;
            };

            // Append the attack button to the details container
            detailsContainer.appendChild(attackButton);

            // Append the details container to the member-icons div
            memberIconsDiv.appendChild(detailsContainer);
          }
        }
      }
    });
  }

  const factionId = getFactionId();
  const refreshFrequency = secondsToMilliseconds(REFRESH_FREQUENCY_IN_SECONDS);
  if (factionId) {
    const fetchData = () => {
      fetchUserData(apiKey);
      fetchFactionData(factionId, apiKey);
    };

    // Call the function immediately.
    fetchData();

    // Call the function every n seconds.
    setInterval(fetchData, refreshFrequency);
  } else {
    console.log(ERRORS.NO_FACTION_ID);
  }
})();
