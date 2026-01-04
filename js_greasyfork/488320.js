// ==UserScript==
// @name         nai3.art自动持久化保存图片
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  用于nai3.art自动持久化保存图片
// @author       wsVIC
// @license      MIT
// @match        https://nai3.art/*
// @downloadURL https://update.greasyfork.org/scripts/488320/nai3art%E8%87%AA%E5%8A%A8%E6%8C%81%E4%B9%85%E5%8C%96%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/488320/nai3art%E8%87%AA%E5%8A%A8%E6%8C%81%E4%B9%85%E5%8C%96%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

function sleep(msecs) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, msecs);
    })
}

async function waitUntil(queryString) {
    while (document.querySelector(queryString) === null) await sleep(1000);
    await sleep(500);
    return;
}

async function main() {
    const toolZoneElement = document.querySelector(".div-hear-step");
    const newElement = document.createElement("div");
    const newElementInnerHTML = /*html*/ `
        <div style="display: flex; align-items: center; height: 4vh; color: white; background-color: rgb(19, 21, 44); border-top: 1.6px">
            <div style="flex-grow: 1;">
                <span>存储状态：</span>
                <span class="db-open-state" style="color: red">无效</span>
            </div>
            <div style="flex-grow: 1;">
                <span>已存：</span>
                <span class="stored-pic-count">null</span>
            </div>
            <div style="flex-grow: 1;">
                <button class="clear-btn">清空</button>
            </div>
            <div style="flex-grow: 1;">
                <button class="download-all">全部下载</button>
            </div>
        </div>
    `
    newElement.innerHTML = newElementInnerHTML;
    toolZoneElement.appendChild(newElement);
    const dbOpenStateElement = document.querySelector(".db-open-state");
    const storedPicCountElement = document.querySelector(".stored-pic-count");
    const clearBtnElement = document.querySelector(".clear-btn");
    const downloadAllBtnElement = document.querySelector(".download-all");

    let db;
    let currentMaxRecordIndex;

    function databaseInit() {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open("base64Database", 1);
            request.onerror = function (event) {
                console.log("Database error: " + event.target.errorCode);
                reject();
            };

            request.onupgradeneeded = function (event) {
                db = event.target.result;
                let objectStore = db.createObjectStore("images", { keyPath: "id" });
            };

            request.onsuccess = function (event) {
                db = event.target.result;
                dbOpenStateElement.innerHTML = "有效";
                dbOpenStateElement.style.color = "green";
                resolve();
            };
        });
    }

    function countRecords() {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(["images"], "readonly");
            let objectStore = transaction.objectStore("images");
            let request = objectStore.count();
            request.onsuccess = function () {
                resolve(request.result);
                console.log("Number of records: ", request.result);
            };
            request.onerror = function (event) {
                reject();
                console.log("Error in counting records: ", event.target.errorCode);
            };
        })
    }

    function storeNewPicture(src) {
        let transaction = db.transaction(["images"], "readwrite");
        let objectStore = transaction.objectStore("images");
        let request = objectStore.add({ id: currentMaxRecordIndex, image: src });

        request.onsuccess = function (event) {
            console.log("Image with id " + currentMaxRecordIndex + " has been added to your database.");
            currentMaxRecordIndex++;
            storedPicCountElement.innerHTML = currentMaxRecordIndex;
        };

        request.onerror = function (event) {
            if (event.target.error.name === "QuotaExceededError") {
                alert("你的浏览器存储空间已满，请清除已有记录！");
            }
            else {
                console.log("Unable to add data, unknown error.");
            }
        }
    }

    function getRecordsInRange(lowerBound, upperBound, includeLower, includeUpper) {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(["images"], "readonly");
            let objectStore = transaction.objectStore("images");
            let keyRange = IDBKeyRange.bound(lowerBound, upperBound, !includeLower, !includeUpper);
            let cursor = objectStore.openCursor(keyRange);
            let records = [];

            cursor.onsuccess = function (event) {
                let result = event.target.result;
                if (result) {
                    records.push(result.value);
                    result.continue();
                } else {
                    console.log("Records in range: ", records);
                }
                resolve(records);
            };

            cursor.onerror = function (event) {
                console.log("Error in fetching records in range: ", event.target.errorCode);
                reject();
            };
        })
    }

    // giving "data:image/png;base64,iVBORw0KGgo...." and its name, directly download it.
    function downloadBase64Image(src, name) {
        const tempAnchorElement = document.createElement("a");
        tempAnchorElement.href = src;
        tempAnchorElement.download = name;
        tempAnchorElement.click();
    }

    async function downloadAllImage() {
        let recordArray;
        if (currentMaxRecordIndex !== 0) {
            recordArray = await getRecordsInRange(0, currentMaxRecordIndex, true, false);
            console.log("recordArray is", recordArray);
            for (const record of recordArray) {
                console.log("downloading", record.id, "image");
                downloadBase64Image(record.image, record.id);
                // bypass browser abuse prevent mechanism
                await sleep(200);
            }
        }
    }

    function clearObjectStore(storeName) {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const clearRequest = store.clear();

        clearRequest.onsuccess = function () {
            currentMaxRecordIndex = 0;
            storedPicCountElement.innerHTML = 0;
            console.log('Object store cleared.');
        };

        clearRequest.onerror = function (error) {
            console.error('clearObjectStore error:', error);
        };
    }
    await databaseInit();
    // start from zero
    // total record count in indexdb
    currentMaxRecordIndex = await countRecords();
    storedPicCountElement.innerHTML = currentMaxRecordIndex;

    // call out the image list (otherwise it won't appear in DOM tree)
    document.querySelector(".img-hisor").click();
    await waitUntil(".infinite-list")

    console.log("infinite list appeared!");

    // history picture count of this time
    let historyPictureCount = 0;
    const historyListElement = document.querySelector(".infinite-list");

    // polling if there is a new picture, and store it if is.
    let historyListCheckInterval = setInterval(() => {
        let newPicSrc;
        // we always assume the interval is enough to detect every picture
        if (historyListElement.childNodes.length > historyPictureCount) {
            newPicSrc = historyListElement.childNodes[0].childNodes[0].src;
            historyPictureCount++;
            storeNewPicture(newPicSrc);
            console.log("new image detected.");
        }
    }, 1000);

    clearBtnElement.addEventListener("click", () => {
        console.log("clear button clicked!");
        if (confirm("即将删除所有记录")) {
            clearObjectStore("images");
        }
    })

    downloadAllBtnElement.addEventListener("click", () => {
        console.log("download all button clicked!");
        if (confirm("即将下载所有记录")) {
            downloadAllImage();
        }
    })
};

async function pageNavigationHandle() {
    if (window.location.pathname === "/home") {
        await waitUntil(".div-hear-step");
        sleep("1000")
        main();
    }
    else {
        window.navigation.addEventListener("navigate", async (event) => {
            console.log("navigated");
            if (event.destination.url === "https://nai3.art/home") {
                // this does not guarantee
                await waitUntil(".div-hear-step");
                sleep("1000")
                main();
            }
        })
    }
}

pageNavigationHandle();