// ==UserScript==
// @name         爱学术网页下载器
// @namespace    https://qinlili.bid/
// @version      0.2
// @description  下载爱学术原始pdf
// @author       琴梨梨
// @match        https://www.iresearchbook.cn/f/cdf/read?*
// @icon         https://www.iresearchbook.cn/favicon.ico
// @grant        none
// @run-at        document-idle
// @license        WTFPL
// @downloadURL https://update.greasyfork.org/scripts/430935/%E7%88%B1%E5%AD%A6%E6%9C%AF%E7%BD%91%E9%A1%B5%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/430935/%E7%88%B1%E5%AD%A6%E6%9C%AF%E7%BD%91%E9%A1%B5%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自主开发的下载器公共组件
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
                this.pgDiv.style = "z-index:100000;position:fixed;background-color:white;min-height:32px;width:auto;height:32px;left:0px;right:0px;top:0px;box-shadow:0px 2px 2px 1px rgba(0, 0, 0, 0.5);transition:opacity 0.5s;display:none;";
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
    var XHRDL = {
        isLoaded: false,
        dlList: [],
        listBtn: false,
        listDiv: false,
        listBar: false,
        clsBtn: false,
        init: function () {
            if (!this.isLoaded) {
                console.info("WebXHRDL Initializing!\nVersion:Preview0.1.0\nQinlili Tech:Github@qinlili23333")
                try {
                    SakiProgress.init();
                } catch{
                    console.error("Initialize Failed!Is SakiProgress Loaded?")
                    return false;
                }
                this.isLoaded = true;
                this.listBtn = SakiProgress.addBtn("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMTguMzIsNC4yNkMxNi44NCwzLjA1LDE1LjAxLDIuMjUsMTMsMi4wNXYyLjAyYzEuNDYsMC4xOCwyLjc5LDAuNzYsMy45LDEuNjJMMTguMzIsNC4yNnogTTE5LjkzLDExaDIuMDIgYy0wLjItMi4wMS0xLTMuODQtMi4yMS01LjMyTDE4LjMxLDcuMUMxOS4xNyw4LjIxLDE5Ljc1LDkuNTQsMTkuOTMsMTF6IE0xOC4zMSwxNi45bDEuNDMsMS40M2MxLjIxLTEuNDgsMi4wMS0zLjMyLDIuMjEtNS4zMiBoLTIuMDJDMTkuNzUsMTQuNDYsMTkuMTcsMTUuNzksMTguMzEsMTYuOXogTTEzLDE5LjkzdjIuMDJjMi4wMS0wLjIsMy44NC0xLDUuMzItMi4yMWwtMS40My0xLjQzIEMxNS43OSwxOS4xNywxNC40NiwxOS43NSwxMywxOS45M3ogTTEzLDEyVjdoLTJ2NUg3bDUsNWw1LTVIMTN6IE0xMSwxOS45M3YyLjAyYy01LjA1LTAuNS05LTQuNzYtOS05Ljk1czMuOTUtOS40NSw5LTkuOTV2Mi4wMiBDNy4wNSw0LjU2LDQsNy45Miw0LDEyUzcuMDUsMTkuNDQsMTEsMTkuOTN6Ii8+PC9nPjwvZz48L3N2Zz4=");
                this.listBtn.onclick = XHRDL.showList;
                SakiProgress.showDiv();
                SakiProgress.setText("初始化下载器...");
                SakiProgress.setPercent(20);
                this.listDiv = document.createElement("div");
                this.listDiv.style = "z-index:9999;position:fixed;background-color:white;width:auto;margin-top:32px;height:100%;left:0px;right:0px;top:0px;transition:opacity 0.5s;display:none;";
                this.listDiv.style.opacity = 0;
                this.listBar = document.createElement("div");
                this.listBar.style = "z-index:10000;position:fixed;background-color:white;min-height:32px;margin-top:32px;width:auto;height:32px;left:0px;right:0px;top:0px;box-shadow:0px 2px 2px 1px rgba(0, 0, 0, 0.5);";
                this.listDiv.appendChild(this.listBar);
                document.body.appendChild(this.listDiv);
                var btn = document.createElement("img");
                btn.style = "display: inline-block;right:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;"
                btn.className = "barBtn"
                btn.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMiwzLjQxbC01LjI5LDUuMjlMMjAsMTJoLThWNGwzLjI5LDMuMjlMMjAuNTksMkwyMiwzLjQxeiBNMy40MSwyMmw1LjI5LTUuMjlMMTIsMjB2LThINGwzLjI5LDMuMjlMMiwyMC41OUwzLjQxLDIyeiIvPjwvc3ZnPg==";
                this.listBar.appendChild(btn);
                btn.onclick = function () {
                    XHRDL.hideList();
                }
                this.clsBtn = btn;
                SakiProgress.setPercent(100);
                SakiProgress.setText("下载器已加载！");
                setTimeout(function () { SakiProgress.clearProgress(); SakiProgress.hideDiv(); }, 1000);
                console.info("WebXHRDL Initialized!");
            } else {
                console.error("Multi Instance Error-WebXHRDL Already Loaded!")
            }
        },
        destroy: function (saki) {
            if (this.isLoaded) {
                if (saki) {
                    SakiProgress.destroy();
                }
                this.isLoaded = false;
                this.dlList = [];
                this.listBtn = false;
                this.listDiv = false;
                this.listBar = false;
                this.clsBtn = false;
                console.info("WebXHRDL Destroyed!You Can Reload Later!");
            }
        },
        showList: function () {
            if (XHRDL.isLoaded) {
                XHRDL.listDiv.style.display = "";
                setTimeout(function () { XHRDL.listDiv.style.opacity = 1; }, 10);
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        hideList: function () {
            if (XHRDL.isLoaded) {
                XHRDL.listDiv.style.opacity = 0;
                setTimeout(function () { XHRDL.listDiv.style.display = "none"; }, 500);
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        saveTaskList: function () {
            if (XHRDL.isLoaded) {
                var storage = window.localStorage;
                storage.setItem("XHRDL_List", JSON.stringify(this.dlList));
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        loadTaskList: function () {
            if (XHRDL.isLoaded) {
                var storage = window.localStorage;
                this.dlList = JSON.parse(storage.getItem("XHRDL_List"));
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        newTask: function (url, name) {
            if (this.isLoaded) {
                var list = this.dlList;
                list[list.length] = {
                    taskUrl: url,
                    fileName: name
                }
                SakiProgress.showDiv();
                SakiProgress.setText("已添加新任务：" + name);
                if (!this.DLEngine.isWorking) {
                    this.DLEngine.start();
                }
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        DLEngine: {
            isWorking: false,
            start: function () {
                if (!this.isWorking) {
                    console.info("Start WebXHRDL Engine...\nChecking Tasks...");
                    this.isWorking = true;
                    SakiProgress.showDiv();
                    this.dlFirstFile();
                } else {
                    console.error("WebXHRDL Engine Already Started!");
                }
            },
            stop: function () {
                this.isWorking = false;
                SakiProgress.hideDiv();
                SakiProgress.setText("");
                if (XHRDL.dlList[0]) {
                    console.info("All Tasks Done!WebXHRDL Engine Stopped!");
                } else {
                    console.info("WebXHRDL Engine Stopped!Tasks Paused!");
                }
            },
            dlFirstFile: function () {
                var taskInfo = XHRDL.dlList[0];
                SakiProgress.showDiv();
                SakiProgress.setPercent(0);
                SakiProgress.setText("正在下载" + taskInfo.fileName);
                var xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onprogress = event => {
                    if (event.loaded && event.total) {
                        var percent = String(Number(event.loaded) / Number(event.total) * 100).substring(0, 4);
                        SakiProgress.setText(taskInfo.fileName + "已下载" + percent + "%");
                        SakiProgress.setPercent(percent)
                    }
                };
                xhr.onload = event => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var bloburl = URL.createObjectURL(xhr.response);
                            SakiProgress.setText("正在写出" + taskInfo.fileName);
                            var a = document.createElement('a');
                            var filename = taskInfo.fileName;
                            a.href = bloburl;
                            a.download = filename;
                            a.click();
                            window.URL.revokeObjectURL(bloburl);
                            SakiProgress.clearProgress();
                            XHRDL.dlList.splice(0, 1);
                            XHRDL.DLEngine.checkNext();
                        } else {
                            //TODO:支持更多特殊状态处理
                            SakiProgress.setTextAlert(taskInfo.fileName + "暂不支持下载，跳过");
                            XHRDL.dlList.splice(0, 1);
                            XHRDL.DLEngine.checkNext();
                        }
                    }
                }
                xhr.onerror = function (e) {
                    //TODO:支持处理不同类别出错
                    if(!taskInfo.errorRetry){
                        SakiProgress.setTextAlert(taskInfo.fileName + "下载失败，置入列尾等待重试");
                        taskInfo.errorRetry = true;
                        var list = XHRDL.dlList;
                        list[list.length] = taskInfo;
                    }else{
                        SakiProgress.setTextAlert(taskInfo.fileName + "下载又失败了，放弃");
                    }
                    XHRDL.dlList.splice(0, 1);
                    XHRDL.DLEngine.checkNext();
                }
                xhr.open('GET', taskInfo.taskUrl)
                xhr.send()
            },
            checkNext: function () {
                if (XHRDL.dlList[0]) {
                    this.dlFirstFile();
                } else {
                    this.stop();
                }
            }
        }
    }
    XHRDL.init();
    if(typeof EPUBJS !== 'undefined'){
        //EPUB
        var dlBtn=document.getElementById("title-seperator");
        dlBtn.innerText="点我下载";
        dlBtn.onclick=function(){
            var dlUrl="https://www.iresearchbook.cn/resource/" + pathArray[2]
            var flName=document.title.substr(0,document.title.indexOf(" –"))+".epub";
            XHRDL.newTask(dlUrl,flName);
        }
    }else{
        //PDF
        //召唤下载按钮
        var dlBtn=document.getElementById("download");
        dlBtn.style="";
        dlBtn.onclick=function(){
            var dlUrl=window.location.origin+DEFAULT_URL;
            var flName=document.title.substr(0,document.title.indexOf(" -"))+".pdf";
            XHRDL.newTask(dlUrl,flName);
        }
    }
})();