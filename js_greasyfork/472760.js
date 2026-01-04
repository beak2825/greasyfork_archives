// ==UserScript==
// @name         GCAM Config XML Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds download links to XML files on a webpage.
// @author       Andreyka_MD
// @match        *4pda*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/472760/GCAM%20Config%20XML%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/472760/GCAM%20Config%20XML%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all XML file links on the page
    const xmlLinks = document.querySelectorAll('a[href$=".xml"]');

    xmlLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const fileName = link.textContent.endsWith('.xml') ? link.textContent : `${link.textContent}.xml`;
            GM_download({
                url: link.href,
                name: fileName
            });
        });
    });
})();
