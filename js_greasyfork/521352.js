// ==UserScript==
// @name         YouTube to MPC-BE with Auto Subtitles
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Opens YouTube links in MPC-BE and automatically loads subtitles
// @author       CL
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @connect      youtube.com
// @connect      googlevideo.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521352/YouTube%20to%20MPC-BE%20with%20Auto%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/521352/YouTube%20to%20MPC-BE%20with%20Auto%20Subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // FileSaver.js v1.3.8 implementation
    /*
     * FileSaver.js
     * A saveAs() FileSaver implementation.
     *
     * By Eli Grey, http://eligrey.com
     *
     * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
     * source  : http://purl.eligrey.com/github/FileSaver.js
     */
    var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}

    // Configuration
    const config = {
        debug: true,
        tempDir: 'C:\\Temp'  // Default Windows temp directory
    };

    // Logging function
    function log(message, error = false) {
        if (config.debug) {
            const prefix = error ? '[ERROR]' : '[INFO]';
            console.log(`${prefix} ${message}`);
            GM_log(`${prefix} ${message}`);
        }
    }

    // Function to fetch video page
    function fetchVideoPage(videoId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.youtube.com/watch?v=${videoId}`,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(`Failed to fetch video page: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject(`Error fetching video page: ${error}`);
                }
            });
        });
    }

    // Function to fetch subtitles
    async function fetchSubtitles(videoId) {
        try {
            log(`Fetching subtitles for video: ${videoId}`);
            const html = await fetchVideoPage(videoId);
            
            // Extract player response data
            const ytInitialPlayerResponse = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/)?.[1];
            if (!ytInitialPlayerResponse) {
                throw new Error('Could not find player response data');
            }

            const playerResponse = JSON.parse(ytInitialPlayerResponse);
            const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer;
            
            if (!captions) {
                throw new Error('No captions found in video data');
            }

            // Find auto-generated captions
            const captionTracks = captions.captionTracks;
            if (!captionTracks || captionTracks.length === 0) {
                throw new Error('No caption tracks found');
            }

            // Prefer auto-generated captions
            const autoCaption = captionTracks.find(track => track.kind === 'asr') || captionTracks[0];
            if (!autoCaption?.baseUrl) {
                throw new Error('Could not find auto-generated captions');
            }

            log('Found caption track URL');

            // Fetch the actual subtitle data
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: autoCaption.baseUrl,
                    onload: function(response) {
                        if (response.status === 200) {
                            const srtContent = convertToSRT(response.responseText);
                            resolve(srtContent);
                        } else {
                            reject(`Failed to fetch subtitle data: ${response.status}`);
                        }
                    },
                    onerror: function(error) {
                        reject(`Error fetching subtitle data: ${error}`);
                    }
                });
            });
        } catch (error) {
            log(error.message, true);
            throw error;
        }
    }

    // Convert YouTube caption format to SRT
    function convertToSRT(subtitleData) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(subtitleData, 'text/xml');
            const textNodes = xmlDoc.getElementsByTagName('text');
            
            if (!textNodes || textNodes.length === 0) {
                throw new Error('No text nodes found in subtitle data');
            }

            log(`Converting ${textNodes.length} subtitle entries to SRT`);
            
            // First pass: collect all timings
            const subtitles = [];
            for (let i = 0; i < textNodes.length; i++) {
                const node = textNodes[i];
                const start = parseFloat(node.getAttribute('start'));
                const duration = parseFloat(node.getAttribute('dur')) || 0;
                let end = start + duration;
                
                // Clean text content
                const text = node.textContent
                    .replace(/&#39;/g, "'")
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .trim();
                
                subtitles.push({ start, end, text });
            }

            // Second pass: adjust timings to prevent overlap
            const GAP = 0.01; // 10ms gap between subtitles
            for (let i = 0; i < subtitles.length - 1; i++) {
                const current = subtitles[i];
                const next = subtitles[i + 1];
                
                // If current subtitle ends after next one starts
                if (current.end >= next.start) {
                    // Adjust the end time of current subtitle
                    current.end = Math.max(current.start, next.start - GAP);
                }
            }

            // Generate SRT content
            let srtContent = '';
            subtitles.forEach((sub, index) => {
                // Only include subtitles that have a positive duration
                if (sub.end > sub.start) {
                    srtContent += (index + 1) + '\n';
                    srtContent += formatTime(sub.start) + ' --> ' + formatTime(sub.end) + '\n';
                    srtContent += sub.text + '\n\n';
                }
            });
            
            return srtContent;
        } catch (error) {
            log('Error converting to SRT: ' + error.message, true);
            throw error;
        }
    }

    // Format time for SRT (00:00:00,000)
    function formatTime(seconds) {
        const date = new Date(seconds * 1000);
        const hh = String(date.getUTCHours()).padStart(2, '0');
        const mm = String(date.getUTCMinutes()).padStart(2, '0');
        const ss = String(date.getUTCSeconds()).padStart(2, '0');
        const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
        
        return `${hh}:${mm}:${ss},${ms}`;
    }

    // Write SRT file using FileSaver
    function writeSRT(content, videoId) {
        const filename = `${videoId}.srt`;
        const fullPath = `${config.tempDir}\\${filename}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        
        try {
            saveAs(blob, filename);
            log(`Subtitle file saved: ${fullPath}`);
            return fullPath;
        } catch (error) {
            log(`Error saving file: ${error.message}`, true);
            throw error;
        }
    }

    // Extract video ID from URL
    function getVideoId(url) {
        try {
            const urlParams = new URLSearchParams(new URL(url).search);
            return urlParams.get('v');
        } catch (error) {
            log('Error extracting video ID: ' + error.message, true);
            return null;
        }
    }

    // Check if URL is a YouTube watch URL
    function isYouTubeWatchURL(url) {
        return url.includes('youtube.com/watch?') && url.includes('v=');
    }

    // Handle link clicks
    async function handleLinkClick(event) {
        const link = event.target.closest('a');
        if (!link) return;
        
        const url = link.href;
        if (!isYouTubeWatchURL(url)) return;
        
        event.preventDefault();
        event.stopPropagation();

        const videoId = getVideoId(url);
        if (!videoId) {
            log('Invalid video ID', true);
            return;
        }

        log(`Processing video: ${videoId}`);
        
        try {
            // Fetch and save subtitles
            const subtitles = await fetchSubtitles(videoId);
            if (subtitles) {
                const subtitlePath = writeSRT(subtitles, videoId);
                log('Subtitles processed successfully');
                
                // Encode paths for URL
                const encodedUrl = encodeURIComponent(url);
                const encodedSubPath = encodeURIComponent(subtitlePath);
                
                // Open MPC-BE with video and subtitles
                window.location.href = `mpc://${encodedUrl}/sub=${encodedSubPath}`;
            }
        } catch (error) {
            log(`Failed to process subtitles: ${error.message}`, true);
            // If subtitle processing fails, still play the video
            window.location.href = `mpc://${url}`;
        }
    }

    // Initialize
    function initialize() {
        // Add click event listener
        document.addEventListener('click', handleLinkClick, true);
        log('YouTube to MPC-BE script initialized');
    }

    // Start the script
    initialize();
})();