// ==UserScript==
// @name         nhentai auto scroller
// @namespace    https://nhentai.net/
// @version      1.3
// @description  Automatically changes the image source and page counter every 6 seconds (toggle button now included)
// @match        https://nhentai.net/g/*/*/
// @author       equmaq
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468134/nhentai%20auto%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/468134/nhentai%20auto%20scroller.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to change the image source
    function changeImageSource() {
        if (document.hidden) {
            return; // Skip changing the source if the page is not in focus
        }

        var toggleButton = document.evaluate("/html/body/div[2]/section[4]/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (toggleButton.textContent === "►") {
            return; // Skip changing the source if the toggle button is displaying "►"
        }

        var imgElement = document.evaluate("/html/body/div[2]/section[3]/a/img", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var currentSrc = imgElement.src;
        var splitSrc = currentSrc.split('/');
        var currentNumber = splitSrc[splitSrc.length - 1].split('.')[0];
        var newNumber = parseInt(currentNumber) + 1;
        var newSrc = currentSrc.replace(currentNumber + '.jpg', newNumber + '.jpg');
        imgElement.src = newSrc;
    }

    // Function to change the page counter text
    function changePageCounter() {
        if (document.hidden) {
            return; // Skip changing the page counter if the page is not in focus
        }

        var toggleButton = document.evaluate("/html/body/div[2]/section[4]/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (toggleButton.textContent === "►") {
            return; // Skip changing the page counter if the toggle button is displaying "►"
        }

        var counterElement = document.evaluate("/html/body/div[2]/section[4]/div[2]/button/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var currentPage = parseInt(counterElement.textContent);
        var newPage = currentPage + 1;
        counterElement.textContent = newPage.toString();
    }

    // Function to toggle the button text and action
    function toggleButton() {
        if (document.hidden) {
            return; // Skip toggling the button if the page is not in focus
        }

        var buttonElement = document.createElement("span");
        buttonElement.style.width = "40px";
        buttonElement.style.height = "40px";
        buttonElement.style.display = "inline-flex";
        buttonElement.style.alignItems = "center";
        buttonElement.style.justifyContent = "center";
        buttonElement.style.cursor = "pointer";
        buttonElement.style.fontSize = "24px";
        buttonElement.style.userSelect = "none";
        buttonElement.textContent = "►"; // Set initial button text

        var toggleButton = true;

        function toggle() {
            toggleButton = !toggleButton;
            buttonElement.textContent = toggleButton ? "►" : "II";
        }

        buttonElement.addEventListener("click", toggle);

        var containerElement = document.evaluate("/html/body/div[2]/section[4]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        containerElement.appendChild(buttonElement);
    }

    // Function to recreate the toggle button element
    function recreateToggleButton() {
        var toggleButton = document.evaluate(
            "/html/body/div[2]/section[4]/div[2]/span",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (!toggleButton) {
            toggleButton = document.createElement("span");
            toggleButton.style.width = "40px";
            toggleButton.style.height = "40px";
            toggleButton.style.display = "inline-flex";
            toggleButton.style.alignItems = "center";
            toggleButton.style.justifyContent = "center";
            toggleButton.style.cursor = "pointer";
            toggleButton.style.fontSize = "24px";
            toggleButton.style.userSelect = "none";
            toggleButton.textContent = "►";

            var containerElement = document.evaluate(
                "/html/body/div[2]/section[4]/div[2]",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            containerElement.appendChild(toggleButton);
        }
    }

    // Mutation observer callback function
    function mutationCallback(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                recreateToggleButton();
            }
        }
    }

    // Create a new MutationObserver instance
    var observer = new MutationObserver(mutationCallback);

    // Start observing changes in the target node
    observer.observe(document.body, { childList: true, subtree: true });

    // Call the functions every 6 seconds
    setInterval(changeImageSource, 6000);
    setInterval(changePageCounter, 6000);
    toggleButton();
    recreateToggleButton();

})();