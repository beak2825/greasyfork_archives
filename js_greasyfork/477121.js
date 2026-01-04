// ==UserScript==
// @name         抖音归档
// @namespace    douyin_archive
// @version      1.1
// @description  easy way to archive tiktok or douyin's video
// @author       邪不压正
// @license      AGPL License
// @run-at       document-start
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/477121/%E6%8A%96%E9%9F%B3%E5%BD%92%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/477121/%E6%8A%96%E9%9F%B3%E5%BD%92%E6%A1%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //put your code here ?
    const realSend = XMLHttpRequest.prototype.send;
    logme(" replaced")
    XMLHttpRequest.prototype.send = function () {

        const xhr = this;
        //注册监听是慢的，直接替换是快的
        this.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                // 请求已完成且状态码为200
                const url = xhr.responseURL;
                if (url.includes('aweme/v1/web/aweme/post/')) {
                    const response = JSON.parse(xhr.responseText)
                    const awemeList = response.aweme_list

                    awemeList.forEach(item => {
                        if (item.media_type === 4) {
                            mergedVideoList.push(item);
                        } else if (item.media_type === 2) {
                            mergedPicsList.push(item);
                            // item.images.forEach((image, index) => {
                            //     const url = image.url_list[0];
                            //     mergedPicListAlone.push(url)
                            // });
                        }
                    })
                    mergedList = mergedList.concat(awemeList)
                    hasMore = response.has_more
                    logme("-------- catch!--------" + awemeList.length + awemeList[0].desc)
                    updateTotalCount()
                    setTimeout(() => {
                        updateVideoBannerList()
                    }, 200)

                    // audioUrl = awemeList[0].music.play_url.uri
                }
            }
        }
        realSend.apply(this, arguments);
    };

    logme("---------------------------archive---------------------------")

    let mergedVideoList = []
    let mergedList = []
    let mergedPicsList = []
    let mergedPicListAlone = []
    let hasMore = 1

    //去水印下载
    if (window.location.host !== "www.douyin.com") {
        return;
    }

    window.addEventListener('load', function () {
        logme("Window onLOAD")
        if (!window.location.href.match(/https:\/\/www\.douyin\.com\/user\/.*?/))
            return
        logme("into page")

        async function downloader() {
            try {

                logme("into await allDownBtn")
                //延迟加载等到第一次视频加载完成
                let videoTop = await awaitQuery(".sDAMysaM")
                videoTop.style.height = '88px'
                //附加下载按钮
                let downText = document.createElement('div')
                downText.innerText = '已加载';
                downText.style.display = 'inline-block';
                downText.style.whiteSpace = 'nowrap';
                downText.style.textAlign = 'center'
                downText.style.fontSize = '13px'
                downText.style.color = 'white'
                downText.id = "downText"
                videoTop.append(downText)

                let picsDownBtn = document.createElement('button')
                picsDownBtn.innerText = '图文'
                picsDownBtn.classList.add('B10aL8VQ')
                picsDownBtn.classList.add('s6mStVxD')
                picsDownBtn.classList.add('vMQD6aai')
                picsDownBtn.classList.add('vk7WaOg_')
                picsDownBtn.classList.add('a2I1sBCL')
                picsDownBtn.classList.add('tAofAbwG')
                picsDownBtn.style.marginLeft = '10px'
                videoTop.append(picsDownBtn)
                let videoDownBtn = document.createElement('button')
                videoDownBtn.innerText = '视频'
                videoDownBtn.classList.add('B10aL8VQ')
                videoDownBtn.classList.add('s6mStVxD')
                videoDownBtn.classList.add('vMQD6aai')
                videoDownBtn.classList.add('vk7WaOg_')
                videoDownBtn.classList.add('a2I1sBCL')
                videoDownBtn.classList.add('tAofAbwG')
                videoDownBtn.style.marginLeft = '10px'
                videoTop.append(videoDownBtn)


                let allDownBtn = document.createElement('button')
                allDownBtn.innerText = '全部'
                allDownBtn.classList.add('B10aL8VQ')
                allDownBtn.classList.add('s6mStVxD')
                allDownBtn.classList.add('vMQD6aai')
                allDownBtn.classList.add('vk7WaOg_')
                allDownBtn.classList.add('a2I1sBCL')
                allDownBtn.classList.add('tAofAbwG')
                allDownBtn.style.marginLeft = '10px'
                videoTop.append(allDownBtn)

                updateTotalCount()


                picsDownBtn.addEventListener("click", async (e) => {
                    for (const pics of mergedPicsList) {
                        await downloadPics(pics);
                        const awemeId = pics.aweme_id;
                        localStorage.setItem('downloaded_' + awemeId, true);
                    }
                });

                videoDownBtn.addEventListener("click",  async (e) => {
                    for (const video of mergedVideoList) {
                        const name = generateVideoFilename(video); // 生成视频的文件名
                        await downloadVideo(convertHttpToHttps(getVideoUrl(video)), name); // 调用下载函数下载视频
                        // 给每个视频设置下载标记
                        const awemeId = video.aweme_id;
                        localStorage.setItem('downloaded_' + awemeId, true);
                    }
                });

                allDownBtn.addEventListener("click", (e) => {
                    alert("懒得写了 分别下吧 ")
                });

            } catch (e) {
            }
        }

        downloader().then(r => {
        });
        // window.addEventListener("click", downloader);
    });

    //其他方法
    function awaitQuery(selectors, delay = 200) {
        return new Promise(resolve => {
            let totalDelay = 0;
            let elementInterval = setInterval(() => {
                if (totalDelay >= 2500) {
                    clearInterval(elementInterval);
                }
                let element = document.querySelector(selectors);
                if (element) {
                    resolve(element);
                    clearInterval(elementInterval);
                } else {
                    totalDelay += delay;
                }
            }, delay);
        })
    }

    async function downloadVideo(url, name) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Download failed for ${url}.`);
            }
            const blob = await response.blob();
            const a = document.createElement("a");
            const objectUrl = window.URL.createObjectURL(blob);
            a.download = name;
            a.href = objectUrl;
            a.click();
            window.URL.revokeObjectURL(objectUrl);
            a.remove();
        } catch (error) {
            console.error(error);
        }
    }

    async function downloadPics(imageInfo) {
        for (let i = 0; i < imageInfo.images.length; i++) {
            const image = imageInfo.images[i];
            const url = image.url_list[0];
            const numberedName = `${generatePicsFilename(imageInfo)}_${i + 1}`; // 添加编号
            await downloadImage(url, numberedName);
        }
    }

    async function downloadImage(url, name) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Download failed for ${url}.`);
            }
            const blob = await response.blob();
            const a = document.createElement("a");
            const objectUrl = window.URL.createObjectURL(blob);
            a.download = name;
            a.href = objectUrl;
            a.click();
            window.URL.revokeObjectURL(objectUrl);
            a.remove();
        } catch (error) {
            console.error(error);
        }
    }

    function convertHttpToHttps(url) {
        if (url.startsWith('http://')) {
            return 'https://' + url.substring('http://'.length);
        }
        return url;
    }

    function updateTotalCount() {
        const loadedText = document.getElementById("downText");
        if (loadedText) {
            let loadedVideoCount = mergedVideoList.length.toString()
            logme(" loadedVideoCount  " + loadedVideoCount)
            if (hasMore === 1) {
                loadedText.textContent = `已加载 图文：${mergedPicsList.length}个 视频${loadedVideoCount}/${mergedVideoList[0].author.aweme_count}个 还有视频未加载`;
            } else if (loadedVideoCount < mergedVideoList[0].author.aweme_count) {
                loadedText.textContent = `已加载 图文：${mergedPicsList.length}个 视频${loadedVideoCount}/${mergedVideoList[0].author.aweme_count}个 误差大是加载时序紊乱，请刷新 / 误差小是有视频被隐藏`;
                const refresh = document.createElement('button');
                refresh.innerText = "刷新"
                refresh.style.marginLeft = '8px'
                refresh.classList = "B10aL8VQ s6mStVxD vMQD6aai vk7WaOg_ a2I1sBCL tAofAbwG"
                refresh.addEventListener("click", () => {
                    location.reload()
                })
                loadedText.append(refresh)
            } else {
                loadedText.textContent = `已加载 图文：${mergedPicsList.length}个 视频${loadedVideoCount}/${mergedVideoList[0].author.aweme_count}个 全部加载完成`;
            }
        }
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000); // 将秒转换为毫秒
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        return `${year}-${month}-${day}-${hours}`;
    }

    function updateVideoBannerList() {
        let list = document.querySelector('.UFuuTZ1P')
        let ul = list.querySelector("ul");
        let liList = ul.querySelectorAll("li");

        liList.forEach(li => {

            // 检查是否已经存在下载按钮
            const existingDownloadButton = li.querySelector('.download-button');
            if (existingDownloadButton) return

            const awemeId = li.childNodes[0].children[0].getAttribute('href').split('/').pop();
            let matchingData = mergedVideoList.find(data => data.aweme_id === awemeId) || mergedPicsList.find(data => data.aweme_id === awemeId);

            if (matchingData) {
                // 添加自定义属性 data-aweme-id 到 <li> 元素
                li.setAttribute('data-aweme-id', matchingData.aweme_id);

                // 在匹配的 <li> 元素中添加下载按钮
                const buttonContainer = document.createElement('div');
                const downloadButton = document.createElement('button');
                // downloadButton.classList = "B10aL8VQ s6mStVxD vMQD6aai vk7WaOg_ a2I1sBCL tAofAbwG"
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.top = '85%';
                buttonContainer.style.right = '0';
                downloadButton.style.fontSize = '10px'
                downloadButton.style.color = 'white'
                downloadButton.style.background = 'grey'
                downloadButton.style.padding = '4px 8px'
                downloadButton.style.borderRadius = '4px'


                const isDownloaded = localStorage.getItem('downloaded_' + awemeId);
                if (isDownloaded) {
                    downloadButton.innerText = "下载 ✔"
                } else {
                    downloadButton.innerText = "下载"
                }
                downloadButton.classList.add('download-button'); // 添加适当的类名或 ID
                downloadButton.addEventListener("click", (e) => {

                    if (matchingData.media_type === 4) {
                        let videoUrl = getVideoUrl(matchingData)
                        if (videoUrl) {
                            downloadVideo(convertHttpToHttps(videoUrl), generateVideoFilename(matchingData)).then()
                            localStorage.setItem('downloaded_' + awemeId, true);
                            downloadButton.innerText = "下载 ✔"
                        } else {
                            alert("未找到下载地址 " + matchingData.desc)
                        }
                    } else if (matchingData.media_type === 2) {
                        downloadPics(matchingData).then(r => {
                        })
                        localStorage.setItem('downloaded_' + awemeId, true);
                        downloadButton.innerText = "下载 ✔"
                    }
                })
                buttonContainer.appendChild(downloadButton);
                li.appendChild(buttonContainer);
            }
        });
    }

    function getVideoUrl(matchingData) {
        let videoUrl = null;

        if (matchingData.video.play_addr_h264 && matchingData.video.play_addr_h264.url_list.length > 0) {
            videoUrl = matchingData.video.play_addr_h264.url_list[0];
        } else if (matchingData.video.play_addr && matchingData.video.play_addr.url_list.length > 0) {
            videoUrl = matchingData.video.play_addr.url_list[0];
        } else if (matchingData.video.play_addr_265 && matchingData.video.play_addr_265.url_list.length > 0) {
            videoUrl = matchingData.video.play_addr_265.url_list[0];
        }

        return videoUrl;
    }

    function generateVideoFilename(videoInfo) {
        const {author, create_time, desc, author_user_id} = videoInfo;
        const formattedTimestamp = formatTimestamp(create_time);
        return `${author.nickname}_${formattedTimestamp}_video_${desc}_${author_user_id}.mp4`;
    }

    function generatePicsFilename(picsInfo) {
        const {author, create_time, desc, author_user_id} = picsInfo;
        const formattedTimestamp = formatTimestamp(create_time);
        return `${author.nickname}_${formattedTimestamp}_pics_${desc}_${author_user_id}`;
    }

    function logme(string) {
        console.log("|||" + string)
    }

})();