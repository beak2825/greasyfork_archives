// ==UserScript==
// @name         ChatGPT Lorebook
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adds functionality to modify the enter key behavior on chatgpt.com, adds a local storage management panel, and scans specific text elements for keywords
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517155/ChatGPT%20Lorebook.user.js
// @updateURL https://update.greasyfork.org/scripts/517155/ChatGPT%20Lorebook.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addCustomTextBeforeSend(callback) {
        const textarea = document.querySelector('div#prompt-textarea.ProseMirror');
        if (!textarea) {
            console.error('Textarea panel not found.');
            return callback(false);
        }
        console.log('Textarea found.');

        const selectedProfile = localStorage.getItem('selectedProfile');
        if (!selectedProfile) {
            console.error('No profile selected.');
            return callback(false);
        }
        console.log(`Selected profile: ${selectedProfile}`);

        // Load lorebook entries for the selected profile
        const lorebookEntries = [];
        const profilePrefix = `${selectedProfile}-lorebook:`;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(profilePrefix)) {
                const content = key.slice(profilePrefix.length);
                const keywords = content.split(',');
                lorebookEntries.push({
                    keywords: keywords.map(keyword => keyword.trim().toLowerCase()),
                    value: localStorage.getItem(key),
                    key: key
                });
            }
        }
        console.log(`Lorebook entries loaded: ${JSON.stringify(lorebookEntries)}`);

        const lastArticles = Array.from(document.querySelectorAll('.whitespace-pre-wrap')).slice(-10);
        console.log('Last articles found:', lastArticles.map(article => article.innerHTML));

        const lastMarkdownDivs = Array.from(document.querySelectorAll('div.markdown.prose.w-full.break-words.dark\\:prose-invert')).slice(-10);
        console.log('Last markdown divs found:', lastMarkdownDivs.map(div => div.innerHTML));
        const scannedKeywords = new Set();

        // Helper function to check if keyword is a complete match
        function isCompleteMatch(text, keyword) {
            const index = text.indexOf(keyword);
            if (index === -1) return false;
            const before = index === 0 || !/[a-zA-Z]/.test(text[index - 1]);
            const after = index + keyword.length === text.length || !/[a-zA-Z]/.test(text[index + keyword.length]);
            return before && after;
        }

        // Unified function to extract text from an element, including hidden text in square brackets
        function extractFullText(element) {
            let text = (element.innerText || element.textContent).toLowerCase();

            // Append the hidden text from <span style="display: none;"> elements, but only if it's inside square brackets
            const hiddenSpans = element.querySelectorAll('span[style="display: none;"]');
            hiddenSpans.forEach(span => {
                const spanText = (span.innerText || span.textContent).toLowerCase();
                const matches = spanText.match(/\[(.*?)\]/g);
                if (matches) {
                    matches.forEach(match => {
                        text += ' ' + match.slice(1, -1); // Remove the square brackets and append the text
                    });
                }
            });

            return text;
        }

        // Scan the last articles
        lastArticles.forEach(article => {
            const fullText = extractFullText(article);

            // Now scan the combined text (visible + hidden)
            lorebookEntries.forEach(entry => {
                entry.keywords.forEach(keyword => {
                    if (isCompleteMatch(fullText, keyword)) {
                        console.log(`Keyword found in article: ${keyword}`);
                        scannedKeywords.add(entry.key);
                    }
                });
            });
        });

        // Scan the last markdown divs
        lastMarkdownDivs.forEach(markdownDiv => {
            const fullText = extractFullText(markdownDiv);

            // Scan the markdown content
            lorebookEntries.forEach(entry => {
                entry.keywords.forEach(keyword => {
                    if (isCompleteMatch(fullText, keyword)) {
                        console.log(`Keyword found in markdown div: ${keyword}`);
                        scannedKeywords.add(entry.key);
                    }
                });
            });
        });

        // Check textarea content for lorebook entries not already mentioned
        let containsKeyword = false;
        const customMessages = [];
        const addedMessages = new Set();
        const processedLorebookEntries = new Set();

        const textContent = textarea.innerText.toLowerCase();
        for (const entry of lorebookEntries) {
            // Check if this lorebook entry has already been processed
            if (processedLorebookEntries.has(entry.key)) {
                continue;
            }

            for (const keyword of entry.keywords) {
                // Condition 1: Keyword not found in articles or markdown divs but found in textarea
                if (!scannedKeywords.has(entry.key) && isCompleteMatch(textContent, keyword) && !addedMessages.has(entry.value)) {
                    console.log(`Keyword found in textarea only: ${keyword}`);
                    containsKeyword = true;
                    customMessages.push(entry.value);
                    addedMessages.add(entry.value);
                    processedLorebookEntries.add(entry.key); // Mark this entry as processed by key
                    if (customMessages.length >= 3) break; // Limit to a maximum of 3 entries
                } else if (
                    lastMarkdownDivs.some(div => isCompleteMatch(extractFullText(div), keyword)) &&
                    !lastArticles.some(article => isCompleteMatch(extractFullText(article), keyword)) &&
                    !addedMessages.has(entry.value)
                ) {
                    console.log(`Keyword found in markdown div but not in articles: ${keyword}`);
                    containsKeyword = true;
                    customMessages.push(entry.value);
                    addedMessages.add(entry.value);
                    processedLorebookEntries.add(entry.key); // Mark this entry as processed by key
                    if (customMessages.length >= 3) break; // Limit to a maximum of 3 entries
                }
            }

            if (customMessages.length >= 3) break; // Limit to a maximum of 3 entries
        }


