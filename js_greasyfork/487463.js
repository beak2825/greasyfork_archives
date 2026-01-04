// ==UserScript==
// @name         图寻替换地图
// @namespace    http://your.namespace/
// @version      0.5
// @description  Replace map on tuxun.fun, show a small window in the bottom right corner, and add a button with hover effect
// @author       lemures
// @match        https://tuxun.fun/*
// @icon         https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487463/%E5%9B%BE%E5%AF%BB%E6%9B%BF%E6%8D%A2%E5%9C%B0%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/487463/%E5%9B%BE%E5%AF%BB%E6%9B%BF%E6%8D%A2%E5%9C%B0%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and style the info window
    function createInfoWindow() {
        const infoWindow = document.createElement('div');
        infoWindow.innerHTML = '<iframe src="https://chatguessr.com/map/tuxun"></iframe>';
        infoWindow.style.position = 'fixed';
        infoWindow.style.bottom = '100px';
        infoWindow.style.right = '100px';
        infoWindow.style.width = '600px';
        infoWindow.style.height = '400px';
        infoWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        infoWindow.style.transition = 'width 0.2s, height 0.2s';
        infoWindow.style.zIndex = '9999';

        const iframe = infoWindow.querySelector('iframe');
        iframe.style.cssText = 'border-radius: 30px !important; width: 100%; height: 100%;';

        infoWindow.addEventListener('mouseover', function() {
            infoWindow.style.width = '1000px';
            infoWindow.style.height = '700px';
            button.style.width = '1000px'; // Make the button width match the window
        });

        infoWindow.addEventListener('mouseout', function() {
            infoWindow.style.width = '600px';
            infoWindow.style.height = '400px';
            button.style.width = '600px'; // Make the button width match the window
        });

        document.body.appendChild(infoWindow);
    }

    // Function to create and style the button
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Your Button Text';
        button.className = 'your-button-class'; // Add your own class for styling
        button.style.position = 'fixed';
        button.style.bottom = '30px';
        button.style.right = '100px';
        button.style.padding = '10px';
        button.style.borderRadius = '20px';
        button.style.width = '600px';
        button.style.height = '60px';
        button.style.backgroundColor = 'black'; // Customize the background color
        button.style.color = 'white'; // Customize the text color
        button.style.transition = 'width 0.2s';
        button.style.zIndex = '9999';
        button.addEventListener('click', function() {
            // Add your button click logic here
            alert('Button Clicked!');
        });

        document.body.appendChild(button);
        return button;
    }

    // Function to remove elements
    function removeElements() {
        const selectorsToRemove = ['.mapConfirm___Q8fp1', '.mapBox___wPNE1'];

        selectorsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });

        // Remove .h-20 on https://chatguessr.com/map/tuxun
        if (window.location.href === 'https://chatguessr.com/map/tuxun') {
            const h20Elements = document.querySelectorAll('.h-20');
            h20Elements.forEach(element => {
                element.remove();
            });
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(removeElements);

    // Configuration of the observer (targeting the body and childList mutations)
    const config = { childList: true, subtree: true };

    // Start observing the target node for configured mutations
    observer.observe(document.body, config);

    // Initial removal, info window creation, and button creation on script execution
    removeElements();
    const button = createButton();
    createInfoWindow();
})();
