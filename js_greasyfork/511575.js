// ==UserScript==
// @name        Watchlist for tags Rule34
// @namespace   Notification New Content Rule34
// @match       https://rule34.xxx/*
// @connect     https://api.rule34.xxx/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @author      Ardath
// @version     1.2.32
// @description Watchlist for tags on Rule34.xxx
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511575/Watchlist%20for%20tags%20Rule34.user.js
// @updateURL https://update.greasyfork.org/scripts/511575/Watchlist%20for%20tags%20Rule34.meta.js
// ==/UserScript==

// How many tags to check per seconds
const MAX_TAGS_TO_CHECK_AT_ONCE = 5;
const TIME_BETWEEN_API_CALLS_MS = 2000;

// ==================================================================================================================
// ==================================================================================================================
// Add a 'Add To Watchlist' button under the search bar
function createAddToWatchlistButton() {
  const targetDiv = document.querySelector('.tag-search');

  const addToWatchlistButton = document.createElement('input');
  addToWatchlistButton.id = 'addToWatchlist-button';
  addToWatchlistButton.type = 'submit';
  addToWatchlistButton.value = 'Add To Watchlist';
  addToWatchlistButton.onclick = function() {
    addToWatchlistButtonEvent();
  }

  if (targetDiv) {
    targetDiv.appendChild(addToWatchlistButton);
  }
}

// ==================================================================================================================
// Add content of search bar to the watchlist
function addToWatchlistButtonEvent() {
  const searchInputField = document.querySelector('input[name="tags"]');

  if (!searchInputField.value.trim()) {
    searchInputField.style.border = '2px solid #cc0000';
    return;
  }

  const currentTagsInput = searchInputField.value.trim().replace(/ /g, '+');
  const tagKey = 'tag_' + currentTagsInput;
  const keys = GM_listValues();

  if (keys.includes(tagKey)) {
    searchInputField.style.border = '2px solid #cc0000';
    console.log('Current search input already watched: ', GM_getValue(tagKey));

  } else {
    fetchTagsAndCreatedAt(currentTagsInput).then(function(createdAt) {

    if (!createdAt) {
      GM_setValue(tagKey, JSON.stringify({ name: currentTagsInput, created_at: 'Fri Nov 12 19:06:29 +0100 2010', new_content: false, blacklisted: false, checkDisabled: false, galleryDisabled: false }));
    } else {
      GM_setValue(tagKey, JSON.stringify({ name: currentTagsInput, created_at: createdAt.created_at, new_content: false, blacklisted: false, checkDisabled: false, galleryDisabled: false }));
    }
      searchInputField.style.border = '2px solid #00dd00';
      console.log('Current search input added to the watchlist');
    });
  }
}

// ==================================================================================================================
// ==================================================================================================================
// Add toggle button next to each tag
function addToggleFunctionalityToTags() {
  const tagItems = document.querySelectorAll('#tag-sidebar li[class*="tag"]');

  tagItems.forEach(function(tagItem) {

    const toggleButton = document.createElement('a');
    toggleButton.textContent = '[ ]';
    toggleButton.href = '#';
    tagItem.prepend(toggleButton);

    const tagLink = Array.from(tagItem.querySelectorAll('a')).at(-1);

    if (!tagLink) return;

    const href = tagLink.getAttribute('href');
    const params = new URLSearchParams(href.split('?')[1]);
    const tagName = params.get('tags');

    const storageKey = 'tag_' + tagName;

    if (GM_getValue(storageKey, null)) {
      toggleButton.textContent = '[X]';
    }

    toggleButton.onclick = function(event) {
      event.preventDefault();
      addTagToGMStorage(storageKey, toggleButton, tagName);
    };
  });
}

// ==================================================================================================================
// Add/Remove tags from GM storage when clicking on [ ]
function addTagToGMStorage(storageKey, toggleButton, tagName) {
  if (GM_getValue(storageKey, null)) {
    GM_deleteValue(storageKey);
    toggleButton.textContent = '[ ]';
  } else {
    fetchTagsAndCreatedAt(tagName, true).then(function(createdAt) {
      if (createdAt) {
        GM_setValue(storageKey, JSON.stringify({ name: tagName, created_at: createdAt.created_at, new_content: false, blacklisted: false, checkDisabled: false, galleryDisabled: false }));
        toggleButton.textContent = '[X]';
      }
    });
  }
}

