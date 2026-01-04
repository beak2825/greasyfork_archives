// ==UserScript==
// @name         华章下载
// @namespace    https://qinlili.bid
// @version      0.1
// @description  EPUB原貌下载
// @author       琴梨梨
// @match        http://www.hzcourse.com/web/refbook/probation/*
// @icon         https://www.hzcourse.com/favicon.ico
// @grant        none
// @require      https://lib.baomitu.com/jszip/3.10.1/jszip.min.js#sha512-XMVd28F1oH/O71fzwBnV7HucLxVwtxf26XV8P4wPk26EDxuGZ91N8bsOttmnomcCD3CS5ZMRL50H0GgOHvegtg==
// @downloadURL https://update.greasyfork.org/scripts/451120/%E5%8D%8E%E7%AB%A0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/451120/%E5%8D%8E%E7%AB%A0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    //CODENAME:HYDROPHILE
    //初始化依赖
    const SakiProgress = {
        isLoaded: false,
        progres: false,
        pgDiv: false,
        textSpan: false,
        first: false,
        alertMode: false,
        init: function (color) {
            if (!this.isLoaded) {
                this.isLoaded = true;
                console.info("SakiProgress Initializing!\nVersion:1.0.4\nQinlili Tech:Github@qinlili23333");
                this.pgDiv = document.createElement("div");
                this.pgDiv.id = "pgdiv";
                this.pgDiv.style = "z-index:9999;position:fixed;background-color:white;min-height:32px;width:auto;height:32px;left:0px;right:0px;top:0px;box-shadow:0px 2px 2px 1px rgba(0, 0, 0, 0.5);transition:opacity 0.5s;display:none;";
                this.pgDiv.style.opacity = 0;
                this.first = document.body.firstElementChild;
                document.body.insertBefore(this.pgDiv, this.first);
                this.first.style.transition = "margin-top 0.5s"
                this.progress = document.createElement("div");
                this.progress.id = "dlprogress"
                this.progress.style = "position: absolute;top: 0;bottom: 0;left: 0;background-color: #F17C67;z-index: -1;width:0%;transition: width 0.25s ease-in-out,opacity 0.25s,background-color 1s;"
                if (color) {
                    this.setColor(color);
                }
                this.pgDiv.appendChild(this.progress);
                this.textSpan = document.createElement("span");
                this.textSpan.style = "padding-left:4px;font-size:24px;";
                this.textSpan.style.display = "inline-block"
                this.pgDiv.appendChild(this.textSpan);
                var css = ".barBtn:hover{ background-color: #cccccc }.barBtn:active{ background-color: #999999 }";
                var style = document.createElement('style');
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                document.getElementsByTagName('head')[0].appendChild(style);
                console.info("SakiProgress Initialized!");
            } else {
                console.error("Multi Instance Error-SakiProgress Already Loaded!");
            }
        },
        destroy: function () {
            if (this.pgDiv) {
                document.body.removeChild(this.pgDiv);
                this.isLoaded = false;
                this.progres = false;
                this.pgDiv = false;
                this.textSpan = false;
                this.first = false;
                console.info("SakiProgress Destroyed!You Can Reload Later!");
            }
        },
        setPercent: function (percent) {
            if (this.progress) {
                this.progress.style.width = percent + "%";
            } else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        clearProgress: function () {
            if (this.progress) {
                this.progress.style.opacity = 0;
                setTimeout(function () { SakiProgress.progress.style.width = "0%"; }, 500);
                setTimeout(function () { SakiProgress.progress.style.opacity = 1; }, 750);
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        hideDiv: function () {
            if (this.pgDiv) {
                if (this.alertMode) {
                    setTimeout(function () {
                        SakiProgress.pgDiv.style.opacity = 0;
                        SakiProgress.first.style.marginTop = "";
                        setTimeout(function () {
                            SakiProgress.pgDiv.style.display = "none";
                        }, 500);
                    }, 3000);
                } else {
                    this.pgDiv.style.opacity = 0;
                    this.first.style.marginTop = "";
                    setTimeout(function () {
                        SakiProgress.pgDiv.style.display = "none";
                    }, 500);
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        showDiv: function () {
            if (this.pgDiv) {
                this.pgDiv.style.display = "";
                setTimeout(function () { SakiProgress.pgDiv.style.opacity = 1; }, 10);
                this.first.style.marginTop = (this.pgDiv.clientHeight + 8) + "px";
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setText: function (text) {
            if (this.textSpan) {
                if (this.alertMode) {
                    setTimeout(function () {
                        if (!SakiProgress.alertMode) {
                            SakiProgress.textSpan.innerText = text;
                        }
                    }, 3000);
                } else {
                    this.textSpan.innerText = text;
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setTextAlert: function (text) {
            if (this.textSpan) {
                this.textSpan.innerText = text;
                this.alertMode = true;
                setTimeout(function () { this.alertMode = false; }, 3000);
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setColor: function (color) {
            if (this.progress) {
                this.progress.style.backgroundColor = color;
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        addBtn: function (img) {
            if (this.pgDiv) {
                var btn = document.createElement("img");
                btn.style = "display: inline-block;right:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;"
                btn.className = "barBtn"
                btn.src = img;
                this.pgDiv.appendChild(btn);
                return btn;
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        removeBtn: function (btn) {
            if (this.pgDiv) {
                if (btn) {
                    this.pgDiv.removeChild(btn);
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        }
    };
    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
    const dlFile = (link, name) => {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';
        eleLink.href = link;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };

    SakiProgress.init();
    let fileList = [];
    SakiProgress.showDiv();
    SakiProgress.setText("正在准备下载...");
    console.log("Igniting Hydrophile Core ...");
    const bookId=document.getElementById("ebookId").value;
    const basePath = "http://www.hzcourse.com/resource/readBook?path=/openresources/teach_ebook/uncompressed/"+bookId+"/";
    await sleep(100);
    SakiProgress.setPercent(1);
    SakiProgress.setText("正在读取EPUB信息...");
    let container = await (await fetch(basePath + "META-INF/container.xml")).blob();
    fileList.push({ file: container, path: "META-INF/container.xml" });
    let containerParsed = new DOMParser().parseFromString(await container.text(), "text/xml");
    console.log(containerParsed);
    await sleep(100);
    SakiProgress.setPercent(3);
    SakiProgress.setText("正在读取文件清单...");
    let rootfile = containerParsed.getElementsByTagName("rootfile")[0];
    if (rootfile.getAttribute("media-type") == "application/oebps-package+xml" || confirm("该书的信息似乎不符合标准，继续吗？")) {
        //OEBPS/content.opf
        let itemPath = rootfile.getAttribute("full-path");
        console.log(basePath + itemPath);
        let opf = await (await fetch(basePath + itemPath)).blob();
        fileList.push({ file: opf, path: itemPath });
        let opfParsed = new DOMParser().parseFromString(await opf.text(), "text/xml");
        console.log(opfParsed);
        await sleep(100);
        SakiProgress.setPercent(5);
        SakiProgress.setText("正在索引文件...");
        let itemList = opfParsed.getElementsByTagName("item");
        let baseItemPath = basePath + itemPath.substring(0, itemPath.lastIndexOf("/")) + "/";
        let zipPath = itemPath.substring(0, itemPath.lastIndexOf("/")) + "/"
        for (let i = 0; itemList[i]; i++) {
            SakiProgress.setPercent(5 + i / itemList.length * 80);
            SakiProgress.setText("正在下载文件[" + i + "/" + itemList.length + "]...");
            let item = itemList[i];
            if (item.getAttribute("href")) {
                let itemBlob = await (await fetch(baseItemPath + item.getAttribute("href"),{
                    headers:{
                        "accept": "text/html, */*; q=0.01",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": location.href,
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                })).blob();
                let path = zipPath + item.getAttribute("href");
                fileList.push({ file: itemBlob, path: path });
                await sleep(500);
            }
        };
        console.log(fileList);
        SakiProgress.setPercent(85);
        SakiProgress.setText("正在生成文件结构...");
        let zip = new JSZip();
        fileList.forEach(file => zip.file(file.path, file.file, { binary: true }));
        await sleep(100);
        SakiProgress.setPercent(90);
        SakiProgress.setText("正在打包...");
        let zipFile = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });
        SakiProgress.setPercent(97);
        SakiProgress.setText("正在导出...");
        await sleep(2000);
        dlFile(URL.createObjectURL(zipFile), document.title + ".epub");
        SakiProgress.clearProgress();
        SakiProgress.setText("下载成功！");
        await sleep(3000);
        SakiProgress.hideDiv();
    } else {
        SakiProgress.clearProgress();
        SakiProgress.hideDiv();
        console.log("User Cancel.");
    }

})();