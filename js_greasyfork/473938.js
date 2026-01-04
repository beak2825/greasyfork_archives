// ==UserScript==
// @name        Xiangqi Game Assistant
// @namespace   Violentmonkey Scripts
// @match       https://play.xiangqi.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.39
// @author      -
// @description Add tooltips for player info divs in the game and provide game-related assistance
// @license     MIT
// @icon        https://play.xiangqi.com/icon.svg
// @downloadURL https://update.greasyfork.org/scripts/473938/Xiangqi%20Game%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/473938/Xiangqi%20Game%20Assistant.meta.js
// ==/UserScript==

(function () {
  // Indicates if the player has triggered the abandon action
  let hasAbandoned = false;

  // Regex pattern to identify guest usernames
  const guestNamePattern = /^guest\w{5}$/;

  // Stores tooltip elements for player info
  const tooltips = createTooltips();

  // Stores player information objects
  const playerInfos = [];

  // Player's rating
  let playerRating;

  // Flag indicating if the player has played with a guest in the past
  let hasPlayedWithGuest;

  // Options in the confirmation dialog to abandon a game
  const confirmOptions = ["是", "Yes", "Đúng"];

  // Instructions for navigating to the lobby
  const lobbyGotos = ["前往大厅", "前往大廳", "Go to lobby", "Đi đến sảnh đợi"];

  // Instance of the configuration menu
  let configMenu;

  /**
   * Prints debug messages to the console if debug logging is enabled.
   */
  function debugLog(...args) {
    if (getEnableDebug()) {
      console.log(...args);
    }
  }

  /**
   * Creates and returns an array of tooltip elements.
   */
  function createTooltips() {
    return Array.from({ length: 2 }, createTooltipElement);
  }

  /**
   * Creates a single tooltip element and appends it to the document body.
   */
  function createTooltipElement() {
    const tooltip = document.createElement("div");
    tooltip.style.cssText = `
                position: fixed;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px;
                border-radius: 5px;
                display: none;
            `;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  /**
   * Fetches player statistics for the given player index from the Xiangqi API and updates the playerInfos array.
   */
  async function fetchPlayerStats(playerIndex) {
    const playerName = playerInfos[playerIndex]?.name;
    const isFakeGuest = playerInfos[playerIndex]?.isFakeGuest;
    if (playerName && (!guestNamePattern.test(playerName) || isFakeGuest)) {
      const response = await fetchUserInfo(playerName);
      handleResponse(response, playerIndex);
      await analyzeGameResponse(playerName, playerIndex);
    }
  }

  /**
   * Fetches user information from the Xiangqi API.
   */
  async function fetchUserInfo(playerName) {
    return GM_xmlhttpRequestAsync({
      method: "GET",
      url: `https://api.xiangqi.com/api/users/account/${playerName}`,
    });
  }

  /**
   * Fetches games for a specific player from the Xiangqi API.
   */
  async function fetchGamesForPlayer(playerName) {
    return GM_xmlhttpRequestAsync({
      method: "GET",
      url: `https://api.xiangqi.com/api/users/games/${playerName}?page=1`,
    });
  }

  /**
   * Analyzes the response from the fetchGamesForPlayer function to determine
   * if the player has played with a guest and calculates the average remaining time and rage quitting rate.
   */
  async function analyzeGameResponse(playerName, playerIndex) {
    const response = await fetchGamesForPlayer(playerName);
    hasPlayedWithGuest = true;
    playerInfos[playerIndex].rageQuittingRate = 0;
    playerInfos[playerIndex].avgRemTimeRecentGames = 0;
    if (response.status === 200) {
      const jsonData = JSON.parse(response.responseText);
      if (jsonData.length === 0) {
        return;
      }
      const games = jsonData.items.filter((game) => game.end_reason);
      if (playerInfos[playerIndex].stats?.gamesAccess === "0") {
        hasPlayedWithGuest = games.some(
          (game) =>
            guestNamePattern.test(game.rplayer.username) ||
            guestNamePattern.test(game.bplayer.username)
        );
      }
      const recentLostCount = games.filter(
        (game) =>
          (game.bplayer.username === playerName &&
            game.bplayer.result === 10) ||
          (game.rplayer.username === playerName && game.rplayer.result === 10)
      ).length;
      let totalRageQuittingCount = 0;
      let totalRemTime = 0;
      for (const game of games) {
        const currentPlayer =
          game.bplayer.username === playerName ? game.bplayer : game.rplayer;
        const remainingTime = currentPlayer.seconds;
        if (game.end_reason === 200 && currentPlayer.result === 10) {
          ++totalRageQuittingCount;
        }
        totalRemTime += remainingTime;
      }
      if (totalRageQuittingCount > 0) {
        playerInfos[playerIndex].rageQuittingRate =
          totalRageQuittingCount / recentLostCount;
      }
      if (totalRemTime > 0) {
        playerInfos[playerIndex].avgRemTimeRecentGames =
          totalRemTime / games.length;
      }
    }
    playerInfos[playerIndex].rageQuittingRate = Math.ceil(
      playerInfos[playerIndex].rageQuittingRate * 100
    );
    playerInfos[playerIndex].avgRemTimeRecentGames = Math.ceil(
      playerInfos[playerIndex].avgRemTimeRecentGames
    );
  }

  /**
   * Handles the response from the API, extracting player statistics and updating
   * the corresponding player info object.
   */
  function handleResponse(response, playerIndex) {
    if (response.status === 200) {
      const playerStats = extractPlayerStatsFromResponse(response);
      playerInfos[playerIndex].stats = playerStats;
      updateTooltip(playerIndex, null);
    }
  }

  /**
   * Extracts player statistics from the API response.
   */
  function extractPlayerStatsFromResponse(response) {
    const {
      avg_opponent_rating,
      badges,
      draw_count,
      games_access,
      games_played_count,
      losses_count,
      winning_percentage,
      wins_count,
    } = JSON.parse(response.responseText);

    const win_streak =
      badges.temp.find((badge) => badge.win_streak)?.win_streak || 0;

    return {
      avgOpponentRating: avg_opponent_rating,
      draws: draw_count,
      gamesAccess: games_access,
      gamesPlayed: games_played_count,
      losses: losses_count,
      winRate: winning_percentage,
      wins: wins_count,
      winStreak: win_streak,
    };
  }

  /**
   * Formats a given number of seconds into a "minutes:seconds" string.
   */
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds}s`;
  }

  /**
   * Updates the content of the tooltip with player information and positions it based on the mouse event location.
   */
  function updateTooltip(event, playerIndex) {
    const tooltip = tooltips[playerIndex];
    const playerInfo = playerInfos[playerIndex];
    if (!tooltip || !playerInfo) return;

    tooltip.style.visibility = "hidden";
    tooltip.style.display = "block";

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 20; // Margin from window edges

    let left = event.clientX + margin;
    let top = event.clientY + margin;

    // Adjust left position if tooltip overflows the window's right edge
    if (left + tooltipWidth > windowWidth) {
      left = windowWidth - tooltipWidth - margin;
    }

    // Adjust top position if tooltip overflows the window's top or bottom edge
    if (top < tooltipHeight) {
      top += event.target.offsetHeight - margin;
    } else if (windowHeight - top < tooltipHeight) {
      top -= tooltipHeight + margin;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.visibility = "visible";

    if (playerInfo.stats) {
      const {
        gamesPlayed,
        wins,
        losses,
        draws,
        winRate,
        winStreak,
        avgOpponentRating,
      } = playerInfo.stats;
      const rageQuittingRate = playerInfos[playerIndex].rageQuittingRate;
      const formattedTime = formatTime(
        playerInfos[playerIndex].avgRemTimeRecentGames
      );

      tooltip.innerHTML = `
                Games Played: ${gamesPlayed}<br>
                Wins: ${wins} | Losses: ${losses} | Draws: ${draws}<br>
                Win Rate: ${winRate}% | Win Streak: ${winStreak}<br>
                Avg. Opponent Rating: ${avgOpponentRating}<br>
                Rage Quitting Rate for Recent Games: ${rageQuittingRate}%<br>
                Avg. Remaining Time for Recent Games: ${formattedTime}
            `;
      tooltip.style.display = "block";
    } else {
      tooltip.style.display = "none";
    }
  }

  /**
   * Attaches mouseover and mouseout events to player info divs to show and hide tooltips.
   */
  function attachTooltip(playerIndex, playerInfoDiv) {
    playerInfoDiv.addEventListener("mouseover", (event) =>
      updateTooltip(event, playerIndex)
    );
    playerInfoDiv.addEventListener("mouseout", () => {
      tooltips[playerIndex].style.display = "none";
    });
  }

  /**
   * Monitors for URL changes and updates player information divs accordingly.
   */
  function listenForUrlChange(callback, interval) {
    let currentURL = window.location.href;
    setInterval(() => {
      const newURL = window.location.href;
      if (currentURL !== newURL) {
        callback();
        currentURL = newURL;
      }
    }, interval);
  }

  /**
   * Monitors modal events and closes the sign-in modal if it appears.
   */
  function listenForModalEvents(interval) {
    setInterval(() => {
      const modalWrapper = document.querySelector("div.Wrapper-zur8fw-0");
      if (modalWrapper) {
        const signInLink = modalWrapper.querySelector("a.sign-in-link");
        debugLog("Sign-in link found:", !!signInLink);

        if (signInLink) {
          const modalPortal = modalWrapper.closest("div.ReactModalPortal");
          debugLog("Modal portal found:", !!modalPortal);

          if (modalPortal) {
            const closeButton = modalPortal.querySelector("button.btn-close");
            debugLog("Close button found:", !!closeButton);

            if (closeButton) {
              debugLog("Attempting to click close button");
              closeButton.click();
            } else {
              debugLog("Close button not found, hiding modal portal");
              modalPortal.style.display = "none";
            }
          }
        }
      }
    }, interval);
  }

  /**
   * Monitors for dialog events and redirect to the homepage.
   */
  function listenForDialogEvents(interval) {
    setInterval(() => {
      const dialogContainer = document.querySelector(
        "div.rrt-middle-container"
      );
      if (dialogContainer) {
        const text = dialogContainer.querySelector("div.rrt-text").innerText;
        if (text === "Game not found.") {
          const currentURL = new URL(window.location.href);
          const newURL = currentURL.origin;
          window.location.assign(newURL);
        } else {
          debugLog("dialog content: ", dialogContainer);
        }
      }
    }, interval);
  }

  /**
   * Checks for the existence of player info divs and sets up tooltips and data fetching.
   */
  async function checkPlayerInfoDivs() {
    hasAbandoned = false;
    tooltips.forEach((tooltip) => (tooltip.style.display = "none"));

    const intervalId = setInterval(async () => {
      const allPlayerInfoDivs = document.querySelectorAll("div.player-info");
      if (allPlayerInfoDivs.length >= 1) {
        debugLog("All player info divs:", allPlayerInfoDivs);
      }

      const playerInfoDivs = Array.from(allPlayerInfoDivs).filter((div) =>
        div.querySelector("div.username-and-rating")
      );
      if (playerInfoDivs.length >= 1) {
        debugLog("Filtered player info divs:", playerInfoDivs);
      }

      if (playerInfoDivs.length === 2) {
        clearInterval(intervalId);
        debugLog("Found 2 player info divs, processing...");

        await Promise.all(
          playerInfoDivs.map(async (div, index) => {
            const nameElement = div.querySelector("h6.username span");
            debugLog(`Player ${index + 1} name element:`, nameElement);

            if (nameElement) {
              const ratingElement =
                playerInfoDivs[0].querySelector("span.player-rating");
              debugLog("Rating element:", ratingElement);

              playerRating = parseInt(
                ratingElement.textContent.replace(/^\(|\)$/g, "")
              );
              debugLog("Parsed player rating:", playerRating);

              const playerName = nameElement.textContent;
              debugLog(`Player ${index + 1} name:`, playerName);

              const isFakeGuest =
                guestNamePattern.test(playerName) &&
                !!div.querySelector("a > div.userName");
              debugLog(`Is player ${index + 1} a fake guest:`, isFakeGuest);

              playerInfos[index] = {
                div,
                name: playerName,
                stats: null,
                rageQuittingRate: 0,
                avgRemTimeRecentGames: 0,
                isFakeGuest,
              };
              debugLog(`Player ${index + 1} info:`, playerInfos[index]);

              await fetchPlayerStats(index);
              attachTooltip(index, div);

              if (index === 0) {
                await handleAbandonAction();
              }
            } else {
              debugLog(
                `Player ${index + 1} name element not found, retrying...`
              );

              clearInterval(intervalId);
              setTimeout(checkPlayerInfoDivs, 1000);
            }
          })
        );
      }
    }, 1000);
  }

  /**
   * Checks if the current game should be abandoned based on various conditions and initiates the abandon action if needed.
   */
  async function handleAbandonAction() {
    const abandonImage = document.querySelector('img[alt="abandoned-icon"]');
    debugLog("Abandon image found:", !!abandonImage);

    if (abandonImage) {
      const shouldAbandonResult = shouldAbandon();
      debugLog("Should abandon:", shouldAbandonResult);

      if (shouldAbandonResult) {
        const abandonLink = abandonImage.parentElement;
        debugLog("Clicking abandon link");
        abandonLink.click();

        const responseSpan = document.querySelector("span.reply-btn");
        const childSpan = responseSpan?.querySelector("span");
        if (childSpan && confirmOptions.includes(childSpan.textContent)) {
          debugLog("Confirmation option found:", childSpan.textContent);

          const parentAnchor = responseSpan.parentElement;
          if (!hasAbandoned) {
            debugLog("Confirming abandon action");
            parentAnchor.click();
            hasAbandoned = true;
            debugLog("Setting timeout to go to lobby");
            setTimeout(gotoLobby, 1000);
          }
        } else {
          debugLog("No valid confirmation option found");
        }
      }
    }
  }

  /**
   * Navigates the player to the lobby if the abandon action is confirmed.
   */
  function gotoLobby() {
    const laddaLabelSpans = document.querySelectorAll("span.ladda-label");
    if (!laddaLabelSpans) {
      debugLog("No ladda label spans found, retrying...");
      setTimeout(gotoLobby, 1000);
      return;
    }

    laddaLabelSpans.forEach((span) => {
      if (lobbyGotos.includes(span.textContent)) {
        debugLog("Found matching lobby goto text:", span.textContent);

        const parentButton = span.closest("button");
        if (parentButton) {
          debugLog("Clicking parent button to go to lobby");
          parentButton.click();
          hasAbandoned = false;
          debugLog("Reset hasAbandoned flag");
          return;
        } else {
          debugLog("No parent button found for matching span");
        }
      }
    });
  }

  /**
   * Determines whether the current game should be abandoned.
   */
  function shouldAbandon() {
    const opponentInfo = playerInfos[0];
    if (!opponentInfo) {
      debugLog("No opponent info found. Skipping...");
      return false;
    }

    const abandonRating = getAbandonRating();
    if (playerRating && playerRating < abandonRating) {
      debugLog(
        `Opponent's rating (${playerRating}) is below abandon rating (${abandonRating}). Abandoning...`
      );
      return true;
    }

    const isGuestName = guestNamePattern.test(opponentInfo.name);
    const isFakeGuest = opponentInfo.isFakeGuest;
    if (isGuestName && !isFakeGuest && shouldAbandonGuestEnabled()) {
      debugLog("Opponent is a guest player. Abandoning...");
      return true;
    }

    if (shouldAbandonPlayersWithoutGuestsEnabled() && !hasPlayedWithGuest) {
      debugLog("Opponent doesn't play with guest players. Abandoning...");
      return true;
    }

    return false;
  }

  /**
   * Wraps GM_xmlhttpRequest in a promise for async/await usage.
   */
  async function GM_xmlhttpRequestAsync(details) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        ...details,
        onload: (response) => resolve(response),
      });
    });
  }

  /**
   * Initialization function to set up the user script on page load.
   */
  async function initialize() {
    // Create a floating element for configuration
    const configButton = document.createElement("div");
    configButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #3498db;
        color: white;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
    `;

    // Append the floating element to the body
    document.body.appendChild(configButton);

    // Listen for click event on the configButton
    configButton.addEventListener("click", openConfigMenu);

    await checkPlayerInfoDivs();
    listenForUrlChange(checkPlayerInfoDivs, 1000);
    listenForModalEvents(1000);
    listenForDialogEvents(1000);
  }

  /**
   * Opens the configuration menu for the user script.
   */
  function openConfigMenu() {
    // If the menu instance already exists, return early
    if (configMenu) {
      return;
    }

    // Create a new menu instance
    configMenu = document.createElement("div");
    configMenu.style.cssText = `
      align-items: center;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 5px;
      color: white;
      display: flex;
      flex-direction: column;
      left: 50%;
      padding: 20px;
      position: fixed;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
  `;

    // Add title to the menu
    const title = document.createElement("h3");
    title.textContent = "Xiangqi Game Assistant Configuration";
    title.style.marginBottom = "10px";
    configMenu.appendChild(title);

    // Add configuration options to the menu
    const abandonByRatingLabel = createAbandonRatingLabel();
    const enableAbandonGuestLabel = createConfigCheckboxLabel(
      "enableAbandonGuest",
      "Abandon guest players"
    );
    const enableAbandonPlayersWithoutGuestsLabel = createConfigCheckboxLabel(
      "enableAbandonPlayersWithoutGuests",
      "Abandon players who don't play with guest players"
    );
    const enableDebugLabel = createConfigCheckboxLabel(
      "enableDebug",
      "Enable debug logging"
    );

    const saveButton = createConfigButton("Save");
    saveButton.addEventListener("click", saveConfiguration);

    const cancelButton = createConfigButton("Cancel");
    cancelButton.addEventListener("click", removeConfigMenu);

    configMenu.appendChild(abandonByRatingLabel);
    configMenu.appendChild(enableAbandonGuestLabel);
    configMenu.appendChild(enableAbandonPlayersWithoutGuestsLabel);
    configMenu.appendChild(enableDebugLabel);
    configMenu.appendChild(saveButton);
    configMenu.appendChild(cancelButton);
    document.body.appendChild(configMenu);
  }

  /**
   * Removes the configuration menu from the document.
   */
  function removeConfigMenu() {
    if (configMenu) {
      configMenu.remove();
      configMenu = null;
    }
  }

  /**
   * Creates a label for the "abandon by rating" configuration option.
   */
  function createAbandonRatingLabel() {
    const label = document.createElement("label");
    label.style.cssText = `
      margin-bottom: 10px;
    `;
    label.appendChild(
      document.createTextNode("Abandon players whose rating are below: ")
    );
    const number = document.createElement("input");
    number.type = "number";
    number.value = getAbandonRating();
    number.name = "abandonRating";
    number.style.width = "60px";
    label.appendChild(number);
    return label;
  }

  /**
   * Creates a label for configuration checkboxes.
   */
  function createConfigCheckboxLabel(settingName, labelText) {
    const label = document.createElement("label");
    label.style.cssText = `
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    `;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = GM_getValue(settingName, false);
    checkbox.name = settingName;
    checkbox.style.marginRight = "5px";
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(labelText));
    return label;
  }

  /**
   * Creates a button for the configuration menu.
   */
  function createConfigButton(buttonText) {
    const button = document.createElement("button");
    button.textContent = buttonText;
    button.style.cssText = `
      margin-top: 10px;
      font-size: 16px;
    `;
    return button;
  }

  /**
   * Retrieves the abandon rating threshold from storage.
   */
  function getAbandonRating() {
    return GM_getValue("abandonRating", 0); // Default value: 0
  }

  /**
   * Checks if the script is configured to abandon games with guest players.
   */
  function shouldAbandonGuestEnabled() {
    // Retrieve the saved configuration for "abandon guest" logic
    return GM_getValue("enableAbandonGuest", false); // Default value: false
  }

  /**
   * Checks if the script is configured to abandon games with players who haven't played with guests.
   */
  function shouldAbandonPlayersWithoutGuestsEnabled() {
    // Retrieve the saved configuration for "abandon players without guests" logic
    return GM_getValue("enableAbandonPlayersWithoutGuests", false); // Default value: false
  }

  /**
   * Retrieves the value indicating whether debug mode is enabled.
   */
  function getEnableDebug() {
    // Retrieve the saved configuration for enabling debug mode
    return GM_getValue("enableDebug", false); // Default value: false
  }

  /**
   * Saves the user's configuration choices.
   */
  function saveConfiguration() {
    const abandonRating = document.querySelector(
      'input[type="number"][name="abandonRating"]'
    );
    const enableAbandonGuestCheckbox = document.querySelector(
      'input[type="checkbox"][name="enableAbandonGuest"]'
    );
    const enableAbandonPlayersWithoutGuestsCheckbox = document.querySelector(
      'input[type="checkbox"][name="enableAbandonPlayersWithoutGuests"]'
    );
    const enableDebugCheckbox = document.querySelector(
      'input[type="checkbox"][name="enableDebug"]'
    );

    GM_setValue("abandonRating", parseInt(abandonRating.value));
    GM_setValue("enableAbandonGuest", enableAbandonGuestCheckbox.checked);
    GM_setValue(
      "enableAbandonPlayersWithoutGuests",
      enableAbandonPlayersWithoutGuestsCheckbox.checked
    );
    GM_setValue("enableDebug", enableDebugCheckbox.checked);

    removeConfigMenu();
  }

  // Call the initialize function to set everything up
  initialize();
})();