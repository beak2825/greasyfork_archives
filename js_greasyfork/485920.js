// ==UserScript==
// @name         Download Button for GreasyFork scripts
// @version      1.2
// @author       Rust1667
// @description  Adds a button to download the script
// @match        https://greasyfork.org/*/scripts/*
// @match        https://sleazyfork.org/*/scripts/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/485920/Download%20Button%20for%20GreasyFork%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/485920/Download%20Button%20for%20GreasyFork%20scripts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the install link element
    var installLink = document.querySelector('#install-area .install-link');

    // Determine the file name
    const installURLlink = installLink.getAttribute('href');

    function getFilenameFromUrl() {
        const url = installURLlink;
        var lastSlashIndex = url.lastIndexOf('/');
        var filenameWithExtension = url.substring(lastSlashIndex + 1);
        var decodedFilename = filenameWithExtension.replace(/%20/g, '_');
        return decodedFilename;
    }

    // Create a download button
    var downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Script';
    downloadButton.style.marginLeft = '10px';

    // Add click event listener to the download button
    downloadButton.addEventListener('click', function() {
        var scriptUrl = installLink.getAttribute('href');
        downloadFile(scriptUrl);
    });

    // Insert the download button after the install link
    installLink.parentNode.insertBefore(downloadButton, installLink.nextSibling);

    function downloadFile(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (xhr.status === 200) {
                var blob = xhr.response;
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = getFilenameFromUrl();
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        };
        xhr.send();
    }
})();
