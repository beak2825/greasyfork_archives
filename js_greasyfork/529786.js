// ==UserScript==
// @name         超星学习通章节直链下载
// @namespace    https://github.com/gandizm/ChaoXingDownload
// @version      0.38
// @description  超星学习通章节直链下载，支持ppt,doc,pdf,mp4(x),flv(x),mp3(x),avi(x)资源的下载，支持整节课资源批量下载。
// @author       ColdThunder11, GanDi
// @match        *://*.chaoxing.com/mycourse/studentstudy?chapterId=*&courseId=*&clazzid=*&enc=*
// @match        *://*.chaoxing.com/coursedata?classId=*
// @match        *://*.chaoxing.com/coursedata?courseId=*
// @match        *://*.chaoxing.com/coursedata/search?dataName=*&courseId=*
// @match        *://*.chaoxing.com/ananas/modules/pdf/index.html*
// @match        *://*.edu.cn/mycourse/studentstudy?chapterId=*&courseId=*&clazzid=*&enc=*
// @match        *://*.edu.cn/coursedata?classId=*
// @match        *://*.edu.cn/coursedata?courseId=*
// @match        *://*.edu.cn/coursedata/search?dataName=*&courseId=*
// @match        *://*.edu.cn/ananas/modules/pdf/index.html*
// @run-at       document-start
// @grant        unsafeWindow
// @supportURL   https://github.com/gandizm/ChaoXingDownload/issues
// @downloadURL https://update.greasyfork.org/scripts/529786/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529786/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    try{
        let href = unsafeWindow.top.location.href
    }
    catch{
        location.reload() //Refresh page to avoid cross-origin problem cause by http page
        return
    }
    if(unsafeWindow.top.location.href != unsafeWindow.location.href){ //Only run xhr hook in iframe
        var myOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        unsafeWindow.XMLHttpRequest.prototype.open = function () {
            //console.log(arguments)
            this.addEventListener("load",()=>{
                if(this.responseText.includes("d0.ananas.chaoxing.com/download/")||this.responseText.includes("d0.cldisk.com/download/") ){
                    //console.log(this.responseText);
                    let jsondata = JSON.parse(this.responseText);
                    if(unsafeWindow.top.decdata != null){
                        unsafeWindow.top.decdata[jsondata.objectid] = jsondata.download
                    }
                }
            })
            return myOpen.apply(this,arguments)
        };
        var mySend = unsafeWindow.XMLHttpRequest.prototype.send;
        unsafeWindow.XMLHttpRequest.prototype.send = function () {
            mySend.apply(this,arguments);
        };
    }
    else{
        unsafeWindow["decdata"] = {}
    }
    var url = document.location.toString();
    if (url.indexOf("coursedata") != -1) {
        setTimeout(() => {
            if (document.getElementsByClassName("fkxxt")[0] == null) {
                var fileList = document.getElementsByClassName("ZYCon")[0].childNodes[1].childNodes[3].childNodes;
                let getQueryStringFunc = (name)=> {
                    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                    let r = window.location.search.substr(1).match(reg);
                    if (r != null) {
                        return decodeURIComponent(r[2]);
                    };
                    return null;
                }
                for (var i = 0; i < fileList.length; i++) {
                    try {
                        if (fileList[i].getAttribute("type") != "afolder") {
                            let itemId = fileList[i].getAttribute("id");
                            let objectid = fileList[i].getAttribute("objectid");
                            var downloadLink = document.createElement("a");
                            let fileName = encodeURIComponent(jsondata.name); // 对文件名进行编码
                            downloadLink.href = "/coursedata/downloadData?dataId=" + itemId + "&classId=" + getQueryStringFunc("classId") + "&cpi=" + getQueryStringFunc("cpi") + "&courseId=" + getQueryStringFunc("courseId") + "&ut=s&fileName=" + fileName;
                            downloadLink.innerHTML = "点此下载";
                            downloadLink.style.display = "block";
                            downloadLink.style.marginTop = "5px";
                            var downloadTag = document.createElement("div");
                            downloadTag.setAttribute("href", "javascript:void(0)");
                            downloadTag.setAttribute("style", "cursor:pointer;");
                            downloadTag.setAttribute("class", "fkxxt");
                            downloadTag.innerHTML = "点此复制";
                            downloadTag.onclick = async function (params) {
                                let download_link = "/coursedata/downloadData?dataId=" + itemId + "&classId=" + getQueryStringFunc("classId") + "&cpi=" + getQueryStringFunc("cpi") + "&courseId=" + getQueryStringFunc("courseId") + "&ut=s&fileName=" + fileName;
                                try {
                                    await navigator.clipboard.writeText(download_link);
                                    // alert("链接已复制到剪贴板");
                                } catch (err) {
                                    alert("复制失败");
                                }
                            }
                            fileList[i].childNodes[3].childNodes[1].appendChild(downloadLink);
                            fileList[i].childNodes[3].childNodes[1].appendChild(downloadTag);
                        }
                    }
                    catch (e) { }
                }
            }
        }, 1500);
    }
    else {
        setInterval(() => {
            var haveResource = false;
            var downloadLinks = [];
            var if2rames = document.getElementsByTagName("iframe");
            for (var i = 0; i < if2rames.length; i++) {
                var frames = if2rames[i].contentWindow.document.getElementsByTagName("iframe");
                for (var j = 0; j < frames.length; j++) {
                    var frame = frames[j];
                    if (!frame) return;
                    var fdiv = frame.parentNode;
                    if (!fdiv) return;
                    if (if2rames[i].contentWindow.document.getElementsByClassName("fkxxt")[j] != null) return;
                    var data = frame.getAttribute('data');
                    if (data != null) {
                        let jsondata = JSON.parse(data);
                        if (jsondata.type == ".ppt" || jsondata.type == ".pptx" || jsondata.type == ".mp4" || jsondata.type == ".pdf" || jsondata.type == ".flv" || jsondata.type == ".doc" || jsondata.type == ".docx" || jsondata.type == ".avi" || jsondata.type == ".wmv" || jsondata.type == ".mpg" || jsondata.type == ".mpeg") {
                            if (!haveResource) {
                                haveResource = true;
                                downloadLinks = [];
                            }
                            if (jsondata.type == ".mp4" || jsondata.type == ".avi" || jsondata.type == ".wmv" || jsondata.type == ".mpg" || jsondata.type == ".mpeg" || jsondata.type == ".flv") {
                                let v_tag = frame.contentWindow.document.getElementsByTagName("video");
                                console.log(v_tag);
                                var downloadLink = document.createElement("a");
                                let fileName = encodeURIComponent(jsondata.name); // 对文件名进行编码
                                downloadLink.href = v_tag[0].currentSrc + "&fileName=" + fileName;
                                downloadLink.innerHTML = "点此下载 " + jsondata.name;
                                downloadLink.style.display = "block";
                                downloadLink.style.marginTop = "5px";
                                let downloadTag = document.createElement("div");
                                downloadTag.setAttribute("href", "javascript:void(0)");
                                downloadTag.setAttribute("class", "fkxxt");
                                downloadTag.setAttribute("style", "font-size: 14px;color: #666666;cursor:pointer;");
                                downloadTag.innerHTML = "点此复制 " + jsondata.name;
                                downloadTag.onclick = async function (params) {
                                    let download_link = v_tag[0].currentSrc + "&fileName=" + fileName;
                                    try {
                                        await navigator.clipboard.writeText(download_link);
                                        // alert("链接已复制到剪贴板");
                                    } catch (err) {
                                        alert("复制失败");
                                    }
                                }
                                fdiv.appendChild(downloadLink);
                                fdiv.appendChild(downloadTag);
                                downloadLinks.push(v_tag[0].currentSrc + "&fileName=" + fileName);
                            }
                            else {
                                downloadLink = document.createElement("a");
                                let fileName = encodeURIComponent(jsondata.name); // 对文件名进行编码
                                downloadLink.href = unsafeWindow.decdata[jsondata.objectid].replace("http://","https://") + "&fileName=" + fileName;
                                downloadLink.innerHTML = "点此下载 " + jsondata.name;
                                downloadLink.style.display = "block";
                                downloadLink.style.marginTop = "5px";
                                let downloadTag = document.createElement("div");
                                downloadTag.setAttribute("href", "javascript:void(0)");
                                downloadTag.setAttribute("class", "fkxxt");
                                downloadTag.setAttribute("style", "font-size: 14px;color: #666666;cursor:pointer;");
                                downloadTag.innerHTML = "点此复制 " + jsondata.name;
                                downloadTag.onclick = async function (params) {
                                    try{
                                        let download_link = unsafeWindow.decdata[jsondata.objectid].replace("http://","https://") + "&fileName=" + fileName;
                                        try {
                                            await navigator.clipboard.writeText(download_link);
                                            // alert("链接已复制到剪贴板");
                                        } catch (err) {
                                            alert("复制失败");
                                        }
                                    }
                                    catch{
                                        alert("资源解析失败")
                                    }
                                }
                                fdiv.appendChild(downloadLink);
                                fdiv.appendChild(downloadTag);
                                downloadLinks.push(unsafeWindow.decdata[jsondata.objectid].replace("http://","https://") + "&fileName=" + fileName);
                            }
                            continue;
                        }
                    }
                    if (frame.getAttribute("name") == null) continue;
                    if (frame.getAttribute("name").substr(frame.getAttribute("name").length - 4, 4) == ".mp3") {
                        if (!haveResource) {
                            haveResource = true;
                            downloadLinks = [];
                        }
                        let objectId = frame.getAttribute("objectid");
                        downloadLink = document.createElement("a");
                        let fileName = encodeURIComponent(frame.getAttribute("name")); // 对文件名进行编码
                        downloadLink.href = "https://cs-anans.chaoxing.com/download/" + objectId + "?fileName=" + fileName;
                        downloadLink.innerHTML = "点此下载 " + frame.getAttribute("name");
                        downloadLink.style.display = "block";
                        downloadLink.style.marginTop = "5px";
                        var adownloadTag = document.createElement("div");
                        adownloadTag.setAttribute("href", "javascript:void(0)");
                        adownloadTag.setAttribute("class", "fkxxt");
                        adownloadTag.setAttribute("style", "font-size: 14px;color: #666666;cursor:pointer;");
                        adownloadTag.innerHTML = "点此复制 " + frame.getAttribute("name");
                        adownloadTag.onclick = async function (params) {
                            let download_link = "https://cs-anans.chaoxing.com/download/" + objectId + "?fileName=" + fileName;
                            try {
                                await navigator.clipboard.writeText(download_link);
                                // alert("链接已复制到剪贴板");
                            } catch (err) {
                                alert("复制失败");
                            }
                        }
                        fdiv.appendChild(downloadLink);
                        fdiv.appendChild(adownloadTag);
                        downloadLinks.push("https://cs-anans.chaoxing.com/download/" + objectId + "?fileName=" + fileName);
                        continue;
                    }
                }
            }
            //
            if (haveResource) {
                // 查找 prev_title 元素
                const prevTitle = document.querySelector('.prev_title');
                if (prevTitle) {
                    // 为 prev_title 元素添加点击事件监听器
                    prevTitle.addEventListener('click', function() {
                        // 触发下载逻辑
                        for (var i = 0; i < downloadLinks.length; i++) {
                            const iframe = document.createElement("iframe");
                            iframe.style.display = "none";
                            iframe.style.height = 0;
                            iframe.src = downloadLinks[i];
                            document.body.appendChild(iframe);
                            setTimeout(() => iframe.remove(), 10000);
                        }
                    });
                    // 设置样式以匹配按钮的样式（可选）
                    prevTitle.style.cssText = `
            cursor: pointer;
            color: #333;
            padding: 10px;
            margin: 10px 0;
            background: #f5f5f5;
            border-radius: 4px;
        `;
                } else {
                    console.error("Failed to find the 'prev_title' element.");
                }
            }
            //
        }, 3000);
    }
})();
