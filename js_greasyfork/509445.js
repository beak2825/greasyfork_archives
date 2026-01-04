// ==UserScript==
// @name         1337x - Mark Untrusted
// @namespace    https://greasyfork.org/es/users/825144-aitronz
// @version      1.5
// @description  Marks torrents uploaded by untrusted users by fetching names from the pirated games list.
// @author       aitronz
// @match        *://1337x.to/*
// @match        *://1337x.st/*
// @match        *://x1337x.ws/*
// @match        *://x1337x.eu/*
// @match        *://x1337x.se/*
// @match        *://x1337x.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509445/1337x%20-%20Mark%20Untrusted.user.js
// @updateURL https://update.greasyfork.org/scripts/509445/1337x%20-%20Mark%20Untrusted.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userListURL = 'https://rentry.org/pgames/raw';

    const normalizeName = name => {
        let normalized = name.replace(/\s+/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalized.includes('igggames') && !normalized.includes('igggamescom') ? normalized + 'com' : normalized;
    };

    const markRows = userList => {
        document.querySelectorAll('table.table-list tbody tr').forEach(row => {
            const uploaderCell = row.querySelector('.coll-5 a');
            if (uploaderCell) {
                const normalizedUploader = normalizeName(uploaderCell.textContent.trim());
                if (userList.includes(normalizedUploader)) {
                    row.style.cssText = 'background-color: #cccccc; opacity: 0.5; position: relative;';
                    const untrustedLabel = Object.assign(document.createElement('div'), {
                        textContent: 'Untrusted',
                        style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); color: red; font-size: 20px; font-weight: bold; text-align: center; line-height: ' + row.offsetHeight + 'px; pointer-events: none; z-index: 1;'
                    });
                    row.appendChild(untrustedLabel);
                }
            }
        });
    };

    const fetchUserList = () => {
        fetch(userListURL)
            .then(response => response.text())
            .then(data => {
                const userList = [];
                const startSection = "###Untrusted uploaders";
                const endSection = "*****";
                const startIdx = data.indexOf(startSection);
                const endIdx = data.indexOf(endSection, startIdx);
                const untrustedSection = data.substring(startIdx, endIdx);
                const lines = untrustedSection.split("\n");
                const exclusionPhrase = "Any user from The Pirate Bay / TPB";

                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith("-")) {
                        if (!trimmedLine.includes(exclusionPhrase)) {
                            let uploader = trimmedLine.slice(1).replace(/\*/g, '').trim();
                            if (uploader.includes(" - ")) {
                                uploader = uploader.split(" - ")[0].trim();
                            }
                            userList.push(...uploader.split("/").map(normalizeName));
                        }
                    }
                });

                console.log('List of untrusted uploaders:', userList);
                markRows(userList);
            })
            .catch(console.error);
    };

    const waitForTable = () => {
        const checkInterval = setInterval(() => {
            if (document.querySelector('table.table-list tbody')) {
                clearInterval(checkInterval);
                fetchUserList();
            }
        }, 50);
    };

    waitForTable();
})();
