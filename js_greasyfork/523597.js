// ==UserScript==
// @name         ChatGPT Tools you say
// @namespace    ChatGPT Tools by Vishanka
// @version      3.6
// @description  Various Tools for ChatGPT
// @author       Vishanka
// @license      Proprietary
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @supportURL   https://greasyfork.org/scripts/521345-chatgpt-tools
// @downloadURL https://update.greasyfork.org/scripts/523597/ChatGPT%20Tools%20you%20say.user.js
// @updateURL https://update.greasyfork.org/scripts/523597/ChatGPT%20Tools%20you%20say.meta.js
// ==/UserScript==



(function () {
    'use strict';
// =============================================================== MAIN INJECT ===============================================================

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

if (!isMobileDevice()) {
function disableEnterKey(event) {
    // Check if the Enter key is pressed
    if (event.key === "Enter") {
        // Allow Shift + Enter for a new paragraph
        if (event.shiftKey) {
            console.log("New paragraph created.");
            return; // Exit the function, allowing the default behavior
        }
        // Prevent default Enter key behavior
// This stores the input text for the Lorebook, as it's executed before the other functions it only holds the input text without the injects. It could be reasonable to outsource this to the lorebook logic script, but really have to mind the timing.
        storeInputText();
        event.preventDefault();
        console.log("Enter key functionality disabled.");
        const inputPanelGPT = document.querySelector('div#prompt-textarea.ProseMirror');

// Current Time
        const getTimeState = localStorage.getItem('enableTime');
        if (getTimeState === "true") {
        storeCurrentTime();
        const currentTime = localStorage.getItem('currentTime');
        const newParagraph = document.createElement('p');
        newParagraph.textContent = currentTime;
        inputPanelGPT.appendChild(newParagraph);
        console.log('Current Time appended:', currentTime);
        }

// RULES
        const getRulesState = localStorage.getItem('enableRules');
        if (getRulesState === "true") {
        const getSelectedRuleValue = localStorage.getItem('selectedRuleValue');
        const newParagraph = document.createElement('p');
        newParagraph.textContent = getSelectedRuleValue;
        inputPanelGPT.appendChild(newParagraph);
        console.log('Next Rule appended:', getSelectedRuleValue);
        }


// LOREBOOK
const getLorebookState = localStorage.getItem('enableLorebook');
if (getLorebookState === "true") {
  lorebookLogic();
  const getSelectedLorebookEntries = localStorage.getItem('selectedLorebookValues');

  // Check if getSelectedLorebookEntries is not null, empty, or '[]'
  if (getSelectedLorebookEntries && getSelectedLorebookEntries !== "[]") {
    // Parse the JSON string back into an array
    const lorebookEntries = JSON.parse(getSelectedLorebookEntries);

    // Iterate over each entry and append it as a separate paragraph
    lorebookEntries.forEach(entry => {
      const newParagraph = document.createElement('p');
      newParagraph.textContent = entry;
      inputPanelGPT.appendChild(newParagraph);
    });

    console.log('Lorebook Entries appended:', lorebookEntries);
  }
}


        // Update the selection range to the end of the container
        const selection = window.getSelection();
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(inputPanelGPT);
        newRange.collapse(false);
        selection.addRange(newRange);

        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        inputPanelGPT.dispatchEvent(inputEvent);

        setTimeout(() => {
          const sendButton = document.querySelector('button[data-testid="send-button"]');
          if (sendButton) {
            sendButton.click();
            console.log('Send button clicked after delay.');
          } else {
            console.error('Send button not found.');
          }
        }, 100); // 10ms delay (adjust as needed)

    }
}

// Attach the event listener to the document
document.addEventListener("keydown", disableEnterKey, true);
}

if (isMobileDevice()) {
let programmaticClick = false; // Flag to differentiate between user and programmatic clicks

document.body.addEventListener('click', function (event) {
    const sendButton1 = document.querySelector('button[aria-label="Send prompt"]');

    // Check if the button exists and if the clicked target is the send button
    if (sendButton1 && sendButton1.contains(event.target)) {
        console.error('AAAAAAA');

        // If this is a programmatic click, bypass the custom logic
        if (programmaticClick) {
            programmaticClick = false; // Reset the flag for subsequent clicks
            console.log("Programmatic click detected, skipping custom logic.");
            return;
        }
        // Prevent default Enter key behavior
// This stores the input text for the Lorebook, as it's executed before the other functions it only holds the input text without the injects. It could be reasonable to outsource this to the lorebook logic script, but really have to mind the timing.
        storeInputText();
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log("Send Button functionality temporarily disabled to execute custom logic.");

        const inputPanelGPT = document.querySelector('div#prompt-textarea.ProseMirror');

// Current Time
        const getTimeState = localStorage.getItem('enableTime');
        if (getTimeState === "true") {
        storeCurrentTime();
        const currentTime = localStorage.getItem('currentTime');
        const newParagraph = document.createElement('p');
        newParagraph.textContent = currentTime;
        inputPanelGPT.appendChild(newParagraph);
        console.log('Current Time appended:', currentTime);
        }

// RULES
        const getRulesState = localStorage.getItem('enableRules');
        if (getRulesState === "true") {
        const getSelectedRuleValue = localStorage.getItem('selectedRuleValue');
        // Check if the rule is already appended
        const existingRule = Array.from(inputPanelGPT.children).find(
        child => child.textContent === getSelectedRuleValue
        );
        if (!existingRule) {
        const newParagraph = document.createElement('p');
        newParagraph.textContent = getSelectedRuleValue;
        inputPanelGPT.appendChild(newParagraph);
        console.log('Next Rule appended:', getSelectedRuleValue);
        } else {
        console.log('Rule already exists, not appending again.');
        }
        }

// LOREBOOK
const getLorebookState = localStorage.getItem('enableLorebook');
if (getLorebookState === "true") {
  lorebookLogic();
  const getSelectedLorebookEntries = localStorage.getItem('selectedLorebookValues');

  // Check if getSelectedLorebookEntries is not null, empty, or '[]'
  if (getSelectedLorebookEntries && getSelectedLorebookEntries !== "[]") {
    // Parse the JSON string back into an array
    const lorebookEntries = JSON.parse(getSelectedLorebookEntries);

    // Iterate over each entry and append it as a separate paragraph
    lorebookEntries.forEach(entry => {
      const newParagraph = document.createElement('p');
      newParagraph.textContent = entry;
      inputPanelGPT.appendChild(newParagraph);
    });

    console.log('Lorebook Entries appended:', lorebookEntries);
  }
}




            // Update the selection range to the end of the container
            const selection = window.getSelection();
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(inputPanelGPT);
            newRange.collapse(false);
            selection.addRange(newRange);

            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            inputPanelGPT.dispatchEvent(inputEvent);




        // Restore the send functionality after custom logic
        setTimeout(() => {
            console.log("Restoring Send Button functionality.");
            programmaticClick = true; // Set the flag to indicate programmatic click
            sendButton1.click(); // Programmatically trigger the send action
        }, 100); // Use a 0ms delay to allow custom logic to finish
    }
});

}



// ================================================================ GLOBAL STYLES =================================================================

    const CONFIG = {
        panelBackground: '#171717',
// PanelButtons
        BUTTON_HIGHLIGHT: '#424242',
        BUTTON_OUTLINE: '1px solid #4E4E4E',
    };



// Black Background Overlay
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
overlay.style.zIndex = '999';
overlay.style.display = 'none';

function showOverlay() {
    document.body.appendChild(overlay);
    overlay.style.display = 'block';
}
function hideOverlay() {
    overlay.style.display = 'none';
}


// ================================================================= MAIN PANEL ==================================================================
function mainPanelScript() {
    // Create and add the arrow button to open the storage panel
    const arrowButton = document.createElement('div');
    arrowButton.innerHTML = '&#x2329;';
    arrowButton.style.position = 'fixed';
    arrowButton.style.bottom = '50%';
    arrowButton.style.right = '0';
    arrowButton.style.padding = '10px';
    arrowButton.style.fontSize = '24px';
    arrowButton.style.zIndex = '998';
    arrowButton.style.cursor = 'pointer';
    arrowButton.style.color = '#B4B4B4';
    arrowButton.style.borderRadius = '5px 0 0 5px';
    arrowButton.style.transition = 'transform 0.3s ease, right 0.3s ease';

    // Making Panel available for the whole script
    window.mainPanel = document.createElement('div');
    mainPanel.style.position = 'fixed';
    mainPanel.style.top = '0';
    mainPanel.style.right = '-250px'; // Initially hidden
    mainPanel.style.height = '100%';
    mainPanel.style.width = '250px';
    mainPanel.style.backgroundColor = CONFIG.panelBackground;
    mainPanel.style.transition = 'right 0.3s ease';
    mainPanel.style.zIndex = '999';

    // Create the header above the button
    const mainPanelHeader = document.createElement('div');
    mainPanelHeader.innerText = 'ChatGPT Tools';
    mainPanelHeader.style.margin = '20px';
    mainPanelHeader.style.padding = '10px';
    mainPanelHeader.style.fontSize = '19px';
    mainPanelHeader.style.fontWeight = '550';
    mainPanelHeader.style.color = '#ECECEC';
    mainPanelHeader.style.textAlign = 'center';

    // Create the background overlay
    window.mainPanelOverlay = document.createElement('div');
    mainPanelOverlay.style.position = 'fixed';
    mainPanelOverlay.style.top = '0';
    mainPanelOverlay.style.left = '0';
    mainPanelOverlay.style.width = '100%';
    mainPanelOverlay.style.height = '100%';
    mainPanelOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
    mainPanelOverlay.style.zIndex = '997';
    mainPanelOverlay.style.display = 'none'; // Initially hidden

    // Toggle panel visibility
    arrowButton.addEventListener('click', () => {
        if (mainPanel.style.right === '-250px') {
            mainPanel.style.right = '0';
            arrowButton.style.right = '250px';
            arrowButton.style.transform = 'rotate(180deg)';
            mainPanelOverlay.style.display = 'block'; // Show overlay
        } else {
            closePanel();
        }
    });

    // Close panel and remove overlay
    mainPanelOverlay.addEventListener('click', () => {
        closePanel();
    });

    function closePanel() {
        mainPanel.style.right = '-250px';
        arrowButton.style.right = '0';
        arrowButton.style.transform = 'rotate(0deg)';
        mainPanelOverlay.style.display = 'none'; // Hide overlay
    }

    document.body.appendChild(arrowButton);
    document.body.appendChild(mainPanelOverlay);
    document.body.appendChild(mainPanel);
    mainPanel.appendChild(mainPanelHeader);
}



// ================================================================== LOREBOOK ====================================================================

function lorebookScript() {

    // Create a function to detect mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Manage Lorebook Button
    window.openLorebookButton = document.createElement('div');
    window.openLorebookButton.innerHTML = `
        <button id="toggle-lorebook-panel"
            style="
                display: flex;
                align-items: center;
                gap: 8px;
                position: relative;
                top: 10px;
                right: 0px;
                left: 10px;
                padding: 7px 15px;
                background: transparent;
                color: #b0b0b0;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                text-align: left;
                cursor: pointer;
                width: 90%;
                transition: background-color 0.1s, color 0.1s;
                z-index: 1001;">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-[-1px]">
                <path d="M6 3C4.89543 3 4 3.89543 4 5V13C4 14.1046 4.89543 15 6 15L6 3Z" fill="currentColor"></path>
                <path d="M7 3V15H8.18037L8.4899 13.4523C8.54798 13.1619 8.69071 12.8952 8.90012 12.6858L12.2931 9.29289C12.7644 8.82153 13.3822 8.58583 14 8.58578V3.5C14 3.22386 13.7761 3 13.5 3H7Z" fill="currentColor"></path>
                <path d="M11.3512 15.5297L9.73505 15.8529C9.38519 15.9229 9.07673 15.6144 9.14671 15.2646L9.46993 13.6484C9.48929 13.5517 9.53687 13.4628 9.60667 13.393L12.9996 10C13.5519 9.44771 14.4473 9.44771 14.9996 10C15.5519 10.5523 15.5519 11.4477 14.9996 12L11.6067 15.393C11.5369 15.4628 11.448 15.5103 11.3512 15.5297Z" fill="currentColor"></path>
            </svg>
            Manage Lorebook
        </button>
    `;

    const lorebookButtonElement = openLorebookButton.querySelector('button');
    lorebookButtonElement.onmouseover = () => {
        lorebookButtonElement.style.backgroundColor = '#212121';
        lorebookButtonElement.style.color = '#ffffff';
    };
    lorebookButtonElement.onmouseout = () => {
        lorebookButtonElement.style.backgroundColor = 'transparent';
        lorebookButtonElement.style.color = '#b0b0b0';
    };

// Create the main panel container
const lorebookPanel = document.createElement('div');
lorebookPanel.id = 'lorebookManagerPanel';
lorebookPanel.style.position = 'fixed';
lorebookPanel.style.top = '50%';
lorebookPanel.style.left = '50%';
lorebookPanel.style.transform = 'translate(-50%, -50%)';
lorebookPanel.style.zIndex = '1000';
lorebookPanel.style.display = 'none';
lorebookPanel.style.backgroundColor = '#2F2F2F';
lorebookPanel.style.borderRadius = '20px';
lorebookPanel.style.padding = '10px';

document.body.appendChild(lorebookPanel);

// Add close button for the panel
const lorebookCloseButton = document.createElement('button');
lorebookCloseButton.style.position = 'absolute';
lorebookCloseButton.style.borderRadius = '50%';
lorebookCloseButton.style.top = '20px';
lorebookCloseButton.style.right = '20px';
lorebookCloseButton.style.backgroundColor = 'transparent';
lorebookCloseButton.style.cursor = 'pointer';
lorebookCloseButton.style.width = '32px';
lorebookCloseButton.style.height = '32px';
lorebookCloseButton.style.display = 'flex';
lorebookCloseButton.style.alignItems = 'center';
lorebookCloseButton.style.justifyContent = 'center';
lorebookCloseButton.style.zIndex = '1001';

const lorebookCloseSymbol = document.createElement('span');
lorebookCloseSymbol.innerText = '✕';
lorebookCloseSymbol.style.color = '#FBFBFE';
lorebookCloseSymbol.style.fontSize = '14px';
lorebookCloseSymbol.style.fontWeight = '550';
lorebookCloseSymbol.style.transform = 'translateY(-1px) translateX(0.4px)';

lorebookCloseButton.appendChild(lorebookCloseSymbol);

lorebookCloseButton.addEventListener('mouseenter', () => {
  lorebookCloseButton.style.backgroundColor = '#676767';
});
lorebookCloseButton.addEventListener('mouseleave', () => {
  lorebookCloseButton.style.backgroundColor = 'transparent';
});
const closeLorebookPanel = () => {
  lorebookPanel.style.display = 'none';
  hideOverlay();
};
lorebookCloseButton.addEventListener('click', closeLorebookPanel);
lorebookPanel.appendChild(lorebookCloseButton);

// (Mobile) Show/Close Profiles button
const showProfilesButton = document.createElement('button');
showProfilesButton.innerText = 'Show Profiles';
showProfilesButton.style.padding = '8px';
showProfilesButton.style.border = '0.2px solid #4E4E4E';
showProfilesButton.style.backgroundColor = 'transparent';
showProfilesButton.style.color = '#fff';
showProfilesButton.style.borderRadius = '20px';
showProfilesButton.style.width = '90%';
showProfilesButton.style.cursor = 'pointer';
showProfilesButton.style.margin = '10px auto';
showProfilesButton.style.display = 'none'; // Hidden on desktop

showProfilesButton.onmouseover = () => {
  showProfilesButton.style.backgroundColor = '#424242';
};
showProfilesButton.onmouseout = () => {
  showProfilesButton.style.backgroundColor = 'transparent';
};

// (Mobile) Show/Close Profiles button
showProfilesButton.addEventListener('click', () => {
    const currentlyHidden = (lorebookProfilePanel.style.display === 'none');

    // Toggle the panel
    lorebookProfilePanel.style.display = currentlyHidden ? 'block' : 'none';

    // On mobile, replace the big heading's text
    if (isMobile()) {
        lorebookEntriesTitle.innerText = currentlyHidden
            ? 'Profiles' // when the list is visible
            : 'Manage Lorebook';
        // Hide the smaller label altogether on mobile
        profileslabel.style.display = 'none';
    }

    // Toggle button text
    showProfilesButton.innerText = currentlyHidden ? 'Close Profiles' : 'Show Profiles';

    // Toggle the close button for mobile
    if (isMobile()) {
        lorebookCloseButton.style.display =
            lorebookProfilePanel.style.display === 'block'
                ? 'none'
                : 'flex';
    }
});

// Open the Lorebook Panel
openLorebookButton.addEventListener('click', () => {
  lorebookPanel.style.display = lorebookPanel.style.display === 'none' ? 'block' : 'none';
  showOverlay();
  loadProfileEntries();
  updateLayout();
});

// Profiles Title
// -- PROFILES LABEL (the smaller text) --
    const profileslabel = document.createElement('h3');
    profileslabel.innerText = 'Profiles';
    profileslabel.style.color = '#ffffff';
    profileslabel.style.textAlign = 'center';
    profileslabel.style.marginBottom = '5px';
 //   profilesOverlay.appendChild(profilesTitleOverlay);

// Profile Management Panel
const lorebookProfilePanel = document.createElement('div');
lorebookProfilePanel.id = 'lorebookProfilePanel';
lorebookProfilePanel.style.float = 'left';
lorebookProfilePanel.style.width = '20%';
lorebookProfilePanel.style.borderRight = '0.5px solid #444444';
lorebookProfilePanel.style.height = '95%';

// Create the profile list container
const profileList = document.createElement('div');
profileList.id = 'profileList';
profileList.style.height = '95%';
profileList.style.color = 'white';
profileList.style.overflowY = 'auto';

// Add Profiles Button
    const addProfileButton = document.createElement('button');
    addProfileButton.textContent = 'Add Profile';
    addProfileButton.style.margin = '-59px auto';
//    addProfileButton.style.align = 'center';
    addProfileButton.style.marginLeft = '7px';
    addProfileButton.style.display = 'block';
    addProfileButton.style.padding = '10px';
    addProfileButton.style.border = CONFIG.BUTTON_OUTLINE;
    addProfileButton.style.width = '86%';
    addProfileButton.style.backgroundColor = 'transparent';
    addProfileButton.style.borderRadius = '60px';
    addProfileButton.style.cursor = 'pointer';

    addProfileButton.addEventListener('mouseenter', () => {
        addProfileButton.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
    });

    addProfileButton.addEventListener('mouseleave', () => {
        addProfileButton.style.backgroundColor = 'transparent';
    });



addProfileButton.addEventListener('click', () => {
  const profileName = prompt('Enter profile name:');
  if (profileName) {
    let lorebookEntries = getAllLorebookEntries();
    if (!lorebookEntries[profileName]) {
      lorebookEntries[profileName] = [];
      setAllLorebookEntries(lorebookEntries);
      loadProfiles();
    } else {
      alert('Profile already exists.');
    }
  }
});

/************************************************************
 * Profile Selection Functionality
 ************************************************************/
function loadProfiles() {
  profileList.innerHTML = '';
  let lorebookEntries = getAllLorebookEntries();

  Object.keys(lorebookEntries).forEach(profile => {
    // Entire item is clickable, text left-aligned
    const profileItem = document.createElement('div');
    profileItem.innerText = profile;
    profileItem.style.marginBottom = '5px';
    profileItem.style.cursor = 'pointer';
    profileItem.style.borderRadius = '5px';
    profileItem.style.width = '95%';
    profileItem.style.display = 'flex';               // ← make it a flex container
    profileItem.style.alignItems = 'center';          // center vertically
    profileItem.style.justifyContent = 'space-between'; // place removeButton on far right
    profileItem.style.textAlign = 'left';             // text at left
    // Highlight if selected
    profileItem.style.backgroundColor =
      profile === getCurrentProfile() ? '#424242' : '#2F2F2F';
    profileItem.style.padding = '5px 10px';

    // Click entire item to set current profile
    profileItem.addEventListener('click', () => {
      setCurrentProfile(profile);
      loadProfiles();
      loadProfileEntries();
    });




// Create the remove button
const removeButton = document.createElement('button');
removeButton.style.cssText = `
    color: #B4B4B4;
    background-color: transparent;
    cursor: pointer;
    border: none;
    font-size: 14px;
    padding: 0;
    outline: none; /* Optional: remove focus outline */
    display: flex; /* Optional: center-align the SVG */
    align-items: center; /* Optional: center-align the SVG */
`;

// Add the SVG icon for the button
removeButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" class="icon-sm">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="
                M10.5555 4 C10.099 4 9.70052 4.30906 9.58693 4.75114
                L9.29382 5.8919 H14.715 L14.4219 4.75114
                C14.3083 4.30906 13.9098 4 13.4533 4H10.5555
                M16.7799 5.8919 L16.3589 4.25342
                C16.0182 2.92719 14.8226 2 13.4533 2H10.5555
                C9.18616 2 7.99062 2.92719 7.64985 4.25342
                L7.22886 5.8919 H4
                C3.44772 5.8919 3 6.33961 3 6.8919
                C3 7.44418 3.44772 7.8919 4 7.8919H4.10069
                L5.31544 19.3172 C5.47763 20.8427 6.76455 22 8.29863 22H15.7014
                C17.2354 22 18.5224 20.8427 18.6846 19.3172 L19.8993 7.8919 H20
                C20.5523 7.8919 21 7.44418 21 6.8919
                C21 6.33961 20.5523 5.8919 20 5.8919H16.7799
                M17.888 7.8919 H6.11196 L7.30423 19.1057
                C7.3583 19.6142 7.78727 20 8.29863 20H15.7014
                C16.2127 20 16.6417 19.6142 16.6958 19.1057 L17.888 7.8919
                M10 10 C10.5523 10 11 10.4477 11 11V16
                C11 16.5523 10.5523 17 10 17
                C9.44772 17 9 16.5523 9 16V11
                C9 10.4477 9.44772 10 10 10
                M14 10 C14.5523 10 15 10.4477 15 11V16
                C15 16.5523 14.5523 17 14 17
                C13.4477 17 13 16.5523 13 16V11
                C13 10.4477 13.4477 10 14 10
            "
            fill="currentColor"/>
    </svg>
`;

// Add hover color change events
removeButton.addEventListener('mouseover', () => {
    removeButton.style.color = '#E3E3E3';
});

removeButton.addEventListener('mouseout', () => {
    removeButton.style.color = '#B4B4B4';
});

// Add click behavior to stop parent click from firing and trigger actions
removeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteProfile(profile); // Replace with your profile deletion logic
    loadProfiles();
    loadProfileEntries();
});

// Append remove button to the profile item
profileItem.appendChild(removeButton);

    profileList.appendChild(profileItem);
  });
}

/************************************************************
 * Lorebook Entries Title (will switch to "Profiles" on mobile)
 ************************************************************/
const lorebookEntriesTitle = document.createElement('h3');
lorebookEntriesTitle.innerText = 'Manage Lorebook';
lorebookEntriesTitle.style.fontWeight = '550';
lorebookEntriesTitle.style.color = '#ffffff';
lorebookEntriesTitle.style.textAlign = 'center';
lorebookEntriesTitle.style.fontSize = '24px';
lorebookEntriesTitle.style.marginTop = '10px';
lorebookEntriesTitle.style.position = 'relative';
//lorebookEntriesTitle.style.marginLeft = '40%';

lorebookEntriesTitle.style.marginBottom = '15px';

// -- [SEARCH BAR + SORT BUTTON] --
const controlBar = document.createElement('div');
//controlBar.style.display = 'flex';
//controlBar.style.gap = '10px';
//controlBar.style.alignItems = 'center';
controlBar.style.marginLeft = '25%';
controlBar.style.marginBottom = '5px';
controlBar.style.width = '100%';

// Search Input
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search entries...';
searchInput.style.width = '200px';
searchInput.style.padding = '8px';
searchInput.style.border = '1px solid #444444';
searchInput.style.borderRadius = '8px';
searchInput.style.backgroundColor = '#1e1e1e';
searchInput.style.color = '#dddddd';

// Trigger loadProfileEntries() whenever user types
searchInput.addEventListener('input', () => {
  loadProfileEntries();
});

// Sort Button
let sortAlphabetical = false;
const sortButton = document.createElement('button');
sortButton.innerText = 'Sort: Date';
sortButton.style.padding = '8px 15px';
sortButton.style.border = '0.2px solid #4E4E4E';
sortButton.style.backgroundColor = 'transparent';
sortButton.style.color = '#fff';
sortButton.style.borderRadius = '20px';
sortButton.style.cursor = 'pointer';
sortButton.style.marginLeft = '5px';

sortButton.addEventListener('click', () => {
  sortAlphabetical = !sortAlphabetical;
  sortButton.innerText = sortAlphabetical ? 'Sort: A-Z' : 'Sort: Date';
  loadProfileEntries();
});

controlBar.appendChild(searchInput);
controlBar.appendChild(sortButton);

// Profile Entries List
const profileEntriesList = document.createElement('div');
profileEntriesList.id = 'profileEntriesList';
profileEntriesList.style.marginTop = '20px';
profileEntriesList.style.overflowY = 'auto';

// Header for Inputs
const entrieslabel = document.createElement('div');
entrieslabel.textContent = 'Enter keys and description:';
entrieslabel.style.color = '#dddddd';
entrieslabel.style.fontSize = '14px';
entrieslabel.style.marginBottom = '5px';
entrieslabel.style.marginTop = '5px';
entrieslabel.style.marginLeft = '23%';

// Create key-value input fields
const inputContainer = document.createElement('div');
inputContainer.id = 'inputContainer';
inputContainer.style.marginTop = '10px';
inputContainer.style.display = 'flex';
inputContainer.style.flexDirection = 'column';
inputContainer.style.alignItems = 'center';
inputContainer.style.margin = '0 auto';

const lorebookKeyInput = document.createElement('input');
lorebookKeyInput.type = 'text';
lorebookKeyInput.placeholder = 'Entry Keywords (comma-separated)';
lorebookKeyInput.style.width = '90%';
lorebookKeyInput.style.marginBottom = '5px';
lorebookKeyInput.style.padding = '10px';
lorebookKeyInput.style.border = '1px solid #444444';
lorebookKeyInput.style.borderRadius = '8px';
lorebookKeyInput.style.backgroundColor = '#1e1e1e';
lorebookKeyInput.style.color = '#dddddd';

const lorebookValueInput = document.createElement('textarea');
lorebookValueInput.placeholder = ' ';
lorebookValueInput.style.width = '90%';
lorebookValueInput.style.marginBottom = '5px';
lorebookValueInput.style.padding = '10px';
lorebookValueInput.style.border = '1px solid #444444';
lorebookValueInput.style.borderRadius = '8px';
lorebookValueInput.style.backgroundColor = '#1e1e1e';
lorebookValueInput.style.color = '#dddddd';
lorebookValueInput.style.height = '100px';
lorebookValueInput.style.resize = 'vertical';
lorebookValueInput.maxLength = 1000;
lorebookValueInput.style.overflow = 'auto';

const charCounter = document.createElement('div');
charCounter.style.color = '#dddddd';
charCounter.style.fontSize = '12px';
charCounter.style.marginTop = '0px';
charCounter.style.marginBottom = '15px';
charCounter.style.textAlign = 'right';
charCounter.style.marginRight = '-87%';
charCounter.style.color = 'grey';
charCounter.textContent = `0/${lorebookValueInput.maxLength}`;

lorebookValueInput.addEventListener('input', () => {
  charCounter.textContent = `${lorebookValueInput.value.length}/${lorebookValueInput.maxLength}`;
});

// Save Entry button, also important for editing
const lorebookSaveButton = document.createElement('button');
lorebookSaveButton.innerText = 'Add Entry';
lorebookSaveButton.style.padding = '10px 20px';
lorebookSaveButton.style.border = '0.2px solid #4E4E4E';
lorebookSaveButton.style.backgroundColor = '#2F2F2F';
lorebookSaveButton.style.color = '#fff';
lorebookSaveButton.style.borderRadius = '50px';
lorebookSaveButton.style.cursor = 'pointer';
lorebookSaveButton.style.width = '95%';

    lorebookSaveButton.addEventListener('mouseenter', () => {
        lorebookSaveButton.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
    });

    lorebookSaveButton.addEventListener('mouseleave', () => {
        lorebookSaveButton.style.backgroundColor = 'transparent';
    });



// DOM structure
lorebookPanel.appendChild(lorebookEntriesTitle);
lorebookPanel.appendChild(showProfilesButton);
lorebookPanel.appendChild(lorebookProfilePanel);
lorebookProfilePanel.appendChild(profileslabel);
lorebookProfilePanel.appendChild(profileList);
lorebookProfilePanel.appendChild(addProfileButton);
lorebookPanel.appendChild(controlBar);
lorebookPanel.appendChild(profileEntriesList);
lorebookPanel.appendChild(entrieslabel);
lorebookPanel.appendChild(inputContainer);
inputContainer.appendChild(lorebookKeyInput);
inputContainer.appendChild(lorebookValueInput);
inputContainer.appendChild(charCounter);
inputContainer.appendChild(lorebookSaveButton);


    let isEditing = false;
    let editingIndex = -1; // We'll track the array index if editing

    lorebookSaveButton.addEventListener('click', () => {
        const rawKey = lorebookKeyInput.value.trim().toLowerCase();
        const value = lorebookValueInput.value;
        const currentProfile = getCurrentProfile();

        if (!currentProfile) {
            alert('Please select a profile.');
            return;
        }

        if (!rawKey) {
            alert('Please enter a key for the entry.');
            return;
        }

        const newKeySet = parseKeyToSet(rawKey);

        let lorebookEntries = getAllLorebookEntries();
        if (!lorebookEntries[currentProfile]) {
            lorebookEntries[currentProfile] = [];
        }

        if (!canAddKey(newKeySet, lorebookEntries[currentProfile], isEditing, editingIndex)) {
            return;
        }

        const newEntry = `<[Lorebook: ${rawKey}] ${value}>`;

        if (isEditing && editingIndex >= 0) {
            lorebookEntries[currentProfile][editingIndex] = newEntry;
            isEditing = false;
            editingIndex = -1;
        } else {
            lorebookEntries[currentProfile].push(newEntry);
        }

        setAllLorebookEntries(lorebookEntries);

        // Reset form
        lorebookKeyInput.value = '';
        lorebookValueInput.value = '';
        charCounter.textContent = `0/${lorebookValueInput.maxLength}`;
        loadProfileEntries();
    });

    // Modified loadProfileEntries to support searching + sorting
    function loadProfileEntries() {
        profileEntriesList.innerHTML = '';
        profileEntriesList.style.display = 'flex';
        profileEntriesList.style.flexDirection = 'column';
        profileEntriesList.style.alignItems = 'center';
        profileEntriesList.style.margin = '0 auto';

        const currentProfile = getCurrentProfile();
        if (!currentProfile) return;

        let lorebookEntries = getAllLorebookEntries();
        let entriesArray = lorebookEntries[currentProfile] || [];

        // Filter by search query
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            entriesArray = entriesArray.filter(entry =>
                entry.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortAlphabetical) {
            // We'll sort by the key portion if we can parse it, fallback to the full string
            entriesArray.sort((a, b) => {
                const aMatch = a.match(/^<\[Lorebook:\s*(.*?)\]\s*(.*?)>$/);
                const bMatch = b.match(/^<\[Lorebook:\s*(.*?)\]\s*(.*?)>$/);

                let aKey = aMatch ? aMatch[1] : a;
                let bKey = bMatch ? bMatch[1] : b;
                return aKey.localeCompare(bKey);
            });
        }
        // Else default is the chronological order in localStorage

        entriesArray.forEach((entry) => {
            const entryItem = document.createElement('div');
            entryItem.style.padding = '10px';
            entryItem.style.marginBottom = '12px';
            entryItem.style.borderRadius = '8px';
            entryItem.style.backgroundColor = '#424242';
            entryItem.style.position = 'relative';
            entryItem.style.color = 'white';
            entryItem.style.flexDirection = 'column';
            entryItem.style.width = '90%';

            let matched = entry.match(/^<\[Lorebook:\s*(.*?)\]\s*([\s\S]*?)>$/);

            let keyPart = '';
            let textPart = '';
            if (matched) {
                keyPart = matched[1];
                textPart = matched[2];
            }

            const keyElement = document.createElement('div');
            keyElement.innerText = keyPart;
            keyElement.style.fontWeight = 'bold';
            keyElement.style.marginBottom = '10px';
            entryItem.appendChild(keyElement);

            const valueElement = document.createElement('div');
            valueElement.innerText = textPart;
            entryItem.appendChild(valueElement);

            entryItem.addEventListener('click', () => {
                lorebookKeyInput.value = keyPart;
                lorebookValueInput.value = textPart;
                charCounter.textContent = `${textPart.length}/${lorebookValueInput.maxLength}`;
                isEditing = true;
                editingIndex = findFullIndexInStorage(entry);
            });

// Create button
const removeButton = document.createElement('button');
removeButton.style.cssText = `
    color: #B4B4B4;
    background-color: transparent;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;       /* optional: remove default button border */
    outline: none;      /* optional: remove focus outline */
    padding: 0;         /* optional: remove default button padding */
`;

// Insert the same SVG icon you used in deleteButton
removeButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" class="icon-sm">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="
                M10.5555 4 C10.099 4 9.70052 4.30906 9.58693 4.75114
                L9.29382 5.8919 H14.715 L14.4219 4.75114
                C14.3083 4.30906 13.9098 4 13.4533 4H10.5555
                M16.7799 5.8919 L16.3589 4.25342
                C16.0182 2.92719 14.8226 2 13.4533 2H10.5555
                C9.18616 2 7.99062 2.92719 7.64985 4.25342
                L7.22886 5.8919 H4
                C3.44772 5.8919 3 6.33961 3 6.8919
                C3 7.44418 3.44772 7.8919 4 7.8919H4.10069
                L5.31544 19.3172 C5.47763 20.8427 6.76455 22 8.29863 22H15.7014
                C17.2354 22 18.5224 20.8427 18.6846 19.3172 L19.8993 7.8919 H20
                C20.5523 7.8919 21 7.44418 21 6.8919
                C21 6.33961 20.5523 5.8919 20 5.8919H16.7799
                M17.888 7.8919 H6.11196 L7.30423 19.1057
                C7.3583 19.6142 7.78727 20 8.29863 20H15.7014
                C16.2127 20 16.6417 19.6142 16.6958 19.1057 L17.888 7.8919
                M10 10 C10.5523 10 11 10.4477 11 11V16
                C11 16.5523 10.5523 17 10 17
                C9.44772 17 9 16.5523 9 16V11
                C9 10.4477 9.44772 10 10 10
                M14 10 C14.5523 10 15 10.4477 15 11V16
                C15 16.5523 14.5523 17 14 17
                C13.4477 17 13 16.5523 13 16V11
                C13 10.4477 13.4477 10 14 10
            "
            fill="currentColor"/>
    </svg>
`;

// Add hover color change events
removeButton.addEventListener('mouseover', () => {
  removeButton.style.color = '#E3E3E3';
});

removeButton.addEventListener('mouseout', () => {
  removeButton.style.color = '#B4B4B4';
});

// Add click behavior
removeButton.addEventListener('click', (event) => {
  event.stopPropagation();
  removeEntry(currentProfile, entry);
});

// Append to your entry item
entryItem.appendChild(removeButton);

            entryItem.appendChild(removeButton);
            profileEntriesList.appendChild(entryItem);
        });
    }

    // Because we filter/sort entries before display, find the real index in localStorage
    function findFullIndexInStorage(entryString) {
        const currentProfile = getCurrentProfile();
        let lorebookEntries = getAllLorebookEntries();
        let entriesArray = lorebookEntries[currentProfile] || [];
        return entriesArray.findIndex(e => e === entryString);
    }

    function removeEntry(profileName, entryString) {
        let lorebookEntries = getAllLorebookEntries();
        if (!lorebookEntries[profileName]) return;
        let arr = lorebookEntries[profileName];
        const realIndex = arr.findIndex(e => e === entryString);
        if (realIndex >= 0) {
            arr.splice(realIndex, 1);
            lorebookEntries[profileName] = arr;
            setAllLorebookEntries(lorebookEntries);
            loadProfileEntries();
        }
    }

    function getAllLorebookEntries() {
        let data = localStorage.getItem('lorebookEntries');
        if (!data) {
            return {};
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Error parsing lorebookEntries:', e);
            return {};
        }
    }

    function setAllLorebookEntries(lorebookEntries) {
        localStorage.setItem('lorebookEntries', JSON.stringify(lorebookEntries));
    }

    function deleteProfile(profileName) {
        let lorebookEntries = getAllLorebookEntries();
        if (lorebookEntries.hasOwnProperty(profileName)) {
            delete lorebookEntries[profileName];
            setAllLorebookEntries(lorebookEntries);
            if (getCurrentProfile() === profileName) {
                localStorage.removeItem('selectedProfile.lorebook');
            }
        }
    }

    function getCurrentProfile() {
        const selectedProfile = localStorage.getItem('selectedProfile.lorebook');
        return selectedProfile ? selectedProfile : null;
    }

    function setCurrentProfile(profileName) {
        localStorage.setItem('selectedProfile.lorebook', profileName);
    }

    function parseKeyToSet(keyString) {
        return new Set(
            keyString
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)
        );
    }

    function canAddKey(newKeySet, allEntries, isEditing, editingIndex) {
        for (let i = 0; i < allEntries.length; i++) {
            if (isEditing && i === editingIndex) continue;
            const match = allEntries[i].match(/^<\[Lorebook:\s*(.*?)\]\s*(.*?)>$/);
            if (!match) continue;

            const existingKeyString = match[1];
            const existingKeySet = parseKeyToSet(existingKeyString);

            // Check for exact match
            if (setsAreEqual(newKeySet, existingKeySet)) {
                alert(`Key "${existingKeyString}" already exists for this profile.`);
                return false;
            }
            // Check for subset or superset conflict
            if (isSubset(newKeySet, existingKeySet) || isSubset(existingKeySet, newKeySet)) {
                alert(`Key "${existingKeyString}" is in conflict (subset/superset) with the new key.`);
                return false;
            }
        }
        return true;
    }

    function setsAreEqual(a, b) {
        if (a.size !== b.size) return false;
        for (let val of a) {
            if (!b.has(val)) return false;
        }
        return true;
    }

    function isSubset(smallerSet, biggerSet) {
        for (let val of smallerSet) {
            if (!biggerSet.has(val)) return false;
        }
        return true;
    }

    // This function adjusts layout on resize or after toggling



// updateLayout() - handle mobile vs desktop
function updateLayout() {
    if (isMobile()) {
        // MOBILE LAYOUT
        lorebookPanel.style.width = '90%';
        lorebookPanel.style.height = '90%';

        lorebookProfilePanel.style.display = 'none'; // hidden by default
        lorebookProfilePanel.style.width = '100%';
        lorebookProfilePanel.style.borderRight = 'none';
        lorebookProfilePanel.style.flexDirection = 'column';
        lorebookProfilePanel.style.alignItems = 'center';
        lorebookProfilePanel.style.justifyContent = 'start';
        lorebookProfilePanel.style.textAlign = 'center';
        lorebookProfilePanel.style.marginTop = '0px';
        lorebookProfilePanel.style.marginLeft = '2.5%';

        entrieslabel.style.marginLeft = '5%';
        controlBar.style.marginLeft = '5%';
        addProfileButton.style.marginLeft = '0px';
        profileList.style.height = '90%';
        addProfileButton.style.width = '95%';
        charCounter.style.marginRight = '-80%';

        // Always hide the smaller label on mobile
        profileslabel.style.display = 'none';

        // This sets the big title back to "Manage Lorebook"
        // until the user opens profiles
        lorebookEntriesTitle.innerText = 'Manage Lorebook';

        showProfilesButton.style.display = 'block';
        showProfilesButton.style.margin = '10px auto';


        if (lorebookProfilePanel.style.display === 'none') {
            lorebookCloseButton.style.display = 'flex';
        }

        // --- BLUNT “5% STEPS” LOGIC ---
        // Grab the current panel height
        //   (the actual offsetHeight of the container
        //    or you could compare window.innerHeight, etc.)
    const panelHeight = lorebookPanel.offsetHeight;
    let entriesPercent = 10;

    if (panelHeight >= 500 && panelHeight < 600) {
        entriesPercent = 15;
    } else if (panelHeight >= 600 && panelHeight < 650) {
        entriesPercent = 20;
    } else if (panelHeight >= 650 && panelHeight < 700) {
        entriesPercent = 30;
    } else if (panelHeight >= 700 && panelHeight < 750) {
        entriesPercent = 35;
    } else if (panelHeight >= 750 && panelHeight < 800) {
        entriesPercent = 40; // Could be higher than initial 30
    } else if (panelHeight >= 800 && panelHeight < 850) {
        entriesPercent = 44;
    } else if (panelHeight >= 850 && panelHeight < 900) {
        entriesPercent = 48;
    } else if (panelHeight >= 900) {
        entriesPercent = 52;
    }

    profileEntriesList.style.height = entriesPercent + '%';

    } else {
        // DESKTOP LAYOUT
        lorebookPanel.style.width = '1000px';
        lorebookPanel.style.height = '700px';

        lorebookProfilePanel.style.display = 'block';
        lorebookProfilePanel.style.width = '20%';
        lorebookProfilePanel.style.borderRight = '0.5px solid #444444';
        lorebookProfilePanel.style.marginTop = '-40px';
        lorebookProfilePanel.style.marginLeft = '0px';

        // Show the smaller label on desktop only
        profileslabel.style.display = 'block';

        lorebookEntriesTitle.innerText = 'Manage Lorebook';
        profileList.style.height = '95%';
        addProfileButton.style.width = '86%';
        addProfileButton.style.marginLeft = '7px';

        showProfilesButton.style.display = 'none';
        lorebookCloseButton.style.display = 'flex';

        entrieslabel.style.marginLeft = '24%';
        controlBar.style.marginLeft = '24%';
        profileEntriesList.style.height = '285px';
        charCounter.style.marginRight = '-87%';
    }
}

    // Listen for window resize
    window.addEventListener('resize', updateLayout);

    // Initial load
    loadProfiles();
}


// ==================================================================== RULES ====================================================================

function rulesScript() {
    // Profiles object structure: { profileName: [arrayOfRules], ... }
    let profiles = {};
    let currentProfile = null;
    let customRules = [];
    let currentIndex = 0;

    // Load profiles from localStorage
    const storedRulesProfiles = localStorage.getItem('rulesProfiles');
    if (storedRulesProfiles) {
        profiles = JSON.parse(storedRulesProfiles);
    }

    // Check if there's a previously selected profile stored
   const selectedProfileRules = localStorage.getItem('selectedProfile.Rules');

    if (Object.keys(profiles).length === 0) {
        // If no profiles exist, create a default one
        profiles['Default'] = [];
        saveProfiles();
        currentProfile = 'Default';
    } else {
        // If we have a stored selected profile, use that; otherwise use first available
        if (selectedProfileRules && profiles[selectedProfileRules]) {
            currentProfile = selectedProfileRules;
        } else {
            currentProfile = Object.keys(profiles)[0];
        }
    }

    // Sync customRules with currently selected profile
    loadProfileRules(currentProfile);

    function loadProfileRules(profileName) {
        currentProfile = profileName;
        customRules = profiles[currentProfile] || [];
        // Save the selected profile so it's sticky across sessions
        localStorage.setItem('selectedProfile.Rules', currentProfile);
    }

    function saveProfiles() {
        localStorage.setItem('rulesProfiles', JSON.stringify(profiles));
    }


    // Create Button and Panel UI for Local Storage Key Management
    window.manageRulesButton = document.createElement('div');
    window.manageRulesButton.innerHTML = `
        <button id="toggle-rules-panel"
            style="
                position: relative;
                top: 10px;
                right: 0px;
                left: 10px;
                padding: 7px 15px;
                background: transparent;
                color: #b0b0b0;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                text-align: left;
                cursor: pointer;
                width: 90%;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background-color 0.1s, color 0.1s;
                z-index: 1001;">
            <svg fill="#B0B0B0" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px"
                 viewBox="0 0 492.508 492.508" xml:space="preserve"
                 style="padding-right: 0px; margin-left: 1px;">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <g>
                            <path d="M199.493,402.145c0-10.141-8.221-18.361-18.36-18.361H42.475c-10.139,0-18.36,8.221-18.36,18.361
                                c0,3.195,0.818,6.199,2.255,8.816H0v38.067h223.607v-38.067h-26.369C198.674,408.343,199.493,405.34,199.493,402.145z">
                            </path>
                            <path d="M175.898,88.224l117.157,74.396c9.111,4.643,20.43,1.678,26.021-7.129l5.622-8.85
                                c5.938-9.354,3.171-21.75-6.182-27.69L204.592,46.608c-9.352-5.939-21.748-3.172-27.688,6.182l-5.622,8.851
                                C165.692,70.447,167.82,81.952,175.898,88.224z">
                            </path>
                            <path d="M492.456,372.433l-0.082-1.771l-0.146-1.672c-0.075-1.143-0.235-2.159-0.375-3.204c-0.562-4.177-1.521-7.731-2.693-10.946
                                c-2.377-6.386-5.738-11.222-9.866-14.845c-1.027-0.913-2.126-1.714-3.218-2.528l-3.271-2.443
                                c-2.172-1.643-4.387-3.218-6.587-4.815c-2.196-1.606-4.419-3.169-6.644-4.729c-2.218-1.571-4.445-3.125-6.691-4.651
                                c-4.468-3.089-8.983-6.101-13.51-9.103l-6.812-4.464l-6.85-4.405c-4.58-2.911-9.167-5.813-13.785-8.667
                                c-4.611-2.865-9.24-5.703-13.896-8.496l-13.979-8.363l-14.072-8.22l-14.149-8.096l-14.219-7.987l-14.287-7.882l-14.354-7.773
                                c-4.802-2.566-9.599-5.137-14.433-7.653c-4.822-2.529-9.641-5.071-14.498-7.548l-4.398,6.928l-22.17-10.449l24.781-39.026
                                l-117.156-74.395l-60.944,95.974l117.157,74.395l24.781-39.026l18.887,15.622l-4.399,6.929c4.309,3.343,8.657,6.619,12.998,9.91
                                c4.331,3.305,8.698,6.553,13.062,9.808l13.14,9.686l13.211,9.577l13.275,9.474l13.346,9.361l13.422,9.242l13.514,9.095
                                c4.51,3.026,9.045,6.009,13.602,8.964c4.547,2.967,9.123,5.882,13.707,8.792l6.898,4.324l6.936,4.266
                                c4.643,2.818,9.289,5.625,13.985,8.357c2.337,1.383,4.689,2.739,7.055,4.078c2.358,1.349,4.719,2.697,7.106,4
                                c2.383,1.312,4.75,2.646,7.159,3.912l3.603,1.922c1.201,0.64,2.394,1.296,3.657,1.837c5.036,2.194,10.841,3.18,17.63,2.614
                                c3.409-0.305,7.034-0.949,11.054-2.216c1.006-0.317,1.992-0.606,3.061-1.023l1.574-0.58l1.639-0.68
                                c2.185-0.91,4.523-2.063,7.059-3.522C492.513,377.405,492.561,374.799,492.456,372.433z">
                            </path>
                            <path d="M67.897,261.877l113.922,72.341c9.354,5.938,21.75,3.172,27.689-6.181l5.621-8.852
                                c5.592-8.808,3.462-20.311-4.615-26.583L93.358,218.207c-9.111-4.642-20.43-1.678-26.022,7.13l-5.62,8.85
                                C55.775,243.541,58.543,255.938,67.897,261.877z">
                            </path>
                        </g>
                    </g>
                </g>
            </svg>
            Manage Rules
        </button>
    `;
    const rulesButtonElement = manageRulesButton.querySelector('button');
    rulesButtonElement.onmouseover = () => {
        rulesButtonElement.style.backgroundColor = '#212121';
        rulesButtonElement.style.color = '#ffffff';
    };
    rulesButtonElement.onmouseout = () => {
        rulesButtonElement.style.backgroundColor = 'transparent';
        rulesButtonElement.style.color = '#b0b0b0';
    };

    const rulesPanel = document.createElement('div');
    rulesPanel.style.position = 'fixed';
    rulesPanel.style.top = '50%';
    rulesPanel.style.left = '50%';
    rulesPanel.style.transform = 'translate(-50%, -50%)';
    rulesPanel.style.zIndex = 1000;
    rulesPanel.style.backgroundColor = '#2f2f2f';
    rulesPanel.style.padding = '20px';
    rulesPanel.style.borderRadius = '20px';
    rulesPanel.style.display = 'none';
    document.body.appendChild(rulesPanel);

    const isMobile = () => window.innerWidth <= 768;

    const rulesTitle = document.createElement('h2');
    rulesTitle.innerText = 'Manage Rules';
    rulesTitle.style.textAlign = 'center';
    rulesTitle.style.color = '#ffffff';
    rulesTitle.style.fontSize = '24px';
    rulesTitle.style.fontWeight = '550';
    rulesTitle.style.marginBottom = '20px';
    rulesPanel.appendChild(rulesTitle);

    const rulesCloseButton = document.createElement('button');
    rulesCloseButton.style.position = 'absolute';
    rulesCloseButton.style.borderRadius = '50%';
    rulesCloseButton.style.top = '20px';
    rulesCloseButton.style.right = '20px';
    rulesCloseButton.style.backgroundColor = 'transparent';
    rulesCloseButton.style.cursor = 'pointer';
    rulesCloseButton.style.width = '32px';
    rulesCloseButton.style.height = '32px';
    rulesCloseButton.style.display = 'flex';
    rulesCloseButton.style.alignItems = 'center';
    rulesCloseButton.style.justifyContent = 'center';

    const rulesCloseSymbol = document.createElement('span');
    rulesCloseSymbol.innerText = '✕';
    rulesCloseSymbol.style.color = '#FBFBFE';
    rulesCloseSymbol.style.fontSize = '14px';
    rulesCloseSymbol.style.fontWeight = '550';
    rulesCloseSymbol.style.transform = 'translateY(-1px) translateX(0.4px)';

    rulesCloseButton.appendChild(rulesCloseSymbol);

    rulesCloseButton.addEventListener('mouseenter', () => {
        rulesCloseButton.style.backgroundColor = '#676767';
    });

    rulesCloseButton.addEventListener('mouseleave', () => {
        rulesCloseButton.style.backgroundColor = 'transparent';
    });

    const closeRulesPanel = () => {
        rulesPanel.style.display = 'none';
        hideOverlay();
    };

    rulesCloseButton.addEventListener('click', closeRulesPanel);
    rulesPanel.appendChild(rulesCloseButton);

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = 'calc(100% - 60px)';
    container.style.gap = '20px';
    rulesPanel.appendChild(container);

    // Mobile: show/hide profile panel functionality
    const profilesOverlay = document.createElement('div');
    profilesOverlay.style.position = 'absolute';
    profilesOverlay.style.top = '0';
    profilesOverlay.style.left = '0';
    profilesOverlay.style.width = '100%';
    profilesOverlay.style.height = '100%';
    profilesOverlay.style.backgroundColor = '#2f2f2f';
//    profilesOverlay.style.padding = '20px';
    profilesOverlay.style.display = 'none';
    profilesOverlay.style.zIndex = 1100;
    profilesOverlay.style.borderRadius = '20px';
    profilesOverlay.style.flexDirection = 'column';
    profilesOverlay.style.overflowY = 'auto';
    rulesPanel.appendChild(profilesOverlay);

    const profilesTitleOverlay = document.createElement('h3');
    profilesTitleOverlay.innerText = 'Profiles';
    profilesTitleOverlay.style.color = '#ffffff';
    profilesTitleOverlay.style.textAlign = 'center';
    profilesOverlay.appendChild(profilesTitleOverlay);

    const profilesCloseOverlay = document.createElement('button');
    profilesCloseOverlay.innerText = 'Close';
    profilesCloseOverlay.style.margin = '10px auto';
    profilesCloseOverlay.style.display = 'block';
    profilesCloseOverlay.style.padding = '10px';
    profilesCloseOverlay.style.width = '90%';
    profilesCloseOverlay.style.backgroundColor = 'transparent';
    profilesCloseOverlay.style.color = '#ffffff';
    profilesCloseOverlay.style.border = '1px solid #444';
    profilesCloseOverlay.style.borderRadius = '50px';
    profilesCloseOverlay.style.cursor = 'pointer';
    profilesCloseOverlay.addEventListener('mouseenter', () => {
        profilesCloseOverlay.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
    });

    profilesCloseOverlay.addEventListener('mouseleave', () => {
        profilesCloseOverlay.style.backgroundColor = 'transparent';
    });


    profilesCloseOverlay.addEventListener('click', () => {
        profilesOverlay.style.display = 'none';
    });
    profilesOverlay.appendChild(profilesCloseOverlay);

    const profilesListOverlay = document.createElement('div');
    profilesListOverlay.style.flex = '1';
    profilesListOverlay.style.overflowY = 'auto';
    profilesOverlay.appendChild(profilesListOverlay);

    const addProfileButtonOverlay = document.createElement('button');
    addProfileButtonOverlay.textContent = 'Add Profile';
    addProfileButtonOverlay.style.margin = '10px auto';
    addProfileButtonOverlay.style.display = 'block';
    addProfileButtonOverlay.style.padding = '10px';
    addProfileButtonOverlay.style.border = CONFIG.BUTTON_OUTLINE;
    addProfileButtonOverlay.style.width = '90%';
    addProfileButtonOverlay.style.backgroundColor = 'transparent';
    addProfileButtonOverlay.style.borderRadius = '50px';
    addProfileButtonOverlay.style.cursor = 'pointer';

    addProfileButtonOverlay.addEventListener('mouseenter', () => {
        addProfileButtonOverlay.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
    });

    addProfileButtonOverlay.addEventListener('mouseleave', () => {
        addProfileButtonOverlay.style.backgroundColor = 'transparent';
    });

    addProfileButtonOverlay.addEventListener('click', () => {
        const newProfileName = prompt('Enter Profile Name:');
        if (newProfileName && !profiles[newProfileName]) {
            profiles[newProfileName] = [];
            saveProfiles();
            renderProfilesList();
        }
    });
    profilesOverlay.appendChild(addProfileButtonOverlay);

    // Left side (profiles)
    const profilesContainer = document.createElement('div');
    profilesContainer.style.width = '21.5%';
    // profilesContainer.style.backgroundColor = '#1E1E1E';
    profilesContainer.style.borderRight = '1px solid #444444'; // Added border width, style, and color
    profilesContainer.style.marginLeft = '-20px';
    profilesContainer.style.display = 'flex';
    profilesContainer.style.flexDirection = 'column';
    profilesContainer.style.marginTop = '-4.7%';
    profilesContainer.style.padding = '10px';
    profilesContainer.style.overflowY = 'auto';


    const profilesTitle = document.createElement('h3');
    profilesTitle.innerText = 'Profiles';
    profilesTitle.style.color = '#ffffff';
    profilesTitle.style.textAlign = 'center';
    profilesContainer.appendChild(profilesTitle);

    const profilesList = document.createElement('div');
    profilesList.style.flex = '1';
    profilesList.style.overflowY = 'auto';
    profilesContainer.appendChild(profilesList);

    const addProfileButton = document.createElement('button');
    addProfileButton.textContent = 'Add Profile';
    addProfileButton.style.margin = '10px auto';
    addProfileButton.style.display = 'block';
    addProfileButton.style.padding = '10px';
    addProfileButton.style.border = CONFIG.BUTTON_OUTLINE;
    addProfileButton.style.width = '90%';
    addProfileButton.style.backgroundColor = 'transparent';
    addProfileButton.style.borderRadius = '50px';
    addProfileButton.style.cursor = 'pointer';

    addProfileButton.addEventListener('mouseenter', () => {
        addProfileButton.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
    });

    addProfileButton.addEventListener('mouseleave', () => {
        addProfileButton.style.backgroundColor = 'transparent';
    });

    addProfileButton.addEventListener('click', () => {
        const newProfileName = prompt('Enter Profile Name:');
        if (newProfileName && !profiles[newProfileName]) {
            profiles[newProfileName] = [];
            saveProfiles();
            renderProfilesList();
        }
    });
    profilesContainer.appendChild(addProfileButton);

    // A button to toggle profiles overlay in mobile view
    const toggleProfilesButton = document.createElement('button');
    toggleProfilesButton.innerText = 'Show Profiles';
    toggleProfilesButton.style.display = 'none';
    toggleProfilesButton.style.margin = '10px auto';
    toggleProfilesButton.style.padding = '10px';
    toggleProfilesButton.style.border = 'none';
    toggleProfilesButton.style.width = '90%';
    toggleProfilesButton.style.border = CONFIG.BUTTON_OUTLINE;
    toggleProfilesButton.style.backgroundColor = 'transparent';
    toggleProfilesButton.style.borderRadius = '50px';
    toggleProfilesButton.style.cursor = 'pointer';
    toggleProfilesButton.addEventListener('mouseenter', () => {
        toggleProfilesButton.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
    });

    toggleProfilesButton.addEventListener('mouseleave', () => {
        toggleProfilesButton.style.backgroundColor = 'transparent';
    });

    toggleProfilesButton.addEventListener('click', () => {
        profilesOverlay.style.display = 'flex';
        renderProfilesList(); // Update list in overlay
    });

    rulesPanel.insertBefore(toggleProfilesButton, container);

    function renderProfilesList() {
        // Decide whether to render in overlay or side panel
        const targetList = isMobile() ? profilesListOverlay : profilesList;
        targetList.innerHTML = '';

        Object.keys(profiles).forEach(profileName => {
            const profileItem = document.createElement('div');
            profileItem.style.display = 'flex';
            profileItem.style.justifyContent = 'space-between';
            profileItem.style.alignItems = 'center';
            profileItem.style.backgroundColor = profileName === currentProfile ? '#424242' : 'transparent';
            profileItem.style.color = '#ffffff';
            profileItem.style.padding = '5px 10px';
            profileItem.style.borderRadius = '5px';
            profileItem.style.marginBottom = '5px';
            profileItem.style.cursor = 'pointer';

            const nameSpan = document.createElement('span');
            nameSpan.innerText = profileName;
            nameSpan.style.flex = '1';
            profileItem.appendChild(nameSpan);

            profileItem.addEventListener('click', () => {
                loadProfileRules(profileName);
                if (isMobile()) {
                    profilesOverlay.style.display = 'none';
                }
                renderProfilesList();
                renderPanel();
            });

            // Delete button for the profile
            if (profileName !== 'Default') {
                const deleteButton = document.createElement('button');

deleteButton.style.cssText = 'color: #B4B4B4; background-color: transparent; cursor: pointer;';
deleteButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="
                M10.5555 4 C10.099 4 9.70052 4.30906 9.58693 4.75114 L9.29382 5.8919 H14.715 L14.4219 4.75114 C14.3083 4.30906 13.9098 4 13.4533 4H10.5555
                M16.7799 5.8919 L16.3589 4.25342 C16.0182 2.92719 14.8226 2 13.4533 2H10.5555 C9.18616 2 7.99062 2.92719 7.64985 4.25342 L7.22886 5.8919 H4
                C3.44772 5.8919 3 6.33961 3 6.8919 C3 7.44418 3.44772 7.8919 4 7.8919H4.10069 L5.31544 19.3172 C5.47763 20.8427 6.76455 22 8.29863 22H15.7014
                C17.2354 22 18.5224 20.8427 18.6846 19.3172 L19.8993 7.8919 H20 C20.5523 7.8919 21 7.44418 21 6.8919 C21 6.33961 20.5523 5.8919 20 5.8919H16.7799
                M17.888 7.8919 H6.11196 L7.30423 19.1057 C7.3583 19.6142 7.78727 20 8.29863 20H15.7014 C16.2127 20 16.6417 19.6142 16.6958 19.1057 L17.888 7.8919
                M10 10 C10.5523 10 11 10.4477 11 11V16 C11 16.5523 10.5523 17 10 17 C9.44772 17 9 16.5523 9 16V11 C9 10.4477 9.44772 10 10 10 M14 10
                C14.5523 10 15 10.4477 15 11V16 C15 16.5523 14.5523 17 14 17 C13.4477 17 13 16.5523 13 16V11 C13 10.4477 13.4477 10 14 10
            "
            fill="currentColor"/>
    </svg>
`;


deleteButton.addEventListener('mouseover', () => {
    deleteButton.style.color = '#E3E3E3';
});

deleteButton.addEventListener('mouseout', () => {
    deleteButton.style.color = '#B4B4B4';
});



                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (confirm(`Delete profile "${profileName}"?`)) {
                        delete profiles[profileName];
                        if (currentProfile === profileName) {
                            currentProfile = Object.keys(profiles)[0];
                            loadProfileRules(currentProfile);
                        }
                        saveProfiles();
                        renderProfilesList();
                        renderPanel();
                    }
                });
                profileItem.appendChild(deleteButton);
            }

            targetList.appendChild(profileItem);
        });
    }

    // Right side rules management
    const rightSideContainer = document.createElement('div');
    rightSideContainer.style.flex = '1';
    rightSideContainer.style.display = 'flex';
    rightSideContainer.style.flexDirection = 'column';
    container.appendChild(rightSideContainer);

    const rulesListContainer = document.createElement('div');
    rulesListContainer.style.overflowY = 'auto';
    rulesListContainer.style.height = 'calc(100% - 81px)';
    rightSideContainer.appendChild(rulesListContainer);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Rule';
    addButton.style.margin = '15px auto';
    addButton.style.display = 'block';
    addButton.style.padding = '10px';
    addButton.style.width = '90%';
    addButton.style.backgroundColor = 'transparent';
    addButton.style.border = CONFIG.BUTTON_OUTLINE;
    addButton.style.borderRadius = '50px';
    addButton.style.cursor = 'pointer';

    addButton.addEventListener('mouseenter', () => {
        addButton.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
    });

    addButton.addEventListener('mouseleave', () => {
        addButton.style.backgroundColor = 'transparent';
    });

    addButton.addEventListener('click', () => {
        const newRule = `<Rule${customRules.length + 1}: Define your rule here>`;
        customRules.push(newRule);
        saveCurrentProfileRules();
        renderPanel();
    });
    rightSideContainer.appendChild(addButton);

    function saveCurrentProfileRules() {
        profiles[currentProfile] = customRules;
        saveProfiles();
    }

    function renderPanel() {
        rulesListContainer.innerHTML = '';

        customRules.forEach((rule, index) => {
            const ruleContainer = document.createElement('div');
            ruleContainer.style.marginBottom = '15px';
            ruleContainer.style.display = 'flex';
            ruleContainer.style.alignItems = 'center';
            ruleContainer.style.width = '95%';
            ruleContainer.style.gap = '5px';
            ruleContainer.style.flexWrap = 'wrap';

            const ruleLabel = document.createElement('label');
            ruleLabel.textContent = `Rule ${index + 1}:`;
            ruleLabel.style.color = 'white';
            ruleLabel.style.flex = '0.3';
            ruleContainer.appendChild(ruleLabel);

            const ruleInput = document.createElement('textarea');
            ruleInput.value = rule.replace(/<Rule\d+: ([\s\S]*?)>/, '$1');
            ruleInput.style.flex = '2';
            ruleInput.style.padding = '5px';
            ruleInput.style.borderRadius = '5px';
            ruleInput.style.border = '0.5px solid #444444';
            ruleInput.style.backgroundColor = '#1E1E1E';
            ruleInput.style.color = 'gray';
            ruleInput.style.overflowY = 'hidden';
            ruleInput.style.maxWidth = '100%';
            ruleInput.style.boxSizing = 'border-box';
            ruleInput.style.resize = 'none';

            function adjustHeight(element) {
                element.style.height = 'auto';
                element.style.height = `${element.scrollHeight}px`;
            }

            adjustHeight(ruleInput);

            ruleInput.addEventListener('input', () => {
                adjustHeight(ruleInput);
                ruleInput.style.color = '#D16262';
            });

            ruleContainer.appendChild(ruleInput);

            const updateButton = document.createElement('button');
            updateButton.style.padding = '10px';
            updateButton.style.border = 'none';
            updateButton.style.color = '#B4B4B4';
            updateButton.style.borderRadius = '5px';
            updateButton.style.cursor = 'pointer';

            // Adding the SVG as the innerHTML of the button
            updateButton.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="
                         M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569
                         23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5
                         21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893
                         5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685
                         7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772
                         6 9 5.55228 9 5V3Z
                        "
                      fill="currentColor"/>
              </svg>
            `;

            updateButton.addEventListener('mouseover', () => {
                updateButton.style.color = '#E3E3E3';
            });

            updateButton.addEventListener('mouseout', () => {
                updateButton.style.color = '#B4B4B4';
            });



            updateButton.addEventListener('click', () => {
                customRules[index] = `<Rule${index + 1}: ${ruleInput.value}>`;
                saveCurrentProfileRules();
                ruleInput.style.color = 'black';
            });

            ruleContainer.appendChild(updateButton);

            const rulesDeleteButton = document.createElement('button');
            rulesDeleteButton.style.cssText = 'padding: 5px 10px; margin-right: -20px; color: #B4B4B4; background-color: transparent;';
            rulesDeleteButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="
                           M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533
                           4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985
                           4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763
                           20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418
                           21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863
                           20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523
                           17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17
                           14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z
                          "
                        fill="currentColor"/>
                </svg>
            `;

            rulesDeleteButton.addEventListener('mouseover', () => {
                rulesDeleteButton.style.color = '#E3E3E3';
            });

            rulesDeleteButton.addEventListener('mouseout', () => {
                rulesDeleteButton.style.color = '#B4B4B4';
            });

            rulesDeleteButton.addEventListener('click', () => {
                customRules.splice(index, 1);
                saveCurrentProfileRules();
                renderPanel();
            });


            const moveContainer = document.createElement('div');
            moveContainer.style.display = 'flex';
            moveContainer.style.flexDirection = 'column';
            moveContainer.style.gap = '3px';

function reindexRules() {
  customRules.forEach((rule, i) => {
    // Extract content from the rule text:
    // rule is like "<Rule6:  your text here>"
    // We capture only what's after <RuleX:
    const content = rule.replace(/^<Rule\d+:\s([\s\S]*?)>$/, '$1');

    // Now rewrite it with the correct index:
    customRules[i] = `<Rule${i + 1}: ${content}>`;
  });
}



            if (index > 0) {
                const upButton = document.createElement('button');
                upButton.textContent = '▲';
                upButton.style.padding = '3px';
                upButton.style.border = 'none';
                upButton.style.backgroundColor = 'transparent';
                upButton.style.color = '#B4B4B4';
                upButton.style.borderRadius = '5px';
                upButton.style.cursor = 'pointer';
upButton.addEventListener('click', () => {
    if (index > 0) {
        [customRules[index - 1], customRules[index]] =
            [customRules[index], customRules[index - 1]];

        reindexRules();             // ← Re-index here
        saveCurrentProfileRules();
        renderPanel();
    }
});

                moveContainer.appendChild(upButton);
            }

            if (index < customRules.length - 1) {
                const downButton = document.createElement('button');
                downButton.textContent = '▼';
                downButton.style.padding = '3px';
                downButton.style.border = 'none';
                downButton.style.backgroundColor = 'transparent';
                downButton.style.color = '#B4B4B4';
                downButton.style.borderRadius = '5px';
                downButton.style.cursor = 'pointer';
downButton.addEventListener('click', () => {
    if (index < customRules.length - 1) {
        [customRules[index], customRules[index + 1]] =
            [customRules[index + 1], customRules[index]];

        reindexRules();             // ← Re-index here
        saveCurrentProfileRules();
        renderPanel();
    }
});

                moveContainer.appendChild(downButton);
            }

            ruleContainer.appendChild(moveContainer);
            ruleContainer.appendChild(rulesDeleteButton);
            rulesListContainer.appendChild(ruleContainer);
        });

        adjustAllHeights();
    }

    function adjustAllHeights() {
        const textareas = rulesListContainer.querySelectorAll('textarea');
        textareas.forEach((textarea) => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    }

function updateLayout() {
    if (isMobile()) {
        container.style.flexDirection = 'column';
        rulesPanel.style.width = '90%';
        rulesPanel.style.height = '90%';
        rulesListContainer.style.height = 'calc(90% - 60px)';
        rulesListContainer.style.overflowY = 'auto';
        rulesListContainer.style.maxHeight = `${rulesPanel.clientHeight - 150}px`; // Adjust dynamically
        profilesContainer.style.display = 'none';
        toggleProfilesButton.style.display = 'block';
    } else {
        container.style.flexDirection = 'row';
        rulesPanel.style.width = '1000px';
        rulesPanel.style.height = '700px';
        rulesListContainer.style.height = 'calc(100% - 81px)';
        rulesListContainer.style.overflowY = 'auto';
        profilesContainer.style.display = 'flex';
        toggleProfilesButton.style.display = 'none';

        if (profilesOverlay.style.display === 'flex') {
            profilesOverlay.style.display = 'none';
        }

        if (!container.contains(profilesContainer)) {
            container.insertBefore(profilesContainer, container.firstChild);
        }
    }
}


    window.addEventListener('resize', updateLayout);

    function openPanel() {
        rulesPanel.style.display = 'block';
        showOverlay();
        renderProfilesList();
        renderPanel();
        updateLayout();
    }

    manageRulesButton.addEventListener('click', () => {
        if (rulesPanel.style.display === 'none') {
            openPanel();
        } else {
            closeRulesPanel();
        }
    });

    // Initial render
    renderProfilesList();

    updateLayout();

}

// ================================================================ INJECT TEXT ==================================================================
function injectLogicGPT() {

// Variable in which the next rule is stored
//     const getSelectedRuleValue = localStorage.getItem('selectedRuleValue');
////////////////////////////////////////////////////////
// 1. Detecting URL changes with a simple approach
////////////////////////////////////////////////////////

let previousHref = window.location.href;

const observerForURL = new MutationObserver(() => {
  if (previousHref !== window.location.href) {
    console.log("Detected a URL change from", previousHref, "to", window.location.href);
    previousHref = window.location.href;
    handleConversationChange();
  }
});

// Observe changes to the entire body (you can refine if needed)
observerForURL.observe(document.body, { childList: true, subtree: true });

function handleConversationChange() {
  // Option 1: Clear everything right away
  localStorage.removeItem('lastUserMessage');
  localStorage.removeItem('lastGPTMessage');
  localStorage.removeItem('lastTenMessages');
  localStorage.removeItem('lastTenGPTMessages');
  localStorage.removeItem('lastThreeMessages');
  localStorage.removeItem('lastThreeGPTMessages');

  // Option 2: Or check if conversation is actually empty first
  clearStorageIfNoMessages();

  // Possibly re-initialize observers or do any other steps
  // setupMessageObservers(); // If needed, depends on your code’s lifecycle
}

////////////////////////////////////////////////////////
// 2. A helper that clears localStorage if conversation is empty
////////////////////////////////////////////////////////

function clearStorageIfNoMessages() {
  const userMessages = document.querySelectorAll('.whitespace-pre-wrap');
  const gptMessages = document.querySelectorAll('div.markdown.prose.w-full.break-words.dark\\:prose-invert');

  if (userMessages.length === 0 && gptMessages.length === 0) {
    console.log("Conversation is empty — clearing localStorage for last messages.");
    localStorage.removeItem('lastUserMessage');
    localStorage.removeItem('lastGPTMessage');
    localStorage.removeItem('lastTenMessages');
    localStorage.removeItem('lastTenGPTMessages');
    localStorage.removeItem('lastThreeMessages');
    localStorage.removeItem('lastThreeGPTMessages');
  }
}

// ... your existing code below ...


// DETECTING INPUT PANEL
    function detectInputPanelGPT(callback) {
    const maxRetries = 10;
    const retryInterval = 500;
    let retryCount = 0;
    window.inputPanelGPT = document.querySelector('div#prompt-textarea.ProseMirror');

        if (!inputPanelGPT) {
            console.error('Textarea panel not found.');
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying... Attempt ${retryCount}`);
                setTimeout(() => detectInputPanelGPT(callback), retryInterval);
            } else {
                console.error('Max retries reached. Cannot find the textarea.');
                callback(false, null); // Pass null for inputPanelGPT on failure
            }
            return;
        }

        console.log('Textarea found.');
        callback(true, inputPanelGPT);
    }



detectInputPanelGPT(function(success, inputPanelGPT) {
  if (success) {
    console.log('Textarea is ready to listen for events.');
  } else {
    console.error('Cannot proceed as textarea was not found.');
  }
});

function storeInputText() {
    // Retrieve the input panel
    const inputPanel = document.querySelector('div#prompt-textarea.ProseMirror');

    // If the input panel exists
    if (inputPanel) {
        // Retrieve the current text from the input panel
        const currentText = inputPanel.innerText || inputPanel.textContent || '';

        // Store the text in localStorage with the key 'currentInputText'
        localStorage.setItem('currentInputText', currentText);

        console.log('Text saved to localStorage:', currentText);
    } else {
        console.error('Input panel not found. Cannot save text.');
    }
}

// Attach the function to the window object to make it globally accessible
window.storeInputText = storeInputText;


// Utility function to debounce rapid function calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to retrieve and store messages
function retrieveAndStoreMessages(type) {
    const selector = type === 'user'
        ? '.whitespace-pre-wrap'
        : 'div.markdown.prose.w-full.break-words.dark\\:prose-invert';
    const storageKey = type === 'user' ? 'lastUserMessage' : 'lastGPTMessage';
    const storageKeyTen = type === 'user' ? 'lastTenMessages' : 'lastTenGPTMessages';
    const storageKeyThree = type === 'user' ? 'lastThreeMessages' : 'lastThreeGPTMessages';

    const messageElementArray = Array.from(document.querySelectorAll(selector));
    if (messageElementArray.length > 0) {
        const lastMessage = messageElementArray.slice(-1)[0].textContent.trim();
        console.log(`Last ${type === 'user' ? 'User' : 'GPT'} Message:`, lastMessage);
        localStorage.setItem(storageKey, lastMessage);

        const lastTenMessages = messageElementArray.slice(-10).map(element => element.textContent.trim());
        console.log(`Last 10 ${type === 'user' ? 'User' : 'GPT'} Messages:`, lastTenMessages);
        localStorage.setItem(storageKeyTen, JSON.stringify(lastTenMessages));

        const lastThreeMessages = messageElementArray.slice(-2).map(element => element.textContent.trim());
        console.log(`Last 2 ${type === 'user' ? 'User' : 'GPT'} Messages:`, lastThreeMessages);
        localStorage.setItem(storageKeyThree, JSON.stringify(lastThreeMessages));
    }
}

// Main function to set up observers for user and GPT messages
function setupMessageObservers() {
    const userSelector = '.whitespace-pre-wrap';
    const gptSelector = 'div.markdown.prose.w-full.break-words.dark\\:prose-invert';

    const observerConfig = { childList: true, subtree: true };

    const debouncedUserHandler = debounce(() => retrieveAndStoreMessages('user'), 500);
    const debouncedGPTHandler = debounce(() => retrieveAndStoreMessages('gpt'), 500);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(userSelector) || node.querySelector(userSelector)) {
                            debouncedUserHandler();
                        }
                        if (node.matches(gptSelector) || node.querySelector(gptSelector)) {
                            debouncedGPTHandler();
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, observerConfig);
    console.log("MutationObserver set up for user and GPT messages.");
}

// Function to retrieve the last message of a given type
async function getLastMessages(type) {
    const selector = type === 'user'
        ? '.whitespace-pre-wrap'
        : 'div.markdown.prose.w-full.break-words.dark\\:prose-invert';
    const messageElementArray = Array.from(document.querySelectorAll(selector));

    if (messageElementArray.length > 0) {
        const lastMessage = messageElementArray.slice(-1)[0].textContent.trim();
        return lastMessage;
    } else {
        // Instead of rejecting, return null to indicate absence
        return null;
    }
}

// Initialize observers
setupMessageObservers();

// Function to handle message retrieval and related logic
async function handleMessages() {
    const lastUserMessage = await getLastMessages('user');
    if (lastUserMessage) {
        console.log("Retrieved last user message:", lastUserMessage);
    } else {
        console.info("No user messages found at this time.");
        // Optionally, you can reset rules here if necessary
        const getRulesState = localStorage.getItem('enableRules');
        if (getRulesState === "true") {
            const selectedProfileRules = localStorage.getItem('selectedProfile.Rules');
            const rulesProfiles = JSON.parse(localStorage.getItem('rulesProfiles'));
            const selectedRules = rulesProfiles[selectedProfileRules];
            console.log(`Stored selectedRules: ${selectedRules}`);
            const initNextRule = 'Rule1';
            localStorage.setItem('nextRule', initNextRule);
            localStorage.setItem('previousRule', '0');
            const initNextRuleValue = selectedRules.find(rule => rule.startsWith(`<${initNextRule}:`));
            localStorage.setItem('selectedRuleValue', initNextRuleValue);
            console.log(`Initial stored selectedRuleValue: ${initNextRuleValue}`);
        }
    }

    const lastGPTMessage = await getLastMessages('gpt');
    if (lastGPTMessage) {
        console.log("Retrieved last GPT message:", lastGPTMessage);
    } else {
        console.info("No GPT messages found at this time.");
    }
}

// Optional: Remove the initial handleMessages call to prevent errors on load
// If you prefer to handle existing messages on load, you can keep it with adjusted error handling
// handleMessages();

// Rely on MutationObserver to handle messages as they arrive

// ================================================================ RULES LOGIC ==================================================================

function rulesLogic() {
    // CHECKING IF THE MODULES ARE ENABLED

    const selectedProfileRules = localStorage.getItem('selectedProfile.Rules');
    const rulesProfiles = JSON.parse(localStorage.getItem('rulesProfiles'));
    const selectedRules = rulesProfiles[selectedProfileRules];
                console.log(`Stored selectedRules: ${selectedRules}`);
    const initNextRule = 'Rule1';
    localStorage.setItem('nextRule', initNextRule);
    const initPreviousRule = localStorage.setItem('previousRule', '0');
    const initNextRuleValue = selectedRules.find(rule => rule.startsWith(`<${initNextRule}:`));
    localStorage.setItem('selectedRuleValue', initNextRuleValue);
    console.log(`Initial stored selectedRuleValue: ${initNextRuleValue}`);
    const getRulesState = localStorage.getItem('enableRules');
    if (getRulesState === "true") {
        // RETRIEVING THE LAST USER MESSAGE
        const lastUserMessage = localStorage.getItem('lastUserMessage');

        if (lastUserMessage) {
            // MATCHING RULES IN THE MESSAGE
            const ruleMatches = lastUserMessage.match(/<Rule\d+/g);
                console.log('TRYING TO MATCH RULES');
            if (ruleMatches) {
                console.log('Found rules:', ruleMatches);

                // STORING THE LAST MATCHED RULE AS "previousRule"
                const previousRule = ruleMatches[ruleMatches.length - 1].replace('<', '');
                localStorage.setItem('previousRule', previousRule);

                // CALCULATING AND STORING THE NEXT RULE
                const ruleNumber = parseInt(previousRule.replace('Rule', ''), 10);
                const nextRuleNumber = (ruleNumber % selectedRules.length) + 1; // Wrap around using modulus
                const nextRule = `Rule${nextRuleNumber}`;
                localStorage.setItem('nextRule', nextRule);

                console.log(`Stored previousRule: ${previousRule}`);
                console.log(`Stored nextRule: ${nextRule}`);

                const nextRuleValue = selectedRules.find(rule => rule.startsWith(`<${nextRule}:`));
                localStorage.setItem('selectedRuleValue', nextRuleValue);
                console.log(`Stored selectedRuleValue: ${nextRuleValue}`);
            } else {

                console.log('No rules found in the last user message.');
            }
        } else {
            console.log('No last user message found in localStorage.');
        }
    } else {
        console.log('Rules module is disabled.');
    }
}

function observeLocalStorageKeyChange(key, callback) {
    let previousValue = localStorage.getItem(key);

    setInterval(() => {
        const currentValue = localStorage.getItem(key);
        if (currentValue !== previousValue) {
            previousValue = currentValue;
            callback(currentValue);
        }
    }, 100); // Adjust the interval as needed
}

// Set up the observer for 'lastUserMessage'
observeLocalStorageKeyChange('lastUserMessage', (newValue) => {
    console.log(`Detected change in 'lastUserMessage': ${newValue}`);
    rulesLogic();
});


    rulesLogic();


// ============================================================== LOREBOOK LOGIC =================================================================
function lorebookLogic() {
    // Getting the relevant lorebook entries and ensuring it's already an array
    const selectedLorebookProfile = localStorage.getItem('selectedProfile.lorebook');
    const lorebookEntries = JSON.parse(localStorage.getItem('lorebookEntries')) || {};

    // Retrieve selected entries as an array
    const selectedLorebookEntries = lorebookEntries[selectedLorebookProfile] || [];
    console.log(`Stored selectedLorebookEntries:`, selectedLorebookEntries);

    // Extract all possible keywords from the lorebook entries
    const keywords = extractKeywords(selectedLorebookEntries);
    console.log(`Extracted Keywords:`, keywords);

    // Get current input text and last GPT message
    const textareaContent = localStorage.getItem('currentInputText') || '';
    const lastGPTMessage = localStorage.getItem('lastGPTMessage') || '';

    // Retrieve the last ten messages for bracketed-exclusion scanning
    const lastTenMessages = JSON.parse(localStorage.getItem('lastTenMessages')) || [];
    console.log(`Last Ten Messages:`, lastTenMessages);

    // Retrieve the last ten GPT messages if needed
    const lastTenGPTMessages = JSON.parse(localStorage.getItem('lastTenGPTMessages')) || [];

    // Retrieve the last three messages for unbracketed detection
    const lastThreeMessages = JSON.parse(localStorage.getItem('lastThreeMessages')) || [];
    const lastThreeGPTMessages = JSON.parse(localStorage.getItem('lastThreeGPTMessages')) || [];

    // Combine content (textarea + last GPT message) if there's a last GPT message
    let combinedContent;
    if (!lastGPTMessage && lastTenMessages.length === 0) {
        combinedContent = textareaContent;
    } else {
        combinedContent = `${textareaContent} ${lastGPTMessage}`;
    }
    console.log(`Combined Content: ${combinedContent}`);

    // 1) Determine excluded keywords from the last ten messages (i.e. bracketed usage)
    const excludedKeywords = parseExcludedKeywords(lastTenMessages);
    console.log(`Excluded Keywords (found in <[Lorebook: ...]>):`, excludedKeywords);

    // 2) Find matching keywords in the user+GPT combined content (partial match)
    let matchingKeywords = findMatchingKeywords(keywords, combinedContent);

    // 3) Grab any new “outside-of-brackets” keywords from the last three messages + last three GPT messages
    const unbracketedKeywords = parseKeywordsOutsideBrackets(
        keywords,
        lastThreeMessages,
        lastThreeGPTMessages,
        excludedKeywords
    );

    // Merge those unbracketed keywords with the ones found in combinedContent
    // but only keep those which are NOT in excludedKeywords.
    const finalNewKeywords = unbracketedKeywords.filter(k => !excludedKeywords.has(k));
    console.log(`Additional Unbracketed Keywords to Add:`, finalNewKeywords);

    matchingKeywords = [...new Set([...matchingKeywords, ...finalNewKeywords])];
    console.log(`All Matching Keywords Before Final Exclusion:`, matchingKeywords);

    // 4) Exclude bracketed keywords from the final list
    matchingKeywords = matchingKeywords.filter(k => !excludedKeywords.has(k));
    console.log(`Matching Keywords After Exclusion:`, matchingKeywords);

    // If we have matches, display the corresponding lorebook entries in batches of 3
    if (matchingKeywords.length > 0) {
        outputLorebookEntries(selectedLorebookEntries, matchingKeywords, 3);
    } else {
        // Clear out the localStorage entry if none remain
        localStorage.setItem('selectedLorebookValues', JSON.stringify([]));
    }
}

// -----------------------------------------------------------------------
// Function to extract keywords from the lorebook entries
function extractKeywords(lorebookEntries) {
    const keywords = [];
    const entryPattern = /Lorebook:\s*([^\]>]+(?:\s*,\s*[^\]>]+)*)/g;
    let match;

    lorebookEntries.forEach(entry => {
        while ((match = entryPattern.exec(entry)) !== null) {
            const entryKeywords = match[1].split(',').map(keyword => keyword.trim());
            keywords.push(...entryKeywords);
        }
    });

    return keywords;
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// Function to parse lastTenMessages for <[Lorebook: ...]> (excluded keys)
function parseExcludedKeywords(lastTenMessages) {
  const excludedKeywords = new Set();
  // matches <[Lorebook: ...]>
  const pattern = /<\[Lorebook:\s*([^\]]+)\]/gi;

  lastTenMessages.forEach(message => {
    let match;
    while ((match = pattern.exec(message)) !== null) {
      const foundKeywordString = match[1].trim();
      const foundKeywords = foundKeywordString.split(',').map(k => k.trim());
      foundKeywords.forEach(k => excludedKeywords.add(k));
    }
  });

  return excludedKeywords;
}

