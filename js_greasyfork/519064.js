// ==UserScript==
// @name        Open Image on Double-Click
// @namespace   net.tealpink
// @version     1.0.0
// @description Opens the image in a new tab on double-clicking full image
// @author      tealpink
// @license     MIT
// @match       https://onlyfans.com/*
// @grant       none
// @run-at      document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/519064/Open%20Image%20on%20Double-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/519064/Open%20Image%20on%20Double-Click.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add a double-click listener to the document body
    document.body.addEventListener('dblclick', function (e) {
        const clickedElement = e.target;

        // Check if the clicked element is a <div> containing an <img>
        if (clickedElement.tagName === 'DIV' && clickedElement.querySelector('img')) {
            const imgElement = clickedElement.querySelector('img');
            openImageInNewTab(imgElement);
        }
    });

    // Function to open an image in a new tab
    function openImageInNewTab(imgElement) {
        if (imgElement && imgElement.src) {
            window.open(imgElement.src, '_blank'); // Open the image source in a new tab
        } else {
            alert('No image source found!');
        }
    }
})();
