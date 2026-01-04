// ==UserScript==
// @name         Lunar The Best Cheat Out There!
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Disclaimer: Exodus has shutdown and will now continue as lunar this cheat will also provide lots of good features consider joining the discord!
// @author       ems
// @match        https://www.geoguessr.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @run-at       document-start
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1246943
// @grant        GM_xmlhttpRequest





// @downloadURL https://update.greasyfork.org/scripts/492320/Lunar%20The%20Best%20Cheat%20Out%20There%21.user.js
// @updateURL https://update.greasyfork.org/scripts/492320/Lunar%20The%20Best%20Cheat%20Out%20There%21.meta.js
// ==/UserScript==


(function() {
    'use strict';



    /////////////////LOGO TOP LEFT SITE WITH VERSION///////////////////////////
    // Create and inject the logo HTML and CSS
    function createLogo() {
        const logoHTML = `
            <div id="exodusLogo" class="logo">Version v4.4 [Stable]</div>
        `;

        const logoCSS = `
            .logo {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 18px; /* Smaller font size */
                color: transparent; /* Hide the text initially */
                text-shadow: 0 0 5px rgba(255, 0, 0, 0.8), 0 0 10px rgba(255, 0, 0, 0.8); /* Red text shadow */
                background: linear-gradient(45deg, rgba(255, 0, 0, 0.8), rgba(0, 0, 0, 0.8)); /* Gradient from red to black */
                background-clip: text; /* Apply the background to the text only */
                -webkit-background-clip: text; /* For Safari */
                position: fixed;
                top: 20px;
                left: 25px;
                z-index: 9999;
                animation: pulse 1s ease-in-out infinite alternate;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
        `;

        // Inject the logo HTML
        const logoContainer = document.createElement('div');
        logoContainer.innerHTML = logoHTML;
        document.body.appendChild(logoContainer);

        // Inject the logo CSS
        const style = document.createElement('style');
        style.textContent = logoCSS;
        document.head.appendChild(style);
    }

    // Call the function to create the logo
    createLogo();



/////////////////END///////////////////////////


////////////CREATION DATE DISPLAY ON PROFILE/////////////



/////////////////CHECKS IF USER IS BANNED ON PROFILE///////////////////////////

function checkURL() {
    if (location.pathname.includes("/user") || location.pathname.includes("/me/profile")) return 1;
    return 0;
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

async function checkUser(profileId) {
    return fetch(location.origin + "/api/v3/users/" + profileId)
    .then(out => out.json())
    .catch(err => {console.log(err); return null;});
}

let observer = new MutationObserver(() => {
    if (checkURL() == 1) {
        const profileLink = (location.pathname.includes("/me/profile")) ? document.querySelector('[name="copy-link"]').value : location.href;
        const profileId = profileLink.substr(profileLink.lastIndexOf("/") + 1);
        checkUser(profileId).then(user => {
            if (user !== null) {
                if (user.isBanned === false) {
                    if (document.getElementById("isBanned") == null) {
                        let proDiv = document.querySelector("[class*='profile-header_accountInfoWrapper__D_iCA']");
                        let baseDiv = (proDiv) ? proDiv.firstChild : document.querySelector("[data-qa='user-card-title']");
                        let bannedDiv = document.createElement("div");
                        bannedDiv.innerHTML = `<div id="isBanned">Not Banned</div>`;
                        let createdDateDiv = document.createElement("div");
                        createdDateDiv.innerHTML = `<div id="createdDate" style="font-size: 14px;">[${user.created.slice(0, 16).replace("T"," ")}]</div>`;
                        if (proDiv) {
                            baseDiv.style = "display: inline-block; margin-right: 10px";
                            bannedDiv.style.display = "inline-block";
                            createdDateDiv.style.display = "block";
                        }
                        insertAfter(bannedDiv, baseDiv);
                        insertAfter(createdDateDiv, bannedDiv);
                    } else {
                        const currentBanStatus = document.getElementById("isBanned").innerText;
                        if (currentBanStatus !== "Not Banned") {
                            document.getElementById("isBanned").innerText = "Not Banned";
                            document.getElementById("createdDate").innerText = `[${user.created.slice(0, 16).replace("T"," ")}]`;
                        }
                    }
                } else {
                    if (document.getElementById("isBanned") == null) {
                        let proDiv = document.querySelector("[class*='profile-header_accountInfoWrapper__D_iCA']");
                        let baseDiv = (proDiv) ? proDiv.firstChild : document.querySelector("[data-qa='user-card-title']");
                        let bannedDiv = document.createElement("div");
                        bannedDiv.innerHTML = `<div id="isBanned">User is banned. RIP XD</div>`;
                        let createdDateDiv = document.createElement("div");
                        createdDateDiv.innerHTML = `<div id="createdDate" style="font-size: 14px;">[${user.created.slice(0, 16).replace("T"," ")}]</div>`;
                        if (proDiv) {
                            baseDiv.style = "display: inline-block; margin-right: 10px";
                            bannedDiv.style.display = "inline-block";
                            createdDateDiv.style.display = "block";
                        }
                        insertAfter(bannedDiv, baseDiv);
                        insertAfter(createdDateDiv, bannedDiv);
                    } else {
                        const currentBanStatus = document.getElementById("isBanned").innerText;
                        if (currentBanStatus !== "User is banned. RIP XD") {
                            document.getElementById("isBanned").innerText = "User is banned. RIP XD";
                            document.getElementById("createdDate").innerText = `[${user.created.slice(0, 16).replace("T"," ")}]`;
                        }
                    }
                }
            }
        });
    }
});

observer.observe(document.body, { subtree: true, childList: true });

// Throttle function to prevent spamming of details during soft refreshes
function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Function to periodically check and update user's ban status
const checkAndUpdateStatus = throttle(() => {
  const profileLink = (location.pathname.includes("/me/profile")) ? document.querySelector('[name="copy-link"]').value : location.href;
  const profileId = profileLink.substr(profileLink.lastIndexOf("/") + 1);
  checkUser(profileId).then(user => {
    if (user !== null) {
      if (user.isBanned === false) {
        const currentBanStatus = document.getElementById("isBanned")?.innerText;
        if (currentBanStatus !== "Not Banned") {
          document.getElementById("isBanned").innerText = "Not Banned";
          document.getElementById("createdDate").innerText = `[${user.created.slice(0, 16).replace("T"," ")}]`;
        }
      } else {
        const currentBanStatus = document.getElementById("isBanned")?.innerText;
        if (currentBanStatus !== "User is banned. RIP XD") {
          document.getElementById("isBanned").innerText = "User is banned. RIP XD";
          document.getElementById("createdDate").innerText = `[${user.created.slice(0, 16).replace("T"," ")}]`;
        }
      }
    }
  });
}, 500);

//////////////////////END////////////////////////////////////

/////////PULLING C STATUS////////////
})();


let globalCoordinates = {
    lat: 0,
    lng: 0
};

let globalPanoID = undefined;

var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (method.toUpperCase() === 'POST' &&
        (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
         url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {
        this.addEventListener('load', function () {
            let interceptedResult = this.responseText;
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)[0];
            let split = match.split(",");
            let lat = Number.parseFloat(split[0]);
            let lng = Number.parseFloat(split[1]);
            globalCoordinates.lat = lat;
            globalCoordinates.lng = lng;
        });
    }
    return originalOpen.apply(this, arguments);
};

function placeMarker(safeMode) {
    let {lat, lng} = globalCoordinates;

    if (safeMode) {
        const sway = [Math.random() > 0.5, Math.random() > 0.5];
        const multiplier = Math.random() * 4;
        const horizontalAmount = Math.random() * multiplier;
        const verticalAmount = Math.random() * multiplier;
        sway[0] ? lat += verticalAmount : lat -= verticalAmount;
        sway[1] ? lng += horizontalAmount : lng -= horizontalAmount;
    }

    let element = document.querySelectorAll('[class^="guess-map_canvas__"]')[0];
    if (!element) {
        placeMarkerStreaks();
        return;
    }

    const latLngFns = {
        latLng: {
            lat: () => lat,
            lng: () => lng,
        }
    };

    const reactKeys = Object.keys(element);
    const reactKey = reactKeys.find(key => key.startsWith("__reactFiber$"));
    const elementProps = element[reactKey];
    const mapElementClick = elementProps.return.return.memoizedProps.map.__e3_.click;
    const mapElementPropKey = Object.keys(mapElementClick)[0];
    const mapClickProps = mapElementClick[mapElementPropKey];
    const mapClickPropKeys = Object.keys(mapClickProps);

    for (let i = 0; i < mapClickPropKeys.length; i++) {
        if (typeof mapClickProps[mapClickPropKeys[i]] === "function") {
            mapClickProps[mapClickPropKeys[i]](latLngFns);
        }
    }
}

function placeMarkerStreaks() {
    let {lat, lng} = globalCoordinates;
    let element = document.getElementsByClassName("region-map_mapCanvas__0dWlf")[0];
    if (!element) {
        return;
    }
    const reactKeys = Object.keys(element);
    const reactKey = reactKeys.find(key => key.startsWith("__reactFiber$"));
    const elementProps = element[reactKey];
    const mapElementClick = elementProps.return.return.memoizedProps.map.__e3_.click;
    const mapElementClickKeys = Object.keys(mapElementClick);
    const functionString = "(e.latLng.lat(),e.latLng.lng())}";
    const latLngFn = {
        latLng: {
            lat: () => lat,
            lng: () => lng,
        }
    };

    for (let i = 0; i < mapElementClickKeys.length; i++) {
        const curr = Object.keys(mapElementClick[mapElementClickKeys[i]]);
        let func = curr.find(l => typeof mapElementClick[mapElementClickKeys[i]][l] === "function");
        let prop = mapElementClick[mapElementClickKeys[i]][func];
        if (prop && prop.toString().slice(5) === functionString) {
            prop(latLngFn);
        }
    }
}

function mapsFromCoords() {
    const {lat, lng} = globalCoordinates;
    if (!lat || !lng) {
        return;
    }

    if (window.open && window.open.toString().indexOf('native code') !== -1) {
        window.open(`https://maps.google.com/?output=embed&q=${lat},${lng}&ll=${lat},${lng}&z=5`);
    }
}

// Add a black box on the right side of the screen
function createBlackBox() {
    const blackBox = document.createElement('div');
    blackBox.id = 'blackBox'; // Adding an ID for easy reference
    blackBox.style.position = 'fixed';
    blackBox.style.top = '0'; // Set the top position to 0 for top of the page
    blackBox.style.left = '50%'; // Center horizontally
    blackBox.style.transform = 'translateX(-50%)'; // Center horizontally
    blackBox.style.width = '200px';
    blackBox.style.height = '2%';
    blackBox.style.backgroundColor = 'black';
    blackBox.style.color = 'white';
    blackBox.style.padding = '20px';
    blackBox.style.zIndex = '9999';
    blackBox.style.outline = '2px solid red'; // Add red outline
    blackBox.innerHTML = '<span style="font-size: 16px;">Press INSERT to view the guide</span>';

    document.body.appendChild(blackBox);

    // Schedule the removal of the black box after 5 seconds
    setTimeout(function() {
        const blackBoxToRemove = document.getElementById('blackBox');
        if (blackBoxToRemove) {
            blackBoxToRemove.style.opacity = '0';
            setTimeout(function() {
                blackBoxToRemove.remove();
            }, 1000); // Fade out transition time
        }
    }, 9000); // 5 seconds
}

// Call the function to create the black box on page load
createBlackBox();

let popupVisible = false;

function togglePopup() {
    const popup = document.getElementById('popup');

    if (!popup) {
        // Create popup element
        const popupElement = document.createElement('div');
        popupElement.id = 'popup';
        popupElement.style.position = 'fixed';
        popupElement.style.top = '50%';
        popupElement.style.left = '50%';
        popupElement.style.transform = 'translate(-50%, -50%)';
        popupElement.style.backgroundColor = 'black';
        popupElement.style.color = 'white';
        popupElement.style.padding = '20px';
        popupElement.style.zIndex = '9999';

        // Create an inner div for the text content
        const textDiv = document.createElement('div');
        textDiv.innerHTML = 'Press [1] to pick an close spot to the destination pin<br><br>Press [2] to place your pin on the exact location of the destination<br><br>Press [3] to open an separate window that opens google maps on the exact location<br><br>-----------------------------------------------------------------------------------------<br><br>Press [P] in classic maps / world when you are in the match to start farming';
        popupElement.appendChild(textDiv);

        // Create an inner div for the rainbow border
        const borderDiv = document.createElement('div');
        borderDiv.classList.add('popup-border');
        popupElement.appendChild(borderDiv);

        document.body.appendChild(popupElement);
        popupVisible = true;
    } else {
        popup.style.display = popupVisible ? 'none' : 'block';
        popupVisible = !popupVisible;
    }

    // Dynamically adjust the rainbow border size
    const borderDiv = document.querySelector('.popup-border');
    if (borderDiv) {
        const popupContent = document.getElementById('popup');
        if (popupContent) {
            borderDiv.style.width = `${popupContent.offsetWidth}px`;
            borderDiv.style.height = `${popupContent.offsetHeight}px`;
        }
    }
}
function pathMatches(path) {
    return location.pathname.match(new RegExp(`^/(?:[^/]+/)?${path}$`))
}

function getIndex(element) {
    if (!element) return -1

    let i = 0
    while (element = element.previousElementSibling) {
        i++
    }

    return i
}

const OBSERVER_CONFIG = {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false
}
/////////END////////////


/////////////////////////////////////////////////////////////////////
      ///       BATTLEROYALE START     ///



// Function to check if the desired element is present before loading the main script
const waitForElement = async () => {
  while (
    (!document.querySelector(".game-mode-brand_selected__TxTvh") ||
      document.querySelector(".game-mode-brand_selected__TxTvh").textContent.trim() !== "Countries") &&
    !document.querySelector(".lobby-countdown_label__1oT4Q") &&
    !document.querySelector(".game-intro-overlay_label__Txk_G")
  ) {
    await new Promise(r => setTimeout(r, 1000));
    console.log("Waiting for lobby card...");
  }

  const lobbyCardElement =
    document.querySelector(".game-mode-brand_selected__TxTvh") ||
    document.querySelector(".lobby-countdown_label__1oT4Q") ||
    document.querySelector(".game-intro-overlay_label__Txk_G");

  if (lobbyCardElement) {
    console.log("Lobby card found. Loading script...");
    isScriptRunning = true; // Set the flag to true
    loadScript();
  }
};

// Start checking for the lobby card element
let isScriptRunning = false; // Flag to track if the script is running
if (!isScriptRunning) {
  waitForElement();
}

// Declare and initialize endGameScreenObserver outside the function
let endGameScreenObserver = null;

// Function to load the main script
function loadScript() {
  console.log("Script started.");

  let leaveGameButtonObserver = null;
  let isObservingEndGame = false;
  let isLeaveGameClicked = false; // Flag variable to track leave game button click

  // Cleanup function to remove observers and event listeners
  const cleanup = () => {
    if (leaveGameButtonObserver) {
      leaveGameButtonObserver.disconnect();
      leaveGameButtonObserver = null;
    }
    if (isObservingEndGame) {
      endGameScreenObserver.disconnect();
      isObservingEndGame = false;
    }

    const leaveGameButton = document.querySelector('button.button_button__aR6_e.button_variantSecondary__hvM_F');
    if (leaveGameButton) {
      leaveGameButton.removeEventListener('click', handleLeaveGameClick);
    }
  };

  cleanup(); // Call cleanup to remove any leftover observers/listeners

  // Wait until the UI element with class "countries-game-overview_overview__0cpdi" is loaded
  const waitForUI = async () => {
    while (!document.querySelector(".countries-game-overview_overview__0cpdi")) {
      await new Promise(r => setTimeout(r, 1000));
      console.log("Waiting for UI to load...");
    }
    console.log("UI loaded.");
    processFlags();
  };

  waitForUI();

  const processFlags = () => {
    console.log("Retrieving all guessed flags...");
    let flags = document.querySelectorAll(".countries-game-overview_wrongGuessesFlag__U4XmC");

    for (let flag of flags) {
      let flag_img = flag.querySelector("img");
      if (flag_img && flag_img.getAttribute("alt")) {
        let country_code = flag_img.getAttribute("alt").toUpperCase().substring(0, 2);
        let countryCodeElement = document.createElement("span");
        countryCodeElement.textContent = country_code;
        countryCodeElement.className = "country-code";
        let flagRect = flag.getBoundingClientRect();
        let bodyRect = document.body.getBoundingClientRect();
        countryCodeElement.style.position = "absolute";
        countryCodeElement.style.top = flagRect.top - bodyRect.top - 20 + "px";
        countryCodeElement.style.left = flagRect.left - bodyRect.left + "px";
        countryCodeElement.style.fontSize = "0.8rem";
        countryCodeElement.style.zIndex = "9999";
        document.body.appendChild(countryCodeElement);
      }
    }

    console.log("All flags processed.");
    addStyleForFlags();
    observeForNewFlags();
    observeForLeaveGame();
    observeForEndGame();
  };

  const addStyleForFlags = () => {
    let style = document.createElement('style');
    style.textContent = `
      .country-flag_flag__tlHIr {
        position: relative;
      }

      .country-code {
        position: absolute !important;
        top: -20px !important;
        left: 0;
        font-size: 0.8rem;
        z-index: 9999;
      }
    `;
    document.head.appendChild(style);
  };

  const observeForNewFlags = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.target.className === "countries-game-overview_wrongGuessesFlags__GEhji") {
          console.log("New flag guessed. Updating...");
          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode.classList && addedNode.classList.contains("countries-game-overview_wrongGuessesFlag__U4XmC")) {
              let flag_img = addedNode.querySelector("img");
              if (flag_img && flag_img.getAttribute("alt")) {
                let country_code = flag_img.getAttribute("alt").toUpperCase().substring(0, 2);
                let countryCodeElement = document.createElement("span");
                countryCodeElement.textContent = country_code;
                countryCodeElement.className = "country-code";
                countryCodeElement.style.position = "absolute";
                countryCodeElement.style.top = "0.2rem";
                countryCodeElement.style.right = "0.2rem";
                countryCodeElement.style.fontSize = "0.8rem";
                addedNode.insertBefore(countryCodeElement, addedNode.querySelector("img"));
              }
            }
          });
        }
      });
    });

    observer.observe(document.querySelector(".countries-game-overview_wrongGuessesFlags__GEhji"), { childList: true, subtree: true });
  };

  const handleLeaveGameClick = () => {
  isLeaveGameClicked = true;
  resetScript();
};

