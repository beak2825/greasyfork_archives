// ==UserScript==
// @name         Bandcamp Download Cover Button
// @namespace    nj4442.bc.downloadscript
// @version      2.0
// @description  Adds a "Download Cover" button below Share/Embed on all Bandcamp album/track pages. Downloads the highest resolution album cover (_0.jpg/png)
// @author       nj4442
// @match        *://*.bandcamp.com/album/*
// @match        *://*.bandcamp.com/track/*
// @license       CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/541283/Bandcamp%20Download%20Cover%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/541283/Bandcamp%20Download%20Cover%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stig's Art Grabr logic for Bandcamp covers only
    function getHiResBandcampCover(url) {
        // Only operate on jpg/png ending with _<number>.jpg/png
        let hiRes = url.replace(/_\d{1,2}\.(jpg|png)$/i, '_0.$1');
        return hiRes;
    }

    function getAccentColor() {
        // Try to get accent color from .primaryText or .compound-button or use fallback
        const accentElem = document.querySelector('.primaryText, .compound-button');
        if (accentElem) {
            const color = getComputedStyle(accentElem).color || '';
            // Convert rgb to hex if needed
            if (color.startsWith('rgb')) {
                const rgb = color.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    return `#${((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1)}`;
                }
            }
            return color;
        }
        // Fallback accent
        return '#f2a6ea';
    }

    function onReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    onReady(function() {
        const shareLi = document.querySelector('.share-collect-controls li.share-embed');
        if (!shareLi) return;
        if (document.querySelector('.bandcamp-cover-download-btn')) return;

        // Find the cover image <a> and <img>
        const artContainer = document.querySelector('#tralbumArt');
        if (!artContainer) return;
        const imgLink = artContainer.querySelector('a.popupImage');
        if (!imgLink) return;
        const img = imgLink.querySelector('img');
        if (!img) return;
        let coverUrl = imgLink.getAttribute('href');
        if (!coverUrl) return;

        // Upgrade to hi-res using Stig's logic for Bandcamp
        coverUrl = getHiResBandcampCover(coverUrl);

        // Filename
        let defaultFilename = 'bandcamp_cover.jpg';
        const title = document.querySelector('.trackTitle')?.textContent.trim();
        const artist = document.querySelector('#name-section h3 a')?.textContent.trim() ||
                       document.querySelector('.albumTitle span[itemprop="byArtist"]')?.textContent.trim();
        if (title && artist) {
            defaultFilename = `${artist.replace(/[^\w-]/g, '_')}-${title.replace(/[^\w-]/g, '_')}_cover.jpg`;
        }

        // Accent color
        const accent = getAccentColor();

        // Create the button
        const btn = document.createElement('button');
        btn.textContent = 'Download Cover';
        btn.className = 'bandcamp-cover-download-btn';
        btn.style.margin = '5px 0 0 0';
        btn.style.background = accent + '22'; // transparent (hex alpha 22)
        btn.style.color = accent;
        btn.style.border = 'none';
        btn.style.padding = '2px 10px';
        btn.style.fontSize = '0.95em';
        btn.style.borderRadius = '3px';
        btn.style.cursor = 'pointer';
        btn.style.display = 'block';
        btn.style.fontWeight = '400';
        btn.style.opacity = '0.92';
        btn.style.transition = 'background 0.2s, opacity 0.2s, color 0.2s';
        btn.onmouseenter = () => {
            btn.style.background = accent;
            btn.style.color = '#fff';
            btn.style.opacity = '1';
        };
        btn.onmouseleave = () => {
            btn.style.background = accent + '22';
            btn.style.color = accent;
            btn.style.opacity = '0.92';
        };

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const a = document.createElement('a');
            a.href = coverUrl;
            a.download = defaultFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

        // Place directly after the Share/Embed li
        const newLi = document.createElement('li');
        newLi.style.listStyle = 'none';
        newLi.appendChild(btn);
        shareLi.insertAdjacentElement('afterend', newLi);
    });
})();