// ==UserScript==
// @name            DuckDuckGo Middle Click Search v.2.1
// @author          Decembre
// @namespace       https://greasyfork.org/users/8
// @version         2.1.0
// @description     Middle clicking the search Button on DuckDucjGo search icon opens the results in a new tab. Fork of "Youtube Middle Click Search"v. 2.0.5 Kufii (Adrien Pyke?) without using wait-for-elements/wait-for-elements.js
// @icon            https://external-content.duckduckgo.com/ip3/duckduckgo.com.ico
// @include         https://duckduckgo.com/*
// @grant           GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/526769/DuckDuckGo%20Middle%20Click%20Search%20v21.user.js
// @updateURL https://update.greasyfork.org/scripts/526769/DuckDuckGo%20Middle%20Click%20Search%20v21.meta.js
// ==/UserScript==

/* ===========
If you want fork it for an other Site, watch in the code, the 3:
 // ConFig DuckDuckGo

This code completes the event listener attachment for the search suggestions.
It checks if the target element is not the remove button,
and if so, it constructs the search URL and navigates to the search results page
or opens the results in a new tab depending on the mouse button clicked.
If the target element is the remove button and the middle mouse button is clicked, i
t prevents the default behavior and stops the event propagation.
========== */

// Define an anonymous function to encapsulate the script's functionality
(function () {
  'use strict'; // Enable strict mode for better error handling

  // Define the script's name for logging purposes
  const SCRIPT_NAME = 'YMCS';

  // Define a utility object with various helper functions
  const Util = {
    // Log a message to the console with the script's name
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    // Query the DOM for an element using a CSS selector
    q(query, context = document) {
      return context.querySelector(query);
    },
    // Query the DOM for multiple elements using a CSS selector
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    },
    // Get a query parameter from the current URL
    getQueryParameter(name, url = window.location.href) {
      name = name.replace(/[[\]]/gu, '\\$&');
      const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/gu, ' '));
    },
    // Encode a URI with plus signs
    encodeURIWithPlus(string) {
      return encodeURIComponent(string).replace(/%20/gu, '+');
    }
  };

  // Define a function to wait for an element to be available in the DOM
  function waitForElems(options) {
    // Extract the options object's properties
    const { sel, onmatch, stop } = options;
    // Create an interval to check for the element's availability
    const intervalId = setInterval(() => {
      // Query the DOM for the element using the provided selector
      const elem = document.querySelector(sel);
      // If the element is found, call the onmatch function and clear the interval if stop is true
      if (elem) {
        onmatch(elem);
        if (stop) {
          clearInterval(intervalId);
        }
      }
    }, 100); // Check every 100ms
  }

// ConFig DuckDuckGo Search Button = .is-link-style-exp .search__button
  // Wait for the search button to be available and attach event listeners
  waitForElems({
    // Selector for the search button
    sel: '.is-link-style-exp .search__button',
    // Stop checking for the element once it's found
    stop: true,
    // Function to call when the element is found
    onmatch(btn) {
      // Prevent default behavior on middle click
      btn.onmousedown = function (e) {
        if (e.button === 1) {
          e.preventDefault();
        }
      };
      // Attach an event listener for clicks
      btn.onclick = function (e) {
        // Prevent default behavior
        e.preventDefault();
        e.stopImmediatePropagation();


// DuckDuckGo Search InPut = #search_form_input
        // Get the search input value
        const input = Util.q('#search_form_input').value.trim();
        // If the input is empty, do nothing
        if (!input) return false;
// DuckDuckGo Search URL
        // Construct the search URL = ?q=
        const url = `${location.origin}?q=${Util.encodeURIWithPlus(input)}`;
        // If the middle mouse button was clicked, open the results in a new tab
        if (e.button === 1) {
          GM_openInTab(url, true);
        } else if (e.button === 0) {
          // Otherwise, navigate to the search results page
          window.location.href = url;
        }

        return false;
      };
      // Attach an event listener for aux clicks (middle click)
      btn.onauxclick = btn.onclick;
    }
  });

  // Wait for the search suggestions to be available and attach event listeners
  waitForElems({
    // Selector for the search suggestions
    sel: '.sbsb_c',
    // Function to call when the element is found
    onmatch(result) {
            // Attach an event listener for clicks
      result.onclick = function (e) {
        // If the target element is not the remove button
        if (!e.target.classList.contains('sbsb_i')) {
          // Get the search suggestion text
          const search = Util.q('.sbpqs_a, .sbqs_c', result).textContent;

          // Construct the search URL
          const url = `${location.origin}/search/${Util.encodeURIWithPlus(search)}`;
          // If the middle mouse button was clicked, open the results in a new tab
          if (e.button === 1) {
            GM_openInTab(url, true);
          } else if (e.button === 0) {
            // Otherwise, navigate to the search results page
            window.location.href = url;
          }
        } else if (e.button === 1) {
          // Prevent opening in new tab if they middle click the remove button
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      };
      // Attach an event listener for aux clicks (middle click)
      result.onauxclick = result.onclick;
    }
  });
})();

