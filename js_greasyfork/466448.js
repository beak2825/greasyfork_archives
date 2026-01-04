// ==UserScript==
// @name         DuckDuckGo Search Buttons to other search engines Google, Amazon, ecc -Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      7.6.2023
// @description  Adds Google, Google Shopping, YouTube, Amazon, eBay, Bing, Reddit, and GitHub search buttons to DuckDuckGo search results with a visually appealing design for small and large displays, super optimized cache loading.
// @match        https://duckduckgo.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @author       Luciano Stanziani
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/466448/DuckDuckGo%20Search%20Buttons%20to%20other%20search%20engines%20Google%2C%20Amazon%2C%20ecc%20-Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/466448/DuckDuckGo%20Search%20Buttons%20to%20other%20search%20engines%20Google%2C%20Amazon%2C%20ecc%20-Tampermonkey.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const colorScheme = {
    lightBG: '#F1F2F6',
    text: '#fff',
    buttontext: '#769DFF',
    border: '#769DFF',
    google: '#4285f4',
    googleShopping: '#f4b400',
  };

  const buttons = [
    { text: 'Google', dataLink: 'google', className: 'ddg-google-button' },
    { text: 'Google Shopping', dataLink:'googles',className: 'ddg-google-shopping-button' },
    { text: 'YouTube', dataLink: 'youtube', className: 'ddg-youtube-button' },
    { text: 'Amazon', dataLink: 'amazon', className: 'ddg-amazon-button' },
    { text: 'eBay', dataLink: 'ebay', className: 'ddg-ebay-button' },
    { text: 'Bing', dataLink: 'bing', className: 'ddg-bing-button' },
    { text: 'Reddit', dataLink: 'reddit', className: 'ddg-reddit-button' },
    { text: 'GitHub', dataLink: 'github', className: 'ddg-github-button' }
  ];

  const cachedStyles = GM_getValue('ddgSearchButtonsStyles');

  function addStyles() {
    const styles = `
      .ddg-buttons-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 10px 0;
        padding: 10px;
        border-radius: 10px;
        width: 100%;
        overflow-x: auto;
      }

      .ddg-buttons-container a {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 14px;
        font-weight: bold;
        transition: border-color 0.2s ease;
       height: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border: 2px solid ${colorScheme.border};
        box-sizing: border-box;
        margin-right: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        color: ${colorScheme.buttontext};
        background-color: transparent;
        border-radius: 5px;
        padding: 6px 10px;
      }

      .ddg-buttons-container a:hover {
        color: ${colorScheme.text};
        background-color: ${colorScheme.google};
        border-color: ${colorScheme.google};
      }

      .ddg-buttons-container a:last-child {
        margin-right: 0;
      }

      @media (max-width: 767px) {
        .ddg-buttons-container {
          justify-content: space-evenly;
        }
      }
    `;
    GM_addStyle(styles);
    GM_setValue('ddgSearchButtonsStyles', styles);
  }

  function createButtons() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('ddg-buttons-container');
    const searchForm = document.querySelector('#search_form');
    searchForm.insertAdjacentElement('beforebegin', buttonsContainer);

    buttons.forEach(button => {
      const buttonElement = document.createElement('a');
      buttonElement.classList.add(button.className);
      buttonElement.setAttribute('data-zci-link', button.dataLink);
      buttonElement.textContent = button.text;
      buttonElement.href = '#';
      buttonsContainer.appendChild(buttonElement);

      buttonElement.addEventListener('click', (event) => {
        event.preventDefault();
        const searchQuery = getSearchQuery();
        const url = getSearchUrl(button.dataLink, searchQuery);
        openUrlInNewTab(url);
      });
    });
  }

  function getSearchQuery() {
    const searchInput = document.querySelector('#search_form_input');
    return searchInput.value.trim();
  }

  function getSearchUrl(searchEngine, searchQuery) {
    const searchEngines = {
      google: 'https://www.google.com/search?q=',
      googles: 'https://www.google.com/search?q=',
      youtube: 'https://www.youtube.com/results?search_query=',
      amazon: 'https://www.amazon.it/s?k=',
      ebay: 'https://www.ebay.com/sch/i.html?_nkw=',
      bing: 'https://www.bing.com/search?q=',
      reddit: 'https://www.reddit.com/search?q=',
      github: 'https://github.com/search?q='
    };
    const baseUrl = searchEngines[searchEngine];
    const queryParam = encodeURIComponent(searchQuery);
    let url = baseUrl + queryParam;
    if (searchEngine === 'googles') {
      url += '&tbm=shop';
    }
    return url;
  }

  function openUrlInNewTab(url) {
    const newTab = window.open(url, '_blank');
    newTab.focus();
  }

  if (!cachedStyles) {
    addStyles();
  } else {
    GM_addStyle(cachedStyles);
  }

  createButtons();

  // Aggiunta di stili personalizzati per centrare i pulsanti e rimuovere i margini eccessivi
  GM_addStyle(`
    .ddg-buttons-container {
      margin: 0 0 10px 0;
      padding: 0;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }

    .ddg-buttons-container a {
      margin: 0 5px 5px 0;
    }
  `);
})();