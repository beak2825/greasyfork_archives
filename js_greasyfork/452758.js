// ==UserScript==
// @name         Geoguessr Learning Mode
// @description  Lets you observe the panorama and the location on the map at the same time, and optionally hide the panorama initially
// @version      1.2.1
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @require      https://openuserjs.org/src/libs/xsanda/Run_code_as_client.js
// @require      https://openuserjs.org/src/libs/xsanda/Google_Maps_Promise.js
// @icon         https://www.svgrepo.com/show/245771/learning.svg
// @run-at       document-start
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452758/Geoguessr%20Learning%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/452758/Geoguessr%20Learning%20Mode.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

const classicGameGuiHTML = `
<div class="section_sectionHeader__WQ7Xz section_sizeMedium__yPqLK"><div class="bars_root___G89E bars_center__vAqnw"><div class="bars_before__xAA7R bars_lengthLong__XyWLx"></div><span class="bars_content__UVGlL"><h3>Training Mode settings</h3></span><div class="bars_after__Z1Rxt bars_lengthLong__XyWLx"></div></div></div>
<div class="start-standard-game_settings__x94PU">
  <div style="display: flex; justify-content: space-around;">
    <div style="display: flex; align-items: center;">
      <span class="game-options_optionLabel__dJ_Cy" style="margin: 0; padding-right: 6px;">Enabled</span>
      <input type="checkbox" id="enableTrainingMode" onclick="localStorage.setItem('TrainingModeActive', this.checked ? '1' : '0')" class="toggle_toggle__hwnyw">
    </div>

    <div style="display: flex; align-items: center;">
      <span class="game-options_optionLabel__dJ_Cy" style="margin: 0; padding-right: 6px;">Start with panorama hidden</span>
      <input type="checkbox" id="enableTrainingModeOptionHidePanorama" onclick="localStorage.setItem('TrainingModeOptionHidePanorama', this.checked ? '1' : '0')" class="toggle_toggle__hwnyw">
    </div>
  </div>
</div>
`

const checkInsertGui = () => {
    if (document.querySelector('.radio-box_root__ka_9S') && document.querySelector('#enableTrainingMode') === null) {
        let prefix = (document.getElementById("blinkTime") != null) ? "<div>&nbsp;</div>": "";
        document.querySelector('.section_sectionMedium__yXgE6').insertAdjacentHTML('beforeend', prefix+classicGameGuiHTML);
        if (localStorage.getItem('TrainingModeActive') === '1') {
            document.querySelector('#enableTrainingMode').checked = true;
        }
        if (localStorage.getItem('TrainingModeOptionHidePanorama') === '1') {
            document.querySelector('#enableTrainingModeOptionHidePanorama').checked = true;
        }
    }
}

let observer = new MutationObserver((mutations) => { checkInsertGui(); });

observer.observe(document.body, {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false
});

