// ==UserScript==
// @name         Copy/paste Geoguessr map data
// @namespace    SlashP
// @version      2.4.1
// @description  Copy latitude, longitude, heading, pitch and zoom information from Geoguessr maps as JSON data. Add or replace locations in maps by pasting JSON data or Google Maps link(s) in map maker.
// @author       SlashP
// @require https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @match        https://www.geoguessr.com/*
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/502472/Copypaste%20Geoguessr%20map%20data.user.js
// @updateURL https://update.greasyfork.org/scripts/502472/Copypaste%20Geoguessr%20map%20data.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let buttonClassName = '';
  let smallButtonClassName = '';
  let primaryButtonClassName = '';
  let secondaryButtonClassName = '';
  let dangerButtonClassName = '';
  const copyDownloadMapDataButtonHtml = () => `<div class="center-content">
  <button id="copyMapData" style="margin-left: 1rem;" class="${buttonClassName} ${secondaryButtonClassName} ${smallButtonClassName}" type="button"><span class="button__animation"></span><span class="button__label">Copy map data to clipboard</span></button>
  <button id="downloadMapData" style="margin-left: 1rem;" class="${buttonClassName} ${secondaryButtonClassName} ${smallButtonClassName}" type="button"><span class="button__animation"></span><span class="button__label">Download map data</span></button><span style="margin-left: 10px;" id="copyMapDataFeedback"></span>
  </div>`;
  const importLocationsFromClipboardButtonHtml = () => `<div class="center-content" id="importLocationsFromClipboardSection"><button id="importLocationsFromClipboard" style="margin-top: 50px;" class="${buttonClassName} ${secondaryButtonClassName} ${smallButtonClassName}" type="button"><span class="button__animation"></span><span class="button__label">Try importing locations from clipboard data</span></button></span></div>`;
  const importLocationsFromFileInputHtml = () => `<div class="center-content" id="importLocationsFromFileSection"><label for="importLocationsFromFile">Try importing locations from file(s)</label><input accept="application/json,text/plain,text/csv" multiple type="file" id="importLocationsFromFile" style="margin-top: 50px;" class="${buttonClassName} ${secondaryButtonClassName} ${smallButtonClassName}" type="button"><span class="button__animation"></span><span class="button__label"></span></button></span><span style="margin-left: 10px;" id="importLocationsFeedback"></span></div>`;
  const addLocationsButtonHtml = () => `<div class="center-content" id="addLocationsSection" style="margin-top: 50px; display: none;"><span id="saveExplanation"></span><br /><div style="margin-top: 30px;"><button id="addLocations" class="${buttonClassName} ${primaryButtonClassName} ${smallButtonClassName}" type="button"><span class="button__animation"></span><span class="button__label">Add locations and save map</span></button><span style="margin-left: 10px;" id="addLocationsFeedback"></span></div></div>`;
  const replaceLocationsButtonHtml = () => `<div class="center-content" id="replaceLocationsSection" style="margin-top: 50px; display: none;"><span id="replaceLocationsExplanation"></span><br /><div style="margin-top: 30px;"><button id="replaceLocations" class="${buttonClassName} ${dangerButtonClassName} ${smallButtonClassName}" type="button"><span class="button__animation"></span><span class="button__label">Replace locations and save map</span></button><span style="margin-left: 10px;" id="replaceLocationsFeedback"></span></div></div>`;
  const buttons = [
    { html: copyDownloadMapDataButtonHtml },
    { html: importLocationsFromClipboardButtonHtml },
    { html: importLocationsFromFileInputHtml },
    { html: addLocationsButtonHtml },
    { html: replaceLocationsButtonHtml },
  ];
  const newMapMakerContainerSelector = "[class*='sidebar_container']";
  const mapId = () => location.href.split('/').pop();

  const getExistingMapData = () => {
    const url = `https://www.geoguessr.com/api/v4/user-maps/drafts/${mapId()}`;
    return fetch(url)
      .then(response => response.json())
      .then(map => ({
        id: map.id,
        name: map.name,
        description: map.description,
        avatar: map.avatar,
        highlighted: map.highlighted,
        published: map.published,
        customCoordinates: map.coordinates
      }));
  }
  const uniqueBy = (arr, selector) => {
    const flags = {};
    return arr.filter(entry => {
      if (flags[selector(entry)]) {
        return false;
      }
      flags[selector(entry)] = true;
      return true;
    });
  };
  const intersectionCount = (arr1, arr2, selector) => {
    var setB = new Set(arr2.map(selector));
    var intersection = arr1.map(selector).filter(x => setB.has(x));
    return intersection.length;
  }
  const exceptCount = (arr1, arr2, selector) => {
    var setB = new Set(arr2.map(selector));
    var except = arr1.map(selector).filter(x => !setB.has(x));
    return except.length;
  }
  const latLngSelector = x => `${x.lat},${x.lng}`;
  const latLngHeadingPitchSelector = x => `${x.lat},${x.lng},${x.heading},${x.pitch}`;
  const pluralize = (text, count) => count === 1 ? text : text + "s";

  const copyMapData = () => {
    getExistingMapData()
      .then(map => {
        const setMapFeedbackText = text => { document.getElementById("copyMapDataFeedback").innerText = text; }
        navigator.clipboard.writeText(JSON.stringify(map)).then(() => {
          setMapFeedbackText("Map data copied to clipboard.");
          setTimeout(() => setMapFeedbackText(""), 8000);
        });
      });
  }
  let locations = [];
  let existingMap = null;
  const isFullStreetViewUrl = url => url.match(/https:\/\/www\.google\.[a-z.]+\/maps\/@/) !== null;

  const isLineValidCsv = line => {
    const commaSeparatedValues = line?.split(',') || [];
    return commaSeparatedValues.length >= 2 && parseFloat(commaSeparatedValues[0]) > -90 && parseFloat(commaSeparatedValues[0]) < 90 && parseFloat(commaSeparatedValues[1]) > -180 && parseFloat(commaSeparatedValues[1]) < 180;
  }

  const isCsvTextWithLocations = lines => {
    const firstLine = lines?.split('\n')[0];
    return isLineValidCsv(firstLine);
  }

  const importLocationsFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
      if (isFullStreetViewUrl(text) || isCsvTextWithLocations(text)) {
        importLocationsFromLinesInClipboard(text);
      } else {
        importLocations(text);
      }
    });
  }

  const csvLocation = l => ({
    lat: parseFloat(l.split(',')[0]),
    lng: parseFloat(l.split(',')[1])
  });

  const getLocationsFromLines = linkText => {
    const lines = linkText.split('\n');
    const extractNumberFromParameter = (url, param) => parseFloat(url.split(",").slice(2).filter(x => x.indexOf(param) !== -1)[0]);
    let coordinates = [];
    for (let line of lines) {
      if (isLineValidCsv(line)) {
        coordinates.push(csvLocation(line));
        continue;
      }

      if (!isFullStreetViewUrl(line)) {
        continue;
      }

      const lng = parseFloat(line.split(",")[1]);
      const lat = parseFloat(line.split(",")[0].split("@")[1]);
      const heading = extractNumberFromParameter(line, "h");
      const zoom = (90 - extractNumberFromParameter(line, "y")) / 90 * 2.75; // guesstimated "max" value.
      const pitch = extractNumberFromParameter(line, "t") - 90;
      const panoId = line.split("!1s")[1].split("!2e")[0];
      if (!lng || !lat || !heading || !panoId) {
        continue;
      }

      const coordinate = {
        heading: heading,
        pitch: pitch || 0,
        zoom: zoom || 0,
        panoId: panoId,
        countryCode: null,
        stateCode: null,
        lat: lat,
        lng: lng
      };
      coordinates.push(coordinate);
    }

    return coordinates;
  }

  const getLocationsFromCsv = linkText => linkText.split('\n')?.filter(isLineValidCsv).map(csvLocation);

  const importLocationsFromLinesInClipboard = (linkText) => {
    const coordinates = getLocationsFromLines(linkText);
    const mapText = JSON.stringify({
      customCoordinates: coordinates
    });
    importLocations(mapText);
  }
  const setImportLocationsFeedbackText = text => { document.getElementById("importLocationsFeedback").innerText = text; }
  const arrayOrCustomCoordinates = obj => Array.isArray(obj) ? obj : obj?.customCoordinates;

  const importLocations = (text, mapOrLocationArray) => {
    try {
      getExistingMapData()
        .then(map => {
          existingMap = {
            ...map,
            customCoordinates: map.customCoordinates || []
          };
          locations = arrayOrCustomCoordinates(mapOrLocationArray) || arrayOrCustomCoordinates(JSON.parse(text));
          if (!locations?.length) {
            setImportLocationsFeedbackText("Invalid map data.");
            return;
          }
          const uniqueExistingLocations = uniqueBy(existingMap.customCoordinates, latLngSelector);
          const uniqueImportedLocations = uniqueBy(locations, latLngSelector);
          const uniqueLocations = uniqueBy([...uniqueExistingLocations, ...uniqueImportedLocations], latLngSelector);
          const numberOfLocationsBeingAdded = uniqueLocations.length - uniqueExistingLocations.length;
          const numberOfUniqueLocationsImported = uniqueImportedLocations.length;
          const numberOfExactlyMatchingLocations = intersectionCount(uniqueExistingLocations, uniqueImportedLocations, latLngHeadingPitchSelector);
          const numberOfLocationsWithSameLatLng = intersectionCount(uniqueExistingLocations, uniqueImportedLocations, latLngSelector);
          const numberOfLocationEditions = numberOfLocationsWithSameLatLng - numberOfExactlyMatchingLocations;
          const numberOfLocationsNotInImportedList = exceptCount(uniqueExistingLocations, uniqueImportedLocations, latLngSelector);
          const numberOfLocationsNotInExistingMap = exceptCount(uniqueImportedLocations, uniqueExistingLocations, latLngSelector);

          if (numberOfExactlyMatchingLocations === uniqueExistingLocations.length && uniqueExistingLocations.length === uniqueImportedLocations.length) {
            setImportLocationsFeedbackText("All locations are exactly the same.");
            return;
          }
          if (numberOfExactlyMatchingLocations === uniqueExistingLocations.length && uniqueExistingLocations.length === uniqueImportedLocations.length) {
            setImportLocationsFeedbackText("All locations are exactly the same.");
            return;
          }

          const maximumNumberOfLocations = 105000;
          if (numberOfUniqueLocationsImported > maximumNumberOfLocations) {
            setImportLocationsFeedbackText(`You can't import more than ${maximumNumberOfLocations} locations.`);
            return;
          }

          if (numberOfLocationsBeingAdded > 0 && uniqueLocations.length < maximumNumberOfLocations) {
            document.getElementById("saveExplanation").innerText = `Add ${numberOfLocationsBeingAdded} locations to this map. New count: ${uniqueLocations.length}. Any manual changes applied after this page was loaded will be lost.`;
            document.getElementById("addLocationsSection").style.display = "block";
          }

          document.getElementById("replaceLocationsExplanation").innerHTML = `Replace the locations in the map. New count: ${numberOfUniqueLocationsImported}. Any manual changes applied after this page was loaded will be lost.<br>
<span style="color: red;">${numberOfLocationsNotInImportedList} ${pluralize("deletion", numberOfLocationsNotInImportedList)}</span><br>
<span style="color: green;">${numberOfLocationsNotInExistingMap} ${pluralize("addition", numberOfLocationsNotInExistingMap)}</span><br>
<span style="color: cornflowerblue;">${numberOfLocationEditions} ${pluralize("edition", numberOfLocationEditions)} (different heading/pitch)</span><br>
<span style="color: coral;">${numberOfExactlyMatchingLocations} exactly same</span>`;
          document.getElementById("replaceLocationsSection").style.display = numberOfUniqueLocationsImported >= 0 ? "block" : "none";

          document.getElementById("importLocationsFromClipboardSection").style.display = "none";
          document.getElementById("importLocationsFromFileSection").style.display = "none";
        }).catch(error => {
          setImportLocationsFeedbackText("Invalid map data. " + error)
          console.error(error);
        });
    } catch (err) {
      console.log(err);
      setImportLocationsFeedbackText("Invalid map data. " + err);
    }
  }

  const addLocations = () => {
    if (!locations?.length || !existingMap) {
      return;
    }
    const setAddLocationsFeedbackText = text => { document.getElementById("addLocationsFeedback").innerText = text; }
    // take unique locations based on lat/lng, keep first entry/original.
    const uniqueLocations = uniqueBy([...existingMap.customCoordinates, ...locations], latLngSelector);
    const newMap = {
      ...existingMap,
      customCoordinates: uniqueLocations
    };
    updateMap(newMap, setAddLocationsFeedbackText);
  }

  const replaceLocations = () => {
    if (!locations?.length || !existingMap) {
      return;
    }
    const setReplaceLocationsFeedbackText = text => { document.getElementById("replaceLocationsFeedback").innerText = text; }
    // take unique locations based on lat/lng, keep first entry/original.
    const uniqueLocations = uniqueBy(locations, latLngSelector);
    const newMap = {
      ...existingMap,
      customCoordinates: uniqueLocations
    };
    updateMap(newMap, setReplaceLocationsFeedbackText);
  }

  function updateMap(newMap, setFeedback) {
    const url = `https://www.geoguessr.com/api/v4/user-maps/drafts/${mapId()}`;
    const httpMethod = 'PUT';
    fetch(url, {
      method: httpMethod,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMap)
    }).then(response => {
      if (!response.ok) {
        setFeedback("Something went wrong when calling the server.");
        return;
      }
      return response.json();
    }).then(mapResponse => {
      if (mapResponse.id || mapResponse.message === "OK") {
        setFeedback(`Map updated. Reloading page in 5 seconds.`);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    });
  }

  const downloadMapData = () => {
    getExistingMapData()
      .then(map => {
        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(map));
        a.download = `${map.name}.json`;
        a.click();
      })
  }

  async function handleFileImportChanged() {
    try {
      let map = {};
      for (let file of this.files) {
        const content = await readFileContent(file);
        if (isFullStreetViewUrl(content) || isCsvTextWithLocations(content)) {
          const coordinates = getLocationsFromLines(content);
          map = {
            ...map,
            customCoordinates: [...map.customCoordinates || [], ...coordinates]
          }
        } else {
          map = {
            ...map,
            customCoordinates: [...map.customCoordinates || [], ...arrayOrCustomCoordinates(JSON.parse(content))]
          }
        }
      }
      importLocations(null, map);
    } catch (err) {
      console.log(err);
      setImportLocationsFeedbackText("Importing failed. " + err);
    }
  }

  function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  const style = document.createElement('style');
  style.innerHTML = `
      .copy-paste-container {
        position: absolute;
        bottom: 0;
        padding: 20px;
      }
    `;
  document.head.appendChild(style);
  const tryAddButtons = () => {
    setTimeout(async () => {
      if (new RegExp('^https:\/\/www.geoguessr.com\/map-maker/').test(window.location.href)) {
        const buttonParentElement = document.createElement("div");
        document.querySelector(newMapMakerContainerSelector).appendChild(buttonParentElement);
        buttonParentElement.classList.add("copy-paste-container");
        buttonClassName = await requireClassName("button_button__");
        smallButtonClassName = await requireClassName("button_sizeSmall__");
        primaryButtonClassName = await requireClassName("button_variantPrimary__");
        secondaryButtonClassName = await requireClassName("button_variantSecondary__");
        dangerButtonClassName = await requireClassName("button_variantDanger__");
        for (let button of buttons) {
          const buttonElement = document.createElement("span");
          buttonElement.innerHTML = button.html();
          buttonParentElement.appendChild(buttonElement);
        }
        document.getElementById("copyMapData").onclick = copyMapData;
        document.getElementById("downloadMapData").onclick = downloadMapData;
        document.getElementById("importLocationsFromClipboard").onclick = importLocationsFromClipboard;
        document.getElementById("importLocationsFromFile").addEventListener("change", handleFileImportChanged, false);
        document.getElementById("addLocations").onclick = addLocations;
        document.getElementById("replaceLocations").onclick = replaceLocations;

        document.addEventListener('paste', e => {
          importLocationsFromClipboard();
        });
      }
    }, 250);
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      tryAddButtons();
    }
  }).observe(document, { subtree: true, childList: true });
  tryAddButtons();
})();