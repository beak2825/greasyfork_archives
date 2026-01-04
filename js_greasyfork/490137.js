// ==UserScript==
// @name         c.ai X Panel
// @namespace    c.ai X Panel
// @version      0.4
// @description  Adds a Description and an Autoscroll Button
// @author       Vishanka
// @license     MIT
// @match        https://character.ai/*
// @grant        none
// @icon        https://i.imgur.com/ynjBqKW.png
// @downloadURL https://update.greasyfork.org/scripts/490137/cai%20X%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/490137/cai%20X%20Panel.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var Description_ToggleButton;
    var DescriptionTextContainer;

    function addDescriptionButton() {
        var parentElement = document.querySelector('div.flex:nth-child(5)');
        if (!parentElement) {
            parentElement = document.querySelector('div.flex:nth-child(4)');
        }

if (parentElement) {
    Description_ToggleButton = document.createElement('button');
    Description_ToggleButton.id = 'Description_ToggleButton';
    Description_ToggleButton.style.display = 'flex';
    Description_ToggleButton.style.alignItems = 'center';
    Description_ToggleButton.style.textAlign = 'left';
    Description_ToggleButton.style.paddingLeft = '17px';
    Description_ToggleButton.style.fontSize = '14px';
    Description_ToggleButton.style.width = '287px';
    Description_ToggleButton.style.height = '40px';
    Description_ToggleButton.style.borderRadius = '8px';

// Mouseover event with softer animation
    Description_ToggleButton.addEventListener('mouseover', function() {
      Description_ToggleButton.style.transition = 'background-color 0.3s ease';
      Description_ToggleButton.style.backgroundColor = '#1F1F23';
    });
    Description_ToggleButton.addEventListener('mouseout', function() {
      Description_ToggleButton.style.transition = 'background-color 0.3s ease';
      Description_ToggleButton.style.backgroundColor = '';
    });

// Create a divider
var DescriptionDivider = document.createElement('div');
DescriptionDivider.style.height = '1px'; // Thin line
DescriptionDivider.style.width = '100%'; // Full width
DescriptionDivider.style.backgroundColor = '#3A3A3D';
DescriptionDivider.style.margin = '0px 0'; // Margin above and below for spacing

// Add the divider to the parent element before the button
parentElement.appendChild(DescriptionDivider);

    var DescriptionImage = document.createElement('img');
    DescriptionImage.src = 'https://i.imgur.com/1DnLhLG.png';
    DescriptionImage.style.marginRight = '12px';
    DescriptionImage.style.width = '18px';
    DescriptionImage.style.height = '18px';
    DescriptionImage.style.display = 'block';
    DescriptionImage.style.flexShrink = 0;

    // Wrap both button text and image in a div
    var DescriptionAndImagecontentWrapper = document.createElement('div');
    DescriptionAndImagecontentWrapper.style.display = 'flex';
    DescriptionAndImagecontentWrapper.style.alignItems = 'center';
    DescriptionAndImagecontentWrapper.appendChild(DescriptionImage);
    DescriptionAndImagecontentWrapper.appendChild(document.createTextNode('Description'));

    Description_ToggleButton.appendChild(DescriptionAndImagecontentWrapper);

    parentElement.appendChild(Description_ToggleButton);
    console.log("Button added successfully.");



            DescriptionTextContainer = document.createElement('div');
            DescriptionTextContainer.style.wordWrap = 'break-word';
            DescriptionTextContainer.style.overflowWrap = 'break-word';
            DescriptionTextContainer.style.maxWidth = '100%';
            DescriptionTextContainer.style.display = 'none';
            DescriptionTextContainer.style.fontSize = '15px';
            DescriptionTextContainer.style.hyphens = 'auto';
            DescriptionTextContainer.style.color = '#a2a2ac';
            parentElement.appendChild(DescriptionTextContainer);

            // Add event listener for button click
            Description_ToggleButton.addEventListener('click', function() {
                var currentURL = document.location.href;
                var afterChat = currentURL.substring(currentURL.indexOf('https://character.ai/chat/') + 'https://character.ai/chat/'.length);
                var currentURL1 = afterChat.split('?hist')[0];
                var description = sessionStorage.getItem(currentURL1 + '_description');
                console.log("currentURL1:", currentURL1);

                if (DescriptionTextContainer.style.display === 'none') {
                    DescriptionTextContainer.innerHTML = description;
                    DescriptionTextContainer.style.display = 'block';
                } else {
                    DescriptionTextContainer.innerHTML = '';
                    DescriptionTextContainer.style.display = 'none';
                }
            });


    let intervalId;
    let autoPressEnabled = false;

    function ArrowRightKeyDown() {
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                key: 'ArrowRight',
            })
        );
        console.log("Arrow right pressed");
    }

