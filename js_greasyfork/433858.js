// ==UserScript==
// @name         empornium better filelist
// @version      3.5
// @description  Shows filelist as expandable tree structure
// @author       ephraim
// @namespace    empornium
// @match        https://www.empornium.sx/torrents.php?id=*
// @match        https://www.emparadise.rs/torrents.php?id=*
// @match        https://www.homeporntorrents.club/torrents.php?id=*
// @match        https://femdomcult.org/torrents.php?id=*
// @match        https://sextorrent.eu/torrents.php?id=*
// @match        https://kufirc.com/torrents.php?id=*
// @match        https://pornbay.org/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433858/empornium%20better%20filelist.user.js
// @updateURL https://update.greasyfork.org/scripts/433858/empornium%20better%20filelist.meta.js
// ==/UserScript==


var urlMap = {};

const combinedPattern = new RegExp(
    '(?:_?(?:thumb|screen|preview|s)s?)?\.(?:jpg|jpeg|bmp|png|gif|mp4|avi|m4v|mpg|mpeg|mkv|mov|wmv|flv|vob)', 'ig');

function nameHash(name) {
    var hash = name.toLowerCase()
    hash = hash.replaceAll(combinedPattern, ''); //thumbs etc and file extensions
    hash = hash.replaceAll(/[\W_\[\]]/g, ''); // special characters
    return hash;
}


function tree(folder) {
    var folders = [];
    var files = [];
    folder.files.forEach(f => {
        if (/\//.test(f.name)) {
            var levels = f.name.split('/');
            var currentLevel = levels.shift();
            f.name = levels.join('/');
            var existing = folders.find(fold => {
                return fold.name == currentLevel;
            });
            if (existing) {
                existing.files.push(f);
            } else {
                var newFolder = {};
                newFolder.name = currentLevel;
                newFolder.files = [f];
                folders.push(newFolder);
            }
        } else {
            f.url = urlMap[nameHash(f.name)];
            files.push(f);
        }
    });
    folder.folders = folders;
    folder.files = files;
    folders.forEach(tree);
    folder.byteSize = folderSize(folder);
    return folder;
}


function folderSize(folder) {
    var fileSize = folder.files.reduce((currentSize, file) => {
        return currentSize + file.byteSize;
    }, 0);
    if (folder.folders.length) {
        return fileSize + folder.folders.reduce((currentSize, folder) => {
            return currentSize + folderSize(folder);
        }, 0);
    } else {
        return fileSize;
    }
}


function sizeInBytes(ssize) {
    ssize = ssize.replace(',', '');
    var number, unit;
    [number, unit] = ssize.split(' ');
    number = +number;
    var suffixes = {
        KiB: 1024,
        MiB: 1024 * 1024,
        GiB: 1024 * 1024 * 1024,
        TiB: 1024 * 1024 * 1024 * 1024
    };
    return number * suffixes[unit] || number;
}


function formatBytes(bytes) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


function ce(type, className) {
    var e = document.createElement(type);
    e.className = className || '';
    return e;
}


function getFileType(fileName) {
    var type;
    type = fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/i);
    if (type) return `icon_files_image file_type_${type[1]}`;
    type = fileName.match(/\.(mp4|avi|m4v|mpg|mpeg|mkv|mov|wmv|flv)$/i);
    if (type) return `icon_files_video file_type_${type[1]}`;
    type = fileName.match(/\.(txt|srt)$/i);
    if (type) return `icon_files_text file_type_${type[1]}`;
    type = fileName.match(/\.(zip|rar|7z)$/i);
    if (type) return `icon_files_compressed file_type_${type[1]}`;
    type = fileName.match(/\.(iso|vob)$/i);
    if (type) return `icon_files_disc file_type_${type[1]}`;
    type = fileName.match(/\.(mp3|wav|flac|m4a|wma|aac)$/i);
    if (type) return `icon_files_audio file_type_${type[1]}`;
    type = fileName.match(/\.(exe|apk)$/i);
    if (type) return `icon_files_executable file_type_${type[1]}`;

    return 'icon_files_unknown';
}


