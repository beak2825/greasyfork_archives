// ==UserScript==
// @name         Steam Workshop Downloader (Skymods/Modsbase)
// @namespace    http://tampermonkey.net/
// @version      0.06
// @description  Download mod via skymods.ru and modsbase.com directly from steam workshop
// @author       Skrylor  - Maintainer
// @author       Namkazt ( nam.kazt.91@gmail.com ) - Original Author
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        https://steamcommunity.com/workshop/filedetails/*
// @match        https://steamcommunity.com/workshop/browse/*
// @connect      smods.ru
// @connect      modsbase.com
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512908/Steam%20Workshop%20Downloader%20%28SkymodsModsbase%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512908/Steam%20Workshop%20Downloader%20%28SkymodsModsbase%29.meta.js
// ==/UserScript==

function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function getAppId() {
    return document.querySelector(".apphub_OtherSiteInfo a").getAttribute('data-appid');
}

function isCitiesSkylines() {
    return (
        document.querySelector(".apphub_HeaderTop .apphub_AppName").innerText ===
        "Cities: Skylines"
    );
}

function isCV6() {
    return (
        document.querySelector(".apphub_HeaderTop .apphub_AppName").innerText ===
        "Sid Meier's Civilization VI"
    );
}

function isCollectionPage() {
    const collectionsLink = document.querySelector('a[href*="/workshop/browse/?section=collections"]');
    return collectionsLink !== null; // Returns true if the link is found
}

function getDownloadId(downloadUrl) {
    console.log("----------- parsing download url: " + downloadUrl);
    var regex = /\/[^\/]*\//gm;
    var m;
    var downloadId = "";
    while ((m = regex.exec(downloadUrl)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        if (m.index > 6) {
            downloadId = m[0].substr(1, m[0].length - 2);
        }
    }
    return downloadId;
}

function getDownloadLinkFromModsBase(downloadId, referer, callback) {
    const formData = new FormData();
    formData.append("op", "download2");
    formData.append("id", downloadId);
    formData.append("rand", "");
    formData.append("referer", "");
    formData.append("method_free", "");
    formData.append("method_premium", "");

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://modsbase.com/",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": referer,
        },
        data: new URLSearchParams(formData).toString(),
        onload: function(response) {
            if (response.status === 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const downloadLinkElement = doc.querySelector('.download-details a');

                if (downloadLinkElement) {
                    const directDownloadLink = downloadLinkElement.href;
                    callback(null, directDownloadLink);
                } else {
                    callback("Download link not found in response", null);
                }

            } else {
                callback(`Request failed with status ${response.status}`, null);
            }
        },
        onerror: function(error) {
            callback(`Request error: ${error.statusText}`, null);
        }
    });
}


function searchForMod(id, callback) {
    var appId = getAppId();
    var url = "http://catalogue.smods.ru/?s=" + id + "&app=" + appId;

    console.log("----------- URL: " + url);

    GM_xmlhttpRequest({
        anonymous: true,
        method: "GET",
        url: url,
        headers: {
            "Referer": "http://catalogue.smods.ru"
        },
        onload: function(e) {
            doc = new DOMParser().parseFromString(e.responseText, "text/html");
            if (doc.getElementsByClassName("post-inner").length > 0) {
                var downloadUrl = doc.querySelector(".post-inner .skymods-excerpt-btn").href;
                var downloadId = getDownloadId(downloadUrl);
                if (downloadId != undefined || downloadId != null || downloadId != "") {
                    console.log("----------- download id: " + downloadId);
                    var rDateStr = doc.querySelector(".post-inner .skymods-item-date").innerText;
                    var updated = moment(rDateStr, "DD MMM at HH:mm YYYY").format(
                        "DD MMM, YYYY"
                    );
                    let titleElement = doc.querySelector(".post-inner h2 a");
                    let title = titleElement ? titleElement.textContent.trim() : "Unknown Mod Title";
                    callback(true, downloadId, downloadUrl, updated, title);
                } else {
                    callback(false, downloadId, downloadUrl, "");
                }
            } else {
                callback(false, downloadId, downloadUrl, "");
            }
        },
        onerror: function(error) {
            console.error("Request failed:", error);
            callback(false, null, null, "Error fetching mod info");
        }
    });
}

