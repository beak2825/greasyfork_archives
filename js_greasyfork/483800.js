// ==UserScript==
// @name         Background Changer with Dropdown Menu
// @namespace    https://jadalwazzan.github.io/
// @version      1.0
// @description  Change website background to a specified image or GIF via a dropdown menu with options to change or remove the background (preserved on refresh)
// @author       Nurv[669537]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        none
// @license      Jcodes
// @downloadURL https://update.greasyfork.org/scripts/483800/Background%20Changer%20with%20Dropdown%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/483800/Background%20Changer%20with%20Dropdown%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to prompt for image URL input
    function promptForImageURL() {
        const imageUrl = prompt('Enter the URL of the image or GIF you want to use as the background:');
        if (imageUrl !== null) {
            if (imageUrl === '') {
                removeBackgroundImage();
            } else {
                saveImageURL(imageUrl);
                applyBackgroundImage(imageUrl);
            }
        }
    }

    // Function to save image URL to localStorage
    function saveImageURL(imageUrl) {
        localStorage.setItem('customBackgroundImage', imageUrl);
    }

    // Function to apply the background image using jQuery
    function applyBackgroundImage(imageUrl) {
        jQuery('body').css({
            'background-image': `url('${imageUrl}')`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-attachment': 'fixed'
        });
    }

    // Function to remove the background image
    function removeBackgroundImage() {
        localStorage.removeItem('customBackgroundImage');
        jQuery('body').css('background-image', 'none');
    }

    // Function to create the dropdown menu
    function createDropdown() {
        // Create the dropdown menu
        const selectMenu = document.createElement('select');
        selectMenu.addEventListener('change', function() {
            const selectedOption = this.value;
            if (selectedOption === 'change') {
                promptForImageURL();
            } else if (selectedOption === 'remove') {
                removeBackgroundImage();
            }
        });

        // Apply styles to the dropdown menu
        selectMenu.style.width = '100%';
        selectMenu.style.backgroundColor = '#333333';
        selectMenu.style.color = '#FFFFFF';
        selectMenu.style.fontSize = '12px';
        selectMenu.style.padding = '6px';
        selectMenu.style.border = '1px solid #ccc';
        selectMenu.style.borderRadius = '4px';

        // Create options for changing and removing background
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Background-Img';
        defaultOption.value = 'default';
        selectMenu.appendChild(defaultOption);

        const changeOption = document.createElement('option');
        changeOption.textContent = 'Change BG';
        changeOption.value = 'change';
        selectMenu.appendChild(changeOption);

        const removeOption = document.createElement('option');
        removeOption.textContent = 'Remove BG';
        removeOption.value = 'remove';
        selectMenu.appendChild(removeOption);

        return selectMenu;
    }

    // Find the target element to append the dropdown menu
    const sidebarBlock = document.querySelector('.sidebar-block___Ef1l1');

    if (sidebarBlock) {
        const selectMenu = createDropdown();

        // Append the dropdown menu to the target element
        const contentElement = sidebarBlock.querySelector('.content___wSUdj');
        if (contentElement) {
            contentElement.appendChild(selectMenu);
        }

        // Retrieve and apply the stored background image on page load
        const storedImageUrl = localStorage.getItem('customBackgroundImage');

        if (storedImageUrl) {
            applyBackgroundImage(storedImageUrl);
        }
    } else {
        console.log('Sidebar block element not found.');
    }
})();
