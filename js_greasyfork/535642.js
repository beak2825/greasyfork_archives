// ==UserScript==
// @name         YouTube Channel Blocker with Menu and Import/Export
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Hides YouTube videos from specified channels (by handle or channel ID), allows adding via button, and manages list via menu with import/export
// @author       DoctorEye
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/535642/YouTube%20Channel%20Blocker%20with%20Menu%20and%20ImportExport.user.js
// @updateURL https://update.greasyfork.org/scripts/535642/YouTube%20Channel%20Blocker%20with%20Menu%20and%20ImportExport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initial list of blocked channels (handles or channel IDs)
    const initialBlockedChannels = [
        '@AutoVortex-01',
        '@RevReviewtrend',
        '@TurboFusion-35'
    ].map(item => item.toLowerCase());

    // Load blocked channels from localStorage or use initial list
    let blockedChannels = JSON.parse(localStorage.getItem('blockedChannels')) || initialBlockedChannels;
    if (!localStorage.getItem('blockedChannels')) {
        localStorage.setItem('blockedChannels', JSON.stringify(blockedChannels));
    }

    // CSS for Block Channel button and UI
    GM_addStyle(`
        .block-channel-btn {
            background-color: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            margin-left: 10px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
        }
        .block-channel-btn:hover {
            background-color: #cc0000;
        }
        #blocker-ui {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border: 1px solid #ccc;
            padding: 20px;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            display: none;
        }
        #blocker-ui textarea {
            width: 300px;
            height: 150px;
        }
        #blocker-ui button {
            margin: 10px 5px;
        }
    `);

    // Save blocked channels to localStorage
    function saveBlockedChannels() {
        localStorage.setItem('blockedChannels', JSON.stringify(blockedChannels));
    }

    // Function to hide videos and add Block button
    function hideVideos() {
        const videoElements = document.querySelectorAll(
            'ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-reel-item-renderer, ytd-playlist-renderer'
        );

        videoElements.forEach(video => {
            // Check for channel links
            const channelElements = video.querySelectorAll('a[href*="/@"], a[href*="/channel/"], a[href*="/user/"], ytd-channel-name a');
            let foundIdentifier = null;

            for (const element of channelElements) {
                const href = element.href || '';
                // Extract handle from @ links
                const handleMatch = href.match(/\/@[^\/]+/)?.[0]?.toLowerCase();
                // Extract channel ID from /channel/ or /user/ links
                const channelIdMatch = href.match(/\/(channel|user)\/([^\/?]+)/)?.[2]?.toLowerCase();

                if (handleMatch && blockedChannels.includes(handleMatch)) {
                    foundIdentifier = handleMatch;
                    video.style.display = 'none';
                    console.log(`Blocked video from handle: ${handleMatch}`);
                    break;
                } else if (channelIdMatch && blockedChannels.includes(channelIdMatch)) {
                    foundIdentifier = channelIdMatch;
                    video.style.display = 'none';
                    console.log(`Blocked video from channel ID: ${channelIdMatch}`);
                    break;
                } else {
                    // Log for debugging
                    if (handleMatch) {
                        console.log(`Detected handle (not blocked): ${handleMatch}`);
                    } else if (channelIdMatch) {
                        console.log(`Detected channel ID (not blocked): ${channelIdMatch}`);
                    }
                }
            }

            // Add Block Channel button if not already present
            if (!video.querySelector('.block-channel-btn')) {
                const channelLink = video.querySelector('a[href*="/@"], a[href*="/channel/"], a[href*="/user/"]');
                if (channelLink) {
                    const handle = channelLink.href.match(/\/@[^\/]+/)?.[0];
                    const channelId = channelLink.href.match(/\/(channel|user)\/([^\/?]+)/)?.[2];
                    const identifier = handle || channelId;

                    if (identifier) {
                        const button = document.createElement('button');
                        button.className = 'block-channel-btn';
                        button.textContent = 'Block Channel';
                        button.onclick = () => {
                            if (!blockedChannels.includes(identifier.toLowerCase())) {
                                blockedChannels.push(identifier.toLowerCase());
                                saveBlockedChannels();
                                hideVideos();
                                alert(`Blocked: ${identifier}`);
                            } else {
                                alert(`${identifier} is already blocked.`);
                            }
                        };
                        const metaContainer = video.querySelector('#meta') || video;
                        metaContainer.appendChild(button);
                    } else {
                        console.log(`No identifier found for channel link: ${channelLink.href}`);
                    }
                }
            }
        });
    }

    // Create UI for managing blocked channels
    function createManageUI() {
        let ui = document.getElementById('blocker-ui');
        if (!ui) {
            ui = document.createElement('div');
            ui.id = 'blocker-ui';
            ui.innerHTML = `
                <h3>Manage Blocked Channels</h3>
                <textarea id="blocked-channels-list">${blockedChannels.join('\n')}</textarea>
                <br>
                <input type="file" id="import-channels" accept=".json" style="margin: 10px 0;">
                <br>
                <button id="save-channels">Save</button>
                <button id="export-channels">Export</button>
                <button id="clear-channels">Clear List</button>
                <button id="close-ui">Close</button>
            `;
            document.body.appendChild(ui);

            // Event listeners for buttons
            document.getElementById('save-channels').onclick = () => {
                const newList = document.getElementById('blocked-channels-list').value
                    .split('\n')
                    .map(line => line.trim().toLowerCase())
                    .filter(line => line.startsWith('@') || line.match(/^[a-z0-9_-]+$/i));
                blockedChannels = [...new Set(newList)];
                saveBlockedChannels();
                hideVideos();
                alert('List updated!');
                ui.style.display = 'none';
            };

            document.getElementById('export-channels').onclick = () => {
                const data = JSON.stringify(blockedChannels, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'blocked_channels.json';
                a.click();
                URL.revokeObjectURL(url);
            };

            document.getElementById('import-channels').onchange = (event) => {
                const file = event.target.files[0];
                if (!file) {
                    alert('No file selected.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedList = JSON.parse(e.target.result);
                        if (Array.isArray(importedList) && importedList.every(item => typeof item === 'string' && (item.startsWith('@') || item.match(/^[a-z0-9_-]+$/i)))) {
                            blockedChannels = [...new Set(importedList.map(item => item.toLowerCase()))];
                            saveBlockedChannels();
                            document.getElementById('blocked-channels-list').value = blockedChannels.join('\n');
                            hideVideos();
                            alert('Channels imported successfully!');
                        } else {
                            alert('Invalid file format. Must be a JSON array of channel handles (starting with @) or channel IDs.');
                        }
                    } catch (error) {
                        alert('Error importing file: ' + error.message);
                    }
                };
                reader.onerror = () => {
                    alert('Error reading file.');
                };
                reader.readAsText(file);
            };

            document.getElementById('clear-channels').onclick = () => {
                if (confirm('Are you sure you want to clear the blocked channels list?')) {
                    blockedChannels = [];
                    saveBlockedChannels();
                    document.getElementById('blocked-channels-list').value = '';
                    hideVideos();
                    alert('List cleared!');
                }
            };

            document.getElementById('close-ui').onclick = () => {
                ui.style.display = 'none';
            };
        }
        ui.style.display = 'block';
    }

    // Register menu command for managing blocked channels
    GM_registerMenuCommand('Manage Blocked Channels', createManageUI, 'm');

    // Initial execution
    hideVideos();

    // Observe DOM changes
    const observer = new MutationObserver(hideVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    // Re-run every 0.5 seconds for late-loaded content
    setInterval(hideVideos, 500);
})();