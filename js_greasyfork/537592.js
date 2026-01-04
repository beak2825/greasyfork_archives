// ==UserScript==
// @name         Doceru Download Button Inserter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Insere um botão de download personalizado para baixar o PDF direto do link data-pdf-url no doceru.com
// @author       Você
// @match        https://doceru.com/doc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537592/Doceru%20Download%20Button%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/537592/Doceru%20Download%20Button%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(msg) {
        console.log(`[DoceruDownloader] ${msg}`);
    }

    function getPdfUrl() {
        const el = document.querySelector('[data-pdf-url]');
        if (el) {
            return el.getAttribute('data-pdf-url');
        }
        return null;
    }

    function getFileNameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const parts = urlObj.pathname.split('/');
            const namePart = parts.length > 2 ? parts[parts.length - 2] : 'doceru_download';
            return `${namePart}.pdf`;
        } catch {
            return 'doceru_download.pdf';
        }
    }

    function createDownloadButton(url, filename) {
        const btn = document.createElement('button');
        btn.textContent = 'Download PDF';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#02bb9a';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.title = 'Clique para baixar o PDF';

        btn.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            log(`Download iniciado: ${filename}`);
        });

        document.body.appendChild(btn);
        log('Botão de download inserido na página.');
    }

    function main() {
        const pdfUrl = getPdfUrl();
        if (!pdfUrl) {
            log('Link data-pdf-url não encontrado.');
            return;
        }

        const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : window.location.origin + pdfUrl;
        const filename = getFileNameFromUrl(fullUrl);

        createDownloadButton(fullUrl, filename);
    }

    window.addEventListener('load', () => {
        setTimeout(main, 1500);
    });

})();
