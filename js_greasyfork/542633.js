// ==UserScript==
// @name         Nhentai TSM Tag Catcher
// @namespace    https://sleazyfork.org/en/users/1261593-john-doe4
// @version      1.3
// @description  Gets Tags/Details from Nhentai.net Comics for Tachiyomi/Suwayomi/Mihon with improvements!
// @author       john doe4
// @match        *://nhentai.net/g/*
// @exclude      *://nhentai.net/g/
// @icon         https://nhentai.net/favicon.ico
// @grant        GM_setClipboard
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542633/Nhentai%20TSM%20Tag%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/542633/Nhentai%20TSM%20Tag%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initPreferences() {
        if (localStorage.getItem('nhTheme') === null) {
            localStorage.setItem('nhTheme', 'light');
        }
        if (localStorage.getItem('nhStatus') === null) {
            localStorage.setItem('nhStatus', '2');
        }
    }
    initPreferences();

        var jsonButton = document.createElement('a');
    jsonButton.id = 'download';
    jsonButton.className = 'btn btn-secondary';
    jsonButton.textContent = 'Catcher';
    jsonButton.style.marginLeft = '2px';
    jsonButton.style.padding = '6px 12px';
    jsonButton.style.lineHeight = '1';
    jsonButton.style.fontSize = '14px';
    jsonButton.style.display = 'inline-flex';
    jsonButton.style.alignItems = 'center';
    jsonButton.style.justifyContent = 'center';
    jsonButton.style.boxSizing = 'border-box';
    jsonButton.addEventListener('click', generateJson);
    document.querySelector('.buttons').appendChild(jsonButton);

    var jsonContainer = document.createElement('div');
    jsonContainer.id = 'tachiyomi-json';
    jsonContainer.style.display = 'none';
    jsonContainer.style.marginTop = '15px';
    jsonContainer.style.width = '100%';
    document.getElementById("info").appendChild(jsonContainer);

    var tachiyomiControls = document.createElement('div');
    tachiyomiControls.innerHTML = `
        <div class="tag-container field-name" style="margin-bottom: 10px;">
            <div class="status-buttons" style="display: flex; gap: 10px; margin-top: 5px;">
                <label class="status-btn" style="flex: 1; position: relative;">
                    <input type="radio" name="status" value="1" ${localStorage.getItem('nhStatus') === '1' ? 'checked' : ''} style="position: absolute; opacity: 0; width: 0; height: 0;">
                    <span class="status-label" style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 6px; text-align: center; border-radius: 4px; font-size: 0.9em; background: ${localStorage.getItem('nhStatus') === '1' ? '#4CAF50' : 'inherit'}; color: ${localStorage.getItem('nhStatus') === '1' ? 'white' : 'inherit'}; cursor: pointer;">Ongoing</span>
                </label>
                <label class="status-btn" style="flex: 1; position: relative;">
                    <input type="radio" name="status" value="2" ${localStorage.getItem('nhStatus') !== '1' ? 'checked' : ''} style="position: absolute; opacity: 0; width: 0; height: 0;">
                    <span class="status-label" style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 6px; text-align: center; border-radius: 4px; font-size: 0.9em; background: ${localStorage.getItem('nhStatus') !== '1' ? '#4CAF50' : 'inherit'}; color: ${localStorage.getItem('nhStatus') !== '1' ? 'white' : 'inherit'}; cursor: pointer;">Completed</span>
                </label>
            </div>
        </div>
        <div class="tag-container field-name" style="margin-bottom: 15px;">
            <textarea type="text" id="description" placeholder="Add description"
                      style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); margin-top: 5px; background: inherit; font-size: 14px;"></textarea>
        </div>
    `;
    document.getElementById("tags").appendChild(tachiyomiControls);

    function getPreference(key) {
        return localStorage.getItem(`nh${key}`) === 'true';
    }

    function setPreference(key, value) {
        localStorage.setItem(`nh${key}`, value.toString());

        if (key === 'AutoDownload' && value) {
            localStorage.setItem('nhPageLoadDownload', 'false');
            const pageLoadDownload = document.getElementById('page-load-download');
            if (pageLoadDownload) pageLoadDownload.checked = false;
        } else if (key === 'PageLoadDownload' && value) {
            localStorage.setItem('nhAutoDownload', 'false');
            const autoDownload = document.getElementById('auto-download');
            if (autoDownload) autoDownload.checked = false;
        }
    }

    function getTheme() {
        return localStorage.getItem('nhTheme') || 'light';
    }

    function setTheme(theme) {
        localStorage.setItem('nhTheme', theme);
        applyTheme();
        updateThemeLabel();
        updateStatusButtonsStyle();
        updateButtonStyles();
        updateDescriptionBox();
    }

    function updateThemeLabel() {
        const themeLabel = document.getElementById('theme-label');
        if (themeLabel) {
            themeLabel.textContent = getTheme() === 'dark' ? 'Dark' : 'Light';
        }
    }

    function updateStatusButtonsStyle() {
        const theme = getTheme();
        const selectedStatus = localStorage.getItem('nhStatus');
        document.querySelectorAll('.status-label').forEach(label => {
            const radio = label.parentElement.querySelector('input[type="radio"]');
            if (radio.value === selectedStatus) {
                label.style.backgroundColor = '#4CAF50';
                label.style.color = 'white';
            } else {
                label.style.backgroundColor = theme === 'dark' ? '#3d3d3d' : '#f0f0f0';
                label.style.color = theme === 'dark' ? '#ffffff' : '#333333';
            }
        });
    }

    function updateButtonStyles() {
        const theme = getTheme();
        const buttons = ['copy-btn', 'download-btn', 'catch-tags-btn'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.style.backgroundColor = theme === 'dark' ? '#3d3d3d' : '#f0f0f0';
                btn.style.color = theme === 'dark' ? '#ffffff' : '#333333';
                btn.style.borderColor = theme === 'dark' ? '#444' : '#ddd';
            }
        });
    }

    function updateDescriptionBox() {
        const description = document.getElementById('description');
        if (description) {
            description.style.borderColor = getTheme() === 'dark' ? '#444' : '#ddd';
        }
    }

    function applyTheme() {
        const theme = getTheme();
        const container = document.getElementById('tachiyomi-json');
        if (!container) return;

        const textarea = container.querySelector('textarea');
        if (!textarea) return;

        if (theme === 'dark') {
            container.style.backgroundColor = '#2d2d2d';
            container.style.color = '#ffffff';
            container.style.borderColor = '#444';
            textarea.style.backgroundColor = '#1a1a1a';
            textarea.style.color = '#ffffff';
            textarea.style.borderColor = '#444';
        } else {
            container.style.backgroundColor = '#f5f5f5';
            container.style.color = '#333333';
            container.style.borderColor = '#e0e0e0';
            textarea.style.backgroundColor = '#ffffff';
            textarea.style.color = '#333333';
            textarea.style.borderColor = '#ddd';
        }
        updateStatusButtonsStyle();
        updateButtonStyles();
        updateDescriptionBox();
    }

    function getAuthorFallback() {
        const authorTag = document.querySelectorAll('.tags')[3]?.querySelector('.name');
        if (authorTag) return authorTag.textContent;

        const tagContainers = document.querySelectorAll('.tag-container');
        let groupName = null;

        tagContainers.forEach(container => {
            if (container.textContent.includes('Groups:')) {
                const groupTag = container.querySelector('.tags a');
                if (groupTag) {
                    const groupHref = groupTag.getAttribute('href');
                    groupName = groupHref.split('/group/')[1].replace('/', '');
                }
            }
        });

        if (groupName) return groupName;
        return document.getElementById('gallery_id').textContent.replace('#', '').trim();
    }

    const buttonCooldowns = {};

    function copyToClipboard() {
        const textContent = document.getElementById('json-output')?.value;
        if (textContent) {
            GM_setClipboard(textContent, 'text');

            const btn = document.getElementById('copy-btn');
            if (btn) {
                if (buttonCooldowns['copy']) return;

                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                buttonCooldowns['copy'] = true;

                setTimeout(() => {
                    btn.textContent = originalText;
                    buttonCooldowns['copy'] = false;
                }, 1500);
            }
        }
    }

    function copyTagsToClipboard() {
        const genreTags = Array.from(document.querySelectorAll('.tags')[2]?.querySelectorAll('.name') || [])
            .map(el => el.textContent)
            .join(', ');

        if (genreTags) {
            GM_setClipboard(genreTags, 'text');

            const btn = document.getElementById('catch-tags-btn');
            if (btn) {
                if (buttonCooldowns['tags']) return;

                const originalText = btn.textContent;
                btn.textContent = 'Tags Copied!';
                buttonCooldowns['tags'] = true;

                setTimeout(() => {
                    btn.textContent = originalText;
                    buttonCooldowns['tags'] = false;
                }, 1500);
            }
        }
    }

    function downloadJson() {
        const textContent = document.getElementById('json-output')?.value;
        if (textContent) {
            const blob = new Blob([textContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'details.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    function updateJsonData() {
        const jsonOutput = document.getElementById('json-output');
        if (jsonOutput && jsonOutput.style.display !== 'none') {
            try {
                const genreTags = Array.from(document.querySelectorAll('.tags')[2]?.querySelectorAll('.name') || [])
                    .map(el => el.textContent);

                const jsonData = {
                    title: document.querySelector('.title .pretty')?.textContent || '',
                    author: getAuthorFallback(),
                    artist: getAuthorFallback(),
                    description: document.getElementById('description')?.value || '',
                    genre: genreTags,
                    status: document.querySelector('input[name="status"]:checked')?.value || '2'
                };

                jsonOutput.value = JSON.stringify(jsonData, null, 4);
            } catch (e) {
                console.error('Error updating JSON:', e);
            }
        }
    }

    function generateJson() {
        const jsonDiv = document.getElementById('tachiyomi-json');

        if (jsonDiv.style.display === 'none') {
            jsonDiv.style.display = 'block';
        } else {
            jsonDiv.style.display = 'none';
            return;
        }

        updateJsonData();

        jsonDiv.innerHTML = `
            <div class="tag-container" style="padding: 15px; border-radius: 4px; border: none; width: 100%; box-sizing: border-box;">
                <textarea id="json-output"
                          style="width: 100%; height: 200px; padding: 10px;
                                 border-radius: 4px; margin-bottom: 10px;
                                 font-family: monospace; border: 1px solid var(--border-color);
                                 font-size: 14px; resize: vertical;"></textarea>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-start; width: 100%;">
                    <div style="display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 200px;">
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            <button id="copy-btn" class="btn btn-secondary"
                                    style="padding: 8px 12px; min-width: 120px; font-size: 14px; flex: 1;">
                                Copy to Clipboard
                            </button>
                            <button id="download-btn" class="btn btn-secondary"
                                    style="padding: 8px 12px; min-width: 120px; font-size: 14px; flex: 1;">
                                Download JSON
                            </button>
                            <button id="catch-tags-btn" class="btn btn-secondary"
                                    style="padding: 8px 12px; min-width: 120px; font-size: 14px; flex: 1;">
                                Catch Tags
                            </button>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 5px;">
                            <label style="display: flex; align-items: center; gap: 5px; color: var(--text-color); font-size: 14px;">
                                <input type="checkbox" id="auto-download"
                                       ${getPreference('AutoDownload') ? 'checked' : ''}
                                       style="margin: 0; accent-color: #4CAF50;">
                                Auto Download
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px; color: var(--text-color); font-size: 14px;">
                                <input type="checkbox" id="page-load-download"
                                       ${getPreference('PageLoadDownload') ? 'checked' : ''}
                                       style="margin: 0; accent-color: #4CAF50;">
                                Download on Load
                            </label>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px; margin-left: auto; align-self: flex-end;">
                        <span style="color: var(--text-color); font-size: 14px;">Theme:</span>
                        <label class="switch">
                            <input type="checkbox" id="theme-toggle" ${getTheme() === 'dark' ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                        <span id="theme-label" style="color: var(--text-color); font-size: 14px; min-width: 40px;">${getTheme() === 'dark' ? 'Dark' : 'Light'}</span>
                    </div>
                </div>
            </div>
        `;

        applyTheme();
        updateJsonData();

        document.getElementById('copy-btn')?.addEventListener('click', copyToClipboard);
        document.getElementById('download-btn')?.addEventListener('click', downloadJson);
        document.getElementById('catch-tags-btn')?.addEventListener('click', copyTagsToClipboard);

        document.getElementById('auto-download')?.addEventListener('change', function() {
            setPreference('AutoDownload', this.checked);
        });

        document.getElementById('page-load-download')?.addEventListener('change', function() {
            setPreference('PageLoadDownload', this.checked);
        });

        document.getElementById('theme-toggle')?.addEventListener('change', function() {
            setTheme(this.checked ? 'dark' : 'light');
        });

        document.querySelectorAll('.status-btn input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('nhStatus', this.value);
                    updateStatusButtonsStyle();
                    updateJsonData();
                }
            });
        });

        document.getElementById('description')?.addEventListener('input', function() {
            updateJsonData();
        });

        if (getPreference('AutoDownload')) {
            setTimeout(downloadJson, 100);
        }
    }

    function initStatusButtons() {
        document.querySelectorAll('.status-btn input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('nhStatus', this.value);
                    updateStatusButtonsStyle();
                }
            });
        });
        updateStatusButtonsStyle();
    }

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --border-color: #ddd;
            --text-color: #666;
        }
        .dark-theme {
            --border-color: #444;
            --text-color: #aaa;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #4CAF50;
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .status-btn span {
            transition: all 0.3s ease;
        }
        .status-btn:hover span {
            filter: brightness(0.9);
        }
        #tachiyomi-json .tag-container {
            border: none !important;
            background: inherit !important;
        }
        #copy-btn, #download-btn, #catch-tags-btn {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        #json-output::-webkit-scrollbar {
            width: 8px;
        }
        #json-output::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        #json-output::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
        }
        .dark-theme #json-output::-webkit-scrollbar-track {
            background: #3d3d3d;
        }
        .dark-theme #json-output::-webkit-scrollbar-thumb {
            background: #666;
        }
        @media (max-width: 600px) {
            #tachiyomi-json .tag-container {
                padding: 10px !important;
            }
            #json-output {
                height: 150px !important;
                font-size: 13px !important;
            }
            .status-buttons {
                flex-direction: column !important;
            }
            #copy-btn, #download-btn, #catch-tags-btn {
                padding: 8px 10px !important;
                min-width: 100px !important;
                font-size: 13px !important;
            }
            .status-label {
                padding: 8px !important;
            }
        }
    `;
    document.head.appendChild(style);

    function applyThemeClass() {
        if (getTheme() === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
    applyThemeClass();

    setTimeout(initStatusButtons, 100);

    if (getPreference('PageLoadDownload')) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                generateJson();
                if (document.getElementById('tachiyomi-json')?.style.display === 'block') {
                    downloadJson();
                }
            }, 500);
        });
    }
})();