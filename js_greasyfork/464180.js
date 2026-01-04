// ==UserScript==
// @name         Inline Thumbnail images on 0xxx.ws
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display thumbnail images in a new cell to the left of the link
// @author       borgeleros / ChatGPT
// @match       https://0xxx.ws/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464180/Inline%20Thumbnail%20images%20on%200xxxws.user.js
// @updateURL https://update.greasyfork.org/scripts/464180/Inline%20Thumbnail%20images%20on%200xxxws.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to insert the image into a new cell to the left of the cell with the link
    function insertImageInNewCell(link) {
        const imageURL = link.getAttribute("rel");
        if (!imageURL) return; // Skip if the "rel" attribute is not present or empty

        const imgElement = document.createElement("img");

        imgElement.src = imageURL;
        imgElement.style.width = "200px"; // Set desired thumbnail width (doubled the size)
        imgElement.style.height = "auto";

        // Create a new table cell and insert the image into it
        const newCell = document.createElement("td");
        newCell.appendChild(imgElement);

        // Insert the new cell to the left of the cell containing the link
        link.parentElement.parentElement.insertBefore(newCell, link.parentElement);
    }

    // Get all links with class "screenshot" and insert images into new cells
    const links = document.querySelectorAll('a.screenshot');
    links.forEach(link => {
        insertImageInNewCell(link);
    });

})();
