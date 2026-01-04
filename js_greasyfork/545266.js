// ==UserScript==
// @name            8chan Media Downloader
// @description     Downloads all media from a thread
// @author          t9pg8vPaW5F
// @license         Unlicense
// @version         1.0.0
// @match           https://8chan.moe/*/res/*
// @match           https://8chan.se/*/res/*
// @match           https://8chan.cc/*/res/*
// @match           http://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*/res/*
// @grant           GM_download
// @grant           GM_log
// @grant           GM_xmlhttpRequest
// @run-at          document-end
// @namespace https://greasyfork.org/users/1503386
// @downloadURL https://update.greasyfork.org/scripts/545266/8chan%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545266/8chan%20Media%20Downloader.meta.js
// ==/UserScript==

async function _downloadFile(url, maxAttempts, attempt) {
    attempt = (attempt|0)+1;
    maxAttempts = maxAttempts|0;
    url = String(url);
    var file = url.split('/').at(-1);

    if (attempt > maxAttempts) {
        GM_log(`Could not download ${file}.`);
        return;
    }

    await GM_xmlhttpRequest({
        method: "GET",
        url: url,
        cookie: "TOS20240717=1",
        nocache: true,
        responseType: "blob",
        onerror: async function(error) {
            GM_log(`Failed to download ${file}. (Attempt ${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt)));
            _downloadFile(url, maxAttempts, attempt);
        },
        onload: function(response) {
            GM_log(`Saving ${file}.`);
            GM_download({
                url: response.response,
                name: file,
                saveAs: false,
                conflictAction: "uniquify"
            });
        }
    });
}

var utilityBar = document.querySelector('div.innerUtility.top');
if (utilityBar === null) {
    return;
}

var downloadButton = document.createElement("a");
downloadButton.innerText = "Download Thread";
downloadButton.onclick = function() {
    var files = new Array();
    for (const post of document.querySelectorAll("div.innerOP, div.innerPost")) {
        for (const uploadCell of post.querySelectorAll("figure.uploadCell")) {
            const url = uploadCell.querySelector("a.nameLink")?.getAttribute("href");
            if (url !== null) {
                files.push(url);
            }
        }
    }

    GM_log(`Downloading ${files.length} files.`);
    for (const file of files) {
        _downloadFile(document.location.origin+file, 5);
    }
}

utilityBar.appendChild(downloadButton);