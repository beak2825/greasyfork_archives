// ==UserScript==
// @name         VGMdb Info Generator
// @name:zh-CN   VGMdb 信息生成
// @namespace    https://vgmdb.net/
// @version      0.4.3
// @description  VGMdb BBcode-style album information generator
// @description:zh-CN VGMdb BBcode 样式专辑信息生成
// @author       gkouen
// @license      MIT
// @homepage     https://blog.cya.moe/
// @match        *://vgmdb.net/album/*
// @icon         https://vgmdb.net/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/523046/VGMdb%20Info%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/523046/VGMdb%20Info%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const discussSpan = document.querySelector('span.label.smallfont > span#albumtools');
    if (!discussSpan) return;

    const DEFAULT_FORMAT = '[%Date%] %Title%';
    let userFormat = GM_getValue('vgmdb_format_template', DEFAULT_FORMAT);

    const generateInfoButton = document.createElement('a');
    generateInfoButton.textContent = 'Info';
    generateInfoButton.style.cursor = 'pointer';
    generateInfoButton.style.marginLeft = '0px';
    generateInfoButton.style.color = '#ceffff';
    generateInfoButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        generateInfo();
    });

    const formatButton = document.createElement('a');
    formatButton.textContent = 'Format';
    formatButton.style.cursor = 'pointer';
    formatButton.style.marginLeft = '0px';
    formatButton.style.color = '#ceffff';
    formatButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        formatInfo(formatButton);
    });

    const settingsButton = document.createElement('a');
    settingsButton.textContent = '⚙';
    settingsButton.title = 'Configure Format';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.marginLeft = '5px';
    settingsButton.style.color = '#ceffff';
    settingsButton.style.textDecoration = 'none';
    settingsButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        showSettingsModal();
    });

    const separator1 = document.createTextNode(' | ');
    const separator2 = document.createTextNode(' | ');
    discussSpan.appendChild(separator1);
    discussSpan.appendChild(generateInfoButton);
    discussSpan.appendChild(separator2);
    discussSpan.appendChild(formatButton);
    discussSpan.appendChild(settingsButton);

    const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

    function generateInfo() {
        try {
            const coverArt = document.querySelector('#coverart').style.backgroundImage.match(/url\("?(.*?)"?\)/)?.[1];

            const rawTitle = getAlbumTitle();
            const title = sanitizeTitle(rawTitle);

            const catalogNumber = getSiblingValue('Catalog Number');
            const releaseDate = getSiblingValue('Release Date');
            const formattedDate = formatDate(releaseDate);

            const tabs = Array.from(document.querySelectorAll('a[rel^="tl"]'));
            const priorities = ['japanese', 'english', 'romaji'];
            let targetTab = null;
            let selectedLang = '';

            for (const lang of priorities) {
                targetTab = tabs.find(a => a.textContent.trim().toLowerCase() === lang);
                if (targetTab) {
                    selectedLang = lang;
                    break;
                }
            }

            let tracklist = '';

            if (targetTab) {
                const relId = targetTab.getAttribute('rel');
                const tracklistContainer = document.querySelector(`span.tl#${relId}`);

                if (tracklistContainer) {
                    const tables = Array.from(tracklistContainer.querySelectorAll('table'));
                    const validTables = tables.filter(table => table.querySelector('tr.rolebit'));

                    if (validTables.length > 0) {
                        validTables.forEach((table, index) => {
                            if (validTables.length > 1) {
                                if (index > 0) tracklist += '\n';
                                tracklist += `[b]Disc ${index + 1}[/b]\n`;
                            }

                            const trackRows = table.querySelectorAll('tr.rolebit');
                            const tableTracks = Array.from(trackRows).map(row => {
                                const trackNumber = row.querySelector('.label')?.textContent.trim();
                                const trackName = row.querySelector('td[width="100%"]')?.textContent.trim();
                                return `${trackNumber}\t${trackName}`;
                            }).join('\n');

                            tracklist += tableTracks;
                        });
                    } else {
                        const trackRows = tracklistContainer.querySelectorAll('tr.rolebit');
                        tracklist = Array.from(trackRows)
                            .map(row => {
                                const trackNumber = row.querySelector('.label')?.textContent.trim();
                                const trackName = row.querySelector('td[width="100%"]')?.textContent.trim();
                                return `${trackNumber}\t${trackName}`;
                            })
                            .join('\n');
                    }
                }
            } else {
                console.warn('No suitable tracklist found!');
                tracklist = 'No tracklist found in Japanese/English/Romaji.';
            }

            const resultText = `[quote]
[img]${coverArt}[/img]
[b]Title:[/b] ${title}
[b]Catalog number:[/b] ${catalogNumber}
[b]Release date:[/b] ${formattedDate}
[b]Tracklist[/b] (${selectedLang ? selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1) : 'Unknown'}):
[code]
${tracklist}
[/code]
[/quote]`;

            showTemporaryModal(resultText);
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred, please check the console log!');
        }
    }

    function formatInfo(buttonElement) {
        try {
            const title = getAlbumTitle();
            const releaseDate = getSiblingValue('Release Date');
            const catalogNumber = getSiblingValue('Catalog Number');

            const formattedDate = formatDateForClipboard(releaseDate);
            const sanitizedTitle = sanitizeTitle(title);

            let finalString = userFormat
                .replace(/%Date%/g, formattedDate)
                .replace(/%Title%/g, sanitizedTitle)
                .replace(/%Catalog%/g, catalogNumber || 'Unknown_Catalog');

            GM_setClipboard(finalString);
            showTemporaryTooltip(buttonElement, `Copied to clipboard!`);
        } catch (error) {
            console.error('Error:', error);
            showTemporaryTooltip(buttonElement, 'Error!');
        }
    }

    function showSettingsModal() {
        const overlay = createOverlay();
        const modal = createBaseModal('400px');

        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s';

        const title = document.createElement('h3');
        title.textContent = 'Format Settings';
        title.style.marginTop = '0';
        title.style.borderBottom = '1px solid #444';
        title.style.paddingBottom = '10px';

        const desc = document.createElement('p');
        desc.innerHTML = 'Available placeholders:<br>' +
            '<code style="color:#ceffff">%Date%</code> (e.g. 210331)<br>' +
            '<code style="color:#ceffff">%Title%</code> (Album Title)<br>' +
            '<code style="color:#ceffff">%Catalog%</code> (Catalog Number)';
        desc.style.fontSize = '13px';
        desc.style.lineHeight = '1.5';

        const inputLabel = document.createElement('div');
        inputLabel.textContent = 'Template:';
        inputLabel.style.marginBottom = '5px';
        inputLabel.style.fontSize = '14px';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = userFormat;
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '15px';
        input.style.boxSizing = 'border-box';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #555';
        input.style.backgroundColor = '#333';
        input.style.color = '#fff';

        const btnContainer = document.createElement('div');
        btnContainer.style.textAlign = 'right';

        const saveBtn = createPrimaryButton('Save');
        const cancelBtn = createSecondaryButton('Cancel');

        const closeModal = () => {
            modal.style.opacity = '0';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) document.body.removeChild(modal);
                if (overlay.parentNode) document.body.removeChild(overlay);
            }, 300);
        };

        saveBtn.addEventListener('click', () => {
            const newVal = input.value.trim();
            if (newVal) {
                userFormat = newVal;
                GM_setValue('vgmdb_format_template', userFormat);
                saveBtn.textContent = 'Saved!';
                setTimeout(closeModal, 500);
            }
        });

        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        btnContainer.appendChild(saveBtn);
        btnContainer.appendChild(cancelBtn);

        modal.appendChild(title);
        modal.appendChild(desc);
        modal.appendChild(inputLabel);
        modal.appendChild(input);
        modal.appendChild(btnContainer);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.opacity = '1';
        });

        input.focus();
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9998';
        return overlay;
    }

    function createBaseModal(width = '400px') {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#222';
        modal.style.color = '#fff';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
        modal.style.zIndex = '9999';
        modal.style.width = width;
        modal.style.textAlign = 'left';
        return modal;
    }

    function createPrimaryButton(text) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.padding = '6px 15px';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = '#ceffff';
        btn.style.color = '#000';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.fontWeight = 'bold';
        return btn;
    }

    function createSecondaryButton(text) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.padding = '6px 15px';
        btn.style.cursor = 'pointer';
        btn.style.marginLeft = '10px';
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#ceffff';
        btn.style.border = '1px solid #ceffff';
        btn.style.borderRadius = '4px';
        return btn;
    }

    function getAlbumTitle() {
        const jpnTitle = document.querySelector('.albumtitle[lang="ja"]');
        const engTitle = document.querySelector('.albumtitle[lang="en"]');
        return jpnTitle?.textContent.trim() || engTitle?.textContent.trim() || 'Unknown';
    }

    function sanitizeTitle(title) {
        return title
            .replace(/^[\s\/]+|[\s\/]+$/g, '')
            .replace(/\//g, '／')
            .replace(/:/g, '：')
            .replace(/\*/g, '＊')
            .replace(/\?/g, '？')
            .replace(/"/g, '＂')
            .replace(/</g, '＜')
            .replace(/>/g, '＞')
            .replace(/\|/g, '｜');
    }

    function getSiblingValue(labelText) {
        const labelCell = Array.from(document.querySelectorAll('#album_infobit_large td'))
            .find(td => td.textContent.trim() === labelText);
        return labelCell ? labelCell.nextElementSibling.textContent.trim() : '';
    }

    function formatDate(dateString) {
        if (!dateString) return 'Unknown Date';
        const [month, day, year] = dateString.split(' ');
        return `${year}/${months[month]}/${day.replace(',', '')}`;
    }

    function formatDateForClipboard(dateString) {
        if (!dateString) return '000000';
        try {
            const [month, day, year] = dateString.split(' ');
            return `${year.substring(2)}${months[month]}${day.replace(',', '')}`;
        } catch (e) {
            return '000000';
        }
    }

    function showTemporaryTooltip(buttonElement, message) {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#000';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.5s';
        tooltip.style.zIndex = '1000';
        tooltip.style.whiteSpace = 'nowrap';

        const rect = buttonElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

        document.body.appendChild(tooltip);

        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });

        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.remove();
            }, 500);
        }, 1500);
    }

    function showTemporaryModal(text) {
        const overlay = createOverlay();
        const modal = createBaseModal('540px');

        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s';

        const title = document.createElement('h3');
        title.textContent = 'Album Info Generated';
        title.style.marginTop = '0';
        title.style.borderBottom = '1px solid #444';
        title.style.paddingBottom = '10px';

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '300px';
        textarea.textContent = text;
        textarea.style.backgroundColor = '#333';
        textarea.style.color = '#fff';
        textarea.style.border = '1px solid #555';
        textarea.style.borderRadius = '4px';
        textarea.style.padding = '8px';
        textarea.style.boxSizing = 'border-box';
        textarea.style.marginTop = '10px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '12px';

        const btnContainer = document.createElement('div');
        btnContainer.style.textAlign = 'right';
        btnContainer.style.marginTop = '15px';

        const copyBtn = createPrimaryButton('Copy & Close');
        const closeBtn = createSecondaryButton('Close');

        const closeModal = () => {
            modal.style.opacity = '0';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) document.body.removeChild(modal);
                if (overlay.parentNode) document.body.removeChild(overlay);
            }, 300);
        };

        copyBtn.addEventListener('click', () => {
            textarea.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(closeModal, 500);
        });

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        btnContainer.appendChild(copyBtn);
        btnContainer.appendChild(closeBtn);

        modal.appendChild(title);
        modal.appendChild(textarea);
        modal.appendChild(btnContainer);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.opacity = '1';
        });

        textarea.select();
    }
})();