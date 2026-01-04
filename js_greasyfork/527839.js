// ==UserScript==
// @name         OSM to Google Maps & Jartic Map Converter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add buttons to convert OpenStreetMap to Google Maps or Jartic Map
// @match        https://www.openstreetmap.org/edit*
// @icon         https://cdn.iconscout.com/icon/free/png-512/free-openstreetmap-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-5-pack-logos-icons-3030188.png?f=webp&w=256
// @author       Aoi
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527839/OSM%20to%20Google%20Maps%20%20Jartic%20Map%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/527839/OSM%20to%20Google%20Maps%20%20Jartic%20Map%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract coordinates from OSM URL
    function extractCoordinatesFromUrl(url) {
        var matches = url.match(/#map=([0-9]+)\/([-\d.]+)\/([-\d.]+)/);
        if (matches && matches.length === 4) {
            return {
                zoom: matches[1],
                lat: matches[2],
                lon: matches[3]
            };
        }
        return null;
    }

    // Create container for buttons
    var container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%);
        zIndex: 9999;
        background-color: white;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
    `;

    // Draggable area
    var dragArea = document.createElement('div');
    dragArea.style.cssText = `
        width: 15px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        cursor: move;
        background-color: #f0f0f0;
        border-right: 1px solid #ccc;
    `;
    container.appendChild(dragArea);

    // Google Maps button
    var googleMapsButton = document.createElement('button');
    googleMapsButton.textContent = 'Google Mapsを表示';
    googleMapsButton.style.cssText = `
        padding: 3px 5px;
        background: #4285F4;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 20px;
    `;
    container.appendChild(googleMapsButton);

    // Jartic Map button
    var jarticButton = document.createElement('button');
    jarticButton.textContent = 'Jarticを表示';
    jarticButton.style.cssText = `
        padding: 3px 5px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 5px;
    `;
    container.appendChild(jarticButton);

    // Append container to document
    document.body.appendChild(container);

    // Function to update URLs based on current view
    function updateUrls() {
        var coords = extractCoordinatesFromUrl(window.location.hash);
        if (coords) {
            var googleMapsURL = `https://www.google.com/maps/@${coords.lat},${coords.lon},${coords.zoom}z`;
            var jarticURL = `http://hotmist.ddo.jp/jartic_kisei/@${coords.lat},${coords.lon},18z`;
            googleMapsButton.setAttribute('data-url', googleMapsURL);
            jarticButton.setAttribute('data-url', jarticURL);
        } else {
            console.log("Failed to extract coordinates from URL.");
        }
    }

    // Update URLs on hash change
    window.addEventListener('hashchange', updateUrls);

    // Initial URL update
    updateUrls();

    // Button click handler for opening maps in new tabs
    [googleMapsButton, jarticButton].forEach(button => {
        button.addEventListener('click', function() {
            var url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            } else {
                alert("有効な座標をURLから抽出できませんでした。");
            }
        });
    });

    // Dragging functionality
    var isDragging = false;
    var startX, startY, initialX, initialY;

    dragArea.addEventListener('mousedown', function(event) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialX = container.offsetLeft;
        initialY = container.offsetTop;
        document.addEventListener('mousemove', dragContainer);
        document.addEventListener('mouseup', stopDragging);
    });

    function dragContainer(event) {
        if (isDragging) {
            var newX = initialX + event.clientX - startX;
            var newY = initialY + event.clientY - startY;
            container.style.left = `${newX}px`;
            container.style.top = `${newY}px`;
            container.style.bottom = 'auto';
        }
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', dragContainer);
        GM_setValue('containerPosition', `${container.offsetLeft},${container.offsetTop}`);
    }

    // Load saved position
    var savedPosition = GM_getValue('containerPosition', '');
    if (savedPosition) {
        var [x, y] = savedPosition.split(',');
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        container.style.bottom = 'auto';
    }
})();