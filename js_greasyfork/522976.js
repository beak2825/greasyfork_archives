// ==UserScript==
// @name         Media Link Extractor
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Extract media links from various websites.
// @author       1axx
// @icon         https://img.freepik.com/premium-photo/link-icon-3d-render-illustration_567294-4275.jpg
// @include      https://cyberdrop.me/*
// @include      https://files.fm/*
// @include      https://app.koofr.net/*
// @include      https://bunkr.*/*
// @include      https://*.dropbox.com/*
// @include      https://www.redd.tube/*
// @include      https://shiroko.co/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522976/Media%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/522976/Media%20Link%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const uiSettings = {
        'cyberdrop.me': {
            button: { top: '8px', right: '440px', bg: '#008b96', width: '40px', height: '40px' },
            panel: { bg: '#222', textColor: '#8F2AA3' }
        },
        'files.fm': {
            button: { top: '90px', right: '30px', bg: '#181A1B' },
            panel: { bg: '#333', textColor: '#E8E6E3' }
        },
        'app.koofr.net': {
            button: { top: '15px', right: '110px', bg: '#263238' },
            panel: { bg: '#121212', textColor: '#71BA05' }
        },
        'bunkr': {
            button: { top: '13px', right: '290px', bg: '#1E2936' },
            panel: { bg: '#181818', textColor: '#7B39EB' }
        },
        'dropbox.com': {
            button: { top: '15px', right: '290px', bg: '#3E3D3C' },
            panel: { bg: '#232323', textColor: '#3984FF' }
        },
        'redd.tube': {
            button: { top: '5px', right: '390px', bg: '#185DCC' },
            panel: { bg: '#1a1a1a', textColor: '#EDCC32' }
        },
        'shiroko.co': {
            button: { top: '5px', right: '1540px', bg: '#FFFFFF' },
            panel: { bg: '#1a1a1a', textColor: '#FFFFFF' }
        },
        'default': {
            button: { top: '10px', right: '10px', bg: '#10161F' },
            panel: { bg: '#000', textColor: '#10161F' }
        }
    };

    // Supported site configurations
    const siteConfigs = {
        'cyberdrop.me': { selector: '.image-container.column a.image' },

        'files.fm': { selector: '.item.file.image-item a.top_button_download, .item.file.video-item a.top_button_download' },

        'app.koofr.net': { selector: 'a[href^="/content/links/"], a[href^="/links/"]' },

        'bunkr': { selector: 'a[href^="https://bunkrrr.org/"], a[href^="/f/"]' },

        'dropbox.com': { selector: 'a[href^="https://www.dropbox.com/scl/"]' },

        'redd.tube': { selector: 'a[href^="/video/"]' },

        'shiroko.co': { selector: 'a[href^="https://ggredi.info/"]',}
    };

    let mediaLinks = new Set(); // Store unique links

    function getSiteSettings() {
        const host = Object.keys(uiSettings).find(key => window.location.host.includes(key)) || 'default';
        return uiSettings[host];
    }

    function collectMediaLinks() {
        const host = Object.keys(siteConfigs).find(key => window.location.host.includes(key));
        if (!host) return;

        mediaLinks.clear();
        const elements = document.querySelectorAll(siteConfigs[host].selector);
        elements.forEach(el => {
            const link = el.getAttribute('href');
            if (link) {
                mediaLinks.add(link.startsWith('http') ? link : `${window.location.origin}${link}`);
            }
        });
    }

    function createUI() {
        const settings = getSiteSettings();

        // Create Extract Button
        const extractButton = document.createElement('button');
        extractButton.textContent = '☰';
        extractButton.style.position = 'fixed';
        extractButton.style.width = settings.button.width;
        extractButton.style.height = settings.button.height;
        extractButton.style.top = settings.button.top;
        extractButton.style.right = settings.button.right;
        extractButton.style.backgroundColor = settings.button.bg;
        extractButton.style.color = '#fff';
        extractButton.style.border = 'none';
        extractButton.style.padding = '10px 15px';
        extractButton.style.borderRadius = '5px';
        extractButton.style.cursor = 'pointer';
        extractButton.style.zIndex = '10001';

        extractButton.addEventListener('click', () => {
            collectMediaLinks();
            displayLinksUI();
        });

        document.body.appendChild(extractButton);
    }

    function displayLinksUI() {
        if (mediaLinks.size === 0) return;

        const settings = getSiteSettings();

        // Create Popup Container
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '20%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -20%)';
        popup.style.backgroundColor = settings.panel.bg;
        popup.style.padding = '20px';
        popup.style.border = '2px solid ' + settings.panel.textColor;
        popup.style.borderRadius = '10px';
        popup.style.zIndex = '10000';
        popup.style.width = '60%';
        popup.style.boxShadow = `0px 0px 20px rgba(0, 255, 255, 0.3)`;

        // Textarea for Links
        const textarea = document.createElement('textarea');
        textarea.value = Array.from(mediaLinks).join('\n');
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        textarea.style.marginBottom = '10px';
        textarea.style.backgroundColor = '#181818';
        textarea.style.color = settings.panel.textColor;
        textarea.style.border = '1px solid #555';
        textarea.style.borderRadius = '5px';
        textarea.style.padding = '10px';
        textarea.style.fontFamily = 'Consolas, "Courier New", monospace';
        textarea.style.fontSize = '14px';
        textarea.style.resize = 'none';
        popup.appendChild(textarea);

        // Counter
        const counter = document.createElement('div');
        counter.textContent = `Total Unique Links: ${mediaLinks.size}`;
        counter.style.marginBottom = '10px';
        counter.style.fontWeight = 'bold';
        counter.style.textAlign = 'center';
        counter.style.color = settings.panel.textColor;
        popup.appendChild(counter);

        // Copy Button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.padding = '10px';
        copyButton.style.backgroundColor = settings.panel.textColor;
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';
        copyButton.addEventListener('click', () => {
            textarea.select();
            document.execCommand('copy');
            alert('Links copied to clipboard!');
        });
        popup.appendChild(copyButton);

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginLeft = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => document.body.removeChild(popup));
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    }

    createUI();
})();