function makeFolderDom(folder) {
    var folderElement = ce('div', 'folder');
    folderElement.dataset.name = folder.name;
    var folderDetails = ce('div', 'folder_details folder_closed tree_item');
    var contains = '';
    if (folder.files.length > 1) {
        contains = `${folder.files.length} files`;
    } else if (folder.files.length == 1) {
        contains = '1 file';
    } else if (!folder.files.length && !folder.folders.length) {
        contains = 'empty';
    }
    folderDetails.innerHTML = `<span class="folder_name">${folder.name}</span>
        <span class="folder_files">${contains}</span>
        <span class="folder_size">${formatBytes(folder.byteSize)}</span>`;
    folderElement.append(folderDetails);
    var container = ce('div', 'folder_container');
    folderDetails.addEventListener('click', toggleCollapsed);
    if (folder.folders.length) {
        var folderList = ce('ul', 'folder_list');
        for (var f of folder.folders) {
            var foldi = ce('li', 'folder_item');
            foldi.appendChild(makeFolderDom(f));
            folderList.append(foldi);
        }
        container.append(folderList);
    }
    if (folder.files.length) {
        var fileList = ce('ul', 'file_list');
        for (var file of folder.files) {
            var filei = ce('li', 'file_item tree_item');
            var istack = ce('div', 'icon_stack');
            var icon = ce('i', `font_icon file_icons ${getFileType(file.name)}`);
            istack.append(icon);
            filei.append(istack);
            var fname = ce('span', 'file_name');
            fname.innerText = file.name;
            if (file.url) {
                var preview = ce('a', 'file_preview');
                preview.href = file.url;
                preview.dataset.caption = folder.name == '/' ? `${file.name}` : `${folder.name} / ${file.name}`;
                preview.dataset.fancybox = `${folder.name}`;
                preview.append(fname);
                filei.append(preview);
            } else {
                filei.append(fname);
            }
            var fsize = ce('span', 'file_size');
            fsize.innerText = file.size;
            filei.append(fsize);
            fileList.append(filei);
        }
        container.append(fileList);
    }
    folderElement.append(container);



    return folderElement;
}


function toggleCollapsed(e) {
    this.classList.toggle('folder_open');
    this.classList.toggle('folder_closed');
}


function createTree() {
    var treeContainer = ce('div', 'tree_container');
    treeContainer.append(makeFolderDom(root));
    var firstFolder = treeContainer.querySelector('.folder_closed');
    firstFolder.classList.remove('folder_closed');
    firstFolder.classList.add('folder_open');
    return treeContainer;
}

function clearFilter(e) {
    if (e.key != "Escape") return;
    e.target.value = '';
    filterList(e);
}


function filterList(e) {
    var container = document.querySelector('.tree_container');
    container.classList.add('hidden'); // temporary hide  when hiding children
    if (e.target.value.length < 1) {
        container.querySelectorAll('.hidden, .folder_force_open, .file_found').forEach(f => {
            f.classList.remove('hidden', 'folder_force_open', 'file_found');
        });
        container.querySelectorAll('.filter_match').forEach(m => {
            m.outerHTML = m.textContent;
        });
        container.classList.remove('hidden');
        return false;
    }

    var needle = new RegExp(this.value, 'i');
    container.querySelectorAll('.file_name').forEach(f => {
        var hit = f.textContent.match(needle);
        var fileItem = f.closest('li');
        if (hit) {
            var el = f.querySelector('a') || f;
            el.innerHTML = wrapMatch(el.innerText, hit);
            fileItem.classList.remove('hidden');
            fileItem.classList.add('file_found');
        } else {
            fileItem.classList.add('hidden');
            fileItem.classList.remove('file_found');
        }
    });

    container.querySelectorAll('.folder').forEach(folder => {
        var hit = folder.textContent.match(needle);
        var found = folder.querySelector('.file_found');
        if (hit || found) {
            folder.classList.remove('hidden');
            folder.classList.add('file_found');
            if (found) {
                folder.querySelector('.folder_details').classList.add('folder_force_open');
            } else {
                folder.querySelector('.folder_details').classList.remove('folder_force_open');
            }
            if (hit) {
                var folderName = folder.querySelector('.folder_name');
                var el = folderName.querySelector('a') || folderName;
                el.innerHTML = wrapMatch(el.innerText, hit);
            }
        } else {
            folder.classList.remove('file_found');
            folder.classList.add('hidden');
        }
    });

    container.querySelector('.folder').classList.remove('hidden');
    container.classList.remove('hidden');
}


