// ==UserScript==
// @name         JARTYBOT
// @namespace    http://tampermonkey.net/
// @version      2024-08-22
// @description  jartybot spammer o algo o algo
// @author       You
// @match        https://jakparty.soy/soy/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jakparty.soy
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504720/JARTYBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/504720/JARTYBOT.meta.js
// ==/UserScript==

(function() {
    'use strict';
(function() {
    const imageUrls = [
        'https://files.catbox.moe/fq29ga.png',
        'https://files.catbox.moe/5saz47.png',
        'https://files.catbox.moe/37tjjs.png',
        'https://files.catbox.moe/qj04ob.png',
        'https://files.catbox.moe/f84tp6.png'
        // Add more image URLs here
    ];

    // Array of random words or phrases (about 100 words total)
    const wordBank = [
        'jartybot:', 'are you a jartycuck?', 'yes i am a jartycuck!', 'fnf like having fun!', 'jartycucks lost', 'sharty won', 'you are a jartycuck! yes you!',
        'ohnonono can jartycucks even sneed?', 'jartycucks..? our response?', 'three times you cant ban me!', 'catch all my proxies niggers!'
        // You can add or modify words here
    ];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomText() {
        let randomText = '';
        for (let i = 0; i < 5; i++) { // Pick 5 random words
            randomText += getRandomItem(wordBank) + ' ';
        }
        return randomText.trim();
    }

    async function simulateFileDrop() {
        const randomImageUrl = getRandomItem(imageUrls);
        const imageName = randomImageUrl.split('/').pop(); // Extract the file name from the URL

        // Fetch the image data
        const response = await fetch(randomImageUrl);
        if (!response.ok) {
            console.error('Failed to fetch image:', randomImageUrl);
            return;
        }
        const blob = await response.blob();

        const file = new File([blob], imageName, { type: blob.type });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);


        const dropEvent = new DragEvent('drop', {
            dataTransfer: dataTransfer,
            bubbles: true,
            cancelable: true
        });

        // Find the label element and dispatch the drop event
        const fileLabel = document.querySelector('label[for="file"]');
        if (fileLabel) {
            fileLabel.dispatchEvent(dropEvent);
        } else {
            console.error('File label element not found.');
        }
    }

    // Function to populate the form fields automatically
    function populateForm() {
        // Find the textarea and set random text (now linked correctly)
        const textArea = document.querySelector('textarea[name="message"]');
        if (textArea) {
            textArea.value = randomText();
        }

        // Simulate setting the image file
        simulateFileDrop();

        // Click the submit button after 1 second
        setTimeout(() => {
            const submitButton = document.getElementById('submitpost');
            if (submitButton) {
                submitButton.click();
            } else {
                console.error('Submit button not found.');
            }
        }, 1000); // 1 second delay, change if you want, for nusoicacas that can't read at all just umm like heckin figure it out i guess 1000 is 1 second for reference
    }

    // Set up a loop to repeat the process every 6 seconds (if needed)
    setInterval(populateForm, 6000);
})();


})();