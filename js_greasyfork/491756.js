// ==UserScript==
// @name         Chess Plus+
// @namespace    https://github.com/longkidkoolstar
// @version      1.1.2
// @description  Add Essential/Quality of life tweaks to Chess.com
// @author       longkidkoolstar
// @license      BSD-3-Clause
// @icon         https://cdn4.iconfinder.com/data/icons/chess-game-funny-colour/32/chess_game_funy_colour_ok_13-1024.png
// @require      https://greasyfork.org/scripts/471295-tweaking/code/Tweaking.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://www.chess.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/491756/Chess%20Plus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/491756/Chess%20Plus%2B.meta.js
// ==/UserScript==
 
 
/*
Copyright (c) 2023 longkidkoolstar
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
 
 
 
 
//Maybe Future stuff
 
// Function for Lichess game analysis
//function request_analysis() {
  //var button = $("button.text span[data-icon='']");
 // if (button) {
//    button.click();
//  }
//}
 
// Call request_analysis() only on Lichess game pages
//if (window.location.href.match('https://lichess.org/*')) {
//  request_analysis();
//}
 
 
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
 
 
  // Function to prompt the user for their OAuth token
  function promptForOAuthToken() {
    var token = prompt("Please enter your Lichess OAuth2 token:");
    if (token) {
      GM_setValue('lichessOAuthToken', token); // Save the token to GM_setValue
      return token;
    } else {
      alert("You must provide a valid OAuth token to use the script.");
      return null;
    }
  }
 
  // Get the OAuth token from GM_setValue or prompt the user
  var oauthToken = GM_getValue('lichessOAuthToken');
  if (!oauthToken) {
    oauthToken = promptForOAuthToken();
    if (!oauthToken) {
      return; // Stop the script if no token is provided
    }
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