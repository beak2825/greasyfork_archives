// ==UserScript==
// @name         Guess Peek (Geoguessr)
// @namespace    alienperfect
// @version      1.5.1
// @description  Click on your pin to see where you've guessed!
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/483541/Guess%20Peek%20%28Geoguessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483541/Guess%20Peek%20%28Geoguessr%29.meta.js
// ==/UserScript==

"use strict";

const SEARCH_RADIUS = 250000;
const STORAGE_CAP = 30;
const SCRIPT_NAME = GM_info.script.name;
const GAMES_API = "https://www.geoguessr.com/api/v3/games/";

const SELECTORS = {
  marker: "[data-qa='guess-marker']",
  markerList: "[class*='map-pin_']:not([data-qa='correct-location-marker'])",
  roundEnd: "[data-qa='close-round-result']",
  gameEnd: "[data-qa='play-again-button']",
  results: "[data-qa='results-map']",
};

let svs, markerObserver;

function interceptFetch() {
  const _fetch = unsafeWindow.fetch;

  unsafeWindow.fetch = async (resource, options) => {
    const response = await _fetch(resource, options);
    const url = resource.toString();

    if (url.includes(GAMES_API) && options) {
      queueMicrotask(async () => {
        const resp = await response.clone().json();
        await getGuessData(resp, options);
      });
    }

    return response;
  };
}

async function getGuessData(resp, options) {
  try {
    const token = resp.token;
    const round = resp.round;
    const guesses = resp.player.guesses;
    const isGameFinished = resp.state === "finished";
    const isChallenge = resp.type === "challenge";

    if (options.method === "POST") {
      const guess = guesses.at(-1);
      const pano = await getNearestPano({ lat: guess.lat, lng: guess.lng });

      savePano(token, round, pano);
      updateMarker(getMarker(round), pano);
    }

    if (isGameFinished && !isChallenge) observeMarkers();
  } catch (e) {
    console.error(`${SCRIPT_NAME} error: ${e}`);
  }
}

async function getNearestPano(coords) {
  const nearestPano = {};
  let radius = SEARCH_RADIUS;
  let oldRadius;
  if (!svs) initSVS();

  for (;;) {
    try {
      const pano = await svs.getPanorama({
        location: coords,
        radius: radius,
        sources: ["outdoor"],
        preference: "nearest",
      });

      radius = getRadius(coords, pano.data.location.latLng);
      if (oldRadius && radius >= oldRadius) break;

      nearestPano.radius = radius;
      nearestPano.url = getStreetViewUrl(pano.data.location.pano);
      oldRadius = radius;
    } catch (e) {
      console.error(`${SCRIPT_NAME} error: ${e}`);
      break;
    }
  }

  return nearestPano;
}

function savePano(token, round, pano) {
  const panos = GM_getValue(token, { [round]: pano });
  const history = GM_getValue("history", []);

  panos[round] = pano;
  GM_setValue(token, panos);

  if (!history.includes(token)) {
    history.unshift(token);
    GM_setValue("history", history);
  }

  cleanStorage(history);
}

function cleanStorage(history) {
  if (history.length > STORAGE_CAP) {
    const lastItem = history.pop();

    GM_setValue("history", history);
    GM_deleteValue(lastItem);
  }
}

function getMarker() {
  const marker = document.querySelector(SELECTORS.marker);
  const roundEnd = document.querySelector(SELECTORS.roundEnd);

  if (marker && roundEnd) return marker;
}

function observeMarkers() {
  markerObserver = new MutationObserver(() => {
    const token = getGameToken(location.pathname); // can break on start without try-catch
    const panoList = GM_getValue(token);
    if (!panoList) return stopObserver();

    const results =
      document.querySelector(SELECTORS.results) ||
      document.querySelector(SELECTORS.gameEnd);
    const markerList = document.querySelectorAll(SELECTORS.markerList);

    if (!(results && markerList.length > 0)) return;
    stopObserver();

    for (const [round, pano] of Object.entries(panoList)) {
      const marker = markerList.item(parseInt(round) - 1);
      updateMarker(marker, pano);
    }
  });

  markerObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function updateMarker(marker, pano) {
  let distance = formatDistance(SEARCH_RADIUS);
  const tooltip = document.createElement("div");
  tooltip.className = "peek-tooltip";
  tooltip.textContent = `No location was found within ${distance}!`;

  marker.setAttribute("data-pano", "false");

  if (Object.keys(pano).length > 0) {
    distance = formatDistance(pano.radius);
    tooltip.textContent = `Click to see the nearest location! [${distance}]`;

    marker.setAttribute("data-pano", "true");
    marker.addEventListener("click", () => {
      GM_openInTab(pano.url, { active: true });
    });
  }

  marker.append(tooltip);
}

function startObserver() {
  stopObserver();
  if (inResults()) observeMarkers();
}

function stopObserver() {
  if (markerObserver) markerObserver.disconnect();
}

function inResults() {
  return location.pathname.includes("/results/");
}

function getGameToken(url) {
  const token = url.match(/[0-9a-zA-Z]{16}/);
  return token ? token[0] : null;
}

function getStreetViewUrl(panoId) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&pano=${panoId}`;
}

function formatDistance(num) {
  let units = "m";

  if (num >= 1000) {
    num = num / 1000;
    units = "km";
  }

  return Math.floor(num) + " " + units;
}

function getRadius(coords1, coords2) {
  return unsafeWindow.google.maps.geometry.spherical.computeDistanceBetween(
    coords1,
    coords2,
  );
}

function initSVS() {
  svs = new unsafeWindow.google.maps.StreetViewService();
}

function main() {
  interceptFetch();
  startObserver();
  window.addEventListener("urlchange", startObserver);

  console.log(`${SCRIPT_NAME} is doing things!`);

  GM_addStyle(`
  .peek-tooltip {
    display: none;
    position: absolute;
    width: 120px;
    background: #323232;
    border-radius: 4px;
    text-align: center;
    padding: 0.5rem;
    font-size: 0.9rem;
    right: 50%;
    bottom: 220%;
    margin-right: -60px;
    opacity: 90%;
    z-index: 4;
  }

  .peek-tooltip:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #323232 transparent transparent transparent;
  }

  [data-pano="true"]:hover .peek-tooltip,
  [data-pano="false"]:hover .peek-tooltip {
    display: block;
  }

  [data-pano="true"] > :first-child {
    cursor: pointer;
    --border-color: #E91E63 !important;
    --border-size-factor: 2 !important;
  }

  [data-pano="false"] > :first-child {
    cursor: initial;
    --border-color: #323232 !important;
    --border-size-factor: 1.5 !important;
  }
`);
}

main();
