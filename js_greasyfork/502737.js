// ==UserScript==
// @name         NicoNico URL Converter and Copier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert NicoNico URL to a specified format and copy to clipboard
// @author       Your Name
// @match        *://www.nicovideo.jp/watch/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502737/NicoNico%20URL%20Converter%20and%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/502737/NicoNico%20URL%20Converter%20and%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert URL and copy to clipboard
    function convertAndCopyUrl() {
        const currentUrl = window.location.href;
        const match = currentUrl.match(/watch\/(sm\d+)/);
        if (match) {
            const videoId = match[1];
            const newUrl = `https://www.nicovideo.life/watch?v=${videoId}`;
            GM_setClipboard(newUrl);
            alert(`Converted URL copied to clipboard: ${newUrl}`);
        } else {
            alert('Invalid NicoNico URL.');
        }
    }

    // Add a button to the page for conversion and copy
    const button = document.createElement('button');
    button.textContent = 'Convert and Copy URL';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#f00';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', convertAndCopyUrl);

    document.body.appendChild(button);
})();
