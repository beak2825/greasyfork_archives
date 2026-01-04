// ==UserScript==
// @name         Russian Roulette Timeout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Timeout timer to new Russian Roulette Games
// @author       Stig [2648238]
// @match        https://www.torn.com/page.php?sid=russianRoulette
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466714/Russian%20Roulette%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/466714/Russian%20Roulette%20Timeout.meta.js
// ==/UserScript==

//* Editable settings
const timeoutInMinutes = 15;
const isDebugModeEnabled = false;

//! Editing anything below might break the script

const gameListClassSelector = "[class^=rowsWrap]";
const placeholderClassSelector = "[class^=placeholder]";
const documentObserverConfig = { attributes: true, childList: true, subtree: true };
const gameObserverConfig = { attributes: true, childList: true, subtree: false };

let gameCount = 0; // A global variable to assign unique IDs to games
let intervalIds = {}; // A dictionary to store interval IDs for each game

const onMainDocumentMutation = function (mutationList, gameListClassSelectorObserver) {
  logDebugMessage("Main observer initiated");

  mutationList.forEach(function (mutation) {
    if (mutation.type === "childList") {
      if (document.querySelector(placeholderClassSelector)) {
        logDebugMessage("No active games, disconnecting observer");
        activeGameListObserver.disconnect();

        // Clear all countdown intervals
        for (let id in intervalIds) {
          clearInterval(intervalIds[id]);
        }
        intervalIds = {};
      } else if (document.querySelector(gameListClassSelector)) {
        logDebugMessage("Active games found, observing...");
        const activeGameList = document.querySelector(gameListClassSelector);
        activeGameListObserver.observe(activeGameList, gameObserverConfig);
      }
    }
  });
};

const onActiveGameListMutation = function (mutationList, observer) {
  mutationList.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      const addedNode = mutation.addedNodes[0];
      if (mutation.type === "childList") {
        logDebugMessage("Found new entry, estimating timeout");
        const children = addedNode.children[0]?.children;
        for (let child in children) {
          const className = children[child].className;
          if (className && className.match(/statusBlock/g)) {
            const statusBlock = children[child].children[0];
            statusBlock.id = `game-${gameCount++}`;
            statusBlock.textContent = "Calculating..."; // Change this line
            startCountdown(statusBlock.id);
          }
        }
      }
    } else if (mutation.removedNodes.length > 0) {
      const removedNode = mutation.removedNodes[0];
      const children = removedNode.children[0]?.children;
      for (let child in children) {
        const className = children[child].className;
        if (className && className.match(/statusBlock/g)) {
          const statusBlock = children[child].children[0];
          clearInterval(intervalIds[statusBlock.id]);
          delete intervalIds[statusBlock.id];
        }
      }
    }
  });
};

function logDebugMessage(message) {
  if (isDebugModeEnabled) console.log(message);
}

function getTimeoutString() {
  const now = new Date();
  const estimatedTimeout = new Date(now.getTime() + timeoutInMinutes * 60000);
  const hours = estimatedTimeout.getHours() < 10 ? "0" + estimatedTimeout.getHours() : estimatedTimeout.getHours();
  const minutes = estimatedTimeout.getMinutes() < 10 ? "0" + estimatedTimeout.getMinutes() : estimatedTimeout.getMinutes();
  const seconds = estimatedTimeout.getSeconds() < 10 ? "0" + estimatedTimeout.getSeconds() : estimatedTimeout.getSeconds();
  return `Timeout: ${hours}:${minutes}:${seconds}`;
}

function startCountdown(id) {
  const timeoutDate = new Date(Date.now() + timeoutInMinutes * 60000);

  intervalIds[id] = setInterval(() => {
    const now = new Date();
    let diff = Math.max(0, timeoutDate - now); // Get the difference in milliseconds

    if (diff <= 0) {
      clearInterval(intervalIds[id]);
      document.getElementById(id).textContent = "Timeout";
      return;
    }

    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    document.getElementById(id).textContent = `Timeout: ${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  }, 1000);
}

const documentObserver = new MutationObserver(onMainDocumentMutation);
const activeGameListObserver = new MutationObserver(onActiveGameListMutation);

documentObserver.observe(document, documentObserverConfig);