// ==================================================================================================================
// ==================================================================================================================
// Add a 'Watchlist' button to the navigation bar
function addWatchlistButtonToNav() {
  const navbar = document.getElementById('subnavbar');
  const listItem = document.createElement('li');
  const watchlistButton = document.createElement('a');

  watchlistButton.textContent = 'Watchlist';
  watchlistButton.id = 'watchlist-button';
  watchlistButton.style.padding = '2px';

  watchlistButton.addEventListener('mouseup', (event) => {
    if (event.button === 0 && !event.ctrlKey) { // Left click opens modal
      watchlistButton.href = '#';
      document.getElementById('watchlist-modal').style.display = 'block';
      displayTagsInModal();
    }
  });

  watchlistButton.addEventListener('mousedown', (event) => {
    if (event.button === 1 || event.ctrlKey) { // Middle-click or Ctrl+click open Watchlist Gallery in new tab
      watchlistButton.href = getWatchlistURL();
    }
  });

  listItem.appendChild(watchlistButton);
  navbar.appendChild(listItem);
}

// ==================================================================================================================
// Create the modal to display watched tags
function createWatchlistModal() {
  const modalElement = document.createElement('div');
  modalElement.id = 'watchlist-modal';
  modalElement.className = 'modal';

  const modalContentElement = document.createElement('div');
  modalContentElement.className = 'modal-content';

  const rows = ['row1', 'row2', 'row3', 'row4', 'row5'];
  rows.forEach(id => {
    const row = document.createElement('div');
    row.id = id;
    document.body.appendChild(row); // Or any desired parent element
  });

  const row3CheckboxWrapper = document.createElement('div');

  const checkNewContentButton = document.createElement('button');
  checkNewContentButton.id = 'check-new-content-button';
  checkNewContentButton.textContent = 'Check for new content';
  checkNewContentButton.onclick = checkForNewContent;

  const cooldownDiv = document.createElement('div');
  cooldownDiv.id = 'cooldown-div';

  const cooldownLabel = document.createElement('p');
  cooldownLabel.id = 'cooldown-label';
  cooldownLabel.textContent = 'Cooldown : ';

  const cooldownInput = document.createElement('input');
  cooldownInput.id = 'cooldown-input';
  cooldownInput.type = 'number';
  cooldownInput.min = 0;
  cooldownInput.value = GM_getValue('cooldown', '0');
  cooldownInput.addEventListener('input', function() {
    cooldownInput.value = cooldownInput.value.replace(/[^0-9]/g, '');
    GM_setValue('cooldown', parseInt(cooldownInput.value));
  });

  cooldownDiv.append(cooldownLabel, cooldownInput);

  const lastCheckedText = document.createElement('p');
  lastCheckedText.id = 'last-checked-time';
  lastCheckedText.textContent = 'Last checked: -';

  const filterCheckbox = document.createElement('input');
  filterCheckbox.type = 'checkbox';
  filterCheckbox.id = 'show-new-tags';
  filterCheckbox.checked = GM_getValue('showNewTags', false);
  filterCheckbox.onchange = function() {
    GM_setValue('showNewTags', filterCheckbox.checked);
    displayTagsInModal();
  };

  const filterLabel = document.createElement('label');
  filterLabel.textContent = 'Show new content';
  filterLabel.style.color = '#c0c0c0';
  filterLabel.setAttribute('for', filterCheckbox.id);

  const clearButton = document.createElement('button');
  clearButton.id = 'reset-button';
  clearButton.textContent = 'Clear';
  clearButton.onclick = clearWatchlist;

  const hideFilterButton = document.createElement('button');
  hideFilterButton.id = 'hide-filter-buttons';
  hideFilterButton.textContent = !GM_getValue('isFilterVisible', false) ? '+' : '-';
  hideFilterButton.onclick = function() {
    if (row5.contains(filterCheckButton)) {
      hideFilterButton.textContent = '+';
      filterCheckButton.remove();
      filterGalleryButton.remove();
      hotkeySpan.remove();
      cooldownDiv.remove();
      GM_setValue('isFilterVisible', false);
      filterEvents('none');
    } else {
      hideFilterButton.textContent = '-';
      row5.append(filterCheckButton, filterGalleryButton, cooldownDiv, hotkeySpan);
      GM_setValue('isFilterVisible', true);
      filterEvents('inline-block');
    }
  };

  const filterCheckButton = document.createElement('button');
  filterCheckButton.id = 'filter-check-button';
  filterCheckButton.textContent = '+/- Check';
  filterCheckButton.onclick = function() { disableAllEvent('checkDisabled'); };

  const filterGalleryButton = document.createElement('button');
  filterGalleryButton.id = 'filter-gallery-button';
  filterGalleryButton.textContent = '+/- Gallery';
  filterGalleryButton.onclick = function() { disableAllEvent('galleryDisabled'); };

  const hotkeySpan = document.createElement('Span');
  hotkeySpan.id = 'hotkey-span';
  hotkeySpan.title = "Redirect to tags with new content";

  const hotkeyInput1 = document.createElement('select');
  const options = ['ALT', 'CTRL', 'SHIFT'];
  options.forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      hotkeyInput1.appendChild(option);
  });

  hotkeyInput1.value = GM_getValue('hotkey1_watchlist', 'ALT');
  hotkeyInput1.addEventListener('change', function() {
      GM_setValue('hotkey1_watchlist', hotkeyInput1.value);
  });

  const hotkeyInput2 = document.createElement('input');
  hotkeyInput2.id = 'hotkey-input';
  hotkeyInput2.type = 'text';
  hotkeyInput2.maxLength = 2;
  hotkeyInput2.value = GM_getValue('hotkey2_watchlist', 'F2');
  hotkeyInput2.addEventListener('input', function() {
    hotkeyInput2.value = hotkeyInput2.value.trim().toUpperCase();
    GM_setValue('hotkey2_watchlist', hotkeyInput2.value);
  });

  hotkeySpan.append(hotkeyInput1, hotkeyInput2);

  const apiKeyInput = document.createElement('input');
  apiKeyInput.id = 'apikey-input';
  apiKeyInput.type = 'text';
  apiKeyInput.maxLength = 200;
  apiKeyInput.value = GM_getValue('apikey-watchlist', '&api_key=&user_id=');
  apiKeyInput.title = "Go to your account -> Options -> API Access Credentials -> Generate New Key -> Save and refresh -> Copy Paste here";
  apiKeyInput.addEventListener('input', function() {
    apiKeyInput.value = apiKeyInput.value.trim();
    GM_setValue('apikey-watchlist', apiKeyInput.value);
  });

  hotkeySpan.append(hotkeyInput1, hotkeyInput2, apiKeyInput);

  let isFilterVisible = GM_getValue('isFilterVisible', false);

  if (isFilterVisible) {
    row5.append(filterCheckButton, filterGalleryButton, cooldownDiv, hotkeySpan);
    filterEvents('inline-block');
  } else {
    filterEvents('none');
  }

  const watchlistGallery = document.createElement('button');
  watchlistGallery.id = 'watchlist-gallery-button';
  watchlistGallery.textContent = 'Watchlist Gallery';

  watchlistGallery.addEventListener('mouseup', (event) => {
    if (event.button === 0 && !event.ctrlKey) window.location.href = getWatchlistURL(); // Left-click
  });

  watchlistGallery.addEventListener('mousedown', (event) => {
    if (event.button === 1 || event.ctrlKey) { // Middle-click or Ctrl+click
      event.preventDefault();
      window.open(getWatchlistURL(), '_blank');
    }
  });

  const modalText = document.createElement('div');
  modalText.id = 'modal-tags';
  modalText.textContent = 'Tags';

  row1.append(checkNewContentButton);
  row2.append(lastCheckedText);
  row3CheckboxWrapper.append(filterCheckbox, filterLabel);
  row3.append(row3CheckboxWrapper, clearButton);
  row4.append(hideFilterButton, watchlistGallery);

  modalContentElement.append(row1, row2, row3, row4, row5, modalText);
  modalElement.appendChild(modalContentElement);
  document.body.appendChild(modalElement);
}

