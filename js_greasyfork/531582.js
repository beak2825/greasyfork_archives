// ==UserScript==
// @name WorldGuessr Coordinate Finder
// @namespace http://tampermonkey.net/
// @version 1.5
// @description Adds a button to get latitude and longitude in WorldGuessr and copy it to clipboard, plus a minimap when coordinates are available
// @author Projectornist
// @license NO REDISTRIBUTION OR ELSE
// @match https://www.worldguessr.com/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531582/WorldGuessr%20Coordinate%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/531582/WorldGuessr%20Coordinate%20Finder.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    #getCoordsButton {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: black;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      z-index: 9999;
    }
    #getCoordsButton:hover {
      background-color: #333;
    }
    #coordsDisplay {
      position: fixed;
      top: 70px;
      right: 20px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border-radius: 5px;
      font-size: 14px;
      display: none;
      z-index: 9999;
    }
    #googleMapContainer {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 300px;
      height: 300px;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 10px;
      overflow: hidden;
      display: none;
      z-index: 9999;
    }
    #googleMapContainer iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    #googleMapContainer .closeBtn {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #333;
      color: white;
      padding: 5px;
      cursor: pointer;
    }
  `);

  if (document.getElementById('getCoordsButton')) {
    return;
  }

  const button = document.createElement('button');
  button.id = 'getCoordsButton';
  button.textContent = 'Get Coordinates';
  document.body.appendChild(button);

  const coordsDisplay = document.createElement('div');
  coordsDisplay.id = 'coordsDisplay';
  document.body.appendChild(coordsDisplay);

  const mapContainer = document.createElement('div');
  mapContainer.id = 'googleMapContainer';
  document.body.appendChild(mapContainer);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'X';
  closeBtn.className = 'closeBtn';
  mapContainer.appendChild(closeBtn);

  function getCoordinates() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const long = urlParams.get('long');

    if (lat && long) {
      coordsDisplay.textContent = `Latitude: ${lat}, Longitude: ${long}`;
      coordsDisplay.style.display = 'block';
      showMinimap(lat, long);
      copyToClipboard(`${lat}, ${long}`);
    } else {
      coordsDisplay.textContent = 'Coordinates not found';
      coordsDisplay.style.display = 'block';
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
    }).catch(err => {
    });
  }

  function showMinimap(lat, long) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.google.com/maps?q=${lat},${long}&z=18&output=embed`;

    mapContainer.style.display = 'block';

    mapContainer.appendChild(iframe);

    closeBtn.onclick = () => {
      mapContainer.style.display = 'none';
      mapContainer.innerHTML = '';
      mapContainer.appendChild(closeBtn);
    };
  }

  function checkCoordinatesAvailability() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const long = urlParams.get('long');

    if (lat && long) {
      button.style.display = 'inline-block';
    } else {
      button.style.display = 'none';
    }
  }

  setInterval(checkCoordinatesAvailability, 1000);

  button.addEventListener('click', function() {
    getCoordinates();
  });

})();
