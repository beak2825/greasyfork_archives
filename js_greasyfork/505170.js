// ==UserScript==
// @name         SoundCloud Feed Control
// @version      2.002
// @license      MIT
// @author       nov0id
// @description  Filter by post, repost, and playlists for a better feed experience
// @match        *://soundcloud.com/feed
// @grant        none
// @namespace https://rainbowlabllc.com/
// @downloadURL https://update.greasyfork.org/scripts/505170/SoundCloud%20Feed%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/505170/SoundCloud%20Feed%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get setting for the current tab
    function getTabSetting(key, defaultValue) {
        return sessionStorage.getItem(key) !== null
            ? JSON.parse(sessionStorage.getItem(key))
            : defaultValue;
    }

    // Function to set setting for the current tab
    function setTabSetting(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    // Default settings per tab
    const settings = {
        filterPosts: getTabSetting('filterPosts', false),
        filterPlaylists: getTabSetting('filterPlaylists', false),
        filterReposts: getTabSetting('filterReposts', false)
    };

    function createUI() {
        let panel = document.createElement('div');
        panel.id = 'sc-filter-panel';
        panel.innerHTML = `
            <style>
                #sc-filter-panel {
                    position: fixed;
                    top: 50px;
                    left: -200px;
                    width: 200px;
                    background: rgba(0, 0, 0, 0.6);
                    padding: 15px;
                    border-radius: 0 10px 10px 0;
                    z-index: 9999;
                    color: white;
                    font-family: 'Segoe UI', sans-serif;
                    font-size: 14px;
                    transition: right 0.3s ease-in-out, background 0.2s ease-in-out;
                }
                #sc-filter-panel:hover {
                    left: 0;
                    background: rgba(0, 0, 0, 0.9);
                }
                .sc-filter-slider {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    font-weight: normal;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                #sc-filter-panel:hover .sc-filter-slider {
                    opacity: 1;
                }
                .sc-filter-slider input {
                    width: 18px;
                    height: 18px;
                }
                .sc-filter-title {
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                #sc-filter-panel:hover .sc-filter-title {
                    opacity: 1;
                }
            </style>
            <div class='sc-filter-title'>Feed Filter</div>
            <div class='sc-filter-slider'>
                <label>Filter Posts</label>
                <input type='checkbox' id='filterPosts' ${settings.filterPosts ? 'checked' : ''}>
            </div>
            <div class='sc-filter-slider'>
                <label>Filter Playlists</label>
                <input type='checkbox' id='filterPlaylists' ${settings.filterPlaylists ? 'checked' : ''}>
            </div>
            <div class='sc-filter-slider'>
                <label>Filter Reposts</label>
                <input type='checkbox' id='filterReposts' ${settings.filterReposts ? 'checked' : ''}>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('filterPosts').addEventListener('change', () => toggleSetting('filterPosts'));
        document.getElementById('filterPlaylists').addEventListener('change', () => toggleSetting('filterPlaylists'));
        document.getElementById('filterReposts').addEventListener('change', () => toggleSetting('filterReposts'));
    }

    function toggleSetting(key) {
        settings[key] = !settings[key];
        setTabSetting(key, settings[key]); // Store setting per tab
        filterFeed();
    }

    function filterFeed() {
        document.querySelectorAll('.soundList__item').forEach((element) => {
            const context = element.querySelector('.sound.streamContext');
            if (context) {
                let label = context.getAttribute('aria-label')?.toLowerCase();
                if (label.includes('reposted') && settings.filterReposts) {
                    element.remove();
                } else if (label.includes('playlist') && settings.filterPlaylists) {
                    element.remove();
                } else if (!label.includes('playlist') && !label.includes('reposted') && settings.filterPosts) {
                    element.remove();
                }
            }
        });
    }

    // Initialize UI and filter logic
    createUI();
    filterFeed();

    // Observe DOM for dynamically added elements
    const observer = new MutationObserver(filterFeed);
    observer.observe(document.body, { childList: true, subtree: true });
})();