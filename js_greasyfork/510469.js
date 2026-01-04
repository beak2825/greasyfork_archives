// ==UserScript==
// @name         Pornhub Video Download Helper
// @namespace    http://tampermonkey.net/
// @version      2024-09-28
// @description  get videos of pornhub.com
// @author       PangPang
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license      MIT
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/510469/Pornhub%20Video%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/510469/Pornhub%20Video%20Download%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isClickedDownloadButton = false;
    window.addEventListener('load', function() {

        const urls = getUrlInfo();
        const index = getHighQualityUrlIndex(urls);

        const videoTitle = getVideoTitle();
        const videoFileName = sanitizeFileName(videoTitle + ".mp4");

        addDownloadButtonToBody();

        addClickEventToDownloadButton(videoTitle,videoFileName,urls[index].url);
    });

    function getValueByObjStartStr(obj,str){
        const arrays = [];
      Object.keys(obj).forEach(key => {
        if (key.startsWith(str)) {
          arrays.push({
            key: key,
            value: obj[key],
          });
        }
      });
      return arrays;
    }

    function getUrlInfo(){
        const allVideoUrls = getValueByObjStartStr(unsafeWindow,"flashvars_");

        if(allVideoUrls.length === 0 || allVideoUrls[0]['value']['mediaDefinitions'].length === 0){
            return;
        }

        let remoteAddress = undefined;
        allVideoUrls[0]['value']['mediaDefinitions'].forEach(item => {
            if(item.remote){
                remoteAddress = item.videoUrl;
            }else{
                return;
            }
        });

        let urlInfo = [];
        if (remoteAddress) {
            $.ajax({
                url: remoteAddress,
                async: false,
                success: (data) => {
                    if (data && data.length) {
                        urlInfo = urlInfo.concat(data.map(item => ({
                            quality: item.quality + '.' + item.format,
                            url: item.videoUrl
                        })));
                    }
                }
            });
        }
        return urlInfo;

    }

    function getHighQualityUrlIndex(urlArray){
        let index = 0;
        for(let i = 1; i < urlArray.length; i++){
            const currentUrlQuality = parseInt(urlArray[i].quality.split(",")[0]);
            const highQualityUrl = parseInt(urlArray[index].quality.split(",")[0]);
            console.log(currentUrlQuality+'   '+highQualityUrl)
            if(currentUrlQuality > highQualityUrl){

                index = i;
            }

        }
        return index;

    }

    function getVideoTitle(){
        const title = $("span.inlineFree").text();
        return title
    }

    function sanitizeFileName(fileName) {
        // 定义非法字符的正则表达式
        const illegalChars = /[\/\\:*?"<>|]/g;
        // 替换非法字符为空字符串
        return fileName.replace(illegalChars, '');
    }

    function addDownloadButtonToBody(){
        let css = `
        #download_video{
            display: inline-block;
            align-items: center;
            display: flex;
            z-index:999;
            background:red;
            border-radius:5px;
            cursor:pointer;
            font:bold
            color:#fff
            vertical-align: middle;
        }
        #download_video span{
            display: inline-block;
            vertical-align: middle;
        }
        `
        GM_addStyle(css)
        const buttonHtml =
        `
        <div id="download_video"><span class="inlineFree title inlineFree">Download Video</span></div>
        `
        $("div.suggestToggleAlt ").after(buttonHtml);




    }

    function addClickEventToDownloadButton(title,videoName,videoUrl){
        $("div#download_video").click(function(){
            if(isClickedDownloadButton){
                return;
            }
            isClickedDownloadButton = true;

            const htmlContent = creatDownloadWindowHtml(title,videoName,videoUrl);
            const blob = new Blob([htmlContent], { type: 'text/html' });

            // 生成一个 URL，指向 Blob 内容
            const blobUrl = URL.createObjectURL(blob);
            GM_openInTab(blobUrl, { active: false, insert: true });
        });

    }

    function creatDownloadWindowHtml(title,videoName,videoUrl){

        return `
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
            <title>${title}</title>
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
                src="${videoUrl}"
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
            fileDownloadHandle("${videoUrl}","get","${videoName}")


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
    }
})();