function gotoRequestPage(id) {
    var url = "https://steamcommunity.com/sharedfiles/filedetails/?id=" + id;
    if (isCitiesSkylines()) {
         window.open('https://docs.google.com/forms/d/e/1FAIpQLSdXlq9OAWVwX5lRLNvpkMSmpKbEDY50Bl-UU3f6P7OBI2Ny3Q/viewform?c=0&w=1&entry.417177883=' + url, '_blank');
    } else {
         window.open('https://docs.google.com/forms/d/e/1FAIpQLSe7MisYbKNUlTXBcSR2clHxpwaoo0HiZ3zWto0osemubdDP1g/viewform?entry.417177883=' + url, '_blank');
    }
}

function changeButtonGradient(btn, color1, color2) {
    var gradient =
        "linear-gradient(42deg, #" + color1 + " 35%, #" + color2 + " 65%)";
    btn.style.background = gradient;
    btn.querySelector("#DownloadTxt").style.background = gradient;
}

function searchForDownloadLink(btn, downloadId, downloadUrl, modTitle) {
    let textNode = btn.querySelector("#DownloadTxt");
    let spinner = btn.querySelector(".loading-spinner");
    spinner.style.display = "inline-block";
    textNode.style.opacity = 0;
    btn.classList.add('loading');
    getDownloadLinkFromModsBase(downloadId, downloadUrl, function(err, directDownloadLink) {
        spinner.style.display = "none";
        textNode.style.opacity = 1;
        btn.classList.remove('loading');
        if (err) {
            console.error(err);
            textNode.innerText = "Failed to get link";
            return;
        }

        textNode.innerText = "Downloading...";
        spinner.style.display = "inline-block";
        textNode.style.opacity = 0;


        let fileName = modTitle.replace(/[^a-zA-Z0-9_.-]/g, '_') + ".zip";
        fileName = fileName.substring(0, 250);

        GM_download({
            url: directDownloadLink,
            name: fileName,
            onload: function() {
                spinner.style.display = "none";
                textNode.style.opacity = 1;
                textNode.innerHTML = "Downloaded!";
            },
            onerror: function(error) {
                spinner.style.display = "none";
                textNode.style.opacity = 1;
                console.error("Download error:", error);
                textNode.innerText = "Download Failed";
            }
        });
    });
}

var DOWNLOAD_BTN_TEMPLATE = `
    <button id="DownloadBtn" class="steam-button">
        <span id="DownloadTxt">Download</span>
        <span class="loading-spinner" style="display: none;">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="#fff" stroke-width="2" style="animation: rotate 1s linear infinite;"/>
            </svg>
        </span>
    </button>
`;

GM_addStyle(`
 .steam-button {
    background-color: #7cb342;
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    transition: background-color 0.2s ease, transform 0.1s ease;
    display: inline-block;
    position: relative;
}

.steam-button:hover {
    background-color: #669933;
    transform: scale(1.02);
}

.steam-button.loading #DownloadTxt {
    opacity: 0;
    transition: opacity 0.2s ease;
}

.steam-button.loading .loading-spinner {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.steam-button .loading-spinner svg {
    animation: rotate 1s linear infinite;
}

.steam-button.not-available {
    background-color: #d32f2f;
}

.steam-button.not-available:hover {
    background-color: #c62828;
}

.game_area_purchase_game > div {
    height: 30px; /* Replace 30px with the actual height of the Subscribe button */
    display: flex;
    align-items: center;
}

.game_area_purchase_game > div > a#SubscribeItemBtn + button.steam-button {
    margin-left: -10px; /* Adjust this value as needed for left alignment */
    margin-right: 0; /* Ensure no right margin */
}


@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.steam-button.loading {
    opacity: 0.7;
    pointer-events: none;
}

/* Floating Downloader Styles */
.floating-downloader {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: #1b2838;
    border: 1px solid #4582a5;
    border-radius: 4px;
    padding: 15px;
    width: 300px;
    color: #fff;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    display: none; /* Initially hidden */
}

.floating-downloader-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #4582a5;
    padding-bottom: 10px;
}

.floating-downloader-title {
    font-weight: bold;
    font-size: 16px;
}

.floating-downloader-close {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 18px;
}

.download-progress {
    margin: 10px 0;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background: #2a475e;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: #66c0f4;
    transition: width 0.3s ease;
}

.download-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
}

.download-list {
    max-height: 200px;
    overflow-y: auto;
    margin: 10px 0;
}

.download-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #2a475e;
}

.download-item-status {
    font-size: 12px;
    color: #66c0f4;
}
`);

