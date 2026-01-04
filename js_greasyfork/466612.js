// ==UserScript==
// @name        Character.AI Text Color
// @namespace   Character.AI Text Color by Vishanka
// @match       https://*.character.ai/*
// @grant       none
// @license     MIT
// @version     2.3
// @author      Vishanka via chatGPT
// @description Lets you change the text colors as you wish and highlight chosen words
// @icon        https://i.imgur.com/ynjBqKW.png
// @downloadURL https://update.greasyfork.org/scripts/466612/CharacterAI%20Text%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/466612/CharacterAI%20Text%20Color.meta.js
// ==/UserScript==


(function () {
 var plaintextColor = localStorage.getItem('plaintext_color');

  // Default color if 'plaintext_color' is not set
  var defaultColor = '#958C7F';

  // Use the retrieved color or default color
  var color = plaintextColor || defaultColor;

  // Create the CSS style
  var css =
    "p, .swiper-no-swiping div { color: " + color + " !important; font-family: 'Noto Sans', sans-serif !important; }";

  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css;
  head.appendChild(style);



})();

function changeColors() {
  const pTags = document.getElementsByTagName("p");
  for (let i = 0; i < pTags.length; i++) {
    const pTag = pTags[i];
    if (
      pTag.dataset.colorChanged === "true" ||
      pTag.querySelector("code") ||
      pTag.querySelector("img")
    ) {
      continue;
    }
    let text = pTag.innerHTML;

    const aTags = pTag.getElementsByTagName("a"); // Get all <a> tags within the <p> tag

    // Remove the <a> tags temporarily
    for (let j = 0; j < aTags.length; j++) {
      const aTag = aTags[j];
      text = text.replace(aTag.outerHTML, "REPLACE_ME_" + j); // Use a placeholder to be able to restore the links later
    }

//Changes Text within Quotation Marks to white
  text = text.replace(/(["“”«»].*?["“”«»])/g, `<span style="color: ${localStorage.getItem('quotationmarks_color') || '#FFFFFF'}">$1</span>`);
//Changes Text within Quotation Marks and a comma at the end to yellow
//  text = text.replace(/(["“”«»][^"]*?,["“”«»])/g, '<span style="color: #E0DF7F">$1</span>');
// Changes Italic Text Color
  text = text.replace(/<em>(.*?)<\/em>/g,`<span style="color: ${localStorage.getItem('italic_color') || '#E0DF7F'}; font-style: italic;">$1</span>`);
// Changes Textcolor within Percentages to blue
//  text = text.replace(/([%][^"]*?[%])/g, '<span style="color: #0000FF">$1</span>');

var wordlist_cc = JSON.parse(localStorage.getItem('wordlist_cc')) || [];

// Check if the wordlist is not empty before creating the regex
if (wordlist_cc.length > 0) {
    // Escape special characters in each word and join them with the "|" operator
    var wordRegex = new RegExp('\\b(' + wordlist_cc.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi');

    // Replace matching words in the text
    text = text.replace(wordRegex, `<span style="color: ${localStorage.getItem('custom_color') || '#FFFFFF'}">$1</span>`);
}



    // Restore the <a> tags
    for (let j = 0; j < aTags.length; j++) {
      const aTag = aTags[j];
      text = text.replace("REPLACE_ME_" + j, aTag.outerHTML);
    }

    pTag.innerHTML = text;
    pTag.dataset.colorChanged = "true";
  }

  console.log("Changed colors");
}

const observer = new MutationObserver(changeColors);
observer.observe(document, { subtree: true, childList: true });
changeColors();



function createButton(symbol, onClick) {
    const colorpalettebutton = document.createElement('button');
    colorpalettebutton.innerHTML = symbol;
    colorpalettebutton.style.position = 'relative';
    colorpalettebutton.style.background = 'none';
    colorpalettebutton.style.border = 'none';
    colorpalettebutton.style.fontSize = '18px';
    colorpalettebutton.style.top = '-5px';
    colorpalettebutton.style.cursor = 'pointer';
    colorpalettebutton.addEventListener('click', onClick);
    return colorpalettebutton;
}

// Function to create the color selector panel
function createColorPanel() {
    const panel = document.createElement('div');
    panel.id = 'colorPanel';
    panel.style.position = 'fixed';
    panel.style.top = '50%';
    panel.style.left = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    panel.style.border = 'none';
    panel.style.borderRadius = '5px';
    panel.style.padding = '20px';
//    panel.style.border = '2px solid #000';
    panel.style.zIndex = '9999';

    const categories = ['italic', 'quotationmarks', 'plaintext', 'custom'];

    const colorPickers = {};

    // Set a fixed width for the labels
    const labelWidth = '150px';

    categories.forEach(category => {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';

        // Retrieve stored color from local storage
        const storedColor = localStorage.getItem(`${category}_color`);
        if (storedColor) {
            colorPicker.value = storedColor;
        }

        colorPickers[category] = colorPicker;

        // Create a div to hold color picker
        const colorDiv = document.createElement('div');
        colorDiv.style.position = 'relative';
        colorDiv.style.width = '20px';
        colorDiv.style.height = '20px';
        colorDiv.style.marginLeft = '10px';
        colorDiv.style.top = '5px';
        colorDiv.style.backgroundColor = colorPicker.value;
        colorDiv.style.display = 'inline-block';
        colorDiv.style.marginRight = '10px';
        colorDiv.style.cursor = 'pointer';
colorDiv.style.border = '1px solid black';


        // Event listener to open color picker when the color square is clicked
        colorDiv.addEventListener('click', function () {
            colorPicker.click();
        });

        // Event listener to update the color div when the color changes
        colorPicker.addEventListener('input', function () {
            colorDiv.style.backgroundColor = colorPicker.value;
        });

        const label = document.createElement('label');
        label.style.width = labelWidth; // Set fixed width for the label
        label.appendChild(document.createTextNode(`${category}: `));

        // Reset button for each color picker
        const resetButton = createButton('↺', function () {
            colorPicker.value = getDefaultColor(category);
            colorDiv.style.backgroundColor = colorPicker.value;
        });
        resetButton.style.position = 'relative';
        resetButton.style.top = '1px';
        // Create a div to hold label, color picker, and reset button
        const containerDiv = document.createElement('div');
        containerDiv.appendChild(label);
        containerDiv.appendChild(colorDiv);
        containerDiv.appendChild(resetButton);

        panel.appendChild(containerDiv);
        panel.appendChild(document.createElement('br'));
    });

    // Custom word list input
    const wordListInput = document.createElement('input');
    wordListInput.type = 'text';
    wordListInput.placeholder = 'Separate words with commas';
    wordListInput.style.width = '250px';
    wordListInput.style.height = '35px';
    wordListInput.style.borderRadius = '3px';
    wordListInput.style.marginBottom = '10px';
    panel.appendChild(wordListInput);
    panel.appendChild(document.createElement('br'));

    const wordListContainer = document.createElement('div');
    wordListContainer.style.display = 'flex';
    wordListContainer.style.flexWrap = 'wrap';
    wordListContainer.style.maxWidth = '300px'; // Set a fixed maximum width for the container

    // Display custom word list buttons
    const wordListArray = JSON.parse(localStorage.getItem('wordlist_cc')) || [];
    const wordListButtons = [];

function createWordButton(word) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const removeSymbol = isMobile ? '×' : '🞮';

    const wordButton = createButton(`${word} ${removeSymbol}`, function() {
        // Remove the word from the list and update the panel
        const index = wordListArray.indexOf(word);
        if (index !== -1) {
            wordListArray.splice(index, 1);
            updateWordListButtons();
        }
    });

// Word Buttons
    wordButton.style.borderRadius = '3px';
    wordButton.style.border = 'none';
    wordButton.style.backgroundColor = 'lightsteelblue';
    wordButton.style.marginBottom = '5px';
    wordButton.style.marginRight = '5px';
    wordButton.style.fontSize = '16px';
    wordButton.classList.add('word-button');
    return wordButton;
}

    function updateWordListButtons() {
        wordListContainer.innerHTML = ''; // Clear the container
        wordListArray.forEach(word => {
            const wordButton = createWordButton(word);
            wordListContainer.appendChild(wordButton);
        });
    }

    // Append wordListContainer to the panel



updateWordListButtons();

// Add Words button
const addWordsButton = document.createElement('button');
addWordsButton.textContent = 'Add';
addWordsButton.style.marginTop = '-8px';
addWordsButton.style.marginLeft = '5px';
addWordsButton.style.borderRadius = '3px';
addWordsButton.style.border = 'none';
addWordsButton.style.backgroundColor = 'lightsteelblue';
addWordsButton.addEventListener('click', function() {
    // Get the input value, split into words, and add to wordListArray
    const wordListValue = wordListInput.value;
const newWords = wordListValue.split(',').map(word => word.trim().toLowerCase()).filter(word => word !== ''); // Convert to lowercase and remove empty entries
    wordListArray.push(...newWords);

    // Update the word list buttons in the panel
    updateWordListButtons();
});

// Create a div to group the input and button on the same line
const inputButtonContainer = document.createElement('div');
inputButtonContainer.style.display = 'flex';
inputButtonContainer.style.alignItems = 'center';

inputButtonContainer.appendChild(wordListInput);
inputButtonContainer.appendChild(addWordsButton);

// Append the container to the panel
panel.appendChild(inputButtonContainer);
    panel.appendChild(wordListContainer);
// Create initial word list buttons
updateWordListButtons();


    // OK button
    const okButton = document.createElement('button');
    okButton.textContent = 'Confirm';
    okButton.style.marginTop = '-20px';
    okButton.style.width = '75px';
    okButton.style.height = '35px';
    okButton.style.marginRight = '5px';
    okButton.style.borderRadius = '3px';
    okButton.style.border = 'none';
    okButton.style.backgroundColor = 'lightsteelblue';
okButton.style.position = 'relative';
okButton.style.left = '24%';
//okButton.style.transform = 'translateX(-50%)';
    okButton.addEventListener('click', function() {
        // Save selected colors to local storage
        categories.forEach(category => {
            const oldValue = localStorage.getItem(`${category}_color`);
            const newValue = colorPickers[category].value;

            if (oldValue !== newValue) {
                localStorage.setItem(`${category}_color`, newValue);

                // If 'plaintext' color is changed, auto-reload the page
                if (category === 'plaintext') {
                    window.location.reload();
                }
            }
        });

// Save custom word list to local storage
const wordListValue = wordListInput.value;
const newWords = wordListValue.split(',').map(word => word.trim().toLowerCase()).filter(word => word !== ''); // Convert to lowercase and remove empty entries
const uniqueNewWords = Array.from(new Set(newWords)); // Remove duplicates

// Check for existing words and add only new ones
uniqueNewWords.forEach(newWord => {
  if (!wordListArray.includes(newWord)) {
    wordListArray.push(newWord);
  }
});

localStorage.setItem('wordlist_cc', JSON.stringify(wordListArray));

updateWordListButtons();

        // Close the panel
        panel.remove();
    });

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.marginTop = '-20px';
    cancelButton.style.borderRadius = '3px';
    cancelButton.style.width = '75px';
    cancelButton.style.marginLeft = '5px';
    cancelButton.style.height = '35px';
    cancelButton.style.border = 'none';
    cancelButton.style.backgroundColor = 'darkgrey';
    cancelButton.style.position = 'relative';
    cancelButton.style.left = '25%';
    cancelButton.addEventListener('click', function() {
        // Close the panel without saving
        panel.remove();
    });

    panel.appendChild(document.createElement('br'));
    panel.appendChild(okButton);
    panel.appendChild(cancelButton);

    document.body.appendChild(panel);
}