// Get watchlist gallery url
function getWatchlistURL() {
  const tags = getTags(true);
  const filteredTags = tags.filter(tag => tag.galleryDisabled == false);
  const tagString = `( ${filteredTags.map(tag => '( ' + tag.name + ' )').join(' ~ ')} )`;
  return `https://rule34.xxx/index.php?page=post&s=list&tags=${tagString}`;
}

// ==================================================================================================================
// Show / hide filter buttons
function filterEvents(state) {
  ['filter-buttons', 'remove-button'].forEach(className => {
    document.querySelectorAll(`.${className}`).forEach(element => {
      element.style.display = state;
    });
  });
}

// ==================================================================================================================
// Get tags from storage
function getTags(gallery=false) {
  const filterNewTags = document.getElementById('show-new-tags').checked;
  const tags = [];

  // Get all "tag_" keys stored in GM
  GM_listValues().forEach(function(key) {
    if (!key.startsWith('tag_')) return;

    const tagData = JSON.parse(GM_getValue(key, '{}'));

    if (!gallery && filterNewTags && !tagData.new_content) return;

    tags.push({
      key,
      ...tagData
    });
  });

  // Sort tags alphabetically by name
  tags.sort((a, b) => a.name.localeCompare(b.name));
  return tags;
}

// ==================================================================================================================
// Display stored tags in the modal
function displayTagsInModal() {
  const modalContent = document.getElementById('modal-tags');
  const row5 = document.getElementById('row5');
  modalContent.innerHTML = '';

  var filterState = row5.contains(document.getElementById('filter-check-button')) ? 'inline-display' : 'none';

  // Create and append elements for each tag
  getTags().forEach(tag => {
    const tagUrl = 'https://rule34.xxx/index.php?page=post&s=list&tags=' + tag.name;
    const tagElement = createTagElement(tagUrl, tag.name, tag.new_content, tag.key, filterState);
    modalContent.appendChild(tagElement);
  });
}

