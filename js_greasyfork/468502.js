// ==UserScript==
// @name         waifubitches.com, ososedki.com Downloader
// @description  Download gallery from waifubitches.com, ososedki.com
// @namespace    chimichanga
// @author       chimichanga
// @icon         https://waifubitches.com/favicon.ico
// @version      2.4
// @license      MIT
// @match        https://waifubitches.com/*gallery/*
// @match        https://ososedki.com/*photos/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.4/FileSaver.min.js
// @noframes
// @connect      self
// @connect      userapi.com
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/468502/waifubitchescom%2C%20ososedkicom%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/468502/waifubitchescom%2C%20ososedkicom%20Downloader.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

// based on the 8muses.com downloader script
var downBtn;
var downStatus;

const State = { NOT_STARTED: Symbol('not_started'), DOWNLOADING: Symbol('downloading'), COMPRESSING: Symbol('compressing'), DONE: Symbol('done') };
var state = State.NOT_STARTED;

var data;

var zip = new JSZip();
var resultBlob;

var completed = 0;
var failed = 0;

$(document).ready(function () {

    data = selectData();

    if (data.sources.length == 0) {
        console.warn("No images found to download");
        return;
    }

    console.info("download data:", data);

    downBtn = $(`<a class="btn btn-sm btn-warning"><i class="bi bi-download"></i> <span>DOWNLOAD (${data.sources.length})</span></a>`);
    downStatus = $(downBtn).find('span');

    data.buttonParent.append(downBtn);

    $(downBtn).click(download);
});

function selectData() {
    let mapping = {
      'waifubitches.com': waifubitchesSelector,
      'ososedki.com': osodekiSelector,
    };
    return mapping[document.location.host]();
}

function waifubitchesSelector() {
    let sources = $('div.grid .grid-item a').map((_, { href }) => href).get();
    let thumbnails = $('div.grid .grid-item img.img-fluid').map((_, { src }) => src).get();

    return {
        sources: sources.map((s, i) => (
            {url: s,
             thumb: thumbnails[i],
             name: s.split(/(?:\/(?:a|impg)\/|\?)/)[1]?.replaceAll('/', '-')
            }))
            .filter(s => s.url.includes('//waifubitches.com') || s.url.includes('userapi.com')),
        buttonParent: $('body > div:nth-child(1) > div.pb-2 > center > noindex'),
        zipName: window.location.href.split('/gallery/')[1] + '+' + $('body > div:nth-child(1) > h1').get(0).innerText + '.zip',
    };
}

function osodekiSelector() {
   let sources = $('div.thumbs a').map((_, { href }) => href).get();
   let thumbnails = $('div.thumbs a img').map((_, { src }) => src).get();

    let data = {
        sources: sources.map((s, i) => ({url: s, thumb: thumbnails[i], name: s.split(/(?:\/(?:a|impg)\/|\?)/)[1]?.replaceAll('/', '-') }))
           .filter(s => s.url.includes('//ososedki.com') || s.url.includes('userapi.com')),
        buttonParent: $('body > div:nth-child(1) > div.pb-2 > center > noindex'),
        zipName: window.location.href.split('/photos/')[1] + '+' + $('body > div:nth-child(1) > h1').get(0).innerText + '.zip',
    };

    return data;
}

function updateState(newState, progress) {
    state = newState;
    $(downBtn).toggleClass('btn-success', state == State.DONE);
    $(downBtn).toggleClass('btn-warning', state == State.NOT_STARTED || state == State.COMPRESSING || state == State.DOWNLOADING);
    $(downBtn).toggleClass('btn-danger', failed > 0);

    let messages = {
        [State.NOT_STARTED]: `DOWNLOAD`,
        [State.DOWNLOADING]: `DOWNLOADING`,
        [State.COMPRESSING]: `COMPRESSING`,
        [State.DONE]: `ZIP READY`,
    };

    $(downStatus).html(messages[state] + (failed > 0 ? ` (${failed} failed)` : '') + (progress ? ` ${progress}` : ''));
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

    Promise.allSettled(
        data.sources.map(({url, thumb, name}) =>
            fetch(url).catch((cause) => {
                console.log(`can't fetch original image, ${cause}: ${url}`);
                return fetch(thumb);
            }).then(({ response, url }) => {
                completed++;
                updateState(State.DOWNLOADING, `${completed}/${data.sources.length}`);
                zip.file(name, response);
            }).catch((cause) => {
                console.log(`can't fetch thumbnail image, ${cause}: ${url}`);
                failed++;
            })))
        .then(saveZip);
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
        saveAs(resultBlob, data.zipName);
        return;
    }

    zip.generateAsync(
        { type: 'blob' },
        ({ percent }) => updateState(State.COMPRESSING, `${percent.toFixed(2)}%`)
    ).then(function (blob) {
        updateState(State.DONE, `${completed}/${data.sources.length}`);
        resultBlob = blob;
        saveAs(resultBlob, data.zipName);
    });
}