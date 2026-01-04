// ==UserScript==
// @name         Enable image pasting from clipboard in Poe
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Simulate drag and drop when pasting an image from the clipboard
// @author       You
// @match        https://poe.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488690/Enable%20image%20pasting%20from%20clipboard%20in%20Poe.user.js
// @updateURL https://update.greasyfork.org/scripts/488690/Enable%20image%20pasting%20from%20clipboard%20in%20Poe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to dispatch an event
    function dispatchEvent(type, target, dataTransfer) {
        const event = new Event(type, {
            bubbles: true,
            cancelable: true
        });

        // Set the dataTransfer property if available
        if (dataTransfer) {
            event.dataTransfer = dataTransfer;
        }

        // Dispatch the event on the target element
        target.dispatchEvent(event);
    }

    // Add event listener for paste events
    window.addEventListener('paste', (event) => {
        let items = (event.clipboardData || event.originalEvent.clipboardData).items;

        for (let index in items) {
            let item = items[index];
            if (item.kind === 'file') {
                let blob = item.getAsFile();
                let dataTransfer = new DataTransfer();
                dataTransfer.items.add(blob);

                // Identify the drop zone element. You need to adjust this selector for the webpage.
                let dropZone = document.querySelector("div[class*=ChatDragDropTarget_dropTarget]");

                // Simulate the drag and drop events
                dispatchEvent('dragenter', dropZone, dataTransfer);
                dispatchEvent('dragover', dropZone, dataTransfer);
                dispatchEvent('drop', dropZone, dataTransfer);

                // Prevent the default paste action
                event.preventDefault();
            }
        }
    });
})();