try {
    if (typeof getRandomEntry === 'function') {
        const randomEntry = getRandomEntry();
        if (randomEntry && !addedMessages.has(randomEntry)) {
            console.log(`Adding random entry: ${randomEntry}`);
            customMessages.push(randomEntry);
            addedMessages.add(randomEntry);
        }
    }
} catch (error) {
    console.error('Error retrieving random entry:', error);
}

try {
    if (typeof getRulesEntry === 'function') {
        const rulesEntry = getRulesEntry();
        if (rulesEntry && !addedMessages.has(rulesEntry)) {
            customMessages.push(rulesEntry);
            addedMessages.add(rulesEntry);
        }
    }
} catch (error) {
    console.error('Error retrieving rules entry:', error);
}


        if (textarea && containsKeyword) {
            textarea.focus();
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.collapse(false); // Move the caret to the end of the selection

                // Create new paragraph elements for each custom message
                customMessages.forEach(message => {
                    console.log(`Adding custom message: ${message}`);
                    const newParagraph = document.createElement('p');
                    newParagraph.textContent = message;
                    textarea.appendChild(newParagraph);
                });

                // Ensure the selection range is updated correctly
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(textarea);
                newRange.collapse(false);
                selection.addRange(newRange);

                console.log('Custom messages added to textarea: ' + customMessages.join(', '));
                callback(true);
            } else {
                console.error('No selection range found.');
                callback(false);
            }
        } else {
            if (!containsKeyword) {
                console.log('No new keywords found in textarea that require additional custom messages.');
            }
            callback(false);
        }
    }






 // Helper to detect if on a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Track Enter key tap timing
let enterKeyTimeout;
let isDoubleTapMode = false;

document.addEventListener('keydown', function (event) {
    const isContentEditable = event.target.tagName.toLowerCase() === 'div' && event.target.isContentEditable;

    if (event.key === 'Enter' && isContentEditable) {

        if (isMobileDevice()) {
            // Mobile behavior: Single tap Enter adds a line break; double-tap sends without adding another line break
            if (isDoubleTapMode) {
                event.preventDefault(); // Prevent adding a second line break
                isDoubleTapMode = false; // Reset mode

                // Call addCustomTextBeforeSend to check if custom text needs to be added
                addCustomTextBeforeSend(function (success) {
                    if (success) {
                        console.log('Custom text added successfully on mobile double-tap.');
                        // Trigger send only after adding custom text
                        ensureSend();
                    } else {
                        console.log('No custom text added on mobile double-tap, no send triggered.');
                    }
                });

                // Stop further event handling
                event.stopImmediatePropagation();
            } else {
                // First tap: set double-tap mode and allow the Enter key to create a new line
                isDoubleTapMode = true;

                // Reset double-tap mode after a short delay
                clearTimeout(enterKeyTimeout);
                enterKeyTimeout = setTimeout(() => {
                    isDoubleTapMode = false;
                }, 500); // 500 ms delay to wait for the second tap
            }
        } else if (!event.shiftKey) {
            // Desktop behavior: Normal Enter to send message with custom text
            addCustomTextBeforeSend(function (success) {
                if (success) {
                    event.preventDefault(); // Prevent default Enter behavior only if custom text was added

                    // Trigger send after adding custom text
                    ensureSend();
                }
            });
            event.stopImmediatePropagation();
        }

    } else if (event.key === 'Enter' && event.shiftKey && isContentEditable) {
        // Desktop Shift + Enter for line break
        console.log('Shift + Enter detected: adding a line break.');

    }
}, true);