const observeForLeaveGame = () => {
  const leaveGameButton = document.querySelector('button.button_button__aR6_e.button_variantSecondary__hvM_F');
  if (leaveGameButton && leaveGameButton.textContent.trim() === 'Leave game') {
    leaveGameButton.addEventListener('click', handleLeaveGameClick);
    console.log("'Leave game' button found. Listening for click...");
  } else {
    leaveGameButtonObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const leaveGameButton = document.querySelector('button.button_button__aR6_e.button_variantSecondary__hvM_F');
          if (leaveGameButton && leaveGameButton.textContent.trim() === 'Leave game') {
            leaveGameButton.addEventListener('click', handleLeaveGameClick);
            leaveGameButtonObserver.disconnect();
            console.log("'Leave game' button found. Listening for click...");
          }
        }
      });
    });

    leaveGameButtonObserver.observe(document.body, { childList: true, subtree: true });
    console.log("Waiting for 'Leave game' button...");
  }
};

  const observeForEndGame = () => {
  let endGameScreenObserver = null;
  let isObservingEndGame = false;

  const checkEndGameScreen = (mutations) => {
    const endGameScreens = document.querySelectorAll(".popup-view_popupView__TJqKD, .spectate-footer_messageText__jHqwQ");
    let foundEndGameScreen = false;

    endGameScreens.forEach((screen) => {
  if (
    screen &&
    window.getComputedStyle(screen).display !== 'none' &&
    (!screen.classList.contains('popup-view_isCorrect__oQmkS') &&
      !screen.classList.contains('popup-view_isItalic__1Fbl4') &&
      (screen.querySelector('[data-qa="popup-view-lost"]') ||
        screen.textContent.includes("You are knocked out.") ||
        screen.getAttribute("data-qa") === "spectating-modal")) ||
    (screen.querySelector('[data-qa="popup-view-gold"]') &&
      screen.querySelector('[data-qa="popup-view-gold"]').textContent.includes("YOU WON!"))
  ) {
    foundEndGameScreen = true;
  }
});

    if (foundEndGameScreen) {
      console.log("End game screen found. Resetting script...");
      endGameScreenObserver.disconnect(); // Disconnect the observer
      isObservingEndGame = false; // Reset the flag
      resetScript();
    }
  };

  endGameScreenObserver = new MutationObserver(checkEndGameScreen);
  endGameScreenObserver.observe(document.body, { childList: true, subtree: true });
  isObservingEndGame = true;
};