// -----------------------------------------------------------------------
// Function to find matching keywords in the combined text (PARTIAL MATCH),
// ignoring anything inside <[ ... ]> so that "description text" is not scanned.
function findMatchingKeywords(keywords, content) {
  // 1) Strip out bracketed segments
  const strippedContent = content.replace(/<\[.*?\]>/gs, '');

  const matchingKeywords = [];
  keywords.forEach(keyword => {
    // Partial, case-insensitive match
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(strippedContent)) {
      matchingKeywords.push(keyword);
    }
  });
  return matchingKeywords;
}

// -----------------------------------------------------------------------
// Same approach for the last three messages scanning outside brackets
function parseKeywordsOutsideBrackets(keywords, lastThreeMessages, lastThreeGPTMessages, excludedKeywords) {
  const foundKeywords = new Set();

  function stripBracketedSegments(msg) {
    return msg.replace(/<\[.*?\]>/gs, '');
  }

  const allMessages = [...lastThreeMessages, ...lastThreeGPTMessages];

  allMessages.forEach(message => {
    const strippedMessage = stripBracketedSegments(message);

    keywords.forEach(keyword => {
      if (excludedKeywords.has(keyword) || foundKeywords.has(keyword)) return;
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(strippedMessage)) {
        foundKeywords.add(keyword);
      }
    });
  });

  return [...foundKeywords].filter(k => !excludedKeywords.has(k));
}

