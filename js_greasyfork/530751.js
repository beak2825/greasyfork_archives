// ==UserScript==
// @name         Fast Roulette
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Speed up roulette by skipping the animation :)
// @author       Lollipop [2717731]
// @match        https://www.torn.com/page.php?sid=roulette*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530751/Fast%20Roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/530751/Fast%20Roulette.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('Fast Roulette: Initialized');

  // Store the last detected stake data
  let lastStakeData = {
    rfcv: null,
    decodedStake: null
  };

  // Function to add the custom repeat element
  function addCustomElement() {
    // Check if infoSpot exists
    const infoSpot = document.getElementById('infoSpot');
    if (!infoSpot || document.getElementById('customRepeatButton')) {
      return; // Element not found or button already exists
    }

    console.log('Fast Roulette: Adding custom repeat button');

    // Create the custom element with the same styling as infoSpot
    const customElement = document.createElement('div');
    customElement.id = 'customRepeatButton';
    customElement.className = 'info-msg-cont border-round m-top10';

    customElement.innerHTML = `
      <div class="info-msg border-round">
        <i class="info-icon"></i>
        <div class="delimiter">
          <div class="msg right-round" id="customRepeatText" style="color: #FF69B4;">Repeat Last Bet</div>
        </div>
      </div>
    `;

    // Add some cursor pointer style to make it look clickable
    customElement.style.cursor = 'pointer';

    // Insert the custom element after infoSpot
    infoSpot.parentNode.insertBefore(customElement, infoSpot.nextSibling);

    // Add click event listener
    customElement.addEventListener('click', function() {
      console.log('Fast Roulette: Custom repeat button clicked');

      if (lastStakeData.rfcv && lastStakeData.decodedStake) {
        console.log('Fast Roulette: Repeating bet with stake:', lastStakeData.decodedStake);

        // Use jQuery's AJAX to match Torn's format
        $.ajax({
          url: 'page.php',
          type: 'GET',
          data: {
            rfcv: lastStakeData.rfcv,
            sid: 'rouletteData',
            step: 'processStakes',
            mode: 'html',
            stake0: lastStakeData.decodedStake
          },
          success: onSuccessResponse,
          error: function(error) {
            console.error('Fast Roulette: Error placing bet:', error);
            displayInfo('Failed to place bet. Please try again.', 'red');
          }
        });
      } else {
        console.log('Fast Roulette: No previous bet data available');
        displayInfo('No previous bet data available. Place a bet first.', 'red');
      }
    });
  }

  // Function to handle bet response without animation
  function onSuccessResponse(response) {
    try {
      // Parse the response if it's a string
      if (typeof response === 'string') {
        try {
          response = JSON.parse(response);
        } catch (e) {
          console.error('Fast Roulette: Failed to parse response:', e);
          displayInfo('Failed to parse response. Please try again.', 'red');
          return;
        }
      }

      // Update UI with result
      const title = response.won ? `You won \$${response.won}!` : 'You lost...';
      const message = ' The ball landed on ' + response.number;

      // Display result info
      displayInfo(title + message, response.won ? 'green' : 'red');

      // Update money and tokens (no animation)
      $('#st_money_val').html('$' + toNumberFormat(response.totalAmount));
      $('#st_tokens_val').html(response.tokens);

      // Update other UI elements if needed
      if (response.bet) {
        $('#st_bet_val').html(response.bet);
      }

      if (response.won) {
        $('#st_won_val').html('$' + toNumberFormat(response.won));
      } else {
        $('#st_won_val').html('$0');
      }
    } catch (e) {
      console.error('Fast Roulette: Error handling bet response:', e);
      displayInfo('Error handling bet response. Please try again.', 'red');
    }
  }

  // Helper function to display info message
  function displayInfo(message, color) {
    const infoSpotText = document.getElementById('infoSpotText');
    if (infoSpotText) {
      infoSpotText.textContent = message;
      infoSpotText.style.color = color || '';

      // Reset color after a delay
      setTimeout(() => {
        infoSpotText.style.color = '';
      }, 5000);
    }
  }

  // Helper function to format numbers like Torn does
  function toNumberFormat(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Function to safely decode a URL component
  function safeDecodeURIComponent(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      console.error('Fast Roulette: Error decoding:', str);
      return str;
    }
  }

  // Create a proxy for the original XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;

  function newXHR() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;

    xhr.open = function() {
      this._url = arguments[1];
      return originalOpen.apply(this, arguments);
    };

    xhr.send = function() {
      const url = this._url;

      if (url && typeof url === 'string') {
        // Check if this is a processStakes request
        if (
          url.includes('sid=rouletteData') &&
          url.includes('step=processStakes') &&
          url.includes('stake0=')
        ) {
          // Extract the rfcv value
          const rfcvMatch = url.match(/rfcv=([^&]+)/);
          const rfcv = rfcvMatch ? rfcvMatch[1] : null;

          // Extract the stake0 value
          const stakeMatch = url.match(/stake0=([^&]+)/);
          const encodedStake = stakeMatch ? stakeMatch[1] : null;

          if (rfcv && encodedStake) {
            // Decode the stake value
            const decodedStake = safeDecodeURIComponent(encodedStake);

            console.log('Fast Roulette: Detected stake processing request');
            console.log('Fast Roulette: Decoded Stake:', decodedStake);

            // Store the stake data
            lastStakeData = {
              rfcv: rfcv,
              decodedStake: decodedStake
            };

            // Add or update the custom element after a short delay
            setTimeout(addCustomElement, 500);
          }
        }
      }

      return originalSend.apply(this, arguments);
    };

    return xhr;
  }

  // Replace the global XMLHttpRequest with our proxied version
  window.XMLHttpRequest = newXHR;

  // Also handle fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (input && typeof input === 'string') {
      // Check if this is a processStakes request
      if (
        input.includes('sid=rouletteData') &&
        input.includes('step=processStakes') &&
        input.includes('stake0=')
      ) {
        // Extract the rfcv value
        const rfcvMatch = input.match(/rfcv=([^&]+)/);
        const rfcv = rfcvMatch ? rfcvMatch[1] : null;

        // Extract the stake0 value
        const stakeMatch = input.match(/stake0=([^&]+)/);
        const encodedStake = stakeMatch ? stakeMatch[1] : null;

        if (rfcv && encodedStake) {
          // Decode the stake value
          const decodedStake = safeDecodeURIComponent(encodedStake);

          console.log('Fast Roulette: Detected stake processing fetch request');
          console.log('Fast Roulette: Decoded Stake:', decodedStake);

          // Store the stake data
          lastStakeData = {
            rfcv: rfcv,
            decodedStake: decodedStake
          };

          // Add or update the custom element after a short delay
          setTimeout(addCustomElement, 500);
        }
      }
    }

    return originalFetch.apply(this, arguments);
  };
})();
