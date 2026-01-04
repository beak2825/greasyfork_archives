// ==UserScript==
// @name         NHentai Tag Highlighter
// @namespace    https://github.com/erasels
// @version      3.1
// @description  Highlight thumbnails of works on nhentai.net based on tags you decide to highlight.
// @author       erasels
// @match        *://nhentai.net/*
// @icon         https://nhentai.net/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @license      MIT
// @supportURL   https://sleazyfork.org/en/scripts/495767-nhentai-tag-highlighter
// @downloadURL https://update.greasyfork.org/scripts/495767/NHentai%20Tag%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/495767/NHentai%20Tag%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const highlightCutoffThreshold = 0; // Prevents rendering more than this many tags on an item if this is > 0

    // If no priority is defined for a tag in tagDetails, it'll use this
    const defaultPriority = 10;

    // Colors
    const removeHighlightColor = '#AD2204';
    const addHighlightColor = '#0A900A';

    // Retrieve tags from storage or set default if not present
    const tagDetails = {};
    const tagKeys = GM_listValues();
    tagKeys.forEach(key => {
        if (key.startsWith('tag_')) {
            const tagId = key.slice(4);
            tagDetails[tagId] = GM_getValue(key);
        }
    });

    // Modal dialogue style
    GM_addStyle(`
    #tag-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        padding: 20px;
        background-color: #2b2b2b;
        color: #fff;
        border: 1px solid #444;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }
    #tag-modal label {
        display: block;
        margin-bottom: 5px;
        color: #fff;
    }
    #tag-modal input[type="text"],
    #tag-modal input[type="number"],
    #tag-modal input[type="color"] {
        width: calc(100% - 10px);
        margin-bottom: 10px;
        padding: 5px;
        background-color: #444;
        color: #fff;
        border: 1px solid #555;
        border-radius: 3px;
    }
    #tag-modal button {
        margin-right: 10px;
        background-color: #555;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
    }
    #tag-modal button:hover {
        background-color: #666;
    }
    #modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
    #existing-tags-container {
        margin-top: 20px;
    }
    #existing-tags-list {
        max-height: 150px;
        overflow-y: auto;
        background-color: #333;
        padding: 10px;
        border: 1px solid #444;
        border-radius: 5px;
    }
    #existing-tags-list div {
        margin-bottom: 5px;
    }
`);


    // Create the modal dialog HTML (the thing that shows up when you click the highlight tag button)
    const modalHtml = `
    <div id="modal-overlay"></div>
    <div id="tag-modal">
        <label for="tag-name">Tag Name:</label>
        <input type="text" id="tag-name">
        <label for="tag-priority">Priority:</label>
        <input type="number" id="tag-priority" value="10">
        <label for="tag-color">Color:</label>
        <input type="color" id="tag-color" value="#32a852">
        <button id="save-tag">Save</button>
        <button id="cancel-tag">Cancel</button>
        <div id="existing-tags-container">
            <h3>Existing Tags</h3>
            <div id="existing-tags-list"></div>
        </div>
    </div>
`;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    // SVG graphic for the star icon
    const starIcon = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
                    </svg>
                `;

    // Add style for hover effect
    GM_addStyle(`
    .addTagButton:hover div {
        color: gold;
    }`);

    function updateButtonAppearance(button, isHighlighted) {
        if (isHighlighted) {
            button.style.color = removeHighlightColor;
            button.setAttribute('title', 'Remove Highlight');
        } else {
            button.style.color = addHighlightColor;
            button.setAttribute('title', 'Add Highlight');
        }
    }

    function updateTagContainerAppearance(tagContainer, tagId, isHighlighted) {
        if (isHighlighted && tagDetails[tagId]) {
            tagContainer.style.outline = `2px solid ${tagDetails[tagId].color}`;
            tagContainer.style.outlineOffset = '-2px'; // Ensure the outline is within the border
            tagContainer.style.borderRadius = '5px';
        } else {
            tagContainer.style.outline = 'none';
        }
    }

    // Converts the old way of saving tag highlights to the new way
    function convertTagDetailsToIndividualEntries() {
        const existingTagDetails = GM_getValue('tagDetails', null);
        if(existingTagDetails !== null) {
            console.log("Converting old saves to new ones.");

            // Iterate over each entry in the existing tagDetails object
            for (const [tagId, tagDetail] of Object.entries(existingTagDetails)) {
                // Save each tag individually
                GM_setValue(`tag_${tagId}`, tagDetail);
            }

            // delete the old tagDetails entry to avoid confusion
            GM_deleteValue('tagDetails');
        }
    }




    // Process items to see if they require additional logic
    function processItem(item) {
        const dataTags = item.getAttribute('data-tags').split(' ').map(Number);
        const matchingTags = dataTags.filter(tag => tag in tagDetails);

        if (matchingTags.length > 0) {
            // Insert functions that take matched items here
            highlightDotItem(item, matchingTags);
        }
    }

    // Log item name and matched tags
    function logItem(item, matchingTags) {
        const itemName = item.querySelector('.caption').innerText;
        const matchedTagNames = matchingTags.map(tag => tagDetails[tag].name).join(', ');
        console.log(`${itemName}: ${matchedTagNames}`);
    }

    // Highlight item with dots based on matched tags
    function highlightDotItem(item, matchingTags) {
        // Ensure the parent element is positioned relative for the dots to be positioned correctly
        item.style.position = 'relative';

        // Sort matching tags by priority, higher first
        matchingTags.sort((a, b) => {
            const priorityA = tagDetails[a]?.priority ?? defaultPriority;
            const priorityB = tagDetails[b]?.priority ?? defaultPriority;
            return priorityB - priorityA;
        });

        let tagHighlightAmt = matchingTags.length;
        if(highlightCutoffThreshold > 0) {
            tagHighlightAmt = Math.min(highlightCutoffThreshold, tagHighlightAmt);
        }

        for (let i = 0; i < tagHighlightAmt; i++) {
            const tag = matchingTags[i];
            const tagDetail = tagDetails[tag];
            if (tagDetail) {
                const dotContainer = document.createElement('div');
                dotContainer.style.display = 'flex';
                dotContainer.style.alignItems = 'center';
                dotContainer.style.position = 'absolute';
                dotContainer.style.top = `${5 + i * 20}px`;
                dotContainer.style.left = '5px';
                dotContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.66)';
                dotContainer.style.padding = '1px 5px';
                dotContainer.style.borderRadius = '5px';
                dotContainer.style.pointerEvents = 'none'; // Make the container ignore mouse events

                const dot = document.createElement('div');
                dot.style.width = '15px';
                dot.style.height = '15px';
                dot.style.backgroundColor = tagDetail.color;
                dot.style.borderRadius = '50%';
                dot.style.marginRight = '5px';

                const tagName = document.createElement('span');
                tagName.innerText = tagDetail.name;
                tagName.style.color = '#fff';
                tagName.style.fontSize = '12px';

                dotContainer.appendChild(dot);
                dotContainer.appendChild(tagName);
                // Calculate if the dot container's bottom would exceed the item's height
                const potentialBottomPosition = parseInt(dotContainer.style.top, 10);
                if (potentialBottomPosition <= item.offsetHeight) {
                    // Only append the dot container if it doesn't exceed the item's boundary
                    item.appendChild(dotContainer);
                } else {
                    break;
                }
            }
        }
    }





    // Function to create a new button for each tag
    function addTagButtons() {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            const match = tag.className.match(/tag-(\d+)/);
            if (match) {
                const tagId = match[1];
                const buttonContainer = tag.querySelector('.count');
                if (buttonContainer) {
                    const addButton = document.createElement('div');
                    addButton.classList.add('addTagButton');
                    addButton.setAttribute('alt', 'add-tag');
                    addButton.style.cursor = 'pointer';
                    addButton.style.display = 'inline-block';

                    const addButtonIcon = document.createElement('div');
                    addButtonIcon.innerHTML = starIcon;
                    addButtonIcon.style.width = '18px';
                    addButtonIcon.style.height = '18px';

                    const isHighlighted = tagId in tagDetails;
                    updateButtonAppearance(addButton, isHighlighted);
                    updateTagContainerAppearance(tag, tagId, isHighlighted);

                    addButton.appendChild(addButtonIcon);
                    buttonContainer.appendChild(addButton);

                    addButton.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent default behavior
                        toggleTagPopup(tagId, tag.querySelector('.name').innerText, addButton, tag);
                    });
                }
            }
        });
    }

    // Function to toggle the popup for adding tag details
    function toggleTagPopup(tagId, tagName, button, tagContainer) {
        const tagModal = document.getElementById('tag-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const existingTagsList = document.getElementById('existing-tags-list');

        // Populate existing tags list sorted by priority
        existingTagsList.innerHTML = '';
        const sortedTagDetails = Object.entries(tagDetails).sort((a, b) => {
            const priorityA = a[1].priority ?? defaultPriority;
            const priorityB = b[1].priority ?? defaultPriority;
            return priorityB - priorityA;
        });

        for (const [id, details] of sortedTagDetails) {
            const tagItem = document.createElement('div');
            tagItem.innerHTML = `
            <span style="color: ${details.color};">${details.name}</span>
            <span> (${details.priority})</span>`;
            existingTagsList.appendChild(tagItem);
        }

        if (tagDetails[tagId]) {
            // If the tag is already added, remove it
            delete tagDetails[tagId];
            GM_deleteValue(`tag_${tagId}`);
            updateButtonAppearance(button, false);
            updateTagContainerAppearance(tagContainer, tagId, false);
        } else {
            // Show the modal dialog
            document.getElementById('tag-name').value = tagName;
            document.getElementById('tag-priority').value = defaultPriority;
            document.getElementById('tag-color').value = '#32a852';
            tagModal.style.display = 'block';
            modalOverlay.style.display = 'block';

            // Handle save button click
            document.getElementById('save-tag').onclick = () => {
                const newTagName = document.getElementById('tag-name').value;
                const priority = parseInt(document.getElementById('tag-priority').value);
                const color = document.getElementById('tag-color').value;

                if (newTagName && !isNaN(priority)) {
                    tagDetails[tagId] = { name: newTagName, color: color, priority: priority };
                    GM_setValue(`tag_${tagId}`, tagDetails[tagId]);
                    updateButtonAppearance(button, true);
                    updateTagContainerAppearance(tagContainer, tagId, true);
                }

                // Hide the modal dialog
                tagModal.style.display = 'none';
                modalOverlay.style.display = 'none';
            };

            // Handle cancel button click
            document.getElementById('cancel-tag').onclick = () => {
                // Hide the modal dialog
                tagModal.style.display = 'none';
                modalOverlay.style.display = 'none';
            };
        }
    }



    // Function to observe new nodes (required for NH Imporved infinite load compatibility)
    function observeNewNodes(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('gallery')) {
                    processItem(node);
                } else if (node.nodeType === 1) {
                    node.querySelectorAll('.gallery').forEach(item => {
                        processItem(item);
                    });
                }
            });
        });
    }

    // Initial function to set up the script
    function init() {
        //convertTagDetailsToIndividualEntries();
        addTagButtons();
        const observer = new MutationObserver(observeNewNodes);
        observer.observe(document.body, { childList: true, subtree: true });

        const galleryItems = document.querySelectorAll('.gallery');
        galleryItems.forEach(item => {
            processItem(item);
        });
    }

    init();
})();
