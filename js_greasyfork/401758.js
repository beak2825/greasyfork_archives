// ==UserScript==
// @name         Video downloader for VideoAZ, VideoAZ video yukleyici
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Video.AZ-da olan video və filmləri tək kliklə yüklə!
// @author       #EMBER
// @match        http://video.az/*
// @match        https://video.az/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401758/Video%20downloader%20for%20VideoAZ%2C%20VideoAZ%20video%20yukleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/401758/Video%20downloader%20for%20VideoAZ%2C%20VideoAZ%20video%20yukleyici.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Default text and error messages
    let translations = {
        "en": { download: "Download", fileNotFound: "Video file not found. Reload the page please!" },
        "ru": { download: "Скачать", fileNotFound: "Видео файл не найден. Обновите страницу, пожалуйста!" },
        "az": { download: "Yüklə", fileNotFound: "Video faylı tapılmadı. Zəhmət olmazsa səhifəni yeniləyin!" }
    };

    // Function to create the download button
    function createDownloadButton() {
        // Detect language and set translations
        let lang = document.documentElement.lang;
        let tx = translations[lang] ? translations[lang].download : translations["en"].download;
        let err = translations[lang] ? translations[lang].fileNotFound : translations["en"].fileNotFound;

        // Check if JW Player is available
        if (typeof jwplayer === 'function') {
            // Function to check if JW Player is ready
            function isJWPlayerReady() {
                return jwplayer().getPlaylistItem && jwplayer().getPlaylistItem();
            }

            // Poll for JW Player readiness
            let pollInterval = 500; // milliseconds
            let maxAttempts = 20;
            let attempts = 0;

            let pollTimer = setInterval(function() {
                if (isJWPlayerReady()) {
                    clearInterval(pollTimer);

                    // JW Player is ready, proceed to create the download button
                    let currentFile = jwplayer().getPlaylistItem();
                    let quality = currentFile.allSources?.[0]?.label ?? 'Default Quality';
                    let link = currentFile.file;
                    let title = currentFile.title;

                    // Fetch video file size
                    fetch(link)
                        .then(response => response.headers.get('content-length'))
                        .then(size => {
                            let fileSize = parseInt(size);
                            let buttonText = fileSize ? tx + ' (' + formatSize(fileSize) + ')' : tx;
                            // Find the parent div of ".s-info" and adjust classes before appending the button
                        let parentDiv = $(".s-info").closest("div.col-md-6");
                        parentDiv.removeClass("col-md-6").addClass("col-md-8");
                        parentDiv.next("div.col-md-6").removeClass("col-md-6").addClass("col-md-4");

                        // Create download button with video size
                        let downloadButton = $('<div class="s-info"><a title="'+ buttonText + ' ['+ quality +']' + ' - ' + title + '" target="_blank" href="'+link+'" class="btn btn-info download-button">'+ buttonText +'</a></div>');
                        parentDiv.prepend(downloadButton);
                        })
                        .catch(error => {
                            console.error('Error fetching video size:', error);
                        });
                } else {
                    attempts++;
                    if (attempts >= maxAttempts)
                        clearInterval(pollTimer);
                }
            }, pollInterval);
        } else {
            // Show error message if JW Player is not available
            alert(err);
        }
    }

    // Execute the script after a delay to ensure that the page has fully loaded
    setTimeout(createDownloadButton, 1.5E3); // Adjusting the delay as 1.5 seconds

    // Keydown event listener to detect Ctrl + Shift + Z combination
    $(document).on('keydown', function(e){
        // Detect language and set translations
        let lang = document.documentElement.lang;
        let tx = translations[lang] ? translations[lang].download : translations["en"].download;
        let err = translations[lang] ? translations[lang].fileNotFound : translations["en"].fileNotFound;

        // Check if Ctrl + Shift + Z is pressed (keyCode for 'Z' is 90)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 90) {
            // Check if JW Player is ready
            if (typeof jwplayer === 'function' && jwplayer().getPlaylistItem) {
                // Get video URL from JW Player
                let currentFile = jwplayer().getPlaylistItem();
                if (currentFile && currentFile.file) {
                    let link = currentFile.file;
                    // Open video URL in a new tab
                    window.open(link);
                } else {
                    // Show error message if video file is not found
                    alert(err);
                }
            } else {
                // Show error message if JW Player is not ready
                alert(err);
            }
        }
    });

    // Function to format file size
    function formatSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    //The script by #EMBER
})();
