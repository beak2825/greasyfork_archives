// ==UserScript==
// @name        Asurascans Bookmarking System (Personal)
// @version     inf
// @author      longkidkoolstar
// @namespace   https://github.com/longkidkoolstar
// @icon        https://images.vexels.com/media/users/3/223055/isolated/preview/eb3fcec56c95c2eb7ded9201e51550a2-bookmark-icon-flat-by-vexels.png
// @description A bookmarking system for Manga reading sites with signup/login functionality to save your info(Bookmarks e.t.c) Across ALL Devices. Keep Track of your BookMarks in AsuraScans amongst other websites.
// @require     https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js
// @match       https://www.asurascans.com/*
// @match       https://asura.gg/*
// @match       https://asuracomics.gg/*
// @match       https://asura.nacm.xyz/*
// @match       https://asuracomics.com/*
// @match       https://asuratoon.com/*
// @match       https://void-scans.com/*
// @match       https://lunarscan.org/*
// @match       https://flamescans.org/*
// @match       https://luminousscans.com/*
// @match       https://luminousscans.net/*
// @match       https://cosmic-scans.com/*
// @match       https://nightscans.org/*
// @match       https://nightscans.net/*
// @match       https://freakscans.com/*
// @match       https://reaperscans.fr/*
// @match       https://manhwafreak.com/*
// @match       https://manhwa-freak.com/*
// @match       https://manhwafreak-fr.com/*
// @match       https://realmscans.to/*
// @match       https://mangastream.themesia.com/*
// @match       https://manga-scans.com/*
// @match       https://mangakakalot.so/*
// @match       https://reaperscans.com/*
// @match       https://flamecomics.com/*
// @match       https://asuracomic.net/*      
// @license     MIT
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491269/Asurascans%20Bookmarking%20System%20%28Personal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491269/Asurascans%20Bookmarking%20System%20%28Personal%29.meta.js
// ==/UserScript==
 
console.log('User script started');
 
const scriptVersion = 'inf';
const binId = '6608528facd3cb34a830a352';
const accessKey = '$2a$10$J6BvVj1L/cyzICpyDf3nOOX7c7BnmGdK5jhIjDHST1e3QNZOMS5.i';
 
 
// Check if user is logged in
if (GM_getValue('username') && GM_getValue('password')) {
  console.log('User is logged in');
    window.addEventListener('load', function () {
    saveDeviceType();
});
} else {
  console.log('User is not logged in');
  // Prompt user to enter username and password
  const username = prompt('Enter your username:');
  const password = prompt('Enter your password:');
  // Save username and password to Tampermonkey
  GM_setValue('username', username);
  GM_setValue('password', password);
  // Save username and password to JSONBin
  saveUserCredentialsToJSONBin(username, password);
}
 
 
// Below is to delte the new ads that Asura has been implementing.
//--------------
 
(function() {
  // Function to delete the element
  function deleteElement() {
    var element = document.getElementById('noktaplayercontainer');
    if (element) {
      element.remove();
    }
  }
 
  // DOM listener to check for element existence
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        deleteElement();
      }
    });
  });
 
  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
})();
 
 
// Function to detect and save the device type to JSONBin and local storage
function saveDeviceType() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
 
  // Get the saved device type from local storage
  const savedDeviceType = localStorage.getItem('deviceType');
 
  if (savedDeviceType !== isMobile.toString()) {
    // Device type has changed, update JSONBin and local storage
    const username = GM_getValue('username');
    const password = GM_getValue('password');
    const deviceData = { deviceType: isMobile.toString() };
 
    // Save device data to JSONBin
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://api.jsonbin.io/v3/b/${binId}`,
      headers: {
        'X-Bin-Access-Token': accessKey,
        'X-Access-Key': accessKey
      },
      onload: function (response) {
        const existingData = JSON.parse(response.responseText).record;
        if (existingData.users[username].password === password) {
          existingData.users[username].variables.deviceType = isMobile.toString();
          GM_xmlhttpRequest({
            method: 'PUT',
            url: `https://api.jsonbin.io/v3/b/${binId}`,
            headers: {
              'Content-Type': 'application/json',
              'X-Bin-Access-Token': accessKey,
              'X-Access-Key': accessKey
            },
            data: JSON.stringify(existingData),
          });
        }
      }
    });
 
    // Save device data to local storage
    localStorage.setItem('deviceType', isMobile.toString());
 
    // Update variables in local storage
    const jsonBinData = getJSONBinData();
    if (jsonBinData) {
      saveVariablesFromJSONBin(jsonBinData);
      updateLocalStorageVariables(jsonBinData);
    }
  }
 
  // Log the device type to the console
  console.log('Device Type:', isMobile ? 'Mobile' : 'Computer');
}
 
 
 
 
 
