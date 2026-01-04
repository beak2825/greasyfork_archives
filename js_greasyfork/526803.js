// ==UserScript==
// @name         Coordinate Input to Jartic Map2.2.5
// @namespace    http://tampermonkey.net/
// @version      2.2.5
// @description  Opens Jartic Map, MapFan, and Google Maps from coordinate input in Waze Map Editor
// @match        https://www.waze.com/ja/editor*
// @icon         https://pngimg.com/uploads/waze/waze_PNG21.png
// @author       碧いうさぎ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526803/Coordinate%20Input%20to%20Jartic%20Map225.user.js
// @updateURL https://update.greasyfork.org/scripts/526803/Coordinate%20Input%20to%20Jartic%20Map225.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '14px';
    container.style.left = '67%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '1';
    container.style.backgroundColor = 'white';
    container.style.padding = '5px';
    container.style.borderRadius = '5px';
    container.style.border = '1px solid #ccc';

    var dragArea = document.createElement('div');
    dragArea.style.width = '15px';
    dragArea.style.height = '100%';
    dragArea.style.position = 'absolute';
    dragArea.style.left = '0';
    dragArea.style.top = '0';
    dragArea.style.cursor = 'move';
    dragArea.style.backgroundColor = '#f0f0f0';
    dragArea.style.borderRight = '1px solid #ccc';
    container.appendChild(dragArea);

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '(例: 35.6895,139.6917)';
    input.style.width = '150px';
    input.style.marginLeft = '20px';
    input.style.marginRight = '5px';

    var pasteButton = document.createElement('button');
    pasteButton.textContent = 'Paste';
    pasteButton.style.padding = '3px';
    pasteButton.style.background = '#008CBA';
    pasteButton.style.color = 'white';
    pasteButton.style.border = 'none';
    pasteButton.style.borderRadius = '5px';
    pasteButton.style.cursor = 'pointer';
    pasteButton.style.marginRight = '5px';

    var jarticButton = document.createElement('button');
    jarticButton.textContent = 'Jartic';
    jarticButton.style.padding = '3px 5px';
    jarticButton.style.background = '#4CAF50';
    jarticButton.style.color = 'white';
    jarticButton.style.border = 'none';
    jarticButton.style.borderRadius = '5px';
    jarticButton.style.cursor = 'pointer';
    jarticButton.style.marginRight = '5px';

    var mapfanButton = document.createElement('button');
    mapfanButton.textContent = 'MapFan';
    mapfanButton.style.padding = '3px 5px';
    mapfanButton.style.background = '#FF5733';
    mapfanButton.style.color = 'white';
    mapfanButton.style.border = 'none';
    mapfanButton.style.borderRadius = '5px';
    mapfanButton.style.cursor = 'pointer';
    mapfanButton.style.marginRight = '5px';

    var googleMapsButton = document.createElement('button');
    googleMapsButton.textContent = 'Google Maps';
    googleMapsButton.style.padding = '3px 5px';
    googleMapsButton.style.background = '#4285F4';
    googleMapsButton.style.color = 'white';
    googleMapsButton.style.border = 'none';
    googleMapsButton.style.borderRadius = '5px';
    googleMapsButton.style.cursor = 'pointer';

    container.appendChild(input);
    container.appendChild(pasteButton);
    container.appendChild(jarticButton);
    container.appendChild(mapfanButton);
    container.appendChild(googleMapsButton);
    document.body.appendChild(container);

    pasteButton.addEventListener('click', function() {
        navigator.clipboard.readText().then(text => {
            input.value = text;
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    });

    jarticButton.addEventListener('click', function() {
        var coords = input.value.split(',');
        if (coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]))) {
            var latitude = coords[0].trim();
            var longitude = coords[1].trim();
            var fixedZoomLevel = 19;
            var jarticUrl = `http://hotmist.ddo.jp/jartic_kisei/@${latitude},${longitude},${fixedZoomLevel}z`;
            window.open(jarticUrl, '_blank');
        } else {
            alert("有効な座標を入力してください。形式は '緯度,経度' です。");
        }
    });

    mapfanButton.addEventListener('click', function() {
        var coords = input.value.split(',');
        if (coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]))) {
            var latitude = coords[0].trim();
            var longitude = coords[1].trim();
            var fixedZoomLevel = 18;
            var mapfanUrl = `https://mapfan.com/map/spots/search?c=${latitude},${longitude},${fixedZoomLevel}&s=std,pc,ja&p=none`;
            window.open(mapfanUrl, '_blank');
        } else {
            alert("有効な座標を入力してください。形式は '緯度,経度' です。");
        }
    });

    googleMapsButton.addEventListener('click', function() {
        var coords = input.value.split(',');
        if (coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]))) {
            var latitude = coords[0].trim();
            var longitude = coords[1].trim();
            var fixedZoomLevel = 18;
            var googleMapsUrl = `https://www.google.com/maps/@${latitude},${longitude},${fixedZoomLevel}z`;
            window.open(googleMapsUrl, '_blank');
        } else {
            alert("有効な座標を入力してください。形式は '緯度,経度' です。");
        }
    });

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
        localStorage.setItem('jarticContainerPosition', `${container.offsetLeft},${container.offsetTop}`);
    }

    var storedPosition = localStorage.getItem('jarticContainerPosition');
    if (storedPosition) {
        var [x, y] = storedPosition.split(',');
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        container.style.bottom = 'auto';
    }
})();