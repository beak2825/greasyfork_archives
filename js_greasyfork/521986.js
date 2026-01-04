// ==UserScript==
// @name         Add your favrouite music to the list
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Show Excel sheet in iframe with toggle icon, to store your favrouite music.
// @author       Bibek Chand Sah
// @match        https://www.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/2995/2995101.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521986/Add%20your%20favrouite%20music%20to%20the%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/521986/Add%20your%20favrouite%20music%20to%20the%20list.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Check if the script is running in an iframe, exit if true
    if (window !== window.parent) {
        return;
    }

    // Excel Sheet URL
    //const excelUrl = "https://1drv.ms/x/s!AiNuwFrvg4udjrknuEOXuR5ZOHzNZg?e=TaKgg2";
    const excelUrl = "https://1drv.ms/x/c/9d8b83ef5ac06e23/IQQjbsBa74OLIICdp5wDAAAAAVR4ojNpeOSmfyfVe5spqD8?em=2&AllowTyping=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True";
    const iconUrl = "https://cdn-icons-png.flaticon.com/512/2995/2995101.png";

    // Create a button to toggle the iframe
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9997';
    button.style.background = 'rgba(0, 0, 0, 0.3)';
    button.style.backdropFilter = 'blur(10px)';
    button.style.border = '1px solid rgba(107, 107, 111, 0.61)';
    button.style.cursor = 'pointer';
    button.style.padding = '5px'; // Initial size
    button.style.borderRadius = '50px';
    button.style.transition = 'all 0.3s ease'; // Smooth transition for all changes
    button.style.width = '50px'; // Initial width
    button.style.height = '50px'; // Initial height

    // Create the icon
    const icon = document.createElement('img');
    icon.src = iconUrl;
    icon.alt = "Show Excel";
    icon.style.width = '20px';
    icon.style.height = '20px';
    icon.style.position = 'absolute';
    icon.style.bottom = '15px';
    icon.style.right = '15px';
    button.appendChild(icon);

    document.body.appendChild(button);

    // Add hover effect to enlarge the button
    button.addEventListener('mouseenter', () => {
        button.style.padding = '10px'; // Larger size on hover
        icon.style.width = '30px';
        icon.style.height = '30px';
    });

    button.addEventListener('mouseleave', () => {
        button.style.padding = '5px'; // Revert to original size
        icon.style.width = '20px';
        icon.style.height = '20px';
    });

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = excelUrl;
    iframe.style.position = 'fixed';
    iframe.style.bottom = '100px'; // Space for sliders
    iframe.style.right = '20px';
    iframe.style.width = '500px';
    iframe.style.height = '400px';
    iframe.style.border = '5px solid #ccc';
    iframe.style.borderRadius = '15px'; // Add border radius
    iframe.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Optional: Add shadow
    iframe.style.zIndex = '9998';
    iframe.style.display = 'none';

    document.body.appendChild(iframe);

    // Create the sliders container div
    const slidersContainer = document.createElement('div');
    slidersContainer.style.position = 'fixed';
    slidersContainer.style.bottom = '25px';
    slidersContainer.style.right = '77px';
    slidersContainer.style.zIndex = '9997';
    slidersContainer.style.display = 'none';
    slidersContainer.style.border = '1px solid rgba(107, 107, 111, 0.61)';
    slidersContainer.style.background = '#00000012';
    slidersContainer.style.backdropFilter = 'blur(10px)';
    slidersContainer.style.borderRadius = '50px';
    slidersContainer.style.padding = '5px 20px 5px 20px';
    slidersContainer.style.color = '#cff';

    // Create the width slider
    const widthSliderContainer = document.createElement('div');
    widthSliderContainer.style.marginBottom = '10px';

    const widthSliderLabel = document.createElement('label');
    widthSliderLabel.textContent = "Width: ";
    widthSliderLabel.style.marginRight = '10px';
    widthSliderLabel.style.color = '#fff';

    const widthSlider = document.createElement('input');
    widthSlider.type = 'range';
    widthSlider.min = '300';
    widthSlider.max = '800';
    widthSlider.value = '500'; // Default width
    widthSlider.style.width = '200px';

    widthSlider.addEventListener('input', () => {
        iframe.style.width = widthSlider.value + 'px';
    });

    widthSliderContainer.appendChild(widthSliderLabel);
    widthSliderContainer.appendChild(widthSlider);
    slidersContainer.appendChild(widthSliderContainer);

    // Create the height slider
    const heightSliderContainer = document.createElement('div');

    const heightSliderLabel = document.createElement('label');
    heightSliderLabel.textContent = "Height:";
    heightSliderLabel.style.marginRight = '10px';
    heightSliderLabel.style.color = '#fff';

    const heightSlider = document.createElement('input');
    heightSlider.type = 'range';
    heightSlider.min = '300';
    heightSlider.max = '600';
    heightSlider.value = '400'; // Default height
    heightSlider.style.width = '200px';

    heightSlider.addEventListener('input', () => {
        iframe.style.height = heightSlider.value + 'px';
    });

    heightSliderContainer.appendChild(heightSliderLabel);
    heightSliderContainer.appendChild(heightSlider);
    slidersContainer.appendChild(heightSliderContainer);

    document.body.appendChild(slidersContainer);

    // Toggle iframe visibility and sliders on button click
    let isOpen = false;
    button.addEventListener('click', () => {
        isOpen = !isOpen;
        iframe.style.display = isOpen ? 'block' : 'none';
        slidersContainer.style.display = isOpen ? 'block' : 'none';
        icon.style.positioin = isOpen ? 'absolute' : 'fixed';
        icon.style.bottom = isOpen ? '15px' : '15px';
        icon.style.right = isOpen ? '15px' : '15px';
        button.style.width = isOpen ? '350px' : '50px'; // Animate width
        button.style.height = isOpen ? '75px' : '50px'; // Animate height
    });
})();
