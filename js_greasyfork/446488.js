// ==UserScript==
// @name         NHentai Konnichiwa
// @author       naiymu
// @version      1.1.12
// @license      MIT; https://raw.githubusercontent.com/naiymu/nhentai-konnichiwa/main/LICENSE
// @namespace    https://github.com/naiymu/nhentai-konnichiwa
// @homepage     https://github.com/naiymu/nhentai-konnichiwa
// @supportURL   https://github.com/naiymu/nhentai-konnichiwa/issues
// @description  A simple usercript for downloading doujinshi from NHentai and mirrors
// @match        https://nhentai.net/*
// @match        https://nhentai.xxx/*
// @match        https://nyahentai.red/*
// @match        https://nhentai.to/*
// @match        https://nhentai.website/*
// @exclude      /https:\/\/n.*hentai.(red|net|xxx|to|website)\/g\/[0-9]*\/[0-9]+\/?$/
// @connect      nhentai.xxx
// @connect      cdn.nload.xyz
// @connect      i3.nhentai.net
// @connect      cdn.nhentai.xxx
// @connect      nhentai.com
// @connect      t.dogehls.xyz
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js
// @require      https://unpkg.com/comlink@4.3.1/dist/umd/comlink.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @icon         https://raw.githubusercontent.com/naiymu/nhentai-konnichiwa/main/assets/icon.png
// @downloadURL https://update.greasyfork.org/scripts/446488/NHentai%20Konnichiwa.user.js
// @updateURL https://update.greasyfork.org/scripts/446488/NHentai%20Konnichiwa.meta.js
// ==/UserScript==

GM_addStyle (
`
.relative {
  position: relative !important;
}

.download-check {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  height: 20px;
  width: 20px;
  accent-color: #ed2553;
}

.download-check:focus,
.download-check:hover {
  box-shadow: 0 0 10px 0 #ed2553;
}

.red-box {
  position: relative;
  background-color: #ed2553;
  color: white;
  border: none;
  outline: none;
  font-size: 16px;
  width: 80px;
  height: 35px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.percent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.downloading-span,
.compressing-span {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  border-radius: 5px;
}

.downloading-span {
  background-color: #03c03c;
}

.compressing-span {
  background-color:  #0047ab;
}

.red-box:hover {
  background-color: #4d4d4d;
}

.red-box>i,
.red-box>.download-check {
  margin-right: 5px;
}

.download-check-all {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #1f1f1f;
}

.red-box>.download-check:focus,
.red-box>.download-check:hover {
  box-shadow: none;
}

.red-box:disabled {
  background-color: #1f1f1f;
  cursor: default;
}

.download-div {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.div-horizontal {
  flex-direction: row !important;
}

.fa-spinner,
.fa-circle-notch {
  animation: spin 1.5s infinite linear;
}

@keyframes spin {
  100% {transform: rotate(359deg)};
}

.config-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999999;
  visibility: hidden;
}

.visible {
  visibility: visible;
}

.config-div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  max-width: 850px;
  max-height: 550px;
  padding: 50px;
  transform: translate(-50%, -50%);
  background-color: #1f1f1f;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  overflow: scroll;
}

.config-element-div {
  width: 100%;
  display: inline-grid;
  grid: auto / 200px auto;
  margin-bottom: 15px
}

.config-element-div>input {
  color: #000 !important;
}

.config-element-div>label {
  grid-column-start: 1;
}

.config-element-div>input[type='checkbox'] {
  justify-self: left;
}

.config-element-div>*:not(label) {
  grid-column-start: 2;
  border-radius: 0;
  border: none;
  background-color: #d9d9d9 !important;
}

.config-btn-div {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.config-reset:hover {
  cursor: pointer;
  color: #ed2553;
}

.heading {
  width: 100%;
  border-bottom: solid 1px #d9d9d9;
  text-align: left;
}
`
);

