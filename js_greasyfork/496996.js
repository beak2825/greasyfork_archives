// ==UserScript==
// @name         Vichan Auto Poster
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Automatically post on Vichan boards
// @author       Your Name
// @match        https://example.com/board.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496996/Vichan%20Auto%20Poster.user.js
// @updateURL https://update.greasyfork.org/scripts/496996/Vichan%20Auto%20Poster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace these with the appropriate form field values and your data
    const postData = {
        name: 'Your Name',            // Poster name
        email: 'Your Email',          // Email field (optional)
        subject: 'Your Subject',      // Post subject
        message: 'Your Message',      // Post message
        password: 'postpassword'      // Password for post deletion
        // Add more fields if necessary
    };

    // Replace with the path to the image you want to upload (if any)
    const imageFilePath = 'path/to/your/image.jpg';

    function createFormData(postData, imageFilePath) {
        const formData = new FormData();
        for (const key in postData) {
            if (postData.hasOwnProperty(key)) {
                formData.append(key, postData[key]);
            }
        }

        if (imageFilePath) {
            // Fetch the image file and append it to the form data
            fetch(imageFilePath)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], 'filename.jpg', { type: 'image/jpeg' });
                    formData.append('file', file);
                })
                .catch(error => console.error('Error fetching the image file:', error));
        }

        return formData;
    }

    function postForm() {
        const formData = createFormData(postData, imageFilePath);
        
        fetch(window.location.href, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Post successful!');
            } else {
                console.error('Post failed with status code:', response.status);
            }
        })
        .catch(error => console.error('Error posting the form:', error));
    }

    // Example: Trigger the post when a button is clicked
    const button = document.createElement('button');
    button.textContent = 'Auto Post';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.addEventListener('click', postForm);
    document.body.appendChild(button);
})();
