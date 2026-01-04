// ==UserScript==
// @name Fanatical order download V2
// @description Download keys from open fanatical order pages
// @namespace Violentmonkey Scripts
// @match https://www.fanatical.com/en/orders/*
// @grant GM_registerMenuCommand
// @version 0.0.1.20190928015712
// @downloadURL https://update.greasyfork.org/scripts/389776/Fanatical%20order%20download%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/389776/Fanatical%20order%20download%20V2.meta.js
// ==/UserScript==


let store = window.localStorage;
let pageID = location.href.substr(location.href.lastIndexOf('/') + 1);
let interval, setDownloadFlag, waited;

if (window.attachEvent) {
    window.attachEvent('onload', main);
} else {
    if (window.onload) {
        let curronload = window.onload;
        window.onload = function (evt) {
            curronload(evt);
            main();
        };
    } else {
        window.onload = main;
    }
}
GM_registerMenuCommand('Download all open pages', download);
GM_registerMenuCommand('reset registered pages/download flag (debug only)', () => {
    store.setItem('download', JSON.stringify(false));
    store.setItem('registeredPages', JSON.stringify({}));
})

function main() {
    window.addEventListener('beforeunload', (event) => {
        unregisterPage();
    });
    registerPage();
    interval = window.setInterval(() => {
        if (JSON.parse(store.getItem('download')) && !pageHasBeenDownloaded()) {
            console.log('setting download info for page');
            setDownloadData();
            clearInterval(interval);
        } else {
            console.log('download signal not seen');
        }
    }, 500);
}

function registerPage() {
  console.log('adding reveal button event listeners');
    document.querySelectorAll('.key-container .btn-secondary').forEach((elem) => {
        elem.addEventListener('mousedown', () => {
            let irk = document.querySelectorAll('input[aria-label="reveal-key"]').length;
            console.log(`initial revealed keys: ${irk}`);
            let i = setInterval(() => {
                console.log('checking irk');
                if (irk < (document.querySelectorAll('input[aria-label="reveal-key"]').length)) {
                    clearInterval(i);
                    console.log(`all clear ${document.querySelectorAll('input[aria-label="reveal-key"]').length}`);
                    setDownloadData();
                }
            }, 100);
        })
    });
    console.log(`registering page ${pageID}`);
    let pages = registeredPages();
    if (pages.hasOwnProperty(pageID)) {
        console.log(`page already entered: ${pageID}`);
    } else {
        pages[pageID] = false;
        store.setItem('registeredPages', JSON.stringify(pages));
    }
}

function pageHasBeenDownloaded() {
    let pages = JSON.parse(store.getItem('registeredPages'));
    return (pages.hasOwnProperty(pageID) && pages[pageID] !== false);
}

function registeredPages() {
    let pages = JSON.parse(store.getItem('registeredPages'));
    if (pages == null) {
        pages = {};
        store.setItem('registeredPages', JSON.stringify(pages))
    }
    return pages;
}

function unregisterPage() {
    console.log(`unregistering page ${pageID}`);
    let pages = JSON.parse(store.getItem('registeredPages'));
    if (pages != null) {
        delete pages[pageID];
        store.setItem('registeredPages', JSON.stringify(pages));
    }
    if (setDownloadFlag) {
        console.log('unregistering download flag: setting to false');
        store.setItem('download', JSON.stringify(false));
    }

}

function setDownloadData() {
    console.log('setting parsed data for download');
    let parsed = parseData();
    let pages = JSON.parse(store.getItem('registeredPages'));
    if (pages != null) {
        pages[pageID] = parsed;
        store.setItem('registeredPages', JSON.stringify(pages));
    } else {
        console.error(`no appropriate data container for ${pageID}`);
    }
}

function parseData() {
    let data = [];
    document.querySelectorAll('input[aria-label="reveal-key"]').forEach((elem) => {
        let title = elem.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.game-name').textContent;
        let key = elem.value;
        data.push(`"${title}","${key}"\n`)
    });
    console.log(`parsed data: ${data}`);
    return data;
}

function download() {
    setDownloadFlag = true;
    console.log('master: setting download command to true');
    store.setItem('download', JSON.stringify(true));
    let waitingForData = setInterval(() => {
        let pages = JSON.parse(store.getItem('registeredPages'));
        let master_data = '"Game","Key"\n';
        if (Object.values(pages).every(v => (v !== false))) {
            if (!waited) {
                console.log('master: waiting 500ms to ensure data integrity');
                waited = true;
            } else {
                console.log('master: data is ready');
                Object.values(pages).forEach((entry) => {
                    console.log(entry);
                    entry.forEach((csvline) => {
                        master_data += csvline;
                    });
                });
                console.log(`master data:\n${master_data}`);
                let a = document.createElement('a');
                a.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(master_data);
                a.download = 'data.csv';
                document.getElementsByTagName('body')[0].appendChild(a);
                a.click();
                console.log('unregistering download flag: setting to false');
                store.setItem('download', JSON.stringify(false));
                clearInterval(waitingForData);
            }
        } else {
            console.log('master: data not ready yet')
        }
    }, 500);

}