// ==UserScript==
// @name         Rork Downloader
// @namespace    https://github.com/deeeeone/userscripts
// @version      1.4
// @description  Intercepts Rork snapshot data and allows exporting code which stupidly is a premium feature of rork
// @author       Custom
// @match        https://rork.com/p/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538090/Rork%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/538090/Rork%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // we need jszip to zip everything up
    const jszipScript = document.createElement('script');
    jszipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js';
    document.head.appendChild(jszipScript);

    let latestSnapshot = null;
    let latestSnapshotId = null;

    function saveSnapshotToDB(id, snapshotObj) {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('rorkSnapshots', 1);
            req.onupgradeneeded = function(e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('snapshots')) {
                    db.createObjectStore('snapshots');
                }
            };
            req.onsuccess = function(e) {
                const db = e.target.result;
                const tx = db.transaction('snapshots', 'readwrite');
                const store = tx.objectStore('snapshots');
                store.put(snapshotObj, id);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            };
            req.onerror = () => reject(req.error);
        });
    }

    function getSnapshotFromDB(id) {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('rorkSnapshots', 1);
            req.onupgradeneeded = function(e) {
                e.target.result.createObjectStore('snapshots');
            };
            req.onsuccess = function(e) {
                const db = e.target.result;
                const tx = db.transaction('snapshots', 'readonly');
                const store = tx.objectStore('snapshots');
                const getReq = store.get(id);
                getReq.onsuccess = () => resolve(getReq.result);
                getReq.onerror = () => reject(getReq.error);
            };
            req.onerror = () => reject(req.error);
        });
    }

    // cheating but idc it works
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0];
        if (typeof url === 'string' && url.includes('/trpc/projects.fetchSnapshot')) {
            response.clone().json().then(data => {
                try {
                    const json = data.result?.data?.json;
                    if (!json) return;
                    latestSnapshot = json.snapshot;
                    latestSnapshotId = json.snapshotId;
                    // Save to IndexedDB
                    saveSnapshotToDB(latestSnapshotId, latestSnapshot).catch(console.error);
                    console.log('Rork snapshot stored:', latestSnapshotId);
                } catch (err) {
                    console.error('Error parsing Rork snapshot:', err);
                }
            }).catch(console.error);
        }
        return response;
    };

    // build zip file from the snapshot object
    function buildZip(snapshotObj) {
        const zip = new JSZip();
        for (const [path, entry] of Object.entries(snapshotObj)) {
            if (entry.type === 'folder') {
                zip.folder(path);
            } else if (entry.type === 'file') {
                zip.file(path, entry.contents);
            }
        }
        return zip;
    }

    // download zip file
    async function downloadSnapshot(id, snapshotObj) {
        if (!window.JSZip) {
            alert('JSZip not loaded yet. Please try again in a moment.');
            return;
        }
        const zip = buildZip(snapshotObj);
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rork_snapshot_${id}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    // add into header
    function insertButton() {
        const header = document.querySelector('header');
        if (!header) return;
        if (document.getElementById('rork-download-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'rork-download-btn';
        btn.innerText = 'Download Snapshot';
        btn.style.backgroundColor = '#10B981'; // emerald cause why not
        btn.style.color = '#FFFFFF';
        btn.style.border = 'none';
        btn.style.padding = '8px 12px';
        btn.style.marginLeft = '10px';
        btn.style.borderRadius = '4px';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', async () => {
            if (latestSnapshot && latestSnapshotId) {
                await downloadSnapshot(latestSnapshotId, latestSnapshot);
            } else if (latestSnapshotId) {
                // load everything from indexeddb
                const stored = await getSnapshotFromDB(latestSnapshotId);
                if (stored) {
                    await downloadSnapshot(latestSnapshotId, stored);
                } else {
                    alert('Snapshot data not available yet. Please wait for the project to load.');
                }
            } else {
                alert('No snapshot captured yet. Please wait for the project to load.');
            }
        });

        header.appendChild(btn);
    }

    // wait WAIT WAITTT
    function waitForHeader() {
        const header = document.querySelector('header');
        if (header) {
            insertButton();
        } else {
            requestAnimationFrame(waitForHeader);
        }
    }


    document.addEventListener('DOMContentLoaded', () => {
        waitForHeader();
    });
})();
