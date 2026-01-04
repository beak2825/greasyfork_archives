// ==UserScript==
// @name         Google Maps → Mapfan
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Add a button to redirect from Google Maps to a specific Mapfan URL.
// @author       Aoi
// @match        https://www.google.com/maps/*
// @icon         https://pngimg.com/uploads/waze/waze_PNG21.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494546/Google%20Maps%20%E2%86%92%20Mapfan.user.js
// @updateURL https://update.greasyfork.org/scripts/494546/Google%20Maps%20%E2%86%92%20Mapfan.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create the button
  const redirectButton = document.createElement('button');
  redirectButton.innerText = 'Mapfan';
  redirectButton.style.padding = '10px 20px'; // Increase padding to make the button bigger
  redirectButton.style.backgroundColor = '#4CAF50';
  redirectButton.style.color = 'white';
  redirectButton.style.border = 'none';
  redirectButton.style.borderRadius = '5px';
  redirectButton.style.cursor = 'pointer';
  redirectButton.style.fontWeight = 'bold'; // Make text bold
  redirectButton.addEventListener('click', redirectToMapfan);

  // Create the container and append the button
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '13px';
  // Get the button position from localStorage
  const storedPosition = localStorage.getItem('mapfanButtonPosition');
  if (storedPosition) {
    const [x, y] = storedPosition.split(',');
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
  } else {
    // Set initial position of the button
    container.style.left = '53%';
    container.style.transform = 'translateX(-50%)';
  }
  container.appendChild(redirectButton);

  // Append the container to the page
  document.body.appendChild(container);

  // Function to redirect to Mapfan
  function redirectToMapfan() {
    // Get the current URL
    const url = window.location.href;

    // Regular expression to extract latitude, longitude, and zoom level from the new Google Maps URL format
    const match = url.match(/@([-0-9.]+),([-0-9.]+),([0-9]+)z/);
    if (!match) {
      alert('Failed to extract latitude, longitude, or zoom level.');
      return;
    }
    const newLatitude = match[1];
    const newLongitude = match[2];
    const zoomLevel = parseInt(match[3], 10);

    // Generate Mapfan URL
    const mapfanUrl = `https://mapfan.com/map/spots/search?c=${newLatitude},${newLongitude},${zoomLevel}&s=std,pc,ja&p=none`;

    // Redirect to Mapfan
    window.location.href = mapfanUrl;
  }

  // Save the button position to localStorage when the button is dragged
  container.addEventListener('mousedown', function(event) {
    const offsetX = event.clientX - container.offsetLeft;
    const offsetY = event.clientY - container.offsetTop;
    document.addEventListener('mousemove', moveButton);

    function moveButton(event) {
      container.style.left = `${event.clientX - offsetX}px`;
      container.style.top = `${event.clientY - offsetY}px`;
    }

    document.addEventListener('mouseup', function() {
      document.removeEventListener('mousemove', moveButton);
      // Save the button position to localStorage
      localStorage.setItem('mapfanButtonPosition', `${container.offsetLeft},${container.offsetTop}`);
    }, { once: true });
  });
})();
