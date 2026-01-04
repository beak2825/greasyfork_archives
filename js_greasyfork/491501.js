// ==UserScript==
// @name        c.ai X Character Creation Helper
// @namespace   c.ai X Character Creation Helper
// @version     2.6
// @license     MIT
// @description Gives visual feedback for the definition
// @author      Vishanka
// @match       https://character.ai/*
// @icon        https://i.imgur.com/iH2r80g.png
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/491501/cai%20X%20Character%20Creation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/491501/cai%20X%20Character%20Creation%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define the new CSS rule
    var newCss = ".custom-char-color { color: #ff4500 !important; }";

    // Create a new <style> tag
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = newCss;

    // Append the <style> tag to the <head> of the document
    document.head.appendChild(style);

const checkElementPresence = (selector, callback, fastIntervalTime = 1000, slowIntervalTime = 5000) => {
    let elementFoundPreviously = false;
    let fastCheck = true;
    let attempts = 0;
    let maxAttempts = 10;

    const checkElement = () => {
        const element = document.querySelector(selector);
        // When element is found for the first time or reappears after being absent
        if (element) {
            if (!elementFoundPreviously) {
                callback(element);
                console.log(`Element ${selector} found and callback applied.`);
                elementFoundPreviously = true;
                // Reset fastCheck to quickly detect if it disappears again
                fastCheck = true;
                attempts = 0;
            }
        } else {
            if (elementFoundPreviously) {
                // Element was found before but now is missing, might have been removed
                console.warn(`Element ${selector} disappeared.`);
                elementFoundPreviously = false;
                // Speed up the checks temporarily to catch the re-appearance
                fastCheck = true;
                attempts = 0;
            }
        }

        // Adjust checking interval based on state
        if (fastCheck && ++attempts >= maxAttempts) {
            // Switch to slower checking after a number of fast attempts
            console.warn(`Switching to slower check for ${selector}.`);
            fastCheck = false;
        }

        // Continuously adjust timeout interval for checking based on fastCheck flag
        setTimeout(checkElement, fastCheck ? fastIntervalTime : slowIntervalTime);
    };

    // Start checking
    checkElement();
};

// Usage example
checkElementPresence('#definitionSelector', (element) => {
    // Apply your action here
    console.log('Action applied to:', element);
});



    // Function to monitor elements on the page
function monitorElements() {
    const containerSelectors = [
        'div.flex-auto:nth-child(1) > div:nth-child(2)', // Container potentially holding the input
        'div.relative:nth-child(5) > div:nth-child(1) > div:nth-child(1)', // Greeting
        'div.relative:nth-child(4) > div:nth-child(1) > div:nth-child(1)'  // Description
    ];

    function updateInputCurrentName(newValue) {
        // Trim leading and trailing spaces and replace internal spaces with hyphens
        const processedValue = newValue.trim().replace(/\s+/g, '-');
        sessionStorage.setItem('inputCurrentName', processedValue);
        console.log(`Updated session storage with new input value: ${processedValue}`);

        // Dispatch a custom event to indicate that the input value has changed
        window.dispatchEvent(new CustomEvent('inputCurrentNameChanged', { detail: { newValue: processedValue } }));
    }

    containerSelectors.forEach(selector => {
        checkElementPresence(selector, (element) => {
            const inputElement = element.querySelector('input');
            if (inputElement) {
                inputElement.addEventListener('input', () => {
                    updateInputCurrentName(inputElement.value);
                });

                // Store initial value in session storage
                updateInputCurrentName(inputElement.value);
            } else {
                console.log(`Content of ${selector}:`, element.textContent);
            }
        });
    });




// Selector for the definition
const definitionSelector = '.transition > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)';
checkElementPresence(definitionSelector, (element) => {
    const textarea = element.querySelector('textarea');
    if (textarea && !document.querySelector('.custom-definition-panel')) {
        // Initial panel setup
        updatePanel(textarea);

        // Listen for the custom event to update the panel
        window.addEventListener('inputCurrentNameChanged', () => {
            updatePanel(textarea);
        });

        // Observer to detect changes in the textarea content
        const observer = new MutationObserver(() => {
            updatePanel(textarea);
        });

        observer.observe(textarea, { attributes: true, childList: true, subtree: true, characterData: true });
    }
});
}




