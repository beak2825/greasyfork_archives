// ==UserScript==
// @name         Halloween Quick Menu v.1.0
// @namespace    https://www.example.com
// @version      1.0
// @description  Custom menu for Halloween
// @author       LOKa
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477968/Halloween%20Quick%20Menu%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/477968/Halloween%20Quick%20Menu%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDarkMode = true; // Variable to track the mode, true for dark, false for light

    // Create a custom menu container
    const customMenu = document.createElement('div');
    customMenu.id = 'custom-menu';
    customMenu.style.position = 'fixed';
    customMenu.style.left = '6%';
    customMenu.style.top = '50%';
    customMenu.style.transform = 'translate(-50%, -50%)';
    customMenu.style.padding = '10px';
    customMenu.style.border = '1px solid #ccc';
    customMenu.style.zIndex = '9999';
    customMenu.style.maxWidth = '200px';

    // Create the header
    const header = document.createElement('div');
    header.textContent = 'Halloween Quick Menu';
    header.style.fontSize = '16px';
    header.style.fontWeight = 'bold';

    customMenu.appendChild(header);

    // Create the hyperlinks
    const links = [
        { title: 'Medical Items', url: 'https://www.torn.com/item.php#medical-items' },
        { title: 'Enemy List', url: 'https://www.torn.com/blacklist.php' },
        { title: 'Xanax', url: 'https://www.torn.com/item.php#drugs-items' },
        { title: 'Points Refills', url: 'https://www.torn.com/points.php' },
        { title: 'FHCs & Green Eggs', url: 'https://www.torn.com/item.php#boosters-items' },
        { title: 'Job Points', url: 'add_your_link_here__inside_the_script_or_just_remove_the_whole_line' },
        { title: 'Energy Stocks', url: 'https://www.torn.com/page.php?sid=stocks&stockID=29&tab=dividend' },
        { title: 'Newsletter', url: 'add_your_link_here__inside_the_script_or_just_remove_the_whole_line' }
    ];

    const linksContainer = document.createElement('div');
    linksContainer.style.marginTop = '10px';

    links.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.title;
        anchor.style.display = 'block';
        anchor.style.marginBottom = '10px';
        anchor.style.fontSize = '14px';

        if (isDarkMode) {
            anchor.style.color = 'white';
        } else {
            anchor.style.color = 'black';
        }

        linksContainer.appendChild(anchor);
    });

    customMenu.appendChild(linksContainer);

    // Create the notes section
    const notesLabel = document.createElement('div');
    notesLabel.textContent = 'Notes:';
    notesLabel.style.marginTop = '15px';
    customMenu.appendChild(notesLabel);

    const notesTextbox = document.createElement('textarea');
    notesTextbox.style.width = '100%';
    notesTextbox.style.height = '100px';

    if (isDarkMode) {
        notesTextbox.style.backgroundColor = 'transparent';
        notesTextbox.style.color = 'white';
    } else {
        notesTextbox.style.backgroundColor = 'white';
        notesTextbox.style.color = 'black';
    }

    // Retrieve and set notes from localStorage
    const savedNotes = localStorage.getItem('customMenuNotes');
    if (savedNotes) {
        notesTextbox.value = savedNotes;
    }

    notesTextbox.addEventListener('input', function() {
        // Save notes to localStorage when user input changes
        localStorage.setItem('customMenuNotes', notesTextbox.value);
    });

    customMenu.appendChild(notesTextbox);

    // Create the mode button
    const modeButton = document.createElement('button');

    function updateModeButton() {
        if (isDarkMode) {
            // Dark mode
            modeButton.textContent = 'Switch to Light Mode';
            customMenu.style.backgroundColor = 'transparent';
            header.style.color = 'green';
            notesTextbox.style.backgroundColor = 'transparent';
            notesTextbox.style.color = 'white';
            linksContainer.querySelectorAll('a').forEach(anchor => {
                anchor.style.color = 'white';
            });
        } else {
            // Light mode
            modeButton.textContent = 'Switch to Dark Mode';
            customMenu.style.backgroundColor = 'transparent';
            header.style.color = 'green';
            notesTextbox.style.backgroundColor = 'transparent';
            notesTextbox.style.color = 'black';
            linksContainer.querySelectorAll('a').forEach(anchor => {
                anchor.style.color = 'black';
            });
        }
    }

    modeButton.addEventListener('click', function() {
        isDarkMode = !isDarkMode; // Toggle mode
        updateModeButton();
    });

    updateModeButton(); // Set the initial button text

    modeButton.style.backgroundColor = 'transparent';
    modeButton.style.color = 'yellow';

    customMenu.appendChild(modeButton);

    // Append the custom menu to the body
    document.body.appendChild(customMenu);

    // Initial style for dark mode
    GM_addStyle(`
        #custom-menu {
            background-color: transparent;
        }
    `);
})();
