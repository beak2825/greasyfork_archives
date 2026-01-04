// ==UserScript==
// @name         mangatoto.com, bato.to Downloader
// @description  Download chapter from mangatoto.com, bato.to. Based on waifubitches.com downloader
// @namespace    chimichanga
// @author       chimichanga
// @icon         https://bato.to/amsta/img/batoto/favicon.ico
// @version      2.0
// @license      MIT
// @match        https://bato.to/chapter/*
// @match        https://bato.to/title/*
// @match        https://mangatoto.com/chapter/*
// @match        https://mangatoto.com/title/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.4/FileSaver.min.js
// @noframes
// @connect      self
// @connect      batcg.org
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/470275/mangatotocom%2C%20batoto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/470275/mangatotocom%2C%20batoto%20Downloader.meta.js
// ==/UserScript==

// based originally on the 8muses.com downloader script
var downBtn;
var downStatus;
var zipFile;
const State = { NOT_STARTED: Symbol('not_started'), DOWNLOADING: Symbol('downloading'), COMPRESSING: Symbol('compressing'), DONE: Symbol('done') };
var state = State.NOT_STARTED;
var detectSourcesInterval;

var zip = new JSZip();
var resultBlob;
var sources = [];
var thumbnails = [];
var completed = 0;
var failed = 0;

var V3 = $('astro-island').length; // page version

$(document).ready(function () {
    console.log(V3);
    downBtn = $(`<a class="btn btn-outline ${V3 ? `btn-sm w-full` : `btn-md col-24`} btn-warning rounded "><i ${V3 ? 'style="font-family:FontAwesome5_Solid;font-weight:normal;font-style:normal"' : 'class="fas fa-fw fa-download"'}>${V3 ? '':''}</i> <span></span></a>`)
    let btnWrapper = $(`<div class="mt-3"></div>`).append(downBtn);
    downStatus = $(downBtn).find('span');

    $('div#container div.row').append(btnWrapper);
    $('#app-wrapper > div:nth-child(3) > div').append(btnWrapper);

    zipFile = document.title + '.zip';
    if (V3) zipFile = zipFile.replace(" - Read Free Manga Online at Bato.To", "");

    detectSources();
    detectSourcesInterval = setInterval(detectSources, 1000);

    $(downBtn).click(download);
});

function detectSources() {
    let detectedSources = $(V3 ? '[name=image-item] img' : 'img.page-img').map((_, { src }) => src).get();
    if(detectedSources.length > sources.length) {
        sources = detectedSources;
        updateState(State.NOT_STARTED);
    } else if (state == State.NOT_STARTED) {
        updateState(State.NOT_STARTED, 'detecting...');
    }
}

function updateState(newState, status) {
    state = newState;
    $(downBtn).toggleClass('btn-success', state == State.DONE);
    $(downBtn).toggleClass('btn-warning', state == State.NOT_STARTED || state == State.COMPRESSING || state == State.DOWNLOADING);
    $(downBtn).toggleClass('btn-danger', failed > 0);

    function getMsg() {
        let failedMsg = failed > 0 ? ` (${failed} failed)` : '';
        let statusMsg = status ? ` ${status}` : '';

        switch(state){
            case State.NOT_STARTED:
                return `DOWNLOAD (${sources.length || status})`;
            case State.DOWNLOADING:
                return `DOWNLOADING${statusMsg}${failedMsg}`;
            case State.COMPRESSING:
                return `COMPRESSING${statusMsg}${failedMsg}`;
            case State.DONE:
                return `ZIP READY`;
        }
    }

    $(downStatus).html(getMsg());
}

function download() {
    if (state == State.DONE && failed == 0) {
        saveZip();
        return;
    }

    if (state == State.DOWNLOADING || state == State.COMPRESSING)
        return;

    updateState(State.DOWNLOADING);

    completed = 0;
    failed = 0;

    let padLength = Math.floor(Math.log10(sources.length))+1;

    Promise.allSettled(
        sources.map((url, i) =>
            fetch(url).then(({ response, url }) => {
                completed++;
                updateState(State.DOWNLOADING, `${completed}/${sources.length}`);
                let fileName = `${i+1}`.padStart(padLength, 0) + `.webp`;
                zip.file(fileName, response);
            }).catch((cause) => {
                console.log(`can't fetch image ${i}, ${cause}: ${url}`);
                failed++;
            }))).then(saveZip);
}

function fetch(url) {
    return new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        onload: ({ response, status }) => status == 200 ? resolve({ response: response, url: url }) : reject('missing'),
        onerror: () => reject('error'),
        onabort: () => reject('abort'),
        ontimeout: () => reject('timeout'),
    }));
}

function saveZip() {
    if (state == State.DONE) {
        saveAs(resultBlob, zipFile);
        return;
    }

    zip.generateAsync(
        { type: 'blob' },
        ({ percent }) => updateState(State.COMPRESSING, `${percent.toFixed(2)}%`)
    ).then(function (blob) {
        updateState(State.DONE, `${completed}/${sources.length}`);
        resultBlob = blob;
        saveAs(resultBlob, zipFile);
    });
}