function wrapMatch(text, match) {
    var matchElement = ce('span', 'filter_match');
    matchElement.textContent = match[0];
    return text.replaceAll(match, matchElement.outerHTML);
}


function expandAllFolders(e) {
    e.preventDefault();
    var closedFolders = document.querySelectorAll('.folder_closed');
    var openFolders = [...document.querySelectorAll('.folder_open')].slice(1);
    if (e.target.dataset.collapsed == 'collapsed') {
        closedFolders.forEach(f => {
            f.classList.add('folder_open');
            f.classList.remove('folder_closed');
        });
        e.target.dataset.collapsed = 'expanded';
        e.target.innerText = e.target.innerText.replace('📁Expand', '📂Collapse');
    } else if (e.target.dataset.collapsed == 'expanded') {
        openFolders.forEach(f => {
            f.classList.add('folder_closed');
            f.classList.remove('folder_open');
        });
        e.target.dataset.collapsed = 'collapsed';
        e.target.innerText = e.target.innerText.replace('📂Collapse', '📁Expand');
    }
}


function list2Tree() {
    var tabl = fileList.querySelector('table');
    var rows = [...tabl.rows];

    root.name = rows[0].innerText.trim();
    root.files = rows.slice(2).map(r => {
        var tdata = r.querySelectorAll('td');
        return {
            name: tdata[0].innerText.trim(),
            size: tdata[1].innerText.trim(),
            byteSize: sizeInBytes(tdata[1].innerText.trim())
        };
    });

    root = tree(root);
    tabl.style.display = 'none';
    var header = ce('div', 'tree_header colhead');
    var headerName = ce('span', 'header_name sort_ascending header_item');
    headerName.innerText = 'Name';
    headerName.addEventListener('click', sortTree);
    var headerFiles = ce('span', 'header_files header_item');
    headerFiles.innerText = 'Files';
    headerFiles.addEventListener('click', sortTree);
    var headerSize = ce('span', 'header_size header_item sort_ascending');
    headerSize.innerText = 'Size';
    headerSize.addEventListener('click', sortTree);
    headerName.dataset.type = 'header_name';
    headerFiles.dataset.type = 'header_files';
    headerSize.dataset.type = 'header_size';
    var tools = ce('span', 'header_tools');
    var expand = ce('a', 'header_expand');
    var filterInput = ce('input', 'header_filter');
    expand.text = '(📁Expand all)';
    expand.href = '#';
    expand.title = 'Expand all folders';
    expand.dataset.collapsed = 'collapsed';
    filterInput.placeholder = '🔍Filter list';
    filterInput.type = 'search';
    filterInput.addEventListener('input', filterList);
    filterInput.addEventListener('keyup', clearFilter);
    expand.addEventListener('click', expandAllFolders);
    tools.append(expand, filterInput);
    var headerLeft = ce('span', 'header_left');
    var headerRight = ce('span', 'header_right');
    headerLeft.append(headerName);
    headerRight.append(headerFiles, headerSize);
    header.append(headerLeft, tools, headerRight);
    fileList.append(header);

    var treeContainer = createTree();
    fileList.append(treeContainer);
    fileList.classList.remove('hidden');
}


