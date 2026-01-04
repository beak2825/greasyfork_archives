// ==UserScript==
// @name         UP识别器
// @namespace    https://dddddgz.github.io
// @version      1.0.2
// @description  在视频上显示UP的信息
// @author       歌者
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498607/UP%E8%AF%86%E5%88%AB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/498607/UP%E8%AF%86%E5%88%AB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getIndex(id, list) {
        for (let i = 0; i < list.length; i += 1) {
            let each = list[i];
            if (each[0] == id) return i;
        }
        return -1;
    }
    const colors = ["#2e8b57", "#808000", "#ff8000", "#ff0000", "#808080"];
    const comments = ["良心", "中等", "较差", "十分差的", "未被记录的"];
    let text;
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://dddddgz.github.io/bilibili.json",
        onload: function(response) {
            let data = JSON.parse(response.responseText);
            let green = data[0];
            let yellow = data[1];
            let orange = data[2];
            let red = data[3];
            let id_s = document.getElementsByClassName("up-avatar")[0].getAttribute("href")
            let id = parseInt(id_s.substring(21, id_s.length));
            let title = document.getElementsByClassName("video-info-title-inner")[0].getElementsByTagName("h1")[0];
            let index, index2;
            index2 = getIndex(id, green);
            if (index2 > -1) index = 0;
            else {
                index2 = getIndex(id, yellow);
                if (index2 > -1) index = 1;
                else {
                    index2 = getIndex(id, orange);
                    if (index2 > -1) index = 2;
                    else {
                        index2 = getIndex(id, red);
                        if (index2 > -1) index = 3;
                        else {
                            index = 4;
                            index2 = -1;
                        }
                    }
                }
            }
            text = title.innerHTML + "（" + comments[index] + "UP";
            if (index < 4) {
                if (data[index][index2][1] != "") text += "，" + data[index][index2][1];
            } else text += "，你可以<a href='https://fishc.com.cn/thread-243769-1-1.html' style='color: #369;'>记录</a>";
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://dddddgz.github.io/videos.json",
                onload: function(response) {
                    let data = JSON.parse(response.responseText);
                    let bvid = window.location.href.substring(31, 43);
                    if (bvid in data) text += "，推荐该视频的理由：" + data[bvid];
                    text += "）";
                    let command = 'document.getElementsByClassName("video-info-title-inner")[0].getElementsByTagName("h1")[0].innerHTML = "<span style=\'color: ' + colors[index] + '; font-size: 20px;\'>' + text + '"';
                    console.log(command);
                    setTimeout(command, 2500);
                }
            });
        }
    });
})();