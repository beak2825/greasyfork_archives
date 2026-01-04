// ==UserScript==
// @name         RED Torrent Filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hide torrent rows based on checkbox state
// @author       darisk
// @match        https://redacted.sh/torrents.php?id=*
// @icon         https://redacted.sh/static/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521488/RED%20Torrent%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/521488/RED%20Torrent%20Filter.meta.js
// ==/UserScript==

// Configuration
const FILTER_BOX_POSITION = 2; // Use 2 for second child, 3 for third child

// Initialize global variables
let isToggled = false;
let previousCheckboxStates = [];
let showOnlyCheckbox;

(function() {
    'use strict';

    addFilterBox();
    addToggleLink();
    applyFilter();
})();

function applyFilter() {
    if (isToggled) {
        const torrents = Array.from(document.getElementsByClassName('group_torrent'));
        torrents.forEach(row => {
            row.style.display = '';
        });
        updateToggleLink(0);
        return;
    }

    const hideSources = {
        Vinyl: window.localStorage.hideVinyl === "true",
        Web: window.localStorage.hideWeb === "true",
        CD: window.localStorage.hideCD === "true",
        SACD: window.localStorage.hideSACD === "true"
    };
    const hideFormats = {
        MP3: window.localStorage.hideMP3 === "true",
        FLAC: window.localStorage.hideFLAC === "true",
        DSD: window.localStorage.hideDSD === "true"
    };
    const showOnly24Bit = document.getElementById('showOnly24Bit').checked;

    const torrents = Array.from(document.getElementsByClassName('group_torrent'));
    let hiddenCount = 0;

    let currentEditionGroup = [];
    for (let i = 0; i < torrents.length; i++) {
        const row = torrents[i];
        const isEditionRow = row.classList.contains('edition');

        if (isEditionRow && currentEditionGroup.length > 0) {
            hiddenCount += filterEditionGroup(currentEditionGroup, hideSources, hideFormats, showOnly24Bit);
            currentEditionGroup = [];
        }

        currentEditionGroup.push(row);

        // Filter individual torrent rows if not in an edition group
        if (!isEditionRow) {
            const rowText = row.textContent.toLowerCase();
            const is24Bit = rowText.includes('24bit lossless') || rowText.includes('dsd') || rowText.includes('dts');
            let hideRow =
                (hideFormats.MP3 && (rowText.includes('mp3') || rowText.includes('aac'))) ||
                (hideFormats.FLAC && rowText.includes('flac')) ||
                (hideFormats.DSD && (rowText.includes('dsd') || rowText.includes('dxd'))) ||
                (showOnly24Bit && !is24Bit);

            if (hideRow) {
                row.style.display = 'none';
                hiddenCount++;
            } else {
                row.style.display = '';
            }
        }
    }

    // Handle the last edition group if any
    if (currentEditionGroup.length > 0) {
        hiddenCount += filterEditionGroup(currentEditionGroup, hideSources, hideFormats, showOnly24Bit);
    }

    updateToggleLink(hiddenCount);
}


function filterEditionGroup(editionGroup, hideSources, hideFormats, showOnly24Bit) {
    const editionRow = editionGroup[0];
    const childRows = editionGroup.slice(1);
    let shouldHideEdition = false;
    let hiddenCount = 0;

    editionRow.style.display = '';

    const editionText = editionRow.textContent.toLowerCase();

    if (
        (hideSources.Vinyl && /\bvinyl\b$/i.test(editionText.trim())) ||
        (hideSources.Web && /\bweb\b$/i.test(editionText.trim())) ||
        (hideSources.CD && /\bcd\b$/i.test(editionText.trim())) ||
        (hideSources.SACD && (/\bsacd\b$/i.test(editionText.trim()) || /\bblu-ray\b$/i.test(editionText.trim()) || /\bdvd\b$/i.test(editionText.trim())))

    ) {
        shouldHideEdition = true;
    }

    if (shouldHideEdition) {
        editionRow.style.display = 'none';
        childRows.forEach(row => {
            row.style.display = 'none';
            hiddenCount++;
        });
    } else {
        childRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const is24Bit = rowText.includes('24bit lossless') || rowText.includes('dsd') || rowText.includes('dts');

            if (showOnly24Bit && !is24Bit) {
                row.style.display = 'none';
            } else if (
                (hideFormats.MP3 && (/\bmp3\b/.test(rowText) || /\baac\b/.test(rowText))) ||
                (hideFormats.FLAC && /\bflac\b/.test(rowText)) ||
                (hideFormats.DSD && (/\bdsd\b/.test(rowText) || /\bdxd\b/.test(rowText)))
            ) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });
    }

    // If all child rows are hidden, hide the edition row as well
    if (childRows.every(row => row.style.display === 'none')) {
        editionRow.style.display = 'none';
    }

    return hiddenCount;
}


