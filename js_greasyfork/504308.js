// ==UserScript==
// @name         GGn Group Migrator
// @namespace    none
// @version      1.1
// @description  Mass move torrents from one group to another.
// @require      https://update.greasyfork.org/scripts/541342/GGn%20Corner%20Button.js
// @author       tesnonwan
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @match        https://gazellegames.net/torrents.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/504308/GGn%20Group%20Migrator.user.js
// @updateURL https://update.greasyfork.org/scripts/504308/GGn%20Group%20Migrator.meta.js
// ==/UserScript==
/* globals authkey createCornerButton */

const TIMEOUT_BETWEEN_WRITES_MS = 1000;

const parser = new DOMParser();

const coverUrl = document.querySelector('#group_cover p img').src;
const description = document.getElementById('group_description').innerHTML;
const tags = [];
document.querySelectorAll('#tagslist ul li > a').forEach((t) => tags.push(t.textContent));
const links = {};
document.querySelectorAll('#weblinksdiv a').forEach((l) => { links[l.title] = l.href; });
const oldGroupId = new URL(location.href).searchParams.get('id');

let errorMsg, groupIdInput;

const STATES = {
    ABORTED: {text: 'Aborted', color: 'red'},
    COPYING: {text: 'Copying...', color: 'white'},
    ERROR: {text: 'Failed', color: 'red'},
    LOADING: {text: 'Loading details...', color: 'white'},
    MOVING: {text: 'Moving...', color: 'white'},
    SKIPPED: {text: 'Skipped', color: 'yellow'},
    SUCCESS: {text: 'Success!', color: 'green'},
    WAITING: {text: 'Waiting...', color: 'white'},
};

const DOX_MAP = {
    'Artwork': 'Artwork',
    'Audio': 'Audio',
    'Downloadable Content': 'DLC',
    'Fixes and Keygens': 'Fix/Keygen',
    'Game Guides': 'Guide',
    'GOG Goodies': 'GOG-Goodies',
    'Tools': 'Tool',
    'Trainers': 'Trainer',
    'Updates': 'Update',
};

function updateGroupParams(torrent, newGroupId, shouldDelete) {
    const params = new URLSearchParams();
    if (!torrent.externalLink && !torrent.internalLink) {
        // Normal torrent.
        params.append('action', 'editgroupid');
        params.append('confirm', 'true');
        params.append('torrentid', torrent.id);
        params.append('oldgroupid', oldGroupId);
        params.append('groupid', newGroupId);
        if (shouldDelete) {
            params.append('deleteold', '1');
        }
    } else if (torrent.externalLink) {
        params.append('action', 'take_torrent_link');
        params.append('addedit', 'add');
        params.append('groupid', newGroupId);
        params.append('auth', authkey);
        params.append('type', 'free');
        params.append('freelink', torrent.href);
        params.append('title', torrent.title);
        params.append('linktype', torrent.linkType);
        params.append('gamedox', torrent.gameDox);
        params.append('version', torrent.version);
        if (torrent.special) {
            params.append('special', 'on');
            params.append('specialyear', torrent.specialYear);
            params.append('specialtitle', torrent.specialTitle);
        }
        params.append('description', torrent.description);
        params.append('internallink', '');
        params.append('submit', 'Add Link');
    } else if (torrent.internalLink) {
        params.append('action', 'take_torrent_link');
        params.append('addedit', 'add');
        params.append('groupid', newGroupId);
        params.append('auth', authkey);
        params.append('type', 'internal');
        params.append('freelink', '');
        params.append('title', '');
        params.append('linktype', 0);
        params.append('gamedox', '');
        params.append('version', '');
        params.append('description', '');
        params.append('internallink', torrent.internalLink);
        params.append('submit', 'Add Link');
    }
    return params;
}

function removeElement(elem) {
    elem.parentElement.removeChild(elem);
}