const resetScript = () => {
  console.log("Resetting script...");
  cleanup();
  isScriptRunning = false; // Reset the flag
  waitForElement();
};
}
/////////////////////////////////////////////////////////////////////
      ///       BATTLEROYALE END     ///

////// HERE WILL CODE EXIST IN THE FUTURE FOR THE LEAVE GAME BUTTON TO RESET THE SCRIPT FOR ISO COUNTRIES//////////////




/////////////// DEPLOY EXTRA INFORMATION BOX WITH PRECISE LOCATION ///////////////////

// Define coordinatesData object
const coordinatesData = { lat: null, lng: null };


// Function to resolve the location, fetch country information, and apply overlay on the map
async function resolveLocationAndApplyOverlayNew() {
  const { lat, lng } = coordinatesData;
  try {
    const countryInfo = lat && lng ? await fetchCountryInfoNew(lat, lng) : null;
    showCountryInfoNew(countryInfo); // Display the country info
  } catch (error) {
    console.error('Error fetching country information:', error);
  }
}

// Function to display the country name, state, and city on the site with black outline around the letters
function showCountryInfoNew(countryInfo) {

        let countryInfoElement = document.getElementById('geoguessr-country-info');
        if (!countryInfoElement) {
        countryInfoElement = document.createElement('div');
        countryInfoElement.id = 'geoguessr-country-info';
        countryInfoElement.classList.add('geoguessr-country-info');
        countryInfoElement.style.position = 'fixed';
        countryInfoElement.style.top = '70%';
        countryInfoElement.style.right = '10px';
        countryInfoElement.style.width = '200px'; // Fixed width
        countryInfoElement.style.height = 'auto'; // Auto height
        countryInfoElement.style.transform = 'translateY(-50%)';
        countryInfoElement.style.fontFamily = 'Arial, sans-serif'; // Set font family
        countryInfoElement.style.fontSize = '20px'; // Set font size
        countryInfoElement.style.color = 'transparent';
        countryInfoElement.style.webkitBackgroundClip = 'text';
        countryInfoElement.style.animation = 'rainbow 10s linear infinite';
        countryInfoElement.style.textShadow = '0 2 5px white'; // Add black outline around the letters
        countryInfoElement.style.padding = '10px';
        countryInfoElement.style.borderRadius = '10px';
        countryInfoElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        countryInfoElement.style.background = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black background
        countryInfoElement.style.zIndex = '9999'; // Ensure it appears on top of other elements
        document.body.appendChild(countryInfoElement);

        // Add minimize button
        const minimizeButton = document.createElement('span');
        minimizeButton.classList.add('geoguessr-minimize-button');
        minimizeButton.innerHTML = '&#10006;'; // Unicode for 'X'
        minimizeButton.style.position = 'absolute';
        minimizeButton.style.top = '5px';
        minimizeButton.style.right = '5px';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.style.color = 'white';
        minimizeButton.style.zIndex = '99999'; // Ensure it appears on top of other elements
        minimizeButton.addEventListener('click', toggleCountryInfoSize);
        countryInfoElement.appendChild(minimizeButton);

        // Make the text draggable
        makeElementDraggableNew(countryInfoElement);
    }

    // Set the text content with rainbow-colored text
    countryInfoElement.innerHTML = '';
   // Set the text content with rainbow-colored text
  if (countryInfo) {
    countryInfoElement.innerHTML = `<div style="animation: rainbow 10s linear infinite">Country: ${countryInfo.country || 'N/A'}</div>`
      + `<div style="animation: rainbow 10s linear infinite">State: ${countryInfo.state || 'N/A'}</div>`
      + `<div style="animation: rainbow 10s linear infinite">City: ${countryInfo.city || 'N/A'}</div>`;
  } else {
    countryInfoElement.innerHTML = `<div style="animation: rainbow 10s linear infinite">Country: N/A</div>`
      + `<div style="animation: rainbow 10s linear infinite">State: N/A</div>`
      + `<div style="animation: rainbow 10s linear infinite">City: N/A</div>`;
  }
}

// Function to make an element draggable
function makeElementDraggableNew(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDownNew;

    function dragMouseDownNew(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElementNew;
        document.onmousemove = elementDragNew;
    }

    function elementDragNew(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElementNew() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Function to toggle visibility of country info box
function toggleCountryInfoSize() {
    const countryInfoElement = document.getElementById('geoguessr-country-info');
    countryInfoElement.classList.toggle('geoguessr-country-info-small');
}

// Function to reset coordinatesData
function resetCoordinatesData() {
  coordinatesData.lat = null;
  coordinatesData.lng = null;
}



// Function to check if the current URL is a game page
function isGamePage() {
  const currentURL = window.location.href;
  const gameURLs = [
    'https://www.geoguessr.com/game/',
    'https://www.geoguessr.com/battle-royale/',
    'https://www.geoguessr.com/teams/',
    'https://www.geoguessr.com/singleplayer/game/',
  ];

  return gameURLs.some(url => currentURL.includes(url));
}

// Function to update country info and reset display if not on a game page
async function updateCountryInfo() {
  const { lat, lng } = coordinatesData;
  try {
    let countryInfo;
    if (isGamePage() && lat !== null && lng !== null) {
      countryInfo = await fetchCountryInfoNew(lat, lng);
    } else {
      countryInfo = null;
      resetCoordinatesData();
      showCountryInfoNew(null); // Reset display when not on a game page
    }
    showCountryInfoNew(countryInfo);
  } catch (error) {
    console.error('Error fetching country information:', error);
  }
}

// Start actively checking for coordinates changes and URL changes
async function checkForChanges() {
  while (true) {
    await updateCountryInfo();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
  }
}

// Start checking for changes
checkForChanges();




// Intercept the API call to retrieve coordinates
var originalOpen1 = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
    if (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata')) {
        this.addEventListener('load', async function () {
            let interceptedResult = this.responseText;
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)[0];
            let split = match.split(",");
            let lat = Number.parseFloat(split[0]);
            let lng = Number.parseFloat(split[1]);
            coordinatesData.lat = lat;
            coordinatesData.lng = lng;
        });
    }
    return originalOpen1.apply(this, arguments);
};

// Function to fetch country information based on coordinates using Nominatim reverse geocoding API
async function fetchCountryInfoNew(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch country information: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data.address) {
            const country = data.address.country || 'Unknown';
            const state = data.address.state || 'Unknown';
            const city = data.address.city || data.address.town || 'Unknown';
            return { country, state, city };
        } else {
            throw new Error('No country information found');
        }
    } catch (error) {
        console.error('Error fetching country information:', error);
        throw error; // Propagate the error further
    }
}

// Add CSS styling
const styling = document.createElement('style');
styling.textContent = `
.geoguessr-country-info {
    display: block;
}

.geoguessr-country-info-small {
    width: auto;
    height: 30px;
}

#geoguessr-country-info {
  position: fixed;
  top: 70%;
  right: 10px;
  transform: translateY(-50%);
  font-family: Arial, sans-serif;
  font-size: 20px;
  color: transparent;
  background: -webkit-linear-gradient(45deg, #e6e6fa, #add8e6, #87cefa, #00ff00, #ffff00, #ffa500, #ff6347);
  -webkit-background-clip: text;
  animation: rainbow 10s linear infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Light white shadow */
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5); /* Light white outline */
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid transparent; /* Set initial transparent border */
  border-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,0.5), rgba(255,0,0,0)) 30; /* Smooth gradient border */
  border-image-slice: 1;
}
`;
document.head.appendChild(styling);

// Initially display country info
resolveLocationAndApplyOverlayNew();

///////////////   EBD   ///////////////////



/////////////STYLES FOR THE UI  CHANGES TO THE SITE AND SCRIPT//////////////////////

