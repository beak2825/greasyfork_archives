// ==UserScript==
// @name         GGn Mass Torrent Editor
// @namespace    http://tampermonkey.net/
// @version      v2.1
// @description  Set torrent data in bulk from the group page.
// @require      https://update.greasyfork.org/scripts/541342/GGn%20Corner%20Button.js
// @author       tesnonwan
// @match        https://gazellegames.net/torrents.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/523855/GGn%20Mass%20Torrent%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/523855/GGn%20Mass%20Torrent%20Editor.meta.js
// ==/UserScript==
/* globals createCornerButton */

const API_KEY = '';


const rowEdits = [];
const regions = [
    'USA',
    'Europe',
    'Japan',
    'Asia',
    'Australia',
    'France',
    'Germany',
    'Spain',
    'Italy',
    'UK',
    'Netherlands',
    'Sweden',
    'Russia',
    'China',
    'Korea',
    'Hong Kong',
    'Taiwan',
    'Brazil',
    'Canada',
    'Japan, USA',
    'Japan, Europe',
    'USA, Europe',
    'Europe, Australia',
    'Japan, Asia',
    'UK, Australia',
    'World',
    'Region-Free',
    'Other',
];
const fixMap = {
    'PAL': 'Europe',
    'NTSC': 'USA',
    'NTSC-J': 'Japan',
    'NTSC-C': 'Asia',
};

const releaseTypes = [
    'Full ISO',
    'GGn Internal',
    'P2P Full Repack',
    'P2P Lossy Repack',
    'P2P Release',
    'Rip',
    'Scrubbed',
    'Home Rip',
    'DRM Free',
    'ROM',
];

const groupId = /(?:\?|&)id=([0-9]+)/.exec(location.href)[1];

function loadGroupData(groupId) {
    return window.fetch(`https://gazellegames.net/api.php?request=torrentgroup&id=${groupId}`, {
      headers: {
          'X-API-Key': API_KEY,
      },
    }).then((r) => {
        return r.text();
    }).then((text) => {
        const torrentData = {};
        const jsonData = JSON.parse(text);
        const categoryType = jsonData.response.group.categoryId;
        for (const torrent of jsonData.response.torrents) {
            torrentData[torrent.id] = {
                categoryType,
                ...torrent,
            };
        }
        return torrentData;
    });
}

async function submitRegionChanges(submitButton) {
    const timeStart = Date.now();
    let updatedTorrents = 0;
    const groupData = await loadGroupData(groupId);
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    for (const rowEdit of rowEdits) {
        const {
            torrentId,
            currentRegion,
            fixed,
            regionDropdown,
            torrentEditText,
            releaseTypeSelector
        } = rowEdit;
        const torrentData = groupData[torrentId];
        if (!torrentData) {
            console.log(`Error: No torrent data found from groupId ${groupId} for torrent ${torrentId}`);
            continue;
        }
        if (regionDropdown.value === torrentData.region &&
            torrentEditText.value === torrentData.releaseTitle &&
            releaseTypeSelector.value === torrentData.releaseType) {
            // No changes.
            console.log(`Skipping ${torrentData.releaseTitle}, no changes`);
            continue;
        }

        const submitFormData = new FormData();
        submitFormData.append('action', 'takeedit');
        submitFormData.append('torrentid', torrentId);
        submitFormData.append('type', torrentData.categoryType);
        submitFormData.append('ripsrc', torrentData.scene ? 'scene' : 'home');
        submitFormData.append('release_title', torrentEditText.value);
        submitFormData.append('remaster_year', torrentData.remasterYear);
        submitFormData.append('remaster_title', torrentData.remasterTitle);
        if (torrentData.remastered) {
            submitFormData.append('remaster', 'on');
        }
        submitFormData.append('miscellaneous', releaseTypeSelector.value);
        submitFormData.append('gamedox', torrentData.gameDOXType);
        submitFormData.append('gamedoxvers', torrentData.gameDOXVersion);
        submitFormData.append('isbn', '');
        submitFormData.append('region', regionDropdown.value);
        submitFormData.append('language', torrentData.language);
        submitFormData.append('release_desc', torrentData.bbDescription);
        submitFormData.append('submit_upload', 'Edit torrent');
        updatedTorrents++;
        await Promise.all([
            fetch(`https://gazellegames.net/torrents.php?action=edit&id=${torrentId}`, {
                method: 'POST',
                body: submitFormData,
                includeCredentials: true,
            }).then((resp) => {
                if (resp.ok) {
                    torrentEditText.style.color = 'white';
                    releaseTypeSelector.style.color = 'white';
                    regionDropdown.style.color = 'white';
                } else {
                    torrentEditText.style.color = 'red';
                    releaseTypeSelector.style.color = 'red';
                    regionDropdown.style.color = 'red';
                    console.log(resp);
                }
            }),
            new Promise((resolve) => {
                window.setTimeout(resolve, 2000);
            })
        ]);
    }
    console.log(`Updated ${updatedTorrents} torrent${updatedTorrents === 1 ? '' : 's'} in ${Date.now() - timeStart}ms`);
    submitButton.textContent = 'Submit Changes';
    submitButton.disabled = false;
}

