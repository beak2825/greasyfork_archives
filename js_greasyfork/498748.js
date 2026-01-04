// ==UserScript==
// @name         Random Animal in Top Left Corner on YouTube
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a random animal to the top left corner of YouTube
// @author       Maciek
// @match        https://www.youtube.com/
// @grant        none
// @license MIT
// @name:pl      Losowe Zwierzątka w Górnym Lewym rogu na YouTube
// @description:pl  Dodaje słodkie zwierzątka w lewym górnym rogu na YouTube
// @icon https://cdn.glitch.global/e70d478c-6d12-4fe8-953d-c816f4b8b5a8/WhatsApp_Image_2024-06-24_at_09.22.57__1_-removebg-preview.png?v=1719219174903
// @downloadURL https://update.greasyfork.org/scripts/498748/Random%20Animal%20in%20Top%20Left%20Corner%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/498748/Random%20Animal%20in%20Top%20Left%20Corner%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // URL images of animals
    const animals = [
        'https://cdn.glitch.global/e70d478c-6d12-4fe8-953d-c816f4b8b5a8/WhatsApp_Image_2024-06-24_at_09.22.57-removebg-preview.png?v=1719218808663',
        'https://cdn.glitch.global/e70d478c-6d12-4fe8-953d-c816f4b8b5a8/WhatsApp_Image_2024-06-24_at_09.22.57__1_-removebg-preview.png?v=1719219174903',
        'https://cdn.glitch.global/e70d478c-6d12-4fe8-953d-c816f4b8b5a8/WhatsApp_Image_2024-06-24_at_09.22.57__2_-removebg-preview.png?v=1719219300201',
        'https://cdn.glitch.global/e70d478c-6d12-4fe8-953d-c816f4b8b5a8/WhatsApp_Image_2024-06-24_at_09.22.57-removebg-preview.png?v=1719218808663'
    ];

    // Function to create and insert animal image in the top left corner
    function insertAnimal() {
        const img = document.createElement('img');
        img.src = animals[Math.floor(Math.random() * animals.length)];
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.zIndex = '9999';

        document.body.appendChild(img);
    }

    // Insert animal in the top left corner
    insertAnimal();

})();