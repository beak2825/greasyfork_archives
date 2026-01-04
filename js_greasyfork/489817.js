// ==UserScript==
// @name            qB WebUI 加PT站点标签
// @version         0.1.4
// @author          cO_ob
// @description     qBittorrent WebUI 根据tracker中的关键字给种子增加标签
// @license         MIT
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @match           http://127.0.0.1:8080/
// @namespace       https://greasyfork.org/users/1270887
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/489817/qB%20WebUI%20%E5%8A%A0PT%E7%AB%99%E7%82%B9%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489817/qB%20WebUI%20%E5%8A%A0PT%E7%AB%99%E7%82%B9%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

//require qB API v2.3.0 +

const host = window.location.href;
const baseURL = host + 'api/v2/torrents/';
let trackerMappings = [
	{ url: 'agsvpt', tags: 'agsv' },
	{ url: 'btschool', tags: 'BTSCHOOL' },
	{ url: 'chdbits', tags: 'CHDBits' },
	{ url: 'daydream', tags: 'U2' },
	{ url: 'eastgame', tags: 'TLFBits' },
	{ url: 'et8.org', tags: 'TorrentCCF' },
	{ url: 'hdatmos', tags: 'HDATMOS' },
	{ url: 'hd4fans', tags: 'HD4FANS' },
	{ url: 'hdarea', tags: 'HDArea' },
	{ url: 'hdfans', tags: 'HDFans' },
	{ url: 'hdhome', tags: 'HDHome' },
	{ url: 'hdsky', tags: 'HDSky' },
	{ url: 'hdkyl', tags: 'HDKylin-麒麟' },
	{ url: 'leaves', tags: '红叶' },
	{ url: 'm-team', tags: 'M-Team' },
	{ url: 'open.cd', tags: 'OpenCD' },
	{ url: 'ourbits', tags: 'OurBits' },
	{ url: 'pttime', tags: 'pttime' },
	{ url: 'sharkpt', tags: 'SharkPT' },
	{ url: 'totheglory', tags: 'TTG' }
];

let startIndex = 0;
let currentProcessed = 0;
let totalTorrents = 0;

function createMochaUIWindow(trackerUrl, continueProcessing) {
    var win = new MUI.Window({
        id: 'newMappingWindow',
        title: '为tracker输入新的关键字和标签',
        content: `
            <div>
                <p>${trackerUrl}</p>
                <input type="text" id="newMappingUrlInput" placeholder="新关键字">
                <input type="text" id="newMappingTagsInput" placeholder="新标签">
                <br><br>
                <button id="saveMappingBtn">保存</button>
            </div>
        `,
        width: 300,
        height: 180,
        onClose: function () {
            continueProcessing();
        }
    });

    document.getElementById('saveMappingBtn').addEventListener('click', function () {
        var newMappingUrl = document.getElementById('newMappingUrlInput').value;
        var newMappingTags = document.getElementById('newMappingTagsInput').value;
        if (newMappingUrl !== "" && newMappingTags !== "") {
            trackerMappings.push({ url: newMappingUrl, tags: newMappingTags });
            win.close();
        } else {
            alert("请输入关键字和标签！");
        }
    });
}

function loadConfig() {
    const savedMappings = localStorage.getItem('trackerMappings');
    if (savedMappings) {
        trackerMappings = JSON.parse(savedMappings);
    }
}
function saveConfig() {
    localStorage.setItem('trackerMappings', JSON.stringify(trackerMappings));
}

