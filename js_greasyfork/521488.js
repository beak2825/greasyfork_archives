// ==UserScript==
// @name         RED Torrent Filter
// @namespace    http://tampermonkey.net/
// @version      1.2
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

let isToggled = false;
let savedFilterState = null;

(function() {
    'use strict';

    addFilterBox();
    addToggleLink();
    applyFilter();
})();

function getFilterSettings() {
    return {
        hideSources: {
            Vinyl: localStorage.hideVinyl === "true",
            Web: localStorage.hideWeb === "true",
            CD: localStorage.hideCD === "true",
            SACD: localStorage.hideSACD === "true"
        },
        hideFormats: {
            MP3: localStorage.hideMP3 === "true",
            FLAC: localStorage.hideFLAC === "true",
            DSD: localStorage.hideDSD === "true"
        },
        showOnly24Bit: localStorage.showOnly24Bit === "true"
    };
}

function is24BitAudio(text) {
    return /24bit lossless|dsd|dts/i.test(text);
}

function shouldHideByFormat(text, hideFormats) {
    return (
        (hideFormats.MP3 && /\b(mp3|aac)\b/i.test(text)) ||
        (hideFormats.FLAC && /\bflac\b/i.test(text)) ||
        (hideFormats.DSD && /\b(dsd|dxd)\b/i.test(text))
    );
}

function shouldHideBySource(text, hideSources) {
    const trimmedText = text.trim();
    return (
        (hideSources.Vinyl && /\bvinyl$/i.test(trimmedText)) ||
        (hideSources.Web && /\bweb$/i.test(trimmedText)) ||
        (hideSources.CD && /\bcd$/i.test(trimmedText)) ||
        (hideSources.SACD && /\b(sacd|blu-ray|dvd)$/i.test(trimmedText))
    );
}

function applyFilter() {
    const torrents = Array.from(document.getElementsByClassName('group_torrent'));

    if (isToggled) {
        torrents.forEach(row => row.style.display = '');
        updateToggleLink(0);
        return;
    }

    const settings = getFilterSettings();
    let hiddenCount = 0;
    let currentEditionGroup = [];
    let i = 0;

    while (i < torrents.length) {
        const row = torrents[i];
        const isEditionRow = row.classList.contains('edition');

        if (isEditionRow) {
            currentEditionGroup = [row];
            i++;

            while (i < torrents.length && !torrents[i].classList.contains('edition')) {
                currentEditionGroup.push(torrents[i]);
                i++;
            }

            hiddenCount += filterEditionGroup(currentEditionGroup, settings);
        } else {
            hiddenCount += filterStandaloneTorrent(row, settings);
            i++;
        }
    }

    updateToggleLink(hiddenCount);
}

function filterStandaloneTorrent(row, settings) {
    const rowText = row.textContent.toLowerCase();

    if (settings.showOnly24Bit) {
        const hideRow = !is24BitAudio(rowText);
        row.style.display = hideRow ? 'none' : '';
        return hideRow ? 1 : 0;
    }

    const hideRow = shouldHideByFormat(rowText, settings.hideFormats);
    row.style.display = hideRow ? 'none' : '';
    return hideRow ? 1 : 0;
}

function filterEditionGroup(editionGroup, settings) {
    const editionRow = editionGroup[0];
    const childRows = editionGroup.slice(1);
    let hiddenCount = 0;

    const editionText = editionRow.textContent.toLowerCase();

    if (settings.showOnly24Bit) {
        editionRow.style.display = '';

        childRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const hideRow = !is24BitAudio(rowText);

            if (hideRow) {
                row.style.display = 'none';
                hiddenCount++;
            } else {
                row.style.display = '';
            }
        });

        if (childRows.length > 0 && childRows.every(row => row.style.display === 'none')) {
            editionRow.style.display = 'none';
        }

        return hiddenCount;
    }

    const hideEdition = shouldHideBySource(editionText, settings.hideSources);

    if (hideEdition) {
        editionRow.style.display = 'none';
        childRows.forEach(row => {
            row.style.display = 'none';
            hiddenCount++;
        });
    } else {
        editionRow.style.display = '';

        childRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const hideRow = shouldHideByFormat(rowText, settings.hideFormats);

            if (hideRow) {
                row.style.display = 'none';
                hiddenCount++;
            } else {
                row.style.display = '';
            }
        });

        if (childRows.length > 0 && childRows.every(row => row.style.display === 'none')) {
            editionRow.style.display = 'none';
        }
    }

    return hiddenCount;
}