googleMapsPromise.then(() => runAsClient(() => {
  const google = window.google;

  const VERBOSE = 0;

  let done = false;
  let aborted = false;
  let isPanoVisible = true;

  let game = null;
  let coords = [null,null];
  let totalRound = sessionStorage.getItem("TrainingModeRound") * 1;

  let active = localStorage.getItem("TrainingModeActive") * 1;
  let optionHidePanorama = localStorage.getItem("TrainingModeOptionHidePanorama") * 1;

  function isGamePage() {
	if (VERBOSE >= 2) console.log("detectGamePage");
    return location.pathname.startsWith("/game/");
  };

  const resultShown = () => !!document.querySelector('[data-qa=result-view-bottom]') || location.href.includes('results');

  function cleanStatusBar() {
    if (VERBOSE >= 2) console.log("cleanStatusBar");
    let statusBar = document.querySelector('.status_inner__1eytg');
    while (statusBar.children.length > 2) statusBar.children[2].remove();
    statusBar.children[1].children[1].innerText = "" + totalRound;
  }

  function pinMap() {
    document.querySelector("button[class*='guess-map__control--sticky']").click();
  }

  function getGame() {
    if (VERBOSE >= 2) console.log("getGame");
    try {
      game = JSON.parse(document.getElementById("__NEXT_DATA__").innerHTML).props.pageProps.game;
      return game;
    } catch (err) { return null; }
  }

  function getCoords() {
    coords = game.rounds[game.round-1];
    return coords
  }

  function getRoundNumber() {
    return game.round;
  }

  function instaSend() {
    if (VERBOSE >= 2) console.log("Insta send");
    if (game.round == 5) {
        let playMap = "https://www.geoguessr.com/maps/"+game.map;
        window.open(playMap, "_self");
        return;
    }
    fetch("https://www.geoguessr.com/api/v3/games/"+game.token, {
      method: "POST",
      body: JSON.stringify({ lat: -89, lng: 0, timedOut: false, token: game.token }),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(ans => ans.json())
    .then(ans => "https://www.geoguessr.com/game/"+ans.token)
    .catch(err => {console.log(err)});
  }

  function hidePanorama() {
    document.querySelector('.mapsConsumerUiSceneInternalCoreScene__root').style.filter = 'brightness(0%)';
    isPanoVisible = false;
  }

  function showPanorama() {
    if (VERBOSE >= 2) console.log("showPanorama");
    document.querySelector('.mapsConsumerUiSceneInternalCoreScene__root').style.filter = 'brightness(100%)';
    isPanoVisible = true;
    replaceGuessButton();
  }

  async function generateSeed(rules) {
    if (VERBOSE >= 2) console.log("generateSeed");
    let url = "https://www.geoguessr.com/api/v3/games";
    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(rules),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(ans => ans.json())
    .then(ans => "https://www.geoguessr.com/game/"+ans.token)
  }

  function goToNextRound() {
    if (VERBOSE >= 2) console.log("goToNextRound");
    if (getRoundNumber() < 4) {
        location.reload();
    } else {
        fetch(location.href); // to make geoguessr think we moved to round 5
        document.getElementById("training_mode_green_button").innerText = "...";
        let playMap = "https://www.geoguessr.com/maps/"+game.map;//+"/play";
        const rules = {
            "map": game.map,
            "type": game.type,
            "timeLimit": game.settings.timeLimit,
            "forbidMoving": game.settings.forbidMoving,
            "forbidZooming": game.settings.forbidZooming,
            "forbidRotating": game.settings.forbidRotating
        }
        generateSeed(rules)
        .then(newSeed => {window.location = newSeed;})
        .catch(err => window.open(playMap, "_self"))
    }
  }

  function replaceGuessButton() {
    let buttonLine = document.querySelector(".guess-map__guess-button");
    let text = (isPanoVisible) ? "Go to next round" : "Reveal panorama";
    let buttonHTML = `<button type="button" class="button_button__CnARx button_variantPrimary__xc8Hp">
      <div class="button_wrapper__NkcHZ">
       <span class="button_label__kpJrA" id="training_mode_green_button">${text}</span>
      </div>
     </button>`;
    buttonLine.firstChild.remove();
    buttonLine.innerHTML = buttonHTML;
    buttonLine.firstChild.onclick = (isPanoVisible) ? goToNextRound : showPanorama;
  }

  let markers = []; // Keep track of the lines drawn on the map, so they can be removed
  let polylines; // Keep track of the current round's polylines

  const addCirclePolyline = (center, radius) => {
    polylines.push([]);
    const R = 6378100;
    for (let i = 0; i <= 400; i++) {
      let theta = i/400 * 2 * Math.PI;
      let newLat = center.lat + (radius * Math.sin(theta) / R) * (180 / Math.PI);
      let newLng = center.lng + (radius * Math.cos(theta) / R) * (180 / Math.PI) / Math.cos(center.lat * Math.PI / 180);
      polylines[polylines.length - 1].push({lat:newLat, lng:newLng});
    }
  };

  const markLocation = (position, map) => {
    if (VERBOSE >= 2) console.log("Drawing circles for location "+JSON.stringify(position));
    polylines = [];
    for (let radius of [150, 1000, 200000]) {
      addCirclePolyline(position, radius);
    }
    markers.forEach(m => m.setMap(null));
    markers = polylines.map(polyline => new google.maps.Polyline({
      path: polyline.map(point => new google.maps.LatLng(point)),
      geodesic: true,
      strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2,
      clickable: false,
    }));
    markers.forEach(m => m.setMap(map));
  }

  // The geometry API isn’t loaded unless a Street View has been displayed since the last load.
  const loadGeometry = () => new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[src^='https://maps.googleapis.com/maps-api-v3/api/js/']")
    if (!existingScript) reject("No Google Maps loaded yet");
    const libraryURL = existingScript.src.replace(/(.+\/)(.+?)(\.js)/, '$1geometry$3');
    document.head.appendChild(Object.assign(document.createElement("script"), {
      onload: resolve, type: "text/javascript", src: libraryURL,
    }));
  });

  const onMapUpdate = (map) => {
    try {
      if (aborted || !active) return;

      if (!google.maps.geometry) {
        if (VERBOSE >= 1) console.log("not loaded geometry");
        loadGeometry().then(() => onMapUpdate(map));
        return;
      }

      if (resultShown() || !isGamePage()) {
        markers.forEach(m => m.setMap(null));
        done = false;
        if (VERBOSE >= 1) console.log("Not in a round, done set to false");
        return;
      }

      if (done) {
        if (VERBOSE >= 1) console.log("Already done, ignoring");
        return;
      }

      done = true;
      totalRound += 1;
      sessionStorage.setItem("TrainingModeRound", totalRound);

      if (optionHidePanorama) hidePanorama();
      cleanStatusBar();

      if (getGame() == null) { // typically happens at round 1 when you start a new seed
        aborted = true;
        sessionStorage.setItem("TrainingModeRound", 0);
        if (VERBOSE >= 1) console.log("Failed to getMapData");
        location.reload();
        return;
      }

      getCoords();
      pinMap();
      replaceGuessButton();

      instaSend();
      markLocation(coords, map);
    }
    catch (e) {
      done = false;
      console.log("GeoGuessr location finder error:"+ e);
    }
  };

  // When a Map is constructed, add an observer for updating
  const oldMap = google.maps.Map;
  google.maps.Map = Object.assign(function (...args) {
    const res = oldMap.apply(this, args);
    done = false;

    let observer = new MutationObserver((mutations) => {
      onMapUpdate(this)
    });

    observer.observe(document.body, {
      characterDataOldValue: false,
      subtree: true,
      childList: true,
      characterData: false
    });
    return res;
  }, {
    prototype: Object.create(oldMap.prototype)
  });

  document.addEventListener("keydown", (e) => {if(e.key == " ") try {document.querySelector(".guess-map__guess-button").firstChild.click()} catch (err) {}});
}));