function ensureSend() {
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton) {
        setTimeout(() => {
            if (!sendButton.disabled) { // Ensure button is not disabled
                sendButton.click();
            } else {
                console.log('Send button is disabled, retrying...');
                setTimeout(() => {
                    if (!sendButton.disabled) {
                        sendButton.click();
                    }
                }, 200); // Retry after a short delay
            }
        }, 100); // Initial delay to ensure custom text is added first
    } else {
        console.log('Send button not found, retrying...');
        setTimeout(ensureSend, 200); // Retry after a short delay if send button is not found
    }
}





// Create and add the arrow button to open the storage panel
const arrowButton = document.createElement('div');
arrowButton.innerHTML = '&#x2329;'; // Unicode for a more spread left-pointing angle bracket
arrowButton.style.position = 'fixed';
arrowButton.style.bottom = '50%';
arrowButton.style.right = '0'; // Start visible at the screen edge
arrowButton.style.padding = '10px';
arrowButton.style.fontSize = '24px';
arrowButton.style.zIndex = '1000';
arrowButton.style.cursor = 'pointer';
//arrowButton.style.backgroundColor = '#212121';
arrowButton.style.color = '#B4B4B4'; // Light grey color
arrowButton.style.borderRadius = '5px 0 0 5px';
arrowButton.style.transition = 'transform 0.3s ease, right 0.3s ease, background-color 0.1s';

arrowButton.onmouseover = () => {
    arrowButton.style.backgroundColor = 'transparent';
};
arrowButton.onmouseout = () => {
    arrowButton.style.backgroundColor = 'transparent';
};

document.body.appendChild(arrowButton);

// Create the fancy sliding panel
window.storagePanel = document.createElement('div');
storagePanel.style.position = 'fixed';
storagePanel.style.top = '0';
storagePanel.style.right = '-250px'; // Initially hidden
storagePanel.style.height = '100%';
storagePanel.style.width = '250px';
storagePanel.style.backgroundColor = '#171717';
//storagePanel.style.boxShadow = '-4px 0px 8px rgba(0, 0, 0, 0.5)';
storagePanel.style.transition = 'right 0.3s ease';
storagePanel.style.zIndex = '999';

document.body.appendChild(storagePanel);


// Create the header above the button
const storagePanelHeader = document.createElement('div');
storagePanelHeader.innerText = 'ChatGPT Tools';
storagePanelHeader.style.margin = '20px';
storagePanelHeader.style.padding = '10px';
storagePanelHeader.style.fontSize = '19px';
storagePanelHeader.style.fontWeight = '550';
storagePanelHeader.style.color = '#ECECEC';
storagePanelHeader.style.textAlign = 'center';

storagePanel.appendChild(storagePanelHeader);

// Create a divider line
const dividerLine = document.createElement('div');
dividerLine.style.height = '1px';
dividerLine.style.backgroundColor = '#212121'; // Dark grey color for subtle separation
dividerLine.style.margin = '10px 20px'; // Space around the line (top/bottom, left/right)
storagePanel.appendChild(dividerLine);
// Create the button inside the panel
const manageStorageButton = document.createElement('div');