function addCheckboxes(parent, items, headerText) {
    const header = document.createElement('p');
    header.innerHTML = `<strong>${headerText}</strong>`;
    header.style.marginBottom = '3px';
    parent.appendChild(header);

    items.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `hide${item}`;
        checkbox.checked = localStorage[`hide${item}`] === "true";
        checkbox.addEventListener('change', () => {
            localStorage[`hide${item}`] = checkbox.checked;
            isToggled = false;
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
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const box = document.createElement('div');
    box.className = 'box';

    const header = document.createElement('div');
    header.className = 'head';

    const headerContent = document.createElement('strong');
    headerContent.textContent = 'Torrent Filter';

    const toggleLink = document.createElement('a');
    toggleLink.href = '#';
    toggleLink.textContent = '[-]';
    toggleLink.style.cssText = 'float: right; font-weight: normal;';

    header.appendChild(headerContent);
    header.appendChild(toggleLink);
    box.appendChild(header);

    const body = document.createElement('div');
    body.className = 'body';
    body.id = 'torrent-filter-body';

    const isCollapsed = localStorage.getItem('filterBoxCollapsed') === 'true';
    if (isCollapsed) {
        body.style.display = 'none';
        toggleLink.textContent = '[+]';
    }

    box.appendChild(body);

    const sources = ['Vinyl', 'Web', 'CD', 'SACD'];
    const formats = ['MP3', 'FLAC', 'DSD'];
    addCheckboxes(body, sources, 'Hide Sources');
    addCheckboxes(body, formats, 'Hide Formats');

    const showOnlyHeader = document.createElement('p');
    showOnlyHeader.innerHTML = '<strong>Show Only</strong>';
    showOnlyHeader.style.marginBottom = '3px';
    body.appendChild(showOnlyHeader);

    const showOnlyLabel = document.createElement('label');
    const showOnlyCheckbox = document.createElement('input');
    showOnlyCheckbox.type = 'checkbox';
    showOnlyCheckbox.id = 'showOnly24Bit';
    showOnlyCheckbox.checked = localStorage.showOnly24Bit === "true";
    showOnlyCheckbox.addEventListener('change', () => {
        localStorage.showOnly24Bit = showOnlyCheckbox.checked;
        isToggled = false;
        applyFilter();
    });

    showOnlyLabel.appendChild(showOnlyCheckbox);
    showOnlyLabel.appendChild(document.createTextNode(' 24 bit'));
    body.appendChild(showOnlyLabel);

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyCollapsed = body.style.display === 'none';
        body.style.display = isCurrentlyCollapsed ? '' : 'none';
        toggleLink.textContent = isCurrentlyCollapsed ? '[-]' : '[+]';
        localStorage.setItem('filterBoxCollapsed', !isCurrentlyCollapsed);
    });

    const targetChild = FILTER_BOX_POSITION === 1
    ? sidebar.firstChild
    : sidebar.children[FILTER_BOX_POSITION - 1];
    sidebar.insertBefore(box, targetChild);
}

function addToggleLink() {
    const linkbox = document.querySelector('.linkbox');
    if (!linkbox) return;

    const toggleLink = document.createElement('a');
    toggleLink.className = 'toggle-link';
    toggleLink.href = '#';
    toggleLink.innerText = '[Toggle Hidden: 0]';

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();

        if (isToggled) {
            if (savedFilterState) {
                Object.entries(savedFilterState).forEach(([key, value]) => {
                    localStorage[key] = value;
                    const checkbox = document.getElementById(key);
                    if (checkbox) checkbox.checked = value === "true";
                });
            }
            isToggled = false;
        } else {
            savedFilterState = {};
            const allCheckboxes = document.querySelectorAll('.box input[type="checkbox"]');

            allCheckboxes.forEach(checkbox => {
                savedFilterState[checkbox.id] = localStorage[checkbox.id] || "false";
            });

            isToggled = true;
        }

        applyFilter();
    });

    linkbox.appendChild(toggleLink);
}

function updateToggleLink(hiddenCount) {
    const toggleLink = document.querySelector('.linkbox .toggle-link');
    if (toggleLink) {
        toggleLink.innerHTML = `[Toggle Hidden${hiddenCount > 0 ? `: <span style="color: #ff0000;">${hiddenCount}</span>` : ': 0'}]`;
    }
}