async function processTorrent(runState) {
    const torrent = runState.torrents.shift();
    if (!torrent) {
        removeElement(runState.submitButton);
        removeElement(runState.deleteGroupCheck);
        removeElement(runState.deleteGroupLabel);
        return;
    }
    if (runState.aborted) {
        setStatus(torrent.status, STATES.ABORTED);
        return processTorrent(runState);
    }
    if (!torrent.checkbox.checked) {
        setStatus(torrent.status, STATES.SKIPPED);
        return processTorrent(runState);
    }
    if (runState.needsWait) {
        await new Promise((resolve) => {
            setStatus(torrent.status, STATES.WAITING);
            window.setTimeout(resolve, runState.needsWait);
            runState.needsWait = 0;
        });
    }
    if (torrent.externalLink) {
        setStatus(torrent.status, STATES.LOADING);
        await lookupExternalLink(torrent).catch((e) => {
            console.log(e);
            error(e.message);
            runState.aborted = true;
            setStatus(torrent.status, STATES.ERROR);
            return processTorrent(runState);
        });
    }
    const groupId = runState.groupId;
    const shouldDelete = runState.deleteGroupCheck.checked && runState.torrents.length === 0;
    const params = updateGroupParams(torrent, groupId, shouldDelete);
    if (torrent.externalLink || torrent.internalLink) {
        console.log(`Re-creating link ${torrent.name} (${torrent.id}) in Group ${groupId}...`);
        setStatus(torrent.status, STATES.COPYING);
    } else {
        console.log(`Moving ${torrent.name} (${torrent.id}) to Group ${groupId}...`);
        setStatus(torrent.status, STATES.MOVING);
    }
    fetch('torrents.php', {
        method: 'post',
        includeCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params
    })
        .then(r => {
            if (!(r.ok && r.redirected)) {
                console.log(`Got error reponse when moving ${torrent.name} (${torrent.id}) to Group ${groupId}`);
                setStatus(torrent.status, STATES.ERROR, r.status);
                runState.aborted = true;
                return processTorrent(runState);
            }
            console.log(`Successfully moved ${torrent.name} (${torrent.id}) to Group ${groupId}.`);
            setStatus(torrent.status, STATES.SUCCESS);
            runState.needsWait = TIMEOUT_BETWEEN_WRITES_MS;
            processTorrent(runState);
        })
        .catch(e => {
            console.log(`Got error when moving ${torrent.name} (${torrent.id}) to Group ${groupId}: ${e.message}`);
            setStatus(torrent.status, STATES.ERROR);
            runState.aborted = true;
            return processTorrent(runState);
        });
}

function makeMigrateButton() {
    createCornerButton('right', 'Migrate Group', () => {
        addGroupMigrationElement();
    });
}

function addGroupMigrationElement() {
    let migrationSection = document.getElementById('migration_section');
    if (migrationSection) {
        migrationSection.style.display = migrationSection.style.display === 'none' ? '' : 'none';
        return;
    }
    const container = document.getElementById('content');
    migrationSection = document.createElement('div');
    migrationSection.id = 'migration_section';
    migrationSection.style.width = '90%';
    migrationSection.style.margin = '50px';
    container.insertBefore(migrationSection, container.firstChild);
    const groupIdLabel = document.createElement('span');
    groupIdLabel.class = 'weblinksTitle';
    groupIdLabel.appendChild(document.createTextNode('Group ID to Move to: '));
    migrationSection.appendChild(groupIdLabel);
    groupIdInput = document.createElement('input');
    groupIdInput.type = 'text';
    groupIdInput.style.marginLeft = groupIdInput.style.marginRight = '4px';
    groupIdInput.style.width = '80px';
    migrationSection.appendChild(groupIdInput);
    const lookupButton = document.createElement('input');
    lookupButton.type = 'button';
    lookupButton.value = 'Lookup';
    lookupButton.onclick = lookupGroup;
    migrationSection.appendChild(lookupButton);
    errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    migrationSection.appendChild(errorMsg);
}

