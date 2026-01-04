// ==UserScript==
// @name         PortaPotty (Fast Dump Search)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Speed up your dumps with the PortaPotty!
// @author       Lollipop [2717731]
// @match        https://www.torn.com/dump.php*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530863/PortaPotty%20%28Fast%20Dump%20Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530863/PortaPotty%20%28Fast%20Dump%20Search%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Configuration
  const DEBUG = false; // Set to true for console logging

  // Store the rfcv value
  let currentRfcv = null;

  // Logger function that only logs in debug mode
  const log = (...args) => DEBUG && console.log('[Fast Dump Search]', ...args);

  log('Initialized');

  // Function to add a quick search button to the dump page
  function addQuickSearchButton() {
    // Check if we're on the dump main page
    const dumpMainPage = document.querySelector('.dump-main-page');
    if (!dumpMainPage || document.getElementById('quickSearchButton')) {
      return; // Not on dump page or button already exists
    }

    // Create a button div similar to the existing buttons
    const quickSearchDiv = document.createElement('div');
    quickSearchDiv.className = 'quick-search-container';
    quickSearchDiv.style.marginTop = '15px';
    quickSearchDiv.style.textAlign = 'center';

    // Create the actual button with Torn styling
    quickSearchDiv.innerHTML = `
      <div class="btn-wrap silver" style="display: inline-block; margin: 0 auto;">
        <a class="btn torn-btn" href="#" id="quickSearchButton" role="button" style="background-color: #1c7ed6; position: relative;">
          <span style="color: white;"><span style="position: relative; top: -1px; margin-right: 4px;">⚡</span> QUICK SEARCH</span>
        </a>
      </div>
    `;

    // Add the button to the page
    dumpMainPage.appendChild(quickSearchDiv);

    // Add click event listener
    document.getElementById('quickSearchButton').addEventListener('click', function(e) {
      e.preventDefault();
      performQuickSearch();
    });

    // Try to extract rfcv right away
    currentRfcv = getRfcvFromPage();
    log('Initial rfcv value:', currentRfcv);
  }

  // Function to handle the search response and update UI without animation
  function handleSearchResponse(response) {
    try {
      // Parse the response if it's a string
      if (typeof response === 'string') {
        try {
          response = JSON.parse(response);
        } catch (e) {
          log('Failed to parse response:', e);
          return;
        }
      }

      // Get the necessary UI elements
      const infoText = document.querySelector('.info-text.search-result');
      const toDoNext = document.querySelector('.info-text.to-do-next');
      const buttonSet = document.querySelector('.button-set');
      const searcherDiv = document.querySelector('.searcher');

      // Hide all info texts
      document.querySelectorAll('.info-text').forEach(el => {
        el.style.display = 'none';
      });

      // Show the search result
      if (infoText) {
        infoText.style.display = 'block';
        infoText.innerHTML = response.text;
      }

      // Show the "what to do next" text
      if (toDoNext) {
        toDoNext.style.display = 'block';
        toDoNext.innerHTML = 'You can now pick up the item or search again.';
      }

      // Update the item image if we have item data
      if (searcherDiv && response.item && response.item.id) {
        const itemId = response.item.id;
        const itemName = response.item.name || 'Item';

        // Update the searcher div
        searcherDiv.className = 'searcher in-progress item-found';
        searcherDiv.innerHTML = `
          <span class="item-plate">
            <img class="torn-item large "
                 src="images/items/${itemId}/large.png"
                 srcset="images/items/${itemId}/large@2x.png 2x,
                         images/items/${itemId}/large@3x.png 3x,
                         images/items/${itemId}/large@4x.png 4x"
                 alt="${itemName}"
                 title="${itemName}">
          </span>
        `;

        // Add glow effect if item has a glow class
        if (response.item.glowClass) {
          const imgElement = searcherDiv.querySelector('img');
          if (imgElement) {
            imgElement.classList.add(response.item.glowClass);
          }
        }
      }

      // Update button states
      if (buttonSet) {
        buttonSet.querySelectorAll('.btn-wrap').forEach(btn => {
          btn.style.display = 'none';
        });

        // Show pick up and search again buttons
        const pickUpBtn = buttonSet.querySelector('.btn-wrap.pick-up');
        const againBtn = buttonSet.querySelector('.btn-wrap.again');
        if (pickUpBtn) pickUpBtn.style.display = 'block';
        if (againBtn) againBtn.style.display = 'block';
      }

    } catch (e) {
      log('Error handling search response:', e);
    }
  }

  // Function to perform a quick search
  function performQuickSearch() {
    // Make sure we have the rfcv value
    if (!currentRfcv) {
      // Try to get it from the page
      currentRfcv = getRfcvFromPage();

      if (!currentRfcv) {
        alert('Fast Dump Search: Could not find required search token. Please try searching normally first.');
        log('No rfcv value found');
        return;
      }
    }

    // Check if jQuery is available
    if (typeof $ !== 'undefined' && $.ajax) {
      // Use jQuery's AJAX for the request
      $.ajax({
        url: 'dump.php',
        type: 'POST',
        data: {
          step: 'search',
          rfcv: currentRfcv
        },
        success: handleSearchResponse,
        error: function(error) {
          log('Error performing search:', error);
          alert('Fast Dump Search: Error performing search. Please try again.');
        }
      });
    } else {
      // Use fetch API as fallback
      fetch('dump.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `step=search&rfcv=${encodeURIComponent(currentRfcv)}`,
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(handleSearchResponse)
      .catch(error => {
        log('Error performing search:', error);
        alert('Fast Dump Search: Error performing search. Please try again.');
      });
    }
  }

  // Function to extract rfcv from page
  function getRfcvFromPage() {
    // Try to get it from the search button href
    const searchBtn = document.querySelector('.btn-wrap.search a');
    if (searchBtn && searchBtn.getAttribute('href')) {
      const match = searchBtn.getAttribute('href').match(/rfcv=([^&]+)/);
      if (match) return match[1];
    }

    // Try to get it from a cookie as fallback
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('rfc_v=')) {
        return cookie.substring(6);
      }
    }

    return null;
  }

  // Use a more targeted approach to capture rfcv
  // Listen for clicks on the original search button
  document.addEventListener('click', function(e) {
    if (e.target && e.target.closest && e.target.closest('.btn-wrap.search a')) {
      const href = e.target.closest('.btn-wrap.search a').getAttribute('href');
      if (href) {
        const match = href.match(/rfcv=([^&]+)/);
        if (match) {
          currentRfcv = match[1];
          log('Updated rfcv from search button click:', currentRfcv);
        }
      }
    }
  });

  // Initialize the observer with more specific targeting
  const observerTarget = document.getElementById('mainContainer') || document.body;

  const observer = new MutationObserver(function(mutations) {
    // Only check if we need to add the button if relevant mutations happened
    if (mutations.some(m => m.addedNodes.length > 0)) {
      if (document.querySelector('.dump-main-page') && !document.getElementById('quickSearchButton')) {
        addQuickSearchButton();
      }
    }
  });

  // Start observing with a more targeted configuration
  observer.observe(observerTarget, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addQuickSearchButton);
  } else {
    addQuickSearchButton();
  }
})();
