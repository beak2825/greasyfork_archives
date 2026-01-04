// ==UserScript==
// @name         VOD TVP Downloader
// @namespace    http://szewczyk.dev
// @version      1.0
// @description  Pobierz wideo z VOD TVP w wybranej jakości
// @author       szewdev
// @license      MIT
// @match        https://vod.tvp.pl/*
// @source       https://github.com/szewdev/vod-tvp-downloader
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482124/VOD%20TVP%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/482124/VOD%20TVP%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const qualityOptions = {
        "11": "2160p",
        "9": "1080p",
        "7": "720p",
        "6": "544p",
        "5": "450p"
    };

    const defaultQuality = "5";

    // Użytkownik musi ręcznie uruchomić skrypt
    function startDownload() {
        let quality = prompt("Podaj jakość wideo:\n11 => 2160p\n9 => 1080p\n7 => 720p\n6 => 544p\n5 => 450p", defaultQuality);
        if (!qualityOptions[quality]) {
            alert("Nieprawidłowa jakość wideo!");
            return;
        }

        const url = window.location.href;
        const id = url.split(',').pop();
        const urlApi = `https://vod.tvp.pl/api/products/vods/${id}?lang=pl&platform=BROWSER`;

        let filename;

        fetch(urlApi)
            .then(response => response.json())
            .then(data => {
                const externalUid = data.externalUid;
                let title = data.season?.serial?.title || data.title;
                filename = title + ".mp4";
                if (data.season) {
                    const number = data.number;
                    filename = `${title} - odc. ${number}.mp4`;
                }

                const urlVideo = `https://vod.tvp.pl/sess/TVPlayer2/api.php?id=${externalUid}&@method=getTvpConfig&@callback=callback`;
                return fetch(urlVideo);
            })
            .then(response => response.text())
            .then(data => {
                const videoUrl = data.match(new RegExp(`"https:.*-${quality}\\.mp4"`))[0].replace(/["\\]/g, '');
                GM_download(videoUrl, filename);
            })
            .catch(error => {
                console.error("Wystąpił błąd: ", error);
                alert("Błąd: Nie udało się pobrać pliku.");
            });
    }

    // Uruchom dialog pobierania po naciśnięciu klawisza F8
    document.addEventListener('keydown', function(event) {
        if (event.key === "F8") {
            startDownload();
        }
    });

})();
