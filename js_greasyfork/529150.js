// ==UserScript==
// @name         Battledome Play Again Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a Play Again button after flcollapse div on Neopets Battledome
// @author       Bryan
// @license      MIT
// @match        https://www.neopets.com/dome/arena.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529150/Battledome%20Play%20Again%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529150/Battledome%20Play%20Again%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and style the button
    function createPlayAgainButton() {
        var button = document.createElement('button');
        button.textContent = 'Play Again';
        button.id = 'customPlayAgain';
        button.addEventListener('click', function() {
            var playAgain = document.getElementById('bdplayagain');
            if (playAgain) {
                playAgain.click();
                console.log('Play Again clicked');
            } else {
                console.log('bdplayagain element not found');
            }
        });

        // Match Neopets button styling
        button.className = 'caction';
        button.style.display = 'inline-block';
        button.style.margin = '5px';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '14px';
        button.style.position = 'relative';

        return button;
    }

    // Function to insert the button after flcollapse div
    function insertButton() {
        if (document.getElementById('customPlayAgain')) {
            return;
        }

        var flcollapse = document.getElementById('flcollapse');
        if (flcollapse && flcollapse.parentNode) {
            // Insert after the flcollapse div
            if (flcollapse.nextSibling) {
                flcollapse.parentNode.insertBefore(createPlayAgainButton(), flcollapse.nextSibling);
            } else {
                flcollapse.parentNode.appendChild(createPlayAgainButton());
            }
            console.log('Play Again button inserted after flcollapse div');
        } else {
            console.log('flcollapse div not found yet');
        }
    }

    // Initial attempt after DOM load
    window.addEventListener('load', function() {
        insertButton();
    });

    // MutationObserver for dynamic content
    const observer = new MutationObserver(function(mutations) {
        insertButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback interval
    let attempts = 0;
    const maxAttempts = 15;
    const interval = setInterval(function() {
        if (document.getElementById('customPlayAgain') || attempts >= maxAttempts) {
            clearInterval(interval);
            if (attempts >= maxAttempts) {
                console.log('Max attempts reached, button insertion failed');
            }
        } else {
            insertButton();
            attempts++;
        }
    }, 500); // Check every half second

})();