const netMediaUrl = "https://i3.nhentai.net/galleries/";
const btnStates = {
    enabled: "<i class='fa fa-download'></i>",
    fetching: "<i id='btn-spinner' class='fa fa-spinner'></i>",
    downloading: "<i id='btn-spinner' class='fa fa-circle-notch'></i>",
    config: "<i class='fa fa-cog'></i>",
};
const titleFormats = {
    PR: "pretty",
    EN: "english",
    JP: "japanese",
    ID: "id",
};
const saveJSONModes = {
    NO: "Don't save",
    FI: "Save as JSON file",
    CB: "Copy to clipboard",
};
const fileNameSeps = {
    SP: "Space",
    HY: "Hyphen",
    US: "Underscore",
};
const btnOrientations = {
    VR: "Vertical",
    HR: "Horizontal",
};
const CONFIG = {
    simulN: {
        label: 'Download batch size',
        type: 'int',
        min: 1,
        max: 50,
        default: 10,
    },
    compressionLevel: {
        label: 'Compression level',
        type: 'int',
        min: 0,
        max: 9,
        default: 0,
    },
    titleFormat: {
        label: 'Title format',
        type: 'select',
        options: [titleFormats.PR,titleFormats.EN,titleFormats.JP,
                  titleFormats.ID],
        default: titleFormats.PR,
    },
     fileNamePrep: {
        label: 'Filename to prepend',
        type: 'text',
        size: 30,
        default: "",
    },
     fileNameSep: {
        label: 'Filename separator',
        type: 'select',
        options: [fileNameSeps.SP,fileNameSeps.HY,fileNameSeps.US],
        default: fileNameSeps.SP,
    },
    saveJSONMode: {
         label: 'Save JSON',
         type: 'select',
         options: [saveJSONModes.NO,saveJSONModes.FI,saveJSONModes.CB],
         default: saveJSONModes.NO,
     },
    includeGroups: {
        label: 'Include groups in authors',
        type: 'checkbox',
        default: false,
    },
    btnOrientation: {
        label: 'Button orientation',
        type: 'select',
        options: [btnOrientations.VR, btnOrientations.HR],
        default: btnOrientations.VR,
    },
    openInNewTab: {
        label: 'Open galleries in new tab',
        type: 'checkbox',
        default: true,
    },
    autorestart: {
        label: 'Auto restart downloads',
        type: 'checkbox',
        default: true,
    }
};

const WORKER_THREAD_NUM = ((navigator && navigator.hardwareConcurrency) || 2) - 1;

class JSZipWorkerPool {
    constructor() {
        this.pool = [];
        this.WORKER_URL = URL.createObjectURL(
            new Blob(
                [
                    `importScripts(
                         'https://unpkg.com/comlink/dist/umd/comlink.min.js',
                         'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js'
                     );
                     class JSZipWorker {
                         constructor() {
                             this.zip = new JSZip;
                         }
                         file(title, name, {data:data}) {
                             this.zip.folder(title).file(name, data);
                         }
                         async generateAsync(options, onUpdate) {
                             const data = await this.zip.generateAsync(options, onUpdate);
                             const url = URL.createObjectURL(data);
                             return Comlink.transfer({url:url});
                         }
                     }
                     Comlink.expose(JSZipWorker);`
                ],
                {type: 'text/javascript'}
            )
        );
        for(let id=0; id<WORKER_THREAD_NUM; id++) {
            this.pool.push({
                id,
                JSZip: null,
                idle: true,
            });
        }
    }
    createWorker() {
        const worker = new Worker(this.WORKER_URL);
        return Comlink.wrap(worker);
    }
    async generateAsync(files, options, onUpdate) {
        const worker = this.pool.find(({idle}) => idle);
        if(!worker) throw new Error('No available JSZip worker');
        worker.idle = false;
        if(!worker.JSZip) worker.JSZip = this.createWorker();
        const zip = await new worker.JSZip();
        for(const {title, name, data} of files) {
            await zip.file(title, name, Comlink.transfer({data}, [data]));
        }
        return zip
               .generateAsync(
                   options,
                   Comlink.proxy((data) => onUpdate({workerId: worker.id, ...data}))
               )
               .then(({url}) => {
                   worker.idle = true;
                   return url;
               });
    }
}

