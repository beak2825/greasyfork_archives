// ==UserScript==
// @name         Shoplifting alert + PDA
// @namespace    http://torn.city.com.dot.com.com
// @version      2.0.1
// @description  Display a red square if cameras or guards are down in Big Al's. Clicking the red square removes notification for 30 minutes.
// @author       Adobi + IronHydeDragon[2428902] for PDA userbility
// @match        *://*
// @match        *://*/*
// @match        https://*
// @match        https://*/*
// @match        https://www.torn.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481819/Shoplifting%20alert%20%2B%20PDA.user.js
// @updateURL https://update.greasyfork.org/scripts/481819/Shoplifting%20alert%20%2B%20PDA.meta.js
// ==/UserScript==

(function () {
  ('use strict');
  console.log("🚨 Big Al's Security Script is ON!"); // TEST

  ///////////////////////////////// USER DEFINED VARIABLES /////////////////////////////////

  const timeOut = 1800 * 1000; // 30 minute time out when you click red square. Change if you want.
  const copyCat = true; // Set to true if you want a message put in  your clipboard when you click the red square.
  // Purpose of message is to paste in faction chat to notify your friends that they should shoplift.
  // Message below, change as you wish.
  const baseMessage =
    'Shoplift now for special ammo https://www.torn.com/loader.php?sid=crimes#/shoplifting';
  const guardsDown = "Guards are gone at Big Al's - ";
  const camerasDown = "Cameras are down at Big Al's - ";
  const bothDown = "Cameras AND guards are down at Big Al's, holy shit - ";

  ////////// END OF USER DEFINED VARIABLES. Change things below at your own risk. //////////

  // Function to create and display yellow square with the option to enter API key
  function displayYellowSquare() {
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellowSquare';
    yellowSquare.style.position = 'fixed';
    yellowSquare.style.left = '0';
    yellowSquare.style.top = '0';
    yellowSquare.style.width = '100px';
    yellowSquare.style.height = '100px';
    yellowSquare.style.backgroundColor = 'yellow';
    yellowSquare.style.zIndex = '99999999';
    yellowSquare.style.display = 'flex'; // Use flexbox for centering
    yellowSquare.style.cursor = 'pointer'; // Change cursor to pointer

    // Create a container div for centered text
    const textContainer = document.createElement('div');
    textContainer.style.margin = 'auto'; // Center horizontally
    textContainer.style.textAlign = 'center'; // Center text
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column'; // Center vertically

    // Create text nodes for the yellow square with a line break
    const yellowTextNode0 = document.createTextNode('Shoplift alerter');
    const lineBreak = document.createElement('br');
    const yellowTextNode1 = document.createTextNode('Click here to');
    const lineBreak2 = document.createElement('br');
    const yellowTextNode2 = document.createTextNode('supply API key');

    // Append the text nodes and line break to the text container
    textContainer.appendChild(yellowTextNode0);
    textContainer.appendChild(lineBreak);
    textContainer.appendChild(yellowTextNode1);
    textContainer.appendChild(lineBreak2);
    textContainer.appendChild(yellowTextNode2);

    // Append the text container to the yellow square
    yellowSquare.appendChild(textContainer);

    // Append the yellow square to the body (if it's not already added)
    if (!document.getElementById('yellowSquare')) {
      document.body.appendChild(yellowSquare);
    }

    // Add a click event listener to the yellow square
    yellowSquare.addEventListener('click', () => {
      const apiKey = prompt('Enter your API key:');
      if (apiKey) {
        // Store the API key with localStorage.setItem
        localStorage.setItem('shoplifting_api_key', apiKey);
        yellowSquare.remove(); // Remove the yellow square after entering the API key
        fetchAndDisplayData(); // Run an API call with the new key
      }
    });
  }

  // Check if the API key is already stored using localStorage.getItem
  const apiKey = localStorage.getItem('shoplifting_api_key') || '';

  // If the API key is not stored, display the yellow square
  if (!apiKey) {
    displayYellowSquare();
  }

  // Function to create and display the red square text, and remove it if security is back up
  function displayRedSquare(camera, guard) {
    const existingRedSquare = document.getElementById('redSquare');
    if (existingRedSquare) {
      existingRedSquare.remove();
    }
    // Check if both camera and guard values are false
    if (camera === false && guard === false) {
      return; // Exit the function, as there's no need to create the red square
    }
    const currentTime = localStorage.getItem('lastCallTime') || 0;
    if ((localStorage.getItem('timeOut') || 0) > currentTime) {
      if (camera === false || guard === false) {
        return;
      }
    }

    // Create or update the red square div
    const redSquare =
      document.getElementById('redSquare') || document.createElement('div');
    redSquare.id = 'redSquare';
    redSquare.style.position = 'fixed';
    redSquare.style.left = '0';
    redSquare.style.top = '0';
    redSquare.style.width = '100px';
    redSquare.style.height = '100px';
    redSquare.style.backgroundColor = 'red';
    redSquare.style.zIndex = '99999999';
    redSquare.style.display = 'flex'; // Use flexbox for centering

    // Create a container div for centered text
    const textContainer = document.createElement('div');
    textContainer.style.margin = 'auto'; // Center horizontally
    textContainer.style.textAlign = 'center'; // Center text
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column'; // Center vertically

    // Create text nodes for "camera" and "guard" values
    let cameraTextNode = document.createTextNode(`Camera: Online`);
    let guardTextNode = document.createTextNode(`Guards: On duty`);
    if (camera) {
      cameraTextNode = document.createTextNode(`Camera: Offline`);
    }
    if (guard) {
      guardTextNode = document.createTextNode(`Guards: Gone`);
    }
    const lineBreak = document.createElement('br');

    // Append the text nodes and line break to the text container
    textContainer.appendChild(cameraTextNode);
    textContainer.appendChild(lineBreak);
    textContainer.appendChild(guardTextNode);

    // Append the text container to the red square
    redSquare.appendChild(textContainer);

    // Append the red square to the body (if it's not already added)
    if (!document.getElementById('redSquare')) {
      document.body.appendChild(redSquare);
    }

    // Add a click event listener to the red square
    redSquare.addEventListener('click', () => {
      // Put a message into clipboard for easy pasting to faction chat, if copyCat is enabled
      if (copyCat === true) {
        let copyMessage = '';
        if (camera === true && guard === true) {
          copyMessage = bothDown + baseMessage;
        } else {
          if (guard === true) {
            copyMessage = guardsDown + baseMessage;
          } else {
            copyMessage = camerasDown + baseMessage;
          }
        }
        navigator.clipboard.writeText(copyMessage);
      }
      // Set camera and guard values to false
      localStorage.setItem('cameraValue', false);
      localStorage.setItem('guardValue', false);

      // Set the timestamp to the current timestamp plus a time defined by the user at the top of this script
      localStorage.setItem('timeOut', Date.now() + timeOut);

      // Remove the red square div
      redSquare.remove();
    });
  }

  // Function to fetch API data and display the red square
  function fetchAndDisplayData() {
    const currentTime = Date.now();
    const lastCallTime = localStorage.getItem('lastCallTime') || 0;
    // Check if at least 60 seconds have passed since the last API call
    if (currentTime - lastCallTime >= 60000) {
      // Check if the API key is already stored using localStorage.getItem
      const apiKey = localStorage.getItem('shoplifting_api_key') || '';
      // If the API key is not stored, display the yellow square
      if (!apiKey) {
        displayYellowSquare();
      }

      fetch(`https://api.torn.com/torn/?selections=shoplifting&key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          // Check if there's an error in the API response
          if (data.error && data.error.error === 'Incorrect key') {
            localStorage.setItem('shoplifting_api_key', '');
            displayYellowSquare();
          } else {
            // Get the values for "camera" and "guard" from the API data
            const camera = data.shoplifting.big_als[0].disabled;
            const guard = data.shoplifting.big_als[1].disabled;

            // Store the values of "camera" and "guard"
            localStorage.setItem('cameraValue', camera);
            localStorage.setItem('guardValue', guard);
            localStorage.setItem('lastCallTime', currentTime); // Store the current timestamp

            // Call the displayRedSquare function with camera and guard values
            displayRedSquare(camera, guard);
          }
        })
        .catch((error) => console.error('there was an API Error:', error));
    }
  }

  // Initial run after 2 seconds with saved values of camera and guard, or fetch new data if values don't exist
  setTimeout(() => {
    const currentTime = Date.now();
    const lastCallTime = localStorage.getItem('lastCallTime') || 0;
    // Check if the last saved timestamp is more than 60 seconds ago or if cameraValue and guardValue don't exist
    if (
      currentTime - lastCallTime >= 60000 ||
      localStorage.getItem('cameraValue') === undefined ||
      localStorage.getItem('guardValue') === undefined
    ) {
      // If any of the conditions are met, fetch new data
      fetchAndDisplayData();
    } else {
      // Otherwise, use the old saved values for camera and guard
      const savedCamera =
        localStorage.getItem('cameraValue') === undefined
          ? localStorage.getItem('cameraValue')
          : false; // Default to false if not saved
      const savedGuard =
        localStorage.getItem('guardValue') === undefined
          ? localStorage.getItem('cameraValue')
          : false; // Default to false if not saved // Default to false if not saved
      displayRedSquare(savedCamera, savedGuard);
    }
  }, 1);

  // Repeat every 10 seconds
  setInterval(fetchAndDisplayData, 10000);
  //displayYellowSquare() //debugging
  //displayRedSquare(true, true) //debugging
})();
