// ==UserScript==
// @name         TorrentGalaxyScript
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Torrentgalaxy Special Offer Adblocker + Lazy Dark Theme
// @author       nour
// @match        https://torrentgalaxy.to/*
// @match        https://torrentgalaxy.to/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485225/TorrentGalaxyScript.user.js
// @updateURL https://update.greasyfork.org/scripts/485225/TorrentGalaxyScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Set darkthemev2 to 0 if you want to disable it
    localStorage.setItem('darkthemev2', '1');

    // Helper function to convert RGB to HEX
    function rgbToHex(rgb) {
        // Convert an RGB color value to HEX
        let [r, g, b] = rgb.match(/\d+/g).map(Number);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    // Function to replace a specific color across all elements
    function replaceColor(oldColor, newColor) {
        // Normalize oldColor to HEX if it is in RGB format
        if (oldColor.includes('rgb')) {
            oldColor = rgbToHex(oldColor);
        }

        // Ensure oldColor is uppercase since the conversion returns an uppercase HEX code
        oldColor = oldColor.toUpperCase();

        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);

            // Replace the old color with the new color in all color-related properties
            ['color', 'backgroundColor', 'borderColor'].forEach(property => {
                // Normalize backgroundColor to HEX if it is in RGB format
                let elementColor = computedStyle[property];
                if (elementColor.includes('rgb')) {
                    elementColor = rgbToHex(elementColor);
                }

                if (elementColor === oldColor) {
                    element.style[property] = newColor;
                }
            });
        });
    }


    function removeSpecificDivsAndLogCountOG() {
        const links = document.querySelectorAll('div.hotpicks a[href^="/huxxg.php"]');
        if (links.length === 0) {
            console.log('No div.hotpicks elements found with an \'a\' having href starting with \'/hub.php\'.');
        } else {
            console.log(`Number of div.hotpicks elements found with an 'a' having href starting with '/hub.php': ${links.length}`);
            links.forEach(link => {
                let hotpicksDiv = link.closest('div.hotpicks');
                if (hotpicksDiv) {
                    hotpicksDiv.remove();
                }
            });
        }
    }

    function jew() {

     if (window.location.href === 'https://torrentgalaxy.to/donate') {
        window.location.href = 'https://torrentgalaxy.to/';
        return;
    }

    const links = document.querySelectorAll('div.hotpicks a[onmouseover*="Hot offer!"]');
    if (links.length === 0) {
        // Log if no such links are found
        console.log('No div.hotpicks elements found with an \'a\' having onmouseover containing "Hot offer!".');
    } else {
        // Log how many such links are found
        console.log(`Number of div.hotpicks elements found with an 'a' having onmouseover containing "Hot offer!": ${links.length}`);
        // Remove each parent div.hotpicks of the found links
        links.forEach(link => {
            let hotpicksDiv = link.closest('div.hotpicks');
            if (hotpicksDiv) {
                hotpicksDiv.remove();
            }
        });
    }
}

    // Wait for the document to be fully loaded before observing for changes
    function waitForDocumentBody() {
        if (document.body) {
            if (localStorage.getItem('darkthemev2') === '1') {
            replaceColor('rgb(210, 194, 172)', 'rgb(255, 255, 255)');
            replaceColor('rgb(120, 144, 78)', 'rgb(0, 0, 0)');
            replaceColor('rgb(48, 58, 31)', 'rgb(18, 18, 18)');
            replaceColor('rgb(50, 47, 64)', 'rgb(18, 18, 18)');
            replaceColor('rgb(180, 174, 164)', 'rgb(255, 255, 255)');
            replaceColor('rgb(122, 113, 100)', 'rgb(0, 0, 0)');
            replaceColor('rgb(180, 174, 164)', 'rgb(255, 255, 255)');
            replaceColor('rgb(180, 174, 164)', 'rgb(255, 255, 255)');
            replaceColor('rgb(180, 174, 164)', 'rgb(255, 255, 255)');
            replaceColor('rgb(180, 174, 164)', 'rgb(255, 255, 255)');

            replaceColor('#3c4827', '#000000');
            replaceColor('#d8cab7', '#ffffff');
            replaceColor('#s2f2f2f', '#000000');
            replaceColor('#3f3b50', '#000000');
            replaceColor('#5d87ab', '#ffffff');
            replaceColor('#819FD1', '#ffffff');
            replaceColor('#2f2f2f', '#000000');
            replaceColor('#383838', '#0a0a0a');
            replaceColor('#353535', '#0a0a0a');
            replaceColor('#444444', '#121212');
            replaceColor('#423b48', '#060606');
            replaceColor('#6e236f', '#060606');
            replaceColor('#353146', '#0a0a0a');
            replaceColor('#3c4827', '#000000');
            replaceColor('#3f3b50', '#121212');
            replaceColor('#353146', '#0a0a0a');
        }
            // Configuration of the observer
            const config = { childList: true, subtree: true };

            // Create a MutationObserver to handle dynamically added content
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes) {
                        jew();
                    }
                });
            });

            // Start observing the document for added nodes
            observer.observe(document.body, config);

            // Initial removal of matching divs and log count or 'none found'
            jew();
        } else {
            // If the body isn't available yet, set a timeout to try again
            window.setTimeout(waitForDocumentBody, 50);
        }
    }

    // Start the script
    waitForDocumentBody();
})();