// Function to update or create the DefinitionFeedbackPanel based on textarea content
function updatePanel(textarea) {
    let DefinitionFeedbackPanel = document.querySelector('.custom-definition-panel');
    if (!DefinitionFeedbackPanel) {
        DefinitionFeedbackPanel = document.createElement('div');
        DefinitionFeedbackPanel.classList.add('custom-definition-panel');
        textarea.parentNode.insertBefore(DefinitionFeedbackPanel, textarea);
    }
    DefinitionFeedbackPanel.innerHTML = ''; // Clear existing content
    DefinitionFeedbackPanel.style.border = '0px solid #ccc';
    DefinitionFeedbackPanel.style.padding = '10px';
    DefinitionFeedbackPanel.style.marginBottom = '10px';
    DefinitionFeedbackPanel.style.marginTop = '5px';
    DefinitionFeedbackPanel.style.maxHeight = '500px'; // Adjust the max-height as needed
    DefinitionFeedbackPanel.style.overflowY = 'auto';


    var plaintextColor = localStorage.getItem('plaintext_color');
    var defaultColor = '#D1D5DB';
    var color = plaintextColor || defaultColor;
    DefinitionFeedbackPanel.style.color = color;

    const cleanedContent = textarea.value.trim();
    console.log(`Content of Definition:`, cleanedContent);
    const textLines = cleanedContent.split('\n');

let lastColor = '#222326';
let isDialogueContinuation = false; // Track if the current line continues a dialogue
let prevColor = null; // Track the previous line's color for detecting color changes

let consecutiveCharCount = 0;
let consecutiveUserCount = 0; // Track the number of consecutive {{user}} lines
let lastCharColor = '';
let lastNamedCharacterColor = '';

function determineLineColor(line, prevLine) {
    // Extract the part of the line before the first colon
    const indexFirstColon = line.indexOf(':');
    const firstPartOfLine = indexFirstColon !== -1 ? line.substring(0, indexFirstColon + 1) : line;
    // Define the dialogue starter regex with updated conditions
    const dialogueStarterRegex = /^\{\{(?:char|user|random_user_[^\}]*)\}\}:|^{{[\S\s]+}}:|^[^\s:]+:/;
    const isDialogueStarter = dialogueStarterRegex.test(firstPartOfLine);
    const continuesDialogue = prevLine && prevLine.trim().endsWith(':') && (line.startsWith(' ') || !dialogueStarterRegex.test(firstPartOfLine));

    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    if (isDialogueStarter) {
        isDialogueContinuation = true;
          if (line.startsWith('{{char}}:')) {
            consecutiveCharCount++;
            if (currentTheme === 'dark') {
              lastColor = consecutiveCharCount % 2 === 0 ? '#26272B' : '#292A2E';
              lastCharColor = lastColor;
            } else {
              lastColor = consecutiveCharCount % 2 === 0 ? '#E4E4E7' : '#E3E3E6';
              lastCharColor = lastColor;
            }
        } else if (line.startsWith('{{user}}:')) {
            consecutiveUserCount++;
    if (currentTheme === 'dark') {
        lastColor = consecutiveUserCount % 2 === 0 ? '#363630' : '#383832';
    } else {
        lastColor = consecutiveUserCount % 2 === 0 ? '#D9D9DF' : '#D5D5DB'; // Light theme color
    }
            consecutiveCharCount = 0; // Reset this if you need to ensure it only affects consecutive {{char}} dialogues

        } else if (line.match(/^\{\{(?:char|user|random_user_[^\}]*)\}\}:|^{{[\S\s]+}}:|^[\S]+:/)) {
            if (currentTheme === 'dark') {
            lastNamedCharacterColor = lastNamedCharacterColor === '#474747' ? '#4C4C4D' : '#474747';
            } else {
            lastNamedCharacterColor = lastNamedCharacterColor === '#CFDCE8' ? '#CCDAE6' : '#CFDCE8';
            }
            lastColor = lastNamedCharacterColor;
        }
          else if (line.match(/^\{\{random_user_[^\}]*\}\}:|^\{\{random_user_\}\}:|^{{random_user_}}/)) {
            if (currentTheme === 'dark') {
            lastNamedCharacterColor = lastNamedCharacterColor === '#474747' ? '#4C4C4D' : '#474747';
            } else {
            lastNamedCharacterColor = lastNamedCharacterColor === '#CFDCE8' ? '#CCDAE6' : '#CFDCE8';
            }
            lastColor = lastNamedCharacterColor;
        } else {
            consecutiveCharCount = 0;
            if (currentTheme === 'dark') {
            lastColor = '#474747' ? '#4C4C4D' : '#474747'; // Default case for non-{{char}} dialogues; adjust as needed
            } else {
            lastColor = '#CFDCE8' ? '#CCDAE6' : '#CFDCE8';
            }
        }
    } else if (line.startsWith('END_OF_DIALOG')) {
        isDialogueContinuation = false;
        lastColor = 'rgba(65, 65, 66, 0)';
    } else if (isDialogueContinuation && continuesDialogue) {
        // Do nothing, continuation of dialogue
    } else if (isDialogueContinuation && !isDialogueStarter) {
        // Do nothing, continuation of dialogue
    } else {
        isDialogueContinuation = false;
        lastColor = 'rgba(65, 65, 66, 0)';
    }
    return lastColor;
}