// Wrapping the SVG and text into a flex container
manageStorageButton.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" style="margin-right: 8px;">
      <path d="M10.663 6.3872C10.8152 6.29068 11 6.40984 11 6.59007V8C11 8.55229 11.4477 9 12 9C12.5523 9 13 8.55229 13 8V6.59007C13 6.40984 13.1848 6.29068 13.337 6.3872C14.036 6.83047 14.5 7.61105 14.5 8.5C14.5 9.53284 13.8737 10.4194 12.9801 10.8006C12.9932 10.865 13 10.9317 13 11V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V11C11 10.9317 11.0068 10.865 11.0199 10.8006C10.1263 10.4194 9.5 9.53284 9.5 8.5C9.5 7.61105 9.96397 6.83047 10.663 6.3872Z" fill="currentColor"></path>
      <path d="M17.9754 4.01031C17.8588 4.00078 17.6965 4.00001 17.4 4.00001H9.8C8.94342 4.00001 8.36113 4.00078 7.91104 4.03756C7.47262 4.07338 7.24842 4.1383 7.09202 4.21799C6.7157 4.40974 6.40973 4.7157 6.21799 5.09202C6.1383 5.24842 6.07337 5.47263 6.03755 5.91104C6.00078 6.36113 6 6.94343 6 7.80001V16.1707C6.31278 16.0602 6.64937 16 7 16H18L18 4.60001C18 4.30348 17.9992 4.14122 17.9897 4.02464C17.9893 4.02 17.9889 4.0156 17.9886 4.01145C17.9844 4.01107 17.98 4.01069 17.9754 4.01031ZM17.657 18H7C6.44772 18 6 18.4477 6 19C6 19.5523 6.44772 20 7 20H17.657C17.5343 19.3301 17.5343 18.6699 17.657 18ZM4 19L4 7.75871C3.99999 6.95374 3.99998 6.28937 4.04419 5.74818C4.09012 5.18608 4.18868 4.66938 4.43597 4.18404C4.81947 3.43139 5.43139 2.81947 6.18404 2.43598C6.66937 2.18869 7.18608 2.09012 7.74818 2.0442C8.28937 1.99998 8.95373 1.99999 9.7587 2L17.4319 2C17.6843 1.99997 17.9301 1.99994 18.1382 2.01695C18.3668 2.03563 18.6366 2.07969 18.908 2.21799C19.2843 2.40974 19.5903 2.7157 19.782 3.09203C19.9203 3.36345 19.9644 3.63318 19.9831 3.86178C20.0001 4.06994 20 4.31574 20 4.56812L20 17C20 17.1325 19.9736 17.2638 19.9225 17.386C19.4458 18.5253 19.4458 19.4747 19.9225 20.614C20.0517 20.9227 20.0179 21.2755 19.8325 21.5541C19.6471 21.8326 19.3346 22 19 22H7C5.34315 22 4 20.6569 4 19Z" fill="currentColor"></path>
    </svg>
    <span>Manage Lorebook</span>
  </div>