// ==================================================================================================================
// Create a tag element for the modal, with a remove button and disable toggle
function createTagElement(url, tagName, hasNewContent, storageKey, filterState='none') {
  const tagElement = document.createElement('p');

  // Retrieve stored data once to avoid redundancy
  const tagData = JSON.parse(GM_getValue(storageKey, '{}')) || {};
  const isBlacklisted = tagData.blacklisted || false;
  const isCheckDisabled = tagData.checkDisabled || false;
  const isGalleryDisabled = tagData.galleryDisabled || false;

  // Create the link element
  const linkElement = document.createElement('a');
  linkElement.href = url;
  linkElement.textContent = tagName.replace(/\+/g, ' ');

  // Style the link based on conditions
  linkElement.style.color = isBlacklisted
    ? hasNewContent ? '#ff8000' : 'white'
    : hasNewContent ? '#00dd00' : 'white';
  linkElement.style.fontWeight = hasNewContent ? 'bold' : '';
  linkElement.onclick = function (event) {
    markTagAsRead(storageKey);
  };

  // Create the remove button
  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.textContent = 'X';
  removeButton.style.display = filterState;
  removeButton.onclick = function () {
    GM_deleteValue(storageKey);
    displayTagsInModal();
  };

  const checkFilterButton = createFilterButton('checkDisabled', isCheckDisabled, storageKey, filterState)
  const galleryFilterButton = createFilterButton('galleryDisabled', isGalleryDisabled, storageKey, filterState);

  tagElement.append(checkFilterButton, galleryFilterButton, linkElement, removeButton);
  return tagElement;
}

// ==================================================================================================================
// Turn on/off all the tags in the watchlist
function createFilterButton(property, state, storageKey, filter) {

  const button = document.createElement('input');
  button.type = 'checkbox';
  button.className = 'filter-buttons';
  button.checked = state ? false : true;
  button.style.display = filter;

  button.onchange = function() {
    state = !state;
    console.log('ok');
    button.checked = state ? false : true;

    const tagData = JSON.parse(GM_getValue(storageKey, '{}'));

    tagData[property] = state;
    GM_setValue(storageKey, JSON.stringify(tagData));
    displayTagsInModal();
  };

  return button;
}

