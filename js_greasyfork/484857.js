// ==UserScript==
// @name         Early TurboBuilder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get TurboBuilder extension early.
// @author       oc9x97
// @match        https://studio.penguinmod.com/editor.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484857/Early%20TurboBuilder.user.js
// @updateURL https://update.greasyfork.org/scripts/484857/Early%20TurboBuilder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified element
    function removeElement(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    // Function to add the new element inside the library scroll grid
    function addNewElement() {
        var libraryScrollGrid = document.querySelector('.library_library-scroll-grid_1jyXm');

        if (libraryScrollGrid) {
            var newElement = document.createElement('a');
            newElement.href = 'https://turbobuilder-steel.vercel.app/';
            newElement.target = '_blank';
            newElement.rel = 'noopener noreferrer';
            newElement.style.textDecoration = 'none';
            newElement.style.color = 'inherit';

            newElement.innerHTML = `
                <div class="library-item_library-item_1DcMO library-item_featured-item_3V2-t library-item_library-item-extension_3xus9" style="height: 378px;">
                    <div class="library-item_featured-image-container_1KIHG">
                        <img class="library-item_featured-image_2gwZ6" loading="lazy" draggable="false" src="static/assets/93db39f338237e6a51790829ba22a879.png">
                    </div>
                    <button data-clearclick="true" data-activated="false" class="library-item_library-item-favorite_3N_c1">
                        <img data-usedimage="true" data-clearclick="true" src="static/assets/e28b110fa5eef35531fa271a3a7b6314.svg">
                        <img data-usedimage="false" data-clearclick="true" src="static/assets/27802141bca7404b477168369bf3475d.svg">
                    </button>
                    <div class="library-item_featured-extension-text_22A1k library-item_featured-text_2KFel">
                        <span class="library-item_library-item-name_2qMXu">TurboBuilder</span><br>
                        <span class="library-item_featured-description_MjIJw">Create your own amazing extensions using a scratch-based UI!</span>
                    </div>
                    <div class="library-item_featured-extension-metadata_3D8E8">
                        <div class="library-item_featured-extension-requirement_2u2IO"></div>
                        <div class="library-item_featured-extension-collaboration_2dGS9">
                            <div class="library-item_small-bottom-margin_2XgVk">
                                <div>Credits</div>
                                <div class="library-item_featured-extension-metadata-detail_1M9BV">Started by JeremyGamer13, continued by jwklong</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append the new element to the library scroll grid
            libraryScrollGrid.appendChild(newElement);
        }
    }

    // Function to check if the specified elements exist
    function checkForElements() {
        // Check for the "Coming Soon" element
        var comingSoonElement = document.querySelector('.library-item_coming-soon-text_30OPh');
        if (comingSoonElement) {
            // If the "Coming Soon" element is found, remove it
            removeElement('.library-item_library-item_1DcMO.library-item_featured-item_3V2-t.library-item_disabled_1-aDH.library-item_library-item-extension_3xus9');
            // Add the new element
            addNewElement();
        }

        // Keep repeating
        setTimeout(checkForElements, 100);
    }

    // Start checking for the elements
    checkForElements();
})();
