// ==UserScript==
// @name        Holdem helper
// @namespace   Violentmonkey Scripts
// @grant       GM_xmlhttpRequest
// @version     1.7
// @author      -
// @description 6/8/2024, 4:42:02 PM
// @license     GNU GPLv3
// @match        *://run.steam-powered-games.com/*evoplay/texasholdempoker3d*
// @match        *://run.evoplay.games/table/evoplay/texasholdempoker3d*
// @downloadURL https://update.greasyfork.org/scripts/508500/Holdem%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/508500/Holdem%20helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const console = window.console;
  const targetURL = "/fullstate/html5/evoplay/texasholdempoker3d/";

  /**
   * Values correspond to the actions in Evoplay Texas Hold 'em
   *
   * @type {Object<string, string>}
   * */
  const ACTIONS = {
    RAISE: "Coins",
    NO_RAISE: "Check",
    FOLD: "Fold",
    PLAY: "Call",
  };

  const GAME_STATUS = {
    GAMEOVER: "GAMEOVER",
  };

  let autoplayEnabled = false;
  let minWinPercent = 67;
  let autoplayButton;
  let logTextbox;
  let logContainer;
  let minWinPercentInput;
  let handsToPlayInput;
  let handsRemaining = 0;
  let autoplayHeartbeat;

  function initializeUI() {
    // Create a logging container
    logContainer = document.createElement("div");
    logContainer.style.position = "fixed";
    logContainer.style.bottom = "20px";
    logContainer.style.left = "0";
    logContainer.style.width = "200px";
    logContainer.style.padding = "10px";
    logContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    logContainer.style.border = "2px solid #000";
    logContainer.style.zIndex = "9999";
    document.body.appendChild(logContainer);

    // Create a textbox for logging
    logTextbox = document.createElement("textarea");
    logTextbox.style.width = "100%";
    logTextbox.style.height = "108px";
    logTextbox.style.resize = "none";
    logTextbox.readOnly = true;
    logTextbox.style.border = "2px solid #000";
    logTextbox.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    logContainer.appendChild(logTextbox);

    // Create input for minWinPercent
    minWinPercentInput = document.createElement("input");
    minWinPercentInput.type = "number";
    minWinPercentInput.min = "0";
    minWinPercentInput.max = "100";
    minWinPercentInput.value = minWinPercent;
    minWinPercentInput.style.width = "50px";
    minWinPercentInput.style.marginTop = "5px";
    logContainer.appendChild(minWinPercentInput);

    // Create label for minWinPercent input
    const minWinPercentLabel = document.createElement("label");
    minWinPercentLabel.textContent = "Min Win %:";
    minWinPercentLabel.style.marginRight = "5px";
    logContainer.insertBefore(minWinPercentLabel, minWinPercentInput);

    // Add a line break
    logContainer.appendChild(document.createElement("br"));

    // Create input for number of hands to play
    handsToPlayInput = document.createElement("input");
    handsToPlayInput.type = "number";
    handsToPlayInput.min = "1";
    handsToPlayInput.value = "10";
    handsToPlayInput.style.width = "50px";
    handsToPlayInput.style.marginTop = "5px";
    logContainer.appendChild(handsToPlayInput);

    // Create label for handsToPlay input
    const handsToPlayLabel = document.createElement("label");
    handsToPlayLabel.textContent = "Hands to play:";
    handsToPlayLabel.style.marginRight = "5px";
    logContainer.insertBefore(handsToPlayLabel, handsToPlayInput);

    // Create start/stop button for autoplay
    autoplayButton = document.createElement("button");
    autoplayButton.textContent = "Start Autoplay";
    autoplayButton.style.marginTop = "5px";
    autoplayButton.style.width = "100%";
    autoplayButton.style.padding = "5px";
    autoplayButton.style.backgroundColor = "#4CAF50";
    autoplayButton.style.color = "white";
    autoplayButton.style.border = "none";
    autoplayButton.style.cursor = "pointer";
    logContainer.appendChild(autoplayButton);

    addEventListeners();

    appendToLog("Holdem helper initialized");
  }

  function addEventListeners() {
    // Add event listener for minWinPercent input
    minWinPercentInput.addEventListener("change", (event) => {
      minWinPercent = Number(event.target.value);
      appendToLog(`Min Win % set to ${minWinPercent}`);
    });

    // Add event listener for 'a' key press to toggle autoplay
    document.addEventListener("keydown", (event) => {
      if (event.key === "a" || event.key === "A") {
        autoplayEnabled = !autoplayEnabled;
        if (autoplayEnabled) {
          handsRemaining = parseInt(handsToPlayInput.value, 10);
          appendToLog(`Autoplay enabled for ${handsRemaining} hands`);
          startAutoplayHeartbeat();
        } else {
          handsRemaining = 0;
          appendToLog("Autoplay disabled");
          stopAutoplayHeartbeat();
        }
        updateAutoplayButtonState();
      }
    });

    // Add event listener for autoplay button
    autoplayButton.addEventListener("click", () => {
      if (!autoplayEnabled) {
        autoplayEnabled = true;
        handsRemaining = parseInt(handsToPlayInput.value, 10);
        appendToLog(`Autoplay enabled for ${handsRemaining} hands`);
        startAutoplayHeartbeat();
      } else {
        autoplayEnabled = false;
        handsRemaining = 0;
        appendToLog("Autoplay disabled");
        stopAutoplayHeartbeat();
      }
      updateAutoplayButtonState();
    });
  }

  function updateAutoplayButtonState() {
    autoplayButton.textContent = autoplayEnabled
      ? `Stop Autoplay (${handsRemaining})`
      : "Start Autoplay";
    autoplayButton.style.backgroundColor = autoplayEnabled
      ? "#f44336"
      : "#4CAF50";
  }

  /**
   * Wait for game to load to prevent event listeners from being cleared
   *
   */
  function waitForGameLoad() {
    if (typeof c2d !== "undefined" && c2d.eventManager) {
      initializeUI();
    } else {
      setTimeout(waitForGameLoad, 1000);
    }
  }

  waitForGameLoad();

  /**
   * Appends to the log box
   *
   * @param {string} message
   */
  function appendToLog(message) {
    logTextbox.value += message + "\n";
    logTextbox.scrollTop = logTextbox.scrollHeight;
  }

  /**
   * Calculates the optimal decision based on the relative probabilities from the beating bonuses api
   * This assumes optimization per hand and standard rules. Beating bonuses also has
   * optimization per unit wagered and "vuetec" rules.
   *
   * @param {string} responseText The Beating Bonuses API returns the relative probabilities as a string of
   * 4 numbers separated by new lines: total, win, lose, tie
   */
  function getRecommendationFromResponseText(responseText) {
    const relProbs = responseText
      .split("\n")
      .map((val) => Number.parseInt(val));

    const [played, won, lost, tied] = relProbs;

    const winProbPercent = (won / played) * 100;

    // optimized for hand
    const decision =
      winProbPercent >= minWinPercent ? ACTIONS.RAISE : ACTIONS.NO_RAISE;

    const toFixedProb = (relProb) =>
      ((relProb / played) * 100).toFixed(2) + "%";
    return [
      `Chance of win: ${toFixedProb(won)}`,
      `Chance of loss: ${toFixedProb(lost)}`,
      `Chance of tie: ${toFixedProb(tied)}`,
      decision,
    ];
  }

  /**
   * Gets the best action, fold or raise, on the flop
   * In beating bonuses, this calculation happens client side
   *
   * @param {Array<string>} playerCardsShortForm
   */
  function showBestFlopAction(playerCardsShortForm) {
    try {
      const ranks = "23456789tjqka";
      const isSuited =
        playerCardsShortForm[0].charAt(1) === playerCardsShortForm[1].charAt(1);

      const playerCardRanks = [
        ranks.indexOf(playerCardsShortForm[0].charAt(0)),
        ranks.indexOf(playerCardsShortForm[1].charAt(0)),
      ];
      const min = Math.min(...playerCardRanks);
      const max = Math.max(...playerCardRanks);

      let action;

      if (!isSuited && min === 0 && max > 0 && max < 6) {
        action = ACTIONS.FOLD;
        appendToLog(action);
      } else {
        action = ACTIONS.PLAY;
        appendToLog(action);
      }
      if (autoplayEnabled) {
        setTimeout(() => {
          if (action === ACTIONS.FOLD) {
            setTimeout(() => {
              c2d.eventManager.dispatch(game.events.UI.ON_ACTION_PRESSED, {
                step: game.table_games.constants.Steps.FOLD,
              });
            }, 2000);
            // Decrement hand count and update autoplay state
            handsRemaining--;
            if (handsRemaining <= 0) {
              autoplayEnabled = false;
              appendToLog("Autoplay finished");
              stopAutoplayHeartbeat();
            } else {
              appendToLog(`Folded. ${handsRemaining} hands remaining.`);
            }
            updateAutoplayButtonState();
            if (autoplayEnabled) {
              setTimeout(() => {
                c2d.eventManager.dispatch(game.events.UI.ON_REBET_PRESSED);
              }, 2000);
            }
          } else if (action === ACTIONS.PLAY) {
            c2d.eventManager.dispatch(game.events.UI.ON_ACTION_PRESSED, {
              step: game.table_games.constants.Steps.CALL,
            });
          }
        }, 2000);
      }
    } catch (error) {
      handleAutoplayError(error);
    }
  }
  /**
   * Calls the beatingbonuses api and gets the relative probabilities
   *
   * @param {string} playerCardsShortForm
   * @param {string} boardCardsShortForm
   */
  function showBeatingBonusesProbabilitiesFromCards(
    playerCardsShortForm,
    boardCardsShortForm,
    isRiver // Add isRiver parameter
  ) {
    const params = new URLSearchParams({
      player: playerCardsShortForm,
      board: boardCardsShortForm,
    });
    GM_xmlhttpRequest({
      url: `https://www.beatingbonuses.com/holdembonus_exec.php?${params.toString()}`,
      method: "POST",
      onload: (response) => {
        try {
          const recommendation = getRecommendationFromResponseText(
            response.responseText
          );
          appendToLog(recommendation.join("\n"));
          if (autoplayEnabled) {
            setTimeout(() => {
              if (recommendation[3] === ACTIONS.RAISE) {
                c2d.eventManager.dispatch(game.events.UI.ON_ACTION_PRESSED, {
                  step: isRiver
                    ? game.table_games.constants.Steps.RIVER
                    : game.table_games.constants.Steps.TURN,
                });
              } else if (recommendation[3] === ACTIONS.NO_RAISE) {
                c2d.eventManager.dispatch(game.events.UI.ON_ACTION_PRESSED, {
                  step: game.table_games.constants.Steps.CHECK,
                });
              }
            }, 2000);
          }
        } catch (error) {
          handleAutoplayError(error);
        }
      },
      oneerror: (error) => {
        console.error("Request to BeatingBonuses failed:", error);
        handleAutoplayError(error);
      },
    });
  }

  /**
   * Returns the short form for the query string parameters for beatingbonuses
   *
   * @param {obj} card
   * @param {string} card.suit
   * @param {string} card.rank
   */
  function getCardShortFormFromCardObj(card) {
    return `${card.rank.toLowerCase()}${card.suit[0].toLowerCase()}`;
  }

  /**
   * @param {object} xhrResponse
   * @returns {void}
   */
  async function showBestMoveFromResponse(xhrResponse) {
    try {
      if (xhrResponse.spin.dealer.status === GAME_STATUS.GAMEOVER) {
        if (autoplayEnabled) {
          handsRemaining--;
          if (handsRemaining <= 0) {
            autoplayEnabled = false;
            appendToLog("Autoplay finished");
            stopAutoplayHeartbeat();
            updateAutoplayButtonState();
          } else {
            updateAutoplayButtonState();
            setTimeout(() => {
              if (autoplayEnabled) {
                c2d.eventManager.dispatch(game.events.UI.ON_REBET_PRESSED);
              }
            }, 2000);
          }
        }
        return;
      }
      const { cards: playerCards } = xhrResponse.spin.hands[0];
      const { mutual_cards: boardCards } = xhrResponse.spin.dealer;
      const playerCardsShortForm = Object.values(playerCards).map(
        getCardShortFormFromCardObj
      );

      const boardCardsShortForm = Object.values(boardCards).map(
        getCardShortFormFromCardObj
      );

      appendToLog(
        `player: ${playerCardsShortForm.join(
          ", "
        )}\nboard: ${boardCardsShortForm.join(", ")}`
      );

      if (boardCardsShortForm && boardCardsShortForm.length) {
        showBeatingBonusesProbabilitiesFromCards(
          playerCardsShortForm.join(" "),
          boardCardsShortForm.join(" "),
          boardCardsShortForm.length === 4
        );
      } else if (playerCardsShortForm) {
        showBestFlopAction(playerCardsShortForm);
      }
    } catch (error) {
      handleAutoplayError(error);
    }
  }

  // Override XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;

  function xhrCallback() {
    return function () {
      if (
        this.readyState === 4 &&
        this._requestData.url.includes(targetURL)
      ) {
        try {
          c2d.timescale = 50;
          const responseJson = JSON.parse(this.response);
          showBestMoveFromResponse(responseJson);
        } catch (error) {
          handleAutoplayError(error);
        }
      }
    };
  }
  const open = originalXHR.prototype.open;
  const send = originalXHR.prototype.send;

  originalXHR.prototype.open = function (method, url, ...rest) {
    this._requestData = {
      method,
      url: new URL(url, window.location.origin).toString(),
    };
    open.apply(this, [method, url, ...rest]);
  };

  originalXHR.prototype.send = function (data) {
    this.addEventListener("readystatechange", xhrCallback());
    this._requestData.data = data;
    send.apply(this, arguments);
  };

  console.debug("Iframe XHR initialized");

  // Add this function to handle errors
  function handleAutoplayError(error) {
    console.error("Autoplay error:", error);
    appendToLog("Autoplay error occurred. Stopping autoplay.");
    autoplayEnabled = false;
    handsRemaining = 0;
    stopAutoplayHeartbeat();
    updateAutoplayButtonState();
  }

  function startAutoplayHeartbeat() {
    autoplayHeartbeat = setInterval(() => {
      if (autoplayEnabled) {
        appendToLog("Autoplay still running...");
      } else {
        clearInterval(autoplayHeartbeat);
      }
    }, 300000); // Check every 5 minutes
  }

  function stopAutoplayHeartbeat() {
    clearInterval(autoplayHeartbeat);
  }
})();