// ==================================================================================================================
// Turn on/off all the tags in the watchlist
function disableAllEvent(keyType) {
  const tagKeys = GM_listValues().filter(key => key.startsWith('tag_'));
  if (tagKeys.length === 0) return;

  // Get the state of the first tag's `keyType` (either 'checkDisabled' or 'galleryDisabled')
  const firstTagData = JSON.parse(GM_getValue(tagKeys[0], '{}'));
  const newState = !(firstTagData[keyType] || false);

  // Loop through all tags and update their `keyType` (either 'checkDisabled' or 'galleryDisabled')
  tagKeys.forEach(key => {
    const tagData = JSON.parse(GM_getValue(key, '{}'));
    tagData[keyType] = newState;
    GM_setValue(key, JSON.stringify(tagData));
  });

  displayTagsInModal();
}

// ==================================================================================================================
// Mark tag as read and redirect
function markTagAsRead(storageKey) {
  const tagData = JSON.parse(GM_getValue(storageKey, '{}'));
  tagData.new_content = false;
  GM_setValue(storageKey, JSON.stringify(tagData));
  displayTagsInModal();
}

// ==================================================================================================================
// Redirect to new content when pressing hotkey
function hotkeyEvent() {
  const tagKeys = GM_listValues().filter(key => key.startsWith('tag_'));

  for (const key of tagKeys) {
    const tagData = JSON.parse(GM_getValue(key, '{}'));
    if (tagData.new_content) {
      const url = `https://rule34.xxx/index.php?page=post&s=list&tags=${tagData.name}`;
      markTagAsRead(key)
      window.location.href = url;
      return;
    }
  }
}

// ==================================================================================================================
// Mark all tags as read
function clearWatchlist() {
  GM_listValues().forEach(function (key) {
    if (key.startsWith('tag_')) {
      const tagData = JSON.parse(GM_getValue(key, '{}'));
      tagData.new_content = false;
      GM_setValue(key, JSON.stringify(tagData));
    }
  });

  displayTagsInModal();
  updateWatchlistButton();
}

// ==================================================================================================================
// ==================================================================================================================
// Main function. Check each tag one by one for new content
async function checkForNewContent() {
  const checkButton = document.getElementById('check-new-content-button');
  checkButton.disabled = true;
  GM_setValue('lastCheckTime', Date.now());
  updateLastCheckedTimeDisplay();

  const tagKeys = GM_listValues().filter(key => key.startsWith('tag_'));
  const totalTags = tagKeys.length;
  let checkedTags = 0;
  const promises = [];

  for (const key of tagKeys) {
    const tagData = JSON.parse(GM_getValue(key, '{}'));
    const cooldown = GM_getValue('cooldown', 0);

    checkedTags++;
    checkButton.textContent = `Checking for new content... [${checkedTags} out of ${totalTags}]`;

    if (tagData.checkDisabled) {
      console.log("Tag disabled : " , tagData.name);
      continue;
    }

    // Cooldown in case 'Checking for new content' is interrupted
    if (tagData.cooldown && Math.floor((Date.now() - tagData.cooldown) / 1000) < cooldown * 60) {
      console.log("Not enough time has elapsed");
      continue;
    }

    // If tag is removed while 'Checking for new content'
    if (!tagData.name) {
        checkedTags--;
        console.log("Invalid tag data");
        continue;
    }

    // If tag alread has new content
    if (tagData.new_content && !tagData.blacklisted) {
      console.log('New content found for : ' + tagData.name);
      continue;
    }

    promises.push((async () => {
      try {
        const contentData = await fetchTagsAndCreatedAt(tagData.name);

        if (contentData && new Date(contentData.created_at) > new Date(tagData.created_at)) {

          if (!containsBlacklistedTags(contentData.tags, fetchBlacklist())) {
            tagData.blacklisted = false;
            console.log('New content found for : ' + tagData.name);

          } else {
            tagData.blacklisted = true;
            console.log('Blacklisted content found for : ' + tagData.name);
          }

          console.log('New content found for : ' + tagData.name);
          tagData.created_at = contentData.created_at;
          tagData.new_content = true;
          tagData.cooldown = Date.now();
          GM_setValue(key, JSON.stringify(tagData));
          displayTagsInModal();

        } else {
          tagData.cooldown = Date.now();
          GM_setValue(key, JSON.stringify(tagData));

          console.log('No new content found for : ' + tagData.name);
        }

      } catch (error) {
        console.error(`Error processing tag ${key}:`, error);
      }
    })());

    // Throttle the updates at 1 API calls every 2 seconds by default
    if (promises.length >= MAX_TAGS_TO_CHECK_AT_ONCE) {
      await Promise.all(promises);
      promises.length = 0;
      await new Promise(resolve => setTimeout(resolve, TIME_BETWEEN_API_CALLS_MS));
    }
  }

  updateWatchlistButton();
  checkButton.textContent = `Check completed [${checkedTags} out of ${totalTags}]`;
  checkButton.disabled = false;
}