function sortFolderSize(folder, ascending) {
    var direction = ascending ? 1 : -1;
    folder.files.sort((a, b) => {
        return direction * (b.byteSize - a.byteSize);
    });
    folder.folders.sort((a, b) => {
        return direction * (b.byteSize - a.byteSize);
    });
    folder.folders.forEach(f => {
        sortFolderSize(f, ascending);
    });
}


function sortFolderFiles(folder, ascending) {
    var direction = ascending ? 1 : -1;
    folder.folders.sort((a, b) => {
        return direction * (b.files.length - a.files.length);
    });
    folder.folders.forEach(f => {
        sortFolderFiles(f, ascending);
    });
}


function sortFolderName(folder, ascending) {
    var direction = ascending ? -1 : 1;
    folder.files.sort((a, b) => {
        return direction * (a.name.localeCompare(b.name));
    });
    folder.folders.sort((a, b) => {
        return direction * (a.name.localeCompare(b.name));
    });
    folder.folders.forEach(f => {
        sortFolderName(f, ascending);
    });
}


function sortTree() {
    var isAscending = this.classList.contains('sort_ascending');
    if (isAscending) {
        this.classList.add('sort_descending');
        this.classList.remove('sort_ascending');
    } else {
        this.classList.add('sort_ascending');
        this.classList.remove('sort_descending');
    }

    var others = this.parentElement.querySelectorAll(`.header_item:not(.${this.dataset.type})`);
    for (var other of others) {
        other.classList.remove('sort_ascending');
        other.classList.remove('sort_descending');
    }

    document.querySelector('.tree_container').remove();

    if (this.classList.contains('header_name')) {
        sortFolderName(root, isAscending);
    } else if (this.classList.contains('header_files')) {
        sortFolderFiles(root, isAscending);
    } else if (this.classList.contains('header_size')) {
        sortFolderSize(root, isAscending);
    }


    var treeContainer = createTree();
    fileList.append(treeContainer);
}


function findThumbnails() {
    var images = document.querySelectorAll('a[data-fancybox]');
    images.forEach(i => {
        var url = i.href;
        var name = url.split('/').pop();
        urlMap[nameHash(name)] = url;
    });
}


function bindGallery() {
    if (!window.Fancybox) return;
    var fancyboxConfig = {
        wheel: "slide",
        animationDuration: 80,
        contentClick: "toggleCover",
        contentDblClick: "zoomToMax",
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [
                    "zoomIn",
                    "zoomOut",
                    "toggle1to1",
                    "rotateCCW",
                    "rotateCW",
                    "thumbs",
                ],
                right: ["close"],
            },
        },
        Thumbs: {
            type: "classic",
            autoStart: false,
            showOnStart: false
        },
        Images: {
            Panzoom: {
                maxScale: 2,
                panMode: "mousemove",
                mouseMoveFriction: 0.2,
                mouseMoveFactor: 1.2
            }
        }
    };
    document.querySelectorAll('.folder:has(.file_preview)').forEach(folder => {
        Fancybox.bind(`[data-fancybox="${folder.dataset.name}"]`, fancyboxConfig);
    });
}

var fileList = document.querySelector('div[id^="files_"]');
var fileListToggle = document.querySelector('a[onclick^="show_files"]');
fileListToggle.text = '(Show file tree)';
var root = {};
fileListToggle.onclick = function toggleTree() {
    findThumbnails()

    if (this.classList.contains('open_tree')) {
        this.text = '(Show file tree)';
    } else {
        this.text = '(Hide file tree)';
    }
    this.classList.toggle('open_tree');
    fileList.classList.toggle('hidden');
    if (!document.querySelector('.tree_container')) {
        list2Tree();
        bindGallery();
    }
    return false;
};

