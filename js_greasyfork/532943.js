// ==UserScript==
// @name         Issuu CBZ Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Easily download all pages of an Issuu publication as a CBZ file
// @match        https://issuu.com/*/docs/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532943/Issuu%20CBZ%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/532943/Issuu%20CBZ%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const jszipScript = document.createElement('script');
    jszipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
    document.body.appendChild(jszipScript);

    jszipScript.onload = function() {
        const btn = document.createElement('button'); btn.type = 'button'; btn.setAttribute('aria-label', 'Download'); btn.style.position = 'fixed'; btn.style.bottom = '0'; btn.style.left = '0'; btn.style.width = '100%'; btn.style.zIndex = '99999'; btn.style.backgroundColor = '#007BFF'; btn.style.color = 'white'; btn.style.border = 'none'; btn.style.padding = '12px'; btn.style.fontSize = '16px'; btn.style.fontWeight = 'bold'; btn.style.cursor = 'pointer'; btn.style.display = 'flex'; btn.style.alignItems = 'center'; btn.style.justifyContent = 'center';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '24'); svg.setAttribute('height', '24'); svg.setAttribute('fill', 'white'); svg.style.marginRight = '10px';
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', 'M3 19H21V21H3V19ZM13 13.1716L19.0711 7.1005L20.4853 8.51472L12 17L3.51472 8.51472L4.92893 7.1005L11 13.1716V2H13V13.1716Z'); svg.appendChild(path);
        //Tx to remixicon.com
        const text = document.createElement('span'); text.textContent = 'DOWNLOAD'; btn.appendChild(svg); btn.appendChild(text); document.body.appendChild(btn);

        btn.addEventListener('click', async () => {
            const iframeDoc = (document.querySelector('iframe')).contentDocument || iframe.contentWindow.document;
            const rawScript = (Array.from(document.scripts)).find(s => s.textContent.includes('\\"publicationId\\"') && s.textContent.includes('\\"revisionId\\"'));

            const pubId = rawScript.textContent.match(/\\"publicationId\\":\\"([a-f0-9]+)\\"/)?.[1];
            const revId = rawScript.textContent.match(/\\"revisionId\\":\\"(\d+)\\"/)?.[1];

            const total = parseInt(((iframeDoc.querySelector('[data-testid="page-numbers"]')).textContent.match(/\/\s*(\d+)/))[1]);
            const zip = new JSZip();
            const promises = [];

            const title = document.querySelector('h1[data-testid="document-title"]')?.textContent.trim() || 'Untitled';
            const author = document.querySelector('.publisher-details div a')?.textContent.trim() || 'Unknown Author';
            const formattedDate = new Date(document.querySelector('span.publish-date time')?.textContent.trim() || 'Unknown Date').toLocaleDateString('en-GB').replace(/\//g, '-');

            // Generate the filename with the specified format
            const filename = `${title} by ${author} (${formattedDate}).cbz`;

            for (let i = 1; i <= total; i++) {
                const url = `https://image.isu.pub/${revId}-${pubId}/jpg/page_${i}.jpg`;
                promises.push(
                    fetch(url).then(r => r.blob()).then(b => zip.file(`page_${i}.jpg`, b)).catch(err => console.warn('Page error', i, err))
                );
            }

            Promise.all(promises).then(() => {
                zip.generateAsync({ type: 'blob' }).then(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    a.click();
                });
            });
        });
    };
})();
