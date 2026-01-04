// ==UserScript==
// @name         Charat.me SVG Saver
// @namespace    CharatMeSaveButton
// @version      1.0
// @description  Save SVG data from charat.me
// @author       Nighthawk, Akiko Kumagara, Dgby
// @match        https://charat.me/*/create/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469099/Charatme%20SVG%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/469099/Charatme%20SVG%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to save SVG data
function saveSVGData() {
    const svgSaveElement = document.getElementById('chaSvgSave');
    const svgData = new XMLSerializer().serializeToString(document.getElementById('chaSvgMake')).trim();
    const blob = new Blob(['<svg' + svgData.substring(2, svgData.length - 2) + 'svg>'], { type: 'image/svg+xml' });

    // Create a download link for the SVG file
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Generate a unique timestamp for the file name
    const timestamp = new Date().getTime();
    link.download = 'image_' + timestamp + '.svg';

    // Hide the download link
    link.style.display = 'none';

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Remove the download link from the document body
    document.body.removeChild(link);
    }

    // Function to create the save button
    function createSaveButton() {
        const button = document.createElement('button');
        button.textContent = 'Save SVG';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.transform = 'translateY(-50%)';
        button.style.right = '10px';
        button.style.backgroundColor = '#00aaff'; // Customize the color here
        button.style.border = 'none';
        button.style.color = 'white';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.addEventListener('click', saveSVGData);

        const svgSaveElement = document.createElement('svg');
        svgSaveElement.id = 'chaSvgSave';
        svgSaveElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgSaveElement.setAttribute('width', '651');
        svgSaveElement.setAttribute('height', '651');

        const gElement = document.createElement('g');
        gElement.setAttribute('width', '651');
        gElement.setAttribute('height', '651');
        gElement.setAttribute('transform', 'translate(35.80500000000001,35.80500000000001), scale(1,1)');
        gElement.id = 'chaSvgClip';
        svgSaveElement.appendChild(gElement);

        const wrapper = document.createElement('div');
        wrapper.id = 'chaSaveparent';
        wrapper.style.position = 'fixed';
        wrapper.style.top = '50%';
        wrapper.style.transform = 'translateY(-50%)';
        wrapper.style.right = '0';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.appendChild(svgSaveElement);
        wrapper.appendChild(button);

        // Check if the current window is the top-level window
        if (window.self === window.top) {
            document.body.appendChild(wrapper);
        }
    }

    // Wait until the page finishes loading to create the save button
    window.addEventListener('load', createSaveButton);
})();