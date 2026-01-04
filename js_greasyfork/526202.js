// ==UserScript==
// @name         Hianime to mal + autofocus on searchbar
// @version      1.0
// @description  Autofocus on searchbar + breadcrumb navigate to mal
// @author       Kunal Jaiswal
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hianime.to&size=64
// @match        https://hianime.to/*
// @grant        none
// @run-at       document-body
// @namespace https://greasyfork.org/users/1374464
// @downloadURL https://update.greasyfork.org/scripts/526202/Hianime%20to%20mal%20%2B%20autofocus%20on%20searchbar.user.js
// @updateURL https://update.greasyfork.org/scripts/526202/Hianime%20to%20mal%20%2B%20autofocus%20on%20searchbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        setTimeout(function() {
            if (window.location.href.startsWith('https://hianime.to/')) {
                var breadcrumbItem = document.querySelector('li.breadcrumb-item.dynamic-name.active');
                if (breadcrumbItem) {
                    var text = breadcrumbItem.textContent.trim();
                    var extractedText = text.replace(/^Watching\s+/i, ''); // Removes "Watching" from the text

                    // Create a new anchor element for the extracted text
                    var link = document.createElement('a');
                    link.href = `https://myanimelist.net/search/all?q=${encodeURIComponent(extractedText)}&cat=all`;
                    link.textContent = extractedText;
                    link.target = '_blank'; // Open link in a new tab

                    // Clear the existing text in the li element and reassemble it with the link
                    breadcrumbItem.innerHTML = ''; // Clear the existing content
                    breadcrumbItem.appendChild(document.createTextNode('Watching ')); // Add the text "Watching "
                    breadcrumbItem.appendChild(link); // Append the new link with the extracted text
                }
            }

            var mobileSearchDiv = document.getElementById('mobile_search');
            if (mobileSearchDiv) {
                mobileSearchDiv.addEventListener('click', function() {
                    var searchInput = document.querySelector('.form-control.search-input');
                    if (searchInput) {
                        searchInput.focus();
                    }
                });
            }
        }, 0);
    });
})();
