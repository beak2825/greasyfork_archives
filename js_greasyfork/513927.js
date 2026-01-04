// ==UserScript==
// @name         Sharty Mod Icons
// @namespace    soyjak.party
// @version      1.4
// @license      MIT
// @description  Adds Mod Icons
// @author       Chud
// @match        https://soyjak.party/*
// @match        https://soyjak.st/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513927/Sharty%20Mod%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/513927/Sharty%20Mod%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a style element for CSS
    const style = document.createElement('style');
    style.textContent = `
        .mod-icon {
            background-image: url('https://files.catbox.moe/9u72hu.png');
            width: 20px; /* Set size for the icon */
            height: 20px; /* Set size for the icon */
            display: inline-block;
            vertical-align: middle;
            margin-left: 2px; /* Space between capcode and icon */
            margin-top: -2px; /* Move icon up by 2 pixels */
            background-size: contain; /* Scale the image to fit */
            background-repeat: no-repeat; /* Prevent image from repeating */
            background-position: center; /* Center the image */
            cursor: default; /* Change cursor to default */
        }
        .mod-icon-wrapper {
            display: inline-block; /* Make the wrapper inline */
            cursor: default; /* Change cursor to default */
        }
        .capcode {
            font-weight: bold; /* Make capcode font bold */
        }
    `;
    document.head.appendChild(style);

    // Set to track processed posts
    const processedPosts = new Set();

    // Function to add mod icons to posts
    function addModIcons() {
        document.querySelectorAll('.post').forEach(post => {
            if (processedPosts.has(post)) return; // Skip if already processed

            const capcodeElement = post.querySelector('.capcode');
            const modIcon = post.querySelector('.mod-icon'); // Check if icon already exists

            if (capcodeElement && !modIcon) {
                const capcodeText = capcodeElement.textContent.trim();
                console.log(`Capcode found: ${capcodeText}`); // Debug log

                // Check for "## Mod", "## Admin", "## Froot", or "## Manager"
                if (capcodeText === '## Mod' || capcodeText === '## Admin' || capcodeText === '## Froot' || capcodeText === '## Thanos' || (capcodeText === '## Developer' && capcodeElement.style.color === 'rgb(255, 60, 154)') || (capcodeText === '## Manager' && capcodeElement.style.color === 'rgb(245, 205, 0)')) {
                    const iconWrapper = document.createElement('span');
                    iconWrapper.className = 'mod-icon-wrapper'; // Create a wrapper for the icon
                    const newModIcon = document.createElement('span');
                    newModIcon.className = 'mod-icon';

                    // Prevent click propagation
                    newModIcon.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });

                    if (capcodeText === '## Admin') {
                        newModIcon.title = "This User does it for Free."; // Tooltip for Admin
                        const nameElement = post.querySelector('.name'); // Find the name element
                        if (nameElement && nameElement.textContent.includes('Chud')) {
                            iconWrapper.appendChild(newModIcon);
                            capcodeElement.appendChild(iconWrapper);
                        }
                    } else if (capcodeText === '## Mod') {
                        newModIcon.title = "This User does it for Free."; // Tooltip for Mod
                        iconWrapper.appendChild(newModIcon); // Append icon for "## Mod"
                        capcodeElement.appendChild(iconWrapper);
                    } else if (capcodeText === '## Froot') {
                        newModIcon.style.backgroundImage = "url('https://files.catbox.moe/od3szi.png')"; // Set new icon for Froot
                        newModIcon.title = "This User is Fruity."; // Tooltip for Froot
                        iconWrapper.appendChild(newModIcon);
                        capcodeElement.appendChild(iconWrapper);
                    } else if (capcodeText === '## Thanos') {
                        newModIcon.style.backgroundImage = "url('https://soyjak.st/static/thanos.png')";
                        newModIcon.title = "This User is Thanos.";
                        iconWrapper.appendChild(newModIcon);
                        capcodeElement.appendChild(iconWrapper);
                    } else if (capcodeText === '## Developer' && capcodeElement.style.color === 'rgb(255, 60, 154)') {
                        newModIcon.style.backgroundImage = "url('https://files.catbox.moe/8v9ald.png')";
                        newModIcon.title = "This User is Muddy.";
                        iconWrapper.appendChild(newModIcon);
                        capcodeElement.appendChild(iconWrapper);
                    } else if (capcodeText === '## Manager' && capcodeElement.style.color === 'rgb(245, 205, 0)') {
                        newModIcon.style.backgroundImage = "url('https://files.catbox.moe/aeih0d.png')"; // Set icon for Manager
                        newModIcon.title = "This User is a Manager."; // Tooltip for Manager
                        iconWrapper.appendChild(newModIcon);
                        capcodeElement.appendChild(iconWrapper);

                    }

                    processedPosts.add(post); // Mark this post as processed
                }
            }
        });
    }

    // Run the function on page load
    addModIcons();

    // Set up a MutationObserver for dynamically loaded posts
    const observer = new MutationObserver(addModIcons);
    observer.observe(document.body, { childList: true, subtree: true });
})();





