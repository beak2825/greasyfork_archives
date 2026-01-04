// ==UserScript==
// @name         Kakuyomu Chapter Copier, Navigator, Downloader with Settings and Bookmarks
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Copies the chapter title and content from Kakuyomu, navigates to next/previous chapters, downloads as .txt, shows stats, includes customizable settings, bookmarks recent chapters, and supports hotkeys
// @author       Baconana-chan
// @match        https://kakuyomu.jp/works/*/episodes/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533182/Kakuyomu%20Chapter%20Copier%2C%20Navigator%2C%20Downloader%20with%20Settings%20and%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/533182/Kakuyomu%20Chapter%20Copier%2C%20Navigator%2C%20Downloader%20with%20Settings%20and%20Bookmarks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load settings
    const defaultSettings = {
        showNotifications: true,
        notificationDuration: 3,
        textFormat: 'plain' // Options: 'plain', 'numbered'
    };
    let settings = GM_getValue('settings', defaultSettings);

    // Load recent chapters
    const recentChapters = GM_getValue('recentChapters', []);
    function saveRecentChapter() {
        const titleElement = document.querySelector('.widget-episodeTitle');
        const title = titleElement ? titleElement.innerText.trim() : 'No Title';
        const url = window.location.href;
        const newChapter = { title, url };

        // Remove duplicates and add new chapter
        const updatedChapters = recentChapters.filter(ch => ch.url !== url);
        updatedChapters.unshift(newChapter);
        if (updatedChapters.length > 5) updatedChapters.pop();
        GM_setValue('recentChapters', updatedChapters);
    }
    saveRecentChapter();

    // Function to save settings
    function saveSettings() {
        GM_setValue('settings', settings);
    }

    // Function to create a styled button
    function createButton(text, rightPosition, topPosition, parent = document.body) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.padding = '12px 20px';
        button.style.backgroundColor = parent === document.body ? '#4CAF50' : '#2196F3';
        button.style.color = 'white';
        button.style.border = parent === document.body ? '2px solid #45a049' : 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        button.style.transition = 'transform 0.2s';
        if (parent === document.body) {
            button.style.position = 'fixed';
            button.style.top = topPosition;
            button.style.right = rightPosition;
            button.style.zIndex = '99999';
        } else {
            button.style.margin = '5px 0';
            button.style.width = '100%';
        }
        
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });

        parent.appendChild(button);
        return button;
    }

    // Function to create a custom notification
    function showNotification(message) {
        if (!settings.showNotifications) return;

        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '100000';
        notification.style.padding = '15px 20px';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        notification.style.transform = 'translateY(20px)';
        notification.style.maxWidth = '300px';
        notification.style.fontSize = '14px';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 500);
        }, settings.notificationDuration * 1000);
    }

    // Function to get chapter text and stats
    function getChapterText() {
        const titleElement = document.querySelector('.widget-episodeTitle');
        const title = titleElement ? titleElement.innerText.trim() : 'No Title';

        const contentElement = document.querySelector('.widget-episodeBody');
        if (!contentElement) {
            return { title: null, content: null, stats: null };
        }

        const paragraphs = contentElement.querySelectorAll('p');
        const contentArray = Array.from(paragraphs)
            .map((p, index) => {
                if (p.classList.contains('blank')) return '';
                const text = p.innerText.trim();
                return settings.textFormat === 'numbered' ? `[${index + 1}] ${text}` : text;
            })
            .filter(text => text !== '');

        const content = contentArray.join('\n\n');

        // Calculate stats
        const wordCount = contentArray.join(' ').split(/\s+/).filter(word => word.length > 0).length;
        const charCount = contentArray.join('').length;
        const paragraphCount = contentArray.length;

        return {
            title,
            content,
            stats: { wordCount, charCount, paragraphCount }
        };
    }

    // Create settings panel
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '180px';
        panel.style.zIndex = '100000';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '2px solid #ccc';
        panel.style.borderRadius = '8px';
        panel.style.padding = '15px';
        panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        panel.style.display = 'none';
        panel.style.fontSize = '14px';
        panel.style.maxWidth = '300px';

        // Download button
        const downloadButton = createButton('Download Chapter', null, null, panel);

        // Stats button
        const statsButton = createButton('Show Stats', null, null, panel);

        // Recent chapters
        const recentLabel = document.createElement('label');
        recentLabel.innerText = 'Recent Chapters: ';
        const recentSelect = document.createElement('select');
        recentSelect.style.margin = '5px';
        recentSelect.style.width = '100%';
        recentChapters.forEach(ch => {
            const opt = document.createElement('option');
            opt.value = ch.url;
            opt.innerText = ch.title;
            recentSelect.appendChild(opt);
        });
        if (recentChapters.length === 0) {
            const opt = document.createElement('option');
            opt.innerText = 'No recent chapters';
            recentSelect.appendChild(opt);
        }

        // Settings form
        const form = document.createElement('div');

        // Notifications toggle
        const notificationLabel = document.createElement('label');
        notificationLabel.innerText = 'Show Notifications: ';
        const notificationCheckbox = document.createElement('input');
        notificationCheckbox.type = 'checkbox';
        notificationCheckbox.checked = settings.showNotifications;
        notificationCheckbox.style.margin = '5px';
        notificationLabel.appendChild(notificationCheckbox);

        // Notification duration
        const durationLabel = document.createElement('label');
        durationLabel.innerText = 'Notification Duration (s): ';
        const durationInput = document.createElement('input');
        durationInput.type = 'number';
        durationInput.min = '1';
        durationInput.max = '10';
        durationInput.value = settings.notificationDuration;
        durationInput.style.width = '50px';
        durationInput.style.margin = '5px';

        // Text format
        const formatLabel = document.createElement('label');
        formatLabel.innerText = 'Text Format: ';
        const formatSelect = document.createElement('select');
        formatSelect.style.margin = '5px';
        ['plain', 'numbered'].forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.innerText = option.charAt(0).toUpperCase() + option.slice(1);
            if (option === settings.textFormat) opt.selected = true;
            formatSelect.appendChild(opt);
        });

        // Save button
        const saveButton = createButton('Save Settings', null, null, panel);

        // Append elements
        panel.appendChild(recentLabel);
        panel.appendChild(recentSelect);
        panel.appendChild(document.createElement('br'));
        panel.appendChild(notificationLabel);
        panel.appendChild(document.createElement('br'));
        panel.appendChild(durationLabel);
        panel.appendChild(durationInput);
        panel.appendChild(document.createElement('br'));
        panel.appendChild(formatLabel);
        panel.appendChild(formatSelect);
        panel.appendChild(document.createElement('br'));

        // Event listeners
        downloadButton.addEventListener('click', () => {
            const { title, content, stats } = getChapterText();
            if (!content) {
                showNotification('Could not find chapter content');
                return;
            }

            const fullText = `${title}\n\n${content}`;
            const blob = new Blob([fullText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showNotification(`Chapter downloaded via button!\nWords: ${stats.wordCount}, Chars: ${stats.charCount}, Paras: ${stats.paragraphCount}`);
        });

        statsButton.addEventListener('click', () => {
            const { title, stats } = getChapterText();
            if (!stats) {
                showNotification('Could not find chapter content');
                return;
            }
            const statsWindow = document.createElement('div');
            statsWindow.style.position = 'fixed';
            statsWindow.style.top = '50%';
            statsWindow.style.left = '50%';
            statsWindow.style.transform = 'translate(-50%, -50%)';
            statsWindow.style.zIndex = '100001';
            statsWindow.style.backgroundColor = '#fff';
            statsWindow.style.border = '2px solid #ccc';
            statsWindow.style.borderRadius = '8px';
            statsWindow.style.padding = '20px';
            statsWindow.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            statsWindow.style.fontSize = '14px';
            statsWindow.style.maxWidth = '300px';
            statsWindow.innerHTML = `
                <h3>Statistics for ${title}</h3>
                <p>Words: ${stats.wordCount}</p>
                <p>Characters (no spaces): ${stats.charCount}</p>
                <p>Paragraphs: ${stats.paragraphCount}</p>
            `;
            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.padding = '8px 12px';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.marginTop = '10px';
            closeButton.style.width = '100%';
            closeButton.addEventListener('click', () => statsWindow.remove());
            statsWindow.appendChild(closeButton);
            document.body.appendChild(statsWindow);
        });

        recentSelect.addEventListener('change', () => {
            if (recentSelect.value) {
                window.location.href = recentSelect.value;
            }
        });

        saveButton.addEventListener('click', () => {
            settings.showNotifications = notificationCheckbox.checked;
            settings.notificationDuration = Math.max(1, Math.min(10, parseInt(durationInput.value) || 3));
            settings.textFormat = formatSelect.value;
            saveSettings();
            showNotification('Settings saved!');
            panel.style.display = 'none';
        });

        return panel;
    }

    // Create buttons
    const copyButton = createButton('Copy Chapter', '20px', '10px');
    const settingsButton = createButton('Settings', '180px', '10px');
    const nextButton = createButton('Next Chapter', '20px', '60px');
    const prevButton = createButton('Prev Chapter', '180px', '60px');

    // Create and append settings panel
    const settingsPanel = createSettingsPanel();
    document.body.appendChild(settingsPanel);

    // Toggle settings panel
    settingsButton.addEventListener('click', () => {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Copy chapter content
    function copyChapter(source) {
        const { title, content, stats } = getChapterText();
        if (!content) {
            showNotification('Could not find chapter content');
            return;
        }

        const fullText = `${title}\n\n${content}`;
        GM_setClipboard(fullText);
        showNotification(`Chapter copied via ${source}!\nWords: ${stats.wordCount}, Chars: ${stats.charCount}, Paras: ${stats.paragraphCount}`);
    }
    copyButton.addEventListener('click', () => copyChapter('button'));

    // Navigate to next chapter
    function goToNextChapter(source) {
        const nextEpisodeLink = document.querySelector('.contentMain-nextEpisode-inner');
        if (!nextEpisodeLink) {
            showNotification('Next chapter link not found');
            return;
        }

        const linkElement = nextEpisodeLink.closest('a');
        if (linkElement && linkElement.href) {
            window.location.href = linkElement.href;
        } else {
            showNotification('Could not find the next chapter URL');
        }
    }
    nextButton.addEventListener('click', () => goToNextChapter('button'));

    // Navigate to previous chapter
    function goToPrevChapter(source) {
        const prevEpisodeLink = document.querySelector('.contentMain-previousEpisode-inner');
        if (!prevEpisodeLink) {
            showNotification('Previous chapter link not found');
            return;
        }

        const linkElement = prevEpisodeLink.closest('a');
        if (linkElement && linkElement.href) {
            window.location.href = linkElement.href;
        } else {
            showNotification('Could not find the previous chapter URL');
        }
    }
    prevButton.addEventListener('click', () => goToPrevChapter('button'));

    // Hotkey support
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'c':
                    e.preventDefault();
                    copyChapter('Ctrl+C');
                    break;
                case 'd':
                    e.preventDefault();
                    const { title, content, stats } = getChapterText();
                    if (!content) {
                        showNotification('Could not find chapter content');
                        return;
                    }
                    const fullText = `${title}\n\n${content}`;
                    const blob = new Blob([fullText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${title}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showNotification(`Chapter downloaded via Ctrl+D!\nWords: ${stats.wordCount}, Chars: ${stats.charCount}, Paras: ${stats.paragraphCount}`);
                    break;
                case 'n':
                    e.preventDefault();
                    goToNextChapter('Ctrl+N');
                    break;
                case 'p':
                    e.preventDefault();
                    goToPrevChapter('Ctrl+P');
                    break;
                case 's':
                    e.preventDefault();
                    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
                    showNotification('Settings toggled via Ctrl+S!');
                    break;
            }
        }
    });
})();