const jsZipPool = new JSZipWorkerPool();

class JSZip {
    constructor() {
        this.files = [];
    }
    file(title, name, data) {
        this.files.push({title, name, data});
    }
    generateAsync(options, onUpdate) {
        return jsZipPool.generateAsync(this.files, options, onUpdate);
    }
}

// nhentai.net API URL
const netAPI = "https://nhentai.net/api/gallery/";
// nhentai.xxx page URL
const xxxPage = "https://nhentai.xxx/g/";
// If we are on nhentai.net
const onNET = location.hostname == 'nhentai.net';
// DOM parser for later
var parser = new DOMParser();
// Saved config options
var configOptions = JSON.parse(GM_getValue('configOptions') || '{}');
// Buttons and Divs
var downloadDiv,
    downloadBtn,
    downloadPercent,
    downloadingSpan,
    compressingSpan,
    configWrapper,
    configDiv;
// Download info
var downloading = false,
    cancelled = false,
    total = 0,
    downloaded = 0,
    currentDownloads = 0,
    queue = [],
    info = JSON.parse(sessionStorage.getItem('info') || '[]');
// Final zip
var zip;

function disableButton(btnState) {
    downloadingSpan.style.width = 0;
    compressingSpan.style.width = 0;
    downloadBtn.disabled = true;
    downloadPercent.innerHTML = btnState;
}

function enableButton() {
    downloadingSpan.style.width = 0;
    compressingSpan.style.width = 0;
    downloadBtn.disabled = false;
    downloadPercent.innerHTML = btnStates.enabled;
}

function createNode(element, classes=[]) {
    var node = document.createElement(element);
    for(let cls of classes) {
        node.classList.add(cls);
    }
    return node;
}

function createLabel(id, text) {
    var label = createNode('label');
    label.innerHTML = text;
    label.setAttribute('for', id);
    return label;
}

function getExtension(type) {
    switch(type) {
        case 'j': return '.jpg';
        case 'p': return '.png';
        case 'g': return '.gif';
        case 'w': return '.webp';
    }
}

function saveConfig(reset=false) {
    const oldOpenInNewTab = configOptions.openInNewTab;
    for(const [key, value] of Object.entries(CONFIG)) {
        var element = document.getElementById(`config-${key}`);
        var configValue;
        switch(value.type) {
            case 'checkbox':
                configValue = element.checked;
                break;
            case 'int':
                configValue = element.value;
                if(configValue > value.max) {
                    configValue = value.max;
                }
                if(configValue < value.min) {
                    configValue = value.min;
                }
                break;
            default:
                configValue = element.value;
        }
        configValue = reset ? value.default : configValue;
        configOptions[key] = configValue;
        element.value = configValue;
        if(value.type == 'checkbox') element.checked = configValue;
    }
    if(configOptions.btnOrientation == btnOrientations.HR) {
        downloadDiv.classList.add('div-horizontal');
    }
    else {
        downloadDiv.classList.remove('div-horizontal');
    }
    GM_setValue('configOptions', JSON.stringify(configOptions));
    if(configOptions.openInNewTab != oldOpenInNewTab) {
        var gLinks = document.querySelectorAll('.gallery > a, .gallerythumb');
        for(let a of gLinks) {
            if(configOptions.openInNewTab) {
                a.setAttribute('target', '_blank');
            }
            else {
                a.removeAttribute('target');
            }
        }
    }
}

