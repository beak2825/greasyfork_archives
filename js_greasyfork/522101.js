// ==UserScript== K O K U S H I B O
// @name         KoGaMa Avatar Change with Custom Image (Persistent)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change KoGaMa avatar with a custom image from file input (supports SVG structure and persists across refreshes)
// @author       K O K U S H I B O
// @match        https://www.kogama.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522101/KoGaMa%20Avatar%20Change%20with%20Custom%20Image%20%28Persistent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522101/KoGaMa%20Avatar%20Change%20with%20Custom%20Image%20%28Persistent%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the avatar change panel
    function createAvatarChangePanel() {
        // Check if the panel already exists
        if (document.getElementById('avatarChangePanel')) return;

        // Create the panel element
        const panel = document.createElement('div');
        panel.id = 'avatarChangePanel';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = '#ffffff';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '20px';
        panel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
        panel.style.zIndex = '9999';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.width = '250px';
        panel.style.borderRadius = '5px';

        // Title of the panel
        const title = document.createElement('h3');
        title.innerText = 'Change Avatar';
        title.style.marginBottom = '10px';
        panel.appendChild(title);

        // Add the file input element inside the panel
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Only accept images
        input.id = 'avatarUploadInput';
        input.style.marginBottom = '10px';
        input.style.display = 'block';

        // Add a label for the input
        const label = document.createElement('label');
        label.innerText = 'Upload Custom Avatar';
        label.style.color = '#007bff';
        label.style.textDecoration = 'underline';
        label.style.cursor = 'pointer';
        label.setAttribute('for', 'avatarUploadInput');

        // Append input and label to the panel
        panel.appendChild(label);
        panel.appendChild(input);
        document.body.appendChild(panel);

        // Add an event listener for file input change
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    // Find the SVG element and locate the <image> element within it
                    const avatarSvg = document.querySelector('div._2bUqU svg');
                    const avatarImage = avatarSvg ? avatarSvg.querySelector('image._3tYRU') : null;

                    console.log("Avatar element found:", avatarImage);

                    if (avatarImage) {
                        // Change the avatar image source to the selected file
                        avatarImage.setAttribute('xlink:href', e.target.result);
                        console.log("Avatar updated with new image source:", e.target.result);

                        // Save the new avatar image in localStorage
                        localStorage.setItem('kogama_avatar', e.target.result);

                        alert("Avatar updated successfully!");
                    } else {
                        console.log("Avatar image not found! Please check the page structure.");
                        alert("Avatar element not found! Please check the page structure.");
                    }
                };

                reader.onerror = function() {
                    alert("Failed to read the file. Please try again.");
                };

                reader.readAsDataURL(file); // Read the file as a data URL
            }
        });
    }

    // Function to restore the avatar image from localStorage
    function restoreAvatar() {
        const storedAvatar = localStorage.getItem('kogama_avatar');
        if (storedAvatar) {
            const avatarSvg = document.querySelector('div._2bUqU svg');
            const avatarImage = avatarSvg ? avatarSvg.querySelector('image._3tYRU') : null;

            if (avatarImage) {
                avatarImage.setAttribute('xlink:href', storedAvatar);
                console.log("Restored avatar from localStorage:", storedAvatar);
            }
        }
    }

    // Wait for the page to fully load and display the panel
    window.addEventListener('load', function() {
        createAvatarChangePanel();
        restoreAvatar(); // Restore the avatar from localStorage if it exists
    });
})();