//------------------------------------------------------------------------ Uncomment if Asura changes Domain name again.
 
function updateLastChaptersDomain() {
    const oldDomain = "https://asuracomics.com/";
    const newDomain = "https://asuracomics.gg/";
 
    const lastChapters = JSON.parse(localStorage.getItem("last-chapter"));
    if (lastChapters) {
        for (const mangaId in lastChapters) {
           if (lastChapters.hasOwnProperty(mangaId)) {
                const oldUrl = lastChapters[mangaId];
               if (oldUrl.startsWith(oldDomain)) {
                    const newUrl = oldUrl.replace(oldDomain, newDomain);
                    lastChapters[mangaId] = newUrl;
                }
            }
        }
       localStorage.setItem("last-chapter", JSON.stringify(lastChapters));
        console.log("Last chapters updated to the new domain.");
    } else {
        console.log("No last chapters found.");
    }
}
 
// Call the function to update the URLs
updateLastChaptersDomain();
 
function updateLastChaptersDomainif() {
    const oldDomain = "https://asuracomics.gg/";
    const newDomain = "https://asuratoon.com/";
 
    const lastChapters = JSON.parse(localStorage.getItem("last-chapter"));
    if (lastChapters) {
        for (const mangaId in lastChapters) {
           if (lastChapters.hasOwnProperty(mangaId)) {
                const oldUrl = lastChapters[mangaId];
               if (oldUrl.startsWith(oldDomain)) {
                    const newUrl = oldUrl.replace(oldDomain, newDomain);
                    lastChapters[mangaId] = newUrl;
                }
            }
        }
       localStorage.setItem("last-chapter", JSON.stringify(lastChapters));
        console.log("Last chapters updated to the new domain.");
    } else {
        console.log("No last chapters found.");
    }
}
 
// Call the function to update the URLs
updateLastChaptersDomainif();
//-----------------------------------------------------------------------------
 
// Wait for the page to load
window.addEventListener('load', function () {
  // Fetch JSONBin data and save variables
  const jsonBinData = getJSONBinData();
  if (jsonBinData) {
    saveVariablesFromJSONBin(jsonBinData);
  }
 
  // Check if it's a manga page and display the last read chapter if available
  if (window.location.pathname.startsWith('/manga/')) {
    displayLastReadChapter();
  }
});
 
// Function to fetch JSONBin data
function getJSONBinData() {
  const request = new XMLHttpRequest();
  request.open('GET', `https://api.jsonbin.io/v3/b/${binId}`, false);
  request.setRequestHeader('X-Bin-Access-Token', accessKey);
  request.setRequestHeader('X-Access-Key', accessKey);
  request.send(null);
  if (request.status === 200) {
    return JSON.parse(request.responseText).record;
  }
  return null;
}
 
// Save variables from JSONBin to GM storage
function saveVariablesFromJSONBin(data) {
  const userData = data.users[GM_getValue('username')];
  if (userData) {
    const variables = userData.variables;
    if (variables) {
      for (const key in variables) {
        if (variables.hasOwnProperty(key)) {
          GM_setValue(key, variables[key]);
        }
      }
    }
  }
}
 
 
function saveVariablesToJSONBin() {
  const username = GM_getValue('username');
  const password = GM_getValue('password');
  const website = window.location.hostname;
  const newVariables = {};
 
  // Add specific variables to the newVariables object
  const requiredVariables = ['last-chapter', 'bookmark', 'bm_history', 'deviceType', 'scriptVersion'];
 
  for (const key of requiredVariables) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      newVariables[key] = value;
    }
  }
 
  // Fetch existing data from JSONBin
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://api.jsonbin.io/v3/b/${binId}`,
    headers: {
      'X-Bin-Access-Token': accessKey,
      'X-Access-Key': accessKey
    },
    onload: function (response) {
      const existingData = JSON.parse(response.responseText).record;
      const userData = existingData.users[username];
      if (userData && userData.password === password) {
        // Merge newVariables with the existing variables for the website
        userData.variables[website] = {
          ...(userData.variables[website] || {}),
          ...newVariables
        };
 
        // Save the merged data back to JSONBin
        saveUserDataToJSONBin(userData);
      } else {
        console.log('Invalid credentials or user data not found.');
      }
    }
  });
}
 
