// ==UserScript==
// @name         FR24X
// @namespace    https://github.com/ttheek/FR24X
// @version      1.2.1
// @description  This userscript calculates the distance and bearing between an observer and an aircraft given their respective latitudes, longitudes, and altitudes.
// @author       Ttheek
// @match        https://www.flightradar24.com/*
// @grant        none
// @license      Unlicense license
// @downloadURL https://update.greasyfork.org/scripts/502595/FR24X.user.js
// @updateURL https://update.greasyfork.org/scripts/502595/FR24X.meta.js
// ==/UserScript==

(function() {
    'use strict';    
    const observer = JSON.parse(localStorage.getItem('location'));
    const R = 6371; // Earth's radius in km
    const toRadians = angle => angle * (Math.PI / 180);
    const toDegrees = angle => angle * (180 / Math.PI);

function haversineDistance(lat1, lon1, lat2, lon2) {

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a = Math.sin(deltaPhi / 2) ** 2 +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in kilometers
    return distance;
}

function threeDDistance(lat1, lon1, alt1, lat2, lon2, alt2) {
    const d2d = haversineDistance(lat1, lon1, lat2, lon2);
    const deltaH = Math.abs(alt2 - alt1) / 1000; // convert altitude from meters to kilometers
    const d3d = Math.sqrt(d2d ** 2 + deltaH ** 2);
    return d3d;
}

function initialBearing(lat1, lon1, lat2, lon2) {    

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaLambda = toRadians(lon2 - lon1);

    const x = Math.sin(deltaLambda) * Math.cos(phi2);
    const y = Math.cos(phi1) * Math.sin(phi2) -
              Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

    let bearing = Math.atan2(x, y);
    bearing = toDegrees(bearing);
    bearing = (bearing + 360) % 360; // normalize to 0-360 degrees
    return bearing;
}
    function toRad(degrees){
	return degrees * Math.PI/180;
}

function toDeg(radians){
	return radians * (180/Math.PI);
}
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
  overlay.innerHTML = `
  <button class="toggle-button" id="toggleButton">VIEW <span>Details</span> ▲</button>
  <main class="content">
        <div class="row">
            <p>ALTITUDE</p><div class="data"><strong><span id="altVal" class="data">-</span></strong></div>
        </div>
        <div class="cell row">
            <p>DISTANCE</p><div class="data"><strong><span id="distance" class="data">-</span></strong></div>
        </div>
        <div class="row">
            <p>BEARING</p><div class="data"><strong><span id="bearing" class="data">-</span></strong>&nbsp;<span class="unicode-arrow" id="unicodeArrow">↑</span></div>
        </div>

        <div class="footer">
        <p id="settingsButton">SETTINGS</p></div></main>
        <main class="settings">
                <div class="row">
                    <p>Set your location:</p>
                    <div>
                        <label for="latitude">Latitude:</label>
                        <input type="text" id="latitude" name="latitude">
                    </div>
                    <div>
                        <label for="longitude">Longitude:</label>
                        <input type="text" id="longitude" name="longitude">
                    </div>
                    <div>
                        <label for="altitude">Altitude:</label>
                        <input type="text" id="altitude" name="Altitude">
                    </div>
                    <button id="saveSettings">Save</button>
                    <button id="backButton">Back</button>
                </div>
            </main>
  `;
  document.body.appendChild(overlay);


  const style = document.createElement('style');
  style.innerHTML = `
 .overlay{
  position: fixed;
      bottom: 16px;
      right: 10px;
      z-index: 1000;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
      width: 160px;
      padding: 0;
      margin: 0;
      }
    .content, .settings {
    display: none;
      background-color: #f0f0f0;
      width: 160px;
      color: #393939;
      padding: 10px 0 0 0;
      border: 1px #f0f0f0;
      border-radius: 10px;
      transition: opacity 0.5s ease, max-height 0.5s ease;
    }
    .footer p,
  .content p{
    font-size: 12px;
    color:#6D6D6D;
  }
  .row{
  padding: 0 10px 0 10px;
  }
  .footer .data,
  .content .data{
  width: 160px;
    font-size: 15px;
    color:#393939;
  }
  .content .cell{
   border: none;
    border-top: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
  .bearing-container {
    display: flex;
    align-items: center;
  }
  .unicode-arrow {
    font-size: 20px;
    margin-left: 5px;
    display: inline-block;
    transform-origin: center;
  }
  .footer{
  background-color:#303030;
    border: 1px #303030;
    border-radius: 0 0 10px 10px;
  width: 100%;
  padding:0 10px 0 10px;
  color:#000;
  cursor: pointer;
    text-align: center;
  }
  .expanded .content {
    display: block;
  }
  .toggle-button {
    background-color: #444;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 10px;
    border-radius: 20px;
    color: white;
    display: flex;
    align-items: center;
  }
  .toggle-button span {
    color: #ffd700; /* Gold color */
    margin-left: 5px;
  }
  `;
  document.head.appendChild(style);
    const toggleButton = document.getElementById('toggleButton');
        const content = overlay.querySelector('.content');
    const settings = overlay.querySelector('.settings');
        const settingsButton = document.getElementById('settingsButton');
        const backButton = document.getElementById('backButton');
        const saveSettings = document.getElementById('saveSettings');

        toggleButton.addEventListener('click', () => {
            if (content.style.display === 'block') {
                content.style.display = 'none';
                toggleButton.innerHTML = 'VIEW <span>Details</span> ▲';
            } else {
                content.style.display = 'block';
                toggleButton.innerHTML = 'VIEW <span>Details</span> ▼';
            }
        });
    settingsButton.addEventListener('click', () => {
            content.style.display = 'none';
            settings.style.display = 'block';

            // Load saved location from localStorage
            const savedLocation = JSON.parse(localStorage.getItem('location'));
            if (savedLocation) {
                document.getElementById('latitude').value = savedLocation.lat;
                document.getElementById('longitude').value = savedLocation.lon;
                document.getElementById('altitude').value = savedLocation.alt;
            }
        });

        backButton.addEventListener('click', () => {
            content.style.display = 'block';
            settings.style.display = 'none';
        });

        saveSettings.addEventListener('click', () => {
            const latitude = parseFloat(document.getElementById('latitude').value);
            const longitude = parseFloat(document.getElementById('longitude').value);
            const altitude = parseFloat(document.getElementById('altitude').value);

            if (isNaN(latitude) || isNaN(longitude) || isNaN(altitude)) {
                alert('Please enter valid numbers for latitude, longitude, and altitude.');
                return;
            }

            const location = { lat: latitude, lon: longitude, alt: altitude };
            localStorage.setItem('location', JSON.stringify(location));
            alert('Location saved!');
        });
}

function parseAltitude(altitudeString) {
  return parseFloat(altitudeString.replace(/,/g, '').replace(/[^\d.]/g, ''));
}

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
    }, timeout);
  });
}
    function isBelowHorizon(lat1, lon1, alt1, lat2, lon2, alt2) {
    
    const horizonDistance = altitude => Math.sqrt(2 * R * (altitude / 1000) + (altitude / 1000) ^ 2);

    const distance = haversineDistance(lat1, lon1, lat2, lon2);

    const observerHorizon = horizonDistance(alt1);
    const aircraftHorizon = horizonDistance(alt2);

    // Check if the aircraft is below the horizon
    return distance > (observerHorizon + aircraftHorizon);
}

