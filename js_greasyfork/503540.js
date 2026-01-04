// ==UserScript==
// @name         为Alist生成M3U8播放列表文件
// @namespace    createM3U8forAlist.whatGUI
// @version      2024-12-23
// @description  为Alist中的视频文件生成并上传或下载一个M3U8播放列表
// @author       whatGUI
// @match        http://*/*
// @match        https://*/*
// @icon         https://alist.nn.ci/favicon.ico
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/503540/%E4%B8%BAAlist%E7%94%9F%E6%88%90M3U8%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/503540/%E4%B8%BAAlist%E7%94%9F%E6%88%90M3U8%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function addCSS() {
        const style = document.createElement("style");
        style.textContent = `
            .m3u8-toolbar {
              position: fixed;
              right: 65px;
              bottom: 20px;
            }
    
            .m3u8-toolbar-icon {
              width: 2rem;
              height: 2rem;
              color: #ff8718;
              padding: 4px;
              border-radius: 0.5rem;
              cursor: pointer;
              margin-top: 0.25rem;
            }
            .m3u8-toolbar-icon:hover {
              color: #ffffff;
              background-color: #ff8718;
            }
    
            .m3u8-dialog {
              position: fixed;
              z-index: 9999;
              opacity: 0;
              animation: fadeIn 0.3s forwards;
            }
            .m3u8-dialog-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.65);
            }
    
            .m3u8-dialog-content {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: white;
              padding: 20px;
              border-radius: 0.5rem;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              max-width: 90%;
              width: 24rem;
              text-align: center;
            }
    
            .m3u8-dialog-content h2 {
              margin-bottom: 1rem;
              font-size: 1.5em;
              color: #11181c;
            }
    
            .m3u8-dialog-content button {
              background-color: #ffe5cc;
              color: #ff8718;
              border: none;
              padding: 10px 20px;
              margin: 10px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1em;
            }
    
            .m3u8-dialog-content button:hover {
              background-color: #ffd1a3;
            }
    
            .m3u8-dialog-content button#closeDialog {
              background-color: #eceef0;
              color: #11181c;
            }
    
            .m3u8-dialog-content button#closeDialog:hover {
              background-color: #e6e8eb;
            }
    
            @keyframes fadeIn {
              to {
                opacity: 1;
              }
            }
    
            @keyframes fadeOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
            }
    
            .fade-out {
                animation: fadeOut 0.3s forwards;
            }
        `;
        document.head.appendChild(style);
    }

    function addButton() {
        const buttonDiv = document.createElement("div");
        buttonDiv.className = "m3u8-toolbar";
        buttonDiv.innerHTML = `<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="m3u8-toolbar-icon" height="1em" width="1em" style="overflow: visible;"><path fill="currentColor" d="M7 14a2 2 0 100-4 2 2 0 000 4zM14 12a2 2 0 11-4 0 2 2 0 014 0zM17 14a2 2 0 100-4 2 2 0 000 4z"></path><path fill="currentColor" fill-rule="evenodd" d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-2 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" clip-rule="evenodd"></path></svg>`;
        document.body.appendChild(buttonDiv);
        buttonDiv.addEventListener("click", addDialog);

        const showBtn = localStorage.getItem("more-open") === "true";
        buttonDiv.style.display = showBtn ? "block" : "none";

        waitForElement(".left-toolbar-box", (element) => {
            element.addEventListener("click", (e) => {
                const svgElement = e.target.closest("svg");
                if (svgElement) {
                    if (svgElement.getAttribute("tips") === "more") {
                        buttonDiv.style.display = "none";
                    } else if (
                        svgElement.classList.contains("toolbar-toggle")
                    ) {
                        buttonDiv.style.display = "block";
                    }
                }
            });
        });
    }

    function waitForElement(
        selector,
        callback,
        waitTime = 250,
        maxAttempts = 10
    ) {
        let attempts = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                console.log("Element is now available.");
                clearInterval(interval);
                callback(element);
            } else if (attempts >= maxAttempts) {
                console.log("Element not found after maximum attempts.");
                clearInterval(interval);
            }
            attempts++;
        }, waitTime);
    }

    const DIALOG_HTML = `
        <div class="m3u8-dialog-overlay"></div>
        <div class="m3u8-dialog-content">
            <h2>✨生成M3U8播放列表✨</h2>
            <div>
                <h3>仅当前文件夹内容</h3>
                <button id="uploadM3U8Current">上传m3u8</button>
                <button id="downloadM3U8Current">下载m3u8</button>
            </div>
            <div>
                <h3>当前文件夹及其所有子文件夹内容</h3>
                <button id="uploadM3U8All">上传m3u8</button>
                <button id="downloadM3U8All">下载m3u8</button>
            </div>
            <button id="closeDialog">关闭</button>
        </div>
    `;

    function addDialog() {
        const dialogDiv = document.createElement("div");
        dialogDiv.className = "m3u8-dialog";
        dialogDiv.innerHTML = DIALOG_HTML;

        document.body.appendChild(dialogDiv);

        function removeDialog() {
            dialogDiv.classList.add("fade-out");
            dialogDiv.addEventListener(
                "animationend",
                () => dialogDiv.remove(),
                {
                    once: true,
                }
            );
        }

        dialogDiv.addEventListener("click", (event) => {
            if (
                event.target.classList.contains("m3u8-dialog-overlay") ||
                event.target.id === "closeDialog"
            ) {
                removeDialog();
            } else if (event.target.id === "uploadM3U8Current") {
                event.target.innerText = "执行中...";
                uploadM3U8(false).then(removeDialog);
            } else if (event.target.id === "downloadM3U8Current") {
                event.target.innerText = "执行中...";
                downloadM3U8(false).then(removeDialog);
            } else if (event.target.id === "uploadM3U8All") {
                event.target.innerText = "执行中...";
                uploadM3U8(true).then(removeDialog);
            } else if (event.target.id === "downloadM3U8All") {
                event.target.innerText = "执行中...";
                downloadM3U8(true).then(removeDialog);
            }
        });
    }

    async function uploadM3U8(includeSubfolders) {
        try {
            let fileList = await getFileList(includeSubfolders);
            let m3u8Blob = generateM3U8(fileList);
            await sendM3U8ToAlist(m3u8Blob.blob);
            clickRefreshBtn();
        } catch (error) {
            alert(error.message);
        }
    }

    async function downloadM3U8(includeSubfolders) {
        try {
            let files = await getFileList(includeSubfolders);
            let m3u8Blob = generateM3U8(files);
            // 创建一个隐藏的 <a> 标签
            const link = document.createElement("a");
            link.href = m3u8Blob.href;
            link.download = "playlist.m3u8";
            link.style.display = "none";
            document.body.appendChild(link);
            // 触发点击事件来下载文件
            link.click();
            // 清除元素
            document.body.removeChild(link);
        } catch (error) {
            alert(error.message);
        }
    }

    async function getFileList(includeSubfolders) {
        const folderPath = decodeURIComponent(window.location.pathname);
        const result = await fetchFilesInfo(folderPath);

        let fileList = [];
        let foldersToProcess = [];

        result.data?.content.forEach((file) => {
            if (!file.is_dir) {
                fileList.push({
                    name: file.name,
                    url: `${window.location.origin}/d${folderPath}/${file.name}?sign=${file.sign}`,
                });
            } else if (includeSubfolders) {
                foldersToProcess.push(folderPath + "/" + file.name);
            }
        });

        while (foldersToProcess.length > 0) {
            const currentFolderPath = foldersToProcess.shift();
            const subfolderResult = await fetchFilesInfo(currentFolderPath);

            subfolderResult.data?.content.forEach((file) => {
                if (!file.is_dir) {
                    fileList.push({
                        name: file.name,
                        url: `${window.location.origin}/d${currentFolderPath}/${file.name}?sign=${file.sign}`,
                    });
                } else {
                    foldersToProcess.push(currentFolderPath + "/" + file.name);
                }
            });
        }
        return fileList;
    }

    async function fetchFilesInfo(decodedPath) {
        const alistListAPI = "/api/fs/list";
        const alistToken = localStorage.getItem("token");

        if (!alistToken) {
            throw new Error("未找到Token，请先登录Alist后再试");
        }

        const headers = new Headers({
            Authorization: alistToken,
            "Content-Type": "application/json",
        });

        const body = JSON.stringify({
            path: decodedPath,
            password: "",
            page: 1,
            per_page: 0,
            refresh: false,
        });

        const requestOptions = {
            method: "POST",
            headers,
            body,
            redirect: "follow",
        };
        const response = await fetch(alistListAPI, requestOptions);
        return await response.json();
    }

    function checkIfMediaFile(filename) {
        // 定义常见的影音文件扩展名
        const mediaExtensions = [
            ".mp4",
            ".mkv",
            ".mov",
            ".avi",
            ".flv",
            ".wmv",
            ".webm",
        ];
        // 获取文件扩展名
        const extension = filename.slice(
            ((filename.lastIndexOf(".") - 1) >>> 0) + 2
        );
        // 检查扩展名是否在常见的影音类型列表中
        return mediaExtensions.includes("." + extension.toLowerCase());
    }

    function generateM3U8(fileList) {
        if (fileList.length === 0) {
            throw new Error("m3u8生成失败：当前页面没有文件");
        }
        let m3u8Content = "#EXTM3U\n";
        let videoCount = 0;
        fileList.forEach((file) => {
            if (checkIfMediaFile(file.name)) {
                videoCount++;
                m3u8Content += `#EXTINF:-1,${file.name}\n${file.url}\n`;
            }
        });

        if (videoCount === 0) {
            throw new Error("m3u8生成失败：当前页面没有音视频文件");
        }
        // 创建一个新的 Blob 对象，将 M3U8 内容包装起来
        const blob = new Blob([m3u8Content], { type: "application/x-mpegURL" });
        // 创建一个下载链接
        const href = URL.createObjectURL(blob);
        return { blob, href };
    }

    async function sendM3U8ToAlist(blob) {
        const alistUploadAPI = "/api/fs/put";
        const alistToken = localStorage.getItem("token");
        const currentURL = decodeURIComponent(window.location.pathname);
        const path = encodeURIComponent(currentURL + "/playlist.m3u8");
        // 设置请求头
        const headers = new Headers({
            Authorization: alistToken,
            "File-Path": path, // 注意路径需要 URL 编码
            "Content-Type": "application/x-mpegURL", // M3U8 文件的 Content-Type
            "Content-Length": blob.size.toString(),
            As_Task: "false", // 可选，是否作为任务
        });
        // 创建请求体
        const body = blob;
        const response = await fetch(alistUploadAPI, {
            method: "PUT",
            headers,
            body,
        });
        if (!response.ok) {
            throw new Error(`上传失败: ${response.statusText}`);
        }
    }

    function clickRefreshBtn() {
        let toggleBtn = document.querySelector("svg.toolbar-toggle");
        if (toggleBtn) {
            toggleBtn.$$click();
            let refreshBtn = document.querySelector('svg[tips="refresh"]');
            refreshBtn.$$click();
            let moreBtn = document.querySelector('svg[tips="more"]');
            moreBtn.$$click();
        } else {
            let refreshBtn = document.querySelector('svg[tips="refresh"]');
            refreshBtn.$$click();
        }
    }

    addCSS();
    addButton();
})();
