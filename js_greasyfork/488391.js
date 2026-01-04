// ==UserScript==
// @name         HD Images with Creative Commons License Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically search for HD images with Creative Commons license on Google Images.
// @author       iamnobody
// @license      MIT
// @match        *://www.google.com/searchbyimage*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488391/HD%20Images%20with%20Creative%20Commons%20License%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/488391/HD%20Images%20with%20Creative%20Commons%20License%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the "Tools" button to show image search filters
    function clickToolsButton() {
        var toolsButton = document.querySelector('div[data-ved="0ahUKEwi1qJG3h5P1AhURlIsKHddTAJQQ7eoBCEQ"]'); // Update with appropriate selector
        if (toolsButton) {
            toolsButton.click();
        }
    }

    // Function to select "Usage rights" dropdown and choose "Creative Commons licenses"
    function selectCreativeCommons() {
        var usageRightsDropdown = document.querySelector('div[data-ved="0ahUKEwi1qJG3h5P1AhURlIsKHddTAJQQ7e0BCEc"]'); // Update with appropriate selector
        if (usageRightsDropdown) {
            usageRightsDropdown.click();
            var creativeCommonsOption = document.querySelector('span:contains("Creative Commons licenses")');
            if (creativeCommonsOption) {
                creativeCommonsOption.click();
            }
        }
    }

    // Function to select "Size" dropdown and choose "Large"
    function selectSize() {
        var sizeDropdown = document.querySelector('div[data-ved="0ahUKEwi1qJG3h5P1AhURlIsKHddTAJQQ7e4BCEk"]'); // Update with appropriate selector
        if (sizeDropdown) {
            sizeDropdown.click();
            var largeSizeOption = document.querySelector('span:contains("Large")');
            if (largeSizeOption) {
                largeSizeOption.click();
            }
        }
    }

    // Function to click "Tools" button and apply filters
    function applyFilters() {
        clickToolsButton();
        setTimeout(selectCreativeCommons, 1000);
        setTimeout(selectSize, 2000);
    }

    // Run the function to apply filters when the page is loaded
    window.onload = function() {
        applyFilters();
    };

})();
