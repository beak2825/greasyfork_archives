// ==UserScript==
// @name            8chan Downloader
// @name:es         Descargador de 8chan
// @description     Downloads all the media from a thread
// @description:es  Descarga todos los medios de un hilo
// @author          V88fszv2wQC
// @license         Unlicense
// @version         2.0.0
// @match           https://8chan.moe/*/res/*
// @match           https://8chan.se/*/res/*
// @match           https://8chan.cc/*/res/*
// @match           http://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*/res/*
// @grant           GM_download
// @grant           GM_log
// @grant           GM_xmlhttpRequest
// @run-at          document-end
// @namespace https://greasyfork.org/users/1509245
// @downloadURL https://update.greasyfork.org/scripts/547433/8chan%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547433/8chan%20Downloader.meta.js
// ==/UserScript==

var utilityBar = document.querySelector('div.innerUtility.top');
if (utilityBar === null) {
    return;
}

async function _downloadFile(url, remainingAttempts) {
    "use strict";

    url = String(url);
    remainingAttempts = remainingAttempts|0;

    var file = url.split('/').at(-1);

    GM_log(`Downloading ${file}.`);
    const downloadPromise = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                cookie: "TOS20240717=1",
                nocache: true,
                responseType: "blob",
                onerror: (error) => reject(error),
                onload: (response) => resolve(response)
            });
    });

    await downloadPromise.catch(async function(error) {
        GM_log(`Failed to download ${file}. (${remainingAttempts} remaining attempts)`);
        if (remainingAttempts === 0) {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 10000/remainingAttempts));
        _downloadFile(url, remainingAttempts-1);
    });

    await downloadPromise.then((response) => {
        if (response.response === undefined) {
            // 5.4.6226 is when blob support is added to responseType
            GM_log(`Response data for ${file} is undefined. (Is Tampermonkey older than 5.4.6226?)`);
            return;
        }

        GM_log(`Saving ${file}.`);
        GM_download({
            url: response.response,
            name: file,
            saveAs: false,
            conflictAction: "uniquify"
        });
    });
}

async function _downloadFiles(urlList, maxAttempts) {
    "use strict";

    if (!(urlList instanceof Array)) {
        return new TypeError("Array required");
    }

    for (const url of urlList) {
        await _downloadFile(url, maxAttempts);
    }
}

var files = new Array();

var downloadButton = document.createElement("a");
downloadButton.innerText = "Download Thread";
downloadButton.onclick = () => {
    "use strict";

    if (files.length === 0) {
        for (const post of document.querySelectorAll("div.innerOP, div.innerPost")) {
            for (const uploadCell of post.querySelectorAll("figure.uploadCell")) {
                const url = uploadCell.querySelector("a.nameLink")?.getAttribute("href");
                if (url !== null) {
                    files.push(document.location.origin+url);
                }
            }
        }
    }

    if (files.length === 0) {
        GM_log("No files to download.");
        return;
    } else {
        GM_log(`Downloading ${files.length} files.`);
    }

    if (files.length <= 5) {
        _downloadFiles(files, 3);
        return;
    }

    var fileArrays = new Array();
    var commonSize = Math.floor(files.length / 5);
    var remaining = files.length % 5;

    if (remaining !== 0) {
        fileArrays.push(files.slice(-remaining));
    }

    for (let i = 0; i < commonSize * 5; i += commonSize) {
        fileArrays.push(files.slice(i, i + commonSize));
    }

    for (const fileArray of fileArrays) {
        _downloadFiles(fileArray, 3);
    }
}

utilityBar.appendChild(downloadButton);