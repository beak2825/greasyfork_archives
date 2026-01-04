// ==UserScript==
// @name         AsusComm.com Video Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A button on the bottom right to activate video controls on videos.
// @author       CodePer
// @match        https://*.asuscomm.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510191/AsusCommcom%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/510191/AsusCommcom%20Video%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Create a new button element
  var button = document.createElement('button');
  button.textContent = 'Activate Video Controls'; // Set button text

  // Set button styles
  button.style.position = 'fixed';
  button.style.bottom = '32px';
  button.style.right = '350px';
  button.style.padding = '10px 20px';
  button.style.backgroundColor = '#007bff';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '4000'; // Set z-index

  // Add event listener to button
  button.addEventListener('click', function() {

 // Get all iframes on the page
    var iframes = document.getElementsByTagName('iframe');

    // Loop through each iframe
    for (var i = 0; i < iframes.length; i++) {
        // Access the contentDocument of each iframe
        var iframeDocument = iframes[i].contentDocument || iframes[i].contentWindow.document;

        // Check if the iframeDocument exists and is not empty
        if (iframeDocument) {
            // Get all video elements inside the iframe
            var videos = iframeDocument.getElementsByTagName('video');

            // Loop through each video element
            for (var j = 0; j < videos.length; j++) {
                // Add controls to each video element
                videos[j].setAttribute('controls', true);
            }
        }
    }

  });

  // Append button to the body
  document.body.appendChild(button);
})();