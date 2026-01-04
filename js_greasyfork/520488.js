// ==UserScript==
// @name         Lyrics into Song Dowloader
// @namespace    LyricsintoSongDownloader
// @version      1.0
// @description  Let's you download your AI songs without a paid subscription!
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        *://lyricsintosong.com/play_music/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lyricsintosong.com
// @grant        GM_download
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/520488/Lyrics%20into%20Song%20Dowloader.user.js
// @updateURL https://update.greasyfork.org/scripts/520488/Lyrics%20into%20Song%20Dowloader.meta.js
// ==/UserScript==

console.log("LyricsintoSongDownloader");


// Function to create the download button
function createDownloadButton(audio) {
    const downloadButton = document.createElement('a');
    downloadButton.textContent = 'Download';
    downloadButton.style.marginTop = '10px';
    downloadButton.style.display = 'inline-block';
    downloadButton.style.padding = '5px 10px';
    downloadButton.style.backgroundColor = '#4CAF50';
    downloadButton.style.color = 'white';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.textDecoration = 'none';
    downloadButton.style.borderRadius = '5px';
    downloadButton.textContent = 'LyricsintoSongDownloader';
    downloadButton.style.marginTop = '10px';

    // Add event listener to download the audio file
    downloadButton.addEventListener('click', () => {
        const audioSource = audio.src || audio.querySelector('source')?.src;
        if (audioSource) {
            GM_download(audioSource, audioSource.split('/').pop());
        }
    });

    // Append the button to the parent of the audio element
    audio.parentElement.appendChild(downloadButton);
}

// Find all audio elements on the page
const audioElements = document.querySelectorAll('audio');

// Create download buttons for each audio element
audioElements.forEach(audio => {
    createDownloadButton(audio);
});