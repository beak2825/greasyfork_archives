// ==UserScript==
// @name         GeoGuessr Path Logger
// @version      0.4.4
// @description  Adds a trace of where you have been to GeoGuessr's results screen
// @match        https://www.geoguessr.com/*
// @author       victheturtle#5159
// @license      MIT
// @run-at       document-start
// @require      https://openuserjs.org/src/libs/xsanda/Run_code_as_client.js
// @require      https://openuserjs.org/src/libs/xsanda/Google_Maps_Promise.js
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/460683/GeoGuessr%20Path%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/460683/GeoGuessr%20Path%20Logger.meta.js
// ==/UserScript==
// credits to xsanda (https://openuserjs.org/users/xsanda) for the original GeoGuessr Path Logger script

/*jshint esversion: 6 */

googleMapsPromise.then(() => runAsClient(() => {
  const google = window.google;

  const KEEP_FOR = 1000 * 60 * 60 * 24 * 7 * 4; // 4 weeks

  // Keep a track of the lines drawn on the map, so they can be removed
  let markers = [];

  const isGamePage = () => location.pathname.includes("/challenge/") || location.pathname.includes("/results/") || location.pathname.includes("/game/") ||
        location.pathname.includes("/duels/") || location.pathname.includes("/team-duels/");

  // Detect if only a single result is shown
  const singleResult = () => !!document.querySelector('div[class^="round-result_distanceIndicatorWrapper__"]') ||
        (!!document.querySelector('[class^="overlay_backdrop__"], [class^="overlay_overlay__"]') && !document.querySelector('[class^=new-round_roundNumber__]') &&
        !document.querySelector('[class^=new-game_container__]')) ||
        (!!document.querySelector('div[class^="result-layout_root__"]') && !document.querySelector('div[class^="result-layout_content"]'));

  // Detect if a results screen is visible, so the traces should be shown
  const resultShown = () => singleResult() || !!document.querySelector('div[class^="result-overlay_overlayTotalScore__"]') || location.href.includes('results') ||
        !!document.querySelector('[class^="game-summary_container__"]') || !!document.querySelector('div[class^="result-layout_root__"]') || location.href.includes('summary');

  // Keep a track of whether we are in a round already
  let inGame = false;

  // Get the game ID, for storing the trace against
  const id = () => {
      const split = location.href.split("/")
      if (split[split.length-1] == "summary") return split[split.length-2]
      else return split[split.length-1]
  }
  const roundNumber = () => {
    const el = document.querySelector('[data-qa=round-number] :nth-child(2)');
    const el2 = document.querySelector('[class^=round-score_roundNumber__]');
    return el ? parseInt(el.innerHTML) : (el2 ? parseInt(el2.innerHTML.split(" ")[1]) : 0);
  };
  const roundID = (n, gameID) => (gameID || id()) + '-' + (n || roundNumber());

  // Get the location of the street view
  const getPosition = sv => ({
    lat: sv.position.lat(),
    lng: sv.position.lng(),
  });

  // Record the time a game was played
  const updateTimestamp = () => {
    const timestamps = JSON.parse(localStorage.timestamps || "{}");
    timestamps[id()] = Date.now();
    localStorage.timestamps = JSON.stringify(timestamps);
  };

  // Remove all games older than a week
  const clearOldGames = () => {
    const timestamps = JSON.parse(localStorage.timestamps || "{}");
    // Delete all games older than a week
    const cutoff = Date.now() - KEEP_FOR;
    for (const [gameID, gameTime] of Object.entries(timestamps)) {
      if (gameTime < cutoff) {
        delete timestamps[gameID];
        Object.keys(localStorage).filter(key => key.startsWith(gameID)).forEach(key => delete localStorage[key]);
      }
    }
    localStorage.timestamps = JSON.stringify(timestamps);
  };

  const R = 6371.071; // radius of the Earth
  const distance = (mk1lat, mk1lng, mk2lat, mk2lng) => {
    const rlat1 = mk1lat * (Math.PI / 180)
    const rlat2 = mk2lat * (Math.PI / 180)
    const difflat = rlat2 - rlat1
    const difflon = (mk2lng - mk1lng) * (Math.PI / 180);
    const km = 2*R * Math.asin(Math.sqrt(
        Math.sin(difflat/2) * Math.sin(difflat/2) +
        Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon/2) * Math.sin(difflon/2)
    ))
    return km;
  }

  clearOldGames();

  // Keep a track of the current round’s route
  let route;

  let currentRound = undefined;

  // Keep a track of the start location for the current round, for detecting the return to start button
  let start;
  let lastPosition = undefined;

  // Handle the street view being navigated
  const onMove = (sv) => {
    try {
      if (!isGamePage()) return;

      const position = getPosition(sv);

      if (!inGame) {
        // Do nothing if the map is being updated in the background, e.g. on page load while the results are still shown
        if (resultShown()) return;
        // otherwise start the round
        inGame = true;
        start = position;
        route = [];
      } else if (currentRound !== roundID()) {
        currentRound = roundID();
        start = position;
        route = [];
      }

      // If we’re at the start or moving too far in one click, assume the flag or checkpoint feature were used and begin a new trace
      if (position.lat == start.lat && position.lng == start.lng ||
          lastPosition != undefined && distance(lastPosition.lat, lastPosition.lng, position.lat, position.lng) > 0.2) {
          start = position;
          route.push([]);
      }

      lastPosition = position;

      // Add the location to the trace
      route[route.length - 1].push(position);
    }
    catch (e) {
      console.error("GeoGuessr Path Logger Error:", e);
    }
  };

  // The geometry API isn’t loaded unless a Street View has been displayed since the last load.
  const loadGeometry = () => new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[src^='https://maps.googleapis.com/maps-api-v3/api/js/']")
    if (!existingScript) reject("No Google Maps loaded yet");
    const libraryURL = existingScript.src.replace(/(.+\/)(.+?)(\.js)/, '$1geometry$3');
    document.head.appendChild(Object.assign(document.createElement("script"), {
      onload: resolve,
      type: "text/javascript",
      src: libraryURL,
    }));
  });

  const onMapUpdate = (map) => {
    try {
      if (!isGamePage()) return;

      if (!google.maps.geometry) {
        loadGeometry().then(() => onMapUpdate(map));
        return;
      }

      // Hide all traces
      markers.forEach(m => m.setMap(null));
      // If we’re looking at the results, draw the traces again
      if (resultShown()) {
        const t3 = Date.now();
        // If we were in a round the last time we checked, then we need to save the route
        if (inGame) {
          // encode the route to reduce the storage required.
          const encodedRoutes = route.map(path => google.maps.geometry.encoding.encodePath(path.map(point => new google.maps.LatLng(point))));
          localStorage[roundID()] = JSON.stringify(encodedRoutes);
          updateTimestamp();
        }
        inGame = false;
        // Show all rounds for the current game when viewing the full results
        const roundsToShow = singleResult() ? [roundID()] : Object.keys(localStorage).filter(map => map.startsWith(id()));
        markers = roundsToShow
          .map(key => localStorage[key]) // Get the map for this round
          .filter(r => r) // Ignore missing rounds
          .flatMap(r =>
            // Render each trace within each round as a red line
            JSON.parse(r).map(polyline =>
              new google.maps.Polyline({
                path: google.maps.geometry.encoding.decodePath(polyline),
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              })
            )
          );

        // Add all traces to the map
        markers.forEach(m => m.setMap(map));
      }
    } catch (e) {
      console.error("GeoGuessr Path Logger Error:", e);
    }
  };

  // When a StreetViewPanorama is constructed, add a listener for moving
  const oldSV = google.maps.StreetViewPanorama;
  google.maps.StreetViewPanorama = Object.assign(function (...args) {
    const res = oldSV.apply(this, args);
    this.addListener('position_changed', () => onMove(this));
    return res;
  }, {
    prototype: Object.create(oldSV.prototype)
  });

  // When a Map is constructed, add a listener for updating
  const oldMap = google.maps.Map;
  google.maps.Map = Object.assign(function (...args) {
    const res = oldMap.apply(this, args);
    this.addListener('idle', () => onMapUpdate(this));
    return res;
  }, {
    prototype: Object.create(oldMap.prototype)
  });
}));
