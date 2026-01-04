// ==UserScript==
// @name         Cookie Clicker HAXX
// @description  v2 coming out soon and the bookmarklet version coming soon as well!!!
// @version      1.0
// @author       GS
// @match        https://orteil.dashnet.org/cookieclicker/*
// @match        https://idle-js-games.github.io/cookieclicker/*
// @grant        none
// @namespace https://greasyfork.org/users/1176108
// @downloadURL https://update.greasyfork.org/scripts/475638/Cookie%20Clicker%20HAXX.user.js
// @updateURL https://update.greasyfork.org/scripts/475638/Cookie%20Clicker%20HAXX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the main UI container
    var uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '50px';
    uiContainer.style.left = '50px';
    uiContainer.style.width = '400px'; // Set a larger default width
    uiContainer.style.height = '250px'; // Set a larger default height
    uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    uiContainer.style.color = 'white';
    uiContainer.style.borderRadius = '10px';
    uiContainer.style.zIndex = '9999';
    uiContainer.style.cursor = 'move'; // Allow dragging

    // Create the label at the top
    var label = document.createElement('div');
    label.textContent = "Sahaj's Cookie HAXX"; // Modify the label here
    label.style.textAlign = 'center';
    label.style.padding = '10px';
    label.style.fontSize = '20px';
    label.style.fontWeight = 'bold';

    // Create the gear icon for settings
    var settingsIcon = document.createElement('div');
    settingsIcon.innerHTML = '&#9881;'; // Gear icon
    settingsIcon.style.position = 'absolute';
    settingsIcon.style.top = '5px';
    settingsIcon.style.right = '5px';
    settingsIcon.style.cursor = 'pointer';
    settingsIcon.style.fontSize = '20px';
    settingsIcon.style.transition = 'transform 0.2s'; // Add a smooth transition effect

    // Create the settings UI
    var settingsUI = document.createElement('div');
    settingsUI.style.display = 'none';
    settingsUI.style.position = 'fixed';
    settingsUI.style.top = '50px';
    settingsUI.style.left = '50px';
    settingsUI.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    settingsUI.style.border = '1px solid #000';
    settingsUI.style.padding = '10px';
    settingsUI.style.zIndex = '10000';

    // Create the input for UI size
    var sizeInput = document.createElement('input');
    sizeInput.type = 'text';
    sizeInput.value = '400x250'; // Default size
    sizeInput.style.marginRight = '10px';

    // Create a button to apply the size
    var applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.style.backgroundColor = '#009688';
    applyButton.style.color = 'white';
    applyButton.style.border = 'none';
    applyButton.style.padding = '5px 10px';
    applyButton.style.borderRadius = '5px';
    applyButton.style.cursor = 'pointer';

    // Function to apply the size from the input
    applyButton.addEventListener('click', function() {
        var newSize = sizeInput.value.split('x');
        var newWidth = newSize[0];
        var newHeight = newSize[1];
        uiContainer.style.width = newWidth + 'px';
        uiContainer.style.height = newHeight + 'px';
    });

    // Append the input and apply button to the settings UI
    settingsUI.appendChild(sizeInput);
    settingsUI.appendChild(applyButton);

    // Function to toggle settings UI visibility when clicking the gear icon
    settingsIcon.addEventListener('click', function() {
        if (settingsUI.style.display === 'none' || !settingsUI.style.display) {
            settingsUI.style.display = 'block';
        } else {
            settingsUI.style.display = 'none';
        }
    });

    // Hover effect for the gear icon
    settingsIcon.addEventListener('mouseover', function() {
        settingsIcon.style.transform = 'scale(1.1)'; // Scale up on hover
    });

    settingsIcon.addEventListener('mouseout', function() {
        settingsIcon.style.transform = 'scale(1)'; // Reset to normal size
    });

    // Create the "Close" button with hover effect
    var closeButton = document.createElement('div');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#009688';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '3px 6px'; // Smaller padding
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '25px'; // Adjust the right position
    closeButton.style.fontSize = '16px'; // Smaller font size
    closeButton.style.transition = 'transform 0.2s'; // Add a smooth transition effect

    // Function to close the UI when clicking the "Close" button
    closeButton.addEventListener('click', function() {
        uiContainer.style.display = 'none';
    });

    // Hover effect for the "Close" button
    closeButton.addEventListener('mouseover', function() {
        closeButton.style.transform = 'scale(1.1)'; // Scale up on hover
    });

    closeButton.addEventListener('mouseout', function() {
        closeButton.style.transform = 'scale(1)'; // Reset to normal size
    });

    // Create the "Infinite Cookies" button with hover effect
    var infiniteCookiesButton = document.createElement('button');
    infiniteCookiesButton.textContent = 'Infinite Cookies';
    infiniteCookiesButton.style.backgroundColor = '#009688';
    infiniteCookiesButton.style.color = 'white';
    infiniteCookiesButton.style.border = 'none';
    infiniteCookiesButton.style.padding = '10px 20px'; // Larger padding
    infiniteCookiesButton.style.borderRadius = '10px';
    infiniteCookiesButton.style.cursor = 'pointer';
    infiniteCookiesButton.style.position = 'absolute';
    infiniteCookiesButton.style.top = '100px'; // Adjust the top position
    infiniteCookiesButton.style.left = '50%'; // Center horizontally
    infiniteCookiesButton.style.transform = 'translateX(-50%)'; // Center horizontally
    infiniteCookiesButton.style.fontSize = '18px'; // Font size
    infiniteCookiesButton.style.transition = 'background-color 0.2s'; // Add a smooth transition effect

    // Function to handle the button click event (replace with your code)
    function yourCodeHere() {
        Game.Earn(Infinity);
    }

    // Add click event listener to the "Infinite Cookies" button
    infiniteCookiesButton.addEventListener('click', yourCodeHere);

    // Hover effect for the "Infinite Cookies" button
    infiniteCookiesButton.addEventListener('mouseover', function() {
        infiniteCookiesButton.style.backgroundColor = '#00756D'; // Darker color on hover
    });

    infiniteCookiesButton.addEventListener('mouseout', function() {
        infiniteCookiesButton.style.backgroundColor = '#009688'; // Reset to normal color
    });

    // Append the label, gear icon, and settings UI to the main container
    uiContainer.appendChild(label);
    uiContainer.appendChild(settingsIcon);
    uiContainer.appendChild(settingsUI);

    // Append the "Close" button and "Infinite Cookies" button to the main UI container
    uiContainer.appendChild(closeButton);
    uiContainer.appendChild(infiniteCookiesButton);

    // Add event listeners for dragging
    var isDragging = false;
    var offsetX, offsetY;

    uiContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - uiContainer.getBoundingClientRect().left;
        offsetY = e.clientY - uiContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            uiContainer.style.left = e.clientX - offsetX + 'px';
            uiContainer.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Append the main UI container to the document
    document.body.appendChild(uiContainer);

})();
