// ==UserScript==
// @name        WME GPX/KML/WKT/GML/GeoJSON Overlay
// @namespace   https://www.waze.com/
// @version     1.4
// @description Overlay GPX, KML, WKT, GML or GeoJSON files onto Waze Map Editor
// @author      Dosojintaizo
// @license     MIT/BSD/X11
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @include     https://beta.waze.com/editor*
// @include     https://beta.waze.com/*/editor*
// @require     https://update.greasyfork.org/scripts/520574/1502033/togeojson.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/520575/WME%20GPXKMLWKTGMLGeoJSON%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/520575/WME%20GPXKMLWKTGMLGeoJSON%20Overlay.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (W?.userscripts?.state.isReady) {
    initializeScript();
  } else {
    document.addEventListener("wme-ready", initializeScript, { once: true });
  }

  const overlays = [];

  async function initializeScript() {
    console.log("WME GPX/KML/WKT/GML/GeoJSON Overlay script initialized.");

    const EPSG_4326 = new OpenLayers.Projection("EPSG:4326"); // lat,lon
    const EPSG_4269 = new OpenLayers.Projection("EPSG:4269"); // NAD 83
    const EPSG_3857 = new OpenLayers.Projection("EPSG:3857"); // WGS 84

    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(
      "wme-strava-kml-overlay"
    );
    tabLabel.innerText = "Geo Overlay";
    tabLabel.title =
      "Import and manage GPX/KML/WKT/GML/GeoJSON overlays on the map";

    tabPane.innerHTML = `<div>
            <h5>Geo Overlay</h5>
            <p>Import GPX, KML, WKT, GML or GeoJSON files to overlay them on the map.</p>
            <label for="fileInput" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #0078d7;
                color: white;
                border: 1px solid #005bb5;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                text-align: center;
                transition: background-color 0.3s ease;">
                Select File
            </label>
            <input type="file" id="fileInput" accept=".gpx,.kml,.wkt,.gml,.geojson" style="display: none;" />
            <div id="overlayList" style="margin-top: 20px;"></div>
            <div id="status" style="margin-top: 10px; color: green;"></div>
        </div>`;

    await W.userscripts.waitForElementConnected(tabPane);

    const fileInput = tabPane.querySelector("#fileInput");
    const overlayList = tabPane.querySelector("#overlayList");
    const status = tabPane.querySelector("#status");

    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];

      if (!file) {
        status.textContent = "No file selected.";
        return;
      }

      try {
        const text = await file.text();
        let geoJSON;

        if (file.name.endsWith(".gpx")) {
          geoJSON = parseGPXToGeoJSON(text);
        } else if (file.name.endsWith(".kml")) {
          geoJSON = parseKMLToGeoJSON(text);
        } else if (file.name.endsWith(".geojson")) {
          geoJSON = JSON.parse(text);
        } else if (file.name.endsWith(".wkt")) {
          geoJSON = parseWKTToGeoJSON(text);
        } else if (file.name.endsWith(".gml")) {
          geoJSON = parseGMLToGeoJSON(text);
        } else {
          throw new Error(
            "Unsupported file format. Please upload a GPX, KML, GeoJSON, WKT, or GML file."
          );
        }

        addOverlay(file.name, geoJSON);
      } catch (error) {
        console.error("Error processing file:", error);
        status.textContent = `Error: ${error.message}`;
      }
    });
  }

  function parseGPXToGeoJSON(gpxText) {
    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxText, "application/xml");
    return toGeoJSON.gpx(gpxDoc);
  }

  function parseKMLToGeoJSON(kmlText) {
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, "application/xml");
    return toGeoJSON.kml(kmlDoc);
  }

  function parseWKTToGeoJSON(wktText) {
    if (typeof Wkt !== "undefined") {
      const wkt = new Wkt.Wkt();
      wkt.read(wktText);
      return wkt.toJson();
    }
    throw new Error("WKT parsing requires Wicket.js library.");
  }

  function parseGMLToGeoJSON(gmlText) {
    const parser = new DOMParser();
    const gmlDoc = parser.parseFromString(gmlText, "application/xml");
    const format = new OpenLayers.Format.GML();
    const features = format.read(gmlDoc);
    const geoJSON = new OpenLayers.Format.GeoJSON();
    return geoJSON.write(features);
  }

  function addOverlay(fileName, geoJSON) {
    // Check if an overlay with the same name already exists
    if (overlays.some((overlay) => overlay.name === fileName)) {
      const status = document.getElementById("status");
      status.textContent = `Error: The file "${fileName}" has already been added.`;
      status.style.color = "red";
      return;
    }

    const layerName = fileName;
    const vectorLayer = new OpenLayers.Layer.Vector(layerName, {
      styleMap: new OpenLayers.StyleMap({
        default: new OpenLayers.Style({
          strokeColor: "#FFFF00",
          strokeWidth: 3,
          fillOpacity: 0.4,
        }),
      }),
    });

    geoJSON.features.forEach((feature) => {
      if (feature.geometry && feature.geometry.coordinates) {
        feature.geometry.coordinates = removeZCoordinates(
          feature.geometry.coordinates
        );
      }

      const olGeometry = W.userscripts.toOLGeometry(feature.geometry);
      const vectorFeature = new OpenLayers.Feature.Vector(olGeometry);
      vectorLayer.addFeatures([vectorFeature]);
    });

    W.map.addLayer(vectorLayer);

    const overlay = {
      name: fileName,
      layer: vectorLayer,
      color: "#FFFF00",
      width: 3,
    };

    overlays.push(overlay);
    renderOverlayList();
  }

  function removeZCoordinates(coords) {
    if (Array.isArray(coords[0])) {
      return coords.map(removeZCoordinates);
    } else if (coords.length >= 2) {
      return coords.slice(0, 2);
    }
    return coords;
  }

  function renderOverlayList() {
    const overlayList = document.getElementById("overlayList");
    overlayList.innerHTML = "";

    overlays.forEach((overlay, index) => {
      const item = document.createElement("div");
      item.style.marginBottom = "10px";
      item.style.position = "relative";
      item.style.border = "1px solid #ccc";
      item.style.borderRadius = "8px";
      item.style.padding = "10px";
      item.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      item.style.display = "flex";
      item.style.flexDirection = "column";

      // Top row container
      const topRow = document.createElement("div");
      topRow.style.display = "flex";
      topRow.style.alignItems = "center";
      topRow.style.justifyContent = "space-between";

      const leftContainer = document.createElement("div");
      leftContainer.style.display = "flex";
      leftContainer.style.alignItems = "center";

      const title = document.createElement("span");
      title.textContent = overlay.name;
      title.style.fontWeight = "bold";
      title.style.marginLeft = "10px";
      title.style.marginRight = "10px";

      const checkboxContainer = document.createElement("label");
      checkboxContainer.style.position = "relative";
      checkboxContainer.style.display = "inline-block";
      checkboxContainer.style.width = "24px";
      checkboxContainer.style.height = "24px";
      checkboxContainer.style.border = "2px solid #ccc";
      checkboxContainer.style.borderRadius = "4px";
      checkboxContainer.style.cursor = "pointer";
      checkboxContainer.style.transition = "all 0.3s ease";

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.style.display = "none";
      toggle.checked = true;

      const customCheckbox = document.createElement("span");
      customCheckbox.style.position = "absolute";
      customCheckbox.style.top = "50%";
      customCheckbox.style.left = "50%";
      customCheckbox.style.transform = "translate(-50%, -50%)";
      customCheckbox.style.width = "16px";
      customCheckbox.style.height = "16px";
      customCheckbox.style.backgroundColor = "#FFFF00";
      customCheckbox.style.borderRadius = "2px";
      customCheckbox.style.transition = "background-color 0.3s ease";

      toggle.addEventListener("change", () => {
        overlay.layer.setVisibility(toggle.checked);
        customCheckbox.style.backgroundColor = toggle.checked
          ? overlay.color // Use overlay color when checked
          : "transparent"; // Transparent when unchecked
      });

      checkboxContainer.appendChild(toggle);
      checkboxContainer.appendChild(customCheckbox);

      const iconsContainer = document.createElement("div");
      iconsContainer.style.display = "flex";
      iconsContainer.style.alignItems = "center";

      const gearIcon = document.createElement("span");
      gearIcon.textContent = "🎨";
      gearIcon.style.cursor = "pointer";
      gearIcon.style.fontSize = "20px";
      gearIcon.style.marginLeft = "10px";

      const trashIcon = document.createElement("span");
      trashIcon.textContent = "❌";
      trashIcon.style.cursor = "pointer";
      trashIcon.style.marginLeft = "10px";
      trashIcon.style.fontSize = "10px";
      trashIcon.addEventListener("click", () => {
        W.map.removeLayer(overlay.layer);
        overlays.splice(index, 1);
        renderOverlayList();
      });

      leftContainer.appendChild(checkboxContainer);
      leftContainer.appendChild(title);
      iconsContainer.appendChild(gearIcon);
      iconsContainer.appendChild(trashIcon);

      topRow.appendChild(leftContainer);
      topRow.appendChild(iconsContainer);

      // Settings container
      const settings = document.createElement("div");
      settings.style.display = "none";
      settings.style.marginTop = "10px";
      settings.style.padding = "10px";
      settings.style.border = "1px solid #ccc";
      settings.style.borderRadius = "8px";
      settings.style.backgroundColor = "#f9f9f9";

      const colorRow = document.createElement("div");
      colorRow.style.display = "flex";
      colorRow.style.alignItems = "center";
      colorRow.style.marginBottom = "10px";

      const colorLabel = document.createElement("label");
      colorLabel.textContent = "Line Color:";
      colorLabel.style.marginRight = "10px";

      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = overlay.color;

      colorInput.addEventListener("input", (event) => {
        overlay.color = event.target.value;
        overlay.layer.styleMap.styles.default.defaultStyle.strokeColor =
          overlay.color;
        overlay.layer.redraw();
        customCheckbox.style.backgroundColor = overlay.color;
      });

      colorRow.appendChild(colorLabel);
      colorRow.appendChild(colorInput);

      const widthRow = document.createElement("div");
      widthRow.style.display = "flex";
      widthRow.style.alignItems = "center";

      const widthLabel = document.createElement("label");
      widthLabel.textContent = "Line Width:";
      widthLabel.style.marginRight = "10px";

      const widthInput = document.createElement("input");
      widthInput.type = "number";
      widthInput.value = overlay.width;
      widthInput.min = 1;
      widthInput.max = 10;
      widthInput.style.width = "50px";

      widthInput.addEventListener("input", (event) => {
        overlay.width = parseInt(event.target.value, 10) || 1;
        overlay.layer.styleMap.styles.default.defaultStyle.strokeWidth =
          overlay.width;
        overlay.layer.redraw();
      });

      widthRow.appendChild(widthLabel);
      widthRow.appendChild(widthInput);

      settings.appendChild(colorRow);
      settings.appendChild(widthRow);

      // Toggle settings visibility
      gearIcon.addEventListener("click", () => {
        settings.style.display =
          settings.style.display === "none" ? "block" : "none";
      });

      // Assemble item
      item.appendChild(topRow);
      item.appendChild(settings);
      overlayList.appendChild(item);
    });
  }
})();