// Define CSS animation for rainbow border around black box when pressing insert
const styles = `
    @keyframes rainbow-border {
        0% { border-color: red; }
        16.666% { border-color: orange; }
        33.333% { border-color: yellow; }
        50% { border-color: green; }
        66.666% { border-color: blue; }
        83.333% { border-color: indigo; }
        100% { border-color: violet; }
    }



@keyframes moveHeader {
    0% {
        transform: translateX(-1px) translateY(-1px);
    }
    50% {
        transform: translateX(1px) translateY(1px);
    }
    100% {
        transform: translateX(-1px) translateY(-1px);
    }
}

.header_pageLabel__IIJf8 {
    animation: moveHeader 5s infinite alternate;
}

.custom-menu-position {
    justify-content: flex-end; /* Aligns items to the right */
    /* Add more custom positioning styles as needed */
}



.header_header__JSEeB {
    /* Add CSS properties to position the header to the right */
    display: flex;
    justify-content: flex-end; /* Aligns header to the right */
    /* Add more custom styling as needed */
}

.header_pageLabel__IIJf8 {
    /* Add CSS properties to ensure the menu stays on the right */
    /* You may need to adjust other properties such as margin or padding */
    /* Add more custom styling as needed */
}
    .popup-border {
        position: absolute;
        top: 0;
        left: 50%; /* Adjust left position as needed */
        transform: translateX(-50%); /* Center the border horizontally */
        border: 5px solid transparent;
        box-sizing: border-box; /* Include padding in width and height */
        animation: rainbow-border 5s infinite;
        pointer-events: none; /* Make sure the border doesn't interfere with mouse events */
    }

    /* Tooltip container */
    .tooltip {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
    }


/* CSS styles for the profile button */
.profile-button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.profile-button:hover {
    background-color: #3e8e41;
}

/* CSS animation for the glow effect */
@keyframes glowAnimation {
    0% {
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 0, 0, 0.3);
    }
    33% {
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3);
    }
    66% {
        text-shadow: 0 0 10px rgba(0, 0, 255, 0.8), 0 0 20px rgba(0, 0, 255, 0.5), 0 0 30px rgba(0, 0, 255, 0.3);
    }
    100% {
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 0, 0, 0.3);
    }
}
.profile-button:hover {
    background-color: #3e8e41;
}

.primary-menu_wrapper__3ahEU {
    position: absolute;
    left: calc(40% - 180px);
    top: 30%;
    transform: translate(-50%, -50%);
    width: 360px;
    height: 530px;
    background-color: black;
    border: 2px solid limegreen; /* Change border color to lime green */
    border-radius: 10px;
    z-index: 9999;

    /* Add animation properties */
    animation: pulse1 2s infinite; /* Use pulse1 as the animation name */
    animation-name: pulse1; /* Specify the animation name */
}

@keyframes pulse1 {
    0% {
        border-color: limegreen; /* Start with lime green */
    }
    50% {
        border-color: red; /* Change to red halfway through */
    }
    100% {
        border-color: limegreen; /* Return to lime green */
    }
}

.game-menu-button_button__qIY8u:hover {
  animation: color-sweep 5s infinite;
}

@keyframes color-sweep {
  0% { color: rgb(255, 0, 0); }
  25% { color: rgb(0, 255, 0); }
  50% { color: rgb(0, 0, 255); }
  75% { color: rgb(255, 255, 0); }
  100% { color: rgb(255, 0, 255); }
}



    /* Tooltip text */
    .tooltip .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;
        opacity: 0;
        transition: opacity 0.3s;
    }

    /* Tooltip text shown on hover */
    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }

   /* Custom styling for the signed-in-start-page_menu__2CH3S */
    signed-in-start-page_menu__2CH3S {
    width: 130%; /* Adjust this value to change the length of the divider */
    left: 133%; /* Adjust this value to move the divider more to the right */
    }


    /* Custom styling for the footer_footer__tc8Gv */
.footer_footer__tc8Gv {
    margin-bottom: 20px; /* Adjust this value to move the footer up or down */
}


    .primary-menu-button_flairContainer__YaBOt {
        margin-left: 223px; /* Adjust this value to move the button further to the right */
    }


    /* GIF background for the site */
    body {
        background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b7f09246-ac57-40d3-97ac-4ed7562a8152/df3i4lx-0132abba-7479-4bd3-939c-9fca9c792cbc.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I3ZjA5MjQ2LWFjNTctNDBkMy05N2FjLTRlZDc1NjJhODE1MlwvZGYzaTRseC0wMTMyYWJiYS03NDc5LTRiZDMtOTM5Yy05ZmNhOWM3OTJjYmMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.J8DhZACK1XXgqaCSc4UvdjtXkq4RFL0PsfOQwsjp7bM');
        background-size: cover;
        background-repeat: repeat;
    }

 .tooltip {
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 5px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

/* Define CSS animation for rainbow background */
@keyframes rainbow-background {
    0% { background-color: red; }
    12.5% { background-color: orange; }
    25% { background-color: yellow; }
    37.5% { background-color: green; }
    50% { background-color: blue; }
    62.5% { background-color: indigo; }
    75% { background-color: violet; }
    87.5% { background-color: red; }
    100% { background-color: orange; }
}

/* RGB border around the site */
html {
    border-top: 20px solid transparent;
    border-bottom: -30px solid transparent; /* Adjust bottom border width */
    border-left: 20px solid transparent; /* Adjust left border width */
    border-right: 20px solid transparent; /* Adjust right border width */
    animation: rainbow-background 8s infinite linear; /* Adjust the animation duration and timing function */
}
`;

///////////// REMOVE ELEMENTS ON SITE FOR AN CLEANER LOOK ///////////////////

const element = document.getElementById('toggleScript');

if (element) {
    // Element exists, access its textContent property
    const textContent = element.textContent;
    // Do something with textContent
} else {
    // Element does not exist, handle the error gracefully
    console.error('Element not found.');
}


//         ON THE SITE ELEMENTS TO MAKE IT LOOK DIFFERENT

function removeLogoElements() {
    const logoElements = document.querySelectorAll('img.header_logoImage__eYuyg');
    logoElements.forEach(element => {
        element.remove();
    });
}

// Function to remove specified elements
function removeElements() {
    const elementsToRemove = document.querySelectorAll('.signed-in-start-page_socialAndLegalLinks__kcYwR');
    elementsToRemove.forEach(element => {
        element.remove();
    });
}

// Function to remove specified elements
function removeElements2() {
    const elementsToRemove = document.querySelectorAll('.signed-in-start-page_socialAndLegalLinks__kcYwR, .startpage_avatarWrapper__j4Iua');
    elementsToRemove.forEach(element => {
        element.remove();
    });
}

// Function to remove specified elements
function removeElements3() {
    const elementsToRemove = document.querySelectorAll('.signed-in-start-page_gradientPlate__A_ziw');
    elementsToRemove.forEach(element => {
        element.remove();
    });
}

// Function to remove specified elements
function removeElements5() {
    const elementsToRemove = document.querySelectorAll('.game_inGameLogos__aDZlA');
    elementsToRemove.forEach(element => {
        element.remove();
    });
}

// Function to remove specified elements
function removeElementsWithHrefAndClass() {
    const elementsToRemove = document.querySelectorAll('[href="/me/likes"].profile_profileLink__NOzps');
    elementsToRemove.forEach(element => {
        element.removeAttribute('href');
        element.classList.remove('profile_profileLink__NOzps');
    });
}

// Remove elements every 2 milliseconds
setInterval(removeElementsWithHrefAndClass, 2);


// Remove specified elements initially
setInterval(removeElements2, 10);
setInterval(removeElements3, 10);
setInterval(removeElements5, 10);

// Check for specified elements every 10,000 seconds and remove them if found
setInterval(removeElements, 10); // 10,000 seconds

// Remove specified elements initially
removeElements();

// Check for specified elements every 10,000 seconds and remove them if found
setInterval(removeElements, 10); // 10,000 seconds

// Check for logo elements every second and remove them if found
setInterval(removeLogoElements, 10);


// Create style element and append to document head
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

// Function to check and fade out the specified div if its opacity is back to 1
function checkAndFadeOut() {
    const backgroundDiv1 = document.querySelector('.background_background__8Zm0Y.background_backgroundHome__lurxW');
    const backgroundDiv2 = document.querySelector('.background_background__8Zm0Y.background_backgroundRankedSystem__wk1Dw');
    const backgroundDiv3 = document.querySelector('.background_background__8Zm0Y.background_backgroundProfile__EY4oP');

    if (backgroundDiv1 && backgroundDiv1.style.opacity === '1') {
        backgroundDiv1.style.transition = 'opacity 1s';
        backgroundDiv1.style.opacity = '0';
    }

    if (backgroundDiv2 && backgroundDiv2.style.opacity === '1') {
        backgroundDiv2.style.transition = 'opacity 1s';
        backgroundDiv2.style.opacity = '0';
    }
     if (backgroundDiv3 && backgroundDiv3.style.opacity === '1') {
        backgroundDiv3.style.transition = 'opacity 1s';
        backgroundDiv3.style.opacity = '0';
    }
}

// Set the opacity of the specified classes to 0 after 2 seconds when the page has loaded
window.addEventListener('load', function() {
    setTimeout(function() {
        checkAndFadeOut(); // Check and fade out initially after 2 seconds
        setInterval(checkAndFadeOut, 1000); // Check every 1 second
    }, 2000); // 2 seconds delay
});

////////////////// END /////////////////////////


////////////// OTHER IMPORTANT FEATURES NOTE: IF THIS CODE APPEARS IN ANY SCRIPTS I WILL LET IT BE TAKEN DOWN THIS CODE IS NOT LICENSED FOR >>>MIT<<< THEREFOR YOU CANNOT STEAL MY CODE YOU CAN BE INSPIRED BY IT BUT YOU CANNOT STEAL IT!! /////////////////////////////////////