// ==================================================================================================================
// Fetch all tags and the date of the most recent content for a specific tag
async function fetchTagsAndCreatedAt(tagName) {
  const apiKey =  GM_getValue('apikey-watchlist', '&api_key=&user_id=');
  const apiUrl = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${tagName}&limit=1${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.text();
    const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
    const firstPost = xmlDoc.getElementsByTagName("post")[0];

    if (firstPost) {
      const tags = firstPost.getAttribute("tags")
      .split(' ')
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
      const createdAt = firstPost.getAttribute("created_at");

      return { tags, created_at: createdAt };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching content data:', error);
    return null;
  }
}
// ==================================================================================================================
function fetchBlacklist() {
  let cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('tag_blacklist='));

  // Parse the cookie value if it exists
  let blacklist = [];
  if (cookieValue) {
    try {
      blacklist = cookieValue
      .split('=')[1] // Get the value after '='
      .split('%2520') // Split by the encoded delimiter
      .flatMap(tags => tags.split(/[\s,]+/)) // Split further by whitespace or commas
      .map(tag => tag.trim()) // Trim each tag
      .filter(tag => tag); // Remove empty or falsy values

      if (JSON.stringify(blacklist) !== JSON.stringify(GM_getValue('blacklisted'))) {
        GM_setValue('blacklisted', blacklist);
        console.log('Blacklist updated in GM storage');
      }
    } catch (error) {
      console.error('Error decoding cookie value:', error);
    }
  }

  // Fallback to GM storage if the cookie's blacklist is empty
  if (blacklist.length === 0) {
    console.log("Couldn't find tag_blacklist cookie");
    if (GM_getValue('blacklisted') && GM_getValue('blacklisted').length > 0) {
      blacklist = GM_getValue('blacklisted');
      console.log('Blacklist retrieved from GM storage');
    }
  }

  console.log(`Blacklist[${blacklist.length}]: ` + blacklist);
  return blacklist;
}

// ==================================================================================================================
// Check if any blacklisted tag is present in the content tags
function containsBlacklistedTags(contentTags, blacklistedTags) {
  return contentTags.some(tag => blacklistedTags.includes(tag));
}

// ==================================================================================================================
// Update watchlist button appearance based on new content
function updateWatchlistButton() {
  const watchlistButton = document.getElementById('watchlist-button');
  const hasNewContent = GM_listValues().some(function(key) {
  return key.startsWith('tag_') && JSON.parse(GM_getValue(key, '{}')).new_content === true;
  });

  watchlistButton.style.backgroundColor = hasNewContent ? '#aa0000' : '';
  watchlistButton.style.color = hasNewContent ? '#ffffff' : '';
}

// ==================================================================================================================
// Update the last checked time display
function updateLastCheckedTimeDisplay() {
  const lastCheckedText = document.getElementById('last-checked-time');
  const lastCheckedTime = GM_getValue('lastCheckTime', 0);

  if (lastCheckedTime) {
    let minutesAgo = Math.floor((Date.now() - lastCheckedTime) / (1000 * 60));
    minutesAgo = minutesAgo >= 60 ? Math.floor(minutesAgo / 60) + ' hour(s) ago' : minutesAgo + ' minute(s) ago';
    lastCheckedText.textContent = 'Last checked: ' + minutesAgo;
  }
}

// ==================================================================================================================
// ==================================================================================================================

addWatchlistButtonToNav();
createAddToWatchlistButton();
createWatchlistModal();
addToggleFunctionalityToTags();
updateWatchlistButton();
updateLastCheckedTimeDisplay();

