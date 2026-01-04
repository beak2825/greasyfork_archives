// ==UserScript==
// @name         Auto Download Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provide a download link for iOS devices
// @match        https://api.khoindvn.eu.org/5rJ24F
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504430/Auto%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/504430/Auto%20Download%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a download link
    var downloadLink = document.createElement('a');
    downloadLink.href = 'https://api.khoindvn.eu.org/5rJ24F';
    downloadLink.download = 'file_name'; // Optional: specify a default file name
    downloadLink.textContent = 'Download File';
    downloadLink.style.position = 'fixed';
    downloadLink.style.bottom = '20px';
    downloadLink.style.right = '20px';
    downloadLink.style.padding = '10px';
    downloadLink.style.backgroundColor = '#007bff';
    downloadLink.style.color = '#fff';
    downloadLink.style.textDecoration = 'none';
    downloadLink.style.borderRadius = '5px';
    downloadLink.style.zIndex = '1000';

    // Append link to the body
    document.body.appendChild(downloadLink);
})();
