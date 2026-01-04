// ==UserScript==
// @name         PAC MAN
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  replace ":v" with the pacman emoji
// @author       Jamir-boop
// @match        *://*/*
// @icon         https://static.xx.fbcdn.net/images/emoji.php/v9/ef8/1.5/16/PACMAN.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486701/PAC%20MAN.user.js
// @updateURL https://update.greasyfork.org/scripts/486701/PAC%20MAN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace ":v" with an image
    function replacePacmanEmoji() {
        // Define the image to replace with
        const pacmanImage = '<img src="https://static.xx.fbcdn.net/images/emoji.php/v9/ef8/1.5/16/PACMAN.png" alt="Pacman" style="width:16px;height:16px;">';

        // Get all the text nodes in the document
        const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let currentNode;
        while(currentNode = textNodes.nextNode()) {
            // Replace ":v" in the text node with the Pac-Man image
            const replacedText = currentNode.nodeValue.replace(/:v/g, pacmanImage);
            if(replacedText !== currentNode.nodeValue) {
                // Create a temporary div to hold the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = replacedText;
                // Replace the current text node with the new nodes
                while(tempDiv.firstChild) {
                    currentNode.parentNode.insertBefore(tempDiv.firstChild, currentNode);
                }
                currentNode.parentNode.removeChild(currentNode);
            }
        }
    }

    // Run the replacement function when the document loads
    window.addEventListener('load', replacePacmanEmoji);

    // Optional: Observe for dynamic content changes and apply replacement
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(mutation.addedNodes.length) replacePacmanEmoji();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();