function addConfigMenu() {
    var saveConfigBtn, closeConfigBtn, cancelAnchor, resetConfigAnchor;

    var heading = createNode('h3', ['heading']);
    heading.innerHTML = "nhentai-konnichiwa";
    configDiv.appendChild(heading);

    for(const [key, value] of Object.entries(CONFIG)) {
        var div = createNode('div', ['config-element-div']);
        var element, id, label;
        switch(value.type) {
            case 'select':
                element = createNode('select');
                for(let i=0; i<value.options.length; i++) {
                    var optionElement = createNode('option');
                    var option = value.options[i];
                    optionElement.text = option;
                    optionElement.value = option;
                    element.appendChild(optionElement);
                }
                break;
            case 'int':
                element = createNode('input');
                element.type = 'number';
                if(value.min != undefined) {
                    element.min = value.min;
                }
                if(value.max != undefined) {
                    element.max = value.max;
                }
                break;
            case 'checkbox':
                element = createNode('input');
                element.type = 'checkbox';
                break;
            case 'text':
                element = createNode('input');
                element.type = 'text';
                element.maxLength = value.size;
                element.defaultValue = value.default;
                break;
        }
        id = `config-${key}`;
        element.id = id;
        var configValue = (configOptions.hasOwnProperty(key))
                          ? configOptions[key]
                          : value.default;
        if(value.type == 'checkbox') {
            element.checked = configValue;
        }
        else {
            element.value = configValue;
        }
        // If key does not exist in configOptions, add it
        if(!configOptions[key]) {
            configOptions[key] = configValue;
        }
        label = createLabel(id, value.label);

        div.appendChild(label);
        div.appendChild(element);

        configDiv.appendChild(div);
    }

    var btnDiv = createNode('div', ['config-btn-div']);
    saveConfigBtn = createNode('button', ['red-box']);
    saveConfigBtn.innerHTML = "Save";
    saveConfigBtn.addEventListener('click', () => {
        saveConfig();
    });

    closeConfigBtn = createNode('button', ['red-box']);
    closeConfigBtn.innerHTML = "Close";
    closeConfigBtn.addEventListener('click', () => {
        configWrapper.classList.remove('visible');
    });

    cancelAnchor = createNode('a', ['config-reset']);
    cancelAnchor.innerHTML = "Cancel downloads";
    cancelAnchor.addEventListener('click', () => {
        cancelDownload();
    });

    resetConfigAnchor = createNode('a', ['config-reset']);
    resetConfigAnchor.innerHTML = 'Reset to default';
    resetConfigAnchor.addEventListener('click', () => {
        saveConfig(true);
    });

    btnDiv.appendChild(saveConfigBtn);
    btnDiv.appendChild(closeConfigBtn);
    btnDiv.appendChild(cancelAnchor);
    btnDiv.appendChild(resetConfigAnchor);

    configDiv.appendChild(btnDiv);
}

