// ==UserScript==
// @name         Simple Copymanga Downloader
// @namespace    -
// @version      0.3.0
// @description  沒什麼技術成分，非常暴力的下載器
// @author       LianSheng
// @include      https://www.copymanga.com/*
// @include      https://copymanga.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/420524/Simple%20Copymanga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/420524/Simple%20Copymanga%20Downloader.meta.js
// ==/UserScript==

unsafeWindow.oldeval = unsafeWindow.eval;
unsafeWindow.blocked = (...args) => console.log("Blocked", args);
unsafeWindow.eval = (...args) => {
    args[0] = args[0].replace("removeChild", "blocked");
    args[0] = args[0].replace("remove", "blocked");

    console.log(args);
    unsafeWindow.oldeval(...args);
}

const waitSeconds = 300;
const CORSProxy = "https://cors1.ls197.workers.dev/?";
const Url = location.href;
const Host = location.host;

// 工具：時間
const Time = {
    now: () => Date.now(),
    ago: timestamp => Date.now() - timestamp
};

// 工具：初始化儲存的資料
function storageInit() {
    GM_setValue("progress", 0);
    GM_setValue("total", -1);
    GM_setValue("lastUpdate", Time.now());
}

// 工具：webp 轉 jpg
function webpToJpg(webp) {
    let image = new Image();

    return new Promise(res => {
        image.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0);
            canvas.toBlob(blob => res(blob), 'image/jpeg', 0.75);
        }

        image.src = URL.createObjectURL(webp);
    });
}


// 工具：同步 forEach
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// 主頁：控制是否爲選取模式，若是則不觸發連結
function clickProxy(event, selectMode) {
    if (selectMode) {
        event.preventDefault();
        event.stopPropagation();

        let a = event.target;
        a.classList.toggle("selected");
    }
}

// 主頁：下載所有已選，若 retry 爲 true 則只下載失敗的
function downloadSelected(retry = false) {
    let allLi, allData;
    let progress = document.querySelector("#s_progress");

    if (retry) {
        allLi = document.querySelectorAll("a li.selected.failed, a li.failed");
        allData = [...allLi].map(li => [li.parentElement.getAttribute("title"), li.parentElement.getAttribute("href"), li]);
    } else {
        allLi = document.querySelectorAll("a li.selected");
        allData = [...allLi].map(li => [li.parentElement.getAttribute("title"), li.parentElement.getAttribute("href"), li]);
    }

    console.log(allData);

    asyncForEach(allData, async data => {
        storageInit();
        GM_setValue("downloading", data[0]);

        // 改用彈出式子視窗避免主頁被凍結
        let wid = window.open(`https://${Host}${data[1]}`, data[0], "width=800,height=600");

        await new Promise((res, rej) => {
            let count = 0;
            let id = setInterval(() => {
                if (GM_getValue("downloading") == "completed") {
                    clearInterval(id);
                    res();
                } else {
                    progress.innerText = `${GM_getValue("downloading")}（${GM_getValue("progress")}/${GM_getValue("total")}）`;
                }

                if (GM_getValue("progress") == GM_getValue("total")) {
                    progress.innerText = `${GM_getValue("downloading")}（正在壓縮）`;
                }

                // 判斷超時（ waitSeconds 秒）
                if (Time.ago(GM_getValue("lastUpdate")) > waitSeconds * 1000) {
                    clearInterval(id);
                    rej();
                }

                count++;
            }, 100);
        }).then(() => {
            // 下載成功
            progress.innerText = `（下載成功）`;

            storageInit();
            GM_setValue("downloading", undefined);
            data[2].classList.remove("selected");
            data[2].classList.add("success");
        }).catch(() => {
            // 超時，判斷爲下載失敗，略過
            progress.innerText = `（下載失敗）`;

            storageInit();
            GM_setValue("downloading", undefined);
            data[2].classList.remove("selected");
            data[2].classList.add("failed");
        });

        // 確保子視窗已關閉
        wid.close();
    });
}