function getTorrents() {
    const torrents = [];
    let currentEdition = '';
    document.querySelectorAll('.torrent_table tr').forEach((r) => {
        const editionInfo = r.querySelector('.edition_info');
        if (editionInfo) {
            currentEdition = editionInfo.textContent.trim();
            return;
        }
        const a = r.querySelector('a');
        if (!a) return;
        const linkText = a.textContent;
        if (linkText === 'LN' || linkText === 'DL') {
            const torrent = {};
            if (linkText === 'LN') {
                torrent.externalLink = true;
            } else if (r.querySelector('a[title="Original Group"]')) {
                torrent.internalLink = r.querySelector('a[title="Permalink"]').href;
            }
            torrent.id = new URL(r.querySelector('a[title="Edit"]').href).searchParams.get('id');
            torrent.name = `<b>${currentEdition}</b> - ` + r.querySelector('td > a').textContent.trim();
            torrents.push(torrent);
        }
    });
    // Sort external and internal links first, so real torrents are handled
    // last and allow the group to be deleted at the end.
    torrents.sort((a, b) => {
      if (a.externalLink) {
          return b.externalLink ? 0 /* a.name.localeCompare(b.name) */ : -1;
      } else if (a.internalLink) {
          if (b.externalLink) return 1;
          return b.internalLink ? 0 /* a.name.localeCompare(b.name) */ : -1;
      } else {
          if (b.externalLink || b.internalLink) return 1;
          return 0 /* a.name.localeCompare(b.name) */;
      }
    });
    return torrents;
}

function addToRow(row, data) {
    const td = document.createElement('td');
    td.appendChild(data);
    row.appendChild(td);
}

function selectMessage(groupId, groupName) {
    const message = document.createElement('div');
    message.appendChild(document.createTextNode('Select which torrents should be migrated to '));
    const span = document.createElement('span');
    span.style.fontWeight = 'bold';
    span.style.color = 'gold';
    span.appendChild(document.createTextNode(`${groupName} (${groupId})`));
    message.appendChild(span);
    message.appendChild(document.createTextNode(':'));
    message.style.marginBottom = '6px';
    return message;
}

function makeSelectAllRow(selectAllCheckbox) {
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.checked = true;
    const selectAllRow = document.createElement('tr');
    addToRow(selectAllRow, selectAllCheckbox);
    const selectAllText = document.createElement('span');
    selectAllText.innerHTML = 'Select all?';
    addToRow(selectAllRow, selectAllText);
    selectAllRow.appendChild(document.createElement('td'));
    return selectAllRow;
}

