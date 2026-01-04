// ==UserScript==
// @name         Xhamster Search in PayLists List v.12
// @namespace    https://greasyfork.org/fr/users/7434-janvier56
// @version      12.0.1
// @description  Add search functionality to Playlist page when Edit Playlist Modal is open
// @icon         https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @author       janvier57
// @match        https://*.xhamster.com/my/favorites/*
// @match        https://*.xhamster.com/playlists/*
// @match        https://*.xhamster.com/videos/*
// @match        https://*.xhamster.com/moments/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527756/Xhamster%20Search%20in%20PayLists%20List%20v12.user.js
// @updateURL https://update.greasyfork.org/scripts/527756/Xhamster%20Search%20in%20PayLists%20List%20v12.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // CSS selector for the dialog manager that contains the favorites edit collections
  const dialogManagerSelector = '[data-role="dialog-manager"]:has(.favorites-edit-collections):not(:has([class*="closed-"]))';

  // Function to add search form
  function addSearchForm(dialogHeader) {
    // Create search form elements
    const searchForm = document.createElement('form');
    searchForm.className = 'search-form';

    const onlySelectedButton = document.createElement('button');
    onlySelectedButton.textContent = '💔';
    onlySelectedButton.type = 'button';
    onlySelectedButton.className = 'only-selected-button';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search playlists';

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.type = 'reset';

    searchForm.appendChild(onlySelectedButton);
    searchForm.appendChild(searchInput);
    searchForm.appendChild(clearButton);

    let showOnlySelected = false;

    // Add event listener for search input
    searchInput.addEventListener('input', function(event) {
      filterPlaylists(event.target.value.toLowerCase(), showOnlySelected);
    });

    // Add event listener for clear button
    clearButton.addEventListener('click', function(event) {
      event.preventDefault();
      searchInput.value = '';
      filterPlaylists('', showOnlySelected);
    });

    // Add event listener for only selected button
    onlySelectedButton.addEventListener('click', function() {
      showOnlySelected = !showOnlySelected;
      if (showOnlySelected) {
        this.textContent = '❤️';
      } else {
        this.textContent = '💔';
      }
      filterPlaylists(searchInput.value.toLowerCase(), showOnlySelected);
    });

    // Insert search form into dialog header
    dialogHeader.appendChild(searchForm);
  }

  // Function to filter playlists
function filterPlaylists(searchValue, onlySelected) {
  let itemContainers;
  let selectedItemsSelector;
  let parentSelector;

  const dialogManager = document.querySelector('[data-role="dialog-manager"]:has(.favorites-edit-collections)');
  if (dialogManager) {
    itemContainers = dialogManager.querySelectorAll('[class^="playlistsMenu-"] [class^="main-"]');
    selectedItemsSelector = '[data-role="dialog-manager"]:has(.favorites-edit-collections) [class^="playlistsMenu-"] [class*="checked-"]';
    parentSelector = '[data-role="dialog-manager"]:has(.favorites-edit-collections) > [class*="desktop-"] [class^="closeIcon-"] + .desktop-dialog [class^="playlistsMenu-"]';
  } else {
    itemContainers = document.querySelectorAll('.favorites-control.xh-dropdown .dropdown.favorites-dropdown.position-left .favorites-dropdown__list .favorites-dropdown__list-header + [data-role="playlist-picker-container"] ul[class^="root-"] li');
    selectedItemsSelector = '.favorites-control.positioned.xh-dropdown:has(.xh-button.trigger.no-arrow.active) .dropdown.position-left.favorites-dropdown[style="opacity: 1; display: block;"] .favorites-dropdown__list .favorites-dropdown__list-header + [data-role="playlist-picker-container"] ul[class^="root-"] li:has([class*="stateIcon-"][class*="extra-green-"])';
    parentSelector = '.favorites-control.xh-dropdown .dropdown.favorites-dropdown.position-left .favorites-dropdown__list .favorites-dropdown__list-header + [data-role="playlist-picker-container"] ul[class^="root-"]';
  }

  itemContainers.forEach((itemContainer) => {
    const playlistText = itemContainer.textContent.toLowerCase();

    if (onlySelected) {
      if (itemContainer.matches(selectedItemsSelector) && playlistText.includes(searchValue.toLowerCase())) {
        itemContainer.style.display = '';
      } else {
        itemContainer.style.display = 'none';
      }
    } else {
      if (playlistText.includes(searchValue.toLowerCase())) {
        itemContainer.style.display = '';
      } else {
        itemContainer.style.display = 'none';
      }
    }
  });

  // Hide/show parent elements if they are empty
  const parentElements = document.querySelectorAll(parentSelector);
  parentElements.forEach((parentElement) => {
    const children = parentElement.children;
    let hasVisibleChildren = false;
    for (let i = 0; i < children.length; i++) {
      if (children[i].style.display !== 'none') {
        hasVisibleChildren = true;
        break;
      }
    }
    if (hasVisibleChildren) {
      parentElement.style.display = '';
    } else {
      parentElement.style.display = 'none';
    }
  });
}




// Add style for search form
GM_addStyle(`
  .search-form {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .search-form input[type="text"] {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .search-form button[type="reset"] {
    margin-left: 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #d9534f;
    color: #fff;
    cursor: pointer;
  }
  .search-form button[type="button"].only-selected-button {
    margin-right: 5px;
    padding: 5px;
    border: none;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
    font-size: 20px;
    color: #d9534f;
  }
`);

// Wait for the dialog header to be available
const observer = new MutationObserver((mutations) => {
  const dialogHeader = document.querySelector('.desktop-dialog__header-new');
  if (dialogHeader && !dialogHeader.querySelector('.search-form')) {
    addSearchForm(dialogHeader);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Add search form to video page
const videoPageObserver = new MutationObserver((mutations) => {
  const videoPageHeader = document.querySelector('.favorites-control.xh-dropdown .dropdown .favorites-dropdown__list .favorites-dropdown__list-header');
  if (videoPageHeader && !videoPageHeader.querySelector('.search-form')) {
    addSearchForm(videoPageHeader);
  }
});

videoPageObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Fix issue with video page playlists
function waitForElement(selector, callback) {
  const interval = 100; // check every 100ms
  const maxAttempts = 100; // max 10 seconds
  let attempts = 0;

  function check() {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(check, interval);
    }
  }

  check();
}

waitForElement('.video-page .favorites-control.xh-dropdown .dropdown.favorites-dropdown.position-left .favorites-dropdown__list .favorites-dropdown__list-header + [data-role="playlist-picker-container"] ul[class^="root-"]', (playlistContainer) => {
  const listItems = playlistContainer.querySelectorAll('li');
  listItems.forEach((listItem) => {
    const span = listItem.querySelector('span[class*="primary-"]');
    if (span) {
      listItem.style.display = span.style.display;
      span.style.display = '';
    }
  });
});

// Fix issue with playlist pages
const playlistPageObserver = new MutationObserver((mutations) => {
  const dialogManager = document.querySelector('[data-role="dialog-manager"]:has(.favorites-edit-collections)');
  if (dialogManager) {
    const dialogHeader = dialogManager.querySelector('.desktop-dialog__header-new');
    if (dialogHeader && !dialogHeader.querySelector('.search-form')) {
      addSearchForm(dialogHeader);
    }
  }
});

playlistPageObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

})();
