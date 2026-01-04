// ==UserScript==
// @name         Chess Plus+
// @namespace    https://github.com/longkidkoolstar
// @version      2.0.2
// @description  Add Essential/Quality of life tweaks to Chess.com
// @author       longkidkoolstar
// @license      BSD-3-Clause
// @icon         https://cdn4.iconfinder.com/data/icons/chess-game-funny-colour/32/chess_game_funy_colour_ok_13-1024.png
// @require      https://greasyfork.org/scripts/471295-tweaking/code/Tweaking.js
// @require      https://update.greasyfork.org/scripts/21927/198809/arrivejs.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://www.chess.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/471296/Chess%20Plus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/471296/Chess%20Plus%2B.meta.js
// ==/UserScript==


/*
Copyright (c) 2023 longkidkoolstar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function () {
    'use strict';
  
    // Check if Auto Queue is on
    var autoQueue = GM_getValue('autoQueue', false);
    var lichessAnalysis = GM_getValue('lichessAnalysis', true);
  
    // Function to toggle Lichess Analysis on/off
    function toggleLichessAnalysis() {
      lichessAnalysis = !lichessAnalysis;
      GM_setValue('lichessAnalysis', lichessAnalysis);
      console.log('Lichess Analysis is now ' + (lichessAnalysis ? 'on' : 'off'));
    }
  
    // Function to handle the Lichess Analysis button click
    function handleLichessAnalysisClick() {
      if (lichessAnalysis) {
        sendToLichess();
      }
        else {
            alert("Tweak not Enabled in Menu. Enable it to Use!");
    }
   }
    // Function to toggle Auto Queue on/off
    function toggleAutoQueue() {
      autoQueue = !autoQueue;
      GM_setValue('autoQueue', autoQueue);
      console.log('Auto Queue is now ' + (autoQueue ? 'on' : 'off'));
  
      if (autoQueue) {
        clickButton();
        startObserver();
      } else {
        stopObserver();
      }
    }
  
    // Function to click the "New" button
    function clickButton() {
      var buttons = document.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].innerText.includes('New')) {
          buttons[i].click();
          break;
        }
      }
    }
  
    // Observer instance
    var observer = null;
  
    // Function to start observing the button
    function startObserver() {
      observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.addedNodes.length > 0) {
            clickButton();
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  
    // Function to stop observing the button
    function stopObserver() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  
    // If Auto Queue is on, click the button whenever it becomes available
    if (autoQueue) {
      clickButton();
      startObserver();
    }
    // Main loop
    checkGameStatus();
  
    function checkGameStatus() {
      document.arrive('.game-review-buttons-review', function () {
        // Find chess.com analysisButton
        var analysisButton = document.querySelector('.ui_v5-button-component.ui_v5-button-primary.ui_v5-button-full.game-review-buttons-button');
        if (analysisButton.className == 'ui_v5-button-component ui_v5-button-primary ui_v5-button-full game-review-buttons-button') {
          Arrive.unbindAllArrive();
          injectButton(analysisButton);
          checkGameStatus();
        }
      });
    }
  
    let isChessCom = true;
if (!window.location.href.includes("chess.com")) {
    isChessCom = false;
}

function showRatingWindow() {
  if(localStorage.getItem('extensionRatingWindowClosed') === null){
      localStorage.setItem('extensionRatingWindowClosed', (Math.random() * 4)+15);
  }
  if (localStorage.getItem('extensionRatingWindowClosed') > 0) {
      return; // If so, do not show the rating window again
  }
  if(document.ratingWindow){
      return; // already showing a rating window
  }
  // Create a div element for the rating window
  document.ratingWindow = document.createElement('div');
  document.ratingWindow.style.position = 'fixed';
  document.ratingWindow.style.top = '9%'; // Adjust the top position as needed
  document.ratingWindow.style.right = '10px'; // Adjust the right position as needed
  document.ratingWindow.style.width = '30vw';
  document.ratingWindow.style.backgroundColor = '#fff';
  document.ratingWindow.style.padding = '20px';
  document.ratingWindow.style.border = '1px solid #ccc';
  document.ratingWindow.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  document.ratingWindow.style.textAlign = 'center';
  document.ratingWindow.style.zIndex = 99999;
  document.ratingWindow.innerHTML = `
      <div style="display: inline-block; text-align: center;">
      <p>Hey!</p>
      <p>My name is Victor. I am a college student who made the UCSD Schedule Visualizer extension! </p>
      <p>I made it on my own time entirely for free.</p>
      <p>I would really appreciate it if you could rate it on google chrome store, or could share it with your classmates!</p>
      <p>It would help me and my work a lot!</p>
          <div style="display: inline-block; text-align: left;">
              <p>Thank you!</p>
          </div>
      </div>
    <button id="rateButton" style="padding: 10px 20px; background-color: #4CAF50; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Rate Now</button>
    <button id="dismissButton" style="margin-left: 10px; padding: 10px 20px; background-color: #ccc; color: #333; border: none; border-radius: 5px; cursor: pointer;">Dismiss</button>
  `;

  // Append the rating window to the body
  document.body.appendChild(document.ratingWindow);

  document.getElementById('rateButton').addEventListener('click', onRatingNow);
  document.getElementById('dismissButton').addEventListener('click', onRatingDismiss);
}

function getRatingWindow(){
  return document.ratingWindow;
}

function checkToShowButton() {
    if (lichessAnalysis) {
        if (!document.importToLichessButton) {
            document.importToLichessButton = injectImportButton();
        }
        showRatingWindow();
        const ratingWindow = getRatingWindow();
        if (shouldShowImportButton()) {
            document.importToLichessButton.hidden = false;
            if (ratingWindow) {
                ratingWindow.hidden = false;
            }
            return;
        }
        // Don't do anything if not on live chess
        document.importToLichessButton.hidden = true;
        if (ratingWindow) {
            ratingWindow.hidden = true;
        }
    } else {
        if (document.importToLichessButton) {
            document.importToLichessButton.parentNode.removeChild(document.importToLichessButton);
            delete document.importToLichessButton;
        }
    }
}


function injectImportButton() {
    let analyseButton = document.createElement("button");

    // Create a span element for the icon
    var iconSpan = document.createElement("span");
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.className = "ui_v5-button-icon icon-font-chess chess-board-search";
    
    // Append the icon span to the button
    analyseButton.appendChild(iconSpan);
    
    // Style the button
    analyseButton.style.position = "fixed";
    analyseButton.style.top = "5%"; // Adjust the top position as needed
    analyseButton.style.right = "10px"; // Adjust the right position as needed
    analyseButton.style.backgroundColor = "#363732"; // gray color
    analyseButton.style.color = "#C7C7C5";
    analyseButton.style.padding = ".5rem 0.5rem";
    analyseButton.style.border = "1px solid #272422"; // Border color
    analyseButton.style.borderRadius = "5px";
    analyseButton.style.cursor = "pointer";
    analyseButton.style.fontSize = "16px";
    analyseButton.style.zIndex = 9999;
    analyseButton.innerHTML += "Lichess Analysis";
    document.body.appendChild(analyseButton);
    analyseButton.addEventListener("click", importGame);
    return analyseButton;
}

function shouldShowImportButton() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("chess.com/game/live")
        || currentUrl.includes("chess.com/live#g=")
        || currentUrl.includes("chess.com/game/daily")) {
        // if you are on live game but don't have a share button, don't show
        if (currentUrl.includes("chess.com/game/live") && !getShareButton()) {
            return false;
        }
        return true;
    }
    return false;
}

function getShareButton() {
    // Find and press the share button
    const shareButtonClasses = [
        "icon-font-chess share daily-game-footer-icon",
        "icon-font-chess share live-game-buttons-button",
        "icon-font-chess share game-buttons-button", // in case of chess.com/live#g=
        "icon-font-chess share daily-game-footer-icon", // in case of chess.com/game/daily
        "icon-font-chess share daily-game-footer-button" // in case of chess.com/game/live
    ];

    let shareButton = null;
    for (let i = 0; i < shareButtonClasses.length; i++) {
        shareButton = document.getElementsByClassName(shareButtonClasses[i])[0];
        if (shareButton) {
            break;
        }
    }
    if (!shareButton) {
        // in other cases, try to find the button by aria-label "Share"
        shareButton = document.querySelector('button[aria-label="Share"]');
    }
    return shareButton;
}

async function importGame() {
    const gameURL = window.location.href.trim();
    // Website check
    if (!gameURL.includes("chess.com")) {
        alert("You are not on chess.com! Press me when you are viewing the game you'd like to analyze!");
        throw new Error("Wrong website");
    }
    // URL on game check
    if (!gameURL.includes("chess.com/game/live")
        && !gameURL.includes("chess.com/live#g=")
        && !gameURL.includes("chess.com/game/daily")) {
        alert("You are not viewing a game! Press me when you are viewing the game you'd like to analyze! (when URL contains chess.com/game/live)");
        throw new Error("Not on game");
    }

    if (localStorage.getItem(gameURL)) {
        // This game was cached before!
        window.open(localStorage.getItem(gameURL));
        getCloserToShowingRatingWindow();
        return;
    }

    const shareButton = getShareButton();
    
    if (!shareButton) {
        alert("I could not find the FEN! The game is probably not finished. Try clicking me when the game is over.");
        throw new Error("No share button");
    }
    shareButton.click();

    const pgnTabButton = await findElementByClassName("board-tab-item-underlined-component share-menu-tab-selector-tab");
    if (!pgnTabButton) {
        console.log("Could not get the PGN");
        return;
    }
    
    // Find PGN window and copy the text value
    const pgnTextArea = await findElementByClassName("share-menu-tab-pgn-textarea");
    if (!pgnTextArea) {
        console.log("Could not get the PGN");
        return;
    }
    let gamePGN = pgnTextArea.value;
    // Close the share window
    let closeButton = document.querySelector('.icon-font-chess.x') || document.querySelector('[aria-label="Close"]');
    if (closeButton) {
        closeButton.click();
    }
    // Ensure the game PGN has value
    if (!gamePGN.trim()) {
        alert("Not a valid PGN! Make sure you are on chess.com/games! If this is not correct, please contact the creator.");
        return;
    }

    // Ensure that the game is finished
    if (!gamePGN.includes("[Termination")) {
        // Don't import unfinished games, personal policy
        alert("Can only import finished games!");
        return;
    }

    // Send a post request to Lichess to import a game
    requestLichessURL(gamePGN, (url) => {
        if (url) {
            const lichessImportedGameURL = `${url}?from_chesscom=true`;
            window.open(lichessImportedGameURL);
            localStorage.setItem('extensionRatingWindowClosed', localStorage.getItem('extensionRatingWindowClosed') - 1);
            localStorage.setItem(gameURL, lichessImportedGameURL);
            getCloserToShowingRatingWindow();
            showRatingWindow();
        } else alert("Could not import game");
    });
}

async function requestLichessURL(pgn, callback) {
  let url = 'https://lichess.org/api/import';
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pgn: pgn })
  });

  if (response.ok) {
    let data = await response.json();
    callback(data);
  } else {
    callback(null);
  }
}


function findElementByClassName(className, maxAttempts = Infinity, interval = 100, minDuration = 4000) {
    return new Promise((resolve, reject) => {
        let startTime = Date.now();
        let attempts = 0;

        function search() {
            const element = document.getElementsByClassName(className)[0];
            
            if (element) {
                resolve(element);
            } else {
                attempts++;

                if (attempts < maxAttempts && (Date.now() - startTime) < minDuration) {
                    setTimeout(search, interval);
                } else {
                    resolve(null);
                }
            }
        }

        search();
    });
}

if (isChessCom) {
    // Listen for changes, the event listeners don't seem to work
    setInterval(() => {
        checkToShowButton();
    }, 500);
    checkToShowButton(); 
      
    if (localStorage.getItem('extensionRatingWindowClosed') === null) {
        localStorage.setItem('extensionRatingWindowClosed', 3);
    }
}

  
    // Injects a button similar to chess.com's native "Analysis" button
    function injectButton(analysisButton) {
      // Duplicate the original button
      let newButton = analysisButton.cloneNode(true);
      // Style it and link it to the Lichess import function.
      newButton.childNodes[2].innerText = 'Lichess Analysis';
      newButton.style.margin = '8px 0px 0px 0px';
      newButton.style.padding = '0px 0px 0px 0px';
      newButton.childNodes[0].classList.remove('icon-font-chess');
      newButton.childNodes[0].classList.add('button-class');
      newButton.classList.add('shine-hope-anim');
      newButton.childNodes[0].style['height'] = '3.805rem';
      newButton.addEventListener('click', handleLichessAnalysisClick); // Update the click event handler);
      // Append back into the DOM
      let parentNode = analysisButton.parentNode;
      parentNode.append(newButton);
    }
  
  

  
    // Make request to Lichess through the API (fetch)
    function sendToLichess() {
      // 1. Get PGN
  
      // Get and click download button on chess.com
      let downloadButton = document.getElementsByClassName('icon-font-chess share live-game-buttons-button')[0];
      downloadButton.click();
  
      // Wait for share tab to pop up
      document.arrive('.share-menu-tab-pgn-textarea', function () {
        Arrive.unbindAllArrive();
  
        // Get PGN from text Area
        var PGN = document.getElementsByClassName('share-menu-tab-pgn-textarea')[0].value;
  
        // Exit out of download view (x button)
        document.querySelector('div.icon-font-chess.x.ui_outside-close-icon').click();
  
        // 2. Send a POST request to Lichess to import the current game
        let importUrl = 'https://lichess.org/api/import';
        let req = { pgn: PGN };
        post(importUrl, req, oauthToken) // Pass the OAuth token to the post function
          .then((response) => {
            // Open the page on a new tab
            let url = response['url'] ? response['url'] : '';
            if (url) {
              let lichessPage = window.open(url);
            } else alert('Could not import game');
          })
  .catch((e) => {
          console.error('Error getting response from lichess.org', e);
          alert('Error getting response from lichess.org');
          throw new Error('Response error');
        });
      });
    }
  
    // async POST function with the OAuth token in the headers
    async function post(url = '', data = {}, token) {
      var formBody = [];
      for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`, // Include the OAuth token in the headers
        },
        body: formBody.join('&'),
      });
      return response.json();
    }
  
    // Add a Tweaks dropdown menu
    var tweaksMenu = document.createElement('div');
    tweaksMenu.classList.add('chess-com-tweaks-menu');
    tweaksMenu.innerHTML = `
      <style>
        /* Chess.com theme styles */
        .chess-com-tweaks-menu {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #5E9949;
          color: #EEEED2;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          font-family: Arial, sans-serif;
          z-index: 9999;
          max-width: 100%;
          min-width: 60px;
          overflow: hidden;
          opacity: 0.9;
          transition: all 0.3s;
          transform: translateX(100%);
        }
  
        .chess-com-tweaks-menu.expanded {
          transform: translateX(0);
        }
  
        .chess-com-tweaks-menu__button-wrapper {
          padding: 8px;
          text-align: center;
          background-color: #2B4730;
          border-radius: 4px 4px 0 0;
          cursor: pointer;
        }
  
        .chess-com-tweaks-menu__button {
          color: white;
          padding: 8px 16px;
          font-size: 14px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
  
        .chess-com-tweaks-menu.expanded .chess-com-tweaks-menu__button {
          border-radius: 4px 4px 0 0;
        }
  
        .chess-com-tweaks-menu__button:hover {
          background-color: #1C3523;
        }
  
        .chess-com-tweaks-menu__dropdown {
          padding: 8px;
          max-height: 250px;
          overflow-y: auto;
        }
  
        .chess-com-tweaks-menu.expanded .chess-com-tweaks-menu__dropdown {
          display: block;
        }
  
        .chess-com-tweaks-menu__item {
          display: flex;
          align-items: center;
          padding: 4px;
          font-size: 14px;
        }
  
        .chess-com-tweaks-menu__label {
          flex-grow: 1;
          margin: 0;
          padding-left: 8px;
          color: #EEEED2;
        }
  
        .chess-com-tweaks-menu__toggle-wrapper {
          margin-right: 8px;
        }
  
        .chess-com-tweaks-menu__toggle {
          display: none;
        }
  
        .chess-com-tweaks-menu__toggle-label {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
          background-color: #ccc;
          border-radius: 10px;
          cursor: pointer;
        }
  
        .chess-com-tweaks-menu__toggle-label::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background-color: #fff;
          border-radius: 50%;
          transition: transform 0.3s;
        }
  
        .chess-com-tweaks-menu__toggle:checked + .chess-com-tweaks-menu__toggle-label::after {
          transform: translateX(20px);
          background-color: #4CAF50;
        }
      </style>
      <div class="chess-com-tweaks-menu__button-wrapper" id="tweaksButton">Tweaks</div>
      <div class="chess-com-tweaks-menu__dropdown" id="tweaksDropdown">
        <div class="chess-com-tweaks-menu__item">
          <label class="chess-com-tweaks-menu__label">Auto Queue</label>
          <div class="chess-com-tweaks-menu__toggle-wrapper">
            <input class="chess-com-tweaks-menu__toggle" type="checkbox" id="autoQueueToggle" ${autoQueue ? 'checked' : ''}>
            <label class="chess-com-tweaks-menu__toggle-label" for="autoQueueToggle"></label>
          </div>
        </div>
        <div class="chess-com-tweaks-menu__item">
          <label class="chess-com-tweaks-menu__label">Lichess Analysis</label>
          <div class="chess-com-tweaks-menu__toggle-wrapper">
            <input class="chess-com-tweaks-menu__toggle" type="checkbox" id="lichessAnalysisToggle" ${lichessAnalysis ? 'checked' : ''}>
            <label class="chess-com-tweaks-menu__toggle-label" for="lichessAnalysisToggle"></label>
          </div>
        </div>
        <!-- Add more tweaks here as needed -->
      </div>
    `;
  
  
    var expanded = false;
    var menuButton = tweaksMenu.querySelector('#tweaksButton');
    menuButton.addEventListener('click', function (event) {
      event.preventDefault();
      expanded = !expanded;
      tweaksMenu.classList.toggle('expanded', expanded);
    });
  
      tweaksMenu.querySelector('#lichessAnalysisToggle').addEventListener('change', function (event) {
      toggleLichessAnalysis();
    });
  
    tweaksMenu.querySelector('#autoQueueToggle').addEventListener('change', function (event) {
      toggleAutoQueue();
    });
  
    // Add a CSS class to the document body for the chess.com theme
    document.body.classList.add('chess-com-theme');
  
    document.body.appendChild(tweaksMenu);
  })();
  