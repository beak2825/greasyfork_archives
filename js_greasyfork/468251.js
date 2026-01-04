// ==UserScript==
// @name         ChatGPT on all sites (lite)+
// @namespace    http://your-namespace.com/
// @version      1.0
// @description  Adds an overlay element with embedded iframe to all websites
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468251/ChatGPT%20on%20all%20sites%20%28lite%29%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/468251/ChatGPT%20on%20all%20sites%20%28lite%29%2B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Check if the script is already running or if the iframe element exists
    if (window.top !== window.self || document.getElementById('overlay-iframe')) {
        return;
    }
 
    // Create the div element
    var divElement = document.createElement('div');
    divElement.style.position = 'fixed';
    divElement.style.top = '0';
    divElement.style.left = '0';
    divElement.style.width = '100vw';
    divElement.style.height = '100vh';
    divElement.style.zIndex = '9999';
 
    // Create the iframe element
    var iframeElement = document.createElement('iframe');
    iframeElement.id = 'overlay-iframe';
    iframeElement.src = 'https://ora.ai/embed/1196e21a-d2be-4d23-91e0-870b1fae93ba';
    iframeElement.width = '17%';
    iframeElement.height = '40%';
    iframeElement.style.border = '0';
    iframeElement.style.borderRadius = '4px';
 
    // Append the iframe element to the div element
    divElement.appendChild(iframeElement);
 
    // Insert the div element at the top of the document body
    document.body.insertBefore(divElement, document.body.firstChild);
})();
// It's funny because sex