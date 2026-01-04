// ==UserScript==
// @name        GeoGuessr Quick Reset
// @description Quickly reset singleplayer rounds with a keybind
// @version     1.0
// @author      jakedot
// @match       https://www.geoguessr.com/*
// @grant       none
// @icon        https://www.google.com/s2/favicons?domain=geoguessr.com
// @namespace https://greasyfork.org/users/1497111
// @downloadURL https://update.greasyfork.org/scripts/543280/GeoGuessr%20Quick%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/543280/GeoGuessr%20Quick%20Reset.meta.js
// ==/UserScript==

/* ---------- Settings ---------- */
const RESET_KEY = 'j'; // Keyboard shortcut to start a new game
const DELETE_UNFINISHED_GAMES = true; // If set to true, unfinished games will be deleted once reset
/* ------ No more settings ------ */

let currentGameId;
let isResetting = false;

function checkGameUrl() {
  return window.location.pathname.startsWith('/game/');
}

function checkMapsUrl() {
  return window.location.pathname.startsWith('/maps/');
}

const gameIdPattern = /\/game\/([a-zA-Z0-9]+)/;

function getGameId() {
  return gameIdPattern.exec(window.location.pathname)[1];
}

function updateCurrentGame() {
  if (checkGameUrl()) {
    if (getGameId() !== currentGameId) {
      currentGameId = getGameId();
      isResetting = false;
    }
  } else {
    currentGameId = undefined;
    isResetting = false;
  }
}

function reset() {
  if (isResetting) return;

  isResetting = true;
  setNextDeathAndKillLast(getGameId());
  window.next.router.push(getMapPath(window.GeoGuessrEventFramework.state.map.id));

  const mapObserver = new MutationObserver(() => {
    if (document.querySelector('[class*="map-selector_playButtons__"] button') && document.querySelector('[class*="fullscreen-spinner_root__"]') === null) {
      mapObserver.disconnect();

      setTimeout(() => {
        if (document.querySelector('[class*="map-selector_playButtons__"] button') && checkMapsUrl()) {
          document.querySelector('[class*="map-selector_playButtons__"] button').click();
        }
      }, 350);
    }
  });

  mapObserver.observe(document.body, {
    subtree: true,
    childList: true
  });
}

function getMapPath(mapId) {
  return `/maps/${mapId}`;
}

let nextDeath;

async function setNextDeathAndKillLast(gameId) {
  if (!DELETE_UNFINISHED_GAMES) {
    nextDeath = undefined;
    return;
  }

  if (nextDeath) {
    const response = await fetch(`https://www.geoguessr.com/api/v3/social/events/unfinishedgames/${gameId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      console.warn(`Could not delete game ${gameId}`);
    }
  }

  if (!window.GeoGuessrEventFramework.state.game_in_progress) {
    nextDeath = gameId;
  }
}

document.body.addEventListener('keydown', event => {
  if (event.key === RESET_KEY && checkGameUrl()) {
    reset();
  }
});

const observer = new MutationObserver(() => {
  updateCurrentGame();
});

observer.observe(document.body, {
  subtree: true,
  childList: true
});