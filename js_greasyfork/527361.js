// ==UserScript==
// @name         Rule34 Bulk Unfavorite
// @version      1.5
// @description  Automatically remove all favorites from rule34.xxx using AJAX and auto-refresh to handle pagination.
// @author       https://github.com/binge-coder
// @match        *://rule34.xxx/index.php?page=favorites*
// @run-at       document-end
// @namespace    https://github.com/binge-coder
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527361/Rule34%20Bulk%20Unfavorite.user.js
// @updateURL https://update.greasyfork.org/scripts/527361/Rule34%20Bulk%20Unfavorite.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Delay (in ms) between individual removals
    const removalDelay = 1000;
    // Delay (in ms) before refreshing the page after processing a batch
    const refreshDelay = 2000;
    // Set to true to auto-run the removal process on page load if favorites are found
    const autoRun = true;

    function processFavoritesBatch() {
        // Find all <b> elements whose text is exactly "Remove" (ignoring case/whitespace)
        let removeButtons = Array.from(document.querySelectorAll('b'))
            .filter(b => b.textContent.trim().toLowerCase() === "remove")
            .map(b => b.closest('a'))
            .filter(a => a !== null);

        console.log("Found", removeButtons.length, "remove buttons on this page.");

        if(removeButtons.length === 0) {
            console.log("No favorites found on this page. Process complete.");
            return;
        }

        let index = 0;
        function removeNext() {
            if(index >= removeButtons.length) {
                console.log("Batch complete. Refreshing page in", refreshDelay, "ms...");
                // After processing the current page, refresh it to load the next batch (if any)
                setTimeout(() => location.reload(), refreshDelay);
                return;
            }
            let button = removeButtons[index];
            let onclickStr = button.getAttribute("onclick");
            // Extract the URL from the onclick attribute, e.g. document.location='index.php?page=favorites&s=delete&id=12345&return_pid=0'
            let match = onclickStr && onclickStr.match(/document\.location\s*=\s*'(.*?)'/);
            if(match && match[1]) {
                let url = match[1];
                console.log("Removing favorite via URL:", url);
                // Use fetch to perform the removal without reloading the page
                fetch(url, { credentials: 'include' })
                    .then(response => response.text())
                    .then(text => {
                        console.log("Removed favorite at index", index);
                        // Optionally, remove the element from the DOM:
                        // button.closest('div')?.remove();
                        index++;
                        setTimeout(removeNext, removalDelay);
                    })
                    .catch(err => {
                        console.error("Error removing favorite at index", index, err);
                        index++;
                        setTimeout(removeNext, removalDelay);
                    });
            } else {
                console.warn("No URL found in onclick for button", button);
                index++;
                setTimeout(removeNext, removalDelay);
            }
        }
        removeNext();
    }

    // Optionally add a manual "Remove All Favorites" button in the top-right corner
    function addManualButton() {
        let startButton = document.createElement("button");
        startButton.innerText = "Remove All Favorites";
        startButton.style.position = "fixed";
        startButton.style.top = "10px";
        startButton.style.right = "10px";
        startButton.style.zIndex = "1000";
        startButton.style.padding = "10px";
        startButton.style.backgroundColor = "red";
        startButton.style.color = "white";
        startButton.style.border = "none";
        startButton.style.cursor = "pointer";
        startButton.onclick = processFavoritesBatch;
        document.body.appendChild(startButton);
    }

    addManualButton();

    // Auto-run the removal process on page load if favorites exist on the current page.
    if(autoRun) {
        let removeButtons = Array.from(document.querySelectorAll('b'))
            .filter(b => b.textContent.trim().toLowerCase() === "remove");
        if(removeButtons.length > 0) {
            console.log("Auto-run enabled and favorites found. Starting removal process...");
            processFavoritesBatch();
        } else {
            console.log("Auto-run enabled but no favorites found on this page.");
        }
    }
})();