const FLOATING_DOWNLOADER_TEMPLATE = `
    <div class="floating-downloader" id="batchDownloader">
        <div class="floating-downloader-header">
            <div class="floating-downloader-title">Batch Downloader</div>
            <button class="floating-downloader-close">×</button>
        </div>
        <div class="download-progress">
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: 0%"></div>
            </div>
            <div class="download-stats">
                <span class="downloads-completed">0/0 completed</span>
                <span class="download-size">0 MB</span>
            </div>
        </div>
        <div class="download-list"></div>
        <button id="startBatchDownload" class="steam-button">Download All</button>
    </div>
`;

class BatchDownloadManager {
    constructor() {
        this.downloads = new Map();
        this.completed = 0;
        this.total = 0;
        this.currentlyDownloading = false;
        this.downloadQueue = [];
        this.initializeUI();
    }

    initializeUI() {
        const downloaderEl = createElementFromHTML(FLOATING_DOWNLOADER_TEMPLATE);
        document.body.appendChild(downloaderEl);

        downloaderEl.querySelector('.floating-downloader-close').addEventListener('click', () => {
            downloaderEl.style.display = 'none';
        });

        document.getElementById('startBatchDownload').addEventListener('click', () => {
            this.startBatchDownload();
        });
    }

    addDownload(workshopId, modTitle, downloadId, downloadUrl) {
        this.downloads.set(workshopId, { modTitle, downloadId, downloadUrl, status: 'pending' });
        this.updateUI();
    }

    async startBatchDownload() {
        if (this.currentlyDownloading) return;
        this.currentlyDownloading = true;
        this.downloadQueue = Array.from(this.downloads.entries()).filter(([_, info]) => info.status === 'pending');
        this.total = this.downloadQueue.length;
        this.completed = 0;
        this.processNextDownload();
    }

    async processNextDownload() {
        if (this.downloadQueue.length === 0) {
            this.currentlyDownloading = false;
            this.updateUI();
            return;
        }

        const [workshopId, info] = this.downloadQueue.shift();

        try {
            await this.downloadMod(workshopId, info);
            this.completed++;
            info.status = 'completed';
        } catch (error) {
            console.error(`Failed to download ${info.modTitle}:`, error);
            info.status = 'failed';
        }

        this.updateUI();
        this.processNextDownload();
    }

    async downloadMod(workshopId, info) {
        return new Promise((resolve, reject) => {
            getDownloadLinkFromModsBase(info.downloadId, info.downloadUrl, (err, directDownloadLink) => {
                if (err) {
                    reject(err);
                    return;
                }

                let fileName = info.modTitle.replace(/[^a-zA-Z0-9_.-]/g, '_') + ".zip";
                fileName = fileName.substring(0, 250);

                GM_download({
                    url: directDownloadLink,
                    name: fileName,
                    onload: resolve,
                    onerror: reject
                });
            });
        });
    }

    updateUI() {
        const progress = (this.completed / this.total) * 100 || 0;
        const progressBar = document.querySelector('.progress-bar-fill');
        const statsEl = document.querySelector('.downloads-completed');
        const downloadList = document.querySelector('.download-list');

        progressBar.style.width = `${progress}%`;
        statsEl.textContent = `${this.completed}/${this.total} completed`;

        downloadList.innerHTML = '';
        this.downloads.forEach((info, workshopId) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'download-item';
            itemEl.innerHTML = `<span class="download-item-title">${info.modTitle}</span><span class="download-item-status">${info.status}</span>`;
            downloadList.appendChild(itemEl);
        });
    }
}


