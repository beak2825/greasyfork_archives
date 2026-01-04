// ==UserScript==
// @name         【最新可用】小红书无水印下载图片视频笔记
// @namespace    teacher_dog
// @version      0.1.4
// @description  小红书无水印下载图片视频笔记
// @author       teacherDog
// @match        https://www.xiaohongshu.com/*
// @icon         https://vitejs.dev/logo.svg
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @grant             GM_getResourceText
// @grant             GM_openInTab
// @grant             GM_addStyle
// @grant             GM_download
// @license           Apache
// @downloadURL https://update.greasyfork.org/scripts/513874/%E3%80%90%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%E3%80%91%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/513874/%E3%80%90%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%E3%80%91%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    //'use strict';

     //**    config     **//
    const debug = false;
    const log = {
        info(...args){
            console.log(...args);
        },
        debug(...args){
            if (!debug) {
                return;
            }
            console.log(...args);
        },
    }


    /**
     * 使用方法：
     * 点击一篇笔记，鼠标移到图片左上角 “这里下载”
     */

    var document = window.document;
    let getPageDatadiv = document.createElement('div');
    getPageDatadiv.setAttribute('onclick', 'return window;');


    function getPageData() {
        let rootWindow = getPageDatadiv.onclick();
        return rootWindow ? rootWindow.__INITIAL_STATE__ : null;
    }


    var selectedImg = [];

    var dialog = document.createElement("dialog");
    dialog.setAttribute('id', 'wsyImgsBox');
    dialog.setAttribute('style', "width:80%;height:80%;padding: 0;border: none;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);border-radius: 5px;overflow: hidden;background: white;display:flex;flex-direction: column;");

    var dialogTitle = document.createElement("div");
    dialogTitle.setAttribute('style', "box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);font-size:22px;font-weight: bold;padding:6px 12px;");
    dialogTitle.innerText = "标题";
    dialog.appendChild(dialogTitle);

    var dialogMain = document.createElement("div");
    dialogMain.innerText = "内容";
    dialogMain.setAttribute('style', "width: 100%;flex: 1;padding:6px 12px;overflow-y:auto;display: flex;flex-direction: row;justify-content: space-evenly;flex-wrap: wrap;");
    dialog.appendChild(dialogMain);

    var dialogFooter = document.createElement("div");
    dialogFooter.setAttribute('style', "padding:6px 12px;display: flex;flex-direction: row;justify-content: center;");
    var dialogFooterCancelBt = document.createElement("div");
    dialogFooterCancelBt.innerText = "关闭";
    dialogFooterCancelBt.setAttribute('style', "color: #333;font-size: 16px;padding: 10px 20px;background-color: #f0f0f0;border: none;border-radius: 5px;cursor: pointer;margin: 0 12px;");
    dialogFooterCancelBt.addEventListener("click", function () {
        dialog.close();
    });
    var dialogFooterCancelOk = document.createElement("div");
    dialogFooterCancelOk.innerText = "下载";
    dialogFooterCancelOk.setAttribute('style', "color: #ffffff;font-size: 16px;padding: 10px 20px;background-color: #409EFF;border: none;border-radius: 5px;cursor: pointer;margin: 0 12px;");
    dialogFooterCancelOk.addEventListener("click", function () {
        if (!selectedImg || selectedImg.length === 0) {
            alert("请先选中下载项");
            return;
        }
        for (let i = 0; i < selectedImg.length; i++) {
            let item = selectedImg[i];
            let imgUrl = item.url;
            let name = item.name;
            let imgEl = item.imgEl;
            let type = item.type;

            if (type === 'video') {
                let fileName = name + '.mp4';
                let rootWindow = getPageDatadiv.onclick();
                // 创建 a 标签
                const a = rootWindow.document.createElement('a');
                // 设置下载文件的 URL
                //a.href = imgUrl; // 替换为你的文件 URL
                a.href = imgUrl;
                a.target = '_blank';
                // 设置下载文件的名称
                a.download = fileName; // 替换为你的文件名称

                // 将 a 标签添加到文档中
                rootWindow.document.body.appendChild(a);

                // 触发点击事件
                a.click();

                // 移除 a 标签
                rootWindow.document.body.removeChild(a);
                continue;
            }


            fetch(imgUrl).then(async res=>{
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                //let type = res.headers.get("Content-Type");
                let blob = await res.blob();
                let type = blob.type;
                log.debug('blob type', type);
                if (type === "image/webp") {
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(function(transBlob) {
                            triggerDownload(transBlob, name + '.jpg');
                        }, 'image/jpeg');
                        URL.revokeObjectURL(url);
                    };
                    img.src = url;
                } else if (type === "image/png") {
                    triggerDownload(blob, name + '.png');
                } else if (type === "image/jpg" || type === "image/jpeg") {
                    triggerDownload(blob, name + '.jpg');
                } else if (type === "image/gif") {
                    triggerDownload(blob, name + '.gif');
                } else if (type === "image/gif") {
                    triggerDownload(blob, name + '.gif');
                }
                else {
                    triggerDownload(blob, name + '.jpg');
                }

            }).catch(e=>{
                console.error("下载错误", e);
            });
        }

    });
    dialogFooter.appendChild(dialogFooterCancelOk);
    dialogFooter.appendChild(dialogFooterCancelBt);
    dialog.appendChild(dialogFooter);

    document.getElementsByTagName("body")[0].appendChild(dialog);

    var control = document.createElement("div");
    control.innerText = "下载笔记图片";
    control.setAttribute('style', 'position:fixed; top:60px; left:24px; padding:6px 12px; background-color:#409EFF;color:#ffffff;z-index:99999999;border-radius: 12px;cursor: pointer;');
    // 初始化变量
    // 初始化变量
    var posX = 0, posY = 0, posInitX = 0, posInitY = 0;
    var isActive = false;

    // 拖动开始事件
    control.onmousedown = function(e) {
        e.preventDefault(); // 阻止默认事件
        e.stopPropagation(); // 阻止事件冒泡


        //console.log("指针点下", isActive);
        // 获取鼠标点击的初始位置
        posInitX = e.clientX;
        posInitY = e.clientY;

        // 添加事件监听器以处理拖动和释放
        document.onmousemove = dragMouseMove;
        document.onmouseup = dragMouseUp;
    };

    // 拖动事件
    function dragMouseMove(e) {
        //console.log("控件拖动", isActive);
        isActive = true; // 激活拖动状态
        if (isActive) {
            e.preventDefault(); // 阻止默认事件
            // 计算新位置
            posX = posInitX - e.clientX;
            posY = posInitY - e.clientY;

            // 设置div新位置
            control.style.top = (control.offsetTop - posY) + "px";
            control.style.left = (control.offsetLeft - posX) + "px";

            // 更新初始位置
            posInitX = e.clientX;
            posInitY = e.clientY;
        }
    }

    // 停止拖动事件
    function dragMouseUp() {
        //console.log("停止拖动", isActive)
        if (isActive) {
            isActive = false; // 停止拖动状态
            document.onmousemove = null; // 移除mousemove事件监听器
            document.onmouseup = null; // 移除mouseup事件监听器
        } else {
            isActive = false;
            // 处理点击事件
            showImgsBox();
            document.onmousemove = null; // 移除mousemove事件监听器
            document.onmouseup = null; // 移除mouseup事件监听器
        }
    }



    function showImgsBox(){
        if (isActive) {
            return;
        }
        let pageData = getPageData();
        if (!pageData) {
            alert("请先点击一篇笔记呀！");
            return;
        }
        let noteData = JSON.parse(JSON.stringify(pageData.note));
        let currentNoteId = noteData.currentNoteId._value;
        //console.log("currentNoteId", currentNoteId);
        if (!currentNoteId) {
            alert("请先点击一篇笔记呀！");
            return;
        }
        dialog.showModal();
        let noteDetail = noteData.noteDetailMap[currentNoteId];
        let note = noteDetail.note;
        log.debug('note details', note);
        let noteType = note.type;

        let title = note.title;
        let imageList = note.imageList;
        let imageSize = imageList.length;
        let video = note.video;
        log.debug('video', video);


        dialogTitle.innerText = "(" + imageSize + "p)" + title;

        dialogMain.innerHTML = '';
        selectedImg = [];
        if (noteType === 'video') {
            let url = null;
            if (video.media.stream['h264'] && video.media.stream['h264'].length > 0) {
                url = video.media.stream['h264'][0].masterUrl;
            } else if (video.media.stream['h265'] && video.media.stream['h265'].length > 0) {
                url = video.media.stream['h265'][0].masterUrl;
            }

            let imgItemBox = document.createElement("div");
            imgItemBox.setAttribute('style', "width:180px;height:fit-content;margin-right: 12px;margin-bottom: 12px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);border: 1px solid #f0f0f0;position: relative;display: block;");
            let imgEl = document.createElement("video");
            imgEl.setAttribute('style', "width:100%;height:auto;display: block;");
            imgEl.setAttribute("src", url);
            imgEl.controls = true;
            imgItemBox.appendChild(imgEl);
            dialogMain.appendChild(imgItemBox);

            let imgData = {
                url: url,
                type: 'video',
                imgEl: imgEl,
                name: "小红书-"+title
            }
            selectedImg.push(imgData);
        } else {

            for (let i = 0; i < imageList.length; i++) {
                let item = imageList[i];
                let url = item.urlDefault;
                let imgItemBox = document.createElement("div");
                imgItemBox.setAttribute('style', "width:180px;height:fit-content;margin-right: 12px;margin-bottom: 12px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);border: 1px solid #f0f0f0;position: relative;display: block;");
                let imgEl = document.createElement("img");
                imgEl.setAttribute('style', "width:100%;height:auto;display: block;");
                imgEl.setAttribute("src", url);
                imgItemBox.appendChild(imgEl);
                dialogMain.appendChild(imgItemBox);

                let imgData = {
                    url: url,
                    imgEl: imgEl,
                    name: "小红书-"+title+"["+(i+1)+"]"
                }
                selectedImg.push(imgData);
            }
        }

        

    }

    function downloadAllImg(){
        let pageData = getPageData();
        if (!pageData) {
            alert("请先点击一篇笔记呀！");
            return;
        }
        let noteData = JSON.parse(JSON.stringify(pageData.note));
        let currentNoteId = noteData.currentNoteId._value;
        //console.log("currentNoteId", currentNoteId);
        if (!currentNoteId) {
            alert("请先点击一篇笔记呀！");
            return;
        }
        let noteDetail = noteData.noteDetailMap[currentNoteId];
        let note = noteDetail.note;
        let title = note.title;
        let imageList = note.imageList;
        let imageSize = imageList.length;
        let video = note.video;
        let noteType = note.type;

        if (noteType === 'video') {
            let url = null;
            if (video.media.stream['h264'] && video.media.stream['h264'].length > 0) {
                url = video.media.stream['h264'][0].masterUrl;
            } else if (video.media.stream['h265'] && video.media.stream['h265'].length > 0) {
                url = video.media.stream['h265'][0].masterUrl;
            }

            let name = "小红书-"+title;
            let fileName = name + '.mp4';
            let rootWindow = getPageDatadiv.onclick();
            // 创建 a 标签
            const a = rootWindow.document.createElement('a');
            // 设置下载文件的 URL
            //a.href = imgUrl; // 替换为你的文件 URL
            a.href = url;
            a.target = '_blank';
            // 设置下载文件的名称
            a.download = fileName; // 替换为你的文件名称

            // 将 a 标签添加到文档中
            rootWindow.document.body.appendChild(a);

            // 触发点击事件
            a.click();

            // 移除 a 标签
            rootWindow.document.body.removeChild(a);

            return;
        }

        for (let i = 0; i < imageList.length; i++) {
            let item = imageList[i];
            let url = item.urlDefault;
            let name = "小红书-"+title+"["+(i+1)+"]";

            downloadImg(url, name);
        }
    }


    //document.getElementsByTagName("body")[0].appendChild(control);



    function downloadImg(imgUrl, name){
        return new Promise((resolve, reject)=>{
            fetch(imgUrl).then(async res=>{
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                //let type = res.headers.get("Content-Type");
                let blob = await res.blob();
                let type = blob.type;
                log.debug("blob type", type);
                if (type === "image/webp") {
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(function(transBlob) {
                            triggerDownload(transBlob, name + '.jpg');
                        }, 'image/jpeg');
                        URL.revokeObjectURL(url);
                    };
                    img.src = url;
                } else if (type === "image/png") {
                    triggerDownload(blob, name + '.png');
                } else if (type === "image/jpg" || type === "image/jpeg") {
                    triggerDownload(blob, name + '.jpg');
                } else if (type === "image/gif") {
                    triggerDownload(blob, name + '.gif');
                } else {
                    triggerDownload(blob, name + '.jpg');
                }
                resolve();
            }).catch(e=>{
                console.error("下载错误", e);
                reject(e);
            });
        });
    }


    function triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'downloaded';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }





    // 创建一个观察者对象，用来观察DOM的变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') { // 检测是否有新的子节点被添加
                mutation.addedNodes.forEach(function(node) {
                    let id = node.id;
                    let className = String(node.className);
                    if (className && String(className).indexOf("img-container") >= 0 || String(className).indexOf("note-detail-mask")) {
                        let noteContainer = document.getElementById("noteContainer");
                        addDownloadBt(noteContainer);
                    }
                });
            }
        });
    });
    // 配置观察者对象，指定要观察的节点和观察选项
    var config = { attributes: false, childList: true, subtree: true };
    // 选择需要观察变动的节点
    var targetNode = document.getElementsByTagName("body")[0];
    // 开始观察
    observer.observe(targetNode, config);


    var noteContainer = document.getElementById("noteContainer");
    var noteData = getPageData();
    addDownloadBt(noteContainer);
    function addDownloadBt (noteContainer) {
        if (!noteContainer) {
            return;
        }
        let noteData = getPageData();
        log.debug("debug noteData", noteData);
        if (noteContainer.querySelector("#mysqDlBtBox")) {
            return;
        }
        let dlBtBox = document.createElement("div");
        dlBtBox.setAttribute('style', 'position:absolute; top:0px; left:0px;opacity:0.6;z-index:99999; ');
        dlBtBox.setAttribute("id", "mysqDlBtBox");
        let dlBt = document.createElement("div");
        dlBt.setAttribute("id", "mysqDlBt");
        dlBt.innerText = "这里下载";
        dlBt.setAttribute('style', 'position:relative; padding:6px 12px; background-color:#409EFF;color:#ffffff;z-index:99999999;border-radius: 24px 0px 12px 0;cursor: pointer;');
        let dropdownMenu = document.createElement("div");
        dropdownMenu.setAttribute('style', "position:relative;background-color:#ffffff;color:#000000;z-index:99999999;margin-top:12px;border-radius: 4px;display:none;");
        let xzqbBt = document.createElement("div");
        xzqbBt.innerText = "下载全部";
        xzqbBt.setAttribute('style', "padding:6px;cursor: pointer;");
        xzqbBt.onclick = function(){
            downloadAllImg();
        }
        dropdownMenu.appendChild(xzqbBt);
        let ylxzBt = document.createElement("div");
        ylxzBt.innerText = "预览下载";
        ylxzBt.setAttribute('style', "padding:6px;cursor: pointer;");
        ylxzBt.onclick = function(){
            showImgsBox();
        }
        dropdownMenu.appendChild(ylxzBt);

        dlBtBox.appendChild(dlBt);
        dlBtBox.appendChild(dropdownMenu);

        noteContainer.appendChild(dlBtBox);
        // 为元素添加mouseover事件监听器
        dlBtBox.addEventListener('mouseover', function(event) {
            dlBtBox.style.opacity = '1.0';
            dropdownMenu.style.display = "block";
        });

        // 为元素添加mouseout事件监听器
        dlBtBox.addEventListener('mouseout', function(event) {
            dlBtBox.style.opacity = '0.6';
            dropdownMenu.style.display = "none";
        });
    }












    // Your code here...
})();