function makeRegionFixButton() {
    createCornerButton('right', 'Edit Torrents', () => {
        if (!API_KEY) {
            alert('Please add API key to GGn Mass Torrent Editor user script.');
            return;
        }
        showEditors();
    });
}

function isExcludedType(torrentData) {
    if (torrentData.releaseType === 'E-Book') {
        return true;
    }
    if (torrentData.releaseType === 'GameDOX') {
        return torrentData.gameDOXType !== 'Update' && torrentData.gameDOXType !== 'DLC';
    }
    return false;
}

function makeRegionTd(currentRegion, fixed) {
    const regionTd = document.createElement('td');
    const regionDropdown = document.createElement('select');
    regionDropdown.style.minWidth = '132px';
    if (fixed) {
        regionDropdown.style.color = 'limegreen';
    }
    const blankOption = document.createElement('option');
    blankOption.value = '';
    blankOption.textContent = '---';
    if (currentRegion === '') {
        blankOption.selected = true;
    }
    regionDropdown.appendChild(blankOption);
    for (const region of regions) {
        const option = document.createElement('option');
        option.value = option.textContent = region;
        if (region === currentRegion) {
            option.selected = true;
        }
        regionDropdown.appendChild(option);
    }
    regionTd.appendChild(regionDropdown);
    regionDropdown.onchange = () => {
        if (!fixed && regionDropdown.value === currentRegion) {
            regionDropdown.style.color = 'white';
        } else {
            regionDropdown.style.color = 'limegreen';
        }
    };
    return {regionTd, regionDropdown};
}

function makeRegexRenameRow() {
    const renameRow = document.createElement('tr');
    const renameCell = document.createElement('td');
    renameCell.setAttribute('colspan', '8');
    renameRow.appendChild(renameCell);
    const regexLabel = document.createElement('label')
    regexLabel.setAttribute('for', 'rename_regex');
    regexLabel.appendChild(document.createTextNode('Rename Regex: '));
    regexLabel.style.width = 'max-content';
    renameCell.appendChild(regexLabel);
    const regexText = document.createElement('input');
    regexText.type = 'text';
    regexText.id = 'rename_regex';
    regexText.size = '40';
    renameCell.appendChild(regexText);
    const replacementLabel = document.createElement('label')
    replacementLabel.setAttribute('for', 'rename_replace');
    replacementLabel.style.marginLeft = '5px';
    replacementLabel.style.width = 'max-content';
    replacementLabel.appendChild(document.createTextNode('Replacement ($1, etc. for captures): '));
    renameCell.appendChild(replacementLabel);
    const replacementText = document.createElement('input');
    replacementText.type = 'text';
    replacementText.id = 'rename_replace';
    replacementText.size = '40';
    renameCell.appendChild(replacementText);
    const replaceButton = document.createElement('button');
    replaceButton.type = 'button';
    replaceButton.style.marginLeft = '5px';
    replaceButton.style.width = 'max-content';
    replaceButton.appendChild(document.createTextNode('Rename All'));
    renameCell.appendChild(replaceButton);
    replaceButton.onclick = () => {
        for (const {torrentEditText} of rowEdits) {
            torrentEditText.value = torrentEditText.value.replace(new RegExp(regexText.value), replacementText.value);
            torrentEditText.dispatchEvent(new Event("input", { bubbles: true }))
        }
    }
    return renameRow;
}

