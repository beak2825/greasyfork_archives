// ==UserScript==
// @name         Auto Format Repack Features
// @namespace    AFRF-FitGirl
// @version      0.1
// @description  Auto format text in the text field by prepending [*] to each line after "Repack Features" - For use with FitGirl
// @author       Your Name
// @match        https://gazellegames.net/upload.php?groupid=*
// @grant        none
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523227/Auto%20Format%20Repack%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/523227/Auto%20Format%20Repack%20Features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', () => {
        const textField = document.querySelector('#release_desc');
        if (textField) {
            // Create the button
            const button = document.createElement('button');
            button.innerText = 'FitGirl it';
            button.style.marginLeft = '10px';
            textField.parentNode.insertBefore(button, textField.nextSibling);

            // Add event listener to the button
            button.addEventListener('click', () => {
                const lines = textField.value.split('\n');
                let foundRepackFeatures = false;
                const formattedLines = lines.map(line => {
                    if (foundRepackFeatures) {
                        return '[*] ' + line;
                    }
                    if (line.includes('Repack Features')) {
                        foundRepackFeatures = true;
                    }
                    return line;
                });
                textField.value = formattedLines.join('\n');
            });
        } else {
            alert('Text field not found!');
        }
    });
})();