// -----------------------------------------------------------------------
// Helper to parse the lorebook entries into structured objects
function parseLorebookEntries(lorebookEntries) {
  const entryPattern = /Lorebook:\s*([^\]>]+(?:\s*,\s*[^\]>]+)*)/;

  return lorebookEntries.map(entry => {
    const match = entry.match(entryPattern);
    if (!match) return { text: entry, keywords: [] };
    const entryKeywords = match[1].split(',').map(k => k.trim());
    return { text: entry, keywords: entryKeywords };
  });
}

// -----------------------------------------------------------------------
// Show the matching lorebook entries in batches (limit=3).
function outputLorebookEntries(lorebookEntries, matchingKeywords, limit = 3) {
  const parsedEntries = parseLorebookEntries(lorebookEntries);

  const uniqueEntries = new Set();
  const entriesToDisplay = [];

  // For each keyword, see which parsed entries contain it
  for (const keyword of matchingKeywords) {
    const matches = parsedEntries.filter(e => e.keywords.includes(keyword));
    for (const entryObj of matches) {
      if (!uniqueEntries.has(entryObj.text)) {
        uniqueEntries.add(entryObj.text);
        entriesToDisplay.push(entryObj.text);
        if (entriesToDisplay.length === limit) {
          break;
        }
      }
    }
    if (entriesToDisplay.length === limit) {
      break;
    }
  }

  console.log(`Matching Lorebook Entries:`, entriesToDisplay);
  localStorage.setItem('selectedLorebookValues', JSON.stringify(entriesToDisplay));
}