function checkAndUpdateScriptVersion() {
  const storedScriptVersion = localStorage.getItem('scriptVersion');
  if (storedScriptVersion !== scriptVersion) {
    // Script version has changed, update the stored version and save variables to JSONBin
    localStorage.setItem('scriptVersion', scriptVersion);
  }
}
 
// Call the function on page load
checkAndUpdateScriptVersion();
 
 
 
 
// Save user data to JSONBin
function saveUserDataToJSONBin(userData) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://api.jsonbin.io/v3/b/${binId}`,
    headers: {
      'X-Bin-Access-Token': accessKey,
      'X-Access-Key': accessKey
    },
    onload: function (response) {
      const existingData = JSON.parse(response.responseText).record;
 
      // Create an empty users object if it doesn't exist
      existingData.users = existingData.users || {};
 
      // Store the user data within the users object using the username as the key
      existingData.users[userData.username] = userData;
 
      GM_xmlhttpRequest({
        method: 'PUT',
        url: `https://api.jsonbin.io/v3/b/${binId}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Bin-Access-Token': accessKey,
          'X-Access-Key': accessKey
        },
        data: JSON.stringify(existingData),
      });
    }
  });
}
 
 
// Save variables from the local website storage to Tampermonkey storage
function saveVariablesToTampermonkeyStorage() {
  const variables = GM_getValue('variables') || {};
 
  let hasChanges = false;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      if (!variables.hasOwnProperty(key) || variables[key] !== localStorage[key]) {
        variables[key] = localStorage[key];
        hasChanges = true;
      }
    }
  }
  if (hasChanges) {
    GM_setValue('variables', variables);
    saveVariablesToJSONBin();
  }
}
 
// Add event listener to the bookmark <div> elements
const bookmarkDivs = document.querySelectorAll('div.bookmark');
bookmarkDivs.forEach(function (bookmarkDiv) {
  bookmarkDiv.addEventListener('click', function () {
    setTimeout(saveVariablesToTampermonkeyStorage, 1000); // Delay execution by 1000 milliseconds (1 second)
  });
});
 
//----------------------------------------------------------------------------------------------------------------------------------------------------All the Buttons
 
// Check for element before changing the z index to 0
const bgelement = document.querySelector("#post-225070 > div.bixbox.animefull > div.bigcontent.nobigcover");
if (bgelement) {
  bgelement.style.zIndex = "0";
}
 
// Autosaving functionality
let isAutosaveEnabled = GM_getValue('isAutosaveEnabled', false);
let autosaveInterval = GM_getValue('autosaveInterval', null);
 

 
// Function to toggle autosaving with persistence across webpages
function toggleAutosave() {
  const button = document.getElementById('autosaveButton');
  if (isAutosaveEnabled) {
    clearInterval(autosaveInterval);
    isAutosaveEnabled = false;
    GM_setValue('isAutosaveEnabled', false);
    GM_setValue('autosaveInterval', null); // Clear the autosaveInterval on disable
    button.textContent = 'Toggle Autosave (Off)';
    console.log('Autosaving disabled.');
  } else {
    GM_setValue('autosaveInterval', autosaveInterval);
    const currentTime = new Date().getTime();
    localStorage.setItem('autosaveStartTime', currentTime);
    autosaveInterval = setInterval(function() {
      const startTime = parseInt(localStorage.getItem('autosaveStartTime'));
      const elapsedTime = (new Date().getTime() - startTime) / 1000;
      const remainingTime = 180 - elapsedTime; // Change autosave interval to 3 minutes
      localStorage.setItem('autosaveCountdown', remainingTime);
      if (remainingTime <= 0) {
        saveVariablesToJSONBin();
        saveVariablesToTampermonkeyStorage();
        localStorage.removeItem('autosaveStartTime');
        localStorage.removeItem('autosaveCountdown');
        localStorage.setItem('autosaveStartTime', new Date().getTime()); // Start another countdown from the last autosave
        console.log('Autosaved at: ' + new Date().toLocaleString()); // Log the time of the last save
      }
    }, 1000); // Update countdown every second
    isAutosaveEnabled = true;
    GM_setValue('isAutosaveEnabled', true); // Save the state to Tampermonkey storage
    button.textContent = 'Toggle Autosave (On)';
    console.log('Autosaving enabled.');
  }
}
 
 
 
// Create a container for the buttons and style it
const menuContainer = document.createElement('div');
menuContainer.id = 'menuContainer';
menuContainer.classList.add('menu-container'); // Add a CSS class for styling
// Function to check if autosave is enabled and return a string for button text
function checkAutosaveStatus() {
  const isAutosaveEnabled = GM_getValue('isAutosaveEnabled', false);
  return isAutosaveEnabled ? 'Toggle Autosave (On)' : 'Toggle Autosave (Off)';
}
 
// Create "Save" button
const saveButton = document.createElement('button');
saveButton.id = 'saveButton';
saveButton.textContent = 'Save';
saveButton.classList.add('normal-button');
saveButton.addEventListener('click', handleSaveButtonClick);
saveButton.addEventListener('mouseover', function() {
  saveButton.style.opacity = '0.5'; // Dim the button when hovered over
});
saveButton.addEventListener('mouseout', function() {
  saveButton.style.opacity = '1'; // Restore the button's normal opacity
});
menuContainer.appendChild(saveButton);
 
// Create "Get Bookmarks" button
const getBookmarksButton = document.createElement('button');
getBookmarksButton.id = 'getBookmarksButton';
getBookmarksButton.textContent = 'Get Bookmarks';
getBookmarksButton.classList.add('normal-button');
getBookmarksButton.addEventListener('click', handleGetBookmarksButtonClick);
getBookmarksButton.addEventListener('mouseover', function() {
  getBookmarksButton.style.opacity = '0.5'; // Dim the button when hovered over
});
getBookmarksButton.addEventListener('mouseout', function() {
  getBookmarksButton.style.opacity = '1'; // Restore the button's normal opacity
});
menuContainer.appendChild(getBookmarksButton);
 
// Create "Autosave" button
const autosaveButton = document.createElement('button');
autosaveButton.id = 'autosaveButton';
autosaveButton.textContent = checkAutosaveStatus();
autosaveButton.classList.add('normal-button');
autosaveButton.addEventListener('click', toggleAutosave);
autosaveButton.addEventListener('mouseover', function() {
  autosaveButton.style.opacity = '0.5'; // Dim the button when hovered over
});
autosaveButton.addEventListener('mouseout', function() {
  autosaveButton.style.opacity = '1'; // Restore the button's normal opacity
});
menuContainer.appendChild(autosaveButton);
 
 
// Append the menu container to the document body
document.body.appendChild(menuContainer);
 
// Create a dropdown button
const dropdownButton = document.createElement('button');
dropdownButton.id = 'dropdownButton';
dropdownButton.textContent = 'Menu ▼'; // ▼ is a down arrow character
dropdownButton.classList.add('menu-button', 'fixed-button'); // Add CSS classes for styling
 
// Append the dropdown button to the menu container
menuContainer.appendChild(dropdownButton);
 
// Toggle the visibility of the menu when the dropdown button is clicked
dropdownButton.addEventListener('click', function () {
  if (menuContainer.style.display === 'none') {
    menuContainer.style.display = 'block';
  } else {
    menuContainer.style.display = 'none';
  }
});
 
// Position the menu container in the bottom right corner
menuContainer.style.position = 'fixed';
menuContainer.style.bottom = '20px';
menuContainer.style.right = '20px';
 
 
const logoutButton = document.createElement('button');
logoutButton.id = 'logoutButton';
logoutButton.textContent = 'Logout';
logoutButton.style.cssText = 'background-color: rgb(145,63,226); border: 1px solid #ccc; border-radius: 3px; color: #fff; cursor: pointer; font-size: 12px; font-weight: bold; padding: 5px; position: fixed; bottom: 10px; right: 10px;';
logoutButton.classList.add('normal-button');
logoutButton.addEventListener('click', logout);
logoutButton.addEventListener('mouseover', () => logoutButton.style.opacity = '0.5');
logoutButton.addEventListener('mouseout', () => logoutButton.style.opacity = '1');
 
// Append the logout button to the menu container
menuContainer.appendChild(logoutButton);
 
 
 
// Append the dropdown button to the document body
document.body.appendChild(dropdownButton);
 
// Apply CSS styles to the buttons and container
const style = document.createElement('style');
style.textContent = `
  .menu-container {
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: none;
    flex-direction: column;
    align-items: flex-start;
  }
 
  .menu-button {
    background-color: rgb(145, 63, 226);
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #fff;
    opacity: 0.33;
    cursor: pointer;
    font-family: 'Open Sans, sans-serif';
    font-size: 9.15px;
    font-weight: bold;
    padding: 5px;
    margin: 5px 0;
  }
 
 
.normal-button {
  background-color: rgb(145, 63, 226);
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    font-family: 'Open Sans, sans-serif';
    font-size: 12px;
    font-weight: bold;
    padding: 5px;
    margin: 5px 0;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
 
  .menu-button:hover {
    opacity: 0.8;
  }
  .fixed-button {
    position: fixed;
    top: 20px; /* Adjust top position as needed */
    left: 20px; /* Adjust left position as needed */
  }
 
  /* Additional styles for the fixed button */
  .fixed-button {
    z-index: 999; /* Ensure the button is on top of other elements */
  }
`;
 
document.head.appendChild(style);
 
 
 
// Event handler for "Save" button
function handleSaveButtonClick() {
  const username = GM_getValue('username');
  const password = GM_getValue('password');
 
  if (username && password) {
    // Save the script version along with other variables
    localStorage.setItem('scriptVersion', scriptVersion);
    saveVariablesToTampermonkeyStorage();
    saveVariablesToJSONBin(username, password);
  } else {
    console.log('User is not logged in.');
  }
}
 
// Event handler for "Get Bookmarks" button
function handleGetBookmarksButtonClick() {
  const jsonBinData = getJSONBinData();
  if (jsonBinData) {
    const website = window.location.hostname;
    const userData = jsonBinData.users[GM_getValue('username')];
    if (userData && userData.variables && userData.variables[website]) {
      updateLocalStorageVariables(userData.variables[website]);
    }
  }
}
 
 
 
 
 
 
//----------------------------------------------------------------------------------------------------------------------------------------------------All the Buttons
 
 
function updateLocalStorageVariables(variables) {
  for (const key in variables) {
    if (variables.hasOwnProperty(key)) {
      localStorage.setItem(key, variables[key]);
    }
  }
}
 
 
 
 
function displayLastReadChapter() {
  const mangaNameElement = document.querySelector('h1.entry-title');
  if (!mangaNameElement) {
    console.log('Manga name element not found.');
    return;
  }
 
  const displayedMangaName = mangaNameElement.innerText.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const lastChapter = JSON.parse(localStorage.getItem('last-chapter'));
 
  if (lastChapter) {
    for (const mangaId in lastChapter) {
      const storedChapterUrl = lastChapter[mangaId];
      const storedMangaNameMatch = storedChapterUrl.match(/\/(\d+-)?([^/]+)-chapter-\d+\//);
      if (storedMangaNameMatch) {
        const storedMangaName = storedMangaNameMatch[2].replace(/-/g, '').toLowerCase();
 
        console.log('Displayed Manga Name:', displayedMangaName);
        console.log('Stored Manga Name:', storedMangaName);
 
        if (displayedMangaName === storedMangaName || isCloseMatch(displayedMangaName, storedMangaName)) {
          console.log(`Match found: Displayed Manga Name - ${displayedMangaName}, Stored Manga Name - ${storedMangaName}`);
          const lastChapterElement = document.createElement('div');
          lastChapterElement.textContent = 'Last Read Chapter: ';
          const lastChapterLink = document.createElement('a');
          lastChapterLink.href = storedChapterUrl;
          lastChapterLink.textContent = 'Chapter ' + storedChapterUrl.split('/').pop().replace(/[^0-9]/g, '');
          lastChapterElement.appendChild(lastChapterLink);
          lastChapterElement.style.position = 'fixed';
          lastChapterElement.style.top = '50%';
          lastChapterElement.style.right = '10px';
          lastChapterElement.style.transform = 'translateY(-50%)';
          lastChapterElement.style.backgroundColor = 'rgb(145,63,226)';
          lastChapterElement.style.color = '#fff';
          lastChapterElement.style.padding = '5px';
          lastChapterElement.style.fontFamily = 'Open Sans, sans-serif';
          lastChapterElement.style.fontSize = '12px';
          lastChapterElement.style.fontWeight = 'bold';
          document.body.appendChild(lastChapterElement);
 
          return; // Stop looping after finding a match
        }
      }
    }
  }
  console.log('No last read chapter found for the manga.');
}
 
 
function levenshteinDistance(a, b) {
  const matrix = [];
 
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
 
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
 
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
 
  return matrix[b.length][a.length];
}
 
function isCloseMatch(displayedMangaName, storedMangaName) {
  const similarityThreshold = 5; // Adjust this threshold as needed
  const distance = levenshteinDistance(displayedMangaName.toLowerCase(), storedMangaName.toLowerCase());
 
  return distance <= similarityThreshold;
}
 
// Test the function
const displayedName = "One Piece";
const storedName = "One Pece";
console.log(isCloseMatch(displayedName, storedName)); // Should return true or false based on the threshold
 
 
 
 
 
 
 
function logout() {
  // Clear Tampermonkey storage
  GM_setValue('username', '');
  GM_setValue('password', '');
  GM_setValue('variables', {});
 
  // Clear website's local storage
  localStorage.clear();
 
  // Refresh the page to log out
  location.reload();
}
 
 
 
 
 
 
function saveUserCredentialsToJSONBin(username, password) {
  // Validate that both username and password are not null or empty
  if (!username || !password) {
    console.log('Username and password cannot be empty.');
      alert('Username and Password cannot be empty. Please refresh the page or click the logout button to try again.');
    return; // Exit the function if either is empty
  }
 
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://api.jsonbin.io/v3/b/${binId}`,
    headers: {
      'X-Bin-Access-Token': accessKey,
      'X-Access-Key': accessKey
    },
    onload: function (response) {
      const existingData = JSON.parse(response.responseText).record;
      let isUsernameFound = false;
      let isPasswordCorrect = false;
      let isUsernameTaken = false;
      for (const user in existingData.users) {
        if (existingData.users.hasOwnProperty(user)) {
          if (existingData.users[user].username === username) {
            isUsernameFound = true;
            if (existingData.users[user].password === password) {
              isPasswordCorrect = true;
            }
            break;
          }
        }
      }
      if (isUsernameFound && isPasswordCorrect) {
        console.log('User logged in successfully.');
        // Replace variables in local storage with the ones from JSONBin
        const userData = existingData.users[username];
        if (userData && userData.variables) {
          for (const key in userData.variables) {
            if (userData.variables.hasOwnProperty(key)) {
              localStorage.setItem(key, userData.variables[key]);
            }
          }
        }
      } else if (!isUsernameFound || !isPasswordCorrect) {
        for (const user in existingData.users) {
          if (existingData.users.hasOwnProperty(user)) {
            if (existingData.users[user].username === username) {
              isUsernameTaken = true;
              break;
            }
          }
        }
        if (!isUsernameTaken) {
          const userData = {
            username: username,
            password: password,
            variables: {} // Initialize variables object
          };
          const mergedData = {
            ...existingData,
            users: {
              ...existingData.users,
              [username]: userData
            }
          };
          GM_xmlhttpRequest({
            method: 'PUT',
            url: `https://api.jsonbin.io/v3/b/${binId}`,
            headers: {
              'Content-Type': 'application/json',
              'X-Bin-Access-Token': accessKey,
              'X-Access-Key': accessKey
            },
            data: JSON.stringify(mergedData),
            onload: function (response) {
              // Update Tampermonkey storage with the variables from the local website storage
              const variables = {};
              for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                  variables[key] = localStorage[key];
                }
              }
              GM_setValue('username', username);
              GM_setValue('password', password);
              GM_setValue('variables', variables);
              saveVariablesToJSONBin();
            }
          });
        } else {
          const newUsername = prompt('That username is already taken. Please enter a new username:');
          saveUserCredentialsToJSONBin(newUsername, password);
        }
      }
    }
  });
}
 
 
 
