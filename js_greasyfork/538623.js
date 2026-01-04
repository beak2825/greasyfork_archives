// ==UserScript==
// @name         Spotify Web Enhancer (Full Suite)
// @namespace    Eliminater74
// @version      1.2.0
// @description  All-in-one enhancement: UI tweaks, draggable menu, playlist tools, device detection, lyrics, ratings & more!
// @author       Eliminater74
// @license      MIT
// @match        https://open.spotify.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/538623/Spotify%20Web%20Enhancer%20%28Full%20Suite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538623/Spotify%20Web%20Enhancer%20%28Full%20Suite%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const save = (k, v) => GM_setValue(k, v);
    const load = (k, d) => GM_getValue(k, d);

    const settings = {
        compactMode: load('compactMode', false),
        autoResume: load('autoResume', true),
        lyricsToggle: load('lyricsToggle', true),
        wideMode: load('wideMode', false),
        ratings: JSON.parse(load('ratings', '{}')),
        iconX: load('iconX', '20px'),
        iconY: load('iconY', '20px')
    };

    const css = `
#swe-gear {
    position:fixed;
    width:42px;height:42px;
    border-radius:50%;
    background:#1db954;color:#fff;
    display:flex;align-items:center;justify-content:center;
    font-size:22px;font-weight:bold;
    box-shadow:0 0 10px #000;cursor:grab;
    z-index:99999;
    left:${settings.iconX};top:${settings.iconY};
    user-select:none;
}
#swe-menu {
    position:fixed;
    background:#181818;color:white;
    border-radius:10px;
    padding:12px;font-size:13px;
    z-index:99998;top:70px;left:20px;
    display:none;box-shadow:0 0 10px black;
    max-width:250px
}
#swe-menu label {display:block;margin:5px 0;}
#swe-lyrics {
    position:fixed;bottom:10px;right:10px;
    width:400px;height:300px;
    resize:both;overflow:auto;
    z-index:99997;
    border:2px solid #555;
    display:none;
}
.swe-rating-bar {
    display:inline-block;margin-left:5px;
}
.swe-star {cursor:pointer;color:gray;font-size:16px;}
.swe-star.active {color:gold;}
body.swe-wide .Root__main-view-wrapper {
    max-width: 100% !important;
}`;

    GM_addStyle(css);

    const gear = document.createElement('div');
    gear.id = 'swe-gear';
    gear.innerText = '⚙️';
    document.body.appendChild(gear);

    const menu = document.createElement('div');
    menu.id = 'swe-menu';
    menu.innerHTML = `
    <b>Spotify Enhancer</b><br>
    <label><input type="checkbox" id="swe-compact"> Compact Mode</label>
    <label><input type="checkbox" id="swe-resume"> Auto Resume</label>
    <label><input type="checkbox" id="swe-lyrics"> Lyrics Panel</label>
    <label><input type="checkbox" id="swe-wide"> Wide Mode</label>
    <button id="swe-export">Export Playlist</button>
    <button id="swe-dupes">Remove Duplicates</button>
    <div id="swe-device">Device: Unknown</div>
    `;
    document.body.appendChild(menu);

    const lyrics = document.createElement('iframe');
    lyrics.id = 'swe-lyrics';
    document.body.appendChild(lyrics);

    gear.addEventListener('click', () => menu.style.display = menu.style.display === 'none' ? 'block' : 'none');

    // Draggable gear icon
    gear.onmousedown = function (e) {
        gear.style.cursor = 'grabbing';
        let shiftX = e.clientX - gear.getBoundingClientRect().left;
        let shiftY = e.clientY - gear.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            gear.style.left = pageX - shiftX + 'px';
            gear.style.top = pageY - shiftY + 'px';
            save('iconX', gear.style.left);
            save('iconY', gear.style.top);
        }
        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            gear.onmouseup = null;
            gear.style.cursor = 'grab';
        };
    };

    // Sync checkboxes
    document.getElementById('swe-compact').checked = settings.compactMode;
    document.getElementById('swe-resume').checked = settings.autoResume;
    document.getElementById('swe-lyrics').checked = settings.lyricsToggle;
    document.getElementById('swe-wide').checked = settings.wideMode;

    document.getElementById('swe-compact').onchange = () => { save('compactMode', event.target.checked); location.reload(); };
    document.getElementById('swe-resume').onchange = () => save('autoResume', event.target.checked);
    document.getElementById('swe-lyrics').onchange = () => {
        save('lyricsToggle', event.target.checked);
        lyrics.style.display = event.target.checked ? 'block' : 'none';
    };
    document.getElementById('swe-wide').onchange = () => {
        save('wideMode', event.target.checked);
        document.body.classList.toggle('swe-wide', event.target.checked);
    };

    // Wide mode init
    if (settings.wideMode) document.body.classList.add('swe-wide');

    // Lyrics toggle
    if (settings.lyricsToggle) lyrics.style.display = 'block';

    // Lyrics iframe loader
    function loadLyrics() {
        const track = document.querySelector('[data-testid="nowplaying-track-link"]')?.textContent;
        if (track) lyrics.src = `https://www.musixmatch.com/search/${encodeURIComponent(track)}`;
    }
    setInterval(loadLyrics, 15000);

    // Auto-resume logic
    if (settings.autoResume && location.pathname === '/') {
        const lastUri = load('lastUri', '');
        if (lastUri) setTimeout(() => location.href = lastUri, 1500);
    }
    setInterval(() => {
        const uri = window.location.pathname.includes('/track/') ? location.href : '';
        if (uri) save('lastUri', uri);
    }, 5000);

    // Export Playlist
    document.getElementById('swe-export').onclick = () => {
        const rows = [...document.querySelectorAll('[data-testid="tracklist-row"]')];
        const lines = rows.map(row => {
            const title = row.querySelector('div span a')?.textContent || 'Unknown';
            const artist = row.querySelector('span[class*="artists-albums"]')?.textContent || 'Unknown';
            return `${title} - ${artist}`;
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'playlist.txt';
        a.click();
    };

    // Remove Duplicates
    document.getElementById('swe-dupes').onclick = () => {
        const map = new Map();
        document.querySelectorAll('[data-testid="tracklist-row"]').forEach(row => {
            const title = row.querySelector('div span a')?.textContent;
            const artist = row.querySelector('span[class*="artists-albums"]')?.textContent;
            const key = `${title}-${artist}`;
            if (map.has(key)) row.style.display = 'none';
            else map.set(key, true);
        });
        alert('Duplicates removed.');
    };

    // Keyboard controls
    document.addEventListener('keydown', e => {
        if (e.target.tagName.match(/INPUT|TEXTAREA/)) return;
        const play = document.querySelector('[data-testid="control-button-playpause"]');
        const next = document.querySelector('[data-testid="control-button-skip-forward"]');
        const prev = document.querySelector('[data-testid="control-button-skip-back"]');
        const heart = document.querySelector('[data-testid="control-button-heart"]');
        switch (e.key.toLowerCase()) {
            case ' ': play?.click(); e.preventDefault(); break;
            case 'arrowright': next?.click(); break;
            case 'arrowleft': prev?.click(); break;
            case 'l': heart?.click(); break;
        }
    });

    // Device Detector
    function updateDeviceName() {
        const txt = document.querySelector('[data-testid="device-picker"]')?.innerText;
        if (txt) document.getElementById('swe-device').innerText = 'Device: ' + txt.split('\n')[0];
    }
    setInterval(updateDeviceName, 10000);
})();
