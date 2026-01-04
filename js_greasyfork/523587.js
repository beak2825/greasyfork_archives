// ==UserScript==
// @name         nyaa.si | Batch .torrent Download
// @namespace    http://tampermonkey.net/
// @version      2025-01-22
// @description  Allows batch download of all displayed results in one single click.
// @author       p0358
// @license      GPLv3
// @match        https://nyaa.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523587/nyaasi%20%7C%20Batch%20torrent%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/523587/nyaasi%20%7C%20Batch%20torrent%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const waitReady = childWindow => new Promise(resolve => childWindow.addEventListener("load", resolve, true));

    const getDownloadLinks = () => Array.from(document.getElementsByClassName("fa-download")).map(e => e.parentElement.href).filter(h => h !== "javascript:void(0)");
    const getMagnetLinks = () => Array.from(document.getElementsByClassName("fa-magnet")).map(e => e.parentElement.href).filter(h => h !== "javascript:void(0)");

    const downloadAll = async () => {
        const links = getDownloadLinks();

        let tab;

        // Do it one-by-one instead of all-at-once to avoid rate-limiting
        for (const link of links) {
            console.log("Opening", link);
            tab = window.open(link, "downloadTab");
            if (!tab) {
                alert("Opening tabs disallowed in browser, abandoning!");
                return;
            }
            console.log(tab);
            // Waiting 150 ms to avoid error 429 (rate-limiting)
            await Promise.all([wait(100), waitReady(tab)]);
            tab.close();
            console.log("Going to the next one...");
        }
    };

    const copyAllMagnetLinks = () => {
        const linksConcat = getMagnetLinks().join("\n");

        navigator.clipboard.writeText(linksConcat).then(
            () => {
                // clipboard successfully set
            },
            () => {
                // clipboard write failed
                alert("Could not write to clipboard");
            },
        );
    };

    const itemsCount = document.getElementsByClassName("fa-download").length;

    const torrentList = document.getElementsByClassName("torrent-list")[0]?.parentElement;
    if (torrentList) {
        const downloadAllLink = document.createElement("a");
        torrentList.appendChild(downloadAllLink);
        downloadAllLink.href = "javascript:void(0)";
        downloadAllLink.innerHTML += `<i class="fa fa-fw fa-download"></i><span class="mt-batch-download-label">Download all (${itemsCount})</span>`;
        downloadAllLink.addEventListener("click", e => {
            e.preventDefault();
            downloadAll();
        });

        const copyAllLink = document.createElement("a");
        torrentList.appendChild(copyAllLink);
        copyAllLink.href = "javascript:void(0)";
        copyAllLink.innerHTML += `<i class="fa fa-fw fa-magnet"></i><span class="mt-batch-download-label">Copy all (${itemsCount})</span>`;
        copyAllLink.addEventListener("click", e => {
            e.preventDefault();
            copyAllMagnetLinks();
        });
    }
})();
