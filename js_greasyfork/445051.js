// ==UserScript==
// @name         短视频去水印（支持抖音网页版）
// @name:en      Remove watermarks from short videos (supports TikTok web version)
// @name:zh-CN   短视频去水印（支持抖音网页版）
// @name:zh-TW   短影片去浮水印（支援抖音網頁版）
// @version      1.3.5
// @license      MIT
// @description  一款短视频去水印下载工具，支持抖音网页版视频无水印下载
// @description:en  A short video watermark removal and download tool that supports downloading videos from the Douyin (TikTok) web version without watermarks
// @description:zh-CN   一款短视频去水印下载工具，支持抖音网页版视频无水印下载
// @description:zh-TW   一款短影片去浮水印下載工具，支援抖音網頁版影片無浮水印下載
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABD0lEQVR42mP4TyJgoFTDrz//V537Vbj+R+G6HyvP/fr15x8+DQ/f/TXq/hq7+NuKs7+AKG7xdyAXKIhdw5+//017vi478xNZevnZXyY9X//8xaZh69XffrO+QdjXX/wBIgjbb/a3rVd/oWsA2usz69uEA1DjZx/7BUQQNlAQKAV3GEjD3Td/TLq/rLvw6/Xnv5gaXn3+u/biL6ACoDKohqL1P3Zcg0oDA6Vq87f+/T/79/+o2vwdHkY7rv0GKoNqiF/y/dKzP3BXrjr/S7jyCxCtPo9wOlABUBlUw9oLv2IXf/+F0AISASLkyAEqgIhAPd1/4Kdh11fz3m/Y0FfDri9AF2KJuH84EFXTEvU1AACibsLlJw3ttAAAAABJRU5ErkJggg==
// @author       LightDownload
// @match      *://*.douyin.com/*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require      https://lib.baomitu.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://lib.baomitu.com/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant       unsafeWindow
// @namespace https://greasyfork.org/users/894875
// @downloadURL https://update.greasyfork.org/scripts/445051/%E7%9F%AD%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%EF%BC%88%E6%94%AF%E6%8C%81%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/445051/%E7%9F%AD%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%EF%BC%88%E6%94%AF%E6%8C%81%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    let showTipErrorSwal = function (err) {
        showSwal(err, { icon: 'error' });
    }

    let showTipSwal = function (info) {
        showSwal(info, { icon: 'info' });
    }

    const divTips = document.createElement('div');
    divTips.id = "divTips";

    let showSwal = function (content, option) {
        divTips.innerHTML = content;
        option.content = divTips;
        if (!option.hasOwnProperty('button')) {
            option.button = '我知道了'
        }
        swal(option);
    }

    let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Origin": "https://www.douyin.com",
        "Referer": "https://www.douyin.com/",
        "sec-ch-ua": 'Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"'
    }

    let isDouyinPage = function () {
        let url = location.href;
        return url.indexOf(".douyin.com/") !== -1;
    };

    let getVideoUrl = function () {
        let RENDER_DATA = document.getElementById("RENDER_DATA");
        if (RENDER_DATA == null) {
            return "";
        }
        let RENDER_DATA_STR = RENDER_DATA.textContent;
        let renderData = decodeURIComponent(RENDER_DATA_STR);
        let jsonObject = JSON.parse(renderData);
        let data = null;
        for (let key in jsonObject) {
            if ("_location" === key || "app" === key || "11" === key) {
                continue;
            }
            data = key;
        }
        let dataJo = jsonObject[data];
        let detail = dataJo["videoDetail"];
        let video = detail["video"];
        let playAddr = video["playAddr"];
        let video1 = playAddr[0];
        let src = video1["src"];
        let videoUrl = "https:" + src;
        videoUrl = videoUrl.substring(0, videoUrl.length - 1);
        return videoUrl;
    }

    var isDownVideo = false;

    let successCall = function (videoUrl, videoName) {
        if (videoUrl == null) {
            videoUrl = getVideoUrl();
        }
        if (!isDownVideo) {
            GM_xmlhttpRequest({
                method: "GET",
                url: videoUrl,
                headers: headers,
                responseType: "blob", // 获取二进制流
                onload: function(response) {
                    if (response.status === 200) {
                        // 将数据流转换为本地临时链接
                        var blobUrl = URL.createObjectURL(response.response);
                        blogDownload(blobUrl, videoName);
                    } else {
                        console.error("请求被拒绝，状态码：", response.status);
                    }
                }
            });
            showTipSwal("已提交下载任务，请检查下载记录是否有新任务，如无请重试或提交反馈。推荐使用chrome插件，<a href=\"https://www.mudi.pics/zh-CN\" style=\"color: #ff0000;\" target=\"_blank\" >访问网站</a>下载hls或m3u8视频");
            isDownVideo = true;
        }
    }

    function blogDownload(blobUrl, videoName) {
        GM_download({
            url: blobUrl,
            name: videoName + '.mp4',
            onload: function () {
                URL.revokeObjectURL(blobUrl); // 清理内存
                console.log("Blob 方式下载成功");
            },
            onerror: (err) => {
                console.log(err); // 在控制台打印完整的错误对象
                if (err.error === 'not_enabled') {
                    showTipErrorSwal('下载失败：Tampermonkey 的下载功能未在浏览器中启用。');
                } else if (err.error === 'not_whitelisted') {
                    showTipErrorSwal('下载失败：文件扩展名不在允许列表中。');
                } else if (err.error === 'not_permitted') {
                    showTipErrorSwal('下载失败：被浏览器或用户禁止。');
                } else if (err.error === 'not_supported') {
                    showTipErrorSwal('下载失败：浏览器不支持此功能。');
                } else if (err.error === 'not_succeeded') {
                    showTipErrorSwal('下载失败：网络错误或文件未找到 (404/403)。');
                } else {
                    showTipErrorSwal('未知错误: ' + err.error);
                }
            }
        });
    }

    let initButtonEvent = function (btn) {
        if (isDouyinPage()) {
            let isClickDownVideo = true;
            let videoType = Number.parseInt(btn.getAttribute("type"));
            if (videoType === 1) {
                let videoIndex = btn.getAttribute("videoIndex");
                let videoSlide = document.getElementById("slidelist");
                let videoClassArr = videoSlide.firstChild.firstChild;
                //推荐~朋友
                let videoArr = videoClassArr.getElementsByClassName("page-recommend-container");
                if (videoArr.length === 0) {
                    //首页
                    videoArr = videoClassArr.querySelectorAll('.dySwiperSlide[data-e2e="feed-item"]');
                }
                let videoItemDiv = videoArr[videoIndex];

                let account = videoItemDiv.getElementsByClassName("account-name")[0].textContent;
                let accountNameSpanNode = videoItemDiv.getElementsByClassName("title")[0].childNodes[0];
                let title = accountNameSpanNode.firstElementChild.textContent;
                let videoName = account + "-" + title;
                if (videoName === "") {
                    videoName = "无标题视频";
                }

                let sliderVideoDiv = videoItemDiv.getElementsByClassName("slider-video");
                let xgVideoContainerDiv = sliderVideoDiv[0].getElementsByClassName("xg-video-container");
                let videoNode = xgVideoContainerDiv[0].getElementsByTagName("video");
                let videoSrc = videoNode[0].getAttribute("src");
                if (videoSrc != null) {
                    unsafeWindow.fetch = (...arg) => {
                        if (arg[0].indexOf("blob:") !== -1) {
                            showTipErrorSwal("暂不支持该视频下载，正在加紧适配中...");
                        }else {
                            // console.log('fetch arg', ...arg);
                            if (arg[0].indexOf('douyin') > -1 && isClickDownVideo) {
                                let videoUrl = decodeURI(arg[0]);
                                GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                                if (successCall) {
                                    isClickDownVideo = false;
                                }
                            }
                        }
                    }
                } else {
                    let sourceNodes = videoNode[0].getElementsByTagName("source");
                    for (let i = 0; i < sourceNodes.length; i++) {
                        try {
                            let videoUrl = decodeURI(sourceNodes[i].getAttribute("src"));
                            GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                            if (successCall) {
                                isDownVideo = false;
                                break;
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            } else if (videoType === 2) {
                let videoClassArr = document.getElementsByClassName("playerControlHeight");
                let videoInfoArr = videoClassArr[0].getElementsByClassName("leftContainer");
                let videoNameArr = videoInfoArr[0].childNodes[2].firstElementChild.getElementsByTagName("h1");
                let title = videoNameArr[0].textContent;
                let userDiv = videoClassArr[0].childNodes[1].firstElementChild;
                let accountNameArr = userDiv.childNodes[0].childNodes[1].getElementsByTagName("a")[0].getElementsByTagName("span")[0];
                let account = accountNameArr.textContent;
                // let titleArr = userDiv.childNodes[1].getElementsByTagName("span")[0];
                // let title = titleArr.textContent;
                let videoName = account + "-" + title;
                if (videoName === "") {
                    videoName = "无标题视频";
                }
                let videoArr = videoClassArr[0].getElementsByClassName("xg-video-container");
                let videoNode = videoArr[0].getElementsByTagName("video");
                let sourceNodes = videoNode[0].getElementsByTagName("source");
                if (sourceNodes.length === 0) {
                    showTipErrorSwal("暂不支持详情页视频下载，正在加紧适配中...");
                    return;
                }
                for (let i = 0; i < sourceNodes.length; i++) {
                    try {
                        let videoUrl = decodeURI(sourceNodes[i].getAttribute("src"));
                        GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                        if (successCall) {
                            isDownVideo = false;
                            break;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            } else if (videoType === 3) {
                let videoDiv = document.getElementById("slideMode");
                let account = videoDiv.getElementsByClassName("account-name")[0].textContent;
                let accountNameSpanNode = videoDiv.getElementsByClassName("title")[0].childNodes[0];
                let title = accountNameSpanNode.firstElementChild.lastElementChild.textContent;
                let videoName = account + "-" + title;
                if (videoName === "") {
                    videoName = "无标题视频";
                }
                let xgVideoContainerDiv = videoDiv.getElementsByClassName('xg-video-container');
                let videoNode = xgVideoContainerDiv[0].getElementsByTagName("video");
                let videoSrc = videoNode[0].getAttribute("src");
                if (videoSrc != null) {
                    unsafeWindow.fetch = (...arg) => {
                        if (arg[0].indexOf("blob:") !== -1) {
                            showTipErrorSwal("暂不支持该视频下载，正在加紧适配中...");
                        }else {
                            // console.log('fetch arg', ...arg);
                            if (arg[0].indexOf('douyin') > -1 && isClickDownVideo) {
                                let videoUrl = decodeURI(arg[0]);
                                GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                                if (successCall) {
                                    isClickDownVideo = false;
                                }
                            }
                        }
                    }
                } else {
                    let sourceNodes = videoNode[0].getElementsByTagName("source");
                    for (let i = 0; i < sourceNodes.length; i++) {
                        try {
                            let videoUrl = decodeURI(sourceNodes[i].getAttribute("src"));
                            GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                            if (successCall) {
                                isDownVideo = false;
                                break;
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
        }
    };

    let headRequest = function (url, videoName, call) {
        let userAgent = navigator.userAgent;
        let method = "HEAD";
        if (userAgent.indexOf("Firefox") !== -1) {
            method = "GET";
        }
        return {
            method: method,
            timeout: 3600000, // 3600秒超时
            headers: headers,
            url: url,
            onload: function (res) {
                if (res.status === 200 || res.status === 401) {
                    call(url, videoName);
                } else if (res.status === 302) {
                    let Location = res.headers.getAttribute("Location");
                    call(Location, videoName);
                } else if (res.status === 403) {
                    showTipErrorSwal("暂不支持该视频，可刷新页面重试或<a href=\"https://www.mudi.pics/zh-CN\" style=\"color: #ff0000;\" target=\"_blank\" >访问网站</a>下载浏览器插件来支持该视频下载");
                } else {
                    console.error(res);
                }
            },
            onerror: (res) => {
                console.error(res);
            }
        }
    };

    let start = function () {
        if (!isDouyinPage()) {
            // console.log('非抖音页面，1秒后将重新查找！');
            return;
        }

        if (document.body.innerHTML === "") {
            return;
        }
        let isIndexVideo = getIndexVideo();
        if (!isIndexVideo) {
            if (!getIndexDetailVideo()) {
                getDetailVideo();
            }
        }
    }

    /**
     * 首页/推荐/我的
     * @returns
     */
    function getIndexVideo() {
        let videoSlide = document.getElementById("slidelist");
        if (videoSlide == null) {
            // console.log('未查找到视频列表div！');
            return false;
        }
        let videoClassArr = videoSlide.firstChild.firstChild;
        if (videoClassArr.length === 0) {
            // console.log('未查找到视频div！');
            return false;
        }

        //推荐~朋友
        let videoArr = videoClassArr.getElementsByClassName("page-recommend-container");
        if (videoArr.length === 0) {
            //首页
            videoArr = videoClassArr.querySelectorAll('.dySwiperSlide[data-e2e="feed-item"]');
        }
        if (videoArr.length === 0) {
            // console.log('未查找到视频div列表');
            return false;
        }

        //偏移量
        let shiftingDiv = videoSlide.getElementsByClassName("fullscreen_capture_feedback");
        let height = shiftingDiv[0].style.height;
        let shifting = 0;
        if (height !== "100%") {
            shifting = height.match(/calc\(\d+%\s*-\s*(\d+)px\)/i)[1];
        }
        //每个视频的高度
        let firstVideoDiv = videoArr[0];
        let firstVideoHeight = firstVideoDiv.style.height;
        firstVideoHeight = firstVideoHeight.replace("px", "");
        let videoTransForm = videoClassArr.style.transform || '';
        //视频下标
        var videoIndex = 0;
        let videoTransFormarr = videoTransForm.match(/translate3d\(\d+px,\s*(-+\d+)px,\s*(\d+)px\)/i);
        if (videoTransFormarr != null) {
            let videoTransFormY = videoTransFormarr[1];
            videoTransFormY = -videoTransFormY;
            videoIndex = videoTransFormY / (parseInt(firstVideoHeight) + parseInt(shifting));
        }

        //检查是否图文视频或直播视频
        for (; ;) {
            let videoTemp = videoArr[videoIndex];
            if (videoTemp.getElementsByClassName('xgplayer-progress-outer picture').length === 1 || videoTemp.getElementsByClassName("positionBox").length === 0) {
                if (videoIndex + 1 >= videoArr.length) {
                    break;
                }
                videoIndex++;
            } else {
                break;
            }
        }
        let btnBox = videoArr[videoIndex].getElementsByClassName('positionBox');
        if (btnBox.length === 0) {
            // console.log('可能为直播页面或登录弹出页面');
            return false;
        }
        let btnShare = undefined;
        if (btnBox[0].childNodes.length > 1) {
            btnShare = btnBox[0].childNodes[1];
        } else {
            btnShare = btnBox[0].childNodes[0];
        }
        if (btnShare === undefined) {
            // console.log('可能还未初始化分享按钮');
            return false;
        }

        let btnDownload = {
            class: 'btnClickDownload',
            title: '点击下载视频',
            html: function () {
                return `<img height="26" width="26" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAB10lEQVRYhe2Yv0sCYRjHnyuVoyIC/4CwH1OrKbdJDQ4hDi0NbTU0RuIPKKvBKE2loUHQ/0FRF3WsqDOoCF1UcIqWCvP0NC69hlI0Ss97LxR6P9sdPN/nw3vDPe8DMOAQUoTojy75n97HbBRyvgw1oIFvQ9v2vOGjJckdkiTlD8GCqGBBVLAgKlgQFSyIChZEBQuiggVRETRR6w+vTEDw7l7Df7sKAADwBOzErdRBtwzBd4alY9o6RsrstuW50YkRhdCyNoosB85gqlxk391Rs3ZfSM2w0PBsInAxubhev848UepZpYKUCy5tk2PKNU/UIkyuJ0EAgGzcfy5Gsshy4AylS0y55o1YNHu99OztGL4kVQvrfDL3RKlnlPJukkyFA1coxZZEyIkSBADIJPznU7o1SOaeO0oyFQ6cwRTLsDVv2KzZFdNLlOCnZOBMpVuDZO6Fmp9WyklFexRT4cAVTLNMteYNmzR2sX2QMXro7ZXTm/LdwxufL9T5fKHO3z++8au+25LBQzv6JtZKq6TUcpLsZgAADB7aMU7KNwkCiNcqdxLZ0m5LlS0ZRjd9YHTTXf8OGEwLBEDnqaOfxGwU0Ry3vi8g+01jATrwA+vACzY/sVQ75X/HB6W6vNjikAp7AAAAAElFTkSuQmCC"/>`;
            }
        }
        //如果是已有下载按钮，则不添加
        let buttonArr = btnShare.getElementsByClassName(btnDownload.class);
        if (buttonArr.length !== 0) {
            return false;
        }

        let btn = document.createElement('a');
        btn.setAttribute("type", 1);
        btn.setAttribute("class", btnDownload.class);
        btn.setAttribute("videoIndex", videoIndex);
        btn.title = btnDownload.title;
        btn.innerHTML = btnDownload.html();
        btn.addEventListener('click', function (e) {
            initButtonEvent(btn);
            e.preventDefault();
        });

        btnShare.appendChild(btn);
        return true;
    }

    /**
     * 首页/推荐/我的-详情
     * @returns
     */
    function getIndexDetailVideo() {
        let videoDiv = document.getElementById("slideMode");
        if (videoDiv == null) {
            // console.log('未查找到视频div！');
            return false;
        }
        let positionBoxDiv = videoDiv.getElementsByClassName("positionBox");
        let btnShare = positionBoxDiv[0].childNodes[1];
        if (btnShare === undefined) {
            // console.log('可能还未初始化分享按钮');
            return false;
        }

        let btnDownload = {
            class: 'btnClickDownload',
            title: '点击下载视频',
            html: function () {
                return `<img height="26" width="26" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAB10lEQVRYhe2Yv0sCYRjHnyuVoyIC/4CwH1OrKbdJDQ4hDi0NbTU0RuIPKKvBKE2loUHQ/0FRF3WsqDOoCF1UcIqWCvP0NC69hlI0Ss97LxR6P9sdPN/nw3vDPe8DMOAQUoTojy75n97HbBRyvgw1oIFvQ9v2vOGjJckdkiTlD8GCqGBBVLAgKlgQFSyIChZEBQuiggVRETRR6w+vTEDw7l7Df7sKAADwBOzErdRBtwzBd4alY9o6RsrstuW50YkRhdCyNoosB85gqlxk391Rs3ZfSM2w0PBsInAxubhev848UepZpYKUCy5tk2PKNU/UIkyuJ0EAgGzcfy5Gsshy4AylS0y55o1YNHu99OztGL4kVQvrfDL3RKlnlPJukkyFA1coxZZEyIkSBADIJPznU7o1SOaeO0oyFQ6cwRTLsDVv2KzZFdNLlOCnZOBMpVuDZO6Fmp9WyklFexRT4cAVTLNMteYNmzR2sX2QMXro7ZXTm/LdwxufL9T5fKHO3z++8au+25LBQzv6JtZKq6TUcpLsZgAADB7aMU7KNwkCiNcqdxLZ0m5LlS0ZRjd9YHTTXf8OGEwLBEDnqaOfxGwU0Ry3vi8g+01jATrwA+vACzY/sVQ75X/HB6W6vNjikAp7AAAAAElFTkSuQmCC"/>`;
            }
        }
        //如果是已有下载按钮，则不添加
        let buttonArr = btnShare.getElementsByClassName(btnDownload.class);
        if (buttonArr.length !== 0) {
            return false;
        }

        let btn = document.createElement('a');
        btn.setAttribute("type", 3);
        btn.setAttribute("class", btnDownload.class);
        btn.title = btnDownload.title;
        btn.innerHTML = btnDownload.html();
        btn.addEventListener('click', function (e) {
            initButtonEvent(btn);
            e.preventDefault();
        });

        btnShare.appendChild(btn);
        return true;
    }

    /**
     * 进入详情页详情
     * @returns
     */
    function getDetailVideo() {
        let videoClassArr = document.getElementsByClassName("playerControlHeight");
        if (videoClassArr.length === 0) {
            // console.log('未查找到视频总div！');
            return false;
        }
        let videoDiv = videoClassArr[0];

        //详情
        let videoArr = videoDiv.getElementsByClassName("xg-video-container");
        if (videoArr.length === 0) {
            // console.log('未查找到视频div');
            return false;
        }

        let btnGrid = videoDiv.getElementsByClassName('xg-right-grid');

        let btnDownload = {
            class: 'btnClickDownload',
            title: '点击下载视频',
            html: function () {
                return `<img height="22" width="22" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAB10lEQVRYhe2Yv0sCYRjHnyuVoyIC/4CwH1OrKbdJDQ4hDi0NbTU0RuIPKKvBKE2loUHQ/0FRF3WsqDOoCF1UcIqWCvP0NC69hlI0Ss97LxR6P9sdPN/nw3vDPe8DMOAQUoTojy75n97HbBRyvgw1oIFvQ9v2vOGjJckdkiTlD8GCqGBBVLAgKlgQFSyIChZEBQuiggVRETRR6w+vTEDw7l7Df7sKAADwBOzErdRBtwzBd4alY9o6RsrstuW50YkRhdCyNoosB85gqlxk391Rs3ZfSM2w0PBsInAxubhev848UepZpYKUCy5tk2PKNU/UIkyuJ0EAgGzcfy5Gsshy4AylS0y55o1YNHu99OztGL4kVQvrfDL3RKlnlPJukkyFA1coxZZEyIkSBADIJPznU7o1SOaeO0oyFQ6cwRTLsDVv2KzZFdNLlOCnZOBMpVuDZO6Fmp9WyklFexRT4cAVTLNMteYNmzR2sX2QMXro7ZXTm/LdwxufL9T5fKHO3z++8au+25LBQzv6JtZKq6TUcpLsZgAADB7aMU7KNwkCiNcqdxLZ0m5LlS0ZRjd9YHTTXf8OGEwLBEDnqaOfxGwU0Ry3vi8g+01jATrwA+vACzY/sVQ75X/HB6W6vNjikAp7AAAAAElFTkSuQmCC"/>`;
            }
        }
        //如果是已有下载按钮，则不添加
        let buttonArr = btnGrid[0].getElementsByClassName(btnDownload.class);
        if (buttonArr.length !== 0) {
            return false;
        }

        let btn = document.createElement('a');
        btn.setAttribute("type", 2);
        btn.setAttribute("class", btnDownload.class);
        btn.title = btnDownload.title;
        btn.innerHTML = btnDownload.html();
        btn.addEventListener('click', function (e) {
            initButtonEvent(btn);
            e.preventDefault();
        });

        btnGrid[0].appendChild(btn);
        return true;
    }

    setInterval(function () {
        start();
    }, 1000)
})();
