// ==UserScript==
// @name         LZT Compact
// @namespace    LZTc
// @version      1337
// @description  Make LZT more Compact
// @author       Heinrich H.
// @match        https://lzt.market/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485504/LZT%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/485504/LZT%20Compact.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a key to store the visibility state
    const storageKey = 'lztMarketElementVisibility';
    // Set darktheme to 1
    localStorage.setItem('darktheme', '1');
    // Set darkthemev2 to 0 if you want to disable it
    localStorage.setItem('darkthemev2', '1');

    const myCustomValue = '133 337'; // The value you want to set, leave empty or set to 0 if you don't want it modified.

    // Function to toggle the visibility
    function toggleVisibility() {
        // Selectors for the elements to be toggled
        const selectors = ['.categoryLinks', '.searchBarContainer', '#MarketSearchBar'];

        // Determine the current visibility state
        const isCurrentlyVisible = localStorage.getItem(storageKey) !== 'false';

        // Toggle the state for each selector
        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.style.display = isCurrentlyVisible ? 'none' : ''; // Toggle the display style
            });
        });

        // Log the action to the console
        console.log(`${isCurrentlyVisible ? 'Hide' : 'Show'} elements: ${selectors.join(', ')}`);

        // Save the new visibility state to localStorage
        localStorage.setItem(storageKey, !isCurrentlyVisible);
    }

    // Function to set initial visibility state on page load
    function setInitialVisibility() {
        // Selectors for the elements to be toggled
        const selectors = ['.categoryLinks', '.searchBarContainer', '#MarketSearchBar'];

        // Determine the initial visibility state
        const isInitiallyVisible = localStorage.getItem(storageKey) !== 'false';

        // Set the state for each selector
        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.style.display = isInitiallyVisible ? '' : 'none';
            });
        });
    }

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

        // Function to apply dark theme styles
    function applyDarkThemeStyles() {
        // Check if darktheme is set to '1'
        if (localStorage.getItem('darktheme') === '1') {
            document.body.style.backgroundImage = 'url("https://nztcdn.com/files/9380da39-6acc-40e9-8a23-7c1abc41cbe7.webp")'; //Replace XXXX with your wallpaper if you want to use one, here is a good one:[IMG][IMG][IMG] https://i.imgur.com/LIUBPxK.jpeg[/IMG][/IMG][/IMG]
            // Apply the dark theme CSS
            document.body.style.backgroundColor = '#000';
            const elementsToStyle = document.querySelectorAll('.marketIndexItem, .primaryContent, .secondaryContent, .market--titleBar, .marketContainer, .marketSidebarMenu, .marketMyPayments');
            elementsToStyle.forEach(element => {
                element.style.background = 'rgb(21 19 19)';
            });
        }
    }


    // Initially hide the balanceValue elements
    GM_addStyle('.balanceValue { visibility: hidden; }');

    // Function to set a custom balance value on all elements with the class 'balanceValue'
    function setCustomBalanceValues() {
        if (myCustomValue && myCustomValue !== '0') {
            const balanceSpans = document.querySelectorAll('.balanceValue');
            if (balanceSpans.length > 0) {
                balanceSpans.forEach(span => {
                    span.textContent = myCustomValue;
                    span.style.visibility = 'visible'; // Make the element visible again after setting the value
                });
                console.log('All balance values set to:', myCustomValue);
            } else {
                console.warn('No .balanceValue elements were found.');
            }
        } else {
            // If the custom value should not be set, make sure to show the original values
            const balanceSpans = document.querySelectorAll('.balanceValue');
            balanceSpans.forEach(span => {
                span.style.visibility = 'visible';
            });
            console.log('myCustomValue is not set or is 0; the original spans have been made visible.');
        }
    }


    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
         // Apply dark theme styles if needed
        applyDarkThemeStyles();
        setCustomBalanceValues();
        // Replace specific RGB colors for dark theme testing if needed
        if (localStorage.getItem('darkthemev2') === '1') {
            replaceColor('rgb(45, 45, 45)', 'rgb(22, 22, 22)');
            replaceColor('rgb(54, 54, 54)', 'rgb(22, 22, 22)');
            replaceColor('rgb(39, 39, 39)', 'rgb(22, 22, 22)');
            replaceColor('rgb(29, 32, 33)', 'rgb(22, 22, 22)');
            replaceColor('rgb(34, 37, 38)', 'rgb(22, 22, 22)');
            replaceColor('#303030', '#000');
        }

        // Set the initial visibility state when the script is loaded
        setInitialVisibility();

        // Create the button element
        const btn = document.createElement("button");
        btn.classList.add("button", "leftButton", "primary", "OverlayTrigger");
        btn.textContent = "Toggle";
        // Set the button styles, being overwritten by the classes above anyway
        btn.style.marginLeft = "10px"; // Add some space between the text and the button
        btn.style.borderRadius = "6px";
        btn.style.boxSizing = "border-box";
        btn.style.fontSize = "13px";
        btn.style.padding = "0px 10px";
        btn.style.color = "#f5f5f5";
        btn.style.backgroundColor = "rgb(34,142,93)";
        btn.style.cursor = "pointer";
        btn.style.verticalAlign = "middle"; // Align vertically with text if needed

        // Add click event listener for the button
        btn.addEventListener("click", toggleVisibility);

        // Append the button to the body element
        // document.body.appendChild(btn);
        // Function to append the button to the target element and log the result
        function appendButtonIfTargetExists() {
            const targetElement = document.querySelector('#title > div > div.fl_l > h1');
            if (targetElement) {
                console.log('Target element found. Appending button.');
                targetElement.appendChild(btn); // Append the button to the <h1> element
                observer.disconnect(); // Disconnect the observer after appending the button
            } else {
                console.log('Target element not found.');
            }
        }

    // Mutation observer to detect when the target element is added to the DOM
    const observer = new MutationObserver(function(mutations, obs) {
        appendButtonIfTargetExists();
    });

    // Start observing the body for changes in the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

        // Add keydown event listener to the document for "Arrow Down" key press
        document.addEventListener('keydown', function(event) {
            if (event.key === "ArrowDown") {
                event.preventDefault(); // Prevent the default arrow down behavior
                toggleVisibility();
            }
        }, false);
    });
})();