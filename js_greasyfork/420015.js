// ==UserScript==
// @name         ApabiDownloader
// @namespace    https://qinlili.bid/
// @version      0.7
// @description  将最高清晰度的图片打包为PDF
// @author       琴梨梨
// @match        *://*/OnLineReader/Default.aspx?*
// @match        *://cebxol.apabi.com/*
// @match        *://cebxol.apabiedu.com/?metaid=*
// @icon        data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAABEkswAlNb8AJTS/AAEAxwADxckAHrB7ACEsMQAYIWcAH/A5AAiMEwAiM/0ADxQdAAaMEQAGihEAEya3ABsv+wAmeH8AITK9AAJEBwAUarsAERuhACc2fwAPny0ACo6QgBDXmkApeH8AKfg9AAkMDwAMFl0AEeGtABOmMwALD1cAHXB9AARG0QAQFh0AJLI3AAoUIQArun8AKTo/AAyRVwAnNr0AHvH9ACS1/QAHjFcAAQFNAAvPkwAf6m8AERkbABvl6wABAIkAA8YLACc5vwABwo1AAcKIQBMp+QABAMUAAsRLAA2SGwAbLr0AGS47AAEAiwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDwzMR8lPDw8PDw8PDw8Lzw8JjwGIzw8MTw8PDw8PBAzMSU3JRgxJSg8PDw8PDw8JiYaLiU1JSI8PDw8PDAzGzElLSUHJQ08FCk8PDw8CyUlJQksPBUqCikhPDw8PDwxFxIxPDw8AzE8PCw8PAwlJSUlGzw8CikFOjc8PDwrOTwxJTUBCCkEPBYTPDw8PDwnGSICHCk4OzI8PDw8PDwsGTQ8ETEPHDQ2ADw8PDw8PDw8PCA8HR48PDw8PDw8PDw8PDw6PCQOPDw8PDw8PDw8PDw8PDw8PDw8PDw8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @grant        none
// @run-at document-idle
// @require https://cdn.jsdelivr.net/npm/jspdf@2.4.0/dist/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/420015/ApabiDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/420015/ApabiDownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //TODO:页面过多时自动重新划分




    //公共库SakiProgress
    var SakiProgress = {
        isLoaded: false,
        progres: false,
        pgDiv: false,
        textSpan: false,
        first: false,
        alertMode: false,
        init: function (color) {
            if (!this.isLoaded) {
                this.isLoaded = true;
                console.info("SakiProgress Initializing!\nVersion:1.0.3\nQinlili Tech:Github@qinlili23333");
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
    }
    SakiProgress.init();
    console.log("Initializing Apabi Downloader...Engine:AvA PDF");
    var jsPDF=jspdf.jsPDF;
    try{
        console.log(jsPDF)
        console.log("jsPDF Ready!")
    }catch{
        console.error("jsPDF Not Ready!")
    }
    //解除右键
    document.body.oncontextmenu = ""
    var pageTotal = 0;
    var picUrl = ""
    var pageCurrent = 1;
    var donePage=0;
    var urlhost = "";
    var PDFfile=false;
    var imgList=[];
    var imgDataList=[];
    var imgEle=document.createElement("img");
    document.body.appendChild(imgEle);






    //Array多线程快速下载
    function downloadPicList(list,dataList) {
        for(var j=0;list[j];j++){
            toDataURL(list[j],j,function(data,page){
                dataList[page]=data;
                donePage++
                SakiProgress.setPercent(donePage/pageTotal*90)
                SakiProgress.setText("已下载"+donePage+"页...")
                if(donePage==pageTotal){
                    SakiProgress.setText("准备生成PDF...")
                    makePDF();
                }
            })
        }




        //读取图片
        function toDataURL(url,page, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange=()=>{
                if(xhr.readyState === 4 && xhr.status >300) {
                    console.log("错误，重试:"+url)
                    toDataURL(url,page,callback);
                }
            }
            xhr.onload = function() {
                var reader = new FileReader();
                reader.onloadend = function() {
                    callback(reader.result,page);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        }
    }



    //制作PDF
    function makePDF(){
        for(var k=0;imgDataList[k];k++){
            imgEle.src=imgDataList[k];
            PDFfile.addImage(imgDataList[k],"JPEG",0,0,imgEle.naturalWidth,imgEle.naturalHeight,"Page"+(k+1),"SLOW")
            PDFfile.addPage();
            SakiProgress.setText("已生成"+k+"页...")
        }
        SakiProgress.setText("正在制作PDF...")
        PDFfile.save("Apabi.pdf",{returnPromise:true}).then(finish => {
            SakiProgress.clearProgress;
            SakiProgress.hideDiv();
        });
    }
    //批量下载
    function batchDownload() {
        SakiProgress.showDiv()
        SakiProgress.setText("正在读取页面信息...")
        //最大化图片尺寸
        currentHeight = 4096;
        currentWidth = 4096;
        pageTotal = document.getElementById("TotalCount").innerText;
        console.log("Initializing image list...")
        if (document.location.host=="cebxol.apabi.com"||document.location.host=="cebxol.apabiedu.com"){
            urlhost="/"
        }else{
            urlhost="/OnLineReader/"
        }
        for(var i=1;i<=pageTotal;i++){
            imgList[i-1]=window.location.origin + urlhost + encodeURI(getUrl(i));
        }
        SakiProgress.setText("正在读取参数并建立PDF...")
        imgEle.onload=function(){
            var ori
            if(imgEle.naturalWidth>imgEle.naturalHeight){ori="l"}else{ori="p"}
            PDFfile=new jsPDF({
                orientation: ori,
                unit: 'px',
                format: [imgEle.naturalWidth,imgEle.naturalHeight],
                putOnlyUsedFonts:true,
            });
            SakiProgress.setText("正在准备下载页面...")
            downloadPicList(imgList,imgDataList)
        }
        imgEle.src=imgList[0]
    }

    //导出目录
    function indexDownload(){
    }

    //创建下载按钮
    document.querySelector("body > div.page > div.header").style.width="auto"
    var downloadBtn = document.createElement("a");
    downloadBtn.innerText = "下载全书";
    downloadBtn.onclick = function () { batchDownload() }
    document.querySelector("body > div.page > div.header > ul").appendChild(downloadBtn);
    var downloadIndexBtn = document.createElement("a");
    downloadIndexBtn.innerText = "下载目录";
    downloadIndexBtn.onclick = function () { indexDownload() }
    document.querySelector("body > div.page > div.header > ul").appendChild(downloadIndexBtn);

})();