// ==UserScript==
// @name         Generate YouTube Download commands for yt-dlp terminal
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhance downloading capabilities on YouTube with playlist and channel support.
// @author       ChatGPT
// @match        *://*.youtube.com/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/500374/Generate%20YouTube%20Download%20commands%20for%20yt-dlp%20terminal.user.js
// @updateURL https://update.greasyfork.org/scripts/500374/Generate%20YouTube%20Download%20commands%20for%20yt-dlp%20terminal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let folderLocation = '.'; // Default folder location, current directory. Change it if needed.
    let disableViaYtDlp = false; // Set to true to remove " (via yt-dlp)" from filenames.
    let setToTrueToMoveChannelNameToEnd = false; // Set to true to move channel name to the end of the filename.

    function isSingleOrPlaylistVideo() {
        // Checks if the URL indicates a single video or a video within a playlist
        return window.location.href.includes("/watch?v=") || window.location.href.includes("/v/");
    }

    function isPlaylist() {
        // Checks if the URL includes a playlist identifier
        return window.location.href.includes("&list=");
    }

    function isFullChannel() {
        // Checks if the URL is likely pointing to a full channel
        return window.location.href.includes("/channel/") || window.location.href.includes("/@");
    }

    const ytDlpCommand = (mode, quality = '') => {
        const url = window.location.href;
        let command = "yt-dlp ";
        let isSPV = isSingleOrPlaylistVideo();
        let isPL = isPlaylist();
        let isFullCH = isFullChannel();

        let outputFolder = folderLocation;
        if (isPL) {
            outputFolder += '/%(playlist)s';
        } else if (isFullCH) {
            outputFolder += '/%(uploader)s';
        }

        // Define output template
        let outputTemplate = `${outputFolder}/%(title)s (via yt-dlp).%(ext)s`;
        if (!isPL && !isFullCH) {
            outputTemplate = `${folderLocation}/%(uploader)s - %(title)s (via yt-dlp).%(ext)s`; // Single or non-playlist video
        }

        if (isPL || isFullCH) {
            command += isPL ? "--yes-playlist " : "";
            command += isFullCH ? "--download-archive channel_archive.txt " : ""; // Using an archive file to avoid re-downloads
        }

        switch (mode) {
            case 'audio':
                command += `--extract-audio --audio-format m4a --audio-quality 0 -o "${outputTemplate}" -f "bestaudio[ext=m4a]/bestaudio/bestvideo+bestaudio" "${url}"`;
                break;
            case 'video':
                let videoQuality = 'bestvideo+bestaudio';
                if (quality) {
                    videoQuality = `bestvideo[height<=${quality}]+bestaudio/best`;
                }
                command += `-f "${videoQuality}" --merge-output-format mkv -o "${outputTemplate}" "${url}"`;
                break;
            case 'comments':
            case 'chat':
                let fileType = (mode === 'comments') ? "comments and description" : "live chat";
                command += `--write-${mode} -o "${outputTemplate}" "${url}"`;
                break;
        }

        // Remove channel-specific parts if not a full channel download
        if (!isFullCH) {
            command = command.replace(/--download-archive channel_archive\.txt /g, "");
        }

        if( disableViaYtDlp === true){
        command = command.replace(" (via yt-dlp)","")
        }

        if( setToTrueToMoveChannelNameToEnd === true){
        command = command.replace("%(uploader)s - ","")
        command = command.replace(".%(ext)s"," - %(uploader)s.%(ext)s")
        }

        GM_setClipboard(command);
        alert("Command copied to clipboard:\n" + command);
    };

    // Registering menu commands
    GM_registerMenuCommand("Download Audio (m4a)", () => ytDlpCommand('audio'), 'a');
    GM_registerMenuCommand("Download Comments", () => ytDlpCommand('comments'), 'c');
    GM_registerMenuCommand("Download Chat", () => ytDlpCommand('chat'), 'ch');
    GM_registerMenuCommand("Download Video (Best)", () => ytDlpCommand('video'), 'v');
    GM_registerMenuCommand("Download Video (4K)", () => ytDlpCommand('video', '2160'), '4');
    GM_registerMenuCommand("Download Video (1080p)", () => ytDlpCommand('video', '1080'), '1');
    GM_registerMenuCommand("Download Video (720p)", () => ytDlpCommand('video', '720'), '7');
    GM_registerMenuCommand("Download Video (480p)", () => ytDlpCommand('video', '480'), '4');
})();

