// ==UserScript==
// @name         Nhentai Related Manga Button
// @namespace    github.com/longkidkoolstar
// @version      0.3.1
// @description  Add a 'Find Similar' button to nhentai.net that populates the search bar with tags for finding similar content and allows adjusting the number of tags to select using a slider. Also allows locking specific tags for inclusion in the search.
// @author       longkidkoolstar
// @match        https://nhentai.net/*
// @icon         https://nhentai.lolarchiver.com/image/nhentai_icon.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      All Rights Reserved
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494700/Nhentai%20Related%20Manga%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/494700/Nhentai%20Related%20Manga%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script is running...');

    // Initialize maxTagsToSelect from localStorage or default to 5
    let maxTagsToSelect = localStorage.getItem('maxTagsToSelect') || 5;
    maxTagsToSelect = parseInt(maxTagsToSelect); // Ensure it's parsed as an integer

    // Array to store locked tags
    const lockedTags = [];

    // Function to create and insert 'Find Similar' button
    function createFindSimilarButton() {
        const downloadButton = document.getElementById('download');
        if (!downloadButton) {
            console.log('Download button not found.');
            return;
        }

        const findSimilarButtonHtml = `
            <a class="btn btn-primary btn-disabled tooltip find-similar">
                <i class="fas fa-search"></i>
                <span>Find Similar</span>
                <div class="top">Click to find similar hentai<i></i></div>
            </a>
        `;
        const findSimilarButton = $(findSimilarButtonHtml);

        // Insert 'Find Similar' button next to the download button
        $(downloadButton).after(findSimilarButton);

        // Handle click event for 'Find Similar' button
// Handle click event for 'Find Similar' button
findSimilarButton.click(function() {
    const tagsContainer = $('div.tag-container.field-name:contains("Tags:")');
    if (!tagsContainer.length) {
        console.log('Tags container not found.');
        return;
    }

    // Find all tag links within the container
    const tagLinks = tagsContainer.find('a.tag');

    if (!tagLinks.length) {
        console.log('No tag links found.');
        return;
    }

    // Extract tag data (name and count) and assign probabilities based on count
    const tagsData = Array.from(tagLinks).map(tagLink => {
        const tagName = $(tagLink).find('.name').text().trim();
        const tagCount = parseInt($(tagLink).find('.count').text().replace('K', '')) || 0;
        const probability = Math.sqrt(tagCount); // Adjust this formula as needed
        return { name: tagName, count: tagCount, probability: probability };
    });

    // Shuffle tag data array to randomize selection
    shuffleArray(tagsData);

    const selectedTags = [];
    let numTagsSelected = 0;
    
    // Add locked tags to the selected tags array
    lockedTags.forEach(tag => {
        selectedTags.push(tag);
        numTagsSelected++;
    });
    
    tagsData.forEach(tag => {
        if (numTagsSelected < maxTagsToSelect && !lockedTags.includes(tag.name) && Math.random() < tag.probability) {
            selectedTags.push(tag.name);
            numTagsSelected++;
        }
    });
    
    // Join selected tag names into a search string
    const searchTags = selectedTags.join(' ');

    const searchInput = $('input[name="q"]');
    if (searchInput.length > 0) {
        // Update search input value with selected tags
        searchInput.val(searchTags);
    } else {
        // If search input not found, create and submit a hidden form
        const hiddenSearchFormHtml = `
            <form role="search" action="/search/" method="GET" style="display: none;">
                <input type="hidden" name="q" value="${searchTags}" />
            </form>
        `;
        const hiddenSearchForm = $(hiddenSearchFormHtml);
        $('body').append(hiddenSearchForm);
        hiddenSearchForm.submit();
    }

    // Create and display the slider (only once)
    if (!$('#tagSlider').length) {
        createSlider();
    }
});
    }

    // Function to create and display the slider
    function createSlider() {
        const sliderHtml = `
            <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
                <input type="range" min="1" max="10" value="${maxTagsToSelect}" id="tagSlider">
                <label for="tagSlider">Max Tags to Select: <span id="tagSliderValue">${maxTagsToSelect}</span></label>
            </div>
        `;
        $(document.body).append(sliderHtml);

        // Retrieve saved maxTagsToSelect value from localStorage (if available)
        const savedMaxTags = localStorage.getItem('maxTagsToSelect');
        if (savedMaxTags) {
            maxTagsToSelect = parseInt(savedMaxTags);
            $('#tagSlider').val(maxTagsToSelect);
            $('#tagSliderValue').text(maxTagsToSelect);
        }

        // Update maxTagsToSelect based on slider value and save to localStorage
        $('#tagSlider').on('input', function() {
            maxTagsToSelect = parseInt($(this).val());
            $('#tagSliderValue').text(maxTagsToSelect);

            // Store the updated maxTagsToSelect value in localStorage
            localStorage.setItem('maxTagsToSelect', maxTagsToSelect);
        });
    }

    // Call the function to create 'Find Similar' button
    createFindSimilarButton();

// Event listener for locking/unlocking tags
$(document).on('click', 'span.lock-button', function(event) {
    event.stopPropagation(); // Prevent tag link click event from firing

    const tagName = $(this).prev('a.tag').find('.name').text().trim();

    if (lockedTags.includes(tagName)) {
        // Tag is already locked, unlock it
        const index = lockedTags.indexOf(tagName);
        if (index !== -1) {
            lockedTags.splice(index, 1);
        }
        $(this).html('<i class="fas fa-plus"></i>'); // Change icon to plus
    } else {
        // Lock the tag
        lockedTags.push(tagName);
        $(this).html('<i class="fas fa-minus"></i>'); // Change icon to minus
    }
});


    // Add lock button next to each tag
    const tagsContainer = $('div.tag-container.field-name:contains("Tags:")');
    if (tagsContainer.length) {
        const tagLinks = tagsContainer.find('a.tag');
        tagLinks.each(function(index, tagLink) {
            const lockButtonHtml = `
                <span class="lock-button" data-tag-index="${index}">
                    <i class="fas fa-plus"></i>
                </span>
            `;
            const lockButton = $(lockButtonHtml);
            $(tagLink).after(lockButton);
        });
    }

    console.log('Script setup complete.');

    // Function to shuffle an array (Fisher-Yates shuffle algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

})();
