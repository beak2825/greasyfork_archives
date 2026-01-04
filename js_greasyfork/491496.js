// ==UserScript==
// @name         PTP Archive Web UI
// @namespace    PTP
// @description  Provides a web UI for archiving torrents.
// @version      8
// @license      MIT
// @match        https://*.passthepopcorn.me/archive.php
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/491496/PTP%20Archive%20Web%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/491496/PTP%20Archive%20Web%20UI.meta.js
// ==/UserScript==

'use strict';

// Sleep interval between "/archive.php?action=fetch" calls.
// Don't lower it below 10.
// See: "at least a 10 second sleep between fetch calls"
// https://passthepopcorn.me/forums.php?action=viewthread&threadid=43935&postid=2331055#post2331055
// Also: "A fetch is actually a very load intense operation"
// https://passthepopcorn.me/forums.php?action=viewthread&threadid=42178&postid=2327351#post2327351
const BATCH_DL_SLEEP_SECONDS = 15;

// E.g. { 600: { id: 600, name: 'archive-1', size: '500G' },
//        650: { id: 650, ... } }
// Map instead of Array for easy ID-based lookup.
// Map instead of Object to preserve insertion order, to make the last used container the default.
const CONTAINERS = new Map();

// Don't activate on "/archive.php?action=container...".
// Should only run on "/archive.php".
if (!document.location.search) {
    parseContainers();
    fixHeader();
    addUi();
}

function Container(id, name, size) {
    this.id = id; // number
    this.name = name; // string
    this.size = size; // string, e.g. "500G"
}

function parseContainers() {
    const containers = getContainers();
    containers.forEach((c) => {
        CONTAINERS.set(c.id, c);
    });
}

// Replace one-letter table headers with their long-form tooltip.
// e.g. "S" -> "Stalled"
//      "S" -> "Seeding"
function fixHeader() {
    const tableHeadCells = document.querySelectorAll('thead th');

    Array.from(tableHeadCells).forEach((cell) => {
        const x = cell.firstElementChild;

        if (x && x.tagName == 'LABEL') {
            cell.textContent = x.title;
        }
    });
}

function addUi() {
    const form = getContainerSelectForm();
    const contentDiv = document.querySelector('#content > .thin');
    contentDiv.append(form);
    activateFirstRadio(form);
    form.addEventListener('submit', onSubmitForm, false);
}

function getRadioOption(container, callbackFunction = null, showSize = true) {
    const radioGroupName = 'container';
    const div = document.createElement('div');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = radioGroupName;
    input.id = `container-${container.id}`;
    input.value = container.id; // Silently converted to string.

    if (callbackFunction) {
        input.addEventListener('change', callbackFunction);
    }

    const label = document.createElement('label');
    label.for = `container-${container.id}`;
    label.textContent = container.name;
    if (showSize) {
        label.textContent += ` (${container.size})`;
    }

    div.append(input, label);

    return div;
}

function getRadioOptionNew() {
    const callback = function () {
        if (this.checked) {
            document.getElementById('container-size-label').textContent = "New container's size:";
            document.getElementById('container-size').required = true;
            document.getElementById('new-container-name').required = true;
        }
    };

    const radioDiv = getRadioOption(new Container(-1, 'New:', '0B'), callback, false);

    const nameInput = document.createElement('input');
    nameInput.style.marginLeft = '0.5rem';
    nameInput.id = 'new-container-name';
    nameInput.placeholder = 'name';
    nameInput.addEventListener('input', () => {
        const newRadioElem = radioDiv.querySelector('input[type="radio"][value="-1"]');
        if (newRadioElem && !newRadioElem.checked) {
            newRadioElem.checked = true;
            newRadioElem.dispatchEvent(new Event('change'));
        }
    });

    radioDiv.appendChild(nameInput);
    return radioDiv;
}

