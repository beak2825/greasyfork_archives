// ==UserScript==
// @name            Nove TV Video - Link Extractor
// @namespace       NoveTV
// @version         2.9
// @description     Extract video links from Nove TV pages and add a download button below the video player
// @author          Science
// @match           https://nove.tv/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant           GM_xmlhttpRequest
// @connect         nove.tv
// @connect         cdn.hyogaplayer.com
// @connect         fwmrm.net
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/508398/Nove%20TV%20Video%20-%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/508398/Nove%20TV%20Video%20-%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof GM !== "undefined" && !!GM.xmlHttpRequest) {
        GM_xmlhttpRequest = GM.xmlHttpRequest;
    }

    function fetch(params) {
        return new Promise(function(resolve, reject) {
            params.onload = resolve;
            params.onerror = reject;
            GM_xmlhttpRequest(params);
        });
    }

    function showModal(title, content) {
        const modalId = 'video-download-modal';
        if ($("#" + modalId).length) {
            $("#" + modalId).remove();
        }
        const modal = $(`
            <div id="${modalId}" style="position: fixed; top: 10%; left: 50%; transform: translate(-50%, 0); padding: 20px; background: #fff; border: 1px solid #ccc; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                <h2>${title}</h2>
                <div>${content}</div>
                <button id="modal-close" style="margin-top: 10px; padding: 10px; background: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
            </div>
        `);
        $("body").append(modal);
        $("#modal-close").click(() => modal.remove());
    }

    async function extractVideoLink() {
        showModal('Processing', '<p>Searching for video links...</p>');

        const videoLinks = [];

        // Search in inline scripts
        $("script").each(function() {
            const scriptContent = $(this).html();
            const matches = extractLinksFromString(scriptContent);
            if (matches) {
                videoLinks.push(...matches.filter(url => url.includes('.m3u8') || url.includes('.mp4')));
            }
        });

        // Search in external scripts
        const externalScripts = $("script[src]").map(function() { return $(this).attr('src'); }).get();
        await Promise.all(externalScripts.map(scriptSrc => {
            if (scriptSrc) {
                return fetch({ method: 'GET', url: scriptSrc })
                    .then(response => response.responseText)
                    .then(jsContent => {
                        const matches = extractLinksFromString(jsContent);
                        if (matches) {
                            videoLinks.push(...matches.filter(url => url.includes('.m3u8') || url.includes('.mp4')));
                        }
                    })
                    .catch(error => console.error('Failed to fetch external script:', error));
            }
        }));

        // Monitor network requests for HLS links
        const monitorNetworkRequests = () => {
            if (window.performance && window.performance.getEntriesByType) {
                const requests = window.performance.getEntriesByType("resource");
                requests.forEach((request) => {
                    if (request.initiatorType === 'xmlhttprequest' || request.initiatorType === 'fetch') {
                        if (request.name.includes('.m3u8') || request.name.includes('.mp4')) {
                            videoLinks.push(request.name);
                        }
                    }
                });
            }
        };

        monitorNetworkRequests();

        console.log("Found video links:", videoLinks);

        if (videoLinks.length === 0) {
            showModal('No Video Links Found', '<p>No video links were found on this page.</p>');
            return;
        }

        // Filter out only the master playlist link
        const masterLink = videoLinks.find(url => url.includes('/master.m3u8'));

        if (!masterLink) {
            showModal('No Main Video Link Found', '<p>No main video link was found on this page.</p>');
            return;
        }

        // Display the master video link with download button
        const downloadHtml = `
            <div style="margin-bottom: 10px;">
                <a href="${masterLink}" target="_blank">${masterLink}</a>
                <a href="${masterLink}" download="video" style="margin-left: 10px; padding: 5px; background: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">Download</a>
            </div>
        `;
        showModal('Video Link Found', `<p>Click the link below to view or download the video:</p><div>${downloadHtml}</div>`);
    }

    function extractLinksFromString(content) {
        const regex = /https:\/\/[^"\']*\.(m3u8|mp4)/g;
        return content.match(regex) || [];
    }

    function addDownloadButton() {
        console.log('Attempting to add download button...'); // Debug log

        // Add the button below the video player
        const videoPlayer = $("video").closest("div");
        console.log('Video player found:', videoPlayer.length > 0); // Debug log

        if (videoPlayer.length > 0 && $("#get-video-links").length === 0) {
            videoPlayer.after(`
                <div id="video-link-container" style="text-align: center; margin-top: 10px;">
                    <button id="get-video-links" style="padding: 10px; background: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                        Get Video Links
                    </button>
                </div>
            `);
            $("#get-video-links").click(extractVideoLink);
        } else {
            console.log('No video player found or button already exists.'); // Debug log
        }
    }

    $(document).ready(() => {
        // Add the button when the DOM is ready or when the video player is loaded
        addDownloadButton();

        // Observe changes to the page for dynamically loaded content
        const observer = new MutationObserver(addDownloadButton);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
