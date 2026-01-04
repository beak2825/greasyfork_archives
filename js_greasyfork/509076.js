// ==UserScript==
// @name         YouTube Simple Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Download videos and audio from YouTube using simple buttons in the extension menu
// @author       Magneto1
// @license      MIT
// @match        https://*.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/509076/YouTube%20Simple%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/509076/YouTube%20Simple%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per estrarre l'ID del video da YouTube
    function extractYT(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = String(url).match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }

    // Funzione per il download del video in formato MP4
    function downloadVideo() {
        const videoId = extractYT(window.location.href);
        if (videoId) {
            const downloadUrl = `https://tubemp3.to/en/download/${videoId}/mp4`; // Modifica l'URL in base al servizio di download
            GM_openInTab(downloadUrl, { active: true });
        } else {
            alert("Nessun video trovato.");
        }
    }

    // Funzione per il download dell'audio in formato MP3
    function downloadAudio() {
        const videoId = extractYT(window.location.href);
        if (videoId) {
            const downloadUrl = `https://tubemp3.to/en/download/${videoId}/mp3`; // Modifica l'URL in base al servizio di download
            GM_openInTab(downloadUrl, { active: true });
        } else {
            alert("Nessun video trovato.");
        }
    }

    // Aggiungi i comandi al menu dell'estensione
    GM_registerMenuCommand("Download YouTube Video (MP4)", downloadVideo);
    GM_registerMenuCommand("Download YouTube Audio (MP3)", downloadAudio);
})();
