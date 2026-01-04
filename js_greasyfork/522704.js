// ==UserScript==
// @name         Last.fm Tag Copier
// @namespace    http://tampermonkey.net/
// @version      2025.02.04
// @description  Copy tags from Last.fm music pages
// @author       Flo (https://www.last.fm/de/user/h5JOkT16) (https://github.com/9jS2PL5T)
// @license      MIT
// @match        https://www.last.fm/music/*
// @match        https://www.last.fm/de/music/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522704/Lastfm%20Tag%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/522704/Lastfm%20Tag%20Copier.meta.js
// ==/UserScript==

const SELECTORS = {
    tagsList: '.tags-list--global',
    tagLinks: '.tag a',
    additionalTags: '.big-tags-item-name a'
};

const SPECIAL_CASE_TAGS = {
    'blues rock': 'Blues-Rock',
    'synthpop': 'Synth-Pop',
    'synth pop': 'Synth-Pop',
    'rhythm and blues': 'R&B',
    'rnb': 'R&B'
};

const IGNORED_TAGS = [
    'featuring',
    '10 of 10 stars',
    'c',
    'dnb'
];

function normalizeTagName(tag) {
    const lowercaseTag = tag.toLowerCase();

    // Check for special cases
    if (SPECIAL_CASE_TAGS[lowercaseTag]) {
        return SPECIAL_CASE_TAGS[lowercaseTag];
    }
    return tag;
}

function capitalizeTag(tag) {
    // Check for special cases first
    const lowercaseTag = tag.toLowerCase();
    if (SPECIAL_CASE_TAGS[lowercaseTag]) {
        return SPECIAL_CASE_TAGS[lowercaseTag];
    }

    // Preserve original separators (spaces/hyphens) but capitalize words
    return tag
        .split(/(\s+|-)/g) // Split keeping separators
        .map(part => {
            // If part is separator, keep it unchanged
            if (/[\s-]/.test(part)) return part;
            // Otherwise capitalize
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join(''); // Join without changing separators
}

// Add styles once
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .tag-selector-dialog .modified-tag {
        color: #4caf50; /* Light green */
    }

    .tag-selector-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 1px solid #ccc;
        padding: 6px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 60vh;
        min-width: 200px;
        max-width: 400px;
        width: auto;
        overflow-y: auto;
    }

    .tag-selector-dialog label {
        display: inline-block;
        padding: 0 4px;
        margin: 1px 0;
        cursor: pointer;
        font-size: 18px;
        line-height: 1.1;
        white-space: nowrap;
    }

    .tag-selector-dialog hr {
        margin: 2px 0;
    }

    .tag-selector-dialog label:hover {
        background: #f5f5f5;
    }

    .tag-selector-dialog input[type="checkbox"] {
        margin: 0 4px 0 0;
        transform: scale(0.8);
        vertical-align: middle;
    }

    .copy-button {
        background: #d51007;
        color: white;
        border: none;
        padding: 3px 8px;
        border-radius: 3px;
        margin-top: 4px;
        cursor: pointer;
        font-size: 11px;
        width: 100%;
    }

    .copy-button:hover {
        background: #b31007;
    }

    .tag-copier-success {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        animation: fadeOut 2s forwards;
    }

    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// Debounce helper
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// Show success notification
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'tag-copier-success';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

let isDialogOpen = false;

function createTagSelector(tags) {
    if (isDialogOpen) return;
    isDialogOpen = true;

    const dialog = document.createElement('div');
    dialog.className = 'tag-selector-dialog';

    const form = document.createElement('form');
    const fragment = document.createDocumentFragment();

    const closeDialog = () => {
        dialog.remove();
        isDialogOpen = false;
        cachedTags = null; // Clear cache when closing
        document.removeEventListener('click', handleClickOutside);
    };

    const handleClickOutside = (e) => {
        if (!dialog.contains(e.target) && document.contains(dialog)) {
            closeDialog();
        }
    };

    document.addEventListener('click', handleClickOutside);

    // Add "Select All" checkbox
    const selectAllLabel = document.createElement('label');
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllLabel.appendChild(selectAllCheckbox);
    selectAllLabel.appendChild(document.createTextNode(' Select All'));
    form.appendChild(selectAllLabel);
    form.appendChild(document.createElement('hr'));

    // Add individual tag checkboxes
    const checkboxes = tags.map(tag => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const originalTag = tag.raw;
        const transformedTag = capitalizeTag(tag.normalized);
        checkbox.value = transformedTag;
        label.appendChild(checkbox);

        const tagText = document.createTextNode(' ' + transformedTag);
        const span = document.createElement('span');
        span.appendChild(tagText);

        // Only highlight if tag is in SPECIAL_CASE_TAGS
        const isSpecialCase = !!SPECIAL_CASE_TAGS[originalTag.toLowerCase()];

        if (isSpecialCase) {
            span.className = 'modified-tag';
        }

        label.appendChild(span);
        form.appendChild(label);
        form.appendChild(document.createElement('br'));
        return checkbox;
    });

    // Handle "Select All" functionality
    selectAllCheckbox.addEventListener('change', () => {
        checkboxes.forEach(cb => {
            cb.checked = selectAllCheckbox.checked;
        });
    });

    // Add Copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Selected';
    copyButton.className = 'copy-button';

    copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedTags = checkboxes
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(';');

        navigator.clipboard.writeText(selectedTags)
            .then(() => {
            showSuccess('Tags copied!');
            closeDialog();
        })
            .catch(console.error);
    });

    form.appendChild(copyButton);
    dialog.appendChild(form);

    // Add keyboard navigation
    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDialog();
    });

    return dialog;
}

