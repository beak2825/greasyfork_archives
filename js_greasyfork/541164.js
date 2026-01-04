// ==UserScript==
// @name         Archive.org Direct Download Links with Sizes & Sort
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show direct download links with file sizes, sorted largest first, on archive.org pages
// @match        https://archive.org/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541164/Archiveorg%20Direct%20Download%20Links%20with%20Sizes%20%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/541164/Archiveorg%20Direct%20Download%20Links%20with%20Sizes%20%20Sort.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const identifierMatch = window.location.pathname.match(/^\/details\/([^/?#]+)/);
    if (!identifierMatch) return;
    const identifier = identifierMatch[1];

    let metadata;
    try {
        const res = await fetch(`https://archive.org/metadata/${identifier}`);
        metadata = await res.json();
    } catch (e) {
        console.error('Failed to fetch archive metadata', e);
        return;
    }

    const baseHost = metadata.d1 || metadata.d2 || 'https://archive.org';
    const basePath = `/items/${identifier}/`;

    const isMetaFile = (filename) => (
        filename.endsWith('_meta.xml') ||
        filename.endsWith('_meta.json') ||
        filename.endsWith('_files.xml') ||
        filename.endsWith('_thumb.jpg') ||
        filename.endsWith('_archive.torrent') ||
        filename.endsWith('.sqlite') ||
        filename.startsWith('dark') ||
        filename.startsWith('__ia_thumb') ||
        filename.startsWith('ia_logo') ||
        filename.endsWith('.bif')
    );

    // Convert bytes to readable string
    const formatSize = (bytes) => {
        if (bytes === undefined) return '';
        if (bytes > 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
        if (bytes > 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
        if (bytes > 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
        return bytes + ' B';
    };

    // Filter & sort files largest first
    const files = metadata.files.filter(f => f.name && !isMetaFile(f.name));
    files.sort((a, b) => (b.size || 0) - (a.size || 0));

    const panel = document.createElement('div');
    panel.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #0078e7;
        padding: 10px;
        border-radius: 8px;
        z-index: 99999;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        max-height: 70vh;
        overflow-y: auto;
        width: 320px;
        font-family: Arial, sans-serif;
        color: white;
    `;

    const title = document.createElement('div');
    title.textContent = '⬇️ Direct Download Links (Largest First)';
    title.style = 'margin-bottom: 8px; font-size: 16px; font-weight: bold;';
    panel.appendChild(title);

    files.forEach(file => {
        const encodedName = encodeURIComponent(file.name).replace(/%20/g, '+');
        const fileUrl = `${baseHost}${basePath}${encodedName}`;

        const link = document.createElement('a');
        link.href = fileUrl;
        link.textContent = `${file.name} (${formatSize(file.size)})`;
        link.target = '_blank';
        link.style = `
            display: block;
            margin-bottom: 6px;
            color: #fff;
            text-decoration: underline;
            cursor: pointer;
            font-size: 12px;
            word-break: break-word;
        `;
        link.download = file.name;

        panel.appendChild(link);
    });

    document.body.appendChild(panel);
})();
