// ==UserScript==
// @name         Copy Page URL Window with Keybind Option and Alert Timeout
// @namespace    http://your.namespace.com
// @license       CC
// @version      5.0
// @description  Adds a floating window to copy the current page's URL to the clipboard and change keybinds with an alert timeout
// @author       Speed_Racer
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493757/Copy%20Page%20URL%20Window%20with%20Keybind%20Option%20and%20Alert%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/493757/Copy%20Page%20URL%20Window%20with%20Keybind%20Option%20and%20Alert%20Timeout.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Default keybind
    var keybind = localStorage.getItem('keybind') || 'Shift + Alt'; // Retrieve keybind from localStorage or set default

    // Create a floating window
    var floatingWindow = document.createElement("div");
    floatingWindow.style.position = "fixed";
    floatingWindow.style.right = "20px";
    floatingWindow.style.bottom = "20px";
    floatingWindow.style.width = "85px";
    floatingWindow.style.height = "50px";
    floatingWindow.style.backgroundColor = "lightgray";
    floatingWindow.style.border = "1px solid black";
    floatingWindow.style.padding = "5px";
    floatingWindow.style.zIndex = "9999";
    floatingWindow.style.transition = "opacity 0.5s";
    floatingWindow.style.opacity = "0"; // Initially hidden

    var timer; // Timer variable

    // Function to show the floating window
    function showFloatingWindow() {
        clearTimeout(timer); // Clear the hide timer
        floatingWindow.style.opacity = "1"; // Show the window
    }

    // Function to hide the floating window
    function hideFloatingWindow() {
        floatingWindow.style.opacity = "0"; // Hide the window
    }

    // Add event listener to show the floating window when mouse enters
    floatingWindow.addEventListener("mouseenter", showFloatingWindow);

    // Add event listener to hide the floating window when mouse leaves
    floatingWindow.addEventListener("mouseleave", function() {
        // Set a timer to hide the window after 10 seconds of inactivity
        timer = setTimeout(function() {
            hideFloatingWindow();
        }, 10000);
    });

    // Function to handle the button click
    function handleCopyButtonClick() {
        copyURLToClipboard();
    }

    // Function to handle the key press event
    function handleKeyPress(event) {
        // Check if the event key matches the current keybind
        if (event.shiftKey && event.key === keybind.split(' + ')[1]) {
            copyURLToClipboard();
        }
    }

    // Function to copy the current page's URL to the clipboard
    function copyURLToClipboard() {
        var currentURL = window.location.href;

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(currentURL)
            .then(function() {
                console.log('URL copied to clipboard: ' + currentURL);
                var alertMessage = 'URL copied to clipboard!';
                showAlert(alertMessage);
            })
            .catch(function(error) {
                console.error('Failed to copy URL to clipboard: ', error);
                var errorMessage = 'Failed to copy URL to clipboard.';
                showAlert(errorMessage);
            });
    }

    // Function to show an alert with a timeout
    function showAlert(message) {
        var alertBox = document.createElement('div');
        alertBox.className = 'alert';
        alertBox.textContent = message;
        alertBox.style.position = 'fixed';
        alertBox.style.top = '0';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.color = 'black'; // Text color
        alertBox.style.backgroundColor = 'white'; // Background color
        alertBox.style.padding = '10px';
        alertBox.style.border = '1px solid black';
        alertBox.style.zIndex = '10000';

        document.body.appendChild(alertBox);

        // Hide the alert after 5 seconds
        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 5000);
    }

    // Add the copy button to the floating window
    var copyButton = document.createElement("button");
    copyButton.textContent = "Copy URL";
    copyButton.addEventListener("click", handleCopyButtonClick);
    floatingWindow.appendChild(copyButton);

    // Add an input field to change the keybind
    var keybindInput = document.createElement("input");
    keybindInput.type = "text";
    keybindInput.value = keybind;
    keybindInput.style.marginTop = "5px";
    keybindInput.style.width = "70px";
    keybindInput.style.color = "black"; // Set the text color to black
    keybindInput.style.backgroundColor = "white"; // Set the background color to white
    keybindInput.addEventListener("change", function(event) {
        keybind = event.target.value;
        localStorage.setItem('keybind', keybind); // Save keybind to localStorage
        var keybindChangeMessage = "Keybind changed to: " + keybind;
        showAlert(keybindChangeMessage);
    });
    floatingWindow.appendChild(keybindInput);

    // Add the floating window to the document
    document.body.appendChild(floatingWindow);

    // Add event listener to listen for keydown events
    document.addEventListener('keydown', handleKeyPress);
})();

