// ==UserScript==
// @name                115 Rename for CN
// @namespace           http://tampermonkey.net/
// @version             2.1
// @description         免VPN 番号重命名 free version(Query and modify filenames based on existing filename "番号”, includes detailed notification feature)
// @author              no_one
// @include             https://115.com/*
// @grant               GM_xmlhttpRequest
// @grant               GM_notification
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/520977/115%20Rename%20for%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/520977/115%20Rename%20for%20CN.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // HTML for the rename buttons, only keeping javhoo related buttons
    const renameListHTML = `
        <li id="rename_list">
            <a id="rename_all_javhoo" class="mark" href="javascript:;">Rename</a>
            <a id="rename_all_javhoo_date" class="mark" href="javascript:;">Rename with Date</a>
        </li>
    `;

    // Base URLs for javhoo
    const JAVHOO_BASE = "https://www.javhoo.top/";
    const JAVHOO_SEARCH = `${JAVHOO_BASE}av/`;
    const JAVHOO_UNCENSORED_SEARCH = `${JAVHOO_BASE}uncensored/av/`;

    // Timer ID
    let intervalId = null;

    // Constants
    const MAX_RETRIES = 3;
    const MAX_CONCURRENT_REQUESTS = 5;
    const NOTIFICATION_DISPLAY_TIME = 4000; // 4 seconds

    // State variables
    let activeRequests = 0;
    const requestQueue = [];

    const progressData = {
        total: 0,
        processed: 0,
        success: 0,
        failed: 0
    };

    const notificationQueue = [];
    let isNotificationShowing = false;

    /**
     * Initialize the script
     */
    function init() {
        intervalId = setInterval(addRenameButtons, 1000);
        injectProgressBar();
        requestNotificationPermission();
    }

    /**
     * Request notification permission and test
     */
    function requestNotificationPermission() {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("115Rename", { body: "Notification permission granted." });
                } else {
                    console.log("Notification permission denied.");
                }
            });
        } else if (Notification.permission === "granted") {
            new Notification("115Rename", { body: "Script loaded." });
        }
    }

    /**
     * Periodically check and add rename buttons
     */
    function addRenameButtons() {
        const openDir = $("div#js_float_content li[val='open_dir']");
        if (openDir.length !== 0 && $("li#rename_list").length === 0) {
            openDir.before(renameListHTML);
            bindButtonEvents();
            console.log("Rename buttons added");
            clearInterval(intervalId);
        }
    }

    /**
     * Bind click events to buttons
     */
    function bindButtonEvents() {
        $("#rename_all_javhoo").on("click", () => {
            rename(rename_javhoo, false);
        });
        $("#rename_all_javhoo_date").on("click", () => {
            rename(rename_javhoo, true);
        });
    }

    /**
     * Execute rename operation
     * @param {Function} call Callback function
     * @param {Boolean} addDate Whether to add date
     */
    function rename(call, addDate) {
        const selectedItems = $("iframe[rel='wangpan']")
            .contents()
            .find("li.selected");

        if (selectedItems.length === 0) {
            enqueueNotification("Please select files to rename.", "error");
            return;
        }

        // Reset progress data
        progressData.total = selectedItems.length;
        progressData.processed = 0;
        progressData.success = 0;
        progressData.failed = 0;
        updateProgressBar();

        // Show start notification
        enqueueNotification(`Starting to rename ${progressData.total} files...`, "info");

        selectedItems.each(function () {
            const $item = $(this);
            const fileName = $item.attr("title");
            const fileType = $item.attr("file_type");
            let fid, suffix;

            if (fileType === "0") {
                fid = $item.attr("cate_id");
            } else {
                fid = $item.attr("file_id");
                const lastDot = fileName.lastIndexOf('.');
                if (lastDot !== -1) {
                    suffix = fileName.substring(lastDot);
                }
            }

            if (fid && fileName) {
                const fh = getVideoCode(fileName);
                if (fh) {
                    const chineseCaptions = checkChineseCaptions(fh, fileName);
                    enqueueRequest(() => call(fid, fh, suffix, chineseCaptions, addDate, $item));
                } else {
                    progressData.processed++;
                    progressData.failed++;
                    updateProgressBar();
                    enqueueNotification(`${fileName}: No code extracted`, "error");
                }
            }
        });

        processQueue();
    }

    /**
     * Add request to queue and process
     * @param {Function} requestFn Request function
     */
    function enqueueRequest(requestFn) {
        requestQueue.push(requestFn);
        console.log(`Request added to queue. Current queue length: ${requestQueue.length}`);
    }

    /**
     * Process the request queue with concurrency limit
     */
    function processQueue() {
        while (activeRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length > 0) {
            const requestFn = requestQueue.shift();
            activeRequests++;
            console.log(`Processing request from queue. Active requests: ${activeRequests}`);
            requestFn().finally(() => {
                activeRequests--;
                console.log(`Request completed. Active requests: ${activeRequests}`);
                processQueue();
            });
        }
    }

    /**
     * Query javhoo and rename
     * @param {String} fid File ID
     * @param {String} fh Code
     * @param {String} suffix File suffix
     * @param {Boolean} chineseCaptions Whether it has Chinese captions
     * @param {Boolean} addDate Whether to add date
     * @param {jQuery} $item jQuery object of the file
     * @returns {Promise}
     */
    function rename_javhoo(fid, fh, suffix, chineseCaptions, addDate, $item) {
        const url = JAVHOO_SEARCH;
        return requestJavhoo(fid, fh, suffix, chineseCaptions, addDate, url, 0, $item);
    }

    /**
     * Request javhoo and handle rename
     * @param {String} fid File ID
     * @param {String} fh Code
     * @param {String} suffix File suffix
     * @param {Boolean} chineseCaptions Whether it has Chinese captions
     * @param {Boolean} addDate Whether to add date
     * @param {String} url Request URL
     * @param {Number} retryCount Current retry count
     * @param {jQuery} $item jQuery object of the file
     * @returns {Promise}
     */
    function requestJavhoo(fid, fh, suffix, chineseCaptions, addDate, url, retryCount, $item) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${url}${fh}`,
                headers: {
                    "User-Agent": navigator.userAgent,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                onload: (xhr) => {
                    if (xhr.status !== 200) {
                        console.warn(`Request failed, status code: ${xhr.status}`);
                        handleRetryOrFail(`HTTP ${xhr.status}`, fid, fh, suffix, chineseCaptions, addDate, url, retryCount, $item, resolve, reject);
                        return;
                    }

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(xhr.responseText, "text/html");

                    const titleElement = doc.querySelector("header.article-header h1.article-title");
                    const title = titleElement ? titleElement.textContent.trim() : null;

                    console.log(`Extracted title: "${title}"`);

                    if (title) {
                        let newName = buildNewName(fh, suffix, chineseCaptions, title);

                        if (addDate) {
                            const currentDate = new Date().toISOString().split('T')[0];
                            newName = `${currentDate}_${newName}`;
                        }

                        if (newName) {
                            send_115(fid, newName, fh)
                                .then(() => {
                                    progressData.processed++;
                                    progressData.success++;
                                    updateProgressBar();
                                    enqueueNotification(`${fh}: Rename successful`, "success");
                                    updateDOM($item, newName);
                                    resolve();
                                })
                                .catch((error) => {
                                    progressData.processed++;
                                    progressData.failed++;
                                    updateProgressBar();
                                    enqueueNotification(`${fh}: Rename failed - ${error}`, "error");
                                    reject(error);
                                });
                        } else {
                            progressData.processed++;
                            progressData.failed++;
                            updateProgressBar();
                            enqueueNotification(`${fh}: Failed to generate new name`, "error");
                            reject("Failed to generate new name");
                        }
                    } else if (url !== JAVHOO_UNCENSORED_SEARCH && retryCount < MAX_RETRIES) {
                        console.warn(`Attempting uncensored search: ${JAVHOO_UNCENSORED_SEARCH}${fh}`);
                        requestJavhoo(fid, fh, suffix, chineseCaptions, addDate, JAVHOO_UNCENSORED_SEARCH, retryCount + 1, $item)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        progressData.processed++;
                        progressData.failed++;
                        updateProgressBar();
                        enqueueNotification(`${fh}: Title not found or error occurred`, "error");
                        reject("Title not found or error occurred");
                    }
                },
                onerror: () => {
                    console.warn(`Request failed: ${url}${fh}`);
                    handleRetryOrFail("Network error", fid, fh, suffix, chineseCaptions, addDate, url, retryCount, $item, resolve, reject);
                }
            });
        });
    }

    /**
     * Handle retry or fail
     * @param {String} errorMsg Error message
     * @param {String} fid File ID
     * @param {String} fh Code
     * @param {String} suffix File suffix
     * @param {Boolean} chineseCaptions Whether it has Chinese captions
     * @param {Boolean} addDate Whether to add date
     * @param {String} url Request URL
     * @param {Number} retryCount Current retry count
     * @param {jQuery} $item jQuery object of the file
     * @param {Function} resolve Promise resolve function
     * @param {Function} reject Promise reject function
     */
    function handleRetryOrFail(errorMsg, fid, fh, suffix, chineseCaptions, addDate, url, retryCount, $item, resolve, reject) {
        if (retryCount < MAX_RETRIES) {
            console.warn(`Request failed (${errorMsg}), retrying (${retryCount + 1}/${MAX_RETRIES}): ${url}${fh}`);
            const newUrl = url === JAVHOO_SEARCH ? JAVHOO_UNCENSORED_SEARCH : url;
            requestJavhoo(fid, fh, suffix, chineseCaptions, addDate, newUrl, retryCount + 1, $item)
                .then(resolve)
                .catch(reject);
        } else {
            progressData.processed++;
            progressData.failed++;
            updateProgressBar();
            enqueueNotification(`${fh}: ${errorMsg}`, "error");
            reject(errorMsg);
        }
    }

    /**
     * Build new file name
     * @param {String} fh Code
     * @param {String} suffix File suffix
     * @param {Boolean} chineseCaptions Whether it has Chinese captions
     * @param {String} title Title
     * @returns {String} New name
     */
    function buildNewName(fh, suffix, chineseCaptions, title) {
        let newName = '';

        if (title.startsWith(fh)) {
            newName = title;
        } else {
            newName = `${fh}`;
            if (chineseCaptions) {
                newName += "【中文字幕】";
            }
            newName += ` ${title}`;
        }

        if (suffix) {
            newName += suffix;
        }

        return newName;
    }

    /**
     * Send rename request to 115.com
     * @param {String} fid File ID
     * @param {String} name New file name
     * @param {String} fh Code
     * @returns {Promise} Request promise
     */
    function send_115(fid, name, fh) {
        return new Promise((resolve, reject) => {
            const standardizedName = stringStandard(name);
            $.post("https://webapi.115.com/files/edit", {
                fid: fid,
                file_name: standardizedName
            })
            .done((data) => {
                console.log("send_115 response data:", data);
                try {
                    const result = typeof data === "string" ? JSON.parse(data) : data;
                    if (result.state) {
                        resolve();
                    } else {
                        const errorMsg = unescape(result.error.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
                        reject(errorMsg);
                    }
                } catch (e) {
                    console.error("Failed to parse response:", e);
                    reject("Failed to parse response");
                }
            })
            .fail(() => {
                reject("Network error");
            });
        });
    }

    /**
     * Add notification to queue and process
     * @param {String} message Notification message
     * @param {String} type Notification type ('success', 'error', 'info')
     */
    function enqueueNotification(message, type = "info") {
        notificationQueue.push({ message, type });
        console.log(`Notification added to queue: ${message} Type: ${type}`);
        processNotificationQueue();
    }

    /**
     * Process notification queue to ensure one notification at a time
     */
    function processNotificationQueue() {
        if (isNotificationShowing || notificationQueue.length === 0) {
            return;
        }

        isNotificationShowing = true;
        const { message, type } = notificationQueue.shift();
        console.log(`Displaying notification: ${message} Type: ${type}`);

        // Use browser's Notification API
        if (Notification.permission === "granted") {
            let notification = new Notification("115Rename", { body: message });

            notification.onclose = () => {
                isNotificationShowing = false;
                processNotificationQueue();
            };
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    let notification = new Notification("115Rename", { body: message });

                    notification.onclose = () => {
                        isNotificationShowing = false;
                        processNotificationQueue();
                    };
                } else {
                    // Fallback to alert if permission denied
                    alert(message);
                    isNotificationShowing = false;
                    processNotificationQueue();
                }
            });
        } else {
            // Fallback to alert if permission denied
            alert(message);
            isNotificationShowing = false;
            processNotificationQueue();
        }
    }

    /**
     * Standardize file name by removing or replacing invalid characters
     * @param {String} name Original file name
     * @returns {String} Standardized file name
     */
    function stringStandard(name) {
        return name.replace(/\\/g, "")
                   .replace(/\//g, " ")
                   .replace(/:/g, " ")
                   .replace(/\?/g, " ")
                   .replace(/"/g, " ")
                   .replace(/</g, " ")
                   .replace(/>/g, " ")
                   .replace(/\|/g, "")
                   .replace(/\*/g, " ");
    }

    /**
     * Check if file name contains Chinese captions
     * @param {String} fh Code
     * @param {String} title File name
     * @returns {Boolean} Whether it contains Chinese captions
     */
    function checkChineseCaptions(fh, title) {
        if (title.includes("中文字幕")) {
            return true;
        }
        const regex = new RegExp(`${fh}-C`, 'i');
        return regex.test(title);
    }

    /**
     * Extract code from file name
     * @param {String} title File name
     * @returns {String|null} Extracted code or null
     */
    function getVideoCode(title) {
        title = title.toUpperCase()
                     .replace("SIS001", "")
                     .replace("1080P", "")
                     .replace("720P", "")
                     .trim();

        const patterns = [
            /FC2-PPV-\d+/,
            /1PONDO-\d{6}-\d{2,4}/,
            /HEYZO-?\d{4}/,
            /CARIB-\d{6}-\d{3}/,
            /N-\d{4}/,
            /JUKUJO-\d{4}/,
            /[A-Z]{2,5}-\d{3,5}/,
            /\d{6}-\d{2,4}/,
            /[A-Z]+\d{3,5}/,
            /[A-Za-z]+-?\d+/,
            /\d+-?\d+/
        ];

        for (let pattern of patterns) {
            let match = title.match(pattern);
            if (match) {
                let code = match[0];
                console.log(`Found code: ${code}`);
                return code;
            }
        }

        console.warn("Code not found:", title);
        return null; // Return null if not found
    }

    /**
     * Inject progress bar into the page
     */
    function injectProgressBar() {
        const progressBarContainer = document.createElement('div');
        progressBarContainer.id = 'renameProgressBarContainer';
        Object.assign(progressBarContainer.style, {
            position: 'fixed',
            top: '100px',
            right: '10px',
            width: '320px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            borderRadius: '5px',
            zIndex: '9999',
            display: 'none'
        });

        const title = document.createElement('div');
        title.innerText = '115Rename Progress';
        Object.assign(title.style, {
            marginBottom: '5px',
            fontWeight: 'bold'
        });

        const progress = document.createElement('div');
        progress.id = 'renameProgressBar';
        Object.assign(progress.style, {
            width: '100%',
            backgroundColor: '#555',
            borderRadius: '3px',
            overflow: 'hidden',
            position: 'relative'
        });

        const progressFill = document.createElement('div');
        progressFill.id = 'renameProgressFill';
        Object.assign(progressFill.style, {
            width: '0%',
            height: '10px',
            backgroundColor: '#4caf50'
        });

        const progressText = document.createElement('div');
        progressText.id = 'renameProgressText';
        Object.assign(progressText.style, {
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            lineHeight: '10px',
            color: '#fff',
            pointerEvents: 'none'
        });

        progress.appendChild(progressFill);
        progress.appendChild(progressText);
        progressBarContainer.appendChild(title);
        progressBarContainer.appendChild(progress);

        document.body.appendChild(progressBarContainer);
    }

    /**
     * Update progress bar
     */
    function updateProgressBar() {
        const container = $('#renameProgressBarContainer');
        const fill = $('#renameProgressFill');
        const text = $('#renameProgressText');

        if (progressData.processed === 0 && requestQueue.length === 0 && activeRequests === 0) {
            container.hide();
            return;
        }

        container.show();

        const percent = ((progressData.processed / progressData.total) * 100).toFixed(2);
        fill.css('width', `${percent}%`);
        text.text(`${progressData.processed} / ${progressData.total}`);

        if (progressData.processed >= progressData.total) {
            container.hide();
            enqueueNotification(`Rename completed: Success ${progressData.success}, Failed ${progressData.failed}.`, "info");
            console.log(`Rename completed: Success ${progressData.success}, Failed ${progressData.failed}.`);
        }
    }

    /**
     * Update file name displayed on the page
     * @param {jQuery} $item jQuery object of the file
     * @param {String} newName New file name
     */
    function updateDOM($item, newName) {
        $item.attr("title", newName);

        const fileNameElement = $item.find(".file_name");
        if (fileNameElement.length > 0) {
            fileNameElement.text(newName);
        } else {
            $item.text(newName);
        }
    }

    // Initialize the script
    init();

})();
