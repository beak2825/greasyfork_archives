// ==UserScript==
// @name         MusicBrainz: Apple Music Importer
// @name:zh-CN   MusicBrainz: Apple Music 导入器
// @namespace    https://github.com/MoeclubM
// @version      1.0.0
// @description  Imports release information from Apple Music to MusicBrainz, provides cover download and smart page navigation.
// @description:zh-CN 从 Apple Music 导入发行信息到 MusicBrainz，并提供封面下载及智能页面跳转功能。
// @author       MoeCaa
// @license      MIT
// @homepageURL  https://github.com/MoeclubM/webscripts/tree/main/musicbrainz
// @supportURL   https://github.com/MoeclubM/webscripts/issues
// @match        *://music.apple.com/*/album/*
// @match        *://music.apple.com/*/song/*
// @connect      musicbrainz.org
// @connect      *.mzstatic.com
// @grant        GM_addStyle
// @grant        GM_xmlHttpRequest
// @grant        GM_info
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539534/MusicBrainz%3A%20Apple%20Music%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/539534/MusicBrainz%3A%20Apple%20Music%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const MB_DOMAIN = 'musicbrainz.org';
    let lastProcessedUrl = '';

    // --- Styles ---
    GM_addStyle(`
        .mb-button-wrapper {
            position: fixed; top: 80px; right: 15px; z-index: 9999;
            display: flex; flex-direction: column; gap: 5px;
        }
        .mb-button {
            color: white; padding: 10px 15px;
            border-radius: 5px; border: none; font-size: 14px; font-weight: bold;
            cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s;
            text-decoration: none; text-align: center;
            display: block;
        }
        #mb-importer-btn { background-color: #BA54A2; }
        #mb-importer-btn:hover { background-color: #8A3373; }
        #mb-artwork-downloader-btn { background-color: #555555; }
        #mb-artwork-downloader-btn:hover { background-color: #333333; }
        #mb-redirect-to-album-btn { background-color: #28a745; }
        #mb-redirect-to-album-btn:hover { background-color: #218838; }
    `);

    // --- Helper Functions ---

    function parseISODuration(duration) {
        if (!duration) return 0;
        const matches = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
        const minutes = matches[1] ? parseInt(matches[1], 10) : 0;
        const seconds = matches[2] ? parseInt(matches[2], 10) : 0;
        return (minutes * 60 + seconds) * 1000;
    }

    function addField(form, name, value) {
        if (value === undefined || value === null || value === '') return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    // --- Main Seeding Function ---

    function importToMusicBrainz() {
        console.log('Importing to MusicBrainz...');

        const schemaScript = document.querySelector('script[id="schema:music-album"]');
        if (!schemaScript) {
            alert('Error: Could not find album data on the page! Please make sure you are on an album page.');
            return;
        }

        const data = JSON.parse(schemaScript.textContent);
        const release = {};

        const originalTitle = data.name;
        const titleLower = originalTitle.toLowerCase();

        // 1. Determine Release Group Type (Primary and Secondary)
        release.primaryType = 'album';
        release.secondaryTypes = [];

        if (/ - ep$/i.test(originalTitle)) release.primaryType = 'ep';
        else if (/ - single$/i.test(originalTitle)) release.primaryType = 'single';

        if (titleLower.includes('original soundtrack') || titleLower.includes('soundtrack')) release.secondaryTypes.push('soundtrack');
        if (/\blive\b/i.test(titleLower)) release.secondaryTypes.push('live');
        if (/\bremix\b/i.test(titleLower)) release.secondaryTypes.push('remix');
        if (/\bdemo\b/i.test(titleLower)) release.secondaryTypes.push('demo');
        if (/\bmixtape\b/i.test(titleLower)) release.secondaryTypes.push('mixtape/street');

        // 2. Prepare Release Data
        release.title = originalTitle
            .replace(/ - (EP|Single)$/i, '')
            .replace(/\s*\((Original Soundtrack|Soundtrack|Live|Remix|Demo|Mixtape)\)/ig, '')
            .trim();

        release.artist = data.byArtist[0].name;

        const releaseDate = new Date(data.datePublished);
        release.year = releaseDate.getUTCFullYear();
        release.month = String(releaseDate.getUTCMonth() + 1).padStart(2, '0');
        release.day = String(releaseDate.getUTCDate()).padStart(2, '0');

        const countryMatch = window.location.pathname.match(/^\/([a-z]{2})\//);
        release.country = countryMatch ? countryMatch[1].toUpperCase() : 'XW';

        const footerDescElement = document.querySelector('p[data-testid="tracklist-footer-description"]');
        if (footerDescElement) {
            const copyrightLineMatch = footerDescElement.textContent.match(/(℗\s*\d{4}\s*.*)/);
            if (copyrightLineMatch) {
                release.annotation = copyrightLineMatch[0].trim();
                const labelTextMatch = copyrightLineMatch[0].match(/℗\s*\d{4}\s*(.*)/);
                if (labelTextMatch) release.label = labelTextMatch[1].trim();
            }
        }

        const artworkUrlForBarcode = document.querySelector('meta[property="og:image"]')?.content;
        if (artworkUrlForBarcode) {
            const barcodeMatch = artworkUrlForBarcode.match(/(\d{12,13})/);
            if (barcodeMatch) release.barcode = barcodeMatch[1];
        }

        // 3. Build and Submit Form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `https://${MB_DOMAIN}/release/add`;
        form.target = '_blank';
        form.acceptCharset = 'UTF-8';

        addField(form, 'name', release.title);
        addField(form, 'artist_credit.names.0.name', release.artist);
        addField(form, 'status', 'official');
        addField(form, 'packaging', 'None');
        if (release.barcode) addField(form, 'barcode', release.barcode);
        if (release.annotation) addField(form, 'annotation', release.annotation);
        addField(form, 'comment', 'Digital Media');

        addField(form, 'events.0.date.year', release.year);
        addField(form, 'events.0.date.month', release.month);
        addField(form, 'events.0.date.day', release.day);
        addField(form, 'events.0.country', release.country);

        addField(form, 'type', release.primaryType);
        release.secondaryTypes.forEach(secType => {
            addField(form, 'type', secType);
        });

        if (release.label) addField(form, 'labels.0.name', release.label);

        const trackRows = document.querySelectorAll('div[data-testid="track-list-item"]');
        data.tracks.forEach((trackData, index) => {
            const prefix = `mediums.0.track.${index}`;
            addField(form, `${prefix}.name`, trackData.name);
            addField(form, `${prefix}.number`, index + 1);
            addField(form, `${prefix}.length`, parseISODuration(trackData.duration));

            const trackRow = trackRows[index];
            if (trackRow) {
                const byLine = trackRow.querySelector('.songs-list-row__by-line');
                const artists = byLine ? Array.from(byLine.querySelectorAll('a')).map(a => a.textContent.trim()) : [release.artist];
                artists.forEach((artist, artIndex) => {
                     addField(form, `${prefix}.artist_credit.names.${artIndex}.name`, artist);
                     if (artIndex < artists.length - 1) {
                         addField(form, `${prefix}.artist_credit.names.${artIndex}.join_phrase`, ', ');
                     }
                });
            }
        });

        addField(form, 'mediums.0.format', 'Digital Media');

        addField(form, 'urls.0.url', window.location.href);

        const allTypes = [release.primaryType.toUpperCase(), ...release.secondaryTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1))];
        const editNote = `Types automatically set by script: ${allTypes.join(', ')}\n\nImported from Apple Music: ${window.location.href}`;
        addField(form, 'edit_note', editNote);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    // --- UI Setup Functions ---

    function cleanupInterface() {
        const wrapper = document.getElementById('mb-button-wrapper');
        if (wrapper) wrapper.remove();
    }

    function setupAlbumInterface(albumSchema) {
        cleanupInterface();

        const wrapper = document.createElement('div');
        wrapper.id = 'mb-button-wrapper';
        wrapper.className = 'mb-button-wrapper';

        const artworkSrcset = document.querySelector('div[data-testid="artwork-component"] picture source[type="image/jpeg"]')?.srcset;
        if (artworkSrcset) {
            const bestArtUrl = artworkSrcset.split(',').pop().trim().split(' ')[0];
            const highResUrl = bestArtUrl.replace(/\/\d+x\d+bb(?:-60)?\.jpg$/, '/9999x9999bb.jpg');

            const openArtLink = document.createElement('a');
            openArtLink.id = 'mb-artwork-downloader-btn';
            openArtLink.className = 'mb-button';
            openArtLink.href = highResUrl;
            openArtLink.target = '_blank';
            openArtLink.innerHTML = 'ART';
            openArtLink.title = 'Open highest resolution artwork in new tab';
            wrapper.appendChild(openArtLink);
        }

        const importBtn = document.createElement('button');
        importBtn.id = 'mb-importer-btn';
        importBtn.className = 'mb-button';
        importBtn.innerHTML = 'MB';
        importBtn.title = 'Import this release to MusicBrainz';
        importBtn.addEventListener('click', importToMusicBrainz, false);
        wrapper.appendChild(importBtn);

        document.body.appendChild(wrapper);
    }

    function setupSongInterface(songSchema) {
        cleanupInterface();

        const data = JSON.parse(songSchema.textContent);
        const albumUrl = data.inAlbum?.url;

        if (albumUrl) {
            const wrapper = document.createElement('div');
            wrapper.id = 'mb-button-wrapper';
            wrapper.className = 'mb-button-wrapper';

            const redirectBtn = document.createElement('a');
            redirectBtn.id = 'mb-redirect-to-album-btn';
            redirectBtn.className = 'mb-button';
            redirectBtn.innerHTML = 'Go to Album Page';
            redirectBtn.title = 'This is a song page. Click to navigate to the full album page for import.';
            redirectBtn.href = albumUrl;

            wrapper.appendChild(redirectBtn);
            document.body.appendChild(wrapper);
        }
    }

    // --- Main Execution Logic ---

    function mainLoop() {
        const currentUrl = window.location.href;
        if (currentUrl === lastProcessedUrl) {
            return;
        }

        cleanupInterface();
        lastProcessedUrl = currentUrl;

        setTimeout(() => {
            const albumSchema = document.querySelector('script[id="schema:music-album"]');
            const songSchema = document.querySelector('script[id="schema:song"]');

            if (albumSchema) {
                setupAlbumInterface(albumSchema);
            } else if (songSchema) {
                setupSongInterface(songSchema);
            }
        }, 500);
    }

    setInterval(mainLoop, 500);

})();