function togglePopupBox() {
    console.log('Toggling popup box...');
    const popupBox = document.getElementById('popupBox');
    if (popupBox) {
        popupBox.style.display = popupBox.style.display === 'none' ? 'block' : 'none';
        if (popupBox.style.display === 'block') {
            // Schedule the removal of the popup box after 4 seconds
            setTimeout(() => {
                popupBox.style.opacity = '0';
                setTimeout(() => {
                    popupBox.remove();
                }, 1000); // Fade out transition time
            }, 4000); // 4 seconds delay before fading out
        }
    } else {
        // Create the popup box if it doesn't exist
        const hintMessage = document.createElement('div');
        hintMessage.id = 'popupBox';
        hintMessage.className = 'popup';
        hintMessage.textContent = xpFarmingEnabled ? 'Enabling XP farm, please wait...' : 'Disabling XP farm, please wait...';
        document.body.appendChild(hintMessage);
        // Schedule the removal of the popup box after 4 seconds
        setTimeout(() => {
            hintMessage.style.opacity = '0';
            setTimeout(() => {
                hintMessage.remove();
            }, 1000); // Fade out transition time
        }, 4000); // 4 seconds delay before fading out
    }
}

// Define a global variable to keep track of XP farming status
let xpFarmingEnabled = false;

function showXPFarmStatus() {
    // Check if the rainbow text element already exists
    let rainbowText = document.getElementById('rainbowText');

    // If it doesn't exist, create it
    if (!rainbowText) {
        rainbowText = document.createElement('div');
        rainbowText.id = 'rainbowText';
        rainbowText.style.position = 'fixed';
        rainbowText.style.top = '20px';
        rainbowText.style.right = '1400px';
        rainbowText.style.fontSize = '16px';
        rainbowText.style.fontWeight = 'bold';
        rainbowText.style.animation = 'rainbow-text 2s linear infinite';

        document.body.appendChild(rainbowText);
    }

    // Update the text content based on XP farming status
    rainbowText.textContent = xpFarmingEnabled ? 'XP FARM: ENABLED' : 'XP FARM: DISABLED';

    // Start the interval to check and update the canvas state
    startCanvasStateInterval();
}

let canvasStateInterval;

// Function to start the interval to check and update the canvas state
function startCanvasStateInterval() {
    clearInterval(canvasStateInterval); // Clear any existing interval
    canvasStateInterval = setInterval(updateCanvasState, 1000); // Check and update the canvas state every 100 milliseconds
}

// Function to update the canvas state based on XP farming status
function updateCanvasState() {
    let canvasElement = document.querySelector('.mapsConsumerUiSceneCoreScene__canvas.widget-scene-canvas');
    let topNewElements = document.querySelectorAll('.result-layout_topNew__Se0x0, .result-layout_topNewStandard__aFpQo');
    let topNewElements1 = document.querySelectorAll('.results-confetti_wrapper__9Vt_e');
    let overlayElement = document.getElementById('xpFarmOverlay');
    let textContainer = document.getElementById('xpFarmTextContainer');
    let audioIframe = document.getElementById('xpFarmAudioIframe');

    if (canvasElement) {
        if (xpFarmingEnabled) {
            canvasElement.style.display = 'none';
            topNewElements.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                }
            });
            topNewElements1.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                }
            });

            // Create the overlay element if it doesn't exist
            if (!overlayElement) {
                overlayElement = document.createElement('div');
                overlayElement.id = 'xpFarmOverlay';
                overlayElement.style.position = 'fixed';
                overlayElement.style.top = '0';
                overlayElement.style.left = '0';
                overlayElement.style.zIndex = '9999';
                overlayElement.style.backgroundImage = 'url("https://64.media.tumblr.com/e8052aa7ed30b7472b24dca9a04d6401/tumblr_oj0btsxSJF1rldv4go1_1280.gifv")';
                overlayElement.style.backgroundSize = 'cover';
                overlayElement.style.backgroundRepeat = 'no-repeat';
                document.body.appendChild(overlayElement);
            }

             if (!textContainer) {
    textContainer = document.createElement('div');
    textContainer.id = 'xpFarmTextContainer';
    textContainer.style.position = 'fixed';
    textContainer.style.top = '50%';
    textContainer.style.left = '50%';
    textContainer.style.transform = 'translate(-50%, -50%)';
    textContainer.style.zIndex = '10000';
    textContainer.style.textAlign = 'center';
    textContainer.style.color = 'white';
    document.body.appendChild(textContainer);

    let line1 = document.createElement('div');
    line1.textContent = 'XP FARM: ENABLED';
    line1.style.fontSize = '24px';
    line1.style.fontWeight = 'bold';
    line1.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.3)';
    line1.style.animation = 'glowAnimation 2s infinite';
    textContainer.appendChild(line1);

    let line2 = document.createElement('div');
    line2.textContent = 'PRESS P TO STOP FARMING';
    line2.style.fontSize = '18px';
    line2.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.3)';
    line2.style.animation = 'glowAnimation 2s infinite';
    textContainer.appendChild(line2);

    let line3 = document.createElement('div');
    line3.textContent = 'CHECK OUR YOUR PROFILE TO SEE YOUR LEVEL GO UP';
    line3.style.fontSize = '18px';
    line3.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.3)';
    line3.style.animation = 'glowAnimation 2s infinite';
    textContainer.appendChild(line3);

    let profileButton = document.createElement('button');
    profileButton.textContent = 'Click to go to Profile';
    profileButton.classList.add('profile-button');
    profileButton.addEventListener('click', function() {
        window.open('https://www.geoguessr.com/me/profile', '_blank');
    });
    textContainer.appendChild(profileButton);
}

            // Resize the overlay element based on the window size
            resizeOverlayElement();
            window.addEventListener('resize', resizeOverlayElement);

            // Create the audio iframe if it doesn't exist
            if (!audioIframe) {
                audioIframe = document.createElement('iframe');
                audioIframe.id = 'xpFarmAudioIframe';
                audioIframe.src = 'https://lofimusic.app/lofigirl';
                audioIframe.style.display = 'none'; // Hide the iframe
                document.body.appendChild(audioIframe);
            }
        } else {
            canvasElement.style.display = 'block';
            topNewElements.forEach(element => {
                if (element) {
                    element.style.display = 'block';
                }
            });
            topNewElements1.forEach(element => {
                if (element) {
                    element.style.display = 'block';
                }
            });

            // Remove the overlay element if it exists
            if (overlayElement) {
                document.body.removeChild(overlayElement);
                window.removeEventListener('resize', resizeOverlayElement);
            }

            // Remove the text container if it exists
            if (textContainer) {
                document.body.removeChild(textContainer);
            }

            // Remove the audio iframe if it exists
            if (audioIframe) {
                document.body.removeChild(audioIframe);
            }
        }
    }
}

// Function to resize the overlay element based on the window size
function resizeOverlayElement() {
    let overlayElement = document.getElementById('xpFarmOverlay');
    if (overlayElement) {
        overlayElement.style.width = window.innerWidth + 'px';
        overlayElement.style.height = window.innerHeight + 'px';
    }
}

// Set up a function to toggle XP farming status
function toggleXPFarmingStatus() {
    xpFarmingEnabled = !xpFarmingEnabled;
    showXPFarmStatus(); // Update the display based on the new status
}
// Add CSS animation for rainbow text to the existing styleElement
styleElement.textContent += `
    @keyframes rainbow-text {
        0% { color: red; }
        16.666% { color: orange; }
        33.333% { color: yellow; }
        50% { color: green; }
        66.666% { color: blue; }
        83.333% { color: indigo; }
        100% { color: violet; }
    }
`;

async function toggleScript() {
    console.log('Toggling script...');
    xpFarmingEnabled = !xpFarmingEnabled; // Toggle XP farming status
    console.log('XP farming enabled:', xpFarmingEnabled);
    showXPFarmStatus(); // Update the rainbow text to reflect the new status
    togglePopupBox(); // Display the popup box for enabling or disabling

    if (xpFarmingEnabled) {
        isRunning = true; // Set isRunning to true to start the script
        runScript(); // Call the runScript function to start the XP farm
    } else {
        isRunning = false; // Set isRunning to false to stop the script
        isPaused = false; // Reset pause status when stopping the script
        // Add any cleanup code here, such as removing event listeners or observers
    }
}

// Function to handle keydown events
function onKeyDown(e) {
    if (e.keyCode === 45) {
        togglePopup();
    }
    if (e.keyCode === 49) { // This is for placing a marker around the guessed location
        e.stopImmediatePropagation();
        placeMarker(true);
    }
    if (e.keyCode === 50) { // This is for precisely placing the marker on the guessed location
        e.stopImmediatePropagation();
        placeMarker(false);
    }
    if (e.keyCode === 51) { // This is for opening a separate window with Google Maps pinpointing the guessed location
        e.stopImmediatePropagation();
        mapsFromCoords(false);
    }
    if (e.keyCode === 52) { // This is for placing a marker further than the guessed location
        e.stopImmediatePropagation();
        placeMarker1(false);  /// will be used for next feature
    }
    if (e.keyCode === 53) { // This is for placing a marker further than the guessed location
        e.stopImmediatePropagation();
        placeMarker1(true);
    }
    if (e.key === 'p' || e.key === 'P') { // Check if the key pressed is the 'P' key
        toggleScript(); // Call function to toggle XP farming status and start or stop the script
    }
}

// Add event listener for keydown events
document.addEventListener("keydown", onKeyDown);

// Call the function to show XP farming status when the script runs
showXPFarmStatus();



////////////// OTHER IMPORTANT FEATURES NOTE: IF THIS CODE APPEARS IN ANY SCRIPTS I WILL LET IT BE TAKEN DOWN THIS CODE IS NOT LICENSED FOR >>>MIT<<< THEREFOR YOU CANNOT STEAL MY CODE YOU CAN BE INSPIRED BY IT BUT YOU CANNOT STEAL IT!! /////////////////////////////////////