function spotIt(observer,aircraft){
    const distance = threeDDistance(observer.lat, observer.lon, observer.alt, aircraft.lat, aircraft.lon, aircraft.alt);
    const bearing = initialBearing(observer.lat, observer.lon, aircraft.lat, aircraft.lon);
    const belowHorizon = isBelowHorizon(observer.lat, observer.lon, observer.alt, aircraft.lat, aircraft.lon, aircraft.alt);

 return {d:distance.toFixed(2),b:bearing.toFixed(0),horizon:belowHorizon};
}

function getAircraftData() {
  const selectors = {
    latitude: 'p.text-md.leading-tight.text-gray-1300[data-testid="aircraft-panel__lat"]',
    longitude: 'p.text-md.leading-tight.text-gray-1300[data-testid="aircraft-panel__lng"]',
    altitude: 'p.text-md.leading-tight.text-gray-1300[data-testid="aircraft-panel__calibrated-altitude"]'
  };

  const latitudeElement = document.querySelector(selectors.latitude);
  const longitudeElement = document.querySelector(selectors.longitude);
  const altitudeElement = document.querySelector(selectors.altitude);

  const latitude = latitudeElement ? latitudeElement.textContent || '0' : '0';
  const longitude = longitudeElement ? longitudeElement.textContent || '0' : '0';
  const altitudeString = altitudeElement ? altitudeElement.innerHTML || '0' : '0';
  const altitude = parseAltitude(altitudeString);

  return {
    'lat': parseFloat(latitude),
    'lon': parseFloat(longitude),
    'alt': altitude
  };
}

function updateOverlay(data) {
    const distance = document.getElementById('distance');
    const bearing = document.getElementById('bearing');
    const altVal = document.getElementById('altVal');
    const unicodeArrow = document.getElementById('unicodeArrow');

    if (data) {
        const alt = data.alt;
        const spot = spotIt(observer,data);
        //const belowHorizon = spot.horizon;
        altVal.textContent = `${alt} m (${Math.round(alt*3.281 / 5) * 5} ft)`;
        distance.textContent = spot.d + ' km';
        bearing.textContent = `${spot.b}°`;
        unicodeArrow.style.transform = `rotate(${spot.b}deg)`;
    } else {
        distance.textContent = 'N/A';
        bearing.textContent = 'N/A';
        altVal.textContent = 'N/A';
  }
}

function updateData() {
  const data = getAircraftData();
  //console.log('Updated data:', data);
  updateOverlay(data);
}

async function monitorAircraftData() {
  const selectors = [
    'p.text-md.leading-tight.text-gray-1300[data-testid="aircraft-panel__lat"]',
    'p.text-md.leading-tight.text-gray-1300[data-testid="aircraft-panel__lng"]',
    'p.text-md.leading-tight.text-gray-1300[data-testid="aircraft-panel__calibrated-altitude"]'
  ];

  let elements = await Promise.all(selectors.map(selector => waitForElement(selector).catch(() => null)));

  const observer = new MutationObserver((mutations) => {
    updateData();
  });

  elements.forEach(element => {
    if (element) {
      observer.observe(element, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  });

  // Observe the body for changes to handle disappearance and reappearance of elements
  const bodyObserver = new MutationObserver(async (mutations) => {
    elements = await Promise.all(selectors.map(selector => waitForElement(selector).catch(() => null)));
    elements.forEach(element => {
      if (element) {
        observer.observe(element, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    });
  });

  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

window.onload = function() {
    // Create and display the overlay
    createOverlay();

    // Start monitoring aircraft data
    monitorAircraftData();
};



})();