let cachedTags = null;
let isLoading = false;

async function getArtistTags() {
    try {
        // Get artist Name/URL from current path
        const pathParts = window.location.pathname.split('/');
        const musicIndex = pathParts.indexOf('music');
        if (musicIndex === -1) return [];

        // Extract artist path (everything up to /+tags or next /)
        const artistPath = pathParts
            .slice(0, musicIndex + 2) // Include /music and artist name
            .join('/');

        console.log('Fetching artist tags from:', artistPath + '/+tags');

        const response = await fetch(artistPath + '/+tags');
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');

        const tags = Array.from(doc.querySelectorAll(SELECTORS.additionalTags))
            .slice(0, 5) // Limit to max 5 tags
            .map(tag => ({
                raw: tag.textContent,
                normalized: normalizeTagName(tag.textContent)
            }));

        console.log('Found artist tags (limited to 5):', tags.length);

        return tags;
    } catch (error) {
        console.error('Failed to fetch artist tags:', error);
        return [];
    }
}

async function getAllTags() {
    if (cachedTags) return cachedTags;

    console.log('Starting tag collection...');

    // Get artist name from URL
    const pathParts = window.location.pathname.split('/');
    const musicIndex = pathParts.indexOf('music');
    const artistName = pathParts[musicIndex + 1]?.toLowerCase();

    console.log('Artist name from URL:', artistName);

    const mainTagsList = document.querySelector(SELECTORS.tagsList);
    const currentTags = Array.from(mainTagsList.querySelectorAll(SELECTORS.tagLinks))
        .map(tag => ({
            raw: tag.textContent,
            normalized: normalizeTagName(tag.textContent)
        }))
        .filter(tag => {
            // Filter out artist name
            const isArtistName = tag.raw.toLowerCase() === artistName;
            if (isArtistName) {
                console.log('Filtered out artist name tag:', tag.raw);
                return false;
            }

            // Filter out ignored tags
            const isIgnored = IGNORED_TAGS.includes(tag.raw.toLowerCase());
            if (isIgnored) {
                console.log('Filtered out ignored tag:', tag.raw);
                return false;
            }

            return true;
        });

    console.log('Found current tags:', currentTags.length, currentTags);

    try {
        let allTags = [...currentTags];

        // If at least 5 tags found, get additional tags
        if (allTags.length >= 5) {
            const currentPath = window.location.pathname;
            console.log('Found 5+ tags, fetching additional tags from:', currentPath + '/+tags');

            const response = await fetch(currentPath + '/+tags');
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');

            const additionalTags = Array.from(doc.querySelectorAll(SELECTORS.additionalTags))
                .map(tag => ({
                    raw: tag.textContent,
                    normalized: normalizeTagName(tag.textContent)
                }))
                .filter(tag => tag.raw.toLowerCase() !== artistName);

            console.log('Found additional tags:', additionalTags.length);
            allTags = [...allTags, ...additionalTags];
        }

        console.log('Total tags before artist check:', allTags.length);

        // If less than 3 tags total, get artist tags
        if (allTags.length < 3) {
            console.log('Less than 3 tags found, fetching artist tags...');
            const artistTags = await getArtistTags();
            console.log('Found artist tags:', artistTags.length);
            allTags = [...allTags, ...artistTags];
        }

        // Deduplicate
        const seen = new Set();
        cachedTags = allTags.filter(tag => {
            const normalized = tag.normalized.toLowerCase();
            if (seen.has(normalized)) return false;
            seen.add(normalized);
            return true;
        });

        console.log('Final tag count after deduplication:', cachedTags.length);
        return cachedTags;

    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return currentTags;
    }
}

function createLoadingIndicator() {
    const loader = document.createElement('div');
    loader.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #d51007;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -10px 0 0 -10px;
    `;
    return loader;
}

function copyTags() {
    if (isLoading) return;

    console.log('Starting copy process...');
    isLoading = true;

    // Clean up any existing dialog
    const existingDialog = document.querySelector('.tag-selector-dialog');
    if (existingDialog) {
        existingDialog.remove();
    }
    isDialogOpen = false;

    const tagsList = document.querySelector(SELECTORS.tagsList);
    if (!tagsList) {
        isLoading = false;
        return;
    }

    const loader = createLoadingIndicator();
    tagsList.appendChild(loader);

    getAllTags()
        .then(tags => {
            loader.remove();
            isLoading = false;

            if (tags.length === 0) return;

            // Create and append dialog with slight delay
            setTimeout(() => {
                const dialog = createTagSelector(tags);
                if (dialog) {
                    document.body.appendChild(dialog);
                    // Delay event binding
                    setTimeout(() => {
                        document.addEventListener('click', (e) => {
                            if (!dialog.contains(e.target)) {
                                dialog.remove();
                                isDialogOpen = false;
                            }
                        });
                    }, 100);
                }
            }, 50);
        })
        .catch(error => {
            console.error('Failed:', error);
            loader.remove();
            isLoading = false;
            isDialogOpen = false;
        });
}

function addCopyButton() {
    const button = document.createElement('button');
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z" stroke="white" stroke-width="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="white" stroke-width="2"/>
        </svg>
    `;
    button.title = 'Copy Tags';
    button.style.cssText = `
        width: 32px;
        height: 32px;
        padding: 6px;
        background: #d51007;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    `;
    button.addEventListener('click', copyTags);

    const tagsList = document.querySelector(SELECTORS.tagsList);
    if (tagsList) tagsList.parentNode.insertBefore(button, tagsList);
}

addCopyButton();