`;

manageStorageButton.style.marginTop = '20px';
manageStorageButton.style.marginLeft = '5px';
manageStorageButton.style.marginRight = '5px';
manageStorageButton.style.padding = '7px 15px';
manageStorageButton.style.fontSize = '16px';
manageStorageButton.style.cursor = 'pointer';
manageStorageButton.style.backgroundColor = 'transparent';
manageStorageButton.style.color = '#b0b0b0'; // Light grey text color
manageStorageButton.style.borderRadius = '8px';
manageStorageButton.style.textAlign = 'center';
manageStorageButton.style.transition = 'background-color 0.1s, color 0.1s';

manageStorageButton.onmouseover = () => {
  manageStorageButton.style.backgroundColor = '#212121';
  manageStorageButton.style.color = '#ffffff';
};
manageStorageButton.onmouseout = () => {
  manageStorageButton.style.backgroundColor = 'transparent';
  manageStorageButton.style.color = '#b0b0b0';
};


let isStoragePanelOpen = false;
manageStorageButton.addEventListener('click', () => {
    if (!isStoragePanelOpen) {
        createStoragePanel();
        isStoragePanelOpen = true;
    }

});

// Add the button to the panel
storagePanel.appendChild(manageStorageButton);

// Toggle panel visibility
arrowButton.addEventListener('click', () => {
    if (storagePanel.style.right === '-250px') {
        storagePanel.style.right = '0';
        arrowButton.style.right = '250px'; // Clamp arrow button to the panel border
        arrowButton.style.transform = 'rotate(180deg)'; // Rotate the arrow
    } else {
        storagePanel.style.right = '-250px';
        arrowButton.style.right = '0'; // Keep arrow button visible at the screen edge
        arrowButton.style.transform = 'rotate(0deg)';
    }
});





    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '1000';


    // Create the panel for managing local storage
function createStoragePanel() {



    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '50%';
    panel.style.left = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    panel.style.backgroundColor = '#2F2F2F';
    panel.style.padding = '30px';
//    panel.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.7)';
    panel.style.zIndex = '1001';
    panel.style.width = '800px';
    panel.style.height = '700px';
    panel.style.borderRadius = '20px';
    panel.style.color = '#f1f1f1';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.maxHeight = '80vh';
    panel.style.overflow = 'hidden';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'row';

// Profile Selection Area
const profileContainer = document.createElement('div');
profileContainer.style.width = '150px';
profileContainer.style.minWidth = '150px';
profileContainer.style.flexShrink = '0';
profileContainer.style.marginRight = '20px';
profileContainer.style.marginLeft = '-20px';
profileContainer.style.display = 'flex';
profileContainer.style.flexDirection = 'column';
profileContainer.style.backgroundColor = '#2F2F2F';
profileContainer.style.padding = '10px';
profileContainer.style.borderRight = '0.5px solid #444444'; // Thin border at the top only


const profileTitle = document.createElement('h4');
profileTitle.innerText = 'Profiles';
profileTitle.style.color = '#ffffff';
profileTitle.style.marginBottom = '10px';

const profileList = document.createElement('div');
profileList.style.flexGrow = '1';
profileList.style.overflowY = 'auto';
profileList.style.marginBottom = '10px';

let selectedProfile = localStorage.getItem('selectedProfile');

// Load existing profiles from localStorage
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.toLowerCase().startsWith('profile:')) {
        const profileName = key.replace('profile:', '');

        // Create a container for each profile entry
        const profileEntryContainer = document.createElement('div');
        profileEntryContainer.style.display = 'flex';
        profileEntryContainer.style.alignItems = 'center';
        profileEntryContainer.style.marginBottom = '5px'; // Add space between profiles

        // Highlight the selected profile
        if (profileName === selectedProfile) {
            profileEntryContainer.style.backgroundColor = '#424242';
            profileEntryContainer.style.borderRadius = '5px';
            profileEntryContainer.style.padding = '5px';
        }

        // Create the div for displaying profile name
        const profileDiv = document.createElement('div');
        profileDiv.innerText = profileName;
        profileDiv.style.flexGrow = '1'; // Allows profile name to take up available space
        profileDiv.style.cursor = 'pointer';

        profileDiv.onclick = () => {
            localStorage.setItem('selectedProfile', profileName);
            selectedProfile = profileName;
            document.body.removeChild(panel);
            createStoragePanel();
        };

// Create the remove button for each profile
const removeProfileButton = document.createElement('button');
removeProfileButton.innerText = '✕';
removeProfileButton.style.backgroundColor = 'transparent';
removeProfileButton.style.borderRadius = '50%';
removeProfileButton.style.marginLeft = '10px';
removeProfileButton.style.border = 'none';
removeProfileButton.style.color = '#ffffff';
removeProfileButton.style.cursor = 'pointer';
removeProfileButton.style.padding = '14px';
removeProfileButton.style.width = '15px';
removeProfileButton.style.height = '15px';
removeProfileButton.style.display = 'flex';
removeProfileButton.style.alignItems = 'center';
removeProfileButton.style.justifyContent = 'center';
//removeProfileButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
removeProfileButton.style.transition = 'background-color 0.1s';

// Hover effect
removeProfileButton.addEventListener('mouseenter', () => {
//    closeButton.style.transform = 'scale(1.1)';
    removeProfileButton.style.backgroundColor = '#676767';
});

removeProfileButton.addEventListener('mouseleave', () => {
//    closeButton.style.transform = 'scale(1)';
    removeProfileButton.style.backgroundColor = 'transparent';
});


        // Remove profile on click
        removeProfileButton.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering profile selection
            const confirmation = confirm(`Are you sure you want to delete the profile "${profileName}"?`);
            if (confirmation) {
                // Remove all lorebook entries associated with this profile
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(`${profileName}-lorebook:`)) {
                        localStorage.removeItem(key);
                    }
                }
                // Remove the profile itself
                localStorage.removeItem(`profile:${profileName}`);
                document.body.removeChild(panel);
                createStoragePanel(); // Refresh the panel
            }
        };

        // Append profile name and remove button to profile container
        profileEntryContainer.appendChild(profileDiv);
        profileEntryContainer.appendChild(removeProfileButton);

        // Append profile container to the list
        profileList.appendChild(profileEntryContainer);
    }
}


// Add profile button
const addProfileButton = document.createElement('button');
addProfileButton.innerText = '+ Add Profile';
addProfileButton.style.padding = '8px';
addProfileButton.style.border = '0.2px solid #4E4E4E';

addProfileButton.style.backgroundColor = 'transparent';
addProfileButton.style.color = '#fff';
addProfileButton.style.borderRadius = '20px';
addProfileButton.style.cursor = 'pointer';
//addProfileButton.style.boxShadow = '0px 3px 6px rgba(0, 0, 0, 0.3)';
//addProfileButton.style.transition = 'background-color 0.3s';

// Hover effect on add profile button
addProfileButton.onmouseover = () => {
    addProfileButton.style.backgroundColor = '#424242';
};
addProfileButton.onmouseout = () => {
    addProfileButton.style.backgroundColor = 'transparent';
};

// Action to add new profile
addProfileButton.onclick = () => {
    const profileName = prompt('Enter new profile name:');
    if (profileName && !localStorage.getItem(`profile:${profileName}`)) {
        localStorage.setItem(`profile:${profileName}`, '');
        document.body.removeChild(panel);
        createStoragePanel();
    } else if (profileName) {
        alert('Profile with this name already exists.');
    }
};

// Panel structure
profileContainer.appendChild(profileTitle);
profileContainer.appendChild(profileList);
profileContainer.appendChild(addProfileButton);

panel.appendChild(profileContainer);


    // Main Entries Area
    const entriesArea = document.createElement('div');
    entriesArea.style.flexGrow = '1';
    entriesArea.style.display = 'flex';
    entriesArea.style.flexDirection = 'column';

    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = '15px';

    const title = document.createElement('h3');
    title.innerText = 'Manage Lorebook Entries';
    title.style.fontWeight = 'normal';
    title.style.color = '#ffffff';
    title.style.textAlign = 'center';

// Close button code
const closeButton = document.createElement('button');
closeButton.innerText = '✕';
closeButton.style.padding = '3px 8px';
closeButton.style.border = 'none';
closeButton.style.backgroundColor = 'transparent';
closeButton.style.borderRadius = '50%';
closeButton.style.marginLeft = '10px';
closeButton.style.color = '#ffffff';
closeButton.style.cursor = 'pointer';
//closeButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
closeButton.style.transition = 'background-color 0.1s';
closeButton.style.display = 'flex';
closeButton.style.alignItems = 'center';
closeButton.style.justifyContent = 'center';

// Hover effect
closeButton.addEventListener('mouseenter', () => {
//    closeButton.style.transform = 'scale(1.1)';
    closeButton.style.backgroundColor = '#676767';
});

closeButton.addEventListener('mouseleave', () => {
//    closeButton.style.transform = 'scale(1)';
    closeButton.style.backgroundColor = 'transparent';
});


closeButton.onclick = () => {
    document.body.removeChild(panel);
    document.body.removeChild(overlay); // Remove overlay as well
        isStoragePanelOpen = false;
    // Set focus back to the main content
    const mainContent = document.querySelector('#main-content'); // Replace with the actual element
    if (mainContent) {
        mainContent.focus();
    }
};

    headerContainer.appendChild(title);
    headerContainer.appendChild(closeButton);
    entriesArea.appendChild(headerContainer);

    let editingKey = null; // Keep track of the entry being edited

// Container for entries list with scrollbar
const entriesContainer = document.createElement('div');
entriesContainer.style.maxHeight = '50vh';
entriesContainer.style.overflowY = 'auto';
entriesContainer.style.flexGrow = '1';
entriesContainer.style.paddingRight = '20px'; // Adjust padding to ensure full-width visibility

if (selectedProfile) {
    const profilePrefix = `${selectedProfile}-lorebook:`;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(profilePrefix)) {
            const value = localStorage.getItem(key);
            const cleanedValue = value.replace(/^<\[Lorebook:\s*[\w\s,]+\]\s*|>$/g, '');

            const entryDiv = document.createElement('div');
            entryDiv.style.marginBottom = '12px';
            entryDiv.style.padding = '10px';
            entryDiv.style.backgroundColor = '#424242';
            entryDiv.style.borderRadius = '8px';
//            entryDiv.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.3)';
            entryDiv.style.display = 'flex';
            entryDiv.style.flexDirection = 'column';
            entryDiv.style.position = 'relative';
            entryDiv.style.cursor = 'pointer';


            const entryKeyText = document.createElement('div');
            entryKeyText.innerText = key.replace(`${profilePrefix}`, '');
            entryKeyText.style.color = '#ffffff';
            entryKeyText.style.fontWeight = 'bold';
            entryKeyText.style.marginBottom = '5px';

            const entryValueText = document.createElement('div');
            entryValueText.innerText = cleanedValue;
            entryValueText.style.color = '#dddddd';

const removeButton = document.createElement('button');
removeButton.innerText = '✕';
removeButton.style.backgroundColor = 'transparent';
removeButton.style.borderRadius = '50%';
removeButton.style.marginLeft = '10px';
removeButton.style.border = 'none';
removeButton.style.color = '#949494';
removeButton.style.cursor = 'pointer';
removeButton.style.padding = '14px';
removeButton.style.width = '10px';
removeButton.style.height = '10px';
removeButton.style.display = 'flex';
removeButton.style.alignItems = 'center';
removeButton.style.justifyContent = 'center';
removeButton.style.transition = 'background-color 0.1s';
removeButton.style.position = 'absolute';
removeButton.style.top = '10px';
removeButton.style.right = '10px';

// Hover effect
removeButton.addEventListener('mouseenter', () => {
//    closeButton.style.transform = 'scale(1.1)';
    removeButton.style.backgroundColor = '#676767';
});

removeButton.addEventListener('mouseleave', () => {
//    closeButton.style.transform = 'scale(1)';
    removeButton.style.backgroundColor = 'transparent';
});




            removeButton.onclick = (e) => {
                e.stopPropagation(); // Prevent triggering edit mode
                localStorage.removeItem(key);
                document.body.removeChild(panel);
                createStoragePanel(); // Refresh panel
            };

            entryDiv.appendChild(entryKeyText);
            entryDiv.appendChild(entryValueText);
            entryDiv.appendChild(removeButton);
            entryDiv.onclick = () => {
                newKeyInput.value = key.replace(`${profilePrefix}`, '');
                newValueInput.value = cleanedValue;
                editingKey = key; // Set the key being edited
            };

            entriesContainer.appendChild(entryDiv);
        }
    }
}

entriesArea.appendChild(entriesContainer);



const entrieslabel = document.createElement('div');
entrieslabel.textContent = 'Enter keys and description:';
entrieslabel.style.color = '#dddddd';
entrieslabel.style.fontSize = '14px';
entrieslabel.style.marginBottom = '5px';
entrieslabel.style.marginTop = '5px';
    // Add new entry form
    const newKeyInput = document.createElement('input');
    newKeyInput.type = 'text';
    newKeyInput.placeholder = 'Entry Keywords (comma-separated)';
    newKeyInput.style.width = 'calc(100% - 20px)';
    newKeyInput.style.marginBottom = '15px';
    newKeyInput.style.padding = '10px';
    newKeyInput.style.border = '1px solid #444444';
    newKeyInput.style.borderRadius = '8px';
    newKeyInput.style.backgroundColor = '#1e1e1e';
    newKeyInput.style.color = '#dddddd';


const newValueInput = document.createElement('textarea');
newValueInput.placeholder = ' ';
newValueInput.style.width = 'calc(100% - 20px)';
newValueInput.style.marginBottom = '15px';
newValueInput.style.padding = '10px';
newValueInput.style.border = '1px solid #444444';
newValueInput.style.borderRadius = '8px';
newValueInput.style.backgroundColor = '#1e1e1e';
newValueInput.style.color = '#dddddd';
newValueInput.style.height = '100px';
newValueInput.style.resize = 'vertical';
newValueInput.maxLength = 1000;
newValueInput.style.overflow = 'auto';

const charCounter = document.createElement('div');
charCounter.style.color = '#dddddd';
charCounter.style.fontSize = '12px';
charCounter.style.marginTop = '-10px';
charCounter.style.marginBottom = '15px';
charCounter.style.textAlign = 'right';
charCounter.style.color = 'grey';
charCounter.textContent = `0/${newValueInput.maxLength}`;

// Update the counter as the user types
newValueInput.addEventListener('input', () => {
  charCounter.textContent = `${newValueInput.value.length}/${newValueInput.maxLength}`;
});


    const addButton = document.createElement('button');
    addButton.innerText = 'Add Entry';
    addButton.style.padding = '10px 20px';
    addButton.style.border = '0.2px solid #4E4E4E';
    addButton.style.backgroundColor = '#2F2F2F';
    addButton.style.color = '#fff';
    addButton.style.borderRadius = '50px';
    addButton.style.cursor = 'pointer';

    addButton.onmouseover = () => {
        addButton.style.backgroundColor = '#424242';
    };
    addButton.onmouseout = () => {
        addButton.style.backgroundColor = 'transparent';
    };

    addButton.onclick = () => {
    if (!selectedProfile) {
        alert('Please select a profile first.');
        return;
    }

    const newKeywords = newKeyInput.value.trim().toLowerCase().split(',').map(keyword => keyword.trim());
    if (newKeywords.length === 0 || newKeywords.includes('')) {
        alert('Please enter valid keywords for the entry.');
        return;
    }

    // Get all existing keywords for the selected profile
    const profilePrefix = `${selectedProfile}-lorebook:`;
    const existingKeywords = new Set();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(profilePrefix)) {
            const existingKeyWords = key.replace(profilePrefix, '').split(',').map(keyword => keyword.trim().toLowerCase());
            existingKeyWords.forEach(keyword => existingKeywords.add(keyword));
        }
    }

    // Check for keyword conflicts
    for (const keyword of newKeywords) {
        if (existingKeywords.has(keyword) && editingKey !== `${profilePrefix}${newKeyInput.value.trim()}`) {
            alert(`The keyword "${keyword}" already exists in another entry. Please use different keywords.`);
            return;
        }
    }

    // Proceed with adding or editing the entry
    const key = `${profilePrefix}${newKeyInput.value.trim()}`;
    const value = `<[Lorebook: ${newKeyInput.value.trim()}] ${newValueInput.value}>`;

    if (editingKey) {
        localStorage.removeItem(editingKey); // Remove the old entry if editing
        editingKey = null;
    }
    localStorage.setItem(key, value);
    document.body.removeChild(panel);
    createStoragePanel(); // Refresh panel
};



// Create a container div for the inputs and button
const container = document.createElement('div');
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.padding = '0px';
//container.style.border = '1px solid #444444';
container.style.borderRadius = '0px';
container.style.backgroundColor = '#2F2F2F';
container.style.marginBottom = '0px';
container.style.borderTop = '0.5px solid #444444'; // Thin border at the top only


// Append the entrieslabel, newKeyInput, newValueInput, charCounter, and addButton to the container
container.appendChild(entrieslabel);
container.appendChild(newKeyInput);
container.appendChild(newValueInput);
container.appendChild(charCounter);
container.appendChild(addButton);

// Append the container to the entries area
entriesArea.appendChild(container);

// Add container to the panel
panel.appendChild(entriesArea);
if (!document.querySelector('#overlay')) {
    document.body.appendChild(overlay);
}

document.body.appendChild(panel);

    }

//    manageStorageButton.addEventListener('click', createStoragePanel);
})();