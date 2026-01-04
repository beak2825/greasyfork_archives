// ==UserScript==
// @name         抖音稿件信息信息拉取
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  获取抖音稿件的各种信息
// @author       TGSAN
// @match        https://www.douyin.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/539102/%E6%8A%96%E9%9F%B3%E7%A8%BF%E4%BB%B6%E4%BF%A1%E6%81%AF%E4%BF%A1%E6%81%AF%E6%8B%89%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539102/%E6%8A%96%E9%9F%B3%E7%A8%BF%E4%BB%B6%E4%BF%A1%E6%81%AF%E4%BF%A1%E6%81%AF%E6%8B%89%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let apiUrl = null;

    XMLHttpRequest.prototype.openOriginalDouyinDumper = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.includes("aweme/v1/web/aweme/detail")) {
            apiUrl = url;
            console.log(url);
        }
        this.openOriginalDouyinDumper(method, url, async, user, password);
    };

    async function getDetailApi(url) {
        try {
            let res = await fetch(url, {
                "headers": {},
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            if (!res.ok) {
                return null;
            }
            let data = await res.json();
            if (data.status_code !== 0) {
                return null;
            }
            let id = data.aweme_detail.aweme_id;
            let title = data.aweme_detail.caption;
            let desc = data.aweme_detail.desc;
            let createTime = data.aweme_detail.create_time;
            let durationMs = data.aweme_detail.duration;
            let videoData = data.aweme_detail.video;
            let height = videoData.height;
            let width = videoData.width;
            let isSourceHDR = videoData.is_source_HDR;
            let videoList = videoData.bit_rate;
            let audioList = videoData.bit_rate_audio;
            return {
                id: id,
                title: title,
                desc: desc,
                createTime: createTime,
                durationMs: durationMs,
                height: height,
                width: width,
                isSourceHDR: isSourceHDR,
                videoList: videoList,
                audioList: audioList,
            };
        } catch (e) {
            return null;
        }
    }

    async function getFileTime(playurl) {
        try {
            let res = await fetch(playurl, {
                "headers": {},
                "method": "HEAD",
                "mode": "cors"
            });
            if (!res.ok) {
                return null;
            }
            let fileDate = res.headers.get("last-modified");
            if (!fileDate) {
                return null;
            }
            const fileDateMs = Date.parse(fileDate);
            const fileDateUnixTs = Math.floor(fileDateMs / 1000);
            return fileDateUnixTs;
        } catch (e) {
            return null;
        }
    }

    async function getFileTimeAuto(playurlList) {
        let minFileTime = null;
        for (let i = 0; i < playurlList.length; i++) {
            let playurl = playurlList[i];
            let fileTime = await getFileTime(playurl);
            if (fileTime) {
                if (minFileTime === null || fileTime < minFileTime) {
                    minFileTime = fileTime;
                }
            }
        }
        return minFileTime;
    }

    function getVMAF(extraDataStr) {
        try {
            let extraData = JSON.parse(extraDataStr);
            if (extraData && extraData.mvmaf) {
                let vmafStr = extraData.mvmaf;
                let vmaf = JSON.parse(vmafStr);
                return vmaf;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    async function getVideoInfo(data) {
        let fps = data.FPS;
        let bitRate = data.bit_rate;
        let codec = data.is_h265 ? "HEVC" : "AVC";
        let useByteVC1 = data.is_bytevc1;
        let hdrType = data.HDR_type;
        let hdrBit = data.HDR_bit;
        let format = data.format;
        let name = data.gear_name;
        let extraData = data.video_extra;
        let vmaf = getVMAF(extraData);
        let fileSize = data.play_addr.data_size;
        let width = data.play_addr.width;
        let height = data.play_addr.height;
        let fileDate = await getFileTimeAuto(data.play_addr.url_list);
        return {
            fps: fps,
            bitRate: bitRate,
            codec: codec,
            useByteVC1: useByteVC1,
            hdrType: hdrType,
            hdrBit: hdrBit,
            format: format,
            name: name,
            extraData: extraData,
            vmaf: vmaf,
            fileSize: fileSize,
            width: width,
            height: height,
            fileDate: fileDate
        }
    }

    async function getAllVideoInfo(dataList) {
        let videoInfoList = [];
        if (!dataList) {
            return videoInfoList;
        }
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i];
            let videoInfo = await getVideoInfo(data);
            if (videoInfo) {
                videoInfoList.push(videoInfo);
            }
        }
        return videoInfoList;
    }

    async function getFullInfo(url) {
        let detail = await getDetailApi(url);
        if (!detail) {
            return null;
        }
        let videoList = detail.videoList;
        let videoInfoList = await getAllVideoInfo(videoList);
        return {
            id: detail.id,
            title: detail.title,
            desc: detail.desc,
            createTime: detail.createTime,
            durationMs: detail.durationMs,
            height: detail.height,
            width: detail.width,
            isSourceHDR: detail.isSourceHDR,
            videoInfoList: videoInfoList
        };
    }

    function printCopyButton(pipWindow, message, text) {
        let button = pipWindow.document.createElement("button");
        button.textContent = message;
        button.onclick = function () {
            // 创建一个临时的 textarea 元素
            let textarea = pipWindow.document.createElement("textarea");
            textarea.value = text; // 设置要复制的文本
            pipWindow.document.body.appendChild(textarea); // 将 textarea 添加到文档中
            textarea.select(); // 选中 textarea 中的文本
            try {
                // 执行复制操作
                pipWindow.document.execCommand("copy");
                // 提示用户已复制
                pipWindow.alert("已复制到剪贴板");
            } catch (err) {
                // 如果复制失败，提示用户
                pipWindow.alert("复制失败");
            }
            textarea.remove(); // 移除临时的 textarea 元素
        }
        pipWindow.document.body.appendChild(button);
    }

    function printLog(pipWindow, message, color) {
        let p = pipWindow.document.createElement("p");
        p.textContent = message;
        if (color) {
            p.style.color = color;
        }
        pipWindow.document.body.appendChild(p);
    }

    function printTitle(pipWindow, message) {
        let h2 = pipWindow.document.createElement("h2");
        h2.textContent = message;
        pipWindow.document.body.appendChild(h2);
    }

    /**
     * 将毫秒数格式化为 “X 小时 Y 分钟 Z 秒 W 毫秒”
     * @param {number} ms 毫秒数
     * @returns {string}
     */
    function formatMsDuration(ms) {
        const hours = Math.floor(ms / 3600000);
        ms %= 3600000;

        const minutes = Math.floor(ms / 60000);
        ms %= 60000;

        const seconds = Math.floor(ms / 1000);
        const milliseconds = ms % 1000;

        return `${hours} 小时 ${minutes} 分钟 ${seconds} 秒 ${milliseconds} 毫秒`;
    }

    /**
     * 将秒数格式化为 “X 小时 Y 分钟 Z 秒”
     * @param {number} sec 秒数
     * @returns {string}
     */
    function formatSecDuration(sec) {
        const hours = Math.floor(sec / 3600);
        sec %= 3600;

        const minutes = Math.floor(sec / 60);
        sec %= 60;

        const seconds = Math.floor(sec);

        return `${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
    }

    async function showInfo() {
        if (!window?.documentPictureInPicture?.requestWindow) {
            alert("浏览器不支持，请使用 Chrome 内核浏览器");
            return;
        }
        /**
         * @type {Window}
         */
        let pipWindow = null;
        try {
            pipWindow = await window.documentPictureInPicture.requestWindow({
                disallowReturnToOpener: true,
                preferInitialWindowPlacement: false,
            });
        } catch (e) {
            alert("需要先点击网页任意位置，允许弹出窗口");
            return;
        }
        pipWindow.document.body.innerHTML = ""; // 清空内容
        pipWindow.title = "抖音稿件信息分析"; // 设置标题
        printTitle(pipWindow, "日志");
        let url = apiUrl;
        if (!url) {
            alert("网页未加载完成，请稍后再试");
        }
        printLog(pipWindow, "正在获取稿件信息，请稍等...");
        let fullInfo = await getFullInfo(url);
        if (!fullInfo) {
            printLog("获取稿件信息失败，可能页面过期", "orangered");
            return;
        }
        printLog(pipWindow, "数据拉取完毕");
        pipWindow.document.body.innerHTML = ""; // 清空内容
        if (url.indexOf("support_h265=1") === -1) {
            printLog(pipWindow, "警告：未请求 HEVC 视频信息，结果可能不包含 HEVC 编码视频信息（更换支持 HEVC 的浏览器可能可以解决）", "orange");
        }
        if (url.indexOf("support_dash=1") === -1) {
            printLog(pipWindow, "警告：未请求 Dash 视频信息，结果可能不包含 CMAF 格式视频信息", "orange");
        }
        printCopyButton(pipWindow, "复制分析数据（JSON 格式）", JSON.stringify(fullInfo, null, 4));
        printTitle(pipWindow, "稿件信息");
        printLog(pipWindow, `稿件ID: ${fullInfo.id}`);
        printLog(pipWindow, `标题: ${fullInfo.title}`);
        printLog(pipWindow, `描述: ${fullInfo.desc}`);
        printLog(pipWindow, `投稿时间（Unix时间戳）: ${fullInfo.createTime}`);
        printLog(pipWindow, `投稿时间（本机时区）: ${new Date(fullInfo.createTime * 1000).toLocaleString()}`);
        printLog(pipWindow, `视频时长: ${formatMsDuration(fullInfo.durationMs)} (${fullInfo.durationMs} ms)`);
        printLog(pipWindow, `原片分辨率: ${fullInfo.width}x${fullInfo.height}`);
        printLog(pipWindow, `原片动态范围: ${fullInfo.isSourceHDR ? "HDR 高动态范围" : "SDR 标准动态范围"}`);
        printLog(pipWindow, `转码清晰度数量: ${fullInfo.videoInfoList.length}`);

        printTitle(pipWindow, `转码生产时间线`);
        let soltedVideoInfo = [];
        soltedVideoInfo = fullInfo.videoInfoList.sort((a, b) => {
            if (a.fileDate === null && b.fileDate === null) {
                return 0; // 都没有文件时间，保持原顺序
            } else if (a.fileDate === null) {
                return 1; // a 没有文件时间，排在后面
            } else if (b.fileDate === null) {
                return -1; // b 没有文件时间，排在后面
            } else {
                return a.fileDate - b.fileDate; // 按照文件时间升序排序
            }
        });
        for (let i = 0; i < soltedVideoInfo.length; i++) {
            let videoInfo = soltedVideoInfo[i];
            if (videoInfo.fileDate) {
                if (i !== 0) {
                    printLog(pipWindow, "▼");
                }
                let fileDiffSec = videoInfo.fileDate - fullInfo.createTime;
                if (fileDiffSec > 0) {
                    printLog(pipWindow, `${videoInfo.name}: 生产耗时 ${formatSecDuration(fileDiffSec)}`);
                } else {
                    printLog(pipWindow, `${videoInfo.name}: 生产耗时无法计算（可能使用了定时投稿导致发布时间不准确）`);
                }
            } else {
                if (i !== 0) {
                    printLog(pipWindow, "⨀");
                }
                printLog(pipWindow, `${videoInfo.name}: 无生产耗时数据`);
            }
        }

        for (let i = 0; i < fullInfo.videoInfoList.length; i++) {
            let videoInfo = fullInfo.videoInfoList[i];
            printTitle(pipWindow, `转码清晰度信息 ${i + 1}`);
            printLog(pipWindow, `清晰度名称: ${videoInfo.name}`);
            printLog(pipWindow, `分辨率: ${videoInfo.width}x${videoInfo.height}`);
            printLog(pipWindow, `帧率: ${videoInfo.fps} FPS`);
            printLog(pipWindow, `码率: ${videoInfo.bitRate} bps`);
            printLog(pipWindow, `编码格式: ${videoInfo.codec}`);
            printLog(pipWindow, `使用 ByteVC1 自研编码器: ${videoInfo.useByteVC1 ? "是" : "否"}`);
            printLog(pipWindow, `封装格式: ${videoInfo.format}`);
            printLog(pipWindow, `HDR 类型: ${videoInfo.hdrType == "" ? "无" : videoInfo.hdrType}`);
            if (videoInfo.vmaf) {
                printLog(pipWindow, `VMAF: ${JSON.stringify(videoInfo.vmaf, null, 4)}`);
            } else {
                printLog(pipWindow, `VMAF: 无 VMAF 数据`);
            }
            printLog(pipWindow, `文件大小: ${(videoInfo.fileSize / 1024 / 1024).toFixed(2)} MiB`);
            if (videoInfo.fileDate) {
                printLog(pipWindow, `文件生产日期（Unix时间戳）: ${videoInfo.fileDate}`);
                printLog(pipWindow, `文件生产日期（本机时区）: ${new Date(videoInfo.fileDate * 1000).toLocaleString()}`);
                let fileDiffSec = videoInfo.fileDate - fullInfo.createTime;
                if (fileDiffSec > 0) {
                    printLog(pipWindow, `文件生产耗时: ${formatSecDuration(fileDiffSec)} (${fileDiffSec} 秒)`);
                } else {
                    printLog(pipWindow, `文件生产耗时: 无法计算（可能使用了定时投稿导致发布时间不准确）`);
                }
            }
        }
    }

    GM_registerMenuCommand("分析视频", showInfo);
})();