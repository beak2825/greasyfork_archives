// ==UserScript==
// @name         民国图书下载器
// @namespace    https://qinlili.bid
// @version      0.1
// @description  使用前请务必断开v2ray
// @author       琴梨梨
// @match        *://*/*/library/publish/default/BookPicTxtReader.jsp?*
// @icon         http://mg.nlcpress.com/library/e5image/workspace/favicon.ico
// @require      https://lib.baomitu.com/jszip/3.10.0/jszip.min.js#sha512-xcHCGC5tQ0SHlRX8Anbz6oy/OullASJkEhb4gjkneVpGE3/QGYejf14CUO5n5q5paiHfRFTa9HKgByxzidw2Bw==
// @grant        none
// @license      MPLv2
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445755/%E6%B0%91%E5%9B%BD%E5%9B%BE%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/445755/%E6%B0%91%E5%9B%BD%E5%9B%BE%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //==========================================
    //          项目代号:PROPRANOLOL
    //                版本:0.1
    //               琴梨梨 2022
    //           DEVELOPED IN VSCODE
    //     已添加内建依赖:SakiProgress 1.0.4
    //        已添加外部依赖:jsZip 3.10.0
    //            本项目完全免费开源
    //==========================================
    //   推荐使用ctfile.qinlili.bid解析城通网盘
    //   推荐使用t.qinlili.bid/caj云转换CAJ文件
    //       推荐b站关注:帅比笙歌超可爱OvO
    //==========================================
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
    console.log(`==========================================
          项目代号:PROPRANOLOL
                版本:0.1
               琴梨梨 2022
           DEVELOPED IN VSCODE
     已添加内建依赖:SakiProgress 1.0.4
        已添加外部依赖:jsZip 3.10.0
            本项目完全免费开源
==========================================
   推荐使用ctfile.qinlili.bid解析城通网盘
   推荐使用t.qinlili.bid/caj云转换CAJ文件
       推荐b站关注:帅比笙歌超可爱OvO
==========================================`);
    SakiProgress.init();
    const totalPage=parseInt(document.querySelector("#percent2 > p > span").innerText);
    let currentPage=1;
    const dlBtn=document.querySelector("body > div.container.wrapper > div.reader-container > div.reader-right-nav > div.oper-nav > ul > li:nth-child(6) > a");
    console.log(dlBtn);
    dlBtn.removeAttribute("onclick");
    dlBtn.addEventListener("click",async ()=>{
        let zip = new JSZip();
        SakiProgress.showDiv();
        for(;currentPage<=totalPage;currentPage++){
            SakiProgress.setPercent(currentPage/totalPage*80);
            SakiProgress.setText("正在下载第"+currentPage+"页");
            let data=await (await fetch("BookPage.do?optype=getPagePicTxt&bookLibID="+bookLibID+"&bookID="+bookID+"&pageNum="+currentPage+"&mediaType="+mediaType,{method:"POST"})).json();
            console.log(data);
            zip.file(currentPage+ ".jpg", await (await fetch(data.url).catch(()=>{currentPage--})).blob().catch(()=>{currentPage--}), { binary: true });
        };
        SakiProgress.setPercent(80);
        SakiProgress.setText("正在打包");
        let zipFile=await zip.generateAsync({ type: "blob",
                                             compression: "DEFLATE",
                                             compressionOptions: {
                                                 level: 9
                                             } });
        dlFile(URL.createObjectURL(zipFile),document.querySelector("body > div.container.wrapper > div.reader-container > div.reader-right-nav > div.book-info-box2 > div > p:nth-child(2)").innerText.substring(3)+".zip");
        SakiProgress.clearProgress();
        SakiProgress.hideDiv();
    })



})();
