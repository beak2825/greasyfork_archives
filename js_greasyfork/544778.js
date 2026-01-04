// ==UserScript==
// @name YouTube Download Button
// @namespace http://tampermonkey.net/
// @version 4.7.1
// @description Adds a customizable download button to YouTube video pages.
// @author jnbn05 with help from Gemini, ChatGPT & Grok
// @match *://*.youtube.com/*
// @grant none
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/544778/YouTube%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544778/YouTube%20Download%20Button.meta.js
// ==/UserScript==

/*
    YouTube Download Button userscript
    Copyright (C) 2025 jnbn05

    This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

(function() {
    'use strict';

    // *** USER CONFIGURATION ***
    const DOWNLOAD_URL_TYPE = 'id_only';
    const QUERY_PARAMETER_URL_TEMPLATE = `https://cobalt.tools/?url=[URL]`;
    const ID_ONLY_URL_TEMPLATE = `https://yt1z.net/en-Izl/?id=[ID]`;
    const HOST_PREFIX = 'ss';
    const DOMAIN_SUFFIX = 'pi';
    // ** END OF CONFIGURATION **

    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    function createDownloadButton() {
        const videoId = getVideoId();
        if (!videoId) {
            return null;
        }

        const button = document.createElement('button');
        button.classList.add('download-button');
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.padding = '6px 10px';
        button.style.border = 'none';
        button.style.fontFamily = '"Roboto", sans-serif';
        button.style.fontWeight = '450';
        button.style.borderRadius = '20px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '8px';
        button.style.gap = '6px';
        button.style.transition = 'background-color 0.2s';

        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('viewBox', '0 0 24 24');
        svgIcon.setAttribute('fill', 'currentColor');
        svgIcon.setAttribute('width', '23');
        svgIcon.setAttribute('height', '23');
        svgIcon.innerHTML = `<path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="currentColor"></path><path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"/>`;

        button.appendChild(svgIcon);
        button.appendChild(document.createTextNode('Download'));

        button.addEventListener('mouseenter', () => {
            const hoverColor = getComputedStyle(document.documentElement).getPropertyValue('--yt-spec-button-chip-background-hover').trim();
            if (hoverColor) {
                button.style.backgroundColor = hoverColor;
            }
        });
        button.addEventListener('mouseleave', () => {
            updateButtonTheme();
        });

        function updateButtonTheme() {
            const computedStyle = getComputedStyle(document.documentElement);
            const bgColor = computedStyle.getPropertyValue('--efyt-control-bar-background-color').trim();
            const textColor = computedStyle.getPropertyValue('--yt-spec-text-primary').trim();
            if (bgColor && textColor) {
                button.style.backgroundColor = bgColor;
                button.style.color = textColor;
            }
        }

        updateButtonTheme();
        const themeObserver = new MutationObserver(updateButtonTheme);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dark'] });

        button.addEventListener('click', () => {
            let downloadUrl;
            const videoId = getVideoId();
            if (!videoId) {
                console.error("Could not find video ID.");
                return;
            }

            if (DOWNLOAD_URL_TYPE === 'query_parameter') {
                const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                downloadUrl = QUERY_PARAMETER_URL_TEMPLATE.replace('[URL]', encodeURIComponent(youtubeUrl));
            } else if (DOWNLOAD_URL_TYPE === 'id_only') {
                downloadUrl = ID_ONLY_URL_TEMPLATE.replace('[ID]', videoId);
            } else if (DOWNLOAD_URL_TYPE === 'prefix_to_host') {
                const urlObj = new URL(window.location.href);
                const hostWithPrefix = `${HOST_PREFIX}${urlObj.hostname}`;
                urlObj.hostname = hostWithPrefix;
                downloadUrl = urlObj.href;
            } else if (DOWNLOAD_URL_TYPE === 'suffix_to_domain') {
                const urlObj = new URL(window.location.href);
                const hostParts = urlObj.hostname.split('.');
                const youtubeIndex = hostParts.indexOf('youtube');
                if (youtubeIndex !== -1) {
                    hostParts[youtubeIndex] = `youtube${DOMAIN_SUFFIX}`;
                }
                urlObj.hostname = hostParts.join('.');
                downloadUrl = urlObj.href;
            } else {
                console.error('Invalid DOWNLOAD_URL_TYPE specified. Using default.');
                const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                downloadUrl = QUERY_PARAMETER_URL_TEMPLATE.replace('[URL]', encodeURIComponent(youtubeUrl));
            }

            window.open(downloadUrl, '_blank');
        });

        return button;
    }

    function addDownloadButtonToPage() {
        // Only run if we are on a video watch page
        if (!window.location.search.includes('v=')) {
            return;
        }

        const actionContainer = document.querySelector('ytd-watch-metadata #top-level-buttons-computed');
        const customButton = document.querySelector('.download-button');
        const nativeDownloadButton = document.querySelector('ytd-download-button-renderer');

        if (customButton) {
            return;
        }

        if (actionContainer) {
            if (nativeDownloadButton) {
                nativeDownloadButton.remove();
            }

            const downloadButton = createDownloadButton();
            if (downloadButton) {
                actionContainer.appendChild(downloadButton);
                console.log('Download button added for video:', getVideoId());
            }
        }
    }

    function init() {
        if (localStorage.getItem('disclaimer_shown') !== 'true') {
            const disclaimerText = "(YouTube Download Button) Disclaimer: This script provides links to third-party video download services. You are responsible for how you use these services, and the use of such services is at your own discretion and risk. By clicking 'OK', you acknowledge and agree to these terms.";
            alert(disclaimerText);
            localStorage.setItem('disclaimer_shown', 'true');
        }

        const observer = new MutationObserver(() => {
            addDownloadButtonToPage();
        });

        const ytdApp = document.querySelector('ytd-app');
        if (ytdApp) {
            observer.observe(ytdApp, { childList: true, subtree: true });
        }

        addDownloadButtonToPage();
    }

    init();
})();