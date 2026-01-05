// ==UserScript==
// @name         Batoto Quick Links
// @namespace    Doomcat55
// @version      0.3
// @description  Add convenient links to Batoto series pages.
// @author       Doomcat55
// @match        *://bato.to/reader
// @match        *://bato.to/comic/_/comics/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/25733/Batoto%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/25733/Batoto%20Quick%20Links.meta.js
// ==/UserScript==

(function matchURL(path) {
    switch (true) {
        case /\/reader/.test(path):
            setBookmarks();
            break;
        case /\/comic\/_\/comics/.test(path):
            showBookmarks();
            break;
    }
})(window.location.pathname);


function parseSeriesID(link) {
    const text = link.match(/-r(\d+)/)[1];
    return parseInt(text);
}

function setBookmarks() {
    const reader = document.getElementById('reader');

    const observer = new MutationObserver(() => {
        const seriesID = parseSeriesID(document.querySelector('a[href*="/comic/"]').pathname);
        const pageID = window.location.hash;
        GM_setValue(seriesID, pageID);
    });

    observer.observe(reader, {childList: true});
}

function showBookmarks() {
    const seriesID = parseSeriesID(window.location.pathname);
    const bookmarkedPage = GM_getValue(seriesID);
    const linkedPage = bookmarkedPage || (document.querySelector('.chapter_row:nth-last-child(2) td:first-child a') || {}).hash;
    if (linkedPage) {
        const quickLink = document.createElement('a');
        quickLink.href = `/reader${linkedPage}`;
        quickLink.className = 'ipsButton_secondary';
        quickLink.innerHTML = bookmarkedPage ? 'Resume reading' : 'First chapter';
        const linkParent = document.querySelector('.__like.right');
        linkParent.insertBefore(quickLink, linkParent.firstChild);
    }
}


function exportBookmarks() {
    const data = GM_listValues().map(key => [key, GM_getValue(key)]);
    const url = `data:application/json,${encodeURIComponent(JSON.stringify(data))}`;
    GM_download({
        url: url,
        name: 'batoto-bookmarks.json',
        onerror: download => {
            console.log(download);
        }
    });
}


function acceptUpload({ accept }, handleFile) {
    const button = document.createElement('button');
    const input = document.createElement('input');

    button.innerHTML = 'Click to import';
    button.setAttribute('style', 'position: fixed; width: 100px; height: 50px; left: calc(50vw - 50px); top: calc(50vh - 25px);');
    button.addEventListener('click', () => {
        input.click();
        document.body.removeChild(button);
    });

    input.setAttribute('type', 'file');
    if (accept) {
        input.setAttribute('accept', accept);
    }
    input.setAttribute('style', 'display: none;');
    input.addEventListener('change', event => {
        handleFile(input.files[0]);
    });

    document.body.append(button);
}


function importBookmarks() {
    acceptUpload({ accept: 'application/json' }, file => {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', event => {
            let json, map;
            if (json = event.target.result, map = new Map(JSON.parse(json))) {
                map.forEach((value, key) => {
                    GM_setValue(key, value);
                });
                alert('Successfully imported bookmarks.');
            }
        });
        fileReader.readAsText(file);
    });
}


GM_registerMenuCommand('Import bookmarks', importBookmarks);
GM_registerMenuCommand('Export bookmarks', exportBookmarks);