async function getFetch(route) {
    try {
        const response = await fetch(baseURL + route);
        if (!response.ok) {
            throw new Error('Error fetching info!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

loadConfig();

async function processTorrents(torrentList) {
    try {
        for (let i = startIndex; i < totalTorrents; i++) {
            const torrent = torrentList[i];
            jQuery(".js-modal").text(`加标签 ${currentProcessed}/${totalTorrents}`);
            const trackers = await getFetch(`trackers?hash=${torrent.hash}`);
            for (const tracker of trackers) {
                if (tracker.status != 0) {
                    let torrentTags = [];
                    let foundMapping = false;
                    for (const mapping of trackerMappings) {
                        if (tracker.url.includes(mapping.url)) {
                            torrentTags = [mapping.tags];
                            foundMapping = true;
                            break;
                        }
                    }

                    if (!foundMapping) {
                        createMochaUIWindow(tracker.url, () => processTorrents(torrentList));
                        return;
                    }
                    currentProcessed++;
                    const tags = torrentTags.join(",");

                    //const response = await fetch(`${baseURL}addTags?hashes=${torrent.hash}&tags=${tags}`); //GET method. only for qb version under v4.5.0
                    const url = `${baseURL}addTags`;
                    const data = new URLSearchParams();
                    data.append('hashes', torrent.hash);
                    data.append('tags', tags);
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: data
                    })
                        .then(response => {
                        console.log(response);
                    })
                        .catch(error => {
                        console.error('Error:', error);
                    });
                    startIndex = i + 1;
                    break;
                }
            }
        }
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error.message);
    }
    jQuery(".js-modal").text(`完成 ${currentProcessed}/${totalTorrents}`);
}

function configureTrackerMappings() {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.border = '1px solid #ccc';
    dialog.style.zIndex = '9999';
    dialog.style.maxHeight = '400px';
    dialog.style.width = '360px';
    dialog.style.overflowY = 'auto';
    dialog.style.display = 'flex';
    dialog.style.flexDirection = 'column';

    const tableContainer = document.createElement('div');
    tableContainer.style.overflowY = 'auto';
    tableContainer.style.flex = '1';

    const table = document.createElement('table');
    table.style.width = '100%';

    const headerRow = table.insertRow();
    const urlHeader = headerRow.insertCell();
    urlHeader.textContent = '关键字';
    urlHeader.style.width = '40%';
    const tagsHeader = headerRow.insertCell();
    tagsHeader.textContent = '标签';
    tagsHeader.style.width = '40%';
    const actionsHeader = headerRow.insertCell();
    actionsHeader.textContent = '增减';

    function createEditableInput(value, placeholder, onChange) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.placeholder = placeholder;
        input.style.width = '100%';
        input.addEventListener('input', onChange);
        return input;
    }

    trackerMappings.forEach((mapping, index) => {
        const row = table.insertRow();

        const urlCell = row.insertCell();
        const urlInput = createEditableInput(mapping.url, '关键字', () => {
            trackerMappings[index].url = urlInput.value;
        });
        urlCell.appendChild(urlInput);

        const tagsCell = row.insertCell();
        const tagsInput = createEditableInput(mapping.tags, '标签', () => {
            trackerMappings[index].tags = tagsInput.value;
        });
        tagsCell.appendChild(tagsInput);

        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.addEventListener('click', () => {
            event.stopPropagation();
            trackerMappings.splice(index, 1);
            saveConfig();
            table.deleteRow(index + 1);
        });
        actionsCell.appendChild(deleteButton);
    });

    tableContainer.appendChild(table);
    dialog.appendChild(tableContainer);

    const form = document.createElement('form');
    form.style.marginTop = '20px';
    form.style.display = 'flex';
    form.style.alignItems = 'center';

    const newUrlInput = createEditableInput('', '关键字', () => {});
    form.appendChild(newUrlInput);
    newUrlInput.style.width = '130px';

    const newTagsInput = createEditableInput('', '标签', () => {});
    newTagsInput.style.width = '130px';
    form.appendChild(newTagsInput);

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.addEventListener('click', () => {
        const newUrl = newUrlInput.value;
        const newTags = newTagsInput.value;
        if (newUrl && newTags) {
            trackerMappings.push({ url: newUrl, tags: newTags });
            saveConfig();
            const newRow = table.insertRow();
            const urlCell = newRow.insertCell();
            urlCell.appendChild(createEditableInput(newUrl, '关键字', () => {}));
            const tagsCell = newRow.insertCell();
            tagsCell.appendChild(createEditableInput(newTags, '标签', () => {}));
            const actionsCell = newRow.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '-';
            deleteButton.addEventListener('click', () => {
                event.stopPropagation();
                const index = trackerMappings.length - 1;
                trackerMappings.splice(index, 1);
                saveConfig();
                table.deleteRow(index + 1);
            });
            actionsCell.appendChild(deleteButton);
            newUrlInput.value = '';
            newTagsInput.value = '';
        }
        event.preventDefault()
    });
    form.appendChild(addButton);

    dialog.appendChild(form);
    document.body.appendChild(dialog);
    document.addEventListener('click', function(event) {
        if (!dialog.contains(event.target)) {
            saveConfig();
            document.body.removeChild(dialog);
            document.removeEventListener('click', arguments.callee);
        }
    });
}

GM_registerMenuCommand('设置', configureTrackerMappings);

jQuery("#desktopNavbar > ul").append(
    "<li><a class='js-modal'> 加标签 </a></li>",
);

jQuery(".js-modal").click(async function () {
    const torrentList = await getFetch('info');
    totalTorrents = torrentList.length;
    await processTorrents(torrentList);
    saveConfig();
});

jQuery(".js-modal").on('contextmenu', async function(event) {
    event.preventDefault();
    const torrentList = await getFetch('info');
    const emptyTagTorrents = torrentList.filter(torrent => torrent.tags === '');
    totalTorrents = emptyTagTorrents.length;
    await processTorrents(emptyTagTorrents);
    saveConfig();
});