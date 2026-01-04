// ==UserScript==
// @name         Floating Publish Button on Greasyfork
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Add a floating publish button on Greasyfork new script version page
// @author       max5555
// @license      MIT
// @match        https://greasyfork.org/uk/script_versions/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481681/Floating%20Publish%20Button%20on%20Greasyfork.user.js
// @updateURL https://update.greasyfork.org/scripts/481681/Floating%20Publish%20Button%20on%20Greasyfork.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button
    var floatingButton = document.createElement('button');
    floatingButton.innerText = 'Опублікувати скрипт';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.padding = '10px';
    floatingButton.style.backgroundColor = '#4CAF50';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.zIndex = '1000';

    // Append the button to the body
    document.body.appendChild(floatingButton);

    // Function to simulate the click on the actual publish button
    floatingButton.addEventListener('click', function() {
        var publishButton = document.querySelector('input[name="commit"][value="Опублікувати скрипт"]');
        if (publishButton) {
            publishButton.click();
        }
    });
})();
