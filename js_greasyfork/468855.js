// ==UserScript==
// @name         hdrezka Video and Subtitle Downloader WIP
// @version      1.0
// @description  Downloads videos and subtitles on specific webpages
// @match        https://rezka.ag/series/documentary/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace https://greasyfork.org/users/1044439
// @downloadURL https://update.greasyfork.org/scripts/468855/hdrezka%20Video%20and%20Subtitle%20Downloader%20WIP.user.js
// @updateURL https://update.greasyfork.org/scripts/468855/hdrezka%20Video%20and%20Subtitle%20Downloader%20WIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var videoUrl = '';
    var subtitlesUrl = '';

    // Function to download the video file
    function downloadVideo() {
        if (videoUrl) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: videoUrl,
                responseType: 'blob',
                onload: function(response) {
                    var blob = response.response;
                    var filename = getFileNameFromUrl(videoUrl);
                    downloadBlob(blob, filename);
                }
            });
        }
    }

    // Function to download the subtitles file
    function downloadSubtitles() {
        if (subtitlesUrl) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: subtitlesUrl,
                onload: function(response) {
                    var subtitlesText = response.responseText;
                    var filename = getFileNameFromUrl(subtitlesUrl);
                    downloadText(subtitlesText, filename);
                }
            });
        }
    }

    // Function to download a blob as a file
    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);

        // Create a download link and automatically click it to download the file
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Function to download a text as a file
    function downloadText(text, filename) {
        var blob = new Blob([text], { type: 'text/plain' });
        downloadBlob(blob, filename);
    }

    // Function to get the filename from a URL
    function getFileNameFromUrl(url) {
        var parts = url.split('/');
        return parts[parts.length - 1].split('?')[0];
    }

    // Function to reset the script
    function resetScript() {
        videoUrl = '';
        subtitlesUrl = '';
        initializeButtons();
    }

    // Function to initialize the download buttons
    var subtitlesButton = document.createElement('button');
    var videoButtonLink = document.createElement('a');
    function initializeButtons() {
        var videoButton = document.createElement('button');
        videoButton.textContent = 'Download Video';
        videoButton.id = 'rezkaDownloadVideoButton'
        // videoButton.addEventListener('click', function() {
        //     downloadVideo();
        // });
        videoButtonLink.appendChild(videoButton);
        videoButtonLink.id = 'rezkaDownloadVideoLink';
        videoButtonLink.download = true;

        subtitlesButton.textContent = 'Download Subtitles';
        subtitlesButton.id = 'rezkaDownloadSubtitlesButton'
        subtitlesButton.addEventListener('click', function() {
            downloadSubtitles();
        });

        var container = document.createElement('div');
        container.appendChild(videoButtonLink);
        container.appendChild(subtitlesButton);

        var table = document.querySelector('.b-post__rating_table');
        if (table) {
            table.insertAdjacentElement('afterend', container);
        }
    }

    // Initialize the buttons
    initializeButtons();

    // Reset the script when the hash changes
    window.addEventListener('hashchange', function() {
        resetScript();
    });

    // Modify the XMLHttpRequest open function to listen for video and subtitles requests
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        if (url.includes('.voidboost.com') && url.endsWith('.vtt')) {
            subtitlesUrl = url;
            updateButtonColor();
        }
        open.apply(this, arguments);
    };

    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        let url = this._url;
        if (url && url.includes('.stream.voidboost.cc')) {
            if (url.endsWith('.ts')) {
                // Modify the video URL by removing the segment information
            videoUrl = url.split('.mp4:')[0] + '.mp4';
            videoButtonLink.href = videoUrl;
            updateButtonColor();

            }
        }
        send.call(this, data);
    }

    // Function to update the button color based on URL values
    function updateButtonColor() {
        var videoButton = document.querySelector('#rezkaDownloadVideoButton');
        var subtitlesButton = document.querySelector('#rezkaDownloadSubtitlesButton');

        if (videoUrl) {
            videoButton.style.backgroundColor = 'green';
        } else {
            videoButton.style.backgroundColor = '';
        }

        if (subtitlesUrl) {
            subtitlesButton.style.backgroundColor = 'green';
        } else {
            subtitlesButton.style.backgroundColor = '';
        }
    }
})();
