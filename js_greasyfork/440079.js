// ==UserScript==
// @name         书加加梨酱小帮手
// @namespace    https://qinlili.bid/
// @version      1.4.2
// @description  全自动下载资源！
// @author       琴梨梨
// @connect      xdfsjj.com
// @match        https://dogwood.xdfsjj.com/pc/*
// @icon         https://dogwood.xdfsjj.com/qrcode/img/favicon.ico
// @run-at       document-idle
// @license      GPLv3
// @require      https://lib.baomitu.com/crypto-js/4.1.1/crypto-js.min.js#sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @require      https://lib.baomitu.com/m3u8-parser/4.7.0/m3u8-parser.min.js#sha512-k+LQLfQIGmuQTgjCfnE/iU3jdv+J9sdykVF5SgKtc+aMiKWPZqGjs60Bp3lug6rh9DVhcSZefpetyVXwUny48w==
// @require      https://lib.baomitu.com/mux.js/6.0.1/mux.min.js#sha512-d52/L8+HR/4zLHARiYRxpq70V2k+AaO8CO2zAcY5BFeZtqX16cQ/N3Eof/yMSwFwfY6blTL6GcENw2TiZJSJog==
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @homepage     https://github.com/qinlili23333/SJJHelper
// @supportURL   https://github.com/qinlili23333/SJJHelper
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/440079/%E4%B9%A6%E5%8A%A0%E5%8A%A0%E6%A2%A8%E9%85%B1%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440079/%E4%B9%A6%E5%8A%A0%E5%8A%A0%E6%A2%A8%E9%85%B1%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    //这里是配置区，你可以对脚本进行一些功能上的自定义
    const config={
        //文档下载格式，origin为下载最原始的文件，pdf为下载pdf格式的导出文件
        docFormat:localStorage.getItem("docFormat")||"origin",
        //m3u8视频下载格式，ts为Binary合并的文件，兼容好，体积大，mp4为使用mux.js混流后的文件，体积小，但和部分播放器有兼容问题
        m3u8Format:localStorage.getItem("m3u8Format")||"mp4"
    };
    GM_registerMenuCommand("文档格式："+config.docFormat, () => {
        localStorage.setItem("docFormat",(localStorage.getItem("docFormat")=="pdf")?"origin":"pdf");
        document.location.reload();
    });
    GM_registerMenuCommand("m3u8视频格式："+config.m3u8Format, () => {
        localStorage.setItem("m3u8Format",(localStorage.getItem("m3u8Format")=="ts")?"mp4":"ts");
        document.location.reload();
    });


    //尝试解锁
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            if(url.indexOf("userOrderService/isBuy.do")>0){
                url= "data:application/json;base64,eyJkYXRhIjp7InJlc3VsdCI6InRydWUifSwic3VjY2VzcyI6dHJ1ZX0=";
            }
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);


    if(!localStorage.getItem("first.qinlili")){
        alert(`你第一次启用梨酱小帮手！
本脚本包含复杂功能，建议打开脚本阅读顶端注释
建议根据脚本顶端注释对脚本功能进行一些配置以符合个人偏好
如果本脚本对你有帮助，请在GreasyFork给个好评或在Github给个星星
可以访问琴梨梨的小站qinlili.bid获取更多实用工具`)
        if(confirm(`你是否同意本脚本用户协议？
0.本脚本代码所有权归琴梨梨，请参阅GPLv3许可进行代码的二次使用，本项目使用了一些其他开源项目作为依赖，请同时注意这些项目的许可
1.本脚本用于出于合理的学习目的批量下载你已购的书籍或课程资源，请勿借助本脚本进行大规模资源抓取或其他可能消耗服务器资源的操作
2.书加加网站内一切内容版权均归网站持有者拥有，请合理使用本脚本下载的资源，分发或用于其他非个人学习欣赏用途可能会产生版权风险
3.本脚本不保证功能可用性，亦不保证对使用者的无害性，使用本脚本视为接受本脚本带来的一切损失由使用者承担`)&&confirm(`你是否同意本脚本隐私须知？
0.本脚本不收集任何信息
1.但如果你需要反馈，你可能需要提供浏览器版本等必要信息以便于琴梨梨排查`)){
            localStorage.setItem("first.qinlili",true)
        }else{
            console.log("用户拒绝了脚本加载")
            return false;
        }
    }

    //共享库
    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))
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
                this.progress.style = "position: absolute;top: 0;bottom: 0;left: 0;background-color: #F17C67;z-index: -1;width:0%;transition: width 0.25s ease-out,opacity 0.25s,background-color 1s;"
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
                console.info("WebXHRDL Initializing!\nVersion:Preview0.1.3\nQinlili Tech:Github@qinlili23333")
                try {
                    SakiProgress.init();
                } catch {
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
        newTask: function (url, name, start, showadd) {
            if (this.isLoaded) {
                var list = this.dlList;
                list[list.length] = {
                    taskUrl: url,
                    fileName: name
                }
                if (showadd) {
                    SakiProgress.showDiv();
                    SakiProgress.setText("已添加新任务：" + name);
                }
                if (!this.DLEngine.isWorking && start) {
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

    window.history.pushState=(a,b,c)=>{
        location.href=c;
    }
    //公共方法区
    //https://stackoverflow.com/questions/49129643/how-do-i-merge-an-array-of-uint8arrays
    const concat=(arrays)=> {
        // sum of individual array lengths
        let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

        if (!arrays.length) return null;

        let result = new Uint8Array(totalLength);

        // for each array - copy it over result
        // next array is copied right after the previous one
        let length = 0;
        for(let array of arrays) {
            result.set(array, length);
            length += array.length;
        }

        return result;
    }
    const utils={
        //处理请求的方法，就嗯抄就完事了嘛
        nonce:()=>{return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
            var t = 16 * Math.random() | 0;
            return ("x" == e ? t : 3 & t | 8).toString(16)
        }))},
        sign:data=>{
            var t = data
            , n = Object.keys(t).sort().reduce((function(e, n) {
                return e + (null === t[n] || void 0 === t[n] ? "" : t[n]) + n
            }), "");
            return CryptoJS.MD5(n).toString().toUpperCase().substring(0, 20)},
        //自己根据逆向推测做的构造方法
        buildPageBody:id=>{
            const signBody={bookId:id,
                            v:2,
                            _timestamp:Date.now(),
                            _nonce:utils.nonce()}
            signBody._sign=utils.sign(signBody)
            return new URLSearchParams(signBody).toString()},
        buildLessonBody:id=>{
            const signBody={lessonId:id,
                            v:2,
                            _timestamp:Date.now(),
                            _nonce:utils.nonce()}
            signBody._sign=utils.sign(signBody)
            return new URLSearchParams(signBody).toString()},
        buildLiveBody:(liveid,targetid,pcrid)=>{
            const signBody={liveId: liveid,
                            targetId: targetid,
                            pcrId: pcrid,
                            v:2,
                            _timestamp:Date.now(),
                            _nonce:utils.nonce()}
            signBody._sign=utils.sign(signBody)
            return new URLSearchParams(signBody).toString()},
        buildFileBody:(id,resid,ressign,pcrid,type)=>{
            const signBody={id:id,
                            type:14,
                            resId:resid,
                            resSign:ressign,
                            v:2,
                            _timestamp:Date.now(),
                            _nonce:utils.nonce()}
            if(pcrid){
                signBody.pcrId=pcrid
            }
            if(type){
                signBody.type=type
            }
            signBody._sign=utils.sign(signBody)
            return new URLSearchParams(signBody).toString()},
        //根据地址推测后缀
        getExtFromUrl:url=>{
            let ext=url.substr(url.lastIndexOf("."))
            if(ext.indexOf("?")>0){
                ext=ext.substr(0,ext.indexOf("?"))
            }
            return ext
        },
        m3u8Downloader:async (url,title)=>{
            SakiProgress.setPercent(0);
            SakiProgress.setText("[m3u8下载]正在读取m3u8信息");
            let dlLink=new URL(url);
            const m3u8Text=await (await fetch(dlLink)).text();
            const parser = new m3u8Parser.Parser();
            parser.push(m3u8Text);
            const segments=parser.manifest.segments;
            console.log(segments);
            const cdn=dlLink.origin;
            let tsCache=[];
            let onFullDL = function () { };
            function waitFullDL() {
                return new Promise(resolve => {
                    onFullDL = () => {
                        resolve();
                    }
                });
            }
            SakiProgress.setPercent(5);
            SakiProgress.setText("[m3u8下载]Init Neeko Engine...");
            await sleep(250)
            const batchDL=async (url,position)=>{
                tsCache[position]=await (await fetch(url)).blob()
                SakiProgress.setPercent(5+Object.keys(tsCache).length/segments.length*80);
                SakiProgress.setText("[m3u8下载]多线程极速下载切片，已完成"+(Object.keys(tsCache).length)+"个，共"+segments.length+"个");
                if(Object.keys(tsCache).length==segments.length){
                    switch (config.m3u8Format){
                        case "mp4":{
                            SakiProgress.setPercent(90);
                            SakiProgress.setText("[m3u8下载]正在转换为MP4");
                            let transmuxer = new muxjs.mp4.Transmuxer({remux: true});
                            transmuxer.on('data', segment=> {
                                let data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                                data.set(segment.initSegment, 0);
                                data.set(segment.data, segment.initSegment.byteLength);
                                let mp4File=new Blob([data])
                                SakiProgress.setPercent(97);
                                SakiProgress.setText("[m3u8下载]正在导出下载");
                                let eleLink = document.createElement('a');
                                eleLink.download = title+".mp4";
                                eleLink.style.display = 'none';
                                eleLink.href = URL.createObjectURL(mp4File);
                                document.body.appendChild(eleLink);
                                eleLink.click();
                                document.body.removeChild(eleLink);
                                SakiProgress.setPercent(100);
                                transmuxer.reset();
                                URL.revokeObjectURL(eleLink.href);
                                onFullDL();
                            })
                            for(let seg=0;tsCache[seg];seg++){
                                transmuxer.push(new Uint8Array(await tsCache[seg].arrayBuffer()))
                            }
                            transmuxer.flush();
                            break;
                        }
                        case "ts":{
                            SakiProgress.setPercent(85);
                            SakiProgress.setText("[m3u8下载]正在合并TS文件");
                            let tsFile=new Blob(tsCache)
                            SakiProgress.setPercent(97);
                            SakiProgress.setText("[m3u8下载]正在导出下载");
                            let eleLink = document.createElement('a');
                            eleLink.download = title+".ts";
                            eleLink.style.display = 'none';
                            eleLink.href = URL.createObjectURL(tsFile);
                            document.body.appendChild(eleLink);
                            eleLink.click();
                            document.body.removeChild(eleLink);
                            SakiProgress.setPercent(100);
                            onFullDL();
                            break
                        }
                    }
                }
            }
            for(let current=0;segments[current];current++){
                batchDL(cdn+segments[current].uri,current)
            }
            await waitFullDL();
        },
    }
    const searchParams=new URLSearchParams(document.location.search);

    switch (location.pathname){
        case "/pc/personCenter.html":{
            const parentDiv=document.getElementsByClassName("centerRouter-content")[0];
            const observer = new MutationObserver(function(){
                if(document.getElementsByClassName("container").length){
                    const scannerHTML=`<div class="container"><div class="tagPoint"></div><div class="contentContainer"><div class="top"><div class="tagTitleContainer"><div class="tagText">扫码器</div></div><div class="bookContentContainer" id="scanContainer" style="display: flex;flex-direction: column;justify-content: center;"><div class="emptyViewBookMsg" id="scanMsg">点我启动扫码器</div><div></div></div></div></div></div>`;
                    document.getElementsByClassName("ant-spin")[0].insertAdjacentHTML("afterend",scannerHTML)
                    const msg=document.getElementById("scanMsg")
                    msg.addEventListener("click",()=>{
                        msg.innerText="正在启动扫码器，请允许使用摄像头"
                        const scanCanvas=document.createElement("canvas")
                        const canvas = scanCanvas.getContext('2d');
                        document.getElementById("scanContainer").insertBefore(scanCanvas,msg);
                        const video = document.createElement("video");
                        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
                            video.srcObject = stream;
                            video.setAttribute("playsinline", true);
                            video.play();
                            const tick=()=>{if (video.readyState === video.HAVE_ENOUGH_DATA) {
                                scanCanvas.height = video.videoHeight;
                                scanCanvas.width = video.videoWidth;
                                canvas.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);
                                let imageData = canvas.getImageData(0, 0, scanCanvas.width, scanCanvas.height)
                                let code = jsQR(imageData.data, imageData.width, imageData.height, {
                                    inversionAttempts: "dontInvert",
                                });
                                if (code) {
                                    if(code.data.startsWith("http")){
                                        const link=new URL(code.data)
                                        if(link.host.endsWith("bookln.cn") || link.host.endsWith("xdfsjj.com")){
                                            msg.innerText=link;
                                            location.href=link;
                                        }
                                    }
                                }
                            }
                                            requestAnimationFrame(tick);
                                           }
                            requestAnimationFrame(()=>{
                                msg.innerText="正在识别二维码"
                                tick();
                            });
                        });
                    })
                }
            });
            observer.observe(parentDiv, { childList: true });
            break
        }
        case "/pc/courseDetail.html":{
            XHRDL.init();
            await sleep(1500)
            if(document.getElementsByClassName("ytButton-container button-exit")[0]){
                //已登录
                console.log("已登录，下载器已初始化")
                if(CryptoJS){
                    const dlBtn=document.getElementsByClassName("studyCount")[0]
                    dlBtn.innerText="点我下载本书全部资源"
                    dlBtn.addEventListener("click",async event=>{
                        SakiProgress.showDiv();
                        //解析下载核心逻辑
                        event.preventDefault();
                        event.stopPropagation();
                        SakiProgress.setPercent(2);
                        SakiProgress.setText("正在读取页面信息...");
                        const pageDetail=await (await fetch("https://dogwood.xdfsjj.com/lessonService/detail.do", {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "content-type": "application/x-www-form-urlencoded",
                            },
                            "referrer": document.location.href,
                            "body": utils.buildLessonBody(searchParams.get("lessonId")),
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        })).json();
                        SakiProgress.setPercent(5);
                        SakiProgress.setText("页面信息已下载");
                        console.log(pageDetail);
                        let fileList=[]
                        if(pageDetail.success&&pageDetail.data.lessonDTO.chapters){
                            pageDetail.data.lessonDTO.chapters.forEach(chapter=>{
                                if(chapter.ress){
                                    //逐段下载
                                    chapter.ress.forEach(file=>{
                                        //逐文件下载
                                        //添加文件到列表
                                        fileList[fileList.length]=file;
                                    })
                                }
                            })
                        }else{
                            SakiProgress.setPercent(10);
                            SakiProgress.setTextAlert("页面信息解析失败！")
                        }
                        //处理文件列表
                        console.log(fileList);
                        SakiProgress.setText("文件列表初始化完成，共计"+fileList.length+"个文件");
                        //文件列表解析
                        for(let i=0;fileList[i];i++){
                            SakiProgress.setText("正在解析"+i+"/"+fileList.length+"文件");
                            SakiProgress.setPercent(10+(i/fileList.length*80))
                            switch(fileList[i].type){
                                case 1:{
                                    const fileInfo=await(await fetch("https://dogwood.xdfsjj.com/resourceService/getLinkUrl.do", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        "referrer": "https://dogwood.xdfsjj.com/pc/audioDetail.html?id="+searchParams.get("lessonId")+"&pcrId="+fileList[i].pcrId+"&resId="+fileList[i].id+"&resSign="+fileList[i].idSign+"&type=47",
                                        "referrerPolicy": "strict-origin-when-cross-origin",
                                        "body": utils.buildFileBody(searchParams.get("lessonId"),fileList[i].id,fileList[i].idSign,null,47),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    })).json();
                                    if(fileInfo.success){
                                        let dlLink=""
                                        if(fileInfo.encrypted && fileInfo.encryptedData){
                                            let decryptData=JSON.parse(CryptoJS.AES.decrypt(fileInfo.encryptedData.replace(/\r\n/g, ""), CryptoJS.enc.Utf8.parse("Suj4XDDt3jPsH9Jj"), { mode: CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8))
                                            switch(decryptData.mediaType){
                                                case 1:{
                                                    dlLink=decryptData.url;
                                                    break
                                                }
                                                case 2:{
                                                    //m3u8视频
                                                    await utils.m3u8Downloader(decryptData.url,fileList[i].title);
                                                    dlLink="blob"
                                                    break
                                                }
                                            }
                                        }else{
                                            dlLink=fileInfo.url;
                                        }
                                        if(!(dlLink=="blob")){
                                            console.log(fileList[i].title+":"+dlLink)
                                            XHRDL.newTask(dlLink,fileList[i].title+".mp4")
                                        }
                                    }else{
                                        console.error("获取地址失败了");
                                        console.error(fileInfo);
                                    }
                                    break;
                                }
                                case 2:{
                                    const fileInfo=await(await fetch("https://dogwood.xdfsjj.com/resourceService/getLinkUrl.do", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        "referrer": "https://dogwood.xdfsjj.com/pc/audioDetail.html?id="+searchParams.get("lessonId")+"&pcrId="+fileList[i].pcrId+"&resId="+fileList[i].id+"&resSign="+fileList[i].idSign+"&type=47",
                                        "referrerPolicy": "strict-origin-when-cross-origin",
                                        "body": utils.buildFileBody(searchParams.get("lessonId"),fileList[i].id,fileList[i].idSign),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    })).json();
                                    if(fileInfo.success){
                                        let dlLink=""
                                        if(fileInfo.encrypted && fileInfo.encryptedData){
                                            dlLink=JSON.parse(CryptoJS.AES.decrypt(fileInfo.encryptedData.replace(/\r\n/g, ""), CryptoJS.enc.Utf8.parse("Suj4XDDt3jPsH9Jj"), { mode: CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8)).url;
                                        }else{
                                            dlLink=fileInfo.url;
                                        }
                                        console.log(fileList[i].title+":"+dlLink)
                                        XHRDL.newTask(dlLink,fileList[i].title+".mp3")
                                    }else{
                                        console.error("获取地址失败了");
                                        console.error(fileInfo);
                                    }
                                    break;
                                }
                                case 3:{
                                    //XHRDL.newTask("data:text,[InternetShortcut]%0AURL=https://app.xdfsjj.com/resourceservice/mediaplay.do?resId="+fileList[i].id+"&resIdSign="+fileList[i].idSign+"&mediaType=4",fileList[i].title+".url")
                                    //处理跨域问题
                                    function asyncFetchPic(){
                                        return new Promise(resolve => {
                                            let pic=GM_xmlhttpRequest({
                                                method: "GET", url: "https://app.xdfsjj.com/resourceservice/mediaplay.do?resId="+fileList[i].id+"&resIdSign="+fileList[i].idSign+"&mediaType=4", responseType: "blob", onload: (res) => {
                                                    console.log(res.response)
                                                    XHRDL.newTask(URL.createObjectURL(res.response),fileList[i].title+".png")
                                                    resolve();
                                                }
                                            })
                                            });
                                    }
                                    await asyncFetchPic();
                                    break;
                                }
                                case 27:{
                                    const fileInfo=await (await fetch("https://dogwood.xdfsjj.com/resourceService/detail.do", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        "referrer": "https://dogwood.xdfsjj.com/pc/resourceRichText.html?id="+searchParams.get("lessonId")+"&pcrId="+fileList[i].pcrId+"&resId="+fileList[i].id+"&resSign="+fileList[i].idSign+"&type=47",
                                        "body": utils.buildFileBody(searchParams.get("lessonId"),fileList[i].id,fileList[i].idSign,fileList[i].pcrId,47),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    })).json()
                                    if(fileInfo.success){
                                        //读取Content写入HTML
                                        fileInfo.data.resourceDTOList.forEach(doc=>{
                                            let htmlDoc=doc.content;
                                            XHRDL.newTask(URL.createObjectURL(new Blob([htmlDoc])),fileList[i].title+".html");
                                        })
                                    }else{
                                        console.error("获取地址失败了");
                                        console.error(fileInfo);
                                    }
                                    break;
                                }
                                case 7:
                                case 19:{
                                    const fileInfo=await (await fetch("https://dogwood.xdfsjj.com/resourceService/detail.do", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        "referrer": "https://dogwood.xdfsjj.com/pc/resourceRichText.html?id="+searchParams.get("lessonId")+"&pcrId="+fileList[i].pcrId+"&resId="+fileList[i].id+"&resSign="+fileList[i].idSign+"&type=47",
                                        "body": utils.buildFileBody(searchParams.get("lessonId"),fileList[i].id,fileList[i].idSign,fileList[i].pcrId,47),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    })).json()
                                    if(fileInfo.success){
                                        fileInfo.data.resourceDTOList.forEach(doc=>{
                                            let format=config.docFormat;
                                            if(fileList[i].type==7){
                                                format="pdf";
                                            }
                                            switch(format){
                                                case "origin":{
                                                    const rawUrl=new URL(doc.content).searchParams.get("furl");
                                                    XHRDL.newTask(rawUrl,fileList[i].title+utils.getExtFromUrl(rawUrl))
                                                    console.log(rawUrl)
                                                    break;
                                                }
                                                case "pdf":{
                                                    let filename=fileList[i].title+".pdf"
                                                    if(fileList[i].type==7){
                                                        filename=fileList[i].title+utils.getExtFromUrl(doc.downUrl)
                                                    }
                                                    XHRDL.newTask(doc.downUrl,filename)
                                                    console.log(doc.downUrl)
                                                    break;
                                                }
                                            }
                                        })
                                    }else{
                                        console.error("获取地址失败了");
                                        console.error(fileInfo);
                                    }
                                    break;}
                                case 4:{
                                    console.log("跳过广告链接");
                                    break;
                                }
                                case 24:{
                                    const fileInfo=await (await fetch("https://dogwood.xdfsjj.com/liveService/queryById.do", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        "referrer": "https://dogwood.xdfsjj.com/pc/livePlayback.html?liveId="+fileList[i].fkId+"&pcrId="+fileList[i].pcrId+"&targetId"+searchParams.get("lessonId"),
                                        "body": utils.buildLiveBody(fileList[i].fkId,searchParams.get("lessonId"),fileList[i].pcrId),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    })).json();
                                    if(fileInfo.success){
                                        let dlLink=""
                                        if(fileInfo.encrypted && fileInfo.encryptedData){
                                            let decryptData=JSON.parse(CryptoJS.AES.decrypt(fileInfo.encryptedData.replace(/\r\n/g, ""), CryptoJS.enc.Utf8.parse("Suj4XDDt3jPsH9Jj"), { mode: CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8))
                                            if(decryptData.playbacks){
                                                dlLink=decryptData.playbacks;
                                            }else{
                                                console.error("该直播尚未结束，无回放解析");
                                                console.error(fileInfo);
                                                break;
                                            }
                                        }else{
                                            dlLink=fileInfo.url;
                                        }
                                        console.log(fileList[i].title+":"+dlLink)
                                        XHRDL.newTask(dlLink,fileList[i].title+".mp4")
                                    }else{
                                        console.error("获取地址失败了");
                                        console.error(fileInfo);
                                    }
                                    break;
                                }
                                default:{
                                    console.error("遇到了不支持的文件类型");
                                    console.error(fileList[i]);
                                    break;}
                            }
                            await sleep(20)
                        }
                        SakiProgress.setPercent(100);
                        SakiProgress.setText("文件信息全部获取完成！三秒后开始下载")
                        await sleep(3000)
                        XHRDL.DLEngine.start();
                    })
                }else{
                    SakiProgress.setTextAlert("没有加载CryptoJS")
                }
            }else{
                console.log("没有登录，下载器不可用")
            }
            break
        }
        case "/pc/bookDetail.html":{
            XHRDL.init();
            await sleep(1500)
            if(document.getElementsByClassName("ytButton-container button-exit")[0]){
                //已登录
                console.log("已登录，下载器已初始化")
                if(CryptoJS){
                    const dlBtn=document.getElementsByClassName("studyCount")[0]
                    dlBtn.innerText="点我下载本书全部资源"
                    dlBtn.addEventListener("click",async event=>{
                        SakiProgress.showDiv();
                        //解析下载核心逻辑
                        event.preventDefault();
                        event.stopPropagation();
                        SakiProgress.setPercent(2);
                        SakiProgress.setText("正在读取页面信息...");
                        const pageDetail=await (await fetch("https://dogwood.xdfsjj.com/bookService/detail.do", {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "content-type": "application/x-www-form-urlencoded",
                            },
                            "referrer": document.location.href,
                            "body": utils.buildPageBody(searchParams.get("bookId")),
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        })).json();
                        SakiProgress.setPercent(5);
                        SakiProgress.setText("页面信息已下载");
                        console.log(pageDetail);
                        let fileList=[]
                        if(pageDetail.success&&pageDetail.data.chapters){
                            pageDetail.data.chapters.forEach(chapter=>{
                                if(chapter.sections){
                                    //逐章节下载
                                    chapter.sections.forEach(section=>{
                                        if(section.ress){
                                            //逐段下载
                                            section.ress.forEach(file=>{
                                                //逐文件下载
                                                //添加文件到列表
                                                fileList[fileList.length]=file;
                                            })
                                        }
                                    })
                                }
                            })
                        }else{
                            SakiProgress.setPercent(10);
                            SakiProgress.setTextAlert("页面信息解析失败！")
                        }
                        //处理文件列表
                        console.log(fileList);
                        SakiProgress.setText("文件列表初始化完成，共计"+fileList.length+"个文件");
                        //文件列表解析
                        for(let i=0;fileList[i];i++){
                            SakiProgress.setText("正在解析"+i+"/"+fileList.length+"文件");
                            SakiProgress.setPercent(10+(i/fileList.length*80))
                            switch(fileList[i].type){
                                case 2:{
                                    const fileInfo=await(await fetch("https://dogwood.xdfsjj.com/resourceService/getLinkUrl.do", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        "referrer": "https://dogwood.xdfsjj.com/pc/audioDetail.html?id="+searchParams.get("bookId")+"&pcrId="+fileList[i].pcrId+"&resId="+fileList[i].id+"&resSign="+fileList[i].idSign+"&type=14",
                                        "referrerPolicy": "strict-origin-when-cross-origin",
                                        "body": utils.buildFileBody(searchParams.get("bookId"),fileList[i].id,fileList[i].idSign),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    })).json();
                                    if(fileInfo.success){
                                        let dlLink=""
                                        if(fileInfo.encrypted && fileInfo.encryptedData){
                                            dlLink=JSON.parse(CryptoJS.AES.decrypt(fileInfo.encryptedData.replace(/\r\n/g, ""), CryptoJS.enc.Utf8.parse("Suj4XDDt3jPsH9Jj"), { mode: CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8)).url;
                                        }else{
                                            dlLink=fileInfo.url;
                                        }
                                        console.log(fileList[i].title+":"+dlLink)
                                        XHRDL.newTask(dlLink,fileList[i].title+".mp3")
                                    }else{
                                        console.error("获取地址失败了");
                                        console.error(fileInfo);
                                    }
                                    break;}
                                case 7:
                                case 19:{
                                    const fileInfo=await (await fetch("https://dogwood.xdfsjj.com/resourceService/detail.do", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        "referrer": "https://dogwood.xdfsjj.com/pc/resourceRichText.html?id="+searchParams.get("bookId")+"&pcrId="+fileList[i].pcrId+"&resId="+fileList[i].id+"&resSign="+fileList[i].idSign+"&type=14",
                                        "body": utils.buildFileBody(searchParams.get("bookId"),fileList[i].id,fileList[i].idSign,fileList[i].pcrId),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    })).json()
                                    if(fileInfo.success){
                                        fileInfo.data.resourceDTOList.forEach(doc=>{
                                            let format=config.docFormat;
                                            if(fileList[i].type==7){
                                                format="pdf";
                                            }
                                            switch(format){
                                                case "origin":{
                                                    const rawUrl=new URL(doc.content).searchParams.get("furl");
                                                    XHRDL.newTask(rawUrl,fileList[i].title+utils.getExtFromUrl(rawUrl))
                                                    console.log(rawUrl)
                                                    break;
                                                }
                                                case "pdf":{
                                                    let filename=fileList[i].title+".pdf"
                                                    if(fileList[i].type==7){
                                                        filename=fileList[i].title+utils.getExtFromUrl(doc.downUrl)
                                                    }
                                                    XHRDL.newTask(doc.downUrl,filename)
                                                    console.log(doc.downUrl)
                                                    break;
                                                }
                                            }
                                        })
                                    }else{
                                        console.error("获取地址失败了");
                                        console.error(fileInfo);
                                    }
                                    break;}
                                case 4:{
                                    console.log("跳过广告链接");
                                }
                                default:{
                                    console.error("遇到了不支持的文件类型");
                                    console.error(fileList[i]);
                                    break;}
                            }
                            await sleep(100)
                        }
                        SakiProgress.setPercent(100);
                        SakiProgress.setText("文件信息全部获取完成！三秒后开始下载")
                        await sleep(3000)
                        XHRDL.DLEngine.start();
                    })
                }else{
                    SakiProgress.setTextAlert("没有加载CryptoJS")
                }
            }else{
                console.log("没有登录，下载器不可用")
            }
            break;
        }
    }
})();