// Function to get the default color for a category
function getDefaultColor(category) {
    const defaultColors = {
        'italic': '#E0DF7F',
        'quotationmarks': '#FFFFFF',
        'plaintext': '#958C7F',
        'custom': '#E0DF7F'
    };
    return defaultColors[category];
}

const mainButton = createButton('', function() {
    const colorPanelExists = document.getElementById('colorPanel');
    if (!colorPanelExists) {
        createColorPanel();
    }
});

// Set the background image of the button to the provided image
mainButton.style.backgroundImage = "url('https://i.imgur.com/yBgJ3za.png')";
mainButton.style.backgroundSize = "cover";
mainButton.style.top = "0px";
mainButton.style.width = "22px";  // Adjust the width and height as needed
mainButton.style.height = "22px"; // Adjust the width and height as needed


const targetSelector = '.chat2 > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)';
const targetPanel1 = document.querySelector(targetSelector);

if (targetPanel1) {
    targetPanel1.insertBefore(mainButton, targetPanel1.firstChild);
} else {
    // If the target panel is not found, set up a MutationObserver to keep checking for it.
    const observer = new MutationObserver(() => {
        const updatedTargetPanel = document.querySelector(targetSelector);
        if (updatedTargetPanel) {
            // Once the target panel is available, insert the mainButton and disconnect the observer.
            updatedTargetPanel.insertBefore(mainButton, updatedTargetPanel.firstChild);
            observer.disconnect();
        }
    });

    // Set up the observer to watch for changes in the parent of the target panel or higher up in the DOM.
    observer.observe(document.body, { subtree: true, childList: true });

    console.error('Target panel not found. Waiting for changes...');
}
