    // ==UserScript==
    // @name        Scribd Content Viewer/Downloader
    // @namespace   Violentmonkey Scripts
    // @match       *://www.scribd.com/*
    // @grant       none
    // @version     1.01
    // @author      FENZIGO
    // @description View or export scribd docs content for free
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539245/Scribd%20Content%20ViewerDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539245/Scribd%20Content%20ViewerDownloader.meta.js
    // ==/UserScript==
     
     
     
    (function() {
     
        'use strict';
     
        let originalUrl = null;
     
     
        function redirectToEmbed() {
     
            const currentUrl = window.location.href;
     
            localStorage.setItem('originalUrl', currentUrl);
     
            const regex = /https:\/\/www\.scribd\.com\/[^/]+\/([^/]+)\/[^/]+/; 
     
     
            const match = currentUrl.match(regex);
     
     
     
            if (match) {
     
     
     
                const newUrl = `https://www.scribd.com/embeds/${match[1]}/content`;
     
                window.location.href = newUrl;
     
            } else {
     
                alert("Refresh page.");
     
            }
     
        }
     
     
     
        function downloadContent() {
     
            const contentElements = document.querySelectorAll('.text_layer .a');
     
            let content = '';
     
     
            contentElements.forEach(element => {
     
                content += element.textContent + '\n';
     
            });
     
     
     
     
            const blob = new Blob([content], { type: 'text/plain' });
     
            const url = URL.createObjectURL(blob);
     
            const a = document.createElement('a');
     
            a.href = url;
     
            a.download = 'scribd_content.txt';
            document.body.appendChild(a);
     
            a.click();
     
            document.body.removeChild(a);
     
            URL.revokeObjectURL(url);
     
        }
     
     
     
     
        function downloadContentAsPDF() {
     
        const savedUrl = localStorage.getItem('originalUrl');
     
        if (!savedUrl) {
            alert('Refresh page');
            return;
        }
     
     
        const regex = /https:\/\/www\.scribd\.com\/(?:doc|document|presentation)\/(\d+)\/([^/?#]+)/;
     
        const match = savedUrl.match(regex);
     
        if (match) {
            const part1 = match[1]; // np. "505139221"
            const part2 = match[2]; // np. "xtream-codes-4"
     
            console.log(`doc_number: ${part1}`);
            console.log(`doc_title: ${part2}`);
     
            const newUrl = `https://compress-pdf.vietdreamhouse.com/?fileurl=https://scribd.downloader.tips/pdownload/${part1}/${part2}`;
            window.location.href = newUrl;
        }
        else {
            alert('url does not match');
        }
    }
     
     
     
        const redirectButton = document.createElement('button');
     
        redirectButton.textContent = 'View Full';
     
        redirectButton.style.position = 'fixed';
     
        redirectButton.style.top = '10px';
     
        redirectButton.style.right = '10px';
     
        redirectButton.style.zIndex = '1000';
     
        redirectButton.style.padding = '10px';
     
        redirectButton.style.backgroundColor = '#4CAF50';
     
        redirectButton.style.color = 'white';
     
        redirectButton.style.border = 'none';
     
        redirectButton.style.borderRadius = '5px';
     
        redirectButton.style.cursor = 'pointer';
     
     
     
     
        redirectButton.addEventListener('click', redirectToEmbed);
     
        document.body.appendChild(redirectButton);
     
     
     
     
        const downloadButton = document.createElement('button');
     
        downloadButton.textContent = 'Download(TXT)';
     
        downloadButton.style.position = 'fixed';
     
        downloadButton.style.top = '50px';
     
        downloadButton.style.right = '10px';
     
        downloadButton.style.zIndex = '1000';
     
        downloadButton.style.padding = '10px';
     
        downloadButton.style.backgroundColor = '#007BFF';
     
        downloadButton.style.color = 'white';
     
        downloadButton.style.border = 'none';
     
        downloadButton.style.borderRadius = '5px';
     
        downloadButton.style.cursor = 'pointer';
     
     
     
     
        downloadButton.addEventListener('click', downloadContent);
     
        document.body.appendChild(downloadButton);
     
     
     
     
        const downloadPDFButton = document.createElement('button');
     
        downloadPDFButton.textContent = 'Download(PDF)';
     
        downloadPDFButton.style.position = 'fixed';
     
        downloadPDFButton.style.top = '90px';
     
        downloadPDFButton.style.right = '10px';
     
        downloadPDFButton.style.zIndex = '1000';
     
        downloadPDFButton.style.padding = '10px';
     
        downloadPDFButton.style.backgroundColor = '#FF5733';
     
        downloadPDFButton.style.color = 'white';
     
        downloadPDFButton.style.border = 'none';
     
        downloadPDFButton.style.borderRadius = '5px';
     
        downloadPDFButton.style.cursor = 'pointer';
     
     
     
        downloadPDFButton.addEventListener('click', downloadContentAsPDF);
     
        document.body.appendChild(downloadPDFButton);
     
    })();