// Function to remove dialogue starters from the start of a line
let trimmedParts = []; // Array to store trimmed parts
let consecutiveLines = []; // Array to store consecutive lines with the same color
//let prevColor = null;

function trimDialogueStarters(line) {
    // Find the index of the first colon
    const indexFirstColon = line.indexOf(':');
    // If there's no colon, return the line as is
    if (indexFirstColon === -1) return line;

    // Extract the part of the line before the first colon to check against the regex
    const firstPartOfLine = line.substring(0, indexFirstColon + 1);

    // Define the dialogue starter regex
    const dialogueStarterRegex = /^(\{\{char\}\}:|\{\{user\}\}:|\{\{random_user_[^\}]*\}\}:|^{{[\S\s]+}}:|^[^\s:]+:)\s*/;

    // Check if the first part of the line matches the dialogue starter regex
    const trimmed = firstPartOfLine.match(dialogueStarterRegex);
    if (trimmed) {
        // Store the trimmed part
        trimmedParts.push(trimmed[0]);
        // Return the line without the dialogue starter and any leading whitespace that follows it
        return line.substring(indexFirstColon + 1).trim();
    }

    // If the first part doesn't match, return the original line
    return line;
}

function groupConsecutiveLines(color, lineDiv) {
    // Check if there are consecutive lines with the same color
    if (consecutiveLines.length > 0 && consecutiveLines[0].color === color) {
        consecutiveLines.push({ color, lineDiv });
    } else {
        // If not, append the previous group of consecutive lines and start a new group
        appendConsecutiveLines();
        consecutiveLines.push({ color, lineDiv });
    }
}



function appendConsecutiveLines() {
    if (consecutiveLines.length > 0) {
        const groupDiv = document.createElement('div');
        const color = consecutiveLines[0].color;

        const containerDiv = document.createElement('div');
        containerDiv.style.width = '100%';

        groupDiv.style.backgroundColor = color;
        groupDiv.style.padding = '12px';
        groupDiv.style.paddingBottom = '15px'; // Increased bottom padding to provide space
        groupDiv.style.borderRadius = '16px';
        groupDiv.style.display = 'inline-block';
        groupDiv.style.maxWidth = '90%';
        groupDiv.style.position = 'relative'; // Set position as relative for the absolute positioning of countDiv

        if (color === '#363630' || color === '#383832' || color === '#D9D9DF' || color === '#D5D5DB') {
            containerDiv.style.display = 'flex';
            containerDiv.style.justifyContent = 'flex-end';
        }

        // Calculate total number of characters across all lines
        const totalSymbolCount = consecutiveLines.reduce((acc, { lineDiv }) => acc + lineDiv.textContent.length, 0);

        consecutiveLines.forEach(({ lineDiv }) => {
            const lineContainer = document.createElement('div');

            lineContainer.style.display = 'flex';
            lineContainer.style.justifyContent = 'space-between';
            lineContainer.style.alignItems = 'flex-end'; // Ensure items align to the bottom
            lineContainer.style.width = '100%'; // Ensure container takes full width

            lineDiv.style.flexGrow = '1'; // Allow lineDiv to grow and fill space
            // Append the lineDiv to the container
            lineContainer.appendChild(lineDiv);

            // Append the container to the groupDiv
            groupDiv.appendChild(lineContainer);
        });

        const countDiv = document.createElement('div');
        countDiv.textContent = `${totalSymbolCount}`;
        countDiv.style.position = 'absolute'; // Use absolute positioning
        countDiv.style.bottom = '3px'; // Position at the bottom
        countDiv.style.right = '12px'; // Position on the right
        countDiv.style.fontSize = '11px';
// darkmode user
        if (color === '#363630' || color === '#383832'){
            countDiv.style.color = '#5C5C52';
//lightmode user
        } else if (color === '#D9D9DF' || color === '#D5D5DB') {
            countDiv.style.color = '#B3B3B8';
//darkmode char
        } else if (color === '#26272B' || color === '#292A2E') {
          countDiv.style.color = '#44464D';
//lightmode char
        } else if (color === '#E4E4E7' || color === '#E3E3E6') {
          countDiv.style.color = '#C4C4C7';
//darkmode random
        } else if (color === '#474747' || color === '#4C4C4D') {
          countDiv.style.color = '#6E6E6E';
//lightmode random
        } else if (color === '#CFDCE8' || color === '#CCDAE6') {
          countDiv.style.color = '#B4BFC9';
        } else {
          countDiv.style.color = 'rgba(65, 65, 66, 0)';
        }

        // Append the countDiv to the groupDiv
        groupDiv.appendChild(countDiv);

        // Add the groupDiv to the containerDiv (flex or not based on color)
        containerDiv.appendChild(groupDiv);

        // Append the containerDiv to the DefinitionFeedbackPanel
        DefinitionFeedbackPanel.appendChild(containerDiv);
        consecutiveLines = []; // Clear the array
    }
}




