// ==UserScript==
// @name         LSS Gitternetz
// @namespace    www.leitstellenspiel.de
// @version      1.2
// @description  Fügt ein Gitternetz zur Karte hinzu und aktiviert es durch Drücken der Rautetaste
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/500979/LSS%20Gitternetz.user.js
// @updateURL https://update.greasyfork.org/scripts/500979/LSS%20Gitternetz.meta.js
// ==/UserScript==

(function() {
  'use strict';

  initializeMap();

  // Funktion zur Initialisierung der Karte
  function initializeMap() {
    // Überprüfen, ob der Kartencontainer bereits existiert
    if (document.getElementById('map') && !window.map) {
      // Basiskartenschicht hinzufügen (URL je nach Bedarf anpassen)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(window.map);
    }

    // Button zum Hinzufügen des Gitternetzes erstellen
    createGridButton();

    // Event Listener für das Drücken der Rautetaste hinzufügen
    document.addEventListener('keydown', function(event) {
      if (event.key === '#') {
        toggleGrid();
      }
    });
  }

  // Funktion zum Erstellen und Anhängen des Gitternetz-Buttons
  function createGridButton() {
    var buttonContainer = document.createElement('li');
    var gridButton = document.createElement('a');
    gridButton.href = '#';
    gridButton.textContent = 'Gitternetz einfügen';
    gridButton.addEventListener('click', function() {
      removeGridFromExistingMap();
      addGridToExistingMap();
    });

    buttonContainer.appendChild(gridButton);

    // Insert the trigger-element to the DOM
    document
      .querySelector('#menu_profile + .dropdown-menu > li.divider')
      ?.before(buttonContainer);
  }

  // Funktion zum Hinzufügen des Gitternetzes zur vorhandenen Karte
  function addGridToExistingMap() {
    //console.log('Füge Gitternetz zur Karte hinzu...');

    if (typeof L === 'undefined' || typeof window.map === 'undefined') {
      console.error('Leaflet oder Karte nicht gefunden');
      return;
    }

    const existingMap = window.map;
    const gridSizeLat = 0.15; // 0,0009=100m|0,004=500m|0,009=1km|0,018=2km|0,045=5km
    const gridSizeLng = gridSizeLat / Math.cos((51.26548639749151 * Math.PI) / 180);
    const startLat = Math.floor(47.22 / gridSizeLat) * gridSizeLat;
    const startLng = Math.floor(5.5 / gridSizeLng) * gridSizeLng;

    // Quadrate für den sichtbaren Kartenausschnitt zeichnen
    for (let lat = startLat; lat <= 55.15; lat += gridSizeLat) {
      for (let lng = startLng; lng <= 15.24; lng += gridSizeLng) {
        L.polygon([
          [lat, lng],
          [lat + gridSizeLat, lng],
          [lat + gridSizeLat, lng + gridSizeLng],
          [lat, lng + gridSizeLng]
        ], { color: 'red', weight: 1, fill: false }).addTo(existingMap);
      }
    }
  }

  // Funktion zum Entfernen des vorhandenen Gitternetzes von der Karte
  function removeGridFromExistingMap() {
    if (typeof L === 'undefined' || typeof window.map === 'undefined') {
      console.error('Leaflet oder Karte nicht gefunden');
      return;
    }

    const existingMap = window.map;

    // Alle Layer von der Karte entfernen (Gitter löschen)
    existingMap.eachLayer(function(layer) {
      if (layer instanceof L.Polygon) {
        existingMap.removeLayer(layer);
      }
    });
  }

  // Funktion zum Umschalten des Gitternetzes durch Drücken der Rautetaste
  function toggleGrid() {
    // Überprüfen, ob das Gitternetz bereits auf der Karte vorhanden ist
    const existingMap = window.map;
    let hasGrid = false;

    existingMap.eachLayer(function(layer) {
      if (layer instanceof L.Polygon) {
        hasGrid = true;
      }
    });

    // Wenn das Gitternetz vorhanden ist, entfernen, andernfalls hinzufügen
    if (hasGrid) {
      removeGridFromExistingMap();
    } else {
      addGridToExistingMap();
    }
  }
})();
