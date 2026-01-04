// ==UserScript==
// @name         Mobile Element Inspector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to inspect elements on mobile browsers.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530052/Mobile%20Element%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/530052/Mobile%20Element%20Inspector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function inspectElement(event) {
        event.preventDefault(); // Prevent default click behavior
        event.stopPropagation(); // Stop event bubbling

        let target = event.target;
        let elementInfo = "";

        elementInfo += "Tag: " + target.tagName + "\n";
        elementInfo += "ID: " + target.id + "\n";
        elementInfo += "Class: " + target.className + "\n";
        elementInfo += "Attributes: " + JSON.stringify(target.attributes) + "\n";
        elementInfo += "Style: " + target.style.cssText + "\n";

        alert(elementInfo);
    }

    function createInspectorButton() {
        let button = document.createElement('button');
        button.textContent = 'Inspect Element';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.padding = '10px 15px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            alert("Tap on the element you wish to inspect.");
            document.addEventListener('touchstart', inspectElement, { once: true, capture: true }); // Use touchstart for mobile
            document.addEventListener('click', inspectElement, { once: true, capture: true }); //use click for desktop testing
        });

        document.body.appendChild(button);
    }

    createInspectorButton();

})();