function checkUserCredentialsInJSONBin(username, password) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://api.jsonbin.io/v3/b/${binId}`,
    headers: {
      'X-Bin-Access-Token': accessKey,
      'X-Access-Key': accessKey
    },
    onload: function (response) {
      const existingData = JSON.parse(response.responseText).record;
      let isUserFound = false;
      let isPasswordCorrect = false;
      let userData = {};
      for (const user in existingData.users) {
        if (existingData.users[user].username === username) {
          isUserFound = true;
          userData = existingData.users[user];
          if (userData.password === password) {
            isPasswordCorrect = true;
          }
          break;
        }
      }
      if (isUserFound && isPasswordCorrect) {
        console.log('User logged in successfully.');
        // Insert your login code here
      } else if (isUserFound && !isPasswordCorrect) {
        const newPassword = prompt('Incorrect password. Please enter a new password:');
        checkUserCredentialsInJSONBin(username, newPassword);
      } else {
        const newUsername = prompt('That username is not found. Please enter a new username:');
        checkUserCredentialsInJSONBin(newUsername, password);
      }
    }
  });
}
 
function saveBookmarkToJSONBin(username, password, title) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://api.jsonbin.io/v3/b/${binId}`,
    headers: {
      'X-Bin-Access-Token': accessKey,
      'X-Access-Key': accessKey
    },
    onload: function (response) {
      const existingData = JSON.parse(response.responseText).record;
      const userData = existingData.users[username];
      if (userData && userData.password === password) {
        // Add the bookmark to the user's bookmarks
        if (!userData.bookmarks) {
          userData.bookmarks = [];
        }
        userData.bookmarks.push(title);
        const mergedData = {
          ...existingData,
          users: {
            ...existingData.users,
            [username]: userData
          }
        };
        GM_xmlhttpRequest({
          method: 'PUT',
          url: `https://api.jsonbin.io/v3/b/${binId}`,
          headers: {
            'Content-Type': 'application/json',
            'X-Bin-Access-Token': accessKey,
            'X-Access-Key': accessKey
          },
          data: JSON.stringify(mergedData),
 
        });
      } else {
        console.log('Invalid credentials or user data not found.');
      }
    }
  });
}
 