// Initialize the lorebook logic
window.lorebookLogic = lorebookLogic;
lorebookLogic();
}
// ================================================================ TEXT COLORS ==================================================================
function colorsScript() {

    const defaultColors = {
        textColor: '#A2A2AC',
        emColor: '#E0DF7F',
        bracketHighlight: '#737373',
        whiteHighlight: '#FFFFFF'
    };

    // Load colors from localStorage or use default colors
    function loadColors() {
        return {
            textColor: localStorage.getItem('textColor') || defaultColors.textColor,
            emColor: localStorage.getItem('emColor') || defaultColors.emColor,
            bracketHighlight: localStorage.getItem('bracketHighlight') || defaultColors.bracketHighlight,
            whiteHighlight: localStorage.getItem('whiteHighlight') || defaultColors.whiteHighlight
        };
    }

    // Inject styles based on the loaded colors
    function injectStyles(colors) {
        const styleId = 'colorizer-styles';
        let styleElement = document.getElementById(styleId);

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
            p, div.whitespace-pre-wrap {
                color: ${colors.textColor};
            }
            em {
                color: ${colors.emColor} !important;
                font-weight: normal !important;
            }
            .highlight-blue { color: ${colors.bracketHighlight} !important; }
            .highlight-white { color: ${colors.whiteHighlight} !important; }

            .highlight-blue * { color: inherit !important; }
            .highlight-white * { color: inherit !important; }
        `;
    }

    // Create the color picker panel UI
    function createColorPickerPanel() {
        const colors = loadColors();

        const colorPanel = document.createElement('div');
        colorPanel.id = 'color-picker-panel';
        colorPanel.style.position = 'fixed';
        // Center the panel
        colorPanel.style.top = '50%';
        colorPanel.style.left = '50%';
        colorPanel.style.transform = 'translate(-50%, -50%)';
        colorPanel.style.padding = '30px';
        colorPanel.style.background = '#2F2F2F';
        colorPanel.style.color = '#f8f8f8';
        colorPanel.style.borderRadius = '20px';
        colorPanel.style.zIndex = '10000';
        colorPanel.style.display = 'none';
        colorPanel.style.width = '280px';

        colorPanel.innerHTML = `
            <h3 style="margin-top: 0px; margin-bottom: 20px; text-align: center; color: #f8f8f8;">Text Colors</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; width: 90%; margin-left: 10px;">
                <label style="margin-right: 10px;">Standard Color:</label>
                <input type="color" id="textColor" value="${colors.textColor}" style="width: 50px; height: 30px; border: none; cursor: pointer;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; width: 90%; margin-left: 10px;">
                <label style="margin-right: 10px;">Italic:</label>
                <input type="color" id="emColor" value="${colors.emColor}" style="width: 50px; height: 30px; border: none; cursor: pointer;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; width: 90%; margin-left: 10px;">
                <label style="margin-right: 10px;">Parentheses:</label>
                <input type="color" id="bracketHighlight" value="${colors.bracketHighlight}" style="width: 50px; height: 30px; border: none; cursor: pointer;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; width: 90%; margin-left: 10px;">
                <label style="margin-right: 10px;">Quotes:</label>
                <input type="color" id="whiteHighlight" value="${colors.whiteHighlight}" style="width: 50px; height: 30px; border: none; cursor: pointer;">
            </div>
            <div style="text-align: center; margin-top: 25px;">
                <button id="saveColors" style="padding: 8px 15px; background-color: transparent; width: 100%; color: #f8f8f8; border: 1px solid #4E4E4E; border-radius: 50px; cursor: pointer;">Save</button>
            </div>
        `;

        document.body.appendChild(colorPanel);

        // Save button hover effect
        const saveColorsHighlight = document.getElementById('saveColors');
        saveColorsHighlight.addEventListener('mouseenter', () => {
            saveColorsHighlight.style.backgroundColor = CONFIG.BUTTON_HIGHLIGHT;
        });
        saveColorsHighlight.addEventListener('mouseleave', () => {
            saveColorsHighlight.style.backgroundColor = 'transparent';
        });

        // Close button
        const colorsCloseButton = document.createElement('button');
        colorsCloseButton.style.position = 'absolute';
        colorsCloseButton.style.borderRadius = '50%';
        colorsCloseButton.style.top = '20px';
        colorsCloseButton.style.right = '20px';
        colorsCloseButton.style.backgroundColor = 'transparent';
        colorsCloseButton.style.cursor = 'pointer';
        colorsCloseButton.style.width = '32px';
        colorsCloseButton.style.height = '32px';
        colorsCloseButton.style.display = 'flex';
        colorsCloseButton.style.alignItems = 'center';
        colorsCloseButton.style.justifyContent = 'center';

        const colorsCloseSymbol = document.createElement('span');
        colorsCloseSymbol.innerText = '✕';
        colorsCloseSymbol.style.color = '#FBFBFE';
        colorsCloseSymbol.style.fontSize = '14px';
        colorsCloseSymbol.style.fontWeight = '550';
        colorsCloseSymbol.style.transform = 'translateY(-1px) translateX(0.4px)';

        colorsCloseButton.appendChild(colorsCloseSymbol);

        colorsCloseButton.addEventListener('mouseenter', () => {
            colorsCloseButton.style.backgroundColor = '#676767';
        });
        colorsCloseButton.addEventListener('mouseleave', () => {
            colorsCloseButton.style.backgroundColor = 'transparent';
        });

        const closeColorsPanel = () => {
            colorPanel.style.display = 'none';
            hideOverlay();
        };
        colorsCloseButton.addEventListener('click', closeColorsPanel);
        colorPanel.appendChild(colorsCloseButton);
    }

    // Create the manage colors button
    window.colorButton = document.createElement('div');
    window.colorButton.innerHTML = `
        <button id="toggle-color-panel"
            style="
                position: relative;
                top: 10px;
                right: 0px;
                left: 10px;
                padding: 7px 15px;
                background: transparent;
                color: #b0b0b0;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                text-align: left;
                cursor: pointer;
                width: 90%;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background-color 0.1s, color 0.1s;
                z-index: 1001;">
            <svg fill="#B0B0B0" viewBox="0 0 32 32" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <title>brush</title>
                    <path d="M27.555 8.42c-1.355 1.647-5.070 6.195-8.021 9.81l-3.747-3.804c3.389-3.016 7.584-6.744 9.1-8.079 2.697-2.377 5.062-3.791
                             5.576-3.213 0.322 0.32-0.533 2.396-2.908 5.286zM18.879 19.030c-1.143 1.399-2.127 2.604-2.729 3.343l-4.436-4.323c0.719-0.64
                             1.916-1.705 3.304-2.939l3.861 3.919zM15.489 23.183v-0.012c-2.575 9.88-14.018 4.2-14.018 4.2s4.801 0.605 4.801-3.873c0-4.341
                             4.412-4.733 4.683-4.753l4.543 4.427c0 0.001-0.009 0.011-0.009 0.011z"></path>
                </g>
            </svg>
            Manage Colors
        </button>
    `;

    const colorButtonElement = window.colorButton.querySelector('button');
    colorButtonElement.onmouseover = () => {
        colorButtonElement.style.backgroundColor = '#212121';
        colorButtonElement.style.color = '#ffffff';
    };
    colorButtonElement.onmouseout = () => {
        colorButtonElement.style.backgroundColor = 'transparent';
        colorButtonElement.style.color = '#b0b0b0';
    };

    // Toggle color panel
    window.colorButton.addEventListener('click', () => {
        const colorPanel = document.getElementById('color-picker-panel');
        if (colorPanel) {
            showOverlay();
            colorPanel.style.display = (colorPanel.style.display === 'none' ? 'block' : 'none');
        }
    });

    // Save the selected colors to localStorage and update styles
    function saveColors() {
        const textColor = document.getElementById('textColor').value;
        const emColor = document.getElementById('emColor').value;
        const bracketHighlight = document.getElementById('bracketHighlight').value;
        const whiteHighlight = document.getElementById('whiteHighlight').value;

        localStorage.setItem('textColor', textColor);
        localStorage.setItem('emColor', emColor);
        localStorage.setItem('bracketHighlight', bracketHighlight);
        localStorage.setItem('whiteHighlight', whiteHighlight);

        injectStyles(loadColors());

        // Re-highlight all existing messages to apply new colors
        processExistingMessages();

        showTemporaryNotification('Colors saved successfully!', 2000);
    }

    // Temporary notification
    function showTemporaryNotification(message, duration) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10001';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';

        document.body.appendChild(notification);

        // Trigger reflow to apply transition
        void notification.offsetWidth;
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, duration);
    }

// --- MAIN HIGHLIGHT LOGIC ---

// Replaces parentheses/quotes in all text nodes under the given container
function highlightMessageContent(container) {
    // Process parentheses
    safelyColorText(container, /\(([^)]+)\)/g, 'highlight-blue');
    // Process quotes
    safelyColorText(container, /["“](.*?)["”]/g, 'highlight-white');
}

function safelyColorText(container, regex, highlightClass) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let node;

    while ((node = walker.nextNode())) {
        // Skip text that’s within input or already in a highlight
        if (
            node.parentElement.closest('#prompt-textarea') ||
            node.parentElement.closest('.prosemirror-editor-container') ||
            node.parentElement.closest('#composer-background') ||
            node.parentElement.closest('[contenteditable="true"]') ||
            node.parentElement.closest(`.${highlightClass}`)
        ) {
            continue;
        }

        // Replace curly quotes in the raw text node first
        replaceQuotes(node);

        // Remove any "[sentence], you say?" portions
        removeSentenceYouSay(node);

        const text = node.textContent;
        if (!text) continue;

        // Now run the highlight
        let newHTML = '';
        let lastIndex = 0;
        regex.lastIndex = 0; // always reset

        let match;
        while ((match = regex.exec(text)) !== null) {
            newHTML += escapeHTML(text.substring(lastIndex, match.index));
            newHTML += `<span class="${highlightClass}">${escapeHTML(match[0])}</span>`;
            lastIndex = regex.lastIndex;
        }
        newHTML += escapeHTML(text.substring(lastIndex));

        // If there's a difference, replace the node
        if (newHTML !== escapeHTML(text)) {
            const tempSpan = document.createElement('span');
            tempSpan.innerHTML = newHTML;
            node.parentNode.replaceChild(tempSpan, node);
        }
    }
}

/**
 * Removes any substring that ends with ", you say?" from the text node,
 * preserving a preceding space+quote if present.
 * For example:
 *   "I walk over to the window. "It's cold today, you say? That's true."
 * becomes
 *   "I walk over to the window. "That's true."
 */
function removeSentenceYouSay(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
        // Explanation of the pattern:
        //   1. (\s*["'\u2018\u2019\u201C\u201D])? -- optionally capture any leading spaces + straight/curly quotes
        //   2. [^.?!]*                         -- then match any characters (excluding ., ?, or !)
        //   3. ,\s*you say\?\s*                -- up to the literal ", you say?" plus trailing space
        //   4. Replace the whole matched block with just $1
        //      (the optional space+quote), thereby removing the rest of the text.
        node.nodeValue = node.nodeValue.replace(
            /(\s*["'\u2018\u2019\u201C\u201D])?[^.?!]*,\s*you say\?\s*/gi,
            '$1'
        );
    }
}


function replaceQuotes(node) {
    // If it's a text node, do a direct replacement
    if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue
            .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
            .replace(/[\u201C\u201D\u201E\u201F]/g, '"');
    }
}

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Re-highlight all relevant message blocks
function processExistingMessages() {
    // Grab paragraphs, pre-wrap divs, typical markdown blocks, etc.
    const messages = document.querySelectorAll(
        'p, div.whitespace-pre-wrap, div.markdown.prose.w-full.break-words.dark\\:prose-invert.dark'
    );
    messages.forEach(message => highlightMessageContent(message));
}

// MutationObserver: watch for newly added content & highlight it
let debounceTimer = null;
function handleMutations(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            if (debounceTimer) clearTimeout(debounceTimer);
            // Short debounce so it doesn't run on every tiny text update
            debounceTimer = setTimeout(() => {
                console.log("DOM changes detected; highlighting...");
                processExistingMessages();
            }, 800);
            break;
        }
    }
}

function initializeMutationObserver() {
    const observer = new MutationObserver(handleMutations);
    // Watch the entire body for new nodes
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("MutationObserver initialized.");
}

// MAIN ENTRY POINT
function initialize() {
    console.log('colorsScript initialized');
    // Inject the user's chosen or default color styles
    injectStyles(loadColors());
    // Create the color-picker UI
    createColorPickerPanel();
    // Initial highlight pass
    processExistingMessages();
    // Start watching for new messages
    initializeMutationObserver();
}

function startInitialization() {
    const getColorsState = localStorage.getItem('enableColors');
    if (getColorsState === "true") {
        initialize();
    } else {
        console.log("Color customization is disabled.");
    }
}

// Handle DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInitialization);
} else {
    startInitialization();
}

// Listen for save button clicks
document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'saveColors') {
        saveColors();
    }
});

}



// =================================================================== < > Hider ===================================================================

function hideInjectionsScript() {
    // Mutation observer reference
    let observer = null;

    // Function to hide text within angle brackets
    function hideBracketText(node) {
        // Multi-line regex to capture text within < and >
        const regex = /<[^>]*?>/gs;

        // Ensure the node is a text node
        if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentNode;

            // Exclude nodes outside of .whitespace-pre-wrap
            if (!parent.closest('.whitespace-pre-wrap')) {
                return;
            }

            // Find all matches
            const matches = node.nodeValue.match(regex);
            if (matches) {
                // Split the text node around matched portions
                const parts = node.nodeValue.split(regex);

                // Insert each segment and its matched hidden text
                parts.forEach((part, index) => {
                    // Only insert visible text if non-empty
                    if (part.trim() !== "") {
                        const textNode = document.createTextNode(part);
                        parent.insertBefore(textNode, node);
                    }
                    // Create a hidden <span> if a match still exists at this index
                    if (index < matches.length) {
                        const hiddenSpan = document.createElement('span');
                        hiddenSpan.style.display = 'none';
                        hiddenSpan.textContent = matches[index];
                        parent.insertBefore(hiddenSpan, node);
                    }
                });

                // Remove the original text node
                parent.removeChild(node);
            }
        }
    }

    // Process only visible and editable elements
    function processVisibleTextNodes() {
        document.querySelectorAll('*:not(script):not(style)').forEach(node => {
            // Check for childNodes & whether element is visible
            if (node.childNodes && node.offsetParent !== null) {
                node.childNodes.forEach(child => {
                    // Only hide bracket text within .whitespace-pre-wrap
                    if (child.parentNode.closest('.whitespace-pre-wrap')) {
                        hideBracketText(child);
                    }
                });
            }
        });
    }

    // Start observing the DOM
    function startObserving() {
        if (observer) return; // Avoid multiple observers

        observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.closest('.whitespace-pre-wrap')) {
                            processVisibleTextNodes();
                        }
                    } else if (addedNode.nodeType === Node.TEXT_NODE) {
                        if (addedNode.parentNode.closest('.whitespace-pre-wrap')) {
                            hideBracketText(addedNode);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        processVisibleTextNodes(); // Process existing nodes initially
    }

    // Stop observing the DOM
    function stopObserving() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // Show hidden text
    function showBracketText() {
        // Reveal any spans that were previously hidden
        document.querySelectorAll('span[style*="display: none"]').forEach(hiddenSpan => {
            const parent = hiddenSpan.parentNode;
            const textNode = document.createTextNode(hiddenSpan.textContent);
            parent.insertBefore(textNode, hiddenSpan);
            parent.removeChild(hiddenSpan);
        });
    }

    // Monitor toggle state
    function monitorHiderState() {
        const state = localStorage.getItem('enableHider');
        if (state === 'true') {
            console.log("Hider is enabled.");
            showBracketText(); // Reset to avoid duplicates
            startObserving();
        } else {
            console.log("Hider is disabled.");
            stopObserving();
            showBracketText(); // Reveal hidden text
        }
    }

// Set up a timed observer that calls monitorHiderState every 2 seconds
function setupTimedObserver() {
    // Initial call to ensure immediate action
    monitorHiderState();

    // Set interval to call monitorHiderState every 2000 milliseconds (2 seconds)
    const intervalId = setInterval(() => {
        const state = localStorage.getItem('enableHider');
        if (state === 'true') {
     //       hideAllBracketText(); // Reapply hiding logic
        }
        monitorHiderState();
    }, 2000);

    // Optional: Provide a way to clear the interval if needed
    // For example, to stop after a certain condition:
    // setTimeout(() => clearInterval(intervalId), 60000); // Stops after 1 minute
}

    // Optional: Provide a way to clear the interval if needed
    // For example, to stop after a certain condition:
    // setTimeout(() => clearInterval(intervalId), 60000); // Stops after 1 minute


// Listen for storage changes
window.addEventListener('storage', monitorHiderState);

// Initialize the timed observer when the script runs


    // Initial setup
    monitorHiderState();
    setupTimedObserver();
}

// ============================================================= CONTENT WARNINGS =================================================================
function hideContentWarnings() {
    function updateVisibility() {
        const state = localStorage.getItem('enableHideWarning');
        if (state === 'true') {
            GM_addStyle(`
                .border-orange-400\\/15,
                div.text-sm.text-orange-600.border-token-border-light.bg-orange-400.bg-opacity-0.w-full.pr-5.text-right {
                    display: none !important;
                }
            `);
        } else {
            GM_addStyle(`
                .border-orange-400\\/15,
                div.text-sm.text-orange-600.border-token-border-light.bg-orange-400.bg-opacity-0.w-full.pr-5.text-right {
                    display: block !important;
                }
            `);
        }
    }

    // Initial update
    updateVisibility();

    // Watch for changes in localStorage
    window.addEventListener('storage', (event) => {
        if (event.key === 'enableHideWarning') {
            updateVisibility();
        }
    });

    // Optional: Add a periodic check as a fallback
    setInterval(updateVisibility, 1000);
}

// Call the function to initialize
hideContentWarnings();

// =============================================================== CURRENT TIME ===================================================================

function currentTime() {

    // Function to store the current time in localStorage
    function storeCurrentTime() {
        const now = new Date();

        // Format the date as '<Dayname hh:mm, dd.mm.yyyy>'
        const options = { weekday: 'long' };
        const dayName = new Intl.DateTimeFormat('en-US', options).format(now);
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const date = now.toLocaleDateString('en-GB').replace(/\//g, '.');

        const formattedTime = `<${dayName} ${time}, ${date}>`;

        // Store in localStorage
        localStorage.setItem('currentTime', formattedTime);
    }

    // Make the function accessible from outside
    window.storeCurrentTime = storeCurrentTime;

}

// =================================================================== BUTTONS ===================================================================


function createDivider() {
const divider = document.createElement('div');
divider.style.height = '1px';
divider.style.backgroundColor = '#212121';
divider.style.margin = '20px 20px 0px 20px';
    return divider;
}
function createFooterText() {
    const footerText = document.createElement('div');
    footerText.textContent = '© Vishanka 2024';
    footerText.style.position = 'absolute';
    footerText.style.bottom = '10px';
    footerText.style.left = '50%';
    footerText.style.transform = 'translateX(-50%)';
    footerText.style.fontSize = '12px';
    footerText.style.fontWeight = '550';
    footerText.style.color = '#272727';
    return footerText;
}

function createCheckbox(label, key) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '5px';
    checkboxContainer.style.marginLeft = '25px';

    const checkboxLabel = document.createElement('label');
    checkboxLabel.style.color = '#B0B0B0';

    const checkbox = document.createElement('input');
    checkbox.style.marginRight = '10px';
    checkbox.type = 'checkbox';
    checkbox.id = key;
    checkboxLabel.textContent = label;
    checkboxLabel.setAttribute('for', key);

    // Retrieve saved state from localStorage
    const savedState = localStorage.getItem(key);
    if (savedState !== null) {
        checkbox.checked = savedState === 'true';
    }

    // Listen for changes and save state to localStorage
    checkbox.addEventListener('change', function() {
        localStorage.setItem(key, checkbox.checked);
    });

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxLabel);


    return checkboxContainer;
}

function initializeCheckboxes() {
function checkboxDivider() {
const checkboxDivider = document.createElement('div');
checkboxDivider.style.height = '1px';
checkboxDivider.style.backgroundColor = '#212121';
checkboxDivider.style.margin = '20px 20px 20px 20px';
    return checkboxDivider;
}
    // Create a container for the checkboxes
    const checkboxGroup = document.createElement('div');
    checkboxGroup.style.marginTop = '15px';  // Add margin at the top of the group

    // Create and append each checkbox to the group
    checkboxGroup.appendChild(createCheckbox('Enable Rules', 'enableRules'));
    checkboxGroup.appendChild(createCheckbox('Enable Lorebook', 'enableLorebook'));
    checkboxGroup.appendChild(createCheckbox('Enable Events', 'enableEvents'));
checkboxGroup.appendChild(checkboxDivider());
    checkboxGroup.appendChild(createCheckbox('Enable Colors', 'enableColors'));
    checkboxGroup.appendChild(createCheckbox('Hide Injections', 'enableHider'));
    checkboxGroup.appendChild(createCheckbox('Hide Content Warning', 'enableHideWarning'));
checkboxGroup.appendChild(checkboxDivider());
    checkboxGroup.appendChild(createCheckbox('Enable Time', 'enableTime'));
    // Append the group to the main panel
    mainPanel.appendChild(checkboxGroup);
}


function initializeButton() {
mainPanel.appendChild(createDivider());
mainPanel.appendChild(openLorebookButton);
mainPanel.appendChild(manageRulesButton);
mainPanel.appendChild(createDivider());
initializeCheckboxes();
mainPanel.appendChild(createDivider());
mainPanel.appendChild(colorButton);
mainPanel.appendChild(createFooterText());
}
// ============================================================ SCRIPT LOADING ORDER ============================================================
currentTime();
colorsScript();
hideInjectionsScript();
hideContentWarnings();
mainPanelScript();
rulesScript();
lorebookScript();
initializeButton();
injectLogicGPT();
//lorebookLogic();
    // Function to execute your scripts
/*    function executeScripts() {
        mainPanelScript();
        rulesScript();
        initializeButton();
        injectLogicGPT();
    }

    // Initial execution
    executeScripts();

    // Monitor for URL changes
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
        if (currentUrl !== location.href) {
            currentUrl = location.href;
            console.log('URL changed, re-executing scripts...');
            executeScripts();
        }
    });

    // Observe changes in the <body> tag
    observer.observe(document.body, { childList: true, subtree: true });
*/
})();