function makeTitleEditor(currentTitle) {
    const torrentEditText = document.createElement('input');
    torrentEditText.type = 'text';
    torrentEditText.style.flexGrow = '1';
    torrentEditText.style.fontSize = '0.9em';
    torrentEditText.style.marginLeft = '5px';
    torrentEditText.value = currentTitle;
    torrentEditText.addEventListener('input', () => {
        if (torrentEditText.value === currentTitle) {
            torrentEditText.style.color = 'white';
        } else {
            torrentEditText.style.color = 'limegreen';
        }
    });
    return torrentEditText;
}

function makeReleaseTypeSelector(currentReleaseType) {
    const releaseTypeSelector = document.createElement('select');
    releaseTypeSelector.style.minWidth = '132px';
    releaseTypeSelector.style.marginLeft = '5px';
    let foundReleaseType = false;
    for (const releaseType of releaseTypes) {
        const releaseTypeOption = document.createElement('option');
        releaseTypeOption.value = releaseType;
        releaseTypeOption.appendChild(document.createTextNode(releaseType));
        if (releaseType === currentReleaseType) {
            foundReleaseType = true;
            releaseTypeOption.selected = true;
        }
        releaseTypeSelector.appendChild(releaseTypeOption);
    }
    if (!foundReleaseType) {
        const legacyOption = document.createElement('option');
        legacyOption.value = currentReleaseType;
        legacyOption.selected = true;
        legacyOption.appendChild(document.createTextNode(currentReleaseType));
        let legacyRemoved = false;
        releaseTypeSelector.onfocus = () => {
            if (legacyRemoved) {
                return;
            }
            legacyRemoved = true;
            legacyOption.remove();
            releaseTypeSelector.style.color = 'limegreen';
        };
        releaseTypeSelector.appendChild(legacyOption);
    }
    releaseTypeSelector.onchange = () => {
        if (releaseTypeSelector.value === currentReleaseType) {
            releaseTypeSelector.style.color = 'white';
        } else {
            releaseTypeSelector.style.color = 'limegreen';
        }
    };
    return releaseTypeSelector;
}

let showedEditors = false;
async function showEditors() {
    if (showedEditors) {
        return;
    }
    showedEditors = true;
    const groupData = await loadGroupData(groupId);
    const torrentsList = Object.values(groupData);
    if (torrentsList.length === 0 || torrentsList[0].categoryType !== 1) {
        return;
    }
    const headerRow = document.querySelector('.colhead_dark');
    const submitTd = document.createElement('td');
    submitTd.style.textAlign = 'center';
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Submit Changes';
    submitButton.onclick = () => {
        submitRegionChanges(submitButton);
    };
    submitTd.appendChild(submitButton);
    headerRow.appendChild(submitTd);

    const torrentRows = document.querySelectorAll('.group_torrent[id]');
    for (const torrentRow of torrentRows) {
        const torrentId = torrentRow.id.replace('torrent', '');
        const torrentData = groupData[torrentId];
        if (!torrentData || isExcludedType(torrentData)) {
            // Skip gamedox content.
            continue;
        }
        let fixed = false;

        // Region fixer.
        let currentRegion = torrentData.region;
        if (fixMap[currentRegion]) {
            currentRegion = fixMap[currentRegion];
            fixed = true;
        }
        const {regionTd, regionDropdown} = makeRegionTd(currentRegion, fixed);
        torrentRow.appendChild(regionTd);

        // Title and release type editing.
        const torrentTitleLink = torrentRow.querySelector('td > a');
        torrentTitleLink.innerHTML = '⇅';
        torrentTitleLink.style.fontWeight = 'bolder';
        torrentTitleLink.style.marginLeft = '3px';
        const titleTd = torrentTitleLink.parentElement;
        titleTd.style.display = 'flex';
        titleTd.style.alignItems = 'center';
        const torrentEditText = makeTitleEditor(torrentData.releaseTitle);
        torrentTitleLink.parentElement.appendChild(torrentEditText);
        const releaseTypeSelector = makeReleaseTypeSelector(torrentData.releaseType);
        torrentTitleLink.parentElement.appendChild(releaseTypeSelector);
        const replaceRow = makeRegexRenameRow();
        headerRow.parentElement.insertBefore(replaceRow, headerRow.nextElementSibling);
        rowEdits.push({
            torrentId,
            currentRegion,
            fixed,
            regionDropdown,
            torrentEditText,
            releaseTypeSelector
        });
    }
}

makeRegionFixButton();