////////// Button styles welcome screen and so on //////////////////

const popupStyles = `
.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 10px;
    z-index: 9999;
}

.popup p {
    margin: 0;
}
`;

// Append popup styles to existing styleElement
styleElement.textContent += popupStyles;


// Custom button styles
const buttonStyles = `



.custom-button {
    position: fixed;
    bottom: 20px;
    right: 100px; /* Adjust this value to move the button more to the left */
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    z-index: 9999;
    animation: shake 0.5s infinite alternate; /* Shake animation */
}

.custom-button:hover {
    background-color: #45a049;
}

/* Shake animation */
@keyframes shake {
    0% { transform: translateX(0); }
    100% { transform: translateX(-5px); } /* Adjust the distance and direction of the shake */
}

/* Spark animation */
@keyframes spark {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

.sparks {
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #FFD700; /* Yellow color */
    border-radius: 50%;
    animation: spark 1s infinite alternate; /* Spark animation */
}

.spark1 {
    top: -10px;
    left: 0;
}

.spark2 {
    top: -5px;
    left: 15px;
}

.spark3 {
    top: 15px;
    left: 5px;
}

.hide {
    display: none;
}
`;



// Remove the element on page reload
window.addEventListener('beforeunload', function() {
  document.querySelector('.signed-in-start-page_avatar__eLI_o').remove();
});

// Set an interval to sweep-check for the element and remove it if found
setInterval(function() {
  var element = document.querySelector('.signed-in-start-page_avatar__eLI_o');
  if (element) {
    element.remove();
  }
}, 1); // Check every 1 second




// Append button styles to existing styleElement
styleElement.textContent += buttonStyles;


 // Function to create and append the custom button
    function createCustomButton() {
        const button = document.createElement('button');
        button.className = 'custom-button';
        button.textContent = 'Join Discord';
        button.onclick = function() {
            window.open('https://discord.gg/5MXgjsN8vz', '_blank');
        };
        document.body.appendChild(button);
    }

    // Function to create and append the sparks
    function createSparks() {
        const spark = document.createElement('div');
        spark.className = 'spark';
        document.body.appendChild(spark);
        setTimeout(() => {
            spark.remove();
        }, 1000);
    }

// Function to display tooltips
function displayTooltip() {
    const tooltips = [
        "Join our server to stay updated!",
        "press p in classic maps to farm xp!",
        "Click me!!!",
        // Add more tips as needed
    ];
    const randomIndex = Math.floor(Math.random() * tooltips.length);

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltips[randomIndex];
    document.body.appendChild(tooltip);

    const buttonRect = document.querySelector('.custom-button').getBoundingClientRect();
    tooltip.style.top = buttonRect.top - tooltip.offsetHeight - 10 + 'px';

    // Calculate the horizontal position based on the current position of the button
    let leftPosition = buttonRect.left - tooltip.offsetWidth;
    let animationId;

    // Animate the tooltip to move with the button
    function animateTooltip() {
        leftPosition += 1; // Adjust the speed as needed
        tooltip.style.left = leftPosition + 'px';
        animationId = requestAnimationFrame(animateTooltip);
    }

    animateTooltip();

    // Remove tooltip after some time
    setTimeout(() => {
        cancelAnimationFrame(animationId);
        tooltip.remove();
    }, 8000); // 8 seconds
}

    // Main function to initialize the button and animations
    function init() {
        createCustomButton();
        setInterval(createSparks, 2000); // Adjust timing for sparks
        setInterval(displayTooltip, 50000); // Display tooltip every 5 minutes (300000 milliseconds)
    }

    // Initialize the script
    init();


////////////  ACCEPT ALL FRIEND REQUEST OR DELCINE THEM ALL //////////////////////

async function fetchWithCors(url, method, body) {
    return await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.8",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-client": "web"
        },
        "referrer": "https://www.geoguessr.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": (method == "GET") ? null : JSON.stringify(body),
        "method": method,
        "mode": "cors",
        "credentials": "include"
    });
};

let friend_reqs_api = "https://www.geoguessr.com/api/v3/social/friends/summary?page=0&fast=true";
let delete_friend_req_api = (id) => `https://www.geoguessr.com/api/v3/social/friends/${id}`;

async function denyPlayer(id) {
    await fetchWithCors(delete_friend_req_api(id), "DELETE", {});
    console.log(`${id} denied`);
};

async function acceptPlayer(id) {
    await fetchWithCors(delete_friend_req_api(id), "PUT", {});
    console.log(`${id} accepted`);
};

function doit(accept) {
    fetchWithCors(friend_reqs_api, "GET")
    .then(ans => ans.json())
    .then(json => {
        for (let item of json.requests) {
            accept ? acceptPlayer(item.userId) : denyPlayer(item.userId);
        }
    });
};

document.acceptAll = () => doit(true);
document.denyAll = () => doit(false);
document.doit = doit;

function makeButtons() {
    const button = document.createElement("li");
    button.classList.add("notification-list_notification__i0DH2");
    button.style = "display: flex; justify-content: center; padding: 0 0; padding-bottom: 15px;";
    button.innerHTML = `
        <div class="notification-list_notificationActions__9JEe6" style="margin: auto;">
            <button type="button" class="button_button__aR6_e button_variantPrimary__u3WzI" onclick="doit(true)" id="friend-reqs-true">
                <div class="button_wrapper__NkcHZ">
                    <span>Accept everyone</span>
                </div>
            </button>
            <button type="button" class="button_button__aR6_e button_variantPrimary__u3WzI" onclick="doit(false)" id="friend-reqs-false">
                <div class="button_wrapper__NkcHZ">
                    <span>Deny everyone</span>
                </div>
            </button>
        </div>`;
   return button;
}

new MutationObserver(async (mutations) => {
    if (document.getElementById("friend-reqs-true") != null) return;
    const notifications = document.querySelector('ul[class*="notification-list_notifications__"]') || document.querySelector('div[class*="notification-list_noNotifications__"]');
    if (notifications != null) {
        const buttons = makeButtons();
        notifications.insertBefore(buttons, notifications.childNodes[0]);
    }
}).observe(document.body, { subtree: true, childList: true });

// Call the function to create and append the custom button
createCustomButton();

////////////// END ///////////////////

// Function to remove the specified element
function removeElement() {
    const element = document.querySelector('[aria-describedby="02B001F7-17CC-44B3-B19C-3FB64E10D2E3"]');
    if (element) {
        element.remove();
    }
}

// Set interval to continuously check and remove the element every 1 second (1000 milliseconds)
setInterval(removeElement, 1000);

///// KEY PRESS SIMULATION NEEDED FOR XP FARM /////////////

// Function to simulate a Space bar key press
function simulateSpaceKeyPress() {
    // Create a new keyboard event for keydown event
    const keyDownEvent = new KeyboardEvent('keydown', {
        code: 'Space',
        key: ' ',
        keyCode: 32,
        which: 32,
        bubbles: true
    });

    // Dispatch the keydown event
    document.dispatchEvent(keyDownEvent);

    // Create a new keyboard event for keyup event
    const keyUpEvent = new KeyboardEvent('keyup', {
        code: 'Space',
        key: ' ',
        keyCode: 32,
        which: 32,
        bubbles: true
    });

    // Dispatch the keyup event after 1 second
    setTimeout(() => {
        document.dispatchEvent(keyUpEvent);
    }, 500); // Adjust the delay to 1000 milliseconds (1 second)
}

async function simulateKeyPress(keyCode) {
  const eventDown = new KeyboardEvent('keydown', { keyCode: keyCode });
  const eventUp = new KeyboardEvent('keyup', { keyCode: keyCode });

  document.dispatchEvent(eventDown);

  // Delay for a specific duration (e.g., 500 milliseconds)
  await new Promise(resolve => setTimeout(resolve, 5));

  document.dispatchEvent(eventUp);
}


// Define global variables
let isRunning = false;
let isPaused = false;

async function toggleScript2() {
    xpFarmingEnabled = !xpFarmingEnabled; // Toggle XP farming status
    showXPFarmStatus(); // Update the rainbow text to reflect the new status

    if (!xpFarmingEnabled) {
        togglePopupBox(); // Hide the popup box when disabling XP farm
    }

    isRunning = !isRunning;
    if (isRunning) {
        runScript();
    } else {
        isPaused = false; // Reset pause status when stopping the script
    }
}

