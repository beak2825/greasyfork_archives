// ==UserScript==
// @name         雨课堂超级复制增强版
// @namespace    https:/qinlili.bid
// @version      0.2
// @description  复制图片内文字
// @author       琴梨梨
// @match        https://www.yuketang.cn/v/quiz/quiz_result/*
// @match        https://www.yuketang.cn/v/quiz/quiz_info/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// @grant        none
// @require https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/432035/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/432035/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
    var i=0;
    console.log(Tesseract);
    var picList
    function getList(){
        picList=document.querySelectorAll(".pptimg:not(.problembullet)");
        if(!picList.length){setTimeout(getList,1000)}else{
            SakiProgress.showDiv();
            recognize();
        }
    }
    getList();
    function recognize(){
        if(picList[i]){
            SakiProgress.setPercent(i/picList.length*100)
            SakiProgress.setText("正在识别第"+(i+1)+"张图片...")
            var div=picList[i];
            var url=div.getAttribute('data-background')
            if(!url){
                var str=div.style.backgroundImage;
                url=str.substr(str.indexOf("(")+2,str.indexOf(")")-6);
            }
            Tesseract.recognize(
                url,
                'chi_sim',
                { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                console.log(text.replace(/[ ]/g,"").replace(/[\r\n]/g,""))
                div.innerText=text.replace(/[ ]/g,"").replace(/[\r\n]/g,"")
                div.style.backgroundImage=""
                div.setAttribute('data-background',"")
                i++
                recognize();
            })
        }else{
            SakiProgress.setText("识别完成")
            SakiProgress.clearProgress()
            console.log("识别完成")
        }
    }

})();