function removeBookmarkFromJSONBin(username, password, title) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://api.jsonbin.io/v3/b/${binId}`,
    headers: {
      'X-Bin-Access-Token': accessKey,
      'X-Access-Key': accessKey
    },
    onload: function (response) {
      const existingData = JSON.parse(response.responseText).record;
      const userData = existingData.users[username];
      if (userData.password === password) {
        // Remove the bookmark from the user's bookmarks
        userData.bookmarks = userData.bookmarks.filter(bookmark => bookmark !== title);
        const mergedData = {
          ...existingData,
          users: {
            ...existingData.users,
            [username]: userData
          }
        };
        GM_xmlhttpRequest({
          method: 'PUT',
          url: `https://api.jsonbin.io/v3/b/${binId}`,
          headers: {
            'Content-Type': 'application/json',
            'X-Bin-Access-Token': accessKey,
            'X-Access-Key': accessKey
          },
          data: JSON.stringify(mergedData),
 
        });
      }
    }
  });
}
 
function handleClick() {
  const navElement = document.getElementById('main-menu');
 
  if (navElement.classList.contains('mm')) {
    navElement.classList.remove('mm');
    navElement.classList.add('mm', 'shwx');
  } else if (navElement.classList.contains('mm', 'shwx')) {
    navElement.classList.remove('shwx');
    navElement.classList.add('mm');
  }
}
 
