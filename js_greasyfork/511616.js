// ==UserScript==
// @name         Wikipedia Wikibase Enhanced
// @namespace    Wikibase
// @version      1.0
// @description  Enhance the display of Wikimedia dump files with sorting and size conversion options.
// @match        https://dumps.wikimedia.org/other/*/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://dumps.wikimedia.org/&size=256
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511616/Wikipedia%20Wikibase%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/511616/Wikipedia%20Wikibase%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const switchContainer = document.createElement('div');
    switchContainer.style.position = 'fixed';
    switchContainer.style.top = '80px';
    switchContainer.style.right = '10px';
    switchContainer.style.padding = '20px';
    switchContainer.style.backgroundColor = '#ffffff';
    switchContainer.style.border = '2px solid #007bff';
    switchContainer.style.borderRadius = '10px';
    switchContainer.style.zIndex = '1000';
    switchContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    switchContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
    switchContainer.style.fontSize = '16px';

    switchContainer.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <label style="margin-right: 15px;">
                <input type="radio" name="sizeSwitch" value="original" checked style="transform: scale(1.5); margin-right: 10px;"> Bytes
            </label>
            <label style="margin-right: 15px;">
                <input type="radio" name="sizeSwitch" value="KB" style="transform: scale(1.5); margin-right: 10px;"> KB
            </label>
            <label style="margin-right: 15px;">
                <input type="radio" name="sizeSwitch" value="MB" style="transform: scale(1.5); margin-right: 10px;"> MB
            </label>
            <label style="margin-right: 15px;">
                <input type="radio" name="sizeSwitch" value="GB" style="transform: scale(1.5); margin-right: 10px;"> GB
            </label>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <label style="margin-right: 15px;">
                <input type="radio" name="sortOption" value="none" checked style="transform: scale(1.5); margin-right: 10px;"> Sort by Name (Default)
            </label>
            <label style="margin-right: 15px;">
                <input type="radio" name="sortOption" value="size" style="transform: scale(1.5); margin-right: 10px;"> Sort by Size
            </label>
            <label style="margin-right: 15px;">
                <input type="radio" name="sortOption" value="date" style="transform: scale(1.5); margin-right: 10px;"> Sort by Date
            </label>
        </div>
        <div>
            <input type="text" id="fileSearchInput" placeholder="Search records..." style="width: 100%; padding: 10px; margin-top: 20px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"/>
        </div>
    `;

    document.body.appendChild(switchContainer);

    document.querySelectorAll('pre').forEach((preTag) => {
        const originalPreTagContent = preTag.innerHTML;
        const lines = preTag.innerHTML.split('\n');
        const allElements = [];
        let hasParentDirectory = false;

        function parseDate(dateString) {
            const months = {
                Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
                Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
            };
            const dateParts = dateString.match(/(\d{2})-(\w{3})-(\d{4}) (\d{2}):(\d{2})/);
            if (!dateParts) return null;
            const day = dateParts[1];
            const month = months[dateParts[2]];
            const year = dateParts[3];
            const hours = dateParts[4];
            const minutes = dateParts[5];
            return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const linkMatch = line.match(/<a\s+href="([^"]*)".*?>(.*?)<\/a>/);
            if (linkMatch) {
                const linkHref = linkMatch[1];
                const linkText = linkMatch[2];
                if (linkText === '../') {
                    hasParentDirectory = true;
                    allElements.unshift({
                        lineIndex: i,
                        linkTag: `<a href="${linkHref}">${linkText}</a>`,
                        linkText,
                        dateTime: '',
                        parsedDate: null,
                        sizeInBytes: null,
                        originalText: line,
                        isFolder: true
                    });
                    continue;
                }

                const fileMatch = line.match(/<a.+<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})\s+(\d+)/);
                if (fileMatch) {
                    const dateTime = fileMatch[1];
                    const sizeValue = fileMatch[2];
                    const sizeInBytes = parseInt(sizeValue, 10);
                    const parsedDate = parseDate(dateTime);
                    allElements.push({
                        lineIndex: i,
                        linkTag: `<a href="${linkHref}">${linkText}</a>`,
                        linkText,
                        dateTime,
                        parsedDate,
                        sizeInBytes,
                        originalText: line,
                        isFolder: false
                    });
                } else {
                    const folderMatch = line.match(/<a.+<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})/);
                    if (folderMatch) {
                        const dateTime = folderMatch[1];
                        const parsedDate = parseDate(dateTime);
                        allElements.push({
                            lineIndex: i,
                            linkTag: `<a href="${linkHref}">${linkText}</a>`,
                            linkText,
                            dateTime,
                            parsedDate,
                            sizeInBytes: null,
                            originalText: line,
                            isFolder: true
                        });
                    } else {
                        allElements.push({
                            lineIndex: i,
                            linkTag: `<a href="${linkHref}">${linkText}</a>`,
                            linkText,
                            dateTime: '',
                            parsedDate: null,
                            sizeInBytes: null,
                            originalText: line,
                            isFolder: true
                        });
                    }
                }
            }
        }

        function updateDisplay(unit) {
            const searchInput = document.getElementById('fileSearchInput').value.toLowerCase();
            const sortOption = document.querySelector('input[name="sortOption"]:checked').value;

            let updatedElements = [...allElements];

            if (searchInput) {
                updatedElements = updatedElements.filter(item => item.linkText.toLowerCase().includes(searchInput) || item.linkText === '../');
            }

            if (sortOption === 'size') {
                updatedElements.sort((a, b) => {
                    if (a.sizeInBytes === null && b.sizeInBytes === null) {
                        return 0;
                    } else if (a.sizeInBytes === null) {
                        return 1;
                    } else if (b.sizeInBytes === null) {
                        return -1;
                    } else {
                        return b.sizeInBytes - a.sizeInBytes;
                    }
                });
            } else if (sortOption === 'date') {
                updatedElements.sort((a, b) => {
                    if (a.parsedDate === null && b.parsedDate === null) {
                        return 0;
                    } else if (a.parsedDate === null) {
                        return 1;
                    } else if (b.parsedDate === null) {
                        return -1;
                    } else {
                        return b.parsedDate - a.parsedDate;
                    }
                });
            } else if (sortOption === 'none') {
                updatedElements.sort((a, b) => a.linkText.localeCompare(b.linkText));
            }

            if (hasParentDirectory) {
                const parentDirectory = updatedElements.find(item => item.linkText === '../');
                updatedElements = [parentDirectory, ...updatedElements.filter(item => item.linkText !== '../')];
            }

            updatedElements.forEach(item => {
                if (item.isFolder) {
                    item.formattedSize = '-';
                } else {
                    if (unit === 'original') {
                        item.formattedSize = item.sizeInBytes ? item.sizeInBytes.toString() : '-';
                    } else {
                        let sizeValue;
                        switch (unit) {
                            case 'KB':
                                sizeValue = (item.sizeInBytes / 1024);
                                break;
                            case 'MB':
                                sizeValue = (item.sizeInBytes / (1024 * 1024));
                                break;
                            case 'GB':
                                sizeValue = (item.sizeInBytes / (1024 * 1024 * 1024));
                                break;
                        }
                        const sizeStr = sizeValue ? sizeValue.toFixed(2) : '-';
                        item.formattedSize = sizeStr + ' ' + unit;
                    }
                }
            });

            const maxLinkTextLength = Math.max(...updatedElements.map(item => item.linkText.length));
            const maxSizeLength = Math.max(...updatedElements.map(item => item.formattedSize.length));

            const updatedLines = updatedElements.map(item => {
                const paddedLinkText = item.linkText.padEnd(maxLinkTextLength, ' ');
                const newLinkTag = `<a href="${item.linkTag.match(/href="([^"]*)"/)[1]}" style="text-decoration: none;">${paddedLinkText}</a>`;
                const dateTime = item.dateTime ? item.dateTime : ''.padEnd(20, ' ');
                const paddedFormattedSize = item.formattedSize.padEnd(maxSizeLength, ' ');

                const spacesBeforeDate = ' '.repeat(51 - paddedLinkText.length);
                const spacesBeforeSize = ' '.repeat(8);

                let line = `${newLinkTag}${spacesBeforeDate}${dateTime}${spacesBeforeSize}${paddedFormattedSize}`;
                return `<span style="display: inline;">${line}</span>`;
            });

            preTag.innerHTML = updatedLines.join('\n');
        }

        document.querySelectorAll('input[name="sizeSwitch"]').forEach((input) => {
            input.addEventListener('change', (event) => {
                updateDisplay(event.target.value);
            });
        });

        document.querySelectorAll('input[name="sortOption"]').forEach((input) => {
            input.addEventListener('change', () => {
                const selectedUnit = document.querySelector('input[name="sizeSwitch"]:checked').value;
                updateDisplay(selectedUnit);
            });
        });

        document.getElementById('fileSearchInput').addEventListener('input', () => {
            const selectedUnit = document.querySelector('input[name="sizeSwitch"]:checked').value;
            updateDisplay(selectedUnit);
        });

        const selectedUnit = document.querySelector('input[name="sizeSwitch"]:checked').value;
        updateDisplay(selectedUnit);
    });
})();
