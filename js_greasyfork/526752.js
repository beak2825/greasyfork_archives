// ==UserScript==
// @name         FlipHTML5 URL and Download Generator+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds buttons to copy the /basic URL and navigate to the vpdfs download link.
// @match        https://online.fliphtml5.com/*
// @match        https://fliphtml5.com/*
// @exclude      https://fliphtml5.com/
// @grant        GM_setClipboard
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/526752/FlipHTML5%20URL%20and%20Download%20Generator%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/526752/FlipHTML5%20URL%20and%20Download%20Generator%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //title almaya gerek yok
    //const title = document.title.trim();
    const url = window.location.href;
    const match = url.match(/https?:\/\/[^\/]+\/(\w+)\/(\w+)/);

    if (match) {
    //title almaya gerek yok.
    //if (match && title) {
        const path = `${match[1]}/${match[2]}`;
        //https://fliphtml5.com/rzegl/hmha/basic şeklinde olması yetiyor.
        //https://fliphtml5.com/rzegl/hmha/xxxxxxxxx/basic de oluyor. O yüzden aradaki kitap adının urlye hiçbir etkisi yok.
        const basicUrl = `https://fliphtml5.com/${path}/basic`;
        //const basicUrl = `https://fliphtml5.com/${path}/${encodeURIComponent(title)}/basic`;
        const downloadUrl = `https://fliphtml5.vpdfs.com/${path}/`;

        function createButton(text, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.position = 'fixed';
            btn.style.top = text === 'URL' ? '100px' : '150px';
            btn.style.right = '20px';
            btn.style.padding = '10px';
            btn.style.backgroundColor = '#4CAF50';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '9999';
            btn.addEventListener('click', onClick);
            document.body.appendChild(btn);
        }

        createButton('URL', () => {
            GM_setClipboard(basicUrl);
            alert('URL copied to clipboard: ' + basicUrl);
        });

        createButton('Download', () => {
            window.location.href = downloadUrl;
        });
    }
})();
