// ==UserScript==
// @name         KG_Hide_Spam_Races
// @namespace    http://klavogonki.ru
// @version      0.7
// @description  This script will hide all the races what are created for bad purposes
// @author       Patcher
// @match        *://klavogonki.ru/gamelist/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484025/KG_Hide_Spam_Races.user.js
// @updateURL https://update.greasyfork.org/scripts/484025/KG_Hide_Spam_Races.meta.js
// ==/UserScript==

// Constants for the threshold, time limits, and max hidden elements
const itemThreshold = 1; // Number of items
const timeLimitInSeconds = 3; // Time in seconds
const maxHiddenElements = 300; // Maximum number of hidden elements before removal
// Global variable to store the user id what is exceeded the limit 
let currentUserId;

// Exposed settings for info element svg icons
const xmlns = "http://www.w3.org/2000/svg";
const svgSize = 16;
const svgStrokeWidth = 2;

const eyeSvgOn = `
<svg xmlns="${xmlns}" width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="${svgStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-on">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
  <circle cx="12" cy="12" r="3"></circle>
</svg>
`;

const eyeSvgOff = `
<svg xmlns="${xmlns}" width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="${svgStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20 c-7 0-11-8-11-8 a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24A9.12 9.12 0 0 1 12 4
    c7 0 11 8 11 8 a18.5 18.5 0 0 1-2.16 3.19 m-6.72-1.07 a3 3 0 1 1-4.24-4.24 L17.94 17.94z">
  </path>
  <line x1="1" y1="1" x2="23" y2="23"></line>
</svg>
`;

// Helper function to toggle visibility icon and update item info visibility state
function toggleItemInfoVisibility() {
  let visibilityButton = raceItem.querySelector('.visibility-button');
  let raceItemNickname = raceItem.querySelector('.race-item-nickname');

  if (visibilityButton && raceItemNickname) {
    // Check the current state in localStorage
    const isVisible = localStorage.getItem('raceSpamNicknameVisibility') === 'visible';

    // Toggle the icon and update the localStorage state
    if (isVisible) {
      visibilityButton.innerHTML = eyeSvgOff;
      localStorage.setItem('raceSpamNicknameVisibility', 'hidden');
      // Set display to 'none' to hide the race item nickname
      raceItemNickname.style.display = 'none';
    } else {
      visibilityButton.innerHTML = eyeSvgOn;
      localStorage.setItem('raceSpamNicknameVisibility', 'visible');
      // Set display to 'inline-flex' to show the race item nickname
      raceItemNickname.style.display = 'inline-flex';
    }
  }
}

// Create a single raceItem element if it doesn't exist 
let raceItem = document.querySelector('.race-item');
if (!raceItem) {
  raceItem = document.createElement('div');
  raceItem.classList.add('race-item');
  document.body.appendChild(raceItem);

}

// Function to update the raceItem element
function updateRaceItem(profileText, exceededLimit) {
  if (raceItem) {
    // Check if the localStorage key exists, if not, create it with default value 'visible'
    if (!localStorage.getItem('raceSpamNicknameVisibility')) {
      localStorage.setItem('raceSpamNicknameVisibility', 'visible');
    }

    // Set the current state in localStorage
    const isVisible = localStorage.getItem('raceSpamNicknameVisibility') === 'visible';

    // Update the classes and background color based on whether it's removed or saved
    raceItem.classList.toggle('removed-spam-races', exceededLimit);
    raceItem.classList.toggle('saved-normal-races', !exceededLimit);

    // Create the visibilityButton SVG element only if it doesn't exist
    let visibilityButton = raceItem.querySelector('.visibility-button');
    if (!visibilityButton) {
      visibilityButton = document.createElement('div');
      visibilityButton.classList.add('visibility-button');

      // Set the initial visibility icon based on the localStorage value
      visibilityButton.innerHTML = isVisible ? eyeSvgOn : eyeSvgOff;

      raceItem.appendChild(visibilityButton);

      // Set up click event to toggle visibility icon and item info visibility
      visibilityButton.addEventListener('click', toggleItemInfoVisibility);
    }

    // Set the text content for profileText
    let raceItemNickname = raceItem.querySelector('.race-item-nickname');
    if (!raceItemNickname) {
      raceItemNickname = document.createElement('div');
      raceItemNickname.classList.add('race-item-nickname');

      // Set the display property based on the visibility state
      raceItemNickname.style.display = isVisible ? 'inline-flex' : 'none';

      raceItem.appendChild(raceItemNickname);
    }

    // Update text content of nickname if already created
    if (raceItemNickname) {
      raceItemNickname.textContent = profileText;

      // Add or remove click event listener to/from raceItemNickname based on exceededLimit
      if (exceededLimit) {
        raceItemNickname.addEventListener('click', navigateToProfile);
      } else {
        raceItemNickname.removeEventListener('click', navigateToProfile);
      }
    }
  }
}

// Function to navigate to the user's profile
function navigateToProfile() {
  if (currentUserId) {
    const profileUrl = `https://klavogonki.ru/profile/${currentUserId}`;
    window.open(profileUrl, '_blank');
  }
}

// Create an object to store the count and timestamp of each profile text
const profileTextCount = {};

