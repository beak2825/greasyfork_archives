// ==UserScript==
// @name              Edna.cz Subtitle Downloader
// @name:cs           Edna.cz Stahovač Titulků
// @namespace         https://greasyfork.org/users/30331-setcher
// @author            Setcher
// @description       Gives you the opportunity to download the subtitles or go directly to the original YT video
// @description:cs    Přidává možnost stáhnout titulky nebo přejít na původní YT video
// @include           http*://*edna.cz/*
// @version           1.0.0
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/17094/Ednacz%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/17094/Ednacz%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Language settings
    const lang = {
        en: {
            downloadSubs: 'Download subtitles',
            noSubs: 'Subtitles not found',
            goToYT: 'Go to YouTube',
            noYT: 'YT link not found',
            menuOption: 'Open YT links in new tab',
            menuTitle: 'Settings',
            settingsTitle: 'Edna.cz Subtitle Downloader Settings',
            settingsAlt: 'Settings',
            closeButton: 'Close'
        },
        cs: {
            downloadSubs: 'Stáhnout titulky',
            noSubs: 'Titulky nenalezeny',
            goToYT: 'Přejít na YouTube',
            noYT: 'YT link nenalezen',
            menuOption: 'Otevírat YT odkazy v novém panelu',
            menuTitle: 'Nastavení',
            settingsTitle: 'Nastavení pro Edna.cz Stahovač Titulků',
            settingsAlt: 'Nastavení',
            closeButton: 'Zavřít'
        }
    };

    // Get current language
    const userLang = (navigator.language.startsWith('cs')) ? 'cs' : 'en';
    const t = lang[userLang];

    // Create settings dialog
    function showSettings() {
        const currentValue = GM_getValue('ytNewTab', false);
        let valueChanged = false;

        // Create dialog container with unique ID
        const dialog = document.createElement('div');
        dialog.id = 'edna-settings-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 300px;
            background-color: #252338;
        `;

        // Add title
        const title = document.createElement('h3');
        title.textContent = t.settingsTitle;
        title.style.marginTop = '0';
        title.style.marginBottom = '20px';
        dialog.appendChild(title);

        // Add checkbox
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.margin = '15px 0';
        label.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = currentValue;
        checkbox.style.marginRight = '10px';
        checkbox.addEventListener('change', function() {
            valueChanged = this.checked !== currentValue;
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(t.menuOption));
        dialog.appendChild(label);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = t.closeButton;
        closeButton.style.cssText = `
            padding: 5px 15px;
            margin-top: 20px;
            float: right;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        closeButton.addEventListener('click', function() {
            GM_setValue('ytNewTab', checkbox.checked);
            document.body.removeChild(dialog);
            if (valueChanged) {
                location.reload();
            }
        });
        dialog.appendChild(closeButton);

        // Clear float
        const clearfix = document.createElement('div');
        clearfix.style.clear = 'both';
        dialog.appendChild(clearfix);

        // Add to page
        document.body.appendChild(dialog);
    }

    // Register settings menu
    GM_registerMenuCommand(t.menuTitle, showSettings);

    function addDownloadLinks() {
        const jwplayers = document.getElementsByClassName('video-box');
        if (!jwplayers.length) return;

        for (let i = 0; i < jwplayers.length; i++) {
            let result, youtube;

            // Method 1: Check for data attributes
            const dataSource = jwplayers[i].querySelector('[data-video], [data-subtitles]');
            if (dataSource) {
                const subtitles = dataSource.getAttribute('data-subtitles');
                result = subtitles ? 'http://www.edna.cz/runtime/userfiles/' + subtitles.split("/").pop().replace(/\..+$/, '.srt') : null;
                youtube = dataSource.getAttribute('data-video');
            }
            // Method 2: Fallback to regex
            else {
                const ytMatch = jwplayers[i].innerHTML.match(/video_id:\s"([^"]+)/);
                const srtMatch = jwplayers[i].innerHTML.match(/subtitles:\s*?"([^"]+)/);
                youtube = ytMatch ? ytMatch[1].replace(/\\/g, "") : null;
                result = srtMatch ? srtMatch[1].replace(/\\/g, "") : null;
            }

            // Create container for buttons
            const zNode = document.createElement('div');
            zNode.style.cssText = 'text-align: center; margin: 20px 0; white-space: nowrap;';

            // Subtitle download button
            const srtLink = document.createElement('a');
            srtLink.textContent = result ? t.downloadSubs : t.noSubs;
            srtLink.className = result ? 'light-white btn btn-primary btn-sm' : 'btn btn-sm btn-warning';
            if (result) {
                srtLink.href = result;
                srtLink.download = result.split("/").pop().split("?")[0];
            }
            zNode.appendChild(srtLink);

            // Space between buttons
            zNode.appendChild(document.createTextNode(' '));

            // YouTube link button
            const ytLink = document.createElement('a');
            ytLink.textContent = youtube ? t.goToYT : t.noYT;
            ytLink.className = youtube ? 'light-white btn btn-primary btn-sm' : 'btn btn-sm btn-warning';
            if (youtube) {
                ytLink.href = youtube;
                if (GM_getValue('ytNewTab', false)) {
                    ytLink.target = '_blank';
                    ytLink.rel = 'noopener noreferrer';
                }
            }
            zNode.appendChild(ytLink);

            // Space between buttons
            zNode.appendChild(document.createTextNode(' '));

            // Settings button
            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = '⚙️';
            settingsBtn.className = 'light-white btn btn-primary btn-sm'
            settingsBtn.name = t.settingsAlt;
            settingsBtn.addEventListener('click', showSettings);
            zNode.appendChild(settingsBtn);

            // Insert buttons
            jwplayers[i].parentNode.insertBefore(zNode, jwplayers[i].nextSibling);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDownloadLinks);
    } else {
        addDownloadLinks();
    }

    // CSS for buttons and modal - now properly scoped
    GM_addStyle(`
        .btn {
            display: inline-block !important;
            margin: 0 5px !important;
            white-space: nowrap !important;
            cursor: pointer !important;
        }

        /* Scoped to our dialog only */
        #edna-settings-dialog {
            background-color: #343a40 !important;
            color: #f8f9fa !important;
        }

        #edna-settings-dialog h3 {
            color: inherit !important;
        }
    `);
})();