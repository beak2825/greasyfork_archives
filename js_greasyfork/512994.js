// ==UserScript==
// @name         YouTube Inner Text Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Search the inner text of ytd-video-meta-block within each ytd-rich-item-renderer on YouTube
// @author       Your Name
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512994/YouTube%20Inner%20Text%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/512994/YouTube%20Inner%20Text%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your search term
    const searchTermRegex = /(\d+)([KM]*)(\s*)(view)/gm;// Change this to your search term
    //const minViewCount = 200000;
    let minViewCount = 1000;
    let checkboxState = false;

    // Create a div for the floating text box
    const floatingBox = document.createElement('div');
    floatingBox.style.position = 'fixed';
    floatingBox.style.top = '10px';
    floatingBox.style.right = '10px';
    floatingBox.style.padding = '10px';
    floatingBox.style.backgroundColor = 'white';
    floatingBox.style.border = '1px solid black';
    floatingBox.style.zIndex = '10000';

    // Create an input field
    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.placeholder = 'Enter an integer';
    inputField.value = minViewCount;

    // Create a button to save the integer
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.onclick = function() {
        const inputValue = parseInt(inputField.value, 10);
        if (!isNaN(inputValue)) {
            minViewCount = inputValue;
            updateDisplay();
        } else {
            alert('Please enter a valid integer.');
        }
    };

    // Add event listener for Enter key
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const inputValue = parseInt(inputField.value, 10);
            if (!isNaN(inputValue)) {
                minViewCount = inputValue;
                updateDisplay();
            } else {
                alert('Please enter a valid integer.');
            }
        }
    });

    // Create a paragraph to display the saved integer
    const displayParagraph = document.createElement('p');
    displayParagraph.innerText = 'Current value: ' + (minViewCount !== null ? minViewCount : 'None');

    // Function to update the display
    function updateDisplay() {
        displayParagraph.innerText = 'Current value: ' + (minViewCount !== null ? minViewCount : 'None');
    }


    // Create a checkbox
    const checkboxLabel = document.createElement('label');
    checkboxLabel.innerText = 'Check to hide watched/started videos.';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checkboxState;
    checkbox.onchange = function() {
        checkboxState = checkbox.checked;
        localStorage.setItem('checkboxState', checkboxState);
    };

    // Append the input field, button, and display paragraph to the floating box
    floatingBox.appendChild(inputField);
    floatingBox.appendChild(saveButton);
    floatingBox.appendChild(checkbox);
    floatingBox.appendChild(checkboxLabel);
    floatingBox.appendChild(displayParagraph);




    // Append the floating box to the body
    document.body.appendChild(floatingBox);


    let displayStyles = [];
    // Function to search the inner text of ytd-video-meta-block elements
    function searchInnerText() {
        const items = document.querySelectorAll('ytd-rich-item-renderer');

        items.forEach((item, index) => {
            const metaBlocks = item.querySelectorAll('ytd-video-meta-block');

            const overlayResumeElement = item.querySelector('ytd-thumbnail-overlay-resume-playback-renderer');
            if (overlayResumeElement !== null)
            {
                if (checkboxState)
                {
                    if (item.style.display !== 'none')
                    {
                        displayStyles[index] = item.style.display;
                        item.style.display = 'none';
                    }
                }
                else
                {
                    item.style.display = displayStyles[index];
                }
            }
            else
            {
                metaBlocks.forEach((metaBlock) => {
                const text = metaBlock.innerText;
                //console.log('metaBlock.innerText: ' + text);
                let match = text.match(searchTermRegex);
                //console.log(`Match: ${match}`);
                while ((match = searchTermRegex.exec(text)) !== null) {
                    //console.log(`Match found in item ${index + 1}:`);
                    //console.log(`Full match: ${match[0]}`);
                    //console.log(`Group 1 (digits): ${match[1]}`);
                    //console.log(`Group 2 (k or M): ${match[2]}`);
                    //console.log(`Group 3 (view): ${match[3]}`);
                    let multiplier = 1.0;
                    if (match[2] === 'K')
                    {
                        multiplier = 1000.0;
                    }
                    else if(match[2] === 'M')
                    {
                        multiplier = 1000000.0;
                    }
                    let viewCount = parseFloat(match[1]) * multiplier;
                    if (viewCount < minViewCount)
                    {
                        if (item.style.display !== 'none')
                        {
                            displayStyles[index] = item.style.display;
                            item.style.display = 'none';
                        }
                    }
                    else
                    {
                        item.style.display = displayStyles[index];
                    }
                }
            });
            }


        });
    }

    // Run the search function every few seconds
    setInterval(searchInnerText, 1000);
})();
