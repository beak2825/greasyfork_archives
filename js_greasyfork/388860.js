// ==UserScript==
// @name            KuaiKan ADown
// @namespace       https://www.cnblogs.com/Chary/
// @version         0.0.2
// @description     add download button on kuaikan Html Header to download videos
// @author          CharyGao
// @match           https://www.kuaikan1.com/*
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @grant           GM_openInTab
// @grant           GM_setClipboard
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @grant           GM_download
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/388860/KuaiKan%20ADown.user.js
// @updateURL https://update.greasyfork.org/scripts/388860/KuaiKan%20ADown.meta.js
// ==/UserScript==
// noinspection JSUnresolvedFunction: GM_getValue supplied by TamperMonkey
//<editor-fold desc="Style">
// noinspection JSUnresolvedFunction：
GM_addStyle(`
        div.layout{
            width: 1200px !important;
        }
        button.ADownElementTagClass:hover {
            color: green;
        }
        .ADownElementTagClass {
            position: absolute;
            float: right;
            right: 90px;
            border: 2px dashed gray;
            height: 46px;
            border-radius: 10px;
            color: #93999f;
            font-size: 12px;
            background: transparent;
            top: 1px;
            width: 50px;
        }
       .dropdown {
            z-index: 999998;
            position: relative;
            display: inline-block;
            /*line-height: 20px;*/
            /*margin: 13px 0px 5px 0px;*/
            float: right;
            /*font-weight: bold;*/
        }
        .dropdown-content {
                /*margin-left: 16px;*/
                display: none;
                position: absolute;
                top: 40px;
                background-color: black;
                min-width: 72px;
                text-align: center;
                padding: 8px;
                border: red 1px dashed;
        }
        .dropdown:hover .dropdown-content {
            display: block;
        }
        .show{display: block;}
        .hide{display: none;}
`);
//</editor-fold>
(function () {
        'use strict';//启用严格模式
        //<editor-fold desc="0.Fields">
        let windowsNameForbidReg = /[\\/?？*"“”'‘’<>{}\[\]【】：:、^$!~`|]/g;
        let logCount = 0;
        let downloadedContents = {};
        let downLoadFileDirFullPath = "D:\\HKPath\\HK\\HkDownloads";

        function myLog(param1, param2) {
            param1 = param1 ? param1 : "";
            param2 = param2 ? param2 : "";
            console.log("#" + logCount++ + "ADown:", param1, param2);
        }

        //</editor-fold>

        //<editor-fold desc="1.Enter">
        setTimeout(function () {
            try {
                addTextHeader();//0.添加标签
                getDownloadInfo(); //1.获取下载信息
                loadSetting(); //2.加载个人设置
                myLog("ADown加载完成~");
            } catch (e) {
                myLog('err:', e);
            }
        }, 2000); //页面加载完成后延时2秒执行

        function loadSetting() {/*2.加载个人设置*/
            // noinspection JSUnresolvedFunction
            downLoadFileDirFullPath = GM_getValue("down_load_file_dir_full_path", "D:\\HKPath\\HK\\HkDownloads");
        }

        function getDownloadInfo() {//1.获取下载信息
            downloadedContents = {
                TopCatalogueName: document.querySelector('#detail-box > div.detail-title.fn-clear > h1')
                    .innerText.replace(windowsNameForbidReg, "").trim(),
                SubDownloadItems: [],
                DownLoadTotalCount: 0,
            };
            let maxCountList = [];
            let detailList = document.querySelectorAll('div#detail-list');
            if (detailList == null || detailList.length < 1) throw "不是播放详情页！";
            detailList.forEach(list => {
                let items = list.querySelectorAll("div > div.content > p.play-list > a");
                if (maxCountList == null) {
                    maxCountList = items;
                } else if (items.length >= maxCountList.length) {
                    maxCountList = items;
                }
            });
            maxCountList.forEach(item => {
                let subDownloadItem = {
                    Name: item.innerText.replace(windowsNameForbidReg, "").trim(),
                    TopUrl: item.href,
                    M3u8Info: "",
                };
                downloadedContents.SubDownloadItems.push(subDownloadItem);
            });
            downloadedContents.DownLoadTotalCount = maxCountList.length;
            downloadedContents.SubDownloadItems = downloadedContents.SubDownloadItems.reverse();
            //downloadedContents.SubDownloadItems = jsonSort(downloadedContents.SubDownloadItems, "Name", false);
            myLog("window.ADownGotCourse:", downloadedContents);
            window.ADownGotCourse = downloadedContents;
        }

        function addTextHeader() {//0.添加标签
            let aDownParentNode = document.getElementById('sign');
            if (aDownParentNode == null) throw "isLoginAndAddText loginAreaNode err!->妈的又改版了!";
            let aDownPartHtmlNode = document.createElement("li");
            aDownPartHtmlNode.className = "nav-item drop-down dropdown";
            aDownPartHtmlNode.innerHTML = '<a class="nav-link drop-title" id="downTip" style="color: red!important;">ADown↓</a>' +
                '<div class="dropdown-content">' +
                '<p style="color: green; margin: 2px;" id="downTipBatchDown" data-darkreader-inline-color="">批量下载</p>' +
                '</div>';
            aDownParentNode.appendChild(aDownPartHtmlNode);
            let downTipNode = document.getElementById('downTip');
            if (downTipNode == null) throw "addTextHeader err!->妈的 downTipDiv 不见了！";

            let downTipBatchDown = document.getElementById("downTipBatchDown");
            showTextArea();//组装file文本
            elementHide("ADownTextDiv");

            downTipBatchDown.addEventListener("click", () => {
                showTextArea();
                batchDownload();
            });
            downTipNode.addEventListener("click", () => {
                toggleElementHideShow("ADownTextDiv");
            });
        }

        //</editor-fold>

        //<editor-fold desc="2.批量下载">
        function batchDownload() {
            // noinspection JSUnresolvedFunction
            GM_setClipboard(downloadedContents.TopCatalogueName);//设置课程名称到剪贴板
            downloadedContents.SubDownloadItems.forEach(function (subDownloadItem) {
                let m3u8FileNameForLog = `${downloadedContents.TopCatalogueName}_${subDownloadItem.Name}`.replace(/\s+/g, "");

                fetch(subDownloadItem.TopUrl, {
                    credentials: "include",//For CORS requests
                    method: "GET",
                }).then(response => {
                    if (response.ok) {
                        // myLog( `${m3u8FileNameForLog}|downloadVideo ok!${response}`, response.url );
                        return response.text();
                    }
                    throw  response;
                }).catch(error => {
                    throw `${m3u8FileNameForLog}batchDownload error!${error.url}${error}`;
                }).then(bodyHtml => {//body
                    let m3u8FileDownMatched = bodyHtml.match(/var zanpiancms_player = {"url":"(.*?)".*?"name":"(.*?)".*?"apiurl":"(.*?)".*?};/);
                    if (m3u8FileDownMatched.length < 3) {
                        throw `${m3u8FileNameForLog}batchDownload error!${m3u8FileDownMatched}`;
                    }
                    let m3u8FileDownUrl = m3u8FileDownMatched[1];
                    let m3u8FileDownName = m3u8FileDownMatched[2];
                    let m3u8FileDownApiUrl = m3u8FileDownMatched[3];
                    if (m3u8FileDownName === "m3u8") {
                        getM3u8DownloadUrls(m3u8FileDownApiUrl + m3u8FileDownUrl, m3u8FileNameForLog, subDownloadItem);
                    } else {
                        myLog(`${m3u8FileNameForLog}match:${m3u8FileDownMatched}`);
                    }
                });

            });
        }

        function getM3u8DownloadUrls(url, m3u8FileNameForLog, subDownloadItem) {//step2/4获取三个M3u8下载地址
            // noinspection JSUnresolvedFunction
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        let textHtml = response.responseText;
                        let m3u8FileLevel1Url = textHtml.match(/var purl = '(http.*?.m3u8)';/)[1];

                        document.getElementById("ADownTextArea").append(`${m3u8FileNameForLog},${m3u8FileLevel1Url}\r\n`);
                        subDownloadItem.M3u8Info = m3u8FileLevel1Url;

                        downloadedContents.DownLoadTotalCount--;
                        if (downloadedContents.DownLoadTotalCount < 1) {
                            let text = document.getElementById("ADownTextArea").innerHTML;
                            exportRaw(downloadedContents.TopCatalogueName, text);
                        }

                    } else {
                        throw `${m3u8FileNameForLog}getM3u8DownloadUrls error!${response}`;
                    }
                },
                onerror: function (err) {
                    throw `${m3u8FileNameForLog}getM3u8DownloadUrls error!${err}`;
                },
            });

        }

        function addDownAHrefNode(text, fileName) {
            let anchor = document.createElement("a");
            let data = new Blob([text], {type: "text/plain;charset=UTF-8"});
            anchor.href = window.URL.createObjectURL(data);
            anchor.download = fileName;
            anchor.innerText = fileName;
            // noinspection JSUnresolvedFunction
            //GM_openInTab(anchor.href, "setParent");

            anchor.addEventListener("click", ev => myLog(fileName + "|下载-被点击！", JSON.stringify(ev)));
            //anchor.click();
            return anchor;
        }

        function exportRaw(fileName, text) {//调用 单一文件 下载
            let anchor = addDownAHrefNode(text, fileName);
            anchor.click();
        }

        //</editor-fold>

        //<editor-fold desc="4.UtilitiesFunction">

        function showTextArea() {
            if (document.querySelector('#ADownTextDiv') == null) {
                let container = document.createElement("div");
                container.id = "ADownTextDiv";
                container.style = "width: 100%; position: fixed; z-index: 999998; top: 40%; height: 60%; bottom: 0px; " +
                    "background: black; color: red;overflow: auto;";
                container.innerHTML = '<textarea id="ADownTextArea" readonly="readonly" ' +
                    'style="white-space: pre;width: 95%;position: absolute;top: 0;left: 0; height: 98%; background: black; ' +
                    'color: lawngreen;resize: none; border: 1px solid red;overflow: auto;">' +
                    '</textarea>';
                document.body.appendChild(container);
            } else {
                elementShow('ADownTextDiv');
            }
        }

        function toggleElementHideShow(elementId) {
            let element = document.getElementById(elementId);
            if (element == null) {
                alert("toggleElementHideShow：妈的，" + elementId + " 没找到！");
            }
            let show = element.classList.contains('show');
            if (show) {
                element.classList.remove('show');
                element.classList.add('hide');
            } else {
                element.classList.remove('hide');
                element.classList.add('show');
            }
        }

        function elementHide(elementId) {
            let element = document.getElementById(elementId);
            if (element == null) {
                alert("toggleElementHideShow：妈的，" + elementId + " 没找到！");
            }
            element.classList.remove('show');
            element.classList.add('hide');
        }

        function elementShow(elementId) {
            let element = document.getElementById(elementId);
            if (element == null) {
                alert("toggleElementHideShow：妈的，" + elementId + " 没找到！");
            }
            element.classList.remove('hide');
            element.classList.add('show');

        }

        //</editor-fold>
    }

)();
