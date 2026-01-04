// ==UserScript==
// @name         EHentai Torrent Rename
// @namespace    https://github.com/Cirn09
// @version      0.2
// @description  Remove "{EHT PERSONALIZED TORRENT - DO NOT REDISTRIBUTE}" prefix for EHentai torrent downloading.
// @author       Cirn09
// @match        https://exhentai.org/gallerytorrents.php*
// @match        https://e-hentai.org/gallerytorrents.php*
// @icon         https://e-hentai.org/favicon.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468280/EHentai%20Torrent%20Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/468280/EHentai%20Torrent%20Rename.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const start = "document.location='";
    const end = "'; return false";

    let downloadLinks = document.querySelectorAll('a');
    for (let a of downloadLinks) {
        if ('onclick' in a.attributes) {
            let onclick = a.attributes['onclick'].nodeValue;
            if (!onclick.startsWith(start)) { return; }
            a.href = onclick.slice(start.length, onclick.indexOf(end));
            a.attributes.removeNamedItem('onclick');
            a.onclick = (function (event) {
                let url = this.href;
                let filename = a.innerText.trim() + '.torrent';

                fetch(url)
                    .then(function (response) {
                        if (response.ok) {
                            return response.blob();
                        }
                        throw new Error('Network response was not ok.');
                    })
                    .then(function (blob) {
                        var downloadLink = document.createElement('a');
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = filename;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    })
                    .catch(function (error) {
                        console.log('Error:', error);
                    });

                return false;

            });
        }
    }
})();
