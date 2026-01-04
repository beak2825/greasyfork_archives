// ==UserScript==
// @name         Discord / Twitch chatlog viewercard hover popup shortcut menu for moderators
// @namespace    https://greasyfork.org/en/scripts/541618-discord-twitch-chatlog-viewercard-hover-popup-shortcut-menu-for-moderators
// @version      1.2
// @description  Show a popup with viewercard options when hovering over Twitch links, staying in place until the mouse leaves the link or popup, ensuring it's always on top, and disappearing after 4 seconds. Ignores clips and vods.
// @author       Cragsand
// @license      MIT
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541618/Discord%20%20Twitch%20chatlog%20viewercard%20hover%20popup%20shortcut%20menu%20for%20moderators.user.js
// @updateURL https://update.greasyfork.org/scripts/541618/Discord%20%20Twitch%20chatlog%20viewercard%20hover%20popup%20shortcut%20menu%20for%20moderators.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Edit list of Twitch stream channels comma separated where you have mod for that you want to add a popout button for. 
    const streamers = ['twitch', 'xbox'];

    let popup;
    let activeLink;
    let popupTimeout;

    function createPopup(username, x, y) {
        if (popup) return;

        popup = document.createElement('div');
        popup.classList.add('twitch-popup');
        popup.style.position = 'fixed';
        popup.style.background = '#222';
        popup.style.color = 'white';
        popup.style.padding = '8px';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.7)';
        popup.style.zIndex = '9999';
        popup.style.fontSize = '14px';
        popup.style.top = `${y + 10}px`;
        popup.style.left = `${x + 10}px`;

        // 🔗 Create buttons for each streamer
        streamers.forEach(streamer => {
            const btn = document.createElement('button');
            btn.textContent = `Open viewercard for ${streamer}`;
            btn.style.display = 'block';
            btn.style.margin = '4px 0';
            btn.style.padding = '4px';
            btn.style.width = '100%';
            btn.style.cursor = 'pointer';
            btn.style.border = 'none';
            btn.style.background = '#9147ff';
            btn.style.color = 'white';
            btn.style.borderRadius = '3px';

            btn.addEventListener('click', () => {
                window.open(`https://www.twitch.tv/popout/${streamer}/viewercard/${username}?no-mobile-redirect=true`, '_blank');
            });

            popup.appendChild(btn);
        });

        document.body.appendChild(popup);
        popup.addEventListener('mouseleave', removePopup);
        popupTimeout = setTimeout(removePopup, 4000);
    }

    function handleMouseOver(event) {
        const link = event.target.closest('a[href*="twitch.tv"]');
        if (
            !link ||
            link === activeLink ||
            link.href.includes('clips.twitch.tv') ||
            link.href.includes('/clip/') ||
            link.href.includes('/videos/')
        ) return;

        activeLink = link;

        try {
            const url = new URL(link.href);
            const pathParts = url.pathname.split('/').filter(Boolean);
            const username = pathParts[0];

            if (username && username !== 'popout' && username !== 'directory') {
                createPopup(username, event.clientX, event.clientY);
            }
        } catch (error) {
            console.error('Error processing Twitch link:', error);
        }
    }

    function removePopup() {
        if (popup) {
            popup.remove();
            popup = null;
            activeLink = null;
            clearTimeout(popupTimeout);
        }
    }

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseleave', removePopup);
})();
