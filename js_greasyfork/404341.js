// ==UserScript==
// @name         Comic Action Downloader
// @namespace    -
// @version      0.2.2
// @description  可能需要開啓允許下載多個檔案的權限
// @author       LianSheng

// @include      https://comic-action.com/*
// @noframes

// @require      https://greasyfork.org/scripts/402133-toolbox/code/Toolbox.js

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404341/Comic%20Action%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/404341/Comic%20Action%20Downloader.meta.js
// ==/UserScript==

(function () {
    if (location.pathname.match("episode") != null) {
        let appendStyle = `
            div#us_download {
                padding: 1rem; 
                color: #fff; 
                background-color: #090; 
                position: fixed; 
                right: 1rem; 
                bottom: 1rem; 
                z-index: 1000000; 
                border-radius: 8px; 
                opacity: 0.6; 
                user-select: none; 
                cursor: pointer;
            }

            div#us_download:hover {
                opacity: 1;
            }
        `;

        let simpleButton = `
            <div id="us_download">下載此回</div>
        `;
        document.body.insertAdjacentHTML("afterbegin", simpleButton);
        addStyle(appendStyle, "body", "us_appendStyle");

        document.querySelector("div#us_download").addEventListener("click", downloadThisEpisode);
    }

    // 下載此回
    async function downloadThisEpisode() {
        let pageData = await fetch(
            `${location.pathname}.json`
        ).then(
            r => r.json()
        ).then(
            j => j.readableProduct
        ).catch(
            e => "error"
        )

        if (pageData != "error") {
            // 成功取得資料

            if (pageData.isPublic == true) {
                // 該篇爲公開

                let seriesName = pageData.series.title;
                let episodeName = pageData.title;
                let count = 1;
                let isStart = false;
                let w = 0;
                let h = 0;

                pageData.pageStructure.pages.forEach(page => {
                    if (page.contentStart != undefined) {
                        // 開始
                        isStart = true;
                    }

                    if (isStart) {
                        rearrangeImage(page.src, `${seriesName}_${episodeName}_${count}`, page.width, page.height);
                        count++;

                        if (w == 0 && h == 0) {
                            w = page.width;
                            h = page.height;
                        }
                        if (page.contentEnd != undefined) {
                            // 結束
                            isStart = false;
                        }
                    }
                });

                // 下載封面圖
                downloadThumbnail(pageData.series.thumbnailUri, `${seriesName}_${episodeName}_0`);
            } else {
                alert("本章非公開，無法下載");
            }
        }
    }

    // 解析圖片
    function rearrangeImage(imgUrl, filename, imageWidth, imageHeight) {
        let canvasResult = document.createElement('canvas');
        let ctxResult = canvasResult.getContext("2d");

        canvasResult.width = imageWidth;
        canvasResult.height = imageHeight;

        const DIVIDE_NUM = 4
        const MULTIPLE = 8
        const width = imageWidth
        const height = imageHeight
        const cell_width = Math.floor(width / (DIVIDE_NUM * MULTIPLE)) * MULTIPLE
        const cell_height = Math.floor(height / (DIVIDE_NUM * MULTIPLE)) * MULTIPLE

        let img = new Image();
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = function () {

            // 壓底圖
            ctxResult.drawImage(img, 0, 0);

            // 採用網站解法 (2020.06.02)
            for (let e = 0; e < DIVIDE_NUM * DIVIDE_NUM; e++) {
                let t = Math.floor(e / DIVIDE_NUM) * cell_height,
                    n = e % DIVIDE_NUM * cell_width,
                    i = Math.floor(e / DIVIDE_NUM),
                    s = e % DIVIDE_NUM * DIVIDE_NUM + i,
                    r = s % DIVIDE_NUM * cell_width,
                    o = Math.floor(s / DIVIDE_NUM) * cell_height;

                ctxResult.drawImage(img, n, t, cell_width, cell_height, r, o, cell_width, cell_height);
            }

            downloadFromCanvas(canvasResult, filename);
        }

        img.src = imgUrl;
    }

    // 下載圖片（內頁）
    function downloadFromCanvas(canvas, filename) {
        let link = document.createElement('a');
        link.download = `${filename}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.7);
        link.click();
    }

    // 下載圖片（封面圖）
    function downloadThumbnail(imgUrl, filename){
        let img = new Image();
        img.setAttribute('crossorigin', 'anonymous');

        let canvasResult = document.createElement('canvas');
        let ctxResult = canvasResult.getContext("2d");

        img.onload = function () {
            canvasResult.width = img.width;
            canvasResult.height = img.height;
            ctxResult.drawImage(img, 0, 0);
            downloadFromCanvas(canvasResult, filename);
        }

        img.src = imgUrl;
    }
})();