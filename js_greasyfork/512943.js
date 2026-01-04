// ==UserScript==
// @name        高德坐标转Lightroom格式/Amap to Lightroom GPS Converter
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description Convert coordinates to desired format and display on Amap Coordinate Picker page
// @author      hehehegfd
// @match       https://lbs.amap.com/tools/picker*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=amap.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/512943/%E9%AB%98%E5%BE%B7%E5%9D%90%E6%A0%87%E8%BD%ACLightroom%E6%A0%BC%E5%BC%8FAmap%20to%20Lightroom%20GPS%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/512943/%E9%AB%98%E5%BE%B7%E5%9D%90%E6%A0%87%E8%BD%ACLightroom%E6%A0%BC%E5%BC%8FAmap%20to%20Lightroom%20GPS%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastCoordValue = '';
    let convertedCoord = '';  // Store the converted coordinates

    function main() {
        // Select the input element with id "txtCoordinate"
        const coordInput = document.getElementById('txtCoordinate');
        if (!coordInput) return;

        // Create a container div to hold the button
        const containerDiv = document.createElement('div');
        containerDiv.style.display = 'inline-block';
        containerDiv.style.marginBottom = '10px'; // Add margin below the container
        containerDiv.style.verticalAlign = 'top';

        // Create a button to copy the converted coordinate
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制输出';
        copyButton.style.display = 'block';
        copyButton.style.marginBottom = '5px';
        copyButton.style.fontSize = '14px';
        copyButton.style.padding = '4px 8px';
        copyButton.style.cursor = 'pointer';

        // Append the button to the container div
        containerDiv.appendChild(copyButton);

        // Select the target label using its 'data-spm-anchor-id' attribute
        const targetLabel = document.querySelector('label[data-spm-anchor-id="0.0.0.i6.376062d0KLbV2x"]');
        if (targetLabel) {
            // Insert the container div right before the target label (i.e., above it)
            targetLabel.insertAdjacentElement('beforebegin', containerDiv);
        } else {
            // If the target label is not found, fall back to the default location
            coordInput.parentNode.insertBefore(containerDiv, coordInput.nextSibling);
        }

        // Function to process the converted coordinate (without displaying it)
        function processConvertedCoordinate() {
            const coordValue = coordInput.value.trim();

            // Check if the coordinate value has changed
            if (coordValue === lastCoordValue) return;
            lastCoordValue = coordValue;

            if (!coordValue) {
                convertedCoord = '';  // Clear the converted coordinate
                return;
            }

            const coords = coordValue.split(',');
            if (coords.length !== 2) {
                convertedCoord = '';  // Invalid coordinate format
                return;
            }

            const lng = coords[0].trim();
            const lat = coords[1].trim();
            // Create the converted coordinate string (but don't display it)
            convertedCoord = `${lat}N${lng}E`;
        }

        // Function to copy the converted coordinate to clipboard
        function copyConvertedCoordinate() {
            if (!convertedCoord) {
                alert('无有效的坐标可复制！');
                return;
            }

            // Use the Clipboard API to copy text
            navigator.clipboard.writeText(convertedCoord).then(() => {
                // Optionally, alert the user that the copy was successful
                alert('坐标已复制到剪贴板！');
            }, (err) => {
                alert('复制失败，请手动复制。');
            });
        }

        // Add click event listener to the copy button
        copyButton.addEventListener('click', copyConvertedCoordinate);

        // Set an interval to check for changes every 500 milliseconds
        setInterval(processConvertedCoordinate, 500);

        // Initial call in case the value is already set
        processConvertedCoordinate();
    }

    // Wait for the DOM to be ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', main);
    }
})();