function init() {
    $(document).ready(function() {
        const batchManager = new BatchDownloadManager(); // Initialize here for collection pages
        if (window.location.href.indexOf("appid=") >= 0) {
            console.log("----------- Workshop browser page");
            var itemList = document.querySelectorAll(".workshopItemPreviewHolder");

            for (var item of itemList) {
                var itemDownloadId = item.id.replace("sharedfile_", "");
                var btnNode = createElementFromHTML(DOWNLOAD_BTN_TEMPLATE);

                searchForMod(itemDownloadId,
                    (function() {
                        var workshopId = itemDownloadId;
                        var btn = btnNode;
                        var textNode = btn.querySelector("#DownloadTxt");
                        textNode.innerText = "Checking for mod";
                        return function(found, downloadId, downloadUrl, updated, modTitle) {
                            if (found) {
                                textNode.innerText = "Download - " + updated;
                                btn.addEventListener("click", function() {
                                    searchForDownloadLink(btn, downloadId, downloadUrl, modTitle);
                                });
                            } else {
                                textNode.innerText = "Not Available (REQUEST)";
                                btn.classList.add("not-available");
                                btn.addEventListener("click", function() {
                                    gotoRequestPage(workshopId);
                                });
                            }
                        };
                    })()
                );

                var subscriptionControls = item.parentNode.querySelector('.subscriptionControls');
                if (subscriptionControls) subscriptionControls.appendChild(btnNode);
            }
        } else if (isCollectionPage()) {
            console.log("----------- Collection page");
            var itemList = document.querySelectorAll(".collectionItem");
            for (var item of itemList) {
                var itemDownloadId = item.id.replace("sharedfile_", "");
                var btnNode = createElementFromHTML(DOWNLOAD_BTN_TEMPLATE);
                searchForMod(itemDownloadId,
                    (function() {
                        var workshopId = itemDownloadId;
                        var btn = btnNode;
                        var textNode = btn.querySelector("#DownloadTxt");
                        textNode.innerText = "Checking for mod";
                        return function(found, downloadId, downloadUrl, updated, modTitle) {
                            if (found) {
                                textNode.innerText = "Download - " + updated;
                                btn.addEventListener("click", function() {
                                    searchForDownloadLink(btn, downloadId, downloadUrl, modTitle);
                                });
                            } else {
                                textNode.innerText = "Not Available (REQUEST)";
                                btn.classList.add("not-available");
                                btn.addEventListener("click", function() {
                                    gotoRequestPage(workshopId);
                                });
                            }
                        };
                    })()
                );
                var subscriptionControls = item.querySelector('.subscriptionControls');
                if (subscriptionControls) subscriptionControls.appendChild(btnNode);

            }
             // Add items to batch manager for collection page
            document.querySelectorAll('.collectionItem').forEach(item => {
                const itemDownloadId = item.id.replace("sharedfile_", "");
                searchForMod(itemDownloadId, (found, downloadId, downloadUrl, updated, modTitle) => {
                    if (found) {
                        batchManager.addDownload(itemDownloadId, modTitle, downloadId, downloadUrl);
                    }
                });
            });

            // Show the floating downloader after processing all items
            document.getElementById('batchDownloader').style.display = 'block';
        } else {
            console.log("----------- Single item page");
            var publishedfileid = window.location.href.match(/id=(\d+)/)[1];
            var btnNode = createElementFromHTML(DOWNLOAD_BTN_TEMPLATE);
            var textNode = btnNode.querySelector("#DownloadTxt");
            textNode.innerText = "Checking for mod";
            searchForMod(publishedfileid, function(
                found,
                downloadId,
                downloadUrl,
                updated,
                modTitle
            ) {
                if (found) {
                    textNode.innerText = "Download - " + updated;
                    btnNode.addEventListener("click", function() {
                        searchForDownloadLink(btnNode, downloadId, downloadUrl, modTitle);
                    });
                } else {
                    textNode.innerText = "Not Available (REQUEST)";
                    btnNode.classList.add("not-available");
                    btnNode.addEventListener("click", function() {
                        gotoRequestPage(publishedfileid);
                    });
                }
            });

            const subscribeButton = document.getElementById("SubscribeItemBtn");
            if (subscribeButton) {
                subscribeButton.parentNode.insertBefore(btnNode, subscribeButton.nextSibling);
            } else {
                const subscriptionControls = document.querySelector('.subscriptionControls');
                if (subscriptionControls) {
                    subscriptionControls.insertBefore(btnNode, subscriptionControls.firstChild);
                } else {
                    console.error("Neither Subscribe button nor Subscription Controls found. Appending to body.");
                    document.body.appendChild(btnNode);
                }
            }
        }
        console.log("----------- Init successfully");
    });
}

(function() {
    "use strict";

    init();
})();