// ==UserScript==
// @name         Anonfiles, Upload.ee, MediaFire PDF Viewer
// @namespace    https://leaked.wiki
// @version      1.1
// @description  Adds a button to view PDF and TXT files without needing to download them.
// @author       Sango
// @match        *://anonfiles.com/*
// @match        *://bayfiles.com/*
// @match        *://*.upload.ee/files/*
// @match        *://*.mediafire.com/file/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anonfiles.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      upload.ee
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/462864/Anonfiles%2C%20Uploadee%2C%20MediaFire%20PDF%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/462864/Anonfiles%2C%20Uploadee%2C%20MediaFire%20PDF%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ALWAYS_SHOW = false,
          PDF_HEIGHT = '100vh',
          TXT_ICON = 'https://i.imgur.com/Lt93sLj.png',
          PDF_ICON = 'https://i.imgur.com/IwbUR6B.png';



    function createViewButton(directURL, fileType, host) {
        const iconUrl = fileType === 'TXT' ? TXT_ICON : PDF_ICON;
        const icon = `<img src="${iconUrl}" style="height: 30px; width: 30px;">`;
        const pdfBtn = document.createElement('a');
        pdfBtn.href = '#Sango';
        pdfBtn.id = 'show-pdf';
        pdfBtn.type = 'button';
        pdfBtn.className = 'btn btn-primary btn-block';
        pdfBtn.style.background = 'rgb(36, 84, 136)';
        pdfBtn.style.color = 'white';
        pdfBtn.style.padding = '5px';
        pdfBtn.style.borderRadius = '12px';
        pdfBtn.style.border = '1px solid #000000';
        pdfBtn.style.display = 'inline-flex';
        pdfBtn.style.justifyContent = 'space-evenly';
        pdfBtn.style.alignItems = 'center';
        pdfBtn.style.fontSize = '13px';
        pdfBtn.style.margin = '5px';
        pdfBtn.style.gap = '5px';
        pdfBtn.style.position = 'relative';
        pdfBtn.style.zIndex = '420';
        pdfBtn.innerHTML = `${icon} View as ${fileType}`;

        pdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleFileView(directURL, fileType, host, pdfBtn);
        });

        return pdfBtn;
    }

    function handleFileView(directURL, fileType, host, btn) {
        const iconUrl = fileType === 'TXT' ? TXT_ICON : PDF_ICON;
        const icon = `<img src="${iconUrl}" style="height: 30px; width: 30px;">`;
        const existingFrame = document.getElementById('pdf-viewer');
        if (existingFrame) {
            existingFrame.remove();
            btn.innerHTML = `${icon} View as ${fileType}`;
            return;
        }
        const frame = document.createElement('iframe');
        frame.id = 'pdf-viewer';
        frame.style = `width: 100%; height: 100%; min-height: ${PDF_HEIGHT}; margin-bottom: 10px; border: 1px solid #245488;`;
        frame.src = '';
        btn.innerHTML = `${icon} Loading File...`;

        // display file on sites that lock download link by ip
        if (host.includes('upload.ee')) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: directURL,
                responseType: 'blob',
                onload: (response) => {
                    const fileBlob = new Blob([response.response], { type: fileType === 'PDF' ? 'application/pdf' : 'text/plain' });
                    const fileURL = URL.createObjectURL(fileBlob);
                    frame.src = fileURL;
                    frame.onload = () => { // scroll to iframe
                        frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        btn.innerHTML = `${icon} Hide ${fileType}`;
                    };
                },
                onerror: () => {
                    alert('Failed to fetch the file. Please try again.');
                    frame.remove();
                    btn.innerHTML = `${icon} View as ${fileType}`;
                },
            });
        } else {
            frame.src = `https://docs.google.com/viewer?url=${encodeURIComponent(directURL)}&embedded=true`;
            frame.onload = () => { // scroll to iframe
                frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
                btn.innerHTML = `${icon} Hide ${fileType}`;
            };
        }
        document.body.appendChild(frame);
    }

    const currentHost = window.location.hostname;
    let downloadUrl, container;
    if (currentHost.includes('anonfiles.com') || currentHost.includes('bayfiles.com')) {
        downloadUrl = document.getElementById('download-url');
        container = downloadUrl;
    } else if (currentHost.includes('upload.ee')) {
        downloadUrl = document.getElementById('d_l');
        container = downloadUrl;
    } else if (currentHost.includes('mediafire.com')) {
        downloadUrl = document.getElementById('downloadButton');
        container = document.querySelector('form[name="download"]');
    }

    if (downloadUrl) {
        const fileType = downloadUrl.href.split('.').pop().toUpperCase();
        if (['PDF', 'TXT'].includes(fileType)) {
            const button = createViewButton(downloadUrl.href, fileType, currentHost);
            container.insertAdjacentElement('afterend', button);

            if (ALWAYS_SHOW) {
                // Automatically show the file
                handleFileView(downloadUrl.href, fileType, currentHost, button);
            }
        }
    }
})();
