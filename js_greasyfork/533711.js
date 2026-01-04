// ==UserScript==
// @name         Chicken Smoothie Image-Based Pet Adopter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically adopts pets based on image priority list
// @author       You
// @match        https://www.chickensmoothie.com/poundandlostandfound.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533711/Chicken%20Smoothie%20Image-Based%20Pet%20Adopter.user.js
// @updateURL https://update.greasyfork.org/scripts/533711/Chicken%20Smoothie%20Image-Based%20Pet%20Adopter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define an array of image URLs or base64 strings to match against (your priority list)
    const targetImages = [
        'https://static.chickensmoothie.com/archive/image.php?k=ABA969E5BDBEABFF768FD0B7212C3C0F&bg=2a2b51', // Example pet image
        'https://static.chickensmoothie.com/pic.php?k=9745851F52AB38565A01EE552170F89E&bg=1d1e38', // Another pet
        // Add more URLs of pets you want to adopt
    ];

    // Function to check if the pet image matches any in the list
    function checkForMatch(petImageSrc) {
        return targetImages.includes(petImageSrc);
    }

    // Function to adopt the pet once matched
    function adoptPet(petLink) {
        window.location.href = petLink; // Navigate to pet's adoption link
    }

    // Function to scan the Pound page for pets
    function scanPoundForPets() {
        // Select all pet images in the Pound
        const petImages = document.querySelectorAll('.pound-list img');

        petImages.forEach((img) => {
            const petImageSrc = img.src;

            if (checkForMatch(petImageSrc)) {
                // If we find a match, find the adopt button associated with this pet
                const petCard = img.closest('.pound-item'); // Assuming each pet is inside a container
                const adoptButton = petCard.querySelector('a.adopt-button');

                if (adoptButton) {
                    console.log(`Found a matching pet, adopting...`);
                    adoptPet(adoptButton.href); // Adopt the pet by clicking the button
                }
            }
        });
    }

    // Scan the Pound every 0.3 seconds for new pets
    setInterval(scanPoundForPets, 300);

})();
