// ==UserScript==
// @name         TorrentDay upload evolution
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-11-22
// @description  Allows to track the evolution of your torrentday uploads
// @author       You
// @match        https://www.torrentday.com/peers*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentday.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517956/TorrentDay%20upload%20evolution.user.js
// @updateURL https://update.greasyfork.org/scripts/517956/TorrentDay%20upload%20evolution.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_ITEM_SNAP = "upload.snapshot";
    const STORAGE_ITEM_TIME = "upload.time";
    const MiB = 1024;
    const GiB = 1024 * MiB;
    const TiB = 1024 * GiB;
    let time = "";

    function run() {
        const parsed = findTorrents();
        time = getTime();
        addUploadedInKb(parsed.torrents);
        insertButtons(parsed);
        increasePageWidth();
        displaySnapshot(parsed);
        highlightNotSatisfied(parsed);
    }

    function findTorrents() {
        const trs = [...document.getElementsByTagName("tr")];
        const titleTr = trs.shift();
        const titles = [...titleTr.getElementsByTagName("th")].map(th => th.innerText);
        const torrents = trs
            .map(tr => {
                const tds = [...tr.getElementsByTagName("td")];
                const torrent = {};
                tds.forEach((td, i) => {
                    torrent[titles[i]] = td.innerText;
                });
                torrent.tr = tr;
                return torrent;
            })
            .filter(torrent => torrent.Torrent !== "Seeders" && torrent.Torrent !== "Leechers");
        const uploadedColumnIndex = titles.indexOf("Uploaded");
        return {
            torrents,
            uploadedColumnIndex,
            titleTr,
        };
    }

    function addUploadedInKb(torrents) {
        return torrents.map(torrent => {
            torrent.uploadedKb = convertToKb(torrent.Uploaded);
            torrent.downloadedKb = convertToKb(torrent.Downloaded);
            return torrent;
        });
    }

    function convertToKb(text) {
        const parsed = /([\d|\.]+)\s(\w)B/i.exec(text);
        if (!parsed) {
            return 0
        }
        const number = parsed[1];
        const unit = parsed[2];
        const multiplicator =
              unit === "M" ? MiB
            : unit === "G" ? GiB
            : unit === "T" ? TiB
            : 1;
        return number * multiplicator;
    }

    function formatKb(sizeInKb) {
        let unit = "KB";
        let divisor = 1;
        if (sizeInKb >= TiB) {
            unit = "TB";
            divisor = TiB;
        } else if (sizeInKb >= GiB) {
            unit = "GB";
            divisor = GiB;
        } else if (sizeInKb >= MiB) {
            unit = "MB";
            divisor = MiB;
        }
        const size = Math.round(10 * sizeInKb / divisor) / 10;
        return `${size} ${unit}`;
    }

    function saveSnapshot(parsed) {
        const {torrents} = parsed;
        const snapshot = {};
        torrents.forEach(torrent => {
            snapshot[torrent.Torrent] = torrent.uploadedKb;
        });
        localStorage.setItem(STORAGE_ITEM_SNAP, JSON.stringify(snapshot));
        localStorage.setItem(STORAGE_ITEM_TIME, new Date().getTime());
    }

    function getSnapshot() {
        const snapshot = localStorage.getItem(STORAGE_ITEM_SNAP) || "{}";
        return JSON.parse(snapshot);
    }

    function getTime() {
        const ticks = Number.parseInt(localStorage.getItem(STORAGE_ITEM_TIME) || "0");
        if (ticks === 0) {
            return "No existing snapshot";
        }
        const diff = Date.now() - ticks;
        return `Last snapshot: ${Math.round(diff / (24 * 60 * 60 * 1000))} days ago`;
    }

    function displaySnapshot(parsed) {
        const {
            torrents,
            uploadedColumnIndex,
            titleTr,
        } = parsed;
        const snapshot = getSnapshot();
        const diffHeader = document.createElement("th");
        diffHeader.innerText = "Diff";
        titleTr.insertBefore(diffHeader, titleTr.childNodes[uploadedColumnIndex + 1]);
        const ratioHeader = document.createElement("th");
        ratioHeader.innerText = "Ratio";
        titleTr.insertBefore(ratioHeader, titleTr.childNodes[uploadedColumnIndex + 1]);
        for (let torrent of torrents) {
            const diffColumn = document.createElement("td");
            torrent.tr.insertBefore(diffColumn, torrent.tr.childNodes[uploadedColumnIndex + 1]);
            if (torrent.Torrent in snapshot) {
                const diff = torrent.uploadedKb - snapshot[torrent.Torrent];
                if (diff === 0) {
                    diffColumn.innerText = "0";
                } else {
                    if (diff >= GiB) {
                        diffColumn.style.fontWeight = "bold";
                    }
                    if (diff >= 10 * GiB) {
                        diffColumn.style.textDecoration = "underline";
                    }
                    diffColumn.innerText = `+${formatKb(diff)}`;
                }
            } else {
                if (torrent.Uploaded) {
                    diffColumn.innerText = `+${torrent.Uploaded}`
                };
            }

            const ratioColumn = document.createElement("td");
            ratioColumn.style.textAlign = "right";
            const ratio = torrent.uploadedKb / torrent.downloadedKb;
            ratioColumn.innerText = `${Math.round(100 * ratio)}%`;
            torrent.tr.insertBefore(ratioColumn, torrent.tr.childNodes[uploadedColumnIndex + 1]);
        }
    }

    function highlightNotSatisfied(parsed) {
        const {torrents} = parsed;
        for (let torrent of torrents) {
            if (torrent["Seeding Time"].endsWith("to go")) {
                torrent.tr.style.color = "red";
            }
        }
    }

    function insertButtons(torrents) {
        const button = document.createElement("button");
        const label = "Save snapshot";
        button.innerText = label;
        button.className = "btn";
        button.onclick = async () => {
            saveSnapshot(torrents);
            button.innerText = "Saved!";
            await sleepAsync(3000);
            button.innerText = label;
        }
        const table = [...document.getElementsByTagName("table")][0];
        table.parentElement.insertBefore(button, table);
        const spacer = document.createElement("div");
        spacer.innerHTML = time + "<br/>&nbsp;";
        table.parentElement.insertBefore(spacer, table);
    }

    function increasePageWidth() {
        const wrapper = document.getElementById("pageWrapper");
        wrapper.style.width = "1400px";
    }

    async function sleepAsync(timeMs) { return new Promise(resolve => setTimeout(resolve, timeMs)); }

    run();
})();