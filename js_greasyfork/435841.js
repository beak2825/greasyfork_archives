// ==UserScript==
// @name         网易云课堂视频下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  支持网易云课堂所有类型视频的下载，付费视频需先购买才能下载（要配合下载器）。
// @author       CQ
// @icon         https://raw.githubusercontent.com/cq128/Image/main/aikkd-7fhj2-001.ico
// @match        https://study.163.com/course/courseLearn*
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435841/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435841/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function(){
// type: 1: MP4视频
// type: 2: 未加密视频
// type: 3: 加密视频

let videoDetail = {}

var downloadConsole = document.createElement('div');
downloadConsole.id = "downloadConsole";
downloadConsole.style = "width: 70%;height: 40px;background: #ABADB080;position: absolute;right: 0;bottom: 0;z-index: 999999;display: flex;align-items: center;padding: 5px 0px;box-sizing: border-box;font-family: Arial, Helvetica, sans-serif;font-weight: bold;color: #2c2c2c;border-top-left-radius: 10px;text-align: center;pointer-events: none;font-size: 16px;overflow: hidden;";
var nameBox = document.createElement('div');
nameBox.id = 'name';
nameBox.style = "border-right: 1px solid;padding: 0px 5px;width: 30%;";
nameBox.innerText = "--";
downloadConsole.appendChild(nameBox);
var typeBox = document.createElement('div');
typeBox.id = 'type';
typeBox.style = "padding: 0px 5px;border-right: 1px solid;width: 15%;";
typeBox.innerText = "--";
downloadConsole.appendChild(typeBox);
var downloadBox = document.createElement('div');
downloadBox.id = 'download';
downloadBox.style = "padding: 0px 5px;border-right: 1px solid;width: 15%;";
downloadConsole.appendChild(downloadBox);
var downloadLink = document.createElement('a');
downloadLink.id = 'downloadLink';
downloadLink.style = "text-decoration: underline;pointer-events: none;cursor: pointer;";
downloadLink.innerText = "--";
downloadBox.appendChild(downloadLink);
var notesBox = document.createElement('div');
notesBox.style = "font-weight: normal;font-size: 14px;padding: 0px 5px;width: 40%;";
notesBox.innerHTML = "*需配合<a target='_blank' href='https://wwt.lanzouo.com/iksGgxc0epe' style='pointer-events: all;text-decoration: underline;font-weight: bold;'>下载器</a>下载，详情见GreasyFork主页";
downloadConsole.appendChild(notesBox);
var videoContent = document.getElementById('course-learn-box');
videoContent.append(downloadConsole);

window.onhashchange = _resetWindow;

ah.proxy({
    onResponse: (response, handler) => {
        if (response.config.url.match('^https://vod.study.163.com/eds/api/v1/vod/hls/key[?]id(\d*?)(.*?)token=(.*?)$')) {
            videoDetail.key = _arrayBufferToBase64(response.response);
            videoDetail.type = 3;
            videoDetail.count = document.getElementsByClassName("j-lessonnum")[0].innerText;
            document.getElementById('downloadLink').download = videoDetail.name + ".json";
            var data = JSON.stringify(videoDetail, undefined, 4);
            var blob = new Blob([data], { type: "text/json" });
            document.getElementById('downloadLink').href = URL.createObjectURL(blob);
            document.getElementById('name').innerText = videoDetail.name;
            document.getElementById('type').innerText = "加密视频";
            document.getElementById('downloadLink').innerText = "下载json文件";
            document.getElementById('downloadLink').style.pointerEvents = "all";
            //TODO: 加密视频处理
            console.log(videoDetail);
        } else if (response.config.url.match('^https://jdvodluwytr3t.stu.126.net/nos/ept/hls/.*?\.m3u8[?|#]ak=(.*?)token=(.*?)key(.*?)token(.*?)t=(.*?)$')) {
            videoDetail.url = response.config.url.split('&t=')[0];
        } else if (response.config.url.match('^/dwr/call/plaincall/LessonLearnBean.getVideoLearnInfo.dwr')) {
            let lessonName = response.response.match('name:\"(.*?)\"')[1];
            lessonName = eval("'" + lessonName + "'");
            videoDetail.name = lessonName;
        } else if (response.config.url.match('^https://jdvodluwytr3t.stu.126.net/nos/hls/.*?\.m3u8[?|#]ak=(.*?)$')) {
            videoDetail.url = response.config.url;
            videoDetail.type = 2;
            videoDetail.count = document.getElementsByClassName("j-lessonnum")[0].innerText;
            document.getElementById('downloadLink').download = videoDetail.name + ".json";
            var data = JSON.stringify(videoDetail, undefined, 4);
            var blob = new Blob([data], { type: "text/json" });
            document.getElementById('downloadLink').href = URL.createObjectURL(blob);
            document.getElementById('name').innerText = videoDetail.name;
            document.getElementById('type').innerText = "未加密视频";
            document.getElementById('downloadLink').innerText = "下载json文件";
            document.getElementById('downloadLink').style.pointerEvents = "all";
            //TODO: 未加密视频处理
            console.log(videoDetail);
        } else if (response.config.url.match('//vod.study.163.com/eds/api/v1/vod/video[?|#]videoId=.*?signature=.*?clientType=\\d$')) {
            videoUrl = response.response.match('"videoUrl":"(.*?)"')[1];
            if (videoUrl.match('^https://jdvodluwytr3t.stu.126.net/nos/mp4/.*?.mp4[?|#]ak=.*?$')) {
                videoDetail.url = videoUrl;
                videoDetail.type = 1;
                videoDetail.count = document.getElementsByClassName("j-lessonnum")[0].innerText;
                document.getElementById('downloadLink').download = videoDetail.name + ".json";
                var data = JSON.stringify(videoDetail, undefined, 4);
                var blob = new Blob([data], { type: "text/json" });
                document.getElementById('downloadLink').href = URL.createObjectURL(blob);
                document.getElementById('name').innerText = videoDetail.name;
                document.getElementById('type').innerText = "MP4视频";
                document.getElementById('downloadLink').innerText = "下载json文件";
                document.getElementById('downloadLink').style.pointerEvents = "all";
                //TODO: MP4视频处理
                console.log(videoDetail);
            }
        }
        handler.next(response);
    }
})

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function _resetWindow(event) {
    videoDetail = {};
    document.getElementById('name').innerText = "--";
    document.getElementById('type').innerText = "--";
    document.getElementById('downloadLink').innerText = "--";
    document.getElementById('downloadLink').style.pointerEvents = "none";
}
})();