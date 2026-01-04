// ==UserScript==
// @name         Local Storage Viewer
// @namespace   Violentmonkey Scripts
// @version      1.01
// @description  View local storage keys and their values
// @license MIT
// @author       H17S3/Spartanian
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487774/Local%20Storage%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/487774/Local%20Storage%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.width = '400px';
    container.style.maxHeight = '500px';
    container.style.overflow = 'auto';
    container.style.background = '#2b2b2b';
    container.style.border = '1px solid #555';
    container.style.borderRadius = '5px';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'Roboto, Arial, sans-serif';
    container.draggable = true;

    var header = document.createElement('div');
    header.style.padding = '10px';
    header.style.cursor = 'move';
    header.style.background = '#222';
    header.style.borderBottom = '1px solid #555';
    header.style.borderRadius = '5px 5px 0 0';
    header.style.color = '#fff';
    header.style.fontSize = '18px';
    header.style.fontWeight = 'bold';
    header.textContent = 'Local Storage Viewer';
    header.style.fontFamily = 'Roboto, Arial, sans-serif';
    container.appendChild(header);

    var content = document.createElement('div');
    content.style.padding = '10px';
    content.style.color = '#fff';
    container.appendChild(content);

    var isDragging = false;
    var startX = 0;
    var startY = 0;

    header.addEventListener('mousedown', function (event) {
        isDragging = true;
        startX = event.clientX - container.offsetLeft;
        startY = event.clientY - container.offsetTop;
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            container.style.left = (event.clientX - startX) + 'px';
            container.style.top = (event.clientY - startY) + 'px';
        }
    });


    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        var dataType = typeof value;

        var item = document.createElement('div');
        item.style.marginBottom = '10px';

        var dropdownButton = document.createElement('span');
        dropdownButton.textContent = '▼';
        dropdownButton.style.cursor = 'pointer';
        dropdownButton.style.fontFamily = 'Roboto, Arial, sans-serif';
        dropdownButton.style.marginRight = '5px';
        dropdownButton.addEventListener('click', createDropdownHandler(item, dropdownButton));
        item.appendChild(dropdownButton);

        var keyElement = document.createElement('span');
        keyElement.textContent = key;
        keyElement.style.fontWeight = 'bold';
        keyElement.style.fontFamily = 'Roboto, Arial, sans-serif';
        keyElement.style.marginRight = '5px';
        item.appendChild(keyElement);

        var valueElement = document.createElement('pre');
        valueElement.innerHTML = formatValue(value);
        valueElement.style.marginLeft = '15px';
        valueElement.style.display = 'none';
        valueElement.style.whiteSpace = 'pre-wrap';
        valueElement.style.fontFamily = 'Roboto, Arial, sans-serif';
        valueElement.style.wordWrap = 'break-word';
        item.appendChild(valueElement);

        if (dataType === 'object') {
            dropdownButton.style.visibility = 'visible';
        }

        content.appendChild(item);
    }

    function createDropdownHandler(item, dropdownButton) {
        return function () {
            var valueElement = item.querySelector('pre');
            if (item.classList.contains('expanded')) {
                item.classList.remove('expanded');
                dropdownButton.textContent = '▼';
                valueElement.style.display = 'none';
            } else {
                item.classList.add('expanded');
                dropdownButton.textContent = '▲';
                valueElement.style.display = 'block';
                colorizeNumbersAndBooleans(valueElement);
            }
        };
    }

    function formatValue(value) {
        try {
            var parsedValue = JSON.parse(value);
            return JSON.stringify(parsedValue, null, 4);
        } catch (error) {
            return value;
        }
    }


    function colorizeNumbersAndBooleans(valueElement) {
        var text = valueElement.innerHTML;
        text = text.replace(/"(true|false)"/g, '<span style="color:#77D72F;">$1</span>');
        text = text.replace(/"([^"]*)"/g, '<span style="color: #77D72F;">"$1"</span>');
        text = text.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color: #f39c12;">$1</span>');
        valueElement.innerHTML = text;
    }

    document.body.appendChild(container);

    var toggleButton = document.createElement('button');
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.padding = '10px';
    toggleButton.style.background = '#2b2b2b';
    toggleButton.style.border = '1px solid #555';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.color = '#fff';
    toggleButton.style.fontFamily = 'Roboto, Arial, sans-serif';
    toggleButton.textContent = 'Toggle GUI';

    toggleButton.addEventListener('click', function () {
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });

    document.body.appendChild(toggleButton);
})();