window.onclick = function(event) {
  // Close watchlist
  const watchlistModal = document.getElementById('watchlist-modal')
  if (event.target === watchlistModal) watchlistModal.style.display = 'none';

  // Reset search bar border
  const inputField = document.querySelector('input[name="tags"]');
  if (inputField && event.target != document.getElementById('addToWatchlist-button')) {
    if (inputField.style.border === '2px solid rgb(204, 0, 0)' || inputField.style.border === '2px solid rgb(0, 221, 0)') {
      inputField.style.border = '1px solid #505a50';
    }
  }
};

// Use keyboard hotkey to go through new content
document.addEventListener("keydown", function(event) {
  let hotkey1 = GM_getValue('hotkey1_watchlist', 'ALT').toLowerCase();
  let hotkey2 = GM_getValue('hotkey2_watchlist', 'F2');
  if (event[`${hotkey1}Key`] && event.key.toUpperCase() === hotkey2) {
        event.preventDefault();
        hotkeyEvent();
  }
});

// ==================================================================================================================
// ==================================================================================================================
//
// ===========
// == Style ==
// ===========

const styleElement = document.createElement('style');
styleElement.type = 'text/css';
styleElement.innerHTML = `
.modal {
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}

.modal-content {
  background-color: #293129;
  border: 1px solid #888;
  min-height: 50%;
  max-height: 75%;
  margin: 7% auto;
  overflow: auto;
  padding: 20px;
  min-width: 20%;
  max-width: 90%;
  white-space: nowrap;
  width: fit-content;
}

@media only screen and (max-width: 810px) {
  .modal-content {
    min-height: 90%;
    margin: 10% auto;
    padding: 15px;
    min-width: 90%;
    width: 90%;
  }

  input[class="filter-buttons"] {
    width: 10px;
    height: 10px;
  }

  #addToWatchlist-button {
    display: block;
    margin: 0 auto;
    margin-top: 15px;
    width: 100% !important;
  }
}

.modal-content p {
  font-size: 15px;
}

.modal-content a:hover {
  text-shadow: 0px 1px 0px;
}

.modal button {
  background-color: #93b393;
  color: #303a30;
  font-weight: bold;
  border: none;
}

#header #subnavbar li a:hover {
  color: white !important;
}

#watchlist-button {
  cursor: pointer;
}

#row1 {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

#row2 {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 5px 0;
}

#row3 {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
}

#row4 {
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

#row5 {
  margin-bottom: 35px;
}

button[id="check-new-content-button"] {
  cursor: pointer;
  display: block;
  margin: 0 auto;
}

#cooldown-label {
  color: #c0c0c0;
  display: inline-block;
  margin: 10px 0;
  margin-right: 10px;
}

#cooldown-input, #cooldown-input:focus {
  background-color: #303030;
  border: 1px solid #505a50;
  color: white;
  display: inline-block;
  outline: none;
  width: 15%;
}

#last-checked-time {
  color: #c0c0c0;
}

#show-new-tags {
  accent-color: #293129;
  box-shadow: 0px 0px 1px white;
  margin-right: 10px;
}

label[for="show-new-tags"] {
  color: white;
  cursor: pointer;
}

button[id="reset-button"] {
  cursor: pointer;
}

button[id="filter-check-button"] {
  cursor: pointer;
  display: block;
  margin-top: 20px;
}

button[id="filter-gallery-button"] {
  cursor: pointer;
  display: block;
  margin-top: 10px;
}

#hotkey-span select,
#hotkey-span input {
  background-color: #303030;
  border: 1px solid #505a50;
  color: white;
  font-weight: bold;
  outline: none;
  padding: 3px;
  text-align: center;
}

input[id="hotkey-input"] {
  width: 30px;
}

input[id="apikey-input"] {
  display: block;
  margin-top: 10px;
}

button[id="hide-filter-buttons"] {
  cursor: pointer;
  display: block;
  margin-top: 20px;
}

button[id="watchlist-gallery-button"] {
  cursor: pointer;
  display: block;
  float: right;
  margin-top: 20px;
}

input[class="filter-buttons"] {
  accent-color: #293129;
  cursor: pointer;
  margin-right: 15px;
  box-shadow: 0px 0px 1px white;
}

button[class="remove-button"] {
  background: none;
  border: none;
  color: #cc0000;
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;
}

#addToWatchlist-button {
  display = inline-block;
  margin: 0 auto;
}

`;
document.head.appendChild(styleElement);