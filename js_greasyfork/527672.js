// ==UserScript==
// @name         SunoAI Downloader
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.ai
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description:pl  Automatycznie przekierowuje linki suno.com/song na wersję embed i dodaje przycisk do pobrania MP3
// @description:en  Automatically redirects suno.com/song/id links to embed version and adds MP3 download button
// @author       Anonymousik
// @match        https://app.suno.ai/
// @match        https://suno.com/*
// @match        *://suno.com/song/*
// @match        *://suno.com/embed/*
// @grant        none
// @license      CC-BY 4.0; https://creativecommons.org/licenses/by/4.0/
// @description Automatycznie przekierowuje linki suno.com/song na wersję embed
// @downloadURL https://update.greasyfork.org/scripts/527672/SunoAI%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527672/SunoAI%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja przekierowania dla linków /song/
    function handleSongRedirect() {
        if (window.location.href.includes('/song/')) {
            let newUrl = window.location.href.replace('/song/', '/embed/');
            window.location.href = newUrl;
            return true;
        }
        return false;
    }

    // Funkcja do pobierania MP3
    async function downloadMP3(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = filename || 'audio.mp3';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Błąd podczas pobierania:', error);
        }
    }

    // Funkcja dodająca przycisk pobierania
    function addDownloadButtons() {
        const selector = 'body > div.css-fhtuey > div.css-bhm5u7 > div > div.css-l9hfgy > div.css-18kfqph > div.chakra-stack.css-18y9vo3';
        const buttonsContainer = document.querySelector(selector);

        if (buttonsContainer) {
            const audioElement = document.querySelector('audio:not([src*="silence.mp3"])');

            if (audioElement && audioElement.src) {
                const audioLink = audioElement.src;
                const songId = window.location.pathname.split('/').pop();

                // Przycisk otwierania w nowej karcie
                const existingOpenButton = buttonsContainer.querySelector('.open-button');
                if (!existingOpenButton) {
                    const openButton = document.createElement('button');
                    openButton.setAttribute('data-theme', 'dark');
                    openButton.setAttribute('type', 'button');
                    openButton.setAttribute('class', 'chakra-button css-oj2z91 open-button');
                    openButton.setAttribute('aria-label', 'Open in new tab');
                    openButton.setAttribute('data-audio-link', audioLink);
                    openButton.innerHTML = `
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                        </svg>`;
                    openButton.addEventListener('click', function() {
                        window.open(audioLink, '_blank');
                    });
                    buttonsContainer.appendChild(openButton);
                }

                // Przycisk bezpośredniego pobierania
                const existingDownloadButton = buttonsContainer.querySelector('.download-button');
                if (!existingDownloadButton) {
                    const downloadButton = document.createElement('button');
                    downloadButton.setAttribute('data-theme', 'dark');
                    downloadButton.setAttribute('type', 'button');
                    downloadButton.setAttribute('class', 'chakra-button css-oj2z91 download-button');
                    downloadButton.setAttribute('aria-label', 'Download');
                    downloadButton.setAttribute('data-audio-link', audioLink);
                    downloadButton.innerHTML = `
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                        </svg>`;
                    downloadButton.addEventListener('click', function() {
                        const audioLink = this.getAttribute('data-audio-link');
                        downloadMP3(audioLink, `suno_${songId}.mp3`);
                    });
                    buttonsContainer.appendChild(downloadButton);
                }
            } else {
                // Usuń przyciski jeśli nie ma audio
                const existingButtons = buttonsContainer.querySelectorAll('.download-button, .open-button');
                existingButtons.forEach(button => button.remove());
            }
        }
    }

    // Główna logika skryptu
    if (!handleSongRedirect()) {
        // Tylko dla stron embed inicjalizujemy obserwator i przyciski
        if (window.location.href.includes('/embed/')) {
            const observer = new MutationObserver(() => {
                addDownloadButtons();
            });

            observer.observe(document.body, { childList: true, subtree: true });
            addDownloadButtons(); 
            // Pierwsze wywołanie
        }
    }
})();