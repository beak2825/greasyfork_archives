// ==UserScript==
// @name         Bjtu VideoPlatform Downloader
// @namespace    https://greasyfork.org/zh-CN/users/605474
// @version      0.2
// @description  Download videos in batches.
// @author       Ziu
// @match        http://video.bjtu.edu.cn/video/index/cid/*
// @icon         https://fastly.jsdelivr.net/gh/ZiuChen/ZiuChen@main/avatar.jpg
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://fastly.jsdelivr.net/gh/eligrey/FileSaver.js@b5e61ec88969461ce0504658af07c2b56650ee8c/dist/FileSaver.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435212/Bjtu%20VideoPlatform%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/435212/Bjtu%20VideoPlatform%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let liList = $('.item-lists .cf-o>li').find('a');
    let aList = $('.video-header').find('a')
    let header = $(aList[aList.length-1]).html();
    let liListHref = [];
    let content = '[Bjtu VideoPlatform Downloader] '+header+'\n';
    for (let i = 0; i < liList.length; i++) {
        liListHref.push($(liList[i]).attr('href'));
    }
    alert('[Bjtu VideoPlatform Downloader]\n点击确定开始解析当前页视频链接');
    liListHref.forEach(function (value, index) {
        let xReq1 = new XMLHttpRequest();
        xReq1.open('GET', 'http://video.bjtu.edu.cn'+value);
        xReq1.addEventListener('load', onSuccess);
        xReq1.send();
        function onSuccess () {
            let videoLink = this.responseText.split("var video=['")[1].split("'];")[0];
            content = content + ('http://video.bjtu.edu.cn'+videoLink) + '\n';
            if(index==liListHref.length-1){
                alert('[Bjtu VideoPlatform Downloader]\n视频链接解析完毕 点击确定开始下载');
                let blob = new Blob([content], {
                    type: 'text/plain'
                    });
                saveAs(blob, 'videoLinks.txt');
            }
        }
    })
})();