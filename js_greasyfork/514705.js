// ==UserScript==
// @name         Spotify Enhancer (Track Downloader) - Cross-Version
// @description  Integrate a download button for tracks on Spotify Web to download audio at 320kbps
// @version      1.4
// @match        https://open.spotify.com/*  // Adicionando a diretiva @match
// @namespace https://greasyfork.org/users/1388220
// @downloadURL https://update.greasyfork.org/scripts/514705/Spotify%20Enhancer%20%28Track%20Downloader%29%20-%20Cross-Version.user.js
// @updateURL https://update.greasyfork.org/scripts/514705/Spotify%20Enhancer%20%28Track%20Downloader%29%20-%20Cross-Version.meta.js
// ==/UserScript==

const API_HEADERS = {
    'Host': 'api.spotifydown.com',
    'Referer': 'https://spotifydown.com/',
    'Origin': 'https://spotifydown.com',
};

const BACKOFF_CONFIG = { initialDelay: 1000, maxDelay: 5000, factor: 2 };

const style = document.createElement('style');
style.id = 'spotify-enhancer-320-styles';
document.body.appendChild(style);

function applyStyles() {
    const otherDownloader = document.querySelector('.btn');
    style.innerHTML = `
    [role='grid'] { margin-left: ${otherDownloader ? '90px' : '50px'}; }
    [data-testid='tracklist-row'] { position: relative; }
    .btn-320 { /* button styles */ width: 40px; /* etc */ }`;
}

function addDownloadButton(element, trackInfo, spotifyId) {
    if (element.querySelector('.btn-320')) return;
    
    const button = document.createElement('button');
    button.className = 'btn-320';
    button.onclick = function() { initiateDownload(spotifyId, trackInfo, this); };
    element.appendChild(button);
}

function initiateDownload(spotifyId, trackInfo, button) {
    button.classList.add('loading');
    let delay = BACKOFF_CONFIG.initialDelay;

    const downloadAttempt = function() {
        downloadTrack(spotifyId).then(response => {
            const link = document.createElement('a');
            link.href = response.link;
            link.download = `${trackInfo.title} - ${trackInfo.artist}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            button.classList.remove('loading');
        }).catch(() => {
            setTimeout(() => {
                delay = Math.min(delay * BACKOFF_CONFIG.factor, BACKOFF_CONFIG.maxDelay);
                downloadAttempt(); // Retry download attempt
            }, delay);
        });
    };
    
    downloadAttempt(); // Start the first download attempt
}

function downloadTrack(spotifyId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.spotifydown.com/download/${spotifyId}`,
            headers: API_HEADERS,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        resolve(result);
                    } else {
                        reject(new Error('Download failed'));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse response'));
                }
            },
            onerror: reject
        });
    });
}

function extractTrackInfo(trackElement) {
    const title = trackElement.querySelector('[data-encore-id="text"][dir="auto"]').textContent.trim();
    const artist = Array.from(trackElement.querySelectorAll('a[href^="/artist"]')).map(a => a.textContent.trim()).join(', ');
    return { title, artist };
}

function attachButtons() {
    const tracks = document.querySelectorAll('[data-testid="tracklist-row"]');
    tracks.forEach(track => {
        const spotifyId = track.querySelector('[href^="/track"]').href.split('/').pop();
        const trackInfo = extractTrackInfo(track);
        addDownloadButton(track, trackInfo, spotifyId);
    });
}

new MutationObserver(function() {
    applyStyles();
    attachButtons();
}).observe(document.body, { childList: true, subtree: true });
