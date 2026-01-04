// ==UserScript==
// @name         Vertretungsplan Opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Öffnet Vertretungsplan PDFs direkt im Browser in einem neuen Tab
// @author       You
// @match        https://www.mittelschule-ossling.de/vertretungsplan.html
// @match        https://www.mittelschule-ossling.de/stundenplan.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495074/Vertretungsplan%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/495074/Vertretungsplan%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var pdfLinks = document.querySelectorAll('.ce_downloads ul a[href$=".pdf"]');
        pdfLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                var fileNameWithSize = link.textContent.trim();
                var fileName = fileNameWithSize.replace(/\s*\(\d+,\d+\s*KiB\)\s*$/, '');
                var newLink = document.createElement('a');


                if (window.location.href === 'https://www.mittelschule-ossling.de/stundenplan.html') {
                  newLink.href = 'https://www.mittelschule-ossling.de/files/pdf/stundenplan/' + fileName;
                } else if (window.location.href === 'https://www.mittelschule-ossling.de/vertretungsplan.html') {
                  newLink.href = 'https://www.mittelschule-ossling.de/files/pdf/vertretungsplan/' + fileName;
                }

                newLink.target = '_blank';
                newLink.textContent = 'Öffne ' + fileName + ' im neuen Tab';
                document.body.appendChild(newLink);
                newLink.click();
                document.body.removeChild(newLink);
            });
        });
    });
})();
