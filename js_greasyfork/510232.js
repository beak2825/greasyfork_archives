// ==UserScript==
// @name         ExHentai Tag Formatter
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Save and format tags on ExHentai, download images from Hath.Network with formatted tags
// @author       Your Name
// @match        https://*/*
// @match        https://*:*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/510232/ExHentai%20Tag%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/510232/ExHentai%20Tag%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to collect tags from the 'taglist' div and save to GM storage
    function collectAndSaveTags() {
        // Get the current page URL
        const currentUrl = window.location.href;

        // Initialize a variable to hold the title text
        let titleText = '';

        // Extract text from the first h1 element in div with id 'i1'
        const titleElement = document.querySelector('#i1 h1');
        if (titleElement) {
            // Get the text content and remove special characters
            titleText = titleElement.textContent.replace(/[^a-zA-Z0-9 ]/g, '').trim();
        }

        // Check if the URL starts with the specified string for saving
        if (currentUrl.startsWith('https://exhentai.org/g/')) {
            // Get the parent div with ID 'taglist'
            const taglist = document.getElementById('taglist');

            // Ensure the taglist exists
            if (!taglist) return;

            // Get all the divs inside the parent div
            const divs = taglist.getElementsByTagName('div');

            // Initialize the Tags object
            const Tags = {};

            // Loop through each div and process the ID
            for (let i = 0; i < divs.length; i++) {
                const id = divs[i].id; // Get the ID of the current div
                
                // Split the ID into type and name
                const [type, name] = id.split(':');
                
                // Trim the 'td_' prefix from the type
                const trimmedType = type.replace('td_', '');
                
                // Initialize the array for the type if it doesn't exist
                if (!Tags[trimmedType]) {
                    Tags[trimmedType] = [];
                }
                
                // Add the name to the corresponding type array
                Tags[trimmedType].push(name);
            }

            // Save the Tags object in GM storage as a JSON string
            GM_setValue('tags', JSON.stringify(Tags));
        } 
        else if (currentUrl.startsWith('https://exhentai.org/s/')) {
            // If the URL starts with 'https://exhentai.org/s/', save the formatted tags
            const savedTags = GM_getValue('tags'); // Retrieve the saved tags
            
            // Check if any tags have been saved
            if (savedTags) {
                const tagsObject = JSON.parse(savedTags); // Parse the JSON string back to an object

                // Create a formatted string excluding the 'character' key
                let formattedString = '';
                const characters = tagsObject['character'] || []; // Get the characters array

                for (const key in tagsObject) {
                    if (key !== 'character') {
                        // Join the values with underscores
                        const values = tagsObject[key].join('_');
                        // Append to the formatted string
                        formattedString += `${key}_${values}_`;
                    }
                }

                // Remove the trailing underscore if there is one
                if (formattedString.endsWith('_')) {
                    formattedString = formattedString.slice(0, -1);
                }

                // Include the title text in the formatted string if it exists
                if (titleText) {
                    formattedString = `${titleText}_${formattedString}`;
                }

                // Save the formatted string in GM storage
                GM_setValue('tags-formatted', formattedString);

                // Create a dropdown menu
                createDropdown(characters, formattedString);
            }
        } 
        else if (location.hostname.endsWith('hath.network')){
            const savedFormattedTags = GM_getValue('tags-formatted');
            
            if (savedFormattedTags) {
                // Get the current image URL
                const imageElement = document.querySelector('img'); // Change this selector if needed
                const currentImageUrl = imageElement ? imageElement.src : null;

                if (currentImageUrl) {
                    // Get the current URL and split it to get the filename
                    const url = new URL(currentImageUrl);
                    const pathname = url.pathname; // Get the pathname
                    const extension = pathname.split('.').pop(); // Get the file extension
                    const baseFilename = pathname.split('/').pop(); // Get the base filename (after the last \)

                    // Construct the new filename with the saved formatted tags
                    const newFilename = `${baseFilename.split('\\').pop().replace(/\.[^/.]+$/, `_${savedFormattedTags}.${extension}`)}`;

                    // Create a download button
                    createDownloadButton(currentImageUrl, newFilename);
                }
            }
        }
    }

    // Function to create a dropdown menu and handle selection changes
    function createDropdown(characters, formattedString) {
        // Find the dropdown target div with ID 'i6'
        const dropdownContainer = document.getElementById('i6');
        if (!dropdownContainer) return;

        // Create a dropdown element
        const dropdown = document.createElement('select');
        
        // Add "none" as the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = "none";
        defaultOption.textContent = "none";
        dropdown.appendChild(defaultOption);

        // Populate dropdown with characters
        characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character;
            option.textContent = character;
            dropdown.appendChild(option);
        });

        // Add change event listener to the dropdown
        dropdown.addEventListener('change', function() {
            // Prepend the selected character to the formatted string
            const selectedCharacter = this.value;
            let finalString = '';

            // Only add a character if one is selected and not "none"
            if (selectedCharacter !== "none") {
                finalString += `${selectedCharacter}_`;
            }

            // Append the previously formatted string if not empty
            if (formattedString) {
                finalString += formattedString;
            }

            // Save the final formatted string in GM storage
            GM_setValue('tags-formatted', finalString);
        });

        // Append the dropdown to the container without replacing existing content
        dropdownContainer.appendChild(dropdown);
    }

    // Function to create a download button
    function createDownloadButton(imageUrl, filename) {
        // Create a button element
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Image';
        downloadButton.style.marginTop = '10px';

        // Set up the download action
        downloadButton.addEventListener('click', function() {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = filename;
            document.body.appendChild(link); // Append the link to the body
            link.click(); // Trigger the download
            document.body.removeChild(link); // Remove the link after triggering
        });

        // Append the download button to the body or a specific container
        document.body.appendChild(downloadButton);
    }

    // Execute the function
    collectAndSaveTags();
})();