(async function() {
    'use strict';

    window.addEventListener('beforeunload', (e) => {
        if(downloading) {
            e.preventDefault();
            return '';
        }
    });

    var aList, configBtn, checkAllDiv, checkAll;

    configWrapper = createNode('div', ['config-wrapper']);
    configDiv = createNode('div', ['config-div']);
    configWrapper.addEventListener('click', () => {
        if(event.target != configWrapper) {
            return;
        }
        configWrapper.classList.remove('visible');
    });
    configWrapper.appendChild(configDiv);
    addConfigMenu();

    aList = document.querySelectorAll(".gallery > a, #cover > a");
    for(let a of aList) {
        if(configOptions.openInNewTab) a.setAttribute('target', '_blank');
        var ref = a.href;
        var parent = a.parentElement;
        var code;
        code = ref.split("/g/")[1];
        if(code.endsWith("/")) {
            code = code.split("/")[0];
        }
        var check = createNode('input', ['download-check']);
        check.type = 'checkbox';
        check.value = code;
        parent.classList.add("relative");
        parent.appendChild(check);
    }
    if(configOptions.openInNewTab) {
        aList = document.getElementsByClassName("gallerythumb");
        for(let a of aList) {
            a.setAttribute('target', '_blank');
        }
    }
    let classes = ['download-div'];
    if(configOptions.btnOrientation == btnOrientations.HR) {
        classes.push('div-horizontal');
    }
    downloadDiv = createNode('div', classes);

    downloadBtn = createNode('button', ['red-box']);
    downloadPercent = createNode('span', ['percent']);
    downloadingSpan = createNode('span', ['downloading-span']);
    compressingSpan = createNode('span', ['compressing-span']);
    enableButton();
    downloadBtn.appendChild(downloadingSpan);
    downloadBtn.appendChild(compressingSpan);
    downloadBtn.appendChild(downloadPercent);

    configBtn = createNode('button', ['red-box']);
    configBtn.innerHTML = btnStates.config;
    configBtn.addEventListener("click", (event) => {
        configWrapper.classList.add('visible');
    });

    checkAllDiv = createNode('div', ['red-box', 'relative']);
    checkAll = createNode('input', ['download-check-all']);
    checkAll.type = 'checkbox';
    checkAll.addEventListener('change', () => {
        let toCheck = checkAll.checked;
        let boxes = document.querySelectorAll('.download-check');
        for(let box of boxes) {
            if(box === checkAll) {
                continue;
            }
            box.checked = toCheck;
        }
    });
    checkAllDiv.appendChild(checkAll);

    downloadBtn.addEventListener("click", async () => {
        var checked = document.querySelectorAll(".download-check:checked");
        if(checked.length > 0) {
            disableButton(btnStates.fetching);
        }
        else {
            return;
        }
        zip = await new JSZip();
        switch(configOptions.fileNameSep) {
            case fileNameSeps.SP: configOptions.fileNameSep = " "; break;
            case fileNameSeps.HY: configOptions.fileNameSep = "-"; break;
            case fileNameSeps.US: configOptions.fileNameSep = "_"; break;
        }
        for(let c of checked) {
            c.checked = false;
        }
        for(const c of checked) {
            var code = c.getAttribute("value");
            await addInfo(code);
            sessionStorage.setItem('info', JSON.stringify(info));
        }
        startDownload();
    });

    downloadDiv.appendChild(downloadBtn);
    downloadDiv.appendChild(configBtn);
    downloadDiv.appendChild(checkAllDiv);

    document.body.appendChild(downloadDiv);
    document.body.appendChild(configWrapper);

    if(info.length > 0) {
        if(configOptions.autorestart) {
            queue = [];
            startDownload();
        }
        else {
            info = [];
            sessionStorage.removeItem('info');
        }
    }
})();

function startDownload() {
    downloading = true;
    cancelled = false;
    currentDownloads = 0;
    downloaded = 0;
    zip = new JSZip();
    populateQueue();
    total = queue.length;
    disableButton(btnStates.downloading);
    downloadQueue();
}

function cancelDownload() {
    info = [];
    queue = [];
    sessionStorage.removeItem('info');
    currentDownloads = 0;
    downloading = false;
    cancelled = true;
    enableButton();
}

function cleanString(string) {
    string = string.replace(/(\.+$)|(^\.+)|(\|)/g, '');
    string = string.replace(/\\\/\:\;/g, configOptions.fileNameSep);
    string = string.replace(/\s\s+/, ' ');
    string = string.trim();
    return string;
}

