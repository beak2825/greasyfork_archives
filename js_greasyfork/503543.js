// ==UserScript==
// @name         Image/Video Orientation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Orient media elements using right-click context menu
// @author       Your Name
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/503543/ImageVideo%20Orientation.user.js
// @updateURL https://update.greasyfork.org/scripts/503543/ImageVideo%20Orientation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentElement = null;

    // Function to rotate the media element
    function rotateMedia(degrees) {
        if (currentElement) {
            currentElement.style.transform = `rotate(${degrees}deg)`;
        }
    }

    // Function to check if the clicked element is a media element
    function isMediaElement(element) {
        return element.tagName === 'IMG' || element.tagName === 'VIDEO';
    }

    // Context menu event listener
    document.addEventListener('contextmenu', function(event) {
        const target = event.target;
        if (isMediaElement(target)) {
            currentElement = target;
        } else {
            currentElement = null;
        }
    }, true);

    // Register menu commands
    GM_registerMenuCommand("Original Rotation", function() { rotateMedia(0); });
    GM_registerMenuCommand("90° Rotation", function() { rotateMedia(90); });
    GM_registerMenuCommand("-90° Rotation", function() { rotateMedia(270); });
    GM_registerMenuCommand("180° Rotation", function() { rotateMedia(180); });

})();