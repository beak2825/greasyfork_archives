// ==UserScript==
// @name               MSE Dump Tools
// @name:zh-CN         MSE Dump Tools
// @name:zh-TW         MSE Dump Tools
// @name:ja            MSE Dump Tools
// @namespace          CloudMoeMediaSourceExtensionsAPIDataDumper
// @version            1.6.8
// @description        Media Source Extensions API Data Dump Tool
// @description:zh-CN  Media Source Extensions API 数据 Dump 工具
// @description:zh-TW  Media Source Extensions API 資料 Dump 工具
// @description:ja     Media Source Extensions API データ ダンプ ツール
// @author             TGSAN
// @include            /.*/
// @run-at             document-start
// @noframes
// @grant              GM_unregisterMenuCommand
// @grant              GM_registerMenuCommand
// @grant              unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420325/MSE%20Dump%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/420325/MSE%20Dump%20Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    Object.defineProperty(unsafeWindow.MediaSource, 'canConstructInDedicatedWorker', {
        value: false
    });

    const DefualtI18N = "zh";
    const I18NDict = {
        "en": {
            "视频": "Video",
            "音频": "Audio",
            "视频 - 最快播放速度": "Video - Fastest playback speed",
            "视频 - 恢复播放速度": "Video - Resume playback speed",
            "音频 - 最快播放速度": "Audio - Fastest playback speed",
            "音频 - 恢复播放速度": "Audio - Resume playback speed",
            "尝试直接下载页面中的视频": "Attempt to directly download the video on the page",
            "尝试直接下载页面中的音频": "Attempt to directly download the audio on the page",
            "结束 Dump": "End Dump",
            "没有找到可以下载的项目。": "No downloadable items found.",
            "没有找到可以直接下载的项目，但是找到了": "No directly downloadable items found, but",
            "个使用 MSE 的项目，需要在想要下载时点击 “结束 Dump” 按钮来停止存储。": "items using MSE were found. Click the \"End Dump\" button when you want to download to stop storing data.",
            "轨道：": "Track:",
            "已结束保存。": "has finished saving.",
            "下载数据：": "Download data:",
        },
        "ja": {
            "视频": "動画",
            "音频": "音声",
            "视频 - 最快播放速度": "動画 - 最速再生速度",
            "视频 - 恢复播放速度": "動画 - 再生速度を元に戻す",
            "音频 - 最快播放速度": "音声 - 最速再生速度",
            "音频 - 恢复播放速度": "音声 - 再生速度を元に戻す",
            "尝试直接下载页面中的视频": "ページ内の動画を直接ダウンロードを試みる",
            "尝试直接下载页面中的音频": "ページ内の音声を直接ダウンロードを試みる",
            "结束 Dump": "ダンプを終了",
            "没有找到可以下载的项目。": "ダウンロード可能な項目が見つかりませんでした。",
            "没有找到可以直接下载的项目，但是找到了": "直接ダウンロード可能な項目は見つかりませんでしたが、",
            "个使用 MSE 的项目，需要在想要下载时点击 “结束 Dump” 按钮来停止存储。": "個のMSEを使用している項目が見つかりました。ダウンロードしたい時に「ダンプ終了」ボタンをクリックして、保存を停止する必要があります。",
            "轨道：": "トラック：",
            "已结束保存。": "保存が完了しました。",
            "下载数据：": "ダウンロードデータ：",
        }
    };

    function GetI18NString(key) {
        let lang = navigator.language || navigator.userLanguage;
        lang = lang.substr(0, 2);
        if (lang !== DefualtI18N) {
            if (I18NDict[lang] === undefined) {
                lang = "en";
            }
            if (I18NDict[lang] && I18NDict[lang][key]) {
                return I18NDict[lang][key];
            }
        }
        return key;
    }

    GM_registerMenuCommand(GetI18NString("视频 - 最快播放速度"), function () { document.getElementsByTagName("video")[0].playbackRate = 16 });
    GM_registerMenuCommand(GetI18NString("视频 - 恢复播放速度"), function () { document.getElementsByTagName("video")[0].playbackRate = 1 });
    GM_registerMenuCommand(GetI18NString("音频 - 最快播放速度"), function () { document.getElementsByTagName("audio")[0].playbackRate = 16 });
    GM_registerMenuCommand(GetI18NString("音频 - 恢复播放速度"), function () { document.getElementsByTagName("audio")[0].playbackRate = 1 });
    GM_registerMenuCommand(GetI18NString("尝试直接下载页面中的视频"), function () { DirectDownloadPlayingVideo("video") });
    GM_registerMenuCommand(GetI18NString("尝试直接下载页面中的音频"), function () { DirectDownloadPlayingVideo("audio") });
    GM_registerMenuCommand(GetI18NString("结束 Dump"), EndAllDumpTasks);

    var dumpEndTasks = [];

    function dateFormat(dataObj, fmt) {
        var o = {
            "M+": dataObj.getMonth() + 1,                   // 月份
            "d+": dataObj.getDate(),                        // 日
            "h+": dataObj.getHours(),                       // 小时
            "m+": dataObj.getMinutes(),                     // 分
            "s+": dataObj.getSeconds(),                     // 秒
            "q+": Math.floor((dataObj.getMonth() + 3) / 3), // 季度
            "S": dataObj.getMilliseconds()                  // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (dataObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    async function DirectDownloadPlayingVideo(tag) {
        let elements = document.getElementsByTagName(tag);
        let downloadCount = 0;
        let mseCount = 0;
        for (let i = 0; i < elements.length; i++) {
            let videoLink = document.getElementsByTagName("video")[i].currentSrc;
            if (videoLink == "") {
                continue;
            }
            if (videoLink.startsWith("blob:")) {
                mseCount++;
                continue;
            }
            let a = document.createElement('a');
            a.download = "direct_" + tag;
            var res = await fetch(videoLink);
            var videoBlob = await res.blob();
            var url = window.URL.createObjectURL(videoBlob);
            a.href = url;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            downloadCount++;
        }
        if (downloadCount == 0) {
            if (mseCount == 0) {
                alert(GetI18NString("没有找到可以下载的项目。"));
            } else {
                alert(GetI18NString("没有找到可以直接下载的项目，但是找到了") + " " + mseCount + " " + GetI18NString("个使用 MSE 的项目，需要在想要下载时点击 “结束 Dump” 按钮来停止存储。"));
            }
        }
    }

    function EndAllDumpTasks() {
        while (dumpEndTasks.length > 0) {
            let endTask = dumpEndTasks.shift();
            endTask();
        }
    }

    unsafeWindow.SavedDataList = [];

    unsafeWindow.DownloadData = function (dataKey, fileName) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([unsafeWindow.SavedDataList[dataKey]]));
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }

    function DownloadDataCmd(key, ext, type, date) {
        if (ext == "mp4" && type == "audio") {
            ext = "m4a";
        }
        DownloadData(key, "dumped_" + type + "_" + dateFormat(date, "yyyyMMddhhmmss") + "." + ext);
    }

    function Uint8ArrayConcat(a, b) {
        var c = new Uint8Array(a.length + b.length);
        c.set(a);
        c.set(b, a.length);
        return c;
    }

    function BytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

    var _addSourceBuffer = unsafeWindow.MediaSource.prototype.addSourceBuffer;
    unsafeWindow.MediaSource.prototype.addSourceBuffer = function (mime) {
        console.log("MediaSource addSourceBuffer Type: ", mime);
        mime = mime.trim();
        const regex = /^.+\/(.+);\s*codecs=\"{0,1}(.+?)\"{0,1}$/g;
        let mimeMatches = regex.exec(mime);
        let format = "bin";
        let codecs = "";
        let basicCodecs = "";
        if (mimeMatches != null && mimeMatches.length == 3) {
            format = mimeMatches[1];
            codecs = mimeMatches[2];
            codecs = codecs.replace("\"", "");
            let basicCodecsArray = codecs.split(",");
            for (let i = 0; i < basicCodecsArray.length; i++) {
                let basicCodec = basicCodecsArray[i];
                let indexOfBasicCodec = basicCodec.indexOf(".");
                if (indexOfBasicCodec > 0) {
                    basicCodec = basicCodec.substring(0, indexOfBasicCodec);
                }
                if (i == 0) {
                    basicCodecs = basicCodec;
                } else {
                    basicCodecs = basicCodecs + "," + basicCodec;
                }
            }
        }
        var sourceBuffer = _addSourceBuffer.call(this, mime);
        var _append = sourceBuffer.appendBuffer;
        var endToSave = false;
        var sourceBufferData = new Uint8Array();
        var isVideo = (mime.startsWith("audio") ? false : true);
        var type = (isVideo ? "video" : "audio");
        var key = type + "_" + window.performance.now().toString();
        var startDate = new Date();
        dumpEndTasks.push(() => {
            endToSave = true;
            console.warn(GetI18NString("轨道：") + " " + mime + " " + GetI18NString("已结束保存。"));
            unsafeWindow.SavedDataList[key] = sourceBufferData;
            let downloadCaption = `${GetI18NString("下载数据：")} ${(isVideo ? GetI18NString("视频") : GetI18NString("音频"))} ${basicCodecs != "" ? (basicCodecs) : ""} (${BytesToSize(sourceBufferData.length)}, at ${dateFormat(startDate, "hh:mm:ss")})`;
            GM_registerMenuCommand(downloadCaption, () => { DownloadDataCmd(key, format, type, startDate); });
        });
        sourceBuffer.appendBuffer = function (buffer) {
            if (!endToSave) {
                sourceBufferData = Uint8ArrayConcat(sourceBufferData, new Uint8Array(buffer));
            }
            _append.call(this, buffer);
        }
        return sourceBuffer;
    }

})();
