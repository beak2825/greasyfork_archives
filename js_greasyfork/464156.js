// ==UserScript==
// @name         Another cmoa.jp Downloader
// @namespace    Ziran
// @version      2.3.0
// @description  用于网站cmoa.jp的下载。在顶部菜单选项右侧点击download按钮开始下载。按钮没有显示的话尝试重新打开菜单栏。图片每50页分为一部分进行压缩下载，压缩需要40-60秒，请不要关闭或刷新页面。
// @author       Ziran
// @match        https://www.cmoa.jp/bib/*
// @match        https://yomiho.cmoa.jp/bib/*
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.2.0/dist/jszip.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464156/Another%20cmoajp%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/464156/Another%20cmoajp%20Downloader.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function addSpeedreaderCanvas() {
        let canvas = document.createElement("canvas");
        canvas.id = "temp-canvas";
        canvas.style.cssText = `position: fixed;
                          top: 15%;
                          left: 5%;
                          height: 268px;
                          width: 187px;
                          background-color: pink;
                          z-index: 19;
                          visibility:hidden;`;

        document.body.appendChild(canvas);
    }

    function addSpeedreaderRadio() {
        let downloadingMessage = document.createElement("span");
        downloadingMessage.id = "downloading-message";
        downloadingMessage.innerText = "downloading……";
        downloadingMessage.style.cssText = `position: fixed;
                          top: 10px;
                          right: 80px;
                          font-size: 16px;
                          font-weight: 500;
                          visibility:hidden;`;

        let menu_header = document.getElementById("menu_header");
        menu_header.appendChild(downloadingMessage);
    }

    function addSpeedreaderButton() {
        let button = document.createElement("button");
        button.id = "download-button";
        button.innerHTML = "download";
        button.style.cssText = `position: fixed;
                          top: 11px;
                          right: 80px;
                          font-size:16px;
                          border-style: none;
                          text-align:center;
                          vertical-align:baseline;
                          cursor:pointer`;

        button.onclick = async function () {
            changeDownloadStatus("on");
            let zip = new JSZip();
            let folder = zip.folder(__sreaderFunc__.contentInfo.items[0].SubTitle);
            let partCounter = 0;
            let partPages = 50;
            for (let i = 0; i < __sreaderFunc__.currentPageInfo.endPageNumber; i++) {
                partCounter = i + 1;
                if (partCounter % partPages == 0) {
                    await zip.generateAsync({ type: "blob" })
                        .then(function (content) {
                        saveAs(content, __sreaderFunc__.contentInfo.items[0].SubTitle + "_part" + Math.floor(partCounter / partPages).toString());
                    });
                    zip = new JSZip();
                    folder = zip.folder(__sreaderFunc__.contentInfo.items[0].SubTitle);
                }
                __sreaderFunc__.moveTo(i, !1);
                let content = document.getElementById("content-p" + (i + 1).toString());
                while (!content.hasChildNodes()) {
                    await sleep(200);
                }
                let ptimg = content.firstElementChild;
                while (!ptimg.hasChildNodes()) {
                    await sleep(200);
                    ptimg = content.firstElementChild;
                }

                let canvas = document.getElementById("temp-canvas");
                let ctx = canvas.getContext('2d');

                let imgPartParent = ptimg.firstElementChild;
                let imgPart = imgPartParent.firstElementChild;
                canvas.height = imgPart.naturalHeight * ptimg.offsetHeight / imgPartParent.offsetHeight;
                canvas.width = canvas.height * ptimg.offsetWidth / ptimg.offsetHeight;

                for (let i = 0; i < 3; i++) {
                    let imgPart = imgPartParent.firstElementChild;
                    while (!imgPart.complete) {
                        await sleep(200);
                    }

                    let insetArr = imgPartParent.style.inset.split('%');
                    for (let j = 0; j < 4 && j < insetArr.length; j++) {
                        insetArr[j] = insetArr[j].trim();
                        insetArr[j] = parseFloat(insetArr[j]) / 100.0;
                    }
                    let imgHeight = canvas.height * (1 - insetArr[0] - insetArr[2]);
                    let imgWidth = imgHeight * imgPart.naturalWidth / imgPart.naturalHeight;
                    let imgY = canvas.height * insetArr[0];
                    ctx.drawImage(imgPart, 0, imgY, imgWidth, imgHeight);

                    imgPartParent = imgPartParent.nextElementSibling;
                }
                folder.file((i + 1).toString() + ".png", canvas.toDataURL().split(',')[1], { base64: true });
            }
            if (partCounter % partPages != 0) {
                await zip.generateAsync({ type: "blob" })
                    .then(function (content) {
                    saveAs(content, __sreaderFunc__.contentInfo.items[0].SubTitle + "_part" + Math.ceil(partCounter / partPages).toString());
                });
            }
            changeDownloadStatus("off");
        };

        let menu_header = document.getElementById("menu_header");
        menu_header.appendChild(button);
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function changeDownloadStatus(status) {
        let button = document.getElementById("download-button");
        let downloadingMessage = document.getElementById("downloading-message");
        if (status == "on") {
            alert("开始下载，请稍候");
            button.style.visibility = "hidden";
            downloadingMessage.style.visibility = "visible";
        }
        else if (status == "off") {
            button.style.visibility = "visible";
            downloadingMessage.style.visibility = "hidden";
        }
        return
    }

    function addReaderButton() {
        let button = document.createElement("button");
        button.id = "download-button";
        button.innerHTML = "download";
        button.style.cssText = `position: fixed;
                          top: 11px;
                          right: 80px;
                          font-size:16px;
                          border-style: none;
                          text-align:center;
                          vertical-align:baseline;
                          cursor:pointer`;

        button.onclick = async function () {
            alert("开始下载，请稍候");
            let text = ZOM0KK.ZZN0AE.value;
            let title = '';
            title = text.match(/(?<=<title>).*(?=<\/title>)/)[0];
            text = text.replace(/<head>.*?<\/head>/s, '');
            text = text.replace(/<t-param indent="0".*?>/g, '\n');
            text = text.replace(/<br.*?>/g, '\n');
            text = text.replace(/<.*?>/g, '');

            let sss = text.match(/&\$.*?;/g, '');
            for (let i = 0; i < sss.length; i++) {
                text = text.replace(sss[i], theZ2Q0F5(sss[i].slice(2, sss[i].length - 1)));
            }

            while (text[0] === '\n') {
                text = text.slice(1, text.length);
            }

            let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            saveAs(blob, title + ".txt");
        };

        let menu_header = document.getElementById("ctmble_menu_upper_holder");
        menu_header.appendChild(button);
    }

    function theZ2Q0F5(ss) {
        let vs = Z2Q0F5(ss);
        let sb;
        let sp;
        let cd1;
        let cd2;
        ss = "";
        if (vs < 256) {
            sb = vs % 256;
            ss = String.fromCharCode(sb)
        } else if (vs >= 65536) {
            sp = vs - 65536;
            cd1 = 55296 | sp >> 10;
            cd2 = 56320 | sp & 1023;
            ss = String.fromCharCode(cd1, cd2)
        } else {
            ss = String.fromCharCode(vs)
        }
        return ss;
    }

    // Run script
    let isButtonCreated = false;
    document.onclick = function (e) {
        if (document.documentURI.indexOf('cmoa.jp/bib/reader/') != -1) {
            if (!isButtonCreated && document.getElementById("ctmble_menu_upper_holder") != null) {
                addReaderButton();
                isButtonCreated = true;
            }
        }
        if (document.documentURI.indexOf('cmoa.jp/bib/speedreader/') != -1) {
            if (!isButtonCreated && document.getElementById("menu_header") != null) {
                addSpeedreaderButton();
                addSpeedreaderCanvas();
                addSpeedreaderRadio();
                isButtonCreated = true;
            }
        }
    }
})();