// ==UserScript==
// @name         RED Upload Populator
// @namespace    none
// @version      2.0
// @description  Autofills RED upload fields with modular saved defaults. Settings apply on button press.
// @author       meter
// @match        https://redacted.sh/upload.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533186/RED%20Upload%20Populator.user.js
// @updateURL https://update.greasyfork.org/scripts/533186/RED%20Upload%20Populator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {

        // === SETTINGS BOX ===
        const createSettingsBox = () => {
            const box = document.createElement('div');
            box.style.padding = '10px';
            box.style.marginBottom = '10px';
            box.style.display = 'inline-block';

            const title = document.createElement('strong');
            title.textContent = 'Upload Populator Settings';
            box.appendChild(title);

            // --- Year Setting ---
            const yearLabel = document.createElement('label');
            yearLabel.textContent = ' Year: ';
            yearLabel.style.margin = '0 10px 0';

            const yearInput = document.createElement('input');
            yearInput.type = 'text';
            yearInput.min = '1900';
            yearInput.max = '2100';
            yearInput.style.width = '80px';
            yearInput.value = localStorage.getItem('defaultUploadYear') || '';

            yearInput.addEventListener('input', () => {
                localStorage.setItem('defaultUploadYear', yearInput.value);
            });

            // --- Media Setting ---
            const mediaLabel = document.createElement('label');
            mediaLabel.textContent = ' Media: ';
            mediaLabel.style.margin = '0 10px 0';

            const mediaInput = document.createElement('select');
            ['WEB', 'CD', 'Vinyl', 'DVD', 'Blu-ray'].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                mediaInput.appendChild(option);
            });
            mediaInput.value = localStorage.getItem('defaultMedia') || 'WEB';
            mediaInput.addEventListener('change', () => {
                localStorage.setItem('defaultMedia', mediaInput.value);
            });

            // --- Release Type Setting ---
            const releaseLabel = document.createElement('label');
            releaseLabel.textContent = ' Release Type: ';
            releaseLabel.style.margin = '0 10px 0';

            const releaseInput = document.createElement('select');
            const releaseTypes = {
                'Album': '1',
                'Soundtrack': '3',
                'EP': '5',
                'Anthology': '6',
                'Compilation': '7',
                'Single': '9',
                'Live album': '11',
                'Remix': '13',
                'Bootleg': '14',
                'Interview': '15',
                'Mixtape': '16',
                'Demo': '17',
                'Concert Recording': '18',
                'DJ Mix': '19',
                'Unknown': '21'
            };

            for (const [name, val] of Object.entries(releaseTypes)) {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = name;
                releaseInput.appendChild(opt);
            }
            releaseInput.value = localStorage.getItem('defaultReleaseType') || '1';
            releaseInput.addEventListener('change', () => {
                localStorage.setItem('defaultReleaseType', releaseInput.value);
            });

            // --- 24bit Checkbox Setting ---
            const bitCheckboxLabel = document.createElement('label');
            bitCheckboxLabel.textContent = ' 24bit: ';
            bitCheckboxLabel.style.margin = '0 10px 0';

            const bitCheckbox = document.createElement('input');
            bitCheckbox.type = 'checkbox';
            bitCheckbox.checked = localStorage.getItem('use24bit') === 'true';

            bitCheckbox.addEventListener('change', () => {
                localStorage.setItem('use24bit', bitCheckbox.checked);
            });

            box.appendChild(yearLabel);
            box.appendChild(yearInput);
            box.appendChild(mediaLabel);
            box.appendChild(mediaInput);
            box.appendChild(releaseLabel);
            box.appendChild(releaseInput);
            box.appendChild(bitCheckboxLabel);
            box.appendChild(bitCheckbox);

            return box;
        };

        // === LOCATE INSERTION POINT ===
        const centreP = document.querySelector('p[style*="text-align: center"]');
        if (!centreP) return;

        // === INSERT SETTINGS BOX ===
        const settingsBox = createSettingsBox();
        centreP.insertBefore(settingsBox, centreP.firstChild);
        centreP.insertBefore(document.createElement('br'), settingsBox.nextSibling);
        centreP.insertBefore(document.createElement('br'), settingsBox.nextSibling);

        // === CREATE BUTTONS ===
        const webButton = document.createElement('button');
        webButton.textContent = 'Fill Now!';
        webButton.style.marginLeft = '10px';
        centreP.insertBefore(webButton, settingsBox.nextSibling);

        // === GET COMMON FIELDS ===
        const baseFields = {
            format: document.getElementById('format'),
            bitrate: document.getElementById('bitrate'),
            logs: document.getElementById('upload_logs'),
            desc: document.getElementById('release_desc'),
            year: document.getElementById('year'),
            remasterYear: document.getElementById('remaster_year'),
            releaseType: document.getElementById('releasetype'),
            media: document.getElementById('media'),
        };

        // === HELPERS ===
        const setFormatAndBitrate = (index, format, bitrate, description = '') => {
            const f = document.getElementById(`format_${index}`);
            const b = document.getElementById(`bitrate_${index}`);
            const d = document.getElementById(`extra_release_desc_${index}`);
            if (f && b) {
                f.value = format;
                b.value = bitrate;
            }
            if (d) {
                d.style.display = 'block';
                d.value = description;
            }
        };

        const addFormats = (count) => {
            const addButton = document.getElementById('add_format');
            for (let i = 0; i < count; i++) {
                addButton.click();
            }
        };

        // === WEB BUTTON FUNCTION (uses saved settings) ===
        webButton.addEventListener('click', () => {
            const use24bit = localStorage.getItem('use24bit') === 'true';
            const savedYear = localStorage.getItem('defaultUploadYear') || '';
            const savedMedia = localStorage.getItem('defaultMedia') || 'WEB';
            const savedReleaseType = localStorage.getItem('defaultReleaseType') || '1';

            baseFields.year.value = savedYear;
            baseFields.remasterYear.value = savedYear;
            baseFields.releaseType.value = savedReleaseType;
            baseFields.media.value = savedMedia;

            if (use24bit) {
                addFormats(3);
                baseFields.format.value = "FLAC";
                baseFields.bitrate.value = "24bit Lossless";
                baseFields.desc.value = `${savedMedia} FLAC 24/44.1`;

                setFormatAndBitrate(1, "FLAC", "Lossless", `${savedMedia} FLAC 24/44.1 → 16/44.1`);
                setFormatAndBitrate(2, "MP3", "320", `${savedMedia} FLAC → 320kbps LAME 3.100 MP3 with foobar2000.`);
                setFormatAndBitrate(3, "MP3", "V0 (VBR)", `${savedMedia} FLAC → V0 LAME 3.100 MP3 with foobar2000.`);
            } else {
                addFormats(2);
                baseFields.format.value = "FLAC";
                baseFields.bitrate.value = "Lossless";
                baseFields.desc.value = `${savedMedia} FLAC 16/44.1`;

                setFormatAndBitrate(1, "MP3", "320", `${savedMedia} FLAC → 320kbps LAME 3.100 MP3 with foobar2000.`);
                setFormatAndBitrate(2, "MP3", "V0 (VBR)", `${savedMedia} FLAC → V0 LAME 3.100 MP3 with foobar2000.`);
            }
        });
    });
})();
