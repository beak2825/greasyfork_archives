// ==UserScript==
// @name         Discogs Cuesheet Generator
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Generate and download cuesheets from Discogs release pages
// @match        https://www.discogs.com/release/*
// @license      You can modify as long as you credit wurzel80
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522610/Discogs%20Cuesheet%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/522610/Discogs%20Cuesheet%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Discogs Cuesheet Generator script is running");

    let button = document.createElement('button');
    button.textContent = 'Generate Cuesheet';
    button.style.position = 'fixed';
    button.style.top = '260px';
    button.style.left = '30px';
  	button.style.zIndex = '9999'; 
  	
    document.body.appendChild(button);

    function generateCuesheet() {
        console.log("generateCuesheet function called");
        
        try {
            let artistElement = document.querySelector('h1 a[href^="/artist/"]');
            let artist = artistElement ? artistElement.textContent.trim() : "ARTIST";

            let albumElement = document.querySelector('h1');
            let album = albumElement ? albumElement.textContent.split('–').pop().trim() : "ALBUM";

            let tracks = document.querySelectorAll('tr[data-track-position]');
            
            let cuesheet = `PERFORMER "${artist}"\nTITLE "${album}"\nFILE "${artist} - ${album}.mp3" MP3\n`;

            let totalSeconds = 0;

            tracks.forEach((track, index) => {
                let trackNumber = track.getAttribute('data-track-position') || String(index + 1).padStart(2, '0');
                
                let trackTitleElement = track.querySelector('td.trackTitle span, span[class*="trackTitle"]');
                let trackTitle = trackTitleElement ? trackTitleElement.textContent.trim() : "TRACKTITLE";

                let durationElement = track.querySelector('td.duration_2t4qr span, span[class*="duration"]');
                let duration = durationElement ? durationElement.textContent.trim() : "00:00";

                let startTimeFormatted = formatTime(totalSeconds);

                cuesheet += `\nTRACK ${trackNumber} AUDIO\n  TITLE "${trackTitle}"\n  PERFORMER "${artist}"\n  INDEX 01 ${startTimeFormatted}\n`;

                let [minutes, seconds] = duration.split(':').map(Number);
                totalSeconds += (minutes * 60 + seconds) || 0;
            });

            // Create a Blob with the cuesheet content
            const blob = new Blob([cuesheet], { type: 'text/plain' });

            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${artist} - ${album}.cue`;

            // Trigger the download
            link.click();

            // Clean up
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error("Error generating cuesheet:", error.message);
            alert("Error generating cuesheet: " + error.message);
        }
    }

    function formatTime(totalSeconds) {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let frames = 0; // We don't have frame information, so we'll use 0
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
    }

    button.addEventListener('click', generateCuesheet);
})();