// Function to process a single .item element
function processItem(item) {
  const profileElements = item.querySelectorAll('[id^="player_name"]');
  if (profileElements.length > 0) {
    const profileTextArray = Array.from(profileElements).map(element => element.textContent.trim());

    // Check if the array contains a valid profile text at index 0
    if (profileTextArray[0] && profileTextArray[0].trim() !== '') {
      const profileText = profileTextArray[0]; // Get the profile text at index 0

      if (!profileTextCount[profileText]) {
        profileTextCount[profileText] = {
          count: 0,
          lastTimestamp: 0,
          exceededLimit: false,
        };
      }

      const currentTime = Date.now();

      // Check if the user at index 0 has created more than itemThreshold items with the same profile text within the time limit
      if (profileTextCount[profileText].count >= itemThreshold && currentTime - profileTextCount[profileText].lastTimestamp <= timeLimitInSeconds * 1000) {
        // Set a flag to indicate that this user has exceeded the limit
        profileTextCount[profileText].exceededLimit = true;

        // Hide the item
        item.style.display = 'none';

        // Get the anchor element within the profileElements context
        const anchorElement = profileElements[0].querySelector('.profile');

        // Check if the anchor element exists
        if (anchorElement) {
          // Get the user ID and user NAME 
          const userIdMatch = anchorElement.getAttribute('href').match(/\/profile\/(\d+)\//);
          const userId = userIdMatch ? userIdMatch[1] : null;

          // Update the globally stored currentUserId
          currentUserId = userId;
        }
      }

      // Update the raceItem element
      updateRaceItem(profileText, profileTextCount[profileText].exceededLimit);

      // Update the count and timestamp for this profile text in the object
      profileTextCount[profileText].count += 1;
      profileTextCount[profileText].lastTimestamp = currentTime;
    }
  }
}

// Function to hide all items of a user who exceeded the limit with a delay
function hideItemsWithExceededLimit(profileText) {
  document.querySelectorAll('#gamelist .item').forEach(itemToHide => {
    const itemProfileElements = itemToHide.querySelectorAll('[id^="player_name"]');
    const profileTextArray = Array.from(itemProfileElements).map(element => element.textContent.trim());
    if (profileTextArray.length > 0 && profileTextArray[0] === profileText) {
      // Check if the item still exists in the DOM before attempting to hide it
      if (itemToHide.parentNode) {
        // Hide the item by setting display to "none"
        itemToHide.style.display = 'none';

        // Clear the user's data after hiding
        profileTextArray.forEach(profileText => {
          delete profileTextCount[profileText];
        });

        // Check if the number of hidden elements exceeds maxHiddenElements
        const hiddenElements = document.querySelectorAll('#gamelist .item[style*="display: none;"]');
        if (hiddenElements.length > maxHiddenElements) {
          // Remove excess hidden elements and their comments
          hiddenElements.forEach(hiddenElement => {
            const nextSibling = hiddenElement.nextSibling;
            if (nextSibling && nextSibling.nodeType === Node.COMMENT_NODE) {
              nextSibling.parentNode.removeChild(nextSibling);
            }
            hiddenElement.parentNode.removeChild(hiddenElement);
          });
        }
      }
    }
  });
}

// Iterate through existing .item elements
document.querySelectorAll('#gamelist .item').forEach(item => {
  processItem(item);
});

// Create a MutationObserver to watch for changes in #gamelist
const observer = new MutationObserver(mutationsList => {
  mutationsList.forEach(mutation => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Iterate through newly added .item elements
      mutation.addedNodes.forEach(addedNode => {
        if (addedNode.nodeType === 1 && addedNode.classList.contains('item')) {
          processItem(addedNode);
        }
      });
    }
  });

  // Check for users who exceeded the limit and hide their items
  Object.keys(profileTextCount).forEach(profileText => {
    if (profileTextCount.hasOwnProperty(profileText) && profileTextCount[profileText].exceededLimit) {
      hideItemsWithExceededLimit(profileText);
    }
  });
});

// Start observing #gamelist for changes
const gamelist = document.getElementById('gamelist');
observer.observe(gamelist, { childList: true, subtree: true });

// Function to inject the CSS style with the removed Race Item Animation into the <head> tag
function injectCSS() {
  const hideSpamRacesStyles = document.createElement('style');
  // Add the class 'hide-spam-races' to the <style> tag
  hideSpamRacesStyles.classList.add('hide-spam-races');

  hideSpamRacesStyles.innerHTML = `
    .race-item {
      display: flex;
      justify-content: space-around';
      align-items: center;
      position: fixed;
      bottom: 6px;
      left: 6px;
    }  

    .visibility-button {
      padding: 6px;
      cursor: pointer;
      transition: filter 0.3s;
    }

    .visibility-button:hover {
      filter: brightness(1.4);
    }

    .race-item-nickname {
      padding: 6px;
    }

    @keyframes removedRaceItemAnimation {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      60% {
        transform: translateY(-15px);
      }
    }

    .removed-spam-races {
      background-color: hsl(0, 50%, 15%);
      color: hsl(0, 50%, 70%);
      border: 1px solid hsl(0, 50%, 40%) !important;
      cursor: pointer;
      animation: removedRaceItemAnimation 1s ease-in-out;
    }

    .removed-spam-races .race-item-nickname {
      transition: filter 0.3s;
    }

    .removed-spam-races .race-item-nickname:hover {
      filter: brightness(1.4);
    }

    .saved-normal-races {
      background-color: hsl(100, 50%, 10%);
      color: hsl(100, 50%, 50%);
      border: 1px solid hsl(100, 50%, 25%) !important;
      cursor: default;
    }
  `;


  // Append the style element to the head
  document.head.appendChild(hideSpamRacesStyles);
}

// Call the injectCSS function to inject the CSS
injectCSS();