function getButtonUi() {
    const dlButton = document.createElement('button');
    dlButton.id = 'archive-dl-button';
    dlButton.textContent = 'Download torrent';
    dlButton.type = 'submit';

    const dlCount = document.createElement('input');
    dlCount.type = 'number';
    dlCount.min = 1;
    dlCount.max = 50;
    dlCount.value = 1;
    dlCount.style.width = '4em';
    dlCount.id = 'archive-dl-count';
    dlCount.addEventListener('input', (event) => {
        const n = event.target.value;
        dlButton.textContent = `Download torrent${n > 1 ? 's' : ''}`;
        updateDownloadQueueWarning(n);
    });

    const countdownMsg = document.createElement('span');
    countdownMsg.id = 'archive-dl-countdown';
    countdownMsg.style.marginLeft = '0.5rem';

    const div = document.createElement('div');
    div.style.marginTop = '0.5rem';
    div.append(dlCount, dlButton, countdownMsg);
    return div;
}

function getSizeInput() {
    const div = document.createElement('div');
    div.style.marginTop = '0.5rem';

    const label = document.createElement('label');
    label.id = 'container-size-label';
    label.for = 'container-size';
    label.textContent = 'Container resize:';

    const input = document.createElement('input');
    input.id = 'container-size';
    input.placeholder = 'e.g. 500G or 2T';
    input.style.marginLeft = '0.5rem';
    input.pattern = '^\\d+(\\.\\d+)?[BKMGTP]$';
    input.title =
        'Sets selected container\'s size when clicking "Download torrent", e.g. 100G, 2T \n' +
        '(B = bytes, K = kilobytes, M = megabytes, G = gigabytes, T = terabytes, P = petabytes)';

    div.append(label, input);
    return div;
}

function getContainerSelectForm() {
    const form = document.createElement('form');
    form.id = 'container-select';
    form.style.width = 'fit-content';
    form.style.marginTop = '1em';

    const fieldset = document.createElement('fieldset');
    form.append(fieldset);

    const legend = document.createElement('legend');
    legend.textContent = 'Add torrents to container';
    fieldset.append(legend);

    const radioDiv = document.createElement('div');
    fieldset.append(radioDiv);

    const callback = () => {
        document.getElementById('container-size-label').textContent = 'Container resize:';
        document.getElementById('container-size').required = false;
        document.getElementById('new-container-name').required = false;
    };

    for (const c of CONTAINERS.values()) {
        radioDiv.append(getRadioOption(c, callback));
    }
    radioDiv.append(getRadioOptionNew());

    fieldset.append(getSizeInput());
    fieldset.append(getButtonUi());

    return form;
}

function getContainers() {
    const tables = document.querySelectorAll('table');

    // New user who doesn't have containers only has one table, stats.
    const hasContainers = tables.length >= 2;
    let tableRows;

    if (hasContainers) {
        tableRows = tables[1].querySelectorAll('tbody > tr');
    } else {
        tableRows = [];
    }

    return Array.from(tableRows).map((row) => {
        const firstCell = row.firstElementChild;
        const containerUrl = firstCell.firstElementChild.href;
        const containerId = parseInt(new URLSearchParams(containerUrl).get('containerid'));
        const sizeFromHtml = row.children[2].textContent;
        const sizeForApi = convertSize(sizeFromHtml);
        if (sizeForApi === null) {
            throw new Error(`Couldn't parse container size: ${sizeFromHtml}`);
        }
        return new Container(containerId, firstCell.textContent, sizeForApi);
    });
}

// Convert container size from the original HTML table format (e.g. "500.00 GiB")
// to the API's format (e.g. "500G").
function convertSize(sizeHtml) {
    const match = sizeHtml.match(/(\d+\.\d+|\d+) (\w+)/);
    if (!match) {
        return null;
    }
    const value = parseFloat(match[1]);
    const unit = match[2];
    const symbol = unit.charAt(0);
    return `${value}${symbol}`;
}

function downloadTorrent(torrentId, archiveId, isLast) {
    GM.openInTab(`https://passthepopcorn.me/torrents.php?action=download&id=${torrentId}&ArchiveID=${archiveId}`);
    if (isLast) {
        // Reliable and easiest way to reload new "Size" of the container in the table.
        window.location.reload();
    }
}