// 單頁：下載
async function downloanThisEpisode(imgs) {
    const zip = new JSZip();
    const data = document.querySelector("h4").innerText.split("/");
    const title = data[0];
    const name = data[1].replace(".", "-");

    GM_setValue("total", imgs.length);

    asyncForEach(imgs, async (img, index) => {
        let realSrc = img.getAttribute("data-src");
        fetch(`${CORSProxy}${realSrc}`).then(
            r => r.blob()
        ).then(async webp => {
            let jpg = await webpToJpg(webp);
            zip.file(`${index+1}.jpg`, jpg);
            GM_setValue("lastUpdate", Time.now());
            GM_setValue("progress", GM_getValue("progress") + 1);
        });
    });

    // 等待上方下載完畢
    await new Promise(res => {
        let id = setInterval(() => {
            // 少數情況會有明明完成了數字卻對不起來的狀況，研判可能是短時間內呼叫 API 有重疊到導致誤差
            // 當然也有可能是缺圖，不過由於這個下載器的架構是主頁與個別頁面分開運作，因此很難除錯
            // 只好特別另開一個條件容忍了（誤差 <= 3，且上次更新時間是 60 秒前）
            if (GM_getValue("progress") == GM_getValue("total") || (GM_getValue("total") - GM_getValue("progress") <= 3 && (Time.ago(GM_getValue("lastUpdate")) > 60 * 1000))) {
                clearInterval(id);
                res();
            };
        }, 100);
    });

    await zip.generateAsync({
        type: "base64"
    }).then(
        base64 => window.location = "data:application/zip;base64," + base64
    ).then(zip => {
        let link = document.createElement('a');
        link.setAttribute('href', zip);
        link.setAttribute('download', `${title}_${name}`);
        link.click();
        GM_setValue("downloading", "completed");
    }).catch(() => {
        GM_setValue("downloading", undefined);
    });

    window.close();
}

(function () {
    'use strict';

    GM_addStyle(`.selected { background-color: lightblue; } .success { background-color: lightgreen; } .failed { background-color: pink; }`);

    // 提前丟出空請求，確保網站已開機，減少後續等待時間
    fetch(CORSProxy);

    if (Url.match(/\/comic\/[^\/]+$/)) {
        // 特定漫畫選擇話次頁
        let selectMode = false;

        let id = setInterval(() => {
            let episodeList = document.querySelectorAll("[role='tabpanel'] ul");
            let buttonAdded = false;

            if (episodeList.length == 0)
                return;
            else
                clearInterval(id);

            episodeList.forEach(list => {
                // 個別清單

                if (!buttonAdded) {
                    // 插入控制按鈕
                    let field = document.querySelector(".table-default-right");

                    field.insertAdjacentHTML("afterbegin", `<span style="user-select: none; padding-top: 6px; padding-right: 1rem;"><input type="checkbox" id="cb_changeMode"><label for="cb_changeMode">&nbsp;單選模式</label><span style="width: 0.5rem; display: inline-block;"></span><input type="checkbox" id="cb_selectAll"><label for="cb_selectAll">&nbsp;全選</label><span style="width: 0.5rem; display: inline-block;"></span><button id="btn_download" disabled>下載選取</button><span style="width: 0.5rem; display: inline-block;"></span><button id="btn_retry" disabled>重試失敗的下載</button><span style="width: 0.5rem; display: inline-block;"></span><span id="s_progress" style="color: darkgreen;">進度訊息（就緒）</span></span>`);

                    field.querySelector("#btn_download").onclick = () => {
                        let ok = confirm("請確認 pop-up 的權限已開啓，否則無法正常運作。\n（這個訊息每次都會顯示，無論是否已開啓）");
                        if (ok) {
                            field.querySelector("#btn_retry").disabled = false;
                            downloadSelected();
                        }
                    };
                    field.querySelector("#btn_retry").onclick = () => {
                        let ok = confirm("請確認 pop-up 的權限已開啓，否則無法正常運作。\n（這個訊息每次都會顯示，無論是否已開啓）");
                        if (ok) {
                            downloadSelected(true);
                        }
                    };
                    field.querySelector("#cb_changeMode").onchange = () => {
                        field.querySelector("#btn_download").disabled = false;
                        selectMode = !selectMode;
                    }
                    field.querySelector("#cb_selectAll").onchange = e => {
                        field.querySelector("#btn_download").disabled = false;

                        let checked = e.target.checked;
                        let episodes = document.querySelectorAll("div[id].active ul.table-all a li");

                        if (checked) {
                            episodes.forEach(ep => {
                                ep.classList.add("selected");
                            });
                        } else {
                            episodes.forEach(ep => {
                                ep.classList.remove("selected");
                            });
                        }
                    };

                    buttonAdded = true;
                }

                list.childNodes.forEach(ep => {
                    // 個別話次
                    ep.onclick = e => {
                        clickProxy(e, selectMode);
                    };
                });
            });
        }, 100);
    } else if (Url.match(/\/comic\/[^\/]+\/chapter\/.+$/)) {
        let id = setInterval(() => {
            let allImg = document.querySelectorAll(".comicContent-image-list img");

            if (allImg.length > 0) {
                clearInterval(id);
                downloanThisEpisode([...allImg]);
            }
        }, 100);
    }
})();