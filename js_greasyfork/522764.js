// ==UserScript==
// @name         RD-MagnetDL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Real-Debrid.com magnet link converter with streaming support, adds a tab for a converted magnet to RD download and streaming link and then copies to the clipboard when you click on it
// @author       goodchoice
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/522764/RD-MagnetDL.user.js
// @updateURL https://update.greasyfork.org/scripts/522764/RD-MagnetDL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = '';
    const BASE_URL = 'https://api.real-debrid.com/rest/1.0/';

    function convertMagnetToRD(magnetLink, isStreaming = false, button) {
        console.log(`Converting magnet link: ${magnetLink}, isStreaming: ${isStreaming}`);
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${BASE_URL}torrents/addMagnet`,
            data: `magnet=${encodeURIComponent(magnetLink)}`,
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            onload: function(response) {
                console.log('addMagnet response:', response);
                if (response.status === 201) {
                    const torrentId = JSON.parse(response.responseText).id;
                    console.log('Torrent ID:', torrentId);
                    // Select files regardless of the action (download or stream)
                    selectFiles(torrentId, isStreaming, button);
                } else {
                    console.error('Error adding magnet:', response.status, response.responseText);
                    alert('Error adding magnet link. Check console for details.');
                    resetButton(button);
                }
            },
            onerror: function(error) {
                console.error('Request failed:', error);
                alert('Network error. Check console for details.');
                resetButton(button);
            }
        });
    }

    function selectFiles(torrentId, isStreaming, button) {
        console.log(`Selecting files for torrent ID: ${torrentId}`);
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${BASE_URL}torrents/selectFiles/${torrentId}`,
            data: 'files=all',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            onload: function(response) {
                console.log('selectFiles response:', response);
                if (response.status === 204) {
                    if (isStreaming) {
                        getStreamingLink(torrentId, button);
                    } else {
                        getDownloadLink(torrentId, button);
                    }
                } else {
                    console.error('Error selecting files:', response.status, response.responseText);
                    alert('Error selecting files. Check console for details.');
                    resetButton(button);
                }
            },
            onerror: function(error) {
                console.error('Request failed:', error);
                alert('Network error. Check console for details.');
                resetButton(button);
            }
        });
    }

    function getDownloadLink(torrentId, button) {
        console.log(`Getting download link for torrent ID: ${torrentId}`);
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${BASE_URL}torrents/info/${torrentId}`,
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            },
            onload: function(response) {
                console.log('getDownloadLink response:', response);
                if (response.status === 200) {
                    const downloadLinks = JSON.parse(response.responseText).links;
                    unrestrictLinks(downloadLinks, button);
                } else {
                    console.error('Error getting download link:', response.status, response.responseText);
                    alert('Error getting download link. Check console for details.');
                    resetButton(button);
                }
            },
            onerror: function(error) {
                console.error('Request failed:', error);
                alert('Network error. Check console for details.');
                resetButton(button);
            }
        });
    }

    function unrestrictLinks(links, button) {
        console.log('Unrestricting links:', links);
        const unrestrictedLinks = [];

        function processLink(index) {
            if (index >= links.length) {
                console.log('Unrestricted download links:', unrestrictedLinks);
                GM_setClipboard(unrestrictedLinks.join('\n'));
                alert('Unrestricted download links copied to clipboard!');
                resetButton(button);
                return;
            }

            const link = links[index];
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${BASE_URL}unrestrict/link`,
                data: `link=${encodeURIComponent(link)}`,
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                    console.log(`Unrestricting link ${link}:`, response);
                    if (response.status === 200) {
                        const unrestrictedLink = JSON.parse(response.responseText).download;
                        unrestrictedLinks.push(unrestrictedLink);
                        processLink(index + 1);
                    } else {
                        console.error('Error unrestricting link:', response.status, response.responseText);
                        alert(`Error unrestricting link: ${link}`);
                        resetButton(button);
                    }
                },
                onerror: function(error) {
                    console.error('Request failed:', error);
                    alert('Network error during link unrestriction. Check console for details.');
                    resetButton(button);
                }
            });
        }

        processLink(0);
    }

    function getStreamingLink(torrentId, button) {
        console.log(`Getting streaming link for torrent ID: ${torrentId}`);

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${BASE_URL}torrents/info/${torrentId}`,
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            },
            onload: function(response) {
                console.log('getTorrentInfo response:', response);
                if (response.status === 200) {
                    const torrentInfo = JSON.parse(response.responseText);
                    if (torrentInfo.status === 'downloaded') {
                        const links = torrentInfo.links;
                        if (links && links.length > 0) {
                            // First unrestrict the download link
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: `${BASE_URL}unrestrict/link`,
                                data: `link=${encodeURIComponent(links[0])}`,
                                headers: {
                                    Authorization: `Bearer ${API_KEY}`,
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                onload: function(unrestrictResponse) {
                                    console.log('Unrestrict response:', unrestrictResponse);
                                    if (unrestrictResponse.status === 200) {
                                        const unrestrictedInfo = JSON.parse(unrestrictResponse.responseText);
                                        const downloadUrl = unrestrictedInfo.download;
                                        const match = downloadUrl.match(/\/d\/([^/]+)/);
                                        if (match && match[1]) {
                                            const streamingId = match[1];
                                            const streamingUrl = `https://real-debrid.com/streaming-${streamingId}`;
                                            console.log('Streaming URL:', streamingUrl);
                                            GM_setClipboard(streamingUrl);
                                            alert('Streaming link copied to clipboard!');
                                            resetButton(button);
                                        } else {
                                            console.error('Could not extract streaming ID');
                                            alert('Error generating streaming link');
                                            resetButton(button);
                                        }
                                    } else {
                                        console.error('Error unrestricting link:', unrestrictResponse.status);
                                        alert('Error generating streaming link');
                                        resetButton(button);
                                    }
                                },
                                onerror: function(error) {
                                    console.error('Request failed:', error);
                                    alert('Network error during link unrestriction');
                                    resetButton(button);
                                }
                            });
                        } else {
                            console.error('No download links available');
                            alert('No download links available');
                            resetButton(button);
                        }
                    } else {
                        console.log('Torrent not ready, waiting...');
                        setTimeout(() => getStreamingLink(torrentId, button), 2000);
                    }
                } else {
                    console.error('Error checking torrent status:', response.status);
                    alert('Error checking torrent status');
                    resetButton(button);
                }
            },
            onerror: function(error) {
                console.error('Request failed:', error);
                alert('Network error checking torrent status');
                resetButton(button);
            }
        });
    }
        function createRDButton(type) {
        const button = document.createElement('button');
        button.textContent = type === 'download' ? 'RD DL' : 'RD Stream';
        button.classList.add('rd-button', `rd-${type}`);
        button.style.cssText = `
            margin-left: 5px;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: #f0f0f0;
            cursor: pointer;
        `;
        return button;
    }

    function resetButton(button) {
        button.disabled = false;
        button.textContent = button.classList.contains('rd-download') ? 'RD DL' : 'RD Stream';
    }

    function addRDButton(magnetLink) {
        if (magnetLink.nextSibling?.classList?.contains('rd-button')) return;

        const buttonContainer = document.createElement('span');
        buttonContainer.style.display = 'inline-block';

        const dlButton = createRDButton('download');
        const streamButton = createRDButton('stream');

        dlButton.addEventListener('click', (e) => {
            e.preventDefault();
            dlButton.disabled = true;
            dlButton.textContent = 'Converting...';
            convertMagnetToRD(magnetLink.href, false, dlButton);
        });

        streamButton.addEventListener('click', (e) => {
            e.preventDefault();
            streamButton.disabled = true;
            streamButton.textContent = 'Converting...';
            convertMagnetToRD(magnetLink.href, true, streamButton);
        });

        buttonContainer.appendChild(dlButton);
        buttonContainer.appendChild(streamButton);
        magnetLink.parentNode.insertBefore(buttonContainer, magnetLink.nextSibling);
    }

    function processMagnetLinks() {
        const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
        magnetLinks.forEach(addRDButton);
    }

    // Initialize
    processMagnetLinks();

    // Watch for new magnet links
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const magnetLinks = node.querySelectorAll('a[href^="magnet:"]');
                    magnetLinks.forEach(addRDButton);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();