// Helper function to add checkboxes
function addCheckboxes(parent, items, headerText, padding = '3px') {
    const header = document.createElement('p');
    header.innerHTML = `<strong>${headerText}</strong>`;
    header.style.marginBottom = padding;
    parent.appendChild(header);

    items.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `hide${item}`;
        checkbox.checked = window.localStorage[`hide${item}`] === "true";
        checkbox.addEventListener('change', () => {
            window.localStorage[`hide${item}`] = checkbox.checked;
            applyFilter();
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));
        label.style.marginRight = '8px';
        parent.appendChild(label);
    });

    parent.appendChild(document.createElement('br'));
    parent.appendChild(document.createElement('br'));
}

function addFilterBox() {
    const box = document.createElement('div');
    const sidebar = document.getElementsByClassName('sidebar')[0];
    const targetChild = FILTER_BOX_POSITION === 1
    ? sidebar.firstChild
    : sidebar.children[FILTER_BOX_POSITION - 1];
    box.className = 'box';

    const header = document.createElement('div');
    header.className = 'head';
    header.innerHTML = '<strong>Torrent Filter</strong>';
    box.appendChild(header);

    const body = document.createElement('div');
    body.className = 'body';
    box.appendChild(body);

    // Sources and formats checkboxes
    const sources = ['Vinyl', 'Web', 'CD', 'SACD'];
    const formats = ['MP3', 'FLAC', 'DSD'];
    addCheckboxes(body, sources, 'Hide Sources');
    addCheckboxes(body, formats, 'Hide Formats');

    // Show Only 24 Bit checkbox
    const showOnlyHeader = document.createElement('p');
    showOnlyHeader.innerHTML = '<strong>Show Only</strong>';
    showOnlyHeader.style.marginBottom = '3px';
    body.appendChild(showOnlyHeader);

    const showOnlyLabel = document.createElement('label');
    showOnlyCheckbox = document.createElement('input');
    showOnlyCheckbox.type = 'checkbox';
    showOnlyCheckbox.id = 'showOnly24Bit';
    showOnlyCheckbox.checked = window.localStorage.showOnly24Bit === "true";
    showOnlyCheckbox.addEventListener('change', () => {
        window.localStorage.showOnly24Bit = showOnlyCheckbox.checked;
        applyFilter();
    });

    showOnlyLabel.appendChild(showOnlyCheckbox);
    showOnlyLabel.appendChild(document.createTextNode(' 24 bit'));
    body.appendChild(showOnlyLabel);

    sidebar.insertBefore(box, targetChild);
}

// Function to add a toggle link that also shows hidden row count
function addToggleLink() {
    const linkbox = document.querySelector('.linkbox');

    let toggleLink = linkbox.querySelector('.toggle-link');
    if (!toggleLink) {
        toggleLink = document.createElement('a');
        toggleLink.className = 'toggle-link';
        toggleLink.href = '#';
        toggleLink.innerText = '[Toggle Hidden: 0]';

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            const allCheckboxes = document.querySelectorAll('.box input[type="checkbox"]');

            if (isToggled) {
                // Restore previous checkbox states
                allCheckboxes.forEach((checkbox, index) => {
                    checkbox.checked = previousCheckboxStates[index];
                    window.localStorage[checkbox.id] = checkbox.checked;
                });
                showOnlyCheckbox.checked = previousCheckboxStates[allCheckboxes.length];
                window.localStorage.showOnly24Bit = showOnlyCheckbox.checked;
                isToggled = false;
            } else {
                // Save current checkbox states and uncheck all
                previousCheckboxStates = [...allCheckboxes].map(checkbox => checkbox.checked);
                previousCheckboxStates.push(showOnlyCheckbox.checked);
                allCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                    window.localStorage[checkbox.id] = checkbox.checked;
                });
                showOnlyCheckbox.checked = false;
                window.localStorage.showOnly24Bit = false;
                isToggled = true;
            }

            applyFilter();
        });

        linkbox.appendChild(toggleLink);
    }
}

// Function to update the hidden count in the toggle link text
function updateToggleLink(hiddenCount) {
    const toggleLink = document.querySelector('.linkbox .toggle-link');
    if (toggleLink) {
        toggleLink.innerHTML = `[Toggle Hidden${hiddenCount > 0 ? `: <span style="color: #ff0000;">${hiddenCount}</span>` : ': 0'}]`;
    }
}
