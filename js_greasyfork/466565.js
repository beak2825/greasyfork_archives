// ==UserScript==
// @name         Add Google Search Buttons to DuckDuckGo & Brave Search
// @namespace    http://tampermonkey.net/
// @version      9.0.2026
// @description  Adds Google and Google Shopping buttons to DuckDuckGo and Brave Search with DuckDuckGo color scheme (desktop & mobile)
// @match        https://duckduckgo.com/*
// @match        https://search.brave.com/*
// @grant        none
// @author       Updated 2026
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/466565/Add%20Google%20Search%20Buttons%20to%20DuckDuckGo%20%20Brave%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/466565/Add%20Google%20Search%20Buttons%20to%20DuckDuckGo%20%20Brave%20Search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const colorScheme = {
    lightBG: '#ffffff',
    lightHoverBG: '#e8e8e8',
    text: '#333',
    lightHoverText: '#000',
    google: '#4964B3',
    googleHover: '#3d4f96'
  };

  const buttonsCacheKey = 'ddgGoogleSearchButtonsCache';
  const isDuckDuckGo = window.location.href.includes('duckduckgo.com');
  const isBraveSearch = window.location.href.includes('search.brave.com');

  function getSearchInputElement() {
    if (isDuckDuckGo) {
      return document.querySelector('input[name="q"]') || 
             document.querySelector('#search_form_input') ||
             document.querySelector('input[type="text"][aria-label*="search" i]');
    } else if (isBraveSearch) {
      return document.querySelector('input[name="q"]') ||
             document.querySelector('input[type="search"]') ||
             document.querySelector('input[placeholder*="search" i]');
    }
    return null;
  }

  function getSearchFormElement() {
    if (isDuckDuckGo) {
      return document.querySelector('#search_form') || 
             document.querySelector('form[role="search"]') ||
             document.querySelector('form');
    } else if (isBraveSearch) {
      return document.querySelector('form[role="search"]') ||
             document.querySelector('form');
    }
    return null;
  }

  function initializeButtons() {
    const searchForm = getSearchFormElement();
    if (!searchForm) return;

    // Rimuovi container precedente se esiste
    const existingContainer = document.querySelector('.ddg-buttons-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create container for buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('ddg-buttons-container');
    searchForm.insertAdjacentElement('beforebegin', buttonsContainer);

    // Create buttons
    let buttons = null;
    const buttonsCache = localStorage.getItem(buttonsCacheKey);
    if (buttonsCache) {
      try {
        buttons = JSON.parse(buttonsCache);
      } catch (e) {
        buttons = null;
      }
    }
    
    if (!buttons) {
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
        const searchInput = getSearchInputElement();
        if (!searchInput) return;
        
        const searchText = searchInput.value.trim();
        if (searchText === '') {
          return;
        }
        
        const dataLink = buttonElement.getAttribute('data-zci-link');
        let searchURL = '';
        
        if (dataLink === 'google') {
          searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchText)}&oq=${encodeURIComponent(searchText)}`;
        } else if (dataLink === 'googleshopping') {
          searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchText)}&tbm=shop`;
        }
        
        if (searchURL) {
          window.open(searchURL, '_blank');
        }
      });

      buttonElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          buttonElement.click();
        }
      });

      // Add margin between buttons
      if (index < buttons.length - 1) {
        buttonElement.style.marginRight = '10px';
      }
    });

    // Add styles to page
    addStyles();
  }

  function addStyles() {
    // Rimuovi stile precedente se esiste
    const existingStyle = document.querySelector('style[data-ddg-buttons]');
    if (existingStyle) {
      existingStyle.remove();
    }

    const styles = `
      .ddg-buttons-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        padding: 12px 10px;
        background-color: ${colorScheme.lightBG};
        border-radius: 20px;
        width: calc(100% - 20px);
        margin: 0 10px 12px 10px;
        box-sizing: border-box;
      }

      .ddg-buttons-container a {
        transition: background-color 0.2s ease, transform 0.15s ease;
        color: #fff;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        user-select: none;
      }

      .ddg-buttons-container a:hover {
        background-color: ${colorScheme.googleHover};
        transform: translateY(-1px);
        cursor: pointer;
      }

      .ddg-buttons-container a:active {
        transform: translateY(0);
      }

      .ddg-google-button, 
      .ddg-google-shopping-button {
        border-radius: 20px;
        padding: 8px 16px;
        margin-bottom: 0;
        background-color: ${colorScheme.google};
        font-size: 14px;
        font-weight: bold;
        height: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 0 1 auto;
        outline: none;
      }

      .ddg-google-button:focus-visible,
      .ddg-google-shopping-button:focus-visible {
        outline: 2px solid ${colorScheme.google};
        outline-offset: 2px;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .ddg-buttons-container {
          background-color: #1a1a1b;
        }
      }

      :root[data-theme="dark"] .ddg-buttons-container {
        background-color: #1a1a1b;
      }

      /* Mobile responsivo */
      @media (max-width: 767px) {
        .ddg-buttons-container {
          padding: 10px 8px;
          gap: 8px;
          width: calc(100% - 16px);
          margin: 0 8px 10px 8px;
        }

        .ddg-google-button, 
        .ddg-google-shopping-button {
          padding: 7px 14px;
          font-size: 13px;
          flex: 1 1 calc(50% - 4px);
          min-width: 120px;
        }
      }

      @media (max-width: 480px) {
        .ddg-buttons-container {
          padding: 8px 6px;
          gap: 6px;
          width: calc(100% - 12px);
          margin: 0 6px 8px 6px;
        }

        .ddg-google-button, 
        .ddg-google-shopping-button {
          padding: 6px 12px;
          font-size: 12px;
          flex: 1 1 calc(50% - 3px);
          min-width: 100px;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-ddg-buttons', 'true');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // Helper function to create button elements
  function createButtonElement(text, dataLink, className) {
    const button = document.createElement('a');
    button.classList.add(className);
    button.setAttribute('data-zci-link', dataLink);
    button.textContent = text;
    button.href = '#';
    button.role = 'button';
    button.tabIndex = 0;
    return button;
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeButtons);
  } else {
    initializeButtons();
  }

  // Re-initialize on page changes (SPA)
  window.addEventListener('popstate', () => {
    setTimeout(initializeButtons, 300);
  });

  // MutationObserver to handle lazy-loaded content
  const observer = new MutationObserver(() => {
    if (!document.querySelector('.ddg-buttons-container') && getSearchFormElement()) {
      initializeButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });

  // Stop observer after 15 seconds to avoid performance issues
  setTimeout(() => observer.disconnect(), 15000);

})();