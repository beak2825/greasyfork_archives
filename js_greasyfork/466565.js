// ==UserScript==
// @name         Add Google Search Buttons to Duckduckgo - faster searching in Google and Google Shopping (mobile)
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Adds Google and Google Shopping search buttons to DuckDuckGo search results with a visually appealing design for small and large displays, following the DuckDuckGo color scheme
// @match        https://duckduckgo.com/*
// @grant        none
// @author       Luciano Stanziani
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/466565/Add%20Google%20Search%20Buttons%20to%20Duckduckgo%20-%20faster%20searching%20in%20Google%20and%20Google%20Shopping%20%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466565/Add%20Google%20Search%20Buttons%20to%20Duckduckgo%20-%20faster%20searching%20in%20Google%20and%20Google%20Shopping%20%28mobile%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const colorScheme = {
    lightBG: 'var(--ddg-light-bg)',
    lightHoverBG: 'var(--ddg-light-hover-bg)',
    text: 'var(--ddg-text)',
    lightHoverText: 'var(--ddg-light-hover-text)',
    google: '#4964B3',
    googleShopping: '#4964B3'
  };

  const buttonsCacheKey = 'ddgGoogleSearchButtonsCache';

  document.addEventListener('DOMContentLoaded', function() {
    // Create container for buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('ddg-buttons-container');
    const searchForm = document.querySelector('#search_form');
    searchForm.insertAdjacentElement('beforebegin', buttonsContainer);

    // Create buttons
    let buttons = null;
    const buttonsCache = localStorage.getItem(buttonsCacheKey);
    if (buttonsCache) {
      buttons = JSON.parse(buttonsCache);
    } else {
      buttons = [
        { text: 'Google', dataLink: 'google', className: 'ddg-google-button' },
        { text: 'Google Shopping', dataLink: 'googleshopping', className: 'ddg-google-shopping-button' }
      ];
      localStorage.setItem(buttonsCacheKey, JSON.stringify(buttons));
    }

    buttons.forEach((button, index) => {
      const buttonElement = createButtonElement(button.text, button.dataLink, button.className);
      buttonsContainer.appendChild(buttonElement);

      buttonElement.addEventListener('click', event => {
        event.preventDefault();
        const searchBox = document.querySelector('#search_form_input');
        const searchText = searchBox.value.trim();
        if (searchText === '') {
          return;
        }
        const dataLink = buttonElement.getAttribute('data-zci-link');
        let searchURL = '';
        if (dataLink === 'google') {
          searchURL = `https://www.google.com/search?q=${searchText}&oq=${searchText}`;
        } else if (dataLink === 'googleshopping') {
          searchURL = `https://www.google.com/search?q=${searchText}&tbm=shop`;
        }
        searchOnGoogle(searchURL);
      });

      // Add margin between buttons
      if (index < buttons.length - 1) {
        buttonElement.style.marginRight = '10px';
      }
    });

    // Add styles to buttons container
    const styles = `
      .ddg-buttons-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 10px;
        background-color: ${colorScheme.lightBG};
        border-radius: 20px;
        width: calc(100% - 20px);
      }

      .ddg-buttons-container a:hover {
        background-color: ${colorScheme.lightHoverBG};
        color: ${colorScheme.lightHoverText};
      }

      .ddg-google-button, .ddg-google-shopping-button {
        transition: background-color 0.2s ease;
        color: #fff; /* Impostiamo il colore del testo su bianco */
      }

      :root[data-theme="dark"] .ddg-google-button, :root[data-theme="dark"] .ddg-google-shopping-button {
        background-color: #1a73e8l;
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  });

  // Helper function to create button elements
  function createButtonElement(text, dataLink, className) {
    const button = document.createElement('a');
    button.classList.add(className);
    button.setAttribute('data-zci-link', dataLink);
    button.textContent = text;
    button.href = '#';
    button.style.borderRadius = '20px';
    button.style.padding = '8px 16px';
    button.style.marginBottom = '8px';
    button.style.backgroundColor = colorScheme.google;
    button.style.color = 'fff';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    button.style.textDecoration = 'none';
    button.style.height = 'auto';
    button.style.whiteSpace = 'nowrap';
    button.style.overflow = 'hidden';
    button.style.textOverflow = 'ellipsis';
    button.style.flex = '1';
    return button;
  }

  // Helper function to search on Google
  function searchOnGoogle(url) {
    window.location.href = url;
  }

})();