// Function to start or pause the script
async function runScript() {
    while (isRunning) {
        if (!isPaused) {
            await simulateKeyPress(50); // Press '2' key
            await simulateSpaceKeyPress(); // Simulate Space bar key press

            // Simulate clicking on the game canvas
            const canvas = document.querySelector('.guess-map_canvas__cvpqv');
            if (canvas) {
                canvas.click();
            }

            // Delay for a short time
            await new Promise(resolve => setTimeout(resolve, 20));
        } else {
            // Delay for a short time
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}


// Function to add the overlay with the waving hand emoji and text only on the main page
function addWelcomeOverlay() {
    // Check if the current URL is the main page of GeoGuessr
    if (window.location.pathname === '/') {
        const overlay = document.createElement('div');
        overlay.id = 'welcomeOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw'; // Adjusted width to viewport width
        overlay.style.height = '100vh'; // Adjusted height to viewport height
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)'; // Initially black with full opacity
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '999999'; // Adjusted z-index to make sure it's in the foreground

        const handEmoji = document.createElement('span');
        handEmoji.style.fontSize = '48px';
        handEmoji.textContent = '👋';
        handEmoji.style.animation = 'wave 2s infinite'; // Apply animation to the hand emoji

        const text = document.createElement('p');
        text.style.fontSize = '24px';
        text.style.color = 'green'; // Set initial color to green
        text.textContent = 'Welcome Back!';
        text.style.animation = 'sparkle 1s linear infinite'; // Apply animation to the text

        overlay.appendChild(handEmoji);
        overlay.appendChild(text);

        document.body.appendChild(overlay);

        // Add a black background to cover the entire screen
        const body = document.querySelector('body');
        body.style.overflow = 'hidden'; // Hide scrollbars
        body.style.backgroundColor = 'black';

        // Fade out the black overlay
        setTimeout(() => {
            overlay.style.transition = 'opacity 1s'; // Apply transition for opacity change
            overlay.style.opacity = '0'; // Fade out the overlay
            body.style.overflow = ''; // Restore scrollbars
            body.style.backgroundColor = ''; // Restore background color
            setTimeout(() => {
                overlay.remove(); // Remove the overlay after fading out
            }, 1000); // Delay removal to match the transition duration

            // Trigger the menu animation to slide in instantly after the overlay has been hidden fully
            triggerMenuAnimation();
        }, 2000); // Delay the fade-out effect for 2 seconds
    }
}



// menu items (can customise following the same structure as the others)
// const [variable name] = `<a href="[link]"> [name to show in menu] </a>`
const singleplayer = `<a href="/singleplayer"> Singleplayer </a>`
const party = `<a href="/play-with-friends"> Party </a>`
const quiz = `<a href="/quiz"> Quiz </a>`
const ongoingGames = `<a href="/me/current"> Ongoing Games </a>`
const activities = `<a href="/me/activities"> Activities </a>`
const likedMaps = `<a href="/me/likes"> Liked Maps </a>`
const newParty = `<a href=/party"> Party </a>`
const profile = `<a href=/me/profile"> Profile </a>`
const badges = `<a href=/me/badges"> Badges </a>`
const account = `<a href=/me/settings"> Account </a>`
const community = `<a href="/community"> Community </a>`
const explorer = `<a href="/explorer"> Explorer </a>`
const dailyChallenge = `<a href="/daily-challenges"> Daily Challenge </a>`
const streaks = `<a href="/streaks"> Streaks </a>`

// items to show in menu (can customise list using variable names defined above)
const items = [ likedMaps, dailyChallenge, explorer, streaks, ongoingGames, ]

// ======================================================================================================================================================

async function setup(items) {
    await scanStyles();

    const start = `<div class="` + cn("slanted-wrapper_root__") + ` ` + cn("slanted-wrapper_variantGrayTransparent__") + `">
               <div class="` + cn("slanted-wrapper_start__") + ` ` + cn("slanted-wrapper_right__") + `"></div>
               <div class="` + cn("page-label_labelWrapper__") + `">
               <div style="--fs:var(--font-size-12);--lh:var(--line-height-12)" class="` + cn("label_label__") + `">`

    const end = `</div></div><div class="` + cn("slanted-wrapper_end__") + ` ` + cn("slanted-wrapper_right__") + `"></div></div>`
    let html = ""
    for (let item of items) {
        html = html + start + item + end
    }

    return html
}

const refresh = () => {
    // only refreshes if not loading
    if (document.querySelector("[class^='page-loading_loading__']")) return;

    // if header exists
    if (document.querySelector("[class^='header_header__']")) {
        const header = document.querySelector("[class^='header_header__']")

        // hides promos
        if (document.querySelector("[class^='header_promoDealButtonWrapper__']")) {
            document.querySelector("[class^='header_promoDealButtonWrapper__']").style.display = "none"
        }

        if (document.querySelector("[class^='header_pageLabel__']")) {
            let menu = document.querySelector("[class^='header_pageLabel__07UxK']")
            menu.style.display = "flex"

            // hides old menu items
            for (let child of menu.childNodes) {
                if (!child.classList.contains("newItems")) {
                    child.style.display = "none"
                }
            }

            // adds better menu items
            if (document.querySelector(".newItems") === null) {
                // creates new div from html
                const newItems = document.createElement("div")
                newItems.className = "newItems custom-menu-position" // Added custom class for positioning
                setup(items).then(function(result) { newItems.innerHTML = result })
                newItems.style.display = "flex"
                // prepends new div
                menu.prepend(newItems)
            }

        } else if (header.childNodes.length === 2) {

            let menu = document.createElement("div")
            menu.classList.add(cn("header_pageLabel__"))
            menu.style.display = "flex"
            header.childNodes[1].before(menu)
            header.style.display = "flex"

            // adds better menu items
            if (document.querySelector(".newItems") === null) {
                // creates new div from html
                const newItems = document.createElement("div")
                newItems.className = "newItems custom-menu-position" // Added custom class for positioning
                setup(items).then(function(result) { newItems.innerHTML = result })
                newItems.style.display = "flex"
                // prepends new div
                menu.prepend(newItems)
            }
        }

        // highlights active menu item
        if (document.querySelector(".newItems")) {
            let url = window.location.href
            const newItems = document.querySelector(".newItems")
            for (let i = 0; i < newItems.childNodes.length; i++) {
                let link = newItems.childNodes[i].querySelector("a")
                link.style.color = "white"
                newItems.childNodes[i].classList.remove(cn("slanted-wrapper_variantWhite__"))
                newItems.childNodes[i].classList.add(cn("slanted-wrapper_variantGrayTransparent__"))
                if (link.href == url) {
                    link.style.color = "#1a1a2e"
                    newItems.childNodes[i].classList.remove(cn("slanted-wrapper_variantGrayTransparent__"))
                    newItems.childNodes[i].classList.add(cn("slanted-wrapper_variantWhite__"))
                }
            }
        }
    }

    // hides maprunner on home
    if (document.querySelector("[class^='maprunner-start-page_content__']")) {
        document.querySelector("[class^='maprunner-start-page_content__']").style.display = "none"
    }
    if (document.querySelector("[class^='maprunner-start-page_progress__']")) {
        document.querySelector("[class^='maprunner-start-page_progress__']").style.display = "none"
    }
    if (document.querySelector("[class^='maprunner-class=signed-in-start-page_gradientPlate__A_ziw']")) {
        document.querySelector("[class^='maprunner-signed-in-start-page_gradientPlate__']").style.display = "none"
    }
    if (document.querySelector("[class^='maprunner-signed-in-start-page_avatar__']")) {
        document.querySelector("[class^='maprunner-signed-in-start-page_avatar__']").style.display = "none"
    }

    // hides footer on home
    if (document.querySelector("[class^='footer_footer__']")) {
        document.querySelector("[class^='footer_footer__']").style.display = "none"
    }

    // hides secondary menu on home
    if (document.querySelector("[class^='secondary-menu_menu__']") && !document.querySelector("[class^='pop-out-main-menu_wrapper__']")) {
        document.querySelector("[class^='secondary-menu_menu__']").style.display = "none"
    }

    // hides ongoing games on home
    if (document.querySelector("[class^='primary-menu_continuePlaying__']")) {
        document.querySelector("[class^='primary-menu_continuePlaying__']").style.display = "none"
    }

    // hides daily challenge on home
    if (document.querySelector("[class^='play-daily-badge_cardWrapper__']")) {
        document.querySelector("[class^='play-daily-badge_cardWrapper__']").style.display = "none"
    }
    if (document.querySelector("[class^='play-daily-badge_badgeCanvas__']")) {
        document.querySelector("[class^='play-daily-badge_badgeCanvas__']").style.display = "none"
    }

    if (document.querySelector("[class^='happy-holidays-button_root__']")) {
        document.querySelector("[class^='happy-holidays-button_root__']").style.display = "none"
    }

}

let observer4 = new MutationObserver((mutations) => {
    refresh();
});

observer4.observe(document.body, {
  characterDataOldValue: false,
  subtree: true,
  childList: true,
  characterData: false
});



// Function to trigger the menu animation to slide in
function triggerMenuAnimation() {
    // Define CSS animation for the primary menu wrapper
    const menuAnimation = `
        @keyframes slideIn {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
        }

        .primary-menu_wrapper__3ahEU {
            animation: slideIn 1s forwards; /* Apply the animation without delay */
        }
    `;

    // Append menu animation styles to existing styleElement
    const styleElement = document.createElement('style');
    styleElement.textContent = menuAnimation;
    document.head.appendChild(styleElement);
}

// Function to observe changes in the DOM and trigger menu animation when primary menu wrapper is present
function observeMenuWrapper() {
    const menuWrapper = document.querySelector('.primary-menu_wrapper__3ahEU');
    if (menuWrapper) {
        triggerMenuAnimation();
    }
}

// Function to setup the MutationObserver to observe changes in the DOM
function setupObserver() {
    const observer = new MutationObserver((mutations) => {
        observeMenuWrapper();
    });

    observer.observe(document.body, {
        characterDataOldValue: false,
        subtree: true,
        childList: true,
        characterData: false
    });
}

// Call the function to setup the MutationObserver
setupObserver();

// Call the function to trigger the menu animation when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    triggerMenuAnimation();
});

// Function to handle key press event
function handleKeyPress(event) {
    // Check if the pressed key is the Escape key (key code 27)
    if (event.keyCode === 27) {
        // Trigger the back button element
        const backButtonWrapper = document.querySelector('.back-button_contentWrapper__GN8_N');
        if (backButtonWrapper) {
            backButtonWrapper.click(); // Simulate a click event on the back button wrapper element
        }
    }
}

// Add event listener for key press events on the document
document.addEventListener('keydown', handleKeyPress);

// Call the function to add the overlay only when the script runs
addWelcomeOverlay();

