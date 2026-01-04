// ==UserScript==
// @name         YouTube Link Enhancer + MP3 (Improved)
// @version      1.02
// @description  Adds PlayAll button, channel videos/playlists links, and MP3 conversion button
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/live/*
// @match        https://www.youtube.com/@*
// @match        https://y2mate.nu/*
// @grant        none
// @namespace    https://greasyfork.org/users/53445
// @downloadURL https://update.greasyfork.org/scripts/544023/YouTube%20Link%20Enhancer%20%2B%20MP3%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544023/YouTube%20Link%20Enhancer%20%2B%20MP3%20%28Improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== MP3 Conversion Functions ====================
    function createMP3Button(videoId) {
        const button = document.createElement('button');
        button.id = 'ytmp3-button';
        button.textContent = 'MP3';
        button.style.marginLeft = '10px';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#FF4D4D';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.borderRadius = '20px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#E60000';
            button.style.transform = 'translateY(-1px)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#FF4D4D';
            button.style.transform = 'translateY(0)';
        });
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(1px)';
            button.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', function() {
            const newUrl = `https://y2mate.nu/en-N5yG/#${videoId}`;
            const width = 600;
            const height = 400;
            const left = (screen.width / 2) - (width / 2);
            const top = (screen.height / 2) - (height / 2);
            window.open(newUrl, 'ytmp3Popup', `width=${width},height=${height},top=${top},left=${left}`);
        });
        return button;
    }

    function addMP3Button() {
        const videoUrl = window.location.href;
        const videoId = new URL(videoUrl).searchParams.get('v');
        const titleElement = document.querySelector('#title h1');
        if (titleElement && !document.getElementById('ytmp3-button')) {
            const button = createMP3Button(videoId);
            titleElement.appendChild(button);
        }
    }

    function clickDownloadButton() {
        const downloadButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Download');
        if (downloadButton) {
            downloadButton.click();
            return true;
        }
        return false;
    }

    function createCloseSign() {
        const closeSign = document.createElement('div');
        closeSign.textContent = 'CERRAR';
        closeSign.style.position = 'fixed';
        closeSign.style.top = '10px';
        closeSign.style.right = '10px';
        closeSign.style.backgroundColor = 'red';
        closeSign.style.color = 'black';
        closeSign.style.padding = '10px';
        closeSign.style.borderRadius = '5px';
        closeSign.style.zIndex = '1000';
        closeSign.style.cursor = 'pointer';
        closeSign.addEventListener('click', () => window.close());
        document.body.appendChild(closeSign);
        setTimeout(() => {
            closeSign.click();
        }, 1000);
    }

    function observeDownloadButton() {
        const observer = new MutationObserver(() => {
            if (clickDownloadButton()) {
                observer.disconnect();
                createCloseSign();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==================== Channel Enhancer Functions ====================
    function createPlayAllLink(channelId) {
        const link = document.createElement('a');
        link.textContent = 'PlayAll';
        link.id = 'playall-link';
        link.href = `https://www.youtube.com/playlist?list=UU${channelId}`;
        link.style.marginLeft = '10px';
        link.style.padding = '8px 15px';
        link.style.backgroundColor = 'green';
        link.style.color = '#FFFFFF';
        link.style.border = 'none';
        link.style.borderRadius = '3px';
        link.style.cursor = 'pointer';
        link.style.textDecoration = 'none';
        return link;
    }

    function addPlayAllLink() {
        const channelPageHeader = document.querySelector('#page-header > yt-page-header-renderer');
        const metaTag = document.querySelector('meta[content^="vnd.youtube://www.youtube.com/channel/UC"]');
        if (channelPageHeader && metaTag && !document.getElementById('playall-link')) {
            const channelId = metaTag.content.split('/UC')[1];
            const playAllLink = createPlayAllLink(channelId);
            channelPageHeader.appendChild(playAllLink);
        }
    }

    function addPlaylistButton() {
        const subscribeButtonContainer = document.querySelector('ytd-subscribe-button-renderer');
        const channelLinkElement = document.querySelector('ytd-channel-name a.yt-simple-endpoint');
        if (document.getElementById('playlists-link') || !channelLinkElement || !subscribeButtonContainer) return;

        let channelPath = channelLinkElement.getAttribute('href');
        const playlistHref = `https://www.youtube.com${channelPath}/playlists`;

        const playlistLink = document.createElement('a');
        playlistLink.textContent = 'Playlists';
        playlistLink.id = 'playlists-link';
        playlistLink.href = playlistHref;

        playlistLink.style.setProperty('background-color', 'var(--yt-spec-brand-background-primary, #0f0f0f)');
        playlistLink.style.setProperty('color', 'var(--yt-spec-text-primary, #f1f1f1)');
        playlistLink.style.setProperty('border', '1px solid var(--yt-spec-badge-chip-background, #303030)');
        playlistLink.style.setProperty('border-radius', '18px');
        playlistLink.style.setProperty('padding', '8px 15px');
        playlistLink.style.setProperty('margin-left', '10px');
        playlistLink.style.setProperty('font-family', 'Roboto, Arial, sans-serif');
        playlistLink.style.setProperty('font-size', '14px');
        playlistLink.style.setProperty('font-weight', '500');
        playlistLink.style.setProperty('text-decoration', 'none');
        playlistLink.style.setProperty('cursor', 'pointer');
        playlistLink.style.setProperty('white-space', 'nowrap');
        playlistLink.style.setProperty('display', 'inline-flex');
        playlistLink.style.setProperty('align-items', 'center');

        playlistLink.onmouseover = () => {
            playlistLink.style.backgroundColor = 'var(--yt-spec-brand-background-secondary, #272727)';
        };
        playlistLink.onmouseout = () => {
            playlistLink.style.backgroundColor = 'var(--yt-spec-brand-background-primary, #0f0f0f)';
        };

        const subscribeButtonParent = subscribeButtonContainer.parentNode;
        if (subscribeButtonParent) {
            const computedStyle = window.getComputedStyle(subscribeButtonParent);
            if (computedStyle.display !== 'flex' && computedStyle.display !== 'inline-flex') {
                subscribeButtonParent.style.display = 'flex';
                subscribeButtonParent.style.alignItems = 'center';
            }
            subscribeButtonParent.insertBefore(playlistLink, subscribeButtonContainer);
        }
    }

    function modifyChannelLink() {
        const channelLink = document.querySelector('ytd-channel-name a');
        if (channelLink && !channelLink.href.includes('/videos')) {
            channelLink.href += '/videos';
            channelLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = channelLink.href;
            });
        }
    }

    function applyModifications() {
        const isVideoPage = window.location.href.includes('youtube.com/watch');
        const isChannelPage = window.location.href.includes('/@');

        if (isVideoPage) {
            modifyChannelLink();
            addMP3Button();
        }

        if (isChannelPage) {
            addPlayAllLink();
        }
    }

    // ==================== Main Execution ====================
    const combinedObserver = new MutationObserver(() => {
        if (!document.getElementById('playlists-link')) {
            addPlaylistButton();
        }
        applyModifications();
        addMP3Button();
    });

    combinedObserver.observe(document.body, { childList: true, subtree: true });

    // Initial execution
    addPlaylistButton();
    applyModifications();
    addMP3Button();

    if (window.location.href.includes('y2mate.nu')) {
        observeDownloadButton();
    }

    // Additional observer specifically for MP3 button in case YouTube dynamically updates the page
    const mp3Observer = new MutationObserver(addMP3Button);
    mp3Observer.observe(document.body, { childList: true, subtree: true });
})();