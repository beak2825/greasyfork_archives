// ==UserScript==
// @name         GoddessDisctracter
// @license      MIT
// @namespace    https://greasyfork.org/scripts/456013-goddessdisctracter/code/GoddessDisctracter.user.js
// @version      1.3
// @description  Lewdly distracts you from what you are doing in your browser
// @author       @Archgoddess_gd, @Gemwarden69, chatGPT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456013/GoddessDisctracter.user.js
// @updateURL https://update.greasyfork.org/scripts/456013/GoddessDisctracter.meta.js
// ==/UserScript==


// RANDOM CHANGE BETWEEN EASY MODE AND HARD MODE
const lowmin = 0.03;
const lowmax = 0.1;
const highmin = 0.33;
const highmax = 0.5;

let high = Math.random() * (highmax - highmin) + highmin;
let low = Math.random() * (lowmax - lowmin) + lowmin;
let chance = low
setInterval(() => {
  high = Math.random() * (highmax - highmin) + highmin;
}, 1000);
setInterval(() => {
  low = Math.random() * (lowmax - lowmin) + lowmin;
}, 1000);

setInterval(() => {
 if (Math.random()< 0.9)
 {chance = low}
    else chance = high
}, 800000);

// RANDOM INTERVAL RED TEXT OVERLAY ---------------------------
(function() {
    'use strict';

    setInterval(function() {
        // chance
        if (Math.random() < chance*2) {
            // Replace the URL below with the URL of the list file
            var listFileUrl = "https://paste-bin.xyz/raw/969047";
            GM_xmlhttpRequest({
                method: "GET",
                url: listFileUrl,
                onload: function(response) {
                    var lines = response.responseText.split("\n");
                    var randomLine = lines[Math.floor(Math.random() * lines.length)];
                    var alertElement = document.createElement("div");
                    alertElement.innerHTML = randomLine;
                    alertElement.style.fontSize = "240px";
                    alertElement.style.color = "#ff0000";
                    alertElement.style.position = "fixed";
                    alertElement.style.left = "50%";
                    alertElement.style.top = "50%";
                    alertElement.style.transform = "translate(-50%, -50%)";
                    alertElement.style.zIndex = "999999999";
                    alertElement.style.textAlign = "center";
                    document.body.appendChild(alertElement);
                    setTimeout(function() {
                        document.body.removeChild(alertElement);
                    }, 1200);
                }
            });
        }
    }, 3000);
})();



// RANDOM INTERVAL TEXT POPUP ---------------------------
(function() {
  'use strict';

  // Function to choose a random line from the array
  function getRandomLine(lines) {
    return lines[Math.floor(Math.random() * lines.length)];
  }

  // Function to show the random line in a popup
  function showPopup(line) {
    alert(line);
  }

  // Use the GM_xmlhttpRequest function to fetch the contents of the URL
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://paste-bin.xyz/raw/969053",
    onload: function(response) {
      // Split the response text into an array of lines
      const lines = response.responseText.split('\n');

      // Show a popup with a 6% chance every 6 seconds
      setInterval(() => {
        if (Math.random() < chance * 0.78) {
          showPopup(getRandomLine(lines));
        }
      }, 6000);
    }
  });
})();



// RANDOM INTERVAL AUDIO ---------------------------
(function() { // wrap the entire script in an IIFE
  setInterval(function() {
    if (Math.random() <= chance * 1.2) {
      // Use the GM_xmlhttpRequest function to make a request to the raw text file
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://paste-bin.xyz/raw/969056",
        onload: function(response) {
          // Split the response text into an array of lines
          var lines = response.responseText.split('\n');
          // Choose a random line from the array
          var audioFileUrl = lines[Math.floor(Math.random() * lines.length)];
          // Create a new Audio object using the URL of the audio file
          var audio = new Audio(audioFileUrl);
          // Play the audio
          audio.play();
        }
      });
    }
  }, 2000);
})(); // immediately invoke the function

// RANDOM PORN REDIRECT --------------------------- TO ADD
// URL of the remote file containing the list of URLs
const urlListFile = "https://paste-bin.xyz/raw/969101";

// Function to fetch the list of URLs from the remote file
function fetchUrls() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: urlListFile,
      onload: function (response) {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.responseText);
        } else {
          reject(response.statusText);
        }
      },
      onerror: function (error) {
        reject(error);
      }
    });
  });
}

// Wrapper function to avoid conflicts with other scripts in the same file
function randomUrlRedirect() {
  // Fetch the list of URLs from the remote file
  fetchUrls().then(urlList => {
    // Split the list into individual URLs
    const urlArray = urlList.split("\n");

    // Pick a random URL from the list
    const randomUrl = urlArray[Math.floor(Math.random() * urlArray.length)];

    // Redirect to the random URL with a set chance
    if (Math.random() < chance*0.6) {
      window.location.replace(randomUrl);
    }
  }).catch(error => {
    console.error(error);
  });
}

randomUrlRedirect();



// RANDOM FLASH OF PORN IMG ---------------------------
// Set the probability of showing the image overlay (in percent)
const CHANCE = chance*1200;

// Set the interval for checking if the image overlay should be shown (in seconds)
const INTERVAL = 6;

// Set the URL of the remote list file
const IMAGE_LIST_URL = "https://paste-bin.xyz/raw/969064";

// Set the duration of the image overlay (in seconds)
const OVERLAY_DURATION = 2;

// Create a container for the image overlay
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.left = "0";
overlay.style.top = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "9999";
overlay.style.display = "none";
overlay.style.alignItems = "center";
overlay.style.justifyContent = "center";

// Create an image element for the image overlay
const image = document.createElement("img");
image.style.maxWidth = "100%";
image.style.maxHeight = "100%";
image.style.objectFit = "contain";

// Add the image element to the container
overlay.appendChild(image);

// Add the container to the page
document.body.appendChild(overlay);

// Get a random image URL from the remote list file
function getRandomImage() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: IMAGE_LIST_URL,
      onload: response => {
        if (response.status === 200) {
          // Split the file content into lines
          const lines = response.responseText.split("\n");

          // Filter out empty lines
          const nonEmptyLines = lines.filter(line => line.trim() !== "");

          // Pick a random image URL from the list
          const imageUrl = nonEmptyLines[Math.floor(Math.random() * nonEmptyLines.length)];

          // Resolve the promise with the selected URL
          resolve(imageUrl);
        } else {
          // Reject the promise if there was an error
          reject(new Error("Failed to load image list"));
        }
      }
    });
  });
}

// Show the image overlay
function showOverlay() {
  // Get a random image URL
  getRandomImage()
    .then(imageUrl => {
      // Set the image URL
      image.src = imageUrl;

      // Show the image overlay
      overlay.style.display = "flex";

      // Hide the image overlay after the specified duration
      setTimeout(() => {
        overlay.style.display = "none";
      }, OVERLAY_DURATION * 1000);
    })
    .catch(error => {
      // Log any errors
      console.error(error);
    });
}

// Check if the image overlay should be shown at regular intervals
setInterval(() => {
  // Check if a random number between 0 and 100 is less than or equal to the probability
  if (Math.random() * 100 <= CHANCE) {
    // Show the image overlay if the probability is met
    showOverlay();
  }
}, INTERVAL * 1000);