function createTorrentSelector(groupId, groupName) {
    const migrationSection = document.getElementById('migration_section');
    let torrentList = document.getElementById('migration_torrents');
    if (torrentList) {
        removeElement(torrentList);
    }
    torrentList = document.createElement('div');
    migrationSection.insertBefore(torrentList, errorMsg);
    torrentList.id = 'migration_torrents';
    torrentList.appendChild(selectMessage(groupId, groupName));
    const torrentTable = document.createElement('table');
    const selectAllCheckbox = document.createElement('input');
    torrentTable.appendChild(makeSelectAllRow(selectAllCheckbox));
    const torrents = getTorrents();
    const checkboxes = [];
    for (const torrent of torrents) {
        const torrentRow = document.createElement('tr');
        const checkbox = document.createElement('input');
        checkboxes.push(checkbox);
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.isLink = !!torrent.internalLink || torrent.externalLink;
        torrent.checkbox = checkbox;
        addToRow(torrentRow, checkbox);
        const torrentName = document.createElement('span');
        torrentName.innerHTML = torrent.name;
        addToRow(torrentRow, torrentName);
        const status = document.createElement('span');
        torrent.status = status;
        addToRow(torrentRow, status);
        torrentTable.appendChild(torrentRow);
    }
    torrentList.appendChild(torrentTable);
    const submitButton = document.createElement('input');
    submitButton.type = 'button';
    submitButton.value = 'Start Migration';
    const deleteGroupCheck = document.createElement('input');
    deleteGroupCheck.type = 'checkbox';
    deleteGroupCheck.id = 'migration_delete_group';
    deleteGroupCheck.title = 'This will only work if there is at least one non-internal/external link torrent';
    deleteGroupCheck.checked = true;
    const deleteGroupLabel = document.createElement('label');
    deleteGroupLabel.for = 'migration_delete_group';
    deleteGroupLabel.title = deleteGroupCheck.title;
    deleteGroupLabel.appendChild(document.createTextNode('Try to Delete Group After Migration'));
    const runState = {
        aborted: false,
        deleteGroupCheck,
        deleteGroupLabel,
        groupId,
        needsWait: 0,
        submitButton,
        torrents,
    };
    submitButton.onclick = () => {
        submitButton.value = 'Abort';
        submitButton.onclick = () => {
            runState.aborted = true;
        };
        processTorrent(runState);
    };
    torrentList.appendChild(submitButton);
    torrentList.appendChild(deleteGroupCheck);
    torrentList.appendChild(deleteGroupLabel);
    for (const checkbox of checkboxes) {
        checkbox.onclick = () => {
            const allChecked = checkboxes.every((c) => c.isLink || c.checked);
            if (allChecked) {
                deleteGroupCheck.disabled = false;
            } else {
                deleteGroupCheck.checked = false;
                deleteGroupCheck.disabled = true;
            }
        };
    }
    selectAllCheckbox.onclick = () => {
        for (const checkbox of checkboxes) {
            checkbox.checked = selectAllCheckbox.checked;
        }
        deleteGroupCheck.disabled = !selectAllCheckbox.checked;
        if (selectAllCheckbox.checked) {
            deleteGroupCheck.disabled = false;
        } else {
            deleteGroupCheck.disabled = true;
            deleteGroupCheck.checked = false;
        }
    };
}

function error(text) {
    errorMsg.innerHTML = text;
}

function setStatus(status, state, responseCode = undefined) {
    status.innerHTML = state.text + (responseCode ? ` (${responseCode})` : '');
    status.style.color = state.color;
}

function getGroupFromResponse(responseText) {
    try {
        const doc = parser.parseFromString(responseText, 'text/html');
        return doc.getElementById('display_name').textContent;
    } catch (e) {}
    return null;
}

function getExternalLinkDetailsFromResponse(torrent, responseText) {
    const doc = parser.parseFromString(responseText, 'text/html');
    torrent.href = doc.querySelector('input[name="freelink"]').value;
    torrent.title = doc.querySelector('input[name="title"]').value;
    torrent.linkType = doc.querySelector('select[name="linktype"]')?.selectedIndex || 0;
    torrent.gameDox = doc.querySelector('select[name="gamedox"]')?.selectedOptions?.[0].value || '';
    torrent.version = doc.querySelector('input[name="version"]')?.value || '';
    torrent.special = doc.querySelector('input[name="special"]')?.checked || false;
    torrent.specialYear = doc.querySelector('input[name="specialyear"]')?.value || '';
    torrent.specialTitle = doc.querySelector('input[name="specialtitle"]')?.value || '';
    torrent.description = doc.querySelector('textarea[name="description"]').value;
}

async function lookupExternalLink(torrent) {
    return fetch(`torrents.php?action=edit_torrent_link&type=ext&id=${torrent.id}`, {
        method: 'get',
        includeCredentials: true,
    }).then(async r => {
            const responseText = await r.text();
            getExternalLinkDetailsFromResponse(torrent, responseText);
        });
}

function lookupGroup() {
    error('');
    const lookupId = groupIdInput.value;
    if (!/^[0-9]+$/.test(lookupId)) {
        error(`"${lookupId}" is not a valid group ID.`);
        return;
    };
    fetch(`torrents.php?id=${lookupId}`, {
        method: 'get',
        includeCredentials: true,
    })
        .then(async r => {
            const responseText = await r.text();
            const groupName = getGroupFromResponse(responseText);
            if (!groupName) {
                error(`Could not find group for ID ${lookupId}`);
                return;
            }
            createTorrentSelector(lookupId, groupName);
        })
        .catch(e => {
            error(e.message);
        });
}

makeMigrateButton();