function formatText(text) {
    // Retrieve the value of 'inputCurrentName' from session storage
const inputCurrentName = sessionStorage.getItem('inputCurrentName') || '';

text = text.replace(/(?:{{)+char(?:}})+|{{((?!{{char}}|{{user}}|random_user_)[^}]+)}}/g, function(match, p1) {
    if (match.includes('char')) {
        return match.replace(/{{char}}/g, inputCurrentName);
    } else if (p1 === 'user') {
        return match;
    } else {
        return p1.replace(/ /g, '-');
    }
});


    // Process bold italic before bold or italic to avoid nesting conflicts
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<em><strong>$1</strong></em>');
    // Replace text wrapped in double asterisks with <strong> tags for bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Replace text wrapped in single asterisks with <em> tags for italics
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    return text;
}


textLines.forEach((line, index) => {
    const prevLine = index > 0 ? textLines[index - 1] : null;
    const currentColor = determineLineColor(line, prevLine);
    const trimmedLine = trimDialogueStarters(line);

    if (prevColor && currentColor !== prevColor) {
        appendConsecutiveLines(); // Append previous group of consecutive lines

        const spacingDiv = document.createElement('div');
        spacingDiv.style.marginBottom = '20px';
        DefinitionFeedbackPanel.appendChild(spacingDiv);
    }

    const lineDiv = document.createElement('div');
    lineDiv.style.wordWrap = 'break-word'; // Allow text wrapping

    if (trimmedLine.startsWith("END_OF_DIALOG")) {
        appendConsecutiveLines(); // Make sure to append any pending groups before adding the divider
        const separatorLine = document.createElement('hr');
        DefinitionFeedbackPanel.appendChild(separatorLine); // This ensures the divider is on a new line
    } else {
        if (trimmedParts.length > 0) {
            const headerDiv = document.createElement('div');
            let headerText = trimmedParts.shift();

            // Apply replacements for '{{char}}' and other placeholders within double curly brackets
            headerText = headerText.replace(/{{char}}/g, sessionStorage.getItem('inputCurrentName') || '');

            // Apply logic to handle text within curly brackets, excluding '{{user}}'
headerText = headerText.replace(/{{((?!random_user_)[^}]+)}}/g, function(match, p1) {
    if (p1 === 'user') {
        return match;
    }
    return p1.replace(/ /g, '-');
});


            headerText = headerText.replace(/:/g, ''); // Remove colons
            headerDiv.textContent = headerText;

            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            headerDiv.style.color = currentTheme === 'dark' ? '#A2A2AC' : '#26272B';
            if (headerText.includes('{{user}}')) {
                headerDiv.style.textAlign = 'right';
            }
            DefinitionFeedbackPanel.appendChild(headerDiv);
        }

        if (trimmedLine.trim() === '') {
            lineDiv.appendChild(document.createElement('br'));
        } else {
            const paragraph = document.createElement('p');
            // Call formatTextForItalics to wrap text in asterisks with <em> tags
            paragraph.innerHTML = formatText(trimmedLine);
            lineDiv.appendChild(paragraph);
        }

        groupConsecutiveLines(currentColor, lineDiv);
    }

    prevColor = currentColor;
});

appendConsecutiveLines();



}


    // Monitor for URL changes to re-initialize element monitoring
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            console.log("URL changed. Re-initializing element monitoring.");
            currentUrl = window.location.href;
            monitorElements();
        }
    }, 1000);

    monitorElements();
})();