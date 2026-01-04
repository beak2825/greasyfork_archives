// ==UserScript==
// @name         4chan Niconico Titles
// @namespace    4ch.nicovideo.titles
// @version      1.0.2
// @description  Displays Niconico/nicovideo link titles and some more info on 4chan. THIS SCRIPT REQUIRES the "Linkify" option TURNED ON in 4chan-x(t) or the built-in 4chan extension.
// @author       SaddestPanda
// @match        https://boards.4chan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4chan.org
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      nicovideo.jp
// @connect      nico.ms
// @downloadURL https://update.greasyfork.org/scripts/527784/4chan%20Niconico%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/527784/4chan%20Niconico%20Titles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DB_NAME = "NiconicoDB";
    const STORE_NAME = "Videos";
    const DELAY_EACH_REQUEST = 1500; //Data is cached so this is only for the first load. Nicovideo servers are slooow so if this gets too low they might block your IP.
    const crawlQueue = [];
    let db;
    let debug_enabled = false;
    let onlyTitles = GM_getValue("onlyTitles", false);

    function openDB() {
        return new Promise((resolve, reject) => {
            if (debug_enabled) console.log("[4chan Niconico Titles] Opening IndexedDB...");
            let request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (event) => {
                if (debug_enabled) console.log("[4chan Niconico Titles] Upgrading IndexedDB...");
                let db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                    if (debug_enabled) console.log("[4chan Niconico Titles] Object store created.");
                }
            };
            request.onsuccess = (event) => {
                db = event.target.result;
                if (debug_enabled) console.log("[4chan Niconico Titles] IndexedDB opened successfully.");
                resolve(db);
            };
            request.onerror = (event) => {
                console.error("[4chan Niconico Titles] Error opening IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async function getFromDB(key) {
        db = db || await openDB();
        return new Promise((resolve) => {
            if (debug_enabled) console.log("[4chan Niconico Titles] Fetching from DB:", key);
            let transaction = db.transaction(STORE_NAME, "readonly");
            let store = transaction.objectStore(STORE_NAME);
            let request = store.get(key);
            request.onsuccess = () => {
                if (debug_enabled) console.log("[4chan Niconico Titles] Fetched data:", request.result);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error("[4chan Niconico Titles] Failed to fetch from DB:", key);
                resolve(null);
            };
        });
    }

    async function saveToDB(key, value) {
        db = db || await openDB();
        return new Promise((resolve) => {
            if (debug_enabled) console.log("[4chan Niconico Titles] Saving to DB:", key, value);
            let transaction = db.transaction(STORE_NAME, "readwrite");
            let store = transaction.objectStore(STORE_NAME);
            let request = store.put(value, key);
            request.onsuccess = () => {
                if (debug_enabled) console.log("[4chan Niconico Titles] Saved successfully:", key);
                resolve(true);
            };
            request.onerror = () => {
                console.error("[4chan Niconico Titles] Failed to save to DB:", key);
                resolve(false);
            };
        });
    }

    async function processLinks() {
        if (debug_enabled) console.log("[4chan Niconico Titles] Processing links...");
        const links = document.querySelectorAll(".post a[class='linkify'], .post a[class='linkified']");
        for (let link of links) {
            const url = new URL(link.href);
            const match = url.href.match(/(nicovideo\.jp.*?watch|nico\.ms)(\/|%2F)(sm\d+|so\d+|nm\d+)/);
            if (!match || match.length < 4) {
                if (debug_enabled) console.log('No match found for link:', link);
                continue;
            }
            const videoId = match[3];

            if (debug_enabled) console.log("[4chan Niconico Titles] Checking DB for video ID:", videoId);
            let cachedData = await getFromDB(videoId);
            if (cachedData) {
                if (debug_enabled) console.log("[4chan Niconico Titles] Cache hit! Updating link text.");
                fixLinkNode(link, `https://www.nicovideo.jp/watch/${videoId}`, cachedData);
            } else {
                if (debug_enabled) console.log("[4chan Niconico Titles] Cache miss. Adding to crawl queue.");
                crawlQueue.push({ link, videoId });
            }
        }
        if (crawlQueue.length > 0) {
            console.log(`[4chan Niconico Titles] Crawling ${crawlQueue.length} links...`);
        }
        crawlNext();
    }

    function fixLinkNode(linkNode, url, text) {
        linkNode.innerText = text;
        linkNode.classList.add("niconico");
        //Convert to generic nicovideo urls for any css :visited selectors
        if (linkNode.href.includes("sys.4chan.org/derefer") || linkNode.href.includes("nico.ms")) {
            linkNode.href = url;
        }
    }

    async function crawlNext() {
        if (debug_enabled) console.log('Starting next crawl');
        if (crawlQueue.length === 0) {
            if (debug_enabled) console.log('Crawl queue empty, scheduling next check');
            setTimeout(() => {
                processLinks();
            }, 1500);
            return;
        }
        let { link, videoId } = crawlQueue.shift();
        let apiUrl = `https://www.nicovideo.jp/watch/${videoId}`;

        if (debug_enabled) console.log("[4chan Niconico Titles] Fetching data from:", apiUrl);
        try {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                fetch: true,
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const dataNode = doc.querySelector('meta[name="server-response"]');
                    if (!dataNode) {
                        console.warn("[4chan Niconico Titles] No server response found. ABORTING");
                        return;
                    }

                    let jsonData = JSON.parse(dataNode.content);
                    const resData = jsonData?.data?.response;
                    if (!resData) {
                        console.warn("[4chan Niconico Titles] Invalid video data. ABORTING");
                        return;
                    }

                    if (!resData?.video?.title) {
                        console.warn("[4chan Niconico Titles] Invalid video title. ABORTING");
                        return;
                    }

                    let metadata;
                    if (onlyTitles) {
                        metadata = `[Niconico] ${resData?.video?.title}`;
                    } else {
                        let sec = resData?.video?.duration;
                        let duration = "";
                        if (sec) {
                            let hh = Math.floor(sec / 3600);
                            let mm = Math.floor((sec % 3600) / 60);
                            let ss = sec % 60;
                            duration = `${hh ? hh.toString().padStart(2, '0') + ":" : ""}${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
                        }
                        let date = new Date(resData?.video?.registeredAt)?.toLocaleString('ja-JP');
                        let owner = resData?.owner?.nickname || resData?.channel?.name || "Unknown Video Owner";
                        metadata = `[Niconico] ${resData?.video?.title} • 👤 ${owner} • ⏰ ${date} • ⌛ ${duration}`;
                    }

                    if (debug_enabled) console.log("[4chan Niconico Titles] Saving video metadata to DB:", metadata);
                    saveToDB(videoId, metadata).then(() => {
                        if (debug_enabled) console.log("[4chan Niconico Titles] Update link text.");
                        fixLinkNode(link, apiUrl, metadata);
                    });
                },
                onerror: function (err) {
                    console.error("[4chan Niconico Titles] Failed to fetch data for", videoId, err);
                }
            });
        } catch (err) {
            console.error("[4chan Niconico Titles] Error initializing request for", videoId, err);
        }
        setTimeout(crawlNext, DELAY_EACH_REQUEST);
    }

    GM_registerMenuCommand("[Niconico] Delete Database and Reload", () => {
        confirm("Are you sure you want to delete the database and reload the page?\n\nThis action cannot be undone.");
        if (confirm("Warning: This action will delete all cached video data.\n\nDo you really want to proceed?")) {
            // Delete the database
            indexedDB.deleteDatabase(DB_NAME);
            // Reload the page
            window.location.reload();
        }
    });

    function toggleOnlyTitles() {
        onlyTitles = !onlyTitles;
        GM_setValue("onlyTitles", onlyTitles);
        console.log(`[4chan Niconico Titles] Toggled onlyTitles to ${onlyTitles}`);
        updateMenuCommand();
    }

    let menuCommandID;
    function updateMenuCommand() {
        const commandName = `[Niconico] ${onlyTitles ? "Show All Info" : "Show Titles Only"} (only for newer links)`;
        if (menuCommandID) {
            GM_unregisterMenuCommand(menuCommandID);
        }
        menuCommandID = GM_registerMenuCommand(commandName, toggleOnlyTitles);
    }
    updateMenuCommand();

    let started = false;
    function startProcessing(event) {
        if (!started) {
            // debugger;
            started = true;
            console.log(`[4chan Niconico Titles] Initializing with ${event?.type || "unknown event"}... Start processing links periodically...`);
            processLinks();
        }
    }
    document.addEventListener('4chanXInitFinished', startProcessing);
    setTimeout(startProcessing, 2000, { type: "setTimeout" });
})();


