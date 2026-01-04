// ==UserScript==
// @name         Waze major traffic events from Waze Editor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract latitude and longitude from URL to open Waze Editor and Waze Live Map
// @author       Aoi
// @match        https://www.waze.com/*/events*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496307/Waze%20major%20traffic%20events%20from%20Waze%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/496307/Waze%20major%20traffic%20events%20from%20Waze%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create container
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';

    // Create text input field
    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'https://www.waze.com/ja/events?zoom=17&lat=42.9904&lon=141.5554';
    urlInput.style.marginBottom = '5px';
    urlInput.style.width = '400px';

    // Create container to hold buttons
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';

    // Create button to open Waze Editor
    var editorButton = document.createElement('button');
    editorButton.innerHTML = 'Open in Waze Editor';
    editorButton.style.padding = '5px 10px';
    editorButton.style.backgroundColor = '#007bff';
    editorButton.style.color = 'white';
    editorButton.style.border = 'none';
    editorButton.style.borderRadius = '3px';
    editorButton.style.cursor = 'pointer';
    editorButton.style.marginRight = '5px';

    // Create button to open Waze Live Map
    var liveMapButton = document.createElement('button');
    liveMapButton.innerHTML = 'Open in Waze Live Map';
    liveMapButton.style.padding = '5px 10px';
    liveMapButton.style.backgroundColor = '#007bff';
    liveMapButton.style.color = 'white';
    liveMapButton.style.border = 'none';
    liveMapButton.style.borderRadius = '3px';
    liveMapButton.style.cursor = 'pointer';

    // Extract latitude and longitude from URL and open Waze Editor URL when button is clicked
    editorButton.addEventListener('click', function() {
        var url = urlInput.value.trim();
        var urlParams = new URLSearchParams(url.split('?')[1]);
        var lat = urlParams.get('lat');
        var lon = urlParams.get('lon');

        if (lat && lon) {
            // Create Waze Editor URL
            var editorUrl = `https://www.waze.com/en/editor?env=row&lon=${lon}&lat=${lat}&zoom=5`;
            window.open(editorUrl, '_blank');
        } else {
            alert('Please enter a valid URL.');
        }
    });

    // Extract latitude and longitude from URL and open Waze Live Map URL when button is clicked
    liveMapButton.addEventListener('click', function() {
        var url = urlInput.value.trim();
        var urlParams = new URLSearchParams(url.split('?')[1]);
        var lat = urlParams.get('lat');
        var lon = urlParams.get('lon');

        if (lat && lon) {
            // Create Waze Live Map URL
            var liveMapUrl = `https://www.waze.com/en/live-map/directions?to=ll.${lat}%2C${lon}`;
            window.open(liveMapUrl, '_blank');
        } else {
            alert('Please enter a valid URL.');
        }
    });

    // Add buttons to button container
    buttonContainer.appendChild(editorButton);
    buttonContainer.appendChild(liveMapButton);

    // Add elements to container
    container.appendChild(urlInput);
    container.appendChild(buttonContainer);

    // Add container to the page
    document.body.appendChild(container);
})();
