// ==UserScript==
// @name         Page Text Editor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows editing text on any webpage by clicking a button with improved styling and draggable functionality
// @author       Rylogix
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487948/Page%20Text%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/487948/Page%20Text%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let offsetX, offsetY;

    function enableEditMode() {
        document.querySelectorAll('*').forEach(function(node) {
            node.setAttribute('contenteditable', 'true');
        });
    }

    function disableEditMode() {
        document.querySelectorAll('*').forEach(function(node) {
            node.removeAttribute('contenteditable');
        });
    }

    var editButton = document.createElement('button');
    editButton.innerHTML = 'Edit Text';
    editButton.style.position = 'fixed';
    editButton.style.top = '10px';
    editButton.style.right = '10px';
    editButton.style.padding = '8px 12px';
    editButton.style.border = 'none';
    editButton.style.borderRadius = '5px';
    editButton.style.background = '#3498db';
    editButton.style.color = '#fff';
    editButton.style.fontFamily = 'Arial, sans-serif';
    editButton.style.fontSize = '14px';
    editButton.style.cursor = 'pointer';
    editButton.style.userSelect = 'none'; // Prevent text selection
    editButton.style.zIndex = '9999'; // Ensure button overlays everything

    // Function to handle mouse down event on the button
    function handleMouseDown(event) {
        isDragging = true;
        offsetX = event.clientX - editButton.getBoundingClientRect().left;
        offsetY = event.clientY - editButton.getBoundingClientRect().top;
    }

    // Function to handle mouse move event on the document
    function handleMouseMove(event) {
        if (isDragging) {
            editButton.style.top = (event.clientY - offsetY) + 'px';
            editButton.style.left = (event.clientX - offsetX) + 'px';
        }
    }

    // Function to handle mouse up event on the document
    function handleMouseUp() {
        isDragging = false;
    }

    // Add event listeners for mouse events
    editButton.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Function to toggle edit mode and button text
    editButton.onclick = function() {
        if (editButton.innerHTML === 'Edit Text') {
            enableEditMode();
            editButton.innerHTML = 'Stop Editing';
        } else {
            disableEditMode();
            editButton.innerHTML = 'Edit Text';
        }
    };

    document.body.appendChild(editButton);
})();