// Update CSS animation for the hand emoji
const existingStyleElement = document.querySelector('style');
if (existingStyleElement) {
    existingStyleElement.textContent += `
        @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(-10deg); }
            20% { transform: rotate(10deg); }
            30% { transform: rotate(-10deg); }
            40% { transform: rotate(10deg); }
            50% { transform: rotate(-10deg); }
            60% { transform: rotate(10deg); }
            70% { transform: rotate(-10deg); }
            80% { transform: rotate(10deg); }
            90% { transform: rotate(-10deg); }
            100% { transform: rotate(0deg); }
        }

        @keyframes sparkle {
            0% { color: green; }
            50% { color: white; }
            100% { color: green; }
        }
    `;
}

// Call the function to add the overlay when the script runs
addWelcomeOverlay();


/////////////////// faster map closing and opening //////////////////////////

let activeClass;

function main1() {
  new MutationObserver(() => {
    const guessMap = document.querySelector(
      "[data-qa='guess-map']:not([data-skip])",
    );

    if (!guessMap) return;

    guessMap.setAttribute("data-skip", "");

    guessMap.addEventListener("mouseenter", () => {
      if (activeClass && !isPinned()) {
        guessMap.classList.add(activeClass);
      }
    });

    guessMap.addEventListener("mouseleave", () => {
      activeClass = guessMap.classList.item(guessMap.classList.length - 1);

      if (!isPinned()) {
        guessMap.classList.remove(activeClass);
      }
    });
  }).observe(document.body, { childList: true, subtree: true });
}

function isPinned() {
  const pinButton = document.querySelector(
    "[data-qa='guess-map__control--sticky-active']",
  );

  let pinned;

  if (pinButton) {
    pinButton.classList.forEach((cls) => {
      if (cls.includes("Active")) {
        pinned = true;
      }
    });
  }

  return pinned;
}

main1();


/////////////////// END //////////////////////////

// menu items (can customise following the same structure as the others)
// const [variable name] = `<a href="[link]"> [name to show in menu] </a>`


////////////////////////////// Blurring and unblurring email and important things for streaming //////////////////////////////////

// Create a style element
let style = document.createElement('style');

// Define CSS rules with initial blur
style.innerHTML = `
 .blurred {
  filter: blur(5px) !important;
 }
 .invite-modal_blurred {
  filter: blur(10px) !important;
 }
 .qr-blurred {
  filter: blur(8px) !important;
 }
`;

// Append the style element to the document body
document.body.appendChild(style);

// Function to add blur class to elements
function addBlurClass() {
 // Select all elements that need to be blurred
 const elementsToBlur = document.querySelectorAll('.edit-profile__section div[class^="form-field_formField__"] div p, input[name="email"][data-qa="email-field"], input[name="repeatEmail"], span[class^="copy-link_root__"] input, [class*="invite-modal_section__"]:nth-child(3):nth-child(3), [class*="invite-modal_qr__"]');

 // Loop through the selected elements
 elementsToBlur.forEach(element => {
  element.classList.add('blurred');
  if (element.classList.contains('invite-modal_section__')) {
   element.classList.add('invite-modal_blurred');
  }
  if (element.classList.contains('invite-modal_qr__')) {
   element.classList.add('qr-blurred');
  }
 });
}

// Function to remove blur class from elements
function removeBlurClass(element) {
 element.classList.remove('blurred');
 element.classList.remove('invite-modal_blurred');
 element.classList.remove('qr-blurred');
}

// Function to reapply blur effect to elements
function reapplyBlurEffect() {
 addBlurClass();
}

// Use MutationObserver to continuously monitor the DOM for changes
const observer5 = new MutationObserver(reapplyBlurEffect);
observer5.observe(document.body, { childList: true, subtree: true });

// Call the function to initially blur elements
addBlurClass();

// Function to handle mouseover event
function handleMouseover(event) {
 const target = event.target;
 removeBlurClass(target);
}

// Function to handle mouseout event
function handleMouseout(event) {
 const target = event.target;
 addBlurClass();
}

// Add mouseover and mouseout event listeners to each element
document.querySelectorAll('.edit-profile__section div[class^="form-field_formField__"] div p, input[name="email"][data-qa="email-field"], input[name="repeatEmail"], span[class^="copy-link_root__"] input, [class*="invite-modal_section__"]:nth-child(3):nth-child(3), [class*="invite-modal_qr__"]').forEach(element => {
 element.addEventListener('mouseover', handleMouseover);
 element.addEventListener('mouseout', handleMouseout);
});
////////////////////////////// END //////////////////////////////////


/////////////LOCATION ELEMENT FOR XP FARM START ////////////////////

// Function to detect and handle the "loading location" scenario
function handleLoadingLocation() {
  // Get the current page content
  const pageContent = document.body.innerText.toLowerCase();

  // Check if the string "loading location" is present
  if (pageContent.includes("loading location")) {
    // Hide the loading spinner elements
    const loadingSpinnerElements = document.querySelectorAll('.fullscreen-spinner_root__gtDP1.fullscreen-spinner_backgroundSolid__fO5_c');
    loadingSpinnerElements.forEach(element => {
      element.style.display = 'none';
    });
  }
}

// Call the handleLoadingLocation function every 100 milliseconds
setInterval(handleLoadingLocation, 10);

/////////////LOCATION ELEMENT FOR XP FARM END ////////////////////




////OPTIMIZATIONS///////

// Function to optimize the site
function optimizeSite() {
  console.log('Clearing lag and Optimizing for an optimal state of xp farming');

  // Clear the cache
  window.performance.clearResourceTimings();
  window.performance.navigation.type = PerformanceNavigation.TYPE_RELOAD;
  window.performance.timing.navigationStart = Date.now();

  // Remove the white bar at the bottom of the screen
  var target = document.documentElement;
  target.classList.remove("no-pro");
  target.classList.add("pro");

  // Lazy load images
  lazyLoadImages();
}

function lazyLoadImages() {
  var images = document.querySelectorAll('img[data-src]');
  images.forEach(function(img) {
    if (img.getBoundingClientRect().top < window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
}

// Function to scan for the button elements
function scanForButtons() {
  // Find the "Next" button
  var nextButton = document.querySelector('button[data-qa="close-round-result"][type="button"]');
  if (nextButton && nextButton.textContent.includes("Next")) {
    optimizeSite();
  }

  // Find the "View results" button
  var viewResultsButton = document.querySelector('button[data-qa="close-round-result"][type="button"]');
  if (viewResultsButton && viewResultsButton.textContent.includes("View results")) {
    optimizeSite();
  }
}

// Add an event listener to the window to scan for buttons
window.addEventListener('DOMContentLoaded', function() {
  setInterval(scanForButtons, 1000); // Scan for buttons every 1 second
  lazyLoadImages();
  window.addEventListener('scroll', lazyLoadImages);
});

// Add an event listener to clear the cache when the page is unloaded
window.addEventListener('beforeunload', function() {
  console.log('Optimizing Site...');
  optimizeSite();
});



// Function to clear the site's memory and cache
function clearSiteMemory() {
  // Clear the browser's cache
  window.caches.keys().then(function(keys) {
    keys.forEach(function(key) {
      window.caches.delete(key);
    });
  });

  // Clear the browser's cookies
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  // Force a garbage collection to free up memory
  if (window.performance && window.performance.memory) {
    if (typeof window.performance.memory.usedJSHeapSize !== 'undefined') {
      window.setTimeout(function() {
        window.performance.memory.usedJSHeapSize = 0;
      }, 0);
    }
  }
}

// Call the clearSiteMemory function every 5 seconds
setInterval(clearSiteMemory, 5000);


////OPTIMIZATIONS///////


// Function to inject the button



function checkURL() {
    if (location.pathname.includes("/user") || location.pathname.includes("/me/profile")) return 1;
    return 0;
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

async function checkUser(userURL) {
    try {
        const response = await fetch(userURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.log(err);
        return null;
    }
}

function updateXPProgressBar(user) {
    const xpProgressBar = document.querySelector(".profile-header_progress__q2GV7");
    if (xpProgressBar) {
        const levelElement = xpProgressBar.querySelector(".xp-progress-bar_currentLevel__s4v11");
        const progressBarElement = xpProgressBar.querySelector(".progress-bar_progress__lBTVv");
        const labelElement = xpProgressBar.querySelector(".progress-bar_label__VACXk");

        if (user) {
            const level = user.progress.level;
            const currentXP = user.progress.xp;
            const nextLevelXP = user.progress.nextLevelXp;
            const maxXPForLevel = user.progress.levelXp;
            const progress = ((currentXP - maxXPForLevel) / (nextLevelXP - maxXPForLevel)) * 100;

            levelElement.textContent = `Lvl ${level}`;
            progressBarElement.style.width = `${progress}%`;
            labelElement.textContent = `${currentXP - maxXPForLevel} / ${nextLevelXP - maxXPForLevel}`;
        }
    }
} 4000

let observer = new MutationObserver(() => {
    if (checkURL() == 1) {
        const profileLink = (location.pathname.includes("/me/profile")) ? document.querySelector('[name="copy-link"]').value : location.href;
        const userURL = `https://www.geoguessr.com/api/v3/users/${profileLink.split('/').pop()}`;
        checkUser(userURL).then(user => {
            if (user !== null) {
                // ... (existing code for displaying ban status and created date)

                // Update XP progress bar
                updateXPProgressBar(user);
            }
        });
    }
});

// Update XP progress bar every second
setInterval(() => {
    if (checkURL() == 1) {
        const profileLink = (location.pathname.includes("/me/profile")) ? document.querySelector('[name="copy-link"]').value : location.href;
        const userURL = `https://www.geoguessr.com/api/v3/users/${profileLink.split('/').pop()}`;
        checkUser(userURL).then(user => {
            if (user !== null) {
                updateXPProgressBar(user);
            }
        });
    }
}, 4000);






