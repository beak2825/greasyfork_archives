// ==UserScript==
// @name         WeSupply Popup Comments
// @namespace    http://tampermonkey.net/
// @version      2024-08-04
// @description  This script monitors WeSupply pages for RMA numbers and comments.
// @author       You
// @match        https://*.labs.wesupply.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wesupply.xyz
// @grant        none
// @license      MIT
// @website      https://greasyfork.org/en/scripts/502384-wesupply-popup-comments
// @downloadURL https://update.greasyfork.org/scripts/502384/WeSupply%20Popup%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/502384/WeSupply%20Popup%20Comments.meta.js
// ==/UserScript==

(function() {//////////////////////////////////////////////////////////////
    'use strict';//////////////////////////////////////////////////////////

function monitorRmaAndUpdateTitle() {
    let previousText = null;
    let titleUpdateInterval = null;

    function updateTitle() {
        const rmaElement = document.querySelector('.rma');
        if (rmaElement) {
            let currentText = rmaElement.innerText.trim();

            if (currentText === "Return #") {
                currentText = ""; //Text is blank
                console.log(1,currentText);
            }

            if (currentText !== previousText && currentText !== "") {
                console.log(2,currentText);
                // Update title
                document.title = currentText;

                // Collect texts from .text elements inside .state-comments
                const stateComments = document.querySelectorAll('.state-comments');
                let texts = [];

                stateComments.forEach(comment => {
                    const textElement = comment.querySelector('.text');
                    if (textElement && textElement.innerText.trim() !== '') {
                        texts.push(textElement.innerText.trim());
                    }
                });

                // Only show alert if there are comments
                if (texts.length > 0) {
                    let alertText = 'The current: ' + currentText;
                    alertText += '\n\n Please note the comments for this order:\n' + texts.join('\n');
                    alert(alertText);
                }

                previousText = currentText;
                console.log(3,currentText);
            }
        }
    }

    // Run the update function every second
    titleUpdateInterval = setInterval(updateTitle, 500);

    // Optionally, you can return a function to stop monitoring if needed
    return function stopMonitoring() {
        clearInterval(titleUpdateInterval);
    };
}

// Start monitoring when the script loads
const stopMonitoring = monitorRmaAndUpdateTitle();

// If you ever need to stop monitoring, you can call stopMonitoring()
// stopMonitoring();
})();//////////////////////////////////////////////////////////////////////