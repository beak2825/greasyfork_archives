// ==UserScript==
// @name         Number imgur album images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Numbers the images in imgur albums, so it's easier to reference them as #X in the comment section
// @author       Retsam19
// @match        imgur.com/gallery/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39202/Number%20imgur%20album%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/39202/Number%20imgur%20album%20images.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const CONTAINER_ELEMENT_CLASS = "post-image-container"; //Class used by imgur for image containers
const IMAGE_ELEMENT_CLASS = "post-image";               //Class used by imgur for individual images
const INDEX_ELEMENT_CLASS = "post-image-index";         //Class used by this script for it's index labels that it adds to the DOM
(function() {
    'use strict';

    //Map from image id to index
    const imageIndexes = {};

    new MutationObserver(() => {
        const imageContainers = document.querySelectorAll("."+CONTAINER_ELEMENT_CLASS);
        //Don't attempt to number single image albums
        if(imageContainers.length < 2) return;

        let previousIndex = null;
        for(const imageContainer of imageContainers) {
            const id = imageContainer.id;
            if(!previousIndex) {
                //For the first image that's currently visible, either lookup its index from the map...
                //  ... or else assume it's the first image
                previousIndex = imageIndexes[id] || 1;
            } else {
                //For the rest, just increment from the previous
                previousIndex += 1;
            }
            //Update indexes with the (possibly new) index
            const index = imageIndexes[id] = previousIndex;

            //Update the DOM with the label element
            let indexLabelElement = imageContainer.querySelector("."+INDEX_ELEMENT_CLASS);
            if(!indexLabelElement) {
                //Create the element
                indexLabelElement = document.createElement("div");
                //With the identifiable class
                indexLabelElement.classList.add(INDEX_ELEMENT_CLASS);
                //Centered text
                indexLabelElement.style.textAlign = "center";
                //Add it to the DOM
                imageContainer.querySelector("."+IMAGE_ELEMENT_CLASS).insertAdjacentElement('afterend', indexLabelElement);
            }
            //Update the text
            indexLabelElement.innerText = `^ ${index} ^`;
        }

    }).observe(document.body, {
    childList: true,
    subtree: true
});
})();