var oldListItemOdd = fileList.querySelector('.rowa');
var oldStyleOdd = getComputedStyle(oldListItemOdd);
var treeStyle = ce('style');
document.head.append(treeStyle);
treeStyle.innerHTML = `
.tree_container * {
    margin: 0;
}
.tree_container {
    max-height: 600px;
    overflow-y: scroll;
    resize: vertical;
    contain: content;
}
.folder_container {
    margin-left: 1.5em;
    border-left: dashed thin #8FC5E0;
}
.tree_header {
    display: flex;
    padding: 0.5em 2em 0.3em 2em;
    justify-content: space-between;
    align-items: baseline;
}
.sort_ascending:after {
    content: '🡩';
    margin-left: 0.3em;
    font-size: 10pt;
}
.sort_descending:after {
    content: '🡫';
    margin-left: 0.3em;
    font-size: 10pt;
}
.header_item {
    cursor: pointer;
}
.header_left {
    display: flex;
    justify-content: start;
    flex: 1;
}
.header_right {
    display: flex;
    justify-content: end;
    gap: 2.5em;
    flex: 1;
}
.header_tools {
    display: flex;
    align-items: baseline;
    flex: 3;
    justify-content: center;
}
.header_expand {
    margin-right: 1em;
    font-weight: normal;
    font-size: 10pt;
    flex: 1;
    min-width: 8em;
    max-width: 9em;
}
.header_filter {
    border: none;
    border-radius: 5px;
    background: #29374F;
    color: #bcd;
    max-width: 20em;
    padding: 4px;
    flex: 3;
}
.file_list {
    padding-left: 0.5em;
}
.folder_list {
    margin-bottom: 10px;
}
.folder li {
    list-style-type: none;
}
.file_item:nth-child(odd) {
    background-color: ${oldStyleOdd.backgroundColor};
}
.folder_details  {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 0 2px 5px;
    margin-left: 0.5em;
    cursor: pointer;
}
.folder_open:before {
    content: '◢​📂';
    font-size: 12pt;
}
.folder_closed:before {
    content: '▷​📁';
    font-size: 12pt;
}
.folder_closed + div {
    display: none;
}
.folder_force_open + div {
    display:block;
}
.folder_details:before {
    margin-right: 0.3em;
  }
.folder_item:nth-child(odd) .folder_details {
    background-color: ${oldStyleOdd.backgroundColor};
}
.folder_name {
    flex: 1;
}
.folder_files {
    font-size: 9pt;
    min-width: 7em;
    text-align: end;
}
.folder_size {
    padding-right: 1em;
    font-size: 9pt;
    min-width: 7em;
    text-align: end;
}
.file_item {
    display: flex;
    align-items: center;
    font-size: 8pt;
    padding: 3px;
    cursor: default;
}
.file_name {
    flex: 1;
    margin-left: 0.5em;
}
.file_preview {
    color:inherit;
    flex:1;
}
.file_preview::after {
    content: '👁';
    padding-left: 0.5em;
}
.file_size {
    padding-right: 1em;
}
.filter_match {
    font-weight: bold;
    background-color: yellow;
}
.tree_item:hover {
    /*transform: scale(1.002);
    box-shadow: 2px 1px 8px #0006;*/
    background-color: #6baad040;
}
.file_item .font_icon {
    font-size: 10pt;
}
.file_item .icon_files_compressed {
    color:#F5C438;
    -webkit-text-stroke: 0.5px black;
}
.file_item .icon_files_executable {
    color:#f318bc;
}
.file_type_jpg, .file_type_jpeg {
    color:#a88526;
}
.file_type_mp4, .file_type_m4v {
    color:#7406a1;
}
.file_type_avi, .file_type_gif {
    color:#026102;
}
.file_type_mpg, .file_type_mpeg, .file_type_png {
    color:#740000;
}
.file_type_mkv, .file_type_mov, .file_type_bmp {
    color:#003cac;
}
.file_type_wmv {
    color:#694d00;
}
`;