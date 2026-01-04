// ==UserScript==
// @name         Asharq download button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a download button for videos on specific episode pages.
// @author       Abu3safeer@greasyfork.org
// @match        *://now.asharq.com/episode/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515574/Asharq%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/515574/Asharq%20download%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fetchDataAndAddButton() {
        fetch(window.location.href)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const scriptTag = doc.querySelector('script[type="application/ld+json"]');
                if (!scriptTag) return;

                const jsonData = JSON.parse(scriptTag.textContent);
                const videoObject = jsonData['@graph'].find(item => item['@type'] === 'VideoObject');

                if (videoObject) {
                    const contentUrl = videoObject.contentUrl;
                    const name = videoObject.name;

                    const existingButton = document.getElementById('download-button');
                    if (existingButton) existingButton.remove();

                    const button = document.createElement('button');
                    button.id = 'download-button';
                    button.innerText = 'Download Video';
                    button.style.position = 'fixed';
                    button.style.top = '10px';
                    button.style.left = '10px';
                    button.style.zIndex = '99999999';
                    button.style.backgroundColor = '#ff0000';
                    button.style.color = '#fff';
                    button.style.border = 'none';
                    button.style.padding = '10px';
                    button.style.cursor = 'pointer';

                    button.addEventListener('click', () => {
                        const link = document.createElement('a');
                        link.href = contentUrl;
                        link.download = `${name}.mp4`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });

                    document.body.appendChild(button);
                }
            })
            .catch(error => console.error('Error fetching the page:', error));
    }

    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                const existingButton = document.getElementById('download-button');
                if (existingButton) existingButton.remove();
                setTimeout(fetchDataAndAddButton, 1000); // Adding a slight delay to ensure DOM updates
            }
        }).observe(document.body, { subtree: true, childList: true });
    }

    // Initial button addition
    setTimeout(fetchDataAndAddButton, 1000); // Ensure the page is fully loaded
    observeUrlChanges();
})();