async function makeGetRequest(url, code = null) {
    return new Promise((resolve, reject) => {
        if(onNET) {
            fetch(url, {
                method: 'GET',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'same-origin',
            })
            .then(response => resolve(response.json()));
        }
        else {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => {
                    resolve(parseXXXResponse(response, code));
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        }
    });
}

function addInfoNET(obj, code) {
    var title;
    if(configOptions.titleFormat == 'id') {
        title = `${obj.id}`;
    }
    else {
        title = obj.title[configOptions.titleFormat];
        title = cleanString(title);
    }
    var pages = obj.num_pages;
    var tagList = obj.tags;
    var artists = [];
    var tags = [];
    for(let i=0; i<tagList.length; i++) {
        let tagItem = tagList[i];
        if(tagItem.type == "artist"
            || (configOptions.includeGroups && tagItem.type == "group")) {
            artists.push(tagItem.name);
        }
        if(tagItem.type == "tag") {
            tags.push(tagItem.name);
        }
    }
    var mediaUrl = `${netMediaUrl}${obj.media_id}/`;
    const constTitleExists = info.some((el) => el.title === title);
    if(constTitleExists) {
        title += " - "+code;
    }
    var fileNamePrep = configOptions.fileNamePrep;
    fileNamePrep = cleanString(fileNamePrep);
    var namePrep = "";
    if(fileNamePrep != "") {
        namePrep = fileNamePrep + configOptions.fileNameSep;
    }
    var coverExtension = getExtension(obj.images.pages[0].t);
    info.push({
        code: code,
        title: title,
        artists: artists,
        tags: tags,
        pages: pages,
        mediaUrl: mediaUrl,
        namePrep: namePrep,
        coverExtension: coverExtension,
        pagesInfo: obj.images.pages,
    });
}

async function addInfo(code) {
    var apiUrl, obj;
    if(onNET) {
        apiUrl = netAPI + code;
        obj = await makeGetRequest(apiUrl);
        addInfoNET(obj, code);
    }
    else {
        apiUrl = xxxPage + code;
        obj = await makeGetRequest(apiUrl, code);
        info.push(obj);
    }
}

function parseXXXResponse(response, code) {
    var htmlDoc = parser.parseFromString(response.responseText,
                                         'text/html');
    var title, artists = [], tags = [], pages, mediaUrl, pagesInfo = [], coverExtension;
    var titleTemplate = string => {
        return `${string}.title > span`;
    }
    const cleanRegex = /(\[[^\]]*\])|(\([^)]*\))|(\{[^}]*\})|([\.\|\~]*)/g;
    switch(configOptions.titleFormat) {
        case 'english':
            title = htmlDoc.querySelector(titleTemplate('h1'));
            title = title.textContent;
            break;
        case 'japanese':
            title = htmlDoc.querySelector(titleTemplate('h2'));
            title = title.textContent;
            break;
        case 'pretty':
        default:
            title = htmlDoc.querySelector(titleTemplate('h1'));
            title = title.textContent;
            title = title.replace(cleanRegex, '');
            title = title.replace(/\s\s+/g, ' ');
            title = title.trim();
            title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    var tagTemplate = string => {
        return `a[href*='${string}/'] > span.name`;
    }
    var artistSpans = htmlDoc.querySelectorAll(tagTemplate('artist'));
    for(var artist of artistSpans) {
        artists.push(artist.textContent);
    }
    if(configOptions.includeGroups) {
        var groupSpans = htmlDoc.querySelectorAll(tagTemplate('group'));
        for(var group of groupSpans) {
            artists.push(group.textContent);
        }
    }
    var tagSpans = htmlDoc.querySelectorAll(tagTemplate('tag'));
    for(var tag of tagSpans) {
        tags.push(tag.textContent);
    }
    pages = htmlDoc.querySelector(".tag[href*='#'] > span.name");
    pages = parseInt(pages.textContent);
    var fileNamePrep = configOptions.fileNamePrep;
    fileNamePrep = cleanString(fileNamePrep);
    var namePrep = "";
    if(fileNamePrep != "") {
        namePrep = fileNamePrep + configOptions.fileNameSep;
    }
    var thumbs = htmlDoc.querySelectorAll("a.gallerythumb > img");
    mediaUrl = thumbs[0].src;
    mediaUrl = mediaUrl.substring(0, mediaUrl.lastIndexOf("/")+1);
    for(var thumb of thumbs) {
        var extension = thumb.src.split('.').pop().charAt(0);
        pagesInfo.push({t: extension});
    }
    coverExtension = getExtension(pagesInfo[0].t);
    var obj = {
        code: code,
        title: title,
        artists: artists,
        tags: tags,
        pages: pages,
        mediaUrl: mediaUrl,
        namePrep: namePrep,
        coverExtension: coverExtension,
        pagesInfo: pagesInfo,
    }
    return obj;
}

