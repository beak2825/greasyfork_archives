// ==UserScript==
// @name         B站刷播放量
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  遍历视频列表并打开符合特定时间条件的视频链接
// @author       线性代数
// @match        https://space.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/495348/B%E7%AB%99%E5%88%B7%E6%92%AD%E6%94%BE%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/495348/B%E7%AB%99%E5%88%B7%E6%92%AD%E6%94%BE%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var fisrtUse = GM_getValue("fisrtUse", true);
    if (fisrtUse) {
        var mzsm = prompt("脚本\n首次使用，请阅读并同意以下免责条款。\n\n \
1. 此脚本仅用于学习研究，您必须在下载后24小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。\n \
2. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。\n \
3. 本人对此脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。\n \
4. 任何以任何方式查看此脚本的人或直接或间接使用此脚本的使用者都应仔细阅读此条款。\n \
5. 本人保留随时更改或补充此条款的权利，一旦您使用或复制了此脚本，即视为您已接受此免责条款。\n\n \
若您同意以上内容，请输入“我已阅读并同意以上内容” 然后开始使用。", "");
        if (mzsm == "同意") {
            GM_setValue("fisrtUse", false);
        }
        else {
            alert("免责条款未同意，脚本停止运行。\n若不想使用，请自行禁用脚本，以免每个页面都弹出该提示。");
            return;
        }
    }

    const videoDom = document.createElement('video');
    const hiddenCanvas = document.createElement('canvas');

    videoDom.setAttribute('style', 'display:none');
    videoDom.setAttribute('muted', '');
    videoDom.muted = true;
    videoDom.setAttribute('autoplay', '');
    videoDom.autoplay = true;
    videoDom.setAttribute('playsinline', '');
    hiddenCanvas.setAttribute('style', 'display:none');
    hiddenCanvas.setAttribute('width', '1');
    hiddenCanvas.setAttribute('height', '1');
    hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
    videoDom.srcObject = hiddenCanvas?.captureStream();
    let videoIndex = 0;
    let videos = [];

    function openAndCloseLink(link) {
        let openedWindow = window.open(link, "_blank");
        setTimeout(function() {
            openedWindow.close();
            setTimeout(openNextVideo, 1 * 1 * 1000);//观看时间间隔
        }, 3 * 1000);//观看时长
    }

    function findAllVideos() {
        let tempVideos = document.querySelectorAll('.cube-list .small-item');
        tempVideos.forEach(function(video) {
            let timeTag = video.querySelector('.time');
            if (timeTag) {
                let timeText = timeTag.textContent.trim();
                console.log(timeText);
                if (timeText.includes('前')|timeText.includes('天')) {
                    videos.push(video.querySelector('a').href);
                } else {
                    let timeParsed = new Date(timeText.replace('月', '-').replace('日', ''));
                    console.log(timeParsed.getFullYear());
                    if ((timeParsed.getYear()==101)&&((timeParsed.getMonth() > 4)|(timeParsed.getMonth() == 4 && timeParsed.getDate() >= 8))) {
                        videos.push(video.querySelector('a').href);
                    }
                }
            }
        });
    }

    function openNextVideo() {
        if (videoIndex < videos.length) {
            openAndCloseLink(videos[videoIndex]);
            videoIndex++;
        } else {
            setTimeout(function() {
            videoIndex = 0;
            openNextVideo();},5*60*1000)
        }
    }

    const button = document.createElement('button');
    button.textContent = '开始';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '0';
    button.style.transform = 'translateY(-50%)';
    button.style.zIndex = '10000';
    button.style.backgroundColor = 'green';
    button.style.fontSize = '15px';
    button.style.padding = '8px 15px';
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        if (button.textContent === '开始') {
            button.textContent = '停止';
            document.querySelector("#navigator > div > div.n-inner.clearfix > div.n-tab-links > a.n-btn.n-video.n-audio.n-article.n-album").click();
            setTimeout(function() {
                findAllVideos();
                openNextVideo();
            }, 2000);
        } else {
            button.textContent = '开始';
            videoIndex = 0;
            videos = [];
        }
    });

})();