async function addOneToContainer(container, isLast) {
    console.info(`archive.php userscript - Trying to add one to container "${container.name}"`);

    if ([undefined, null, ''].includes(container.size)) {
        throw new Error(`Invalid container size: ${container.size}`);
    }

    return fetch(
        'https://passthepopcorn.me/archive.php?action=fetch&' +
            new URLSearchParams({
                // Not doing ID-based selection due to backend bug.
                // (Bug: name overrides ID if name already exists.)
                //ContainerID: containerId,
                ContainerName: container.name,
                ContainerSize: container.size, // Mandatory, otherwise backend sets it to zero.
                MaxStalled: 0, // Backend zeroes this out too by default, I assume.
            })
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.Status != 'Ok') {
                throw new Error(data.Error);
            }

            console.info(`archive.php userscript - Downloading torrent ID: ${data.TorrentID}`);
            setTimeout(downloadTorrent, 1000, data.TorrentID, data.ArchiveID, isLast);
        });
}

function addAndDlCountdown(seconds, container) {
    const countElem = document.getElementById('archive-dl-count');
    const msgElem = document.getElementById('archive-dl-countdown');

    if (countElem.value > 0) {
        msgElem.textContent = `Next in ${seconds}s`;
    } else {
        msgElem.textContent = '';
    }

    if (seconds > 0) {
        setTimeout(addAndDlCountdown, 1000, seconds - 1, container);
    } else {
        addAndDownloadManyTorrents(container);
    }
}

function addAndDownloadManyTorrents(container) {
    const countElem = document.getElementById('archive-dl-count');
    if (countElem.value > 0) {
        addOneToContainer(container, countElem.value == 1)
            .then(() => {
                addAndDlCountdown(BATCH_DL_SLEEP_SECONDS, container);
            })
            .catch((error) => {
                document.body.style.cursor = 'default';
                console.error(error.toString());
                alert(error.toString());
                // Reload the page because container size might have been updated
                // by the request that caused the error.
                // Will only reload after alert() is dismissed.
                window.location.reload();
            });
        --countElem.value;
    } else {
        document.body.style.cursor = 'default';
    }
}

function onSubmitForm(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const contId = parseInt(data.get('container'));
    const newSize = document.getElementById('container-size').value;
    let container;

    // -1 means the "new container" radio button was selected.
    if (contId === -1) {
        container = new Container(null, document.getElementById('new-container-name').value, newSize);

        if (container.name === '') {
            // Technically an empty container name is valid, but people prob don't want that.
            // Name input field has validation, so this shouldn't happen.
            window.alert("Container name can't be empty");
            return;
        }
    } else {
        container = CONTAINERS.get(contId);
        if (newSize) {
            container.size = newSize;
        }
    }

    if (container.name === null) {
        // null means no radio button selected.
        // First radio button is selected by default, so this shouldn't happen.
        window.alert('Please select a container');
    } else {
        document.body.style.cursor = 'progress';
        const dlButton = document.getElementById('archive-dl-button');
        dlButton.disabled = true;
        addAndDownloadManyTorrents(container);
    }
}

function activateFirstRadio(form) {
    const first = form.querySelector('input[type="radio"]');
    first.checked = true;
    first.dispatchEvent(new Event('change'));
}

function updateDownloadQueueWarning(torrentCount) {
    const paragraphId = 'dl-queue-warn';
    const form = document.querySelector('form#container-select');
    const paragraph = form.querySelector(`#${paragraphId}`);

    if (torrentCount <= 1) {
        if (paragraph) {
            paragraph.remove();
        }
    } else {
        if (paragraph) {
            return;
        }

        const lastDiv = form.querySelector('fieldset > div:last-child');
        const newParagraph = document.createElement('p');
        newParagraph.id = paragraphId;
        newParagraph.textContent =
            'When adding many torrents, set a low download queue size in your torrent client ("maximum active downloads"), ' +
            'e.g. 1-2. ' +
            'This is to prevent overwhelming a single low-speed seeder with parallel downloads.';
        lastDiv.after(newParagraph);
    }
}
