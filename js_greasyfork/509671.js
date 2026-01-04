// ==UserScript==
// @name         SpankBang Video Download Helper
// @namespace    http://tampermonkey.net/
// @version      2025-3-26
// @description  get videos of spankbang.com
// @author       PangPang
// @match        https://spankbang.com/*/video/*
// @match        https://spankbang.com/*/playlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spankbang.com
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509671/SpankBang%20Video%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/509671/SpankBang%20Video%20Download%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function replaceUrl(url,qt){
        return url.replace(/\d{3,4}p|4k/, qt);
    }
    function sanitizeFileName(fileName) {
        // 定义非法字符的正则表达式
        const illegalChars = /[\/\\:*?"<>|]/g;
        // 替换非法字符为空字符串
        return fileName.replace(illegalChars, '');
    }

    let isOpenDownloadWindow = false;
    // 等待网页完成加载
    window.addEventListener('load', function() {


        // 1.get video quality
        const qtArray = $("div#quality-menu > button").map(function() {
           return $(this).text();
        }).get().filter(str=>str.includes("p"));


        // 2.get video src
        const videoSrc = $("video#main_video_player_html5_api").attr("src");
        // 3.update best video quality url
        const bestQualityUrl = replaceUrl(videoSrc,qtArray[0]);

        console.log(qtArray)
        console.log(qtArray)
        console.log(videoSrc+"   "+bestQualityUrl)

        // 4.get video titie
        const videoTitle = $("h1.main_content_title").text();
        const fileName = sanitizeFileName(videoTitle+".mp4");

        // console.log(bestQualityUrl)
        let css = `
        #download_video{
            width:160px;
            top:50px;
            right:50px;
            z-index:999 !import;
            background:red;
            border-radius:5px;
            cursor:pointer;
            color:#fff
        }
        `
        GM_addStyle(css)
        let downloadVideoButton = document.createElement('div');
        downloadVideoButton.id = "download_video";
        downloadVideoButton.innerHTML = "Download Video";
        const contentTitle = this.document.getElementsByClassName("main_content_title")[0]
        contentTitle.appendChild(downloadVideoButton)



        // 5.download video
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <script src="https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js"></script>
            <script>
                import streamSaver from 'streamsaver'
                const streamSaver = require('streamsaver')
                const streamSaver = window.streamSaver
            </script>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${videoTitle}</title>
            <style>
            html,
            body {
                margin: 0;
                padding: 0;
                background-color: black;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
            }
            video {
                max-width: 100%;
                max-height: 100%;
            }
            </style>
        </head>
        <body>
            <video id="video" autoplay controls>
            <source
                src="${bestQualityUrl}"
                type="video/mp4"
            />
            您的浏览器不支持 HTML5 视频标签。
            </video>

            <script>
            // 当视频加载元数据时，调整窗口大小以适应视频
            const videoElement = document.getElementById("video");
            videoElement.addEventListener("loadedmetadata", () => {
                // 获取视频的宽度和高度
                const videoWidth = videoElement.videoWidth;
                const videoHeight = videoElement.videoHeight;

                // 调整浏览器窗口大小以适应视频
                window.resizeTo(videoWidth, videoHeight);
            });
            fileDownloadHandle("${bestQualityUrl}","get","${fileName}")


            function fileDownloadHandle(url,method,name,size){
                fetch(url,{
                    method:method,
                }).then(res=>{
                    const fileStream=streamSaver.createWriteStream(name,{
                        size:res.headers.get("content-length")
                    })
                    const readableStream=res.body;
                    if(window.WritableStream&&readableStream.pipeTo){
                        return readableStream.pipeTo(fileStream).then(()=> {
                            //下载完毕自动关闭
                            window.close();
                        })
                    }
                    window.writer=fileStream.getWriter();
                    const reader=res.body.getReader();
                    const pump=()=>reader.read().then(res=>res.done? window.writer.close():window.writer.write(res.value).then(pump))
                    pump();
                })
            }

            </script>
        </body>
        </html>
        `
        const blob = new Blob([htmlContent], { type: 'text/html' });

        // 生成一个 URL，指向 Blob 内容
        const blobUrl = URL.createObjectURL(blob);
        // 使用 GM_openInTab 在新标签页中打开自定义的 HTML 页面
        $("#download_video").click(function(){
            if(isOpenDownloadWindow) return;
            GM_openInTab(blobUrl, { active: false, insert: true });
            isOpenDownloadWindow = true;
        })

    }, false);



})();