async function addToQueue(item, mediaId=null) {
    var pages = item.pages;
    var title = item.title;
    var namePrep = item.namePrep;
    var mediaUrl = item.mediaUrl;
    for(let i=0; i<pages; i++) {
        var extension = getExtension(item.pagesInfo[i].t);
        let page = i + 1;
        var imgUrl = `${mediaUrl}${page}${extension}`;
        queue.push({
            page: page,
            url: imgUrl,
            title: title,
            namePrep: namePrep,
            extension: extension,
        });
    }
}

function populateQueue() {
    for(const item of info) {
        addToQueue(item);
    }
}

async function downloadQueue() {
    while(queue.length > 0) {
        if(currentDownloads >= configOptions.simulN) {
            await sleep(125);
            continue;
        }
        var item = queue.shift();
        download(item);
    }
}

function saveJSON(fileName) {
    var data = [];
    for(var item of info) {
        data.push({
            dirName: item.title,
            dirCover: `${item.namePrep}1${item.coverExtension}`,
            authors: item.artists,
            tags: item.tags,
        });
    }
    var fileContent = {
        'directories': data
    };
    fileContent = JSON.stringify(fileContent, null, 2);
    if(configOptions.saveJSONMode == saveJSONModes.CB) {
        GM_setClipboard(fileContent, 'text');
        return;
    }
    fileContent = new TextEncoder().encode(fileContent);
    zip.file('', fileName, fileContent.buffer);
}

function generateZip() {
    var dateName = Date.now();
    var compressionType = configOptions.compressionLevel == 0
                          ? 'STORE'
                          : 'DEFLATE';
    var zipName = `${dateName}.zip`;
    var jsonName = `${dateName}.json`;
    if(configOptions.saveJSONMode != saveJSONModes.NO) {
        saveJSON(jsonName);
    }
    zip.generateAsync(
        {
        type: 'blob',
        compression: compressionType,
        compressionOptions: {
            level: configOptions.compressionLevel,
        }},
        ({workerId, percent, currentFile}) => {
            var fraction = percent / 100;
            if(fraction == 1) {
                enableButton();
                return;
            }
            downloadPercent.innerHTML = `${percent.toFixed(2)}%`;
            compressingSpan.style.width = fraction * downloadBtn.offsetWidth + 'px';
        }
    )
    .then((url) => {
        var a = createNode('a');
        a.download = zipName;
        a.href = url;
        a.click();
    })
    .then(() => {
        info = [];
        sessionStorage.removeItem('info');
        downloading = false;
    });
}

function download(item) {
    currentDownloads++;
    const fileName = `${item.namePrep}${item.page}${item.extension}`;
    GM_xmlhttpRequest({
        method: 'GET',
        url: item.url,
        responseType: 'arraybuffer',
        onload: (response) => {
            if(cancelled) return;
            var data = response.response;
            zip.file(item.title, fileName, data);

            currentDownloads--;

            downloaded++;
            var fraction = downloaded/total;
            downloadPercent.innerHTML = `${(fraction * 100).toFixed(2)}%`;
            downloadingSpan.style.width = fraction * downloadBtn.offsetWidth + 'px';

            if(queue.length == 0 && currentDownloads <= 0) {
                disableButton(btnStates.downloading);
                generateZip();
            }
        },
        onerror: (error) => {
            currentDownloads--;
            console.warn(`Could not download '${item.title}' - page ${item.page}`);
        }
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