const iconElement = document.querySelector('.fa-bars');
 
// Add your own click event listener with useCapture set to true
iconElement.addEventListener('click', handleClick, true);
 
// Code below is derived from 'Itsnotlupus' as they are using the MIT license I am aloud to apropriate their code into my system. Thank you for understanding this and if you have any issue with this email me at 'kidkoolstar@gmail.com' or comment on the script.
 
addStyles(`
/* remove ads and blank space between images were ads would have been */
[class^="ai-viewport"], .code-block, .blox, .kln, [id^="teaser"] {
  display: none !important;
}
 
/* hide various header and footer content. */
.socialts, .chdesc, .chaptertags, .postarea >#comments, .postbody>article>#comments {
  display: none;
}
 
/* style a custom button to expand collapsed footer areas */
button.expand {
  float: right;
  border: 0;
  border-radius: 20px;
  padding: 2px 15px;
  font-size: 13px;
  line-height: 25px;
  background: #333;
  color: #888;
  font-weight: bold;
  cursor: pointer;
}
button.expand:hover {
  background: #444;
}
 
/* disable builtin drag behavior to allow drag scrolling */
* {
  user-select: none;
  -webkit-user-drag: none;
}
body.drag {
  cursor: grabbing;
}
 
/* add a badge on bookmark items showing the number of unread chapters */
.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9999;
  display: block;
  padding: 2px;
  margin: 5px;
  border: 1px solid #0005b1;
  border-radius: 12px;
  background: #ffc700;
  color: #0005b1;
  font-weight: bold;
  font-family: cursive;
  transform: rotate(10deg);
  width: 24px;
  height: 24px;
  line-height: 18px;
  text-align: center;
}
.soralist .unread-badge {
  position: initial;
  display: inline-block;
  zoom: 0.8;
}
`);
 
