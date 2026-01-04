// ==UserScript==
// @name         学习强国梨酱小帮手
// @namespace    https://qinlili.bid/
// @version      1.1.8
// @description  页面内登录/搜索+视频/音频/电子书一键批量下载+拦截Log请求+电子书去水印
// @author       琴梨梨
// @match        *://www.xuexi.cn/*
// @match        *://boot-source.xuexi.cn/newmoocdown?*
// @match        *://boot-source.xuexi.cn/audiodown?*
// @match        *://preview-pdf.xuexi.cn/*
// @match        *://article.xuexi.cn/*
// @match        https://login.xuexi.cn/login/xuexiWeb?*
// @match        https://static.xuexi.cn/search/*
// @icon         https://www.xuexi.cn/favicon.ico
// @homepage     https://github.com/qinlili23333/XXQG-DL
// @supportURL   https://github.com/qinlili23333/XXQG-DL
// @grant        none
// @run-at       document-end
// @require      https://lib.baomitu.com/jspdf/2.5.1/jspdf.umd.min.js
// @license      Anti996License
// @downloadURL https://update.greasyfork.org/scripts/429991/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E6%A2%A8%E9%85%B1%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429991/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E6%A2%A8%E9%85%B1%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==


(async function () {
    'use strict';
    //既然连喜欢的人都没能力留住，那还是把更多时间投入到写代码吧--记于与悦悦子分手的7天之后（2022.1.11）
    //这些内容给本项目开发提供了帮助，感谢
    //https://stackoverflow.com/a/60644673
    //https://stackoverflow.com/a/55165133
    //也感谢每一位相信琴梨梨的用户

    //真的有人会看琴梨梨写的注释吗？在看的话MUA你一下~

    //是否开启跨源服务器
    //开启跨源服务器可以下载部分本来会出错的电子书
    //请访问此地址获取跨源服务器https://github.com/Rob--W/cors-anywhere
    //Clone到本地后运行npm install，然后运行node server.js，即可运行在默认地址和端口上
    var corsServer = "http://localhost:8080/";
    if (document.location.host == "preview-pdf.xuexi.cn" && (document.location.search.indexOf("boot-video.xuexi.cn") > 1) && (window.self === window.top) && confirm("该地址可能需要跨源服务器下载。启用跨源服务器吗？请在确认跨源服务器已启动之后点击确定。\n不知道跨源服务器是什么的话打开脚本源码看注释")) {
        var valueProp = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
        Object.defineProperty(Image.prototype, 'src', {
            set: function(newimgValue){
                if (!newimgValue.startsWith("data:")) {
                    newimgValue = corsServer + newimgValue;
                }
                this.crossOrigin = "anonymous"
                valueProp.set.call(this, newimgValue);
            }
        });
    }
    //iframe页面处理
    if (!(window.self === window.top)) {
        var transparentStyle = "background:none transparent !important;";
        document.documentElement.style = transparentStyle;
        document.body.style = transparentStyle;
        if (document.location.href.indexOf("login.xuexi.cn/login/xuexiWeb?") > 1) {
            document.getElementsByClassName("login_content")[0].style.background = "none"
        };
        if (document.location.href.indexOf("static.xuexi.cn/search/online/index.html") > 1) {
            document.getElementById("root").style.background = transparentStyle;
            if ((window.self.innerWidth > window.self.innerHeight) && window.self.innerWidth > 1000) {
                document.getElementsByClassName("search-content")[0].style = "padding-left:20px;padding-right:20px;"
            }
        };
    }
    //干掉日志
    (open=> {
        XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            if (!(async === false)) {
                async = true;
            };
            if (url.startsWith("https://iflow-api.xuexi.cn/logflow/api/v1/pclog") || url.startsWith("https://arms-retcode.aliyuncs.com/r.png")) {
                console.log("Rejected Log XHR! " + url + " -Qinlili")
                url = "data:text,null"
            }
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);
    var originFetch = fetch;
    window.fetch = (url, options) => {
        if (url.startsWith("https://iflow-api.xuexi.cn/logflow/api/v1/pclog") || url.startsWith("https://arms-retcode.aliyuncs.com/r.png")) {
            console.log("Rejected Log Fetch! " + url + " -Qinlili")
            url = "data:text,null"
        }
        return originFetch(url, options);
    }
    //干掉PDF水印
    if (document.location.host == "preview-pdf.xuexi.cn") {
        CanvasRenderingContext2D.prototype.fillText = () => { }
    }
    //共享库
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
    const XHRDL = {
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
                } catch {
                    console.error("Initialize Failed!Is SakiProgress Loaded?")
                    return false;
                }
                this.isLoaded = true;
                //this.listBtn = SakiProgress.addBtn("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMTguMzIsNC4yNkMxNi44NCwzLjA1LDE1LjAxLDIuMjUsMTMsMi4wNXYyLjAyYzEuNDYsMC4xOCwyLjc5LDAuNzYsMy45LDEuNjJMMTguMzIsNC4yNnogTTE5LjkzLDExaDIuMDIgYy0wLjItMi4wMS0xLTMuODQtMi4yMS01LjMyTDE4LjMxLDcuMUMxOS4xNyw4LjIxLDE5Ljc1LDkuNTQsMTkuOTMsMTF6IE0xOC4zMSwxNi45bDEuNDMsMS40M2MxLjIxLTEuNDgsMi4wMS0zLjMyLDIuMjEtNS4zMiBoLTIuMDJDMTkuNzUsMTQuNDYsMTkuMTcsMTUuNzksMTguMzEsMTYuOXogTTEzLDE5LjkzdjIuMDJjMi4wMS0wLjIsMy44NC0xLDUuMzItMi4yMWwtMS40My0xLjQzIEMxNS43OSwxOS4xNywxNC40NiwxOS43NSwxMywxOS45M3ogTTEzLDEyVjdoLTJ2NUg3bDUsNWw1LTVIMTN6IE0xMSwxOS45M3YyLjAyYy01LjA1LTAuNS05LTQuNzYtOS05Ljk1czMuOTUtOS40NSw5LTkuOTV2Mi4wMiBDNy4wNSw0LjU2LDQsNy45Miw0LDEyUzcuMDUsMTkuNDQsMTEsMTkuOTN6Ii8+PC9nPjwvZz48L3N2Zz4=");
                //this.listBtn.onclick = XHRDL.showList;
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
                    if (!taskInfo.errorRetry) {
                        SakiProgress.setTextAlert(taskInfo.fileName + "下载失败，置入列尾等待重试");
                        taskInfo.errorRetry = true;
                        var list = XHRDL.dlList;
                        list[list.length] = taskInfo;
                    } else {
                        SakiProgress.setTextAlert(taskInfo.fileName + "下载又失败了，放弃");
                    }
                    XHRDL.dlList.splice(0, 1);
                    XHRDL.DLEngine.checkNext();
                }
                xhr.open('GET', taskInfo.taskUrl, true)
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


    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
    const openFrame=url=>{
        var searchFrame = document.createElement("iframe");
        searchFrame.frameBorder = 0;
        searchFrame.style = "padding:100%;z-index:9999;position:fixed;backdrop-filter: blur(10px) brightness(100%);background-color: rgba(255, 255, 255, .6);width:100%;margin-top:0px;height:100%;left:0px;right:0px;top:0px;";
        document.body.appendChild(searchFrame);
        searchFrame.src = url;
        var clsBtn = document.createElement("img");
        clsBtn.style = "z-index:10000;position:fixed;display: inline-block;right:0px;top:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;"
        clsBtn.className = "barBtn"
        clsBtn.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMiwzLjQxbC01LjI5LDUuMjlMMjAsMTJoLThWNGwzLjI5LDMuMjlMMjAuNTksMkwyMiwzLjQxeiBNMy40MSwyMmw1LjI5LTUuMjlMMTIsMjB2LThINGwzLjI5LDMuMjlMMiwyMC41OUwzLjQxLDIyeiIvPjwvc3ZnPg==";
        document.body.appendChild(clsBtn);
        searchFrame.addEventListener("load", async () => { await sleep(150); searchFrame.style.padding = "0px"; });
        clsBtn.onclick = () => {
            document.body.removeChild(searchFrame);
            document.body.removeChild(clsBtn);
        }
    };
    //主站检测
    if (document.location.host == "www.xuexi.cn" || document.location.host == "preview-pdf.xuexi.cn") {
        console.log("JS Loaded,Sleep 3 Sec-Qinlili");
        await sleep(3000)
        if (window.self === window.top) {
            //初始化下载工具条
            XHRDL.init();
            var dlPannel = document.createElement("div");
            var downloadBtn = document.createElement("button");
            downloadBtn.innerText = "下载本页内容";
            downloadBtn.style.display = "inline-block";
            dlPannel.appendChild(downloadBtn);
            var dlText = document.createElement("p");
            dlText.style.display = "inline-block";
            dlText.innerText = "等待检测页面类型";
            dlPannel.appendChild(dlText);
            var first = document.body.firstChild;
            document.body.insertBefore(dlPannel, first);
            //接管搜索
            if (document.getElementsByClassName("icon search-icon")[0]) {
                var scBtn = document.getElementsByClassName("icon search-icon")[0];
                var scPrt = scBtn.parentElement;
                scPrt.removeChild(scBtn);
                scBtn = document.createElement("a");
                scBtn.className = "icon search-icon";
                scPrt.appendChild(scBtn);
                scBtn.addEventListener("click", async e => {
                    var searchFrame = document.createElement("iframe");
                    searchFrame.frameBorder = 0;
                    searchFrame.style = "padding:100%;z-index:9999;position:fixed;backdrop-filter: blur(10px) brightness(100%);background-color: rgba(255, 255, 255, .6);width:100%;margin-top:0px;height:100%;left:0px;right:0px;top:0px;";
                    document.body.appendChild(searchFrame);
                    searchFrame.src = "https://static.xuexi.cn/search/online/index.html";
                    var clsBtn = document.createElement("img");
                    clsBtn.style = "z-index:10000;position:fixed;display: inline-block;right:0px;top:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;"
                    clsBtn.className = "barBtn"
                    clsBtn.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMiwzLjQxbC01LjI5LDUuMjlMMjAsMTJoLThWNGwzLjI5LDMuMjlMMjAuNTksMkwyMiwzLjQxeiBNMy40MSwyMmw1LjI5LTUuMjlMMTIsMjB2LThINGwzLjI5LDMuMjlMMiwyMC41OUwzLjQxLDIyeiIvPjwvc3ZnPg==";
                    document.body.appendChild(clsBtn);
                    searchFrame.addEventListener("load", async () => { await sleep(150); searchFrame.style.padding = "0px"; });
                    clsBtn.onclick = () => {
                        document.body.removeChild(searchFrame);
                        document.body.removeChild(clsBtn);
                        window.removeEventListener("message", msg, false);
                    }
                    function msg(e) {
                        //抄的官方JS改出来的，我对于这种非要传值到上层窗口的做法完全无法理解，但既然能跑，管他呢
                        console.log('e:', e)
                        console.log('e.data:', e.data)
                        try {
                            var params = JSON.parse(e.data);
                            if (params.type) {
                                console.log('params.type:', params.type);
                                console.log('params.data:', params.data);
                                switch (params.type) {
                                    case 'search':
                                        var useQuestionMark = false;
                                        var targetUrl = 'https://static.xuexi.cn/search/online/index.html'
                                        for (var key in params.data) {
                                            var value = params.data[key];
                                            var op = '&'
                                            if (!useQuestionMark) {
                                                op = '?';
                                                useQuestionMark = true;
                                            }
                                            targetUrl += op + key + '=' + value;
                                        }
                                        searchFrame.style.padding = "100%";
                                        searchFrame.src = targetUrl;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    window.addEventListener("message", msg, false);
                })
            }
            //接管登录
            if (document.getElementsByClassName("icon login-icon")[0]) {
                var dlBtn = document.getElementsByClassName("icon login-icon")[0];
                var dlPrt = dlBtn.parentElement;
                dlPrt.removeChild(dlBtn);
                dlBtn = document.createElement("a");
                dlBtn.className = "icon login-icon";
                dlPrt.appendChild(dlBtn);
                dlBtn.addEventListener("click", async e => {
                    e.preventDefault();
                    SakiProgress.showDiv();
                    SakiProgress.setPercent(5);
                    SakiProgress.setText("正在准备登录...")
                    console.log("Login Hooked!-Qinlili");
                    var closeBtn = SakiProgress.addBtn("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4cHgiIGZpbGw9IiMwMDAwMDAiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMiwzLjQxbC01LjI5LDUuMjlMMjAsMTJoLThWNGwzLjI5LDMuMjlMMjAuNTksMkwyMiwzLjQxeiBNMy40MSwyMmw1LjI5LTUuMjlMMTIsMjB2LThINGwzLjI5LDMuMjlMMiwyMC41OUwzLjQxLDIyeiIvPjwvc3ZnPg==")
                    var loginFrame = document.createElement("iframe");
                    loginFrame.frameBorder = 0;
                    loginFrame.scrolling = "no";
                    loginFrame.style = "padding:100%;z-index:9999;position:fixed;backdrop-filter: blur(10px) brightness(100%);background-color: rgba(255, 255, 255, .6);width:100%;margin-top:32px;height:100%;left:0px;right:0px;top:0px;";
                    document.body.appendChild(loginFrame);
                    loginFrame.addEventListener("load", async function () { await sleep(250); loginFrame.style.padding = "0px"; });
                    var refreshBtn = SakiProgress.addBtn("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iNDhweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNy42NSA2LjM1QzE2LjIgNC45IDE0LjIxIDQgMTIgNGMtNC40MiAwLTcuOTkgMy41OC03Ljk5IDhzMy41NyA4IDcuOTkgOGMzLjczIDAgNi44NC0yLjU1IDcuNzMtNmgtMi4wOGMtLjgyIDIuMzMtMy4wNCA0LTUuNjUgNC0zLjMxIDAtNi0yLjY5LTYtNnMyLjY5LTYgNi02YzEuNjYgMCAzLjE0LjY5IDQuMjIgMS43OEwxMyAxMWg3VjRsLTIuMzUgMi4zNXoiLz48L3N2Zz4=")
                    refreshBtn.onclick = () => {
                        scanLogin();
                    }
                    closeBtn.onclick = () => {
                        document.body.removeChild(loginFrame);
                        SakiProgress.removeBtn(closeBtn);
                        SakiProgress.removeBtn(refreshBtn);
                        closeBtn = false;
                        SakiProgress.clearProgress();
                        SakiProgress.hideDiv();
                    }
                    async function scanLogin() {
                        await sleep(100);
                        SakiProgress.setPercent(10);
                        SakiProgress.setText("正在获取登录口令...");
                        let token;
                        let tokenText;
                        try {
                            token = await fetch("https://pc-api.xuexi.cn/open/api/sns/sign")
                            tokenText = JSON.parse(await token.text())
                        } catch (e) {
                            SakiProgress.setPercent(100);
                            SakiProgress.setText("出错了：网络连接中断！ " + e.message);
                            return;
                        }
                        if (tokenText.code = "200") {
                            token = tokenText.data.sign;
                            SakiProgress.setPercent(40);
                            SakiProgress.setText("口令获取成功，加载登录页面...");
                            loginFrame.onload = () => {
                                SakiProgress.setPercent(65);
                                SakiProgress.setText("等待扫码...");
                            }
                            loginFrame.style.padding = "100%";
                            loginFrame.src = "https://login.xuexi.cn/login/xuexiWeb?appid=dingoankubyrfkttorhpou&goto=https%3A%2F%2Foa.xuexi.cn&type=1&state=" + token + "&check_login=https%3A%2F%2Fpc-api.xuexi.cn"
                            window.addEventListener("message", event => {
                                event.preventDefault();
                                console.log(event);
                                if (event.data.success == true) {
                                    SakiProgress.setPercent(100);
                                    SakiProgress.setText("登录成功，正在刷新页面...");
                                    document.location.reload();
                                } else {
                                    SakiProgress.setPercent(100);
                                    SakiProgress.setText("出错了：扫码登录失败，错误码为" + event.data.errorCode);
                                }
                            }, false);
                        } else {
                            SakiProgress.setPercent(100);
                            SakiProgress.setText("出错了：获取口令失败！");
                        }
                    }
                    scanLogin();
                })
            }
            //检测爬取页面类型
            console.log("Detecting Page " + document.location.pathname + "-Qinlili");
            var detected = false;
            //旧慕课列表
            if ((document.body.innerText.indexOf("课程介绍") >= 1) || (document.body.innerText.indexOf("课程详情") >= 1)) {
                console.log("Old Mooc List Detected " + document.location.pathname + "-Qinlili");
                detected = true;
                dlText.innerText = "页面类型:旧慕课列表，支持全部批量下载，请开启网站自动下载权限";
                downloadBtn.onclick = () => {
                    OldMoocListDL();
                }
            }
            //页面有播放器
            if (window.Aliplayer) {
                //旧慕课、电视剧播放单页
                if (document.getElementsByClassName("radio-inline")[0]) {
                    console.log("Old Video Player Detected " + document.location.pathname + "-Qinlili");
                    detected = true;
                    dlText.innerText = "页面类型:旧视频播放单页，支持全部批量下载，请开启网站自动下载权限";
                    downloadBtn.onclick = () => {
                        OldMoocVideoDL();
                    }
                }
                //新慕课、影视总页
                if (document.getElementsByClassName("video-article-content")[0] || document.getElementsByClassName("videoSet-article-wrap")[0]) {
                    console.log("New Video Player Detected " + document.location.pathname + "-Qinlili");
                    detected = true;
                    dlText.innerText = "页面类型:新视频总，支持全部批量下载最高清晰度，需要打开新标签页下载";
                    downloadBtn.onclick = () => {
                        NewMoocPageDL();
                    }
                }
            }
            //音频专题
            if (document.getElementsByClassName("album-play-btn")[0]) {
                console.log("Audio Detected " + document.location.pathname + "-Qinlili");
                detected = true;
                dlText.innerText = "页面类型:音频，支持全部批量下载，需要打开新标签页下载";
                downloadBtn.onclick = () => {
                    AudioDL();
                }
            }
            //页面上就一个音频
            //解锁音频播放器下载按钮
            if (document.getElementsByTagName("audio").length) {
                detected = true;
                dlText.innerText = "页面类型:单个音频，已经解锁播放器下载能力，点击播放器右侧菜单下载";
                downloadBtn.style.display = "none";
                for (var la = 0; document.getElementsByTagName("audio")[la]; la++) {
                    document.getElementsByTagName("audio")[la].removeAttribute("controlslist");
                }
            }
            //电子书下载
            if (document.location.host == "preview-pdf.xuexi.cn") {
                detected = true;
                dlText.innerText = "页面类型:电子书，支持打包下载";
                downloadBtn.onclick = () => {
                    PDFDL();
                }
            }
            if (!detected) {
                console.log("Unsupported Page " + document.location.pathname + "-Qinlili");
                dlText.innerText = "本页面不支持下载";
                downloadBtn.innerText = "暂不支持";
            }

            //下载器部分
            //旧慕课列表
            function OldMoocListDL() {
                //读取全部视频列表
                var videoList = globalCache[Object.keys(globalCache)[0]];
                console.log("Found " + videoList.length + " Videos-Qinlili")
                for (var i = 0; videoList[i]; i++) {
                    console.log("Try Analysis " + i + " Video-Qinlili")
                    getInfoAndDL(pagetoinfourl(videoList[i].static_page_url));
                }

            }
            //旧慕课播放单页
            function OldMoocVideoDL() {
                console.log("Analysis Page Info-Qinlili")
                getInfoAndDL(pagetoinfourl(document.location.href))
            }
            function NewMoocPageDL() {
                console.log("Open DL Page-Qinlili");
                var searchParams = new URLSearchParams(document.location.search);
                var dlurl = "https://boot-source.xuexi.cn/newmoocdown?id=" + searchParams.get("id");
                openFrame(dlurl);
            }
            function AudioDL() {
                console.log("Open DL Page-Qinlili");
                var searchParams = new URLSearchParams(document.location.search);
                var dlurl = "https://boot-source.xuexi.cn/audiodown?id=" + searchParams.get("id");
                openFrame(dlurl);
            }
            async function PDFDL() {
                //webp压缩用处和顶碗人一样大，所以换成灰度压缩
                let enableGreyCompress = confirm("是否启用灰度压缩？\n适合保存以黑白文本内容的书籍或用于Kindle等墨水屏阅读，可大幅削减文件体积，需额外消耗压缩时间。\n根据琴梨梨自己的测试可削减大约44%大小，可用于解决Chrome无法爬512M以上书的问题。")
                let lowQuality = confirm("是否启用低质量模式？\n轻微降低画质换取显著的文件缩小");
                SakiProgress.showDiv();
                SakiProgress.setText("正在加载依赖...");
                await sleep(100)
                console.log("Preparing jsPDF Library...-Qinlili");
                var jsPDF = jspdf.jsPDF;
                try {
                    console.log(jsPDF)
                    console.log("jsPDF Ready!")
                } catch {
                    console.error("jsPDF Not Ready!")
                    alert("jsPDF加载失败，请检查网络并尝试重新安装脚本！")
                }
                SakiProgress.setText("正在调整尺寸...");
                SakiProgress.setPercent(2);
                await sleep(100)
                if(confirm("是否开启高清模式？请观察原书清晰度，若原书清晰度较高建议开启。\n对超过300页的书开启可能导致无法生成文件。")){
                    //按钮循环点击得稍微延迟一点否则可能卡死
                    //放大到最大保障清晰度
                    for (; document.getElementsByClassName("ctrl-icon")[0].className.animVal.indexOf("disabled") < 0;) {
                        document.getElementsByClassName("ctrl-icon")[0].parentElement.click()
                        await sleep(50)
                    }
                }
                SakiProgress.setText("正在回到第一页...");
                SakiProgress.setPercent(4);
                await sleep(100)
                //回到第一页
                for (; document.getElementsByClassName("ctrl-icon")[2].className.animVal.indexOf("disabled") < 0;) {
                    document.getElementsByClassName("ctrl-icon")[2].parentElement.click()
                    await sleep(50)
                }
                //创建文件
                SakiProgress.setText("正在创建文件...");
                SakiProgress.setPercent(6);
                await sleep(100)
                var samplePage = document.getElementsByTagName("canvas")[0]
                var ori;
                let wP = samplePage.width;
                let hP = samplePage.height;
                if (wP > hP) { ori = "l" } else { ori = "p" }
                var PDFfile = new jsPDF({
                    orientation: ori,
                    unit: 'px',
                    format: [wP, hP],
                    putOnlyUsedFonts: true,
                });
                console.log("Preparing PDF File...-Qinlili");
                console.log(PDFfile);
                //监听函数
                SakiProgress.setText("正在设置监听函数...");
                SakiProgress.setPercent(8);
                await sleep(100)
                var onPageChange = function () { };
                var val = document.getElementsByTagName("input")[0];
                function waitPageChange() {
                    return new Promise(resolve => {
                        onPageChange = () => {
                            resolve();
                        }
                    });
                }
                //加载完成后页码显示才会变化，监听页码显示来等待加载
                Object.defineProperty(val, 'value', {
                    set: newValue => {
                        var valueProp = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
                        valueProp.set.call(val, newValue);
                        onPageChange();
                    }
                });
                //循环保存
                var page = 1;
                var totalPage = parseInt(document.getElementsByClassName("total")[0].innerText.substr(1));
                const saveCurrent=()=>{
                    //不管有几页，把当前全部canvas保存再说
                    for (var i = 0; document.getElementsByTagName("canvas")[i]; i++) {
                        if (enableGreyCompress) {
                            //灰度压缩
                            let cnv = document.getElementsByTagName("canvas")[i];
                            let cnx = cnv.getContext('2d');
                            let width = cnv.width;
                            let height = cnv.height;
                            var imgPixels = cnx.getImageData(0, 0, width, height);
                            for (var y = 0; y < height; y++) {
                                for (var x = 0; x < width; x++) {
                                    let i = (y * 4) * width + x * 4;
                                    var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                                    imgPixels.data[i] = avg;
                                    imgPixels.data[i + 1] = avg;
                                    imgPixels.data[i + 2] = avg;
                                }
                            }
                            cnx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);

                        }
                        if(lowQuality){
                            PDFfile.addImage(document.getElementsByTagName("canvas")[i].toDataURL("image/webp",0.75),"WEBP",0,0,wP,hP,null,"SLOW");
                        }else{
                            PDFfile.addImage(document.getElementsByTagName("canvas")[i], "WEBP", 0, 0, wP, hP, null, "SLOW");
                        }
                        PDFfile.addPage();
                        page++
                        console.log("Saved One Page!-Qinlili");
                    }
                }
                for (; document.getElementsByClassName("ctrl-icon")[3].className.animVal.indexOf("disabled") < 0;) {
                    SakiProgress.setText("正在保存第" + page + "页...");
                    SakiProgress.setPercent(10 + 80 * (page / totalPage));
                    console.log("Work Current Page:" + page + "...-Qinlili");
                    await sleep(100)
                    saveCurrent();
                    //虽然不知道为什么加了延迟半秒就不会卡住，但既然能用管他为什么呢
                    setTimeout(() => { document.getElementsByClassName("ctrl-icon")[3].parentElement.click(); }, 500)
                    //显示的正在加载的页面可能比实际加载页面小一页，但估计1919810个用户里也没一个意识到，不影响保存效果这种细节就不管了，问就是爷懒的写
                    SakiProgress.setText("正在等待加载第" + (page + 1) + "页...");
                    console.log("Waiting For Loading...-Qinlili");
                    await waitPageChange();
                };
                saveCurrent();
                PDFfile.setFontSize(40);
                PDFfile.text('Powered By Qinlili',35, 65);
                PDFfile.textWithLink('https://greasyfork.org/zh-CN/scripts/429991',35, 25,{align: 'center', url: 'https://greasyfork.org/zh-CN/scripts/429991'});
                //生成文件导出
                SakiProgress.setText("正在导出文件...");
                SakiProgress.setPercent(90);
                PDFfile.save("学习强国电子书导出.pdf", { returnPromise: true }).then(finish => {
                    SakiProgress.clearProgress;
                    SakiProgress.hideDiv();
                });
            }
        } else {
            console.log("Iframe Page " + document.location.pathname + "\nSkip Detect-Qinlili");
        }
    }

    //全局共享函数
    //读取视频信息并下载
    function getInfoAndDL(infourl) {
        console.log("Get Video Info:" + infourl + "\n-Qinlili")
        var xhr = new XMLHttpRequest();
        xhr.onload = event => {
            console.log("Success Get Video Info:" + infourl + "\n-Qinlili")
            if (xhr.readyState === 4 && xhr.status === 200) {
                var videoInfo = JSON.parse(xhr.response.replace("globalCache = ", "").replace(";", ""));
                stringToObject(videoInfo);
                //判断慕课
                if (videoInfo[Object.keys(videoInfo)[0]].info) {
                    videoInfo = videoInfo[Object.keys(videoInfo)[0]].info;
                    for (var vi = 0; videoInfo.ossUrl[vi]; vi++) {
                        console.log("Video Name:" + videoInfo.frst_name + "-" + (vi + 1) + "\nChapter Name:" + videoInfo.mooc_class + "\nMooc Name:" + videoInfo.mooc + "\nVideo Url:" + videoInfo.ossUrl[vi] + "\n-Qinlili");
                        var filename = videoInfo.frst_name + "-" + (vi + 1) + "-" + videoInfo.mooc_class + "-" + videoInfo.mooc + ".mp4"
                        console.log("File Name:" + filename + "\nPrepare Download-Qinlili");
                        downloadFile(videoInfo.ossUrl[vi], filename);
                    }
                }
                //判断电视剧
                if (videoInfo[Object.keys(videoInfo)[0]].list) {
                    videoInfo = videoInfo[Object.keys(videoInfo)[0]].list;
                    for (var vii = 0; videoInfo[vii]; vii++) {
                        console.log("Video Name:" + videoInfo[vii].frst_name + "-" + (vi + 1) + "\nList Name:" + videoInfo[vii].title + "\nVideo Url:" + videoInfo[vii].ossUrl + "\n-Qinlili");
                        var filename2 = videoInfo[vii].frst_name + "-" + (vi + 1) + "-" + videoInfo[vii].title + ".mp4"
                        console.log("File Name:" + filename2 + "\nPrepare Download-Qinlili");
                        downloadFile(videoInfo[vii].ossUrl, filename2);
                    }
                }
            }
            xhr.onerror = () => {
                console.log("Fail Get Video Info:" + infourl + "\n-Qinlili")
            }
        }
        xhr.open('GET', infourl, false);
        xhr.send();

        //平整化Array工具，从学习强国本身的js里抄过来的，大概原理就是尝试把值作为json解析，解析成功就把解析结果替换回去，总之我大受震撼
        function stringToObject(params) {
            for (var key in params) {
                var value = params[key];
                if (isString(value)) {
                    try {
                        if (typeof JSON.parse(value) == 'object') {
                            params[key] = JSON.parse(value);
                        }
                    } catch (e) { }
                } else if (isArray(value)) {
                    try {
                        for (var index = 0; index < value.length; index++) {
                            stringToObject(value[index]);
                        }
                    } catch (e) { }
                } else if (isObject(value)) {
                    try {
                        stringToObject(params[key])
                    } catch (e) { }
                }
            }
        }

        function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }

        function isString(o) {
            return Object.prototype.toString.call(o) === '[object String]';
        }

        function isObject(o) {
            return Object.prototype.toString.call(o) === '[object Object]';
        }
    }

    //跳转避免跨域问题
    if (document.location.host == "article.xuexi.cn") {
        //检测是不是PDF页面，移动端分享文章也是这个域名，之前没发现
        var obj = document.getElementsByTagName("link");
        var isPDF = false;
        for (var pdfJS = 0; obj[pdfJS]; pdfJS++) {
            if (obj[pdfJS].href.indexOf("js/pdf") > 1) {
                isPDF = true;
            }
        }
        if (isPDF) {
            console.log("JS Loaded,Sleep 5 Sec-Qinlili");
            var tip = document.createElement("H1");
            tip.innerText = "即将跳转页面，请等待五秒";
            tip.style = "z-index:9999;position:fixed;backdrop-filter: blur(10px) brightness(100%);background-color: rgba(255, 255, 255, .6);width:100%;margin-top:0px;height:100%;left:0px;right:0px;top:0px;";
            document.body.appendChild(tip);
            await sleep(5000)
            document.location.href = document.getElementsByClassName("pdf-iframe")[0].src;
        }
    }


    //404注入页面避免cors
    if (document.location.host == "boot-source.xuexi.cn") {
        console.log("JS Domain Detected, Prepare Inject-Qinlili");
        document.querySelector("body").innerHTML = "<H2>本页面仅用于CORS注入，分享网址没有用，请允许下载多个文件</H2><H4 id=\"logcat\"></H4>"
        XHRDL.init();
        logcat("Initializing Downloader...");
        await sleep(3000)
        var searchParams = new URLSearchParams(document.location.search);
        var vid = searchParams.get("id");
        document.title = "下载：" + vid;
        logcat("Found ID:" + vid);
        logcat("Get Video Info:" + vid)
        var xhr = new XMLHttpRequest();
        xhr.onload = event => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                logcat("Success Get JSON Info:" + vid)
                var videoInfo = JSON.parse(xhr.response.replace("callback(", "").replace("})", "}"));
                console.log(videoInfo);
                logcat("List Name:" + videoInfo.normalized_title)
                logcat("List Origin:" + videoInfo.show_source)
                //文件名后缀
                var filenamesource = "-" + videoInfo.normalized_title + "-" + videoInfo.show_source;
                //视频下载模式
                if (document.location.pathname == "/newmoocdown") {
                    //检测是否为多视频
                    if (videoInfo.sub_items) {
                        logcat("Found " + videoInfo.sub_items.length + " Videos");
                        //循环解析并下载视频
                        for (var vi = 0; videoInfo.sub_items[vi]; vi++) {
                            logcat("Analysis Video " + (vi + 1));
                            //currentVideo，缩写为cV看起来清爽点
                            var cV = videoInfo.sub_items[vi];
                            var vName = cV.title;
                            logcat("Video Name:" + vName);
                            //检测多个清晰度
                            var vurl = getHighest(cV.videos[0].video_storage_info);
                            logcat("Video Url:" + vurl);
                            var fName = vName + filenamesource + ".mp4";
                            logcat("File Name:" + fName);
                            logcat("Call Downloader, Downloader Log Output In F12");
                            downloadFile(vurl, fName);
                        }
                    } else {
                        //单个视频
                        var singlevurl = getHighest(videoInfo.videos[0].video_storage_info);
                        logcat("Video Url:" + singlevurl);
                        vName = videoInfo.title;
                        var sfName = vName + filenamesource + ".mp4";
                        logcat("File Name:" + sfName);
                        logcat("Call Downloader, Downloader Log Output In F12");
                        downloadFile(singlevurl, sfName);
                    }
                }
                //音频下载模式
                if (document.location.pathname == "/audiodown") {
                    if (videoInfo.sub_items) {
                        logcat("Found " + videoInfo.sub_items.length + " Audios");
                        //循环解析并下载音频
                        for (var ai = 0; videoInfo.sub_items[ai]; ai++) {
                            logcat("Analysis Video " + (ai + 1));
                            //currentAudio，缩写为cA看起来清爽点
                            var cA = videoInfo.sub_items[ai];
                            var aName = cA.title;
                            logcat("Audio Name:" + aName);
                            //音频不区分清晰度
                            var aurl = cA.audios[0].audio_storage_info[0].url;
                            logcat("Audio Url:" + aurl);
                            var afName = aName + filenamesource + ".mp3";
                            logcat("File Name:" + fName);
                            logcat("Call Downloader, Downloader Log Output In F12");
                            downloadFile(aurl, afName);
                        }
                    }
                }
            }
        }
        xhr.onerror = () => {
            logcat("Fail Get Json Info:" + vid)
        }
        xhr.open('GET', "https://boot-source.xuexi.cn/data/app/" + vid + ".js?callback=callback&_st=" + Date.now());
        xhr.send();
        //打印日志方法，空页面就不用console.log了
        function logcat(text) {
            //获取时间参考https://www.jianshu.com/p/067469a4eed8，稍微整合了一下
            document.getElementById("logcat").innerText = new Date().toTimeString().substring(0, 8) + "  " + text + "\n" + document.getElementById("logcat").innerText;
        }
        //分析最高清晰度
        function getHighest(vObj) {
            var maxHeight = 1;
            var maxId = 0;
            for (var vii = 0; vObj[vii]; vii++) {
                if (!(vObj[vii].format == "m3u8")) {
                    if (vObj[vii].height > maxHeight) {
                        maxHeight = vObj[vii].height;
                        maxId = vii;
                    }
                }
            }
            logcat("Max Vide Height:" + maxHeight);
            return vObj[maxId].normal
        }
    }


    //地址转换函数
    function pagetoinfourl(pageurl) {
        var tempurl = pageurl.replace(".html", ".js");
        tempurl = insertStr(tempurl, tempurl.indexOf("/", 21) + 1, "data");
        return tempurl;
    }
    //插入
    function insertStr(soure, start, newStr) {
        return soure.slice(0, start) + newStr + soure.slice(start);
    }
    //下载
    function downloadFile(url, name) {
        XHRDL.newTask(url, name);
    }
}
)();