function toggleAutoPress() {
    autoPressEnabled = !autoPressEnabled;
    if (autoPressEnabled) {
        // Trigger 30 key presses to the right at once
        for (let i = 0; i < 30; i++) {
            ArrowRightKeyDown();
        }
        intervalId = setInterval(ArrowRightKeyDown, 1000); // Repeat every 1 second
autoscrollButton.innerHTML = '<span style="color: #A2A2AC; margin-left: 5px; margin-right: 13px;">■</span> Stop Autoscroll';


    } else {
        clearInterval(intervalId);
autoscrollButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="28" viewBox="0 0 16 32" fill="none" class="h-full" style="margin-right: 10px;"><path d="M9.59998 19.1998L12.8 15.9998L9.59998 12.7998" stroke="#A2A2AC" stroke-width="1.28" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.59998 19.1998L6.79998 15.9998L3.59998 12.7998" stroke="#A2A2AC" stroke-width="1.28" stroke-linecap="round" stroke-linejoin="round"></path></svg> Start Autoscroll';
    }
}


var autoscrollButton = document.createElement('button');
autoscrollButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="28" viewBox="0 0 16 32" fill="none" class="h-full" style="margin-right: 10px;"><path d="M9.59998 19.1998L12.8 15.9998L9.59998 12.7998" stroke="#A2A2AC" stroke-width="1.28" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.59998 19.1998L6.79998 15.9998L3.59998 12.7998" stroke="#A2A2AC" stroke-width="1.28" stroke-linecap="round" stroke-linejoin="round"></path></svg> Start Autoscroll';
autoscrollButton.style.display = 'flex';
autoscrollButton.style.alignItems = 'center';
autoscrollButton.style.textAlign = 'left';
autoscrollButton.style.paddingLeft = '17px';
autoscrollButton.style.fontSize = '14px';
autoscrollButton.style.width = '287px'; //
autoscrollButton.style.height = '40px'; //
autoscrollButton.style.borderRadius = '8px';
autoscrollButton.addEventListener('click', toggleAutoPress);

// Mouseover event with softer animation
autoscrollButton.addEventListener('mouseover', function() {
    autoscrollButton.style.transition = 'background-color 0.3s ease';
    autoscrollButton.style.backgroundColor = '#1F1F23';
});
autoscrollButton.addEventListener('mouseout', function() {
    autoscrollButton.style.transition = 'background-color 0.3s ease';
    autoscrollButton.style.backgroundColor = '';
});


parentElement.appendChild(autoscrollButton);


        } else {
            console.log("Parent element not found.");
        }
    }


function fetchDescription() {
    const originalOpen = XMLHttpRequest.prototype.open; // Use const for unchanged values
    const interceptedData = {}; // Single object for all intercepted data

    XMLHttpRequest.prototype.open = function(method, url, async) {
        if (url.startsWith('https://plus.character.ai/chat/character/info') ||
            url.startsWith('https://beta.character.ai/chat/character/info')) {
            this.addEventListener('load', () => {
                if (this.status >= 200 && this.status < 300) {
                    try {
                        const response = JSON.parse(this.responseText);
                        if (response && response.character) {
                            const { description, external_id } = response.character;
                            if (description !== undefined) {
                                interceptedData[external_id] = { description };
                                console.log(`NextDescription: ${description}`);
                                console.log(`ExternalID: ${external_id}`);

                                sessionStorage.setItem(`${external_id}_description`, description);
                            } else {
                                console.error("Invalid or empty description field in response");
                            }
                        }
                    } catch (error) {
                        console.error(`Error parsing JSON response: ${error}`);
                    }
                } else {
                    console.error(`Request failed with status: ${this.status}`);
                }
            });
        }
        originalOpen.apply(this, arguments); // Preserve the context of `this`
    };
}

fetchDescription();




// HERE ARE THE FUNCTIONS THAT MAKE SURE THAT THE BUTTON IS ADDED
function addButtonsWithRetry() {
    // Only run on specific pages
    if (!/https:\/\/character\.ai\/chat\//.test(window.location.href)) {
        return;
    }

    var attempts = 0;
    var maxAttempts = 10;
    var interval = setInterval(function() {
        if (!document.getElementById('Description_ToggleButton')) {
            addDescriptionButton(); // Ensure this function is defined elsewhere in your code
            attempts++;
        }
        if (document.getElementById('Description_ToggleButton') || attempts >= maxAttempts) {
            clearInterval(interval); // Stop retrying if button is added or max attempts reached
        }
    }, 1000); // Retry every second
}

addButtonsWithRetry();

// Check for URL changes
var currentUrl = window.location.href;
setInterval(function() {
    if (window.location.href !== currentUrl) {
        console.log("URL changed, checking for button...");
        currentUrl = window.location.href;
        addButtonsWithRetry(); // Reapply the button if URL changes
    }
}, 1000);


})();