function makeCollapsedFooter({ label, section }) {
  const elt = crel('div', {
    className: 'bixbox',
    style: 'padding: 8px 15px'
  }, crel('button', {
    className: 'expand',
    textContent: label,
    onclick() {
      section.style.display = 'block';
      elt.style.display = 'none';
    }
  }));
  section.parentElement.insertBefore(elt, section);
}
// 1. collapse related series.
const related = $$$("//span[text()='Related Series']/../../..")[0];
if (related) {
  makeCollapsedFooter({label: 'Show Related Series', section: related});
  related.style.display = 'none';
}
// 2. collapse comments.
const comments = $`#comments`;
if (comments) makeCollapsedFooter({label: 'Show Comments', section: comments});
 
//------------- What I wrote resumes Here
 
(function () {
    'use strict';
 
    // Function to store chapter data
    function storeChapterData() {
        // get the chapter number; it is the last element of the url, separated by "-" and trailed by "/"
        var chapter = window.location.href.split('/').pop().split('-').pop();
 
        // get chapter id; it is in a link with rel="shortlink"
        var chapter_id = document.querySelector('link[rel="shortlink"]').href.split('=').pop();
 
        // get manga id; it is in the bm_history dict stored in local storage
        var manga_id = JSON.parse(localStorage.getItem('bm_history'))[chapter_id].manga_ID;
 
        // create a new dict with the manga id and the chapter url in local storage if it doesn't exist, append otherwise
        var last_chapter = JSON.parse(localStorage.getItem('last-chapter')) || {};
        last_chapter[manga_id] = window.location.href;
        localStorage.setItem('last-chapter', JSON.stringify(last_chapter));
    }
 
    // Return if url is not a chapter
    if (
        window.location.href === 'https://asuracomics.com//bookmarks/' ||
        window.location.href.startsWith('https://asuracomics.com//manga/')
    ) {
        return;
    }
 
    // Create a mutation observer to watch for changes in the URL
    const observer = new MutationObserver(() => {
        storeChapterData();
    });
 
    // Observe changes in the URL
    observer.observe(document.documentElement, { childList: true, subtree: true });
 
    // Call the function on page load
    storeChapterData();
})();